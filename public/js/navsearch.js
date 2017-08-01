const navSearchForm = document.forms.navSearchForm

navSearchForm.addEventListener('submit', function (e) {
  const searchVal = navSearchForm.search.value
  e.preventDefault()
  sessionStorage.setItem('searchVal', searchVal)
  location.href = '/search'
})
