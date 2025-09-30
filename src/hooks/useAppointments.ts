import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Appointment {
  id: string;
  client_id: string;
  vehicle_id?: string | null;
  title: string;
  description?: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status: string | null;
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

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          client:clients(name),
          vehicle:vehicles(make, model, license_plate)
        `)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAppointments((data || []) as Appointment[]);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rendez-vous",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'client' | 'vehicle'>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select(`
          *,
          client:clients(name),
          vehicle:vehicles(make, model, license_plate)
        `)
        .single();

      if (error) throw error;

      setAppointments(prev => [data as Appointment, ...prev]);
      toast({
        title: "Succès",
        description: "Rendez-vous créé avec succès"
      });
      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le rendez-vous",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          client:clients(name),
          vehicle:vehicles(make, model, license_plate)
        `)
        .single();

      if (error) throw error;

      setAppointments(prev => prev.map(appointment => 
        appointment.id === id ? { ...appointment, ...data } as Appointment : appointment
      ));
      
      toast({
        title: "Succès",
        description: "Rendez-vous modifié avec succès"
      });
      return data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le rendez-vous",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
      toast({
        title: "Succès",
        description: "Rendez-vous supprimé avec succès"
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    refetch: fetchAppointments
  };
};