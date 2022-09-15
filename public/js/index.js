import '@babel/polyfill'
import { displayMap } from './mapbox'
import { login, logout, signup } from './login'
import { updateSettings } from './updateSettings'
import { bookTour } from './stripe'
import { showAlert } from './alerts'

//  DOM Elements
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const signupForm = document.querySelector('.form--signup')
const logoutBtn = document.querySelector('.nav__el--logout')
const updateForm = document.querySelector('.form-user-data')
const passwordForm = document.querySelector('.form-user-password')
const bookBtn = document.getElementById('book-tour')

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

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault()
    //Values
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const passwordConfirm = document.getElementById('passwordConfirm').value
    signup(name, email, password, passwordConfirm)
  })
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout)
}

if (updateForm) {
  updateForm.addEventListener('submit', async e => {
    e.preventDefault()
    document.querySelector('.btn--save-data').textContent = 'Updating...'

    const form = new FormData()
    form.append('name', document.getElementById('name').value)
    form.append('email', document.getElementById('email').value)
    form.append('photo', document.getElementById('photo').files[0])

    await updateSettings(form, 'data')
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

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...'
    const { tourid } = e.target.dataset
    bookTour(tourid)
  })
}

const alertMessage = document.querySelector('body').dataset.alert
if (alertMessage) showAlert('success', alertMessage, 20)
