const follow = document.getElementById('follow')

follow.addEventListener('click', function (e) {
  e.preventDefault()
  followUser()
})

async function followUser () {
  const id = follow.dataset.id
  if (follow.innerHTML === 'Follow') {
    const response = await fetch(`/users/${id}/follow`, {
      method: 'post'
    })
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
