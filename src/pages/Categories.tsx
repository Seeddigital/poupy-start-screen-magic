
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
    <div className="min-h-screen bg-[#151515] text-white pb-24">
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
      <div className="flex justify-center px-4">
        <div className="w-full max-w-[360px]">
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
            <div className="space-y-3">
              {categories.map((category) => {
                const goal = getGoalByCategory(category.cat_id);
                const goalProgress = goal ? calculateGoalProgress(category.amount, goal.amount) : 0;
                const isOverGoal = goal && Math.abs(category.amount) > goal.amount;
                
                return (
                  <div 
                    key={category.cat_id} 
                    className="bg-[#202020] rounded-2xl p-4 shadow-lg relative"
                    style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
                  >
                    {/* Top row with badge, title, and amount */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {category.icon ? (
                          <div 
                            className="w-9 h-9 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: category.color }}
                          >
                            <img 
                              src={category.icon} 
                              alt={category.name}
                              className="w-5 h-5 object-contain"
                            />
                          </div>
                        ) : (
                          <div 
                            className="w-9 h-9 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: category.color }}
                          >
                            <div className="w-4 h-4 rounded-full bg-white/30"></div>
                          </div>
                        )}
                        <h3 className="text-[#EDEDED] text-base font-semibold flex-1">
                          {category.name}
                        </h3>
                      </div>
                      <span className="text-[#EDEDED] text-base font-medium">
                        {formatCurrency(Math.abs(category.amount))}
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    {goal && (
                      <>
                        <div className="w-full h-1.5 bg-[#3A3A3E] rounded-full overflow-hidden mb-2">
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{ 
                              backgroundColor: category.color,
                              width: `${goalProgress}%`
                            }}
                          ></div>
                        </div>
                        
                        {/* Percentage label */}
                        <div className="flex justify-end">
                          <span className="text-[#9A9AA0] text-xs font-normal">
                            {Math.round(goalProgress)}%
                          </span>
                        </div>
                      </>
                    )}
                    
                    {/* Goal button for categories without goals */}
                    {!goal && (
                      <button
                        onClick={() => handleGoalClick(category)}
                        className="w-full mt-2 py-2 bg-white/5 rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                      >
                        <Plus size={16} className="text-gray-400" />
                        <span className="text-gray-400 text-sm">Definir meta</span>
                      </button>
                    )}
                    
                    {/* Edit goal button */}
                    {goal && (
                      <button
                        onClick={() => handleGoalClick(category)}
                        className="absolute top-3 right-3 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <Target size={12} className="text-white" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
