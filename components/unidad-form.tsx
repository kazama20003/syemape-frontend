"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  CameraIcon,
  FileBadgeIcon,
  IdCardIcon,
  ImageIcon,
  SlidersHorizontalIcon,
  Trash2Icon,
  WrenchIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError, api } from "@/lib/api";
import { COLORES_VEHICULO, MuestraColor } from "@/lib/colores-vehiculo";

const CLASES = [
  { valor: "LIVIANO", etiqueta: "Liviano (camioneta, auto)" },
  { valor: "PESADO", etiqueta: "Pesado (camión, tracto)" },
  { valor: "REMOLQUE", etiqueta: "Remolque (acople)" },
  { valor: "SEMIRREMOLQUE", etiqueta: "Semirremolque (acople)" },
  { valor: "OTRO", etiqueta: "Otro" },
];

const CATEGORIAS = ["N1", "N2", "N3", "M1", "M2", "M3", "O1", "O2", "O3", "O4"];

// Tipo del maestro administrable /tipos-vehiculo. Trae la clase y la
// categoría MTC sugeridas para autocompletarlas al seleccionarlo.
interface TipoVehiculoMaestro {
  id: number;
  codigo: string;
  nombre: string;
  claseSugerida: string | null;
  categoriaSugerida: string | null;
}
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

function SeccionCard({
  icono,
  titulo,
  descripcion,
  children,
  columnas = "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  className,
}: {
  icono: React.ReactNode;
  titulo: string;
  descripcion: string;
  children: React.ReactNode;
  columnas?: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-lg [&_svg]:size-4.5">
            {icono}
          </div>
          <div>
            <CardTitle>{titulo}</CardTitle>
            <CardDescription>{descripcion}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <FieldGroup className={`grid gap-x-5 gap-y-4 ${columnas}`}>{children}</FieldGroup>
      </CardContent>
    </Card>
  );
}

