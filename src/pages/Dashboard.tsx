
import React, { useState } from 'react';
import { Eye, EyeOff, Bell } from 'lucide-react';

const Dashboard = () => {
  const [showValues, setShowValues] = useState(true);

  // Mock data - in real app this would come from API
  const userName = "Rodrigo";
  const monthlyExpenses = 12574.34;
  
  const categories = [
    { name: "Alimentação", color: "#FF6B35" },
    { name: "Saúde", color: "#F7DC6F" },
    { name: "Aluguel", color: "#E74C3C" },
    { name: "Supermercado", color: "#3498DB" },
    { name: "Transporte", color: "#9B59B6" },
    { name: "Lazer", color: "#1ABC9C" }
  ];

  const transactions = [
    {
      id: 1,
      icon: "🍔",
      name: "Restaurante Madero",
      subcategory: "Alimentação • Nubank",
      amount: -120.45,
      date: "12 Jun 2025"
    },
    {
      id: 2,
      icon: "💰",
      name: "Salário iFood",
      subcategory: "Conta Corrente Itaú",
      amount: 3007.32,
      date: "10 Jun 2025"
    },
    {
      id: 3,
      icon: "💊",
      name: "Farmácia Drogal",
      subcategory: "Cuidados com saúde • Personalite",
      amount: -267.32,
      date: "10 Jun 2025"
    },
    {
      id: 4,
      icon: "🎮",
      name: "Strem XBox",
      subcategory: "Lazer e Bem estar • Personalite",
      amount: -32.98,
      date: "06 Jun 2025"
    },
    {
      id: 5,
      icon: "🏠",
      name: "Aluguel Apartamento",
      subcategory: "Moradia • Transferência",
      amount: -1200.00,
      date: "05 Jun 2025"
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sm:p-6">
        {/* Logo Poupy - Using the actual logo image */}
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/ffd2aa23-a813-4b2b-8e8b-4bc791036c8c.png" 
            alt="Poupy Logo" 
            className="h-10 sm:h-12 w-auto"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => setShowValues(!showValues)}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
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
        <div className="bg-[#A8E202] rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <p className="text-gray-700 text-sm sm:text-base mb-2">Gastos do mês</p>
          <p className="text-black text-3xl sm:text-4xl md:text-5xl font-bold">
            {showValues ? formatCurrency(monthlyExpenses) : '••••••'}
          </p>
        </div>

        {/* Categories Legend */}
        <div className="mt-4 flex flex-wrap gap-3 sm:gap-4">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-4 h-3 rounded-sm"
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="text-gray-300 text-sm">{category.name}</span>
            </div>
          ))}
          <span className="text-gray-500 text-sm">...</span>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Transações</h2>
        
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 sm:py-4">
              {/* Left side - Icon and Details */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center text-lg sm:text-xl border border-gray-700">
                  {transaction.icon}
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
                <p className={`font-bold text-sm sm:text-base ${
                  transaction.amount > 0 ? 'text-[#A8E202]' : 'text-red-500'
                }`}>
                  {showValues ? (
                    transaction.amount > 0 ? 
                    `R$ ${formatCurrency(transaction.amount).replace('R$', '').trim()}` : 
                    `R$ ${formatCurrency(transaction.amount).replace('R$', '').trim()}`
                  ) : '••••••'}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {transaction.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom spacing for mobile */}
      <div className="h-8"></div>
    </div>
  );
};

export default Dashboard;
