const { Car } = require(`../models/index`);
const { Op } = require(`sequelize`);
const path = require(`path`);
const fs = require(`fs`);
const upload = require(`./uploud.images`).single(`image`);

exports.getAllCar = async (req, res) => {
  let cars = await Car.findAll();
  return res.json({
    success: true,
    data: cars,
    message: `All Car have been loaded`,
  });
};

exports.findCar = async (req, res) => {
  let keyword = req.params.key;
  let cars = await Car.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.substring]: keyword } },
        { carID: { [Op.substring]: keyword } }
      ],
    },
  });
  return res.json({
    success: true,
    data: cars,
    message: `All Car have been loaded`,
  });
};

exports.addCar = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }
    if (!request.file) {
      return response.json({
        message: `Nothing to
    Upload`,
      });
    }
    let newEvent = {
      name: request.body.name,
      price: request.body.price,
      capacity: request.body.capacity,
      model: request.body.model,
      color: request.body.color,
      am: request.body.am,
      image: request.file.filename,
    };
    Car.create(newEvent)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `New Car has been inserted`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

exports.updateCar = async (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }
    let carID = request.params.id;
    let dataEvent = {
      name: request.body.name,
      price: request.body.price,
      capacity: request.body.capacity,
      model: request.body.model,
      color: request.body.color,
      am: request.body.am,
    };
    if (request.file) {
      const selectedEvent = await Car.findOne({
        where: { carID: carID },
      });
      const oldImage = selectedEvent.image;
      const pathImage = path.join(__dirname, `../image`, oldImage);
      if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, (error) => console.log(error));
      }
      dataEvent.image = request.file.filename;
    }
    Car
      .update(dataEvent, { where: { carID: carID } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data event has been updated`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

exports.deleteCar = async (request, response) => {
  const eventID = request.params.id;
  const event = await Car.findOne({ where: { carID: eventID } });
  const oldImage = event.image;
  const pathImage = path.join(__dirname, `../image`, oldImage);
  if (fs.existsSync(pathImage)) {
    fs.unlink(pathImage, (error) => console.log(error));
  }
  Car
    .destroy({ where: { carID: eventID } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data car has been deleted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
