
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  LogOut, 
  Home, 
  Mail, 
  Phone, 
  AtSign, 
  Shield, 
  Settings,
  Package,
  Users,
  MessageSquare,
  BarChart3,
  Plus,
  Edit,
  Trash,
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  Activity
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

type UserProfile = {
  nome: string;
  cognome: string;
  email: string;
  numero_telefono: string | null;
  nome_utente: string;
  created_at: string;
};

export default function AdminDashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { role, isAdmin } = useUserRole(user);
  const [activeTab, setActiveTab] = useState("dashboard");

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

      setUser(session.user);

      // Verifica che l'userId nell'URL corrisponda all'utente loggato
      if (userId && userId !== session.user.id) {
        console.error("Accesso negato: userId non corrispondente");
        navigate(`/admin/${session.user.id}`);
        return;
      }

      // Se non c'è userId nell'URL, reindirizza con l'ID corretto
      if (!userId) {
        navigate(`/admin/${session.user.id}`);
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
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-neutral-50 to-neutral-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (!profile || !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-neutral-50 to-neutral-100">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600 mb-4">Accesso negato - Permessi amministratore richiesti</p>
            <Button 
              onClick={() => navigate(`/cliente/${userId}`)} 
              className="w-full"
            >
              Vai all'area cliente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-800">
                  Pannello Amministrazione
                </h1>
                <p className="text-neutral-600 text-sm">Benvenuto, {profile.nome} {profile.cognome}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <Home size={18} />
                Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(`/cliente/${userId}`)}
                className="flex items-center gap-2"
              >
                <User size={18} />
                Area Cliente
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm border border-neutral-200/50">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity size={16} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package size={16} />
              Prodotti
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              Utenti
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center gap-2">
              <MessageSquare size={16} />
              Comunicazioni
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Impostazioni
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-600">Utenti Totali</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neutral-800">1,234</div>
                  <p className="text-xs text-green-600">+12% rispetto al mese scorso</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-600">Prodotti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neutral-800">567</div>
                  <p className="text-xs text-blue-600">+8 nuovi questa settimana</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-600">Messaggi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neutral-800">89</div>
                  <p className="text-xs text-amber-600">5 non letti</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-600">Attività</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neutral-800">24</div>
                  <p className="text-xs text-purple-600">azioni oggi</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell size={20} />
                    Attività Recenti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-800">Nuovo utente registrato</p>
                        <p className="text-xs text-neutral-600">2 minuti fa</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-800">Prodotto aggiornato</p>
                        <p className="text-xs text-neutral-600">15 minuti fa</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-800">Nuovo messaggio ricevuto</p>
                        <p className="text-xs text-neutral-600">1 ora fa</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 size={20} />
                    Statistiche Rapide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Utenti Attivi</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-[78%]"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Prodotti Venduti</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full w-[65%]"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Soddisfazione</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full w-[92%]"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-800">Gestione Prodotti</h2>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download size={16} />
                  Esporta
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload size={16} />
                  Importa
                </Button>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600">
                  <Plus size={16} />
                  Nuovo Prodotto
                </Button>
              </div>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Cerca prodotti..."
                      className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter size={16} />
                    Filtri
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-12 text-neutral-500">
                    <Package size={48} className="mx-auto mb-4 text-neutral-300" />
                    <p className="text-lg font-medium mb-2">Nessun prodotto trovato</p>
                    <p className="text-sm">Inizia aggiungendo il tuo primo prodotto</p>
                    <Button className="mt-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600">
                      Aggiungi Prodotto
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-800">Gestione Utenti</h2>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download size={16} />
                  Esporta Utenti
                </Button>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600">
                  <Plus size={16} />
                  Invita Utente
                </Button>
              </div>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Cerca utenti..."
                      className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter size={16} />
                    Filtri
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-12 text-neutral-500">
                    <Users size={48} className="mx-auto mb-4 text-neutral-300" />
                    <p className="text-lg font-medium mb-2">Gestione utenti in sviluppo</p>
                    <p className="text-sm">Questa funzionalità sarà disponibile presto</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-800">Centro Comunicazioni</h2>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600">
                <Plus size={16} />
                Nuova Comunicazione
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
                <CardHeader>
                  <CardTitle>Messaggi Ricevuti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-neutral-500">
                    <MessageSquare size={48} className="mx-auto mb-4 text-neutral-300" />
                    <p className="text-lg font-medium mb-2">Nessun messaggio</p>
                    <p className="text-sm">I messaggi degli utenti appariranno qui</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
                <CardHeader>
                  <CardTitle>Notifiche di Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-neutral-500">
                    <Bell size={48} className="mx-auto mb-4 text-neutral-300" />
                    <p className="text-lg font-medium mb-2">Tutto tranquillo</p>
                    <p className="text-sm">Le notifiche di sistema appariranno qui</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-neutral-800">Analytics e Reportistica</h2>
            
            <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
              <CardContent className="pt-6">
                <div className="text-center py-12 text-neutral-500">
                  <BarChart3 size={48} className="mx-auto mb-4 text-neutral-300" />
                  <p className="text-lg font-medium mb-2">Analytics in sviluppo</p>
                  <p className="text-sm">Grafici e statistiche dettagliate saranno disponibili presto</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-neutral-800">Impostazioni Sistema</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
                <CardHeader>
                  <CardTitle>Configurazione Generale</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-neutral-500">
                    <Settings size={48} className="mx-auto mb-4 text-neutral-300" />
                    <p className="text-sm">Impostazioni in sviluppo</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
                <CardHeader>
                  <CardTitle>Sicurezza</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-neutral-500">
                    <Shield size={48} className="mx-auto mb-4 text-neutral-300" />
                    <p className="text-sm">Impostazioni sicurezza in sviluppo</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
