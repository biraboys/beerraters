const name = document.getElementById('name')
const displayname = document.getElementById('displayname')
const description = document.getElementById('description')
// const editForm = document.getElementById('edit-form')
const currentpass = document.getElementById('currentpass')
const newpass = document.getElementById('newpass')
const confirmpass = document.getElementById('confirmpass')
const changePassBtn = document.getElementById('changepass')
const pass = document.getElementById('pass')
const info = document.getElementById('info')
const remove = document.getElementById('remove')
const currentpassMsg = document.getElementById('currentpassmsg')
const newpassMsg = document.getElementById('newpassmsg')
const confirmpassMsg = document.getElementById('confirmpassmsg')
const passChangeForm = document.getElementById('pass-change')
const editProfile = document.getElementById('edit-profile')
const changePassword = document.getElementById('change-password')
const removeAccount = document.getElementById('remove-account')

async function test () {
  const path = window.location.pathname.split('/')
  const url = `/${path[1]}/${path[2]}/json`
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
      displayname.value = data.displayName || ''
      description.value = data.description
    }
  } catch (err) {
    console.log(err)
  }
}

test()

passChangeForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  const path = window.location.pathname.split('/')
  const url = `/${path[1]}/${path[2]}/changepassword`
  currentpass.className = 'validate'
  currentpassMsg.attributes[1].value = ''
  confirmpass.className = 'validate'
  confirmpassMsg.attributes[1].nodeValue = ''
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
      } else if (data.message[0] === 'M') {
        confirmpass.className = 'validate invalid'
        confirmpassMsg.attributes[1].nodeValue = data.message
      } else {
        Materialize.toast(data.message, 3000)
        setTimeout(() => {
          location.reload(true)
        }, 3000)
      }
    }
  } catch (err) {
    console.log(err)
  }
})
// newpassMsg
// confirmpassMsg