/* ============================================
   구절 상세 학습 페이지 (Learn)
   ============================================ */

import phrases from '../data/data-loader.js';
import { loadProgress, toggleLearned, toggleBookmark, saveNote, setLastVisited } from '../utils/storage.js';
import { openCharModal } from '../app.js';

export function renderLearn(container, params) {
  const phraseId = params.id || 1;
  const phrase = phrases.find(p => p.id === phraseId);

  if (!phrase) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">📖</div>
        <div class="empty-state__title">구절을 찾을 수 없습니다</div>
        <a href="#/learn" class="btn btn-primary" style="margin-top: var(--space-4);">목록으로</a>
      </div>
    `;
    return;
  }

  setLastVisited(phraseId);
  const progress = loadProgress();
  const isLearned = progress.learned.includes(phraseId);
  const isBookmarked = progress.bookmarks.includes(phraseId);
  const note = progress.notes[phraseId] || '';
  const prevPhrase = phrases.find(p => p.id === phraseId - 1);
  const nextPhrase = phrases.find(p => p.id === phraseId + 1);

  container.innerHTML = `
    <div class="page active">
      <!-- Header -->
      <div class="page-header" style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <a href="#/learn" class="btn-icon btn-ghost" style="width: 36px; height: 36px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </a>
          <div>
            <h1 style="font-size: var(--text-base);">제${phrase.id}구절</h1>
            <p class="subtitle" style="margin: 0;">${phrase.reading}</p>
          </div>
        </div>
        <div style="display: flex; gap: var(--space-2);">
          <button class="btn-icon btn-ghost" id="bookmark-btn" title="북마크" style="font-size: 20px;">
            ${isBookmarked ? '⭐' : '☆'}
          </button>
          <button class="btn btn-sm ${isLearned ? 'btn-primary' : 'btn-outline'}" id="learned-btn">
            ${isLearned ? '✓ 암기 완료' : '암기 완료'}
          </button>
        </div>
      </div>

      <!-- Hanja Characters Display -->
      <section style="background: linear-gradient(180deg, var(--color-ivory) 0%, var(--color-hanji) 100%); padding: var(--space-8) var(--space-4);">
        <div class="phrase-display stagger-children">
          ${phrase.chars.map((c, i) => `
            <div class="phrase-char" data-char-idx="${i}" id="char-tap-${i}">
              <div class="char calligraphy-style" style="font-size: clamp(2.5rem, 12vw, 4rem);">${c.char}</div>
              <div class="eum">${c.eum}</div>
              <div class="hoon" style="font-size: 11px;">${c.hoon}</div>
            </div>
          `).join('')}
        </div>
        <div class="divider-gold"></div>
        <div style="text-align: center; padding: 0 var(--space-4);">
          <p style="font-family: var(--font-display); font-size: var(--text-lg); color: var(--color-ink); font-weight: var(--weight-bold); margin-bottom: var(--space-2);">
            ${phrase.meaning}
          </p>
          <p style="font-size: var(--text-xs); color: var(--color-gold-dark);">${phrase.reading}</p>
        </div>
      </section>

      <!-- Story Section -->
      <section class="section">
        <div class="story-card glass-card glass-card--static" id="story-card">
          <div class="story-card__header">
            <div class="story-card__title">📜 스토리텔링 해설</div>
            <div class="story-card__toggle" id="story-toggle">▼</div>
          </div>
          <div class="story-card__preview">${phrase.story}</div>
          <div class="story-card__body" id="story-body">
            <p style="margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px solid var(--color-cream-dark);">
              ${phrase.storyDetail}
            </p>
            <div class="story-card__keywords">
              ${phrase.keywords.map(k => `<span class="tag">${k}</span>`).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- Character Details Grid -->
      <section class="section" style="padding-top: 0;">
        <div class="section-title">
          <span class="icon">🔍</span> 글자 심화 정보
          <span style="font-size: var(--text-xs); color: var(--color-ink-muted); font-weight: var(--weight-regular); margin-left: auto;">탭하여 상세보기</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
          ${phrase.chars.map((c, i) => `
            <div class="glass-card char-detail-card" data-char-idx="${i}" style="padding: var(--space-4); cursor: pointer;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-3);">
                <div class="hanja-char" style="font-size: var(--text-3xl);">${c.char}</div>
                <span class="tag tag--ink" style="font-size: 10px;">${c.strokes}획</span>
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-gold-dark);">${c.eum}</div>
              <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-top: 2px;">${c.hoon}</div>
              <div style="font-size: 10px; color: var(--color-ink-muted); margin-top: var(--space-2); opacity: 0.7;">
                部首: ${c.radical}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Notes Section -->
      <section class="section" style="padding-top: 0;">
        <div class="section-title">
          <span class="icon">📝</span> 나의 메모
        </div>
        <div class="glass-card glass-card--static" style="padding: var(--space-4);">
          <textarea id="note-input" 
            placeholder="이 구절에 대한 나만의 메모를 남겨보세요..." 
            style="width: 100%; min-height: 80px; border: none; background: transparent; font-family: var(--font-body); font-size: var(--text-sm); color: var(--color-ink); resize: vertical; outline: none; line-height: var(--leading-relaxed);"
          >${note}</textarea>
          <div style="display: flex; justify-content: flex-end; margin-top: var(--space-2);">
            <button class="btn btn-sm btn-outline" id="save-note-btn">저장</button>
          </div>
        </div>
      </section>

      <!-- Navigation -->
      <section class="section" style="padding-top: 0;">
        <div class="swiper-nav">
          ${prevPhrase 
            ? `<a href="#/learn/${prevPhrase.id}" class="btn btn-ghost btn-sm">← ${prevPhrase.text}</a>`
            : '<div></div>'}
          <div class="swiper-nav__info">
            ${phraseId} / ${phrases.length}
          </div>
          ${nextPhrase
            ? `<a href="#/learn/${nextPhrase.id}" class="btn btn-ghost btn-sm">${nextPhrase.text} →</a>`
            : '<div></div>'}
        </div>
      </section>
    </div>
  `;

  // --- Event Listeners ---

  // Story toggle
  const storyCard = container.querySelector('#story-card');
  const storyToggle = container.querySelector('#story-toggle');
  const storyBody = container.querySelector('#story-body');

  storyCard.addEventListener('click', () => {
    storyBody.classList.toggle('open');
    storyToggle.classList.toggle('open');
  });

  // Character tap -> modal
  const charCards = container.querySelectorAll('.phrase-char, .char-detail-card');
  charCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(card.dataset.charIdx);
      const c = phrase.chars[idx];
      openCharModal(renderCharModal(c));
    });
  });

  // Learned button
  container.querySelector('#learned-btn').addEventListener('click', () => {
    toggleLearned(phraseId);
    renderLearn(container, params); // re-render
  });

  // Bookmark button
  container.querySelector('#bookmark-btn').addEventListener('click', () => {
    toggleBookmark(phraseId);
    renderLearn(container, params);
  });

  // Save note
  container.querySelector('#save-note-btn').addEventListener('click', () => {
    const noteText = container.querySelector('#note-input').value;
    saveNote(phraseId, noteText);
    // Quick visual feedback
    const btn = container.querySelector('#save-note-btn');
    btn.textContent = '✓ 저장됨';
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-primary');
    setTimeout(() => {
      btn.textContent = '저장';
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline');
    }, 1500);
  });
}

