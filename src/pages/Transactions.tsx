
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/hooks/useTransactions';

const Transactions = () => {
  const navigate = useNavigate();
  const { transactions, loading } = useTransactions();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A8E202] mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando transações...</p>
        </div>
      </div>
    );
  }

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
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-2">Nenhuma transação encontrada</p>
            <p className="text-gray-500 text-sm">Adicione sua primeira transação usando o botão + no menu</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-800">
                {/* Left side - Icon and Details */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 p-2">
                    {transaction.categories?.icon ? (
                      <img 
                        src={transaction.categories.icon} 
                        alt={transaction.categories.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm sm:text-base truncate">
                      {transaction.description}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm truncate">
                      {transaction.categories?.name || 'Sem categoria'} • {transaction.accounts?.name || 'Conta não especificada'}
                    </p>
                  </div>
                </div>

                {/* Right side - Amount and Date */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                  <p className={`font-bold text-sm sm:text-base ${
                    transaction.type === 'income' ? 'text-[#A8E202]' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {formatDate(transaction.transaction_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
