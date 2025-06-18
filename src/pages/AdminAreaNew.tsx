
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, LogOut, Home, Shield, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminAreaNew() {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const { user, logout, checkAdminAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [userId]);

  const checkAuth = async () => {
    try {
      // Controlla se è loggato come admin
      const isAdminAuthenticated = checkAdminAuth();
      
      if (!isAdminAuthenticated) {
        window.location.replace("/auth");
        return;
      }

      // Verifica che l'userId nell'URL corrisponda (per admin è sempre admin-user)
      if (userId && userId !== 'admin-user') {
        window.location.replace('/admin/admin-user');
        return;
      }

      // Se non c'è userId nell'URL, reindirizza con l'ID corretto
      if (!userId) {
        window.location.replace('/admin/admin-user');
        return;
      }

    } catch (error) {
      console.error("Errore autenticazione:", error);
      window.location.replace("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sabbia to-cemento/20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-senape"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sabbia to-cemento/20">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Accesso negato - Permessi amministratore richiesti</p>
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
            <Shield className="text-ruggine" size={32} />
            <div>
              <h1 className="text-3xl font-oswald font-bold text-antracite">
                Area Amministrazione
              </h1>
              <p className="text-cemento">Pannello di controllo amministrativo</p>
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

        {/* Benvenuto Admin */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-ruggine/10 to-senape/10">
            <CardTitle className="text-2xl text-antracite font-oswald flex items-center gap-2">
              <Shield size={24} />
              Benvenuto, {user.username}!
            </CardTitle>
            <CardDescription className="text-lg flex items-center gap-2">
              Accesso al pannello amministrativo
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Informazioni profilo */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-antracite">
                <User size={20} />
                Informazioni Amministratore
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User size={18} className="text-ruggine" />
                <div>
                  <p className="font-medium text-antracite">Nome utente</p>
                  <p className="text-cemento">@{user.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield size={18} className="text-ruggine" />
                <div>
                  <p className="font-medium text-antracite">Ruolo</p>
                  <p className="text-cemento">Amministratore</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-antracite">
                <Settings size={20} />
                Stato Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-antracite">Sistema</p>
                  <p className="text-green-600">Online</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-antracite">Accesso</p>
                  <p className="text-blue-600">Autenticato</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funzioni amministrative */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-antracite flex items-center gap-2">
                <Settings size={20} />
                Gestione Prodotti
              </CardTitle>
              <CardDescription>Amministra il catalogo prodotti</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-cemento text-center py-8">
                Funzionalità in sviluppo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-antracite flex items-center gap-2">
                <User size={20} />
                Gestione Utenti
              </CardTitle>
              <CardDescription>Amministra gli utenti</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-cemento text-center py-8">
                Funzionalità in sviluppo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-antracite flex items-center gap-2">
                <Shield size={20} />
                Configurazione
              </CardTitle>
              <CardDescription>Impostazioni di sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-cemento text-center py-8">
                Funzionalità in sviluppo
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
