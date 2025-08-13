
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/hooks/useTransactions';
import { useGoals } from '@/hooks/useGoals';
import GoalModal from '@/components/GoalModal';

const Categories = () => {
  const navigate = useNavigate();
  const { categories, loading } = useTransactions();
  const { goals, fetchGoals, getGoalByCategory } = useGoals();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleGoalClick = (category: any) => {
    setSelectedCategory(category);
    setIsGoalModalOpen(true);
  };

  const calculateGoalProgress = (spent: number, goalAmount: number) => {
    if (!goalAmount) return 0;
    return Math.min((Math.abs(spent) / goalAmount) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sm:p-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-xl font-semibold">Categorias</h1>
        <div className="w-10"></div>
      </header>

      {/* Categories List */}
      <div className="px-4 sm:px-6">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Carregando categorias...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Nenhuma categoria com transações encontrada</p>
            <p className="text-gray-500 text-sm mt-2">Faça algumas transações para ver suas categorias aqui</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-4">
              <p className="text-gray-400 text-sm">
                Mostrando apenas categorias com transações neste mês
              </p>
            </div>
            {categories.map((category) => {
              const goal = getGoalByCategory(category.cat_id);
              const goalProgress = goal ? calculateGoalProgress(category.amount, goal.amount) : 0;
              const isOverGoal = goal && Math.abs(category.amount) > goal.amount;
              
              return (
                <div key={category.cat_id} className="bg-gray-900 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {category.icon ? (
                        <img 
                          src={category.icon} 
                          alt={category.name}
                          className="w-10 h-10 object-contain p-2 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: category.color }}
                        >
                          <div className="w-6 h-6 rounded-full bg-white/20"></div>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{category.name}</h3>
                        {goal && (
                          <p className="text-gray-400 text-sm">
                            Meta: {formatCurrency(goal.amount)} ({goal.period === 'monthly' ? 'mensal' : 'anual'})
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {goal && (
                        <span className={`text-sm font-medium ${isOverGoal ? 'text-red-500' : 'text-gray-400'}`}>
                          {Math.round(goalProgress)}%
                        </span>
                      )}
                      <button
                        onClick={() => handleGoalClick(category)}
                        className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        {goal ? <Target size={14} className="text-[#A8E202]" /> : <Plus size={14} className="text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-lg ${isOverGoal ? 'text-red-500' : 'text-white'}`}>
                        {formatCurrency(category.amount)}
                      </span>
                      {goal && (
                        <span className="text-gray-400 text-sm">
                          Restam {formatCurrency(Math.max(0, goal.amount - Math.abs(category.amount)))}
                        </span>
                      )}
                    </div>
                    
                    {goal && (
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOverGoal ? 'bg-red-500' : 'bg-gradient-to-r from-[#A8E202] to-[#96D000]'
                          }`}
                          style={{ 
                            width: `${goalProgress}%`
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Goal Modal */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        categoryId={selectedCategory?.cat_id}
        categoryName={selectedCategory?.name}
        categoryColor={selectedCategory?.color}
        existingGoal={selectedCategory ? getGoalByCategory(selectedCategory.cat_id) : undefined}
      />
    </div>
  );
};

export default Categories;
