const express = require('express')
const router = express.Router()
const vectorController = require('../controllers/vectorController')

router.post('/', vectorController.vectorSearch)

module.exports = router