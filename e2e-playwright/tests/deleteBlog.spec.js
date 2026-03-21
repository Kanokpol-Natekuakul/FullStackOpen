const { test, expect } = require('@playwright/test')

const uniqueTitle = `Blog to delete ${Date.now()}`
const uniqueUser = `user${Date.now()}`

test.describe('When logged in', () => {
  test.beforeEach(async ({ page, request }) => {
    try {
      await request.post('http://localhost:3003/api/testing/reset')
    } catch (e) {
      // ignore if reset endpoint not available
    }

    const newUser = { username: uniqueUser, name: 'Superuser', password: 'sekret' }
    try {
      await request.post('http://localhost:3003/api/users', { data: newUser })
    } catch (e) {
      // ignore
    }

    const loginResp = await request.post('http://localhost:3003/api/login', { data: { username: uniqueUser, password: 'sekret' } })
    const body = await loginResp.json()
    const token = body.token

    const blog = { title: uniqueTitle, author: 'E2E', url: 'http://delete.example', likes: 0 }
    await request.post('http://localhost:3003/api/blogs', {
      data: blog,
      headers: { Authorization: `Bearer ${token}` },
    })

    await page.goto('http://localhost:5173')
    await page.evaluate(([user]) => {
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    }, [{ token, username: uniqueUser, name: 'Superuser' }])
    await page.reload()
  })

  test('creator can delete their blog', async ({ page, request }) => {
    const blogCard = page.locator('div', { hasText: uniqueTitle }).first()
    await expect(blogCard).toBeVisible()

    // reveal details by clicking the view button inside the card
    await blogCard.locator('button', { hasText: 'view' }).first().click()

    // accept the confirm dialog when clicking remove
    page.on('dialog', async dialog => { await dialog.accept() })

    // click the remove button inside the same card and wait for DELETE response
    const deleteResponsePromise = page.waitForResponse(r => r.url().includes('/api/blogs') && r.request().method() === 'DELETE')
    await blogCard.locator('button', { hasText: 'remove' }).first().click()

    const deleteResponse = await deleteResponsePromise
    // expect successful deletion (204 or 200)
    expect([200, 204]).toContain(deleteResponse.status())

    // verify via backend that the blog no longer exists
    let stillExists = true
    for (let i = 0; i < 10; i++) {
      const resp = await request.get('http://localhost:3003/api/blogs')
      const blogs = await resp.json()
      stillExists = blogs.some(b => b.title === uniqueTitle)
      if (!stillExists) break
      await new Promise(r => setTimeout(r, 200))
    }
    expect(stillExists).toBeFalsy()
  })
})
