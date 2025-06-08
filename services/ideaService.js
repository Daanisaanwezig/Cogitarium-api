const db = require('../utils/db')
const embeddingService = require('./llm/embedding')

exports.fetchAll = () => {
    const sqlQuery = 'SELECT * FROM ideas'
    const params = []
    return db.query(sqlQuery, params)
}

exports.fetch = (id) => {
    const sqlQuery = 'SELECT * FROM ideas WHERE id = $1'
    const params = [id]
    return db.query(sqlQuery, params)
}

exports.create = async (title, description) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = 'INSERT INTO ideas (title, description) VALUES ($1, $2) RETURNING *'
        const params = [title, description]
        db.query(sqlQuery, params).then(async idea => {
            await embeddingService.updateMissingEmbeddings()
            return resolve(idea)
        }).catch((error) => {
            return reject(error)
        })
    })
}

exports.update = (id, title, description) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = 'UPDATE ideas SET title = $1, description = $2, embedding = NULL, metadata = NULL WHERE id = $3 RETURNING *'
        const params = [title, description, id]
        db.query(sqlQuery, params).then(async idea => {
            await embeddingService.updateMissingEmbeddings()
            return resolve(idea)
        }).catch((error) => {
            return reject(error)
        })
    })
}

exports.delete = (id) => {
    const sqlQuery = 'DELETE FROM ideas WHERE id = $1 RETURNING *'
    const params = [id]
    return db.query(sqlQuery, params)
}