const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const linksList = document.querySelector('.links-list');
const spinner = document.querySelector('.spinner');
const errP = document.querySelector('.err');

// const serverURL = 'http://localhost:3000';
const serverURL = 'https://drab-plum-panther-hat.cyclic.app';

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
      if (data.msg) {
        errP.innerHTML = `<p class='err m-3'>${data.msg}<p>`;
        spinner.setAttribute('hidden', '');
        return;
      }
      data.forEach((link) => {
        fetch(`${serverURL}/check/${link.split('/')[5]}`)
          .then((res) => res.json())
          .then((data) => {
            spinner.setAttribute('hidden', '');
            const stateMapping = {
              true: {
                state: 'ACTIVE',
                style: 'bg-success',
              },
              false: {
                state: 'NOT ACTIVE',
                style: 'bg-danger',
              },
            };
            linksList.innerHTML += `
              <div class="d-flex flex-row align-items-center list-group-item list-group-item-action">
                <a href="${link}" target="_blank" class="list-group-item list-group-item-action mx-2">${link}</a>
                <span class="badge ${stateMapping[data.running].style}">${stateMapping[data.running].state}</span>
              </div>`;
          });
      });
    });
});
