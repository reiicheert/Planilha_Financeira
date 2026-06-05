import React, { useState, useEffect } from 'react';
import { PlusCircle, ArrowUpRight, ArrowDownRight, Calendar, Tag, FileText, DollarSign } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../mockData';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  // Get current date string formatted as YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Reset category options whenever type changes
  useEffect(() => {
    if (type === 'income') {
      setCategory(INCOME_CATEGORIES[0]);
    } else {
      setCategory(EXPENSE_CATEGORIES[0]);
    }
  }, [type]);

  // Set today's date initially
  useEffect(() => {
    setDate(getTodayString());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      alert('Por favor, informe uma descrição para o lançamento!');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Por favor, informe um valor numérico válido e maior que zero!');
      return;
    }

    if (!date) {
      alert('Por favor, selecione uma data válida!');
      return;
    }

    onAddTransaction({
      description: description.trim(),
      amount: parsedAmount,
      type,
      category,
      date
    });

    // Reset inputs but keep date and type for consecutive fast additions
    setDescription('');
    setAmount('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <PlusCircle className="h-5 w-5 text-indigo-500" />
        <h3 className="text-base font-semibold tracking-tight text-slate-900">
          Novo Lançamento
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. SELETOR DE TIPO (RECEITA VS DESPESA) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all duration-150 ${
              type === 'expense'
                ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowDownRight className="h-4 w-4 shrink-0" />
            Despesa / Gasto
          </button>
          
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all duration-150 ${
              type === 'income'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowUpRight className="h-4 w-4 shrink-0" />
            Receita / Ganho
          </button>
        </div>

        {/* 2. VALOR & DESCRIÇÃO */}
        <div className="space-y-4">
          {/* Campo Valor */}
          <div className="space-y-1.5">
            <label htmlFor="amount-input" className="text-xs font-semibold text-slate-500 block">
              Valor (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                R$
              </span>
              <input
                id="amount-input"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Campo Descrição */}
          <div className="space-y-1.5">
            <label htmlFor="desc-input" className="text-xs font-semibold text-slate-500 block">
              Descrição do Lançamento
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <FileText className="h-4 w-4" />
              </span>
              <input
                id="desc-input"
                type="text"
                maxLength={60}
                placeholder="Ex: Assinatura Netflix, Conta de Luz, Uber"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* 3. CATEGORIA & DATA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="category-select" className="text-xs font-semibold text-slate-500 block">
              Categoria
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Tag className="h-4 w-4" />
              </span>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                {type === 'income' 
                  ? INCOME_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)
                  : EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)
                }
              </select>
              {/* Arrow Indicator for Custom Select */}
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="date-input" className="text-xs font-semibold text-slate-500 block">
              Data
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Calendar className="h-4 w-4" />
              </span>
              <input
                id="date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* 4. MAIN ACTION SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
        >
          Salvar Lançamento
        </button>
      </form>
    </div>
  );
}
