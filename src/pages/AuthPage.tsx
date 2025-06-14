import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";

type AuthMode = "login" | "register";
type LoginMethod = "email" | "phone";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [numeroTelefono, setNumeroTelefono] = useState("");
  const [nomeUtente, setNomeUtente] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");

  useEffect(() => {
    // Redirect se già loggato
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.replace(`/cliente/${session.user.id}`);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.location.replace(`/cliente/${session.user.id}`);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Controllo solo i campi obbligatori (numero telefono è opzionale)
    if (!nome || !cognome || !email || !password || !nomeUtente) {
      setError("Compila tutti i campi obbligatori");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/cliente`,
          data: {
            nome,
            cognome,
            numero_telefono: numeroTelefono || null, // Se vuoto, passa null
            nome_utente: nomeUtente,
          }
        }
      });

      if (error) throw error;
      
      // Registrazione completata, reindirizza con userId
      if (data.user) {
        window.location.replace(`/cliente/${data.user.id}`);
      }
    } catch (error: any) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!loginIdentifier || !password) {
      setError("Inserisci le credenziali");
      setLoading(false);
      return;
    }

    try {
      let signInData;
      
      if (loginMethod === "phone") {
        // Login con numero di telefono (tramite Twilio)
        signInData = await supabase.auth.signInWithPassword({
          phone: loginIdentifier,
          password,
        });
      } else {
        // Login con email o nome utente
        // Prima provo con email
        if (loginIdentifier.includes("@")) {
          signInData = await supabase.auth.signInWithPassword({
            email: loginIdentifier,
            password,
          });
        } else {
          // Se non è email, cerco l'email dal nome utente
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("email")
            .eq("nome_utente", loginIdentifier)
            .single();
          
          if (!profile) throw new Error("Nome utente non trovato");
          
          signInData = await supabase.auth.signInWithPassword({
            email: profile.email,
            password,
          });
        }
      }

      if (signInData.error) throw signInData.error;
      
      // Login completato, reindirizza con userId
      if (signInData.data.user) {
        window.location.replace(`/cliente/${signInData.data.user.id}`);
      }
    } catch (error: any) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sabbia to-cemento/20 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <a 
                href="/"
                className="text-cemento hover:text-antracite transition-colors"
                title="Torna alla home"
              >
                <ArrowLeft size={24} />
              </a>
              <h1 className="text-2xl font-oswald font-bold text-antracite tracking-wide">
                Ferramenta Lucini
              </h1>
            </div>
            <CardTitle className="text-xl text-antracite">
              {authMode === "login" ? "Accedi al tuo account" : "Crea un nuovo account"}
            </CardTitle>
            <CardDescription>
              {authMode === "login" 
                ? "Inserisci le tue credenziali per accedere"
                : "Compila i dati per registrarti"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {authMode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Metodo di login */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setLoginMethod("email")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${
                      loginMethod === "email" 
                        ? "bg-white text-antracite shadow-sm" 
                        : "text-gray-600"
                    }`}
                  >
                    Email/Username
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod("phone")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${
                      loginMethod === "phone" 
                        ? "bg-white text-antracite shadow-sm" 
                        : "text-gray-600"
                    }`}
                  >
                    Telefono
                  </button>
                </div>

                <div>
                  <Label htmlFor="loginIdentifier">
                    {loginMethod === "phone" ? "Numero di telefono" : "Email o Nome utente"}
                  </Label>
                  <Input
                    id="loginIdentifier"
                    type={loginMethod === "phone" ? "tel" : "text"}
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={
                      loginMethod === "phone" 
                        ? "+39 123 456 7890" 
                        : "email@esempio.com o nomeutente"
                    }
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-senape hover:bg-senape/90 text-antracite font-semibold"
                  disabled={loading}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {loading ? "Accesso..." : "Accedi"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cognome">Cognome *</Label>
                    <Input
                      id="cognome"
                      value={cognome}
                      onChange={(e) => setCognome(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="nomeUtente">Nome utente *</Label>
                  <Input
                    id="nomeUtente"
                    value={nomeUtente}
                    onChange={(e) => setNomeUtente(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="numeroTelefono">Numero di telefono</Label>
                  <Input
                    id="numeroTelefono"
                    type="tel"
                    value={numeroTelefono}
                    onChange={(e) => setNumeroTelefono(e.target.value)}
                    placeholder="+39 123 456 7890"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-senape hover:bg-senape/90 text-antracite font-semibold"
                  disabled={loading}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {loading ? "Registrazione..." : "Registrati"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setAuthMode(authMode === "login" ? "register" : "login");
                  setError(null);
                }}
                className="text-senape hover:text-senape/80 font-medium text-sm transition-colors"
              >
                {authMode === "login" 
                  ? "Non hai un account? Registrati qui" 
                  : "Hai già un account? Accedi qui"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
