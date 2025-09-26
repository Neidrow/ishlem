import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Vehicle {
  id: string;
  client_id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  vin?: string | null;
  color?: string | null;
  mileage: number;
  status: string | null;
  last_service?: string | null;
  next_service?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  client?: {
    name: string;
    phone?: string | null;
  } | null;
}

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          client:clients(name, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles((data || []) as Vehicle[]);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les véhicules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'client'>) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicleData])
        .select(`
          *,
          client:clients(name, phone)
        `)
        .single();

      if (error) throw error;

      setVehicles(prev => [data as Vehicle, ...prev]);
      toast({
        title: "Succès",
        description: "Véhicule ajouté avec succès"
      });
      return data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le véhicule",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          client:clients(name, phone)
        `)
        .single();

      if (error) throw error;

      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === id ? { ...vehicle, ...data } as Vehicle : vehicle
      ));
      
      toast({
        title: "Succès",
        description: "Véhicule modifié avec succès"
      });
      return data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le véhicule",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
      toast({
        title: "Succès",
        description: "Véhicule supprimé avec succès"
      });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le véhicule",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    refetch: fetchVehicles
  };
};