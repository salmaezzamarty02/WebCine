// "use client"
// import { useState, useEffect } from "react"
// import useUser from "@/lib/useUser"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Camera, Save, Lock, Bell, Eye, Globe, UserCog, Trash2 } from "lucide-react"
// import { Separator } from "@/components/ui/separator"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"

// export default function SettingsPage() {
//   const user = useUser()

//   const [profileForm, setProfileForm] = useState({
//     name: "",
//     username: "",
//     email: "",
//     bio: "",
//     location: "",
//     website: "",
//     avatar: "/placeholder.svg?height=150&width=150&text=AG",
//   })

//   useEffect(() => {
//     if (user) {
//       setProfileForm({
//         name: user.name || "",
//         username: user.username || "",
//         email: user.email || "",
//         bio: user.bio || "",
//         location: user.location || "",
//         website: user.website || "",
//         avatar: user.avatar || "/placeholder.svg",
//       })
//     }
//   }, [user])

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target
//     setProfileForm((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSaveProfile = async () => {
//     try {
//       const res = await fetch("/api/user", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(profileForm),
//       })

//       if (!res.ok) {
//         const error = await res.json()
//         console.error("Error al actualizar perfil:", error)
//         alert("Hubo un problema al guardar los cambios.")
//       } else {
//         alert("Perfil actualizado correctamente.")
//       }
//     } catch (err) {
//       console.error("Error de red:", err)
//       alert("Error de red al guardar los cambios.")
//     }
//   }

//   return (
//     <div className="container py-8 px-4 md:px-6">
//       <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold mb-2">Configuración</h1>
//           <p className="text-gray-400">Administra tu perfil, privacidad y preferencias</p>
//         </div>
//       </div>

//       <Tabs defaultValue="profile" className="w-full">
//         <div className="flex flex-col md:flex-row gap-8">
//           <div className="md:w-64 shrink-0">
//             <TabsList className="flex flex-col w-full h-auto bg-transparent space-y-1">
//               <TabsTrigger value="profile" className="w-full justify-start px-3">
//                 <UserCog className="mr-2 h-4 w-4" /> Perfil
//               </TabsTrigger>
//               <TabsTrigger value="notifications" className="w-full justify-start px-3">
//                 <Bell className="mr-2 h-4 w-4" /> Notificaciones
//               </TabsTrigger>
//               <TabsTrigger value="privacy" className="w-full justify-start px-3">
//                 <Lock className="mr-2 h-4 w-4" /> Privacidad
//               </TabsTrigger>
//               <TabsTrigger value="account" className="w-full justify-start px-3">
//                 <UserCog className="mr-2 h-4 w-4" /> Cuenta
//               </TabsTrigger>
//             </TabsList>
//           </div>

//           <div className="flex-1">
//             <TabsContent value="profile" className="mt-0">
//               <div className="rounded-lg border border-gray-800 p-6">
//                 <h2 className="text-xl font-bold mb-6">Información del perfil</h2>

//                 <div className="space-y-6">
//                   <div className="flex flex-col md:flex-row gap-6 items-start">
//                     <div className="relative">
//                       <Avatar className="h-24 w-24 border-2 border-gray-800">
//                         <AvatarImage src={profileForm.avatar} alt={profileForm.name} />
//                         <AvatarFallback>{profileForm.name.substring(0, 2).toUpperCase()}</AvatarFallback>
//                       </Avatar>
//                       <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
//                         <Camera className="h-4 w-4" />
//                       </Button>
//                     </div>

//                     <div className="flex-1 space-y-2">
//                       <p className="text-sm text-gray-400">
//                         Sube una foto para personalizar tu perfil. Recomendamos una imagen cuadrada de al menos 400x400 píxeles.
//                       </p>
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm">Subir imagen</Button>
//                         <Button variant="outline" size="sm" className="text-red-500">Eliminar</Button>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="name">Nombre completo</Label>
//                       <Input id="name" name="name" value={profileForm.name} onChange={handleProfileChange} />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="username">Nombre de usuario</Label>
//                       <Input id="username" name="username" value={profileForm.username} onChange={handleProfileChange} />
//                       <p className="text-xs text-gray-500">filmsocial.com/{profileForm.username}</p>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="email">Email</Label>
//                       <Input id="email" name="email" type="email" value={profileForm.email} onChange={handleProfileChange} />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="location">Ubicación</Label>
//                       <Input id="location" name="location" value={profileForm.location} onChange={handleProfileChange} />
//                     </div>

