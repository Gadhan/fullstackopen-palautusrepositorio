const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        author: "Matti Meikalainen",
        title: "Matin blogi",
        url: "matti.com",
        votes: 3
    },
    {
        author: "Testi",
        title: "Testi blogi",
        url: "testinen.net",
        votes: 5
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 2)
})

test('field named id exists for every entry', async () => {
    const response = await api.get('/api/blogs')

    const body = response.body
    const allHaveIds = body.every(blog => blog.id !== undefined)

    assert.strictEqual(allHaveIds, true)
})

test('blogs can be added', async () => {
    const initialState = await api.get('/api/blogs')

    const body = {
        author: "Test",
        title: "Test blog",
        url: "test.url",
        votes: 0
    }

    await api
        .post('/api/blogs')
        .send(body)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialState.body.length + 1)
})

test('blog can be deleted', async () => {
    const initialState = await api.get('/api/blogs')
    const blogToDelete = initialState.body[0]
    await api
        .delete('/api/blogs/' + blogToDelete.id)
        .expect(204)

    const finalState = await api.get('/api/blogs')

    assert(!finalState.body.includes(blogToDelete))
})

test('if no votes is given, default to 0', async () => {
    const body = {
        author: "Test",
        title: "No votes",
        url: "NoVotes.com"
    }

    let votesField

    await api
        .post('/api/blogs')
        .send(body)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .expect(function(res){
            votesField = res.body.votes
        })

    assert(votesField === 0)
})

test('if no title or url is given, receive 400 bad request', async () => {
    const noTitle = {
        author: "Test",
        url: "NoTitle.com"
    }

    const noUrl = {
        author: "Test",
        title: "No URL"
    }

    await api
        .post('/api/blogs')
        .send(noTitle)
        .expect(400)

    await api
        .post('/api/blogs')
        .send(noUrl)
        .expect(400)
})

test.only('blogs can be updated', async () => {
    const initialState = await api.get('/api/blogs')
    const blogToUpdate = initialState.body[0]
    const newBlog = {
        author: blogToUpdate.author,
        title: blogToUpdate.title,
        url: blogToUpdate.url,
        votes: blogToUpdate.votes + 1
    }

    await api
        .put('/api/blogs/' + blogToUpdate.id)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const finalState = await api.get('/api/blogs')

    assert.strictEqual(finalState.body[0].votes, blogToUpdate.votes + 1)
})

after(async () => {
    await mongoose.connection.close()
})


