
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserRole = 'Cliente' | 'Moderato' | 'Amministratore' | 'Super Amministratore';

export type Permission = 
  | 'visualizzare_prodotti'
  | 'gestire_prodotti'
  | 'pubblicare_modifiche'
  | 'modificare_permessi'
  | 'chat_clienti'
  | 'chat_staff';

export function useUserRole(user: User | null) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    fetchUserRole();
  }, [user]);

  const fetchUserRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Errore nel caricamento ruolo:', error);
        return;
      }

      setRole(data?.role as UserRole);
    } catch (error) {
      console.error('Errore nel caricamento ruolo:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = async (permission: Permission): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('user_has_permission', {
        user_id: user.id,
        permission_name: permission
      });

      if (error) {
        console.error('Errore nel controllo permesso:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Errore nel controllo permesso:', error);
      return false;
    }
  };

  const isAdmin = () => {
    return role === 'Amministratore' || role === 'Super Amministratore';
  };

  return {
    role,
    loading,
    hasPermission,
    isAdmin
  };
}
