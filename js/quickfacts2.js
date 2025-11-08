/**
 * quickfacts2.js
 * Accessible cloud -> oval reveal transitions for Saugus Iron Works Quick Facts
 * 
 * Features:
 * - Toggles aria-expanded on button
 * - Toggles aria-hidden on oval region
 * - Toggles .revealed class to animate the transition and show checkmark
 * - Updates live region for screen readers
 * - Keyboard accessible (Enter and Space keys)
 * - Helper functions for teachers/debugging
 */

(function () {
  'use strict';

  const buttons = Array.from(document.querySelectorAll('.cloud-btn'));
  const live = document.getElementById('liveAnnounce');

  /**
   * Set revealed state for a cloud button
   * @param {HTMLElement} btn - The cloud button element
   * @param {HTMLElement} ovalEl - The oval element to reveal
   * @param {boolean} reveal - True to reveal, false to hide
   */
  function setRevealed(btn, ovalEl, reveal) {
    btn.classList.toggle('revealed', reveal);
    btn.setAttribute('aria-expanded', reveal ? 'true' : 'false');
    ovalEl.setAttribute('aria-hidden', reveal ? 'false' : 'true');

    // Announce for assistive technology
    if (reveal) {
      const q = ovalEl.querySelector('.oval-question')?.textContent?.trim() || 'Question';
      const a = ovalEl.querySelector('.oval-answer')?.textContent?.trim() || '';
      // Make concise announcement
      live.textContent = `${q} — ${a}`;
    } else {
      live.textContent = '';
    }
  }

  /**
   * Toggle handler for cloud button clicks
   * @param {Event} evt - The click event
   */
  function toggleHandler(evt) {
    const btn = evt.currentTarget;
    const ovalId = btn.getAttribute('aria-controls');
    const ovalEl = document.getElementById(ovalId);
    const currently = btn.getAttribute('aria-expanded') === 'true';
    setRevealed(btn, ovalEl, !currently);
  }

  // Initialize all cloud buttons
  buttons.forEach(btn => {
    // Click handler
    btn.addEventListener('click', toggleHandler);

    // Keyboard: Enter and Space are native on <button>
    // Prevent default scroll for Space key
    btn.addEventListener('keydown', function (e) {
      if (e.code === 'Space') e.preventDefault();
    });

    // Ensure initial ARIA state
    const oval = document.getElementById(btn.getAttribute('aria-controls'));
    if (oval) {
      oval.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Expose helper functions for teachers/debugging
  window.quickFacts = {
    /**
     * Reveal all clouds at once (useful for answer key or review)
     */
    revealAll: function () {
      buttons.forEach(btn => {
        const oval = document.getElementById(btn.getAttribute('aria-controls'));
        setRevealed(btn, oval, true);
      });
    },
    /**
     * Reset all clouds to hidden state
     */
    resetAll: function () {
      buttons.forEach(btn => {
        const oval = document.getElementById(btn.getAttribute('aria-controls'));
        setRevealed(btn, oval, false);
      });
    }
  };

})();