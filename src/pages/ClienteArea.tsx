
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type UserProfile = { id: string, email: string, nome: string, cognome: string, nome_utente: string, numero_telefono: string | null };

export default function ClienteArea() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        window.location.replace("/auth");
        return;
      }
      // Recupera il profilo completo
      const { data: prof } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();
      // Recupera ruolo
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      setProfile(prof);
      setRole(userRole?.role ?? null);
      setLoading(false);
    });
    // update on login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setProfile(null);
        setRole(null);
        return;
      }
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (!session) {
          setProfile(null);
          setRole(null);
          setLoading(false);
          return;
        }
        const { data: prof } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
        const { data: userRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle();
        setProfile(prof);
        setRole(userRole?.role ?? null);
        setLoading(false);
      });
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  if (loading) return null;
  if (!profile) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7] px-2">
      <div className="bg-white rounded-lg shadow max-w-xl w-full p-8">
        <div className="mb-2 text-sm text-gray-500">Area Cliente</div>
        <div className="mb-4 text-xl font-bold text-[#b43434]">{profile.email}</div>
        <div className="grid gap-3">
          <div className="bg-gray-50 p-3 rounded flex justify-between items-center">
            <span>Carrello</span>
            <span className="text-gray-400">[vuoto]</span>
          </div>
          <div className="bg-gray-50 p-3 rounded flex justify-between items-center">
            <span>Preferiti</span>
            <span className="text-gray-400">[nessun preferito]</span>
          </div>
          <div className="bg-gray-50 p-3 rounded flex justify-between items-center">
            <span>Ordini effettuati</span>
            <span className="text-gray-400">[nessun ordine]</span>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <a href="/" className="text-[#b43434] underline">Home</a>
          <button
            className="bg-white text-[#b43434] border border-[#b43434] px-4 py-2 rounded hover:bg-[#f8e8e3] transition"
            onClick={async () => { await supabase.auth.signOut(); window.location.replace("/"); }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
