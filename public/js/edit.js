const name = document.getElementById('name')
const displayname = document.getElementById('displayname')
const description = document.getElementById('description')
// const editForm = document.getElementById('edit-form')
// const currentpass = document.getElementById('currentpass')
// const newpass = document.getElementById('newpass')
// const confirmpass = document.getElementById('confirmpass')
// const currentpassMsg = document.getElementById('currentpassmsg')
// const newpassMsg = document.getElementById('newpassmsg')
// const confirmpassMsg = document.getElementById('confirmpassmsg')

async function test () {
  const path = window.location.pathname.split('/')
  const url = `/${path[1]}/${path[2]}/json`
  try {
    const response = await fetch(url, {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'get'
    })
    const data = await response.json()

    if (data) {
      name.value = data.name
      displayname.value = data.displayName || ''
      description.value = data.description
    }
  } catch (err) {
    console.log(err)
  }
}

test()

// editForm.addEventListener('click', async function (e) {
//   e.preventDefault()
//   const path = window.location.pathname.split('/')
//   const url = `/${path[1]}/${path[2]}/${path[3]}`
//   try {
//     const response = await fetch(url, {
//       headers: new Headers({
//         'Content-Type': 'application/json'
//       }),
//       method: 'post',
//       credentials: 'same-origin',
//       body: JSON.stringify({
//         name: name.value,
//         displayname: displayname.value,
//         description: description.value,
//         currentpass: currentpass.value,
//         confirmpass: confirmpass.value,
//         newpass: newpass.value
//       })
//     })
//     const data = await response.json()

//     if (data) {
//       if (data.message[0] === 'C') {
//         currentpassMsg.attributes[1].nodeValue = data.message
//         currentpass.className = 'validate invalid'
//       } else if (data.message[0] === 'M') {
//         newpassMsg.attributes[1].nodeValue = data.message
//         newpass.className = 'validate invalid'
//         confirmpassMsg.attributes[1].nodeValue = data.message
//         confirmpass.className = 'validate invalid'
//       } else {
//         console.log(data.message)
//         console.log('blä')
//       }
//     }
//     console.log(data)
//   } catch (error) {
//     console.log(error)
//   }
// })
