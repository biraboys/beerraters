const logout = document.getElementById('logout')
const reportBugBtn = document.getElementById('report-bug-btn')
const reportText = document.getElementById('report-text')
const reportLabel = document.getElementById('report-label')

if (logout) {
  logout.addEventListener('click', function (e) {
    e.preventDefault()
    logoutSession()
  })
}

async function logoutSession () {
  const response = await fetch(`/logout`, {
    method: 'post',
    credentials: 'same-origin'
  })

  if (response.status === 200) {
    const text = await response.json()
    console.log(text.msg)
    window.location.href = '/'
  } else if (response.status === 500) {
    const text = await response.json()
    console.log(text.err)
  }
}

$('#report-bug').click(() => {
  $('#report-bug-form').modal('open')
})

reportBugBtn.addEventListener('click', function (e) {
  e.preventDefault()
  submitForm()
})

async function submitForm () {
  reportText.classList.remove('invalid')
  if (reportText.value.length > 0 && reportText.value.length < 121) {
    if (!reportText.value.replace(/\s/g, '').length) {
      reportText.classList.add('invalid')
      reportLabel.innerHTML = `So you think this would help us, huh?... nah`
      reportLabel.style.color = '#F44336'
    } else {
      reportLabel.innerHTML = 'Thanks for your message!'
      reportText.classList.add('valid')
      reportLabel.style.color = '#4CAF50'
      reportBugBtn.classList.add('disabled')
      const text = reportText.value
      sendMail(text)
      setTimeout(() => {
        location.href = location.pathname
        $('#report-bug-form').modal('close')
      }, 3000)
    }
  } else if (reportText.value.length > 120) {
    reportText.classList.add('invalid')
    reportLabel.innerHTML = 'Too many characters.'
    reportLabel.style.color = '#F44336'
  } else {
    reportText.classList.add('invalid')
    reportLabel.innerHTML = 'Please enter some text here...'
    reportLabel.style.color = '#F44336'
  }
}

async function sendMail (text) {
  try {
    const response = await fetch('/report', {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'post',
      credentials: 'same-origin',
      body: JSON.stringify({
        message: text
      })
    })
  } catch (err) {
    console.log(err)
  }
}
