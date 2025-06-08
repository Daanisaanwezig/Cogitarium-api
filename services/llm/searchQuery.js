const { Ollama } = require('ollama')
const fs = require('fs')

exports.generateSearhQueries = async (queryString) => {
    return new Promise(async (resolve, reject) => {
        const ollama = new Ollama()

        const file = await fs.readFileSync('./prompts/search-query.txt', 'utf-8');
        
        const system = { role: 'system', content: file }
        const message = { role: 'user', content: queryString }

        const response = await ollama.chat({ model: 'gemma3:1b', messages: [system, message] })

        return resolve(response.message.content.split('\n'))
    })
}