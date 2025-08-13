
import React from 'react';
import { X, Utensils, Car, Home, ShoppingBag, Heart, Users, Gamepad2, GraduationCap, Plane, Gift, CreditCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  console.log('TransactionDetailModal render:', { transaction: !!transaction, isOpen });
  
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-none text-black max-w-md mx-auto p-0 rounded-2xl sm:rounded-3xl overflow-visible relative">
        <div className="p-8 pt-12">
          <DialogDescription className="sr-only">
            Detalhes da transação {transaction.description}
          </DialogDescription>

          {/* Category Icon positioned to be half outside */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: transaction.categories?.color || '#ff6b35' }}
            >
              <Utensils className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Content with top padding for the icon */}
          <div className="space-y-6 pb-16">
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
          </div>
        </div>
        
        {/* Edit Button positioned in bottom right */}
        <button 
          onClick={handleEdit}
          className="absolute bottom-6 right-6 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full font-medium transition-colors"
        >
          Alterar
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailModal;
