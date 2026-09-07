"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Link2Icon, PlusIcon, SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

interface Unidad {
  id: number;
  placa: string;
  clase: string;
  tipoVehiculo: string | null;
  categoriaVehicular: string | null;
  marca: string | null;
  modelo: string | null;
  anio: number | null;
  color: string | null;
  numeroEjes: number | null;
  capacidadCarga: number | null;
  registroMtc: string | null;
  mtcVigencia: string | null;
  estadoUnidad: string;
  estadoActivo: string;
}

// --- Categorias vehiculares (MTC): color distintivo por categoria para
// reconocerlas de un vistazo. N = carga, M = pasajeros, O = acoples sin motor.
const ESTILO_CATEGORIA: Record<string, string> = {
  N1: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
  N2: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  N3: "bg-red-600 text-white border-red-700",
  M1: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-900",
  M2: "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900 dark:text-sky-200 dark:border-sky-800",
  M3: "bg-sky-600 text-white border-sky-700",
  O1: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700",
  O2: "bg-zinc-200 text-zinc-800 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:border-zinc-600",
  O3: "bg-zinc-500 text-white border-zinc-600",
  O4: "bg-zinc-800 text-white border-zinc-900 dark:bg-zinc-200 dark:text-zinc-900",
};

const DESCRIPCION_CATEGORIA: Record<string, string> = {
  N1: "Carga ligera (hasta 3.5 t) — camionetas",
  N2: "Carga media (3.5 a 12 t) — camiones",
  N3: "Carga pesada (más de 12 t) — tractos y camiones grandes",
  M1: "Pasajeros — hasta 8 asientos",
  M2: "Pasajeros — más de 8 asientos, hasta 5 t",
  M3: "Pasajeros — más de 8 asientos, más de 5 t",
  O1: "Acople muy ligero (hasta 0.75 t)",
  O2: "Acople ligero (0.75 a 3.5 t)",
  O3: "Acople medio (3.5 a 10 t)",
  O4: "Acople pesado (más de 10 t) — semirremolques",
};

const CLASES = ["LIVIANO", "PESADO", "REMOLQUE", "SEMIRREMOLQUE", "OTRO"];
const ESTADOS = ["OPERATIVA", "EN_MANTENIMIENTO", "DE_BAJA"];

// Un acople (remolque/semirremolque) no circula solo: en ruta va enganchado a
// un tracto y el manifiesto lleva DOBLE PLACA (placa del tracto + del acople).
const ES_ACOPLE = new Set(["REMOLQUE", "SEMIRREMOLQUE"]);

// Chip visual con el color declarado del vehiculo.
const COLOR_CSS: Record<string, string> = {
  BLANCO: "#ffffff",
  NEGRO: "#252525",
  GRIS: "#9ca3af",
  "GRIS OSCURO": "#4b5563",
  "GRIS OSCURO METALICO": "#4b5563",
  ROJO: "#d32027",
  AZUL: "#2563eb",
  VERDE: "#16a34a",
  AMARILLO: "#eab308",
  PLATA: "#cbd5e1",
  BEIGE: "#d6cfc2",
};

function chipColor(nombre: string | null) {
  if (!nombre) return null;
  const css = COLOR_CSS[nombre.toUpperCase()] ?? "#e5e5e5";
  return (
    <span
      className="border-border inline-block size-3 shrink-0 rounded-full border align-middle"
      style={{ backgroundColor: css }}
      title={nombre}
    />
  );
}

function BadgeCategoria({ categoria }: { categoria: string | null }) {
  if (!categoria) return <span className="text-muted-foreground">—</span>;
  const estilo = ESTILO_CATEGORIA[categoria] ?? "";
  const descripcion = DESCRIPCION_CATEGORIA[categoria];
  const badge = (
    <Badge variant="outline" className={`font-semibold ${estilo}`}>
      {categoria}
    </Badge>
  );
  if (!descripcion) return badge;
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex" />}>{badge}</TooltipTrigger>
      <TooltipContent>{descripcion}</TooltipContent>
    </Tooltip>
  );
}

