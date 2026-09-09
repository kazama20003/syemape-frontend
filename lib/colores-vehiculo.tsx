// Catálogo estándar de colores vehiculares (nombres SUNARP/uso común en Perú).
// Único origen de verdad: el formulario de unidades, el chip de la lista y el
// filtro por color consumen esta lista para que los nombres siempre coincidan.
export interface ColorVehiculo {
  nombre: string;
  css: string;
}

export const COLORES_VEHICULO: ColorVehiculo[] = [
  { nombre: "BLANCO", css: "#ffffff" },
  { nombre: "NEGRO", css: "#252525" },
  { nombre: "PLATA", css: "#cbd5e1" },
  { nombre: "GRIS", css: "#9ca3af" },
  { nombre: "GRIS OSCURO", css: "#4b5563" },
  { nombre: "ROJO", css: "#d32027" },
  { nombre: "GUINDA", css: "#7f1d24" },
  { nombre: "NARANJA", css: "#ea580c" },
  { nombre: "AMARILLO", css: "#eab308" },
  { nombre: "VERDE", css: "#16a34a" },
  { nombre: "VERDE OSCURO", css: "#14532d" },
  { nombre: "CELESTE", css: "#7dd3fc" },
  { nombre: "AZUL", css: "#2563eb" },
  { nombre: "AZUL OSCURO", css: "#1e3a8a" },
  { nombre: "BEIGE", css: "#d6cfc2" },
  { nombre: "CREMA", css: "#f5f0e1" },
  { nombre: "MARRON", css: "#78350f" },
  { nombre: "DORADO", css: "#b8860b" },
];

// CSS del color por nombre (case-insensitive); gris neutro si no está en el
// catálogo (datos antiguos escritos a mano).
export function cssColorVehiculo(nombre: string | null | undefined): string {
  if (!nombre) return "#e5e5e5";
  return (
    COLORES_VEHICULO.find((c) => c.nombre === nombre.trim().toUpperCase())?.css ??
    "#e5e5e5"
  );
}

// Muestra circular del color; el borde hace visible el blanco sobre fondo claro.
export function MuestraColor({ nombre }: { nombre: string | null | undefined }) {
  return (
    <span
      className="border-border inline-block size-3 shrink-0 rounded-full border align-middle"
      style={{ backgroundColor: cssColorVehiculo(nombre) }}
      aria-hidden="true"
    />
  );
}
