export const formatCurrency = (amount: number | null) => {
  const value = amount || 0;
  // つまりvalueは、引数のamountの数字又は０。これをformatしてリターンするヘルパー関数
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function formatQuantity(quantity: number, noun: string): string {
  return quantity === 1 ? `${quantity} ${noun}` : `${quantity} ${noun}s`;
}