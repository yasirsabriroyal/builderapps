import type { OptionCard, MaterialOption } from '../types';

// Home type base prices
export const homeTypePrices: Record<string, number> = {
  'single-family': 250000,
  'duplex': 300000,
  'townhouse': 220000,
  'custom': 280000,
};

// Additional room prices
export const additionalRoomPrices: Record<string, number> = {
  office: 15000,
  'bonus-room': 18000,
  'media-room': 22000,
  'guest-suite': 25000,
};

// Garage options
export const garageOptions: OptionCard[] = [
  {
    id: '2-car',
    name: '2-Car Garage',
    description: 'Standard 2-car attached garage',
    price: 0,
  },
  {
    id: '3-car',
    name: '3-Car Garage',
    description: 'Spacious 3-car attached garage',
    price: 25000,
  },
  {
    id: 'detached',
    name: 'Detached Garage',
    description: '2-car detached garage',
    price: 30000,
  },
];

// Landscaping packages
export const landscapingPackages: OptionCard[] = [
  {
    id: 'basic',
    name: 'Basic Package',
    description: 'Standard lawn, basic plantings, irrigation system',
    price: 0,
    features: ['Basic lawn care', 'Foundation plantings', 'Irrigation system'],
  },
  {
    id: 'premium',
    name: 'Premium Package',
    description: 'Enhanced landscaping with mature trees and decorative elements',
    price: 8000,
    features: ['Premium lawn', 'Mature trees', 'Decorative rocks', 'Irrigation system'],
  },
  {
    id: 'luxury',
    name: 'Luxury Package',
    description: 'Professional landscape design with premium features',
    price: 18000,
    features: ['Designer landscaping', 'Multiple mature trees', 'Decorative hardscaping', 'Advanced irrigation', 'Outdoor lighting'],
  },
];

// Finish level options
export const finishLevels: OptionCard[] = [
  {
    id: 'standard',
    name: 'Standard Finish',
    description: 'Quality finishes throughout',
    price: 0,
    features: ['Standard fixtures', 'Carpet & vinyl flooring', 'Basic lighting', 'Standard appliances'],
  },
  {
    id: 'premium',
    name: 'Premium Finish',
    description: 'Upgraded finishes and materials',
    price: 35000,
    features: ['Upgraded fixtures', 'Hardwood & tile flooring', 'Designer lighting', 'Stainless appliances'],
  },
  {
    id: 'luxury',
    name: 'Luxury Finish',
    description: 'Top-tier finishes and premium materials',
    price: 75000,
    features: ['Designer fixtures', 'Premium hardwood & tile', 'Custom lighting', 'High-end appliances', 'Smart home features'],
  },
];

// Design packages
export const designPackages: OptionCard[] = [
  {
    id: 'modern',
    name: 'Modern Package',
    description: 'Clean lines, minimalist aesthetic with contemporary finishes',
    price: 0,
    features: ['Sleek cabinetry', 'Neutral color palette', 'Modern fixtures', 'Open concept feel'],
  },
  {
    id: 'traditional',
    name: 'Traditional Package',
    description: 'Classic elegance with timeless appeal',
    price: 5000,
    features: ['Classic cabinetry', 'Warm color tones', 'Traditional fixtures', 'Crown molding'],
  },
  {
    id: 'farmhouse',
    name: 'Farmhouse Package',
    description: 'Rustic charm meets modern comfort',
    price: 8000,
    features: ['Shaker cabinetry', 'Warm wood tones', 'Farmhouse sink', 'Barn doors'],
  },
  {
    id: 'contemporary',
    name: 'Luxury Contemporary',
    description: 'High-end modern design with premium materials',
    price: 15000,
    features: ['Custom cabinetry', 'Designer finishes', 'Smart home ready', 'Premium appliances'],
  },
];

// Kitchen material options
export const kitchenCountertops: MaterialOption[] = [
  { id: 'laminate', name: 'Laminate', price: 0, description: 'Durable and affordable' },
  { id: 'granite', name: 'Granite', price: 5000, description: 'Natural stone elegance' },
  { id: 'quartz', name: 'Quartz', price: 6500, description: 'Low maintenance luxury' },
  { id: 'marble', name: 'Marble', price: 8500, description: 'Premium natural stone' },
];

export const kitchenCabinetry: MaterialOption[] = [
  { id: 'stock', name: 'Stock Cabinets', price: 0, description: 'Standard finish' },
  { id: 'semi-custom', name: 'Semi-Custom', price: 8000, description: 'More options' },
  { id: 'custom', name: 'Custom Cabinets', price: 18000, description: 'Fully customized' },
];

export const kitchenFlooring: MaterialOption[] = [
  { id: 'vinyl', name: 'Luxury Vinyl', price: 0, description: 'Waterproof and durable' },
  { id: 'tile', name: 'Ceramic Tile', price: 2000, description: 'Classic look' },
  { id: 'hardwood', name: 'Hardwood', price: 4000, description: 'Premium natural wood' },
];

export const kitchenAppliances: MaterialOption[] = [
  { id: 'standard', name: 'Standard', price: 0, description: 'Quality appliances' },
  { id: 'stainless', name: 'Stainless Steel', price: 3000, description: 'Upgraded package' },
  { id: 'premium', name: 'Premium Brand', price: 8000, description: 'High-end appliances' },
];

