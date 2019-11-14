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

// const API_URL = 'https://api.openstl.org/filter';
const API_URL = 'http://127.0.0.1:5000/filter';

// FUNCTIONS
// for switching tabs in sidebar
const setTabActive = (tabName) => {
  let searchTab = document.querySelector('.tab-search');
  let resultsTab = document.querySelector('.tab-results');
  if (tabName === 'search' && !searchTab.classList.contains('tab-active')) {
    resultsTab.classList.remove('tab-active');
    searchTab.classList.add('tab-active');
    document.querySelector('.tab-content-results').classList.remove('tab-active');
    document.querySelector('.tab-content-search').classList.add('tab-active');
  } else if (tabName === 'results' && !resultsTab.classList.contains('tab-active')) {
    searchTab.classList.remove('tab-active');
    resultsTab.classList.add('tab-active');
    document.querySelector('.tab-content-search').classList.remove('tab-active');
    document.querySelector('.tab-content-results').classList.add('tab-active');
  }
}

// no item exists for id's 20, 35, 36, 62, 64
const nbhoodsData = [ // quick workaround til we get the JSON figured out
  {
    "id": 0,
    "name": "All Neighborhoods"
  },
  {
    "id": 1,
    "name": "Carondelet"
  },
  {
    "id": 2,
    "name": "Patch"
  },
  {
    "id": 3,
    "name": "Holly Hills"
  },
  {
    "id": 4,
    "name": "Boulevard Heights"
  },
  {
    "id": 5,
    "name": "Bevo Mill"
  },
  {
    "id": 6,
    "name": "Princeton Heights"
  },
  {
    "id": 7,
    "name": "Southhampton"
  },
  {
    "id": 8,
    "name": "St. Louis Hills"
  },
  {
    "id": 9,
    "name": "Lindenwood Park"
  },
  {
    "id": 10,
    "name": "Ellendale"
  },
  {
    "id": 11,
    "name": "Clifton Heights"
  },
  {
    "id": 12,
    "name": "Hill, The"
  },
  {
    "id": 13,
    "name": "Southwest Garden"
  },
  {
    "id": 14,
    "name": "North Hampton"
  },
  {
    "id": 15,
    "name": "Tower Grove South"
  },
  {
    "id": 16,
    "name": "Dutchtown"
  },
  {
    "id": 17,
    "name": "Mount Pleasant"
  },
  {
    "id": 18,
    "name": "Marine Villa"
  },
  {
    "id": 19,
    "name": "Gravois Park"
  },
  {
    "id": 21,
    "name": "Soulard"
  },
  {
    "id": 22,
    "name": "Benton Park"
  },
  {
    "id": 23,
    "name": "McKinley Heights"
  },
  {
    "id": 24,
    "name": "Fox Park"
  },
  {
    "id": 25,
    "name": "Tower Grove East"
  },
  {
    "id": 26,
    "name": "Compton Heights"
  },
  {
    "id": 27,
    "name": "Shaw"
  },
  {
    "id": 28,
    "name": "Botanical Heights f/k/a McRee Town"
  },
  {
    "id": 29,
    "name": "Tiffany"
  },
  {
    "id": 30,
    "name": "Benton Park West"
  },
  {
    "id": 31,
    "name": "Gate District, The"
  },
  {
    "id": 32,
    "name": "Lafayette Square"
  },
  {
    "id": 33,
    "name": "Peabody, Darst, Webbe"
  },
  {
    "id": 34,
    "name": "LaSalle"
  },
  {
    "id": 37,
    "name": "Midtown"
  },
  {
    "id": 38,
    "name": "Central West End"
  },
  {
    "id": 39,
    "name": "Forest Park Southeast"
  },
  {
    "id": 40,
    "name": "Kings Oak"
  },
  {
    "id": 41,
    "name": "Cheltenham"
  },
  {
    "id": 42,
    "name": "Clayton/Tamm"
  },
  {
    "id": 43,
    "name": "Franz Park"
  },
  {
    "id": 44,
    "name": "Hi-Point"
  },
  {
    "id": 45,
    "name": "Wydown/Skinker"
  },
  {
    "id": 46,
    "name": "Skinker/DeBaliviere"
  },
  {
    "id": 47,
    "name": "DeBaliviere Place"
  },
  {
    "id": 48,
    "name": "West End"
  },
  {
    "id": 49,
    "name": "Visitation Park"
  },
  {
    "id": 50,
    "name": "Wells/Goodfellow"
  },
  {
    "id": 51,
    "name": "Academy"
  },
  {
    "id": 52,
    "name": "Kingsway West"
  },
  {
    "id": 53,
    "name": "Fountain Park"
  },
  {
    "id": 54,
    "name": "Lewis Place"
  },
  {
    "id": 55,
    "name": "Kingsway East"
  },
  {
    "id": 56,
    "name": "Greater Ville, The"
  },
  {
    "id": 57,
    "name": "Ville, The"
  },
  {
    "id": 58,
    "name": "Vandeventer"
  },
  {
    "id": 59,
    "name": "Jeff VanderLou"
  },
  {
    "id": 60,
    "name": "St. Louis Place"
  },
  {
    "id": 61,
    "name": "Carr Square"
  },
  {
    "id": 63,
    "name": "Old North St. Louis"
  },
  {
    "id": 65,
    "name": "Hyde Park"
  },
  {
    "id": 66,
    "name": "College Hill"
  },
  {
    "id": 67,
    "name": "Fairground Neighborhood"
  },
  {
    "id": 68,
    "name": "O'Fallon"
  },
  {
    "id": 69,
    "name": "Penrose"
  },
  {
    "id": 70,
    "name": "Mark Twain/I-70 Industrial"
  },
  {
    "id": 71,
    "name": "Mark Twain"
  },
  {
    "id": 72,
    "name": "Walnut Park East"
  },
  {
    "id": 73,
    "name": "North Point"
  },
  {
    "id": 74,
    "name": "Baden"
  },
  {
    "id": 75,
    "name": "Riverview"
  },
  {
    "id": 76,
    "name": "Walnut Park West"
  },
  {
    "id": 77,
    "name": "Covenant Blu/Grand Center"
  },
  {
    "id": 78,
    "name": "Hamilton Heights"
  }
];

const fillNeighborhoods = () => {
  const selectNbhood = document.getElementById('form-neighborhood');
  selectNbhood.innerHTML = '';

  // add all neighborhood options
  for (nbhoodItem in nbhoodsData) {
    // create nbhoodItem
    let nbhoodOption = document.createElement('option');
    nbhoodOption.setAttribute('value', nbhoodsData[nbhoodItem].id);
    nbhoodOption.textContent = nbhoodsData[nbhoodItem].name;
    selectNbhood.appendChild(nbhoodOption);
  }
}

window.onload = fillNeighborhoods();
//const btnReset = document.querySelector('.btn-reset');

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
  var neighborhood = parseInt(formData.get('form-neighborhood'));
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

// toggle entire sidebar
toggleSidebarBtn.addEventListener('click', () => {
  sidebarDOM.classList.toggle('active');
  toggleSidebarBtn.classList.toggle('active');
  toggleIcon.classList.toggle('fa-chevron-left');
  toggleIcon.classList.toggle('fa-chevron-right');
});
// toggle sidebar tabs
tabRow.addEventListener('click', (e) => {
  if (e.target.classList.contains('tab-search')) {
    setTabActive('search');
  } else if (e.target.classList.contains('tab-results')) {
    setTabActive('results');
  }
});
// handle submit for sidebar search form
sidebarForm.addEventListener('submit', (event) => handleSubmitSearchForm(event));
