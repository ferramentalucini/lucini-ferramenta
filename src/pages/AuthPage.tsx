
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import AuthHeader from "@/components/auth/AuthHeader";
import SimpleLoginForm from "@/components/auth/SimpleLoginForm";

export default function AuthPage() {
  useEffect(() => {
    // Redirect se già loggato
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.replace(`/cliente/${session.user.id}`);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.location.replace(`/cliente/${session.user.id}`);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sabbia to-cemento/20 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <AuthHeader isLogin={true} />
          <CardContent>
            <SimpleLoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
