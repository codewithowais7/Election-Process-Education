/**
 * VoteWise — Chatbot Component
 * Handles chat UI, voice input, TTS, and message rendering
 */

// Conversation history for multi-turn context
let conversationHistory = [];
let isRequestPending = false;

// Track TTS state
window.ttsEnabled = false;
window.currentLang = 'en';

/**
 * Sends the user's message to Gemini and renders response
 */
async function sendMessage() {
  if (isRequestPending) return;

  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  // Add to UI
  addMessage(text, 'user');
  input.value = '';
  updateCharCount();

  // Add typing indicator
  const typingEl = addTypingIndicator();
  setSendDisabled(true);
  isRequestPending = true;

  // Add to conversation history (user role)
  conversationHistory.push({ role: 'user', text });

  try {
    const responseText = await window.GeminiService.callGemini(
      text,
      window.currentLang,
      conversationHistory.slice(0, -1) // history without current message
    );

    typingEl.remove();

    // Add bot message
    const msgEl = addMessage(responseText, 'bot');

    // Add to conversation history (model role)
    conversationHistory.push({ role: 'model', text: responseText });

    // Keep history manageable
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-16);
    }

    // TTS if enabled
    if (window.ttsEnabled) {
      speak(responseText);
    }

    // Smooth scroll to new message
    msgEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (error) {
    typingEl.remove();
    const errMsg = error.message || 'An error occurred. Please try again.';
    addMessage(`⚠️ ${errMsg}`, 'bot', true);
    console.error('Chat error:', error);

    // Remove the failed user message from history
    conversationHistory.pop();
  } finally {
    setSendDisabled(false);
    isRequestPending = false;
    input.focus();
  }
}

/**
 * Handles quick question button clicks from sidebar
 * @param {HTMLElement} btn
 */
function askQuick(btn) {
  const text = btn.textContent.trim();
  const input = document.getElementById('chat-input');
  input.value = text;
  updateCharCount();

  // Switch to chat tab if not already there
  if (document.getElementById('tab-chat').hidden) {
    switchTab('chat');
  }

  // Small delay so the user can see the text populated
  setTimeout(sendMessage, 150);
}

/**
 * Adds a message bubble to the chat UI
 * @param {string} text - Message content
 * @param {'user'|'bot'} type - Message sender
 * @param {boolean} isError - Whether this is an error message
 * @returns {HTMLElement} - The created message element
 */
function addMessage(text, type, isError = false) {
  const container = document.getElementById('chat-messages');
  if (!container) return null;

  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}-message`;
  msgDiv.setAttribute('role', 'article');

  const labelText = type === 'bot'
    ? `VoteWise AI: ${text.substring(0, 60)}...`
    : `You: ${text.substring(0, 60)}`;
  msgDiv.setAttribute('aria-label', labelText);

  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  msgDiv.innerHTML = `
    <div class="message-avatar" aria-hidden="true">${type === 'bot' ? '🤖' : '👤'}</div>
    <div class="message-bubble ${isError ? 'error-bubble' : ''}">${formatMessage(text)}<div class="message-time" aria-hidden="true">${now}</div></div>
  `;

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  return msgDiv;
}

/**
 * Formats raw text to HTML with markdown-like rendering
 * Sanitized to prevent XSS — only safe HTML tags used
 * @param {string} text
 * @returns {string} - HTML string
 */
function formatMessage(text) {
  // Escape HTML first
  let safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Apply markdown-like formatting
  safe = safe
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')           // **bold**
    .replace(/\*(.*?)\*/g, '<em>$1</em>')                        // *italic*
    .replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.06);padding:1px 5px;border-radius:3px;font-size:0.85em">$1</code>') // `code`
    .replace(/•\s(.+)/g, '<li>$1</li>')                          // • bullet
    .replace(/^\d+\.\s(.+)/gm, '<li>$1</li>')                    // 1. numbered
    .replace(/\n\n+/g, '</p><p>')                                // double newline → paragraph
    .replace(/\n/g, '<br>');                                     // single newline → br

  // Wrap loose list items
  safe = safe.replace(/<li>(.*?)<\/li>/gs, (match) => `<ul>${match}</ul>`);
  // Fix nested ul
  safe = safe.replace(/<\/ul><ul>/g, '');

  return `<p>${safe}</p>`;
}

/**
 * Shows animated typing indicator
 * @returns {HTMLElement}
 */
function addTypingIndicator() {
  const container = document.getElementById('chat-messages');
  const el = document.createElement('div');
  el.className = 'message bot-message typing-indicator';
  el.setAttribute('aria-label', 'VoteWise AI is composing a response');
  el.innerHTML = `
    <div class="message-avatar" aria-hidden="true">🤖</div>
    <div class="message-bubble">
      <div class="typing-dots" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
  return el;
}

/**
 * Clears all chat messages (except the welcome message)
 */
