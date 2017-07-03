const forgotPassword = document.getElementById('forgot')
const emailField = document.getElementById('email')
const message = document.getElementById('message')

forgotPassword.onclick = async function () {
  const email = emailField.value
  try {
    const response = await fetch('/forgot', {
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8'
      }),
      method: 'post',
      body: JSON.stringify({
        email: email
      })
    })
    const data = await response.json()
    if (data.success === true) {
      message.innerHTML = data.message
      emailField.value = ''
    } else {
      message.innerHTML = data.message
      emailField.value = ''
    }
  } catch (err) {
    console.log(err)
  }
}
