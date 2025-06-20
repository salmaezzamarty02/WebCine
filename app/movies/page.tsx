import { getAllMovies } from "@/lib/queries"
import MovieCard from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default async function MoviesPage() {
  const movies = await getAllMovies()

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
                      {["Acción", "Comedia", "Drama", "Ciencia ficción", "Terror"].map((genre) => (
                        <div key={genre} className="flex items-center">
                          <input type="checkbox" id={`genre-${genre}`} className="mr-2" />
                          <label htmlFor={`genre-${genre}`}>{genre}</label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="year">
                  <AccordionTrigger className="py-2">Año</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {[2024, 2023, 2022, 2021, "Anteriores"].map((year) => (
                        <div key={year} className="flex items-center">
                          <input type="checkbox" id={`year-${year}`} className="mr-2" />
                          <label htmlFor={`year-${year}`}>{year}</label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="rating">
                  <AccordionTrigger className="py-2">Valoración</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center">
                          <input type="checkbox" id={`rating-${star}`} className="mr-2" />
                          <label htmlFor={`rating-${star}`}>{star} estrellas</label>
                        </div>
                      ))}
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
            </div>

            {['popular', 'new', 'classics'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      id={movie.id}
                      title={movie.title}
                      year={String(movie.release_year)}
                      poster={movie.image_url}
                      rating={movie.rating}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-8 flex justify-center">
            <Button variant="outline">Cargar más películas</Button>
          </div>
        </div>
      </div>
    </div>
  )
}