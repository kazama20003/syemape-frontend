"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
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
  // Select con opciones cargadas desde un maestro de la API: usa el `id` como
  // valor y `nombre` como etiqueta; el valor se envia como numero.
  opcionesEndpoint?: string;
  requerido?: boolean;
  placeholder?: string;
  // Ocupa las dos columnas del grid.
  ancho?: "full";
  ayuda?: string;
  mayusculas?: boolean;
}

// Select cuyas opciones vienen de un endpoint paginado del backend.
function SelectRemoto({
  campo,
  valor,
  onChange,
}: {
  campo: CampoForm;
  valor: string;
  onChange: (v: string) => void;
}) {
  const { data } = useQuery({
    queryKey: [campo.opcionesEndpoint, "opciones"],
    queryFn: () =>
      api<{ datos: { id: number; nombre: string }[] }>(
        `${campo.opcionesEndpoint}?pageSize=200`,
      ),
    staleTime: 60_000,
  });
  const opciones = data?.datos ?? [];
  return (
    <Select
      value={valor}
      onValueChange={(v) => onChange(v ?? "")}
      items={opciones.map((o) => ({ value: String(o.id), label: o.nombre }))}
    >
      <SelectTrigger id={`form-${campo.name}`}>
        <SelectValue placeholder={campo.placeholder ?? "Seleccionar…"} />
      </SelectTrigger>
      <SelectContent>
        {opciones.map((o) => (
          <SelectItem key={o.id} value={String(o.id)}>
            {o.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
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
  const [invalidos, setInvalidos] = useState<Set<string>>(new Set());

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
    const faltantes = campos.filter(
      (campo) => campo.requerido && !valores[campo.name]?.trim(),
    );
    if (faltantes.length > 0) {
      setInvalidos(new Set(faltantes.map((c) => c.name)));
      toast.error(`Completa el campo obligatorio: ${faltantes[0].label}.`);
      document.getElementById(`form-${faltantes[0].name}`)?.focus();
      return;
    }
    setInvalidos(new Set());
    const body: Record<string, unknown> = {};
    for (const campo of campos) {
      const bruto = valores[campo.name];
      if (bruto === undefined || bruto === "") continue;
      body[campo.name] =
        campo.tipo === "number" || campo.opcionesEndpoint ? Number(bruto) : bruto;
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
          <form onSubmit={enviar}>
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
            {campos.map((campo) => (
              <Field
                key={campo.name}
                data-invalid={invalidos.has(campo.name) || undefined}
                className={campo.ancho === "full" ? "sm:col-span-2" : undefined}
              >
                <FieldLabel htmlFor={`form-${campo.name}`}>
                  {campo.label}
                  {campo.requerido && <span className="text-primary"> *</span>}
                </FieldLabel>
                {campo.opcionesEndpoint ? (
                  <SelectRemoto
                    campo={campo}
                    valor={valores[campo.name] ?? ""}
                    onChange={(v) => {
                      setInvalidos((prev) => {
                        if (!prev.has(campo.name)) return prev;
                        const sig = new Set(prev);
                        sig.delete(campo.name);
                        return sig;
                      });
                      setValores((prev) => ({ ...prev, [campo.name]: v }));
                    }}
                  />
                ) : campo.tipo === "select" ? (
                  <Select
                    value={valores[campo.name] ?? ""}
                    onValueChange={(v) => {
                      setInvalidos((prev) => {
                        if (!prev.has(campo.name)) return prev;
                        const sig = new Set(prev);
                        sig.delete(campo.name);
                        return sig;
                      });
                      setValores((prev) => ({ ...prev, [campo.name]: v ?? "" }));
                    }}
                    items={campo.opciones?.map((o) => ({ value: o.valor, label: o.etiqueta }))}
                  >
                    <SelectTrigger id={`form-${campo.name}`}>
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
                    id={`form-${campo.name}`}
                    type={campo.tipo ?? "text"}
                    aria-invalid={invalidos.has(campo.name) || undefined}
                    placeholder={campo.placeholder}
                    value={valores[campo.name] ?? ""}
                    step={campo.tipo === "number" ? "any" : undefined}
                    onChange={(e) => {
                      setInvalidos((prev) => {
                        if (!prev.has(campo.name)) return prev;
                        const sig = new Set(prev);
                        sig.delete(campo.name);
                        return sig;
                      });
                      setValores((prev) => ({
                        ...prev,
                        [campo.name]: campo.mayusculas
                          ? e.target.value.toUpperCase()
                          : e.target.value,
                      }));
                    }}
                  />
                )}
                {campo.ayuda && (
                  <p className="text-muted-foreground text-xs">{campo.ayuda}</p>
                )}
                {invalidos.has(campo.name) && (
                  <FieldError>Este campo es obligatorio.</FieldError>
                )}
              </Field>
            ))}
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={crear.isPending} focusableWhenDisabled>
                {crear.isPending && <Spinner data-icon="inline-start" />}
                {crear.isPending ? "Guardando…" : "Registrar"}
              </Button>
            </DialogFooter>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
