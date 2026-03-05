/* Start Custom Sections JS */
/*
 * ============================================================================
 * custom-sections.js
 * Horizon Theme — Custom Sections JavaScript
 * ============================================================================
 * Handles:
 *   1. New Arrivals carousel navigation
 *   2. Scroll reveal animations (IntersectionObserver)
 *   3. Animated Announcement Bar pause-on-hover
 *   4. Hero Banner Responsive (no JS needed — pure CSS)
 *   5. Multicolumn (no JS needed — pure CSS)
 *
 * No external dependencies. Vanilla JS only.
 * Compatible with Horizon's existing JS architecture.
 * ============================================================================
 */

(function () {
  'use strict';

  /* ============================================================================
     Start: Scroll Reveal — IntersectionObserver
     ============================================================================ */
  function initScrollReveal() {
    /** @type {NodeListOf<HTMLElement>} */
    var elements = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.reveal-on-scroll'));
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      /* Fallback: show all immediately */
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var target = /** @type {HTMLElement} */ (entry.target);
            /* Stagger delay based on sibling index */
            var delay = 0;
            var parent = target.parentElement;
            if (parent) {
              var siblings = /** @type {NodeListOf<HTMLElement>} */ (parent.querySelectorAll('.reveal-on-scroll'));
              siblings.forEach(function (sib, idx) {
                if (sib === target) delay = idx * 80;
              });
            }
            setTimeout(function () {
              target.classList.add('is-visible');
            }, delay);
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) { observer.observe(el); });
  }
  /* End: Scroll Reveal */

  /* ============================================================================
     Start: New Arrivals Carousel
     ============================================================================ */
  function initNewArrivalsCarousels() {
    /** @type {NodeListOf<HTMLElement>} */
    var wrappers = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('[data-new-arrivals-carousel]'));

    wrappers.forEach(function (wrapper) {
      var carousel = /** @type {HTMLElement | null} */ (wrapper.querySelector('.new-arrivals__carousel'));
      var prevBtn  = /** @type {HTMLButtonElement | null} */ (wrapper.querySelector('.new-arrivals__carousel-btn--prev'));
      var nextBtn  = /** @type {HTMLButtonElement | null} */ (wrapper.querySelector('.new-arrivals__carousel-btn--next'));

      if (!carousel) return;

      var carouselEl = carousel;

      function getScrollAmount() {
        var item = /** @type {HTMLElement | null} */ (carouselEl.querySelector('.new-arrivals__carousel-item'));
        if (!item) return carouselEl.offsetWidth;
        var gap = parseInt(getComputedStyle(carouselEl).gap) || 0;
        return item.offsetWidth + gap;
      }

      function updateButtons() {
        if (!prevBtn || !nextBtn) return;
        prevBtn.disabled = carouselEl.scrollLeft <= 2;
        nextBtn.disabled = carouselEl.scrollLeft >= carouselEl.scrollWidth - carouselEl.offsetWidth - 2;
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          carouselEl.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          carouselEl.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });
      }

      carouselEl.addEventListener('scroll', updateButtons, { passive: true });
      updateButtons();

      /* Touch swipe support */
      var touchStartX = 0;

      carouselEl.addEventListener('touchstart', function (e) {
        var te = /** @type {TouchEvent} */ (e);
        var firstTouch = te.touches.item(0);
        if (firstTouch) touchStartX = firstTouch.clientX;
      }, { passive: true });

      carouselEl.addEventListener('touchend', function (e) {
        var te = /** @type {TouchEvent} */ (e);
        var lastTouch = te.changedTouches.item(0);
        if (!lastTouch) return;
        var diff = touchStartX - lastTouch.clientX;
        if (Math.abs(diff) > 40) {
          carouselEl.scrollBy({ left: diff > 0 ? getScrollAmount() : -getScrollAmount(), behavior: 'smooth' });
        }
      }, { passive: true });
    });
  }
  /* End: New Arrivals Carousel */

  /* ============================================================================
     Start: Animated Announcement Bar — Pause on Focus
     ============================================================================ */
  function initAnimatedAnnouncementBar() {
    /** @type {NodeListOf<HTMLElement>} */
    var bars = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.animated-announcement-bar'));

    bars.forEach(function (bar) {
      /* CSS handles pause via animation-play-state on :hover.
         We also handle focus for keyboard accessibility. */
      var tracks = /** @type {NodeListOf<HTMLElement>} */ (bar.querySelectorAll('.animated-announcement-bar__track'));

      bar.addEventListener('focusin', function () {
        tracks.forEach(function (t) { t.style.animationPlayState = 'paused'; });
      });

      bar.addEventListener('focusout', function () {
        tracks.forEach(function (t) { t.style.animationPlayState = ''; });
      });
    });
  }
  /* End: Animated Announcement Bar */

  /* ============================================================================
     Start: Hero Banner Responsive — Accessibility (no-op, CSS handles layout)
     ============================================================================ */
  function initHeroBannerResponsive() {
    /* Hero banner is fully CSS-driven.
       This function is a placeholder for future JS enhancements. */
  }
  /* End: Hero Banner Responsive */

  /* ============================================================================
     Start: Main Init
     ============================================================================ */
  function onSectionLoad() {
    initScrollReveal();
    initNewArrivalsCarousels();
    initAnimatedAnnouncementBar();
    initHeroBannerResponsive();
  }

  /* Shopify Theme Editor — re-init on section reload */
  document.addEventListener('shopify:section:load', onSectionLoad);

  /* DOM Ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onSectionLoad);
  } else {
    onSectionLoad();
  }
  /* End: Main Init */

})();
/* End Custom Sections JS */
/* You can paste future updates here without breaking anything */
