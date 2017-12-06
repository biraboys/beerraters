const password = document.getElementById('password')
const confirmpass = document.getElementById('confirmpass')
const confirmpassMsg = document.getElementById('confirmpass-msg')
const activateAccountForm = document.getElementById('form-activate-account')
const loading = document.getElementById('loading-container')

const submitBtn = document.getElementById('submit-btn')

activateAccountForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  submitBtn.classList.add('disabled')
  loading.classList.add('active')
  confirmpassMsg.attributes[2].nodeValue = ''
  confirmpass.className = 'validate'
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
        confirmpass.className = 'validate valid'
        Materialize.toast('Successfully activated account, redirecting to login...', 3000)
        setTimeout(() => {
          location.href = '/login'
        }, 3000)
      } else {
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
