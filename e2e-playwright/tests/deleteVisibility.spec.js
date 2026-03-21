const { test, expect } = require('@playwright/test')

test('only the creator sees the blog delete button', async ({ page }) => {
  const baseUrl = 'http://localhost:3003'
  const appUrl = 'http://localhost:5173'

  const userA = { username: `userA_${Date.now()}`, name: 'User A', password: 'password' }
  const userB = { username: `userB_${Date.now()}`, name: 'User B', password: 'password' }

  // reset test DB if available
  await page.request.post(`${baseUrl}/api/testing/reset`).catch(() => {})

  // create two users
  await page.request.post(`${baseUrl}/api/users`, { data: userA })
  await page.request.post(`${baseUrl}/api/users`, { data: userB })

  // login userA and create a blog as userA via API
  const loginA = await page.request.post(`${baseUrl}/api/login`, { data: { username: userA.username, password: userA.password } })
  const bodyA = await loginA.json()
  const tokenA = bodyA.token

  const blog = { title: `creator-visible-${Date.now()}`, author: 'Author', url: 'http://example.com' }
  await page.request.post(`${baseUrl}/api/blogs`, { data: blog, headers: { Authorization: `Bearer ${tokenA}` } })

  // Visit app and simulate logged-in userA via localStorage
  await page.goto(appUrl)
  await page.evaluate((user, token) => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify({ token, username: user.username, name: user.name }))
  }, userA, tokenA)
  await page.reload()

  const blogCard = page.locator('div', { hasText: blog.title }).first()
  await blogCard.locator('button', { hasText: 'view' }).click()
  await expect(blogCard.locator('button', { hasText: 'remove' })).toBeVisible()

  // Now simulate logging in as userB and ensure remove is not visible
  const loginB = await page.request.post(`${baseUrl}/api/login`, { data: { username: userB.username, password: userB.password } })
  const bodyB = await loginB.json()
  const tokenB = bodyB.token

  await page.evaluate((user, token) => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify({ token, username: user.username, name: user.name }))
  }, userB, tokenB)
  await page.reload()

  const blogCardB = page.locator('div', { hasText: blog.title }).first()
  await blogCardB.locator('button', { hasText: 'view' }).click()
  await expect(blogCardB.locator('button', { hasText: 'remove' })).toHaveCount(0)
})
