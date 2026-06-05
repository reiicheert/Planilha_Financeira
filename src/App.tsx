/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  User, 
  Layers, 
  PiggyBank, 
  Coins, 
  HelpCircle,
  Smartphone,
  Monitor
} from 'lucide-react';
import { Transaction } from './types';
import { INITIAL_TRANSACTIONS } from './mockData';
import { calculateAnalysis } from './financeUtils';

// Import components
import SummaryCards from './components/SummaryCards';
import DiagnosisPanel from './components/DiagnosisPanel';
import ChartsAndMetrics from './components/ChartsAndMetrics';
import InvestmentSimulator from './components/InvestmentSimulator';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

const STORAGE_KEY = 'finance_diagnostico_transactions';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTransactions(JSON.parse(stored));
      } else {
        // Seed with initial mock data
        setTransactions(INITIAL_TRANSACTIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      }
    } catch (e) {
      console.error('Failed to load transactions', e);
      setTransactions(INITIAL_TRANSACTIONS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to LocalStorage whenever updated
  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTransactions));
    } catch (e) {
      console.error('Failed to save transactions', e);
    }
  };

  // Add new transaction
  const handleAddTransaction = (newT: Omit<Transaction, 'id'>) => {
    const transactionWithId: Transaction = {
      ...newT,
      id: Date.now().toString()
    };
    const updated = [transactionWithId, ...transactions];
    saveTransactions(updated);
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    saveTransactions(updated);
  };

  // Reset to original mock data (Saves time and lets user see alerts again instantly)
  const handleResetMockData = () => {
    if (confirm('Tem certeza que deseja restaurar as transações de exemplo? Seus lançamentos atuais serão substituídos.')) {
      saveTransactions(INITIAL_TRANSACTIONS);
    }
  };

  // Clear all data
  const handleClearAll = () => {
    if (confirm('Atenção: quer limpar todos os seus lançamentos de vez?')) {
      saveTransactions([]);
    }
  };

  // Dynamic analysis computation using useMemo (perfect performance, no infinite loop)
  const analysis = useMemo(() => {
    return calculateAnalysis(transactions);
  }, [transactions]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Iniciando Diagnóstico...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="home-dashboard-wrapper" className="min-h-screen bg-slate-50 font-sans text-slate-700">
      
      {/* 1. UPPER SAAS HEADER BANNER */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-100 flex items-center justify-center">
              <PiggyBank className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                  Finances & Diagnóstico
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100/30 uppercase tracking-widest">
                  Especialista
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium hidden sm:block">
                Controle pessoal de despesas com detecção automática de gargalos
              </p>
            </div>
          </div>

          {/* User profile & preview view selector decoration */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Aparelho Responsivo (Web/Móvel)
            </div>

            <div className="flex items-center gap-2.5 border-l border-slate-100 pl-4">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                F
              </div>
              <div className="hidden md:block">
                <span className="text-xs font-semibold text-slate-700 block leading-tight">Financista Expert</span>
                <span className="text-[10px] text-slate-400 block leading-none">simetrareichert@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BODY WORKSPACE CORES */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* BANNER INFORMATIVE WELCOME */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-lg shadow-slate-900/10">
          {/* Back glows for design */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-indigo-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              SaaS Advisor Inteligente Ativo
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Seu Diagnóstico Financeiro Em Tempo Real
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Diferente de planilhas comuns, este painel analisa ativamente se suas despesas superam seus ganhos e monitora se categorias específicas ultrapassam a margem ideal de segurança de <span className="font-semibold text-indigo-300">30% do orçamento</span>.
            </p>
          </div>
        </div>

        {/* 3. IMPACT STATE METRICS CARDS */}
        <SummaryCards 
          totalIncome={analysis.totalIncome}
          totalExpenses={analysis.totalExpenses}
          netBalance={analysis.netBalance}
        />

        {/* 4. MAIN DOUBLE COLUMN STRUCTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT 2/3 COLUMN: Diagnostics, charts, graphs and listings */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Diagnosis visual box */}
            <DiagnosisPanel analysis={analysis} />

            {/* Visual Charts and Podium of expenses */}
            <ChartsAndMetrics analysis={analysis} />

            {/* Simulated target investment planner */}
            <InvestmentSimulator totalIncome={analysis.totalIncome} />

            {/* Complete table-grid lists */}
            <TransactionList 
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              onResetMockData={handleResetMockData}
              onClearAll={handleClearAll}
            />

          </div>

          {/* RIGHT 1/3 COLUMN: Form creation and fast utilities */}
          <div className="space-y-6">
            
            {/* Quick adding form */}
            <TransactionForm onAddTransaction={handleAddTransaction} />

            {/* Financial expert advice tips widget */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl border border-indigo-950 p-6 text-white space-y-4 shadow-sm">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-indigo-300 font-bold uppercase tracking-wider">
                Dicas de Especialista
              </span>
              
              <h4 className="text-sm font-bold text-slate-100">
                Como equilibrar as contas?
              </h4>

              <ul className="space-y-3.5 text-xs text-slate-300 leading-normal">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <span>
                    <strong>Planeje 50-30-20:</strong> Dedique 50% para necessidades básicas, 30% para desejos pessoais e 20% para poupar/investir.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <span>
                    <strong>Monitore os pequenos ralos:</strong> Custos frequentes com aplicativos de transporte e comida ("Delivery") acumulam imensamente rápido.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <span>
                    <strong>Crie amortecedores:</strong> Busque manter uma reserva equivalente a 3 ou 6 meses de suas despesas correntes antes de novos passos.
                  </span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 space-y-2">
          <p className="font-semibold">
            Controle e Diagnóstico Financeiro Pessoal — Modelo Responsivo SaaS
          </p>
          <p>
            Desenvolvido com robustez e persistência instantânea no LocalStorage. © {new Date().getFullYear()} Finances Specialist.
          </p>
        </div>
      </footer>

    </div>
  );
}
