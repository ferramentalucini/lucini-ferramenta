
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function ClienteRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Se l'utente è loggato, reindirizza alla sua pagina personale
          navigate(`/cliente/${session.user.id}`, { replace: true });
        } else {
          // Se non è loggato, reindirizza alla pagina di login
          navigate("/auth", { replace: true });
        }
      } catch (error) {
        console.error("Errore nel controllo autenticazione:", error);
        navigate("/auth", { replace: true });
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  // Mostra un loading durante il redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sabbia to-cemento/20">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-senape"></div>
    </div>
  );
}