// Formulario de alta del maestro de unidades con sus características y resumen de mantenimiento.
export default function UnidadForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormUnidad>(VACIO);
  const [fotos, setFotos] = useState<string[]>([]);
  const [fotoNueva, setFotoNueva] = useState("");
  const [invalidos, setInvalidos] = useState<Set<string>>(new Set());

  const set = (campo: keyof FormUnidad) => (valor: string) => {
    setInvalidos((prev) => {
      if (!prev.has(campo)) return prev;
      const sig = new Set(prev);
      sig.delete(campo);
      return sig;
    });
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const { data: tiposData } = useQuery({
    queryKey: ["tipos-vehiculo", "catalogo"],
    queryFn: () =>
      api<{ datos: TipoVehiculoMaestro[] }>("/tipos-vehiculo?pageSize=200"),
    staleTime: 60_000,
  });
  const tiposVehiculo = tiposData?.datos ?? [];

  // Al elegir un tipo del maestro se autocompletan clase y categoría MTC
  // (siguen siendo editables para casos excepcionales).
  const setTipoVehiculo = (valor: string) => {
    const tipo = tiposVehiculo.find((t) => t.codigo === valor);
    setForm((prev) => ({
      ...prev,
      tipoVehiculo: valor,
      clase: tipo?.claseSugerida ?? prev.clase,
      categoriaVehicular: tipo?.categoriaSugerida || prev.categoriaVehicular,
    }));
  };

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
    const sinValor = [
      ["placa", form.placa.trim()],
      ["clase", form.clase],
    ]
      .filter(([, v]) => !v)
      .map(([k]) => k as string);
    if (sinValor.length > 0) {
      setInvalidos(new Set(sinValor));
      toast.error("Completa todos los campos obligatorios.");
      document.getElementById(sinValor[0])?.focus();
      return;
    }
    setInvalidos(new Set());
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
    <Field data-invalid={invalidos.has(campo) || undefined}>
      <FieldLabel htmlFor={campo}>
        {label}
        {props.requerido && <span className="text-primary"> *</span>}
      </FieldLabel>
      <Input
        id={campo}
        type={props.tipo ?? "text"}
        aria-invalid={invalidos.has(campo) || undefined}
        placeholder={props.placeholder}
        value={form[campo]}
        step={props.tipo === "number" ? "any" : undefined}
        onChange={(e) => set(campo)(e.target.value)}
      />
      {invalidos.has(campo) && <FieldError>Este campo es obligatorio.</FieldError>}
    </Field>
  );

  const campoSelect = (
    campo: keyof FormUnidad,
    label: string,
    opciones: { valor: string; etiqueta: string }[],
    props: {
      requerido?: boolean;
      onChange?: (v: string) => void;
      renderItem?: (o: { valor: string; etiqueta: string }) => React.ReactNode;
    } = {},
  ) => {
    // Sentinela para poder limpiar un select opcional ya seleccionado.
    const NINGUNO = "__NINGUNO__";
    const conNinguno = props.requerido
      ? opciones
      : [{ valor: NINGUNO, etiqueta: "— Ninguno —" }, ...opciones];
    const onChange = (v: string) =>
      (props.onChange ?? set(campo))(v === NINGUNO ? "" : v);
    return (
      <Field data-invalid={invalidos.has(campo) || undefined}>
        <FieldLabel htmlFor={campo}>
          {label}
          {props.requerido && <span className="text-primary"> *</span>}
        </FieldLabel>
        <Select
          value={form[campo]}
          onValueChange={(v) => onChange(v ?? "")}
          items={conNinguno.map((o) => ({ value: o.valor, label: o.etiqueta }))}
        >
          <SelectTrigger
            id={campo}
            className="w-full"
            aria-invalid={invalidos.has(campo) || undefined}
          >
            <SelectValue placeholder="Seleccionar…" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {conNinguno.map((o) => (
                <SelectItem key={o.valor} value={o.valor}>
                  {o.valor === NINGUNO ? (
                    <span className="text-muted-foreground">{o.etiqueta}</span>
                  ) : props.renderItem ? (
                    props.renderItem(o)
                  ) : (
                    o.etiqueta
                  )}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {invalidos.has(campo) && <FieldError>Este campo es obligatorio.</FieldError>}
      </Field>
    );
  };

  return (
    <form onSubmit={enviar} className="flex w-full flex-col gap-5 pb-20">
      <SeccionCard
        icono={<IdCardIcon />}
        titulo="Identificación"
        descripcion="Placa, tipo y clasificación vehicular de la unidad."
      >
        {campoTexto("placa", "Placa", { placeholder: "VCA-821", requerido: true })}
        {campoSelect(
          "tipoVehiculo",
          "Tipo de vehículo",
          tiposVehiculo.map((t) => ({ valor: t.codigo, etiqueta: t.nombre })),
          { onChange: setTipoVehiculo },
        )}
        {campoSelect("clase", "Clase", CLASES, { requerido: true })}
        {campoSelect(
          "categoriaVehicular",
          "Categoría vehicular (MTC)",
          CATEGORIAS.map((c) => ({ valor: c, etiqueta: c })),
        )}
      </SeccionCard>

      <SeccionCard
        icono={<SlidersHorizontalIcon />}
        titulo="Características"
        descripcion="Datos técnicos y capacidades del vehículo."
      >
        {campoTexto("marca", "Marca", { placeholder: "TOYOTA" })}
        {campoTexto("modelo", "Modelo", { placeholder: "HILUX 4X4" })}
        {campoTexto("anio", "Año (modelo)", { tipo: "number", placeholder: "2024" })}
        {campoTexto("anioFabricacion", "Año de fabricación", { tipo: "number" })}
        {campoSelect(
          "color",
          "Color",
          COLORES_VEHICULO.map((c) => ({ valor: c.nombre, etiqueta: c.nombre })),
          {
            renderItem: (o) => (
              <span className="flex items-center gap-2">
                <MuestraColor nombre={o.valor} />
                {o.etiqueta}
              </span>
            ),
          },
        )}
        {campoTexto("numeroEjes", "N° de ejes", { tipo: "number" })}
        {campoTexto("capacidadCarga", "Capacidad de carga (t)", { tipo: "number", placeholder: "30" })}
        {campoTexto("pesoBrutoVehicular", "Peso bruto vehicular (t)", { tipo: "number" })}
        {campoTexto("tara", "Tara (t)", { tipo: "number" })}
        {campoTexto("capacidadPasajeros", "Capacidad de pasajeros", { tipo: "number" })}
        {campoTexto("volumenCarga", "Volumen de carga (m³)", { tipo: "number" })}
        {campoTexto("tipoCarroceria", "Tipo de carrocería", { placeholder: "FURGON, CISTERNA…" })}
        {campoTexto("numeroSerieCarroceria", "N° de serie de carrocería")}
        {campoSelect(
          "tipoCombustible",
          "Combustible",
          COMBUSTIBLES.map((c) => ({ valor: c, etiqueta: c })),
        )}
      </SeccionCard>

      <SeccionCard
        icono={<FileBadgeIcon />}
        titulo="Series y registro"
        descripcion="Números de serie y registro ante el MTC."
      >
        {campoTexto("numeroMotor", "N° de motor", { placeholder: "1GDG353796" })}
        {campoTexto("numeroVin", "VIN / N° de chasis", { placeholder: "8AJBA3CD5P1748414" })}
        {campoTexto("registroMtc", "Registro MTC", { placeholder: "MTC-004512 o NC" })}
        {campoTexto("mtcVigencia", "Vigencia MTC", { tipo: "date" })}
        {campoTexto("materialesPeligrosos", "MATPEL", { placeholder: "NC si no aplica" })}
        {campoTexto("kilometraje", "Kilometraje actual", { tipo: "number", placeholder: "45200" })}
      </SeccionCard>

      <SeccionCard
        icono={<WrenchIcon />}
        titulo="Mantenimiento"
        descripcion="Último y próximo mantenimiento programado."
      >
        {campoTexto("ultimoMantenimientoFecha", "Fecha de último mantenimiento", { tipo: "date" })}
        {campoTexto("ultimoMantenimientoKilometraje", "Kilometraje de último mantenimiento", { tipo: "number" })}
        {campoTexto("proximoMantenimientoFecha", "Fecha de próximo mantenimiento", { tipo: "date" })}
        {campoTexto("proximoMantenimientoKilometraje", "Kilometraje de próximo mantenimiento", { tipo: "number" })}
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
          {campoTexto("mantenimientoObservacion", "Observación de mantenimiento", { placeholder: "Cambio de aceite y filtros" })}
        </div>
      </SeccionCard>

      <SeccionCard
        icono={<CameraIcon />}
        titulo="Asignación y fotos"
        descripcion="Cuenta o proyecto donde opera y registro fotográfico."
      >
        {campoTexto("cuenta", "Cuenta / proyecto", { placeholder: "CERRO VERDE" })}
        {campoTexto("clienteAsociado", "Cliente asociado", { placeholder: "HAGEMSA" })}
        <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-3 xl:col-span-4">
          <FieldLabel htmlFor="foto">URL de foto (frontal, lateral, interior…)</FieldLabel>
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
              <ImageIcon data-icon="inline-start" /> Agregar
            </Button>
          </div>
          {fotos.length > 0 && (
            <ul className="flex flex-col gap-1">
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
      </SeccionCard>

      <div className="bg-background/90 sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-2 border-t px-4 py-3 backdrop-blur lg:-mx-6 lg:px-6">
        <p className="text-muted-foreground mr-auto hidden text-xs sm:block">
          <span className="text-primary">*</span> Campos obligatorios: placa y clase.
        </p>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/unidades")}>
          Cancelar
        </Button>
        <Button type="submit" disabled={crear.isPending} focusableWhenDisabled>
          {crear.isPending && <Spinner data-icon="inline-start" />}
          {crear.isPending ? "Guardando…" : "Registrar unidad"}
        </Button>
      </div>
    </form>
  );
}
