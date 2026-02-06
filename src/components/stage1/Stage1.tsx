import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Button } from '../shared/Button';
import { PriceDisplay } from '../shared/PriceDisplay';
import { ProgressBar } from '../shared/ProgressBar';
import { usePriceCalculator } from '../../hooks/usePriceCalculator';
import type { BudgetRange, HomeType } from '../../types';

export function Stage1() {
  const navigate = useNavigate();
  const { state, updateStage1, setStage } = useAppContext();
  const totalPrice = usePriceCalculator();

  const budgetRanges: { id: BudgetRange; label: string }[] = [
    { id: '200-300', label: '$200K - $300K' },
    { id: '300-400', label: '$300K - $400K' },
    { id: '400-500', label: '$400K - $500K' },
    { id: '500+', label: '$500K+' },
  ];

  const homeTypes: { id: HomeType; name: string; description: string }[] = [
    { id: 'single-family', name: 'Single-Family Home', description: 'Traditional standalone home' },
    { id: 'duplex', name: 'Duplex', description: 'Two units side by side' },
    { id: 'townhouse', name: 'Townhouse', description: 'Multi-story attached home' },
    { id: 'custom', name: 'Custom', description: 'Unique design options' },
  ];

  const isFormValid = () => {
    return state.stage1.budgetRange !== null && state.stage1.homeType !== null;
  };

  const handleContinue = () => {
    if (isFormValid()) {
      setStage(2);
      navigate('/stage2');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProgressBar currentStage={1} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Foundation</h1>
          <p className="text-lg text-gray-600">Let's start with the basics of your dream home</p>
        </div>

        {/* Budget Range Selection */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Budget Range</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {budgetRanges.map((range) => (
              <div
                key={range.id}
                onClick={() => updateStage1({ budgetRange: range.id })}
                className={`
                  border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 text-center
                  ${state.stage1.budgetRange === range.id
                    ? 'border-primary-600 bg-primary-50 shadow-lg'
                    : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                  }
                `}
              >
                <div className="text-xl font-bold text-gray-900">{range.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Home Type Selection */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Home Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {homeTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => updateStage1({ homeType: type.id })}
                className={`
                  border-2 rounded-lg p-6 cursor-pointer transition-all duration-200
                  ${state.stage1.homeType === type.id
                    ? 'border-primary-600 bg-primary-50 shadow-lg'
                    : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                  }
                `}
              >
                <div className="h-32 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                  <span className="text-4xl">🏠</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Room Count */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Room Count</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                value={state.stage1.bedrooms}
                onChange={(e) => updateStage1({ bedrooms: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                    {num > 3 && ` (+$${((num - 3) * 12000).toLocaleString()})`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <select
                value={state.stage1.bathrooms}
                onChange={(e) => updateStage1({ bathrooms: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {[1, 1.5, 2, 2.5, 3, 3.5, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
                    {num > 2 && ` (+$${(Math.floor(num - 2) * 15000).toLocaleString()})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Price Display and Navigation */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg rounded-t-lg p-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <PriceDisplay price={totalPrice} />
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!isFormValid()}
              >
                Continue to Upgrades
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
