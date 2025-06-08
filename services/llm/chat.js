const { Ollama } = require('ollama')
const db = require('../../utils/db')
const { v4: uuidv4 } = require('uuid')

exports.loadChat = async (chatId) => {
    const result = await db.query('SELECT messages FROM chats WHERE chat_id = $1', [chatId])
    return result.rows[0]?.messages.messages || []
}

exports.saveChat = async (chatId, messages) => {
    const result = await db.query(
        `INSERT INTO chats (chat_id, messages)
         VALUES ($1, $2)
         ON CONFLICT (chat_id)
         DO UPDATE SET messages = $2, updated_at = CURRENT_TIMESTAMP`,
        [chatId, {messages}]
    )
    return result.rowCount > 0
}

exports.chat = async (chatId, messageContent) => {
    return new Promise(async (resolve, reject) => {
        const ollama = new Ollama()
        const messages = await this.loadChat(chatId)
        
        messages.push({ role: 'user', content: messageContent })

        const response = await ollama.chat({ model: 'gemma3:1b', messages: messages, stream: true }).catch(error => {
            return reject(error)
        })

        resolve({ response, messages })
    })
}

exports.generateChatId = () => {
    return uuidv4()
}