/**
 * VoteWise — Quiz Component
 * Hack2Skill 2026
 */

const QUIZ_DATA = {
  easy: [
    {
      q: "What is the minimum age to vote in Indian elections?",
      opts: ["16 years", "18 years", "21 years", "25 years"],
      answer: 1,
      explanation: "Every Indian citizen aged 18 years and above is eligible to vote as per Article 326 of the Constitution. Before 1988, the voting age was 21 years."
    },
    {
      q: "What does EVM stand for?",
      opts: ["Electronic Voting Machine", "Electoral Vote Management", "Electronic Vote Monitor", "Election Vote Medium"],
      answer: 0,
      explanation: "EVM stands for Electronic Voting Machine. India replaced ballot papers with EVMs in phased manner from 2004 onwards to make elections faster, cheaper, and tamper-resistant."
    },
    {
      q: "Which body conducts elections in India?",
      opts: ["Supreme Court", "Parliament", "Election Commission of India", "President's Office"],
      answer: 2,
      explanation: "The Election Commission of India (ECI) is an autonomous constitutional authority under Article 324, responsible for administering all elections to Parliament and State Legislatures."
    },
    {
      q: "What is NOTA?",
      opts: ["None Of The Above", "National Order of Trusted Authorities", "No Official Transfer Allowed", "Not Open To All"],
      answer: 0,
      explanation: "NOTA (None Of The Above) allows voters to reject all candidates on the ballot. It was introduced in 2013 by the Supreme Court in the PUCL vs Union of India judgment."
    },
    {
      q: "What document is primarily used for voter identification?",
      opts: ["PAN Card", "Aadhaar Card", "Voter ID Card (EPIC)", "Driving License"],
      answer: 2,
      explanation: "The Voter ID Card, officially called EPIC (Electors Photo Identity Card), is the primary document for voting. However, 12 other photo ID documents are also accepted."
    },
    {
      q: "When does the Model Code of Conduct come into effect?",
      opts: ["7 days before polling", "As soon as election schedule is announced", "30 days before polling", "60 days before polling"],
      answer: 1,
      explanation: "The Model Code of Conduct comes into effect immediately when the Election Commission announces the election schedule — not a fixed number of days before voting."
    },
    {
      q: "Where can you register to vote online in India?",
      opts: ["mygov.in", "voterportal.eci.gov.in", "india.gov.in", "uidai.gov.in"],
      answer: 1,
      explanation: "You can register to vote at voterportal.eci.gov.in — the official Election Commission of India voter portal. You can submit Form 6 for new registration online."
    },
    {
      q: "What is VVPAT?",
      opts: ["Voter Verifiable Paper Audit Trail", "Verified Voting Paper and Ticket", "Vote Verification Process And Tracking", "Valid Voter Paper Audit Tool"],
      answer: 0,
      explanation: "VVPAT (Voter Verifiable Paper Audit Trail) is a machine attached to EVM that prints a paper slip showing your vote for 7 seconds, allowing you to verify your vote before it drops into a sealed compartment."
    },
    {
      q: "Lok Sabha elections are held every:",
      opts: ["3 years", "4 years", "5 years", "6 years"],
      answer: 2,
      explanation: "Lok Sabha elections are held every 5 years (Article 83). The Lok Sabha can also be dissolved early by the President on the advice of the Prime Minister and Cabinet."
    },
    {
      q: "Which article of the Constitution grants the right to vote?",
      opts: ["Article 19", "Article 21", "Article 326", "Article 368"],
      answer: 2,
      explanation: "Article 326 of the Indian Constitution grants the right to vote (adult franchise) to all Indian citizens who are 18 years or older and not disqualified under any law."
    }
  ],
  medium: [
    {
      q: "What is the security deposit for a Lok Sabha candidate from a general constituency?",
      opts: ["₹5,000", "₹10,000", "₹25,000", "₹1,00,000"],
      answer: 2,
      explanation: "A general candidate for Lok Sabha must deposit ₹25,000 as security deposit (₹12,500 for SC/ST candidates). It is forfeited if they get less than 1/6th of valid votes polled in the constituency."
    },
    {
      q: "What percentage of votes must a candidate get to avoid security deposit forfeiture?",
      opts: ["1/6th of valid votes", "1/4th of valid votes", "10% of total votes", "25% of valid votes"],
      answer: 0,
      explanation: "A candidate must secure at least 1/6th (about 16.67%) of total valid votes in their constituency to get their security deposit back from the Election Commission."
    },
    {
      q: "Who appoints the Chief Election Commissioner as per the 2023 Amendment?",
      opts: ["Prime Minister alone", "A committee of PM, Leader of Opposition, and a Cabinet Minister", "Chief Justice of India", "President on PM's advice alone"],
      answer: 1,
      explanation: "The Chief Election Commissioners and Other Election Commissioners (Appointment, Conditions of Service and Term of Office) Act, 2023 established a selection committee comprising the PM, Leader of Opposition, and a Cabinet Minister nominated by PM."
    },
    {
      q: "What is a 'by-election' (upchunav)?",
      opts: ["An election held every alternate year", "An election for a single seat when it falls vacant mid-term", "A second round of voting if no majority", "An election held only in some states"],
      answer: 1,
      explanation: "A by-election (bye-election/upchunav) is held for a single constituency when the seat falls vacant due to death, resignation, disqualification, or court order voiding the election of the sitting member."
    },
    {
      q: "Under which article can President's Rule be imposed in a state?",
      opts: ["Article 352", "Article 356", "Article 360", "Article 370"],
      answer: 1,
      explanation: "Article 356 (President's Rule) is invoked when a state government cannot function according to constitutional provisions. State Assembly elections are typically held within 6 months of imposing President's Rule."
    },
    {
      q: "What is the 'silent period' in elections?",
      opts: ["Time when ECI is constituted", "48 hours before polling when all campaigning is banned", "Period after results are declared", "Time taken to count votes"],
      answer: 1,
      explanation: "The 'silent period' is the 48-hour window before polling begins, during which all election campaigns, rallies, political advertisements, and canvassing are banned by law."
    },
    {
      q: "Rajya Sabha members serve a term of:",
      opts: ["4 years", "5 years", "6 years", "Life term"],
      answer: 2,
      explanation: "Rajya Sabha members serve a 6-year term (Article 83). Unlike Lok Sabha, the Rajya Sabha is a permanent house — one-third of its members retire every 2 years. It cannot be dissolved."
    },
    {
      q: "What does the anti-defection law (10th Schedule) prohibit?",
      opts: ["Party switching by elected members", "Election fraud and booth capturing", "Exceeding campaign spending limits", "Voter list errors"],
      answer: 0,
      explanation: "The 10th Schedule (added by 52nd Amendment, 1985) disqualifies elected members who voluntarily give up party membership or vote/abstain against the party whip without permission of the party legislature leader."
    },
    {
      q: "What is delimitation in the context of elections?",
      opts: ["Setting campaign spending limits", "Redrawing constituency boundaries based on census", "Rules for vote counting process", "Voter registration procedures"],
      answer: 1,
      explanation: "Delimitation is the process of redrawing the boundaries of electoral constituencies based on updated census data to ensure roughly equal representation. The Delimitation Commission is constituted by the President."
    },
    {
      q: "Which election uses the 'First Past The Post' (FPTP) system?",
      opts: ["Presidential election", "Rajya Sabha election", "Lok Sabha and State Assembly elections", "Vice Presidential election"],
      answer: 2,
      explanation: "Lok Sabha and State Assembly elections use FPTP — the candidate with the most votes wins, regardless of whether they have an absolute majority. Presidential elections use Single Transferable Vote (proportional representation)."
    }
  ],
  hard: [
    {
      q: "What '2/3 majority' is required for a valid party merger under the 10th Schedule (anti-defection)?",
      opts: ["2/3 of all party legislature members must merge", "2/3 of the particular legislature party joining merged entity", "2/3 of national party members must approve", "2/3 of Parliament must ratify the merger"],
      answer: 1,
      explanation: "Under the 10th Schedule (as amended in 2003), a 'merger' exempted from anti-defection is valid only if at least 2/3 of the legislature party's members join the merger. The 2003 amendment abolished the earlier 'split' provision (1/3 threshold)."
    },
    {
      q: "Which constitutional amendment reduced the voting age from 21 to 18?",
      opts: ["42nd Amendment (1976)", "52nd Amendment (1985)", "61st Amendment (1988)", "73rd Amendment (1992)"],
      answer: 2,
      explanation: "The 61st Constitutional Amendment Act (1988) reduced the voting age from 21 to 18 years under Article 326. This added approximately 3.5 crore new voters to the electoral rolls."
    },
    {
      q: "The Model Code of Conduct is primarily based on:",
      opts: ["Constitutional provisions under Article 324", "Representation of People Act, 1951", "Consensus among political parties evolved since 1960", "Supreme Court orders and directives"],
      answer: 2,
      explanation: "The Model Code of Conduct is not a statutory document — it is not part of any law. It evolved from consensus among political parties since 1960 and is enforced by the Election Commission through its moral authority and existing laws like IPC and RPA."
    },
    {
      q: "Under Section 8 of Representation of People Act 1951, what is the disqualification period for a conviction with 2+ years imprisonment?",
      opts: ["1 year from release", "5 years from release", "6 years from the date of release", "10 years or permanently"],
      answer: 2,
      explanation: "Under RPA 1951 Section 8, a person convicted with 2 or more years of imprisonment is disqualified for 6 years from the date of release (in addition to the period of imprisonment). In 2013, the SC struck down the protection given to sitting MPs/MLAs from this disqualification."
    },
    {
      q: "Why did the Supreme Court strike down the Electoral Bond Scheme in February 2024?",
      opts: ["It violated right to property of donors", "It violated voters' right to information and enabled unlimited anonymous political funding", "It was not passed by Parliament", "It violated freedom of speech"],
      answer: 1,
      explanation: "In Association for Democratic Reforms vs Union of India (Feb 2024), a 5-judge Constitution Bench unanimously struck down Electoral Bonds as unconstitutional because they violated voters' right to information under Article 19(1)(a) and potentially enabled unlimited, anonymous corporate-to-party funding."
    },
    {
      q: "What percentage of Lok Sabha seats are reserved for Scheduled Castes?",
      opts: ["About 10% (54 seats)", "About 15.47% (84 seats)", "About 20% (108 seats)", "About 25% (136 seats)"],
      answer: 1,
      explanation: "84 of 543 Lok Sabha seats (~15.47%) are reserved for Scheduled Castes, and 47 seats (~8.65%) are reserved for Scheduled Tribes. These reservations are based on population proportions as per the Constitution."
    },
    {
      q: "Which Supreme Court case led to the mandatory introduction of NOTA in Indian elections?",
      opts: ["Indira Gandhi vs Raj Narain (1975)", "People's Union for Civil Liberties vs Union of India (2013)", "ADR vs Union of India (2002)", "Kihoto Hollohan vs Zachillhu (1992)"],
      answer: 1,
      explanation: "In People's Union for Civil Liberties (PUCL) vs Union of India (2013), the Supreme Court directed the Election Commission to introduce the NOTA button on EVMs, ruling that the right to reject all candidates is part of freedom of expression under Article 19(1)(a)."
    },
    {
      q: "What chemical compound makes electoral indelible ink permanent on skin?",
      opts: ["Silver nitrate", "Silver iodide", "Potassium permanganate", "Indium sulfate"],
      answer: 0,
      explanation: "Electoral indelible ink contains silver nitrate, which reacts with the amino acids and proteins in skin, oxidising and turning dark (purple-black) upon exposure to light and air. It remains on skin for 2-4 weeks, making it impossible to vote twice."
    },
    {
      q: "Under what circumstances can the Rajya Sabha reject a Money Bill?",
      opts: ["It can reject with a 2/3 majority vote", "It cannot reject; can only suggest amendments; bill deemed passed after 14 days", "It cannot deal with Money Bills at all — they bypass Rajya Sabha", "Only if the President refers it back for reconsideration"],
      answer: 1,
      explanation: "Under Article 110 and 109, the Rajya Sabha cannot reject or amend a Money Bill — it can only make recommendations within 14 days. Whether the Lok Sabha accepts recommendations is at its discretion. If the Rajya Sabha doesn't return it in 14 days, it is deemed passed by both Houses."
    },
    {
      q: "What is the 'Doctrine of Merger' in the context of election results and appeals?",
      opts: ["When two parties merge, their vote counts combine", "When an appeal is filed, the lower court order merges into the higher court's order", "When two candidates withdraw, their votes merge to strongest candidate", "When constituencies are merged during delimitation"],
      answer: 1,
      explanation: "The Doctrine of Merger in Indian law holds that when an appeal is decided by a higher court, the lower court's order merges into the appellate order. In election law this is significant for RPA appeals — the High Court election petition order merges into the Supreme Court's order if challenged, replacing the former."
    }
  ]
};

