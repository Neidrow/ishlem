import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Search,
  FileText,
  Download,
  Eye,
  Edit,
  Euro
} from "lucide-react";
import { useState } from "react";

const Factures = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const factures = [
    {
      id: "2024-001",
      client: "Martin Dupont",
      date: "2024-01-20",
      dueDate: "2024-02-20",
      amount: 450.00,
      status: "paid",
      items: ["Vidange", "Filtre à huile", "Main d'oeuvre"],
      description: "Révision complète véhicule"
    },
    {
      id: "2024-002",
      client: "Sophie Laurent",
      date: "2024-01-18",
      dueDate: "2024-02-18",
      amount: 280.00,
      status: "pending",
      items: ["Changement plaquettes", "Main d'oeuvre"],
      description: "Remplacement plaquettes de frein"
    },
    {
      id: "2024-003",
      client: "Jean Moreau",
      date: "2024-01-15",
      dueDate: "2024-02-15",
      amount: 750.00,
      status: "overdue",
      items: ["Diagnostic électronique", "Réparation alternateur", "Main d'oeuvre"],
      description: "Réparation système électrique"
    },
    {
      id: "2024-004",
      client: "Marie Dubois",
      date: "2024-01-22",
      dueDate: "2024-02-22",
      amount: 150.00,
      status: "draft",
      items: ["Contrôle technique", "Certificat"],
      description: "Préparation contrôle technique"
    }
  ];

  const filteredFactures = factures.filter(facture =>
    facture.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facture.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success text-success-foreground">Payée</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">En attente</Badge>;
      case "overdue":
        return <Badge variant="destructive">En retard</Badge>;
      case "draft":
        return <Badge variant="outline">Brouillon</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalAmount = filteredFactures.reduce((sum, facture) => sum + facture.amount, 0);
  const paidAmount = filteredFactures
    .filter(f => f.status === "paid")
    .reduce((sum, facture) => sum + facture.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Factures</h1>
          <p className="text-muted-foreground">Gérez vos factures et paiements</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle facture
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Euro className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total facturé</p>
                <p className="text-2xl font-bold text-foreground">{totalAmount.toFixed(2)}€</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Euro className="h-8 w-8 text-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Montant perçu</p>
                <p className="text-2xl font-bold text-foreground">{paidAmount.toFixed(2)}€</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Euro className="h-8 w-8 text-warning" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-foreground">{(totalAmount - paidAmount).toFixed(2)}€</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une facture..."
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
          <div className="space-y-4">
            {filteredFactures.map((facture) => (
              <Card key={facture.id} className="border border-border hover:shadow-elegant transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">Facture #{facture.id}</h3>
                        {getStatusBadge(facture.status)}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div>
                            <span className="text-muted-foreground">Client: </span>
                            <span className="font-medium text-foreground">{facture.client}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date: </span>
                            <span className="text-foreground">{new Date(facture.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Échéance: </span>
                            <span className="text-foreground">{new Date(facture.dueDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-muted-foreground">Montant: </span>
                            <span className="text-lg font-bold text-foreground">{facture.amount.toFixed(2)}€</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Description: </span>
                            <span className="text-foreground">{facture.description}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Services: </span>
                            <span className="text-foreground">{facture.items.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
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

export default Factures;