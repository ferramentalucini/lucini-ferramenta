
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoginMethod } from "@/types/auth";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (loginIdentifier: string, password: string, loginMethod: LoginMethod) => {
    setLoading(true);
    setError(null);

    console.log("🔄 Inizio login utente");
    console.log("🔑 Metodo:", loginMethod);
    console.log("📧 Identificatore:", loginIdentifier);

    if (!loginIdentifier || !password) {
      setError("Inserisci le credenziali");
      setLoading(false);
      return;
    }

    try {
      let signInData;
      
      if (loginMethod === "phone") {
        console.log("📱 Login con telefono");
        signInData = await supabase.auth.signInWithPassword({
          phone: loginIdentifier,
          password,
        });
      } else {
        // Login con email o nome utente
        if (loginIdentifier.includes("@")) {
          console.log("📧 Login con email");
          signInData = await supabase.auth.signInWithPassword({
            email: loginIdentifier,
            password,
          });
        } else {
          console.log("👤 Login con nome utente");
          const { data: profile, error: profileErr } = await supabase
            .from("user_profiles")
            .select("email")
            .eq("nome_utente", loginIdentifier)
            .single();
          
          if (profileErr) {
            throw new Error("Nome utente non trovato (" + profileErr.message + ")");
          }
          if (!profile || !profile.email) throw new Error("Nome utente non trovato (nessuna email).");
          console.log("Nome utente trovato con email:", profile.email);
          
          signInData = await supabase.auth.signInWithPassword({
            email: profile.email,
            password,
          });
        }
      }

      console.log("Risposta login:", signInData);
      if (signInData.error) throw signInData.error;
      
      if (signInData.data.user) {
        console.log("✅ Login completato:", signInData.data.user.id);
        window.location.replace(`/cliente/${signInData.data.user.id}`);
      }
    } catch (error: any) {
      console.error("💥 Errore login:", error);
      setError(error.message);
    }
    
    setLoading(false);
  };

  return {
    loading,
    error,
    handleLogin,
    setError
  };
}
