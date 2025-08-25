import React, { useState, useEffect } from 'react';
import { X, Target, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoals } from '@/hooks/useGoals';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  existingGoal?: any;
}

const GoalModal = ({ isOpen, onClose, categoryId, categoryName, categoryColor, existingGoal }: GoalModalProps) => {
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const { createGoal, updateGoal, deleteGoal } = useGoals();

  useEffect(() => {
    if (existingGoal) {
      setAmount(existingGoal.amount.toString());
      setPeriod(existingGoal.period);
    } else {
      setAmount('');
      setPeriod('monthly');
    }
  }, [existingGoal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    try {
      const goalData = {
        category_id: categoryId,
        amount: parseFloat(amount),
        period
      };

      if (existingGoal) {
        await updateGoal(existingGoal.id, {
          amount: parseFloat(amount),
          period
        });
      } else {
        await createGoal(goalData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingGoal) return;
    
    setIsLoading(true);
    try {
      await deleteGoal(existingGoal.id);
      onClose();
    } catch (error) {
      console.error('Error deleting goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseInt(numericValue) / 100);
    
    return formatted;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setAmount((parseInt(value) / 100).toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-4 shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <button 
            onClick={onClose} 
            className="self-end mb-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X size={14} className="text-gray-600" />
          </button>
          
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
            style={{ backgroundColor: categoryColor }}
          >
            <Target size={20} className="text-white" />
          </div>
          
          <h2 className="text-lg font-bold text-black text-center">
            {existingGoal ? 'Editar Meta' : 'Criar Meta'}
          </h2>
          <p className="text-[#666666] text-xs text-center">{categoryName}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="amount" className="text-[#666666] text-xs font-medium mb-1 block">
              Valor da Meta
            </Label>
            <div className="relative">
              <DollarSign size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#666666]" />
              <Input
                id="amount"
                value={formatCurrency(amount)}
                onChange={handleAmountChange}
                placeholder="R$ 0,00"
                className="pl-7 py-2 text-sm bg-white border-[#E0E0E0] text-black focus:border-[#A6FF00] focus:ring-[#A6FF00] focus:ring-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="period" className="text-[#666666] text-xs font-medium mb-1 block">
              Período
            </Label>
            <Select value={period} onValueChange={(value: 'monthly' | 'yearly') => setPeriod(value)}>
              <SelectTrigger className="py-2 text-sm bg-white border-[#E0E0E0] text-black focus:border-[#A6FF00] focus:ring-[#A6FF00] focus:ring-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#E0E0E0] z-50">
                <SelectItem value="monthly" className="text-black hover:bg-gray-50 text-sm">Mensal</SelectItem>
                <SelectItem value="yearly" className="text-black hover:bg-gray-50 text-sm">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-1.5 pt-3">
            {existingGoal && (
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="px-3 py-1.5 bg-[#EAEAEA] text-black rounded-lg text-xs hover:bg-[#D0D0D0] transition-colors"
              >
                Excluir
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading || !amount}
              className="px-3 py-1.5 bg-[#A6FF00] text-black rounded-lg text-xs hover:bg-[#95E600] transition-colors"
            >
              {isLoading ? 'Salvando...' : existingGoal ? 'Atualizar' : 'Criar Meta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;