const socket = io.connect('/', {transports: ['websocket']})
socket.on('news', async function (feedItem) {
  const userId = document.getElementById('user-session-id').href.split('/')[4]
  const response = await fetch(`/users/${userId}/following`, {
    method: 'get',
    credentials: 'same-origin'
  })
  const users = await response.json()
  const userIds = users.following.map(user => {
    return user._id
  })
  if (userIds.indexOf(feedItem.user_id) > -1) {
    $('#feed-link').addClass('pulse')
    $('#feed-link').click(() => {
      $('#feed-link').removeClass('pulse')
    })
    $('#mobile-feed-link').addClass('pulse')
    $('#mobile-feed-link').click(() => {
      $('#mobile-feed-link').removeClass('pulse')
    })
  }
})
