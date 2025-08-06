import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <footer className="bg-accent/5 py-3 md:py-4">
            <div className="text-center space-y-2">
              <div className="text-xs text-muted-foreground/60 italic max-w-2xl mx-auto px-4">
                Note: Due to confidentiality agreements, some client details and project screenshots are anonymized or simulated. We respect our client's trust and only disclose specifics upon direct request.
              </div>
              <div className="text-sm text-foreground/70">
                🧠 Built with ❤️ by NIT Students | ELEVANA © 2025
              </div>
            </div>
          </footer>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
