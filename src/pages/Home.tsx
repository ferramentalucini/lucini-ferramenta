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
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-lg shadow p-8 my-8">
        <h1 className="text-3xl font-bold mb-4 text-[#b43434] text-center">FerramentaPro</h1>
        <div className="text-gray-700 text-center mb-4">La tua ferramenta online di fiducia.<br />Scopri prodotti di qualità e assistenza speciale.</div>
        {!profile && (
          <div className="flex justify-center mt-4">
            <a href="/auth" className="bg-[#b43434] text-white font-semibold px-6 py-2 rounded hover:bg-[#a32a2a] transition">Login / Registrati</a>
          </div>
        )}
        {profile && (
          <div className="flex flex-col items-center mt-4">
            <div className="text-gray-800">Bentornato <span className="font-semibold">{profile.email}</span></div>
            <div className="text-xs mt-1 px-2 py-1 rounded bg-gray-200 text-gray-500">Ruolo: <span className="font-bold">{profile.role === "admin" ? "Amministratore" : "Cliente"}</span></div>
            <div className="flex gap-4 mt-6">
              <a href="/cliente" className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition">Area Cliente</a>
              {profile.role === "admin" && (
                <a href="/admin" className="bg-[#b43434] text-white px-4 py-2 rounded hover:bg-[#a32a2a] transition">Area Admin</a>
              )}
              <button className="bg-white text-[#b43434] border border-[#b43434] px-4 py-2 rounded hover:bg-[#f8e8e3] transition" onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}>Logout</button>
            </div>
          </div>
        )}
        <hr className="my-8"/>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Prodotti best seller placeholder */}
          {[
            { title: "Trapano Bosch", desc: "Potente e compatto.", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" },
            { title: "Martello Stanley", desc: "Resistente per ogni lavoro.", img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80" },
            { title: "Set cacciaviti Wera", desc: "Affidabilità garantita.", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
          ].map((p) => (
            <div key={p.title} className="rounded-lg shadow-sm border bg-[#faf9f7]">
              <img src={p.img} className="w-full h-36 object-cover rounded-t-lg" alt="" />
              <div className="p-3">
                <div className="font-bold text-[#b43434] mb-1">{p.title}</div>
                <div className="text-gray-500 text-sm">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          Per info: <b>Via Utensili 10, Udine</b> &middot; <b>info@ferramentapro.it</b>
        </div>
      </div>
    </div>
  );
}
