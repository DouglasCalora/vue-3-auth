import axios from 'axios'

export default function () {
  const test = true
  axios.defaults.baseURL = test ? 'http://localhost:3000/' : 'http://localhost:5000/'

  axios.defaults.validateStatus = status => {
    if (status === 401) {
      localStorage.clear()
      location.href = '/login'
    }

    return status >= 200 && status < 300
  }
}
