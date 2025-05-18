import { Button } from "@/components/ui/button"
import { Film, Star, Users, List } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/fondo-home.png"
            alt="Collage de películas"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-white">
            Tu comunidad de <span className="text-pink-500">cine</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
            Descubre, comenta y comparte tus películas favoritas con amigos y cinéfilos de todo el mundo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="text-lg">
              <Link href="/register">Registrarse</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Todo lo que necesitas para tu pasión por el cine
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-900/50 border border-gray-800">
              <Film className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Descubre películas</h3>
              <p className="text-gray-400">
                Explora miles de películas y recibe recomendaciones personalizadas basadas en tus gustos.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-900/50 border border-gray-800">
              <Star className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Reseñas y valoraciones</h3>
              <p className="text-gray-400">
                Comparte tus opiniones y descubre qué piensan otros usuarios sobre tus películas favoritas.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-900/50 border border-gray-800">
              <List className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Crea listas personalizadas</h3>
              <p className="text-gray-400">
                Organiza tus películas en listas temáticas y compártelas con la comunidad.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-900/50 border border-gray-800">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Conecta con amigos</h3>
              <p className="text-gray-400">
                Encuentra amigos con gustos similares y descubre nuevas películas a través de sus recomendaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-black">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Lo que dicen nuestros usuarios</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-lg bg-gray-900/30 border border-gray-800">
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=U${i}`} alt="Usuario" />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">Usuario {i}</h4>
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, j) => (
                          <Star
                            key={j}
                            className={`h-4 w-4 ${j < 5 ? "text-yellow-400" : "text-gray-600"}`}
                            fill={j < 5 ? "currentColor" : "none"}
                          />
                        ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300">
                  "Esta plataforma ha cambiado completamente mi forma de descubrir películas. La comunidad es increíble
                  y he encontrado joyas cinematográficas que nunca hubiera descubierto por mi cuenta."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-t from-black to-gray-900">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para unirte a nuestra comunidad?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Regístrate hoy y comienza a compartir tu pasión por el cine con miles de usuarios.
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link href="/register">Crear cuenta gratis</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-800 bg-black">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Film className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold">FilmSocial</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Sobre nosotros
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Términos
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Privacidad
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Contacto
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © 2024 FilmSocial. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
