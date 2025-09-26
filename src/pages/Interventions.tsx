import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useInterventions } from "@/hooks/useInterventions";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus,
  Search,
  Wrench,
  Calendar,
  User,
  Car,
  Clock,
  Euro,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

const Interventions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { interventions, loading, updateIntervention } = useInterventions();
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Terminée</Badge>;
      case "in-progress":
        return <Badge className="bg-warning text-warning-foreground">En cours</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Programmée</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-warning" />;
      case "scheduled":
        return <Calendar className="h-5 w-5 text-muted-foreground" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Wrench className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const completeIntervention = async (id: string) => {
    try {
      await updateIntervention(id, { status: 'completed' });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const filteredInterventions = interventions.filter(intervention =>
    intervention.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    intervention.client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (intervention.vehicle?.make + ' ' + intervention.vehicle?.model + ' - ' + intervention.vehicle?.license_plate).toLowerCase().includes(searchQuery.toLowerCase()) ||
    intervention.technician?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interventions</h1>
          <p className="text-muted-foreground">Suivi des interventions et réparations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle intervention
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Terminées</p>
                <p className="text-2xl font-bold text-foreground">
                  {interventions.filter(i => i.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En cours</p>
                <p className="text-2xl font-bold text-foreground">
                  {interventions.filter(i => i.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Programmées</p>
                <p className="text-2xl font-bold text-foreground">
                  {interventions.filter(i => i.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Euro className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CA du mois</p>
                <p className="text-2xl font-bold text-foreground">
                  {interventions.reduce((total, i) => total + i.cost, 0).toLocaleString()}€
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une intervention..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <div className="space-y-4">
              {filteredInterventions.map((intervention) => (
              <Card key={intervention.id} className="border border-border hover:shadow-elegant transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        {getStatusIcon(intervention.status)}
                      </div>
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold text-foreground">
                            {intervention.type}
                          </h3>
                          {getStatusBadge(intervention.status || 'scheduled')}
                        </div>
                        
                        <p className="text-muted-foreground">{intervention.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{intervention.client?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {intervention.vehicle?.make} {intervention.vehicle?.model} - {intervention.vehicle?.license_plate}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Wrench className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Technicien: {intervention.technician}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {new Date(intervention.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{intervention.duration}min</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Euro className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{intervention.cost}€</span>
                            </div>
                          </div>
                        </div>
                        
                        {intervention.parts && Array.isArray(intervention.parts) && intervention.parts.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-foreground mb-2">Pièces utilisées:</p>
                            <div className="flex flex-wrap gap-2">
                              {intervention.parts.map((part: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {part}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm">
                        Détails
                      </Button>
                      {intervention.status === 'in-progress' && (
                        <Button size="sm" onClick={() => completeIntervention(intervention.id)}>
                          Terminer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Interventions;