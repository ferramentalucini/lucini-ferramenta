
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  Shield, 
  Wrench, 
  Hammer, 
  Settings,
  Star,
  Award,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header moderno flottante */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <nav className="max-w-7xl mx-auto glass rounded-2xl p-4 animate-fadeInUp">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center animate-glow">
                <Hammer className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Ferramenta Lucini
              </h1>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">
                Home
              </a>
              <a href="#prodotti" className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">
                Prodotti
              </a>
              <a href="#servizi" className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">
                Servizi
              </a>
              <a href="#contatti" className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">
                Contatti
              </a>
            </div>

            {/* Auth buttons */}
            <div className="flex items-center space-x-3">
              {user ? (
                <div className={`flex items-center space-x-3 ${justLoggedIn ? 'animate-scaleIn' : ''}`}>
                  <a
                    href={`/cliente/${user.id}`}
                    className="flex items-center space-x-2 px-4 py-2 glass-gold rounded-xl hover-lift text-yellow-700 font-medium"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Area Cliente</span>
                  </a>
                  
                  {isAdmin() && (
                    <a
                      href={`/admin/${user.id}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl hover-lift font-medium"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin</span>
                    </a>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <a
                  href="/auth"
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl hover-lift font-medium animate-shine"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Accedi</span>
                </a>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fadeInUp">
            <h2 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-yellow-600 bg-clip-text text-transparent">
                Ferramenta
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-shine">
                di Qualità
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Da oltre 60 anni, la tradizione incontra l'innovazione. 
              Strumenti professionali, consulenza esperta e servizio impeccabile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-2xl font-semibold hover-lift animate-glow">
                Scopri i Prodotti
              </button>
              <button className="px-8 py-4 glass rounded-2xl font-semibold text-gray-700 hover-lift">
                Contattaci
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeInUp">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Perché Sceglierci
            </h3>
            <p className="text-xl text-gray-600">Eccellenza in ogni dettaglio</p>
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
                className="glass-gold rounded-2xl p-8 hover-lift animate-slideIn"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 animate-float">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="prodotti" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeInUp">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              I Nostri Prodotti
            </h3>
            <p className="text-xl text-gray-600">Strumenti professionali per ogni esigenza</p>
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
                className="glass rounded-2xl overflow-hidden hover-lift animate-scaleIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.img} 
                    alt={product.name}
                    className="w-full h-full object-cover hover-scale"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h4>
                  <button className="w-full py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-medium hover-lift">
                    Scopri di più
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contatti" className="py-20 px-4 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fadeInUp">
            <h3 className="text-4xl font-bold mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Contattaci
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-gold rounded-2xl p-6 hover-lift">
                <Phone className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
                <p className="font-semibold text-gray-800">Telefono</p>
                <p className="text-gray-600">031 1234567</p>
              </div>
              <div className="glass-gold rounded-2xl p-6 hover-lift">
                <Mail className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-gray-600">info@ferramentalucini.it</p>
              </div>
              <div className="glass-gold rounded-2xl p-6 hover-lift">
                <MapPin className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
                <p className="font-semibold text-gray-800">Indirizzo</p>
                <p className="text-gray-600">Via degli Artigiani 14, Como</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Hammer className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold">Ferramenta Lucini</h4>
          </div>
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Ferramenta Lucini - Eccellenza dal 1964
          </p>
        </div>
      </footer>
    </div>
  );
}
