(function () {
  'use strict';

  /* =====================================================
     CONFIG — PUT YOUR OFFER LINK HERE (once)
     Every CTA button on the page is wired through this URL
     via window.open(). The <a href="#"> stays clean so
     the affiliate URL is NOT visible in browser status bar.
     ===================================================== */
  var ORDER_LINK = 'https://hop.clickbank.net/?affiliate=pshree786&vendor=cognicare&pid=pre1&tid=cmry';

  document.addEventListener('DOMContentLoaded', function () {

    /* -----------------------------------------------------
       1) WIRE EVERY CTA TO ORDER_LINK (URL HIDDEN FROM HOVER)
       ----------------------------------------------------- */
    document.querySelectorAll('a.order-btn, a[data-cta]').forEach(function (a) {
      // Keep href clean — the real URL is handled by click listener
      a.setAttribute('href', '#');
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');

      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (ORDER_LINK) {
          window.open(ORDER_LINK, '_blank', 'noopener');
        }
        // Track the click
        var p = { event: 'cta_click', cta: a.getAttribute('data-cta') || 'unknown', tier: a.getAttribute('data-tier') || 'main' };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(p);
        if (window.console) console.info('[cta]', p.cta, p.tier);
      });
    });

    /* -----------------------------------------------------
       2) STICKY BAR — show on desktop after scrolling
       ----------------------------------------------------- */
    var bar = document.querySelector('.cm-bar');
    if (bar) {
      var onScroll = function () {
        bar.classList.toggle('on', window.scrollY > 700);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* -----------------------------------------------------
       3) EXIT-INTENT (desktop) + TIME-OUT (mobile) MODAL
       ----------------------------------------------------- */
    (function () {
      var modal = document.getElementById('cmExit');
      if (!modal) return;
      if (sessionStorage.getItem('cmExitShown')) return;
      var shown = false;
      function show() {
        if (shown) return;
        shown = true;
        sessionStorage.setItem('cmExitShown', '1');
        modal.classList.add('on');
      }
      function close() { modal.classList.remove('on'); }
      document.addEventListener('mouseout', function (e) {
        if (!e.relatedTarget && e.clientY < 10) show();
      });
      setTimeout(show, 45000);
      modal.addEventListener('click', function (e) {
        if (e.target.closest('[data-exit-close]')) close();
      });
    })();

    /* -----------------------------------------------------
       4) PURCHASE-PROOF POPUP
       ----------------------------------------------------- */
    var names = ['James', 'Andrew B.', 'Harper Lewis', 'Robert L.', 'Michael R',
      'William Harris', 'Daniel Carter', 'Brian', 'Mark Brooks',
      'Devid Johnson', 'Jacob Reed', 'Sarah M.', 'Linda R.', 'Susan K.'];
    var cities = ['Austin, TX', 'Miami, FL', 'Seattle, WA', 'Denver, CO', 'Phoenix, AZ',
      'Chicago, IL', 'New York, NY', 'Los Angeles, CA', 'Atlanta, GA',
      'Nashville, TN', 'Portland, OR', 'Dallas, TX', 'Boston, MA', 'San Diego, CA'];

    function showPurchasePopup() {
      var popup = document.getElementById('purchasePopup');
      var nameEl = document.getElementById('popupName');
      var loc = document.getElementById('popupLocation');
      if (!popup || !nameEl || !loc) return;
      nameEl.textContent = names[Math.floor(Math.random() * names.length)];
      loc.textContent = cities[Math.floor(Math.random() * cities.length)];
      popup.classList.add('show');
      setTimeout(function () { popup.classList.remove('show'); }, 5000);
    }
    setTimeout(showPurchasePopup, 4000 + Math.random() * 1000);
    setInterval(showPurchasePopup, 30000 + Math.random() * 15000);

    /* -----------------------------------------------------
       5) REVEAL-ON-SCROLL (with safety net)
       ----------------------------------------------------- */
    var els = document.querySelectorAll('.cm-reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        });
      }, { threshold: 0.18 });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('is-in'); });
    }
    setTimeout(function () {
      document.querySelectorAll('.cm-reveal:not(.is-in)').forEach(function (el) {
        el.classList.add('is-in');
      });
    }, 2500);

    /* -----------------------------------------------------
       6) SCROLLSPY on the nav
       ----------------------------------------------------- */
    var secs = [].slice.call(document.querySelectorAll('main section[id]'));
    var links = [].slice.call(document.querySelectorAll('.cm-nav .nav-link[href^="#"]'));
    if (secs.length && links.length && 'IntersectionObserver' in window) {
      var so = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var id = e.target.getAttribute('id');
          links.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href').split('#')[1] === id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      secs.forEach(function (s) { so.observe(s); });
    }

    /* -----------------------------------------------------
       7) BOOTSTRAP FALLBACK (accordion + collapse)
       ----------------------------------------------------- */
    if (!window.bootstrap) {
      document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var t = document.querySelector(btn.getAttribute('data-bs-target'));
          if (!t) return;
          var open = t.classList.toggle('show');
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
          btn.classList.toggle('collapsed', !open);
          var parent = t.getAttribute('data-bs-parent');
          if (open && parent) {
            document.querySelectorAll(parent + ' .accordion-collapse.show').forEach(function (o) {
              if (o !== t) {
                o.classList.remove('show');
                var ob = document.querySelector('[data-bs-target="#' + o.id + '"]');
                if (ob) { ob.classList.add('collapsed'); ob.setAttribute('aria-expanded', 'false'); }
              }
            });
          }
        });
      });
    }

    /* -----------------------------------------------------
       8) CLOSE MOBILE NAV after tapping an in-page anchor
       ----------------------------------------------------- */
    var nav = document.getElementById('cmNav');
    var collapseEl = document.getElementById('cmNavCollapse');
    if (nav && collapseEl) {
      nav.addEventListener('click', function (ev) {
        var a = ev.target.closest('a[href^="#"]');
        if (!a) return;
        if (window.bootstrap) {
          var c = window.bootstrap.Collapse.getOrCreateInstance(collapseEl);
          if (collapseEl.classList.contains('show')) c.hide();
        } else {
          collapseEl.classList.remove('show');
        }
      });
    }

  });
})();