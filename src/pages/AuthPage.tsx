import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

    // Pulizia/assegnazione lato frontend
    let finalEmail = email;
    let role: "Amministratore" | "Cliente" = "Cliente";
    let originalEmail: string | null = null;

    const emailPrefix = email.split("@")[0];
    const emailDomain = email.split("@")[1] || "";

    if (emailPrefix.endsWith(".admin")) {
      role = "Amministratore";
      originalEmail = email;
      finalEmail = emailPrefix.replace(/\.admin$/, "") + "@" + emailDomain;
    }

    if (!nome || !cognome || !finalEmail || !password || !nomeUtente) {
      const missingFields = [];
      if (!nome) missingFields.push("Nome");
      if (!cognome) missingFields.push("Cognome");
      if (!finalEmail) missingFields.push("Email");
      if (!password) missingFields.push("Password");
      if (!nomeUtente) missingFields.push("Nome utente");
      const errorMsg = `Campi mancanti: ${missingFields.join(", ")}`;
      setError(errorMsg);
      setLoading(false);
      return;
    }

    try {
      console.log("=== REGISTRAZIONE INIZIATA ===");
      console.log("Dati inviati per signUp:", {
        email: finalEmail,
        password: "[HIDDEN]",
        opzioni: {
          nome,
          cognome,
          numero_telefono: numeroTelefono || null,
          nome_utente: nomeUtente,
          ruolo: role,
          ...(originalEmail ? { original_email: originalEmail } : {}),
        },
      });

      // SOLO signup: NESSUN INSERT MANUALE user_profiles/user_roles
      const { data: signupData, error: signupErr } = await supabase.auth.signUp({
        email: finalEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/cliente`,
          data: {
            nome,
            cognome,
            numero_telefono: numeroTelefono || null,
            nome_utente: nomeUtente,
            ruolo: role,
            ...(originalEmail ? { original_email: originalEmail } : {}),
          }
        }
      });
      console.log("Risposta signUp Supabase:", { signupData, signupErr });
      if (signupErr) throw signupErr;
      if (!signupData.user || !signupData.user.id) {
        setError("Registrazione completata ma nessun dato utente ricevuto");
        console.error("❌ Registrazione: utente mancante in signupData!", signupData);
        setLoading(false);
        return;
      }
      const userId = signupData.user.id;

      toast({
        title: "Registrazione completata!",
        description: `Benvenuto ${nome}! Reindirizzamento in corso...`,
      });
      console.log("✅ Registrazione completata. Redirect su /cliente/" + userId);
      window.location.replace(`/cliente/${userId}`);

    } catch (error: any) {
      setError(`Errore durante la registrazione: ${error.message}`);
      toast({
        title: "Errore durante la registrazione",
        description: error.message,
        variant: "destructive",
      });
      console.error("❌ Errore try/catch generale registrazione:", error);
    }

    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
