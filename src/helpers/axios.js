import axios from 'axios'

export default function () {
  axios.defaults.baseURL = 'http://localhost:5000/'

  axios.defaults.validateStatus = status => {
    if (status === 401) {
      localStorage.clear()
      location.href = '/login'
    }

    return status >= 200 && status < 300
  }
}
