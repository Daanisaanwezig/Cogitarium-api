const express = require('express')
const router = express.Router()
const embeddingsController = require('../controllers/embeddingController')

router.post('/get', embeddingsController.generateEmbeddings)
router.get('/generateMissing', embeddingsController.updateMissingEmbeddings)

module.exports = router