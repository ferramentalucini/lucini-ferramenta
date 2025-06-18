
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { username, password } = await req.json()
    
    // Ottieni le credenziali admin dai segreti
    const adminUsername = Deno.env.get('ADMIN_USERNAME')
    const adminPassword = Deno.env.get('ADMIN_PASSWORD')
    
    if (!adminUsername || !adminPassword) {
      return new Response(
        JSON.stringify({ error: 'Configurazione admin non trovata' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Verifica le credenziali
    if (username === adminUsername && password === adminPassword) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          role: 'admin',
          user: { id: 'admin-user', username: adminUsername }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({ error: 'Credenziali non valide' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Errore del server' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
