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

// form stuff
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // get data
  // send data object in fetch
  //done in send_request.js, I believe
})