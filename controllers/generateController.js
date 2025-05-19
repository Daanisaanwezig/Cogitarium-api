const llmService = require('../services/llmService')

exports.generateIdeas = async (req, res, next) => {
    try {
        const { prompt, existingIdeas } = req.body
        const generated = await llmService.generate({ prompt, existingIdeas })
        res.json(generated)
    } catch (err) {
        next(err)
    }
}

exports.createEmbeddings = async (req, res, next) => {
    llmService.createEmbeddings().then(() => {
        res.sendStatus(200)
    }).catch(error => {
        // TODO: Add handling with reason
        res.status(500).json(error)
    })
}