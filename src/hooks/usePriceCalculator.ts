import { useEffect, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { 
  homeTypePrices, 
  roomPrices, 
  upgradePrices, 
  landscapingPackages,
  finishLevels,
  designPackages,
  garageOptions,
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
} from '../data/mockData';

export function usePriceCalculator() {
  const { state, updatePrice } = useAppContext();

  const calculatedPrice = useMemo(() => {
    let total = 0;

    // Stage 1: Base price
    if (state.stage1.homeType) {
      total += homeTypePrices[state.stage1.homeType] || 0;
    }

    // Add bedroom price (above 3 bedrooms)
    if (state.stage1.bedrooms > 3) {
      total += (state.stage1.bedrooms - 3) * roomPrices.bedroom;
    }

    // Add bathroom price (above 2 bathrooms)
    if (state.stage1.bathrooms > 2) {
      total += (state.stage1.bathrooms - 2) * roomPrices.bathroom;
    }

    // Stage 2: Upgrades
    if (state.stage2.finishedBasement) {
      total += upgradePrices.finishedBasement;
    }

    if (state.stage2.deckPatio) {
      total += upgradePrices.deckPatio;
    }

    if (state.stage2.smartHome) {
      total += upgradePrices.smartHome;
    }

    if (state.stage2.energyEfficiency) {
      total += upgradePrices.energyEfficiency;
    }

    // Landscaping package
    const landscaping = landscapingPackages.find(p => p.id === state.stage2.landscapingPackage);
    if (landscaping) {
      total += landscaping.price;
    }

    // Finish level
    const finishLevel = finishLevels.find(f => f.id === state.stage2.finishLevel);
    if (finishLevel) {
      total += finishLevel.price;
    }

    // Garage
    const garage = garageOptions.find(g => g.id === state.stage2.garage);
    if (garage) {
      total += garage.price;
    }

    // Stage 3: Design package
    if (state.stage3.designPackage) {
      const designPkg = designPackages.find(p => p.id === state.stage3.designPackage);
      if (designPkg) {
        total += designPkg.price;
      }
    }

    // Stage 3: Custom room selections (if customized)
    if (state.stage3.isCustomized) {
      // Kitchen customizations
      const kitchenCountertop = kitchenCountertops.find(c => c.id === state.stage3.customizations.kitchen.countertops);
      if (kitchenCountertop) total += kitchenCountertop.price;

      const kitchenCab = kitchenCabinetry.find(c => c.id === state.stage3.customizations.kitchen.cabinetry);
      if (kitchenCab) total += kitchenCab.price;

      const kitchenFloor = kitchenFlooring.find(f => f.id === state.stage3.customizations.kitchen.flooring);
      if (kitchenFloor) total += kitchenFloor.price;

      const kitchenApp = kitchenAppliances.find(a => a.id === state.stage3.customizations.kitchen.appliances);
      if (kitchenApp) total += kitchenApp.price;

      const kitchenBack = kitchenBacksplash.find(b => b.id === state.stage3.customizations.kitchen.backsplash);
      if (kitchenBack) total += kitchenBack.price;

      // Bathroom customizations
      const bathVanity = bathroomVanities.find(v => v.id === state.stage3.customizations.bathrooms.vanity);
      if (bathVanity) total += bathVanity.price;

      const bathCounter = bathroomCountertops.find(c => c.id === state.stage3.customizations.bathrooms.countertop);
      if (bathCounter) total += bathCounter.price;

      const bathFloor = bathroomFlooring.find(f => f.id === state.stage3.customizations.bathrooms.flooring);
      if (bathFloor) total += bathFloor.price;

      const bathShower = bathroomShowerTub.find(s => s.id === state.stage3.customizations.bathrooms.showerTub);
      if (bathShower) total += bathShower.price;

      const bathFixture = bathroomFixtures.find(f => f.id === state.stage3.customizations.bathrooms.fixtures);
      if (bathFixture) total += bathFixture.price;

      // Living area customizations
      const livFloor = livingFlooring.find(f => f.id === state.stage3.customizations.living.flooring);
      if (livFloor) total += livFloor.price;

      const livPaint = livingPaint.find(p => p.id === state.stage3.customizations.living.paint);
      if (livPaint) total += livPaint.price;

      const livTrim = livingTrim.find(t => t.id === state.stage3.customizations.living.trim);
      if (livTrim) total += livTrim.price;

      const livLight = livingLighting.find(l => l.id === state.stage3.customizations.living.lighting);
      if (livLight) total += livLight.price;

      // Bedroom customizations
      const bedFloor = bedroomFlooring.find(f => f.id === state.stage3.customizations.bedrooms.flooring);
      if (bedFloor) total += bedFloor.price;

      const bedPaint = bedroomPaint.find(p => p.id === state.stage3.customizations.bedrooms.paint);
      if (bedPaint) total += bedPaint.price;

      const bedCloset = bedroomClosets.find(c => c.id === state.stage3.customizations.bedrooms.closet);
      if (bedCloset) total += bedCloset.price;
    }

    return Math.round(total);
  }, [state.stage1, state.stage2, state.stage3]);

  useEffect(() => {
    updatePrice(calculatedPrice);
  }, [calculatedPrice, updatePrice]);

  return calculatedPrice;
}
