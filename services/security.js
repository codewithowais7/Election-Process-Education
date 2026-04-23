const Security = {
  sanitizeInput(input) {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  },
  validateInput(input) {
    if (!input || typeof input !== 'string') return false;
    if (input.trim().length === 0) return false;
    if (input.length > 500) return false;
    return true;
  },
  rateLimiter: {
    requests: [],
    maxRequests: 10,
    windowMs: 60000,
    isAllowed() {
      const now = Date.now();
      this.requests = this.requests.filter(t => now - t < this.windowMs);
      if (this.requests.length >= this.maxRequests) return false;
      this.requests.push(now);
      return true;
    }
  }
};
window.Security = Security;
