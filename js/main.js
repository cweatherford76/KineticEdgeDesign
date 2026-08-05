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

  // Light/dark theme toggle. The inline script in <head> already set
  // data-theme before paint (reading localStorage or the OS preference),
  // so this just wires up the click and keeps the icon/label in sync.
  var themeToggle = document.getElementById('themeToggle');

  if (themeToggle) {
    var root = document.documentElement;

    var syncToggleLabel = function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    };
    syncToggleLabel();

    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncToggleLabel();
    });

    // If the visitor hasn't made an explicit choice, keep following the
    // OS-level preference live (e.g. their system switches to dark at night).
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
        var stored;
        try { stored = localStorage.getItem('theme'); } catch (e) {}
        if (!stored) {
          root.setAttribute('data-theme', event.matches ? 'dark' : 'light');
          syncToggleLabel();
        }
      });
    }
  }

  // The site's one contact form gets relocated by JS: normally it sits
  // inline in the page's Contact section, but package/hosting CTAs pop
  // it into a floating dialog instead of jumping down the page. A
  // comment node marks its original spot so it can be moved back on close.
  var contactForm = document.getElementById('contactForm');
  var contactDialog = document.getElementById('dialog-contact');
  var contactDialogBody = contactDialog && contactDialog.querySelector('.contact-dialog__body');
  var contactFormHome = contactForm && contactForm.parentNode;
  var contactFormAnchor = document.createComment('contact-form-anchor');
  if (contactForm) contactFormHome.insertBefore(contactFormAnchor, contactForm.nextSibling);

  function openContactDialog() {
    if (!contactDialog || !contactForm) return;
    contactDialogBody.appendChild(contactForm);
    contactDialog.showModal();
  }

  if (contactDialog) {
    contactDialog.addEventListener('close', function () {
      if (contactForm) contactFormHome.insertBefore(contactForm, contactFormAnchor);
    });
  }

  // Package detail dialogs + the hosting image lightbox
  document.querySelectorAll('[data-dialog]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      // If this trigger lives inside another open dialog (e.g. the "Get
      // Hosted" CTA at the bottom of a package detail popup), close that
      // one first rather than stacking dialogs.
      var ancestorDialog = trigger.closest('dialog');
      if (ancestorDialog && typeof ancestorDialog.close === 'function') ancestorDialog.close();

      var targetId = trigger.getAttribute('data-dialog');
      if (targetId === 'dialog-contact') { openContactDialog(); return; }

      var dialog = document.getElementById(targetId);
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    });
  });

  // Pricing cards: clicking anywhere on the card opens its detail dialog,
  // except the CTA button and "View full details" button, which keep their
  // own behavior (opening the contact dialog, or the detail dialog itself).
  document.querySelectorAll('[data-dialog-card]').forEach(function (card) {
    card.addEventListener('click', function (event) {
      if (event.target.closest('a, button')) return;
      var dialog = document.getElementById(card.getAttribute('data-dialog-card'));
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    });
  });

  document.querySelectorAll('dialog').forEach(function (dialog) {
    var closeBtn = dialog.querySelector('.package-dialog__close, .image-dialog__close');
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

  // Pre-fill the contact form's design/hosting package dropdowns from
  // whichever "Start Here" / "Get Hosted" CTA the visitor clicked,
  // whether on the pricing card itself or inside its detail dialog.
  // Picking a design package also preselects our recommended hosting
  // tier for it (matches the pairing called out in each package's detail
  // dialog); picking a hosting package only sets that field.
  var designPackageSelect = document.getElementById('design-package');
  var hostingPackageSelect = document.getElementById('hosting-package');

  var recommendedHostingFor = {
    'dialog-personal-site': 'dialog-hosting-personal',
    'dialog-basic': 'dialog-hosting-standard',
    'dialog-intermediate': 'dialog-hosting-premium',
    'dialog-advanced': 'dialog-hosting-premium'
  };

  function setSelectByPackageId(select, packageId) {
    var option = select && select.querySelector('option[data-package-id="' + packageId + '"]');
    if (option) select.value = option.value;
  }

  document.querySelectorAll('[data-dialog="dialog-contact"]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var source = trigger.closest('[data-dialog-card], dialog.package-dialog');
      var packageId = source && (source.getAttribute('data-dialog-card') || source.id);
      if (!packageId) return;

      if (packageId.indexOf('dialog-hosting-') === 0) {
        setSelectByPackageId(hostingPackageSelect, packageId);
        return;
      }

      setSelectByPackageId(designPackageSelect, packageId);
      var recommended = recommendedHostingFor[packageId];
      if (recommended) setSelectByPackageId(hostingPackageSelect, recommended);
    });
  });

  // Contact form — submit via fetch so the visitor stays on the page
  // instead of being redirected to Formspree. Falls back to a normal
  // form POST (and Formspree's own redirect) if JS fails.
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
