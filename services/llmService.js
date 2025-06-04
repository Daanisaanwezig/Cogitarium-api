const ollama = require('ollama')
const db = require('../config/db')

const SEARCH_QUERY_URL = process.env.SEARCH_QUERY_URL
const SUMMARY_URL= process.env.SUMMARY_URL
const CHAT_URL = process.env.CHAT_URL

exports.generate = async () => {
    // TODO: Add generate call
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

            const embedding = await generateEmbeddings(combinedText)

            const vectorString = `[${embedding.join(',')}]`

            const sqlQuery = 'UPDATE ideas SET embedding = $1, metadata = $2 WHERE id = $3'
            const params = [vectorString, metadata, id]

            await db.query(sqlQuery, params)
        }
        return resolve()
    })
}

exports.vectorSearch = async (searchString, limit = 10) => {
    return new Promise(async (resolve, reject) => {
        const embedding = await generateEmbeddings(searchString)
        
        const sqlQuery = `
            SELECT id, title, description, metadata,
            embedding <=> $1::vector AS similarity
            FROM ideas
            ORDER BY similarity
            LIMIT $2;
        `
        const params = [`[${embedding.join(',')}]`, limit]

        db.query(sqlQuery, params).then(results => {
            results.rows.forEach(row => {
                row.similarity = convertSimilarityToPercentage(row.similarity)
            })

            return resolve(results)
        }).catch(error => {
            console.error('Failed to do a similarity search on the database...', error);
            return reject('Failed to do a similarity search on the database...')
        })
    })
}

exports.generateSimilarSearchQueries = async (queryString) => {
    return new Promise(async (resolve, reject) => {
        query(SEARCH_QUERY_URL, { "question": queryString }).then((results) => {
            console.log(results);
            return resolve(results.split('\n'))
        }).catch(error => {
            console.error('Failed to generate search queries...', error);
            return reject('Failed to generate search queries...')
        })
    })
}

exports.querySimilarSearchQueries = async (searchQueries) => {
    return new Promise(async (resolve, reject) => {
        let results = []
        for (let query of searchQueries) {
            const searchResults = await this.vectorSearch(query)
            for (let result of searchResults.rows) {
                const existing = results.find(item => item.id == result.id)
                if (! existing) {
                    results.push(result)
                } else if (existing.similarity < result.similarity) {
                    existing.similarity = result.similarity
                }
            }
        }
        const sorted = results.sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity));
        return resolve(sorted)
    })
}

exports.generateSummary = async (queryString) => {
    return new Promise(async (resolve, reject) => {
        query(SUMMARY_URL, { "question": queryString }).then((results) => {
            return resolve(results)
        }).catch(error => {
            console.error('Failed to generate search queries...', error);
            return reject('Failed to generate search queries...')
        })
    })
}

exports.chat = async (message) => {
    return new Promise(async (resolve, reject) => {
        query(CHAT_URL, { "question": message }).then((result) => {
            return resolve(result)
        }).catch(error => {
            console.error('Failed to generate response...', error);
            return reject('Failed to generate response...')
        })
    })
}

async function query(url, data) {
    const response = await fetch(
        url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    
    return result.text;
}

function generateEmbeddings(string) {
    return new Promise(async (resolve, reject) => {
        const response = await fetch('http://localhost:11434/api/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'nomic-embed-text',
                prompt: string
            })
        })
        if (!response.ok) return reject('Failed to connect with Ollama...')

        const result = await response.json()
        if (!result.embedding) return reject('No embeddings were found in response from Ollama...')
        return resolve(result.embedding)
    })
}

function convertSimilarityToPercentage(similarity) {
    const similarityScore = 1 - similarity;
    return (similarityScore * 100).toFixed(2);
}