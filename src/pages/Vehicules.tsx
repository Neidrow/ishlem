import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { VehicleForm } from "@/components/forms/VehicleForm";
import { useVehicles } from "@/hooks/useVehicles";
import { 
  Plus,
  Search,
  Car,
  Calendar,
  User,
  Settings,
  FileText
} from "lucide-react";
import { useState } from "react";

const Vehicules = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { vehicles, loading } = useVehicles();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Actif</Badge>;
      case "maintenance":
        return <Badge className="bg-warning text-warning-foreground">Maintenance</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.license_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Véhicules</h1>
          <p className="text-muted-foreground">Gérez le parc automobile de vos clients</p>
        </div>
        <VehicleForm />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher un véhicule..."
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
              {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="border border-border hover:shadow-elegant transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Car className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold text-foreground">
                            {vehicle.make} {vehicle.model} ({vehicle.year})
                          </h3>
                          {getStatusBadge(vehicle.status || 'active')}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">Plaque:</span>
                              <span className="text-muted-foreground">{vehicle.license_plate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{vehicle.client?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">Téléphone:</span>
                              <span className="text-muted-foreground">{vehicle.client?.phone}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">Kilométrage:</span>
                              <span className="text-muted-foreground">{vehicle.mileage.toLocaleString()} km</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Dernière révision: {vehicle.last_service ? new Date(vehicle.last_service).toLocaleDateString('fr-FR') : 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Prochaine révision: {vehicle.next_service ? new Date(vehicle.next_service).toLocaleDateString('fr-FR') : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <VehicleForm 
                        vehicle={vehicle}
                        trigger={
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                        }
                      />
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Historique
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        RDV
                      </Button>
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

export default Vehicules;