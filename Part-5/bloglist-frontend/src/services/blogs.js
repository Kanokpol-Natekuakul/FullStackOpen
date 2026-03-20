import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getAll = () => {
  const config = token
    ? { headers: { Authorization: token } }
    : {}

  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

export default { getAll, setToken }
