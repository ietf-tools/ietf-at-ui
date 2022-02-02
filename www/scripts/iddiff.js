const alertError  = document.getElementById('alertError');
const formFile1 = document.getElementById('formFile1');
const formFile2 = document.getElementById('formFile2');
const formID1 = document.getElementById('formID1');
const formID2 = document.getElementById('formID2');
const formURL1 = document.getElementById('formURL1');
const formURL2 = document.getElementById('formURL2');
const messageError = document.getElementById('messageError');
const buttonCompare = document.getElementById('buttonCompare');
const tabLinks = document.getElementsByClassName('tab-link');

reset();

// enable Bootstrap/Popper tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle2="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

formFile1.addEventListener('change', reset);
formFile2.addEventListener('change', reset);
formID1.addEventListener('keydown', submit);
formID2.addEventListener('keydown', submit);
formURL1.addEventListener('keydown', submit);
formURL2.addEventListener('keydown', submit);
buttonCompare.addEventListener('click', compare);
for (let tabLink of tabLinks) {
  tabLink.addEventListener('click', resetOther);
}

function submit(event) {
  if (event.key == 'Enter') {
    event.preventDefault();
    compare();
  }
}

function resetOther(event) {
  const clickedItem = event.target || event.srcElement;
  others = clickedItem.dataset.others.split(',');
  others.forEach(resetForm);
}

function resetForm(form_id) {
  const form = document.getElementById(form_id);
  form.reset();
}

function reset() {
  alertError.style.display = 'none';
  messageError.innerHTML = '';
  resetButtons();
}

function resetButtons() {
  buttonCompare.disabled = false;
  buttonCompare.innerText = buttonCompare.dataset.title;
}

function compare() {
  reset();

  buttonCompare.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>' + buttonCompare.innerHTML;
  buttonCompare.disabled = true;

  const formData = new FormData();
  const file1 = formFile1.files[0];
  const file2 = formFile2.files[0];

  if (!file1 && !file2) {
    if (formID1.value.length > 0) {
      url = '/diff?id_1=' + formID1.value;
      if (formID2.value.length > 0) {
        url += '&id_2=' + formID2.value;
      }
      else if (formURL2.value.length > 0) {
        url += '&url_2=' + formURL2.value;
      }
      window.location.href = url;
    }
    else if (formURL1.value.length > 0) {
      url = '/diff?url_1=' + formURL1.value;
      if (formURL2.value.length > 0) {
        url += '&url_2=' + formURL2.value;
      }
      else if (formID2.value.length > 0) {
        url += '&id_2=' + formID2.value;
      }
      window.location.href = url;
    }
  }

  formData.append('file_1', file1);
  formData.append('file_2', file2);
  if (formID1.value.length > 0) {
    formData.append('id_1', formID1.value);
  }
  if (formID2.value.length > 0) {
    formData.append('id_2', formID2.value);
  }
  if (formURL1.value.length > 0) {
    formData.append('url_1', formURL1.value);
  }
  if (formURL2.value.length > 0) {
    formData.append('url_2', formURL2.value);
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
