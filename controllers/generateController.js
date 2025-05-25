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

exports.vectorSearch = async (req, res, next) => {
    const { query } = req.body
    llmService.vectorSearch(query).then(results => {
        res.json(results.rows)
    }).catch(error => {
        res.status(500).json(error)
    })
}

exports.advancedSearch = async (req, res, next) => {
    const { query } = req.body
    llmService.generateSimilarSearchQueries(query).then(async queries => {
        const results = await llmService.querySimilarSearchQueries(queries)
        res.json(results)
    }).catch(error => {
        res.status(500).json(error)
    })
}