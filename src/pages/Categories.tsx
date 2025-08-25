import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/hooks/useTransactions';
import { useGoals } from '@/hooks/useGoals';
import GoalModal from '@/components/GoalModal';

const Categories = () => {
  const navigate = useNavigate();
  const { categories, loading } = useTransactions();
  const { goals, fetchGoals, getGoalByCategory, createGoal, updateGoal, deleteGoal } = useGoals();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCategoryClick = (category: any) => {
    setSelectedCategoryId(selectedCategoryId === category.cat_id ? null : category.cat_id);
  };

  const handleCreateGoal = (categoryId: number) => {
    const category = categories.find(cat => cat.cat_id === categoryId);
    if (category) {
      setSelectedCategory(category);
      setIsGoalModalOpen(true);
    }
  };

  const handleUpdateGoal = (categoryId: number) => {
    const category = categories.find(cat => cat.cat_id === categoryId);
    if (category) {
      setSelectedCategory(category);
      setIsGoalModalOpen(true);
    }
  };

  const handleDeleteGoal = async (categoryId: number) => {
    const goal = getGoalByCategory(categoryId);
    if (goal) {
      await deleteGoal(goal.id);
      fetchGoals();
    }
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
                  <div key={category.cat_id}>
                    <div 
                      className="bg-[#202020] rounded-2xl p-4 shadow-lg relative cursor-pointer hover:bg-[#252525] transition-colors"
                      style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
                      onClick={() => handleCategoryClick(category)}
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
                        <div className="w-full mt-2 py-2 bg-white/5 rounded-lg flex items-center justify-center gap-2">
                          <Plus size={16} className="text-gray-400" />
                          <span className="text-gray-400 text-sm">Definir meta</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Goal Card - appears when category is selected */}
                    {selectedCategoryId === category.cat_id && (
                      <div className="mt-4 bg-white rounded-2xl p-6 shadow-lg">
                        {/* Top icon and title */}
                        <div className="flex flex-col items-center mb-4">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                            style={{ backgroundColor: category.color }}
                          >
                            {category.icon ? (
                              <img 
                                src={category.icon} 
                                alt={category.name}
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-white/30"></div>
                            )}
                          </div>
                          <h3 className="text-black text-lg font-semibold text-center">
                            {category.name}
                          </h3>
                        </div>

                        {/* Value */}
                        <div className="text-center mb-2">
                          <span className="text-black text-3xl font-bold">
                            {Math.abs(category.amount) === 0 ? "R$ 0,00" : formatCurrency(Math.abs(category.amount))}
                          </span>
                        </div>

                        {/* Subtitle */}
                        <div className="text-center mb-6">
                          <span className="text-[#999999] text-sm">
                            Todas as metas são mensais
                          </span>
                        </div>

                        {/* Action buttons based on state */}
                        <div className="flex justify-center">
                          {(() => {
                            const hasSpending = Math.abs(category.amount) > 0;
                            
                            if (goal) {
                              // Goal already created - show two buttons aligned right
                              return (
                                <div className="flex gap-2 justify-end w-full">
                                  <button
                                    onClick={() => handleDeleteGoal(category.cat_id)}
                                    className="px-4 py-2 bg-[#EAEAEA] text-black rounded-lg text-sm hover:bg-[#D0D0D0] transition-colors"
                                  >
                                    Excluir meta
                                  </button>
                                  <button
                                    onClick={() => handleUpdateGoal(category.cat_id)}
                                    className="px-4 py-2 bg-[#A6FF00] text-black rounded-lg text-sm hover:bg-[#95E600] transition-colors"
                                  >
                                    Atualizar
                                  </button>
                                </div>
                              );
                            } else if (hasSpending) {
                              // Has spending but no goal - show lime green button
                              return (
                                <button
                                  onClick={() => handleCreateGoal(category.cat_id)}
                                  className="px-6 py-2 bg-[#A6FF00] text-black rounded-lg text-sm hover:bg-[#95E600] transition-colors"
                                >
                                  Criar meta
                                </button>
                              );
                            } else {
                              // No spending yet - show gray button
                              return (
                                <button
                                  onClick={() => handleCreateGoal(category.cat_id)}
                                  className="px-6 py-2 bg-[#EAEAEA] text-black rounded-lg text-sm hover:bg-[#D0D0D0] transition-colors"
                                >
                                  Criar meta
                                </button>
                              );
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Goal Modal */}
      {isGoalModalOpen && (
        <GoalModal
          isOpen={isGoalModalOpen}
          onClose={() => {
            setIsGoalModalOpen(false);
            fetchGoals(); // Refresh goals after modal closes
          }}
          categoryId={selectedCategory?.cat_id}
          categoryName={selectedCategory?.name}
          categoryColor={selectedCategory?.color}
          existingGoal={selectedCategory ? getGoalByCategory(selectedCategory.cat_id) : undefined}
        />
      )}
    </div>
  );
};

export default Categories;