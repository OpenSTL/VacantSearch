// DOM variables
const sidebarDOM = document.getElementById('sidebar');
const sidebarForm = document.getElementById('sidebar-form');
// variables for toggling sidebar. storing them here bc i think it's faster?
const tabRow = document.querySelector('.tab-row');
const toggleSidebarBtn = document.querySelector('.toggle-btn');
const toggleIcon = document.getElementById('toggle-icon');
const resultsDOM = document.getElementById('results-container');

// look for a better way
let searchHandles = [];

const API_URL = 'https://api.openstl.org/filter';

// FUNCTIONS

const hideSearchInProgress = () => {
  document.querySelector("#sidebar-form").classList.remove('invisible');
  document.querySelector("#sidebar-form-search-in-progress").classList.add('invisible');
}
const showSearchInProgress = () => {
  document.querySelector("#sidebar-form").classList.add('invisible')
  document.querySelector("#sidebar-form-search-in-progress").classList.remove('invisible');
}

const handleSubmitSearchForm = (event) => {

  event.preventDefault();
  searchHandles = [];
  showSearchInProgress();

  // Get Data from Form
  const formData = new FormData(sidebarForm);
  const priceMin = formData.get('form-price-min');
  const priceMax = formData.get('form-price-max');
  const sqFtMin = formData.get('form-acres-min');
  const sqFtMax = formData.get('form-acres-max');
  var neighborhood = formData.get('form-neighborhood');
  const minBaths = formData.get('form-baths-min');
  const maxBaths = formData.get('form-baths-max');

  const xhr = new XMLHttpRequest();
  xhr.open("POST", API_URL, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  // !! sample POST request JSON payload
  const data = JSON.stringify({
    //"Neighborhoods": [34, 13],
    "Neighborhoods": [neighborhood],  // 1 nbhood value (for now)
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
      // get json response, populate results
      const jsonResponse = JSON.parse(xhr.responseText);
      populateResults(jsonResponse);
      console.log('finished generating results');

      // set results tab active
      setTabActive('results');

      //add tiles to map
      jsonResponse.results.forEach(e => {
        searchHandles.push(e._parcel_id);
      });
      //console.log(searchHandles);
      highLightParcels('parcel-highlights', searchHandles);
      hideSearchInProgress();
    }
  }
};

const toggleResultsItem = (parcel_id) => {
  // loop through result items til id matches
  const resultItems = document.getElementsByClassName('results-item');
  for (let i = 0; i < resultItems.length; i++) {
    if (resultItems[i].classList.contains('result-open')) {
      resultItems[i].classList.remove('result-open');
    }
    if (parcel_id === resultItems[i].getAttribute('data-id')) {
      resultItems[i].classList.add('result-open');
      resultsDOM.scrollTop = (resultItems[i].offsetTop - 300);
    }
  }
}

const addResultsAccordian = (resultsItem) => {
  resultsItem.onclick = () => {
    resultsItem.classList.toggle('result-open');
    console.log(resultsItem)
    // temporary fix: calculate coords on frontend
    handleFlyToCoordinates( resultsItem.dataset.lat,resultsItem.dataset.lon)
  }
}

const populateResults = (json) => {
  // clear resultsDOM container of previous results
  resultsDOM.innerHTML = '';
  const resultsJSON = json.results;
  if (resultsJSON.length < 1) {
    const noResultsText = document.createElement('p');
    noResultsText.textContent = 'No matching results, please try another search';
    resultsDOM.appendChild(noResultsText);
    return;
  } //else {
  for (item in resultsJSON) {
    console.log(resultsJSON[item]);
    let resultsItem = createResultsTile(resultsJSON[item]);
    resultsDOM.appendChild(resultsItem);
  }
}

const createResultsTile = (resultsItemJSON) => {
  // center description items
  const id = resultsItemJSON._parcel_id;
  const nbhoodName = resultsItemJSON.nbrhd_name;
  const nbhoodCode = resultsItemJSON.nbrhd_code;
  const acres = resultsItemJSON.acres;
  const buildingType = resultsItemJSON.bldg_type;
  const wallMaterial = resultsItemJSON.wall_material;
  const basementType = resultsItemJSON.basement_type;
  const centralHeat = resultsItemJSON.central_heat;
  // top right info items
  const price = resultsItemJSON.price_residential;
  const sqFt = Math.floor(resultsItemJSON.size_sqFt);
  const baths = resultsItemJSON.bath_total;
  const points = JSON.parse(resultsItemJSON.parcel_geojson)[0]; // 1
  const point = points[0]
  const corner = point[0] //got it!
  console.log(JSON.parse(JSON.stringify(corner)))

  // create resultsItem HTML component
  const resultsItem = document.createElement('div');
  resultsItem.classList = 'results-item';
  // results icon(s) container
  const resultsItemIconContainer = document.createElement('div');
  resultsItemIconContainer.classList = 'results-item-icon-container';
  // icon (house or bldg) <-- add logic later
  const resultsItemIcon = document.createElement('i');
  resultsItemIcon.classList = 'fa results-item-icon';
  resultsItemIconContainer.appendChild(resultsItemIcon); // append before appending question icon
  // add 2nd icon question mark and append it if first word in lot_type is 'Possible'
  if (resultsItemJSON.lot_type.split(' ')[0] === "Possible") {
    // remove 'Possible' from lot_type so that switch statement will work
    const realLotType = resultsItemJSON.lot_type.split(' ').slice(1).join(' ');
    resultsItemJSON.lot_type = realLotType;
    const resultsItemIcon2 = document.createElement('i');
    resultsItemIcon2.classList = 'fa fa-question results-item-icon';
    resultsItemIconContainer.appendChild(resultsItemIcon2);
  }
  // if building, add building, if lot, add lot
  switch (resultsItemJSON.lot_type) {
    case 'Vacant Building':
      resultsItemIcon.classList.add('fa-building');
      break;
    case 'Vacant Lot':
      resultsItemIcon.classList.add('fa-seedling');
      break;
    default:
      resultsItemIcon.classList.add('fa-question');
  }
  resultsItem.appendChild(resultsItemIconContainer);
  // results details
  const resultsDetails = document.createElement('div');
  resultsDetails.classList = 'results-item-details';
  const resultsDetailsHeading = document.createElement('h3');
  const resultsDetailsHeadingSpan = document.createElement('span');
  resultsDetailsHeadingSpan.textContent = nbhoodName; //change later
  resultsDetailsHeading.appendChild(resultsDetailsHeadingSpan);
  // details list (can replace with something else)
  const resultsDetailsList = document.createElement('ul');
  const resultsDetailsId = document.createElement('li');
  const resultsDetailsNbhood = document.createElement('li');
  const resultsDetailsAcres = document.createElement('li');
  const resultsDetailsBldgType = document.createElement('li');
  const resultsDetailsWallMat = document.createElement('li');
  const resultsDetailsBasementType = document.createElement('li');
  const resultsDetailsCentralHeat = document.createElement('li');
  resultsDetailsId.textContent = `id: ${id}`;
  resultsDetailsNbhood.textContent = `nbCode: ${nbhoodCode}`;
  resultsDetailsAcres.textContent = `acres: ${acres}`;
  resultsDetailsBldgType.textContent = `building: ${buildingType}`;
  resultsDetailsWallMat.textContent = `walls: ${wallMaterial}`;
  resultsDetailsBasementType.textContent = `basement: ${basementType}`;
  resultsDetailsCentralHeat.textContent = `heating: ${centralHeat}`;
  resultsDetailsList.appendChild(resultsDetailsId);
  resultsDetailsList.appendChild(resultsDetailsNbhood);
  resultsDetailsList.appendChild(resultsDetailsAcres);
  resultsDetailsList.appendChild(resultsDetailsBldgType);
  resultsDetailsList.appendChild(resultsDetailsWallMat);
  resultsDetailsList.appendChild(resultsDetailsBasementType);
  resultsDetailsList.appendChild(resultsDetailsCentralHeat);
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
  addResultsAccordian(resultsItem);

  // add parcel id as data attribute to match with map
  resultsItem.setAttribute('data-id', id);
  resultsItem.setAttribute('data-lat',corner[0]);
  resultsItem.setAttribute('data-lon',corner[1]);

  return resultsItem;
}

// ATTACH EVENTS LISTENERS TO DOM:

// handle submit for sidebar search form
sidebarForm.addEventListener('submit', (event) => handleSubmitSearchForm(event));
