/* ============================================
   퀴즈 페이지 (Quiz)
   C-1: 구절 빈칸 채우기, C-2: 맥락 연결 퀴즈
   ============================================ */

import phrases from '../data/data-loader.js';
import { loadProgress, recordQuiz } from '../utils/storage.js';

let currentQuizType = 'fill'; // 'fill' or 'context'
let currentQuestion = null;
let answered = false;

function generateFillQuiz() {
  // Pick random phrase
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  // Pick random char to blank out
  const blankIdx = Math.floor(Math.random() * 4);
  const answer = phrase.chars[blankIdx];

  // Generate wrong options (3 random chars from other phrases)
  const otherChars = phrases
    .filter(p => p.id !== phrase.id)
    .flatMap(p => p.chars)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const options = [...otherChars, answer].sort(() => Math.random() - 0.5);

  return {
    type: 'fill',
    phrase,
    blankIdx,
    answer,
    options,
    hint: `${answer.eum} (${answer.hoon})`
  };
}

function generateContextQuiz() {
  // Pick 4 random phrases
  const shuffled = [...phrases].sort(() => Math.random() - 0.5);
  const questionPhrase = shuffled[0];
  const wrongPhrases = shuffled.slice(1, 4);

  const options = [
    { text: questionPhrase.meaning, isCorrect: true },
    ...wrongPhrases.map(p => ({ text: p.meaning, isCorrect: false }))
  ].sort(() => Math.random() - 0.5);

  return {
    type: 'context',
    phrase: questionPhrase,
    options,
    answer: questionPhrase.meaning
  };
}

function generateQuestion() {
  answered = false;
  if (currentQuizType === 'fill') {
    currentQuestion = generateFillQuiz();
  } else {
    currentQuestion = generateContextQuiz();
  }
  return currentQuestion;
}

export function renderQuiz(container) {
  const progress = loadProgress();
  const q = generateQuestion();

  container.innerHTML = `
    <div class="page active">
      <div class="page-header">
        <h1>
          <span class="seal-stamp" style="width: 28px; height: 28px; font-size: 11px;">問</span>
          맥락 퀴즈
        </h1>
        <p class="subtitle">학습한 내용을 확인해 보세요</p>
      </div>

      <!-- Quiz Type Toggle -->
      <div class="section" style="padding-bottom: 0;">
        <div style="display: flex; gap: var(--space-2); padding: var(--space-1); background: var(--color-cream-dark); border-radius: var(--radius-full);">
          <button class="quiz-type-tab ${currentQuizType === 'fill' ? 'active' : ''}" data-type="fill"
            style="flex: 1; padding: var(--space-2) var(--space-4); border-radius: var(--radius-full); font-size: var(--text-sm); font-weight: var(--weight-semibold); cursor: pointer; border: none; font-family: var(--font-body); transition: all var(--transition-fast);
            ${currentQuizType === 'fill' ? 'background: var(--color-white); color: var(--color-ink); box-shadow: var(--shadow-sm);' : 'background: transparent; color: var(--color-ink-muted);'}">
            빈칸 채우기
          </button>
          <button class="quiz-type-tab ${currentQuizType === 'context' ? 'active' : ''}" data-type="context"
            style="flex: 1; padding: var(--space-2) var(--space-4); border-radius: var(--radius-full); font-size: var(--text-sm); font-weight: var(--weight-semibold); cursor: pointer; border: none; font-family: var(--font-body); transition: all var(--transition-fast);
            ${currentQuizType === 'context' ? 'background: var(--color-white); color: var(--color-ink); box-shadow: var(--shadow-sm);' : 'background: transparent; color: var(--color-ink-muted);'}">
            맥락 연결
          </button>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="section" style="padding-bottom: 0;">
        <div style="display: flex; justify-content: space-around; padding: var(--space-3); background: var(--color-ivory); border-radius: var(--radius-lg);">
          <div style="text-align: center;">
            <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--color-success);">${progress.totalQuizCorrect}</div>
            <div style="font-size: 10px; color: var(--color-ink-muted);">정답</div>
          </div>
          <div style="width: 1px; background: var(--color-cream-dark);"></div>
          <div style="text-align: center;">
            <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--color-ink-muted);">${progress.totalQuizAttempts}</div>
            <div style="font-size: 10px; color: var(--color-ink-muted);">총 시도</div>
          </div>
          <div style="width: 1px; background: var(--color-cream-dark);"></div>
          <div style="text-align: center;">
            <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--color-gold-dark);">
              ${progress.totalQuizAttempts > 0 ? Math.round(progress.totalQuizCorrect / progress.totalQuizAttempts * 100) : 0}%
            </div>
            <div style="font-size: 10px; color: var(--color-ink-muted);">정답률</div>
          </div>
        </div>
      </div>

      <!-- Quiz Content -->
      <div id="quiz-content" class="section">
        ${renderQuizContent(q)}
      </div>

      <!-- Feedback & Next -->
      <div id="quiz-feedback" class="section" style="padding-top: 0; display: none;">
        <div id="feedback-box" style="padding: var(--space-5); border-radius: var(--radius-xl); text-align: center; margin-bottom: var(--space-4);"></div>
        <button class="btn btn-primary btn-lg" id="next-btn" style="width: 100%;">
          다음 문제 →
        </button>
      </div>
    </div>
  `;

  // --- Event: Quiz type toggle ---
  container.querySelectorAll('.quiz-type-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentQuizType = tab.dataset.type;
      renderQuiz(container);
    });
  });

  // --- Event: Option selection ---
  setupQuizEvents(container, q);
}

