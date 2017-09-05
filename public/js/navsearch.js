const navSearchForm = document.forms.navSearchForm

navSearchForm.addEventListener('submit', function (e) {
  const searchVal = navSearchForm.search.value
  e.preventDefault()
  sessionStorage.setItem('searchVal', searchVal)
  sessionStorage.removeItem('beerCards')
  sessionStorage.removeItem('resultMessage')
  sessionStorage.removeItem('navigationButtons')
  sessionStorage.removeItem('beersJSON')
  location.href = '/search'
})
