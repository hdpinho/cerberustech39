"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { buttonClass } from "@/components/ui/primitives";
import type { SiteContent } from "@/content/types";
import { PRESELECT_EVENT, takePendingPreselect, type PreselectDetail } from "@/lib/preselect";
import { SERVICE_OPTIONS, contactSchema, type ContactValues } from "@/lib/schema";

type Status = "idle" | "sending" | "success" | "error" | "rate";

const RATE_KEY = "ct39-envios";
const RATE_MAX = 3; // envíos
const RATE_WINDOW = 10 * 60 * 1000; // en 10 minutos
const MIN_FILL_MS = 3000; // un humano tarda más de 3 s en llenar el formulario

function readSends(): number[] {
  try {
    const raw = JSON.parse(localStorage.getItem(RATE_KEY) ?? "[]") as unknown;
    return Array.isArray(raw) ? raw.filter((t): t is number => typeof t === "number" && Date.now() - t < RATE_WINDOW) : [];
  } catch {
    return [];
  }
}
function recordSend() {
  try {
    localStorage.setItem(RATE_KEY, JSON.stringify([...readSends(), Date.now()]));
  } catch {
    /* almacenamiento bloqueado: el límite queda en manos del proveedor */
  }
}

export function ContactForm({
  form: t,
  services,
  endpoint,
}: {
  form: SiteContent["contact"]["form"];
  services: SiteContent["services"]["list"];
  endpoint: string;
}) {
  const schema = useMemo(() => contactSchema(t.errors), [t.errors]);
  const mountedAt = useRef(Date.now());
  const statusRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const preview = !endpoint; // solo ocurre en desarrollo (ver Contact.tsx)

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { nombre: "", empresa: "", correo: "", whatsapp: "", mensaje: "", sitio_web: "" },
  });

  // Preselección desde Paquetes o desde el detalle de un servicio
  useEffect(() => {
    const apply = ({ service, packageName }: PreselectDetail) => {
      takePendingPreselect();
      setValue("servicio", service, { shouldValidate: true });
      if (packageName && !getValues("mensaje")) {
        setValue("mensaje", `Me interesa el paquete ${packageName}. `);
      }
    };
    const onPre = (ev: Event) => apply((ev as CustomEvent<PreselectDetail>).detail);
    const pending = takePendingPreselect(); // pulsado antes de que el formulario cargara
    if (pending) apply(pending);
    window.addEventListener(PRESELECT_EVENT, onPre);
    return () => window.removeEventListener(PRESELECT_EVENT, onPre);
  }, [setValue, getValues]);

  useEffect(() => {
    if (status !== "idle" && status !== "sending") statusRef.current?.focus();
  }, [status]);

  const onSubmit = async (values: ContactValues) => {
    // Anti-spam silencioso: honeypot lleno o envío instantáneo → fingimos éxito.
    if (values.sitio_web || Date.now() - mountedAt.current < MIN_FILL_MS) {
      setStatus("success");
      return;
    }
    if (readSends().length >= RATE_MAX) {
      setStatus("rate");
      return;
    }

    setStatus("sending");
    const { sitio_web: _hp, consentimiento: _c, ...payload } = values;
    const servicio = services.find((s) => s.code === values.servicio)?.title ?? t.serviceOther;

    try {
      if (preview) {
        await new Promise((r) => setTimeout(r, 700));
      } else {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            ...payload,
            name: values.nombre,
            email: values.correo,
            _replyto: values.correo,
            servicio,
            _subject: `Nueva solicitud web (${servicio}): ${values.nombre}`,
          }),
        });
        if (!res.ok) throw new Error(String(res.status));
      }
      recordSend();
      reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const busy = status === "sending";

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2" aria-describedby={preview ? "form-preview" : undefined}>
      {preview ? (
        <p id="form-preview" className="border border-gold/40 bg-ink/40 px-3 py-2 font-mono text-xs text-gold sm:col-span-2">
          Vista previa (desarrollo): sin formEndpoint configurado, el envío se simula.
        </p>
      ) : null}

      <Field label={t.name} error={errors.nombre?.message} reg={register("nombre")} autoComplete="name" required />
      <Field label={t.company} optional={t.optional} reg={register("empresa")} autoComplete="organization" />
      <Field label={t.email} error={errors.correo?.message} reg={register("correo")} type="email" autoComplete="email" inputMode="email" required />
      <Field
        label={t.whatsapp}
        optional={t.optional}
        error={errors.whatsapp?.message}
        reg={register("whatsapp")}
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        placeholder="+58 412 000 0000"
      />

      <SelectField label={t.service} placeholder={t.servicePlaceholder} error={errors.servicio?.message} reg={register("servicio")}>
        {SERVICE_OPTIONS.map((code) => {
          const s = services.find((x) => x.code === code);
          return (
            <option key={code} value={code}>
              {s ? `${s.code} · ${s.title}` : t.serviceOther}
            </option>
          );
        })}
      </SelectField>

      <Field label={t.message} error={errors.mensaje?.message} reg={register("mensaje")} textarea required className="sm:col-span-2" />

      {/* Honeypot: invisible para personas y lectores de pantalla */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          No llenar este campo
          <input type="text" tabIndex={-1} autoComplete="off" {...register("sitio_web")} />
        </label>
      </div>

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-white/80">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-cyan"
            aria-invalid={errors.consentimiento ? true : undefined}
            aria-describedby={errors.consentimiento ? "err-consentimiento" : undefined}
            {...register("consentimiento")}
          />
          <span>
            {t.consent}{" "}
            <a href="/privacidad/" className="text-cyan underline underline-offset-2">
              {t.consentLink}
            </a>
            .
          </span>
        </label>
        {errors.consentimiento ? <ErrorText id="err-consentimiento">{errors.consentimiento.message}</ErrorText> : null}
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" disabled={busy} className={buttonClass("primaryDark", "disabled:cursor-wait disabled:opacity-80 sm:w-auto")}>
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
          {busy ? t.sending : t.submit}
        </button>
        <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
          {status === "success" ? (
            <p className="flex items-start gap-2 text-sm text-cyan">
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {t.success}
            </p>
          ) : null}
          {status === "error" || status === "rate" ? (
            <p className="flex items-start gap-2 text-sm text-[#FFB4B4]">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {status === "rate" ? t.rateLimited : t.error}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}

/* ───────────── Campos ───────────── */

const inputCls =
  "w-full bg-white/[0.04] px-4 text-base text-white ring-1 ring-white/20 ring-inset placeholder:text-white/40 transition-[box-shadow,background-color] duration-150 hover:ring-white/35 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan focus:outline-none aria-[invalid=true]:ring-[#FFB4B4]";

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm text-[#FFB4B4]">
      <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

function Label({ htmlFor, label, optional, required }: { htmlFor: string; label: string; optional?: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-white/85">
      {label}
      {required ? (
        <span aria-hidden="true" className="ml-0.5 text-cyan">
          *
        </span>
      ) : null}
      {optional ? <span className="ml-1.5 font-normal text-white/50">({optional})</span> : null}
    </label>
  );
}

function Field({
  label,
  reg,
  error,
  optional,
  required,
  textarea,
  className = "",
  ...rest
}: {
  label: string;
  reg: UseFormRegisterReturn;
  error?: string;
  optional?: string;
  required?: boolean;
  textarea?: boolean;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "required">) {
  const id = useId();
  const errId = `${id}-err`;
  const common = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errId : undefined,
    "aria-required": required || undefined,
    ...reg,
  };
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} optional={optional} required={required} />
      {textarea ? (
        <textarea rows={5} className={`${inputCls} min-h-36 resize-y py-3`} {...common} />
      ) : (
        <input className={`${inputCls} h-12`} {...rest} {...common} />
      )}
      {error ? <ErrorText id={errId}>{error}</ErrorText> : null}
    </div>
  );
}

function SelectField({
  label,
  placeholder,
  reg,
  error,
  children,
}: {
  label: string;
  placeholder: string;
  reg: UseFormRegisterReturn;
  error?: string;
  children: React.ReactNode;
}) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className="sm:col-span-2">
      <Label htmlFor={id} label={label} required />
      <select
        id={id}
        defaultValue=""
        aria-required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={`${inputCls} h-12 appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='none'%20stroke='%23A2D9F9'%20stroke-width='1.5'%3E%3Cpath%20d='m4%206%204%204%204-4'/%3E%3C/svg%3E")] bg-[position:right_1rem_center] bg-no-repeat pr-10 [&>option]:bg-deep`}
        {...reg}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
      {error ? <ErrorText id={errId}>{error}</ErrorText> : null}
    </div>
  );
}
