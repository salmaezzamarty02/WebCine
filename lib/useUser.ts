
"use client"

import { useEffect, useState } from "react"

export default function useUser() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user")
        if (res.ok) {
          const { profile } = await res.json()
          setUser(profile)
        } else {
          console.warn("No se pudo recuperar el perfil:", res.status)
        }
      } catch (error) {
        console.error("Error al recuperar el perfil:", error)
      }
    }

    fetchUser()
  }, [])

  return user
}