// Quiz State
let quizState = {
  questions: [],
  currentQuestion: 0,
  score: 0,
  difficulty: 'easy',
  answered: false
};

/**
 * Starts a quiz session with the given difficulty
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 */
function startQuiz(difficulty) {
  quizState.difficulty = difficulty;
  quizState.questions = [...QUIZ_DATA[difficulty]].sort(() => Math.random() - 0.5).slice(0, 10);
  quizState.currentQuestion = 0;
  quizState.score = 0;
  quizState.answered = false;

  document.getElementById('quiz-start').hidden = true;
  document.getElementById('quiz-game').hidden = false;
  document.getElementById('quiz-results').hidden = true;
  document.getElementById('score').textContent = '0';
  document.getElementById('total-q').textContent = quizState.questions.length;

  const labelMap = { easy: '🟢 Beginner', medium: '🟡 Intermediate', hard: '🔴 Advanced' };
  document.getElementById('quiz-difficulty-label').textContent = labelMap[difficulty] || difficulty;

  _showQuestion();
}

function _showQuestion() {
  const q = quizState.questions[quizState.currentQuestion];
  const progressPct = (quizState.currentQuestion / quizState.questions.length) * 100;

  // Update progress bar
  const fill = document.getElementById('progress-fill');
  fill.style.width = `${progressPct}%`;
  fill.parentElement.setAttribute('aria-valuenow', Math.round(progressPct));

  document.getElementById('question-counter').textContent =
    `Question ${quizState.currentQuestion + 1} of ${quizState.questions.length}`;
  document.getElementById('question-text').textContent = q.q;
  document.getElementById('feedback-box').hidden = true;
  document.getElementById('next-btn').hidden = true;
  quizState.answered = false;

  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';

  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.id = `option-${i}`;
    btn.setAttribute('aria-label', `Option ${String.fromCharCode(65 + i)}: ${opt}`);
    btn.addEventListener('click', () => selectAnswer(i));
    grid.appendChild(btn);
  });

  // Announce new question to screen readers
  const questionBox = document.getElementById('question-box');
  questionBox.setAttribute('aria-label', `Question ${quizState.currentQuestion + 1}: ${q.q}`);
}

