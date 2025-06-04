const llmService = require('../services/llmService')

exports.generateIdeas = async (req, res, next) => {
    try {
        const { prompt, existingIdeas } = req.body
        const generated = await llmService.generate({ prompt, existingIdeas })
        const response = {
            data: generated,
            status: 200
        }
        res.json(response)
    } catch (err) {
        next(err)
    }
}

exports.createEmbeddings = async (req, res, next) => {
    llmService.createEmbeddings().then(() => {
        const response = {
            data: null,
            status: 200
        }
        res.json(response)
    }).catch(error => {
        next(error)
    })
}

exports.vectorSearch = async (req, res, next) => {
    const { query } = req.body
    llmService.vectorSearch(query).then(results => {
        const response = {
            data: results.rows,
            status: 200
        }
        res.json(response)
    }).catch(error => {
        next(error)
    })
}

exports.advancedSearch = async (req, res, next) => {
    const { query } = req.body
    llmService.generateSimilarSearchQueries(query).then(async queries => {
        const results = await llmService.querySimilarSearchQueries(queries)
        const response = {
            data: results,
            status: 200
        }
        res.json(response)
    }).catch(error => {
        next(error)
    })
}

exports.summary = async (req, res, next) => {
    const { query } = req.body
    llmService.generateSummary(query).then(result => {
        console.log(result);
        const response = {
            data: result,
            status: 200
        }
        res.json(response)
    }).catch(error => {
        next(error)
    })
}