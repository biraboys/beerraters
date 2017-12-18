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
      categoryInput.innerHTML += `<option value="180158b3c3014c618706d0d7">Other</option>`
      addBeerForm.category.onchange = function () {
        if (this.value === '180158b3c3014c618706d0d7') {
          otherCategoryInput.removeAttribute('hidden')
          otherCategoryInput.setAttribute('required', true)
        } else {
          otherCategoryInput.setAttribute('hidden', true)
          otherCategoryInput.removeAttribute('required')
        }
      }
    } else {
      categoryInputField.classList.remove('hide')
      categoryInput.innerHTML = `<option value="180158b3c3014c618706d0d7">Other</option>`
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
      breweryInput.innerHTML += `<option value="f92603c88a6f4ae6a76d513a">Other</option>`
      addBeerForm.brewery.onchange = function () {
        if (this.value === 'f92603c88a6f4ae6a76d513a') {
          otherBreweryInput.removeAttribute('hidden')
          otherBreweryInput.setAttribute('required', true)
        } else {
          otherBreweryInput.setAttribute('hidden', true)
          otherBreweryInput.removeAttribute('required')
        }
      }
    } else {
      breweryInputField.classList.remove('hide')
      breweryInput.innerHTML = `<option value="f92603c88a6f4ae6a76d513a">Other</option>`
      otherBreweryInput.removeAttribute('hidden')
      otherBreweryInput.setAttribute('required', true)
    }
    $('select').material_select()
  } catch (err) {
    console.log(err)
    Materialize.toast(`Sorry, could not fetch breweries`, 2000)
  }
}

async function postBeer () {
  try {
    const response = await fetch('/beers/add', {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'post',
      credentials: 'same-origin',
      body: JSON.stringify({
        name: addBeerForm.name.value.trim(),
        style: addBeerForm.style.value,
        category: addBeerForm.category.value,
        country: addBeerForm.country.value,
        brewery: addBeerForm.brewery.value,
        description: addBeerForm.description.value.trim(),
        otherCategory: addBeerForm.otherCategory.value.trim(),
        otherBrewery: addBeerForm.otherBrewery.value.trim()
      })
    })
    if (response.status === 201) {
      const newBeer = await response.json()
      Materialize.toast(`Your beer was created! Check it out <a href="/beers/${newBeer._id}">here</a>`, 10000)
    } else {
      Materialize.toast('Hmmm...Something went wrong. Check your input fields for special characters', 5000)
    }
  } catch (err) {
    console.log(err)
  }
}

function sortByName (array) {
  return array.sort((a, b) => {
    return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
  })
}

/**
 * Blocks space as first character in input fields
 */
function blockSpaceAsFirstInput () {
  const inputs = document.getElementsByTagName('input')
  for (const input of inputs) {
    input.addEventListener('keydown', e => {
      if (e.which === 32 && e.target.selectionStart === 0) {
        e.preventDefault()
      }
    })
  }
}

function addBeerFormListener () {
  addBeerForm.addEventListener('submit', e => {
    e.preventDefault()
    postBeer()
  })
}

addBeerFormListener()
blockSpaceAsFirstInput()
