import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Car,
  Calendar
} from "lucide-react";
import { useState } from "react";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const clients = [
    {
      id: 1,
      name: "Martin Dupont",
      email: "martin.dupont@email.com",
      phone: "06 12 34 56 78",
      address: "123 Rue de la Paix, 75001 Paris",
      vehicles: 2,
      lastVisit: "2024-01-15",
      status: "active",
      totalSpent: 2450
    },
    {
      id: 2,
      name: "Sophie Laurent",
      email: "sophie.laurent@email.com",
      phone: "06 98 76 54 32",
      address: "456 Avenue des Champs, 75008 Paris",
      vehicles: 1,
      lastVisit: "2024-01-10",
      status: "active",
      totalSpent: 1200
    },
    {
      id: 3,
      name: "Jean Moreau",
      email: "jean.moreau@email.com",
      phone: "06 11 22 33 44",
      address: "789 Boulevard Saint-Germain, 75007 Paris",
      vehicles: 3,
      lastVisit: "2023-12-20",
      status: "inactive",
      totalSpent: 3800
    },
    {
      id: 4,
      name: "Marie Dubois",
      email: "marie.dubois@email.com",
      phone: "06 55 66 77 88",
      address: "321 Rue de Rivoli, 75004 Paris",
      vehicles: 1,
      lastVisit: "2024-01-20",
      status: "new",
      totalSpent: 150
    }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-success text-success-foreground">Actif</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactif</Badge>;
      case "new":
        return <Badge className="bg-accent text-accent-foreground">Nouveau</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">Gérez vos clients et leurs informations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              Filtres
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="border border-border hover:shadow-elegant transition-all duration-200 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">{client.name}</h3>
                        {getStatusBadge(client.status)}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{client.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{client.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">{client.address}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Car className="h-4 w-4" />
                            <span>{client.vehicles} véhicule{client.vehicles > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Dernière visite: {new Date(client.lastVisit).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="text-foreground font-medium">
                            Total dépensé: {client.totalSpent}€
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        Voir
                      </Button>
                      <Button variant="outline" size="sm">
                        Éditer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;