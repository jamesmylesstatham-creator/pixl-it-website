(function () {
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme-toggle');
  var a11yBtn = document.getElementById('a11y-toggle');
  var cookieBanner = document.getElementById('cookie-banner');
  var cookieDismiss = document.getElementById('cookie-dismiss');

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
  }

  var savedTheme = read('pixl-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.setAttribute('data-theme', savedTheme);
  }
  if (read('pixl-a11y') === 'on') {
    root.setAttribute('data-a11y', 'on');
    if (a11yBtn) a11yBtn.setAttribute('aria-pressed', 'true');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      // dark is the site default, so an unset theme counts as dark
      var current = root.getAttribute('data-theme');
      var isDark = current ? current === 'dark' : true;
      var next = isDark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      write('pixl-theme', next);
    });
  }

  if (a11yBtn) {
    a11yBtn.addEventListener('click', function () {
      var on = root.getAttribute('data-a11y') === 'on';
      if (on) {
        root.removeAttribute('data-a11y');
        a11yBtn.setAttribute('aria-pressed', 'false');
        write('pixl-a11y', 'off');
      } else {
        root.setAttribute('data-a11y', 'on');
        a11yBtn.setAttribute('aria-pressed', 'true');
        write('pixl-a11y', 'on');
      }
    });
  }

  if (cookieBanner && !read('pixl-notice-seen')) {
    cookieBanner.hidden = false;
  }
  if (cookieDismiss) {
    cookieDismiss.addEventListener('click', function () {
      write('pixl-notice-seen', 'yes');
      if (cookieBanner) cookieBanner.hidden = true;
    });
  }

  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    var statusEl = document.getElementById('contact-form-status');
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (contactForm.querySelector('.hp-field input').value) return; // honeypot tripped
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      if (statusEl) { statusEl.removeAttribute('data-state'); statusEl.textContent = ''; }
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(contactForm)
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            contactForm.reset();
            if (statusEl) { statusEl.textContent = "Thanks — we'll be in touch shortly."; statusEl.setAttribute('data-state', 'ok'); }
          } else {
            if (statusEl) { statusEl.textContent = 'Something went wrong sending that — please email or call us instead.'; statusEl.setAttribute('data-state', 'error'); }
          }
        })
        .catch(function () {
          if (statusEl) { statusEl.textContent = 'Something went wrong sending that — please email or call us instead.'; statusEl.setAttribute('data-state', 'error'); }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send message'; }
        });
    });
  }
})();
