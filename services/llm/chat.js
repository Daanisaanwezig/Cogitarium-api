const { Ollama } = require('ollama')

exports.chat = async (messageContent) => {
    return new Promise(async (resolve, reject) => {
        const ollama = new Ollama()
        // TODO: Add system prompt
        // TODO: Add chat id for chat history
        const message = { role: 'user', content: messageContent }
        const response = await ollama.chat({ model: 'gemma3:1b', messages: [message], stream: true }).catch(error => {
            return reject(error)
        })

        return resolve(response)
    })
}