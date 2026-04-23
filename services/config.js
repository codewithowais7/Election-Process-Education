window.APP_CONFIG = {
  GEMINI_API_KEY: document.querySelector('meta[name="gemini-key"]')?.content || '',
  MAPS_API_KEY: document.querySelector('meta[name="maps-key"]')?.content || ''
};
