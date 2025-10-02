import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Mail, Phone, MapPin, Save, Bell, Eye, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Parametres = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Succès",
        description: "Les paramètres ont été sauvegardés"
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground">Gérez les paramètres de votre garage</p>
      </div>

      <div className="space-y-6">
        {/* Informations de l'entreprise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informations de l'Entreprise
            </CardTitle>
            <CardDescription>
              Configurez les informations de votre garage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nom de l'entreprise</Label>
                <Input id="company-name" placeholder="Garage Auto Pro" defaultValue="Garage Auto Pro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siret">SIRET</Label>
                <Input id="siret" placeholder="123 456 789 00012" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" placeholder="123 Rue de la Mécanique" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" placeholder="Paris" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal-code">Code postal</Label>
                <Input id="postal-code" placeholder="75001" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Téléphone
                </Label>
                <Input id="phone" placeholder="+33 1 23 45 67 89" type="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input id="email" placeholder="contact@garage.fr" type="email" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de facturation */}
        <Card>
          <CardHeader>
            <CardTitle>Facturation</CardTitle>
            <CardDescription>
              Configurez vos préférences de facturation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-prefix">Préfixe des factures</Label>
                <Input id="invoice-prefix" placeholder="FAC-" defaultValue="FAC-" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-start">Numéro de départ</Label>
                <Input id="invoice-start" type="number" placeholder="1000" defaultValue="1000" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-terms">Conditions de paiement</Label>
              <Select defaultValue="30">
                <SelectTrigger id="payment-terms">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Paiement immédiat</SelectItem>
                  <SelectItem value="15">15 jours</SelectItem>
                  <SelectItem value="30">30 jours</SelectItem>
                  <SelectItem value="45">45 jours</SelectItem>
                  <SelectItem value="60">60 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tva-rate">Taux de TVA (%)</Label>
              <Input id="tva-rate" type="number" placeholder="20" defaultValue="20" step="0.01" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-notes">Notes par défaut sur les factures</Label>
              <Textarea 
                id="invoice-notes" 
                placeholder="Merci de votre confiance..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Gérez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rappels de rendez-vous</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir un rappel 24h avant chaque rendez-vous
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Factures impayées</Label>
                <p className="text-sm text-muted-foreground">
                  Notification pour les factures en retard de paiement
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Nouveaux clients</Label>
                <p className="text-sm text-muted-foreground">
                  Notification lors de l'ajout d'un nouveau client
                </p>
              </div>
              <Switch />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Interventions terminées</Label>
                <p className="text-sm text-muted-foreground">
                  Notification à la fin de chaque intervention
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Apparence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Thème</Label>
              <Select defaultValue="system">
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select defaultValue="fr">
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Horaires d'ouverture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Horaires d'Ouverture
            </CardTitle>
            <CardDescription>
              Configurez vos horaires de travail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { day: "Lundi", id: "mon" },
              { day: "Mardi", id: "tue" },
              { day: "Mercredi", id: "wed" },
              { day: "Jeudi", id: "thu" },
              { day: "Vendredi", id: "fri" },
              { day: "Samedi", id: "sat" },
              { day: "Dimanche", id: "sun" }
            ].map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-28">
                  <Label>{item.day}</Label>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Input type="time" defaultValue="08:00" className="w-32" />
                  <span className="text-muted-foreground">à</span>
                  <Input type="time" defaultValue="18:00" className="w-32" />
                </div>
                <Switch defaultChecked={item.id !== "sun"} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">Annuler</Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Parametres;
