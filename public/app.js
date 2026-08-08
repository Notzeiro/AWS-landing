window.addEventListener('DOMContentLoaded', () => {
  const loaderLine = document.getElementById('loader-line');
  const loaderText = document.getElementById('loader-text');
  const introLoader = document.getElementById('intro-loader');
  const mainContent = document.getElementById('main-content');
  const membersContent = document.getElementById('members-content');

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
    membersContent.classList.remove('hidden-content');
  }, 1650);

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        membersContent.classList.remove('encrypted-container');
        membersContent.classList.add('decrypted-container', 'shake-effect');

        setTimeout(() => {
          membersContent.classList.remove('shake-effect');
        }, 400);
      } else {
        membersContent.classList.remove('decrypted-container', 'shake-effect');
        membersContent.classList.add('encrypted-container');
      }
    });
  }, observerOptions);

  observer.observe(membersContent);
});
