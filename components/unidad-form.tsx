"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImageIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError, api } from "@/lib/api";

const CLASES = [
  { valor: "LIVIANO", etiqueta: "Liviano (camioneta, auto)" },
  { valor: "PESADO", etiqueta: "Pesado (camión, tracto)" },
  { valor: "REMOLQUE", etiqueta: "Remolque (acople)" },
  { valor: "SEMIRREMOLQUE", etiqueta: "Semirremolque (acople)" },
  { valor: "OTRO", etiqueta: "Otro" },
];

const CATEGORIAS = ["N1", "N2", "N3", "M1", "M2", "M3", "O1", "O2", "O3", "O4"];
const COMBUSTIBLES = ["DIESEL", "GASOLINA", "GLP", "GNV", "ELECTRICO", "HIBRIDO"];

interface FormUnidad {
  placa: string;
  clase: string;
  tipoVehiculo: string;
  categoriaVehicular: string;
  marca: string;
  modelo: string;
  anio: string;
  anioFabricacion: string;
  color: string;
  numeroEjes: string;
  numeroMotor: string;
  numeroVin: string;
  registroMtc: string;
  mtcVigencia: string;
  materialesPeligrosos: string;
  cuenta: string;
  clienteAsociado: string;
  capacidadCarga: string;
  pesoBrutoVehicular: string;
  tara: string;
  capacidadPasajeros: string;
  volumenCarga: string;
  tipoCarroceria: string;
  numeroSerieCarroceria: string;
  tipoCombustible: string;
  kilometraje: string;
  ultimoMantenimientoFecha: string;
  ultimoMantenimientoKilometraje: string;
  proximoMantenimientoFecha: string;
  proximoMantenimientoKilometraje: string;
  mantenimientoObservacion: string;
}

const VACIO: FormUnidad = {
  placa: "",
  clase: "",
  tipoVehiculo: "",
  categoriaVehicular: "",
  marca: "",
  modelo: "",
  anio: "",
  anioFabricacion: "",
  color: "",
  numeroEjes: "",
  numeroMotor: "",
  numeroVin: "",
  registroMtc: "",
  mtcVigencia: "",
  materialesPeligrosos: "",
  cuenta: "",
  clienteAsociado: "",
  capacidadCarga: "",
  pesoBrutoVehicular: "",
  tara: "",
  capacidadPasajeros: "",
  volumenCarga: "",
  tipoCarroceria: "",
  numeroSerieCarroceria: "",
  tipoCombustible: "",
  kilometraje: "",
  ultimoMantenimientoFecha: "",
  ultimoMantenimientoKilometraje: "",
  proximoMantenimientoFecha: "",
  proximoMantenimientoKilometraje: "",
  mantenimientoObservacion: "",
};

function Seccion({ titulo }: { titulo: string }) {
  return (
    <div className="sm:col-span-2">
      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.14em]">
        {titulo}
      </p>
      <Separator className="mt-1" />
    </div>
  );
}

