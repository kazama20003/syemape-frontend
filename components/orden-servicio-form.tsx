"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ClipboardListIcon,
  PackageIcon,
  PlusIcon,
  ShieldCheckIcon,
  Trash2Icon,
  TruckIcon,
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
import { Textarea } from "@/components/ui/textarea";
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

const ESTADOS_CARGA = [
  { valor: "VACIO", etiqueta: "Vacío" },
  { valor: "CARGADO", etiqueta: "Cargado" },
];
const COMBUSTIBLES = [
  { valor: "FULL", etiqueta: "Full" },
  { valor: "TRES_CUARTOS", etiqueta: "3/4" },
  { valor: "MEDIO", etiqueta: "1/2" },
  { valor: "UN_CUARTO", etiqueta: "1/4" },
  { valor: "POR_REGISTRAR", etiqueta: "Por registrar" },
];
const VIATICOS = [
  { valor: "CON_VIATICOS", etiqueta: "Con viáticos" },
  { valor: "SIN_VIATICOS", etiqueta: "Sin viáticos" },
  { valor: "POR_REGISTRAR", etiqueta: "Por registrar" },
];
const UNIDADES_MEDIDA = ["UNIDAD", "KG", "TONELADA", "LITRO", "CAJA", "SACO", "OTRO"];

interface Ubicacion {
  id: number;
  nombre: string;
}
interface Ruta {
  id: number;
  nombre: string;
  origen: string;
  destino: string;
  ubicacionOrigenId: number | null;
  ubicacionDestinoId: number | null;
}
interface Unidad {
  id: number;
  placa: string;
  clase: string;
  marca: string | null;
}
interface Persona {
  id: number;
  nombres: string;
  apellidos: string;
}
interface Cliente {
  id: number;
  razonSocial: string;
}
interface TipoServicio {
  id: number;
  nombre: string;
}

interface LineaCarga {
  descripcion: string;
  cantidad: string;
  unidadMedida: string;
  pesoKg: string;
}

const CARGA_VACIA: LineaCarga = { descripcion: "", cantidad: "", unidadMedida: "", pesoKg: "" };

// Hook de catálogo paginado del backend para poblar selects.
function useCatalogo<T>(endpoint: string, extra = "") {
  const { data } = useQuery({
    queryKey: [endpoint, "catalogo", extra],
    queryFn: () => api<{ datos: T[] }>(`${endpoint}?pageSize=200${extra}`),
    staleTime: 60_000,
  });
  return data?.datos ?? [];
}

function SeccionCard({
  icono,
  titulo,
  descripcion,
  children,
  className,
}: {
  icono: React.ReactNode;
  titulo: string;
  descripcion: string;
  children: React.ReactNode;
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
      <CardContent className="pt-5">{children}</CardContent>
    </Card>
  );
}

