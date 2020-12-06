const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
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
    const blog = await new Blog(request.body)
    if(!blog.title || !blog.url){
        response.send(400)
    }

    let newBlog =  {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes || 0
    }
    newBlog = new Blog(newBlog)

    const result = await newBlog.save()

    response.status(201).json(result)


})

blogsRouter.delete('/:id',async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
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