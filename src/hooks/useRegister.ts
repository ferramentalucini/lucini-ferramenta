
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { RegisterFormData } from "@/types/auth";
import { cleanAndValidateUserData, determineUserRole, processEmailForSupabase } from "@/utils/authHelpers";

export function useRegister() {
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
      const ruolo = determineUserRole(data.email);
      console.log("👤 Ruolo assegnato:", ruolo);

      // Processa l'email: rimuove ".admin" se presente
      const emailPerSupabase = processEmailForSupabase(data.email);
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

      console.log("✅ Utente auth creato con UID:", signupData.user.id);

      // FASE 2: Pulizia e validazione dati usando UID e dati del form
      console.log("🧹 FASE 2: Preparazione dati profilo...");
      const cleanedData = cleanAndValidateUserData(signupData.user.id, data, ruolo);
      
      if (!cleanedData) {
        // Cleanup: elimina l'utente auth se i dati non sono validi
        try {
          await supabase.auth.admin.deleteUser(signupData.user.id);
        } catch (deleteErr) {
          console.error("❌ Errore eliminazione utente:", deleteErr);
        }
        throw new Error("Dati utente non validi dopo la pulizia");
      }

      console.log("✅ Dati preparati:", cleanedData);

      // FASE 3: Autenticazione per permettere l'inserimento RLS
      console.log("🔐 FASE 3: Autenticazione per RLS...");
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: emailPerSupabase,
        password: data.password,
      });

      if (loginError) {
        console.error("❌ Errore login per RLS:", loginError);
        // Cleanup: elimina l'utente auth
        try {
          await supabase.auth.admin.deleteUser(signupData.user.id);
        } catch (deleteErr) {
          console.error("❌ Errore eliminazione utente:", deleteErr);  
        }
        throw loginError;
      }

      console.log("✅ Utente autenticato per RLS");

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

  return {
    loading,
    error,
    handleRegister,
    setError
  };
}
