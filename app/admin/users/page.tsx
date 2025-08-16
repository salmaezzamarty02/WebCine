import { createClient } from "@/lib/supabaseServer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import ClientUsersTable from "./ClientUsersTable"

export const dynamic = "force-dynamic"

export type ProfileRow = {
  id: string
  name: string | null
  username: string | null
  email: string | null
  created_at: string | null
  avatar: string | null
}

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("id,name,username,email,created_at,avatar")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">Error cargando usuarios: {error.message}</p>
      </div>
    )
  }

  const users = (data ?? []) as ProfileRow[]

  // Métricas (solo con los campos disponibles)
  const totalUsuarios = users.length
  const usuariosActivos = totalUsuarios          // placeholder: sin campo status, se asume "activos"
  const suspendidos = 0                          // placeholder: sin campo status
  const ahora = new Date()
  const nuevosEsteMes = users.filter((u) => {
    if (!u.created_at) return false
    const d = new Date(u.created_at)
    return d.getUTCFullYear() === ahora.getUTCFullYear() && d.getUTCMonth() === ahora.getUTCMonth()
  }).length

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">Administra todos los usuarios de la plataforma</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold">{totalUsuarios}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold">{usuariosActivos}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspendidos</p>
                <p className="text-2xl font-bold">{suspendidos}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nuevos (Este mes)</p>
                <p className="text-2xl font-bold">{nuevosEsteMes}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listado + Filtros + Tabla (con columnas como el ejemplo) */}
      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ClientUsersTable users={users} />
        </CardContent>
      </Card>
    </div>
  )
}
