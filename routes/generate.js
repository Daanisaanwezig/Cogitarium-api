const express = require('express')
const router = express.Router()
const generateController = require('../controllers/generateController')
const llmService = require('../services/llmService')

router.post('/', generateController.generateIdeas)

router.get('/generate', generateController.createEmbeddings)
router.post('/search', generateController.vectorSearch)
router.post('/advancedSearch', generateController.advancedSearch)
router.post('/summary', generateController.summary)

module.exports = router