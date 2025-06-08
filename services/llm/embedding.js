const db = require('../../utils/db')
const { Ollama } = require('ollama')

exports.getIdeasWithoutEmbeddings = async () => {
    const sqlQuery = 'SELECT id, title, description FROM ideas WHERE embedding IS NULL;'
    const params = []
    const result = await db.query(sqlQuery, params)

    return result
}

exports.generateEmbeddingForText = (text) => {
    return new Promise(async (resolve, reject) => {
        const ollama = new Ollama()
        const response = await ollama.embed({ model: 'nomic-embed-text:latest', input: text})
        
        return resolve(response.embeddings)
    })
}

exports.saveEmbedding = async (id, embedding, metadata) => {
    const vectorString = `[${embedding.join(',')}]`
    const sqlQuery = 'UPDATE ideas SET embedding = $1, metadata = $2 WHERE id = $3'
    const params = [vectorString, metadata, id]

    await db.query(sqlQuery, params)
}

exports.updateMissingEmbeddings = async () => {
    const ideas = await this.getIdeasWithoutEmbeddings()

    for (const idea of ideas) {
        const { id, title, description } = idea
        const combinedText = `${title}\n\n${description}`
        const metadata = {
            title: title,
            description: description
        }
        const embedding = await this.generateEmbeddingForText(combinedText)
        this.saveEmbedding(id, embedding, metadata)
    }
}