//                     <div className="space-y-2 md:col-span-2">
//                       <Label htmlFor="website">Sitio web</Label>
//                       <Input id="website" name="website" value={profileForm.website} onChange={handleProfileChange} />
//                     </div>

//                     <div className="space-y-2 md:col-span-2">
//                       <Label htmlFor="bio">Biografía</Label>
//                       <Textarea id="bio" name="bio" value={profileForm.bio} onChange={handleProfileChange} rows={4} />
//                       <p className="text-xs text-gray-500">Máximo 160 caracteres</p>
//                     </div>
//                   </div>

//                   <div className="flex justify-end">
//                     <Button onClick={handleSaveProfile}>
//                       <Save className="mr-2 h-4 w-4" />
//                       Guardar cambios
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="notifications" className="mt-0">
//               <div className="rounded-lg border border-gray-800 p-6">
//                 <h2 className="text-xl font-bold mb-6">Preferencias de notificaciones</h2>

//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium">Canales de notificación</h3>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Notificaciones por email</p>
//                         <p className="text-sm text-gray-400">Recibe notificaciones por email</p>
//                       </div>
//                       <Switch
//                         checked={notificationSettings.emailNotifications}
//                         onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
//                       />
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Notificaciones push</p>
//                         <p className="text-sm text-gray-400">Recibe notificaciones en tu navegador</p>
//                       </div>
//                       <Switch
//                         checked={notificationSettings.pushNotifications}
//                         onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
//                       />
//                     </div>
//                   </div>

//                   <Separator />

//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium">Tipos de notificaciones</h3>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Me gusta</p>
//                         <p className="text-sm text-gray-400">Cuando alguien da me gusta a tu contenido</p>
//                       </div>
//                       <Switch
//                         checked={notificationSettings.likes}
//                         onCheckedChange={(checked) => handleNotificationChange("likes", checked)}
//                       />
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Comentarios</p>
//                         <p className="text-sm text-gray-400">Cuando alguien comenta en tu contenido</p>
//                       </div>
//                       <Switch
//                         checked={notificationSettings.comments}
//                         onCheckedChange={(checked) => handleNotificationChange("comments", checked)}
//                       />
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Seguidores</p>
//                         <p className="text-sm text-gray-400">Cuando alguien comienza a seguirte</p>
//                       </div>
//                       <Switch
//                         checked={notificationSettings.follows}
//                         onCheckedChange={(checked) => handleNotificationChange("follows", checked)}
//                       />
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Mensajes</p>
//                         <p className="text-sm text-gray-400">Cuando recibes un mensaje directo</p>
//                       </div>
//                       <Switch
//                         checked={notificationSettings.messages}
//                         onCheckedChange={(checked) => handleNotificationChange("messages", checked)}
//                       />
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Eventos</p>
//                         <p className="text-sm text-gray-400">Invitaciones y actualizaciones de eventos</p>
//                       </div>
//                       <Switch
//                         checked={notificationSettings.events}
//                         onCheckedChange={(checked) => handleNotificationChange("events", checked)}
//                       />
//                     </div>
//                   </div>

//                   <div className="flex justify-end">
//                     <Button>
//                       <Save className="mr-2 h-4 w-4" />
//                       Guardar cambios
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="privacy" className="mt-0">
//               <div className="rounded-lg border border-gray-800 p-6">
//                 <h2 className="text-xl font-bold mb-6">Configuración de privacidad</h2>

//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium">Visibilidad del perfil</h3>

