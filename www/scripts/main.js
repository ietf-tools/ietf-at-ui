const alertError  = document.getElementById('alertError');
const buttonDownload = document.getElementById('buttonDownload');
const buttonOpen = document.getElementById('buttonOpen');
const formFile = document.getElementById('formFile');
const messageError = document.getElementById('messageError');
const alertExperimental = document.getElementById('alertExperimental');
const renderButtons = document.getElementsByClassName('render-btn');

reset();

formFile.addEventListener('change', reset);

for (let button of renderButtons) {
  button.addEventListener("click", render);
}

function getDownloadFilename(file, format) {
  if (format == 'text') {
    format = 'txt';
  }

  return file.name + '.' + format;
}

window.setTimeout(function() {
    var bsAlertExperimental = new bootstrap.Alert(alertExperimental);
    console.log(bsAlertExperimental);
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
  resetButtons();
}

function resetButtons() {
  for (let button of renderButtons) {
    button.disabled = false;
    button.innerText = button.dataset.title;
  }
}

function disableButtons() {
  for (let button of renderButtons) {
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
    });
}
