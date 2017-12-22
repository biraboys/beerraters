const name = document.getElementById('name')
const description = document.getElementById('description')
const currentpass = document.getElementById('currentpass')
const newpass = document.getElementById('newpass')
const confirmpass = document.getElementById('confirmpass')
const currentpassMsg = document.getElementById('currentpassmsg')
const confirmpassMsg = document.getElementById('confirmpassmsg')
const passChangeForm = document.getElementById('pass-change')
const changePassBtn = document.getElementById('changepass-btn')
const password = document.getElementById('password')
const passwordMsg = document.getElementById('password-msg')
const yes = document.getElementById('yes')
const no = document.getElementById('no')
const removeAccountBtn = document.getElementById('remove-account-btn')
const removeAccountForm = document.getElementById('remove-account-form')

async function getUserJson () {
  const path = window.location.pathname.split('/')
  const url = `/${path[1]}/${path[2]}/userJson`
  try {
    const response = await fetch(url, {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'get'
    })
    const data = await response.json()

    if (data) {
      name.value = data.name
      description.value = data.description
    }
  } catch (err) {
    console.log(err)
  }
}

getUserJson()

// Change user password
passChangeForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  const path = window.location.pathname.split('/')
  const url = `/${path[1]}/${path[2]}/changepassword`
  const profile = `/${path[1]}/${path[2]}`
  currentpass.className = 'validate'
  currentpassMsg.attributes[1].value = ''
  confirmpass.className = 'validate'
  confirmpassMsg.attributes[1].nodeValue = ''
  changePassBtn.classList.add('disabled')
  try {
    const response = await fetch(url, {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      credentials: 'same-origin',
      method: 'post',
      body: JSON.stringify({
        currentpass: currentpass.value,
        newpass: newpass.value,
        confirmpass: confirmpass.value
      })
    })
    const data = await response.json()
    if (data) {
      if (data.message[0] === 'C') {
        currentpass.className = 'validate invalid'
        currentpassMsg.attributes[1].nodeValue = data.message
        changePassBtn.classList.remove('disabled')
      } else if (data.message[0] === 'M') {
        confirmpass.className = 'validate invalid'
        confirmpassMsg.attributes[1].nodeValue = data.message
        changePassBtn.classList.remove('disabled')
      } else {
        password.className = 'validate valid'
        currentpass.className = 'validate valid'
        newpass.className = 'validate valid'
        Materialize.toast(data.message, 3000)
        setTimeout(() => {
          location.href = profile
        }, 3000)
      }
    }
  } catch (err) {
    console.log(err)
  }
})

// Remove account
removeAccountForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  passwordMsg.attributes[1].nodeValue = ''
  password.className = 'validate'
  const path = window.location.pathname.split('/')
  const url = `/${path[1]}/${path[2]}/check-pass`
  try {
    const response = await fetch(url, {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'post',
      credentials: 'same-origin',
      body: JSON.stringify({
        password: password.value
      })
    })

    const data = await response.json()

    if (data) {
      if (data.success) {
        removeAccountBtn.classList.add('disabled')
        $('#modal').modal('open', {
          dismissible: false
        })
        removeAccountConfirmation()
      } else {
        passwordMsg.attributes[1].nodeValue = 'Password does not match'
        password.className = 'validate invalid'
      }
    }
  } catch (err) {
    console.log(err)
  }
})

async function removeAccountConfirmation () {
  const path = window.location.pathname.split('/')
  const url = `/${path[1]}/${path[2]}/remove-account`
  yes.addEventListener('click', async () => {
    const response = await fetch(url, {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'post',
      credentials: 'same-origin'
    })
    const data = await response.json()
    if (data) {
      Materialize.toast(data.message, 3000)
      setTimeout(() => {
        location.href = '/'
      }, 3000)
    }
  })
  no.addEventListener('click', async () => {
    $('#modal').modal('close')
    location.href = document.referrer
  })
}
