const { test, expect, beforeEach, describe } = require('@playwright/test')
const {text} = require("stream/consumers");

describe('Bloglist app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const locator = await page.getByText('Login').first()
        await expect(locator).toBeVisible()
        await expect(page.getByText('username')).toBeVisible()
        await expect(page.getByText('password')).toBeVisible()
        await expect(page.getByRole('textbox').first()).toBeVisible()
        await expect(page.getByRole('textbox').last()).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByRole('textbox').first().fill('mluukkai')
            await page.getByRole('textbox').last().fill('salainen')
            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByRole('textbox').first().fill('mluukkai')
            await page.getByRole('textbox').last().fill('väärä')
            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByText('wrong credentials')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({page}) => {
            await page.getByRole('textbox').first().fill('mluukkai')
            await page.getByRole('textbox').last().fill('salainen')
            await page.getByRole('button', {name: 'login'}).click()
        })

        const addBlog = async (page, author, title, url) => {
            await page.getByRole('button', {name: 'Add blog'}).click()
            const textboxes = await page.getByRole('textbox').all()
            await textboxes[0].fill(author)
            await textboxes[1].fill(title)
            await textboxes[2].fill(url)
            await page.getByRole('button', {name: 'Add blog'}).click()
        }

        test('a new blog can be created', async ({page}) => {
            await addBlog(page, "Matti Meikäläinen", "Matin blogi", "matti.com")
            await expect(page.getByText('A new blog Matin blogi by Matti Meikäläinen added')).toBeVisible()
            await expect(page.locator('div.blog', { hasText: 'Matin blogi by Matti Meikäläinen'})).toBeVisible()
        })

        test('a blog can be liked', async ({page}) => {
            await addBlog(page, "Matti Meikäläinen", "Matin blogi", "matti.com")
            const locator = await page.locator('div.blog', {hasText: "Matin blogi by Matti Meikäläinen"})
            await locator.getByRole('button', {name: 'show'}).click()
            await locator.getByRole('button', {name: 'like'}).click()
            await expect(page.getByText('1 votes')).toBeVisible()
        })

        describe('With some blogs added', () => {
            beforeEach(async({page}) => {
                const addBlogWithVotes = async (author, title, url, votes) => {
                    await addBlog(page, author, title, url)
                    const locator = await page.locator('div.blog', {hasText: `${title} by ${author}`})
                    await locator.getByRole('button', {name:'show'}).click()
                    for(let i = 0; i < votes; i++){
                        await locator.getByRole('button', {name: 'like'}).click()
                    }
                }
                await addBlogWithVotes("Matti Meikäläinen", "Matin blogi", "matti.com", 3)
                await addBlogWithVotes("Ada Lovelace", "Analytical Engine", "https://www.britannica.com/biography/Ada-Lovelace", 12)
                await addBlogWithVotes("Matti Meikäläinen", "Matin toinen blogi", "mattii.com", 7)
            })

            test('only blog creator can see remove button and blog can be deleted', async ({page, request}) => {
                await request.post('http://localhost:3003/api/users', {
                    data: {
                        name: 'Maija Meikäläinen',
                        username: 'maija',
                        password: 'salainen'
                    }
                })
                await page.getByRole('button', { name: 'log out' }).click()
                await page.getByRole('textbox').first().fill('maija')
                await page.getByRole('textbox').last().fill('salainen')
                await page.getByRole('button', { name: 'login' }).click()
                await page.getByText('Maija Meikäläinen logged in')
                await addBlog(page, "Maija Meikäläinen", "Maijan blogi", "maija.com")

                const locator = await page.locator('div.blog', {hasText: "Matin blogi by Matti Meikäläinen"})
                await locator.getByRole('button', {name: 'show'}).click()
                await expect(locator.getByRole('button', {name: 'remove'})).toHaveCount(0)

                const locator2  = await page.locator('div.blog', {hasText: "Maijan blogi by Maija Meikäläinen"})
                await locator2.getByRole('button', {name: 'show'}).click()
                const delButton = locator2.getByRole('button', {name: 'remove'})
                await expect(delButton).toBeVisible()
                page.on('dialog', dialog => dialog.accept())
                await delButton.click()

                const locator3  = await page.locator('div.blog', {hasText: "Maijan blogi by Maija Meikäläinen"})
                await expect(locator3).toHaveCount(0)
            })

            test('blogs are sorted by votes with most votes first', async ({page}) => {
                const blogs = await page.locator('.blog').all()
                const blogData = []
                for (const blog of blogs) {
                    const title = await blog.locator('text=by').first().innerText()
                    const votes = await blog.locator('text=votes').first().innerText()
                    const voteCount = parseInt(votes.match(/\d+/)[0], 10)
                    blogData.push({ title, voteCount })
                }
                const sortedBlogData = [...blogData].sort((a, b) => b.voteCount - a.voteCount)
                expect(blogData).toEqual(sortedBlogData)
            })
        })
    })
})
