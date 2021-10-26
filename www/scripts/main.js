const alertError  = document.getElementById('alertError');
const buttonDownload = document.getElementById('buttonDownload');
const buttonOpen = document.getElementById('buttonOpen');
const formFile = document.getElementById('formFile');
const messageError = document.getElementById('messageError');
const alertExperimental = document.getElementById('alertExperimental');
const renderButtons = document.getElementsByClassName('render-btn');
const actionButtons = document.getElementsByClassName('action-btn');
const buttonValidate = document.getElementById('buttonValidate');
const accordionValidation = document.getElementById('accordionValidation');
const accordionItemWarnings = document.getElementById('accordionItemWarnings');
const accordionItemErrors = document.getElementById('accordionItemErrors');
const accordionItemIdnits = document.getElementById('accordionItemIdnits');
const listWarnings = document.getElementById('listWarnings');
const listErrors = document.getElementById('listErrors');
const preIdnits = document.getElementById('preIdnits');

reset();

formFile.addEventListener('change', reset);
buttonValidate.addEventListener('click', validate);

for (let button of renderButtons) {
  button.addEventListener("click", render);
}

function getDownloadFilename(file, format) {
  if (format == 'text') {
    format = 'txt';
  }

  return file.name.replace(/\.[^/.]+$/, '.' + format);
}

window.setTimeout(function() {
    var bsAlertExperimental = new bootstrap.Alert(alertExperimental);
    bsAlertExperimental.close();
}, 4000);

function reset() {
  alertError.style.display = 'none';
  buttonDownload.style.display = 'none';
  buttonDownload.setAttribute('download', '');
  buttonDownload.href = '#';
  buttonOpen.style.display = 'none';
  buttonOpen.href = '#';
  messageError.innerHTML = '';
  accordionValidation.style.display = 'none';
  accordionItemWarnings.style.display = 'none';
  accordionItemErrors.style.display = 'none';
  accordionItemIdnits.style.display = 'none';
  listWarnings.innerHTML = '';
  listErrors.innerHTML = '';
  preIdnits.innerHTML ='';
  resetButtons();
}

function resetButtons() {
  for (let button of actionButtons) {
    button.disabled = false;
    button.innerText = button.dataset.title;
  }
}

function disableButtons() {
  for (let button of actionButtons) {
    button.disabled = true;
  }
}

function render(event) {
  reset();

  var button = event.target || event.srcElement;
  button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>' + button.innerHTML;
  disableButtons();

  const formData = new FormData();
  const format = button.value;
  const file = formFile.files[0];

  formData.append('file', file);

  const apiCall = 'https://author-tools.ietf.org/api2/render/' + format;

  const request = new Request(apiCall, {
    method: 'POST',
    body: formData
  });

  fetch(request)
    .then(response => response.blob())
    .then(blob => {
      if (blob.type == 'application/json') {
        alertError.style.display = 'block';
        return blob.text();
      }
      else {
        return URL.createObjectURL(blob);
      }
    })
    .then(data => {
      try {
        resetButtons();
        data = JSON.parse(data);
        messageError.innerHTML = data.error;
      } catch (error) {
        // file rendering is successful
        buttonDownload.style.display = 'block';
        buttonDownload.setAttribute('download', getDownloadFilename(file, format));
        buttonDownload.href = data;
        buttonOpen.style.display = 'block';
        buttonOpen.setAttribute('href', getDownloadFilename(file, format));
        buttonOpen.href = data;
      }
    })
    .catch((error) => {
      resetButtons();
      alertError.style.display = 'block';
      messageError.innerHTML = error;
    });
}

function validate() {
  reset();

  buttonValidate.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>' + buttonValidate.innerHTML;
  disableButtons();

  const formData = new FormData();
  const file = formFile.files[0];

  formData.append('file', file);

  const apiCall = 'https://author-tools.ietf.org/api2/validate';

  const request = new Request(apiCall, {
    method: 'POST',
    body: formData
  });

  fetch(request)
    .then(function(response) { return response.json(); })
    .then(function(json) {
      resetButtons();
      if (json.error) {
        alertError.style.display = 'block';
        messageError.innerHTML = json.error;
      } else {
        accordionValidation.style.display = 'block';
        if (json.warnings && json.warnings.length > 0) {
          accordionItemWarnings.style.display = 'block';
          for (var i in json.warnings) {
            var li  = document.createElement('li');
            li.innerText = json.warnings[i];
            listWarnings.appendChild(li);
          }
        }
        if (json.errors && json.errors.length > 0) {
          accordionItemErrors.style.display = 'block';
          for (var i in json.errors) {
            var li  = document.createElement('li');
            li.innerText = json.errors[i];
            listErrors.appendChild(li);
          }
        }
        if (json.idnits) {
          accordionItemIdnits.style.display = 'block';
          preIdnits.innerHTML = json.idnits;
        }
      }
    })
    .catch((error) => {
      resetButtons();
      alertError.style.display = 'block';
      messageError.innerHTML = error;
    });
}
