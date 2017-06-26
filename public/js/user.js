const follow = document.getElementById('follow')

follow.addEventListener('click', function (e) {
  followUser()
})

async function followUser () {
  const id = follow.dataset.id
  if (follow.innerHTML === 'Follow') {
    const response = await fetch(`/users/${id}/follow`, {
      method: 'post'
    })
    const response = await fetch(`/users/${id}/follow`)
    window.location = `/users/${id}/follow`
    console.log(response)
    follow.innerHTML = 'Unfollow'
  } else {
    follow.innerHTML = 'Follow'
    unfollowUser(id)
  }
}

async function unfollowUser (id) {
  const response = await fetch(`/users/${id}/unfollow`, {
    method: 'post'
  })
  console.log(response)
}
