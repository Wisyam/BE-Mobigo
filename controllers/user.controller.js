const { User } = require(`../models/index`);
const md5 = require("md5");

const { Op } = require(`sequelize`);

exports.getAllUser = async (req, res) => {
  let users = await User.findAll();
  return res.json({
    success: true,
    data: users,
    message: "Data have been loaded",
  });
};

exports.getByLogin = async (req, res) => {
  let userID = req.user.userID
  let users = await User.findAll({where: {userID : userID}});
  return res.json({
    success: true,
    data: users,
    message: "Data have been loaded",
  });
};

exports.findUser = async (req, res) => {
  let keyword = req.params.key;

  let users = await User.findAll({
    where: {
      [Op.or]: [
        { userID: { [Op.substring]: keyword } },
        { email: { [Op.substring]: keyword } },
        { number: { [Op.substring]: keyword } },
        { role: { [Op.substring]: keyword } },
      ],
    },
  });

  return res.json({
    status: true,
    data: users,
    message: "Data have been loaded",
  });
};

exports.addUser = async (req, res) => {
  const existingUsername = await User.findOne({
    where: {
      username: req.body.username,
    },
  });
  const existingEmail = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (existingUsername || existingEmail) {
    return res.json({
      success: false,
      message: "Username or Email is already in use",
    });
  }

  const userData = {
    username: req.body.username,
    password: md5(req.body.password),
    email: req.body.email,
    number: req.body.number,
    role: req.body.role,
  };

  User.create(userData)
    .then((result) => {
      return res.json({
        status: true,
        data: result,
        message: "Data has been inserted",
      });
    })
    .catch((err) => {
      return res.json({
        success: false,
        message: err,
      });
    });
};

exports.updateUser = (req, res) => {
  let userData = {
    username: req.body.username,
    email: req.body.email,
    number: req.body.number,
    role: req.body.role,
  };

  if (req.body.password) {
    userData.password = md5(req.body.password);
  }

  const userID = req.params.id;

  User.update(userData, { where: { userID: userID } })
    .then((result) => {
      return res.json({
        status: true,
        data: result,
        message: "Data has been update",
      });
    })
    .catch((err) => {
      return res.json({
        status: false,
        message: err,
      });
    });
};
exports.updateUsers = (req, res) => {
  let userData = {
    username: req.body.username,
    email: req.body.email,
    number: req.body.number
  };

  User.update(userData, { where: { userID: req.user.userID } })
    .then((result) => {
      return res.json({
        status: true,
        data: result,
        message: "Data has been update",
      });
    })
    .catch((err) => {
      return res.json({
        status: false,
        message: err,
      });
    });
};

exports.deleteUser = (request, response) => {
  let userID = request.params.id;
  User.destroy({ where: { userID: userID } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data user has been deleted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

// Registration

exports.registration = async (req, res) => {
  const existingUsername = await User.findOne({
    where: {
      username: req.body.username,
    },
  });
  const existingEmail = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (existingUsername || existingEmail) {
    return res.json({
      success: false,
      message: "Username or Email is already in use",
    });
  }
  const userData = {
    username: req.body.username,
    password: md5(req.body.password),
    email: req.body.email,
    number: req.body.number,
    role: "user",
  };

  User.create(userData)
    .then((result) => {
      return res.json({
        status: true,
        data: result,
        message: "Data has been inserted",
      });
    })
    .catch((err) => {
      return res.json({
        success: false,
        message: err,
      });
    });
};

exports.resetPass = (req, res) => {
  let userID = req.params.id;
  let pass = {
    password: md5("123"),
  };

  User.update(pass, { where: { userID: userID } })
    .then((result) => {
      return res.json({
        status: true,
        data: result,
        message: `Password successfully reset : 123`,
      });
    })
    .catch((err) => {
      return res.json({
        status: false,
        message: err,
      });
    });
};

exports.updatePass = async (req, res) => {
  let userID = req.params.id;
  const user = await User.findOne({ where: { userID: userID } });
  const newpass = req.body.newpass;
  const pass = {
    password: md5(newpass),
  };

  if (user.password === md5(req.body.oldpass)) {
    User.update(pass, { where: { userID: userID } })
      .then((result) => {
        return res.json({
          status: true,
          data: result,
          message: `Password successfully reset : ${newpass}`,
        });
      })
    return res.json({
      message: "Password matches",
    });
  } else {
    return res.json({
      message: "Password does not match",
    });
  }
};
