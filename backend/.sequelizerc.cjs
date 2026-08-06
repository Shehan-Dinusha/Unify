const path = require("path");

module.exports = {
  config: path.resolve("src/config/sequelizeConfig.cjs"),
  "models-path": path.resolve("src/modules"),
  "migrations-path": path.resolve("src/migrations"),
  "seeders-path": path.resolve("src/seeders"),
};
