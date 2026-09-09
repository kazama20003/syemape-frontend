"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError, iniciarSesion } from "@/lib/api";

// Formulario de acceso conectado al backend (POST /auth/login). Tras el login
// vuelve a la pagina guardada en ?next= (o al dashboard).
export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await iniciarSesion(email, password);
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError && err.estado === 401
          ? "Correo o contraseña incorrectos."
          : err instanceof Error
            ? err.message
            : "No se pudo iniciar sesión. Intenta de nuevo.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <form className="mt-10" onSubmit={onSubmit}>
      <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
        <label className="block">
          <span className="block text-[0.95rem]">Correo electrónico</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="mt-3 w-full border-b border-dark/40 bg-transparent pb-2 text-[0.95rem] outline-none placeholder:text-dark/35 focus:border-dark"
          />
        </label>
        <label className="block">
          <span className="block text-[0.95rem]">Contraseña</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            className="mt-3 w-full border-b border-dark/40 bg-transparent pb-2 text-[0.95rem] outline-none placeholder:text-dark/35 focus:border-dark"
          />
        </label>
      </div>
      {error && (
        <p className="mt-6 rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 text-[0.85rem] text-brand">
          {error}
        </p>
      )}
      <div className="mt-8 flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-[0.8rem] text-dark/80">
          <input type="checkbox" className="h-4 w-4 accent-brand" defaultChecked />
          Recordarme en este equipo
        </label>
        <a href="#" className="text-[0.8rem] text-dark/80 underline-offset-4 hover:underline">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
      <button
        type="submit"
        disabled={cargando}
        className="mt-10 block h-14 w-full rounded-lg bg-dark text-center text-[0.95rem] text-light transition-colors duration-300 hover:bg-brand disabled:opacity-60"
      >
        {cargando ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
