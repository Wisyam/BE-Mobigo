
const { Booking, Car, User, Details, sequelize } = require('../models/index')
const { Op } = require(`sequelize`);

exports.getAllDetails = async (req, res) => {

    const details = await Details.findAll({
        include: [
            { model : Car, attributes: ["carID", "name", "price"]},
            { model : Booking, attributes: ["bookingID", "booking_date"]}
        ]
    })
    return res.json({
        status : "true",
        data : details,
        message : "Data has successfully loaded"
    })
}

exports.carSigma = async (req, res) => {
    const details = await Car.findAll({
        attributes: ["carID", "name", "price", "model"]
    })
    return res.json({
        status : "true",
        data : details,
        message : "Data has successfully loaded"
    })
}


// const { Sequelize, sequelize, fn, col, literal } = require('sequelize');

exports.carDetails = async (req, res) => {
    try {
        const { carID } = req.body;
        const detailsData = await Details.findAll({
            where : {carID : carID},
            include : [{model : Car, attributes: ["name", "capacity", "am"]}],
            attributes: [
                [sequelize.col('Details.carID'), 'carID'], // Menentukan sumber kolom carID secara eksplisit
                [sequelize.fn('COUNT', sequelize.col('Details.carID')), 'count'],
                [sequelize.fn('SUM', sequelize.col('Details.total')), 'total']
            ],
            group: ['Details.carID'] // Mengelompokkan berdasarkan kolom carID dari tabel Details
        });

        res.status(200).json({
            success: true,
            data: detailsData,
            message: "Details data successfully fetched"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.deleteBook = async (request, response) => {
    let userID = request.params.id;
    const details =   await Details.findOne({ where: { detailsID : userID } })

    Details.destroy({ where: { detailsID : userID } })
      .then((result) => {
        Booking.destroy({ where: {bookingID : details.BookingID}})
        return response.json({
          success: true,
          message: `Data Booking has been deleted`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  };