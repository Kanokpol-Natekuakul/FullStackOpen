import { Link } from 'react-router-dom'

const blogStyle = {
  border: '1px solid #ccc', padding: '0.5rem', marginBottom: '0.5rem'
}

const Blog = ({ blog }) => (
  <div style={blogStyle}>
    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> — {blog.author}
  </div>
)

export default Blog
