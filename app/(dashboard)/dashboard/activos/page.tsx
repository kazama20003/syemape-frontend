"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { ApiError, api } from "@/lib/api";
import ActivoForm from "@/components/activo-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Activo {
  id: number;
  codigo: string;
  nombre: string;
  tipo: string;
  descripcion: string | null;
  estadoOperativo: string;
}

const TIPOS = ["UNIDAD", "EQUIPO", "HERRAMIENTA", "INFRAESTRUCTURA", "OTRO"];
const ESTADOS = ["OPERATIVO", "EN_MANTENIMIENTO", "FUERA_DE_SERVICIO", "DE_BAJA"];
const ESTILOS_ESTADO: Record<string, string> = {
  OPERATIVO: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  EN_MANTENIMIENTO: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  FUERA_DE_SERVICIO: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
  DE_BAJA: "border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function ActivosPage() {
  const [texto, setTexto] = useState("");
  const [tipo, setTipo] = useState("TODOS");
  const [estado, setEstado] = useState("TODOS");
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["activos", { texto, tipo, estado, page }],
    queryFn: () => {
      const query = new URLSearchParams({ page: String(page), pageSize: "20" });
      if (texto) query.set("texto", texto);
      if (tipo !== "TODOS") query.set("tipo", tipo);
      if (estado !== "TODOS") query.set("estadoOperativo", estado);
      return api<{ datos: Activo[]; paginacion: { pagina: number; totalPaginas: number; total: number; tieneSiguiente: boolean; tieneAnterior: boolean } }>(`/activos?${query}`);
    },
    placeholderData: keepPreviousData,
    refetchInterval: 15_000,
  });
  const activos = data?.datos ?? [];
  const paginacion = data?.paginacion;

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Activos</h1>
          <p className="text-muted-foreground text-sm">Recursos corporativos de MAPE. Las unidades son activos vehiculares con su propio detalle operativo.{isFetching && !isLoading && <span className="ml-2 text-xs" aria-live="polite">Actualizando...</span>}</p>
        </div>
        <ActivoForm />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-64"><SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" /><Input className="pl-8" value={texto} onChange={(event) => { setTexto(event.target.value); setPage(1); }} placeholder="Buscar código o nombre..." /></div>
        <Select value={tipo} onValueChange={(value) => { setTipo(value ?? "TODOS"); setPage(1); }}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="TODOS">Todos los tipos</SelectItem>{TIPOS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
        <Select value={estado} onValueChange={(value) => { setEstado(value ?? "TODOS"); setPage(1); }}><SelectTrigger className="w-52"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="TODOS">Todos los estados</SelectItem>{ESTADOS.map((item) => <SelectItem key={item} value={item}>{item.replaceAll("_", " ")}</SelectItem>)}</SelectContent></Select>
      </div>
      {error ? <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3" role="alert"><p className="text-sm text-destructive">{error instanceof ApiError ? error.message : "No se pudieron cargar los activos."}</p><Button className="mt-3" variant="outline" size="sm" onClick={() => refetch()}>Reintentar</Button></div> : <div className="overflow-hidden rounded-lg border"><Table><TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Activo</TableHead><TableHead>Tipo</TableHead><TableHead>Estado operativo</TableHead></TableRow></TableHeader><TableBody>{isLoading ? Array.from({ length: 5 }).map((_, index) => <TableRow key={index}>{Array.from({ length: 4 }).map((__, cell) => <TableCell key={cell}><Skeleton className="h-5 w-full" /></TableCell>)}</TableRow>) : activos.length === 0 ? <TableRow><TableCell colSpan={4} className="text-muted-foreground h-24 text-center">No hay activos que coincidan.</TableCell></TableRow> : activos.map((activo) => <TableRow key={activo.id}><TableCell className="font-mono font-medium">{activo.codigo}</TableCell><TableCell><div className="font-medium">{activo.nombre}</div>{activo.descripcion && <div className="text-muted-foreground text-xs">{activo.descripcion}</div>}</TableCell><TableCell><Badge variant="outline">{activo.tipo}</Badge></TableCell><TableCell><Badge variant="outline" className={ESTILOS_ESTADO[activo.estadoOperativo] ?? ""}>{activo.estadoOperativo.replaceAll("_", " ")}</Badge></TableCell></TableRow>)}</TableBody></Table></div>}
      {paginacion && paginacion.totalPaginas > 1 && <div className="flex items-center justify-between"><p className="text-muted-foreground text-sm">Página {paginacion.pagina} de {paginacion.totalPaginas} · {paginacion.total} activos</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={!paginacion.tieneAnterior} onClick={() => setPage((current) => current - 1)}>Anterior</Button><Button variant="outline" size="sm" disabled={!paginacion.tieneSiguiente} onClick={() => setPage((current) => current + 1)}>Siguiente</Button></div></div>}
    </div>
  );
}
