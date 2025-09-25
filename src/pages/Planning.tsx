import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Calendar,
  Clock,
  User,
  Car,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const Planning = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const appointments = [
    {
      id: 1,
      time: "09:00",
      duration: 120,
      client: "Martin Dupont",
      service: "Révision complète",
      vehicle: "Peugeot 308 - AB-123-CD",
      status: "confirmed",
      notes: "Client régulier - véhicule sous garantie"
    },
    {
      id: 2,
      time: "10:30",
      duration: 90,
      client: "Sophie Laurent",
      service: "Changement pneus",
      vehicle: "Renault Clio - EF-456-GH",
      status: "pending",
      notes: "Pneus hiver à monter"
    },
    {
      id: 3,
      time: "14:00",
      duration: 60,
      client: "Jean Moreau",
      service: "Diagnostic moteur",
      vehicle: "BMW X3 - IJ-789-KL",
      status: "confirmed",
      notes: "Problème voyant moteur"
    },
    {
      id: 4,
      time: "16:00",
      duration: 45,
      client: "Marie Dubois",
      service: "Contrôle technique",
      vehicle: "Citroën C3 - MN-012-OP",
      status: "confirmed",
      notes: "Première visite"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success text-success-foreground">Confirmé</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">En attente</Badge>;
      case "completed":
        return <Badge variant="secondary">Terminé</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDurationClass = (duration: number) => {
    if (duration <= 60) return "h-16";
    if (duration <= 90) return "h-20";
    if (duration <= 120) return "h-24";
    return "h-28";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planning</h1>
          <p className="text-muted-foreground">Gérez vos rendez-vous et interventions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau RDV
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {formatDate(currentDate)}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Aujourd'hui
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun rendez-vous prévu pour cette date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <Card 
                    key={appointment.id} 
                    className={`border border-border hover:shadow-elegant transition-all duration-200 ${getDurationClass(appointment.duration)}`}
                  >
                    <CardContent className="p-4 h-full">
                      <div className="flex items-start gap-4 h-full">
                        <div className="flex flex-col items-center gap-1 min-w-fit">
                          <div className="text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                            {appointment.time}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {appointment.duration}min
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground truncate">
                              {appointment.service}
                            </h3>
                            {getStatusBadge(appointment.status)}
                          </div>
                          
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span className="font-medium text-foreground">{appointment.client}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Car className="h-4 w-4" />
                              <span>{appointment.vehicle}</span>
                            </div>
                            {appointment.notes && (
                              <div className="text-muted-foreground mt-2 text-xs bg-muted/30 p-2 rounded">
                                {appointment.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                          <Button variant="outline" size="sm">
                            Terminer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Statistiques du jour</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total RDV</span>
              <span className="font-bold text-foreground">{appointments.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Temps total</span>
              <span className="font-bold text-foreground">
                {appointments.reduce((total, apt) => total + apt.duration, 0)} min
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Confirmés</span>
              <span className="font-bold text-success">
                {appointments.filter(apt => apt.status === "confirmed").length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">En attente</span>
              <span className="font-bold text-warning">
                {appointments.filter(apt => apt.status === "pending").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau rendez-vous
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Vue semaine
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Créneaux libres
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <User className="h-4 w-4 mr-2" />
              Clients sans RDV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Planning;