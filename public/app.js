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

  // Carousel logic
  const cards = document.querySelectorAll('.member-card');
  const dots = document.querySelectorAll('.dot-indicator');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let currentIndex = 0;

  function showMember(index) {
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active-card');
      } else {
        card.classList.remove('active-card');
      }
    });

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex === 0) ? cards.length - 1 : currentIndex - 1;
      showMember(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex === cards.length - 1) ? 0 : currentIndex + 1;
      showMember(currentIndex);
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        currentIndex = idx;
        showMember(currentIndex);
      });
    });
  }
});
