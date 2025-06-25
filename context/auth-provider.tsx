"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null               // Usuario autenticado (auth.users)
  session: Session | null         // Sesión actual
  loading: boolean                // Indicador de carga
  profile: any | null             // Perfil extendido desde la tabla `profiles`
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  profile: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const access_token = localStorage.getItem("access_token")
    const refresh_token = localStorage.getItem("refresh_token")

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(async ({ data, error }) => {
          if (error) {
            console.error("Error al restaurar sesión:", error)
          } else {
            setSession(data.session ?? null)
            setUser(data.session?.user ?? null)

            if (data.session?.user) {
              try {
                const res = await fetch("/api/user")
                if (res.ok) {
                  const { profile } = await res.json()
                  setProfile(profile)
                }
              } catch (err) {
                console.error("Error al cargar el perfil:", err)
              }
            }
          }
          setLoading(false)
        })
    } else {
      setLoading(false)
    }

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        try {
          const res = await fetch("/api/user")
          if (res.ok) {
            const { profile } = await res.json()
            setProfile(profile)
          }
        } catch (err) {
          console.error("Error al cargar el perfil:", err)
        }
      } else {
        setProfile(null)
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, loading, profile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
