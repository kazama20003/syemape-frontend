// Consumo del API de usuarios (/auth/usuarios) — solo rol ADMINISTRADOR.
import { api } from "./api";

export type RolUsuario =
  | "ADMINISTRADOR"
  | "OPERACIONES"
  | "SUPERVISOR"
  | "CONDUCTOR"
  | "CLIENTE";

export const ROLES: RolUsuario[] = [
  "ADMINISTRADOR",
  "OPERACIONES",
  "SUPERVISOR",
  "CONDUCTOR",
  "CLIENTE",
];

export interface Usuario {
  id: number;
  publicId: string;
  email: string;
  nombre: string;
  rol: RolUsuario;
  clienteId: number | null;
  personalId: number | null;
  estadoActivo: "ACTIVO" | "INACTIVO";
  estadoRegistro: "ACTIVO" | "ANULADO";
}

export interface Paginacion {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
  tieneSiguiente: boolean;
  tieneAnterior: boolean;
}

export interface ListaUsuarios {
  datos: Usuario[];
  paginacion: Paginacion;
}

export interface CrearUsuarioInput {
  email: string;
  nombre: string;
  password: string;
  rol: RolUsuario;
}

export interface ActualizarUsuarioInput {
  nombre?: string;
  rol?: RolUsuario;
  password?: string;
  estadoActivo?: "ACTIVO" | "INACTIVO";
}

export function listarUsuarios(params: {
  texto?: string;
  rol?: string;
  page?: number;
}): Promise<ListaUsuarios> {
  const q = new URLSearchParams();
  if (params.texto) q.set("texto", params.texto);
  if (params.rol) q.set("rol", params.rol);
  q.set("page", String(params.page ?? 1));
  q.set("pageSize", "20");
  return api<ListaUsuarios>(`/auth/usuarios?${q.toString()}`);
}

export function crearUsuario(input: CrearUsuarioInput): Promise<{ datos: Usuario }> {
  return api(`/auth/usuarios`, { method: "POST", body: JSON.stringify(input) });
}

export function actualizarUsuario(
  id: number,
  input: ActualizarUsuarioInput,
): Promise<{ datos: Usuario }> {
  return api(`/auth/usuarios/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function anularUsuario(id: number): Promise<{ datos: Usuario }> {
  return api(`/auth/usuarios/${id}`, { method: "DELETE" });
}