/**
 * Handles answer selection
 * @param {number} selectedIndex
 */
function selectAnswer(selectedIndex) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q = quizState.questions[quizState.currentQuestion];
  const buttons = document.querySelectorAll('.option-btn');

  buttons.forEach(b => b.disabled = true);
  buttons[q.answer].classList.add('correct');

  const feedback = document.getElementById('feedback-box');
  const isCorrect = selectedIndex === q.answer;

  if (isCorrect) {
    quizState.score++;
    document.getElementById('score').textContent = quizState.score;
    buttons[selectedIndex].classList.add('correct');
    feedback.innerHTML = `✅ <strong>Correct!</strong> ${q.explanation}`;
    feedback.style.borderLeftColor = 'var(--success)';
  } else {
    buttons[selectedIndex].classList.add('wrong');
    feedback.innerHTML = `❌ <strong>Incorrect.</strong> The correct answer is: <strong>${q.opts[q.answer]}</strong>. ${q.explanation}`;
    feedback.style.borderLeftColor = 'var(--danger)';
  }

  feedback.hidden = false;
  document.getElementById('next-btn').hidden = false;

  // TTS if enabled
  if (window.ttsEnabled && window.speak) {
    const msg = isCorrect
      ? `Correct! ${q.explanation}`
      : `Incorrect. The correct answer is ${q.opts[q.answer]}. ${q.explanation}`;
    window.speak(msg);
  }
}

