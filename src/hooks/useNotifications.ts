import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  created_at: string;
  user_id?: string;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Simulazione di notifiche di sistema
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Sistema Aggiornato',
      message: 'Il sistema è stato aggiornato alla versione 2.1.0',
      type: 'success',
      isRead: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minuti fa
    },
    {
      id: '2',
      title: 'Backup Completato',
      message: 'Backup automatico dei dati completato con successo',
      type: 'info',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 ore fa
    },
    {
      id: '3',
      title: 'Spazio Disco',
      message: 'Attenzione: Spazio disco al 85% della capacità',
      type: 'warning',
      isRead: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() // 4 ore fa
    }
  ];

  const fetchNotifications = async () => {
    try {
      // Per ora usiamo dati mock, in futuro si può implementare una tabella notifications
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Errore caricamento notifiche:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le notifiche",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
      
      toast({
        title: "Notifica letta",
        description: "Notifica contrassegnata come letta",
      });
    } catch (error) {
      console.error('Errore aggiornamento notifica:', error);
    }
  };

  const createSystemNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'isRead'>) => {
    try {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        isRead: false
      };

      setNotifications(prev => [newNotification, ...prev]);
      
      toast({
        title: "Notifica creata",
        description: "Nuova notifica di sistema creata",
      });
    } catch (error) {
      console.error('Errore creazione notifica:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    markAsRead,
    createSystemNotification,
    refetch: fetchNotifications
  };
}