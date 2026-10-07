import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Guardians } from "@/components/sections/Guardians";
import { Hero } from "@/components/sections/Hero";
import { Packages } from "@/components/sections/Packages";
import { Process } from "@/components/sections/Process";
import { Purpose } from "@/components/sections/Purpose";
import { Sectors } from "@/components/sections/Sectors";
import { Services } from "@/components/sections/Services";
import { Trust } from "@/components/sections/Trust";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { getContent } from "@/content";
import { buildJsonLd } from "@/lib/seo";

export default function Home() {
  const c = getContent();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(c)).replace(/</g, "\\u003c") }}
      />
      <Navbar nav={c.nav} />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <Hero hero={c.hero} pillars={c.guardians.pillars} />
        <Guardians data={c.guardians} />
        <Services data={c.services} />
        <Packages data={c.packages} />
        <Process data={c.process} />
        <Trust data={c.trust} />
        <Sectors data={c.sectors} />
        <Purpose data={c.purpose} />
        <Faq data={c.faq} />
        <Contact data={c.contact} services={c.services.list} />
      </main>
      <Footer c={c} />
      <RevealObserver />
    </>
  );
}
