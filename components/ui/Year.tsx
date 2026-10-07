"use client";

import { useEffect, useState } from "react";

/** Año actual: el HTML estático trae el año de compilación y el cliente lo actualiza. */
export function Year({ buildYear }: { buildYear: number }) {
  const [year, setYear] = useState(buildYear);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <>{year}</>;
}
