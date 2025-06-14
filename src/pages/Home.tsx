
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Profile = { id: string, email: string, role: string };

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user;
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        setProfile(data);
      } else {
        setProfile(null);
      }
    });
    // update on login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle().then(({ data }) => setProfile(data));
      } else setProfile(null);
    });
    // cleanup
    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center py-6 px-2">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-md p-8 my-8 border border-gray-200 animate-fade-in">
        <h1 className="text-3xl font-extrabold mb-2 text-[#b43434] text-center tracking-tight select-none">FerramentaPro</h1>
        <div className="text-gray-700 text-center mb-6 text-base">
          Il tuo punto di riferimento per ogni esigenza di ferramenta.<br />Prodotti di qualità, assistenza rapida.
        </div>
        {!profile && (
          <div className="flex justify-center mb-4">
            <a
              href="/auth"
              className="bg-[#b43434] text-white font-semibold px-7 py-2 rounded-md shadow-md hover:bg-[#932a2a] transition active:scale-95"
            >
              Login / Registrati
            </a>
          </div>
        )}
        {profile && (
          <div className="flex flex-col items-center mt-3">
            <div className="text-gray-800 text-[15px]">
              Bentornato, <span className="font-semibold text-[#b43434]">{profile.email}</span>
            </div>
            <div className="text-xs mt-1 px-2 py-1 rounded bg-gray-100 text-gray-500 border border-gray-200">
              Ruolo:{" "}
              <span className="font-bold">
                {profile.role === "admin" ? "Amministratore" : "Cliente"}
              </span>
            </div>
            <div className="flex gap-4 mt-6 flex-wrap">
              <a
                href="/cliente"
                className="bg-gray-100 border border-gray-200 px-4 py-2 rounded-md shadow-sm hover:bg-gray-200 transition text-sm"
              >
                Area Cliente
              </a>
              {profile.role === "admin" && (
                <a
                  href="/admin"
                  className="bg-[#b43434] text-white px-4 py-2 rounded-md shadow hover:bg-[#932a2a] transition text-sm"
                >
                  Area Admin
                </a>
              )}
              <button
                className="bg-white text-[#b43434] border border-[#b43434] px-4 py-2 rounded-md shadow-sm hover:bg-[#f8e4e3] transition text-sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
        <hr className="my-8" />
        <div className="grid gap-6 md:grid-cols-3">
          {/* Best seller prodotti */}
          {[
            { title: "Trapano Bosch", desc: "Potente e compatto.", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" },
            { title: "Martello Stanley", desc: "Resistente per ogni lavoro.", img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80" },
            { title: "Set cacciaviti Wera", desc: "Affidabilità garantita.", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
          ].map((p) => (
            <div key={p.title} className="rounded-lg shadow-sm border bg-[#faf9f7] hover-scale transition">
              <img src={p.img} className="w-full h-36 object-cover rounded-t-lg" alt="" />
              <div className="p-3">
                <div className="font-bold text-[#b43434] mb-1">{p.title}</div>
                <div className="text-gray-500 text-sm">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center text-gray-500 text-sm">
          <b>Via Utensili 10, Udine</b> &middot; <b>info@ferramentapro.it</b><br />
          <span className="text-[11px] text-gray-400">Powered by Lovable</span>
        </div>
      </div>
    </div>
  );
}