function nextQuestion() {
  quizState.currentQuestion++;
  if (quizState.currentQuestion >= quizState.questions.length) {
    _showResults();
  } else {
    _showQuestion();
  }
}

function _showResults() {
  document.getElementById('quiz-game').hidden = true;
  document.getElementById('quiz-results').hidden = false;

  const { score, questions } = quizState;
  const percentage = Math.round((score / questions.length) * 100);

  let emoji, label, msg, color;

  if (percentage >= 90) {
    emoji = '🏆'; label = 'Outstanding!'; color = 'var(--success)';
    msg = `${percentage}% — You're a true democracy champion! Your constitutional knowledge is outstanding.`;
  } else if (percentage >= 70) {
    emoji = '🥇'; label = 'Excellent!'; color = 'var(--success)';
    msg = `${percentage}% — Great job! You have a solid understanding of the Indian election process.`;
  } else if (percentage >= 50) {
    emoji = '🎯'; label = 'Good Job!'; color = 'var(--primary)';
    msg = `${percentage}% — You're on the right track! Review the questions you missed to improve.`;
  } else if (percentage >= 30) {
    emoji = '📚'; label = 'Keep Learning!'; color = 'var(--warning)';
    msg = `${percentage}% — Elections are complex! Use our AI Assistant to deepen your knowledge.`;
  } else {
    emoji = '💪'; label = 'Keep Trying!'; color = 'var(--accent)';
    msg = `${percentage}% — Don't give up! Explore the Election Timeline and try our AI Assistant for help.`;
  }

  document.getElementById('results-content').innerHTML = `
    <div class="result-score" style="color:${color}">${emoji} ${score}/${questions.length}</div>
    <div class="result-label">${label}</div>
    <p class="result-msg">${msg}</p>
  `;
}

function resetQuiz() {
  document.getElementById('quiz-results').hidden = true;
  document.getElementById('quiz-game').hidden = true;
  document.getElementById('quiz-start').hidden = false;
}
