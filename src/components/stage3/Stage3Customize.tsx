import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Button } from '../shared/Button';
import { PriceDisplay } from '../shared/PriceDisplay';
import { ProgressBar } from '../shared/ProgressBar';
import { usePriceCalculator } from '../../hooks/usePriceCalculator';
import {
  kitchenCountertops,
  kitchenCabinetry,
  kitchenFlooring,
  kitchenAppliances,
  kitchenBacksplash,
  bathroomVanities,
  bathroomCountertops,
  bathroomFlooring,
  bathroomShowerTub,
  bathroomFixtures,
  livingFlooring,
  livingPaint,
  livingTrim,
  livingLighting,
  bedroomFlooring,
  bedroomPaint,
  bedroomClosets,
} from '../../data/mockData';

type TabType = 'kitchen' | 'bathrooms' | 'living' | 'bedrooms';

export function Stage3Customize() {
  const navigate = useNavigate();
  const { state, updateRoomCustomization, resetRoomToPackage } = useAppContext();
  const totalPrice = usePriceCalculator();
  const [activeTab, setActiveTab] = useState<TabType>('kitchen');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'bathrooms', label: 'Bathrooms' },
    { id: 'living', label: 'Living Areas' },
    { id: 'bedrooms', label: 'Bedrooms' },
  ];

  const handleContinue = () => {
    navigate('/summary');
  };

  const handleBack = () => {
    navigate('/stage3/packages');
  };

  const renderMaterialSelector = (
    label: string,
    options: any[],
    currentValue: string,
    room: string,
    field: string
  ) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => updateRoomCustomization(room, field, option.id)}
            className={`
              border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
              ${currentValue === option.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
              }
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-gray-900">{option.name}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
              <div className={`text-sm font-bold ${option.price === 0 ? 'text-green-600' : 'text-primary-600'}`}>
                {option.price === 0 ? 'Included' : `+$${option.price.toLocaleString()}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderKitchen = () => (
    <div>
      {renderMaterialSelector(
        'Countertops',
        kitchenCountertops,
        state.stage3.customizations.kitchen.countertops,
        'kitchen',
        'countertops'
      )}
      {renderMaterialSelector(
        'Cabinetry',
        kitchenCabinetry,
        state.stage3.customizations.kitchen.cabinetry,
        'kitchen',
        'cabinetry'
      )}
      {renderMaterialSelector(
        'Flooring',
        kitchenFlooring,
        state.stage3.customizations.kitchen.flooring,
        'kitchen',
        'flooring'
      )}
      {renderMaterialSelector(
        'Appliances',
        kitchenAppliances,
        state.stage3.customizations.kitchen.appliances,
        'kitchen',
        'appliances'
      )}
      {renderMaterialSelector(
        'Backsplash',
        kitchenBacksplash,
        state.stage3.customizations.kitchen.backsplash,
        'kitchen',
        'backsplash'
      )}
    </div>
  );

  const renderBathrooms = () => (
    <div>
      {renderMaterialSelector(
        'Vanity Style',
        bathroomVanities,
        state.stage3.customizations.bathrooms.vanity,
        'bathrooms',
        'vanity'
      )}
      {renderMaterialSelector(
        'Countertop Material',
        bathroomCountertops,
        state.stage3.customizations.bathrooms.countertop,
        'bathrooms',
        'countertop'
      )}
      {renderMaterialSelector(
        'Flooring',
        bathroomFlooring,
        state.stage3.customizations.bathrooms.flooring,
        'bathrooms',
        'flooring'
      )}
      {renderMaterialSelector(
        'Shower/Tub',
        bathroomShowerTub,
        state.stage3.customizations.bathrooms.showerTub,
        'bathrooms',
        'showerTub'
      )}
      {renderMaterialSelector(
        'Fixtures',
        bathroomFixtures,
        state.stage3.customizations.bathrooms.fixtures,
        'bathrooms',
        'fixtures'
      )}
    </div>
  );

  const renderLiving = () => (
    <div>
      {renderMaterialSelector(
        'Flooring Type',
        livingFlooring,
        state.stage3.customizations.living.flooring,
        'living',
        'flooring'
      )}
      {renderMaterialSelector(
        'Paint Colors',
        livingPaint,
        state.stage3.customizations.living.paint,
        'living',
        'paint'
      )}
      {renderMaterialSelector(
        'Trim Style',
        livingTrim,
        state.stage3.customizations.living.trim,
        'living',
        'trim'
      )}
      {renderMaterialSelector(
        'Lighting Fixtures',
        livingLighting,
        state.stage3.customizations.living.lighting,
        'living',
        'lighting'
      )}
    </div>
  );

  const renderBedrooms = () => (
    <div>
      {renderMaterialSelector(
        'Flooring',
        bedroomFlooring,
        state.stage3.customizations.bedrooms.flooring,
        'bedrooms',
        'flooring'
      )}
      {renderMaterialSelector(
        'Paint Colors',
        bedroomPaint,
        state.stage3.customizations.bedrooms.paint,
        'bedrooms',
        'paint'
      )}
      {renderMaterialSelector(
        'Closet Systems',
        bedroomClosets,
        state.stage3.customizations.bedrooms.closet,
        'bedrooms',
        'closet'
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'kitchen':
        return renderKitchen();
      case 'bathrooms':
        return renderBathrooms();
      case 'living':
        return renderLiving();
      case 'bedrooms':
        return renderBedrooms();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProgressBar currentStage={3} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Customize Your Interior</h1>
          <p className="text-lg text-gray-600">Select finishes for each room</p>
        </div>

        {/* Room Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-6 py-4 font-medium transition-colors whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
              <Button
                variant="outline"
                onClick={() => resetRoomToPackage(activeTab)}
              >
                Reset to Package
              </Button>
            </div>
            {renderContent()}
          </div>
        </div>

        {/* Price Display and Navigation */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg rounded-t-lg p-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <PriceDisplay price={totalPrice} />
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleBack}>
                Back to Packages
              </Button>
              <Button onClick={handleContinue}>
                Continue to Summary
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
