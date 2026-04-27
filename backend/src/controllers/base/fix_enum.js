import sequelize from './src/config/database.js';

async function fixEnum() {
  try {
    console.log('Updating ENUM type...');
    await sequelize.query('ALTER TYPE "enum_business_profiles_category" ADD VALUE IF NOT EXISTS \'CLUBS\'');
    console.log('ENUM updated successfully.');
  } catch (error) {
    console.error('Error updating ENUM:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixEnum();
