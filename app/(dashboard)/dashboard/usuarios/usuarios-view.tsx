"use client";

import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  EllipsisVerticalIcon,
  PlusIcon,
  SearchIcon,
  ShieldIcon,
  UserRoundXIcon,
  PencilIcon,
  PowerIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, obtenerUsuario } from "@/lib/api";
import {
  ROLES,
  type RolUsuario,
  type Usuario,
  actualizarUsuario,
  anularUsuario,
  crearUsuario,
  listarUsuarios,
} from "@/lib/usuarios";

const ETIQUETA_ROL: Record<RolUsuario, string> = {
  ADMINISTRADOR: "Administrador",
  OPERACIONES: "Operaciones",
  SUPERVISOR: "Supervisor",
  CONDUCTOR: "Conductor",
  CLIENTE: "Cliente",
};

interface FormularioUsuario {
  email: string;
  nombre: string;
  password: string;
  rol: RolUsuario;
}

const FORM_VACIO: FormularioUsuario = {
  email: "",
  nombre: "",
  password: "",
  rol: "OPERACIONES",
};

function mensajeDe(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "Ocurrió un error inesperado.";
}

export default function UsuariosView() {
  const queryClient = useQueryClient();
  const sesion = obtenerUsuario();

  const [texto, setTexto] = useState("");
  const [rolFiltro, setRolFiltro] = useState<string>("TODOS");
  const [page, setPage] = useState(1);

  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState<FormularioUsuario>(FORM_VACIO);
  const [porAnular, setPorAnular] = useState<Usuario | null>(null);

  // Listado con refetch periodico: cambios hechos por otros admins aparecen
  // solos sin recargar la pagina.
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["usuarios", { texto, rolFiltro, page }],
    queryFn: () =>
      listarUsuarios({
        texto: texto || undefined,
        rol: rolFiltro === "TODOS" ? undefined : rolFiltro,
        page,
      }),
    placeholderData: keepPreviousData,
    refetchInterval: 10_000,
  });

  const invalidar = () =>
    queryClient.invalidateQueries({ queryKey: ["usuarios"] });

  const crear = useMutation({
    mutationFn: (input: FormularioUsuario) => crearUsuario(input),
    onSuccess: (r) => {
      toast.success(`Usuario ${r.datos.email} creado.`);
      setDialogoAbierto(false);
      invalidar();
    },
    onError: (e) => toast.error(mensajeDe(e)),
  });

  const actualizar = useMutation({
    mutationFn: ({ id, ...input }: { id: number } & Partial<FormularioUsuario> & {
      estadoActivo?: "ACTIVO" | "INACTIVO";
    }) => actualizarUsuario(id, input),
    onSuccess: (r) => {
      toast.success(`Usuario ${r.datos.email} actualizado.`);
      setDialogoAbierto(false);
      setEditando(null);
      invalidar();
    },
    onError: (e) => toast.error(mensajeDe(e)),
  });

  const anular = useMutation({
    mutationFn: (id: number) => anularUsuario(id),
    // Actualizacion optimista: la fila desaparece al instante y se revierte si
    // el servidor rechaza.
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["usuarios"] });
      const previas = queryClient.getQueriesData({ queryKey: ["usuarios"] });
      queryClient.setQueriesData(
        { queryKey: ["usuarios"] },
        (vieja: { datos: Usuario[] } | undefined) =>
          vieja
            ? { ...vieja, datos: vieja.datos.filter((u) => u.id !== id) }
            : vieja,
      );
      return { previas };
    },
    onError: (e, _id, ctx) => {
      ctx?.previas.forEach(([key, valor]) => queryClient.setQueryData(key, valor));
      toast.error(mensajeDe(e));
    },
    onSuccess: (r) => toast.success(`Usuario ${r.datos.email} anulado.`),
    onSettled: () => invalidar(),
  });

  const abrirCrear = () => {
    setEditando(null);
    setForm(FORM_VACIO);
    setDialogoAbierto(true);
  };

  const abrirEditar = (usuario: Usuario) => {
    setEditando(usuario);
    setForm({
      email: usuario.email,
      nombre: usuario.nombre,
      password: "",
      rol: usuario.rol,
    });
    setDialogoAbierto(true);
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (editando) {
      actualizar.mutate({
        id: editando.id,
        nombre: form.nombre,
        rol: form.rol,
        ...(form.password ? { password: form.password } : {}),
      });
    } else {
      crear.mutate(form);
    }
  };

  const usuarios = data?.datos ?? [];
  const paginacion = data?.paginacion;

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground text-sm">
            Cuentas de acceso al sistema y sus roles.
            {isFetching && !isLoading && (
              <span className="ml-2 text-xs">Actualizando…</span>
            )}
          </p>
        </div>
        <Button onClick={abrirCrear}>
          <PlusIcon /> Nuevo usuario
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-xs">
          <SearchIcon className="text-muted-foreground absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nombre o email…"
            className="pl-8"
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={rolFiltro}
          onValueChange={(v) => {
            setRolFiltro(v ?? "TODOS");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos los roles</SelectItem>
            {ROLES.map((rol) => (
              <SelectItem key={rol} value={rol}>
                {ETIQUETA_ROL[rol]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                  No hay usuarios que coincidan.
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.nombre}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <ShieldIcon className="size-3" />
                      {ETIQUETA_ROL[usuario.rol]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={usuario.estadoActivo === "ACTIVO" ? "default" : "secondary"}
                    >
                      {usuario.estadoActivo === "ACTIVO" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="size-8" />
                        }
                      >
                        <EllipsisVerticalIcon />
                        <span className="sr-only">Acciones</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => abrirEditar(usuario)}>
                          <PencilIcon /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            actualizar.mutate({
                              id: usuario.id,
                              estadoActivo:
                                usuario.estadoActivo === "ACTIVO"
                                  ? "INACTIVO"
                                  : "ACTIVO",
                            })
                          }
                        >
                          <PowerIcon />
                          {usuario.estadoActivo === "ACTIVO" ? "Inactivar" : "Activar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          disabled={usuario.email === sesion?.email}
                          onClick={() => setPorAnular(usuario)}
                        >
                          <UserRoundXIcon /> Anular
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {paginacion && paginacion.totalPaginas > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Página {paginacion.pagina} de {paginacion.totalPaginas} ·{" "}
            {paginacion.total} usuarios
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!paginacion.tieneAnterior}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!paginacion.tieneSiguiente}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Crear / editar */}
      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editando ? `Editar ${editando.email}` : "Nuevo usuario"}
            </DialogTitle>
            <DialogDescription>
              {editando
                ? "Cambia el nombre, rol o contraseña."
                : "Crea una cuenta de acceso al sistema."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={enviar} className="grid gap-4">
            {!editando && (
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="usuario@syemape.com"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre y apellido"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">
                Contraseña {editando && "(dejar vacío para no cambiarla)"}
              </Label>
              <Input
                id="password"
                type="password"
                required={!editando}
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className="grid gap-2">
              <Label>Rol</Label>
              <Select
                value={form.rol}
                onValueChange={(v) => setForm({ ...form, rol: (v ?? form.rol) as RolUsuario })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((rol) => (
                    <SelectItem key={rol} value={rol}>
                      {ETIQUETA_ROL[rol]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogoAbierto(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={crear.isPending || actualizar.isPending}>
                {crear.isPending || actualizar.isPending
                  ? "Guardando…"
                  : editando
                    ? "Guardar cambios"
                    : "Crear usuario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmar anulacion */}
      <AlertDialog open={!!porAnular} onOpenChange={(v) => !v && setPorAnular(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Anular a {porAnular?.email}?</AlertDialogTitle>
            <AlertDialogDescription>
              El usuario no podrá iniciar sesión. El registro queda en el
              historial de auditoría (borrado lógico, no se elimina).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (porAnular) anular.mutate(porAnular.id);
                setPorAnular(null);
              }}
            >
              Anular
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
