import sequelize from "./src/config/database.js";

async function fixData() {
  try {
    await sequelize.query('UPDATE boost_purchases SET impressions = clicks WHERE clicks > impressions;');
    console.log('Fixed DB data');
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

fixData();
