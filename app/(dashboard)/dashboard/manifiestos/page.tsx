"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BanIcon,
  CheckCircle2Icon,
  FileTextIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SendIcon,
  TruckIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";
import { ApiError, api } from "@/lib/api";

const COLOR_ESTADO: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  BORRADOR: "outline",
  EMITIDO: "default",
  EN_RUTA: "default",
  CERRADO: "secondary",
  ANULADO: "destructive",
};

// Transiciones válidas — espejo de la máquina de estados del backend.
const TRANSICIONES: Record<string, { estado: string; etiqueta: string; icono: React.ReactNode }[]> = {
  BORRADOR: [
    { estado: "EMITIDO", etiqueta: "Emitir", icono: <SendIcon /> },
    { estado: "ANULADO", etiqueta: "Anular", icono: <BanIcon /> },
  ],
  EMITIDO: [
    { estado: "EN_RUTA", etiqueta: "Iniciar ruta", icono: <TruckIcon /> },
    { estado: "ANULADO", etiqueta: "Anular", icono: <BanIcon /> },
  ],
  EN_RUTA: [
    { estado: "CERRADO", etiqueta: "Cerrar servicio", icono: <CheckCircle2Icon /> },
    { estado: "ANULADO", etiqueta: "Anular", icono: <BanIcon /> },
  ],
  CERRADO: [],
  ANULADO: [],
};

interface Manifiesto {
  id: number;
  numero: string;
  estado: string;
  fechaServicio: string;
  origen: string;
  destino: string;
  unidad: { placa: string };
  conductor: { nombres: string; apellidos: string };
  cliente: { razonSocial: string } | null;
  clienteTexto: string | null;
}

// Menú de acciones de fila: avanza el estado del manifiesto respetando las
// transiciones; anular pide confirmación.
function AccionesManifiesto({ manifiesto }: { manifiesto: Manifiesto }) {
  const queryClient = useQueryClient();
  const [confirmarAnular, setConfirmarAnular] = useState(false);

  const cambiar = useMutation({
    mutationFn: (estado: string) =>
      api(`/manifiestos/${manifiesto.id}/estado`, {
        method: "PATCH",
        body: JSON.stringify({ estado }),
      }),
    onSuccess: (_, estado) => {
      toast.success(`Manifiesto ${manifiesto.numero} → ${estado.replace("_", " ")}.`);
      queryClient.invalidateQueries({ queryKey: ["/manifiestos"] });
    },
    onError: (e) =>
      toast.error(e instanceof ApiError ? e.message : "No se pudo cambiar el estado."),
  });

  const transiciones = TRANSICIONES[manifiesto.estado] ?? [];
  if (transiciones.length === 0) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" aria-label={`Acciones de ${manifiesto.numero}`} />
          }
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            {transiciones.map((t) => (
              <DropdownMenuItem
                key={t.estado}
                variant={t.estado === "ANULADO" ? "destructive" : "default"}
                onClick={() =>
                  t.estado === "ANULADO" ? setConfirmarAnular(true) : cambiar.mutate(t.estado)
                }
              >
                {t.icono}
                {t.etiqueta}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmarAnular} onOpenChange={setConfirmarAnular}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Anular el manifiesto {manifiesto.numero}?</AlertDialogTitle>
            <AlertDialogDescription>
              Un manifiesto anulado es terminal: no podrá volver a usarse ni cambiar de estado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={() => cambiar.mutate("ANULADO")}
            >
              Anular
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const columnas: Columna<Manifiesto>[] = [
  { titulo: "Número", render: (m) => <span className="font-medium">{m.numero}</span> },
  { titulo: "Fecha", render: (m) => new Date(m.fechaServicio).toLocaleDateString("es-PE") },
  { titulo: "Trayecto", render: (m) => m.origen + " → " + m.destino },
  { titulo: "Unidad", render: (m) => m.unidad.placa },
  { titulo: "Conductor", render: (m) => m.conductor.nombres + " " + m.conductor.apellidos },
  { titulo: "Cliente", render: (m) => m.cliente?.razonSocial ?? m.clienteTexto ?? "—" },
  {
    titulo: "Estado",
    render: (m) => <Badge variant={COLOR_ESTADO[m.estado] ?? "outline"}>{m.estado.replace("_", " ")}</Badge>,
  },
  { titulo: "", render: (m) => <AccionesManifiesto manifiesto={m} /> },
];

export default function Page() {
  return (
    <RecursoLista<Manifiesto>
      icono={<FileTextIcon />}
      titulo="Manifiestos"
      descripcion="Manifiestos de viaje: transporte, supervisión y escolta."
      endpoint="/manifiestos"
      campoBusqueda="numero"
      columnas={columnas}
      acciones={
        <Link href="/dashboard/manifiestos/nueva" className={cn(buttonVariants())}>
          <PlusIcon /> Nuevo manifiesto
        </Link>
      }
    />
  );
}
