require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const models = require('./models/models')
const path = require('path')
const sequelize = require('./db')
const errormidl = require('./middlewares/error-middelware')

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors({   
    credentials: true, 
    origin: 'http://localhost:3000' 
}))
app.use(express.json({ extended: true}))
app.use(fileUpload({}))
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/api', require('./routes/index'))
app.use(errormidl)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start().catch(console.dir)