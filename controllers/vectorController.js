const vectorService = require('../services/llm/vector')

exports.vectorSearch = async (req, res, next) => {
    const { embedding } = req.body

    const result = await vectorService.vectorSearch(embedding)
    const response = {
        data: result,
        status: 200
    }
    res.json(response)
}