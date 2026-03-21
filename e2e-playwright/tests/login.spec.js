const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    // check that the login heading is visible
    await expect(page.locator('text=Log in to application')).toBeVisible()
    // and the login button is visible
    await expect(page.locator('button:text("login")')).toBeVisible()
  })
})
