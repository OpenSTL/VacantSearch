// DOM variables
const toggleSidebarBtn = document.querySelector('.toggle-btn');
const sidebar = document.getElementById('sidebar');
const toggleIcon = document.getElementById('toggle-icon');
const form = document.getElementById('sidebar-form');
const tabRow = document.querySelector('.tab-row');

// toggle event listener
toggleSidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  toggleSidebarBtn.classList.toggle('active');
  toggleIcon.classList.toggle('fa-angle-left');
  toggleIcon.classList.toggle('fa-angle-right');
});

tabRow.addEventListener('click', (e) => {
  if (e.target.classList.contains('tab-search')) {
    setTabActive('search');
  } else if (e.target.classList.contains('tab-results')) {
    setTabActive('results');
  }
});

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

// no id for 20, 35, 36, 62, 64
const nbhoodsData = [ // quick workaround til we get the JSON figured out
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

  // create first option to 'select all' neighborhoods
  let nbhoodOptionAll = document.createElement('option');
  nbhoodOptionAll.setAttribute('value', ''); // sets to all
  nbhoodOptionAll.textContent = 'All Neighborhoods';
  selectNbhood.appendChild(nbhoodOptionAll);

  // add the rest of the options
  for (nbhoodItem in nbhoodsData) {
    // create nbhoodItem
    let nbhoodOption = document.createElement('option');
    nbhoodOption.setAttribute('value', nbhoodsData[nbhoodItem].id);
    nbhoodOption.textContent = nbhoodsData[nbhoodItem].name;
    selectNbhood.appendChild(nbhoodOption);
  }
}


window.onload = fillNeighborhoods();

