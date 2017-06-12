const register = document.forms.register
register.addEventListener('submit', (e) => {
  // e.returnValue = false
  getErrors()
})

async function getErrors () {
  try {
    const response = await fetch('http://localhost:6889/register', {
      method: 'post'
    })
    const data = await response.json()
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}
