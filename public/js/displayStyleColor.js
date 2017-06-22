const styleColorContainer = document.getElementById('style-color-container')
const styleColor = styleColorContainer.style.backgroundColor
const styleColorBoxes = document.getElementsByClassName('style-color-box')
const markDownImg = document.createElement('img')
markDownImg.style.marginTop = '-1.5rem'
markDownImg.src = '/icons/mark-down.svg'

for (let box of styleColorBoxes) {
  if (box.style.backgroundColor === styleColor) {
    box.style.transform = 'scale(1.4)'
    box.appendChild(markDownImg)
  }
}
