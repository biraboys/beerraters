module.exports = {
  testForHtml: function (string) {
    return /[*<>+^${}()|[\]\\]/g.test(string)
  }
}
