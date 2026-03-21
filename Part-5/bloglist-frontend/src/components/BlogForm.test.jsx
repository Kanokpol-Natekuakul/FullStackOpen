import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, test, expect, vi, afterEach } from 'vitest'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  afterEach(() => cleanup())

  test('calls createBlog with correct details when a new blog is created', async () => {
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const inputs = screen.getAllByRole('textbox')
    const titleInput = inputs[0]
    const authorInput = inputs[1]
    const urlInput = inputs[2]
    const createButton = screen.getByText('create')

    fireEvent.change(titleInput, { target: { value: 'New Blog Title' } })
    fireEvent.change(authorInput, { target: { value: 'Jane Doe' } })
    fireEvent.change(urlInput, { target: { value: 'http://blog.example' } })

    fireEvent.click(createButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'New Blog Title',
      author: 'Jane Doe',
      url: 'http://blog.example',
    })
  })
})
