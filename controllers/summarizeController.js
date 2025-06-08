const summarizeService = require('../services/llm/summarize')

exports.summarize = async (req, res, next) => {
    const { query } = req.body

    const summary = await summarizeService.generateSummary(query)
    
    const response = { 
        data: summary,
        status: 200
    }
    res.json(response)
}