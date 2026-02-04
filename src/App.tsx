import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Admin from "./pages/Admin";
import Orders from "./pages/Orders";
import Account from "./pages/Account";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import AdminSignIn from "./pages/auth/AdminSignIn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    // Prevent back button from closing modals or sidebars on mobile
    const handlePopState = (e: PopStateEvent) => {
      // Check if any modals or sidebars are open
      const dialogOverlay = document.querySelector('[data-state="open"]');
      const sidebarOpen = document.querySelector('[data-side][data-state="open"]');
      const sheetOpen = document.body.style.pointerEvents === 'none';
      
      if (dialogOverlay || sidebarOpen || sheetOpen) {
        // Prevent the default back behavior and push state again
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    // Push an initial state so back button works
    window.history.pushState(null, '', window.location.href);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/account" element={<Account />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/admin-signin" element={<AdminSignIn />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
