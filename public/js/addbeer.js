const addBeerForm = document.forms.addBeer

addBeerForm.style.onchange = function () {
  showMatchingCategories(this.value)
}

addBeerForm.country.onchange = function () {
  showMatchingBreweries(this.value)
}

async function showMatchingCategories (style) {
  try {
    const response = await fetch(`/styles/${style}/categories`)
    const categories = await response.json()
    if (categories.length > 0) {
      const categoryInput = addBeerForm.category
      const otherCategoryInput = addBeerForm.otherCategory
      categoryInput.removeAttribute('disabled')
      categoryInput.innerHTML = ''
      sortByName(categories)
      categories.forEach(category => {
        categoryInput.innerHTML +=
          `
          <option value="${category.name}">${category.name}</option>
          `
      })
      categoryInput.innerHTML += `
        <option value="Other">Other</option>
        `
      addBeerForm.category.onchange = function () {
        if (this.value === 'Other') {
          otherCategoryInput.removeAttribute('hidden')
          otherCategoryInput.setAttribute('required', true)
        } else {
          otherCategoryInput.setAttribute('hidden', true)
          otherCategoryInput.removeAttribute('required')
        }
      }
    }
  } catch (err) {

  }
}

async function showMatchingBreweries (country) {
  try {
    const response = await fetch(`/countries/${country}/breweries`)
    const breweries = await response.json()
    if (breweries.length > 0) {
      const breweriesInput = addBeerForm.brewery
      const otherBreweryInput = addBeerForm.otherBrewery
      breweriesInput.removeAttribute('disabled')
      breweriesInput.innerHTML = ''
      sortByName(breweries)
      breweries.forEach(breweries => {
        breweriesInput.innerHTML +=
          `
          <option value="${breweries.name}">${breweries.name}</option>
          `
      })
      breweriesInput.innerHTML += `
        <option value="Other">Other</option>
        `
      addBeerForm.brewery.onchange = function () {
        if (this.value === 'Other') {
          otherBreweryInput.removeAttribute('hidden')
          otherBreweryInput.setAttribute('required', true)
        } else {
          otherBreweryInput.setAttribute('hidden', true)
          otherBreweryInput.removeAttribute('required')
        }
      }
    }
  } catch (err) {

  }
}

function sortByName (array) {
  return array.sort((a, b) => {
    return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
  })
}
