"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/context/auth-provider"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, List, Heart, Eye, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AddToListDialogProps {
  movieId: string
  movieTitle: string
  moviePoster: string
  trigger?: React.ReactNode
}

export default function AddToListDialog({
  movieId,
  movieTitle,
  moviePoster,
  trigger,
}: AddToListDialogProps) {
  const { profile } = useAuth()
  const [open, setOpen] = useState(false)
  const [watchlists, setWatchlists] = useState<any[]>([])
  const [selectedLists, setSelectedLists] = useState<string[]>([])
  const [newListName, setNewListName] = useState("")
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchWatchlists = async () => {
      if (!profile?.id) return
      const { data, error } = await supabase
        .from("watchlists")
        .select("*")
        .eq("user_id", profile.id)

      if (error) {
        console.error("❌ Error obteniendo listas:", error.message)
      } else {
        setWatchlists(data || [])
      }
    }

    if (open) fetchWatchlists()
  }, [open, profile?.id])

  const handleListToggle = (listId: string) => {
    setSelectedLists((prev) =>
      prev.includes(listId) ? prev.filter((id) => id !== listId) : [...prev, listId]
    )
  }

  const handleCreateNewList = async () => {
    if (!newListName.trim() || !profile?.id) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("watchlists")
        .insert({
          user_id: profile.id,
          name: newListName.trim(),
          is_public: false,
        })
        .select()
        .single()

      if (error) throw error

      setWatchlists((prev) => [...prev, data])
      setSelectedLists((prev) => [...prev, data.id])
      setNewListName("")
      setIsCreatingNew(false)
    } catch (error) {
      console.error("❌ Error creando nueva lista:", error)
      alert("Error creando la lista")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToLists = async () => {
    if (!profile?.id || selectedLists.length === 0) return

    setIsLoading(true)
    try {
      for (const listId of selectedLists) {
        const { error } = await supabase
          .from("watchlist_movies")
          .insert({
            watchlist_id: listId,
            movie_id: movieId,
          })

        if (error && error.code !== "23505") {
          console.error("❌ Error añadiendo película a lista:", error)
          alert("Error añadiendo película a una de las listas")
        }
      }
      setSelectedLists([])
      setOpen(false)
    } catch (error) {
      console.error("❌ Error en añadir a listas:", error)
      alert("Error al añadir a las listas")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Añadir a lista
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Añadir a lista</DialogTitle>
          <DialogDescription>Selecciona las listas donde añadir "{movieTitle}".</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Movie Preview */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-800">
            <div className="w-12 h-16 relative rounded overflow-hidden">
              <Image
                src={moviePoster || "/placeholder.svg"}
                alt={movieTitle}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium">{movieTitle}</h4>
              <p className="text-sm text-gray-400">Se añadirá a las listas seleccionadas</p>
            </div>
          </div>

          {/* Existing Lists */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tus listas</Label>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {watchlists.length === 0 ? (
                <p className="text-gray-400 text-sm">No tienes listas aún.</p>
              ) : (
                watchlists.map((list) => (
                  <div
                    key={list.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-800 hover:bg-gray-900/50 transition-colors"
                  >
                    <Checkbox
                      id={list.id}
                      checked={selectedLists.includes(list.id)}
                      onCheckedChange={() => handleListToggle(list.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={list.id} className="cursor-pointer">
                        {list.name}
                      </Label>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Create New List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Crear nueva lista</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreatingNew(!isCreatingNew)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Nueva lista
              </Button>
            </div>

            {isCreatingNew && (
              <div className="space-y-3 p-3 rounded-lg border border-gray-800 bg-gray-900/30">
                <Input
                  placeholder="Nombre de la lista"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
                <Button
                  size="sm"
                  onClick={handleCreateNewList}
                  disabled={!newListName.trim() || isLoading}
                >
                  {isLoading ? "Creando..." : "Crear lista"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddToLists} disabled={selectedLists.length === 0 || isLoading}>
            {isLoading ? "Añadiendo..." : "Añadir a listas"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
