const closeBtn = document.querySelector('.close-bar-container');
const sideBar = document.querySelector('.right-info');

closeBtn.addEventListener('click', () => sideBar.classList.toggle('closed'));
