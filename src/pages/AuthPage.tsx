
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const { loading, error, handleRegister, handleLogin, setError } = useAuth();

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sabbia to-cemento/20 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <AuthHeader isLogin={authMode === "login"} />
          
          <CardContent>
            {authMode === "login" ? (
              <LoginForm 
                onLogin={handleLogin}
                loading={loading}
                error={error}
              />
            ) : (
              <RegisterForm 
                onRegister={handleRegister}
                loading={loading}
                error={error}
              />
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
