const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

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

after(async () => {
    await mongoose.connection.close()
})


