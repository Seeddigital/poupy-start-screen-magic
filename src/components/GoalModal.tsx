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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">
      <div className="bg-gray-900 rounded-t-3xl w-full max-w-md p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: categoryColor }}
            >
              <Target size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {existingGoal ? 'Editar Meta' : 'Criar Meta'}
              </h2>
              <p className="text-gray-400 text-sm">{categoryName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-white mb-2 block">
              Valor da Meta
            </Label>
            <div className="relative">
              <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="amount"
                value={formatCurrency(amount)}
                onChange={handleAmountChange}
                placeholder="R$ 0,00"
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="period" className="text-white mb-2 block">
              Período
            </Label>
            <Select value={period} onValueChange={(value: 'monthly' | 'yearly') => setPeriod(value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {existingGoal && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1"
              >
                Excluir
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading || !amount}
              className="flex-1 bg-[#A8E202] hover:bg-[#96D000] text-black"
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