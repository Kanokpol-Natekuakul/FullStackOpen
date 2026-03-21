const { test, expect, beforeEach } = require('@playwright/test')

test.describe('When logged in', () => {
  beforeEach(async ({ page, request }) => {
    // reset backend (if endpoint exists)
    try {
      await request.post('http://localhost:3003/api/testing/reset')
    } catch (e) {
      // ignore
    }

    // create user
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'sekret',
    }

    try {
      await request.post('http://localhost:3003/api/users', { data: newUser })
    } catch (e) {
      console.warn('Could not create user via API:', e.message)
    }

    await page.goto('http://localhost:5173')

    // login via UI
    await page.fill('input[name="Username"]', 'root')
    await page.fill('input[name="Password"]', 'sekret')
    await page.click('button:text("login")')

    // ensure logged in before tests
    await expect(page.locator('text=blogs')).toBeVisible()
  })

  test('a new blog can be created', async ({ page }) => {
    // open blog creation form
    await page.click('button:text("create new blog")')

    await page.fill('input[name="Title"]', 'E2E created blog')
    await page.fill('input[name="Author"]', 'Playwright')
    await page.fill('input[name="Url"]', 'http://e2e.example')
    await page.click('button:text("create")')

    // notification about created blog should appear
    await expect(page.locator('text=a new blog E2E created blog by Playwright added')).toBeVisible()

    // the new blog should be visible in the list (title + author)
    const matches = await page.locator('text=E2E created blog Playwright').count()
    expect(matches).toBeGreaterThan(0)
  })
})
