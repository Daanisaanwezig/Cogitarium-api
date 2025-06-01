require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./config/db')

const ideasRouter = require('./routes/ideas')
const generateRouter = require('./routes/generate')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(bodyParser.json())

db.connect()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('DB connection error:', err))

// Mount routers
app.use('/api/ideas', ideasRouter)
app.use('/api/generate', generateRouter)

// Global error handler
app.use((error, req, res, next) => {
    console.error(error.stack)
    const response = {
        data: null,
        error: error.stack,
        status: 500
    }
    res.status(500).json(response)
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))