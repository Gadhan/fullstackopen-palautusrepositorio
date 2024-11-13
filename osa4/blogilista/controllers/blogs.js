const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const {request} = require("express")
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)

    if(request.headers.authorization === undefined){
        return response.status(400).json({error: 'no token provided'})
    }
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    blog.user = user.id
    try {
        let savedBlog = await blog.save()
        const responseBody = await Blog.findById(savedBlog.id).populate('user', {username: 1, name: 1, id: 1})
        response.status(201).json(responseBody)
        const user = await User.findById(blog.user)
        user.blogs = user.blogs.concat(savedBlog.id)
        user.save()
    } catch(exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async(request, response, next) => {
    try{
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch(exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    try{
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true}).populate('user', {username: 1, name: 1, id: 1})
        response.json(updatedBlog)
    }catch(exception) {
        next(exception)
    }
})

module.exports = blogsRouter
