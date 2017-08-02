const forgotPassForm = document.getElementById('form-forgot')
const forgotPassMsg = document.getElementById('forgot')
const email = document.getElementById('email')

forgotPassForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  forgotPassMsg.attributes[1].nodeValue = ''
  email.className = 'validate'
  try {
    const response = await fetch('/forgot', {
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8'
      }),
      method: 'post',
      body: JSON.stringify({
        email: email.value
      })
    })
    const data = await response.json()
    if (data.success === true) {
      Materialize.toast(data.message, 3000)
      setTimeout(() => {
        window.location.href = '/'
      }, 3000)
    } else {
      email.className = 'validate invalid'
      forgotPassMsg.attributes[1].nodeValue = data.message
    }
  } catch (err) {
    console.log(err)
  }
})
