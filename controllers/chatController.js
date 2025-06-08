const chatService = require('../services/llm/chat')

exports.chat = async (req, res, next) => {
    let { chatId, message } = req.body
    
    if (!chatId) {
        chatId = chatService.generateChatId()
    }
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')

    let { response, messages } = await chatService.chat(chatId, message)
    const assistantMessage = { role: 'assistant', content: '' }

    res.write(JSON.stringify({ chatId }) + '\n')

    for await (const part of response) {
        res.write(part.message.content)
        assistantMessage.content += part.message.content
    }
    messages.push(assistantMessage)
    await chatService.saveChat(chatId, messages)
    res.end()
}