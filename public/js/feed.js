// async function getUserFollowing () {
//   const userId = document.getElementById('user-session-id').href.split('/')[4]
//   const activityList = document.getElementById('activity-list')
//   try {
//     const response = await fetch(`/users/${userId}/following`, {
//       method: 'get',
//       credentials: 'same-origin'
//     })
//     const user = await response.json()
//     console.log(user)
//     user.feed.forEach(feedItem => {
//       const feedListEl = document.createElement('li')
//       feedListEl.setAttribute('class', 'collection-item feed-item')
//       feedListEl.setAttribute('blah', feedItem._id)
//       feedListEl.innerHTML = feedItem.item
//       $(activityList).append(feedListEl)
//     })
//   } catch (err) {
//     console.log(err)
//   }
// }

function setRemoveFeedListener () {
  const activityList = document.getElementById('activity-list')
  $('.feed-closer').each().click(function () {
    const feedId = this.parentNode.getAttribute('data-target')
    removeFeedItem(feedId)
    activityList.removeChild(this.parentNode)
  })
}

function setRemoveFeedListenerOnToucb () {
  $('.dismissable').each().on('panend', function () {
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

}

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
// getUserFollowing()
setRemoveFeedListener()
setRemoveFeedListenerOnToucb()
