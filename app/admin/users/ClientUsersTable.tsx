"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search, Filter, MoreHorizontal, Eye, Edit, Ban,
  CheckCircle, XCircle, Globe, MapPin
} from "lucide-react"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import type { ProfileRow } from "./page"

function formatDateES(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return "—"
  }
}

function StatusBadge() {
  // Placeholder: sin campo `status`, mostramos “Activo” fijo
  return (
    <Badge className="bg-green-100 text-green-800">
      <CheckCircle className="w-3 h-3 mr-1" />
      Activo
    </Badge>
  )
}

export default function ClientUsersTable({ users }: { users: ProfileRow[] }) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let base = users
    if (q) {
      base = users.filter((u) => {
        const n = (u.name ?? "").toLowerCase()
        const un = (u.username ?? "").toLowerCase()
        const em = (u.email ?? "").toLowerCase()
        return n.includes(q) || un.includes(q) || em.includes(q)
      })
    }
    // Placeholder de estado: todo “activo”; si filtra “suspendidos” => vacío
    if (statusFilter === "suspended") return []
    return base
  }, [users, query, statusFilter])

  return (
    <div className="p-4">
      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, usuario o email..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="suspended">Suspendidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla Usuarios (con encabezados como el ejemplo) */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Usuario</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Ubicación</th>
              <th className="text-left p-4">Registro</th>
              <th className="text-left p-4">Estado</th>
              <th className="text-left p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={u.avatar ?? ""} />
                      <AvatarFallback>
                        {(u.username ?? u.name ?? "?").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{u.name ?? "—"}</p>
                      <p className="text-sm text-gray-500">@{u.username ?? "sin-usuario"}</p>
                      {/* Sin bio dinámica en este contexto */}
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <p className="text-sm break-all">{u.email ?? "—"}</p>
                </td>

                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-sm">Granada, España</span>
                  </div>
                </td>

                <td className="p-4">
                  <p className="text-sm">{u.created_at ? formatDateES(u.created_at) : "—"}</p>
                </td>

                <td className="p-4">
                  <StatusBadge />
                </td>

                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/profile/${u.id}`} className="flex items-center">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar usuario
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled className="text-red-600">
                        <Ban className="w-4 h-4 mr-2" />
                        Suspender
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-6 text-sm text-muted-foreground">No hay usuarios que coincidan.</div>
        )}
      </div>
    </div>
  )
}
