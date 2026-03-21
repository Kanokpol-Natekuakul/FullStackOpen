import React, { useState } from 'react'

const Blog = ({ blog, currentUser, handleLike, handleDelete }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const canRemove = blog.user?.username === currentUser?.username

  const blogStyle = {
    paddingTop: 10,
    paddingRight: 8,
    paddingBottom: 10,
    paddingLeft: 8,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 8,
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button
          type="button"
          onClick={() => setDetailsVisible(visible => !visible)}
        >
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>
      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button type="button" onClick={() => handleLike(blog)}>
              like
            </button>
          </div>
          <div>{blog.user?.name || blog.user?.username}</div>
          {canRemove && (
            <div>
              <button type="button" onClick={() => handleDelete(blog)}>
                remove
              </button>
            </div>
          )}
        cd e2e-playwright
        npx playwright test        </div>
      )}
    </div>
  )
}

export default Blog
