
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
    <div className="min-h-screen flex flex-col w-full font-lato relative">
      {/* SFONDO DORATO FISSO - Base per tutta la pagina */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `
            linear-gradient(135deg, 
              #DAA520 0%,
              #FFD700 15%,
              #B8860B 30%,
              #FFD700 45%,
              #DAA520 60%,
              #FFD700 75%,
              #B8860B 90%,
              #DAA520 100%
            )
          `,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Texture overlay per profondità */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(139, 139, 139, 0.1) 0%, transparent 70%)
            `
          }}
        />
      </div>

      {/* SFERA MENU 3D - Sempre visibile */}
      <div 
        className="menu-sphere animate-sphere-float"
        onClick={toggleHeader}
        style={{ 
          opacity: isHeaderCollapsed ? 1 : 0,
          pointerEvents: isHeaderCollapsed ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      >
        <Menu size={24} className="text-antracite drop-shadow-lg" />
      </div>

      {/* HEADER LUSSUOSO SOSPESO */}
      <header 
        className={`header-luxe ${isHeaderCollapsed ? 'animate-header-collapse' : 'animate-header-expand'}`}
        style={{
          opacity: isHeaderCollapsed ? 0 : 1,
          pointerEvents: isHeaderCollapsed ? 'none' : 'auto'
        }}
      >
        <div className="flex justify-between items-center px-8 md:px-12 py-6 relative z-10">
          <span className="text-2xl md:text-3xl font-oswald font-bold text-antracite tracking-tight select-none relative z-10">
            Ferramenta Lucini
          </span>
          
          <div className="flex items-center gap-6 md:gap-8 relative z-10">
            <nav className="flex gap-4 md:gap-6 font-medium text-base relative">
              {/* Linea di navigazione animata */}
              <div 
                className="navigation-indicator"
                style={getNavigationLineStyle()}
              />
              
              {navigationItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleScroll(item.ref)}
                  className="px-4 py-3 text-antracite rounded-xl hover:bg-white/20 hover:text-antracite transition-all duration-300 font-oswald button-hover-only relative z-10 font-semibold"
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
                    className="flex items-center gap-2 px-5 py-3 bg-white/20 text-antracite rounded-xl hover:bg-white/30 transition-all duration-300 font-oswald animate-slide-in-elegant button-hover-only backdrop-blur-sm border border-white/30 font-semibold"
                    style={{ animationDelay: '0.1s' }}
                  >
                    <UserIcon size={18} />
                    <span className="hidden md:inline">Area Cliente</span>
                  </a>
                  
                  {/* Pulsante Admin */}
                  {isAdmin() && (
                    <a
                      href={`/admin/${user.id}`}
                      className="flex items-center gap-2 px-5 py-3 bg-ruggine/80 text-white rounded-xl hover:bg-ruggine transition-all duration-300 font-oswald button-hover-only animate-slide-in-elegant backdrop-blur-sm border border-ruggine/50 relative font-semibold"
                      style={{ animationDelay: '0.2s' }}
                    >
                      <Shield size={18} />
                      <span className="hidden md:inline">Admin</span>
                    </a>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-3 bg-white/20 text-antracite rounded-xl hover:bg-red-500/20 hover:text-red-700 transition-all duration-300 font-oswald button-hover-only animate-slide-in-elegant backdrop-blur-sm border border-white/30 font-semibold"
                    style={{ animationDelay: '0.3s' }}
                  >
                    <LogOut size={18} />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <a
                  href="/auth"
                  className="flex items-center gap-2 px-6 py-4 bg-antracite text-sabbia rounded-xl hover:bg-antracite/80 transition-all duration-300 font-oswald font-semibold button-hover-only shadow-lg border border-antracite/50 relative"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENUTO - Con sfondo bianco/grigio che scorre sopra lo sfondo dorato */}
      <main className="flex-1 w-full relative z-10" style={{ marginTop: '100px' }}>
        {/* Estensione dello sfondo metallico grigio dalla prima all'ultima sezione */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(44, 44, 44, 0.95) 0%,
                rgba(139, 139, 139, 0.9) 30%,
                rgba(44, 44, 44, 0.95) 70%,
                rgba(139, 139, 139, 0.85) 100%
              )
            `,
            backdropFilter: 'blur(15px)'
          }}
        >
          {/* Texture overlay per le sezioni */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)
              `
            }}
          />
        </div>

        {/* Sezioni del contenuto */}
        <div className="relative z-20">
          <div ref={inizioRef} className="animate-slide-in-elegant"><HeroFerramenta /></div>
          <div className="animate-slide-in-elegant" style={{ animationDelay: '0.2s' }}><ServiziFerramenta /></div>
          <div ref={prodottiRef} className="animate-slide-in-elegant" style={{ animationDelay: '0.4s' }}><ProdottiConsigliati /></div>
          <div ref={chiSiamoRef} className="animate-slide-in-elegant" style={{ animationDelay: '0.6s' }}><ChiSiamoFerramenta /></div>
          <div ref={contattiRef} className="animate-slide-in-elegant" style={{ animationDelay: '0.8s' }}><ContattiFerramenta /></div>
        </div>
      </main>
      
      <footer className="bg-antracite/80 backdrop-blur-lg text-sabbia py-6 text-center font-oswald text-sm tracking-wide border-t border-sabbia/20 animate-slide-in-elegant relative z-20">
        <div className="px-4 relative z-10">
          &copy; {new Date().getFullYear()} Ferramenta Lucini &mdash; Designed with luxury & care
        </div>
      </footer>
    </div>
  );
}
