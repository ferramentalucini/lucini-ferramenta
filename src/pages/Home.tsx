
import React, { useRef, useEffect, useState } from "react";
import HeroFerramenta from "../components/home/HeroFerramenta";
import ServiziFerramenta from "../components/home/ServiziFerramenta";
import ProdottiConsigliati from "../components/home/ProdottiConsigliati";
import ChiSiamoFerramenta from "../components/home/ChiSiamoFerramenta";
import ContattiFerramenta from "../components/home/ContattiFerramenta";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogIn, LogOut, User as UserIcon, Shield } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const { role, isAdmin } = useUserRole(user);
  
  // Scroll references
  const inizioRef = useRef<HTMLDivElement>(null);
  const prodottiRef = useRef<HTMLDivElement>(null);
  const chiSiamoRef = useRef<HTMLDivElement>(null);
  const contattiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Controllo sessione attuale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listener per cambiamenti di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUser = session?.user ?? null;
      
      // Se l'utente si è appena loggato, attiva l'animazione
      if (event === 'SIGNED_IN' && newUser && !user) {
        setJustLoggedIn(true);
        setTimeout(() => setJustLoggedIn(false), 4000); // Rimuovi l'animazione dopo 4 secondi
      }
      
      setUser(newUser);
    });

    return () => subscription.unsubscribe();
  }, [user]);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex flex-col w-full font-lato">
      {/* HEADER */}
      <header className="sticky top-0 left-0 z-40 section-transparent backdrop-blur-lg border-b-2 border-sabbia/30 shadow-2xl animate-slide-in-elegant">
        <div className="flex justify-between items-center px-4 md:px-16 py-4">
          <span className="text-3xl md:text-4xl font-oswald font-bold text-sabbia tracking-tight select-none animate-text-glow font-header metallic-text">
            Ferramenta Lucini
          </span>
          <div className="flex items-center gap-4 md:gap-7">
            <nav className="flex gap-4 md:gap-7 font-medium text-base">
              <button
                onClick={() => handleScroll(inizioRef)}
                className="px-3 py-2 text-sabbia rounded-lg hover:bg-senape/20 hover:text-senape transition-all duration-300 font-oswald smooth-hover animate-floating-gentle"
                style={{ animationDelay: '0.1s' }}
              >
                Inizio
              </button>
              <button
                onClick={() => handleScroll(prodottiRef)}
                className="px-3 py-2 text-sabbia rounded-lg hover:bg-senape/20 hover:text-senape transition-all duration-300 font-oswald smooth-hover animate-floating-gentle"
                style={{ animationDelay: '0.2s' }}
              >
                Prodotti
              </button>
              <button
                onClick={() => handleScroll(chiSiamoRef)}
                className="px-3 py-2 text-sabbia rounded-lg hover:bg-senape/20 hover:text-senape transition-all duration-300 font-oswald smooth-hover animate-floating-gentle"
                style={{ animationDelay: '0.3s' }}
              >
                Chi siamo
              </button>
              <button
                onClick={() => handleScroll(contattiRef)}
                className="px-3 py-2 text-sabbia rounded-lg hover:bg-senape/20 hover:text-senape transition-all duration-300 font-oswald smooth-hover animate-floating-gentle"
                style={{ animationDelay: '0.4s' }}
              >
                Contatti
              </button>
            </nav>
            
            {/* Pulsanti autenticazione */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className={`flex items-center gap-3 transition-all duration-700 ${justLoggedIn ? 'animate-login-success animate-scale-bounce' : ''}`}>
                  <a
                    href={`/cliente/${user.id}`}
                    className="flex items-center gap-2 px-4 py-2 glass-effect text-sabbia rounded-xl hover:bg-senape/20 hover:text-senape transition-all duration-300 font-oswald animate-slide-in-elegant smooth-hover"
                    style={{ animationDelay: '0.1s' }}
                  >
                    <UserIcon size={18} className="animate-icon-spin-gentle" />
                    <span className="hidden md:inline">Area Cliente</span>
                  </a>
                  
                  {/* Mostra pulsante Admin solo se l'utente è amministratore */}
                  {isAdmin() && (
                    <a
                      href={`/admin/${user.id}`}
                      className="flex items-center gap-2 px-4 py-2 glass-effect text-ruggine rounded-xl hover:bg-ruggine/20 transition-all duration-300 font-oswald animate-admin-badge smooth-hover animate-slide-in-elegant"
                      style={{ animationDelay: '0.2s' }}
                    >
                      <Shield size={18} className="animate-pulse-golden" />
                      <span className="hidden md:inline">Admin</span>
                    </a>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 glass-effect text-cemento rounded-xl hover:bg-ruggine/20 hover:text-ruggine transition-all duration-300 font-oswald smooth-hover animate-slide-in-elegant"
                    style={{ animationDelay: '0.3s' }}
                  >
                    <LogOut size={18} />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <a
                  href="/auth"
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-senape to-yellow-400 text-antracite rounded-xl hover:from-yellow-400 hover:to-senape transition-all duration-300 font-oswald font-semibold animate-pulse-golden smooth-hover animate-button-hover"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENUTO */}
      <main className="flex-1 w-full">
        <div ref={inizioRef} className="animate-slide-in-elegant"><HeroFerramenta /></div>
        <div className="animate-slide-in-elegant" style={{ animationDelay: '0.2s' }}><ServiziFerramenta /></div>
        <div ref={prodottiRef} className="animate-slide-in-elegant" style={{ animationDelay: '0.4s' }}><ProdottiConsigliati /></div>
        <div ref={chiSiamoRef} className="animate-slide-in-elegant" style={{ animationDelay: '0.6s' }}><ChiSiamoFerramenta /></div>
        <div ref={contattiRef} className="animate-slide-in-elegant" style={{ animationDelay: '0.8s' }}><ContattiFerramenta /></div>
      </main>
      <footer className="section-transparent backdrop-blur-lg text-sabbia py-6 text-center font-oswald text-sm tracking-wide border-t border-sabbia/20 animate-slide-in-elegant animate-text-glow">
        <div className="animate-metallic-shine px-4">
          &copy; {new Date().getFullYear()} Ferramenta Lucini &mdash; Designed with cura
        </div>
      </footer>
    </div>
  );
}
