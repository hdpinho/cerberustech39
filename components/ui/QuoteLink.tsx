"use client";

import { ArrowRight } from "lucide-react";
import type { Service } from "@/content/types";
import { preselectService } from "@/lib/preselect";
import { buttonClass } from "./primitives";

export function QuoteLink({
  label,
  service,
  packageName,
  highlighted = false,
}: {
  label: string;
  service: Service["code"];
  packageName: string;
  highlighted?: boolean;
}) {
  return (
    <a
      href="#contacto"
      onClick={() => preselectService(service, packageName)}
      className={buttonClass(highlighted ? "primaryDark" : "ghostDark", "w-full")}
    >
      {label}
      <span className="sr-only">: {packageName}</span>
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
