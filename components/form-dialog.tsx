"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PencilIcon, PlusIcon } from "lucide-react";
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

// Dialogo generico para crear o editar recursos desde la definicion de campos.
export default function FormDialog({
  recurso,
  descripcion,
  endpoint,
  campos,
  textoBoton,
  registroId,
}: {
  recurso: string;
  descripcion: string;
  endpoint: string;
  campos: readonly CampoForm[];
  textoBoton?: string;
  registroId?: number;
}) {
  const queryClient = useQueryClient();
  const [abierto, setAbierto] = useState(false);
  const [valores, setValores] = useState<Record<string, string>>({});
  const [invalidos, setInvalidos] = useState<Set<string>>(new Set());
  const editando = registroId !== undefined;

  const { data: registro, isLoading: cargandoRegistro } = useQuery({
    queryKey: [endpoint, registroId],
    queryFn: () => api<{ datos: Record<string, unknown> }>(`${endpoint}/${registroId}`),
    enabled: abierto && editando,
  });

  useEffect(() => {
    if (!registro?.datos) return;
    setValores(
      campos.reduce<Record<string, string>>((valores, campo) => {
        const valor = registro.datos[campo.name];
        valores[campo.name] =
          valor == null
            ? ""
            : campo.tipo === "date" && typeof valor === "string"
              ? valor.slice(0, 10)
              : String(valor);
        return valores;
      }, {}),
    );
  }, [campos, registro]);

  const guardar = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api(editando ? `${endpoint}/${registroId}` : endpoint, {
        method: editando ? "PATCH" : "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      toast.success(`${recurso} ${editando ? "actualizado" : "registrado"}.`);
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
    guardar.mutate(body);
  };

  const abrir = () => {
    setValores({});
    setInvalidos(new Set());
    setAbierto(true);
  };

  return (
    <>
      <Button variant={editando ? "outline" : "default"} size={editando ? "sm" : "default"} onClick={abrir}>
        {editando ? <PencilIcon /> : <PlusIcon />}
        {textoBoton ?? (editando ? "Editar" : `Nuevo ${recurso.toLowerCase()}`)}
      </Button>
      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editando ? "Editar" : "Nuevo"} {recurso.toLowerCase()}</DialogTitle>
            <DialogDescription>{descripcion}</DialogDescription>
          </DialogHeader>
          {cargandoRegistro ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Spinner /> Cargando datos...
            </div>
          ) : (
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
              <Button type="submit" disabled={guardar.isPending} focusableWhenDisabled>
                {guardar.isPending && <Spinner data-icon="inline-start" />}
                {guardar.isPending ? "Guardando…" : editando ? "Guardar cambios" : "Registrar"}
              </Button>
            </DialogFooter>
            </FieldGroup>
          </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
