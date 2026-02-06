import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Button } from '../components/shared/Button';
import { usePriceCalculator } from '../hooks/usePriceCalculator';
import {
  designPackages,
  garageOptions,
} from '../data/mockData';

export function SummaryPage() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const totalPrice = usePriceCalculator();

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getHomeTypeName = () => {
    const types: Record<string, string> = {
      'single-family': 'Single-Family Home',
      'duplex': 'Duplex',
      'townhouse': 'Townhouse',
      'custom': 'Custom',
    };
    return state.stage1.homeType ? types[state.stage1.homeType] : '';
  };

  const getBudgetRangeLabel = () => {
    const ranges: Record<string, string> = {
      '200-300': '$200K - $300K',
      '300-400': '$300K - $400K',
      '400-500': '$400K - $400K',
      '500+': '$500K+',
    };
    return state.stage1.budgetRange ? ranges[state.stage1.budgetRange] : '';
  };

  const getDesignPackageName = () => {
    const pkg = designPackages.find(p => p.id === state.stage3.designPackage);
    return pkg?.name || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Dream Home Design</h1>
          <p className="text-lg text-gray-600">Review your selections and estimated price</p>
        </div>

        {/* Total Price */}
        <div className="bg-primary-600 text-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center">
            <div className="text-xl font-medium mb-2">Estimated Total Price</div>
            <div className="text-5xl font-bold">{formatPrice(totalPrice)}</div>
            <p className="mt-4 text-primary-100">
              This is an estimate. Final pricing will be confirmed by our design team.
            </p>
          </div>
        </div>

        {/* Stage 1 Summary */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Foundation</h2>
            <Button variant="outline" onClick={() => navigate('/stage1')}>
              Edit
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Budget Range</div>
              <div className="text-lg font-semibold text-gray-900">{getBudgetRangeLabel()}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Home Type</div>
              <div className="text-lg font-semibold text-gray-900">{getHomeTypeName()}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Bedrooms</div>
              <div className="text-lg font-semibold text-gray-900">{state.stage1.bedrooms}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Bathrooms</div>
              <div className="text-lg font-semibold text-gray-900">{state.stage1.bathrooms}</div>
            </div>
          </div>
        </section>

        {/* Stage 2 Summary */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Upgrades & Enhancements</h2>
            <Button variant="outline" onClick={() => navigate('/stage2')}>
              Edit
            </Button>
          </div>
          <div className="space-y-3">
            {state.stage2.finishedBasement && (
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900">Finished Basement</span>
                <span className="text-primary-600 font-semibold">+$45,000</span>
              </div>
            )}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">Landscaping Package</span>
              <span className="text-gray-900 font-semibold capitalize">
                {state.stage2.landscapingPackage}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">Finish Level</span>
              <span className="text-gray-900 font-semibold capitalize">
                {state.stage2.finishLevel}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">Garage</span>
              <span className="text-gray-900 font-semibold">
                {garageOptions.find(g => g.id === state.stage2.garage)?.name}
              </span>
            </div>
            {state.stage2.deckPatio && (
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900">Deck/Patio</span>
                <span className="text-primary-600 font-semibold">+$12,000</span>
              </div>
            )}
            {state.stage2.smartHome && (
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900">Smart Home Pre-wiring</span>
                <span className="text-primary-600 font-semibold">+$8,000</span>
              </div>
            )}
            {state.stage2.energyEfficiency && (
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900">Energy Efficiency Upgrades</span>
                <span className="text-primary-600 font-semibold">+$15,000</span>
              </div>
            )}
          </div>
        </section>

        {/* Stage 3 Summary */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Interior Finishes</h2>
            <Button variant="outline" onClick={() => navigate('/stage3/packages')}>
              Edit
            </Button>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Design Package</div>
            <div className="text-lg font-semibold text-gray-900">{getDesignPackageName()}</div>
            {state.stage3.isCustomized && (
              <div className="mt-2 text-sm text-primary-600">
                ✓ With custom room-by-room selections
              </div>
            )}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                alert('Your design has been saved! In a real app, this would save to a database.');
              }}
            >
              Save Design
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                alert('In a real app, this would generate a shareable link or PDF.');
              }}
            >
              Share Design
            </Button>
            <Button
              onClick={() => {
                alert('Thank you! Your design has been submitted to our design center team. We will contact you soon!');
              }}
            >
              Submit to Design Center
            </Button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => navigate('/')}>
            Start New Design
          </Button>
        </div>
      </div>
    </div>
  );
}
