const registerForm = document.forms.register
const registerBtn = document.getElementById('register-btn')
const username = document.getElementById('username')
const name = document.getElementById('name')
const email = document.getElementById('email')
const password = document.getElementById('password')
const country = document.getElementById('country')
const usernameMsg = document.getElementById('username-msg')
const emailMsg = document.getElementById('email-msg')
const modalText = document.getElementById('modal-text')

// Post new user
registerForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  username.className = 'validate'
  email.className = 'validate'
  registerBtn.classList.add('disabled')
  try {
    const response = await fetch('/register', {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'post',
      body: JSON.stringify({
        username: username.value,
        name: name.value,
        email: email.value,
        password: password.value,
        country: country.value
      })
    })
    const data = await response.json()

    if (data) {
      if (data.message[51] === 'u') {
        console.log(data)
        username.className = 'validate invalid'
        usernameMsg.attributes[2].nodeValue = 'Username already taken.'
        registerBtn.classList.remove('disabled')
      }
      if (data.message[51] === 'e') {
        console.log(data)
        email.className = 'validate invalid'
        emailMsg.attributes[2].nodeValue = 'Email already taken.'
        registerBtn.classList.remove('disabled')
      }
      if (data.message[0] === 'A') {
        modalText.innerHTML = data.message
        $('#modal').modal('open', {
          dismissible: false
        })
        setTimeout(() => {
          location.href = '/'
        }, 5000)
      }
    }
  } catch (err) {
    console.log(err)
  }
})

async function getCountries () {
  try {
    const response = await fetch('/countries')
    const countries = await response.json()
    sortByName(countries)
    await countries.forEach(country => {
      registerForm.country.innerHTML += `
      <option value="${country._id}" class="flag-img left valign-wrapper">${country.name}</option>
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

registerForm.password.addEventListener('focus', function () {
  $('select').material_select()
})

// Function invokes
getCountries()
