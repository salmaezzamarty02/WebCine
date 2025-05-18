"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menu,
  Search,
  X,
  LogOut,
  Settings,
  User,
  Film,
  Bell,
  MessageSquare,
  Users,
  List,
  Calendar,
  Home,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  // Close the navigation when the path changes
  useEffect(() => {
    setIsOpen(false)
    setIsSearchOpen(false)
  }, [pathname])

  const navigationItems = [
    { name: "Inicio", href: "/home", icon: <Home className="h-5 w-5" /> },
    { name: "Películas", href: "/movies", icon: <Film className="h-5 w-5" /> },
    { name: "Listas", href: "/watchlists", icon: <List className="h-5 w-5" /> },
    { name: "Eventos", href: "/events", icon: <Calendar className="h-5 w-5" /> },
    { name: "Foros", href: "/forums", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Amigos", href: "/friends", icon: <Users className="h-5 w-5" /> },
    { name: "Notificaciones", href: "/notifications", icon: <Bell className="h-5 w-5" /> },
  ]

  // Skip mobile navigation on login and register pages
  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  return (
    <div className="md:hidden">
      {/* Mobile Search */}
      {isSearchOpen ? (
        <div className="fixed inset-0 z-50 bg-black/95 p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-medium">Buscar</p>
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar películas, usuarios..." className="pl-8 bg-secondary" autoFocus />
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Búsquedas recientes</h3>
            <div className="space-y-4">
              <Link href="/search?q=dune" className="flex items-center gap-3 p-2 hover:bg-gray-900 rounded-lg">
                <Search className="h-4 w-4 text-gray-500" />
                <span>Dune: Parte Dos</span>
              </Link>
              <Link href="/search?q=nolan" className="flex items-center gap-3 p-2 hover:bg-gray-900 rounded-lg">
                <Search className="h-4 w-4 text-gray-500" />
                <span>Christopher Nolan</span>
              </Link>
              <Link href="/search?q=thriller" className="flex items-center gap-3 p-2 hover:bg-gray-900 rounded-lg">
                <Search className="h-4 w-4 text-gray-500" />
                <span>Mejores thrillers</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(true)}>
          <Search className="h-6 w-6" />
        </Button>
      )}

      {/* Mobile Navigation Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
          <SheetHeader className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Film className="h-6 w-6 text-primary" />
              <SheetTitle className="text-xl font-bold">FilmSocial</SheetTitle>
            </div>
          </SheetHeader>

          <div className="py-6 px-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48&text=AG" alt="Ana García" />
                <AvatarFallback>AG</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Ana García</p>
                <p className="text-sm text-gray-400">@anagarcia</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/profile">
                  <User className="h-4 w-4 mr-1" />
                  Perfil
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/settings">
                  <Settings className="h-4 w-4 mr-1" />
                  Configuración
                </Link>
              </Button>
            </div>
          </div>

          <div className="py-6 px-4">
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-gray-900"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
