const feedbackForm = document.forms.feedback
const subject = document.getElementById('feedback-subject')
const feedbackInput = document.getElementById('feedback-text')
const submitFeedButton = document.getElementById('feedback-btn')

feedbackForm.addEventListener('submit', (e) => {
  e.preventDefault()
  let subjectChosen = subject.options[subject.selectedIndex].value
  let feedbackInputValue = feedbackInput.value
  const isValidInput = checkFeedbackInput(feedbackInputValue)
  isValidInput ? postFeedback({ subjectChosen, feedbackInputValue }) : console.log(isValidInput)
})

function checkFeedbackInput (userinput) {
  if (!userinput.replace(/\s/g, '').length) {
    $('#feedback-text')
      .addClass('invalid')
    $('#feedback-text-label')
      .attr('data-error', 'White space only not allowed.')
    return false
  } else {
    if (userinput.length <= 250 && userinput.length >= 10) {
      return true
    } else {
      $('#feedback-text')
        .addClass('invalid')
      $('#feedback-text-label')
        .attr('data-error', 'Have atleast 10 characters and less then 250.')
      return false
    }
  }
}

async function postFeedback (requestbody) {
  submitFeedButton.classList.add('disabled')
  try {
    const response = await fetch('/contact', {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'post',
      credentials: 'same-origin',
      body: JSON.stringify(requestbody)
    })
    const data = await response.json()
    if (response.status === 200) {
      Materialize.toast(data.message, 3000)
      setTimeout(() => {
        location.href = '/'
      }, 3500)
    } else {
      Materialize.toast('Something went wrong, please try again later.', 3000)
    }
  } catch (err) {
    Materialize.toast('Something went wrong, please try again later.', 3000)
  }
}
