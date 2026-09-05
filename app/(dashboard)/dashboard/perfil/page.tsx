"use client";

import { useQuery } from "@tanstack/react-query";
import { ShieldCheckIcon, UserRoundIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api, obtenerUsuario } from "@/lib/api";

const DESCRIPCION_ROL: Record<string, string> = {
  ADMINISTRADOR:
    "Acceso total: gestiona usuarios, catálogos, manifiestos y auditoría.",
  OPERACIONES: "Gestiona la operación diaria: manifiestos, unidades y personal.",
  SUPERVISOR: "Registra check-ins, incidencias y supervisa servicios en ruta.",
  CONDUCTOR: "Consulta sus manifiestos asignados y registra novedades.",
  CLIENTE: "Consulta únicamente los manifiestos y reportes de su empresa.",
};

interface Perfil {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  clienteId: number | null;
}

export default function PerfilPage() {
  // /auth/me valida el token contra el backend: si expiró, redirige a login.
  const { data, isLoading } = useQuery({
    queryKey: ["perfil"],
    queryFn: () => api<{ datos: Perfil }>("/auth/me"),
  });

  const perfil = data?.datos ?? obtenerUsuario();

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mi perfil</h1>
        <p className="text-muted-foreground text-sm">
          Datos de la cuenta con la que iniciaste sesión.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRoundIcon className="size-4" /> Cuenta
            </CardTitle>
            <CardDescription>Identidad del usuario en sesión.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            {isLoading && !perfil ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Nombre</span>
                  <span className="font-medium">{perfil?.nombre}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{perfil?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID de usuario</span>
                  <span className="font-medium">#{perfil?.id}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheckIcon className="size-4" /> Rol y permisos
            </CardTitle>
            <CardDescription>Lo que tu rol permite hacer.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div>
              <Badge className="text-sm">{perfil?.rol}</Badge>
            </div>
            <p className="text-muted-foreground">
              {perfil ? DESCRIPCION_ROL[perfil.rol] : ""}
            </p>
            {perfil?.clienteId && (
              <p className="text-muted-foreground">
                Vinculado al cliente #{perfil.clienteId}: solo ve la información
                de su empresa.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