//                     <RadioGroup
//                       value={privacySettings.profileVisibility}
//                       onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
//                     >
//                       <div className="flex items-start space-x-2">
//                         <RadioGroupItem value="public" id="profile-public" />
//                         <div className="grid gap-1.5">
//                           <Label htmlFor="profile-public" className="font-medium">
//                             <Globe className="h-4 w-4 inline mr-1" />
//                             Público
//                           </Label>
//                           <p className="text-sm text-gray-400">Cualquier persona puede ver tu perfil</p>
//                         </div>
//                       </div>

//                       <div className="flex items-start space-x-2">
//                         <RadioGroupItem value="followers" id="profile-followers" />
//                         <div className="grid gap-1.5">
//                           <Label htmlFor="profile-followers" className="font-medium">
//                             <Eye className="h-4 w-4 inline mr-1" />
//                             Solo seguidores
//                           </Label>
//                           <p className="text-sm text-gray-400">Solo las personas que te siguen pueden ver tu perfil</p>
//                         </div>
//                       </div>

//                       <div className="flex items-start space-x-2">
//                         <RadioGroupItem value="private" id="profile-private" />
//                         <div className="grid gap-1.5">
//                           <Label htmlFor="profile-private" className="font-medium">
//                             <Lock className="h-4 w-4 inline mr-1" />
//                             Privado
//                           </Label>
//                           <p className="text-sm text-gray-400">
//                             Debes aprobar manualmente las solicitudes de seguimiento
//                           </p>
//                         </div>
//                       </div>
//                     </RadioGroup>
//                   </div>

//                   <Separator />

//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium">Visibilidad de la actividad</h3>

//                     <div className="space-y-2">
//                       <Label htmlFor="activity-visibility">¿Quién puede ver tu actividad?</Label>
//                       <Select
//                         value={privacySettings.activityVisibility}
//                         onValueChange={(value) => handlePrivacyChange("activityVisibility", value)}
//                       >
//                         <SelectTrigger id="activity-visibility">
//                           <SelectValue placeholder="Selecciona una opción" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="public">Todos</SelectItem>
//                           <SelectItem value="followers">Solo seguidores</SelectItem>
//                           <SelectItem value="none">Nadie</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Mostrar películas vistas</p>
//                         <p className="text-sm text-gray-400">Permitir que otros vean las películas que has visto</p>
//                       </div>
//                       <Switch
//                         checked={privacySettings.showWatchedMovies}
//                         onCheckedChange={(checked) => handlePrivacyChange("showWatchedMovies", checked)}
//                       />
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Mostrar valoraciones</p>
//                         <p className="text-sm text-gray-400">Permitir que otros vean tus valoraciones de películas</p>
//                       </div>
//                       <Switch
//                         checked={privacySettings.showRatings}
//                         onCheckedChange={(checked) => handlePrivacyChange("showRatings", checked)}
//                       />
//                     </div>
//                   </div>

//                   <Separator />

//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium">Mensajes</h3>

//                     <div className="space-y-2">
//                       <Label htmlFor="allow-messages">¿Quién puede enviarte mensajes?</Label>
//                       <Select
//                         value={privacySettings.allowMessages}
//                         onValueChange={(value) => handlePrivacyChange("allowMessages", value)}
//                       >
//                         <SelectTrigger id="allow-messages">
//                           <SelectValue placeholder="Selecciona una opción" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="everyone">Todos</SelectItem>
//                           <SelectItem value="followers">Solo seguidores</SelectItem>
//                           <SelectItem value="none">Nadie</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   <div className="flex justify-end">
//                     <Button>
//                       <Save className="mr-2 h-4 w-4" />
//                       Guardar cambios
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="account" className="mt-0">
//               <div className="rounded-lg border border-gray-800 p-6">
//                 <h2 className="text-xl font-bold mb-6">Configuración de la cuenta</h2>

//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium">Cambiar contraseña</h3>

