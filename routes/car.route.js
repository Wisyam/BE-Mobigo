const express = require(`express`)
const carController = require(`../controllers/car.controller`)
const app = express()
app.use(express.json())
const authControll = require('../controllers/auth.controller')
const roleValidate = require('../middleware/role.validation')

app.get('/', authControll.authorize, carController.getAllCar)
app.get('/:key', authControll.authorize, carController.findCar)
app.post('/', authControll.authorize, roleValidate.isAdmin, carController.addCar)
app.put('/:id', authControll.authorize, roleValidate.isAdmin, carController.updateCar)
app.delete('/:id', authControll.authorize, roleValidate.isAdmin, carController.deleteCar)

module.exports = app