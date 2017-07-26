async function getBeerRankings () {
  const beersContainer = document.getElementById('beers-container')
  const loader = document.getElementById('loader')
  loader.classList.add('loading')
  try {
    const response = await fetch('/toplist/getBeers')
    const beers = await response.json()
    sortByRating(beers)
    console.log(beers)
    beers.forEach((beer, index) => {
      if (index < 5) {
        const avgRating = getRatingStars(beer)
        let imageSrc
        if (beer.images.length > 0) {
          imageSrc = `/uploads/beers/${beer._id}/${beer.images[0].name}`
        } else {
          imageSrc = `/images/bottle.png`
        }
        beersContainer.innerHTML += `
             <div class="row" style="padding: 0.5rem;">
               <div class="card beer-card">
                 <div class="row">
                   <div class="one-third column">  
                     <div class="card-image">
                       <img class="u-max-full-width" src="${imageSrc}">
                     </div>
                   </div>
                   <div class="two-thirds column">
                     <div class="card-header">
                       <div class="card-title">
                         <a href="beers/${beer._id}">${beer.name}</a>
                       </div>
                       <div class="card-title">
                         ${avgRating}
                         <span class="card-subtitle">
                           ${beer.avg_rating}
                         </span>
                       </div>
                       <div class="card-subtitle"><a class="card-link" href="styles/${beer.style_id._id}">${beer.style_id.name}</a></div>
                       <div class="card-subtitle"><a class="card-link" href="countries/${beer.country_id._id}">${beer.country_id.name}</a></div>
                       <div class="card-subtitle">Ratings: ${beer.ratings.length}</div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
      `
      }
    })
  } catch (err) {
    console.log(err)
  }
  loader.classList.remove('loading')
}

// Helper functions
function sortByRating (array) {
  return array.sort((a, b) => {
    return (a.avg_rating > b.avg_rating) ? -1 : (a.avg_rating < b.avg_rating) ? 1 : 0
  })
}

function getRatingStars (beer) {
  let numberType, blackStars, greyStars
  let avgRating = ''
  beer.avg_rating % 1 === 0 ? numberType = 'int' : numberType = 'float'
  switch (numberType) {
    case 'int':
      blackStars = beer.avg_rating / 1
      for (let i = 1; i <= blackStars; i++) {
        avgRating += `
        <svg class="va-middle" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        `
      }
      greyStars = 5 - blackStars
      for (let i = 1; i <= greyStars; i++) {
        avgRating += `
        <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        `
      }
      break
    case 'float':
      blackStars = beer.avg_rating / 1
      for (let i = 1; i <= Math.floor(blackStars); i++) {
        avgRating += `
        <svg class="va-middle" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        `
      }
      avgRating += `
         <svg class="va-middle" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
            <path d="M0 0h24v24H0V0z" id="a"/>
          </defs>
          <clipPath id="b">
            <use overflow="visible" xlink:href="#a"/>
          </clipPath>
          <path clip-path="url(#b)" d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
        </svg>
        `
      greyStars = Math.floor(5 - blackStars)
      for (let i = 1; i <= greyStars; i++) {
        avgRating += `
        <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        `
      }
      break
  }
  return avgRating
}

getBeerRankings()
