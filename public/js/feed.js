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
    const activityList = document.getElementById('activity-list')
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
    const date = new Date(feedItem.created)
    feedItem.created = date.toLocaleDateString('en-GB', dateOptions)
    feedItem.beer_name.length > 20 ? feedItem.beer_name = `${feedItem.beer_name.substring(0, 20)}...` : feedItem.beer_name = feedItem.beer_name
    const feedTypeHtml = generateFeedTypeHtml(feedItem)
    const newFeedItem = `
    <div class="col s12 m12 l4">
      <div class="card feed-item pulse" tabindex="0">
        <div class="card-content" style="height: 150px;">
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
    addFeedItemsListeners(document.getElementsByClassName('feed-item')[0])
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
      if (followingIds.indexOf(feedItem.user_id) > -1) {
        const feedTypeHtml = generateFeedTypeHtml(feedItem)
        activityList.innerHTML += `
        <div class="col s12 m12 l4">
          <div class="card" tabindex="0">
            <div class="card-content" style="height: 150px;">
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
    })
  } catch (err) {
    console.log(err)
  }
}

/**
 * Add feed item listener depending on if item is new or not
 * @param {Object} feedItem - Feed item from backend based on Mongoose schema
 */
function addFeedItemsListeners (feedItem) {
  feedItem.addEventListener('mouseover', function () {
    this.classList.remove('pulse')
  })
  feedItem.addEventListener('focus', function () {
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
