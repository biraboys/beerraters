const logout = document.getElementById('logout')

if (logout) {
  logout.addEventListener('click', function (e) {
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
  } else if (response.status === 500) {
    const text = await response.json()
    console.log(text.err)
  }
}
