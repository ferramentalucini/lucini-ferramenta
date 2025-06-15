
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// Non esistono più ruoli ora: mettiamo il tipo base (o elimina direttamente se non viene più usato)
export function useUserRole(user: User | null) {
  // Dummy implementation che non restituisce nessun ruolo
  const [loading, setLoading] = useState(false);

  // In questo stato del database la funzione non fa nulla, perché non esistono più user_roles.
  useEffect(() => {
    setLoading(false);
  }, [user]);

  // Funzioni "vuote"
  const hasPermission = async () => false;
  const isAdmin = () => false;

  return {
    role: null,
    loading,
    hasPermission,
    isAdmin
  };
}
