import { Users, Film, Flag } from "lucide-react"

export default function AdminPage() {
  // Mock data
  const reports = [
    {
      id: "report1",
      type: "user",
      reason: "Comportamiento inapropiado",
      status: "pending",
      date: "15 abril, 2024",
      reporter: {
        id: "user1",
        name: "Ana García",
        avatar: "/placeholder.svg?height=40&width=40&text=AG",
      },
      reported: {
        id: "user2",
        name: "Carlos Rodríguez",
        avatar: "/placeholder.svg?height=40&width=40&text=CR",
      },
    },
    {
      id: "report2",
      type: "review",
      reason: "Contenido ofensivo",
      status: "pending",
      date: "14 abril, 2024",
      reporter: {
        id: "user3",
        name: "Laura Martínez",
        avatar: "/placeholder.svg?height=40&width=40&text=LM",
      },
      reported: {
        id: "review1",
        title: "Reseña de 'Dune: Parte Dos'",
        user: {
          id: "user4",
          name: "Miguel Sánchez",
          avatar: "/placeholder.svg?height=40&width=40&text=MS",
        },
      },
    },
    {
      id: "report3",
      type: "forum",
      reason: "Spam",
      status: "resolved",
      date: "12 abril, 2024",
      reporter: {
        id: "user5",
        name: "Elena Gómez",
        avatar: "/placeholder.svg?height=40&width=40&text=EG",
      },
      reported: {
        id: "thread1",
        title: "¿Cuál es la mejor película de ciencia ficción de la última década?",
        user: {
          id: "user6",
          name: "Javier López",
          avatar: "/placeholder.svg?height=40&width=40&text=JL",
        },
      },
    },
  ];

  const users = [
    {
      id: "user1",
      name: "Ana García",
      username: "anagarcia",
      email: "ana.garcia@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=AG",
      status: "active",
      joinDate: "15 enero, 2022",
      lastActive: "Hoy, 14:32",
    },
    {
      id: "user2",
      name: "Carlos Rodríguez",
      username: "carlosrodriguez",
      email: "carlos.rodriguez@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=CR",
      status: "active",
      joinDate: "10 marzo, 2021",
      lastActive: "Ayer, 18:45",
    },
    {
      id: "user3",
      name: "Laura Martínez",
      username: "lauramartinez",
      email: "laura.martinez@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=LM",
      status: "active",
      joinDate: "5 junio, 2023",
      lastActive: "Hoy, 10:15",
    },
    {
      id: "user4",
      name: "Miguel Sánchez",
      username: "miguelsanchez",
      email: "miguel.sanchez@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=MS",
      status: "suspended",
      joinDate: "20 octubre, 2020",
      lastActive: "12 abril, 2024",
    },
    {
      id: "user5",
      name: "Elena Gómez",
      username: "elenagomez",
      email: "elena.gomez@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=EG",
      status: "active",
      joinDate: "8 agosto, 2022",
      lastActive: "Hoy, 09:30",
    },
  ];

  const content = [
    {
      id: "content1",
      type: "movie",
      title: "Dune: Parte Dos",
      status: "approved",
      addedBy: {
        id: "user1",
        name: "Ana García",
        avatar: "/placeholder.svg?height=40&width=40&text=AG",
      },
      addedDate: "15 marzo, 2024",
    },
    {
      id: "content2",
      type: "review",
      title: "Reseña de 'Oppenheimer'",
      status: "pending",
      addedBy: {
        id: "user2",
        name: "Carlos Rodríguez",
        avatar: "/placeholder.svg?height=40&width=40&text=CR",
      },
      addedDate: "10 abril, 2024",
    },
    {
      id: "content3",
      type: "forum",
      title: "Debate: El cine de Almodóvar",
      status: "approved",
      addedBy: {
        id: "user3",
        name: "Laura Martínez",
        avatar: "/placeholder.svg?height=40&width=40&text=LM",
      },
      addedDate: "5 abril, 2024",
    },
    {
      id: "content4",
      type: "list",
      title: "Mejores películas de 2023",
      status: "approved",
      addedBy: {
        id: "user1",
        name: "Ana García",
        avatar: "/placeholder.svg?height=40&width=40&text=AG",
      },
      addedDate: "1 enero, 2024",
    },
    {
      id: "content5",
      type: "event",
      title: "Maratón de Ciencia Ficción",
      status: "pending",
      addedBy: {
        id: "user5",
        name: "Elena Gómez",
        avatar: "/placeholder.svg?height=40&width=40&text=EG",
      },
      addedDate: "12 abril, 2024",
    },
  ];

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Panel de administración</h1>
          <p className="text-gray-400">
            Gestiona usuarios, contenido y reportes
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-lg border border-gray-800 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/20 rounded-full p-3">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">1,245</h2>
              <p className="text-gray-400">Usuarios totales</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-800 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-500/20 rounded-full p-3">
              <Film className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">8,932</h2>
              <p className="text-gray-400">Películas en la base de datos</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-800 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-500/20 rounded-full p-3">
              <Flag className="h-6 w-6 text-red-500" />
            </div>
            <div>
              I&apos;ll create mockups for your movie social platform with all the screens you requested. Let&apos;s start with a cohesive design system and then implement each screen.
            </div>
          </div>
        </div>

\
