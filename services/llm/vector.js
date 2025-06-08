const db = require('../../utils/db')

exports.vectorSearch = async (embedding, topK = 10) => {
    return new Promise(async (resolve, reject) => {
        const sqlQuery = `
                SELECT id, title, description, metadata,
                embedding <=> $1::vector AS similarity
                FROM ideas
                ORDER BY similarity
                LIMIT $2;
            `
        
        const params = [`[${embedding.join(',')}]`, topK]
    
        db.query(sqlQuery, params).then(results => {
            results.rows.forEach(row => {
                row.similarity = convertSimilarityToPercentage(row.similarity)
            })
            return resolve(results.rows)
        }).catch(error => {
            console.error('Failed to do a similarity search on the database...', error);
            return reject('Failed to do a similarity search on the database...')
        })
    })
}

function convertSimilarityToPercentage(similarity) {
    const similarityScore = 1 - similarity;
    return (similarityScore * 100).toFixed(2);
}