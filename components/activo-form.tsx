"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { ApiError, api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TIPOS = ["EQUIPO", "HERRAMIENTA", "INFRAESTRUCTURA", "OTRO"];

export default function ActivoForm() {
  const queryClient = useQueryClient();
  const [abierto, setAbierto] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const crear = useMutation({
    mutationFn: () =>
      api("/activos", {
        method: "POST",
        body: JSON.stringify({ codigo, nombre, tipo, descripcion: descripcion || undefined }),
      }),
    onSuccess: () => {
      toast.success(`Activo ${codigo} registrado.`);
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
      <Button onClick={() => setAbierto(true)}>
        <PlusIcon /> Nuevo activo
      </Button>
      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nuevo activo</DialogTitle>
            <DialogDescription>
              Registra equipos, herramientas, infraestructura u otros recursos de MAPE. Los vehículos se registran desde Unidades.
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
              crear.mutate();
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
              <Button type="submit" disabled={crear.isPending} focusableWhenDisabled>{crear.isPending ? "Guardando..." : "Registrar activo"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
