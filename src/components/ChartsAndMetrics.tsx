import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Award, Layers, TrendingDown, HelpCircle } from 'lucide-react';
import { FinancialAnalysis, CategorySummary } from '../types';
import { formatCurrency, formatPercent } from '../financeUtils';

interface ChartsAndMetricsProps {
  analysis: FinancialAnalysis;
}

// Visual category colors
const CATEGORY_COLORS: { [key: string]: string } = {
  'Alimentação': '#f97316', // Laranja
  'Transporte': '#0ea5e9', // Azul Turquesa
  'Moradia': '#6366f1', // Indigo
  'Lazer': '#ec4899', // Pink
  'Delivery': '#ef4444', // Vermelho
  'Saúde': '#10b981', // Esmeralda
  'Educação': '#8b5cf6', // Violeta
  'Outras Despesas': '#64748b', // Slate
  'Outros': '#94a3b8' // Slate médio
};

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6', '#64748b'];

export default function ChartsAndMetrics({ analysis }: ChartsAndMetricsProps) {
  const { topCategories, totalExpenses } = analysis;

  // Prepare chart data: we only map categories that actually have positive expense total
  const chartData = topCategories.map((c, idx) => ({
    name: c.category,
    value: c.total,
    percentage: c.percentageOfExpenses,
    color: CATEGORY_COLORS[c.category] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]
  }));

  // Render a custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg border border-slate-800 text-xs space-y-1">
          <p className="font-semibold">{data.name}</p>
          <p className="text-slate-300">Total: {formatCurrency(data.value)}</p>
          <p className="text-indigo-400 font-medium">Proporção: {formatPercent(data.percentage)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. CHART DESPESAS POR CATEGORIA */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col">
        <h3 className="text-base font-semibold tracking-tight text-slate-900 mb-2 flex items-center gap-2">
          <Layers className="h-5 w-5 text-indigo-500" />
          Proporção dos Gastos por Categoria
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Distribuição percentual simplificada de onde estão alocadas suas saídas registradas.
        </p>

        <div className="relative h-64 flex-1 flex items-center justify-center min-h-[250px]">
          {totalExpenses > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  iconSize={8}
                  formatter={(value, entry: any) => {
                    const originalItem = chartData.find(d => d.name === value);
                    const pct = originalItem ? ` (${originalItem.percentage.toFixed(0)}%)` : '';
                    return <span className="text-xs font-medium text-slate-600">{value}{pct}</span>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center p-6 space-y-2">
              <HelpCircle className="h-12 w-12 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-500">Nenhum gasto registrado para gerar o gráfico</p>
              <p className="text-xs text-slate-400">Cadastre suas despesas para ver o gráfico de rosca interativo.</p>
            </div>
          )}

          {/* Central Counter inside Donut (only if totalExpenses > 0) */}
          {totalExpenses > 0 && (
            <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Total Gasto</span>
              <span className="text-lg font-extrabold text-slate-800 block truncate max-w-[120px]">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. TOP 3 CATEGORIES LIST WITH PROGRESS */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900 mb-2 flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" />
            Top 3 Categorias de Maior Gasto
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            O pódio das categorias que mais consumiram recursos do seu orçamento este mês.
          </p>

          {topCategories.length > 0 ? (
            <div className="space-y-5">
              {topCategories.map((c, index) => {
                const color = CATEGORY_COLORS[c.category] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
                const displayRank = index + 1;

                return (
                  <div key={c.category} className="space-y-2 animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2.5">
                        <span 
                          className={`w-6 h-6 flex items-center justify-center font-bold text-xs rounded-full ${
                            displayRank === 1 ? 'bg-rose-50 text-rose-600' :
                            displayRank === 2 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'
                          }`}
                        >
                          {displayRank}º
                        </span>
                        <span className="font-semibold text-slate-700">{c.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 block">{formatCurrency(c.total)}</span>
                        <span className="text-xs text-slate-400 block">{formatPercent(c.percentageOfExpenses)} das despesas</span>
                      </div>
                    </div>

                    {/* Progress Bar visual indicator */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700"
                        style={{ 
                          width: `${c.percentageOfExpenses}%`,
                          backgroundColor: color 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 space-y-2">
              <TrendingDown className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-500">Nenhum gasto mapeado para o ranking</p>
              <p className="text-xs text-slate-400">Suas despesas mais expressivas aparecerão ranqueadas aqui.</p>
            </div>
          )}
        </div>

        {topCategories.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-50 text-xs text-slate-400 bg-slate-50/50 p-3 rounded-xl">
            💡 <span className="font-semibold text-slate-600">Recomendação financeira:</span> O maior custo é o principal ponto de foco. Focar esforços em negociar ou economizar 10% no maior grupo gera mais resultado que tentar cortar 100% de coisas pequenas.
          </div>
        )}
      </div>
    </div>
  );
}
