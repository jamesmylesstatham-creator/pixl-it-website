(function () {
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme-toggle');
  var a11yBtn = document.getElementById('a11y-toggle');
  var cookieBanner = document.getElementById('cookie-banner');
  var cookieAccept = document.getElementById('cookie-accept');
  var cookieDecline = document.getElementById('cookie-decline');

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
      var current = root.getAttribute('data-theme');
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var isDark = current ? current === 'dark' : systemDark;
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

  if (cookieBanner && !read('pixl-cookie-consent')) {
    cookieBanner.hidden = false;
  }
  function setConsent(val) {
    write('pixl-cookie-consent', val);
    if (cookieBanner) cookieBanner.hidden = true;
  }
  if (cookieAccept) cookieAccept.addEventListener('click', function () { setConsent('accepted'); });
  if (cookieDecline) cookieDecline.addEventListener('click', function () { setConsent('declined'); });
})();
