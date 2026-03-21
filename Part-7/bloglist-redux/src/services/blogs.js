import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getAll = () =>
  axios.get(baseUrl).then(res => res.data)

const create = async (newBlog) => {
  const res = await axios.post(baseUrl, newBlog, { headers: { Authorization: token } })
  return res.data
}

const update = async (id, updatedBlog) => {
  const res = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return res.data
}

const remove = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, { headers: { Authorization: token } })
}

export default { getAll, setToken, create, update, remove }
