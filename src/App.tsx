
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import BottomNavigation from "@/components/BottomNavigation";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Transactions from "./pages/Transactions";
import Learning from "./pages/Learning";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import AddTransactionModal from "@/components/AddTransactionModal";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { refetch } = useTransactions();
  
  const showBottomNav = location.pathname !== '/';
  
  const handleAddTransaction = () => {
    setIsAddModalOpen(true);
  };

  const handleTransactionAdded = () => {
    setIsAddModalOpen(false);
    refetch();
  };

  return (
    <div className="relative">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {showBottomNav && (
        <BottomNavigation onAddTransaction={handleAddTransaction} />
      )}
      
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
