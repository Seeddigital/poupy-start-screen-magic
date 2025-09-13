
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
  isRecurrent?: boolean;
  recurrentId?: number;
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
    if (!session?.access_token) return;
    
    // Validate ID based on transaction type
    const isRecurrent = transaction.isRecurrent;
    const deleteId = isRecurrent ? transaction.recurrentId : parseInt(transaction.id);
    
    if (!deleteId || isNaN(deleteId)) {
      toast.error('ID inválido para exclusão');
      return;
    }
    

    try {
      console.log(`Deleting ${isRecurrent ? 'recurrent' : 'regular'} expense with ID:`, deleteId);
      
      const result = isRecurrent 
        ? await otpService.deleteRecurrentExpense(session.access_token, deleteId)
        : await otpService.deleteExpense(session.access_token, deleteId);
      
      if (result.success) {
        const successMessage = isRecurrent 
          ? 'Despesa recorrente excluída com sucesso!' 
          : 'Registro excluído com sucesso!';
        toast.success(successMessage);
        onClose();
        if (onDelete) {
          onDelete();
        }
      } else {
        toast.error(result.error || 'Erro ao excluir registro');
      }
    } catch (error) {
      console.error(`Error deleting ${isRecurrent ? 'recurrent' : 'regular'} transaction:`, error);
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
      <div className="relative z-50 bg-white rounded-3xl max-w-sm w-full mx-4 shadow-lg overflow-visible">
        {/* Category Icon positioned at the top */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#F27935' }}
          >
            <Utensils className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-12 pb-6">
          <div className="space-y-4">
            {/* Transaction Name */}
            <h2 className="text-xl font-medium text-center text-black">
              {transaction.description}
            </h2>

            {/* Amount */}
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: '#FF3B30' }}>
                R$ {Math.abs(transaction.amount).toFixed(2).replace('.', ',')}
              </p>
            </div>

            {/* Transaction Details */}
            <div className="text-center">
              <p className="text-sm" style={{ color: '#999999' }}>
                {transaction.categories?.name} • {transaction.accounts?.name} • 
                {transaction.isRecurrent ? 'Próxima cobrança: ' : ''}{formatDate(transaction.transaction_date)}
                {transaction.isRecurrent && ' • Despesa Recorrente'}
              </p>
            </div>

            {/* Notes (if any) */}
            {transaction.notes && (
              <div className="text-center">
                <p className="text-sm" style={{ color: '#999999' }}>{transaction.notes}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Two Action Buttons at the Bottom - Right Aligned */}
        <div className="px-6 pb-6 flex justify-end gap-2">
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl text-black font-medium text-sm"
            style={{ backgroundColor: '#EAEAEA' }}
          >
            Excluir registro
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 rounded-xl text-black font-medium text-sm"
            style={{ backgroundColor: '#A6FF00' }}
          >
            Atualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
