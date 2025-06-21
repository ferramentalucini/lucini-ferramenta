
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
      {/* SFERA MENU 3D - Sempre visibile */}
      <div 
        className="menu-sphere animate-sphere-float"
        onClick={toggleHeader}
      >
        <Menu size={28} className="text-sabbia drop-shadow-lg" />
        {/* Decorazioni diamanti sulla sfera */}
        <div className="diamond-decoration animate-diamond-sparkle" style={{ top: '15%', right: '20%' }} />
        <div className="diamond-decoration animate-diamond-sparkle" style={{ bottom: '20%', left: '15%', animationDelay: '1.5s' }} />
      </div>

      {/* HEADER SOSPESO */}
      {!isHeaderCollapsed && (
        <header className="header-suspended animate-header-luxe-shimmer animate-slide-in-elegant">
          <div className="flex justify-between items-center px-6 md:px-16 py-5 relative">
            {/* Decorazioni diamanti nell'header */}
            <div className="diamond-decoration animate-diamond-sparkle" style={{ top: '10px', left: '30px' }} />
            <div className="diamond-decoration animate-diamond-sparkle" style={{ top: '10px', right: '120px', animationDelay: '2s' }} />
            <div className="diamond-decoration animate-diamond-sparkle" style={{ bottom: '10px', left: '50%', animationDelay: '1s' }} />
            
            <span className="text-3xl md:text-4xl font-oswald font-bold text-sabbia tracking-tight select-none animate-text-glow font-header metallic-text relative z-10">
              Ferramenta Lucini
            </span>
            
            <div className="flex items-center gap-4 md:gap-7 relative z-10">
              <nav className="flex gap-4 md:gap-7 font-medium text-base relative">
                {/* Linea di navigazione animata con stile lussuoso */}
                <div 
                  className="navigation-indicator"
                  style={getNavigationLineStyle()}
                />
                
                {navigationItems.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => handleScroll(item.ref)}
                    className="px-4 py-3 text-sabbia rounded-xl hover:bg-gradient-to-r hover:from-senape/20 hover:to-yellow-400/20 hover:text-senape transition-all duration-300 font-oswald button-hover-only relative z-10 backdrop-blur-sm"
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
              
              {/* Pulsanti autenticazione con stile migliorato */}
              <div className="flex items-center gap-3">
                {user ? (
                  <div className={`flex items-center gap-3 transition-all duration-700 ${justLoggedIn ? 'animate-login-success animate-scale-bounce' : ''}`}>
                    <a
                      href={`/cliente/${user.id}`}
                      className="flex items-center gap-2 px-5 py-3 glass-effect text-sabbia rounded-xl hover:bg-gradient-to-r hover:from-senape/20 hover:to-yellow-400/20 hover:text-senape transition-all duration-300 font-oswald animate-slide-in-elegant button-hover-only backdrop-blur-sm border border-sabbia/20"
                      style={{ animationDelay: '0.1s' }}
                    >
                      <UserIcon size={18} />
                      <span className="hidden md:inline">Area Cliente</span>
                    </a>
                    
                    {/* Pulsante Admin con decorazioni speciali */}
                    {isAdmin() && (
                      <a
                        href={`/admin/${user.id}`}
                        className="flex items-center gap-2 px-5 py-3 glass-effect text-ruggine rounded-xl hover:bg-gradient-to-r hover:from-ruggine/20 hover:to-orange-400/20 transition-all duration-300 font-oswald animate-admin-badge button-hover-only animate-slide-in-elegant backdrop-blur-sm border border-ruggine/30 relative"
                        style={{ animationDelay: '0.2s' }}
                      >
                        <Shield size={18} className="animate-pulse-golden" />
                        <span className="hidden md:inline">Admin</span>
                        <div className="diamond-decoration animate-diamond-sparkle absolute -top-1 -right-1" style={{ width: '6px', height: '6px' }} />
                      </a>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-5 py-3 glass-effect text-cemento rounded-xl hover:bg-gradient-to-r hover:from-ruggine/20 hover:to-red-400/20 hover:text-ruggine transition-all duration-300 font-oswald button-hover-only animate-slide-in-elegant backdrop-blur-sm border border-cemento/20"
                      style={{ animationDelay: '0.3s' }}
                    >
                      <LogOut size={18} />
                      <span className="hidden md:inline">Logout</span>
                    </button>
                  </div>
                ) : (
                  <a
                    href="/auth"
                    className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-senape via-yellow-400 to-yellow-500 text-antracite rounded-xl hover:from-yellow-400 hover:via-yellow-500 hover:to-senape transition-all duration-300 font-oswald font-semibold animate-pulse-golden button-hover-only shadow-lg border border-yellow-300/30 relative"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                    <div className="diamond-decoration animate-diamond-sparkle absolute -top-1 -right-1" style={{ width: '6px', height: '6px' }} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* CONTENUTO - Aggiunto padding-top maggiore per compensare l'header sospeso */}
      <main className="flex-1 w-full pt-32">
        <div ref={inizioRef} className="animate-slide-in-elegant"><HeroFerramenta /></div>
        <div className="animate-slide-in-elegant" style={{ animationDelay: '0.2s' }}><ServiziFerramenta /></div>
        <div ref={prodottiRef} className="animate-slide-in-elegant" style={{ animationDelay: '0.4s' }}><ProdottiConsigliati /></div>
        <div ref={chiSiamoRef} className="animate-slide-in-elegant" style={{ animationDelay: '0.6s' }}><ChiSiamoFerramenta /></div>
        <div ref={contattiRef} className="animate-slide-in-elegant" style={{ animationDelay: '0.8s' }}><ContattiFerramenta /></div>
      </main>
      
      <footer className="section-transparent backdrop-blur-lg text-sabbia py-6 text-center font-oswald text-sm tracking-wide border-t border-sabbia/20 animate-slide-in-elegant animate-text-glow relative">
        {/* Decorazioni diamanti nel footer */}
        <div className="diamond-decoration animate-diamond-sparkle absolute top-4 left-1/4" />
        <div className="diamond-decoration animate-diamond-sparkle absolute top-4 right-1/4" style={{ animationDelay: '1.5s' }} />
        
        <div className="animate-metallic-shine px-4 relative z-10">
          &copy; {new Date().getFullYear()} Ferramenta Lucini &mdash; Designed with luxury & care
        </div>
      </footer>
    </div>
  );
}
