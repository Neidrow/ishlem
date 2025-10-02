import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface QuoteItem {
  id?: string;
  quote_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  tax_rate: number;
  subtotal: number;
  total: number;
  sort_order: number;
}

export interface Quote {
  id: string;
  client_id: string;
  quote_number: string;
  date: string;
  expiry_date?: string | null;
  subtotal: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  status: string | null;
  description?: string | null;
  notes?: string | null;
  terms?: string | null;
  created_at: string;
  updated_at: string;
  client?: {
    name: string;
    email?: string | null;
  } | null;
  items?: QuoteItem[];
}

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          client:clients(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes((data || []) as Quote[]);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les devis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async (quoteData: Omit<Quote, 'id' | 'created_at' | 'updated_at' | 'client' | 'items'>, items: Omit<QuoteItem, 'id' | 'quote_id'>[]) => {
    try {
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert([quoteData])
        .select(`
          *,
          client:clients(name, email)
        `)
        .single();

      if (quoteError) throw quoteError;

      // Insert items
      if (items.length > 0) {
        const itemsWithQuoteId = items.map(item => ({
          ...item,
          quote_id: quote.id
        }));

        const { error: itemsError } = await supabase
          .from('quote_items')
          .insert(itemsWithQuoteId);

        if (itemsError) throw itemsError;
      }

      setQuotes(prev => [quote as Quote, ...prev]);
      toast({
        title: "Succès",
        description: "Devis créé avec succès"
      });
      return quote;
    } catch (error) {
      console.error('Error creating quote:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le devis",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateQuote = async (id: string, updates: Partial<Quote>) => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          client:clients(name, email)
        `)
        .single();

      if (error) throw error;

      setQuotes(prev => prev.map(quote => 
        quote.id === id ? { ...quote, ...data } as Quote : quote
      ));
      
      toast({
        title: "Succès",
        description: "Devis modifié avec succès"
      });
      return data;
    } catch (error) {
      console.error('Error updating quote:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le devis",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuotes(prev => prev.filter(quote => quote.id !== id));
      toast({
        title: "Succès",
        description: "Devis supprimé avec succès"
      });
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le devis",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return {
    quotes,
    loading,
    createQuote,
    updateQuote,
    deleteQuote,
    refetch: fetchQuotes
  };
};
