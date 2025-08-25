
import React from 'react';
import { X, Utensils, Car, Home, ShoppingBag, Heart, Users, Gamepad2, GraduationCap, Plane, Gift, CreditCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category_id: number;
  account_id: number;
  transaction_date: string;
  notes?: string;
  created_at: string;
  categories?: {
    name: string;
    color: string;
    icon?: string;
  };
  accounts?: {
    name: string;
    type: string;
  };
}

interface CategoryTransactionsModalProps {
  category: {
    name: string;
    color: string;
    amount: number;
  } | null;
  transactions: Transaction[];
  isOpen: boolean;
  onClose: () => void;
  onTransactionClick: (transaction: Transaction) => void;
}

const CategoryTransactionsModal = ({ 
  category, 
  transactions, 
  isOpen, 
  onClose, 
  onTransactionClick 
}: CategoryTransactionsModalProps) => {
  if (!category) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const getCategoryIcon = (categoryName: string) => {
    const iconMap = {
      'Alimentação': Utensils,
      'Transporte': Car,
      'Casa': Home,
      'Compras': ShoppingBag,
      'Saúde': Heart,
      'Família e Crianças': Users,
      'Entretenimento': Gamepad2,
      'Educação': GraduationCap,
      'Viagem': Plane,
      'Outros': Gift,
      'Cartão de Crédito': CreditCard
    };
    
    return iconMap[categoryName] || Gift;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const categoryTransactions = transactions.filter(t => 
    t.categories?.name.toLowerCase().includes(category.name.toLowerCase())
  );

  const CategoryIcon = getCategoryIcon(category.name);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-50 bg-white rounded-3xl max-w-sm w-full mx-4 shadow-lg overflow-visible max-h-[90vh]">
        {/* Category Icon positioned at the top */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: category.color }}
          >
            <CategoryIcon className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-12 pb-4">
          {/* Category Name */}
          <h2 className="text-xl font-medium text-center text-black mb-2">
            {category.name}
          </h2>

          {/* Total Amount */}
          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-[#FF3B30]">
              {formatCurrency(category.amount)}
            </p>
            <p className="text-sm text-[#999999] mt-1">
              Total da categoria
            </p>
          </div>

          {/* Transactions List */}
          <div className="max-h-[50vh] overflow-y-auto space-y-3">
            {categoryTransactions.length > 0 ? (
              categoryTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="bg-[#F8F8F8] rounded-2xl p-4 cursor-pointer hover:bg-[#F0F0F0] transition-colors"
                  onClick={() => onTransactionClick(transaction)}
                >
                  {/* Transaction Name */}
                  <p className="text-black font-semibold text-sm mb-1">
                    {transaction.description}
                  </p>
                  
                  {/* Account and Bank */}
                  <p className="text-[#666666] text-xs mb-2">
                    {transaction.categories?.name} • {transaction.accounts?.name}
                  </p>
                  
                  {/* Amount and Date Row */}
                  <div className="flex justify-between items-end">
                    <p className={`font-bold text-sm ${
                      transaction.type === 'income' ? 'text-[#00C851]' : 'text-[#FF3B30]'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-[#999999] text-xs">
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#999999]">
                <p>Nenhuma transação encontrada para esta categoria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTransactionsModal;
