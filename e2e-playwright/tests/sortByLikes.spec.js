const { test, expect } = require('@playwright/test')

test('blogs are ordered by likes (most first)', async ({ page }) => {
  const baseUrl = 'http://localhost:3003'
  const appUrl = 'http://localhost:5173'

  // reset DB if endpoint exists
  await page.request.post(`${baseUrl}/api/testing/reset`).catch(() => {})

  const user = { username: `sortuser_${Date.now()}`, name: 'Sort User', password: 'password' }
  await page.request.post(`${baseUrl}/api/users`, { data: user })

  // login to get token
  const login = await page.request.post(`${baseUrl}/api/login`, { data: { username: user.username, password: user.password } })
  const loginBody = await login.json()
  const token = loginBody.token

  // create blogs with different likes
  const runId = Date.now()
  const blogs = [
    { title: `sort-test-${runId}-A`, author: 'A', url: 'http://a.example', likes: 5 },
    { title: `sort-test-${runId}-B`, author: 'B', url: 'http://b.example', likes: 12 },
    { title: `sort-test-${runId}-C`, author: 'C', url: 'http://c.example', likes: 3 }
  ]

  for (const b of blogs) {
    await page.request.post(`${baseUrl}/api/blogs`, { data: b, headers: { Authorization: `Bearer ${token}` } })
  }

  // verify blogs exist on the backend
  const allRes = await page.request.get(`${baseUrl}/api/blogs`)
  const allBlogs = await allRes.json()
  const created = allBlogs.filter(b => b.title && b.title.includes(String(runId)))
  expect(created.length).toBe(blogs.length)

  // Visit app as logged-in user
  await page.goto(appUrl)
  await page.evaluate(({ user, token }) => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify({ token, username: user.username, name: user.name }))
  }, { user, token })
  await page.reload()
  // wait for the app to fetch blogs from the backend
  try {
    await page.waitForResponse(r => r.url().includes('/api/blogs') && r.request().method() === 'GET', { timeout: 5000 })
  } catch (e) {}
  // click the "view" button for each created blog so likes are visible
  await page.evaluate((runId) => {
    const nodes = Array.from(document.querySelectorAll('*'))
      .filter(el => el.innerText && el.innerText.includes('sort-test-' + runId))
    nodes.forEach(el => {
      try {
        let ancestor = el
        for (let i = 0; i < 6 && ancestor; i++) {
          const view = Array.from(ancestor.querySelectorAll('button')).find(b => /view/i.test(b.innerText))
          if (view) { view.click(); break }
          ancestor = ancestor.parentElement
        }
      } catch (e) {}
    })
  }, runId)

  // collect card texts now that likes are visible
  const cardTexts = await page.evaluate((runId) => {
    const matches = []
    const nodes = Array.from(document.querySelectorAll('*'))
    const seen = new Set()
    nodes.forEach(el => {
      try {
        if (!el.innerText) return
        if (!el.innerText.includes('sort-test-' + runId)) return
        let ancestor = el
        for (let i = 0; i < 6 && ancestor; i++) {
          if (ancestor.querySelector && ancestor.querySelector('button')) break
          ancestor = ancestor.parentElement
        }
        if (!ancestor) return
        const text = ancestor.innerText
        if (seen.has(text)) return
        seen.add(text)
        matches.push(text)
      } catch (e) {}
    })
    return matches
  }, runId)

  const likesList = cardTexts.map(text => {
    const m = text.match(/likes\s*(\d+)/i)
    return m ? parseInt(m[1], 10) : 0
  })
  expect(likesList.length).toBeGreaterThan(0)

  // assert likesList is sorted descending
  for (let i = 0; i < likesList.length - 1; i++) {
    expect(likesList[i]).toBeGreaterThanOrEqual(likesList[i + 1])
  }
})
