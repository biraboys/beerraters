const userId = document.getElementById('user-session-id').href.split('/')[4]
const activityList = document.getElementById('activity-list')
const onlineList = document.getElementById('online')
const offlineList = document.getElementById('offline')
const offlineFollowers = document.getElementById('offline-followers')
const onlineFollowers = document.getElementById('online-followers')

async function getUserFollowing () {
  try {
    const response = await fetch(`/users/${userId}/following`, {
      method: 'get',
      credentials: 'same-origin'
    })
    const user = await response.json()
    await user.feed.forEach(feedItem => {
      const feedListEl = document.createElement('li')
      feedListEl.setAttribute('class', 'collection-item feed-item')
      feedListEl.setAttribute('blah', feedItem._id)
      feedListEl.innerHTML = feedItem.item
      $(activityList).append(feedListEl)
    })
  } catch (err) {
    console.log(err)
  }
}

$('.feed-closer').each(function () {
}).click(function () {
  const feedId = this.parentNode.getAttribute('data-target')
  removeFeedItem(feedId)
  activityList.removeChild(this.parentNode)
})

$('.dismissable').each(function () {
})
.on('panend', function () {
  const transFormValue = this.style.transform.substr(11)
  if (transFormValue.substr(0, 1) === '-') {
    if (Number(transFormValue.substr(1, 2)) >= 42) {
      const feedId = this.getAttribute('data-target')
      removeFeedItem(feedId)
    }
  } else {
    if (Number(transFormValue.substr(0, 2)) >= 42) {
      const feedId = this.getAttribute('data-target')
      removeFeedItem(feedId)
    }
  }
})

async function getUsersOnline () {
  const url = `/users/${userId}/following`
  try {
    const response = await fetch(url, {
      method: 'get',
      credentials: 'same-origin'
    })
    const user = await response.json()
    let usersOnline = 0
    let usersOffline = 0
    user.following.forEach(async following => {
      if (following.status === true) {
        usersOnline += 1
        onlineList.innerHTML +=
          `<li class="collection-item avatar follower-list">
            <img src="/images/user-placeholder.png" class="circle responsive-img">
            <span class="title follower-span"><a href="/users/${following._id}">${following.username}</a></span>
          </li>`
      } else {
        usersOffline += 1
        offlineList.innerHTML +=
          `<li class="collection-item avatar follower-list">
            <img src="/images/user-placeholder.png" class="circle responsive-img">
            <span class="title follower-span"><a href="/users/${following._id}">${following.username}</a></span>
          </li>`
      }
    })
    onlineFollowers.innerHTML = usersOnline
    offlineFollowers.innerHTML = usersOffline
  } catch (err) {
    console.log(err)
  }
}

async function removeFeedItem (feedId) {
  try {
    const response = await fetch(`/users/feed/${feedId}`, {
      method: 'post',
      credentials: 'same-origin'
    })
    response.status === 500
    ? Materialize.toast(`Could not remove feed item`, 2000)
    : Materialize.toast(`Feed item removed!`, 2000)
  } catch (err) {
    console.log(err)
  }
}

getUsersOnline()
getUserFollowing()
