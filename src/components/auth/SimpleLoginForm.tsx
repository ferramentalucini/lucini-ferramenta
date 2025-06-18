
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogIn, Shield, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SimpleLoginForm() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [isRegister, setIsRegister] = useState(false);
  
  const { loading, error, handleAdminLogin, handleUserLogin, handleUserRegister, setError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAdmin) {
      await handleAdminLogin(credentials.username, credentials.password);
    } else {
      if (isRegister) {
        await handleUserRegister(credentials.email, credentials.password);
      } else {
        await handleUserLogin(credentials.email, credentials.password);
      }
    }
  };

  const switchMode = () => {
    setIsAdmin(!isAdmin);
    setCredentials({ username: "", email: "", password: "" });
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Toggle Admin/User */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => setIsAdmin(false)}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition flex items-center gap-2 justify-center ${
            !isAdmin 
              ? "bg-white text-antracite shadow-sm" 
              : "text-gray-600"
          }`}
        >
          <User size={16} />
          Utente
        </button>
        <button
          type="button"
          onClick={() => setIsAdmin(true)}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition flex items-center gap-2 justify-center ${
            isAdmin 
              ? "bg-white text-antracite shadow-sm" 
              : "text-gray-600"
          }`}
        >
          <Shield size={16} />
          Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isAdmin ? (
          <div>
            <Label htmlFor="username">Nome utente</Label>
            <Input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="Nome utente amministratore"
              required
              disabled={loading}
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              placeholder="la-tua-email@esempio.com"
              required
              disabled={loading}
            />
          </div>
        )}

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            placeholder="La tua password"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-senape hover:bg-senape/90 text-antracite font-semibold"
          disabled={loading}
        >
          {isAdmin ? <Shield className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
          {loading ? "Accesso..." : isAdmin ? "Accedi come Admin" : (isRegister ? "Registrati" : "Accedi")}
        </Button>

        {!isAdmin && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-senape hover:text-senape/80 font-medium text-sm transition-colors"
            >
              {isRegister ? "Hai già un account? Accedi qui" : "Non hai un account? Registrati qui"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
