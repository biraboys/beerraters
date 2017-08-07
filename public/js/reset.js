const password = document.getElementById('password')
const confirmpass = document.getElementById('confirmpass')
const confirmpassMsg = document.getElementById('confirmpass-msg')
const resetPassForm = document.getElementById('form-reset-password')
const loading = document.getElementById('loading-container')

const submitBtn = document.getElementById('submit-btn')

resetPassForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  submitBtn.classList.add('disabled')
  loading.classList.add('active')
  const pass = password.value
  const confirm = confirmpass.value
  try {
    const response = await fetch(location.pathname, {
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
    if (data) {
      if (data.success) {
        console.log(data)
        loading.classList.remove('active')
        confirmpassMsg.attributes[2].nodeValue = 'Success!'
        confirmpass.className = 'validate valid'
        setTimeout(() => {
          location.href = '/login'
        }, 3000)
      } else {
        console.log(data)
        submitBtn.classList.remove('disabled')
        loading.classList.remove('active')
        confirmpassMsg.attributes[2].nodeValue = 'Make sure new password match'
        confirmpass.className = 'validate invalid'
      }
    }
  } catch (err) {
    console.log(err)
  }
})
