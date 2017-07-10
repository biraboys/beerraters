const name = document.getElementById('name')
const displayname = document.getElementById('displayname')
const description = document.getElementById('description')

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
