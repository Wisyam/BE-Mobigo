'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Details.belongsTo(models.Booking, { foreignKey: 'bookingID' });
      Details.belongsTo(models.Car, { foreignKey: 'carID' });
    }
  }
  Details.init({
    detailsID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    bookingID: DataTypes.INTEGER,
    carID: DataTypes.INTEGER,
    total : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Details',
  });
  return Details;
};