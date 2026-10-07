import { WhatsappIcon } from "@/components/ui/Icon";
import { contact, whatsappUrl } from "@/content/config";

export function WhatsAppFloating({
  message = "Hola, Cerberus Tech 39. Me gustaría agendar un diagnóstico para mi proyecto.",
}: {
  message?: string;
}) {
  const wa = whatsappUrl(message);
  if (!wa) return null;

  return (
    <aside
      aria-label="Contacto rápido"
      className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6"
    >
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Escribir por WhatsApp al ${contact.whatsappFormatted || "+58 412 963 2254"} (se abre en la aplicación WhatsApp)`}
        className="bevel bevel-sm press group flex min-h-12 items-center gap-2 px-4.5 py-2.5 font-display text-[0.875rem] font-semibold tracking-wide text-white shadow-xl shadow-deep/40 transition-transform duration-150 [--bevel:12px] [--bevel-bg:#128C7E] [--bevel-border:#25D366] hover:[--bevel-bg:#25D366] focus-visible:outline-2 focus-visible:outline-cyan focus-visible:outline-offset-3 sm:px-5"
      >
        <WhatsappIcon className="h-5 w-5 shrink-0 text-white" strokeWidth={1.8} />
        <span>WhatsApp</span>
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    </aside>
  );
}
