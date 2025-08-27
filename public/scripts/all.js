(function() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  const MIN_WIDTH = 1060;

  // Hamburger menu toggle
  hamburger.onclick = () => {
    if (hamburger.classList.contains('is-active')) {
      hamburger.addEventListener('transitionend', () => {
        document.body.toggleAttribute('menu-active');
      }, { once: true });
      nav.toggleAttribute('reveal');
      hamburger.classList.toggle('is-active');
    } else {
      document.body.toggleAttribute('menu-active');
      hamburger.addEventListener('transitionend', () => {
        nav.toggleAttribute('reveal');
      }, { once: true });
      hamburger.classList.toggle('is-active');
    }
  };

  // Reset nav if window resized above min width
  window.onresize = () => {
    if (window.innerWidth >= MIN_WIDTH) {
      if (hamburger.classList.contains('is-active')) {
        hamburger.classList.toggle('is-active');
        nav.toggleAttribute('reveal');
        document.body.toggleAttribute('menu-active');
      }
    }
  };

  // Flicker animations
  document.querySelectorAll('[flicker]').forEach(e => {
    const parent = e.parentElement;
    let animation = false;
    parent.addEventListener('mouseover', async () => {
      if (animation) return;
      animation = true;
      for (const e of parent.querySelectorAll('[flicker]')) {
        e.setAttribute('flicker', 'active');
        await new Promise(resolve => {
          e.addEventListener('animationend', () => {
            e.setAttribute('flicker', '');
            resolve();
          }, { once: true });
        });
      }
      animation = false;
    });
  });
})();

document.addEventListener("DOMContentLoaded", function() {
  // Mobile dropdown toggle
  document.querySelectorAll(".dropdown").forEach(drop => {
    const button = drop.querySelector(".nav-txt"); // clickable text
    button.addEventListener("click", function(e) {
      e.stopPropagation(); // prevent body click
      drop.classList.toggle("active");
    });
  });

  // Close dropdown if clicking outside
  document.addEventListener("click", function(e) {
    document.querySelectorAll(".dropdown.active").forEach(drop => {
      if (!drop.contains(e.target)) {
        drop.classList.remove("active");
      }
    });
  });

  // Member card flip on mobile
  const memberCards = document.querySelectorAll(".member-gallery .card");
  memberCards.forEach(card => {
    card.addEventListener("click", () => {
      if (window.innerWidth < 1060) {
        card.querySelector(".card-inner").classList.toggle("flipped");
      }
    });
  });

  // Project card toggle on mobile
  const projectCards = document.querySelectorAll(".project-gallery .card");
  projectCards.forEach(card => {
    card.addEventListener("click", () => {
      if (window.innerWidth < 1060) {
        card.classList.toggle("active");
      }
    });
  });
});
