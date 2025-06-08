const ideaService = require('../services/ideaService')
const embeddingService = require('../services/llm/embedding')
const vectorService = require('../services/llm/vector')
const searchQueryService = require('../services/llm/searchQuery')

exports.getAllIdeas = async (req, res, next) => {
    ideaService.fetchAll().then(ideas => {
        const response = {
            data: ideas.rows,
            status: 200
        }
        res.json(response)
    }).catch(error => {
        next(error)
    })
}

exports.getIdea = async (req, res, next) => {
    const { id } = req.params
    ideaService.fetch(id).then(ideas => {
        const response = {
            data: ideas.rows[0],
            status: 200
        }
        res.json(response)
    }).catch(error => {
        next(error)
    })
}

exports.createIdea = async (req, res, next) => {
    const { title, description } = req.body
    ideaService.create(title, description).then(idea => {
        const response = {
            data: idea.rows,
            status: 201
        }
        res.status(201).json(response)
    }).catch(error => {
        next(error)
    })
}

exports.updateIdea = async (req, res, next) => {
    const { id, title, description } = req.body
    ideaService.update(id, title, description).then(idea => {
        const response = {
            data: idea,
            status: 200
        }
        res.json(response)
    }).catch(error => {
        next(error)
    })
}

exports.deleteIdea = async (req, res, next) => {
    const { id } = req.params
    ideaService.delete(id).then(idea => {
        const response = {
            data: idea,
            status: 200
        }
        res.json(response)
    }).catch(error => {
        next(error)
    })
}

exports.search = async (req, res, next) => {
    const { query } = req.body
    const embedding = await embeddingService.generateEmbeddingForText(query)
    const results = await vectorService.vectorSearch(embedding)

    const response = {
        data: results,
        status: 200
    }
    res.json(response)
}

exports.advancedSearch = async (req, res, next) => {
    const { query } = req.body
    const similarSearchQueries = await searchQueryService.generateSearhQueries(query)

    let results = []
    for (const query of similarSearchQueries) {
        const embedding = await embeddingService.generateEmbeddingForText(query)
        if (embedding.length == 0) {

        } else {
            const result = await vectorService.vectorSearch(embedding)

            const existing = results.find(item => item.id == result.id)

            if (!existing) {
                results.push(result)
            } else if (existing.similarity < result.similarity) {
                existing.similarity = result.similarity
            }
        }
    }
    const sorted = results.sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity))[0]

    const response = {
        data: sorted,
        status: 200
    }
    res.json(response)
}