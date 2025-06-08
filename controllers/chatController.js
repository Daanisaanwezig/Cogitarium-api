const chatService = require('../services/llm/chat')

exports.chat = async (req, res, next) => {
    const { message } = req.body
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')
    
    const response = await chatService.chat(message)
    for await (const part of response) {
        res.write(part.message.content)
    }
    res.end()
}