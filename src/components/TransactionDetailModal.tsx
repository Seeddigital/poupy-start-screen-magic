
import React from 'react';
import { X } from 'lucide-react';
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
  category_id: number; // Changed from string to number
  account_id: number; // Changed from string to number
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

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (transaction: Transaction) => void;
}

const TransactionDetailModal = ({ transaction, isOpen, onClose, onEdit }: TransactionDetailModalProps) => {
  if (!transaction) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleEdit = () => {
    if (onEdit && transaction) {
      onEdit(transaction);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-none text-black max-w-md mx-auto p-8 rounded-[2rem]">
        <DialogHeader className="space-y-6">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/10 rounded-full flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Category Icon */}
          <div className="flex justify-center">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: transaction.categories?.color || '#ff6b35' }}
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
            </div>
          </div>

          {/* Transaction Name */}
          <DialogTitle className="text-2xl font-semibold text-center text-black">
            {transaction.description}
          </DialogTitle>

          {/* Amount */}
          <div className="text-center">
            <p className={`text-4xl font-bold ${
              transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
            }`}>
              R$ {Math.abs(transaction.amount).toFixed(2).replace('.', ',')}
            </p>
          </div>

          {/* Transaction Details */}
          <div className="text-center">
            <p className="text-gray-500 text-lg">
              {transaction.categories?.name} • {transaction.accounts?.name} • {formatDate(transaction.transaction_date)}
            </p>
          </div>

          {/* Notes (if any) */}
          {transaction.notes && (
            <div className="text-center">
              <p className="text-gray-600 text-sm">{transaction.notes}</p>
            </div>
          )}

          {/* Edit Button */}
          <div className="flex justify-center pt-4">
            <button 
              onClick={handleEdit}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium transition-colors"
            >
              Alterar
            </button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailModal;
