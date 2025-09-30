import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Invoice {
  id: string;
  client_id: string;
  invoice_number: string;
  date: string;
  due_date?: string | null;
  amount: number;
  paid_amount: number | null;
  status: string | null;
  description?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  client?: {
    name: string;
    email?: string | null;
  } | null;
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          client:clients(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices((data || []) as Invoice[]);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les factures",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'client'>) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select(`
          *,
          client:clients(name, email)
        `)
        .single();

      if (error) throw error;

      setInvoices(prev => [data as Invoice, ...prev]);
      toast({
        title: "Succès",
        description: "Facture créée avec succès"
      });
      return data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          client:clients(name, email)
        `)
        .single();

      if (error) throw error;

      setInvoices(prev => prev.map(invoice => 
        invoice.id === id ? { ...invoice, ...data } as Invoice : invoice
      ));
      
      toast({
        title: "Succès",
        description: "Facture modifiée avec succès"
      });
      return data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la facture",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
      toast({
        title: "Succès",
        description: "Facture supprimée avec succès"
      });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la facture",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    loading,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    refetch: fetchInvoices
  };
};