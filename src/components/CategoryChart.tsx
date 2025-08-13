
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
  // Ensure data is always an array to prevent map errors
  const chartData = data || [];
  
  // Show empty state if no data
  if (chartData.length === 0) {
    return (
      <div className="w-full bg-black p-6 rounded-lg">
        <div className="h-80 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p>Nenhum dado disponível</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black p-6 rounded-lg">
      {/* Chart Area */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
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
            <XAxis hide />
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
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6">
        {chartData.map((category, index) => (
          <div
            key={category.cat_id}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onCategoryClick(category)}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-white text-sm font-medium">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
