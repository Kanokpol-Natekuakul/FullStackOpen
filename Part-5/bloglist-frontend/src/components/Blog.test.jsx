import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, test, expect, vi, afterEach } from 'vitest'
import Blog from './Blog'

describe('Blog component', () => {
  afterEach(() => cleanup())
  test('shows url and number of likes when the view button is clicked', () => {
    const blog = {
      title: 'Test Title',
      author: 'Tester',
      url: 'http://example.com',
      likes: 7,
      user: { username: 'user1', name: 'User One' },
    }

    render(
      <Blog
        blog={blog}
        currentUser={{ username: 'user1' }}
        handleLike={() => {}}
        handleDelete={() => {}}
      />
    )

    // URL and likes should not be visible initially
    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(`likes ${blog.likes}`)).toBeNull()

    // Click the 'view' button to show details
    fireEvent.click(screen.getByText('view'))

    // URL and likes should now be visible
    expect(screen.getByText(blog.url)).toBeDefined()
    expect(screen.getByText(`likes ${blog.likes}`)).toBeDefined()
  })

  test('calls event handler twice when like button is clicked twice', () => {
    const blog = {
      title: 'Test Title',
      author: 'Tester',
      url: 'http://example.com',
      likes: 7,
      user: { username: 'user1', name: 'User One' },
    }

    const likeHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        currentUser={{ username: 'user1' }}
        handleLike={likeHandler}
        handleDelete={() => {}}
      />
    )

    // show details first
    fireEvent.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(likeHandler).toHaveBeenCalledTimes(2)
  })
})
