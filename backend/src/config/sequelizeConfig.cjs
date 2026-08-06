require("dotenv/config");

const env = process.env.NODE_ENV || "development";

module.exports = {
  [env]: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "Unify",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5434,
    dialect: "postgres",
    dialectOptions: process.env.DB_SSL === "true"
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
  },
};
