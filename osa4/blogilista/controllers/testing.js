const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
    console.log("RESETTING TEST DB")
    console.log("---")
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
})

module.exports = router
