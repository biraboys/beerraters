const loginForm = document.forms.login
const loginBtn = document.getElementById('login-btn')
const username = document.getElementById('username')
const password = document.getElementById('password')
const passwordMsg = document.getElementById('password-msg')
const usernameMsg = document.getElementById('username-msg')

// Post new user
loginForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  loginBtn.classList.add('disabled')
  password.className = 'validate'
  try {
    const response = await fetch('/login', {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'post',
      credentials: 'same-origin',
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })
    const data = await response.json()

    if (data) {
      console.log(data)
      if (data.active && data.message[0] === 'P') {
				// Password does not match
        password.className = 'validate invalid'
        passwordMsg.attributes[2].nodeValue = data.message
        loginBtn.classList.remove('disabled')
        console.log(data)
      } else if (data.active === false) {
				// User account not activated
        username.className = 'validate invalid'
        usernameMsg.attributes[2].nodeValue = data.message
        loginBtn.classList.remove('disabled')
        console.log(data)
      } else if (data.message[0] === 'C') {
				// No user found
        username.className = 'validate invalid'
        usernameMsg.attributes[2].nodeValue = `${data.message} '${username.value}'`
        loginBtn.classList.remove('disabled')
        console.log(data)
      } else {
				// console.log('hej')
        location.href = document.referrer
        console.log(data)
      }
    }
  } catch (err) {
    console.log(err)
  }
})
