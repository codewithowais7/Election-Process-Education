/**
 * VoteWise — Main Application Controller
 * Hack2Skill Hackathon 2026 — Election Process Education
 *
 * Orchestrates navigation, tab switching, language selection,
 * and initialization of all sub-modules.
 */

'use strict';

// ===== APP STATE =====
const AppState = {
  currentTab: 'home',
  currentLang: 'en',
  timelineInitialized: false,
  mapsTabVisited: false
};

// ===== NAVIGATION =====

/**
 * Switches the active tab and updates aria/nav state.
 * @param {string} tabName - One of: home, chat, quiz, map, timeline
 */
function switchTab(tabName) {
  if (AppState.currentTab === tabName) return;

  // Hide all tab sections
  document.querySelectorAll('.tab-section').forEach(section => {
    section.classList.remove('active');
    section.hidden = true;
  });

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.removeAttribute('aria-current');
  });

  // Show target section
  const targetSection = document.getElementById(`tab-${tabName}`);
  const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);

  if (targetSection) {
    targetSection.classList.add('active');
    targetSection.hidden = false;

    // Focus management for accessibility
    setTimeout(() => {
      const heading = targetSection.querySelector('h1, h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }, 50);
  }

  if (targetBtn) {
    targetBtn.classList.add('active');
    targetBtn.setAttribute('aria-current', 'page');
  }

  AppState.currentTab = tabName;

  // Tab-specific initialization
  if (tabName === 'map' && !AppState.mapsTabVisited) {
    AppState.mapsTabVisited = true;
    window.MapsService?.loadGoogleMaps();
  }

  if (tabName === 'timeline' && !AppState.timelineInitialized) {
    AppState.timelineInitialized = true;
    window.initTimeline?.();
  }

  // Close mobile menu if open
  closeMobileMenu();

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Expose for onclick attributes in HTML
window.switchTab = switchTab;

// ===== NAVIGATION EVENT LISTENERS =====
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  const nav = document.querySelector('header nav');
  const toggle = document.getElementById('mobile-menu-toggle');
  if (!nav || !toggle) return;

  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
}

function closeMobileMenu() {
  const nav = document.querySelector('header nav');
  const toggle = document.getElementById('mobile-menu-toggle');
  if (!nav || !toggle) return;
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}

document.getElementById('mobile-menu-toggle')?.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking outside header
document.addEventListener('click', (e) => {
  if (!e.target.closest('header')) closeMobileMenu();
});

// ===== LANGUAGE SELECTION =====
document.getElementById('language')?.addEventListener('change', async (e) => {
  const newLang = e.target.value;
  AppState.currentLang = newLang;
  window.currentLang = newLang;

  // Update voice recognition language
  if (window.recognition) {
    window.recognition.lang = window.TranslateService?.getTTSLocale(newLang) || 'en-IN';
  }

  // Cancel ongoing TTS
  if (window.speechSynthesis) speechSynthesis.cancel();

  // Translate page content
  if (window.TranslateService && newLang !== 'en') {
    try {
      await window.TranslateService.translatePageContent(newLang);
    } catch (err) {
      console.warn('Page translation error:', err);
    }
  } else if (newLang === 'en') {
    window.TranslateService?.translatePageContent('en');
  }
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  // Alt+1-5 for tab switching
  if (e.altKey && !e.ctrlKey && !e.metaKey) {
    const tabMap = {
      '1': 'home',
      '2': 'chat',
      '3': 'quiz',
      '4': 'map',
      '5': 'timeline'
    };
    if (tabMap[e.key]) {
      e.preventDefault();
      switchTab(tabMap[e.key]);
    }
  }

  // Escape to close any open overlays/menus
  if (e.key === 'Escape') {
    closeMobileMenu();
    if (window.speechSynthesis?.speaking) {
      speechSynthesis.cancel();
    }
  }
});

// ===== PERFORMANCE: PAGE VISIBILITY =====
// Pause TTS when tab is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden && window.speechSynthesis?.speaking) {
    speechSynthesis.pause();
  } else if (!document.hidden && window.speechSynthesis?.paused) {
    speechSynthesis.resume();
  }
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Ensure home tab is visible on load
  const homeSection = document.getElementById('tab-home');
  if (homeSection) {
    homeSection.hidden = false;
    homeSection.classList.add('active');
  }

  // Set initial nav state
  const homeBtn = document.querySelector('[data-tab="home"]');
  if (homeBtn) {
    homeBtn.classList.add('active');
    homeBtn.setAttribute('aria-current', 'page');
  }

  console.info(
    '%c🗳️ VoteWise Election Education Assistant\n%cHack2Skill 2026 · Google Gemini + Maps + Translate',
    'font-size:16px;font-weight:bold;color:#1a3a6e',
    'font-size:12px;color:#5a6a84'
  );
  console.info('To configure API keys, edit: services/gemini.js, services/maps.js, services/translate.js');
});
