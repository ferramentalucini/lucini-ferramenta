
import { useRegister } from "./useRegister";
import { useLogin } from "./useLogin";

export function useAuth() {
  const register = useRegister();
  const login = useLogin();

  return {
    loading: register.loading || login.loading,
    error: register.error || login.error,
    handleRegister: register.handleRegister,
    handleLogin: login.handleLogin,
    resetPassword: login.resetPassword,
    setError: register.setError || login.setError
  };
}