//                     <div className="space-y-2">
//                       <Label htmlFor="current-password">Contraseña actual</Label>
//                       <Input id="current-password" type="password" />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="new-password">Nueva contraseña</Label>
//                       <Input id="new-password" type="password" />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
//                       <Input id="confirm-password" type="password" />
//                     </div>

//                     <Button>Cambiar contraseña</Button>
//                   </div>

//                   <Separator />

//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium">Idioma y región</h3>

//                     <div className="space-y-2">
//                       <Label htmlFor="language">Idioma</Label>
//                       <Select defaultValue="es">
//                         <SelectTrigger id="language">
//                           <SelectValue placeholder="Selecciona un idioma" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="es">Español</SelectItem>
//                           <SelectItem value="en">English</SelectItem>
//                           <SelectItem value="fr">Français</SelectItem>
//                           <SelectItem value="de">Deutsch</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="region">Región</Label>
//                       <Select defaultValue="es">
//                         <SelectTrigger id="region">
//                           <SelectValue placeholder="Selecciona una región" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="es">España</SelectItem>
//                           <SelectItem value="us">Estados Unidos</SelectItem>
//                           <SelectItem value="mx">México</SelectItem>
//                           <SelectItem value="ar">Argentina</SelectItem>
//                           <SelectItem value="co">Colombia</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   <Separator />

//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium text-red-500">Zona de peligro</h3>

//                     <div className="rounded-lg border border-red-900 bg-red-950/20 p-4">
//                       <h4 className="font-medium mb-2">Eliminar cuenta</h4>
//                       <p className="text-sm text-gray-400 mb-4">
//                         Al eliminar tu cuenta, se borrarán permanentemente todos tus datos, incluyendo reseñas, listas y
//                         valoraciones. Esta acción no se puede deshacer.
//                       </p>
//                       <Button variant="destructive">
//                         <Trash2 className="mr-2 h-4 w-4" />
//                         Eliminar cuenta
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>
//           </div>
//         </div>
//       </Tabs>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import useUser from "@/lib/useUser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, Lock, Bell, Eye, Globe, UserCog, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const user = useUser()

  const [profileForm, setProfileForm] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    avatar: "/placeholder.svg?height=150&width=150&text=AG",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    likes: true,
    comments: true,
    follows: true,
    messages: true,
    events: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    activityVisibility: "followers",
    allowMessages: "everyone",
    showWatchedMovies: true,
    showRatings: true,
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handlePrivacyChange = (key: string, value: any) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        avatar: user.avatar || "/placeholder.svg",
      })
    }
  }, [user])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  // const handleSaveProfile = async () => {
  //   try {
  //     const res = await fetch("/api/user", {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(profileForm),
  //     })

  //     if (!res.ok) {
  //       const error = await res.json()
  //       console.error("Error al actualizar perfil:", error)
  //       alert("Hubo un problema al guardar los cambios.")
  //     } else {
  //       alert("Perfil actualizado correctamente.")
  //     }
  //   } catch (err) {
  //     console.error("Error de red:", err)
  //     alert("Error de red al guardar los cambios.")
  //   }
  // }

  const handleSaveProfile = async () => {
  try {
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("Error al actualizar perfil:", data)
      alert("Error al guardar: " + data.error) // aquí mostramos el mensaje real
    } else {
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
              <TabsTrigger value="account" className="w-full justify-start px-3">
                <UserCog className="mr-2 h-4 w-4" /> Cuenta
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1">
            <TabsContent value="profile" className="mt-0">
              <div className="rounded-lg border border-gray-800 p-6">
                <h2 className="text-xl font-bold mb-6">Información del perfil</h2>

                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-2 border-gray-800">
                        <AvatarImage src={profileForm.avatar} alt={profileForm.name} />
                        <AvatarFallback>{profileForm.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-gray-400">
                        Sube una foto para personalizar tu perfil. Recomendamos una imagen cuadrada de al menos 400x400 píxeles.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Subir imagen</Button>
                        <Button variant="outline" size="sm" className="text-red-500">Eliminar</Button>
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
                    <Button onClick={handleSaveProfile}>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar cambios
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
