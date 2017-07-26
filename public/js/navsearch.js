const navSearchForm = document.forms.navSearchForm

navSearchForm.addEventListener('submit', function (e) {
  e.preventDefault()
  location.href = '/search'
})
