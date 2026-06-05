import { AlertTriangle, CheckCircle, TrendingUp, Sparkles, Percent } from 'lucide-react';
import { FinancialAnalysis } from '../types';
import { formatPercent, formatCurrency } from '../financeUtils';

interface DiagnosisPanelProps {
  analysis: FinancialAnalysis;
}

export default function DiagnosisPanel({ analysis }: DiagnosisPanelProps) {
  const {
    savingsPercentage,
    savingsRatioText,
    bottlenecks,
    diagnosisMessage,
    diagnosisType,
    totalIncome,
    totalExpenses
  } = analysis;

  const bgColors = {
    positive: 'bg-emerald-50/70 border-emerald-100 text-emerald-900',
    warning: 'bg-amber-50/70 border-amber-100 text-amber-900',
    danger: 'bg-rose-50/70 border-rose-100 text-rose-900'
  };

  const textColors = {
    positive: 'text-emerald-700',
    warning: 'text-amber-700',
    danger: 'text-rose-700'
  };

  const icons = {
    positive: <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />,
    danger: <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0" />
  };

  return (
    <div id="diagnostico-financeiro-container" className="space-y-6">
      {/* 1. SEU DIAGNÓSTICO FINANCEIRO */}
      <div className={`rounded-2xl border p-6 ${bgColors[diagnosisType]} shadow-xs transition-all duration-300`}>
        <div className="flex items-start gap-4">
          <div className="p-1">
            {icons[diagnosisType]}
          </div>
          <div className="space-y-1 w-full">
            <h3 className="text-base font-semibold tracking-tight text-slate-900 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-500 animate-pulse" />
              Seu Diagnóstico Financeiro
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {diagnosisMessage}
            </p>
          </div>
        </div>
      </div>

      {/* 2. GANHA VS GASTA COMPARATIVE */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h3 className="text-base font-semibold tracking-tight text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-500" />
          Métrica "Ganha vs. Gasta"
        </h3>
        
        <p className="text-sm text-slate-600 mb-5 leading-relaxed">
          {savingsRatioText}
        </p>

        {/* PROGRESS BAR VISUALIZATION */}
        {totalIncome > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Gastos Convertidos ({((totalExpenses / totalIncome) * 100).toFixed(0)}%)</span>
              <span>Economia Real ({Math.max(0, savingsPercentage)}%)</span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className={`h-full transition-all duration-500 ${
                  totalExpenses > totalIncome ? 'bg-rose-500 w-full' : 'bg-rose-400'
                }`}
                style={{ width: `${Math.min(100, (totalExpenses / totalIncome) * 100)}%` }}
              />
              {totalIncome > totalExpenses && (
                <div 
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${100 - (totalExpenses / totalIncome) * 100}%` }}
                />
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span>Despesas</span>
              </div>
              {totalIncome > totalExpenses && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>Saldo Economizado</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. ALERTA DETECÇÃO DE GARGALOS */}
      {bottlenecks.length > 0 ? (
        <div id="alerta-gargalos" className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Detecção de Gargalos de Consumo
          </h4>
          
          {bottlenecks.map(b => (
            <div 
              key={b.category}
              className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 shadow-xs animate-fadeIn"
            >
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  ⚠️ Atenção: Seus gastos com <span className="underline decoration-amber-400 font-bold">{b.category}</span> estão acima da média este mês!
                </p>
                <p className="text-xs text-amber-800 mt-1">
                  A categoria responde por <span className="font-semibold">{formatPercent(b.percentageOfExpenses)}</span> de todas as suas despesas mensais, totalizando <span className="font-semibold">{formatCurrency(b.total)}</span>. O ideal recomendado por especialistas é que nenhuma categoria secundária represente mais de 30% do custo total.
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : totalExpenses > 0 ? (
        <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
          <p className="text-sm text-emerald-800 font-medium">
            Parabéns! Nenhuma categoria individual ultrapassou 30% do orçamento total das despesas. Seus gastos parecem bem distribuídos.
          </p>
        </div>
      ) : null}
    </div>
  );
}
