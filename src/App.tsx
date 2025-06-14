
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import ClienteAreaNew from "./pages/ClienteAreaNew";
import AdminArea from "./pages/AdminArea";
import ClienteRedirect from "./pages/ClienteRedirect";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/cliente" element={<ClienteRedirect />} />
        <Route path="/cliente/:userId" element={<ClienteAreaNew />} />
        <Route path="/admin" element={<AdminArea />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
