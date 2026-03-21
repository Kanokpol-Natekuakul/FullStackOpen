import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import Blog from './Blog'

describe('Blog component', () => {
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
})
