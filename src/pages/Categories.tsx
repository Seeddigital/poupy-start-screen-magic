
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
            <div className="space-y-4">
              {categories.map((category) => {
                const goal = getGoalByCategory(category.cat_id);
                const goalProgress = goal ? calculateGoalProgress(category.amount, goal.amount) : 0;
                const isOverGoal = goal && Math.abs(category.amount) > goal.amount;
                
                return (
                  <div 
                    key={category.cat_id} 
                    className="bg-white rounded-2xl p-6 shadow-sm relative"
                    style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}
                  >
                    {/* Centered Icon */}
                    <div className="flex justify-center mb-4">
                      {category.icon ? (
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: category.color }}
                        >
                          <img 
                            src={category.icon} 
                            alt={category.name}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                      ) : (
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: category.color }}
                        >
                          <div className="w-5 h-5 rounded-full bg-white/30"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Centered Title */}
                    <h3 className="text-black text-lg font-semibold text-center mb-3">
                      {category.name}
                    </h3>
                    
                    {/* Centered Value */}
                    <div className="text-center mb-2">
                      <span className="text-black text-2xl font-bold">
                        {formatCurrency(Math.abs(category.amount))}
                      </span>
                    </div>
                    
                    {/* Subtitle */}
                    <p className="text-center text-sm mb-6" style={{ color: '#999999' }}>
                      Todas as metas são mensais
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2">
                      {!goal ? (
                        /* No goal defined - single gray button */
                        <button
                          onClick={() => handleGoalClick(category)}
                          className="px-4 py-2 rounded-xl text-black font-medium text-sm"
                          style={{ backgroundColor: '#EAEAEA' }}
                        >
                          Criar meta
                        </button>
                      ) : (
                        /* Goal exists - two buttons aligned right */
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete goal
                              handleGoalClick(category);
                            }}
                            className="px-4 py-2 rounded-xl text-black font-medium text-sm"
                            style={{ backgroundColor: '#EAEAEA' }}
                          >
                            Excluir meta
                          </button>
                          <button
                            onClick={() => handleGoalClick(category)}
                            className="px-4 py-2 rounded-xl text-black font-medium text-sm"
                            style={{ backgroundColor: '#A6FF00' }}
                          >
                            Atualizar
                          </button>
                        </>
                      )}
                    </div>
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
