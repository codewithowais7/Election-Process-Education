/**
 * VoteWise — Google Cloud Translation Service
 * Multi-language support for 6 Indian languages
 */

const TRANSLATE_CONFIG = {
  // Replace with your actual Cloud Translation API key
  API_KEY: 'AIzaSyCVo7QV_K4sSlSTfImXdXDUUl-ipHn7-RY',
  ENDPOINT: 'https://translation.googleapis.com/language/translate/v2',
  // Supported languages
  LANGUAGES: {
    en: { name: 'English', tts: 'en-IN' },
    hi: { name: 'Hindi', tts: 'hi-IN' },
    ta: { name: 'Tamil', tts: 'ta-IN' },
    te: { name: 'Telugu', tts: 'te-IN' },
    bn: { name: 'Bengali', tts: 'bn-IN' },
    mr: { name: 'Marathi', tts: 'mr-IN' }
  }
};

// Cache for translated strings to avoid redundant API calls
const translationCache = new Map();

/**
 * Translates a single text string to the target language.
 * Returns the original text on failure (graceful degradation).
 * Caches results to minimize API calls.
 *
 * @param {string} text - Source text in English
 * @param {string} targetLang - Target language code (e.g., 'hi', 'ta')
 * @returns {Promise<string>} - Translated text or original on error
 */
async function translateText(text, targetLang) {
  if (!text || targetLang === 'en') return text;

  const cacheKey = `${targetLang}:${text.substring(0, 60)}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  if (TRANSLATE_CONFIG.API_KEY === 'YOUR_TRANSLATE_API_KEY') {
    console.warn('VoteWise: Translation API key not configured. Returning original text.');
    return text;
  }

  try {
    const response = await fetch(
      `${TRANSLATE_CONFIG.ENDPOINT}?key=${TRANSLATE_CONFIG.API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          source: 'en',
          format: 'text'
        }),
        signal: AbortSignal.timeout(8000)
      }
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    const translated = data.data?.translations?.[0]?.translatedText || text;

    translationCache.set(cacheKey, translated);
    return translated;

  } catch (err) {
    console.warn('Translation failed, using original text:', err.message);
    return text; // Graceful fallback
  }
}

/**
 * Translates an array of texts in a single batched API call.
 * Much more efficient than calling translateText() in a loop.
 *
 * @param {string[]} texts - Array of source texts
 * @param {string} targetLang - Target language code
 * @returns {Promise<string[]>} - Array of translated texts
 */
async function translateBatch(texts, targetLang) {
  if (!texts.length || targetLang === 'en') return texts;

  if (TRANSLATE_CONFIG.API_KEY === 'YOUR_TRANSLATE_API_KEY') {
    return texts;
  }

  try {
    const response = await fetch(
      `${TRANSLATE_CONFIG.ENDPOINT}?key=${TRANSLATE_CONFIG.API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: texts,
          target: targetLang,
          source: 'en',
          format: 'text'
        }),
        signal: AbortSignal.timeout(12000)
      }
    );

    if (!response.ok) throw new Error(`Batch translation error: ${response.status}`);

    const data = await response.json();
    const translations = data.data?.translations || [];
    return translations.map((t, i) => t.translatedText || texts[i]);

  } catch (err) {
    console.warn('Batch translation failed:', err.message);
    return texts;
  }
}

/**
 * Translates key visible text elements on the page.
 * Uses data-original attributes to store original text for reverting.
 *
 * @param {string} lang - Target language code
 */
async function translatePageContent(lang) {
  if (lang === 'en') {
    // Revert all translated elements to original
    document.querySelectorAll('[data-original]').forEach(el => {
      el.textContent = el.getAttribute('data-original');
      el.removeAttribute('data-original');
    });
    return;
  }

  // Elements to translate: selector → text type
  const translatableSelectors = [
    '.hero-sub',
    '.hero-eyebrow',
    '.section-header h2',
    '.section-header p',
    '.feature-card h3',
    '.feature-card p',
    '.feature-link',
    '.info-banner p',
    '.quiz-header-section p',
    '.timeline-header-section p',
    '.map-sub'
  ];

  // Gather all elements and their text
  const elements = [];
  const texts = [];

  translatableSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      // Only translate text nodes, skip if has child elements (except em, strong, a)
      const original = el.getAttribute('data-original') || el.textContent.trim();
      if (original) {
        elements.push(el);
        texts.push(original);
        // Store original if not already stored
        if (!el.getAttribute('data-original')) {
          el.setAttribute('data-original', original);
        }
      }
    });
  });

  if (!texts.length) return;

  // Translate in batches of 10
  const chunkSize = 10;
  for (let i = 0; i < texts.length; i += chunkSize) {
    const chunkTexts = texts.slice(i, i + chunkSize);
    const chunkEls = elements.slice(i, i + chunkSize);

    const translated = await translateBatch(chunkTexts, lang);
    chunkEls.forEach((el, j) => {
      if (translated[j] && translated[j] !== chunkTexts[j]) {
        el.textContent = translated[j];
      }
    });
  }
}

/**
 * Returns the BCP-47 TTS locale for a given language code
 * @param {string} lang
 * @returns {string}
 */
function getTTSLocale(lang) {
  return TRANSLATE_CONFIG.LANGUAGES[lang]?.tts || 'en-IN';
}

// Expose for other modules
window.TranslateService = {
  translateText,
  translateBatch,
  translatePageContent,
  getTTSLocale,
  languages: TRANSLATE_CONFIG.LANGUAGES
};
