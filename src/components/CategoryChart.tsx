
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface CategoryData {
  id: number; // Changed from string to number
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
    <div className="w-full h-48 mb-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis hide />
          <Bar 
            dataKey="amount" 
            radius={[4, 4, 0, 0]}
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
  );
};

export default CategoryChart;
