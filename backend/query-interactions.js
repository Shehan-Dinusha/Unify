import sequelize from "./src/config/database.js";

async function queryData() {
  try {
    await sequelize.query('UPDATE boost_interactions SET "purchaseId" = 5 WHERE "purchaseId" = 4');
    console.log("Updated interaction purchaseId to 5");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

queryData();
