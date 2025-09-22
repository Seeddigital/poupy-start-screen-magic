import React from 'react';
import { Calendar, RotateCcw, ChevronRight, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useRecurrentExpenses } from '@/hooks/useRecurrentExpenses';
import { useNavigate } from 'react-router-dom';

interface FixedExpensesCardProps {
  showValues: boolean;
}

const FixedExpensesCard = ({ showValues }: FixedExpensesCardProps) => {
  const { recurrentExpenses, loading } = useRecurrentExpenses();
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  // Calculate total monthly recurring expenses
  const totalMonthly = recurrentExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Get next 3 upcoming charges
  const upcomingCharges = recurrentExpenses
    .sort((a, b) => new Date(a.next_charge_date).getTime() - new Date(b.next_charge_date).getTime())
    .slice(0, 3);

  const handleCardClick = () => {
    navigate('/recurring-expenses');
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-32 mb-2"></div>
            <div className="h-8 bg-muted rounded w-24"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RotateCcw size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Gastos Fixos</h3>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Total mensal</p>
          <p className="text-2xl font-bold text-foreground">
            {showValues ? formatCurrency(totalMonthly) : '••••••'}
          </p>
        </div>

        {upcomingCharges.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
              <Calendar size={14} />
              Próximas cobranças
            </p>
            <div className="space-y-2">
              {upcomingCharges.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: expense.category?.color || '#gray' }}
                    />
                    <span className="text-foreground truncate max-w-[120px]">
                      {expense.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{formatDate(expense.next_charge_date)}</span>
                    <span className="font-medium">
                      {showValues ? formatCurrency(expense.amount) : '••••'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recurrentExpenses.length === 0 && (
          <div className="text-center py-4">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhum gasto fixo cadastrado
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FixedExpensesCard;