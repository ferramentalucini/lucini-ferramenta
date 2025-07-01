
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export function useUserRole(user: User | null) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        console.log('🔍 Recupero ruolo per utente:', user.id);
        
        // Prima proviamo a leggere dalla tabella user_profiles
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Errore recupero profilo:', profileError);
          // Fallback: controlla se l'email contiene .admin
          const isAdminEmail = user.email?.includes('.admin') || false;
          setRole(isAdminEmail ? 'Amministratore' : 'Cliente');
        } else {
          console.log('✅ Ruolo recuperato dal database:', profile.role);
          // Normalizza il ruolo per compatibilità
          const normalizedRole = profile.role === 'amministratore' ? 'Amministratore' : 'Cliente';
          setRole(normalizedRole);
        }
      } catch (error) {
        console.error('💥 Errore generico recupero ruolo:', error);
        // Fallback: controlla se l'email contiene .admin
        const isAdminEmail = user.email?.includes('.admin') || false;
        setRole(isAdminEmail ? 'Amministratore' : 'Cliente');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasPermission = async () => false;
  
  const isAdmin = () => {
    console.log('🔎 Controllo admin - Ruolo corrente:', role);
    return role === 'Amministratore';
  };

  return {
    role,
    loading,
    hasPermission,
    isAdmin
  };
}
