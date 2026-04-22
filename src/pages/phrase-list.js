/* ============================================
   구절 목록 페이지 (Phrase List)
   ============================================ */

import phrases from '../data/data-loader.js';
import { loadProgress } from '../utils/storage.js';

export function renderPhraseList(container) {
  const progress = loadProgress();

  container.innerHTML = `
    <div class="page active">
      <div class="page-header">
        <h1>
          <span class="seal-stamp" style="width: 28px; height: 28px; font-size: 11px;">學</span>
          맥락 학습
        </h1>
        <p class="subtitle">구절을 선택하여 스토리와 함께 학습하세요</p>
      </div>

      <!-- Search -->
      <div class="section" style="padding-bottom: var(--space-2);">
        <div class="search-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" class="search-input" id="phrase-search" placeholder="한자, 독음, 뜻으로 검색..." />
        </div>
      </div>

      <!-- Filter Tags -->
      <div class="section" style="padding-top: 0; padding-bottom: var(--space-2);">
        <div style="display: flex; gap: var(--space-2); overflow-x: auto; padding-bottom: var(--space-2);">
          <button class="tag filter-tag active" data-filter="all">전체 (${phrases.length})</button>
          <button class="tag tag--success filter-tag" data-filter="learned">학습 완료 (${progress.learned.length})</button>
          <button class="tag tag--vermillion filter-tag" data-filter="unlearned">미학습 (${phrases.length - progress.learned.length})</button>
          <button class="tag filter-tag" data-filter="bookmarked">⭐ 북마크</button>
        </div>
      </div>

      <!-- Phrase List -->
      <div class="section stagger-children" id="phrase-list-grid" style="display: flex; flex-direction: column; gap: var(--space-3); padding-top: var(--space-2);">
        ${phrases.map(p => {
          const isLearned = progress.learned.includes(p.id);
          const isBookmarked = progress.bookmarks.includes(p.id);
          return `
            <a href="#/learn/${p.id}" 
               class="glass-card phrase-list-item" 
               data-id="${p.id}" 
               data-learned="${isLearned}" 
               data-bookmarked="${isBookmarked}"
               data-search="${p.text}${p.reading}${p.meaning}${p.chars.map(c => c.eum + c.hoon).join('')}"
               style="display: flex; align-items: center; padding: var(--space-4); text-decoration: none; gap: var(--space-4);">
              <div style="position: relative;">
                <div class="hanja-char" style="font-size: var(--text-2xl); min-width: 96px; text-align: center; letter-spacing: 0.02em;">
                  ${p.text}
                </div>
                ${isLearned ? '<div style="position: absolute; top: -4px; right: -4px; width: 16px; height: 16px; background: var(--color-success); border-radius: 50%; display: flex; align-items: center; justify-content: center;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>' : ''}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 2px;">
                  <span style="font-size: var(--text-xs); color: var(--color-gold-dark); font-weight: var(--weight-semibold);">제${p.id}구절</span>
                  ${isBookmarked ? '<span style="font-size: 12px;">⭐</span>' : ''}
                </div>
                <div style="font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-ink);">${p.reading}</div>
                <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-top: 2px;" class="truncate">${p.meaning}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-muted)" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // --- Search ---
  const searchInput = document.getElementById('phrase-search');
  const items = container.querySelectorAll('.phrase-list-item');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    items.forEach(item => {
      const searchData = item.dataset.search.toLowerCase();
      item.style.display = searchData.includes(query) ? '' : 'none';
    });
  });

  // --- Filter ---
  const filterTags = container.querySelectorAll('.filter-tag');
  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      const filter = tag.dataset.filter;

      items.forEach(item => {
        switch (filter) {
          case 'all':
            item.style.display = '';
            break;
          case 'learned':
            item.style.display = item.dataset.learned === 'true' ? '' : 'none';
            break;
          case 'unlearned':
            item.style.display = item.dataset.learned === 'false' ? '' : 'none';
            break;
          case 'bookmarked':
            item.style.display = item.dataset.bookmarked === 'true' ? '' : 'none';
            break;
        }
      });
    });
  });
}
