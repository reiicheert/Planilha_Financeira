import { useState, useMemo } from 'react';
import { 
  Trash2, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  RotateCcw, 
  AlertCircle,
  FileMinus
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency } from '../financeUtils';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../mockData';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onResetMockData: () => void;
  onClearAll: () => void;
}

export default function TransactionList({
  transactions,
  onDeleteTransaction,
  onResetMockData,
  onClearAll
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Format date helper (YYYY-MM-DD -> DD/MM/YYYY)
  const formatDateString = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // Get unique categories active in current transactions to populate dynamic filter
  const activeCategories = useMemo(() => {
    const list = new Set<string>();
    transactions.forEach(t => list.add(t.category));
    return Array.from(list).sort();
  }, [transactions]);

  // Combined Search & Filter Logic
  const filteredTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)) // Sort latest date first
      .filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              t.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = typeFilter === 'all' ? true : t.type === typeFilter;
        
        const matchesCategory = selectedCategory === 'all' ? true : t.category === selectedCategory;

        return matchesSearch && matchesType && matchesCategory;
      });
  }, [transactions, searchTerm, typeFilter, selectedCategory]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
      
      {/* 1. HEADER WITH ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900">
            Histórico de Lançamentos
          </h3>
          <p className="text-xs text-slate-400">
            Visualize, filtre e gerencie todas as transações cadastradas.
          </p>
        </div>

        {/* UTILITIES: Reset and Clear */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetMockData}
            title="Recarregar Dados Demo"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Resetar Demo
          </button>
          <button
            onClick={onClearAll}
            title="Limpar Tudo de Vez"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-200 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-50 transition-colors"
          >
            <FileMinus className="h-3.5 w-3.5" />
            Limpar Todos
          </button>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100/50">
        
        {/* Search input */}
        <div className="relative md:col-span-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Pesquisar por descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
        </div>

        {/* Type selector */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e: any) => setTypeFilter(e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">Filtro: Todos</option>
            <option value="income">Apenas Receitas</option>
            <option value="expense">Apenas Despesas</option>
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Filter className="h-3 w-3" />
          </div>
        </div>

        {/* Category selector */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">Categoria: Todas</option>
            {activeCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Filter className="h-3 w-3" />
          </div>
        </div>

      </div>

      {/* 3. TRANSACTION RENDERER (RESPONSIVE FEED VS TABULAR) */}
      {filteredTransactions.length > 0 ? (
        <div className="space-y-4">
          
          {/* A. MOBILE VIEW (Cards display) - Hidden on medium+ screens */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredTransactions.map(t => {
              const isIncome = t.type === 'income';
              return (
                <div 
                  key={t.id}
                  className={`p-4 rounded-xl border bg-white flex flex-col justify-between gap-3 shadow-xs hover:border-slate-200 transition-all ${
                    isIncome ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-rose-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 mb-1.5">
                        {t.category}
                      </span>
                      <h4 className="font-semibold text-slate-800 text-sm leading-snug">
                        {t.description}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {formatDateString(t.date)}
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteTransaction(t.id)}
                      className="p-1 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Excluir Lançamento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <span className="text-xs text-slate-400">Fluxo</span>
                    <span className={`text-base font-bold ${
                      isIncome ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {isIncome ? '+' : '-'} {formatCurrency(t.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* B. DESKTOP VIEW (Tabular layout) - Hidden on mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 text-left uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4 rounded-l-lg">Fluxo</th>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                  <th className="py-3 px-4 text-center rounded-r-lg w-16">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {filteredTransactions.map(t => {
                  const isIncome = t.type === 'income';
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                      {/* Flow status icon */}
                      <td className="py-3.5 px-4">
                        <div className="flex">
                          {isIncome ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <ArrowUpRight className="h-3 w-3" /> Receita
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                              <ArrowDownRight className="h-3 w-3" /> Despesa
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 text-slate-900 font-semibold max-w-xs truncate">
                        {t.description}
                      </td>

                      {/* Category badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">
                          {t.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 text-xs text-nowrap">
                        {formatDateString(t.date)}
                      </td>

                      {/* Amount */}
                      <td className={`py-3.5 px-4 text-right font-bold text-nowrap ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {isIncome ? '+' : '-'} {formatCurrency(t.amount)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onDeleteTransaction(t.id)}
                          className="opacity-60 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all duration-150"
                          title="Excluir lançamento"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/20 text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-slate-300" />
          <h4 className="text-sm font-semibold text-slate-800">Nenhum lançamento corresponde aos filtros</h4>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Tente readequar seu termo de busca ou mude os seletores ativos. Alternativamente, resete os dados clicando em "Resetar Demo".
          </p>
        </div>
      )}

      {/* FOOTER COUNT */}
      <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-50 font-semibold">
        <span>Mostrando {filteredTransactions.length} de {transactions.length} transações</span>
        <span>Filtrado por: {typeFilter === 'all' ? 'Tudo' : typeFilter === 'income' ? 'Receitas' : 'Despesas'}</span>
      </div>

    </div>
  );
}
