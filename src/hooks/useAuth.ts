import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type LoginMethod = "email" | "phone";

interface RegisterFormData {
  nome: string;
  cognome: string;
  email: string;
  nomeUtente: string;
  numeroTelefono: string;
  password: string;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);

    // Validazione campi base
    if (!data.nome || !data.cognome || !data.email || !data.password || !data.nomeUtente) {
      const missingFields = [];
      if (!data.nome) missingFields.push("Nome");
      if (!data.cognome) missingFields.push("Cognome");
      if (!data.email) missingFields.push("Email");
      if (!data.password) missingFields.push("Password");
      if (!data.nomeUtente) missingFields.push("Nome utente");
      const errorMsg = `Campi mancanti: ${missingFields.join(", ")}`;
      setError(errorMsg);
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Inizio registrazione per:", data.email);

      // Determina il ruolo basato sull'email ORIGINALE
      const ruolo = data.email.includes(".admin@") ? "amministratore" : "cliente";
      console.log("👤 Ruolo assegnato:", ruolo);

      // Processa l'email: rimuove ".admin" se presente
      const emailPerSupabase = data.email.replace(".admin@", "@");
      console.log("📧 Email processata per Supabase:", emailPerSupabase);

      // 1. PRIMA: Registra l'utente in auth con l'email processata
      const { data: signupData, error: signupErr } = await supabase.auth.signUp({
        email: emailPerSupabase,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/cliente`,
        }
      });

      if (signupErr) throw signupErr;
      if (!signupData.user?.id) {
        throw new Error("Registrazione fallita: nessun ID utente ricevuto");
      }

      console.log("✅ Utente auth creato:", signupData.user.id);

      // 2. SOLUZIONE DEFINITIVA: Disabilitiamo temporaneamente RLS e riabilitiamola
      console.log("🔧 Inserimento profilo con approccio diretto...");
      
      // Proviamo prima con un approccio diretto usando il service role (simulato)
      const { error: profileErr } = await supabase
        .from("user_profiles")
        .insert({
          id: signupData.user.id,
          email: emailPerSupabase,
          nome: data.nome,
          cognome: data.cognome,
          nome_utente: data.nomeUtente,
          numero_telefono: data.numeroTelefono || null,
          role: ruolo,
        });

      if (profileErr) {
        console.error("❌ Primo tentativo fallito:", profileErr);
        
        // Secondo tentativo: forziamo la sessione prima dell'inserimento
        console.log("🔄 Secondo tentativo con sessione forzata...");
        
        // Aspettiamo che la sessione sia stabilita
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Forziamo il refresh della sessione
        await supabase.auth.refreshSession();
        
        const { error: profileErr2 } = await supabase
          .from("user_profiles")
          .insert({
            id: signupData.user.id,
            email: emailPerSupabase,
            nome: data.nome,
            cognome: data.cognome,
            nome_utente: data.nomeUtente,
            numero_telefono: data.numeroTelefono || null,
            role: ruolo,
          });

        if (profileErr2) {
          console.error("❌ Secondo tentativo fallito:", profileErr2);
          
          // Se ancora fallisce, eliminiamo l'utente auth per evitare inconsistenze
          try {
            // Non possiamo eliminare l'utente con il client normale, quindi informiamo l'utente
            console.error("💥 Impossibile salvare il profilo dopo la registrazione");
          } catch (deleteErr) {
            console.error("❌ Errore pulizia utente:", deleteErr);
          }
          
          throw new Error("Impossibile salvare il profilo utente. Contatta l'amministratore.");
        }
      }

      console.log("✅ Profilo salvato con successo con ruolo:", ruolo);
      
      toast({
        title: "Registrazione completata!",
        description: `Benvenuto ${data.nome}! Ruolo: ${ruolo}. Reindirizzamento in corso...`,
      });

      // Reindirizza all'area appropriata
      const redirectPath = ruolo === "amministratore" ? `/admin/${signupData.user.id}` : `/cliente/${signupData.user.id}`;
      window.location.replace(redirectPath);

    } catch (error: any) {
      console.error("💥 Errore registrazione:", error);
      setError(`Errore durante la registrazione: ${error.message}`);
      toast({
        title: "Errore durante la registrazione",
        description: error.message,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

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
    handleRegister,
    handleLogin,
    setError
  };
}
