"use client"

import { useParams } from "next/navigation"
import ProfileClient from "./ProfileClient"

export default function ProfilePage() {
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : ""

  return <ProfileClient userId={id} />
}
