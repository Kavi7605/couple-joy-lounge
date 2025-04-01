import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BirthdayCountdown from "./pages/BirthdayCountdown";
import LoveLetters from "./pages/LoveLetters";
import LoveGame from "./pages/LoveGame";
import MissYou from "./pages/MissYou";
import MoodJar from "./pages/MoodJar";
import NotFound from "./pages/NotFound";
import PartnerLinkAccept from "./components/auth/PartnerLinkAccept";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Set document title
document.title = "Couple Joy";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/birthday-countdown" element={<BirthdayCountdown />} />
            <Route path="/love-letters" element={<LoveLetters />} />
            <Route path="/love-game" element={<LoveGame />} />
            <Route path="/miss-you" element={<MissYou />} />
            <Route path="/mood-jar" element={<MoodJar />} />
<<<<<<< HEAD
            <Route path="/link-partner" element={<PartnerLinkAccept />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
=======
            {/* Catch-all route for 404 */}
>>>>>>> 8d1d7dda23a6dcd91cb4c0707dbffca31d8daa2f
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
