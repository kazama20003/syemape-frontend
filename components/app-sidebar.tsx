"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangleIcon,
  PackageIcon,
  Building2Icon,
  ChartColumnIcon,
  ChevronRightIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  ListTreeIcon,
  MapIcon,
  MapPinIcon,
  FileTextIcon,
  RouteIcon,
  ShieldCheckIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";

import { cerrarSesion, obtenerUsuario, type UsuarioSesion } from "@/lib/api";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type Rol = UsuarioSesion["rol"];

interface SubItemNav {
  title: string;
  url: string;
  roles?: Rol[];
}

interface ItemNav {
  title: string;
  // Con `items`, el item es un submenú desplegable y `url` es opcional.
  url?: string;
  icon: React.ReactNode;
  // Roles que ven este item. Sin lista: lo ven todos los roles.
  roles?: Rol[];
  items?: SubItemNav[];
}

const STAFF: Rol[] = ["ADMINISTRADOR", "OPERACIONES", "SUPERVISOR"];

const OPERACION: ItemNav[] = [
  { title: "Dashboard", url: "/dashboard", icon: <LayoutDashboardIcon /> },
  { title: "Manifiestos", url: "/dashboard/manifiestos", icon: <FileTextIcon /> },
  {
    title: "Incidencias",
    url: "/dashboard/incidencias",
    icon: <AlertTriangleIcon />,
    roles: [...STAFF, "CONDUCTOR"],
  },
];

const MAESTROS: ItemNav[] = [
  { title: "Activos", url: "/dashboard/activos", icon: <PackageIcon />, roles: STAFF },
  { title: "Unidades", url: "/dashboard/unidades", icon: <TruckIcon />, roles: STAFF },
  { title: "Personal", url: "/dashboard/personal", icon: <UsersIcon />, roles: STAFF },
  { title: "Clientes", url: "/dashboard/clientes", icon: <Building2Icon />, roles: STAFF },
  { title: "Rutas", url: "/dashboard/rutas", icon: <RouteIcon />, roles: STAFF },
  { title: "Ubicaciones", url: "/dashboard/ubicaciones", icon: <MapPinIcon />, roles: STAFF },
  {
    title: "Catálogos",
    icon: <ListTreeIcon />,
    roles: STAFF,
    items: [
      { title: "Tipos de vehículo", url: "/dashboard/tipos-vehiculo" },
      { title: "Tipos de servicio", url: "/dashboard/tipos-servicio" },
    ],
  },
];

const ADMINISTRACION: ItemNav[] = [
  {
    title: "Usuarios",
    url: "/dashboard/usuarios",
    icon: <ShieldCheckIcon />,
    roles: ["ADMINISTRADOR"],
  },
  {
    title: "Historial",
    url: "/dashboard/historial",
    icon: <HistoryIcon />,
    roles: ["ADMINISTRADOR", "OPERACIONES"],
  },
  { title: "Reportes", url: "/dashboard/reportes", icon: <ChartColumnIcon /> },
];

// Item con submenú desplegable; se abre solo cuando una ruta hija está activa.
function SubMenuNav({
  item,
  rol,
  pathname,
}: {
  item: ItemNav;
  rol: Rol | null;
  pathname: string;
}) {
  const subVisibles = (item.items ?? []).filter(
    (sub) => !sub.roles || (rol !== null && sub.roles.includes(rol)),
  );
  const hayActivo = subVisibles.some((sub) => pathname.startsWith(sub.url));
  // null = sin preferencia manual: abierto solo si hay una ruta hija activa.
  const [manual, setManual] = React.useState<boolean | null>(null);
  const abierto = manual ?? hayActivo;
  const setAbierto = (fn: (prev: boolean) => boolean) => setManual(fn(abierto));
  if (subVisibles.length === 0) return null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.title}
        onClick={() => setAbierto((prev) => !prev)}
        aria-expanded={abierto}
      >
        {item.icon}
        <span>{item.title}</span>
        <ChevronRightIcon
          className={`ml-auto size-4 transition-transform ${abierto ? "rotate-90" : ""}`}
        />
      </SidebarMenuButton>
      {abierto && (
        <SidebarMenuSub>
          {subVisibles.map((sub) => (
            <SidebarMenuSubItem key={sub.title}>
              <SidebarMenuSubButton
                isActive={pathname.startsWith(sub.url)}
                className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-medium"
                render={<Link href={sub.url} />}
              >
                <span>{sub.title}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}

function GrupoNav({
  label,
  items,
  rol,
}: {
  label: string;
  items: ItemNav[];
  rol: Rol | null;
}) {
  const pathname = usePathname();
  const visibles = items.filter(
    (item) => !item.roles || (rol !== null && item.roles.includes(rol)),
  );
  if (visibles.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[0.68rem] uppercase tracking-[0.14em]">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {visibles.map((item) =>
            item.items ? (
              <SubMenuNav key={item.title} item={item} rol={rol} pathname={pathname} />
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={
                    item.url === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.url ?? "")
                  }
                  className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-medium"
                  render={<Link href={item.url ?? "#"} />}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ),
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [sesion, setSesion] = React.useState<UsuarioSesion | null>(null);
  React.useEffect(() => {
    setSesion(obtenerUsuario());
  }, []);

  const rol = sesion?.rol ?? null;
  const user = {
    name: sesion?.nombre ?? "Usuario",
    email: sesion?.email ?? "",
    avatar: "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent active:bg-transparent"
              render={<Link href="/dashboard" />}
            >
              <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
                <MapIcon className="size-4" />
              </div>
              <div className="grid flex-1 leading-tight">
                <span className="truncate text-base font-bold tracking-tight">
                  mape<span className="text-primary">.</span>
                </span>
                <span className="text-muted-foreground truncate text-[0.65rem] uppercase tracking-[0.18em]">
                  S&amp;E MAPE E.I.R.L.
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <GrupoNav label="Operación" items={OPERACION} rol={rol} />
        <GrupoNav label="Maestros" items={MAESTROS} rol={rol} />
        <GrupoNav label="Administración" items={ADMINISTRACION} rol={rol} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} onLogout={cerrarSesion} />
      </SidebarFooter>
    </Sidebar>
  );
}
