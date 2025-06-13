"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Film, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (validateForm()) {
    setIsLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setIsLoading(false);

    if (res.ok) {
      const { access_token, refresh_token } = data;

      // Guardar tokens en localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      router.push("/home");
    } else {
      setErrors({ general: data.error });
    }
  }
};


  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12 lg:p-16">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </div>

          <div className="flex items-center mb-8">
            <Film className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold">FilmSocial</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Iniciar sesión</h2>
            <p className="text-gray-400">Bienvenido de nuevo. Ingresa tus credenciales para acceder a tu cuenta.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>

            <div className="text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Regístrate
              </Link>
            </div>
          </form>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 bg-gray-900 relative">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
            <div className="h-full w-full">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
