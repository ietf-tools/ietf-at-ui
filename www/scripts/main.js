const alertError  = document.getElementById('alertError');
const buttonDownload = document.getElementById('buttonDownload');
const formFile = document.getElementById('formFile');
const messageError = document.getElementById('messageError');
const selectFormat = document.getElementById('selectFormat');

reset();

formFile.addEventListener('change', reset);
selectFormat.addEventListener('change', reset);

function getDownloadFilename(file, format) {
  if (format == 'text') {
    format = 'txt';
  }

  return file.name + '.' + format;
}

function reset() {
  alertError.style.display = 'none';
  buttonDownload.style.display = 'none';
  buttonDownload.setAttribute('download', '');
  buttonDownload.href = '#';
  messageError.innerHTML = '';
}

document.getElementById('buttonSubmit').onclick = function() {
  const formData = new FormData();
  const format = selectFormat.value;
  const file = formFile.files[0];

  formData.append('file', file);

  reset();

  const apiCall = 'http://devbox.amsl.com:8888/api/render/' + format;

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
        data = JSON.parse(data);
        messageError.innerHTML = data.error;
      } catch (error) {
        // file rendering is successful
        buttonDownload.style.display = 'block';
        buttonDownload.setAttribute('download', getDownloadFilename(file, format));
        buttonDownload.href = data;
      }
    });
}
