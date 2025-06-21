
import React, { useRef, useEffect, useState } from "react";
import HeroFerramenta from "../components/home/HeroFerramenta";
import ServiziFerramenta from "../components/home/ServiziFerramenta";
import ProdottiConsigliati from "../components/home/ProdottiConsigliati";
import ChiSiamoFerramenta from "../components/home/ChiSiamoFerramenta";
import ContattiFerramenta from "../components/home/ContattiFerramenta";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogIn, LogOut, User as UserIcon, Shield, Menu } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useScrollNavigation } from "@/hooks/useScrollNavigation";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const { role, isAdmin } = useUserRole(user);
  const { scrollY, isHeaderCollapsed, currentSection, toggleHeader } = useScrollNavigation();
  
  // Scroll references
  const inizioRef = useRef<HTMLDivElement>(null);
  const prodottiRef = useRef<HTMLDivElement>(null);
  const chiSiamoRef = useRef<HTMLDivElement>(null);
  const contattiRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    { name: 'Inizio', ref: inizioRef },
    { name: 'Prodotti', ref: prodottiRef },
    { name: 'Chi siamo', ref: chiSiamoRef },
    { name: 'Contatti', ref: contattiRef }
  ];

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
        setTimeout(() => setJustLoggedIn(false), 4000);
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

  // Calcola la posizione della linea di navigazione
  const getNavigationLineStyle = () => {
    const sectionWidth = 100 / navigationItems.length;
    const position = currentSection * sectionWidth;
    return {
      width: `${sectionWidth}%`,
      left: `${position}%`
    };
  };

  return (
    <div className="min-h-screen flex flex-col w-full font-lato">
      {/* HEADER */}
      {isHeaderCollapsed ? (
        // Header collassato - cerchio
        <div 
          className="header-collapsed section-transparent backdrop-blur-lg border border-sabbia/30 shadow-2xl animate-header-collapse"
          onClick={toggleHeader}
        >
          <Menu size={24} className="text-sabbia" />
        </div>
      ) : (
        // Header espanso
        <header className={`header-detached section-transparent backdrop-blur-lg border border-sabbia/30 shadow-2xl animate-slide-in-elegant ${!isHeaderCollapsed ? 'animate-header-expand' : ''}`}>
          <div className="flex justify-between items-center px-4 md:px-16 py-4 relative">
            <span className="text-3xl md:text-4xl font-oswald font-bold text-sabbia tracking-tight select-none animate-text-glow font-header metallic-text">
              Ferramenta Lucini
            </span>
            <div className="flex items-center gap-4 md:gap-7">
              <nav className="flex gap-4 md:gap-7 font-medium text-base relative">
                {/* Linea di navigazione animata */}
                <div 
                  className="navigation-indicator"
                  style={getNavigationLineStyle()}
                />
                
                {navigationItems.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => handleScroll(item.ref)}
                    className="px-3 py-2 text-sabbia rounded-lg hover:bg-senape/20 hover:text-senape transition-all duration-300 font-oswald button-hover-only relative z-10"
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
              
              {/* Pulsanti autenticazione */}
              <div className="flex items-center gap-3">
                {user ? (
                  <div className={`flex items-center gap-3 transition-all duration-700 ${justLoggedIn ? 'animate-login-success animate-scale-bounce' : ''}`}>
                    <a
                      href={`/cliente/${user.id}`}
                      className="flex items-center gap-2 px-4 py-2 glass-effect text-sabbia rounded-xl hover:bg-senape/20 hover:text-senape transition-all duration-300 font-oswald animate-slide-in-elegant button-hover-only"
                      style={{ animationDelay: '0.1s' }}
                    >
                      <UserIcon size={18} />
                      <span className="hidden md:inline">Area Cliente</span>
                    </a>
                    
                    {/* Mostra pulsante Admin solo se l'utente è amministratore */}
                    {isAdmin() && (
                      <a
                        href={`/admin/${user.id}`}
                        className="flex items-center gap-2 px-4 py-2 glass-effect text-ruggine rounded-xl hover:bg-ruggine/20 transition-all duration-300 font-oswald animate-admin-badge button-hover-only animate-slide-in-elegant"
                        style={{ animationDelay: '0.2s' }}
                      >
                        <Shield size={18} className="animate-pulse-golden" />
                        <span className="hidden md:inline">Admin</span>
                      </a>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 glass-effect text-cemento rounded-xl hover:bg-ruggine/20 hover:text-ruggine transition-all duration-300 font-oswald button-hover-only animate-slide-in-elegant"
                      style={{ animationDelay: '0.3s' }}
                    >
                      <LogOut size={18} />
                      <span className="hidden md:inline">Logout</span>
                    </button>
                  </div>
                ) : (
                  <a
                    href="/auth"
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-senape to-yellow-400 text-antracite rounded-xl hover:from-yellow-400 hover:to-senape transition-all duration-300 font-oswald font-semibold animate-pulse-golden button-hover-only"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* CONTENUTO - Aggiunto padding-top per compensare l'header detached */}
      <main className="flex-1 w-full pt-24">
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
