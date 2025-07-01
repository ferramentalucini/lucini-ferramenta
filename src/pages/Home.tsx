
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  Shield, 
  Settings,
  Star,
  Award,
  Phone,
  Mail,
  MapPin,
  Menu,
  X
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { role, isAdmin } = useUserRole(user);

  useEffect(() => {
    // Controllo sessione attuale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listener per cambiamenti di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUser = session?.user ?? null;
      
      if (event === 'SIGNED_IN' && newUser && !user) {
        setJustLoggedIn(true);
        setTimeout(() => setJustLoggedIn(false), 3000);
      }
      
      setUser(newUser);
    });

    return () => subscription.unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-neutral-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 backdrop-blur-xl border border-neutral-200/50 rounded-2xl px-6 py-4 shadow-xl">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="font-bold text-neutral-800 text-lg">Ferramenta Lucini</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">
              Home
            </a>
            <a href="#prodotti" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">
              Prodotti
            </a>
            <a href="#servizi" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">
              Servizi
            </a>
            <a href="#contatti" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">
              Contatti
            </a>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className={`flex items-center gap-2 ${justLoggedIn ? 'animate-fadeIn' : ''}`}>
                <a
                  href={`/cliente/${user.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors text-sm font-medium text-neutral-700"
                >
                  <UserIcon size={16} />
                  <span>Area Cliente</span>
                </a>
                
                {isAdmin() && (
                  <a
                    href={`/admin/${user.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-xl hover:from-amber-500 hover:to-yellow-600 transition-all text-sm font-medium shadow-lg"
                  >
                    <Shield size={16} />
                    <span>Amministrazione</span>
                  </a>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-red-600 transition-colors text-sm font-medium"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <a
                href="/auth"
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-xl hover:from-amber-500 hover:to-yellow-600 transition-all text-sm font-medium shadow-lg"
              >
                <LogIn size={16} />
                <span>Accedi</span>
              </a>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-neutral-200">
            <div className="flex flex-col gap-3">
              <a href="#home" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">
                Home
              </a>
              <a href="#prodotti" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">
                Prodotti
              </a>
              <a href="#servizi" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">
                Servizi
              </a>
              <a href="#contatti" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">
                Contatti
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-amber-600 bg-clip-text text-transparent">
                  Ferramenta
                </span>
                <br />
                <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                  di Qualità
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                Da oltre 60 anni, tradizione e innovazione si incontrano per offrire strumenti professionali e servizio impeccabile.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-2xl font-semibold hover:from-amber-500 hover:to-yellow-600 transition-all shadow-xl">
                Scopri i Prodotti
              </button>
              <button className="px-8 py-4 bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-2xl font-semibold text-neutral-700 hover:bg-white transition-all">
                Contattaci
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
              Perché Sceglierci
            </h2>
            <p className="text-xl text-neutral-600">Eccellenza in ogni dettaglio</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Qualità Garantita",
                desc: "Solo i migliori marchi e prodotti testati per durare nel tempo"
              },
              {
                icon: Settings,
                title: "Consulenza Esperta",
                desc: "Il nostro team ti guida nella scelta degli strumenti più adatti"
              },
              {
                icon: Star,
                title: "Servizio Premium",
                desc: "Assistenza personalizzata e supporto post-vendita eccezionale"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-neutral-800">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="prodotti" className="py-24 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
              I Nostri Prodotti
            </h2>
            <p className="text-xl text-neutral-600">Strumenti professionali per ogni esigenza</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Trapani", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" },
              { name: "Martelli", img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80" },
              { name: "Cacciaviti", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
              { name: "Chiavi", img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=400&q=80" }
            ].map((product, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.img} 
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4">{product.name}</h3>
                  <button className="w-full py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-xl font-medium hover:from-amber-500 hover:to-yellow-600 transition-all">
                    Scopri di più
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contatti" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            Contattaci
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <Phone size={32} className="text-amber-500 mx-auto mb-4" />
              <p className="font-semibold text-neutral-800 mb-2">Telefono</p>
              <p className="text-neutral-600">031 1234567</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <Mail size={32} className="text-amber-500 mx-auto mb-4" />
              <p className="font-semibold text-neutral-800 mb-2">Email</p>
              <p className="text-neutral-600">info@ferramentalucini.it</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <MapPin size={32} className="text-amber-500 mx-auto mb-4" />
              <p className="font-semibold text-neutral-800 mb-2">Indirizzo</p>
              <p className="text-neutral-600">Via degli Artigiani 14, Como</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-neutral-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h3 className="text-xl font-bold">Ferramenta Lucini</h3>
          </div>
          <p className="text-neutral-400">
            &copy; {new Date().getFullYear()} Ferramenta Lucini - Eccellenza dal 1964
          </p>
        </div>
      </footer>
    </div>
  );
}
