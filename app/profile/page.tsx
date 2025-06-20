"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useUser from "@/lib/useUser"

export default function MyProfileRedirectPage() {
  const router = useRouter()
  const user = useUser()

  useEffect(() => {
    if (user?.id) {
      router.replace(`/profile/${user.id}`)
    }
  }, [user, router])

  return (
    <div className="p-4 text-gray-300">
      Redirigiendo a tu perfil...
    </div>
  )
}
