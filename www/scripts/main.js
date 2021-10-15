const alertError  = document.getElementById('alertError');
const buttonSubmit = document.getElementById('buttonSubmit');
const buttonSubmitting = document.getElementById('buttonSubmitting');
const buttonDownload = document.getElementById('buttonDownload');
const buttonOpen = document.getElementById('buttonOpen');
const formFile = document.getElementById('formFile');
const messageError = document.getElementById('messageError');
const selectFormat = document.getElementById('selectFormat');
const alertExperimental = document.getElementById('alertExperimental');

reset();

formFile.addEventListener('change', reset);
selectFormat.addEventListener('change', reset);

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
  buttonSubmit.style.display = 'block';
  buttonSubmitting.style.display = 'none';
  buttonDownload.style.display = 'none';
  buttonDownload.setAttribute('download', '');
  buttonDownload.href = '#';
  buttonOpen.style.display = 'none';
  buttonOpen.href = '#';
  messageError.innerHTML = '';
}

buttonSubmit.onclick = function() {
  reset();
  buttonSubmit.style.display = 'none';
  buttonSubmitting.style.display = 'block';

  const formData = new FormData();
  const format = selectFormat.value;
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
        buttonSubmitting.style.display = 'none';
        buttonSubmit.style.display = 'block';
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
