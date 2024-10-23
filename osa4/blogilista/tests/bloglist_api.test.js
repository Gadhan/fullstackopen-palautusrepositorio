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
test.only('field named id exists for every entry', async () => {
    const response = await api.get('/api/blogs')

    const body = response.body
    const allHaveIds = body.every(blog => blog.id !== undefined)

    assert.strictEqual(allHaveIds, true)
})

after(async () => {
    await mongoose.connection.close()
})


