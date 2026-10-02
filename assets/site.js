// Menu behaviour for every page: the mobile menu button, the Apps drop-down,
// and opening the right panel when a link points at #faq, #how-to or #privacy.
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  var dropBtn = document.querySelector('.drop-btn');
  var dropMenu = document.getElementById('apps-menu');
  function setDrop(open) {
    if (!dropBtn || !dropMenu) return;
    dropMenu.classList.toggle('open', open);
    dropBtn.setAttribute('aria-expanded', String(open));
  }
  if (dropBtn && dropMenu) {
    dropBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setDrop(!dropMenu.classList.contains('open'));
    });
    document.addEventListener('click', function (e) {
      if (!dropMenu.contains(e.target)) setDrop(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setDrop(false); dropBtn.focus(); }
    });
  }

  function openFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var el = document.getElementById(id);
    if (el && el.tagName === 'DETAILS') {
      el.open = true;
      el.scrollIntoView({ block: 'start' });
    }
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();
