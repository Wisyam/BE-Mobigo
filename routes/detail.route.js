const express = require('express')
const detailControleer = require('../controllers/details.controller')
const authControll = require('../controllers/auth.controller')
const roleValidate = require('../middleware/role.validation')

const app = express()
app.use(express.json())

app.get('/', authControll.authorize, roleValidate.isAdmin, detailControleer.getAllDetails) // get all

// car detail
app.get('/car', authControll.authorize, roleValidate.isAdmin, detailControleer.carSigma)

// detail clicked 
app.post('/details', authControll.authorize, roleValidate.isAdmin, detailControleer.carDetails)
app.delete('/:id', authControll.authorize, roleValidate.isAdmin, detailControleer.deleteBook)
module.exports = app
