
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

type LoginMethod = "email" | "phone";

interface LoginFormProps {
  onLogin: (identifier: string, password: string, method: LoginMethod) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function LoginForm({ onLogin, loading, error }: LoginFormProps) {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(loginIdentifier, password, loginMethod);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Metodo di login */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => setLoginMethod("email")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${
            loginMethod === "email" 
              ? "bg-white text-antracite shadow-sm" 
              : "text-gray-600"
          }`}
        >
          Email/Username
        </button>
        <button
          type="button"
          onClick={() => setLoginMethod("phone")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${
            loginMethod === "phone" 
              ? "bg-white text-antracite shadow-sm" 
              : "text-gray-600"
          }`}
        >
          Telefono
        </button>
      </div>

      <div>
        <Label htmlFor="loginIdentifier">
          {loginMethod === "phone" ? "Numero di telefono" : "Email o Nome utente"}
        </Label>
        <Input
          id="loginIdentifier"
          type={loginMethod === "phone" ? "tel" : "text"}
          value={loginIdentifier}
          onChange={(e) => setLoginIdentifier(e.target.value)}
          placeholder={
            loginMethod === "phone" 
              ? "+39 123 456 7890" 
              : "email@esempio.com o nomeutente"
          }
          required
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <LogIn className="w-4 h-4 mr-2" />
        {loading ? "Accesso..." : "Accedi"}
      </Button>
    </form>
  );
}
