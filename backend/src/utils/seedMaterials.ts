import { sequelize } from '../config/database';
import MaterialCategory from '../models/MaterialCategory.model';
import Material from '../models/Material.model';

export const seedMaterials = async () => {
  try {
    console.log('🌱 Seeding materials...');

    // Create categories
    const flooringCategory = await MaterialCategory.create({
      categoryName: 'Flooring',
      description: 'All types of flooring materials',
      displayOrder: 1
    });

    const countertopCategory = await MaterialCategory.create({
      categoryName: 'Countertops',
      description: 'Kitchen and bathroom countertops',
      displayOrder: 2
    });

    const cabinetCategory = await MaterialCategory.create({
      categoryName: 'Cabinets',
      description: 'Kitchen and bathroom cabinets',
      displayOrder: 3
    });

    const paintCategory = await MaterialCategory.create({
      categoryName: 'Paint & Wall Finishes',
      description: 'Interior and exterior paints',
      displayOrder: 4
    });

    // Seed flooring materials
    await Material.bulkCreate([
      {
        categoryId: flooringCategory.id,
        materialName: 'Oak Hardwood Flooring',
        manufacturer: 'Premium Woods Co',
        modelNumber: 'OAK-001',
        description: 'Beautiful natural oak hardwood with rich grain patterns',
        pricePerUnit: 8.50,
        unitType: 'sqft',
        color: 'Natural',
        finish: 'Matte',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Oak+Hardwood',
        specifications: { thickness: '3/4 inch', width: '5 inch' },
        sustainabilityRating: 'FSC Certified',
        leadTimeDays: 14,
        isAvailable: true,
        isPremium: false
      },
      {
        categoryId: flooringCategory.id,
        materialName: 'Maple Hardwood Flooring',
        manufacturer: 'Premium Woods Co',
        modelNumber: 'MAPLE-001',
        description: 'Light-colored maple with uniform grain',
        pricePerUnit: 9.00,
        unitType: 'sqft',
        color: 'Light',
        finish: 'Semi-Gloss',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Maple+Hardwood',
        sustainabilityRating: 'FSC Certified',
        leadTimeDays: 14,
        isAvailable: true,
        isPremium: false
      },
      {
        categoryId: flooringCategory.id,
        materialName: 'Luxury Vinyl Plank',
        manufacturer: 'FloorTech',
        modelNumber: 'LVP-200',
        description: 'Waterproof luxury vinyl with wood appearance',
        pricePerUnit: 4.50,
        unitType: 'sqft',
        color: 'Grey Oak',
        finish: 'Textured',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=LVP+Flooring',
        specifications: { thickness: '6mm', wear_layer: '20mil' },
        leadTimeDays: 7,
        isAvailable: true,
        isPremium: false
      },
      {
        categoryId: flooringCategory.id,
        materialName: 'Porcelain Tile - Wood Look',
        manufacturer: 'TileCraft',
        modelNumber: 'TILE-W100',
        description: 'Durable porcelain tile with realistic wood grain',
        pricePerUnit: 6.75,
        unitType: 'sqft',
        color: 'Walnut',
        finish: 'Matte',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Wood+Look+Tile',
        leadTimeDays: 10,
        isAvailable: true,
        isPremium: false
      }
    ]);

    // Seed countertop materials
    await Material.bulkCreate([
      {
        categoryId: countertopCategory.id,
        materialName: 'Granite - Black Pearl',
        manufacturer: 'Stone Masters',
        modelNumber: 'GRAN-BP',
        description: 'Premium black granite with silver specks',
        pricePerUnit: 65.00,
        unitType: 'sqft',
        color: 'Black',
        finish: 'Polished',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Black+Pearl+Granite',
        specifications: { thickness: '1.25 inch' },
        leadTimeDays: 21,
        isAvailable: true,
        isPremium: true
      },
      {
        categoryId: countertopCategory.id,
        materialName: 'Quartz - Arctic White',
        manufacturer: 'Quartz Solutions',
        modelNumber: 'QTZ-AW',
        description: 'Pure white engineered quartz',
        pricePerUnit: 75.00,
        unitType: 'sqft',
        color: 'White',
        finish: 'Polished',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Arctic+White+Quartz',
        specifications: { thickness: '1.25 inch' },
        sustainabilityRating: 'NSF Certified',
        leadTimeDays: 14,
        isAvailable: true,
        isPremium: true
      },
      {
        categoryId: countertopCategory.id,
        materialName: 'Laminate - Carrara Marble Look',
        manufacturer: 'CounterTop Plus',
        modelNumber: 'LAM-CM',
        description: 'Affordable laminate with marble appearance',
        pricePerUnit: 25.00,
        unitType: 'sqft',
        color: 'White/Grey',
        finish: 'Matte',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Marble+Laminate',
        leadTimeDays: 7,
        isAvailable: true,
        isPremium: false
      }
    ]);

    // Seed cabinet materials
    await Material.bulkCreate([
      {
        categoryId: cabinetCategory.id,
        materialName: 'Shaker Style - White',
        manufacturer: 'Cabinet Creations',
        modelNumber: 'SHAK-W',
        description: 'Classic shaker style cabinets in crisp white',
        pricePerUnit: 450.00,
        unitType: 'linear_ft',
        color: 'White',
        finish: 'Painted',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=White+Shaker+Cabinets',
        specifications: { door_style: 'Shaker', material: 'Maple' },
        leadTimeDays: 30,
        isAvailable: true,
        isPremium: false
      },
      {
        categoryId: cabinetCategory.id,
        materialName: 'Modern Flat Panel - Grey',
        manufacturer: 'Cabinet Creations',
        modelNumber: 'MOD-G',
        description: 'Contemporary flat panel in charcoal grey',
        pricePerUnit: 520.00,
        unitType: 'linear_ft',
        color: 'Charcoal Grey',
        finish: 'Painted',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Grey+Modern+Cabinets',
        leadTimeDays: 35,
        isAvailable: true,
        isPremium: true
      }
    ]);

    // Seed paint
    await Material.bulkCreate([
      {
        categoryId: paintCategory.id,
        materialName: 'Interior Premium Paint - Eggshell',
        manufacturer: 'ColorWorks',
        modelNumber: 'INT-ES',
        description: 'Premium interior paint with low VOC',
        pricePerUnit: 45.00,
        unitType: 'gallon',
        color: 'Custom',
        finish: 'Eggshell',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Interior+Paint',
        specifications: { coverage: '400 sqft/gallon', VOC: 'Low' },
        sustainabilityRating: 'Greenguard Gold',
        leadTimeDays: 1,
        isAvailable: true,
        isPremium: false
      },
      {
        categoryId: paintCategory.id,
        materialName: 'Exterior Premium Paint - Satin',
        manufacturer: 'ColorWorks',
        modelNumber: 'EXT-SAT',
        description: 'Weather-resistant exterior paint',
        pricePerUnit: 55.00,
        unitType: 'gallon',
        color: 'Custom',
        finish: 'Satin',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Exterior+Paint',
        specifications: { coverage: '350 sqft/gallon', weather_resistant: true },
        leadTimeDays: 1,
        isAvailable: true,
        isPremium: false
      }
    ]);

    console.log('✅ Materials seeded successfully');
    console.log(`📦 Created ${await Material.count()} materials in ${await MaterialCategory.count()} categories`);
  } catch (error) {
    console.error('❌ Error seeding materials:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  sequelize.authenticate()
    .then(() => sequelize.sync({ alter: true }))
    .then(() => seedMaterials())
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed:', error);
      process.exit(1);
    });
}
