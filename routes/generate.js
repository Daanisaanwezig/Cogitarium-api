const express = require('express')
const router = express.Router()
const generateController = require('../controllers/generateController')
const llmService = require('../services/llmService')

router.post('/', generateController.generateIdeas)

router.get('/generate', generateController.createEmbeddings)

module.exports = router