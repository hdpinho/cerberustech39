import type { NombreImagen } from "@/lib/imagenes";

export type Locale = "es";

export type IconName =
  | "code"
  | "database"
  | "server"
  | "shield"
  | "bot"
  | "compass"
  | "hammer"
  | "lock"
  | "workflow"
  | "file-check"
  | "receipt"
  | "key"
  | "life-buoy"
  | "store"
  | "landmark"
  | "truck"
  | "utensils"
  | "heart-pulse"
  | "rocket"
  | "presentation"
  | "users"
  | "graduation-cap"
  | "eye"
  | "award"
  | "scale"
  | "sparkles"
  | "layers"
  | "fingerprint";

export interface NavLink {
  label: string;
  href: `#${string}`;
}

export interface Pillar {
  id: "construimos" | "protegemos" | "automatizamos";
  title: string;
  summary: string;
  detail: string;
  icon: IconName;
  imagen: NombreImagen;
  imagenAlt: string;
}

export interface Service {
  code: "DEV" | "DAT" | "INF" | "SEG" | "IA" | "CON";
  title: string;
  benefit: string;
  icon: IconName;
  items: string[];
  stackLabel: string;
  stack: string[];
}

export interface Package {
  id: string;
  name: string;
  audience: string;
  includes: string[];
  recommended?: boolean;
  /** Servicio que se preselecciona en el formulario de contacto. */
  service: Service["code"];
}

export interface Commitment {
  title: string;
  body: string;
  icon: IconName;
}

export interface Step {
  title: string;
  body: string;
}

export interface TitledItem {
  title: string;
  body: string;
  icon: IconName;
}

export interface Faq {
  q: string;
  a: string;
}

export interface SiteContent {
  meta: {
    title: string;
    description: string;
    ogAlt: string;
  };
  company: {
    name: string;
    shortName: string;
    tagline: string;
    city: string;
    country: string;
  };
  nav: { links: NavLink[]; cta: string; skip: string; openMenu: string; closeMenu: string };
  hero: {
    label: string;
    title: [string, string];
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    globo: {
      etiqueta: string;
      sede: { nombre: string; lat: number; lon: number };
      destinos: { nombre: string; lat: number; lon: number }[];
      leyendaSede: string;
      leyendaRemota: string;
      ayuda: string;
    };
  };
  guardians: { label: string; title: string; intro: string; pillars: Pillar[] };
  services: {
    label: string;
    title: string;
    intro: string;
    more: string;
    close: string;
    quote: string;
    list: Service[];
    ecosistema: { etiqueta: string; ayuda: string; ayudaTactil: string };
  };
  packages: {
    label: string;
    title: string;
    intro: string;
    recommended: string;
    cta: string;
    forWhom: string;
    list: Package[];
    commitmentsTitle: string;
    commitments: Commitment[];
  };
  process: { label: string; title: string; intro: string; steps: Step[] };
  trust: {
    label: string;
    title: string;
    intro: string;
    reasons: TitledItem[];
    frameworksTitle: string;
    frameworksNote: string;
    frameworks: string[];
    imagenAlt: string;
    teamTitle: string;
    leader: { name: string; role: string; body: string };
    team: { name: string; body: string; areas: string[] };
  };
  sectors: {
    label: string;
    title: string;
    intro: string;
    imagenAlt: string;
    list: { name: string; icon: IconName }[];
    trainingTitle: string;
    training: TitledItem[];
  };
  purpose: {
    label: string;
    title: string;
    mission: string;
    vision: string;
    valuesTitle: string;
    values: { name: string; body: string }[];
  };
  faq: { label: string; title: string; list: Faq[] };
  contact: {
    label: string;
    title: string;
    intro: string;
    whatsappCta: string;
    whatsappMessage: string;
    emailLabel: string;
    locationLabel: string;
    location: string;
    reach: string;
    imagenAlt: string;
    form: {
      name: string;
      company: string;
      email: string;
      whatsapp: string;
      service: string;
      servicePlaceholder: string;
      serviceOther: string;
      message: string;
      consent: string;
      consentLink: string;
      submit: string;
      sending: string;
      success: string;
      error: string;
      rateLimited: string;
      optional: string;
      unavailable: string;
      unavailableEmailOnly: string;
      errors: {
        name: string;
        email: string;
        whatsapp: string;
        service: string;
        message: string;
        consent: string;
      };
    };
  };
  footer: {
    navTitle: string;
    socialTitle: string;
    privacy: string;
    rights: string;
  };
  privacy: { title: string; updated: string; sections: { title: string; body: string[] }[] };
}
