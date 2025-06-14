
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import ClienteAreaNew from "./pages/ClienteAreaNew";
import AdminArea from "./pages/AdminArea";
import AdminAreaNew from "./pages/AdminAreaNew";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/cliente" element={<ClienteAreaNew />} />
        <Route path="/cliente/:userId" element={<ClienteAreaNew />} />
        <Route path="/admin" element={<AdminArea />} />
        <Route path="/admin/:userId" element={<AdminAreaNew />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
