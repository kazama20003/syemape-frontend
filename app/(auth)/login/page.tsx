import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "./login-form";

export const metadata = {
  title: "Iniciar sesión",
  description: "Accede a la plataforma de S&E MAPE E.I.R.L.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="u-container mx-auto grid min-h-screen max-w-[96rem] items-stretch gap-8 py-8 md:grid-cols-[1fr_1.1fr] md:gap-16 md:py-12">
      <div className="flex flex-col">
        <Link href="/" className="logo-text text-dark">mape.</Link>
        <div className="relative mt-8 min-h-[13rem] flex-1 overflow-clip rounded-lg bg-dark">
          <img
            src="https://res.cloudinary.com/demzflxgq/image/upload/f_auto,q_auto,w_1200/v1788539055/agent_generate_image_-_A_rugged_4x4_double-cab_pickup_truck__styled_like_a_Toyota_H__fx8nft.png"
            alt="Camioneta 4x4 de S&E MAPE"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
        </div>
        <div className="mt-8">
          <p className="flex items-center gap-3 text-[1.05rem]">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-dark text-light">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
              </svg>
            </span>
            +51 990 297 657
          </p>
          <p className="mt-4 max-w-[36rem] text-[0.95rem] leading-[1.6] text-dark/80">
            Accede a la plataforma de S&amp;E MAPE E.I.R.L. para gestionar tus operaciones de
            transporte, supervisión y escolta en ruta. Si aún no tienes una cuenta, escríbenos y
            te ayudamos a empezar.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center md:pl-4">
        <p className="eyebrow text-brand">Acceso</p>
        <h1 className="mt-3 text-[length:var(--text-fluid-h2)] leading-[1.1]">Inicia sesión</h1>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
