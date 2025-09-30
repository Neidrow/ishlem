import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { useAppointments } from "@/hooks/useAppointments";
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
  const { appointments, loading, updateAppointment } = useAppointments();
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = currentDate.toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.date === today);

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
        <AppointmentForm />
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
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Chargement...</p>
              </div>
            ) : todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun rendez-vous prévu pour cette date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => {
                  const startTime = new Date(`2000-01-01T${appointment.start_time}`);
                  const endTime = new Date(`2000-01-01T${appointment.end_time}`);
                  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
                  
                  return (
                    <Card 
                      key={appointment.id} 
                      className="border border-border hover:shadow-elegant transition-all duration-200"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center gap-1 min-w-fit bg-primary/10 p-3 rounded-lg">
                            <div className="text-lg font-bold text-primary">
                              {appointment.start_time.slice(0, 5)}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {duration}min
                            </div>
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-foreground">
                                {appointment.title}
                              </h3>
                              {getStatusBadge(appointment.status || 'scheduled')}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-foreground">{appointment.client?.name}</span>
                              </div>
                              {appointment.vehicle && (
                                <div className="flex items-center gap-2">
                                  <Car className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">
                                    {appointment.vehicle.make} {appointment.vehicle.model} - {appointment.vehicle.license_plate}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {appointment.description && (
                              <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                                {appointment.description}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <AppointmentForm 
                              appointment={appointment}
                              trigger={<Button variant="outline" size="sm">Modifier</Button>}
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateAppointment(appointment.id, { status: 'completed' })}
                            >
                              Terminer
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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
              <span className="font-bold text-foreground">{todayAppointments.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Confirmés</span>
              <span className="font-bold text-success">
                {todayAppointments.filter(apt => apt.status === "confirmed").length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Programmés</span>
              <span className="font-bold text-warning">
                {todayAppointments.filter(apt => apt.status === "scheduled").length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Terminés</span>
              <span className="font-bold text-success">
                {todayAppointments.filter(apt => apt.status === "completed").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AppointmentForm 
              trigger={
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau rendez-vous
                </Button>
              }
            />
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