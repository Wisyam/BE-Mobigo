const { Booking, Car, User, Details } = require("../models/index");
const { Op } = require(`sequelize`);

exports.getAllBooking = async (req, res) => {
  const bookings = await Booking.findAll({
    include: [
      {
        model: Details,
        attributes: ["detailsID", "bookingID", "carID", "total"],
        include: [
          { model : Car, attributes: ["name", "price", "capacity", "color", "am", "model"] }
        ]
      },
      { model: User, attributes: ["userID", "username", "email"] },
    ],
  });
  return res.json({
    status: "true",
    data: bookings,
    message: "Data has successfully loaded",
  });
};

exports.findBooking = async (req, res) => {
  let keyword = req.params.key;
  let cars = await Booking.findAll({
    where: {
      [Op.or]: [
        { bookingID: { [Op.substring]: keyword } },
        { total: { [Op.substring]: keyword } },
      ],
    },
  });
  return res.json({
    success: true,
    data: cars,
    message: `All Booking have been loaded`,
  });
};

exports.addBooking = async (req, res) => {
  const { car_id, date } = req.body;

  try {
    const Cars = await Car.findOne({ where: { carID: car_id } });
    const hargaMobil = Cars.price;

    const bookingIDs = await Promise.all(
      date.map(async (tanggal) => {
        const { booking_date, end_date } = tanggal;
        const durasiBooking = Math.ceil(
          (new Date(end_date) - new Date(booking_date)) / (1000 * 60 * 60 * 24)
        ); // Perbedaan tanggal dalam hari
        const total = durasiBooking * hargaMobil;
        const bookingCreate = await Booking.create({
          userID: req.user.userID,
          booking_status: 0,
          booking_date,
          end_date
        });
        return { bookingID: bookingCreate.bookingID, total };
      })
    );

    const detailCreate = await Details.bulkCreate(
      bookingIDs.map((bookings) => ({
        bookingID : bookings.bookingID,
        carID: car_id,
        total : bookings.total
      }))
    );

    res.status(200).json({ detailCreate });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

exports.pengembalianMobil = async (req, res) => {
  const { bookingID, return_date } = req.body;

  try {
    // Mendapatkan data booking berdasarkan bookingID
    const bookingData = await Booking.findOne({ where: { bookingID } });
    const detailData = await Details.findOne({ where: { bookingID } });

    if (!bookingData || !return_date) {
      return res.status(404).json({
        success: false,
        message: "Booking or return date not found.",
      });
    }
    // Jika return_date tidak diisi, maka menganggap mobil dikembalikan pada hari ini
    const actualReturnDate = return_date ? new Date(return_date) : new Date();
    // Menghitung durasi keterlambatan (dalam hari)
    const durasiKeterlambatan = Math.max(
      0,
      Math.ceil(
        (actualReturnDate - new Date(bookingData.end_date)) /
          (1000 * 60 * 60 * 24)
      )
    );
    // Menghitung denda
    const denda = durasiKeterlambatan * 50000; // Denda per hari (contoh: 50.000 per hari)

    // Menambahkan denda ke total
    const totalDenganDenda = detailData.total + denda;

    // Memperbarui data booking dengan return_date dan total yang sudah termasuk denda
    await Booking.update(
      {
        return_date: return_date,
        booking_status: 2,
      },
      {
        where: { bookingID },
      }
    );
    await Details.update(
      {
        total : totalDenganDenda
      },
      {
        where: { bookingID },
      }
    );

    res.status(200).json({
      success: true,
      message: "Booking returned successfully.",
      denda,
      totalDenganDenda,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};



exports.cektanggal = async (req, res) => {
  const { car_id, date } = req.body;

  try {
    const Cars = await Car.findOne({ where: { carID: car_id } });
    const hargaMobil = Cars.price;

    const bookingIDs = await Promise.all(
      date.map(async (tanggal) => {
        const { booking_date, end_date } = tanggal;
        const durasiBooking = Math.ceil(
          (new Date(end_date) - new Date(booking_date)) / (1000 * 60 * 60 * 24)
        ); // Perbedaan tanggal dalam hari
        const total = durasiBooking * hargaMobil;

        return res.json({
          hari: durasiBooking,
          total: total,
        });
      })
    );

    return bookingIDs;
  } catch {}
};


/// HISTORY USER

exports.historyUser = async (req, res) => {
  try{
    const BookingData = await Booking.findAll({
      attrributes: ["booking_date", "end_date","booking"],
      include: [
        {
          model: Details,
          attributes: ["detailsID", "bookingID", "carID", "total"],
          include: [
            { model : Car, attributes: ["name", "price", "color", "am", "model"] }
          ]
        }
      ],
      where : { userID : req.user.userID, [Op.not] : [
        {
          booking_status : 2
        }
      ] }
    })


    res.json({
      status : "success",
      data : BookingData,
      message : "Data has successfully loaded"
    })
  } catch (err) {
    res.json({
      status : "false",
      message : err.message
    })
  }
}

// history user non active

exports.historyUserNo = async (req, res) => {
  try{
    const BookingData = await Booking.findAll({
      include: [
        {
          model: Details,
          attributes: ["detailsID", "bookingID", "carID", "total"],
          include: [
            { model : Car, attributes: ["name", "price", "capacity", "color", "am", "model"] }
          ]
        }
      ],
      where : { userID : req.user.userID, booking_status : 2 }
    })


    res.json({
      status : "success",
      data : BookingData,
      message : "Data has successfully loaded"
    })
  } catch (err) {
    res.json({
      status : "false",
      message : err.message
    })
  }
}

exports.historyAdmin = async (req, res) => {
  try{
    const BookingData = await Booking.findAll({
      include: [
        { model: User},
        {
          model: Details,
          include: [
            { model : Car }
          ]
        }
      ],
      where : { booking_status : 1 }
    })


    res.json({
      status : "success",
      data : BookingData,
      message : "Data has successfully loaded"
    })
  } catch (err) {
    res.json({
      status : "false",
      message : err.message
    })
  }
}
