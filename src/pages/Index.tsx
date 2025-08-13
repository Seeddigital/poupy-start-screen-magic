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
  /** Mostra legenda abaixo do gráfico (default: true) */
  showLegend?: boolean;
  /** Aplica padding interno no card (default: 0) */
  padding?: string; // ex.: "p-6"
  /** Classe extra para o container */
  className?: string;
  /** Mostrar eixo Y (oculto por padrão para não roubar espaço) */
  showYAxis?: boolean;
}

const CategoryChart: React.FC<CategoryChartProps> = ({
  data,
  onCategoryClick,
  showLegend = true,
  padding = '',        // deixe vazio para ocupar 100% mesmo
  className = '',
  showYAxis = false,   // manter false para não sobrar margem à esquerda
}) => {
  return (
    <div className={`w-full h-full bg-black rounded-lg flex flex-col ${padding} ${className}`}>
      {/* Área do gráfico ocupa tudo */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            // Zerar margens para encostar nas bordas
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            // Eliminar espaço entre categorias
            barCategoryGap="0%"
          >
            {/* Grid suave; pode remover se quiser zero ruído visual */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#333333"
              strokeOpacity={0.25}
              horizontal
              vertical={false}
            />

            {/* Sem labels no X, sem padding extra nas laterais */}
            <XAxis
              dataKey="name"
              hide
              padding={{ left: 0, right: 0 }}
            />

            {/* Para não reservar espaço à esquerda, ocultamos e setamos width=0 */}
            <YAxis
              hide={!showYAxis}
              width={showYAxis ? undefined : 0}
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
              // @ts-ignore - payload do Recharts
              onClick={(payload: any) => {
                if (payload?.payload) onCategoryClick(payload.payload as CategoryData);
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda opcional */}
      {showLegend && (
        <div className="pt-3 flex flex-wrap justify-center gap-6">
          {data.map((category) => (
            <button
              key={category.cat_id}
              type="button"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              onClick={() => onCategoryClick(category)}
            >
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-white text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryChart;
