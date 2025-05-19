const ollama = require('ollama')
const db = require('../config/db')

exports.generate = async () => {

}

exports.createEmbeddings = async () => {
    return new Promise(async (resolve, reject) => {
        const sqlQuery = 'SELECT id, title, description FROM ideas WHERE embedding IS NULL;'
        const params = []
        const result = await db.query(sqlQuery, params)
        
        if (result.rows.length === 0) {
            // TODO: Add proper error handling
            console.log('Nothing found...')
            return reject()
        }
    
        for (let row of result.rows) {
            const { id, title, description } = row
            const combinedText = `${title}\n\n${description}`
            const metadata = {
                title: title,
                description: description
            }
            const response = await fetch('http://localhost:11434/api/embeddings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'nomic-embed-text',
                    prompt: combinedText
                })
            })
            const result = await response.json()
            let embedding = result.embedding
            const vectorString = `[${embedding.join(',')}]`
            
            const sqlQuery = 'UPDATE ideas SET embedding = $1, metadata = $2 WHERE id = $3'
            const params = [vectorString, metadata, id]
            
            await db.query(sqlQuery, params)
        }
        return resolve()
    })
}