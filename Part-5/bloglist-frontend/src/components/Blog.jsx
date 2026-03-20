import { useState } from 'react'

const Blog = ({ blog, handleLike }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

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
        </div>
      )}
    </div>
  )
}

export default Blog
