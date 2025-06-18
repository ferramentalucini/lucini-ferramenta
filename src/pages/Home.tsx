import React, { useRef, useEffect, useState } from "react";
import HeroFerramenta from "../components/home/HeroFerramenta";
import ServiziFerramenta from "../components/home/ServiziFerramenta";
import ProdottiConsigliati from "../components/home/ProdottiConsigliati";
import ChiSiamoFerramenta from "../components/home/ChiSiamoFerramenta";
import ContattiFerramenta from "../components/home/ContattiFerramenta";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const { role, isAdmin } = useUserRole(user);
  
  // Scroll references
  const inizioRef = useRef<HTMLDivElement>(null);
  const prodottiRef = useRef<HTMLDivElement>(null);
  const chiSiamoRef = useRef<HTMLDivElement>(null);
  const contattiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Controllo sessione Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Controllo sessione admin
    const adminUserData = localStorage.getItem('admin_user');
    if (adminUserData) {
      setAdminUser(JSON.parse(adminUserData));
    }

    // Listener per cambiamenti di autenticazione Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('admin_user');
    setAdminUser(null);
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex flex-col w-full font-lato">
      {/* HEADER */}
      <header className="sticky top-0 left-0 z-40 bg-antracite/95 backdrop-blur-sm border-b-2 border-cemento shadow-lg">
        <div className="flex justify-between items-center px-4 md:px-16 py-3">
          <span className="text-3xl md:text-4xl font-oswald font-bold text-senape tracking-tight select-none drop-shadow font-header">
            Ferramenta Lucini
          </span>
          <div className="flex items-center gap-4 md:gap-7">
            <nav className="flex gap-4 md:gap-7 font-medium text-base">
              <button
                onClick={() => handleScroll(inizioRef)}
                className="px-2 py-1 text-sabbia rounded hover:bg-senape/30 hover:text-senape transition font-oswald"
              >
                Inizio
              </button>
              <button
                onClick={() => handleScroll(prodottiRef)}
                className="px-2 py-1 text-sabbia rounded hover:bg-senape/30 hover:text-senape transition font-oswald"
              >
                Prodotti
              </button>
              <button
                onClick={() => handleScroll(chiSiamoRef)}
                className="px-2 py-1 text-sabbia rounded hover:bg-senape/30 hover:text-senape transition font-oswald"
              >
                Chi siamo
              </button>
              <button
                onClick={() => handleScroll(contattiRef)}
                className="px-2 py-1 text-sabbia rounded hover:bg-senape/30 hover:text-senape transition font-oswald"
              >
                Contatti
              </button>
            </nav>
            
            {/* Pulsanti autenticazione */}
            <div className="flex items-center gap-3">
              {user || adminUser ? (
                <>
                  {user && (
                    <a
                      href={`/cliente/${user.id}`}
                      className="flex items-center gap-2 px-3 py-2 bg-senape/20 text-senape rounded-lg hover:bg-senape/30 transition font-oswald"
                    >
                      <UserIcon size={18} />
                      <span className="hidden md:inline">Area Cliente</span>
                    </a>
                  )}
                  
                  {adminUser && (
                    <a
                      href="/admin/admin-user"
                      className="flex items-center gap-2 px-3 py-2 bg-ruggine/20 text-ruggine rounded-lg hover:bg-ruggine/30 transition font-oswald"
                    >
                      <UserIcon size={18} />
                      <span className="hidden md:inline">Admin</span>
                    </a>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 bg-ruggine/20 text-sabbia rounded-lg hover:bg-ruggine/30 transition font-oswald"
                  >
                    <LogOut size={18} />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </>
              ) : (
                <a
                  href="/auth"
                  className="flex items-center gap-2 px-4 py-2 bg-senape text-antracite rounded-lg hover:bg-senape/90 transition font-oswald font-semibold"
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
        <div ref={inizioRef}><HeroFerramenta /></div>
        <ServiziFerramenta />
        <div ref={prodottiRef}><ProdottiConsigliati /></div>
        <div ref={chiSiamoRef}><ChiSiamoFerramenta /></div>
        <div ref={contattiRef}><ContattiFerramenta /></div>
      </main>
      <footer className="bg-antracite/95 backdrop-blur-sm text-sabbia py-4 text-center font-oswald text-sm tracking-wide">
        &copy; {new Date().getFullYear()} Ferramenta Lucini &mdash; Designed with cura
      </footer>
    </div>
  );
}
