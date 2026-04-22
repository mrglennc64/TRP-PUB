/*  Roya – EN / SV language toggle
    Include on every page. Each page defines window.TRANSLATIONS before this script loads,
    OR defines it after and calls royaLang.apply().

    Usage:
      1. Add <script> with page-specific TRANSLATIONS object
      2. Add <script src="/lang.js"></script>
      3. Toggle is auto-injected into the first <nav> found
*/
(function () {
  var STORAGE_KEY = 'royaLang';

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function syncLanguageRoutes(lang) {
    var seeHref = lang === 'sv' ? '/pages/see.html' : '/see.html';
    var faqHref = lang === 'sv' ? '/pages/FAQ.html' : '/FAQ.html';
    var documentsHref = lang === 'sv' ? '/pages/documents.html' : '/documents.html';

    document.querySelectorAll('a[href="/see.html"], a[href="/pages/see.html"]').forEach(function (el) {
      el.setAttribute('href', seeHref);
    });

    document.querySelectorAll('a[href="/FAQ.html"], a[href="/pages/FAQ.html"]').forEach(function (el) {
      el.setAttribute('href', faqHref);
    });

    document.querySelectorAll('a[href="/documents.html"], a[href="/pages/documents.html"]').forEach(function (el) {
      el.setAttribute('href', documentsHref);
    });
  }

  /* Walk all text nodes under root and replace matches */
  function translateNode(root, dict) {
    // Translate text nodes
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var node;
    while ((node = walker.nextNode())) {
      var txt = node.nodeValue;
      if (!txt || !txt.trim()) continue;
      var trimmed = txt.trim();
      if (dict[trimmed]) {
        node.nodeValue = txt.replace(trimmed, dict[trimmed]);
      }
    }
    // Translate placeholders & titles
    root.querySelectorAll('[placeholder]').forEach(function (el) {
      var v = el.getAttribute('placeholder');
      if (dict[v]) el.setAttribute('placeholder', dict[v]);
    });
    root.querySelectorAll('[title]').forEach(function (el) {
      var v = el.getAttribute('title');
      if (dict[v]) el.setAttribute('title', dict[v]);
    });
    // Translate <title>
    if (dict[document.title]) document.title = dict[document.title];
  }

  function buildDict(translations, lang) {
    if (lang === 'en') {
      // Build reverse dict: sv -> en
      var rev = {};
      for (var en in translations) {
        if (translations.hasOwnProperty(en)) rev[translations[en]] = en;
      }
      return rev;
    }
    // en -> sv
    return translations;
  }

  function apply() {
    var T = window.TRANSLATIONS;
    if (!T) return;
    var lang = getLang();
    syncLanguageRoutes(lang);
    if (lang === 'en') return; // default, no translation needed on fresh load
    translateNode(document.body, buildDict(T, 'sv'));
  }

  function toggle(lang) {
    var T = window.TRANSLATIONS;
    if (!T) return;
    var currentLang = getLang();
    if (lang === currentLang) return;
    // Translate current page
    var dict;
    if (lang === 'sv') {
      dict = T; // en -> sv
    } else {
      // sv -> en (reverse)
      dict = {};
      for (var en in T) {
        if (T.hasOwnProperty(en)) dict[T[en]] = en;
      }
    }
    translateNode(document.body, dict);
    setLang(lang);
    syncLanguageRoutes(lang);
    updateToggleUI(lang);
  }

  function updateToggleUI(lang) {
    var enBtn = document.getElementById('_langEN');
    var svBtn = document.getElementById('_langSV');
    if (!enBtn || !svBtn) return;
    if (lang === 'sv') {
      svBtn.style.color = '#22d3ee';
      svBtn.style.fontWeight = '700';
      enBtn.style.color = '';
      enBtn.style.fontWeight = '400';
    } else {
      enBtn.style.color = '#22d3ee';
      enBtn.style.fontWeight = '700';
      svBtn.style.color = '';
      svBtn.style.fontWeight = '400';
    }
  }

  function injectToggle() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    // Find the right container (last flex child or append)
    var container = nav.querySelector('.flex.items-center.gap-4') ||
                    nav.querySelector('.nav-links') ||
                    nav.querySelector('.flex.items-center');
    if (!container) container = nav;

    var wrap = document.createElement('span');
    wrap.style.cssText = 'display:inline-flex;align-items:center;gap:2px;font-size:11px;margin-left:8px;border:1px solid rgba(255,255,255,0.2);border-radius:12px;padding:2px 6px;';

    var enBtn = document.createElement('a');
    enBtn.id = '_langEN';
    enBtn.href = '#';
    enBtn.textContent = 'EN';
    enBtn.style.cssText = 'text-decoration:none;padding:1px 4px;cursor:pointer;transition:color 0.2s;';
    enBtn.onclick = function (e) { e.preventDefault(); toggle('en'); };

    var sep = document.createElement('span');
    sep.textContent = '|';
    sep.style.cssText = 'opacity:0.4;font-size:10px;';

    var svBtn = document.createElement('a');
    svBtn.id = '_langSV';
    svBtn.href = '#';
    svBtn.textContent = 'SV';
    svBtn.style.cssText = 'text-decoration:none;padding:1px 4px;cursor:pointer;transition:color 0.2s;';
    svBtn.onclick = function (e) { e.preventDefault(); toggle('sv'); };

    wrap.appendChild(enBtn);
    wrap.appendChild(sep);
    wrap.appendChild(svBtn);
    container.appendChild(wrap);

    updateToggleUI(getLang());
  }

  // Public API
  window.royaLang = { apply: apply, toggle: toggle, getLang: getLang };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectToggle();
      apply();
    });
  } else {
    injectToggle();
    apply();
  }
})();
