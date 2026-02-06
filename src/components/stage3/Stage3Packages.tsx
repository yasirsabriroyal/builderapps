import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Button } from '../shared/Button';
import { PriceDisplay } from '../shared/PriceDisplay';
import { ProgressBar } from '../shared/ProgressBar';
import { OptionCard } from '../shared/OptionCard';
import { usePriceCalculator } from '../../hooks/usePriceCalculator';
import { designPackages } from '../../data/mockData';

export function Stage3Packages() {
  const navigate = useNavigate();
  const { state, updateStage3, setStage } = useAppContext();
  const totalPrice = usePriceCalculator();

  const handleSelectPackage = (packageId: string) => {
    updateStage3({ designPackage: packageId as any, isCustomized: false });
  };

  const handleCustomize = () => {
    if (state.stage3.designPackage) {
      navigate('/stage3/customize');
    }
  };

  const handleContinue = () => {
    navigate('/summary');
  };

  const handleBack = () => {
    setStage(2);
    navigate('/stage2');
  };

  const isPackageSelected = state.stage3.designPackage !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProgressBar currentStage={3} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interior Design Packages</h1>
          <p className="text-lg text-gray-600">Choose a design style or customize room by room</p>
        </div>

        {/* Design Packages */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Select Your Style</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {designPackages.map((pkg) => (
              <OptionCard
                key={pkg.id}
                {...pkg}
                selected={state.stage3.designPackage === pkg.id}
                onSelect={handleSelectPackage}
              />
            ))}
          </div>
        </section>

        {/* Customization Option */}
        {isPackageSelected && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Want More Control?</h2>
              <p className="text-gray-600 mb-4">
                Customize your selections room by room to create a truly unique home
              </p>
              <Button variant="outline" onClick={handleCustomize}>
                Customize Package
              </Button>
            </div>
          </section>
        )}

        {/* Price Display and Navigation */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg rounded-t-lg p-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <PriceDisplay price={totalPrice} />
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleContinue} disabled={!isPackageSelected}>
                Continue to Summary
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
