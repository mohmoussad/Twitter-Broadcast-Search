const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

const serverURL = 'https://nameless-mountain-61465.herokuapp.com/';

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  fetch(`${serverURL}/search/${searchInput.value}`)
    .then((res) => res.json())
    .then((data) => console.log(data));
});
