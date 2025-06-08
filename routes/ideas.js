const express = require('express')
const router = express.Router()
const ideasController = require('../controllers/ideasController')

router.get('/', ideasController.getAllIdeas)
router.get('/:id', ideasController.getIdea)
router.post('/', ideasController.createIdea)
router.put('/:id', ideasController.updateIdea)
router.delete('/:id', ideasController.deleteIdea)
router.post('/search', ideasController.search)
router.post('/advanced-search', ideasController.advancedSearch)


module.exports = router