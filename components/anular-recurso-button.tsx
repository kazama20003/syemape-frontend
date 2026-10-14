"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { ApiError, api } from "@/lib/api";
import { Button } from "@/components/ui/button";
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

export default function AnularRecursoButton({
  endpoint,
  queryKey,
  recurso,
  nombre,
}: {
  endpoint: string;
  queryKey: string;
  recurso: string;
  nombre: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const queryClient = useQueryClient();
  const anular = useMutation({
    mutationFn: () => api(`${endpoint}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success(`${recurso} anulado correctamente.`);
      setAbierto(false);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof ApiError ? error.message : `No se pudo anular ${recurso.toLowerCase()}.`);
    },
  });

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="text-destructive hover:text-destructive"
        aria-label={`Eliminar ${recurso.toLowerCase()} ${nombre}`}
        onClick={() => setAbierto(true)}
      >
        <Trash2Icon /> Eliminar
      </Button>
      <AlertDialog open={abierto} onOpenChange={(open) => !anular.isPending && setAbierto(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar {recurso.toLowerCase()} {nombre}?</AlertDialogTitle>
            <AlertDialogDescription>
              El registro se anulará y dejará de aparecer como activo. Esta acción conserva su historial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={anular.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={anular.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                anular.mutate();
              }}
            >
              {anular.isPending ? "Eliminando…" : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
