/**
 * VoteWise — Google Gemini API Service
 * Handles all AI chat completions with election-specific context
 */

const GEMINI_CONFIG = {
  // Replace with your actual Gemini API key
  API_KEY: 'AIzaSyDwpMJu691InEkADA2ZnKD10e4NtYoQUh0',
  MODEL: 'gemini-2.0-flash',
  ENDPOINT_BASE: 'https://generativelanguage.googleapis.com/v1beta/models',
  MAX_TOKENS: 600,
  TEMPERATURE: 0.7,
  TOP_P: 0.9
};

/**
 * Returns the system prompt adjusted for the current language
 * @param {string} lang - BCP-47 language code
 * @returns {string}
 */
function getElectionSystemPrompt(lang = 'en') {
  const respondIn = lang === 'hi' ? 'Hindi (Devanagari script)'
    : lang === 'ta' ? 'Tamil'
    : lang === 'te' ? 'Telugu'
    : lang === 'bn' ? 'Bengali'
    : lang === 'mr' ? 'Marathi'
    : 'English';

  return `You are VoteWise, an expert AI assistant specializing in educating Indian citizens about the democratic election process. You are friendly, accurate, and encourage civic participation.

Your comprehensive knowledge covers:
• VOTER REGISTRATION: Form 6 (new registration), Form 6A (overseas voter), Form 7 (deletion), Form 8 (correction) — all available at voterportal.eci.gov.in
• VOTING TECHNOLOGY: Electronic Voting Machines (EVM), VVPAT (Voter Verifiable Paper Audit Trail), how they work and security features
• MODEL CODE OF CONDUCT: What it prohibits, when it applies, how it's enforced
• ELECTION COMMISSION OF INDIA: Constitutional basis (Article 324), powers, Chief Election Commissioner, appointment process
• VOTING ELIGIBILITY: 18+ Indian citizen, not mentally unsound, not convicted with 2+ years (RPA 1951 Section 8)
• TYPES OF ELECTIONS: Lok Sabha (FPTP), Rajya Sabha (STV), State Assembly, Rajya Sabha, President, VP, Local Body
• RESERVATION SYSTEM: SC/ST reserved seats, delimitation, Delimitation Commission
• ELECTION PROCESS: Nomination, security deposit (₹25,000 Lok Sabha), scrutiny, withdrawal, campaign rules, expenses limit (₹95 lakh Lok Sabha)
• NOTA: PUCL vs Union of India (2013), how it's applied, its limitations
• POSTAL BALLOTS & OVERSEAS VOTING: Service voters, absentee voters, NRI voting
• IMPORTANT LAWS: Representation of People Act 1951, RPA 1950, Model Code of Conduct, anti-defection law (10th Schedule), 61st Amendment (voting age)
• ELECTION TIMELINE: Announcement → Voter list → Nominations → Scrutiny → Campaign → Silent period (48 hrs) → Polling (7AM-6PM) → Counting → Results
• INDELIBLE INK: Silver nitrate compound, prevents double voting
• OFFICIAL RESOURCES: eci.gov.in, voterportal.eci.gov.in, nvsp.in, 1950 helpline

GUIDELINES:
- Always give accurate, strictly nonpartisan and unbiased information
- Actively encourage civic participation and voter registration
- Cite official sources when relevant: eci.gov.in, voterportal.eci.gov.in, nvsp.in
- Keep responses concise but complete — 2-4 paragraphs maximum
- Use simple language accessible to first-time voters
- If asked about specific candidates, parties, or current political issues, politely decline and redirect to process education
- ALWAYS respond in ${respondIn}`;
}

/**
 * Calls the Gemini API with the user's message and election context
 * @param {string} userMessage - The user's question
 * @param {string} lang - Current language code
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} - AI response text
 */
async function callGemini(userMessage, lang = 'en', conversationHistory = []) {
  const endpoint = `${GEMINI_CONFIG.ENDPOINT_BASE}/${GEMINI_CONFIG.MODEL}:generateContent?key=${GEMINI_CONFIG.API_KEY}`;

  // Build contents array with conversation history
  const contents = [];

  // Add conversation history (up to last 6 messages for context window)
  const recentHistory = conversationHistory.slice(-6);
  recentHistory.forEach(msg => {
    contents.push({
      role: msg.role,
      parts: [{ text: msg.text }]
    });
  });

  // Add current user message with system prompt
  contents.push({
    role: 'user',
    parts: [
      { text: getElectionSystemPrompt(lang) },
      { text: `\n\nUser question: ${userMessage}` }
    ]
  });

  const requestBody = {
    contents,
    generationConfig: {
      temperature: GEMINI_CONFIG.TEMPERATURE,
      maxOutputTokens: GEMINI_CONFIG.MAX_TOKENS,
      topP: GEMINI_CONFIG.TOP_P,
      candidateCount: 1
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      }
    ]
  };

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });
  } catch (networkError) {
    if (networkError.name === 'TimeoutError' || networkError.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection and try again.');
    }
    throw new Error('Network error. Please check your internet connection.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const status = response.status;

    if (status === 400) {
      throw new Error('Invalid request. The question may be too long or contain unsupported content.');
    } else if (status === 401 || status === 403) {
      throw new Error('API key is invalid or missing. Please configure a valid Gemini API key in services/gemini.js.');
    } else if (status === 429) {
      throw new Error('Gemini is busy. Please wait 30 seconds and try again.');
    } else if (status >= 500) {
      throw new Error('Google AI service is temporarily unavailable. Please try again later.');
    }
    throw new Error(`API error (${status}): ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();

  // Extract text from response
  const candidate = data.candidates?.[0];
  if (!candidate) {
    throw new Error('No response generated. Please try rephrasing your question.');
  }

  // Check for content filtering
  if (candidate.finishReason === 'SAFETY') {
    return 'I\'m unable to respond to that question due to content safety guidelines. Please ask about election processes, voter registration, or your voting rights.';
  }

  const text = candidate.content?.parts?.[0]?.text;
  if (!text || text.trim() === '') {
    throw new Error('Empty response received. Please try again.');
  }

  return text.trim();
}

// Export for use in chatbot.js
window.GeminiService = {
  callGemini,
  getSystemPrompt: getElectionSystemPrompt,
  config: GEMINI_CONFIG
};
