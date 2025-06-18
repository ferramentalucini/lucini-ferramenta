
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AuthUser {
  id: string;
  username: string;
  role: string;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const handleAdminLogin = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { username, password }
      });

      if (error) throw error;

      if (data.success) {
        const adminUser = data.user;
        setUser(adminUser);
        
        // Salva in localStorage per persistenza
        localStorage.setItem('admin_user', JSON.stringify(adminUser));
        
        toast({
          title: "Accesso amministratore completato!",
          description: `Benvenuto ${adminUser.username}!`,
        });

        // Reindirizza all'area admin
        window.location.replace('/admin/admin-user');
      } else {
        throw new Error(data.error || 'Credenziali non valide');
      }
    } catch (error: any) {
      console.error("Errore login admin:", error);
      setError(error.message || 'Errore durante il login');
      toast({
        title: "Errore login",
        description: error.message || 'Credenziali non valide',
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleUserLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Accesso completato!",
          description: "Benvenuto!",
        });
        window.location.replace(`/cliente/${data.user.id}`);
      }
    } catch (error: any) {
      console.error("Errore login utente:", error);
      setError(error.message);
      toast({
        title: "Errore login",
        description: error.message,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleUserRegister = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/cliente`,
        },
      });

      if (error) throw error;

      toast({
        title: "Registrazione completata!",
        description: "Benvenuto! Controlla la tua email per confermare l'account.",
      });

      if (data.user) {
        window.location.replace(`/cliente/${data.user.id}`);
      }
    } catch (error: any) {
      console.error("Errore registrazione:", error);
      setError(error.message);
      toast({
        title: "Errore registrazione",
        description: error.message,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('admin_user');
    setUser(null);
    supabase.auth.signOut();
    window.location.replace('/');
  };

  const checkAdminAuth = () => {
    const adminUser = localStorage.getItem('admin_user');
    if (adminUser) {
      setUser(JSON.parse(adminUser));
      return true;
    }
    return false;
  };

  return {
    loading,
    error,
    user,
    handleAdminLogin,
    handleUserLogin,
    handleUserRegister,
    logout,
    checkAdminAuth,
    setError
  };
}
