
import app from './app.js';
import logger from './utils/logger.js';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import dbConfig from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    // Sync models (only for dev, use migrations for production)
    // await sequelize.sync(); 

    app.listen(PORT, () => {
      logger.info(`Server running in ${env} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
