const db = require('../config/db')

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

exports.create = (title, description) => {
    const sqlQuery = 'INSERT INTO ideas (title, description) VALUES ($1, $2) RETURNING *'
    const params = [title, description]
    return db.query(sqlQuery, params)
}

exports.update = (id, title, description) => {
    const sqlQuery = 'UPDATE ideas SET title = $1, description = $2 WHERE id = $3 RETURNING *'
    const params = [title, description, id]
    return db.query(sqlQuery, params)
}

exports.delete = (id) => {
    const sqlQuery = 'DELETE FROM ideas WHERE id = $1 RETURNING *'
    const params = [id]
    return db.query(sqlQuery, params)
}