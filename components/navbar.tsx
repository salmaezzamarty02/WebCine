"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Home, Film, List, MessageSquare, Users, Bell, Menu, X, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Skip navbar on login and register pages
  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FilmSocial</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/home" className="text-sm font-medium hover:text-primary">
            <Home className="h-5 w-5" />
          </Link>
          <Link href="/movies" className="text-sm font-medium hover:text-primary">
            <Film className="h-5 w-5" />
          </Link>
          <Link href="/watchlists" className="text-sm font-medium hover:text-primary">
            <List className="h-5 w-5" />
          </Link>
          <Link href="/forums" className="text-sm font-medium hover:text-primary">
            <MessageSquare className="h-5 w-5" />
          </Link>
          <Link href="/friends" className="text-sm font-medium hover:text-primary">
            <Users className="h-5 w-5" />
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar películas, usuarios..."
              className="w-[200px] lg:w-[300px] pl-8 bg-secondary"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-primary"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@usuario" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile" className="flex w-full">
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="flex w-full">
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-black">
          <div className="container py-4 px-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar películas, usuarios..." className="w-full pl-8 bg-secondary" />
            </div>
            <nav className="grid grid-cols-4 gap-2">
              <Link href="/home" className="flex flex-col items-center p-2 hover:text-primary">
                <Home className="h-5 w-5 mb-1" />
                <span className="text-xs">Inicio</span>
              </Link>
              <Link href="/movies" className="flex flex-col items-center p-2 hover:text-primary">
                <Film className="h-5 w-5 mb-1" />
                <span className="text-xs">Películas</span>
              </Link>
              <Link href="/watchlists" className="flex flex-col items-center p-2 hover:text-primary">
                <List className="h-5 w-5 mb-1" />
                <span className="text-xs">Listas</span>
              </Link>
              <Link href="/forums" className="flex flex-col items-center p-2 hover:text-primary">
                <MessageSquare className="h-5 w-5 mb-1" />
                <span className="text-xs">Foros</span>
              </Link>
              <Link href="/friends" className="flex flex-col items-center p-2 hover:text-primary">
                <Users className="h-5 w-5 mb-1" />
                <span className="text-xs">Amigos</span>
              </Link>
              <Link href="/profile" className="flex flex-col items-center p-2 hover:text-primary">
                <User className="h-5 w-5 mb-1" />
                <span className="text-xs">Perfil</span>
              </Link>
              <Link href="/notifications" className="flex flex-col items-center p-2 hover:text-primary">
                <Bell className="h-5 w-5 mb-1" />
                <span className="text-xs">Alertas</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
