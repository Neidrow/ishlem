import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InvoiceForm } from "@/components/forms/InvoiceForm";
import { useInvoices } from "@/hooks/useInvoices";
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
  const { invoices, loading } = useInvoices();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = filteredInvoices
    .filter(f => f.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Factures</h1>
          <p className="text-muted-foreground">Gérez vos factures et paiements</p>
        </div>
        <InvoiceForm />
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
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Chargement...</p>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune facture trouvée</p>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <Card key={invoice.id} className="border border-border hover:shadow-elegant transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold text-foreground">Facture #{invoice.invoice_number}</h3>
                          {getStatusBadge(invoice.status || 'draft')}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div>
                              <span className="text-muted-foreground">Client: </span>
                              <span className="font-medium text-foreground">{invoice.client?.name}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Date: </span>
                              <span className="text-foreground">{new Date(invoice.date).toLocaleDateString('fr-FR')}</span>
                            </div>
                            {invoice.due_date && (
                              <div>
                                <span className="text-muted-foreground">Échéance: </span>
                                <span className="text-foreground">{new Date(invoice.due_date).toLocaleDateString('fr-FR')}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <span className="text-muted-foreground">Montant: </span>
                              <span className="text-lg font-bold text-foreground">{invoice.amount.toFixed(2)}€</span>
                            </div>
                            {invoice.paid_amount && invoice.paid_amount > 0 && (
                              <div>
                                <span className="text-muted-foreground">Payé: </span>
                                <span className="text-foreground">{invoice.paid_amount.toFixed(2)}€</span>
                              </div>
                            )}
                            {invoice.description && (
                              <div>
                                <span className="text-muted-foreground">Description: </span>
                                <span className="text-foreground">{invoice.description}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <InvoiceForm 
                          invoice={invoice}
                          trigger={
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Factures;