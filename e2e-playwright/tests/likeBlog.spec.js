const { test, expect } = require('@playwright/test')

const uniqueTitle = `Blog to like ${Date.now()}`

test.describe('When logged in', () => {
  test.beforeEach(async ({ page, request }) => {
    // reset backend if available
    try {
      await request.post('http://localhost:3003/api/testing/reset')
    } catch (e) {
      // ignore
    }

    // create user
    const newUser = { username: 'root', name: 'Superuser', password: 'sekret' }
    try {
      await request.post('http://localhost:3003/api/users', { data: newUser })
    } catch (e) {
      // ignore
    }

    // login to get token
    const loginResp = await request.post('http://localhost:3003/api/login', { data: { username: 'root', password: 'sekret' } })
    const body = await loginResp.json()
    const token = body.token

    // create a blog via API
    const blog = { title: uniqueTitle, author: 'E2E', url: 'http://like.example', likes: 0 }
    await request.post('http://localhost:3003/api/blogs', {
      data: blog,
      headers: { Authorization: `Bearer ${token}` },
    })

    // navigate to app, set localStorage and reload so app sees the logged user
    await page.goto('http://localhost:5173')
    await page.evaluate(([user]) => {
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    }, [{ token, username: 'root', name: 'Superuser' }])
    await page.reload()
  })

  test('a blog can be liked', async ({ page }) => {
    // ensure the blog is present (use first matching card)
    const firstBlog = page.locator('div', { hasText: uniqueTitle }).first()
    await expect(firstBlog).toBeVisible()

    // reveal details by finding the card in page context and clicking its view button
    await page.evaluate((title) => {
      const cards = Array.from(document.querySelectorAll('div'))
      const card = cards.find(el => el.innerText.includes(title) && el.querySelector('button'))
      const viewBtn = Array.from(card.querySelectorAll('button')).find(b => /view/i.test(b.innerText))
      if (viewBtn) viewBtn.click()
    }, uniqueTitle)

    // read initial likes text from the card
    let likesText = await page.evaluate((title) => {
      const cards = Array.from(document.querySelectorAll('div'))
      const card = cards.find(el => el.innerText.includes(title) && el.querySelector('button'))
      const likesEl = Array.from(card.querySelectorAll('div')).find(d => d.innerText.includes('likes'))
      return likesEl ? likesEl.innerText : ''
    }, uniqueTitle)

    expect(likesText).toContain('0')

    // click like button inside that card
    await page.evaluate((title) => {
      const cards = Array.from(document.querySelectorAll('div'))
      const card = cards.find(el => el.innerText.includes(title) && el.querySelector('button'))
      const likeBtn = Array.from(card.querySelectorAll('button')).find(b => /like/i.test(b.innerText))
      if (likeBtn) likeBtn.click()
    }, uniqueTitle)

    // read likes again
    likesText = await page.evaluate((title) => {
      const cards = Array.from(document.querySelectorAll('div'))
      const card = cards.find(el => el.innerText.includes(title) && el.querySelector('button'))
      const likesEl = Array.from(card.querySelectorAll('div')).find(d => d.innerText.includes('likes'))
      return likesEl ? likesEl.innerText : ''
    }, uniqueTitle)

    expect(likesText).toContain('1')
  })
})
