const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

const serverURL = 'http://localhost:3000';

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  fetch(`${serverURL}/search/${searchInput.value}`)
    .then((res) => res.json())
    .then((data) => console.log(data));
});
