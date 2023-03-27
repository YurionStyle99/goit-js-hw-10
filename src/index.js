import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/Countries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');

const debouncedFetch = debounce((searchQuery) => {
  const sanitizedQuery = searchQuery.trim();

  if (sanitizedQuery.length === 0) {
    renderCountries([]);
    return;
  }


  fetchCountries(sanitizedQuery)
    .then((countries) => renderCountries(countries))
    .catch((error) => console.log(error));
}, DEBOUNCE_DELAY);


searchBox.addEventListener('input', (event) => {
  debouncedFetch(event.target.value);
});

function renderCountries(countries) {
  if (countries.length > 10) {
    return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    
  }

  if (countries.length >= 2 && countries.length <= 10) {
    countryList.innerHTML = '';
    return countries.forEach((country) => {
      const { name: { official }, flags: { svg }, capital, population, languages = {} } = country;
      const countryItem = document.createElement('li');
      countryItem.innerHTML = `<img src="${svg}" alt="${official} flag" width="30" height="20"> ${official}`;
      countryList.appendChild(countryItem);
      countryItem.style.listStyle = 'none';
    });
  }

  if (countries.length === 1) {
    const { name: { official }, flags: { svg }, capital, population, languages = {} } = countries[0];
    const languagesArray = Object.values(languages).map((lang) => lang);
    const countryCard = `
      <div class="card">
        <img src="${svg}" alt="${official} flag" class="card-img-top" width="150px">
        <div class="card-body">
          <h1 class="card-title">${official}</h1>
          <p class="card-text"><strong>Capital:</strong> ${capital}</p>
          <p class="card-text"><strong>Population:</strong> ${population}</p>
          <p class="card-text"><strong>Languages:</strong> ${languagesArray.join(', ')}</p>
        </div>
      </div>
    `;
    countryList.innerHTML = countryCard;
  }

  if (countries.length === 0) {
    countryList.innerHTML = '';
  }
}

