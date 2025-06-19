
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

interface UserData {
  uid: string;
  email: string;
  nome: string;
  cognome: string;
  nomeUtente: string;
  numeroTelefono: string | null;
  ruolo: string;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanAndValidateUserData = (data: any, formData: RegisterFormData, ruolo: string): UserData | null => {
    // Pulizia e validazione dei dati
    const cleanData: UserData = {
      uid: data.user?.id?.trim() || '',
      email: data.user?.email?.trim().toLowerCase() || '',
      nome: formData.nome?.trim() || '',
      cognome: formData.cognome?.trim() || '',
      nomeUtente: formData.nomeUtente?.trim() || '',
      numeroTelefono: formData.numeroTelefono?.trim() || null,
      ruolo: ruolo
    };

    // Validazione campi obbligatori
    if (!cleanData.uid || !cleanData.email || !cleanData.nome || !cleanData.cognome || !cleanData.nomeUtente) {
      return null;
    }

    return cleanData;
  };

  const attemptDataRetrieval = async (maxAttempts: number = 5): Promise<any> => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`🔄 Tentativo ${attempt}/${maxAttempts} di recupero sessione`);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log(`❌ Errore sessione tentativo ${attempt}:`, sessionError);
        if (attempt === maxAttempts) throw sessionError;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Backoff progressivo
        continue;
      }

      if (sessionData?.session?.user) {
        console.log(`✅ Dati recuperati al tentativo ${attempt}`);
        return sessionData;
      }

      console.log(`⏳ Tentativo ${attempt} fallito, riprovo...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }

    throw new Error("Impossibile recuperare i dati dell'utente dopo 5 tentativi");
  };

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

      // FASE 1: Registra l'utente in auth
      console.log("📝 FASE 1: Registrazione utente in auth...");
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

      // FASE 2: Recupero dati con retry (sistema streaming)
      console.log("📊 FASE 2: Recupero dati con sistema retry...");
      let sessionData;
      try {
        sessionData = await attemptDataRetrieval(5);
      } catch (error: any) {
        console.error("❌ Fallimento nel recupero dati:", error);
        // Cleanup: elimina l'utente auth se non riusciamo a recuperar ei dati
        try {
          await supabase.auth.admin.deleteUser(signupData.user.id);
        } catch (deleteErr) {
          console.error("❌ Errore eliminazione utente:", deleteErr);
        }
        throw new Error("Errore nel recupero dati utente: " + error.message);
      }

      // FASE 3: Pulizia e validazione dati
      console.log("🧹 FASE 3: Pulizia e validazione dati...");
      const cleanedData = cleanAndValidateUserData(sessionData, data, ruolo);
      
      if (!cleanedData) {
        throw new Error("Dati utente incompleti dopo la pulizia");
      }

      console.log("✅ Dati puliti e validati:", cleanedData);

      // FASE 4: Salvataggio nel profilo con retry
      console.log("💾 FASE 4: Salvataggio profilo...");
      let profileSaved = false;
      let lastError = null;

      for (let attempt = 1; attempt <= 5; attempt++) {
        console.log(`💾 Tentativo salvataggio ${attempt}/5`);
        
        const { error: profileErr } = await supabase
          .from("user_profiles")
          .insert({
            id: cleanedData.uid,
            email: cleanedData.email,
            nome: cleanedData.nome,
            cognome: cleanedData.cognome,
            nome_utente: cleanedData.nomeUtente,
            numero_telefono: cleanedData.numeroTelefono,
            role: cleanedData.ruolo,
          });

        if (!profileErr) {
          profileSaved = true;
          console.log(`✅ Profilo salvato al tentativo ${attempt}`);
          break;
        }

        lastError = profileErr;
        console.error(`❌ Errore salvataggio tentativo ${attempt}:`, profileErr);
        
        if (attempt < 5) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }

      if (!profileSaved) {
        console.error("❌ Fallimento definitivo salvataggio profilo:", lastError);
        
        // Cleanup: elimina l'utente auth
        try {
          await supabase.auth.admin.deleteUser(signupData.user.id);
        } catch (deleteErr) {
          console.error("❌ Errore eliminazione utente:", deleteErr);
        }
        
        throw new Error("Errore nel salvataggio del profilo dopo 5 tentativi: " + lastError?.message);
      }

      console.log("🎉 Registrazione completata con successo!");
      
      toast({
        title: "Registrazione completata!",
        description: `Benvenuto ${cleanedData.nome}! Ruolo: ${cleanedData.ruolo}`,
      });

      // Redirect all'area appropriata
      const redirectPath = cleanedData.ruolo === "amministratore" ? `/admin/${cleanedData.uid}` : `/cliente/${cleanedData.uid}`;
      setTimeout(() => {
        window.location.replace(redirectPath);
      }, 1000);

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
