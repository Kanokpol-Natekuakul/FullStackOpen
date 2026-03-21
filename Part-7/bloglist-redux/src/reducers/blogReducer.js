import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updated = action.payload
      return state.map(b => b.id === updated.id ? updated : b)
    },
    removeBlog(state, action) {
      return state.filter(b => b.id !== action.payload)
    }
  }
})

export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogSlice.actions

export const initializeBlogs = () => async (dispatch) => {
  const blogs = await blogService.getAll()
  dispatch(setBlogs(blogs))
}

export const createBlog = (newBlog) => async (dispatch) => {
  const created = await blogService.create(newBlog)
  dispatch(appendBlog(created))
  return created
}

export const likeBlog = (blog) => async (dispatch) => {
  const updated = await blogService.update(blog.id, {
    user: blog.user?.id || blog.user?._id || blog.user,
    likes: blog.likes + 1,
    author: blog.author,
    title: blog.title,
    url: blog.url
  })
  dispatch(updateBlog(updated))
}

export const deleteBlog = (blog) => async (dispatch) => {
  await blogService.remove(blog.id)
  dispatch(removeBlog(blog.id))
}

export default blogSlice.reducer
