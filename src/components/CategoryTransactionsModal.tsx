
import React from 'react';
import { ArrowLeft } from 'lucide-react';
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

  const categoryTransactions = transactions.filter(t => 
    t.categories?.name.toLowerCase().includes(category.name.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-gray-700 text-white max-w-md mx-auto max-h-[80vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={16} className="text-white" />
            </button>
            <div>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                {category.name}
              </DialogTitle>
              <p className="text-gray-400 text-sm mt-1">
                Total: {formatCurrency(category.amount)}
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh] pr-2">
          <div className="space-y-3">
            {categoryTransactions.length > 0 ? (
              categoryTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between py-3 px-4 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={() => onTransactionClick(transaction)}
                >
                  {/* Left side - Icon and Details */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center p-2">
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: transaction.categories?.color || '#gray' }}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">
                        {transaction.description}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {transaction.categories?.name} • {transaction.accounts?.name}
                      </p>
                    </div>
                  </div>

                  {/* Right side - Amount and Date */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                    <p className={`font-bold text-sm ${
                      transaction.type === 'income' ? 'text-[#A8E202]' : 'text-red-500'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Nenhuma transação encontrada para esta categoria</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryTransactionsModal;
