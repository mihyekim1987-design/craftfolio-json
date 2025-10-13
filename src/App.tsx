import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminSimple from "./pages/AdminSimple";
import NotFound from "./pages/NotFound";
import { PortfolioProvider } from "./contexts/PortfolioContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

// GitHub Pages 배포 시 basename 설정
const basename = import.meta.env.PROD ? "/craftfolio-json" : "";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PortfolioProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={
              <ErrorBoundary>
                <Admin />
              </ErrorBoundary>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;