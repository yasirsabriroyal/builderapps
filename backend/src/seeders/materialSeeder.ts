import { MaterialCategory, Material, sequelize } from '../models';

const categories = [
  { name: 'Flooring', description: 'All types of flooring materials including hardwood, tile, carpet, and laminate' },
  { name: 'Countertops', description: 'Kitchen and bathroom countertop materials' },
  { name: 'Cabinets', description: 'Kitchen and bathroom cabinetry' },
  { name: 'Paint & Wall Finishes', description: 'Interior and exterior paint, wallpaper, and wall treatments' },
  { name: 'Plumbing Fixtures', description: 'Sinks, faucets, toilets, and other plumbing fixtures' },
  { name: 'Lighting', description: 'Interior and exterior lighting fixtures' },
  { name: 'Windows & Doors', description: 'Windows, entry doors, and interior doors' },
  { name: 'Roofing', description: 'Roofing materials and shingles' },
  { name: 'Appliances', description: 'Kitchen and laundry appliances' },
  { name: 'Hardware', description: 'Door handles, hinges, and cabinet hardware' },
  { name: 'HVAC', description: 'Heating, ventilation, and air conditioning systems' },
  { name: 'Insulation', description: 'Wall and attic insulation materials' }
];

const materials = [
  { categoryName: 'Flooring', name: 'Oak Hardwood - Natural', price: 8.99, vendor: 'Premium Floors Inc.', imageUrl: 'https://placehold.co/400x300/oak/FFF?text=Oak+Hardwood' },
  { categoryName: 'Flooring', name: 'Maple Hardwood - Light', price: 9.49, vendor: 'Premium Floors Inc.', imageUrl: 'https://placehold.co/400x300/f5deb3/FFF?text=Maple+Hardwood' },
  { categoryName: 'Flooring', name: 'Walnut Hardwood - Dark', price: 12.99, vendor: 'Premium Floors Inc.', imageUrl: 'https://placehold.co/400x300/654321/FFF?text=Walnut+Hardwood' },
  { categoryName: 'Flooring', name: 'Ceramic Tile - White', price: 4.99, vendor: 'Tile Masters', imageUrl: 'https://placehold.co/400x300/FFF/000?text=White+Tile' },
  { categoryName: 'Flooring', name: 'Ceramic Tile - Gray', price: 5.49, vendor: 'Tile Masters', imageUrl: 'https://placehold.co/400x300/808080/FFF?text=Gray+Tile' },
  { categoryName: 'Flooring', name: 'Porcelain Tile - Marble Look', price: 7.99, vendor: 'Tile Masters', imageUrl: 'https://placehold.co/400x300/e8e8e8/000?text=Marble+Tile' },
  { categoryName: 'Flooring', name: 'Luxury Vinyl Plank - Oak', price: 3.99, vendor: 'Vinyl Solutions', imageUrl: 'https://placehold.co/400x300/deb887/FFF?text=LVP+Oak' },
  { categoryName: 'Flooring', name: 'Carpet - Beige', price: 2.49, vendor: 'Carpet World', imageUrl: 'https://placehold.co/400x300/f5f5dc/000?text=Beige+Carpet' },
  { categoryName: 'Flooring', name: 'Carpet - Gray', price: 2.99, vendor: 'Carpet World', imageUrl: 'https://placehold.co/400x300/a9a9a9/FFF?text=Gray+Carpet' },
  
  { categoryName: 'Countertops', name: 'Granite - Black Pearl', price: 65.00, vendor: 'Stone Elegance', imageUrl: 'https://placehold.co/400x300/000/FFF?text=Black+Granite' },
  { categoryName: 'Countertops', name: 'Granite - Kashmir White', price: 55.00, vendor: 'Stone Elegance', imageUrl: 'https://placehold.co/400x300/f5f5f5/000?text=White+Granite' },
  { categoryName: 'Countertops', name: 'Quartz - Carrara', price: 75.00, vendor: 'Quartz Pro', imageUrl: 'https://placehold.co/400x300/e8e8e8/000?text=Carrara+Quartz' },
  { categoryName: 'Countertops', name: 'Quartz - Calacatta', price: 85.00, vendor: 'Quartz Pro', imageUrl: 'https://placehold.co/400x300/f8f8f8/000?text=Calacatta+Quartz' },
  { categoryName: 'Countertops', name: 'Marble - White Carrara', price: 95.00, vendor: 'Marble Masters', imageUrl: 'https://placehold.co/400x300/f0f0f0/000?text=Carrara+Marble' },
  { categoryName: 'Countertops', name: 'Laminate - Butcher Block', price: 25.00, vendor: 'Budget Counters', imageUrl: 'https://placehold.co/400x300/daa520/FFF?text=Laminate' },
  { categoryName: 'Countertops', name: 'Solid Surface - White', price: 45.00, vendor: 'Surface Solutions', imageUrl: 'https://placehold.co/400x300/FFF/000?text=Solid+Surface' },
  
  { categoryName: 'Cabinets', name: 'Shaker Cabinet - White', price: 185.00, vendor: 'Cabinet Craft', imageUrl: 'https://placehold.co/400x300/FFF/000?text=White+Shaker' },
  { categoryName: 'Cabinets', name: 'Shaker Cabinet - Gray', price: 195.00, vendor: 'Cabinet Craft', imageUrl: 'https://placehold.co/400x300/808080/FFF?text=Gray+Shaker' },
  { categoryName: 'Cabinets', name: 'Shaker Cabinet - Navy', price: 205.00, vendor: 'Cabinet Craft', imageUrl: 'https://placehold.co/400x300/000080/FFF?text=Navy+Shaker' },
  { categoryName: 'Cabinets', name: 'Modern Flat Panel - White', price: 175.00, vendor: 'Modern Kitchen Co.', imageUrl: 'https://placehold.co/400x300/FFF/000?text=Modern+White' },
  { categoryName: 'Cabinets', name: 'Traditional Raised Panel - Cherry', price: 225.00, vendor: 'Classic Cabinets', imageUrl: 'https://placehold.co/400x300/8b4513/FFF?text=Cherry+Cabinet' },
  
  { categoryName: 'Paint & Wall Finishes', name: 'Interior Paint - White', price: 35.00, vendor: 'Paint Pro', imageUrl: 'https://placehold.co/400x300/FFF/000?text=White+Paint' },
  { categoryName: 'Paint & Wall Finishes', name: 'Interior Paint - Beige', price: 35.00, vendor: 'Paint Pro', imageUrl: 'https://placehold.co/400x300/f5f5dc/000?text=Beige+Paint' },
  { categoryName: 'Paint & Wall Finishes', name: 'Interior Paint - Gray', price: 35.00, vendor: 'Paint Pro', imageUrl: 'https://placehold.co/400x300/808080/FFF?text=Gray+Paint' },
  { categoryName: 'Paint & Wall Finishes', name: 'Exterior Paint - White', price: 45.00, vendor: 'Paint Pro', imageUrl: 'https://placehold.co/400x300/f8f8f8/000?text=Ext+White' },
  { categoryName: 'Paint & Wall Finishes', name: 'Wallpaper - Geometric', price: 55.00, vendor: 'Wall Decor Plus', imageUrl: 'https://placehold.co/400x300/add8e6/000?text=Geometric' },
  
  { categoryName: 'Plumbing Fixtures', name: 'Kitchen Faucet - Chrome', price: 185.00, vendor: 'Fixture World', imageUrl: 'https://placehold.co/400x300/c0c0c0/000?text=Chrome+Faucet' },
  { categoryName: 'Plumbing Fixtures', name: 'Kitchen Faucet - Matte Black', price: 225.00, vendor: 'Fixture World', imageUrl: 'https://placehold.co/400x300/000/FFF?text=Black+Faucet' },
  { categoryName: 'Plumbing Fixtures', name: 'Undermount Sink - Stainless', price: 295.00, vendor: 'Sink Solutions', imageUrl: 'https://placehold.co/400x300/d3d3d3/000?text=SS+Sink' },
  { categoryName: 'Plumbing Fixtures', name: 'Farmhouse Sink - White', price: 425.00, vendor: 'Sink Solutions', imageUrl: 'https://placehold.co/400x300/FFF/000?text=Farmhouse' },
  { categoryName: 'Plumbing Fixtures', name: 'Toilet - Two Piece', price: 285.00, vendor: 'Bath Essentials', imageUrl: 'https://placehold.co/400x300/FFF/000?text=Toilet' },
  { categoryName: 'Plumbing Fixtures', name: 'Shower Head - Rain', price: 125.00, vendor: 'Bath Essentials', imageUrl: 'https://placehold.co/400x300/c0c0c0/000?text=Rain+Shower' },
  
  { categoryName: 'Lighting', name: 'Chandelier - Crystal', price: 385.00, vendor: 'Lighting Designs', imageUrl: 'https://placehold.co/400x300/ffd700/000?text=Chandelier' },
  { categoryName: 'Lighting', name: 'Pendant Light - Modern', price: 145.00, vendor: 'Lighting Designs', imageUrl: 'https://placehold.co/400x300/000/FFF?text=Pendant' },
  { categoryName: 'Lighting', name: 'Recessed LED - 4 inch', price: 25.00, vendor: 'LED World', imageUrl: 'https://placehold.co/400x300/FFF/000?text=LED+Recessed' },
  { categoryName: 'Lighting', name: 'Wall Sconce - Bronze', price: 95.00, vendor: 'Lighting Designs', imageUrl: 'https://placehold.co/400x300/8b4513/FFF?text=Sconce' },
  { categoryName: 'Lighting', name: 'Outdoor Light - Black', price: 125.00, vendor: 'Outdoor Lighting Co.', imageUrl: 'https://placehold.co/400x300/000/FFF?text=Outdoor+Light' },
  
  { categoryName: 'Windows & Doors', name: 'Double Hung Window - Vinyl', price: 385.00, vendor: 'Window Works', imageUrl: 'https://placehold.co/400x300/87ceeb/000?text=Vinyl+Window' },
  { categoryName: 'Windows & Doors', name: 'Casement Window - Vinyl', price: 425.00, vendor: 'Window Works', imageUrl: 'https://placehold.co/400x300/87ceeb/000?text=Casement' },
  { categoryName: 'Windows & Doors', name: 'Entry Door - Fiberglass', price: 1285.00, vendor: 'Door Depot', imageUrl: 'https://placehold.co/400x300/8b4513/FFF?text=Entry+Door' },
  { categoryName: 'Windows & Doors', name: 'Interior Door - Panel', price: 185.00, vendor: 'Door Depot', imageUrl: 'https://placehold.co/400x300/deb887/000?text=Interior+Door' },
  { categoryName: 'Windows & Doors', name: 'Sliding Glass Door - 6ft', price: 1585.00, vendor: 'Window Works', imageUrl: 'https://placehold.co/400x300/87ceeb/000?text=Slider' },
  
  { categoryName: 'Roofing', name: 'Asphalt Shingles - Gray', price: 95.00, vendor: 'Roof Supply Co.', imageUrl: 'https://placehold.co/400x300/696969/FFF?text=Asphalt+Gray' },
  { categoryName: 'Roofing', name: 'Asphalt Shingles - Black', price: 95.00, vendor: 'Roof Supply Co.', imageUrl: 'https://placehold.co/400x300/000/FFF?text=Asphalt+Black' },
  { categoryName: 'Roofing', name: 'Metal Roofing - Standing Seam', price: 385.00, vendor: 'Metal Roof Pro', imageUrl: 'https://placehold.co/400x300/708090/FFF?text=Metal+Roof' },
  { categoryName: 'Roofing', name: 'Clay Tiles - Terracotta', price: 685.00, vendor: 'Tile Roofing Inc.', imageUrl: 'https://placehold.co/400x300/e2725b/FFF?text=Clay+Tile' },
  
  { categoryName: 'Appliances', name: 'Refrigerator - French Door SS', price: 2285.00, vendor: 'Appliance World', imageUrl: 'https://placehold.co/400x300/c0c0c0/000?text=Refrigerator' },
  { categoryName: 'Appliances', name: 'Range - Gas 30 inch', price: 1585.00, vendor: 'Appliance World', imageUrl: 'https://placehold.co/400x300/000/FFF?text=Gas+Range' },
  { categoryName: 'Appliances', name: 'Dishwasher - SS', price: 785.00, vendor: 'Appliance World', imageUrl: 'https://placehold.co/400x300/c0c0c0/000?text=Dishwasher' },
  { categoryName: 'Appliances', name: 'Microwave - Over Range', price: 385.00, vendor: 'Appliance World', imageUrl: 'https://placehold.co/400x300/000/FFF?text=Microwave' },
  { categoryName: 'Appliances', name: 'Washer - Front Load', price: 985.00, vendor: 'Appliance World', imageUrl: 'https://placehold.co/400x300/FFF/000?text=Washer' },
  { categoryName: 'Appliances', name: 'Dryer - Front Load', price: 885.00, vendor: 'Appliance World', imageUrl: 'https://placehold.co/400x300/FFF/000?text=Dryer' },
  
  { categoryName: 'Hardware', name: 'Cabinet Pulls - Brushed Nickel', price: 4.50, vendor: 'Hardware Haven', imageUrl: 'https://placehold.co/400x300/c0c0c0/000?text=Cabinet+Pull' },
  { categoryName: 'Hardware', name: 'Cabinet Knobs - Bronze', price: 3.50, vendor: 'Hardware Haven', imageUrl: 'https://placehold.co/400x300/8b4513/FFF?text=Knob' },
  { categoryName: 'Hardware', name: 'Door Lever - Satin Nickel', price: 35.00, vendor: 'Hardware Haven', imageUrl: 'https://placehold.co/400x300/c0c0c0/000?text=Door+Lever' },
  { categoryName: 'Hardware', name: 'Door Knob - Antique Brass', price: 28.00, vendor: 'Hardware Haven', imageUrl: 'https://placehold.co/400x300/b8860b/000?text=Door+Knob' },
  { categoryName: 'Hardware', name: 'Hinges - Oil Rubbed Bronze', price: 12.00, vendor: 'Hardware Haven', imageUrl: 'https://placehold.co/400x300/3d2817/FFF?text=Hinge' },
  
  { categoryName: 'HVAC', name: 'Central AC Unit - 3 Ton', price: 2585.00, vendor: 'HVAC Solutions', imageUrl: 'https://placehold.co/400x300/4682b4/FFF?text=AC+Unit' },
  { categoryName: 'HVAC', name: 'Gas Furnace - 80k BTU', price: 1985.00, vendor: 'HVAC Solutions', imageUrl: 'https://placehold.co/400x300/ff4500/FFF?text=Furnace' },
  { categoryName: 'HVAC', name: 'Programmable Thermostat', price: 185.00, vendor: 'HVAC Solutions', imageUrl: 'https://placehold.co/400x300/FFF/000?text=Thermostat' },
  { categoryName: 'HVAC', name: 'Ductwork - Flexible', price: 3.50, vendor: 'HVAC Solutions', imageUrl: 'https://placehold.co/400x300/d3d3d3/000?text=Ductwork' },
  
  { categoryName: 'Insulation', name: 'Fiberglass Batts - R30', price: 0.85, vendor: 'Insulation Pro', imageUrl: 'https://placehold.co/400x300/ffb6c1/000?text=Fiberglass' },
  { categoryName: 'Insulation', name: 'Spray Foam - Closed Cell', price: 1.95, vendor: 'Insulation Pro', imageUrl: 'https://placehold.co/400x300/f0e68c/000?text=Spray+Foam' },
  { categoryName: 'Insulation', name: 'Rigid Foam Board - R10', price: 25.00, vendor: 'Insulation Pro', imageUrl: 'https://placehold.co/400x300/add8e6/000?text=Foam+Board' },
  { categoryName: 'Insulation', name: 'Blown-in Cellulose - R38', price: 0.65, vendor: 'Insulation Pro', imageUrl: 'https://placehold.co/400x300/dcdcdc/000?text=Cellulose' }
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    for (const category of categories) {
      await MaterialCategory.create(category);
    }
    console.log('✅ Material categories seeded');

    const categoryMap = await MaterialCategory.findAll();
    const categoryNameToId: { [key: string]: number } = {};
    categoryMap.forEach(cat => {
      categoryNameToId[cat.name] = cat.id;
    });

    for (const material of materials) {
      const { categoryName, ...materialData } = material;
      await Material.create({
        ...materialData,
        categoryId: categoryNameToId[categoryName],
        description: `Premium ${material.name} from ${material.vendor}`
      });
    }
    console.log('✅ Materials seeded');

    console.log('🎉 Database seed completed successfully!');
    console.log(`📊 Created ${categories.length} categories and ${materials.length} materials`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
};
