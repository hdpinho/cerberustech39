import {
  Award,
  Bot,
  Code,
  Compass,
  Database,
  Eye,
  FileCheck,
  GraduationCap,
  Hammer,
  HeartPulse,
  Key,
  Landmark,
  Layers,
  LifeBuoy,
  Lock,
  Presentation,
  Receipt,
  Rocket,
  Scale,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Users,
  Utensils,
  Workflow,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/content/types";

const map: Record<IconName, LucideIcon> = {
  code: Code,
  database: Database,
  server: Server,
  shield: Shield,
  bot: Bot,
  compass: Compass,
  hammer: Hammer,
  lock: Lock,
  workflow: Workflow,
  "file-check": FileCheck,
  receipt: Receipt,
  key: Key,
  "life-buoy": LifeBuoy,
  store: Store,
  landmark: Landmark,
  truck: Truck,
  utensils: Utensils,
  "heart-pulse": HeartPulse,
  rocket: Rocket,
  presentation: Presentation,
  users: Users,
  "graduation-cap": GraduationCap,
  eye: Eye,
  award: Award,
  scale: Scale,
  sparkles: Sparkles,
  layers: Layers,
  fingerprint: ShieldCheck,
};

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = map[name];
  return <Cmp aria-hidden="true" strokeWidth={1.5} {...props} />;
}

/* Lucide ya no incluye logotipos de marcas: trazos lineales propios. */
export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V16M8 7.6v.01M11.5 16v-5.5M11.5 13c0-1.7 1-2.6 2.3-2.6s2.2.9 2.2 2.6V16" />
    </svg>
  );
}

export function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8L4 20Z" />
      <path d="M9.2 8.6c.2-.4.5-.5.8-.5h.4c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .5-.1.7l-.4.5c.5 1 1.3 1.8 2.3 2.3l.5-.4c.2-.2.5-.2.7-.1l1.4.6c.3.1.4.3.4.5v.4c0 .3-.1.6-.5.8-.6.4-1.4.5-2.1.2a8.5 8.5 0 0 1-4.6-4.6c-.3-.7-.2-1.5.2-2.1Z" />
    </svg>
  );
}
