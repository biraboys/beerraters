module.exports = {
  sortByName: function (array) {
    return array.sort((a, b) => {
      return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
    })
  }
}