const ESTILO_ESTADO: Record<string, string> = {
  OPERATIVA: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
  EN_MANTENIMIENTO: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  DE_BAJA: "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function UnidadesPage() {
  const [placa, setPlaca] = useState("");
  const [clase, setClase] = useState("TODAS");
  const [estado, setEstado] = useState("TODOS");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["unidades", { placa, clase, estado, page }],
    queryFn: () => {
      const q = new URLSearchParams();
      if (placa) q.set("placa", placa);
      if (clase !== "TODAS") q.set("clase", clase);
      if (estado !== "TODOS") q.set("estadoUnidad", estado);
      q.set("page", String(page));
      q.set("pageSize", "20");
      return api<{
        datos: Unidad[];
        paginacion: {
          pagina: number;
          totalPaginas: number;
          total: number;
          tieneSiguiente: boolean;
          tieneAnterior: boolean;
        };
      }>(`/unidades?${q.toString()}`);
    },
    placeholderData: keepPreviousData,
    refetchInterval: 15_000,
  });

  const unidades = data?.datos ?? [];
  const paginacion = data?.paginacion;

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Unidades</h1>
          <p className="text-muted-foreground text-sm">
            Flota de vehículos: categoría vehicular MTC, acoples con doble placa y
            estado operativo.
            {isFetching && !isLoading && <span className="ml-2 text-xs">Actualizando…</span>}
          </p>
        </div>
        <Button render={<Link href="/dashboard/unidades/nueva" />}>
          <PlusIcon /> Nueva unidad
        </Button>
      </div>

      {/* Leyenda de categorias presentes */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground">Categorías:</span>
        {["N1", "N2", "N3", "O3", "O4"].map((c) => (
          <Tooltip key={c}>
            <TooltipTrigger render={<span className="inline-flex" />}>
              <Badge variant="outline" className={`${ESTILO_CATEGORIA[c]}`}>
                {c}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>{DESCRIPCION_CATEGORIA[c]}</TooltipContent>
          </Tooltip>
        ))}
        <span className="text-muted-foreground ml-2 inline-flex items-center gap-1">
          <Link2Icon className="size-3" /> = acople (circula con tracto, doble placa)
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-56">
          <SearchIcon className="text-muted-foreground absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar placa…"
            className="pl-8"
            value={placa}
            onChange={(e) => {
              setPlaca(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select value={clase} onValueChange={(v) => { setClase(v ?? "TODAS"); setPage(1); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Clase" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODAS">Todas las clases</SelectItem>
            {CLASES.map((c) => (
              <SelectItem key={c} value={c}>
                {c.charAt(0) + c.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={estado} onValueChange={(v) => { setEstado(v ?? "TODOS"); setPage(1); }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos los estados</SelectItem>
            {ESTADOS.map((e) => (
              <SelectItem key={e} value={e}>
                {e.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead>MTC</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : unidades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground h-24 text-center">
                  No hay unidades que coincidan.
                </TableCell>
              </TableRow>
            ) : (
              unidades.map((u) => {
                const esAcople = ES_ACOPLE.has(u.clase);
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{u.placa}</span>
                        {esAcople && (
                          <Tooltip>
                            <TooltipTrigger render={<span className="inline-flex" />}>
                              <Link2Icon className="text-muted-foreground size-3.5" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Acople: circula enganchado a un tracto — el
                              manifiesto lleva doble placa.
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {u.clase.charAt(0) + u.clase.slice(1).toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <BadgeCategoria categoria={u.categoriaVehicular} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {chipColor(u.color)}
                        <div className="leading-tight">
                          <div className="font-medium">
                            {[u.marca, u.modelo].filter(Boolean).join(" ") || "—"}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {[u.tipoVehiculo, u.anio, u.numeroEjes && `${u.numeroEjes} ejes`]
                              .filter(Boolean)
                              .join(" · ")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {u.capacidadCarga ? (
                        <span className="tabular-nums">{u.capacidadCarga} t</span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {u.registroMtc && u.registroMtc !== "NC" ? (
                        <div className="leading-tight">
                          <div className="text-sm">{u.registroMtc}</div>
                          {u.mtcVigencia && (
                            <div className="text-muted-foreground text-xs">
                              vence {new Date(u.mtcVigencia).toLocaleDateString("es-PE")}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          {u.registroMtc === "NC" ? "No corresponde" : "—"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={ESTILO_ESTADO[u.estadoUnidad] ?? ""}>
                        {u.estadoUnidad.replace("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {paginacion && paginacion.totalPaginas > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Página {paginacion.pagina} de {paginacion.totalPaginas} · {paginacion.total} unidades
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={!paginacion.tieneAnterior} onClick={() => setPage((p) => p - 1)}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled={!paginacion.tieneSiguiente} onClick={() => setPage((p) => p + 1)}>
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
