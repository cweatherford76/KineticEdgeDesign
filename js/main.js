(function () {
  'use strict';

  document.documentElement.classList.add('has-js');

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll-reveal animations
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Package detail dialogs
  document.querySelectorAll('[data-dialog]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var dialog = document.getElementById(trigger.getAttribute('data-dialog'));
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    });
  });

  document.querySelectorAll('.package-dialog').forEach(function (dialog) {
    var closeBtn = dialog.querySelector('.package-dialog__close');
    if (closeBtn) closeBtn.addEventListener('click', function () { dialog.close(); });

    // Click on the backdrop (outside the dialog's own content box) closes it
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });

    // Let in-dialog CTA links close the dialog before navigating to their anchor
    dialog.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () { dialog.close(); });
    });
  });

  // Contact form — submit via fetch so the visitor stays on the page
  // instead of being redirected to Formspree. Falls back to a normal
  // form POST (and Formspree's own redirect) if JS fails.
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    var statusEl = contactForm.querySelector('.form-status');

    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      submitBtn.disabled = true;
      statusEl.textContent = 'Sending...';
      statusEl.setAttribute('data-state', 'sending');

      var fallbackMessage = 'Something went wrong. Please try again or email us directly.';

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          statusEl.textContent = "Thanks — we'll be in touch soon.";
          statusEl.setAttribute('data-state', 'success');
          contactForm.reset();
          return;
        }
        return response.json().then(function (data) {
          var message = (data && data.errors && data.errors.length)
            ? data.errors.map(function (e) { return e.message; }).join(', ')
            : fallbackMessage;
          statusEl.textContent = message;
          statusEl.setAttribute('data-state', 'error');
        }, function () {
          statusEl.textContent = fallbackMessage;
          statusEl.setAttribute('data-state', 'error');
        });
      }).catch(function () {
        // Network failure, CORS issue, etc. — never surface the raw
        // browser error message to the visitor.
        statusEl.textContent = fallbackMessage;
        statusEl.setAttribute('data-state', 'error');
      }).finally(function () {
        submitBtn.disabled = false;
      });
    });
  }
})();
