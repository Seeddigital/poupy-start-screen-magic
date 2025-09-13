import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Bell, LogOut, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import CategoryChart from '../components/CategoryChart';
import TransactionDetailModal from '../components/TransactionDetailModal';
import CategoryTransactionsModal from '../components/CategoryTransactionsModal';
import EditTransactionModal from '../components/EditTransactionModal';
import AuthModal from '../components/AuthModal';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { transactions, currentMonthTransactions, categories, monthlyExpenses, loading, refetch, refreshing, pullToRefresh } = useTransactions();
  const [showValues, setShowValues] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const navigate = useNavigate();

  // Redirect to home if not authenticated
  useEffect(() => {
    console.log('Dashboard - checking auth state:', { user: !!user });
    if (!user) {
      console.log('No user found, redirecting to home');
      navigate('/');
    }
  }, [user, navigate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const handleTransactionClick = transaction => {
    console.log('Clicou na transação:', transaction);
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
    console.log('Modal state:', { selectedTransaction: transaction, isOpen: true });
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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const handleEditTransaction = (transaction) => {
    // For recurrent expenses, use recurrentId instead of parsing the string ID
    const transactionId = transaction.isRecurrent ? transaction.recurrentId : Number(transaction.id);
    console.log('Edit transaction:', { isRecurrent: transaction.isRecurrent, id: transaction.id, recurrentId: transaction.recurrentId, finalId: transactionId });
    
    setSelectedTransactionId(transactionId);
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedTransactionId(null);
  };

  const handleTransactionUpdated = () => {
    refetch();
    setIsEditModalOpen(false);
    setSelectedTransactionId(null);
  };

  const handleTransactionDeleted = () => {
    refetch();
    setIsTransactionModalOpen(false);
    setSelectedTransaction(null);
  };

  // Show loading or redirect if no user
  if (!user) {
    return null; // Will redirect in useEffect
  }

  const userName = user.full_name || "Usuário";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sm:p-6">
        {/* Logo Poupy */}
        <div className="flex items-center">
          <img src="/lovable-uploads/ffd2aa23-a813-4b2b-8e8b-4bc791036c8c.png" alt="Poupy Logo" className="h-10 sm:h-12 w-auto" />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={() => setShowValues(!showValues)} className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            {showValues ? <Eye size={18} className="text-white" /> : <EyeOff size={18} className="text-white" />}
          </button>
          <button className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <Bell size={18} className="text-white" />
          </button>
          <button onClick={handleSignOut} className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <LogOut size={18} className="text-white" />
          </button>
        </div>
      </header>

      {/* Welcome Message */}
      <div className="px-4 sm:px-6 mb-14">
        <h1 className="text-[20px] font-medium text-white font-inter">
          Olá, {userName}
        </h1>
      </div>

      {/* Financial Summary Card with Chart Container */}
      <div className="px-4 sm:px-6 mb-6 relative">
        {/* Main Card with Shadow and Depth Effect */}
        <div 
          className={`bg-[#A8E202] rounded-2xl sm:rounded-3xl p-6 sm:p-8 pt-[100px] cursor-pointer hover:bg-[#96D000] transition-all duration-300 relative z-10 ${
            showChart ? 'shadow-2xl shadow-black/50' : 'shadow-lg shadow-black/25'
          }`}
          onClick={handleExpenseCardClick}
        >
          <p className="text-gray-700 text-[16px] mb-2">Gastos do mês</p>
          <p className="text-black text-[44px] font-bold">
            {showValues ? formatCurrency(monthlyExpenses) : '••••••'}
          </p>
          
          {showChart && (
            <div className="flex items-center justify-end mt-4">
              <ChevronUp className="w-4 h-4 text-gray-600" />
            </div>
          )}
        </div>

        {/* Categories preview when collapsed - Outside the green card */}
        {!showChart && (
          <div className="flex items-center justify-center mt-4 gap-4 text-xs sm:text-sm overflow-hidden">
            {categories.slice(0, 4).map((category, index) => (
              <span key={category.cat_id} className="flex items-center gap-1">
                <span 
                  className="w-3 h-0.5 rounded-full" 
                  style={{ backgroundColor: category.color }}
                ></span>
                <span className="truncate text-gray-400">
                  {category.name}
                </span>
              </span>
            ))}
            <ChevronDown className="w-4 h-4 text-red-500 flex-shrink-0 ml-2" />
          </div>
        )}

        {/* Chart Container with Slide Animation */}
        <div 
          className={`relative chart-preview-bg rounded-b-2xl sm:rounded-b-3xl transition-all duration-500 ease-out overflow-hidden ${
            showChart
              ? 'max-h-96 opacity-100 translate-y-0' 
              : 'max-h-0 opacity-0 translate-y-[-20px]'
          }`}
          style={{
            transformOrigin: 'top',
            marginTop: showChart ? '-8px' : '0',
          }}
        >
          <div className="pt-8 pb-4 px-6 sm:px-8">
            <CategoryChart data={categories} onCategoryClick={handleCategoryClick} />
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Transações</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Carregando transações...</p>
          </div>
        ) : currentMonthTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Nenhuma transação encontrada</p>
            <p className="text-gray-500 text-sm mt-2">Suas transações aparecerão aqui</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentMonthTransactions.map(transaction => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between py-3 sm:py-4 cursor-pointer hover:bg-gray-900 rounded-lg px-2 transition-colors" 
                onClick={() => handleTransactionClick(transaction)}
              >
                {/* Left side - Icon and Details */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full flex items-center justify-center p-2">
                    {transaction.categories?.icon ? (
                      <img 
                        src={transaction.categories.icon} 
                        alt={transaction.categories.name}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: transaction.categories?.color || '#gray' }}></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium text-sm sm:text-base truncate">
                        {transaction.description}
                      </p>
                      {transaction.isRecurrent && (
                        <RotateCcw size={14} className="text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm truncate">
                      {transaction.categories?.name} • {transaction.accounts?.name}
                      {transaction.isRecurrent && ' • Recorrente'}
                    </p>
                  </div>
                </div>

                {/* Right side - Amount and Date */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                  <p className={`font-bold text-sm sm:text-base ${transaction.type === 'income' ? 'text-[#A8E202]' : 'text-red-500'}`}>
                    {showValues ? (
                      transaction.type === 'income' 
                        ? `R$ ${formatCurrency(transaction.amount).replace('R$', '').trim()}` 
                        : `R$ ${formatCurrency(transaction.amount).replace('R$', '').trim()}`
                    ) : '••••••'}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <TransactionDetailModal 
        transaction={selectedTransaction} 
        isOpen={isTransactionModalOpen} 
        onClose={() => setIsTransactionModalOpen(false)}
        onEdit={handleEditTransaction}
        onDelete={handleTransactionDeleted}
      />

      <CategoryTransactionsModal 
        category={selectedCategory} 
        transactions={transactions}
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        onTransactionClick={handleCategoryTransactionClick} 
      />

      {selectedTransactionId && (
        <EditTransactionModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          onTransactionUpdated={handleTransactionUpdated}
          transactionId={selectedTransactionId}
          isRecurrent={selectedTransaction?.isRecurrent || false}
        />
      )}
    </div>
  );
};

export default Dashboard;
