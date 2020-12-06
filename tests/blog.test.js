const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})
//ex 4.8
describe('application returns the correct', () => {
    test('format (JSON)', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type',/application\/json/ )
    })
    test('number of blogs', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body.length).toBe(helper.initialBlogs.length)
    })
})
//ex 4.9
test('unique identifier property is id', async () => {
    const response = await api.get('/api/blogs')
    await response.body.forEach(blog => {
        expect(blog.id).toBeDefined()
    })
})

//ex 4.10
test('HTTP post increments the total number of blogs', async () => {
    const newBlog = {
        title: 'My First Blog',
        author: 'Eetu S. Kohvakka',
        url: 'http://linkedin.com/in/eskohv',
        likes: 12
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDb()
    expect(response.length).toBe(helper.initialBlogs.length+1)
})

//ex 4.11
test('Posting a blog without likes defaults to 0 likes', async () => {
    const newBlog = {
        title: 'My First Blog',
        author: 'Eetu S. Kohvakka',
        url: 'http://linkedin.com/in/eskohv'
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type',/application\/json/)

})

//ex 4.12
test('Posting a blog without url or title responds with 404', async () => {
    const newBlog = {
        author: 'Eetu S. Kohvakka'
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

//ex 4.13
test('Deleting a single blog responds with status code 204', async () => {
    const initialBlogs = await helper.blogsInDb()
    const blogToDelete = await initialBlogs[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length -1)

    const contents = blogsAtEnd.map(blog => blog.id)

    expect(contents).not.toContain(blogToDelete.id)
})

//ex 4.14

test('Updating an existing note responds with 200 OK', async () => {
    const initialBlogs = await helper.blogsInDb()
    const blogToUpdate = initialBlogs[0]
    const update = {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 28,
        __v: 0
    }
    await api.put(`/api/blogs/${blogToUpdate.id}`)
        .send(update)
        .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const blogAtEnd = blogsAtEnd[0]
    expect(blogAtEnd.likes).toBe(update.likes)

})

afterAll((done) => {
    mongoose.connection.close()
    done()
})