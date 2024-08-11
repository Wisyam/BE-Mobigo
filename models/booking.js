'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: 'userID' });
      Booking.hasOne(models.Details, { foreignKey: 'bookingID' });
    }
  }
  Booking.init({
    bookingID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userID: DataTypes.INTEGER,
    // total: DataTypes.INTEGER,
    booking_date: DataTypes.DATE,
    booking_status: DataTypes.STRING,
    end_date: DataTypes.DATE,
    return_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};