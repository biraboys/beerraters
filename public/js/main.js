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
  searchForm.action = 'http://localhost:6889/search/beers'
  activeButtons(this)
})

brewerySearch.addEventListener('click', function () {
  searchForm.action = 'http://localhost:6889/search/breweries'
  activeButtons(this)
})
userSearch.addEventListener('click', function () {
  searchForm.action = 'http://localhost:6889/search/users'
  activeButtons(this)
})
