import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  subject: string;
  content: string;
  is_read: boolean;
  message_type: string;
  created_at: string;
};

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Errore caricamento messaggi:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i messaggi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, is_read: true } : m
      ));
    } catch (error) {
      console.error('Errore aggiornamento messaggio:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il messaggio",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (messageData: {
    recipient_id?: string;
    subject: string;
    content: string;
    message_type?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utente non autenticato');

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          ...messageData
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchMessages(); // Ricarica i messaggi
      toast({
        title: "Successo",
        description: "Messaggio inviato con successo",
      });
      return data;
    } catch (error) {
      console.error('Errore invio messaggio:', error);
      toast({
        title: "Errore",
        description: "Impossibile inviare il messaggio",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    loading,
    markAsRead,
    sendMessage,
    refetch: fetchMessages
  };
}