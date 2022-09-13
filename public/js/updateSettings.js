import axios from 'axios'
import { showAlert } from './alerts'

//  Type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: `api/v1/users/${type === 'password' ? 'updateMyPassword' : 'updateMe'}`,
      data
    })

    if (response.data.status === 'success') {
      showAlert('success', `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`)
      window.setTimeout(() => {
        location.reload(true)
      }, 1500)
    }

  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

//  Update Password
