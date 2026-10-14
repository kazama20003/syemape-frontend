"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PencilIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { ApiError, api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TIPOS = ["EQUIPO", "HERRAMIENTA", "INFRAESTRUCTURA", "OTRO"];

interface ActivoEditable {
  id: number;
  codigo: string;
  nombre: string;
  tipo: string;
  descripcion: string | null;
}

export default function ActivoForm({ activo }: { activo?: ActivoEditable }) {
  const editando = Boolean(activo);
  const queryClient = useQueryClient();
  const [abierto, setAbierto] = useState(false);
  const [codigo, setCodigo] = useState(activo?.codigo ?? "");
  const [nombre, setNombre] = useState(activo?.nombre ?? "");
  const [tipo, setTipo] = useState(activo?.tipo ?? "");
  const [descripcion, setDescripcion] = useState(activo?.descripcion ?? "");

  const guardar = useMutation({
    mutationFn: () =>
      api(editando ? `/activos/${activo!.id}` : "/activos", {
        method: editando ? "PATCH" : "POST",
        body: JSON.stringify({ codigo, nombre, tipo, descripcion: descripcion || (editando ? null : undefined) }),
      }),
    onSuccess: () => {
      toast.success(editando ? `Activo ${codigo} actualizado.` : `Activo ${codigo} registrado.`);
      setAbierto(false);
      setCodigo("");
      setNombre("");
      setTipo("");
      setDescripcion("");
      queryClient.invalidateQueries({ queryKey: ["activos"] });
    },
    onError: (error) =>
      toast.error(error instanceof ApiError ? error.message : "No se pudo registrar el activo."),
  });

  return (
    <>
      <Button variant={editando ? "outline" : "default"} size={editando ? "sm" : "default"} onClick={() => setAbierto(true)} aria-label={editando ? `Editar activo ${activo?.codigo}` : undefined}>
        {editando ? <><PencilIcon /> Editar</> : <><PlusIcon /> Nuevo activo</>}
      </Button>
      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editando ? `Editar activo ${activo?.codigo}` : "Nuevo activo"}</DialogTitle>
            <DialogDescription>
              {editando ? "Actualiza los datos del recurso seleccionado." : "Registra equipos, herramientas, infraestructura u otros recursos de MAPE. Los vehículos se administran desde Unidades."}
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!codigo.trim() || !nombre.trim() || !tipo) {
                const id = !codigo.trim() ? "activo-codigo" : !nombre.trim() ? "activo-nombre" : "activo-tipo";
                toast.error("Completa todos los campos obligatorios.");
                document.getElementById(id)?.focus();
                return;
              }
              guardar.mutate();
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="activo-codigo">Código</Label>
              <Input id="activo-codigo" required value={codigo} onChange={(event) => setCodigo(event.target.value)} placeholder="EQ-001" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="activo-nombre">Nombre</Label>
              <Input id="activo-nombre" required value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder="Radio portátil Motorola" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="activo-tipo">Tipo</Label>
              <Select value={tipo} onValueChange={(value) => setTipo(value ?? "")}>
                <SelectTrigger id="activo-tipo"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {TIPOS.map((item) => <SelectItem key={item} value={item}>{item.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="activo-descripcion">Descripción</Label>
              <Input id="activo-descripcion" value={descripcion} onChange={(event) => setDescripcion(event.target.value)} placeholder="Serie, ubicación o detalle relevante" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAbierto(false)}>Cancelar</Button>
              <Button type="submit" disabled={guardar.isPending} focusableWhenDisabled>{guardar.isPending ? "Guardando..." : editando ? "Guardar cambios" : "Registrar activo"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
