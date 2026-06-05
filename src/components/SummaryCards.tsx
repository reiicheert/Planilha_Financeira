import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { formatCurrency } from '../financeUtils';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

export default function SummaryCards({ totalIncome, totalExpenses, netBalance }: SummaryCardsProps) {
  const isPositive = netBalance >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* CARD 1: RECEITAS */}
      <div 
        id="card-receitas-totais"
        className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-500">Receitas Totais</span>
          <div className="p-2 border border-emerald-50 bg-emerald-50 rounded-lg text-emerald-600">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {formatCurrency(totalIncome)}
        </div>
        <div className="mt-2 text-xs text-slate-400">
          Total de entradas registradas
        </div>
      </div>

      {/* CARD 2: DESPESAS */}
      <div 
        id="card-despesas-totais"
        className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-500">Despesas Totais</span>
          <div className="p-2 border border-rose-50 bg-rose-50 rounded-lg text-rose-600">
            <ArrowDownRight className="h-5 w-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {formatCurrency(totalExpenses)}
        </div>
        <div className="mt-2 text-xs text-rose-500 font-medium">
          {totalIncome > 0 
            ? `${((totalExpenses / totalIncome) * 100).toFixed(0)}% do ganho consumido` 
            : 'Nenhuma receita registrada'}
        </div>
      </div>

      {/* CARD 3: SALDO LÍQUIDO */}
      <div 
        id="card-saldo-liquido"
        className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${
          isPositive ? 'border-emerald-100' : 'border-rose-100'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-500">Saldo Líquido</span>
          <div className={`p-2 rounded-lg ${
            isPositive ? 'bg-emerald-50 border border-emerald-50 text-emerald-600' : 'bg-rose-50 border border-rose-50 text-rose-600'
          }`}>
            <Wallet className="h-5 w-5" />
          </div>
        </div>
        <div className={`text-2xl font-bold tracking-tight ${
          isPositive ? 'text-emerald-600' : 'text-rose-600'
        }`}>
          {formatCurrency(netBalance)}
        </div>
        <div className="mt-2 text-xs text-slate-400">
          {isPositive ? 'Saldaço positivo na conta' : 'Déficit no orçamento mensal'}
        </div>
      </div>
    </div>
  );
}