function clearChat() {
  const container = document.getElementById('chat-messages');
  const messages = container.querySelectorAll('.message');

  // Keep the first (welcome) message
  if (messages.length <= 1) return;

  // Fade out all messages except the first
  Array.from(messages).slice(1).forEach(m => {
    m.style.transition = 'opacity 0.25s ease';
    m.style.opacity = '0';
    setTimeout(() => m.remove(), 250);
  });

  conversationHistory = [];
  speechSynthesis?.cancel();
}

/**
 * Enables/disables the send button
 * @param {boolean} disabled
 */
function setSendDisabled(disabled) {
  const btn = document.getElementById('send-btn');
  if (!btn) return;
  btn.disabled = disabled;
  if (disabled) {
    btn.innerHTML = '<span class="spinner" aria-label="Sending..."></span>';
  } else {
    btn.innerHTML = '<span class="send-icon" aria-hidden="true">↑</span>';
  }
}

/**
 * Updates character count display
 */
function updateCharCount() {
  const input = document.getElementById('chat-input');
  const counter = document.getElementById('char-count');
  if (!input || !counter) return;

  const len = input.value.length;
  counter.textContent = `${len}/500`;
  counter.style.color = len > 450 ? 'var(--accent)' : 'var(--text-light)';
}

// ===== TEXT-TO-SPEECH =====

/**
 * Speaks text using the Web Speech API
 * @param {string} text - Text to speak
 */
function speak(text) {
  if (!window.speechSynthesis) return;

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  // Strip HTML tags
  const clean = text.replace(/<[^>]*>/g, '').trim();
  if (!clean) return;

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = window.TranslateService?.getTTSLocale(window.currentLang) || 'en-IN';
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Try to select an Indian English voice
  const voices = speechSynthesis.getVoices();
  const preferredVoice = voices.find(v =>
    v.lang.startsWith(utterance.lang) ||
    v.name.toLowerCase().includes('india') ||
    v.name.toLowerCase().includes('raveena')
  );
  if (preferredVoice) utterance.voice = preferredVoice;

  speechSynthesis.speak(utterance);
}

// Expose speak globally for quiz component
window.speak = speak;

// ===== VOICE INPUT =====

let isListening = false;
let recognition = null;

/**
 * Initializes Web Speech Recognition for voice input
 */
function initVoiceInput() {
  const btn = document.getElementById('voice-input-btn');
  if (!btn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    btn.style.display = 'none';
    console.info('VoteWise: Speech Recognition not supported in this browser.');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'en-IN';
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  btn.addEventListener('click', () => {
    if (isListening) {
      recognition.stop();
      return;
    }

    try {
      recognition.lang = window.TranslateService?.getTTSLocale(window.currentLang) || 'en-IN';
      recognition.start();
    } catch (e) {
      console.warn('Voice input error:', e);
    }
  });

  recognition.onstart = () => {
    isListening = true;
    btn.textContent = '🔴';
    btn.setAttribute('aria-label', 'Stop voice input (recording)');
    btn.title = 'Recording... click to stop';
    btn.style.background = 'rgba(220, 53, 69, 0.1)';
    btn.style.borderColor = '#dc3545';
  };

  recognition.onresult = (e) => {
    const transcript = Array.from(e.results)
      .map(r => r[0].transcript)
      .join('');

    const input = document.getElementById('chat-input');
    if (input) {
      input.value = transcript;
      updateCharCount();
    }
  };

  recognition.onerror = (e) => {
    console.warn('Voice recognition error:', e.error);
    if (e.error === 'not-allowed') {
      alert('Microphone access denied. Please allow microphone access in your browser settings.');
    }
    _resetVoiceBtn(btn);
  };

  recognition.onend = () => {
    _resetVoiceBtn(btn);
    // Auto-send if we captured something
    const input = document.getElementById('chat-input');
    if (input?.value.trim() && !isRequestPending) {
      // Small delay to let the user see what was captured
      setTimeout(sendMessage, 600);
    }
  };
}

function _resetVoiceBtn(btn) {
  isListening = false;
  btn.textContent = '🎤';
  btn.setAttribute('aria-label', 'Use voice input');
  btn.title = 'Voice Input';
  btn.style.background = '';
  btn.style.borderColor = '';
}

// ===== EVENT LISTENERS =====

document.addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chat-input');
  const ttsCheckbox = document.getElementById('tts-enabled');

  if (chatInput) {
    // Enter to send
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Character counter
    chatInput.addEventListener('input', updateCharCount);
  }

  if (ttsCheckbox) {
    ttsCheckbox.addEventListener('change', (e) => {
      window.ttsEnabled = e.target.checked;
      if (!e.target.checked) {
        speechSynthesis?.cancel();
      }
    });
  }

  // Load voices when available
  if (window.speechSynthesis) {
    speechSynthesis.getVoices(); // trigger loading
    speechSynthesis.addEventListener('voiceschanged', () => {
      speechSynthesis.getVoices(); // ensure loaded
    });
  }

  initVoiceInput();
});

// Expose functions globally
window.sendMessage = sendMessage;
window.askQuick = askQuick;
window.clearChat = clearChat;
window.formatMessage = formatMessage;
