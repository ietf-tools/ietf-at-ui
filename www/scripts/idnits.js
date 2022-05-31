const formURL = document.getElementById('formURL');
const buttonIdnits = document.getElementById('buttonIdnits');
const buttonSubmissionCheck = document.getElementById('buttonSubmissionCheck');
const switchVerbose = document.getElementById('switchVerbose');
const switchVeryVerbose = document.getElementById('switchVeryVerbose');
const switchShowText = document.getElementById('switchShowText');
const switchSubmissionCheck = document.getElementById('switchSubmissionCheck');

reset();

// enable Bootstrap/Popper tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle2="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

formURL.addEventListener('keydown', submit);
buttonIdnits.addEventListener('click', idnits);
buttonSubmissionCheck.addEventListener('click', submissionCheck);

function submit(event) {
  formURL.classList.remove('is-invalid');
  if (event.key == 'Enter') {
    event.preventDefault();
    idnits();
  }
}

function reset() {
  resetButtons();
}

function resetButtons() {
  buttonIdnits.disabled = false;
  buttonIdnits.innerText = buttonIdnits.dataset.title;
  buttonSubmissionCheck.disabled = false;
  buttonSubmissionCheck.innerText = buttonSubmissionCheck.dataset.title;
}

function disableButtons() {
  buttonIdnits.disabled = true;
  buttonSubmissionCheck.disabled = true;
}

function idnits() {
  if (formURL.checkValidity()) {
    reset();

    buttonIdnits.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>' + buttonIdnits.innerHTML;
    disableButtons();

    url = 'https://author-tools.ietf.org/api/idnits?url=' + formURL.value;
    if (switchVeryVerbose.checked) {
      url += '&verbose=2';
    } else if (!switchVerbose.checked) {
      url += '&verbose=0';
    }
    if (!switchShowText.checked) {
      url += '&hidetext=True';
    }
    if (!switchSubmissionCheck.checked) {
      url += '&submissioncheck=True';
    }

    window.location.href = url;
  } else {
    formURL.classList.add('is-invalid');
    event.preventDefault();
    event.stopPropagation();
  }
}

function submissionCheck() {
  if (formURL.checkValidity()) {
    reset();

    buttonSubmissionCheck.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>' + buttonSubmissionCheck.innerHTML;
    disableButtons();

    url = 'https://author-tools.ietf.org/api/idnits?url=' + formURL.value;
    url += '&submissioncheck=True&hidetext=True';
    window.location.href = url;
  } else {
    formURL.classList.add('is-invalid');
    event.preventDefault();
    event.stopPropagation();
  }
}
