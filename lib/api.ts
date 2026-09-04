// Cliente HTTP del backend syemape (puerto 3020, prefijo /api).

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3020/api";

const TOKEN_KEY = "mape_token";
const USUARIO_KEY = "mape_usuario";

export interface UsuarioSesion {
  id: number;
  email: string;
  nombre: string;
  rol: "ADMINISTRADOR" | "OPERACIONES" | "SUPERVISOR" | "CONDUCTOR" | "CLIENTE";
  clienteId: number | null;
}

// --- Persistencia de sesion (localStorage + cookie para el middleware) ---

export function guardarSesion(token: string, usuario: UsuarioSesion) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  // La cookie solo la lee el middleware de Next para proteger /dashboard.
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 8}; samesite=lax`;
}

export function limpiarSesion() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USUARIO_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export function obtenerToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function obtenerUsuario(): UsuarioSesion | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USUARIO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UsuarioSesion;
  } catch {
    return null;
  }
}

// --- Fetch con token; si el token expiro, limpia la sesion y manda a login
// conservando la pagina actual en ?next= para volver exactamente ahi. ---

export class ApiError extends Error {
  constructor(
    public readonly estado: number,
    public readonly cuerpo: unknown,
    mensaje: string,
  ) {
    super(mensaje);
  }
}

export async function api<T = unknown>(
  ruta: string,
  init?: RequestInit,
): Promise<T> {
  const token = obtenerToken();
  const res = await fetch(`${API_URL}${ruta}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    limpiarSesion();
    const next = encodeURIComponent(
      window.location.pathname + window.location.search,
    );
    window.location.href = `/login?next=${next}`;
    throw new ApiError(401, null, "Sesion expirada.");
  }

  const cuerpo = await res.json().catch(() => null);
  if (!res.ok) {
    const detalle =
      (cuerpo as { detalle?: string; errores?: { mensaje: string }[] })
        ?.errores?.[0]?.mensaje ??
      (cuerpo as { detalle?: string })?.detalle ??
      `Error ${res.status}`;
    throw new ApiError(res.status, cuerpo, detalle);
  }
  return cuerpo as T;
}

// --- Autenticacion ---

export async function iniciarSesion(
  email: string,
  password: string,
): Promise<UsuarioSesion> {
  const { datos } = await api<{
    datos: { accessToken: string; usuario: UsuarioSesion };
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  guardarSesion(datos.accessToken, datos.usuario);
  return datos.usuario;
}

export async function cerrarSesion() {
  limpiarSesion();
  window.location.href = "/login";
}
