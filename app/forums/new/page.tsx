"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useUser from "@/lib/useUser"
import { getForumCategories } from "@/lib/queries"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, X } from "lucide-react"
import Link from "next/link"

export default function NewThreadPage() {
  const router = useRouter()
  const user = useUser()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getForumCategories()
      setCategories(cats)
    }
    fetchCategories()
  }, [])

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !category || !user?.id) return

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/forums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          category_id: category,
          user_id: user.id,
          tags,
        }),
      })

      const result = await res.json()

      if (res.ok) {
        router.push(`/forums/thread/${result.id}`)
      } else {
        console.error("Error al crear el hilo:", result.error)
      }
    } catch (error) {
      console.error("Error de red:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8 px-4 md:px-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/forums">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a los foros
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Crear nuevo tema</h1>
        <p className="text-gray-400">Comparte tus ideas y comienza una discusión con la comunidad</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información básica</CardTitle>
            <CardDescription>Proporciona un título claro y selecciona la categoría apropiada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del tema *</Label>
              <Input
                id="title"
                placeholder="Escribe un título descriptivo para tu tema..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
              />
              <div className="text-xs text-gray-500 text-right">{title.length}/200 caracteres</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contenido */}
        <Card>
          <CardHeader>
            <CardTitle>Contenido</CardTitle>
            <CardDescription>Escribe el contenido de tu tema. Puedes usar markdown para dar formato</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">Contenido *</Label>
              <Textarea
                id="content"
                placeholder="Escribe el contenido de tu tema aquí...

Puedes usar:
- **texto en negrita**
- *texto en cursiva*
- [enlaces](https://ejemplo.com)
- Listas con viñetas

¡Sé descriptivo y claro en tu mensaje!"
                className="min-h-[300px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <div className="text-xs text-gray-500">Mínimo 50 caracteres. Actual: {content.length}</div>
            </div>
          </CardContent>
        </Card>

        {/* Etiquetas */}
        <Card>
          <CardHeader>
            <CardTitle>Etiquetas (opcional)</CardTitle>
            <CardDescription>Añade hasta 5 etiquetas para ayudar a otros usuarios a encontrar tu tema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Añadir etiqueta..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  maxLength={20}
                  disabled={tags.length >= 5}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={!currentTag.trim() || tags.includes(currentTag.trim()) || tags.length >= 5}
                >
                  Añadir
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 bg-primary/20 text-primary px-2 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-primary/80">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-xs text-gray-500">{tags.length}/5 etiquetas utilizadas</div>
            </div>
          </CardContent>
        </Card>

        {/* Vista previa */}
        {(title || content) && (
          <Card>
            <CardHeader>
              <CardTitle>Vista previa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-bold mb-2">{title || "Título del tema"}</h3>
                <div className="text-gray-400 text-sm mb-4">
                  Por tu usuario • Ahora • en {categories.find((c) => c.id === category)?.name || "Categoría"}
                </div>
                <div className="whitespace-pre-line text-gray-200">{content || "El contenido aparecerá aquí..."}</div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map((tag) => (
                      <span key={tag} className="bg-secondary px-2 py-1 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botones */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-800">
          <div className="text-sm text-gray-400">* Campos obligatorios</div>
          <div className="flex gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/forums">Cancelar</Link>
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !content.trim() || content.length < 50 || !category || isSubmitting}
            >
              {isSubmitting ? "Creando..." : "Crear tema"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
