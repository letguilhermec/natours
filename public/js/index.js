import '@babel/polyfill'
import { displayMap } from './mapbox'
import { login, logout } from './login'
import { updateSettings } from './updateSettings'
import { bookTour } from './stripe'
import { showAlert } from './alerts'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDr0oZWt4z5pjo_E3waf4Bnd19aNyt2GP0",
  authDomain: "natours-website.firebaseapp.com",
  projectId: "natours-website",
  storageBucket: "natours-website.appspot.com",
  messagingSenderId: "23876273786",
  appId: "1:23876273786:web:5034277876e73e6a669dc3",
  measurementId: "G-W4F4NF3HH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//  DOM Elements
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
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

const alertMessage = document.querySelector('body').dataset.alerts
if (alertMessage) showAlert('success', alertMessage, 20)
