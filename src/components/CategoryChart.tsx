
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface CategoryData {
  cat_id: number;
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

interface CategoryChartProps {
  data: CategoryData[];
  onCategoryClick: (category: CategoryData) => void;
}

const CategoryChart = ({ data, onCategoryClick }: CategoryChartProps) => {
  return (
    <div className="w-full bg-black p-6 rounded-lg">
      {/* Chart Area */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
            barCategoryGap="10%"
            maxBarSize={100}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#333333" 
              strokeOpacity={0.3}
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#ffffff', textAnchor: 'middle' }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666666' }}
              domain={[0, 'dataMax']}
              tickCount={6}
            />
            <Bar 
              dataKey="amount" 
              radius={[20, 20, 20, 20]}
              cursor="pointer"
              onClick={(data) => onCategoryClick(data)}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Categoria Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((category, index) => (
          <div 
            key={category.cat_id}
            className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors border-l-4"
            style={{ borderLeftColor: category.color }}
            onClick={() => onCategoryClick(category)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-white text-sm font-medium truncate">
                {category.name}
              </span>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">
                R$ {category.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-gray-400 text-xs">
                {category.percentage.toFixed(1)}% do total
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
