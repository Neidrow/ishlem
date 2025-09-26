import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Intervention {
  id: string;
  vehicle_id: string;
  client_id: string;
  type: string;
  description?: string | null;
  date: string;
  duration: number;
  cost: number;
  status: string | null;
  technician?: string | null;
  parts: any;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  client?: {
    name: string;
  } | null;
  vehicle?: {
    make: string;
    model: string;
    license_plate: string;
  } | null;
}

export const useInterventions = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInterventions = async () => {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .select(`
          *,
          client:clients(name),
          vehicle:vehicles(make, model, license_plate)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      setInterventions((data || []) as Intervention[]);
    } catch (error) {
      console.error('Error fetching interventions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les interventions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createIntervention = async (interventionData: Omit<Intervention, 'id' | 'created_at' | 'updated_at' | 'client' | 'vehicle'>) => {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .insert([interventionData])
        .select(`
          *,
          client:clients(name),
          vehicle:vehicles(make, model, license_plate)
        `)
        .single();

      if (error) throw error;

      setInterventions(prev => [data as Intervention, ...prev]);
      toast({
        title: "Succès",
        description: "Intervention créée avec succès"
      });
      return data;
    } catch (error) {
      console.error('Error creating intervention:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'intervention",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateIntervention = async (id: string, updates: Partial<Intervention>) => {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          client:clients(name),
          vehicle:vehicles(make, model, license_plate)
        `)
        .single();

      if (error) throw error;

      setInterventions(prev => prev.map(intervention => 
        intervention.id === id ? { ...intervention, ...data } as Intervention : intervention
      ));
      
      toast({
        title: "Succès",
        description: "Intervention modifiée avec succès"
      });
      return data;
    } catch (error) {
      console.error('Error updating intervention:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'intervention",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteIntervention = async (id: string) => {
    try {
      const { error } = await supabase
        .from('interventions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInterventions(prev => prev.filter(intervention => intervention.id !== id));
      toast({
        title: "Succès",
        description: "Intervention supprimée avec succès"
      });
    } catch (error) {
      console.error('Error deleting intervention:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'intervention",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchInterventions();
  }, []);

  return {
    interventions,
    loading,
    createIntervention,
    updateIntervention,
    deleteIntervention,
    refetch: fetchInterventions
  };
};