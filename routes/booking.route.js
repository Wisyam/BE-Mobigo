const express = require(`express`)
const bookController = require(`../controllers/booking.controller`)
const app = express()
app.use(express.json())
const authControll = require('../controllers/auth.controller')
const roleValidate = require('../middleware/role.validation')

app.get('/', authControll.authorize, roleValidate.isAdmin, bookController.getAllBooking)
// app.post('/cektanggal', bookController.cektanggal)
app.post('/', authControll.authorize, roleValidate.isUser, bookController.addBooking)
// app.put('/verify', authControll.authorize, roleValidate.isAdmin, bookController.verifyPemesanan)
// app.put('/cancel', authControll.authorize, roleValidate.isAdmin, bookController.cancelPemesanan)
app.put('/', authControll.authorize, roleValidate.isAdmin, bookController.pengembalianMobil)

// history active
app.get('/historyUser', authControll.authorize, bookController.historyUser)

// history non-active
app.get('/historyoff', authControll.authorize, bookController.historyUserNo)



app.get('/historyAdmin', authControll.authorize, roleValidate.isAdmin, bookController.historyAdmin)


module.exports = app