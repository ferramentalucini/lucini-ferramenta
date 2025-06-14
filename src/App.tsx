
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import ClientArea from "@/pages/ClientArea";
import AdminArea from "@/pages/AdminArea";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const ROLES_OBJ = {
  "Cliente": "Cliente",
  "Moderato": "Moderato",
  "Amministratore": "Amministratore",
  "Super Amministratore": "Super Amministratore",
};

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<keyof typeof ROLES_OBJ>("Cliente");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-[#f5f5f7] flex">
            <Sidebar
              collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
              userRole={userRole}
            />
            <main className="flex-1 pl-0 relative">
              <Navbar userRole={userRole} onRoleChange={(r) => setUserRole(r as keyof typeof ROLES_OBJ)} />
              <div className="p-2 pt-6">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route
                    path="/client"
                    element={userRole === "Cliente" || userRole === "Moderato" || userRole === "Amministratore" || userRole === "Super Amministratore" ? (
                      <ClientArea />
                    ) : (
                      <div className="text-center text-red-500">Accesso riservato ai clienti.</div>
                    )}
                  />
                  <Route
                    path="/admin"
                    element={userRole === "Amministratore" || userRole === "Super Amministratore" ? (
                      <AdminArea userRole={userRole} />
                    ) : (
                      <div className="text-center text-red-500">Accesso riservato allo staff.</div>
                    )}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
