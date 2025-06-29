
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: "Alimentação", color: "#FF6B35", amount: 2543.21, percentage: 20 }, // Added id as number
    { id: 2, name: "Saúde", color: "#F7DC6F", amount: 1876.45, percentage: 15 },
    { id: 3, name: "Aluguel", color: "#E74C3C", amount: 1200.00, percentage: 10 },
    { id: 4, name: "Supermercado", color: "#3498DB", amount: 3456.78, percentage: 27 },
    { id: 5, name: "Transporte", color: "#9B59B6", amount: 987.65, percentage: 8 },
    { id: 6, name: "Lazer", color: "#1ABC9C", amount: 2510.25, percentage: 20 }
  ];

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
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-gray-900 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
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
                      width: `${category.percentage * 5}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
