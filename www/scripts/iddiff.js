const alertError  = document.getElementById('alertError');
const formFile1 = document.getElementById('formFile1');
const formFile2 = document.getElementById('formFile2');
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