function renderCharModal(c) {
  return `
    <div style="text-align: center; margin-bottom: var(--space-6);">
      <div class="hanja-char calligraphy-style" style="font-size: 5rem; margin-bottom: var(--space-3);">
        ${c.char}
      </div>
      <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--color-gold-dark);">
        ${c.eum}
      </div>
      <div style="font-size: var(--text-base); color: var(--color-ink-muted); margin-top: var(--space-1);">
        ${c.hoon}
      </div>
    </div>

    <div class="divider-gold"></div>

    <!-- Meta Info -->
    <div style="display: flex; justify-content: center; gap: var(--space-4); margin: var(--space-4) 0; flex-wrap: wrap;">
      <div class="tag tag--ink">${c.strokes}획</div>
      <div class="tag tag--ink">部首: ${c.radical}</div>
    </div>

    <!-- Formation Principle -->
    <div style="margin-bottom: var(--space-6);">
      <h3 style="font-family: var(--font-display); font-size: var(--text-base); margin-bottom: var(--space-3); display: flex; align-items: center; gap: var(--space-2);">
        <span>🏛️</span> 제자 원리
      </h3>
      <div style="background: var(--color-ivory); padding: var(--space-4); border-radius: var(--radius-lg); font-size: var(--text-sm); line-height: var(--leading-relaxed); color: var(--color-ink-light);">
        ${c.origin}
      </div>
    </div>

    <!-- Derived Words -->
    <div>
      <h3 style="font-family: var(--font-display); font-size: var(--text-base); margin-bottom: var(--space-3); display: flex; align-items: center; gap: var(--space-2);">
        <span>📚</span> 파생어 / 사자성어
      </h3>
      <div style="display: flex; flex-wrap: wrap; gap: var(--space-2);">
        ${c.derived.map(d => `
          <span class="tag" style="font-size: var(--text-sm); padding: var(--space-2) var(--space-3);">
            ${d}
          </span>
        `).join('')}
      </div>
    </div>
  `;
}
