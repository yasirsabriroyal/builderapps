import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Button } from '../shared/Button';
import { PriceDisplay } from '../shared/PriceDisplay';
import { ProgressBar } from '../shared/ProgressBar';
import { OptionCard } from '../shared/OptionCard';
import { usePriceCalculator } from '../../hooks/usePriceCalculator';
import { landscapingPackages, finishLevels, garageOptions } from '../../data/mockData';

export function Stage2() {
  const navigate = useNavigate();
  const { state, updateStage2, setStage } = useAppContext();
  const totalPrice = usePriceCalculator();

  const handleContinue = () => {
    setStage(3);
    navigate('/stage3/packages');
  };

  const handleBack = () => {
    setStage(1);
    navigate('/stage1');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProgressBar currentStage={2} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upgrades & Enhancements</h1>
          <p className="text-lg text-gray-600">Select major upgrades and finish levels</p>
        </div>

        {/* Finished Basement */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Finished Basement</h2>
          <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add Finished Basement</h3>
              <p className="text-sm text-gray-600">Complete living space with flooring, walls, and utilities</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-primary-600">+$45,000</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.stage2.finishedBasement}
                  onChange={(e) => updateStage2({ finishedBasement: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Landscaping Package */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Landscaping Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {landscapingPackages.map((pkg) => (
              <OptionCard
                key={pkg.id}
                {...pkg}
                selected={state.stage2.landscapingPackage === pkg.id}
                onSelect={(id) => updateStage2({ landscapingPackage: id as any })}
              />
            ))}
          </div>
        </section>

        {/* Overall Finish Level */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overall Finish Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {finishLevels.map((level) => (
              <OptionCard
                key={level.id}
                {...level}
                selected={state.stage2.finishLevel === level.id}
                onSelect={(id) => updateStage2({ finishLevel: id as any })}
              />
            ))}
          </div>
        </section>

        {/* Garage Options */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Garage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {garageOptions.map((garage) => (
              <OptionCard
                key={garage.id}
                {...garage}
                selected={state.stage2.garage === garage.id}
                onSelect={(id) => updateStage2({ garage: id })}
              />
            ))}
          </div>
        </section>

        {/* Additional Upgrades */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Upgrades</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Deck/Patio</h3>
                <p className="text-sm text-gray-600">Outdoor entertainment space</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-primary-600">+$12,000</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.stage2.deckPatio}
                    onChange={(e) => updateStage2({ deckPatio: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Smart Home Pre-wiring</h3>
                <p className="text-sm text-gray-600">Ready for smart home devices</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-primary-600">+$8,000</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.stage2.smartHome}
                    onChange={(e) => updateStage2({ smartHome: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Energy Efficiency Upgrades</h3>
                <p className="text-sm text-gray-600">Enhanced insulation and HVAC</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-primary-600">+$15,000</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.stage2.energyEfficiency}
                    onChange={(e) => updateStage2({ energyEfficiency: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Price Display and Navigation */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg rounded-t-lg p-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <PriceDisplay price={totalPrice} />
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleContinue}>
                Continue to Interior
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
