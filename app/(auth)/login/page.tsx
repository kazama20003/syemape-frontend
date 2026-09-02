export default function LoginPage() {
  return (
    <div className="w-full max-w-sm rounded-[var(--radius-main)] bg-light p-8 text-dark shadow-xl">
      <p className="eyebrow text-brand">Bienvenido</p>
      <h1 className="mt-3 text-[length:var(--text-fluid-h3)]">Iniciar sesión</h1>
      <form className="mt-8 flex flex-col gap-4" action="#">
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider">
          Correo
          <input
            type="email"
            placeholder="tu@correo.com"
            className="h-11 rounded-[0.375rem] border border-dark/20 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-brand"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider">
          Contraseña
          <input
            type="password"
            placeholder="••••••••"
            className="h-11 rounded-[0.375rem] border border-dark/20 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-brand"
          />
        </label>
        <button type="submit" className="button_main is-dark mt-2 justify-center">
          Entrar
        </button>
      </form>
    </div>
  );
}
