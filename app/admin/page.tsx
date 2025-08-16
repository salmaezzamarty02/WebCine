import Link from "next/link"
import {
  Users,
  Film,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  const adminSections = [
    {
      title: "Gestión de Películas",
      description: "Administrar catálogo de películas, géneros y metadatos",
      href: "/admin/edit-movie",
      icon: Film,
      color: "bg-blue-500/20 text-blue-500",
      stats: "8,932 películas",
    },
    {
      title: "Gestión de Eventos",
      description: "Crear, editar y administrar eventos de la plataforma",
      href: "/admin/edit-events",
      icon: Calendar,
      color: "bg-green-500/20 text-green-500",
      stats: "156 eventos activos",
    },
    {
      title: "Solicitudes de Eventos",
      description: "Revisar y aprobar solicitudes de eventos de usuarios",
      href: "/admin/event-requests",
      icon: FileText,
      color: "bg-orange-500/20 text-orange-500",
      stats: "23 pendientes",
    },
    {
      title: "Gestión de Usuarios",
      description: "Administrar cuentas de usuario, permisos y moderación",
      href: "/admin/users",
      icon: Users,
      color: "bg-purple-500/20 text-purple-500",
      stats: "1,245 usuarios",
    },
  ]

  const quickStats = [
    {
      title: "Usuarios Activos",
      value: "1,245",
      change: "+12%",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Eventos Este Mes",
      value: "34",
      change: "+8%",
      icon: Calendar,
      color: "text-green-500",
    },
    {
      title: "Solicitudes Pendientes",
      value: "23",
      change: "-5%",
      icon: Clock,
      color: "text-orange-500",
    },
    {
      title: "Reportes Abiertos",
      value: "7",
      change: "-15%",
      icon: AlertTriangle,
      color: "text-red-500",
    },
  ]

  const recentActivity = [
    {
      action: "Nuevo evento aprobado",
      details: "Debate: El cine de Almodóvar",
      time: "Hace 2 horas",
      status: "approved",
    },
    {
      action: "Usuario suspendido",
      details: "Miguel Sánchez por comportamiento inapropiado",
      time: "Hace 4 horas",
      status: "warning",
    },
    {
      action: "Película añadida",
      details: "Dune: Parte Dos agregada al catálogo",
      time: "Hace 6 horas",
      status: "success",
    },
    {
      action: "Solicitud de evento",
      details: "Maratón de Ciencia Ficción pendiente de revisión",
      time: "Hace 1 día",
      status: "pending",
    },
  ]

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-gray-400">Centro de control para gestionar la plataforma FilmSocial</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configuración
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                    {stat.change} vs mes anterior
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Admin Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {adminSections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-3 ${section.color}`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription className="mt-1">{section.description}</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">{section.stats}</p>
                <Link href={section.href}>
                  <Button variant="outline" size="sm">
                    Acceder
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Actividad Reciente
          </CardTitle>
          <CardDescription>Últimas acciones realizadas en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-gray-800">
                <div
                  className={`rounded-full p-2 ${
                    activity.status === "approved"
                      ? "bg-green-500/20"
                      : activity.status === "warning"
                        ? "bg-red-500/20"
                        : activity.status === "success"
                          ? "bg-blue-500/20"
                          : "bg-orange-500/20"
                  }`}
                >
                  {activity.status === "approved" && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {activity.status === "warning" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  {activity.status === "success" && <CheckCircle className="h-4 w-4 text-blue-500" />}
                  {activity.status === "pending" && <Clock className="h-4 w-4 text-orange-500" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-400">{activity.details}</p>
                </div>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
