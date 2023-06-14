const alertError  = document.getElementById('alertError');
const buttonDownload = document.getElementById('buttonDownload');
const buttonOpen = document.getElementById('buttonOpen');
const formFile = document.getElementById('formFile');
const messageError = document.getElementById('messageError');
const accordionItemWarnings = document.getElementById('accordionItemWarnings');
const accordionItemErrors = document.getElementById('accordionItemErrors');
const listWarnings = document.getElementById('listWarnings');
const listErrors = document.getElementById('listErrors');
const buttonClean = document.getElementById('buttonClean');

reset();

// enable Bootstrap/Popper tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

formFile.addEventListener('change', reset);
buttonClean.addEventListener('click', clean);

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
  listWarnings.innerHTML = '';
  listErrors.innerHTML = '';
  resetButtons();
}

function resetButtons() {
  buttonClean.disabled = false;
  buttonClean.innerText = buttonClean.dataset.title;
}

function disableButtons() {
  buttonClean.disabled = true;
}

function clean(event) {
  reset();

  buttonClean.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>' + buttonClean.innerHTML;
  disableButtons();

  const formData = new FormData();
  const file = formFile.files[0];

  formData.append('file', file);

  const apiCall = 'https://author-tools.ietf.org/api2/clean_svg_ids';

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
      }
      if (json.url && json.url.length > 0) {
        // file rendering is successful
        download_url = json.url + '?download=1'
        buttonDownload.style.display = 'block';
        buttonDownload.setAttribute('download', download_url);
        buttonDownload.href = download_url;
        buttonOpen.style.display = 'block';
        buttonOpen.setAttribute('href', json.url);
        buttonOpen.href = json.url;
      }
    })
    .catch((error) => {
      resetButtons();
      alertError.style.display = 'block';
      messageError.innerHTML = error;
    });
}
