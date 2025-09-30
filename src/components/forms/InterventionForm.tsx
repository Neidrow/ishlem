import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Intervention, useInterventions } from '@/hooks/useInterventions';
import { useClients } from '@/hooks/useClients';
import { useVehicles } from '@/hooks/useVehicles';
import { Plus, Edit } from 'lucide-react';

interface InterventionFormProps {
  intervention?: Intervention;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export const InterventionForm: React.FC<InterventionFormProps> = ({ intervention, trigger, onSuccess }) => {
  const { createIntervention, updateIntervention } = useInterventions();
  const { clients } = useClients();
  const { vehicles } = useVehicles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_id: intervention?.client_id || '',
    vehicle_id: intervention?.vehicle_id || '',
    type: intervention?.type || '',
    description: intervention?.description || '',
    date: intervention?.date || new Date().toISOString().split('T')[0],
    duration: intervention?.duration || 60,
    cost: intervention?.cost || 0,
    status: intervention?.status || 'scheduled' as 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
    technician: intervention?.technician || '',
    parts: intervention?.parts || [],
    notes: intervention?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (intervention) {
        await updateIntervention(intervention.id, formData);
      } else {
        await createIntervention(formData);
      }
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button>
      {intervention ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
      {intervention ? 'Modifier' : 'Nouvelle intervention'}
    </Button>
  );

  const clientVehicles = vehicles.filter(vehicle => vehicle.client_id === formData.client_id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {intervention ? 'Modifier l\'intervention' : 'Nouvelle intervention'}
          </DialogTitle>
          <DialogDescription>
            Enregistrez une intervention pour un client et son véhicule
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_id">Client *</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value, vehicle_id: '' }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle_id">Véhicule *</Label>
              <Select
                value={formData.vehicle_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {clientVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} - {vehicle.license_plate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type d'intervention *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type d'intervention" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vidange">Vidange</SelectItem>
                  <SelectItem value="revision">Révision</SelectItem>
                  <SelectItem value="reparation">Réparation</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                  <SelectItem value="pneumatiques">Pneumatiques</SelectItem>
                  <SelectItem value="freinage">Freinage</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technician">Technicien</Label>
              <Input
                id="technician"
                value={formData.technician}
                onChange={(e) => setFormData(prev => ({ ...prev, technician: e.target.value }))}
                placeholder="Nom du technicien"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description détaillée de l'intervention"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (min) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Coût (€) *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'scheduled' | 'in_progress' | 'completed' | 'cancelled') => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Programmée</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};