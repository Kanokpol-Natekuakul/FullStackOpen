import axios from 'axios'
export const getAll = () => axios.get('/api/users').then(r => r.data)
