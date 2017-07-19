const registerForm = document.forms.register
const registerBtn = document.getElementById('register-btn')
const username = document.getElementById('username')
const name = document.getElementById('name')
const email = document.getElementById('email')
const password = document.getElementById('password')
const country = document.getElementById('country')
const emailMsg = document.getElementById('emailMsg')
const usernameMsg = document.getElementById('usernameMsg')
const passwordMsg = document.getElementById('passwordMsg')
const registrationHeading = document.getElementById('register-heading')

async function getBeerCountries () {
  try {
    const response = await fetch('/countries')
    const countries = await response.json()
    sortByName(countries)
    countries.forEach(country => {
      registerForm.country.innerHTML += `
       <option value="${country._id}">${country.name}</option>
      `
    })
  } catch (err) {
    console.log(err)
  }
}

// Helper functions
function sortByName (array) {
  return array.sort((a, b) => {
    return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
  })
}

getBeerCountries()

// Post new user
registerBtn.addEventListener('click', async function (e) {
  e.preventDefault()
  passwordMsg.innerHTML = ''
  usernameMsg.innerHTML = ''
  emailMsg.innerHTML = ''
  try {
    const response = await fetch('/register', {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'POST',
      body: JSON.stringify({
        username: username.value,
        name: name.value,
        email: email.value,
        password: password.value,
        country: country.value
      })
    })
    const data = await response.json()
    console.log(data)

    if (data.message) {
      if (data.message.username) {
        usernameMsg.innerHTML = data.message.username.message
      }
      if (data.message.email) {
        emailMsg.innerHTML = data.message.email.message
      }
      if (data.message.password) {
        passwordMsg.innerHTML = data.message.password.message
      }
      if (data.message) {
        if (data.message[51] === 'u') {
          usernameMsg.innerHTML = 'Username is already taken.'
        }
        if (data.message[51] === 'e') {
          emailMsg.innerHTML = 'Email already used.'
        }
      }
      if (data.message[0] === 'U') {
        registerForm.innerHTML = ''
        registrationHeading.innerHTML = data.message
      }
    }
  } catch (err) {
    console.log(err)
  }
})
