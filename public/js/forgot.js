const forgotPassForm = document.getElementById('form-forgot')
const forgotPassMsg = document.getElementById('forgot')
const email = document.getElementById('email')
const loading = document.getElementById('loading-container')
const submitBtn = document.getElementById('submit-btn')

forgotPassForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  forgotPassMsg.attributes[1].nodeValue = ''
  email.className = 'validate'
  loading.classList.add('active')
  submitBtn.classList.add('disabled')
  try {
    const response = await fetch('/forgot', {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'post',
      body: JSON.stringify({
        email: email.value
      })
    })
    const data = await response.json()
    if (data.success) {
      email.className = 'validate valid'
      forgotPassMsg.attributes[2].nodeValue = 'Success!'
      Materialize.toast(data.message, 3200)
      setTimeout(() => {
        location.href = '/'
      }, 3500)
    } else {
      email.className = 'validate invalid'
      forgotPassMsg.attributes[1].nodeValue = data.message
      loading.classList.remove('active')
      submitBtn.classList.remove('disabled')
    }
  } catch (err) {
    console.log(err)
  }
})