// Formulario de alta del maestro de unidades con sus características y resumen de mantenimiento.
export default function UnidadForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormUnidad>(VACIO);
  const [fotos, setFotos] = useState<string[]>([]);
  const [fotoNueva, setFotoNueva] = useState("");

  const set = (campo: keyof FormUnidad) => (valor: string) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const crear = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api("/unidades", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => {
      toast.success(`Unidad ${form.placa.toUpperCase()} registrada.`);
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      router.push("/dashboard/unidades");
    },
    onError: (e) =>
      toast.error(e instanceof ApiError ? e.message : "Error inesperado."),
  });

  const agregarFoto = () => {
    const url = fotoNueva.trim();
    if (!/^https?:\/\//.test(url)) {
      toast.error("La foto debe ser una URL http(s).");
      return;
    }
    setFotos((prev) => [...prev, url]);
    setFotoNueva("");
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.placa.trim() || !form.clase) {
      const id = !form.placa.trim() ? "placa" : "clase";
      toast.error("Completa todos los campos obligatorios.");
      document.getElementById(id)?.focus();
      return;
    }
    const num = (v: string) => (v === "" ? undefined : Number(v));
    crear.mutate({
      placa: form.placa,
      clase: form.clase,
      tipoVehiculo: form.tipoVehiculo || undefined,
      categoriaVehicular: form.categoriaVehicular || undefined,
      marca: form.marca || undefined,
      modelo: form.modelo || undefined,
      anio: num(form.anio),
      anioFabricacion: num(form.anioFabricacion),
      color: form.color || undefined,
      numeroEjes: num(form.numeroEjes),
      numeroMotor: form.numeroMotor || undefined,
      numeroVin: form.numeroVin || undefined,
      registroMtc: form.registroMtc || undefined,
      mtcVigencia: form.mtcVigencia || undefined,
      materialesPeligrosos: form.materialesPeligrosos || undefined,
      cuenta: form.cuenta || undefined,
      clienteAsociado: form.clienteAsociado || undefined,
      capacidadCarga: num(form.capacidadCarga),
      pesoBrutoVehicular: num(form.pesoBrutoVehicular),
      tara: num(form.tara),
      capacidadPasajeros: num(form.capacidadPasajeros),
      volumenCarga: num(form.volumenCarga),
      tipoCarroceria: form.tipoCarroceria || undefined,
      numeroSerieCarroceria: form.numeroSerieCarroceria || undefined,
      tipoCombustible: form.tipoCombustible || undefined,
      kilometraje: num(form.kilometraje),
      ultimoMantenimientoFecha: form.ultimoMantenimientoFecha || undefined,
      ultimoMantenimientoKilometraje: num(form.ultimoMantenimientoKilometraje),
      proximoMantenimientoFecha: form.proximoMantenimientoFecha || undefined,
      proximoMantenimientoKilometraje: num(form.proximoMantenimientoKilometraje),
      mantenimientoObservacion: form.mantenimientoObservacion || undefined,
      fotos,
    });
  };

  const campoTexto = (
    campo: keyof FormUnidad,
    label: string,
    props: { placeholder?: string; requerido?: boolean; tipo?: string } = {},
  ) => (
    <div className="grid gap-2">
      <Label htmlFor={campo}>
        {label}
        {props.requerido && <span className="text-primary"> *</span>}
      </Label>
      <Input
        id={campo}
        type={props.tipo ?? "text"}
        required={props.requerido}
        placeholder={props.placeholder}
        value={form[campo]}
        step={props.tipo === "number" ? "any" : undefined}
        onChange={(e) => set(campo)(e.target.value)}
      />
    </div>
  );

  return (
    <form onSubmit={enviar} className="grid gap-4 sm:grid-cols-2">
            <Seccion titulo="Identificación" />
            {campoTexto("placa", "Placa", { placeholder: "VCA-821", requerido: true })}
            <div className="grid gap-2">
              <Label htmlFor="clase">
                Clase<span className="text-primary"> *</span>
              </Label>
              <Select value={form.clase} onValueChange={(v) => set("clase")(v ?? "")}>
                <SelectTrigger id="clase">
                  <SelectValue placeholder="Seleccionar…" />
                </SelectTrigger>
                <SelectContent>
                  {CLASES.map((c) => (
                    <SelectItem key={c.valor} value={c.valor}>
                      {c.etiqueta}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoriaVehicular">Categoría vehicular (MTC)</Label>
              <Select
                value={form.categoriaVehicular}
                onValueChange={(v) => set("categoriaVehicular")(v ?? "")}
              >
                <SelectTrigger id="categoriaVehicular">
                  <SelectValue placeholder="N1, N3, O4…" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {campoTexto("tipoVehiculo", "Tipo de vehículo", { placeholder: "CAMIONETA, TRACTO, CISTERNA…" })}

            <Seccion titulo="Características" />
            {campoTexto("marca", "Marca", { placeholder: "TOYOTA" })}
            {campoTexto("modelo", "Modelo", { placeholder: "HILUX 4X4" })}
            {campoTexto("anio", "Año (modelo)", { tipo: "number", placeholder: "2024" })}
            {campoTexto("anioFabricacion", "Año de fabricación", { tipo: "number" })}
            {campoTexto("color", "Color", { placeholder: "BLANCO" })}
            {campoTexto("numeroEjes", "N° de ejes", { tipo: "number" })}
            {campoTexto("capacidadCarga", "Capacidad de carga (t)", { tipo: "number", placeholder: "30" })}
            {campoTexto("pesoBrutoVehicular", "Peso bruto vehicular (t)", { tipo: "number" })}
            {campoTexto("tara", "Tara (t)", { tipo: "number" })}
            {campoTexto("capacidadPasajeros", "Capacidad de pasajeros", { tipo: "number" })}
            {campoTexto("volumenCarga", "Volumen de carga (m³)", { tipo: "number" })}
            {campoTexto("tipoCarroceria", "Tipo de carrocería", { placeholder: "FURGON, CISTERNA…" })}
            {campoTexto("numeroSerieCarroceria", "N° de serie de carrocería")}
            <div className="grid gap-2">
              <Label htmlFor="tipoCombustible">Combustible</Label>
              <Select
                value={form.tipoCombustible}
                onValueChange={(v) => set("tipoCombustible")(v ?? "")}
              >
                <SelectTrigger id="tipoCombustible">
                  <SelectValue placeholder="Seleccionar…" />
                </SelectTrigger>
                <SelectContent>
                  {COMBUSTIBLES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Seccion titulo="Series y registro" />
            {campoTexto("numeroMotor", "N° de motor", { placeholder: "1GDG353796" })}
            {campoTexto("numeroVin", "VIN / N° de chasis", { placeholder: "8AJBA3CD5P1748414" })}
            {campoTexto("registroMtc", "Registro MTC", { placeholder: "MTC-004512 o NC" })}
            {campoTexto("mtcVigencia", "Vigencia MTC", { tipo: "date" })}
            {campoTexto("materialesPeligrosos", "MATPEL", { placeholder: "NC si no aplica" })}
            {campoTexto("kilometraje", "Kilometraje actual", { tipo: "number", placeholder: "45200" })}

            <Seccion titulo="Resumen de mantenimiento" />
            {campoTexto("ultimoMantenimientoFecha", "Fecha de último mantenimiento", { tipo: "date" })}
            {campoTexto("ultimoMantenimientoKilometraje", "Kilometraje de último mantenimiento", { tipo: "number" })}
            {campoTexto("proximoMantenimientoFecha", "Fecha de próximo mantenimiento", { tipo: "date" })}
            {campoTexto("proximoMantenimientoKilometraje", "Kilometraje de próximo mantenimiento", { tipo: "number" })}
            {campoTexto("mantenimientoObservacion", "Observación de mantenimiento", { placeholder: "Cambio de aceite y filtros" })}

            <Seccion titulo="Asignación" />
            {campoTexto("cuenta", "Cuenta / proyecto", { placeholder: "CERRO VERDE" })}
            {campoTexto("clienteAsociado", "Cliente asociado", { placeholder: "HAGEMSA" })}

            <Seccion titulo="Fotos" />
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="foto">URL de foto (frontal, lateral, interior…)</Label>
              <div className="flex gap-2">
                <Input
                  id="foto"
                  placeholder="https://…"
                  value={fotoNueva}
                  onChange={(e) => setFotoNueva(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      agregarFoto();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={agregarFoto}>
                  <ImageIcon /> Agregar
                </Button>
              </div>
              {fotos.length > 0 && (
                <ul className="grid gap-1">
                  {fotos.map((f, i) => (
                    <li
                      key={i}
                      className="bg-muted flex items-center justify-between gap-2 rounded-md px-2 py-1 text-xs"
                    >
                      <span className="truncate">{f}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-6 shrink-0"
                        onClick={() => setFotos((prev) => prev.filter((_, j) => j !== i))}
                        aria-label={`Quitar foto ${i + 1}`}
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/unidades")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={crear.isPending} focusableWhenDisabled>
                {crear.isPending ? "Guardando…" : "Registrar unidad"}
              </Button>
            </div>
    </form>
  );
}
