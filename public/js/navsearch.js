const searchForm = document.forms.searchForm

searchForm.addEventListener('submit', function (e) {
  e.preventDefault()
  location.href = '/search'
})
