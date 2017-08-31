const addBeerForm = document.forms.addBeer

addBeerForm.style.onchange = function () {
  showMatchingCategories(this.value)
}

addBeerForm.country.onchange = function () {
  showMatchingBreweries(this.value)
}

async function showMatchingCategories (style) {
  const categoryInputField = document.getElementById('category-input-field')
  const categoryInput = addBeerForm.category
  const otherCategoryInput = addBeerForm.otherCategory
  try {
    const response = await fetch(`/styles/${style}/categories`)
    const categories = await response.json()
    if (categories.length > 0) {
      otherCategoryInput.setAttribute('hidden', true)
      otherCategoryInput.removeAttribute('required')
      categoryInputField.classList.remove('hide')
      categoryInput.innerHTML = ''
      sortByName(categories)
      categories.forEach(category => {
        categoryInput.innerHTML +=
        `<option value="${category._id}">${category.name}</option>`
      })
      categoryInput.innerHTML += `<option value="Other">Other</option>`
      addBeerForm.category.onchange = function () {
        if (this.value === 'Other') {
          otherCategoryInput.removeAttribute('hidden')
          otherCategoryInput.setAttribute('required', true)
        } else {
          otherCategoryInput.setAttribute('hidden', true)
          otherCategoryInput.removeAttribute('required')
        }
      }
    } else {
      categoryInputField.classList.remove('hide')
      categoryInput.innerHTML = `<option value="Other">Other</option>`
      otherCategoryInput.removeAttribute('hidden')
      otherCategoryInput.setAttribute('required', true)
    }
    $('select').material_select()
  } catch (err) {
    console.log(err)
    Materialize.toast(`Sorry, could not fetch categories`, 2000)
  }
}

async function showMatchingBreweries (country) {
  const breweryInputField = document.getElementById('brewery-input-field')
  const breweryInput = addBeerForm.brewery
  const otherBreweryInput = addBeerForm.otherBrewery
  try {
    const response = await fetch(`/countries/${country}/breweries`)
    const breweries = await response.json()
    if (breweries.length > 0) {
      otherBreweryInput.setAttribute('hidden', true)
      otherBreweryInput.removeAttribute('required')
      breweryInputField.classList.remove('hide')
      breweryInput.innerHTML = ''
      sortByName(breweries)
      breweries.forEach(brewery => {
        breweryInput.innerHTML +=
          `<option value="${brewery._id}">${brewery.name}</option>`
      })
      breweryInput.innerHTML += `<option value="Other">Other</option>`
      addBeerForm.brewery.onchange = function () {
        if (this.value === 'Other') {
          otherBreweryInput.removeAttribute('hidden')
          otherBreweryInput.setAttribute('required', true)
        } else {
          otherBreweryInput.setAttribute('hidden', true)
          otherBreweryInput.removeAttribute('required')
        }
      }
    } else {
      breweryInputField.classList.remove('hide')
      breweryInput.innerHTML = `<option value="Other">Other</option>`
      otherBreweryInput.removeAttribute('hidden')
      otherBreweryInput.setAttribute('required', true)
    }
    $('select').material_select()
  } catch (err) {
    console.log(err)
    Materialize.toast(`Sorry, could not fetch breweries`, 2000)
  }
}

function sortByName (array) {
  return array.sort((a, b) => {
    return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
  })
}
