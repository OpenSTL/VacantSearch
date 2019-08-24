// GRAB VARIABLES FROM DOM
const sidebarForm = document.getElementById('sidebar-form');
//const btnReset = document.querySelector('.btn-reset');

// API_URL
const API_URL = 'http://api.openstl.org:8080/filter';

// ATTACH EVENTS
// Submit Form
sidebarForm.addEventListener('submit', (event) => {
  event.preventDefault();
  // Get Data from Form
  const formData = new FormData(sidebarForm);
  const priceMin = formData.get('form-price-min');
  const priceMax = formData.get('form-price-max');
  const sqFtMin = formData.get('form-acres-min');
  const sqFtMax = formData.get('form-acres-max');
  const neighborhood = formData.get('form-neighborhood');
  const minBaths = formData.get('form-baths-min');
  const maxBaths = formData.get('form-baths-max');

  const xhr = new XMLHttpRequest();
  xhr.open("POST", API_URL, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  // !! sample POST request JSON payload
  const data = JSON.stringify({
    //"Neighborhoods": [34, 13],
    "Neighborhoods": neighborhood,  // 1 nbhood
    "LotType": 3,  // 1 vacant lot, 2 vacant building, 3 both
    "IncludePossible": true,
    "NumBathsMin": minBaths,
    "NumBathsMax": maxBaths,
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
      const jsonResponse = JSON.parse(xhr.responseText);
      // log JSON in web console
      console.log(jsonResponse);
      // also display JSON response as html
      const resultsJSON = JSON.stringify(jsonResponse);
      console.log(resultsJSON);
      populateResults(jsonResponse);
    }
  }
});

const populateResults = (json) => {
  // get reference to results container
  const resultsDOM = document.getElementById('results-container');
  // clear resultsDOM container of previous results
  resultsDOM.innerHTML = '';
  const resultsJSON = json.results;
  if (resultsJSON.length < 1) {
    const noResultsText = document.createElement('p');
    noResultsText.textContent = ('No matching results, please try another search');
    resultsDOM.appendChild(noResultsText);
    return;
  }
  for (let item in resultsJSON) {
    console.log(resultsJSON[item]);
    let resultsItem = createResultsTile(resultsJSON[item]);
    resultsDOM.appendChild(resultsItem);
  }
  console.log('finished generating results');
}

const createResultsTile = (resultsItemJSON) => {
  // needs: Price, Baths, SqFt, Name, ...?
  const id = resultsItemJSON._parcel_id;
  const nbhoodName = resultsItemJSON.nbrhd_name;
  const nbhoodCode = resultsItemJSON.nbrhd_code;
  const acres = resultsItemJSON.acres
  const price = resultsItemJSON.price_residential;
  const sqFt = Math.floor(resultsItemJSON.size_sqFt);
  const baths = resultsItemJSON.bath_total;

  // create resultsItem HTML component
  const resultsItem = document.createElement('div');
  resultsItem.classList = 'results-item';
  // icon (house or bldg) <-- add logic later
  const resultsItemIcon = document.createElement('i');
  resultsItemIcon.classList = 'fa fa-home results-item-icon';
  resultsItem.appendChild(resultsItemIcon);
  // results details
  const resultsDetails = document.createElement('div');
  resultsDetails.classList = 'results-item-details';
  const resultsDetailsHeading = document.createElement('h3');
  resultsDetailsHeading.textContent = nbhoodName; //change later
  // details list (can replace with something else)
  const resultsDetailsList = document.createElement('ul');
  const resultsDetailsId = document.createElement('li');
  resultsDetailsId.textContent = `id: ${id}`;
  const resultsDetailsNbhood = document.createElement('li');
  resultsDetailsNbhood.textContent = `nbCode: ${nbhoodCode}`;
  const resultsDetailsAcres = document.createElement('li');
  resultsDetailsAcres.textContent = `acres: ${acres}`;
  resultsDetailsList.appendChild(resultsDetailsId);
  resultsDetailsList.appendChild(resultsDetailsNbhood);
  resultsDetailsList.appendChild(resultsDetailsAcres);
  // add heading and list to details and add details to item
  resultsDetails.appendChild(resultsDetailsHeading);
  resultsDetails.appendChild(resultsDetailsList);
  resultsItem.appendChild(resultsDetails);
  // resultsItem stats
  const resultsStats = document.createElement('div');
  resultsStats.classList = 'results-item-stats';
  const priceStat = document.createElement('span');
  priceStat.textContent = '$' + price;
  const bathsStat = document.createElement('span');
  bathsStat.textContent = baths + ' Bath';
  const sqFtStat = document.createElement('span');
  sqFtStat.textContent = sqFt + 'SF';
  resultsStats.appendChild(priceStat);
  resultsStats.appendChild(bathsStat);
  resultsStats.appendChild(sqFtStat);
  // add resultsStats to resultsItem
  resultsItem.appendChild(resultsStats);

  // add results item to DOM
  return resultsItem;
}

// populate with javascript
//const nbhoodJSON = API_URL('')
