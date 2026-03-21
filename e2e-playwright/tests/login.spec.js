const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // try to reset backend database (some backends expose this in tests)
    try {
      await request.post('http://localhost:3003/api/testing/reset')
    } catch (e) {
      // ignore if not available
    }

    // create a user for the tests (via backend API)
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'sekret',
    }

    try {
      await request.post('http://localhost:3003/api/users', { data: newUser })
    } catch (e) {
      // if the API call fails, tests may still proceed depending on environment
      console.warn('Could not create user via API:', e.message)
    }

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('text=Log in to application')).toBeVisible()
    await expect(page.locator('button:text("login")')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.fill('input[name="Username"]', 'root')
      await page.fill('input[name="Password"]', 'sekret')
      await page.click('button:text("login")')

      await expect(page.locator('text=blogs')).toBeVisible()
      await expect(page.locator('text=logout')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.fill('input[name="Username"]', 'root')
      await page.fill('input[name="Password"]', 'wrong')
      await page.click('button:text("login")')

      await expect(page.locator('text=wrong username or password')).toBeVisible()
      // also ensure that blogs are not shown
      await expect(page.locator('text=blogs')).not.toBeVisible()
    })
  })
})
