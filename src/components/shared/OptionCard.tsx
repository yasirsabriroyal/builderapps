interface OptionCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  features?: string[];
  imageUrl?: string;
  selected?: boolean;
  onSelect: (id: string) => void;
}

export function OptionCard({
  id,
  name,
  description,
  price,
  features,
  imageUrl,
  selected = false,
  onSelect,
}: OptionCardProps) {
  const formatPrice = (value: number) => {
    if (value === 0) return 'Included';
    return `+$${new Intl.NumberFormat('en-US').format(value)}`;
  };

  return (
    <div
      onClick={() => onSelect(id)}
      className={`
        border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
        ${selected 
          ? 'border-primary-600 bg-primary-50 shadow-lg' 
          : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
        }
      `}
    >
      {imageUrl && (
        <div className="w-full h-40 bg-gray-200 rounded-md mb-3 overflow-hidden">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <span className={`text-sm font-bold ${price === 0 ? 'text-green-600' : 'text-primary-600'}`}>
          {formatPrice(price)}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      {features && features.length > 0 && (
        <ul className="space-y-1">
          {features.map((feature, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
