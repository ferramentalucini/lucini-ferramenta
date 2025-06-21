
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

    // Controlla se l'email contiene .admin
    const isAdminEmail = user.email?.includes('.admin') || false;
    
    if (isAdminEmail) {
      setRole('Amministratore');
    } else {
      setRole('Cliente');
    }
    
    setLoading(false);
  }, [user]);

  const hasPermission = async () => false;
  
  const isAdmin = () => {
    return role === 'Amministratore';
  };

  return {
    role,
    loading,
    hasPermission,
    isAdmin
  };
}
