import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

export const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}

export const getAll = () => axios.get(baseUrl).then(r => r.data)
export const getOne = (id) => axios.get(`${baseUrl}/${id}`).then(r => r.data)
export const create = (blog) => axios.post(baseUrl, blog, { headers: { Authorization: token } }).then(r => r.data)
export const update = (id, blog) => axios.put(`${baseUrl}/${id}`, blog).then(r => r.data)
export const remove = (id) => axios.delete(`${baseUrl}/${id}`, { headers: { Authorization: token } })
export const addComment = (id, comment) => axios.post(`${baseUrl}/${id}/comments`, { comment }).then(r => r.data)
