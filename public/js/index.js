import '@babel/polyfill'
import { displayMap } from './mapbox'
import { login, logout } from './login'
import { updateSettings } from './updateSettings'

//  DOM Elements
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const logoutBtn = document.querySelector('.nav__el--logout')
const updateForm = document.querySelector('.form-user-data')
const passwordForm = document.querySelector('.form-user-password')

//  Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations)
  displayMap(locations)
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault()
    //  Values
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
  })
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout)
}

if (updateForm) {
  updateForm.addEventListener('submit', async e => {
    e.preventDefault()
    document.querySelector('.btn--save-data').textContent = 'Updating...'
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    await updateSettings({ name, email }, 'data')
    document.querySelector('.btn--save-data').textContent = 'Save settings'
  })
}

if (passwordForm) {
  passwordForm.addEventListener('submit', async e => {
    e.preventDefault()
    document.querySelector('.btn--save-pass').textContent = 'Updating...'
    const oldPassword = document.getElementById('password-current').value
    const password = document.getElementById('password').value
    const passwordConfirm = document.getElementById('password-confirm').value
    await updateSettings({ oldPassword, password, passwordConfirm }, 'password')
    document.querySelector('.btn--save-pass').textContent = 'Save password'
    document.getElementById('password-current').value = ''
    document.getElementById('password').value = ''
    document.getElementById('password-confirm').value = ''
  })
}
