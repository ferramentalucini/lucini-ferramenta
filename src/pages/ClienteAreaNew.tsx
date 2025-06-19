import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, LogOut, Home, Mail, Phone, AtSign } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import EmailConfirmationAlert from "@/components/auth/EmailConfirmationAlert";

type UserProfile = {
  nome: string;
  cognome: string;
  email: string;
  numero_telefono: string | null;
  nome_utente: string;
  created_at: string;
};

export default function ClienteAreaNew() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { role, isAdmin } = useUserRole(user);

  useEffect(() => {
    checkAuth();
  }, [userId]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.replace("/auth");
        return;
      }

      setUser(session.user);

      // Verifica che l'userId nell'URL corrisponda all'utente loggato
      if (userId && userId !== session.user.id) {
        console.error("Accesso negato: userId non corrispondente");
        window.location.replace(`/cliente/${session.user.id}`);
        return;
      }

      // Se non c'è userId nell'URL, reindirizza con l'ID corretto
      if (!userId) {
        window.location.replace(`/cliente/${session.user.id}`);
        return;
      }

      // Carica il profilo utente
      const { data: userProfile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Errore nel caricamento profilo:", error);
        return;
      }

      setProfile(userProfile);
    } catch (error) {
      console.error("Errore autenticazione:", error);
      window.location.replace("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sabbia to-cemento/20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-senape"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sabbia to-cemento/20">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Errore nel caricamento del profilo</p>
            <Button 
              onClick={() => window.location.replace("/auth")} 
              className="w-full mt-4"
            >
              Torna al login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sabbia to-cemento/20 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <User className="text-senape" size={32} />
            <div>
              <h1 className="text-3xl font-oswald font-bold text-antracite">
                Area Cliente
              </h1>
              <p className="text-cemento">Benvenuto nella tua area personale</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => window.location.replace("/")}
              className="flex items-center gap-2"
            >
              <Home size={18} />
              Home
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>

        {/* Email Confirmation Alert */}
        {userId && <EmailConfirmationAlert userId={userId} />}

        {/* Benvenuto */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-senape/10 to-ruggine/10">
            <CardTitle className="text-2xl text-antracite font-oswald">
              Benvenuto, {profile?.nome} {profile?.cognome}!
            </CardTitle>
            <CardDescription className="text-lg flex items-center gap-2">
              È un piacere averti nella famiglia Ferramenta Lucini
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Informazioni profilo */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-antracite">
                <User size={20} />
                Informazioni Personali
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User size={18} className="text-senape" />
                <div>
                  <p className="font-medium text-antracite">Nome completo</p>
                  <p className="text-cemento">{profile.nome} {profile.cognome}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <AtSign size={18} className="text-senape" />
                <div>
                  <p className="font-medium text-antracite">Nome utente</p>
                  <p className="text-cemento">@{profile.nome_utente}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-antracite">
                <Mail size={20} />
                Contatti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail size={18} className="text-senape" />
                <div>
                  <p className="font-medium text-antracite">Email</p>
                  <p className="text-cemento">{profile.email}</p>
                </div>
              </div>
              
              {profile.numero_telefono && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={18} className="text-senape" />
                  <div>
                    <p className="font-medium text-antracite">Telefono</p>
                    <p className="text-cemento">{profile.numero_telefono}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sezioni future */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-antracite">I miei ordini</CardTitle>
              <CardDescription>Visualizza i tuoi acquisti</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-cemento text-center py-8">
                Nessun ordine effettuato
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-antracite">Lista desideri</CardTitle>
              <CardDescription>I tuoi prodotti preferiti</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-cemento text-center py-8">
                Lista vuota
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-antracite">Assistenza</CardTitle>
              <CardDescription>Hai bisogno di aiuto?</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-cemento text-center py-8">
                Contattaci per supporto
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-cemento text-sm">
            Cliente dal {new Date(profile.created_at).toLocaleDateString('it-IT')}
          </p>
        </div>
      </div>
    </div>
  );
}
