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

        test('a new blog can be created', async ({page}) => {
            await page.getByRole('button', {name: 'Add blog'}).click()
            const textboxes = await page.getByRole('textbox').all()
            await textboxes[0].fill("Matti Meikäläinen")
            await textboxes[1].fill("Matin blogi")
            await textboxes[2].fill("matti.com")
            await page.getByRole('button', {name: 'Add blog'}).click()
            await expect(page.getByText('A new blog Matin blogi by Matti Meikäläinen added')).toBeVisible()
            await expect(page.locator('div.blog', { hasText: 'Matin blogi by Matti Meikäläinen'})).toBeVisible()
        })
    })
})
