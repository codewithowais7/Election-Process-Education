/**
 * VoteWise Analytics Service
 * Google Analytics 4 + Custom Events
 */

const Analytics = {
  // Track user interactions
  trackEvent(category, action, label = '') {
    console.log(`[Analytics] ${category} | ${action} | ${label}`);
    if (window.gtag) {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: 1
      });
    }
  },

  trackChatQuestion(question) {
    this.trackEvent('AI_Chatbot', 'question_asked', question.substring(0, 50));
  },

  trackQuizComplete(score, difficulty) {
    this.trackEvent('Quiz', 'quiz_completed', `${difficulty}_${score}`);
  },

  trackLanguageChange(lang) {
    this.trackEvent('Accessibility', 'language_changed', lang);
  },

  trackPollingSearch(location) {
    this.trackEvent('Maps', 'polling_booth_search', location);
  }
};

window.Analytics = Analytics;
