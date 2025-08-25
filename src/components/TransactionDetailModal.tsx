
import React from 'react';
import { X, Utensils, Car, Home, ShoppingBag, Heart, Users, Gamepad2, GraduationCap, Plane, Gift, CreditCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { otpService } from "@/services/otpService";
import { toast } from "sonner";

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
  onDelete?: () => void;
}

const TransactionDetailModal = ({ transaction, isOpen, onClose, onEdit, onDelete }: TransactionDetailModalProps) => {
  const { session } = useAuth();
  
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

  const handleDelete = async () => {
    if (!session?.access_token || !transaction.id) return;
    
    // Show confirmation
    const confirmed = window.confirm('Tem certeza que deseja excluir este registro?');
    if (!confirmed) return;

    try {
      const result = await otpService.deleteExpense(session.access_token, parseInt(transaction.id));
      
      if (result.success) {
        toast.success('Registro excluído com sucesso!');
        onClose();
        if (onDelete) {
          onDelete();
        }
      } else {
        toast.error(result.error || 'Erro ao excluir registro');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Erro ao excluir registro');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-50 bg-white rounded-2xl sm:rounded-3xl max-w-md w-full mx-4 shadow-xl overflow-visible">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center z-20 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
        
        {/* Category Icon positioned to be half outside */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: transaction.categories?.color || '#ff6b35' }}
          >
            <Utensils className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 pt-16 pb-20">
          <div className="space-y-6">
            {/* Transaction Name */}
            <h2 className="text-2xl font-semibold text-center text-black">
              {transaction.description}
            </h2>

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
        
        {/* Two Action Buttons at the Bottom */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-3">
          <Button
            variant="outline"
            onClick={handleDelete}
            className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Excluir registro
          </Button>
          <Button
            onClick={handleEdit}
            className="flex-1 bg-lime-500 hover:bg-lime-600 text-white"
          >
            Atualizar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
