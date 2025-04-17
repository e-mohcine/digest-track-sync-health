
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import AddEntry from "./pages/AddEntry";
import History from "./pages/History";
import Stats from "./pages/Stats";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import FAQ from "./pages/FAQ";
import RGPD from "./pages/RGPD";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient();

// Composant de protection des routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { signedIn, loading } = useAuth();
  
  if (loading) {
    // Afficher un loader pendant la vérification de l'auth
    return <div className="flex items-center justify-center min-h-screen">
      Chargement...
    </div>;
  }
  
  if (!signedIn) {
    // Rediriger vers la page d'authentification si non connecté
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Index />} />
            <Route path="/add" element={<AddEntry />} />
            <Route path="/history" element={<History />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/rgpd" element={<RGPD />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
