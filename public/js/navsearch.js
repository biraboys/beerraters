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

$(document).ready(function() {
  const cookieAccept = localStorage.getItem('cookieAccept')
  if (!cookieAccept) {
    $('#cookie-div').removeClass('hide')
  }
  $('#cookie').click(function (e) {
    localStorage.setItem('cookieAccept', true)
    $('#cookie-div').remove()
  })
})
