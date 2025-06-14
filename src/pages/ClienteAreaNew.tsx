
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, LogOut, Home, Mail, Phone, AtSign, AlertTriangle } from "lucide-react";

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
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [daysToVerification, setDaysToVerification] = useState(30);

  useEffect(() => {
    checkAuth();
  }, [userId]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Verifica che l'utente possa accedere a questa pagina (deve essere il suo profilo)
      if (session.user.id !== userId) {
        navigate(`/cliente/${session.user.id}`);
        return;
      }

      // Controlla se l'email è verificata
      setIsEmailVerified(!!session.user.email_confirmed_at);

      // Calcola i giorni rimanenti per la verifica (se l'email non è verificata)
      if (!session.user.email_confirmed_at && session.user.created_at) {
        const createdAt = new Date(session.user.created_at);
        const now = new Date();
        const daysPassed = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.max(0, 30 - daysPassed);
        setDaysToVerification(daysRemaining);
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
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const resendVerificationEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: profile?.email || '',
        options: {
          emailRedirectTo: `${window.location.origin}/cliente/${userId}`
        }
      });
      
      if (error) {
        console.error("Errore invio email:", error);
      } else {
        alert("Email di verifica inviata!");
      }
    } catch (error) {
      console.error("Errore:", error);
    }
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
              onClick={() => navigate("/auth")} 
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
              <p className="text-xs text-gray-500">ID: {userId}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
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

        {/* Alert per email non verificata */}
        {!isEmailVerified && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Email non verificata!</strong> Hai ancora <strong>{daysToVerification} giorni</strong> per verificare la tua email, 
              altrimenti il tuo account verrà chiuso. 
              <Button 
                variant="link" 
                className="p-0 h-auto text-orange-600 underline ml-1"
                onClick={resendVerificationEmail}
              >
                Clicca qui per inviare nuovamente l'email di verifica
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Benvenuto */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-senape/10 to-ruggine/10">
            <CardTitle className="text-2xl text-antracite font-oswald">
              Benvenuto, {profile.nome} {profile.cognome}!
            </CardTitle>
            <CardDescription className="text-lg">
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
                  <p className="font-medium text-antracite">
                    Email {!isEmailVerified && <span className="text-orange-600 text-xs">(non verificata)</span>}
                  </p>
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
