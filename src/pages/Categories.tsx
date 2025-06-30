
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/hooks/useTransactions';

const Categories = () => {
  const navigate = useNavigate();
  const { categories, loading } = useTransactions();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sm:p-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
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
            {categories.map((category) => (
              <div key={category.cat_id} className="bg-gray-900 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {category.icon ? (
                      <img 
                        src={category.icon} 
                        alt={category.name}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                    )}
                    <h3 className="text-white font-medium">{category.name}</h3>
                  </div>
                  <span className="text-gray-400 text-sm">{category.percentage}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-lg">
                    {formatCurrency(category.amount)}
                  </span>
                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: category.color,
                        width: `${Math.min(category.percentage * 5, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
