import { seedDatabase } from './materialSeeder';
import sequelize from '../config/database';

const runSeed = async () => {
  try {
    await seedDatabase();
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    await sequelize.close();
    process.exit(1);
  }
};

runSeed();
