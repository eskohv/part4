const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user',{ username: 1, name: 1 })

    response.json(blogs)

})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if(blog) {
        response.json(blog.toJSON())
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
    const blog = request.body
    const token = await request.token

    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
        return response.status(401).json( { error: 'token missing or invalid' })
    }

    if(!blog.title || !blog.url){
        response.send(400)
    }

    const user = await User.findById(decodedToken.id)

    const newBlog =  new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes || 0,
        user: user._id
    })

    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog)
    await user.save()

    response.json(savedBlog.toJSON())


})

blogsRouter.delete('/:id',async (request, response) => {
    const token = request.token

    const decodedToken = jwt.verify(token, process.env.SECRET)

    if(!token || !decodedToken) {
        return response.status(401).json( { error: 'token missing or invalid' })
    }

    const blogId = request.params.id
    const blog = await Blog.findById( blogId )

    if(blog.user.toString() === decodedToken.id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }

})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
})


module.exports = blogsRouter