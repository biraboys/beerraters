const password = document.getElementById('password')
const confirmpass = document.getElementById('confirmpass')
const submitpass = document.getElementById('submitpass')
const message = document.getElementById('message')

submitpass.onclick = async function () {
  const pass = password.value
  const confirm = confirmpass.value
  try {
    const response = await fetch(window.location.pathname, {
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8'
      }),
      method: 'post',
      body: JSON.stringify({
        password: pass,
        confirmpass: confirm
      })
    })
    const data = await response.json()
    if (data.success === true) {
      message.innerHTML = data.message
      password.value = ''
      confirmpass.value = ''
    } else {
      message.innerHTML = data.message
      password.value = ''
      confirmpass.value = ''
    }
  } catch (err) {
    console.log(err)
  }
}
