// GRAB VARIABLES FROM DOM
const sidebarForm = document.getElementById('sidebar-form');
//const btnReset = document.querySelector('.btn-reset');
// extra stuff
//const priceCount = document.querySelector('.price-count');
//const acresCount = document.querySelector('.acres-count');
//const bathsCount = document.querySelector('.baths-count');

// API_URL
const API_URL = 'http://api.openstl.org:8080/filter';

// ATTACH EVENTS
// Submit Form
sidebarForm.addEventListener('submit', (event) => {
  event.preventDefault();
  // Get Data from Form
  const formData = new FormData(sidebarForm);
  const priceMin = formData.get('form-price');
  const priceMax = formData.get('form-price1');
  const sqFtMin = formData.get('form-acres');
  const sqFtMax = formData.get('form-acres1');
  const neighborhood = formData.get('form-neighborhood');
  const baths = formData.get('form-baths');

  var xhr = new XMLHttpRequest();
  // !! Replace "127.0.0.1:5000" below with depolyment server hostname
  var url = "http://api.openstl.org:8080/filter";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  // !! sample POST request JSON payload
  var data = JSON.stringify({
    //"Neighborhoods": [34, 13],
    "Neighborhoods": neighborhood,  // 1 nbhood
    "LotType": 3,  // 1 vacant lot, 2 vacant building, 3 both
    "IncludePossible": true,
    "NumBathsMin": baths, // make 1
    "NumBathsMax": baths,
    "SqFtMin": sqFtMin,
    "SqFtMax": sqFtMax,
    "PriceMin": priceMin,
    "PriceMax": priceMax
  });
  // send post request
  xhr.send(data);
  // read JSON when http request has been successfully (HTTP 200) completed (State DONE)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var jsonResponse = JSON.parse(xhr.responseText);
      // log JSON in web console
      console.log(jsonResponse);
      // also display JSON response as html
      //var myJSON = JSON.stringify(jsonResponse);
      //document.getElementById('display').innerHTML = myJSON
    }
  }
});