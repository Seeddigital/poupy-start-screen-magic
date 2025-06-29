import React, { useState } from 'react';
import { Eye, EyeOff, Bell } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import CategoryChart from '../components/CategoryChart';
import TransactionDetailModal from '../components/TransactionDetailModal';
import CategoryTransactionsModal from '../components/CategoryTransactionsModal';
const Dashboard = () => {
  const [showValues, setShowValues] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Mock data - in real app this would come from API
  const userName = "Rodrigo";
  const monthlyExpenses = 12574.34;
  const categories = [{
    name: "Alimentação",
    color: "#FF6B35",
    amount: 2543.21,
    percentage: 20
  }, {
    name: "Saúde",
    color: "#F7DC6F",
    amount: 1876.45,
    percentage: 15
  }, {
    name: "Aluguel",
    color: "#E74C3C",
    amount: 1200.00,
    percentage: 10
  }, {
    name: "Supermercado",
    color: "#3498DB",
    amount: 3456.78,
    percentage: 27
  }, {
    name: "Transporte",
    color: "#9B59B6",
    amount: 987.65,
    percentage: 8
  }, {
    name: "Lazer",
    color: "#1ABC9C",
    amount: 2510.25,
    percentage: 20
  }];
  const transactions = [{
    id: 1,
    icon: "/lovable-uploads/a667bd8c-7cd8-48d8-a62f-7c9aa32c7ba0.png",
    name: "Restaurante Madero",
    subcategory: "Alimentação • Nubank",
    amount: -120.45,
    date: "12 Jun 2025",
    paymentMethod: "Nubank",
    notes: "Almoço de negócios"
  }, {
    id: 2,
    icon: "/lovable-uploads/6ae08213-7de2-4e1e-8f10-fed260628827.png",
    name: "Salário iFood",
    subcategory: "Conta Corrente Itaú",
    amount: 3007.32,
    date: "10 Jun 2025",
    paymentMethod: "Transferência"
  }, {
    id: 3,
    icon: "/lovable-uploads/62fc26cb-a566-42b4-a3d8-126a6ec937c8.png",
    name: "Farmácia Drogal",
    subcategory: "Saúde • Personalite",
    amount: -267.32,
    date: "10 Jun 2025",
    paymentMethod: "Personalite"
  }, {
    id: 4,
    icon: "/lovable-uploads/b86e683d-74fb-4388-bdbc-c21204e683ee.png",
    name: "Strem XBox",
    subcategory: "Lazer • Personalite",
    amount: -32.98,
    date: "06 Jun 2025",
    paymentMethod: "Personalite"
  }, {
    id: 5,
    icon: "/lovable-uploads/6ae08213-7de2-4e1e-8f10-fed260628827.png",
    name: "Aluguel Apartamento",
    subcategory: "Aluguel • Transferência",
    amount: -1200.00,
    date: "05 Jun 2025",
    paymentMethod: "Transferência"
  }];
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };
  const handleTransactionClick = transaction => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };
  const handleCategoryClick = category => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };
  const handleCategoryTransactionClick = transaction => {
    setSelectedTransaction(transaction);
    setIsCategoryModalOpen(false);
    setIsTransactionModalOpen(true);
  };
  const handleExpenseCardClick = () => {
    setShowChart(!showChart);
  };
  return <div className="min-h-screen bg-black text-white overflow-x-hidden pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sm:p-6">
        {/* Logo Poupy - Using the actual logo image */}
        <div className="flex items-center">
          <img src="/lovable-uploads/ffd2aa23-a813-4b2b-8e8b-4bc791036c8c.png" alt="Poupy Logo" className="h-10 sm:h-12 w-auto" />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={() => setShowValues(!showValues)} className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            {showValues ? <Eye size={18} className="text-white" /> : <EyeOff size={18} className="text-white" />}
          </button>
          <button className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <Bell size={18} className="text-white" />
          </button>
        </div>
      </header>

      {/* Welcome Message */}
      <div className="px-4 sm:px-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-medium text-white">
          Olá, {userName}
        </h1>
      </div>

      {/* Financial Summary Card */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="bg-[#A8E202] rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer hover:bg-[#96D000] transition-colors" onClick={handleExpenseCardClick}>
          <p className="text-gray-700 text-sm sm:text-base mb-2">Gastos do mês</p>
          <p className="text-black text-3xl sm:text-4xl md:text-5xl font-bold">
            {showValues ? formatCurrency(monthlyExpenses) : '••••••'}
          </p>
          <p className="text-gray-600 text-xs sm:text-sm mt-2">
            {showChart ? 'Toque para ocultar gráfico' : 'Toque para ver gráfico'}
          </p>
        </div>

        {/* Categories Legend - Always visible */}
        <div className="mt-6">
          
          <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
            {categories.map((category, index) => <div key={index} className="flex items-center gap-2 flex-shrink-0">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{
              backgroundColor: category.color
            }}></div>
                <span className="text-gray-300 text-sm whitespace-nowrap">{category.name}</span>
              </div>)}
          </div>
        </div>

        {/* Categories Chart - Only shown when showChart is true */}
        {showChart && <div className="mt-6 animate-fade-in">
            <CategoryChart data={categories} onCategoryClick={handleCategoryClick} />
          </div>}
      </div>

      {/* Transactions Section */}
      <div className="px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Transações</h2>
        
        <div className="space-y-4">
          {transactions.map(transaction => <div key={transaction.id} className="flex items-center justify-between py-3 sm:py-4 cursor-pointer hover:bg-gray-900 rounded-lg px-2 transition-colors" onClick={() => handleTransactionClick(transaction)}>
              {/* Left side - Icon and Details */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 p-2">
                  <img src={transaction.icon} alt={transaction.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm sm:text-base truncate">
                    {transaction.name}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm truncate">
                    {transaction.subcategory}
                  </p>
                </div>
              </div>

              {/* Right side - Amount and Date */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                <p className={`font-bold text-sm sm:text-base ${transaction.amount > 0 ? 'text-[#A8E202]' : 'text-red-500'}`}>
                  {showValues ? transaction.amount > 0 ? `R$ ${formatCurrency(transaction.amount).replace('R$', '').trim()}` : `R$ ${formatCurrency(transaction.amount).replace('R$', '').trim()}` : '••••••'}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {transaction.date}
                </p>
              </div>
            </div>)}
        </div>
      </div>

      {/* Bottom Navigation Menu */}
      <BottomNavigation />

      {/* Modals */}
      <TransactionDetailModal transaction={selectedTransaction} isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} />

      <CategoryTransactionsModal category={selectedCategory} transactions={transactions} isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onTransactionClick={handleCategoryTransactionClick} />
    </div>;
};
export default Dashboard;