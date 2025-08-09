"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import useUser from "@/lib/useUser"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, Lock, Bell, UserCog, Upload, X } from "lucide-react"

export default function SettingsPage() {
  const userData = useUser()
  const userId = (userData as any)?.user?.id ?? (userData as any)?.id ?? null

  const [profileForm, setProfileForm] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    avatar: "/placeholder.svg",
    coverimage: "", // <- nuevo campo en el form (coincide con columna en BD)
  })

  // ---- Estado para subir avatar ----
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  // ---- Estado para subir cover ----
  const coverInputRef = useRef<HTMLInputElement | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>("")
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  useEffect(() => {
    if (userData) {
      setProfileForm({
        name: (userData as any).name || "",
        username: (userData as any).username || "",
        email: (userData as any).email || "",
        bio: (userData as any).bio || "",
        location: (userData as any).location || "",
        website: (userData as any).website || "",
        avatar: (userData as any).avatar || "/placeholder.svg",
        coverimage: (userData as any).coverimage || "", // traer valor existente si lo hay
      })
    }
  }, [userData])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  // ---- Handlers de imagen: AVATAR ----
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    const MAX_MB = 5
    if (!file.type.startsWith("image/")) return alert("El archivo debe ser una imagen.")
    if (file.size > MAX_MB * 1024 * 1024) return alert(`La imagen no puede superar ${MAX_MB} MB.`)
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return null
    if (!userId) return alert("Debes iniciar sesión para subir una imagen."), null
    setIsUploadingAvatar(true)
    try {
      const ext = avatarFile.name.split(".").pop() || "jpg"
      const filename = `${crypto.randomUUID()}.${ext.toLowerCase()}`
      const path = `${userId}/${filename}`

      const { data: uploaded, error } = await supabase.storage
        .from("avatars") // bucket público recomendado
        .upload(path, avatarFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: avatarFile.type || "image/*",
          metadata: { user_id: userId },
        })
      if (error) {
        console.error(error)
        alert("No se pudo subir la imagen de perfil.")
        return null
      }
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(uploaded.path)
      return urlData.publicUrl

      // Buckets privados:
      // const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(uploaded.path, 86400)
      // return signed?.signedUrl ?? null
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const removeAvatar = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarFile(null)
    setAvatarPreview("")
    setProfileForm((p) => ({ ...p, avatar: "/placeholder.svg" }))
  }

  // ---- Handlers de imagen: COVER ----
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    const MAX_MB = 8
    if (!file.type.startsWith("image/")) return alert("El cover debe ser una imagen.")
    if (file.size > MAX_MB * 1024 * 1024) return alert(`El cover no puede superar ${MAX_MB} MB.`)
    if (coverPreview) URL.revokeObjectURL(coverPreview)
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const uploadCover = async (): Promise<string | null> => {
    if (!coverFile) return null
    if (!userId) return alert("Debes iniciar sesión para subir el cover."), null
    setIsUploadingCover(true)
    try {
      const ext = coverFile.name.split(".").pop() || "jpg"
      const filename = `${crypto.randomUUID()}.${ext.toLowerCase()}`
      const path = `${userId}/${filename}`

      const { data: uploaded, error } = await supabase.storage
        .from("profile-covers") // bucket público recomendado
        .upload(path, coverFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: coverFile.type || "image/*",
          metadata: { user_id: userId },
        })
      if (error) {
        console.error(error)
        alert("No se pudo subir la imagen de fondo.")
        return null
      }
      const { data: urlData } = supabase.storage.from("profile-covers").getPublicUrl(uploaded.path)
      return urlData.publicUrl

      // Buckets privados:
      // const { data: signed } = await supabase.storage.from("profile-covers").createSignedUrl(uploaded.path, 86400)
      // return signed?.signedUrl ?? null
    } finally {
      setIsUploadingCover(false)
    }
  }

  const removeCover = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview)
    setCoverFile(null)
    setCoverPreview("")
    setProfileForm((p) => ({ ...p, coverimage: "" }))
  }

  // ---- Guardar perfil: sube primero los archivos si existen ----
  const handleSaveProfile = async () => {
    try {
      let avatarUrl: string | null = null
      let coverUrl: string | null = null

      if (avatarFile) {
        avatarUrl = await uploadAvatar()
        if (!avatarUrl) return
      }
      if (coverFile) {
        coverUrl = await uploadCover()
        if (!coverUrl) return
      }

      const payload = {
        ...profileForm,
        avatar: avatarUrl ?? profileForm.avatar,
        coverimage: coverUrl ?? profileForm.coverimage,
      }

      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        console.error("Error al actualizar perfil:", data)
        alert("Error al guardar: " + (data?.error ?? "desconocido"))
      } else {
        // limpiar previews temporales
        if (avatarPreview) URL.revokeObjectURL(avatarPreview)
        if (coverPreview) URL.revokeObjectURL(coverPreview)
        setAvatarFile(null)
        setCoverFile(null)
        setAvatarPreview("")
        setCoverPreview("")
        alert("Perfil actualizado correctamente.")
      }
    } catch (err) {
      console.error("Error de red:", err)
      alert("Error de red al guardar los cambios.")
    }
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Configuración</h1>
          <p className="text-gray-400">Administra tu perfil, privacidad y preferencias</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 shrink-0">
            <TabsList className="flex flex-col w-full h-auto bg-transparent space-y-1">
              <TabsTrigger value="profile" className="w-full justify-start px-3">
                <UserCog className="mr-2 h-4 w-4" /> Perfil
              </TabsTrigger>
              <TabsTrigger value="notifications" className="w-full justify-start px-3">
                <Bell className="mr-2 h-4 w-4" /> Notificaciones
              </TabsTrigger>
              <TabsTrigger value="privacy" className="w-full justify-start px-3">
                <Lock className="mr-2 h-4 w-4" /> Privacidad
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1">
            <TabsContent value="profile" className="mt-0">
              <div className="rounded-lg border border-gray-800 p-6 space-y-8">
                {/* -------- COVER / IMAGEN DE FONDO -------- */}
                <section className="space-y-3">
                  <Label>Imagen de fondo (cover)</Label>
                  <div className="relative w-full h-40 md:h-56 rounded-lg overflow-hidden border border-gray-800 bg-muted">
                    {coverPreview || profileForm.coverimage ? (
                      <Image
                        src={coverPreview || profileForm.coverimage}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-gray-400">
                        <Upload className="h-8 w-8" />
                      </div>
                    )}

                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={isUploadingCover}
                      >
                        {isUploadingCover ? "Subiendo..." : "Cambiar cover"}
                      </Button>
                      {(coverPreview || profileForm.coverimage) && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-red-500"
                          onClick={removeCover}
                          disabled={isUploadingCover}
                          title="Eliminar cover"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverFileChange}
                    />
                  </div>
                </section>

                {/* -------- AVATAR -------- */}
                <section className="space-y-6">
                  <h2 className="text-xl font-bold">Información del perfil</h2>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-2 border-gray-800">
                        <AvatarImage src={avatarPreview || profileForm.avatar} alt={profileForm.name} />
                        <AvatarFallback>
                          {(profileForm.name?.substring(0, 2) || "??").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        title="Cambiar foto"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarFileChange}
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-gray-400">
                        Sube una foto cuadrada de al menos 400×400 píxeles (máx. 5 MB).
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={isUploadingAvatar}
                        >
                          {isUploadingAvatar ? "Subiendo..." : "Subir imagen"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={removeAvatar}
                          disabled={isUploadingAvatar}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input id="name" name="name" value={profileForm.name} onChange={handleProfileChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Nombre de usuario</Label>
                      <Input id="username" name="username" value={profileForm.username} onChange={handleProfileChange} />
                      <p className="text-xs text-gray-500">filmsocial.com/{profileForm.username}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={profileForm.email} onChange={handleProfileChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Ubicación</Label>
                      <Input id="location" name="location" value={profileForm.location} onChange={handleProfileChange} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="website">Sitio web</Label>
                      <Input id="website" name="website" value={profileForm.website} onChange={handleProfileChange} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Biografía</Label>
                      <Textarea id="bio" name="bio" value={profileForm.bio} onChange={handleProfileChange} rows={4} />
                      <p className="text-xs text-gray-500">Máximo 160 caracteres</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isUploadingAvatar || isUploadingCover}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Guardar cambios
                    </Button>
                  </div>
                </section>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
