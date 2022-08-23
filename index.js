require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors({   
	credentials: true, 
	origin: 'http://localhost:3000' 
}))
app.use(express.json({ extended: true}))
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/api', require('./routes/index'))

const start = async () => { 
	try {
		app.listen(PORT, () => console.log('Server started on port ' + PORT))
	} catch (e) {
		console.log(e.message)
	}
}

start().catch(console.dir)