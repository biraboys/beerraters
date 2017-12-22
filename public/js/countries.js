const ctx = document.getElementById('myChart').getContext('2d')
const countryIdElement = location.href
const countryId = countryIdElement.split('/')[4]
const loadingContainer = document.getElementById('loading-container')

async function getCountries () {
  loadingContainer.classList.add('active')
  try {
    const response = await fetch('/countries')
    const countries = await response.json()
    const current = countries.find(country => {
      return country._id === countryId
    })
    sortByBeersAmount(countries)
    const topFive = countries.filter((country, index) => {
      if (index <= 5 && country !== current) {
        return country
      }
    })
    if (topFive.indexOf(current) === -1) {
      topFive.unshift(current)
    } else {
      if (countries.indexOf(current) !== 0) {
        topFive.unshift(countries[countries.indexOf(current)])
      }
    }
    createChart(topFive)
  } catch (err) {
    console.log(err)
  }
}

function sortByBeersAmount (array) {
  return array.sort((a, b) => {
    return (a.beers.length > b.beers.length) ? -1 : (a.beers.length < b.beers.length) ? 1 : 0
  })
}

function createChart (topFive) {
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [topFive[0].name, topFive[1].name, topFive[2].name, topFive[3].name, topFive[4].name],
      datasets: [{
        data: [topFive[0].beers.length, topFive[1].beers.length, topFive[2].beers.length, topFive[3].beers.length, topFive[4].beers.length],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)'
        ],
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      legend: {
        display: false
      }
    }
  })
  loadingContainer.classList.remove('active')
}

getCountries()
