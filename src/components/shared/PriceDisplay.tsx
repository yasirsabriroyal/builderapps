interface PriceDisplayProps {
  price: number;
  label?: string;
  isTotal?: boolean;
}

export function PriceDisplay({ price, label = 'Current Total', isTotal = true }: PriceDisplayProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={`${isTotal ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-4 shadow-md`}>
      <div className="text-sm font-medium opacity-90">{label}</div>
      <div className="text-3xl font-bold mt-1">{formatPrice(price)}</div>
    </div>
  );
}
