'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: false,
  pool: {
    max: 10, // Số kết nối tối đa trong pool
    min: 0,  // Số kết nối tối thiểu trong pool
    acquire: 30000, // Thời gian tối đa để kết nối được lấy ra (30 giây)
    idle: 10000 // Thời gian tối đa một kết nối có thể ở trạng thái không hoạt động trước khi được loại bỏ từ pool (10 giây)
  }
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
