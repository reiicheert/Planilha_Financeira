import { Transaction, FinancialAnalysis, CategorySummary } from './types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    maximumFractionDigits: 1
  }).format(value / 100);
}

export function calculateAnalysis(transactions: Transaction[]): FinancialAnalysis {
  let totalIncome = 0;
  let totalExpenses = 0;

  // 1. Calculate Totals
  transactions.forEach(t => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpenses += t.amount;
    }
  });

  const netBalance = totalIncome - totalExpenses;
  
  // Savings percentage based on Net Income
  let savingsPercentage = 0;
  if (totalIncome > 0) {
    savingsPercentage = Math.round((netBalance / totalIncome) * 100);
  }

  // 2. Map of expenses by category
  const expenseByCategoryMap: { [category: string]: number } = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      expenseByCategoryMap[t.category] = (expenseByCategoryMap[t.category] || 0) + t.amount;
    }
  });

  // Calculate summaries
  const allCategorySummaries: CategorySummary[] = Object.keys(expenseByCategoryMap).map(category => {
    const total = expenseByCategoryMap[category];
    const percentageOfExpenses = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
    // Bottleneck checking: more than 30% of total expenses
    const isBottleneck = percentageOfExpenses > 30;

    return {
      category,
      total,
      percentageOfExpenses,
      isBottleneck
    };
  });

  // Sort by highest spending first
  const sortedCategories = [...allCategorySummaries].sort((a, b) => b.total - a.total);
  
  // Top 3 categories
  const topCategories = sortedCategories.slice(0, 3);

  // Bottlenecks
  const bottlenecks = allCategorySummaries.filter(item => item.isBottleneck);

  // Comparative string text (e.g. "Ganhou R$ X e gastou R$ Y. Você economizou Z% da renda.")
  let savingsRatioText = '';
  if (totalIncome > 0 && totalExpenses > 0) {
    if (netBalance >= 0) {
      savingsRatioText = `Este mês você ganhou ${formatCurrency(totalIncome)} e gastou ${formatCurrency(totalExpenses)}. Você economizou ${savingsPercentage}% da sua renda total.`;
    } else {
      savingsRatioText = `Este mês você ganhou ${formatCurrency(totalIncome)} e gastou ${formatCurrency(totalExpenses)}. Suas despesas excederam seus ganhos em ${formatPercent(Math.abs(savingsPercentage))}.`;
    }
  } else if (totalIncome > 0) {
    savingsRatioText = `Você recebeu um total de ${formatCurrency(totalIncome)} este mês e ainda não cadastrou despesas. Excelente taxa de 100% de economia!`;
  } else if (totalExpenses > 0) {
    savingsRatioText = `Você cadastrou ${formatCurrency(totalExpenses)} em despesas mas não registrou receitas ainda. Sua taxa de déficit é de 100%.`;
  } else {
    savingsRatioText = 'Adicione transações de receitas e despesas para ver a métrica comparativa de rendimentos.';
  }

  // 3. Dynamic Financial Diagnosis
  let diagnosisMessage = '';
  let diagnosisType: 'positive' | 'warning' | 'danger' = 'warning';

  if (transactions.length === 0) {
    diagnosisMessage = 'Nenhum lançamento registrado este mês. Adicione suas primeiras receitas e despesas abaixo para gerar seu diagnóstico financeiro instantâneo!';
    diagnosisType = 'warning';
  } else if (totalIncome === 0 && totalExpenses > 0) {
    diagnosisMessage = '⚠️ Crítico: Você está registrando despesas sem nenhuma receita mapeada. Lembre-se de registrar seu salário, freelas ou outros proventos para equilibrar as contas.';
    diagnosisType = 'danger';
  } else if (totalExpenses === 0 && totalIncome > 0) {
    diagnosisMessage = '🌱 Excelente! Você começou o mês com o pé direito recebendo novas receitas e sem nenhuma dívida contraída até o momento. Mantenha esse pique!';
    diagnosisType = 'positive';
  } else if (netBalance < 0) {
    diagnosisMessage = `🚨 Alerta Vermelho: Você está operando com saldo negativo de ${formatCurrency(Math.abs(netBalance))}! Suas despesas superaram seus ganhos. É urgente rever custos, com foco especial nas despesas de maior impacto como ${topCategories.length > 0 ? topCategories[0].category : 'suas despesas principais'}.`;
    diagnosisType = 'danger';
  } else {
    // We saved money. Let's look at saving level
    if (savingsPercentage < 10) {
      diagnosisMessage = `⚠️ Atenção: Você poupou apenas ${savingsPercentage}% da sua renda total este mês (${formatCurrency(netBalance)} restante). Especialistas recomendam poupar no mínimo 10% a 20% para formar sua reserva de emergência e investir para o futuro.`;
      diagnosisType = 'warning';
    } else if (savingsPercentage >= 10 && savingsPercentage <= 30) {
      diagnosisMessage = `👍 Bom Trabalho! Você conseguiu manter o orçamento em equilíbrio e poupar ${savingsPercentage}% da sua renda total (${formatCurrency(netBalance)} líquido). Continue com essa disciplina financeira saudável!`;
      diagnosisType = 'positive';
    } else {
      diagnosisMessage = `🏆 Gestão Espetacular! Você poupou incríveis ${savingsPercentage}% da sua renda este mês (${formatCurrency(netBalance)} líquido guardado). Você está em um patamar financeiro excelente e com grande aceleração para conquistar seus objetivos de longo prazo!`;
      diagnosisType = 'positive';
    }
  }

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    savingsPercentage,
    savingsRatioText,
    bottlenecks,
    topCategories,
    diagnosisMessage,
    diagnosisType
  };
}
