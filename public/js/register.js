// const registerForm = document.forms.register

// async function getBeerCountries () {
//   try {
//     const response = await fetch('/countries')
//     const countries = await response.json()
//     sortByName(countries)
//     countries.forEach(country => {
//       registerForm.country.innerHTML += `
//       <option value="${country._id}" data-icon="/images/flags/${country.flag}" class="circle">${country.name}</option>
//       `
//     })
//   } catch (err) {
//     console.log(err)
//   }
  
// }

// // Helper functions
// function sortByName (array) {
//   return array.sort((a, b) => {
//     return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
//   })
// }

// getBeerCountries()

