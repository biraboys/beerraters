const searchForm = document.forms.searchForm
const beerSearch = document.getElementById('beer-search-btn')
const brewerySearch = document.getElementById('brewery-search-btn')
const userSearch = document.getElementById('user-search-btn')
const searchButtonArr = Array.from(document.getElementsByClassName('search-btn'))

function activeButtons (current) {
  current.classList.add('button-primary')
  searchButtonArr.forEach(button => {
    if (button.classList.contains('button-primary') && button !== current) {
      button.classList.remove('button-primary')
    }
  })
}

beerSearch.addEventListener('click', function () {
  searchForm.action = '/search/beers'
  activeButtons(this)
})

brewerySearch.addEventListener('click', function () {
  searchForm.action = '/search/breweries'
  activeButtons(this)
})
userSearch.addEventListener('click', function () {
  searchForm.action = '/search/users'
  activeButtons(this)
})
// async function findBeer (searchForm) {
//   console.log(searchForm.action)
//   const url = searchForm.action
//   try {
//     const response = await fetch(url)
//     console.log(response)
//     const beers = response.text()
//     console.log(beers)
//   } catch (err) {
//     console.log(err)
//   }

searchForm.q.addEventListener('keyup', function () {
  const errorContainer = document.getElementById('error-container')
  if (this.value.length < 3) {
    errorContainer.innerHTML = 'Search needs to be at least three characters long'
  } else {
    errorContainer.innerHTML = ''
  }
})
var mymap = L.map('mapid').setView([51.505, -0.09], 13)