import sequelize from './src/config/database.js';
import logger from '../../../utils/logger.js';

async function fixEnum() {
  try {
    logger.info('Updating ENUM type...');
    await sequelize.query('ALTER TYPE "enum_business_profiles_category" ADD VALUE IF NOT EXISTS \'CLUBS\'');
    logger.info('ENUM updated successfully.');
  } catch (error) {
    logger.error('Error updating ENUM:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixEnum();
