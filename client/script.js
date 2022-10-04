const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const linksList = document.querySelector('.links-list');
const spinner = document.querySelector('.spinner');
const errP = document.querySelector('.err');

const serverURL = 'https://nameless-mountain-61465.herokuapp.com/';

searchBtn.addEventListener('click', (e) => {
  linksList.innerHTML = '';
  errP.innerHTML = '';
  e.preventDefault();
  spinner.removeAttribute('hidden');
  if (searchInput.value == '') {
    errP.innerHTML = `<p class='err m-3'>No search input provided<p>`;
    spinner.setAttribute('hidden', '');
    return;
  }
  fetch(`${serverURL}/search/${searchInput.value}`)
    .then((res) => res.json())
    .then((data) => {
      spinner.setAttribute('hidden', '');

      if (data.msg) {
        errP.innerHTML = `<p class='err m-3'>${data.msg}<p>`;
        return;
      }
      data.forEach((link) => {
        linksList.innerHTML += `<a href="${link}" class="list-group-item list-group-item-action">${link}</a>`;
      });
    });
});