// Formulario de creación de la orden de servicio (manifiesto). Todos los
// datos operativos salen de los maestros; texto libre solo en observaciones
// y líneas de carga.
export default function OrdenServicioForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const ubicaciones = useCatalogo<Ubicacion>("/ubicaciones");
  const rutas = useCatalogo<Ruta>("/rutas");
  const unidades = useCatalogo<Unidad>("/unidades");
  const conductores = useCatalogo<Persona>("/personal", "&tipo=CONDUCTOR");
  const supervisores = useCatalogo<Persona>("/personal", "&tipo=SUPERVISOR");
  const clientes = useCatalogo<Cliente>("/clientes");
  const tiposServicio = useCatalogo<TipoServicio>("/tipos-servicio");

  const [form, setForm] = useState({
    fechaServicio: "",
    horaServicio: "",
    rutaId: "",
    ubicacionOrigenId: "",
    ubicacionDestinoId: "",
    tipoServicioId: "",
    clienteId: "",
    estadoCarga: "",
    combustible: "",
    viaticos: "",
    unidadId: "",
    segundaUnidadId: "",
    conductorId: "",
    supervisorId: "",
    base: "",
    puestoControl: "",
    fechaLlegadaEstimada: "",
    observaciones: "",
  });
  const [cargas, setCargas] = useState<LineaCarga[]>([]);
  const [invalidos, setInvalidos] = useState<Set<string>>(new Set());

  const set = (campo: keyof typeof form) => (valor: string) => {
    setInvalidos((prev) => {
      if (!prev.has(campo)) return prev;
      const sig = new Set(prev);
      sig.delete(campo);
      return sig;
    });
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  // Elegir una ruta autocompleta origen y destino con sus ubicaciones.
  const setRuta = (valor: string) => {
    const ruta = rutas.find((r) => String(r.id) === valor);
    setForm((prev) => ({
      ...prev,
      rutaId: valor,
      ubicacionOrigenId: ruta?.ubicacionOrigenId
        ? String(ruta.ubicacionOrigenId)
        : prev.ubicacionOrigenId,
      ubicacionDestinoId: ruta?.ubicacionDestinoId
        ? String(ruta.ubicacionDestinoId)
        : prev.ubicacionDestinoId,
    }));
  };

  const crear = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api("/manifiestos", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => {
      toast.success("Manifiesto registrado.");
      queryClient.invalidateQueries({ queryKey: ["/manifiestos"] });
      router.push("/dashboard/manifiestos");
    },
    onError: (e) =>
      toast.error(e instanceof ApiError ? e.message : "Error inesperado."),
  });

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const faltantes: [string, string][] = [
      ["fechaServicio", form.fechaServicio],
      ["ubicacionOrigenId", form.ubicacionOrigenId],
      ["ubicacionDestinoId", form.ubicacionDestinoId],
      ["unidadId", form.unidadId],
      ["conductorId", form.conductorId],
    ];
    const sinValor = faltantes.filter(([, v]) => !v).map(([k]) => k);
    if (sinValor.length > 0) {
      setInvalidos(new Set(sinValor));
      toast.error("Completa todos los campos obligatorios.");
      document.getElementById(sinValor[0])?.focus();
      return;
    }
    setInvalidos(new Set());
    const nombreUbicacion = (id: string) =>
      ubicaciones.find((u) => String(u.id) === id)?.nombre ?? "";
    const num = (v: string) => (v === "" ? undefined : Number(v));

    crear.mutate({
      fechaServicio: form.fechaServicio,
      horaServicio: form.horaServicio || undefined,
      // El backend exige el texto; se deriva de la ubicación elegida.
      origen: nombreUbicacion(form.ubicacionOrigenId),
      destino: nombreUbicacion(form.ubicacionDestinoId),
      ubicacionOrigenId: Number(form.ubicacionOrigenId),
      ubicacionDestinoId: Number(form.ubicacionDestinoId),
      rutaId: num(form.rutaId),
      tipoServicioId: num(form.tipoServicioId),
      clienteId: num(form.clienteId),
      estadoCarga: form.estadoCarga || undefined,
      combustible: form.combustible || undefined,
      viaticos: form.viaticos || undefined,
      unidadId: Number(form.unidadId),
      segundaUnidadId: num(form.segundaUnidadId),
      conductorId: Number(form.conductorId),
      supervisorId: num(form.supervisorId),
      base: form.base || undefined,
      puestoControl: form.puestoControl || undefined,
      fechaLlegadaEstimada: form.fechaLlegadaEstimada || undefined,
      observaciones: form.observaciones || undefined,
      cargas: cargas
        .filter((c) => c.descripcion.trim())
        .map((c) => ({
          descripcion: c.descripcion,
          cantidad: num(c.cantidad),
          unidadMedida: c.unidadMedida || undefined,
          pesoKg: num(c.pesoKg),
        })),
    });
  };

  // Sentinela para poder limpiar un select opcional ya seleccionado.
  const NINGUNO = "__NINGUNO__";

  const campoSelect = (
    campo: keyof typeof form,
    label: string,
    opciones: { valor: string; etiqueta: string }[],
    props: {
      requerido?: boolean;
      onChange?: (v: string) => void;
      deshabilitado?: boolean;
      ayuda?: string;
    } = {},
  ) => {
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
          disabled={props.deshabilitado}
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
                  <span className={o.valor === NINGUNO ? "text-muted-foreground" : undefined}>
                    {o.etiqueta}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {props.ayuda && (
          <p className="text-muted-foreground text-xs">{props.ayuda}</p>
        )}
        {invalidos.has(campo) && <FieldError>Este campo es obligatorio.</FieldError>}
      </Field>
    );
  };

  const campoTexto = (
    campo: keyof typeof form,
    label: string,
    props: { requerido?: boolean; tipo?: string; placeholder?: string } = {},
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
        onChange={(e) => set(campo)(e.target.value)}
      />
      {invalidos.has(campo) && <FieldError>Este campo es obligatorio.</FieldError>}
    </Field>
  );

  // Si la ruta elegida ya define sus ubicaciones, origen/destino se bloquean.
  const rutaSel = rutas.find((r) => String(r.id) === form.rutaId);
  const rutaDefineTrayecto = Boolean(
    rutaSel?.ubicacionOrigenId && rutaSel?.ubicacionDestinoId,
  );

  // Un supervisor tambien puede conducir: el combo de conductor une ambos.
  const puedenConducir = [
    ...conductores.map((p) => ({ ...p, esSupervisor: false })),
    ...supervisores.map((p) => ({ ...p, esSupervisor: true })),
  ];

  const deUbicaciones = ubicaciones.map((u) => ({ valor: String(u.id), etiqueta: u.nombre }));
  const dePersonas = (lista: Persona[]) =>
    lista.map((p) => ({ valor: String(p.id), etiqueta: `${p.nombres} ${p.apellidos}` }));

  return (
    <form onSubmit={enviar} className="grid w-full gap-5 pb-20 xl:grid-cols-2">
      <SeccionCard
        icono={<ClipboardListIcon />}
        titulo="Servicio"
        descripcion="Cuándo, dónde y para quién se presta el servicio."
        className="xl:col-span-2"
      >
        <FieldGroup className="grid gap-x-5 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
          {campoTexto("fechaServicio", "Fecha del servicio", { tipo: "date", requerido: true })}
          {campoTexto("horaServicio", "Hora", { tipo: "time" })}
          <div className="sm:col-span-2">
            {campoSelect(
              "rutaId",
              "Ruta (autocompleta origen y destino)",
              rutas.map((r) => ({
                valor: String(r.id),
                etiqueta: `${r.nombre} (${r.origen} → ${r.destino})`,
              })),
              { onChange: setRuta },
            )}
          </div>
          {campoSelect("ubicacionOrigenId", "Origen", deUbicaciones, {
            requerido: true,
            deshabilitado: rutaDefineTrayecto,
            ayuda: rutaDefineTrayecto ? "Definido por la ruta seleccionada." : undefined,
          })}
          {campoSelect("ubicacionDestinoId", "Destino", deUbicaciones, {
            requerido: true,
            deshabilitado: rutaDefineTrayecto,
            ayuda: rutaDefineTrayecto ? "Definido por la ruta seleccionada." : undefined,
          })}
          {campoSelect(
            "tipoServicioId",
            "Tipo de servicio",
            tiposServicio.map((t) => ({ valor: String(t.id), etiqueta: t.nombre })),
          )}
          {campoSelect(
            "clienteId",
            "Cliente",
            clientes.map((c) => ({ valor: String(c.id), etiqueta: c.razonSocial })),
          )}
        </FieldGroup>
      </SeccionCard>

      <SeccionCard
        icono={<TruckIcon />}
        titulo="Unidad y operador"
        descripcion="Vehículo asignado, acople y conductor responsable."
      >
        <FieldGroup className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
          {campoSelect(
            "unidadId",
            "Unidad",
            unidades.map((u) => ({
              valor: String(u.id),
              etiqueta: `${u.placa}${u.marca ? ` · ${u.marca}` : ""} (${u.clase})`,
            })),
            { requerido: true },
          )}
          {campoSelect(
            "segundaUnidadId",
            "Segunda unidad (acople, doble placa)",
            unidades
              .filter((u) => String(u.id) !== form.unidadId)
              .map((u) => ({ valor: String(u.id), etiqueta: `${u.placa} (${u.clase})` })),
          )}
          {campoSelect(
            "conductorId",
            "Conductor",
            puedenConducir.map((p) => ({
              valor: String(p.id),
              etiqueta: `${p.nombres} ${p.apellidos}${p.esSupervisor ? " (supervisor)" : ""}`,
            })),
            { requerido: true },
          )}
          {campoSelect("estadoCarga", "Estado de carga", ESTADOS_CARGA)}
          {campoSelect("combustible", "Combustible al iniciar", COMBUSTIBLES)}
          {campoSelect("viaticos", "Viáticos", VIATICOS)}
        </FieldGroup>
      </SeccionCard>

      <SeccionCard
        icono={<ShieldCheckIcon />}
        titulo="Supervisión"
        descripcion="Supervisor asignado y puntos de control del trayecto."
      >
        <FieldGroup className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
          {campoSelect("supervisorId", "Supervisor", dePersonas(supervisores))}
          {campoTexto("fechaLlegadaEstimada", "Llegada estimada", { tipo: "date" })}
          {campoSelect(
            "base",
            "Base (ubicación)",
            ubicaciones.map((u) => ({ valor: u.nombre, etiqueta: u.nombre })),
          )}
          {campoSelect(
            "puestoControl",
            "Puesto de control (ubicación)",
            ubicaciones.map((u) => ({ valor: u.nombre, etiqueta: u.nombre })),
          )}
        </FieldGroup>
      </SeccionCard>

      <SeccionCard
        icono={<PackageIcon />}
        titulo="Carga"
        descripcion="Mercancía transportada en este servicio (opcional)."
        className="xl:col-span-2"
      >
        <div className="flex flex-col gap-3">
          {cargas.map((c, i) => (
            <div key={i} className="grid items-end gap-2 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]">
              <Field>
                {i === 0 && <FieldLabel>Descripción</FieldLabel>}
                <Input
                  placeholder="Repuestos varios"
                  value={c.descripcion}
                  onChange={(e) =>
                    setCargas((prev) =>
                      prev.map((x, j) => (j === i ? { ...x, descripcion: e.target.value } : x)),
                    )
                  }
                />
              </Field>
              <Field>
                {i === 0 && <FieldLabel>Cantidad</FieldLabel>}
                <Input
                  type="number"
                  step="any"
                  value={c.cantidad}
                  onChange={(e) =>
                    setCargas((prev) =>
                      prev.map((x, j) => (j === i ? { ...x, cantidad: e.target.value } : x)),
                    )
                  }
                />
              </Field>
              <Field>
                {i === 0 && <FieldLabel>Medida</FieldLabel>}
                <Select
                  value={c.unidadMedida}
                  onValueChange={(v) =>
                    setCargas((prev) =>
                      prev.map((x, j) => (j === i ? { ...x, unidadMedida: v ?? "" } : x)),
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {UNIDADES_MEDIDA.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                {i === 0 && <FieldLabel>Peso (kg)</FieldLabel>}
                <Input
                  type="number"
                  step="any"
                  value={c.pesoKg}
                  onChange={(e) =>
                    setCargas((prev) =>
                      prev.map((x, j) => (j === i ? { ...x, pesoKg: e.target.value } : x)),
                    )
                  }
                />
              </Field>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Quitar carga ${i + 1}`}
                onClick={() => setCargas((prev) => prev.filter((_, j) => j !== i))}
              >
                <Trash2Icon />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={() => setCargas((prev) => [...prev, { ...CARGA_VACIA }])}
          >
            <PlusIcon data-icon="inline-start" /> Agregar carga
          </Button>
        </div>
      </SeccionCard>

      <SeccionCard
        icono={<ClipboardListIcon />}
        titulo="Observaciones"
        descripcion="Indicaciones adicionales para el conductor o supervisor."
        className="xl:col-span-2"
      >
        <Field>
          <FieldLabel htmlFor="observaciones" className="sr-only">
            Observaciones
          </FieldLabel>
          <Textarea
            id="observaciones"
            rows={3}
            placeholder="Indicaciones para el conductor…"
            value={form.observaciones}
            onChange={(e) => set("observaciones")(e.target.value)}
          />
        </Field>
      </SeccionCard>

      <div className="bg-background/90 sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-2 border-t px-4 py-3 backdrop-blur lg:-mx-6 lg:px-6 xl:col-span-2">
        <p className="text-muted-foreground mr-auto hidden text-xs sm:block">
          <span className="text-primary">*</span> Obligatorios: fecha, origen, destino, unidad y conductor.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/manifiestos")}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={crear.isPending} focusableWhenDisabled>
          {crear.isPending && <Spinner data-icon="inline-start" />}
          {crear.isPending ? "Guardando…" : "Registrar manifiesto"}
        </Button>
      </div>
    </form>
  );
}
