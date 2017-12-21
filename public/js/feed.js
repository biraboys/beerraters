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
      newFeedCounter = parseInt(newFeedStorage)
      newFeedCounter++
      localStorage.setItem('newFeedCounter', newFeedCounter)
    } else {
      localStorage.setItem('newFeedCounter', 1)
      newFeedCounter = 1
    }
    feedCounterSpan.innerText = newFeedCounter
    const feedTypeHtml = generateFeedTypeHtml(feedItem)
    const newFeedItem = `
    <div class="col s12 m12 l4">
      <div class="card feed-item pulse" tabindex="0">
        <div class="card-content">
          <span class="card-title">
            <i class="material-icons va-middle">account_circle</i>
            <a href="/users/${feedItem.user_id}" class="va-middle">${feedItem.username}</a>
          </span>
          <p>
            ${feedTypeHtml}
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

/**
 * Checks online status of following users from back end
 */
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

/**
 * Gets user ids of following users
 */
async function getUserFollowing () {
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

/**
 * Gets all feed items from backend and displays them basing on following users
 * @param {Array} followingIds - User ids of following users
 */

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
        const feedTypeHtml = generateFeedTypeHtml(feedItem)
        activityList.innerHTML += `
        <div class="col s12 m12 l4 feed-item-column">
          <div class="card feed-item" tabindex="0">
            <div class="card-content">
              <span class="card-title">
                <i class="material-icons va-middle">account_circle</i>
                <a href="/users/${feedItem.user_id}" class="va-middle">${feedItem.username}</a>
              </span>
              <p>
                ${feedTypeHtml}
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
    newFeedCounter = parseInt(newFeedStorage)
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

/**
 * Add feed item listener depending on if item is new or not
 * @param {Object} feedItem - Feed item from backend based on Mongoose schema
 * @param {Number} newFeedCounter - Counter from localstorage keeping strack on amount of new items
 * @param {String} feedCounterSpan - Html span to display new feed counter
 */
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

/**
 * Generates a Html string depending on feed type (consumed, rated, reviewed, uploaded)
 * @param {Object} feedItem - Feed item from backend based on Mongoose schema
 */
function generateFeedTypeHtml (feedItem) {
  let feedTypeHtml
  switch (feedItem.type) {
    case 'consumed':
      feedTypeHtml = `
      <i class="material-icons va-middle" aria-hidden="true">local_drink</i> <span class="va-middle">${feedItem.type}</span>
      <a href="/beers/${feedItem.beer_id}" class="va-middle">${feedItem.beer_name}</a>
      `
      break
    case 'reviewed':
      feedTypeHtml = `
    <i class="material-icons va-middle" aria-hidden="true">rate_review</i>
    <span class="va-middle">${feedItem.type}</span>
    <a href="/beers/${feedItem.beer_id}" class="va-middle">${feedItem.beer_name}</a>
    `
      break
    case 'uploaded':
      feedTypeHtml = `
    <i class="material-icons va-middle" aria-hidden="true">insert_photo</i>
    <span class="va-middle">${feedItem.type} photo of</span>
    <a href="/beers/${feedItem.beer_id}" class="va-middle">${feedItem.beer_name}</a>
    `
      break
    // Rated
    default:
      feedTypeHtml = `
    <i class="material-icons va-middle" aria-hidden="true">star</i>
    <span class="va-middle">${feedItem.type.split(' ')[0]}
      <a href="/beers/${feedItem.beer_id}">${feedItem.beer_name}</a>
      <span>${feedItem.type.split(' ')[1]}</span>
    </span>
    `
      break
  }
  return feedTypeHtml
}

(async () => {
  await Promise.all([
    getUserFollowing(),
    getUsersOnline()
  ])
})()
