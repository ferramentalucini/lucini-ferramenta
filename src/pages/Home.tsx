import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import HeroFerramenta from "@/components/home/HeroFerramenta";
import ServiziFerramenta from "@/components/home/ServiziFerramenta";
import ProdottiConsigliati from "@/components/home/ProdottiConsigliati";
import ChiSiamoFerramenta from "@/components/home/ChiSiamoFerramenta";
import ContattiFerramenta from "@/components/home/ContattiFerramenta";
import { Button } from "@/components/ui/button";
import { User, LogOut, LogIn } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Controlla se l'utente è loggato
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleLogin = () => {
    window.location.href = "/auth";
  };

  const handleGoToProfile = () => {
    if (user) {
      window.location.href = `/cliente/${user.id}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header con pulsanti di login/logout */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-oswald font-bold text-antracite">
                Ferramenta Lucini
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleGoToProfile}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <User size={16} />
                    Area Cliente
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="flex items-center gap-2 bg-senape hover:bg-senape/90 text-antracite"
                >
                  <LogIn size={16} />
                  Accedi
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenuto principale */}
      <main>
        <HeroFerramenta />
        <ServiziFerramenta />
        <ProdottiConsigliati />
        <ChiSiamoFerramenta />
        <ContattiFerramenta />
      </main>
    </div>
  );
}
