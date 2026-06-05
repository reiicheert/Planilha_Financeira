export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
}

export interface CategorySummary {
  category: string;
  total: number;
  percentageOfExpenses: number;
  isBottleneck: boolean;
}

export interface FinancialAnalysis {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  savingsPercentage: number;
  savingsRatioText: string;
  bottlenecks: CategorySummary[];
  topCategories: CategorySummary[];
  diagnosisMessage: string;
  diagnosisType: 'positive' | 'warning' | 'danger';
}
