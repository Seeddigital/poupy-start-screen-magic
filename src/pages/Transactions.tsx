
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
  const navigate = useNavigate();

  const transactions = [
    {
      id: 1,
      icon: "/lovable-uploads/a667bd8c-7cd8-48d8-a62f-7c9aa32c7ba0.png",
      name: "Restaurante Madero",
      subcategory: "Alimentação • Nubank",
      amount: -120.45,
      date: "12 Jun 2025"
    },
    {
      id: 2,
      icon: "/lovable-uploads/6ae08213-7de2-4e1e-8f10-fed260628827.png",
      name: "Salário iFood",
      subcategory: "Conta Corrente Itaú",
      amount: 3007.32,
      date: "10 Jun 2025"
    },
    {
      id: 3,
      icon: "/lovable-uploads/62fc26cb-a566-42b4-a3d8-126a6ec937c8.png",
      name: "Farmácia Drogal",
      subcategory: "Cuidados com saúde • Personalite",
      amount: -267.32,
      date: "10 Jun 2025"
    },
    {
      id: 4,
      icon: "/lovable-uploads/b86e683d-74fb-4388-bdbc-c21204e683ee.png",
      name: "Strem XBox",
      subcategory: "Lazer e Bem estar • Personalite",
      amount: -32.98,
      date: "06 Jun 2025"
    },
    {
      id: 5,
      icon: "/lovable-uploads/6ae08213-7de2-4e1e-8f10-fed260628827.png",
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
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sm:p-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-xl font-semibold">Transações</h1>
        <div className="w-10"></div>
      </header>

      {/* Transactions List */}
      <div className="px-4 sm:px-6">
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-800">
              {/* Left side - Icon and Details */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 p-2">
                  <img 
                    src={transaction.icon} 
                    alt={transaction.name}
                    className="w-full h-full object-contain"
                  />
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
                  {transaction.amount > 0 ? 
                    `R$ ${formatCurrency(transaction.amount).replace('R$', '').trim()}` : 
                    `R$ ${formatCurrency(transaction.amount).replace('R$', '').trim()}`
                  }
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {transaction.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
