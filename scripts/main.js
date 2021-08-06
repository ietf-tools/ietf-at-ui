document.getElementById('buttonSubmit').onclick = function() {
  const formData = new FormData();
  formData.append('file', document.getElementById('formFile').files[0]);

  const apiCall = 'https://devbox.amsl.com:55555/api/render/' + document.getElementById('selectFormat').value;

  const request = new Request(apiCall, {
    method: 'POST',
    body: formData
  });

  fetch(request)
    .then(response => response.blob())
    .then(blob => URL.createObjectURL(blob))
    .then(url => {
        window.open(url);
        URL.revokeObjectURL(url);
    });
}
