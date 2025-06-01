const ideaService = require('../services/ideaService')

exports.getAllIdeas = async (req, res, next) => {
    ideaService.fetchAll().then(ideas => {
        const response = {
            data: ideas.rows,
            status: 200
        }
        res.json(response)
    }).catch(error => {
        next(error)
    })
}

exports.getIdea = async(req, res, next) => {
    const { id } = req.params
    ideaService.fetch(id).then(ideas => {
        const response = {
            data: ideas.rows[0],
            status: 200
        }
        res.json(response)
    }).catch(error => {
        next(error)
    })
}

exports.createIdea = async(req, res, next) => {
    const { title, description } = req.body
    ideaService.create(title, description).then(idea => {
        const response = {
            data: idea.rows,
            status: 201
        }
        res.status(201).json(response)
    }).catch(error => {
        next(error)
    })
}

exports.updateIdea = async(req, res, next) => {
    const {id, title, description} = req.body
    ideaService.update(id, title, description).then(idea => {
        const response = {
            data: idea,
            status: 200
        }
        res.json(response)
    }).catch(error => {
        next(error)
    })
}

exports.deleteIdea = async(req, res, next) => {
    const {id} = req.params
    ideaService.delete(id).then(idea => {
        const response = {
            data: idea,
            status: 200
        }
        res.json(response)
    }).catch(error => {
        next(error)
    })
}