import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import MovieCard from "@/components/movie-card"

export default function MoviesPage() {
  // Mock data
  const popularMovies = [
    {
      id: "movie1",
      title: "Dune: Parte Dos",
      year: "2024",
      director: "Denis Villeneuve",
      poster: "/placeholder.svg?height=300&width=200&text=Dune",
      rating: 4.8,
      genres: ["Ciencia ficción", "Aventura"],
    },
    {
      id: "movie2",
      title: "Oppenheimer",
      year: "2023",
      director: "Christopher Nolan",
      poster: "/placeholder.svg?height=300&width=200&text=Oppenheimer",
      rating: 4.7,
      genres: ["Drama", "Histórico"],
    },
    {
      id: "movie3",
      title: "Barbie",
      year: "2023",
      director: "Greta Gerwig",
      poster: "/placeholder.svg?height=300&width=200&text=Barbie",
      rating: 4.5,
      genres: ["Comedia", "Fantasía"],
    },
    {
      id: "movie4",
      title: "Pobres criaturas",
      year: "2023",
      director: "Yorgos Lanthimos",
      poster: "/placeholder.svg?height=300&width=200&text=Poor+Things",
      rating: 4.6,
      genres: ["Drama", "Ciencia ficción"],
    },
    {
      id: "movie5",
      title: "La zona de interés",
      year: "2023",
      director: "Jonathan Glazer",
      poster: "/placeholder.svg?height=300&width=200&text=Zone",
      rating: 4.4,
      genres: ["Drama", "Histórico"],
    },
    {
      id: "movie6",
      title: "Anatomía de una caída",
      year: "2023",
      director: "Justine Triet",
      poster: "/placeholder.svg?height=300&width=200&text=Anatomy",
      rating: 4.5,
      genres: ["Drama", "Thriller"],
    },
  ]

  const newReleases = [
    {
      id: "movie7",
      title: "Civil War",
      year: "2024",
      director: "Alex Garland",
      poster: "/placeholder.svg?height=300&width=200&text=Civil+War",
      rating: 4.2,
      genres: ["Drama", "Acción"],
    },
    {
      id: "movie8",
      title: "Challengers",
      year: "2024",
      director: "Luca Guadagnino",
      poster: "/placeholder.svg?height=300&width=200&text=Challengers",
      rating: 4.3,
      genres: ["Drama", "Deportes"],
    },
    {
      id: "movie9",
      title: "Godzilla x Kong",
      year: "2024",
      director: "Adam Wingard",
      poster: "/placeholder.svg?height=300&width=200&text=Godzilla",
      rating: 3.9,
      genres: ["Acción", "Ciencia ficción"],
    },
    {
      id: "movie10",
      title: "Furiosa",
      year: "2024",
      director: "George Miller",
      poster: "/placeholder.svg?height=300&width=200&text=Furiosa",
      rating: 4.1,
      genres: ["Acción", "Aventura"],
    },
    {
      id: "movie11",
      title: "The Fall Guy",
      year: "2024",
      director: "David Leitch",
      poster: "/placeholder.svg?height=300&width=200&text=Fall+Guy",
      rating: 4.0,
      genres: ["Acción", "Comedia"],
    },
    {
      id: "movie12",
      title: "Inside Out 2",
      year: "2024",
      director: "Kelsey Mann",
      poster: "/placeholder.svg?height=300&width=200&text=Inside+Out+2",
      rating: 4.4,
      genres: ["Animación", "Comedia"],
    },
  ]

  const classics = [
    {
      id: "movie13",
      title: "El padrino",
      year: "1972",
      director: "Francis Ford Coppola",
      poster: "/placeholder.svg?height=300&width=200&text=Godfather",
      rating: 4.9,
      genres: ["Drama", "Crimen"],
    },
    {
      id: "movie14",
      title: "Pulp Fiction",
      year: "1994",
      director: "Quentin Tarantino",
      poster: "/placeholder.svg?height=300&width=200&text=Pulp+Fiction",
      rating: 4.8,
      genres: ["Drama", "Crimen"],
    },
    {
      id: "movie15",
      title: "El club de la lucha",
      year: "1999",
      director: "David Fincher",
      poster: "/placeholder.svg?height=300&width=200&text=Fight+Club",
      rating: 4.7,
      genres: ["Drama", "Thriller"],
    },
    {
      id: "movie16",
      title: "Matrix",
      year: "1999",
      director: "Lana y Lilly Wachowski",
      poster: "/placeholder.svg?height=300&width=200&text=Matrix",
      rating: 4.7,
      genres: ["Ciencia ficción", "Acción"],
    },
    {
      id: "movie17",
      title: "El señor de los anillos: El retorno del rey",
      year: "2003",
      director: "Peter Jackson",
      poster: "/placeholder.svg?height=300&width=200&text=LOTR",
      rating: 4.9,
      genres: ["Fantasía", "Aventura"],
    },
    {
      id: "movie18",
      title: "Parásitos",
      year: "2019",
      director: "Bong Joon-ho",
      poster: "/placeholder.svg?height=300&width=200&text=Parasite",
      rating: 4.6,
      genres: ["Drama", "Thriller"],
    },
  ]

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Películas</h1>
          <p className="text-gray-400">Descubre, valora y comenta las mejores películas</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar películas..." className="pl-8 w-[200px] md:w-[250px]" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="hidden md:block w-[250px] shrink-0">
          <div className="sticky top-4 space-y-6">
            <div>
              <h3 className="font-medium mb-3">Filtrar películas</h3>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="genres">
                  <AccordionTrigger className="py-2">Géneros</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="genre-action" className="mr-2" />
                        <label htmlFor="genre-action">Acción</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="genre-comedy" className="mr-2" />
                        <label htmlFor="genre-comedy">Comedia</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="genre-drama" className="mr-2" />
                        <label htmlFor="genre-drama">Drama</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="genre-scifi" className="mr-2" />
                        <label htmlFor="genre-scifi">Ciencia ficción</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="genre-horror" className="mr-2" />
                        <label htmlFor="genre-horror">Terror</label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="year">
                  <AccordionTrigger className="py-2">Año</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="year-2024" className="mr-2" />
                        <label htmlFor="year-2024">2024</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="year-2023" className="mr-2" />
                        <label htmlFor="year-2023">2023</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="year-2022" className="mr-2" />
                        <label htmlFor="year-2022">2022</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="year-2021" className="mr-2" />
                        <label htmlFor="year-2021">2021</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="year-older" className="mr-2" />
                        <label htmlFor="year-older">Anteriores</label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="rating">
                  <AccordionTrigger className="py-2">Valoración</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="rating-5" className="mr-2" />
                        <label htmlFor="rating-5">5 estrellas</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="rating-4" className="mr-2" />
                        <label htmlFor="rating-4">4+ estrellas</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="rating-3" className="mr-2" />
                        <label htmlFor="rating-3">3+ estrellas</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="rating-2" className="mr-2" />
                        <label htmlFor="rating-2">2+ estrellas</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="rating-1" className="mr-2" />
                        <label htmlFor="rating-1">1+ estrellas</label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <Button className="w-full">Aplicar filtros</Button>
          </div>
        </div>

        <div className="flex-1">
          <Tabs defaultValue="popular" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="popular">Populares</TabsTrigger>
                <TabsTrigger value="new">Estrenos</TabsTrigger>
                <TabsTrigger value="classics">Clásicos</TabsTrigger>
              </TabsList>

              <Select defaultValue="rating">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Valoración</SelectItem>
                  <SelectItem value="year-desc">Año (más reciente)</SelectItem>
                  <SelectItem value="year-asc">Año (más antiguo)</SelectItem>
                  <SelectItem value="title">Título</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="popular">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {popularMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    year={movie.year}
                    poster={movie.poster}
                    rating={movie.rating}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="new">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {newReleases.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    year={movie.year}
                    poster={movie.poster}
                    rating={movie.rating}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="classics">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {classics.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    year={movie.year}
                    poster={movie.poster}
                    rating={movie.rating}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-center">
            <Button variant="outline">Cargar más películas</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
