const ideaService = require('../services/ideaService')

exports.getAllIdeas = async (req, res, next) => {
    ideaService.fetchAll().then(ideas => {
        res.json(ideas.rows)
    }).catch(error => {
        res.status(500).json(error)
    })
}

exports.getIdea = async(req, res, next) => {
    const { id } = req.body
    ideaService.fetch(id).then(ideas => {
        res.json(ideas.rows)
    }).catch(error => {
        res.status(500).json(error)
    })
}

exports.createIdea = async(req, res, next) => {
    const { title, description } = req.body
    ideaService.create(title, description).then(idea => {
        res.status(201).json(idea.rows)
    }).catch(error => {
        res.status(500).json(error)
    })
}

exports.updateIdea = async(req, res, next) => {
    const {id, title, description} = req.body
    ideaService.update(id, title, description).then(idea => {
        res.json(idea)
    }).catch(error => {
        res.status(500).json(error)
    })
}

exports.deleteIdea = async(req, res, next) => {
    const {id} = req.body
    ideaService.delete(id).then(idea => {
        res.json(idea)
    }).catch(error => {
        res.status(500).json(error)
    })
}