import { Transaction } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    description: 'Salário Mensal CLT',
    amount: 5500.00,
    type: 'income',
    date: '2026-06-01',
    category: 'Salário'
  },
  {
    id: '2',
    description: 'Projeto Freela Design',
    amount: 800.00,
    type: 'income',
    date: '2026-06-03',
    category: 'Freelance'
  },
  {
    id: '3',
    description: 'Aluguel & Condomínio',
    amount: 1500.00,
    type: 'expense',
    date: '2026-06-02',
    category: 'Moradia'
  },
  {
    id: '4',
    description: 'Jantares e Lanches por Apps',
    amount: 1250.00,
    type: 'expense',
    date: '2026-06-04',
    category: 'Delivery'
  },
  {
    id: '5',
    description: 'Supermercado Semanal',
    amount: 450.00,
    type: 'expense',
    date: '2026-06-02',
    category: 'Alimentação'
  },
  {
    id: '6',
    description: 'Combustível e Uber',
    amount: 320.00,
    type: 'expense',
    date: '2026-06-05',
    category: 'Transporte'
  },
  {
    id: '7',
    description: 'Cinema e Barzinhos',
    amount: 280.00,
    type: 'expense',
    date: '2026-06-04',
    category: 'Lazer'
  }
];

export const INCOME_CATEGORIES = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Outros Ganhos'
];

export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Delivery',
  'Saúde',
  'Educação',
  'Outras Despesas'
];
