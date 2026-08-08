window.addEventListener('DOMContentLoaded', () => {
  const loaderLine = document.getElementById('loader-line');
  const loaderText = document.getElementById('loader-text');
  const introLoader = document.getElementById('intro-loader');
  const mainContent = document.getElementById('main-content');

  setTimeout(() => {
    loaderLine.classList.add('expand-line');
  }, 50);

  setTimeout(() => {
    loaderText.classList.add('fade-out');
  }, 1100);

  setTimeout(() => {
    loaderLine.classList.add('shrink-line');
  }, 1350);

  setTimeout(() => {
    introLoader.style.display = 'none';
    mainContent.classList.remove('hidden-content');
    mainContent.classList.add('expand-box');
  }, 1650);
});
