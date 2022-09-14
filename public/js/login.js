import axios from 'axios'
import { showAlert } from './alerts'

export const login = async (email, password) => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'api/v1/users/login',
      data: {
        email,
        password
      }
    })

    if (response.data.status === 'success') {
      showAlert('success', 'Logged in successfully!')
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
    }

  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    })

    if (response.data.status === 'success') {
      showAlert('success', 'Welcome to the Natours family!')
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
    }

  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

export const logout = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: 'api/v1/users/logout'
    })

    if (response.data.status === 'success') {
      showAlert('success', 'Logged out successfully!')
      window.setTimeout(() => {
        location.reload(true)
      }, 1500)
    }

  } catch {
    showAlert('error', 'Error logging out! Please, try again.')
  }
}


