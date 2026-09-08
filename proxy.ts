import { NextResponse, type NextRequest } from "next/server";

// Protege el dashboard: sin cookie de sesion se redirige a /login guardando la
// pagina solicitada en ?next= para volver exactamente ahi tras iniciar sesion.
export function proxy(request: NextRequest) {
  const token = request.cookies.get("mape_token")?.value;
  const { pathname, search } = request.nextUrl;

  if (!token && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  // Con sesion activa, /login redirige directo al dashboard.
  if (token && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
