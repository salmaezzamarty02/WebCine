"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditProfilePage() {
  const [form, setForm] = useState({
    name: "Ana García",
    username: "anagarcia",
    bio: "Cinéfila apasionada | Crítica de cine amateur | Amante del cine independiente y de autor",
    location: "Madrid, España",
    website: "https://anagarcia.com",
    avatar: "/placeholder.svg?height=150&width=150&text=AG",
    coverImage: "/placeholder.svg?height=400&width=1200&text=Cover",
    favoriteGenres: ["Drama", "Ciencia ficción"],
    favoriteDirectors: ["Denis Villeneuve", "Christopher Nolan", "Greta Gerwig"],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mb-6">
        <Link href="/profile" className="inline-flex items-center text-sm text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al perfil
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Editar perfil</h1>
        <p className="text-gray-400">Actualiza tu información y preferencias</p>
      </div>

      <div className="space-y-8">
        {/* Cover Image Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Imagen de portada</h2>
          <div className="relative h-48 md:h-64 rounded-lg overflow-hidden border border-gray-800">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url('${form.coverImage}')` }}
            ></div>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Button>
                <Camera className="mr-2 h-4 w-4" />
                Cambiar imagen de portada
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Recomendado: imagen de 1200 x 400 píxeles o mayor. Tamaño máximo: 5MB.
          </p>
        </div>

        {/* Profile Picture Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Foto de perfil</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={form.avatar || "/placeholder.svg"} alt={form.name} />
                <AvatarFallback>{form.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute bottom-1 right-1 h-8 w-8 rounded-full">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                Sube una foto para personalizar tu perfil. Recomendamos una imagen cuadrada de al menos 400x400 píxeles.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Subir imagen
                </Button>
                <Button variant="outline" size="sm" className="text-red-500">
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Información básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input id="username" name="username" value={form.username} onChange={handleChange} />
              <p className="text-xs text-gray-500">filmsocial.com/{form.username}</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea id="bio" name="bio" value={form.bio} onChange={handleChange} rows={4} />
              <p className="text-xs text-gray-500">Máximo 160 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" name="location" value={form.location} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Sitio web</Label>
              <Input id="website" name="website" value={form.website} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Preferencias de cine</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="favorite-genres">Géneros favoritos</Label>
              <Select>
                <SelectTrigger id="favorite-genres">
                  <SelectValue placeholder="Selecciona géneros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drama">Drama</SelectItem>
                  <SelectItem value="comedy">Comedia</SelectItem>
                  <SelectItem value="scifi">Ciencia ficción</SelectItem>
                  <SelectItem value="action">Acción</SelectItem>
                  <SelectItem value="horror">Terror</SelectItem>
                  <SelectItem value="thriller">Thriller</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.favoriteGenres.map((genre) => (
                  <div
                    key={genre}
                    className="bg-primary/20 text-primary rounded-full px-3 py-1 text-xs flex items-center"
                  >
                    {genre}
                    <button className="ml-1 hover:text-white">×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="favorite-directors">Directores favoritos</Label>
              <Input id="favorite-directors" placeholder="Añade directores separados por comas" />
              <div className="flex flex-wrap gap-2 mt-2">
                {form.favoriteDirectors.map((director) => (
                  <div
                    key={director}
                    className="bg-primary/20 text-primary rounded-full px-3 py-1 text-xs flex items-center"
                  >
                    {director}
                    <button className="ml-1 hover:text-white">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Redes sociales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input id="twitter" placeholder="@usuario" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" placeholder="@usuario" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="letterboxd">Letterboxd</Label>
              <Input id="letterboxd" placeholder="usuario" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imdb">IMDb</Label>
              <Input id="imdb" placeholder="ur12345678" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/profile">Cancelar</Link>
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
