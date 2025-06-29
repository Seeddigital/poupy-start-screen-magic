
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
}

const TransactionDetailModal = ({ transaction, isOpen, onClose }: TransactionDetailModalProps) => {
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
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Detalhes da Transação</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Transaction Icon and Name */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 p-2">
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: transaction.categories?.color || '#gray' }}
              ></div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">{transaction.description}</h3>
              <p className="text-gray-400 text-sm">{transaction.categories?.name} • {transaction.accounts?.name}</p>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Valor</p>
            <p className={`text-2xl font-bold ${
              transaction.type === 'income' ? 'text-[#A8E202]' : 'text-red-500'
            }`}>
              {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
            </p>
          </div>

          {/* Date */}
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Data</p>
            <p className="text-white font-medium">{formatDate(transaction.transaction_date)}</p>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Conta</p>
            <p className="text-white font-medium">
              {transaction.accounts?.name || 'Não informado'}
            </p>
          </div>

          {/* Notes (if any) */}
          {transaction.notes && (
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Observações</p>
              <p className="text-white font-medium">{transaction.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailModal;
