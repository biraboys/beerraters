const typeColorContainer = document.getElementById('type-color-container')
const typeColor = typeColorContainer.style.backgroundColor
const typeColorBoxes = document.getElementsByClassName('type-color-box')
const markDownImg = document.createElement('img')
markDownImg.style.marginTop = '-1.5rem'
markDownImg.src = '/icons/mark-down.svg'

for (let box of typeColorBoxes) {
  if (box.style.backgroundColor === typeColor) {
    box.style.transform = 'scale(1.4)'
    box.appendChild(markDownImg)
  }
}
