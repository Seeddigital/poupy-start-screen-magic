
import React, { useState } from 'react';
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/hooks/useTransactions';
import EditTransactionModal from '@/components/EditTransactionModal';

const Transactions = () => {
  const navigate = useNavigate();
  const { transactions, loading, refetch, refreshing, pullToRefresh } = useTransactions();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [activeTransactionId, setActiveTransactionId] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [pullStart, setPullStart] = useState<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  const handleEditTransaction = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
    setEditModalOpen(true);
    setActiveTransactionId(null);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedTransactionId(null);
  };

  const handleTransactionUpdated = () => {
    refetch();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (transactionId: number) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    
    if (isLeftSwipe) {
      setActiveTransactionId(activeTransactionId === transactionId ? null : transactionId);
    } else {
      setActiveTransactionId(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = (transactionId: number) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    
    if (isLeftSwipe) {
      setActiveTransactionId(activeTransactionId === transactionId ? null : transactionId);
    } else {
      setActiveTransactionId(null);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Pull to refresh handlers
  const handlePullStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setPullStart(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handlePullMove = (e: React.TouchEvent) => {
    if (isPulling && pullStart) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - pullStart);
      setPullDistance(Math.min(distance, 120)); // Max pull distance
      
      if (distance > 80) {
        // Prevent default scroll behavior when pulling
        e.preventDefault();
      }
    }
  };

  const handlePullEnd = async () => {
    if (isPulling) {
      if (pullDistance > 80) {
        await pullToRefresh();
      }
      setIsPulling(false);
      setPullStart(null);
      setPullDistance(0);
    }
  };

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
    <div 
      className="min-h-screen bg-black text-white pb-24"
      onTouchStart={handlePullStart}
      onTouchMove={handlePullMove}
      onTouchEnd={handlePullEnd}
    >
      {/* Pull to refresh indicator */}
      {isPulling && (
        <div 
          className="fixed top-0 left-0 right-0 flex items-center justify-center bg-black/90 text-white transition-all duration-200 z-50"
          style={{ height: `${Math.min(pullDistance, 80)}px` }}
        >
          {pullDistance > 80 ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#A8E202]"></div>
              <span className="text-sm">Solte para atualizar</span>
            </div>
          ) : (
            <span className="text-sm">Puxe para atualizar</span>
          )}
        </div>
      )}
      
      {/* Refreshing indicator */}
      {refreshing && (
        <div className="fixed top-0 left-0 right-0 flex items-center justify-center bg-[#A8E202] text-black py-2 z-50">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            <span className="text-sm font-medium">Atualizando...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between p-4 sm:p-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
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
              <div 
                key={transaction.id} 
                className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-800 group cursor-pointer hover:bg-gray-900/50 transition-colors select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(Number(transaction.id))}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={() => handleMouseUp(Number(transaction.id))}
              >
                {/* Left side - Icon and Details */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/5 rounded-full flex items-center justify-center p-2">
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

                {/* Center - Amount and Date */}
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

                {/* Right side - Edit Icon (visible when active) */}
                <div className="flex items-center gap-2 ml-3">
                  {activeTransactionId === Number(transaction.id) ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTransaction(Number(transaction.id));
                      }}
                      className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200"
                    >
                      <Edit3 size={14} className="text-white" />
                    </button>
                  ) : (
                    <div className="w-8 h-8"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Transaction Modal */}
      {selectedTransactionId && (
        <EditTransactionModal
          isOpen={editModalOpen}
          onClose={handleModalClose}
          onTransactionUpdated={handleTransactionUpdated}
          transactionId={selectedTransactionId}
        />
      )}
    </div>
  );
};

export default Transactions;
