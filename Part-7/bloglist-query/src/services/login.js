import axios from 'axios'
export const login = (credentials) => axios.post('/api/login', credentials).then(r => r.data)
