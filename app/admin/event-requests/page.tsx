"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X, Calendar, MapPin, Clock, Eye, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

type EventRequest = {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  date: string;
  time_range: string;
  location: string;
  address?: string;
  price?: number;
  image_url?: string;
  max_attendees?: number;
  user_id: string;
  status: string;
  profiles?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
};

export default function EventRequestsPage() {
  const [requests, setRequests] = useState<EventRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("event_requests")
        .select("*, profiles(name, email, avatar)")
        .order("created_at", { ascending: false })

      if (error) console.error(error)
      else setRequests(data as EventRequest[])

      setIsLoading(false)
    }

    fetchRequests()
  }, [])

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    setIsProcessing(true)

    const { error } = await supabase
      .from("event_requests")
      .update({ status })
      .eq("id", id)

    if (!error && status === "approved") {
      const request = requests.find((r) => r.id === id)
      if (request) {
        await supabase.from("events").insert({
          title: request.title,
          description: request.description,
          long_description: request.long_description,
          date: request.date,
          time_range: request.time_range,
          location: request.location,
          address: request.address,
          price: request.price,
          image_url: request.image_url,
          max_attendees: request.max_attendees,
          user_id: request.user_id,
        })
      }
    }

    const updated = requests.map((r) =>
      r.id === id ? { ...r, status } : r
    )
    setRequests(updated)
    setIsProcessing(false)
  }

  const getBadge = (status: string) => {
    if (status === "pending")
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pendiente</Badge>
    if (status === "approved")
      return <Badge variant="outline" className="text-green-600 border-green-600">Aprobada</Badge>
    if (status === "rejected")
      return <Badge variant="outline" className="text-red-600 border-red-600">Rechazada</Badge>
    return <Badge variant="outline">Desconocido</Badge>
  }

  const filteredRequests = {
    pending: requests.filter((r) => r.status === "pending"),
    approved: requests.filter((r) => r.status === "approved"),
    rejected: requests.filter((r) => r.status === "rejected"),
    all: requests,
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Solicitudes de eventos</h1>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="approved">Aprobadas</TabsTrigger>
          <TabsTrigger value="rejected">Rechazadas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>

        {(["pending", "approved", "rejected", "all"] as const).map((status) => (
          <TabsContent key={status} value={status} className="space-y-4 pt-4">
            {filteredRequests[status].length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay solicitudes</h3>
                    <p className="text-muted-foreground">No se encontraron solicitudes en esta categoría.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredRequests[status].map((r) => (
                <Card key={r.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-1 flex gap-2 items-center">
                          {r.title} {getBadge(r.status)}
                        </CardTitle>
                        <p className="text-muted-foreground text-sm">{r.description}</p>
                      </div>
                      <div className="flex gap-2">
                        {r.status === "pending" && (
                          <>
                            <Button
                              onClick={() => handleUpdateStatus(r.id, "approved")}
                              disabled={isProcessing}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleUpdateStatus(r.id, "rejected")}
                              disabled={isProcessing}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>{r.title}</DialogTitle>
                              <DialogDescription>{r.long_description}</DialogDescription>
                            </DialogHeader>
                            <div className="text-sm space-y-2 mt-2">
                              {r.address && <p><strong>Dirección:</strong> {r.address}</p>}
                              {r.price && <p><strong>Precio:</strong> {r.price} €</p>}
                              {r.max_attendees && <p><strong>Aforo máximo:</strong> {r.max_attendees}</p>}
                              {r.image_url && <p><strong>Imagen:</strong> <a className="text-blue-600 underline" href={r.image_url} target="_blank">Ver imagen</a></p>}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(r.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{r.time_range}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{r.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={r.profiles?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {r.profiles?.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{r.profiles?.name}</p>
                        <p className="text-xs text-muted-foreground">{r.profiles?.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
