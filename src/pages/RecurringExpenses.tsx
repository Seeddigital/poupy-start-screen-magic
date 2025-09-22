import React, { useState } from 'react';
import { ArrowLeft, Calendar, RotateCcw, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRecurrentExpenses } from '@/hooks/useRecurrentExpenses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const RecurringExpenses = () => {
  const navigate = useNavigate();
  const { recurrentExpenses, loading, refreshing, pullToRefresh } = useRecurrentExpenses();
  const [showValues, setShowValues] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (nextChargeDate: string) => {
    const today = new Date();
    const chargeDate = new Date(nextChargeDate);
    const diffDays = Math.ceil((chargeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <Badge variant="destructive">Vencido</Badge>;
    } else if (diffDays <= 7) {
      return <Badge variant="secondary">Próximo</Badge>;
    } else {
      return <Badge variant="outline">Programado</Badge>;
    }
  };

  // Calculate total monthly recurring expenses
  const totalMonthly = recurrentExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Group expenses by status
  const overdueExpenses = recurrentExpenses.filter(expense => {
    const today = new Date();
    const chargeDate = new Date(expense.next_charge_date);
    return chargeDate < today;
  });

  const upcomingExpenses = recurrentExpenses.filter(expense => {
    const today = new Date();
    const chargeDate = new Date(expense.next_charge_date);
    const diffDays = Math.ceil((chargeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  const scheduledExpenses = recurrentExpenses.filter(expense => {
    const today = new Date();
    const chargeDate = new Date(expense.next_charge_date);
    const diffDays = Math.ceil((chargeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  });

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="flex items-center p-4 border-b border-border">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Gastos Fixos</h1>
        </header>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Gastos Fixos</h1>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </header>

      {/* Summary Card */}
      <div className="p-4">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-6 h-6" />
                <h2 className="text-lg font-semibold">Total Mensal</h2>
              </div>
            </div>
            <p className="text-3xl font-bold mb-2">
              {showValues ? formatCurrency(totalMonthly) : '••••••'}
            </p>
            <p className="text-primary-foreground/80 text-sm">
              {recurrentExpenses.length} {recurrentExpenses.length === 1 ? 'gasto recorrente' : 'gastos recorrentes'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
      <div className="px-4 space-y-6">
        {/* Overdue Expenses */}
        {overdueExpenses.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-destructive mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Vencidos ({overdueExpenses.length})
            </h3>
            <div className="space-y-3">
              {overdueExpenses.map((expense) => (
                <Card key={expense.id} className="border-destructive/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: expense.category?.color || '#gray' }}
                        />
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {expense.category?.name} • {expense.account?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-destructive">
                          {showValues ? formatCurrency(expense.amount) : '••••••'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(expense.next_charge_date)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Expenses */}
        {upcomingExpenses.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-warning mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximos 7 dias ({upcomingExpenses.length})
            </h3>
            <div className="space-y-3">
              {upcomingExpenses.map((expense) => (
                <Card key={expense.id} className="border-warning/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: expense.category?.color || '#gray' }}
                        />
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {expense.category?.name} • {expense.account?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {showValues ? formatCurrency(expense.amount) : '••••••'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(expense.next_charge_date)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Expenses */}
        {scheduledExpenses.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Programados ({scheduledExpenses.length})
            </h3>
            <div className="space-y-3">
              {scheduledExpenses.map((expense) => (
                <Card key={expense.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: expense.category?.color || '#gray' }}
                        />
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {expense.category?.name} • {expense.account?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {showValues ? formatCurrency(expense.amount) : '••••••'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(expense.next_charge_date)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recurrentExpenses.length === 0 && (
          <div className="text-center py-16">
            <RotateCcw className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum gasto fixo cadastrado</h3>
            <p className="text-muted-foreground mb-6">
              Adicione seus gastos recorrentes para ter um melhor controle financeiro
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar primeiro gasto fixo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecurringExpenses;