import React from 'react';
import { Utensils, Car, Home, ShoppingBag, Heart, Users, Gamepad2, GraduationCap, Plane, Gift, CreditCard } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { otpService } from "@/services/otpService";
import { toast } from "sonner";

interface RecurrentExpenseDetailModalProps {
  expense: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (expense: any) => void;
  onDelete?: () => void;
}

const RecurrentExpenseDetailModal = ({ expense, isOpen, onClose, onEdit, onDelete }: RecurrentExpenseDetailModalProps) => {
  const { session } = useAuth();
  
  if (!expense || !isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleEdit = () => {
    if (onEdit && expense) {
      onEdit(expense);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!session?.access_token) return;
    
    try {
      console.log('Deleting recurrent expense with ID:', expense.id);
      
      const result = await otpService.deleteRecurrentExpense(
        session.access_token,
        expense.id
      );
      
      if (result.success) {
        toast.success('Gasto fixo excluído com sucesso!');
        onClose();
        if (onDelete) {
          onDelete();
        }
      } else {
        toast.error(result.error || 'Erro ao excluir gasto fixo');
      }
    } catch (error) {
      console.error('Error deleting recurrent expense:', error);
      toast.error('Erro ao excluir gasto fixo');
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

  const IconComponent = getCategoryIcon(expense.category?.name || '');

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
            style={{ backgroundColor: expense.category?.color || '#F27935' }}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-12 pb-6">
          <div className="space-y-4">
            {/* Expense Name */}
            <h2 className="text-xl font-medium text-center text-black">
              {expense.description}
            </h2>

            {/* Amount */}
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: '#FF3B30' }}>
                {formatCurrency(expense.amount)}
              </p>
            </div>

            {/* Expense Details */}
            <div className="text-center">
              <p className="text-sm" style={{ color: '#999999' }}>
                {expense.category?.name} • {expense.account?.name} • {formatDate(expense.next_charge_date)}
              </p>
            </div>
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

export default RecurrentExpenseDetailModal;