"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError, api } from "@/lib/api";

export interface CampoForm {
  name: string;
  label: string;
  tipo?: "text" | "number" | "date" | "select" | "tel" | "email";
  opciones?: { valor: string; etiqueta: string }[];
  requerido?: boolean;
  placeholder?: string;
  // Ocupa las dos columnas del grid.
  ancho?: "full";
  ayuda?: string;
}

function mensajeDe(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "Ocurrió un error inesperado.";
}

// Dialogo generico "Nuevo <recurso>": arma el formulario desde la definicion
// de campos, hace POST al endpoint e invalida el listado para refrescarlo.
export default function FormDialog({
  recurso,
  descripcion,
  endpoint,
  campos,
  textoBoton,
}: {
  recurso: string;
  descripcion: string;
  endpoint: string;
  campos: CampoForm[];
  textoBoton?: string;
}) {
  const queryClient = useQueryClient();
  const [abierto, setAbierto] = useState(false);
  const [valores, setValores] = useState<Record<string, string>>({});

  const crear = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api(endpoint, { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => {
      toast.success(`${recurso} registrado.`);
      setAbierto(false);
      setValores({});
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
    onError: (e) => toast.error(mensajeDe(e)),
  });

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const body: Record<string, unknown> = {};
    for (const campo of campos) {
      const bruto = valores[campo.name];
      if (bruto === undefined || bruto === "") continue;
      body[campo.name] = campo.tipo === "number" ? Number(bruto) : bruto;
    }
    crear.mutate(body);
  };

  return (
    <>
      <Button onClick={() => setAbierto(true)}>
        <PlusIcon /> {textoBoton ?? `Nuevo ${recurso.toLowerCase()}`}
      </Button>
      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nuevo {recurso.toLowerCase()}</DialogTitle>
            <DialogDescription>{descripcion}</DialogDescription>
          </DialogHeader>
          <form onSubmit={enviar} className="grid gap-4 sm:grid-cols-2">
            {campos.map((campo) => (
              <div
                key={campo.name}
                className={`grid gap-2 ${campo.ancho === "full" ? "sm:col-span-2" : ""}`}
              >
                <Label htmlFor={campo.name}>
                  {campo.label}
                  {campo.requerido && <span className="text-primary"> *</span>}
                </Label>
                {campo.tipo === "select" ? (
                  <Select
                    value={valores[campo.name] ?? ""}
                    onValueChange={(v) =>
                      setValores((prev) => ({ ...prev, [campo.name]: v ?? "" }))
                    }
                  >
                    <SelectTrigger id={campo.name}>
                      <SelectValue placeholder={campo.placeholder ?? "Seleccionar…"} />
                    </SelectTrigger>
                    <SelectContent>
                      {campo.opciones?.map((o) => (
                        <SelectItem key={o.valor} value={o.valor}>
                          {o.etiqueta}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={campo.name}
                    type={campo.tipo ?? "text"}
                    required={campo.requerido}
                    placeholder={campo.placeholder}
                    value={valores[campo.name] ?? ""}
                    step={campo.tipo === "number" ? "any" : undefined}
                    onChange={(e) =>
                      setValores((prev) => ({ ...prev, [campo.name]: e.target.value }))
                    }
                  />
                )}
                {campo.ayuda && (
                  <p className="text-muted-foreground text-xs">{campo.ayuda}</p>
                )}
              </div>
            ))}
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={crear.isPending}>
                {crear.isPending ? "Guardando…" : "Registrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
