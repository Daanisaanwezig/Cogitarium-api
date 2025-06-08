const embeddingService = require('../services/llm/embedding')

exports.generateEmbeddings = async (req, res, next) => {
    const { text } = req.body

    embeddingService.generateEmbeddingForText(text).then((embedding) => {
        const response = {
            data: embedding,
            status: 200
        }
        res.json(response)
    }).catch(error => {
        next(error)
    })
}

exports.updateMissingEmbeddings = async (req, res, next) => {
    embeddingService.updateMissingEmbeddings()
    const response = {
        data: '',
        status: 200
    }
    res.json(response)
}