
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
import ChatExpenseModal from "@/components/ChatExpenseModal";
import { GuessExpenseInline } from "@/components/GuessExpenseInline";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isGuessModalOpen, setIsGuessModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [preFilledData, setPreFilledData] = useState<any>(null);
  const { refetch } = useTransactions();
  
  const showBottomNav = location.pathname !== '/';
  
  const handleAddTransaction = () => {
    setIsGuessModalOpen(true);
  };

  const handleExpenseParsed = (expenseData: any) => {
    setPreFilledData(expenseData);
    setIsGuessModalOpen(false);
    setIsAddModalOpen(true);
  };

  const handleTransactionAdded = () => {
    setIsAddModalOpen(false);
    setPreFilledData(null);
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
      
      {isGuessModalOpen && (
        <GuessExpenseInline 
          onExpenseParsed={handleExpenseParsed}
          onClose={() => setIsGuessModalOpen(false)}
        />
      )}
      
      <ChatExpenseModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        onExpenseParsed={handleExpenseParsed}
      />
      
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setPreFilledData(null);
        }}
        onTransactionAdded={handleTransactionAdded}
        preFilledData={preFilledData}
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
