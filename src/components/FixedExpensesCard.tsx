import React from 'react';
import { Calendar, RotateCcw, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import { useRecurrentExpenses } from '@/hooks/useRecurrentExpenses';

interface FixedExpensesCardProps {
  showValues: boolean;
  showFixedExpenses: boolean;
  onToggle: () => void;
}

const FixedExpensesCard = ({ showValues, showFixedExpenses, onToggle }: FixedExpensesCardProps) => {
  const { recurrentExpenses, loading } = useRecurrentExpenses();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '--/--';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return '--/--';
    }
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  // Calculate total monthly recurring expenses
  const totalMonthly = recurrentExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Get next 3 upcoming charges for preview
  const upcomingCharges = recurrentExpenses
    .sort((a, b) => new Date(a.next_charge_date).getTime() - new Date(b.next_charge_date).getTime())
    .slice(0, 3);

  // Get all expenses sorted for expanded view
  const allExpensesSorted = recurrentExpenses
    .sort((a, b) => new Date(a.next_charge_date).getTime() - new Date(b.next_charge_date).getTime());

  if (loading) {
    return (
      <div className="bg-[#A8E202] rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative z-10">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700/20 rounded w-32 mb-2"></div>
          <div className="h-8 bg-gray-700/20 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Card */}
      <div 
        className={`bg-[#A8E202] rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer hover:bg-[#96D000] transition-all duration-300 relative z-10 ${
          showFixedExpenses ? 'shadow-2xl shadow-black/50' : 'shadow-lg shadow-black/25'
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RotateCcw size={20} className="text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-700">Gastos Fixos</h3>
          </div>
          {recurrentExpenses.length > 0 && (
            showFixedExpenses ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )
          )}
        </div>

        <div className="mb-4">
          <p className="text-gray-700 text-[16px] mb-1">Total mensal</p>
          <p className="text-black text-[32px] font-bold">
            {showValues ? formatCurrency(totalMonthly) : '••••••'}
          </p>
        </div>

        {recurrentExpenses.length === 0 && (
          <div className="text-center py-4">
            <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700">
              Nenhum gasto fixo cadastrado
            </p>
          </div>
        )}
      </div>

      {/* Expanded List Container */}
      <div 
        className={`relative chart-preview-bg rounded-b-2xl sm:rounded-b-3xl transition-all duration-500 ease-out overflow-hidden ${
          showFixedExpenses
            ? 'max-h-96 opacity-100 translate-y-0' 
            : 'max-h-0 opacity-0 translate-y-[-20px]'
        }`}
        style={{
          transformOrigin: 'top',
          marginTop: showFixedExpenses ? '-8px' : '0',
        }}
      >
        <div className="pt-8 pb-4 px-6 sm:px-8">
          {allExpensesSorted.length > 0 ? (
            <div className="space-y-2">
              {allExpensesSorted.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: expense.category?.color || '#gray' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">
                        {expense.description}
                      </p>
                      <p className="text-gray-400 text-xs">
                        Próxima: {formatDate(expense.next_charge_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4 text-right">
                    <p className="text-red-400 font-semibold text-sm">
                      {showValues ? formatCurrency(expense.amount) : '••••••'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Nenhum gasto fixo cadastrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FixedExpensesCard;