export const kitchenBacksplash: MaterialOption[] = [
  { id: 'basic', name: 'Basic Tile', price: 0, description: 'Simple subway tile' },
  { id: 'designer', name: 'Designer Tile', price: 1500, description: 'Custom patterns' },
  { id: 'glass', name: 'Glass Mosaic', price: 2500, description: 'Elegant glass tiles' },
];

// Bathroom material options
export const bathroomVanities: MaterialOption[] = [
  { id: 'standard', name: 'Standard Vanity', price: 0, description: 'Quality construction' },
  { id: 'upgraded', name: 'Upgraded Vanity', price: 1500, description: 'Better materials' },
  { id: 'custom', name: 'Custom Vanity', price: 3500, description: 'Custom built' },
];

export const bathroomCountertops: MaterialOption[] = [
  { id: 'cultured-marble', name: 'Cultured Marble', price: 0, description: 'Standard finish' },
  { id: 'granite', name: 'Granite', price: 800, description: 'Natural stone' },
  { id: 'quartz', name: 'Quartz', price: 1200, description: 'Premium surface' },
];

export const bathroomFlooring: MaterialOption[] = [
  { id: 'vinyl', name: 'Luxury Vinyl', price: 0, description: 'Waterproof' },
  { id: 'ceramic', name: 'Ceramic Tile', price: 1000, description: 'Classic tile' },
  { id: 'porcelain', name: 'Porcelain Tile', price: 1500, description: 'Premium tile' },
];

export const bathroomShowerTub: MaterialOption[] = [
  { id: 'standard', name: 'Standard Tub/Shower', price: 0, description: 'Fiberglass unit' },
  { id: 'tile-shower', name: 'Tile Shower', price: 2500, description: 'Custom tile work' },
  { id: 'premium', name: 'Premium Package', price: 5000, description: 'Frameless glass & tile' },
];

export const bathroomFixtures: MaterialOption[] = [
  { id: 'standard', name: 'Standard Fixtures', price: 0, description: 'Chrome finish' },
  { id: 'brushed-nickel', name: 'Brushed Nickel', price: 500, description: 'Modern finish' },
  { id: 'designer', name: 'Designer Fixtures', price: 1200, description: 'Premium brands' },
];

// Living area options
export const livingFlooring: MaterialOption[] = [
  { id: 'carpet', name: 'Carpet', price: 0, description: 'Comfortable carpet' },
  { id: 'vinyl', name: 'Luxury Vinyl Plank', price: 3000, description: 'Wood-look vinyl' },
  { id: 'hardwood', name: 'Hardwood', price: 6000, description: 'Real wood flooring' },
  { id: 'tile', name: 'Tile', price: 5000, description: 'Durable tile flooring' },
];

export const livingPaint: MaterialOption[] = [
  { id: 'standard', name: 'Standard Colors', price: 0, description: 'Neutral palette' },
  { id: 'premium', name: 'Premium Colors', price: 1000, description: 'Wider selection' },
  { id: 'custom', name: 'Custom Colors', price: 2000, description: 'Any color choice' },
];

export const livingTrim: MaterialOption[] = [
  { id: 'standard', name: 'Standard Trim', price: 0, description: '3.5" baseboards' },
  { id: 'upgraded', name: 'Upgraded Trim', price: 2000, description: '5.5" baseboards' },
  { id: 'custom', name: 'Custom Trim Package', price: 4000, description: 'Crown molding included' },
];

export const livingLighting: MaterialOption[] = [
  { id: 'standard', name: 'Standard Lighting', price: 0, description: 'Basic fixtures' },
  { id: 'upgraded', name: 'Upgraded Fixtures', price: 1500, description: 'Better styles' },
  { id: 'designer', name: 'Designer Lighting', price: 3500, description: 'Premium fixtures' },
];

// Bedroom options
export const bedroomFlooring: MaterialOption[] = [
  { id: 'carpet', name: 'Carpet', price: 0, description: 'Soft carpet' },
  { id: 'vinyl', name: 'Luxury Vinyl', price: 2000, description: 'Easy maintenance' },
  { id: 'hardwood', name: 'Hardwood', price: 4000, description: 'Premium wood' },
];

export const bedroomPaint: MaterialOption[] = [
  { id: 'standard', name: 'Standard Colors', price: 0, description: 'Neutral palette' },
  { id: 'premium', name: 'Premium Colors', price: 500, description: 'More options' },
  { id: 'custom', name: 'Custom Colors', price: 1000, description: 'Custom selection' },
];

export const bedroomClosets: MaterialOption[] = [
  { id: 'standard', name: 'Standard Closet', price: 0, description: 'Wire shelving' },
  { id: 'walk-in', name: 'Walk-in Closet', price: 2000, description: 'Larger closet' },
  { id: 'custom', name: 'Custom Organization', price: 4000, description: 'Built-in systems' },
];

// Upgrade prices
export const upgradePrices = {
  finishedBasement: 45000,
  deckPatio: 12000,
  smartHome: 8000,
  energyEfficiency: 15000,
};

// Per bedroom/bathroom pricing adjustments
export const roomPrices = {
  bedroom: 12000,
  bathroom: 15000,
};
