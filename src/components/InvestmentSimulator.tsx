import React, { useState, useEffect } from 'react';
import { PiggyBank, TrendingUp, Info, CalendarRange, Sparkles, Scale } from 'lucide-react';
import { formatCurrency, formatPercent } from '../financeUtils';

interface InvestmentSimulatorProps {
  totalIncome: number;
}

export default function InvestmentSimulator({ totalIncome }: InvestmentSimulatorProps) {
  // Configurable parameters
  const defaultMonthlyContribution = totalIncome > 0 ? Math.round(totalIncome * 0.1) : 500;
  
  const [initialCapital, setInitialCapital] = useState<number>(1000); // New: Capital Inicial já Investido
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(defaultMonthlyContribution);
  const [cdiPercentage, setCdiPercentage] = useState<number>(100); // e.g. 100% CDI
  const [annualCdiBase, setAnnualCdiBase] = useState<number>(10.75); // Current standard CDI in BR (e.g. 10.75%)
  const [selectedPeriod, setSelectedPeriod] = useState<'1m' | '1y' | '5y'>('1y'); // Selected period for growth projections

  // Reset monthly deposit when totalIncome changes so it initializes to 10% automatically
  useEffect(() => {
    if (totalIncome > 0) {
      setMonthlyDeposit(Math.round(totalIncome * 0.1));
    }
  }, [totalIncome]);

  // Calculations
  const calculatedNominalAnnualRate = (annualCdiBase * (cdiPercentage / 100)) / 100;
  // Convert annual rate to monthly rate using compound interest formulation: (1 + i_a)^(1/12) - 1
  const monthlyRate = Math.pow(1 + calculatedNominalAnnualRate, 1 / 12) - 1;

  // Function to calculate future value with monthly deposits (assuming deposit at start of each month)
  // FV = CapitalInicial * (1 + i)^n + d * (((1 + i)^n - 1) / i) * (1 + i)
  const calculateProjections = (months: number) => {
    if (monthlyRate <= 0) {
      const totalInvested = initialCapital + (monthlyDeposit * months);
      return {
        totalAccumulated: totalInvested,
        totalInvested,
        totalYield: 0
      };
    }

    const compoundInitial = initialCapital * Math.pow(1 + monthlyRate, months);
    const compoundDeposits = monthlyDeposit * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalAccumulated = compoundInitial + compoundDeposits;
    const totalInvested = initialCapital + (monthlyDeposit * months);
    const totalYield = Math.max(0, totalAccumulated - totalInvested);

    return {
      totalAccumulated,
      totalInvested,
      totalYield
    };
  };

  const oneMonth = calculateProjections(1);
  const oneYear = calculateProjections(12);
  const fiveYears = calculateProjections(60);

  const tenPercentOfIncome = totalIncome * 0.1;

  return (
    <div id="secao-investimento-cdi" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-xs flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              Planejamento de Investimentos (CDI 100%+)
            </h3>
            <p className="text-xs text-slate-400">
              Simule o alcance da sua independência financeira investindo 10% todo mês.
            </p>
          </div>
        </div>

        {/* Dynamic target pill */}
        {totalIncome > 0 && (
          <div className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100/50 rounded-full text-xs font-semibold text-indigo-700 animate-fadeIn">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            Meta Mensal Sugerida: {formatCurrency(tenPercentOfIncome)} (10%)
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-xs">
        
        {/* INVEST SLIDERS AND CONTROLS */}
        <div className="lg:col-span-5 space-y-6">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-200">
            <Scale className="h-4 w-4 text-emerald-600" />
            Ajustar Parâmetros da Simulação
          </h4>

          {/* New: Advanced Input + Slider for already Invested Capital (Grana já investida) up to 1 Trillion */}
          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-600">Capital Inicial já Investido</span>
              <span className="text-indigo-600 text-xs font-bold bg-indigo-50/80 px-2.5 py-0.5 rounded-lg border border-indigo-100 block max-w-[180px] truncate text-right" title={formatCurrency(initialCapital)}>
                {formatCurrency(initialCapital)}
              </span>
            </div>

            {/* Direct Number Input to easily write enormous amounts like 1 Trillion */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">R$</span>
              <input 
                id="capital-inicial-input"
                type="number"
                min="0"
                max={1000000000000} // 1 Trilion limit
                step="any"
                value={initialCapital === 0 ? '' : initialCapital}
                placeholder="0,00"
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setInitialCapital(isNaN(val) ? 0 : Math.min(1000000000000, Math.max(0, val)));
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Range slider on logarithmic/stepped feel for quick adjustment of large scales inside 0 to 10M */}
            <div className="pt-1">
              <input 
                type="range"
                min="0"
                max="10000000" // Quick range helper up to 10M
                step="1000"
                value={initialCapital > 10000000 ? 10000000 : initialCapital}
                onChange={(e) => {
                  setInitialCapital(Number(e.target.value));
                }}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Scale helper tag in words to avoid counting zeros manually */}
            {initialCapital > 0 && (
              <div className="text-[11px] text-indigo-700 bg-indigo-50/60 p-2.5 rounded-lg font-medium leading-none flex items-center justify-between">
                <span>Grandeza por extenso:</span>
                <span className="font-extrabold text-indigo-900">
                  {initialCapital < 1000 ? `${initialCapital} Reais` :
                   initialCapital < 1000000 ? `${(initialCapital / 1000).toFixed(1)} Mil` :
                   initialCapital < 1000000000 ? `${(initialCapital / 1000000).toFixed(1)} ${initialCapital >= 2000000 ? 'Milhões' : 'Milhão'}` :
                   initialCapital < 1000000000000 ? `${(initialCapital / 1000000000).toFixed(1)} ${initialCapital >= 2000000000 ? 'Bilhões' : 'Bilhão'}` :
                   `${(initialCapital / 1000000000000).toFixed(3)} ${initialCapital >= 2000000000000 ? 'Trilhões' : 'Trilhão'}`
                  }
                </span>
              </div>
            )}

            {/* Quick action buttons to set specific big metrics instantly */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              <button 
                type="button" 
                onClick={() => setInitialCapital(0)}
                className="py-1.5 text-[10px] font-bold bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-500 transition-colors cursor-pointer"
              >
                Zerou
              </button>
              <button 
                type="button" 
                onClick={() => setInitialCapital(1000000)} // 1 Milhão
                className="py-1.5 text-[10px] font-bold bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-indigo-600 rounded-lg text-indigo-500 transition-colors cursor-pointer"
                title="Configurar R$ 1 Milhão"
              >
                1M
              </button>
              <button 
                type="button" 
                onClick={() => setInitialCapital(1000000000)} // 1 Bilhão
                className="py-1.5 text-[10px] font-bold bg-indigo-50/50 border border-indigo-100 hover:bg-indigo-100 text-indigo-800 rounded-lg text-indigo-600 transition-colors cursor-pointer"
                title="Configurar R$ 1 Bilhão"
              >
                1B
              </button>
              <button 
                type="button" 
                onClick={() => setInitialCapital(1000000000000)} // 1 Trilhão
                className="py-1.5 text-[10px] font-bold bg-indigo-950/10 border border-indigo-900/20 hover:bg-indigo-950/20 text-indigo-950 rounded-lg transition-colors font-extrabold cursor-pointer"
                title="Configurar R$ 1 Trilhão máximo"
              >
                1T
              </button>
            </div>
          </div>

          {/* Slider Monthly Deposit */}
          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-600">Aporte Mensal Recorrente</span>
              <span className="text-emerald-700 text-xs font-bold bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                {formatCurrency(monthlyDeposit)}
              </span>
            </div>
            <input 
              type="range"
              min={Math.max(50, Math.round(totalIncome * 0.02) || 50)}
              max={Math.max(5000, Math.round(totalIncome * 0.8) || 5000)}
              step="50"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Mín: {formatCurrency(50)}</span>
              {totalIncome > 0 && (
                <button 
                  type="button"
                  onClick={() => setMonthlyDeposit(Math.round(tenPercentOfIncome))}
                  className="text-indigo-600 hover:text-indigo-700 hover:underline font-bold"
                >
                  Usar 10% ({formatCurrency(tenPercentOfIncome)})
                </button>
              )}
              <span>Máx: R$ 5.000</span>
            </div>
          </div>

          {/* Slider CDI Percentage */}
          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-600">Rentabilidade da Aplicação</span>
              <span className="text-indigo-600 text-xs font-bold bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                {cdiPercentage}% do CDI
              </span>
            </div>
            <input 
              type="range"
              min="100"
              max="150"
              step="5"
              value={cdiPercentage}
              onChange={(e) => setCdiPercentage(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>100% CDI (Seguro)</span>
              <span>150% do CDI</span>
            </div>
          </div>

          {/* Info Badge */}
          <div className="p-4 bg-indigo-50/50 border border-slate-200/50 rounded-xl flex gap-3 items-start text-xs text-slate-600 leading-relaxed">
            <Info className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-slate-800">Taxa Selic/CDI Estatística</p>
              <p className="text-[11px] text-slate-500">
                Baseado na taxa corrente simulada de <span className="font-semibold text-slate-700">{(annualCdiBase).toFixed(2)}% a.a.</span> Com o multiplicador de {cdiPercentage}%, a taxa nominal de sua simulação é igual a <span className="font-bold text-indigo-700">{(annualCdiBase * (cdiPercentage / 100)).toFixed(2)}% a.a.</span>
              </p>
            </div>
          </div>
        </div>

        {/* RESULTS PROJECTIONS (TABBED SINGLE PRECISE VIEW) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <CalendarRange className="h-4 w-4 text-indigo-600" />
                Projeção de Crescimento Acumulado
              </h4>
              <div className="flex bg-slate-200/60 p-1 rounded-xl self-start sm:self-auto border border-slate-200/50">
                <button
                  type="button"
                  onClick={() => setSelectedPeriod('1m')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedPeriod === '1m'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  1 Mês
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod('1y')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedPeriod === '1y'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  1 Ano
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod('5y')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedPeriod === '5y'
                      ? 'bg-indigo-650 text-white shadow-xs bg-indigo-600'
                      : 'text-slate-500 hover:text-indigo-600'
                  }`}
                >
                  5 Anos
                </button>
              </div>
            </div>
            
            <div className="min-h-[140px] flex flex-col justify-center">
              {/* 1 MONTH */}
              {selectedPeriod === '1m' && (
                <div className="bg-white border-2 border-slate-200/70 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 shadow-xs relative overflow-hidden animate-fadeIn">
                  <span className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full pointer-events-none opacity-50"></span>
                  <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-100 text-slate-650 font-bold px-2 py-0.5 rounded-md text-slate-500">Curto Prazo</span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md">1 Aporte</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Acumulado em 1 Mês</span>
                    <p className="text-3xl font-black text-slate-800 tracking-tight block truncate max-w-full" title={formatCurrency(oneMonth.totalAccumulated)}>
                      {formatCurrency(oneMonth.totalAccumulated)}
                    </p>
                  </div>

                  <div className="w-full sm:w-auto bg-slate-50/70 rounded-xl p-4.5 border border-slate-200/50 space-y-2 text-xs font-semibold min-w-[200px] relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Capital + Aporte:</span>
                      <span className="text-slate-800 font-extrabold">{formatCurrency(oneMonth.totalInvested)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-600">Rendimento Líquido:</span>
                      <span className="text-emerald-600 font-extrabold">+{formatCurrency(oneMonth.totalYield)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 1 YEAR */}
              {selectedPeriod === '1y' && (
                <div className="bg-white border-2 border-indigo-500/10 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 shadow-xs relative overflow-hidden animate-fadeIn">
                  <span className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-bl-full pointer-events-none opacity-60"></span>
                  <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md">Médio Prazo</span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md">12 Aportes</span>
                    </div>
                    <span className="text-xs font-bold text-slate-404 uppercase tracking-wider block">Acumulado em 1 Ano</span>
                    <p className="text-3xl font-black text-slate-800 tracking-tight block truncate max-w-full" title={formatCurrency(oneYear.totalAccumulated)}>
                      {formatCurrency(oneYear.totalAccumulated)}
                    </p>
                  </div>

                  <div className="w-full sm:w-auto bg-slate-50/70 rounded-xl p-4.5 border border-slate-200/50 space-y-2 text-xs font-semibold min-w-[200px] relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Total Investido:</span>
                      <span className="text-slate-800 font-extrabold">{formatCurrency(oneYear.totalInvested)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-600">Rendimento Líquido:</span>
                      <span className="text-emerald-600 font-extrabold">+{formatCurrency(oneYear.totalYield)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5 YEARS */}
              {selectedPeriod === '5y' && (
                <div className="bg-indigo-900 border border-indigo-950 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 shadow-md relative overflow-hidden text-white animate-fadeIn">
                  <span className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl pointer-events-none"></span>
                  <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md">Longo Prazo</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md">60 Aportes</span>
                    </div>
                    <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider block">Acumulado em 5 Anos</span>
                    <p className="text-3xl font-black text-white tracking-tight block truncate max-w-full" title={formatCurrency(fiveYears.totalAccumulated)}>
                      {formatCurrency(fiveYears.totalAccumulated)}
                    </p>
                  </div>

                  <div className="w-full sm:w-auto bg-white/10 rounded-xl p-4.5 border border-white/10 space-y-2 text-xs font-semibold min-w-[200px] relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-200">Total Investido:</span>
                      <span className="text-white font-extrabold">{formatCurrency(fiveYears.totalInvested)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-300">Juros Compostos:</span>
                      <span className="text-emerald-300 font-black">+{formatCurrency(fiveYears.totalYield)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ADDITIONAL METRICS DETAILS TABLE INSIDE PROJECTIONS */}
          <div className="bg-white/80 border border-slate-200 rounded-xl p-4.5 space-y-3 shadow-3xs">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Resumo Estatístico da Operação completa</h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-400 text-[10px] block uppercase">Patrimônio Inicial</span>
                <span className="text-slate-800 font-bold text-sm block truncate">{formatCurrency(initialCapital)}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-400 text-[10px] block uppercase">Aportes (5 Anos)</span>
                <span className="text-slate-800 font-bold text-sm block truncate">{formatCurrency(monthlyDeposit * 60)}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-400 text-[10px] block uppercase">Juros em 5 real</span>
                <span className="text-emerald-600 font-bold text-sm block truncate">+{formatPercent((fiveYears.totalYield / fiveYears.totalInvested) * 100)}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-400 text-[10px] block uppercase">Rendimento Líquido</span>
                <span className="text-emerald-600 font-bold text-sm block truncate">{formatCurrency(fiveYears.totalYield)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* INVESTMENT FEEDBACK AND FORMULATION */}
      <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 flex items-start gap-3 text-xs text-indigo-900 animate-fadeIn">
        <PiggyBank className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-bold">🎯 Poder do Juros Compostos ao seu favor:</p>
          <p className="text-indigo-950 text-[11px]">
            Se você poupar {formatCurrency(monthlyDeposit)} mensalmente a essa taxa, em 5 anos você terá depositado <span className="font-semibold">{formatCurrency(fiveYears.totalInvested)}</span> do próprio bolso, e o mercado de CDI terá te pago <span className="underline decoration-emerald-500 decoration-2 font-bold">{formatCurrency(fiveYears.totalYield)} apenas em juros acumualdos</span> livres de tributação! Isso acelera consideravelmente o caminho para criar sua reserva estável.
          </p>
        </div>
      </div>

    </div>
  );
}
