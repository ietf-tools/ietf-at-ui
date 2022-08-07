const alertError  = document.getElementById('alertError');
const messageError = document.getElementById('messageError');

alertError.style.display = 'none';
messageError.innerHTML = '';

const apiCall = 'https://author-tools.ietf.org/api2/version';

const request = new Request(apiCall, {
  method: 'GET',
});

fetch(request)
  .then(function(response) { return response.json(); })
  .then(function(json) {
    document.getElementById('spanIetfat').innerHTML = json.versions.author_tools_api;
    document.getElementById('spanXml2rfc').innerHTML = json.versions.xml2rfc;
    document.getElementById('spanKramdown').innerHTML = json.versions['kramdown-rfc'];
    document.getElementById('spanMmark').innerHTML = json.versions.mmark;
    document.getElementById('spanId2xml').innerHTML = json.versions.id2xml;
    document.getElementById('spanIdnits').innerHTML = json.versions.idnits;
    document.getElementById('spanIddiff').innerHTML = json.versions.iddiff;
    document.getElementById('spanWeasyprint').innerHTML = json.versions.weasyprint;
    document.getElementById('spanAasvg').innerHTML = json.versions.aasvg;
    document.getElementById('spanBap').innerHTML = json.versions.bap;
  })
  .catch(error => {
      alertError.style.display = 'block';
      messageError.innerHTML = 'Error occured while retrieving version infomation.';
  });
