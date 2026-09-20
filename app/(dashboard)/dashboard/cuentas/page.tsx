"use client";
import { Building2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";
import FormDialog, { type CampoForm } from "@/components/form-dialog";
interface Cuenta { id: number; codigo: string; nombre: string; descripcion: string | null; estadoActivo: string; }
const campos: CampoForm[] = [{ name: "codigo", label: "Código", requerido: true }, { name: "nombre", label: "Nombre", requerido: true }, { name: "descripcion", label: "Descripción", ancho: "full" }, { name: "estadoActivo", label: "Estado", tipo: "select", opciones: [{ valor: "ACTIVO", etiqueta: "Activo" }, { valor: "INACTIVO", etiqueta: "Inactivo" }] }];
const columnas: Columna<Cuenta>[] = [{ titulo: "Código", render: (c) => <code className="text-xs">{c.codigo}</code> }, { titulo: "Nombre", render: (c) => <span className="font-medium">{c.nombre}</span> }, { titulo: "Descripción", render: (c) => c.descripcion ?? "—" }, { titulo: "Estado", render: (c) => <Badge variant={c.estadoActivo === "ACTIVO" ? "default" : "secondary"}>{c.estadoActivo}</Badge> }];
export default function Page() { return <RecursoLista icono={<Building2Icon />} titulo="Cuentas" descripcion="Catálogo de cuentas comerciales para unidades y manifiestos." endpoint="/cuentas" columnas={columnas} accionFila={(cuenta) => <FormDialog recurso="Cuenta" descripcion="Cuenta comercial administrable." endpoint="/cuentas" registroId={cuenta.id} campos={campos} />} acciones={<FormDialog recurso="Cuenta" descripcion="Cuenta comercial administrable." endpoint="/cuentas" textoBoton="Nueva cuenta" campos={campos} />} />; }