function renderQuizContent(q) {
  if (q.type === 'fill') {
    return renderFillQuiz(q);
  } else {
    return renderContextQuiz(q);
  }
}

function renderFillQuiz(q) {
  return `
    <div class="glass-card glass-card--static" style="padding: var(--space-6); text-align: center; margin-bottom: var(--space-5);">
      <div style="font-size: var(--text-xs); color: var(--color-gold-dark); font-weight: var(--weight-semibold); margin-bottom: var(--space-4);">
        제${q.phrase.id}구절 — 빈칸에 들어갈 한자는?
      </div>
      <div style="display: flex; justify-content: center; gap: var(--space-3); margin-bottom: var(--space-4);">
        ${q.phrase.chars.map((c, i) => {
          if (i === q.blankIdx) {
            return `
              <div class="phrase-blank" id="blank-display">
                <span style="font-size: var(--text-xl);">?</span>
              </div>
            `;
          }
          return `
            <div style="text-align: center;">
              <div class="hanja-char" style="font-size: var(--text-3xl); width: 56px; height: 56px; display: flex; align-items: center; justify-content: center;">${c.char}</div>
            </div>
          `;
        }).join('')}
      </div>
      <div style="font-size: var(--text-sm); color: var(--color-ink-muted);">
        힌트: <strong style="color: var(--color-gold-dark);">${q.hint}</strong>
      </div>
    </div>

    <div class="quiz-options" id="quiz-options">
      ${q.options.map((opt, i) => `
        <div class="quiz-option" data-idx="${i}" data-char="${opt.char}">
          <div class="option-char">${opt.char}</div>
          <div class="option-text">${opt.eum} (${opt.hoon})</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderContextQuiz(q) {
  return `
    <div class="glass-card glass-card--static" style="padding: var(--space-6); text-align: center; margin-bottom: var(--space-5);">
      <div style="font-size: var(--text-xs); color: var(--color-gold-dark); font-weight: var(--weight-semibold); margin-bottom: var(--space-4);">
        다음 구절의 뜻을 고르세요
      </div>
      <div class="hanja-char shimmer-gold" style="font-size: var(--text-4xl); margin-bottom: var(--space-3);">
        ${q.phrase.text}
      </div>
      <div style="font-size: var(--text-sm); color: var(--color-ink-muted);">${q.phrase.reading}</div>
    </div>

    <div style="display: flex; flex-direction: column; gap: var(--space-3); padding: 0 var(--space-5);" id="quiz-options">
      ${q.options.map((opt, i) => `
        <div class="quiz-option" data-idx="${i}" data-correct="${opt.isCorrect}" 
             style="border-radius: var(--radius-lg); padding: var(--space-4); text-align: left;">
          <div class="option-text" style="font-size: var(--text-sm);">${opt.text}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function setupQuizEvents(container, q) {
  const optionsContainer = container.querySelector('#quiz-options');
  const feedbackSection = container.querySelector('#quiz-feedback');
  const feedbackBox = container.querySelector('#feedback-box');
  const nextBtn = container.querySelector('#next-btn');

  optionsContainer.addEventListener('click', (e) => {
    if (answered) return;

    const option = e.target.closest('.quiz-option');
    if (!option) return;

    answered = true;
    let isCorrect = false;

    if (q.type === 'fill') {
      const selectedChar = option.dataset.char;
      isCorrect = selectedChar === q.answer.char;

      // Highlight correct/incorrect
      optionsContainer.querySelectorAll('.quiz-option').forEach(opt => {
        if (opt.dataset.char === q.answer.char) {
          opt.classList.add('correct');
        } else if (opt === option && !isCorrect) {
          opt.classList.add('incorrect', 'anim-incorrect');
        }
      });

      // Fill the blank
      if (isCorrect) {
        const blank = container.querySelector('#blank-display');
        blank.innerHTML = `<span class="hanja-char" style="font-size: var(--text-xl);">${q.answer.char}</span>`;
        blank.classList.add('filled');
        option.classList.add('anim-correct');
      }
    } else {
      isCorrect = option.dataset.correct === 'true';

      optionsContainer.querySelectorAll('.quiz-option').forEach(opt => {
        if (opt.dataset.correct === 'true') {
          opt.classList.add('correct');
        } else if (opt === option && !isCorrect) {
          opt.classList.add('incorrect', 'anim-incorrect');
        }
      });

      if (isCorrect) {
        option.classList.add('anim-correct');
      }
    }

    // Record result
    recordQuiz(q.phrase.id, isCorrect);

    // Show feedback
    feedbackSection.style.display = '';
    if (isCorrect) {
      feedbackBox.style.background = 'rgba(45, 143, 94, 0.08)';
      feedbackBox.style.border = '1px solid rgba(45, 143, 94, 0.2)';
      feedbackBox.innerHTML = `
        <div style="font-size: 32px; margin-bottom: var(--space-2);">🎉</div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--color-success); margin-bottom: var(--space-2);">정답입니다!</div>
        <div style="font-size: var(--text-sm); color: var(--color-ink-muted);">${q.phrase.meaning}</div>
      `;
    } else {
      feedbackBox.style.background = 'rgba(199, 62, 29, 0.06)';
      feedbackBox.style.border = '1px solid rgba(199, 62, 29, 0.15)';
      feedbackBox.innerHTML = `
        <div style="font-size: 32px; margin-bottom: var(--space-2);">😔</div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--color-vermillion); margin-bottom: var(--space-2);">아쉽습니다</div>
        <div style="font-size: var(--text-sm); color: var(--color-ink-muted);">
          정답: <strong>${q.type === 'fill' ? `${q.answer.char} (${q.answer.eum})` : q.answer}</strong>
        </div>
        <a href="#/learn/${q.phrase.id}" style="display: inline-block; margin-top: var(--space-3); font-size: var(--text-sm); color: var(--color-gold-dark); text-decoration: underline;">
          이 구절 복습하기 →
        </a>
      `;
    }
  });

  // Next button
  nextBtn.addEventListener('click', () => {
    renderQuiz(container);
  });
}
