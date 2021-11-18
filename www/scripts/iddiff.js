const alertError  = document.getElementById('alertError');
const formFile1 = document.getElementById('formFile1');
const formFile2 = document.getElementById('formFile2');
const formID1 = document.getElementById('formID1');
const formID2 = document.getElementById('formID2');
const messageError = document.getElementById('messageError');
const buttonCompare = document.getElementById('buttonCompare');

reset();

formFile1.addEventListener('change', reset);
formFile2.addEventListener('change', reset);
buttonCompare.addEventListener('click', compare);

function reset() {
  alertError.style.display = 'none';
  messageError.innerHTML = '';
  resetButtons();
}

function resetButtons() {
  buttonCompare.disabled = false;
  buttonCompare.innerText = buttonCompare.dataset.title;
}

function compare(event) {
  reset();

  buttonCompare.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>' + buttonCompare.innerHTML;
  buttonCompare.disabled = true;

  const formData = new FormData();
  const file1 = formFile1.files[0];
  const file2 = formFile2.files[0];

  formData.append('file_1', file1);
  formData.append('file_2', file2);
  if (formID1.value.length > 0) {
    formData.append('id_1', formID1.value);
  }
  if (formID2.value.length > 0) {
    formData.append('id_2', formID2.value);
  }

  const apiCall = 'https://author-tools.ietf.org/api2/iddiff';

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
        // diff is successful
        window.location.href = data;
      }
    })
    .catch((error) => {
      resetButtons();
      alertError.style.display = 'block';
      messageError.innerHTML = error;
    });
}
