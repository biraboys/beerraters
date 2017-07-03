const styleColorContainer = document.getElementById('style-color-container')
const styleColor = styleColorContainer.style.backgroundColor
const styleColorBoxes = document.getElementsByClassName('style-color-box')

for (let box of styleColorBoxes) {
  if (box.style.backgroundColor === styleColor) {
    box.style.transform = 'scale(1.4)'
    box.innerHTML += `
      <svg class="mt--15" fill="#000000" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 10l5 5 5-5z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
      `
  }
}
