const logout = document.getElementById('logout')
const logoutMobile = document.getElementById('logout-mobile')

if (logout) {
  logout.addEventListener('click', function (e) {
    e.preventDefault()
    logoutSession()
  })
}

if (logoutMobile) {
  logoutMobile.addEventListener('click', function (e) {
    e.preventDefault()
    logoutSession()
  })
}

async function logoutSession () {
  const response = await fetch(`/logout`, {
    method: 'post',
    credentials: 'same-origin'
  })

  if (response.status === 200) {
    const text = await response.json()
    console.log(text.msg)
    window.location.href = '/'
  } else {
    const text = await response.json()
    console.log(text.err)
  }
}
