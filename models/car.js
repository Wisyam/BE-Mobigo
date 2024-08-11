'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Car.hasMany(models.Details, { foreignKey: 'carID' });
    }
  }
  Car.init({
    carID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    model: DataTypes.STRING,
    color: DataTypes.STRING,
    am: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Car',
  });
  return Car;
};