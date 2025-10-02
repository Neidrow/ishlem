import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, 
  FileText, 
  Calendar, 
  Euro,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { InvoiceForm } from "@/components/forms/InvoiceForm";
import { useClients } from "@/hooks/useClients";
import { useInvoices } from "@/hooks/useInvoices";
import { useAppointments } from "@/hooks/useAppointments";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const { clients } = useClients();
  const { invoices } = useInvoices();
  const { appointments } = useAppointments();

  // Calcul des statistiques réelles
  const activeClients = clients.filter(c => c.status === 'active').length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyInvoices = invoices.filter(inv => {
    const invDate = new Date(inv.date);
    return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
  });

  const monthlyRevenue = monthlyInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.date === today);

  const stats = [
    {
      title: "Clients Actifs",
      value: activeClients,
      description: "Total des clients",
      icon: Users,
    },
    {
      title: "Factures du Mois",
      value: monthlyInvoices.length,
      description: "Factures émises",
      icon: FileText,
    },
    {
      title: "Chiffre d'Affaires",
      value: `${monthlyRevenue.toLocaleString('fr-FR')}€`,
      description: "Ce mois",
      icon: Euro,
      variant: "success" as const,
    },
    {
      title: "RDV Aujourd'hui",
      value: todayAppointments.length,
      description: "Rendez-vous planifiés",
      icon: Calendar,
      variant: "warning" as const
    }
  ];

  const recentActivities = [
    { id: 1, type: "invoice", client: "Martin Dupont", action: "Facture #2024-001 créée", time: "Il y a 2h", status: "pending" },
    { id: 2, type: "appointment", client: "Sophie Laurent", action: "RDV programmé pour demain 14h", time: "Il y a 3h", status: "confirmed" },
    { id: 3, type: "payment", client: "Jean Moreau", action: "Paiement reçu - 450€", time: "Il y a 5h", status: "completed" },
    { id: 4, type: "client", client: "Nouveau client", action: "Marie Dubois ajoutée", time: "Il y a 1 jour", status: "new" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-primary" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/planning')}>
            <Calendar className="h-4 w-4 mr-2" />
            Planning
          </Button>
          <Button size="sm" onClick={() => setShowInvoiceDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle facture
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Activité Récente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                {getStatusIcon(activity.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.client}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.action}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Prochains Rendez-vous</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { time: "09:00", client: "Martin Dupont", service: "Vidange + Révision", status: "confirmed" },
                { time: "10:30", client: "Sophie Laurent", service: "Changement pneus", status: "pending" },
                { time: "14:00", client: "Jean Moreau", service: "Diagnostic moteur", status: "confirmed" },
                { time: "16:00", client: "Marie Dubois", service: "Contrôle technique", status: "confirmed" }
              ].map((appointment, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="text-sm font-mono font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {appointment.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {appointment.client}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {appointment.service}
                    </p>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${
                    appointment.status === "confirmed" ? "bg-success" : "bg-warning"
                  }`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog pour nouvelle facture */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle Facture</DialogTitle>
            <DialogDescription>
              Créez une nouvelle facture pour un client
            </DialogDescription>
          </DialogHeader>
          <InvoiceForm onSuccess={() => setShowInvoiceDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;