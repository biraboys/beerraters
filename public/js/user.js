const follow = document.getElementById('follow')
const followers = document.getElementById('followers')

if (follow) {
  follow.addEventListener('click', function (e) {
    e.preventDefault()
    followUser()
  })
}

async function followUser () {
  const id = follow.dataset.id
  const response = await fetch(`/users/${id}/follow`, {
    method: 'post',
    credentials: 'same-origin'
  })
  if (response.status === 401) {
    console.log(response.status)
    window.location.href = '/login'
  } else if (response.status === 200) {
    if (follow.innerHTML === 'Follow') {
      const value = parseInt(followers.innerHTML) + 1
      followers.innerHTML = value
      follow.innerHTML = 'Unfollow'
    } else {
      const value = parseInt(followers.innerHTML) - 1
      followers.innerHTML = value
      follow.innerHTML = 'Follow'
    }
  }
}

