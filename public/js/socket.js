const socket = io.connect('/', {transports: ['websocket']})
socket.on('news', async function (data) {
  const userId = document.getElementById('user-session-id').href.split('/')[4]
  const response = await fetch(`/users/${userId}/following`, {
    method: 'get',
    credentials: 'same-origin'
  })
  const users = await response.json()
  const userIds = users.following.map(user => {
    return user._id
  })
  if (userIds.includes(data.user) && data.follower === userId) {
    $('#menu').addClass('pulse')
    $('#feed').html(data.title)
    $('#feed-info').append(`<p>${data.message}</p>`)
    $('#menu').click(() => {
      $('.tap-target').tapTarget('open')
      $('#menu').removeClass('pulse')
    })
  }
})
