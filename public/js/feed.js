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
  if (userIds.includes(feedItem.user_id)) {
    const activityList = document.getElementById('activity-list')
    const feedCounterSpan = document.getElementById('feed-counter-span')
    const newFeedStorage = localStorage.getItem('newFeedCounter')
    let newFeedCounter
    if (newFeedStorage !== null) {
      newFeedCounter = Number(newFeedStorage)
      newFeedCounter++
      localStorage.setItem('newFeedCounter', newFeedCounter)
    } else {
      localStorage.setItem('newFeedCounter', 1)
      newFeedCounter = 1
    }
    feedCounterSpan.innerText = newFeedCounter
    const newFeedItem = `
    <div class="col s12 m12 l4">
      <div class="card feed-item pulse" tabindex="0">
        <div class="card-content">
          <span class="card-title">
            <i class="material-icons va-middle">account_circle</i>
            <a href="/users/${feedItem.user_id}" class="va-middle">${feedItem.username}</a>
          </span>
          <p>
            <i class="material-icons va-middle">done</i> <span class="va-middle">${feedItem.type}</span>
            <a href="/beers/${feedItem.beer_id}" class="va-middle">${feedItem.beer_name}</a>
          </p>
        </div>
        <div class="card-action">
          <span>
            <i class="material-icons va-middle">schedule</i>
            <span class="va-middle">${feedItem.created}</span>
          </span>
        </div>
      </div>
    </div>
    `
    activityList.insertAdjacentHTML('afterbegin', newFeedItem)
    addFeedItemsListeners(document.getElementsByClassName('feed-item')[0], newFeedCounter, feedCounterSpan)
  }
})

async function getUsersOnline () {
  const followingList = document.getElementById('following-list')
  const userId = document.getElementById('user-session-id').href.split('/')[4]
  const followingAmount = document.getElementById('following-amount')
  const url = `/users/${userId}/following`
  try {
    const response = await fetch(url, {
      method: 'get',
      credentials: 'same-origin'
    })
    const user = await response.json()
    followingAmount.innerHTML = user.following.length
    user.following.forEach(async following => {
      if (following.status === true) {
        followingList.innerHTML +=
          `<li class="collection-item avatar follower-list">
            <img src="/images/user-placeholder.png" class="circle responsive-img">
            <span class="title follower-span"><a href="/users/${following._id}">${following.username}</a></span>
          </li>`
      } else {
        followingList.innerHTML +=
          `<li class="collection-item avatar follower-list">
            <img src="/images/user-placeholder.png" class="circle responsive-img">
            <span class="title follower-span"><a href="/users/${following._id}">${following.username}</a></span>
          </li>`
      }
    })
  } catch (err) {
    console.log(err)
  }
}
async function getFeedItems () {
  const userId = document.getElementById('user-session-id').href.split('/')[4]
  const url = `/users/${userId}/following`
  try {
    const response = await fetch(url, {
      method: 'get',
      credentials: 'same-origin'
    })
    const user = await response.json()
    const followingIds = user.following.map(user => {
      return user._id
    })
    getFeed(followingIds)
  } catch (err) {
    console.log(err)
  }
}

async function getFeed (followingIds) {
  const activityList = document.getElementById('activity-list')
  try {
    const feed = await fetch('/feed', {
      method: 'get',
      credentials: 'same-origin'
    })
    const json = await feed.json()
    json.sort((a, b) => {
      return new Date(b.created) - new Date(a.created)
    })
    json.forEach(feedItem => {
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
      const date = new Date(feedItem.created)
      feedItem.created = date.toLocaleDateString('en-GB', dateOptions)
      feedItem.beer_name.length > 20 ? feedItem.beer_name = `${feedItem.beer_name.substring(0, 20)}...` : feedItem.beer_name = feedItem.beer_name
      if (followingIds.includes(feedItem.user_id)) {
        activityList.innerHTML += `
        <div class="col s12 m12 l4">
          <div class="card feed-item" tabindex="0">
            <div class="card-content">
              <span class="card-title">
                <i class="material-icons va-middle">account_circle</i>
                <a href="/users/${feedItem.user_id}" class="va-middle">${feedItem.username}</a>
              </span>
              <p>
                <i class="material-icons va-middle">done</i> <span class="va-middle">${feedItem.type}</span>
                <a href="/beers/${feedItem.beer_id}" class="va-middle">${feedItem.beer_name}</a>
              </p>
              </div>
              <div class="card-action">
                <span>
                  <i class="material-icons va-middle">schedule</i>
                  <span class="va-middle">${feedItem.created}</span>
                </span>
              </div>
            </div>
        </div>
        `
      }
      getNewFeedCounter()
    })
  } catch (err) {
    console.log(err)
  }
}

/**
 * Checks localStorage to see the amount of new feed items for the user.
 */
function getNewFeedCounter () {
  const feedCounterSpan = document.getElementById('feed-counter-span')
  const feedItems = document.getElementsByClassName('feed-item')
  const newFeedStorage = localStorage.getItem('newFeedCounter')
  let newFeedCounter
  if (newFeedStorage !== null) {
    let feedItemIndex = 0
    newFeedCounter = Number(newFeedStorage)
    for (const feedItem of feedItems) {
      if (feedItemIndex < newFeedCounter) {
        feedItem.classList.add('pulse')
        addFeedItemsListeners(feedItem, newFeedCounter, feedCounterSpan)
      }
      feedItemIndex++
    }
    feedCounterSpan.innerText = newFeedCounter
  }
}

function addFeedItemsListeners (feedItem, newFeedCounter, feedCounterSpan) {
  feedItem.addEventListener('mouseover', function () {
    if (this.classList.contains('pulse')) {
      newFeedCounter--
      localStorage.setItem('newFeedCounter', newFeedCounter)
      feedCounterSpan.innerText = newFeedCounter
    }
    this.classList.remove('pulse')
  })
  feedItem.addEventListener('focus', function () {
    if (this.classList.contains('pulse')) {
      newFeedCounter--
      localStorage.setItem('newFeedCounter', newFeedCounter)
      feedCounterSpan.innerText = newFeedCounter
    }
    this.classList.remove('pulse')
  })
}

getUsersOnline()
getFeedItems()
