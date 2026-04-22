/* ============================================
   학습 진도 페이지 (Progress)
   ============================================ */

import phrases from '../data/data-loader.js';
import { loadProgress, resetProgress } from '../utils/storage.js';

export function renderProgress(container) {
  const progress = loadProgress();
  const totalPhrases = phrases.length;
  const learnedCount = progress.learned.length;
  const percentage = totalPhrases > 0 ? Math.round(learnedCount / totalPhrases * 100) : 0;
  const bookmarkCount = progress.bookmarks.length;
  const quizRate = progress.totalQuizAttempts > 0
    ? Math.round(progress.totalQuizCorrect / progress.totalQuizAttempts * 100)
    : 0;

  // Build per-phrase data
  const phraseStats = phrases.map(p => {
    const isLearned = progress.learned.includes(p.id);
    const isBookmarked = progress.bookmarks.includes(p.id);
    const quizData = progress.quizScores[p.id];
    return { ...p, isLearned, isBookmarked, quizData };
  });

  container.innerHTML = `
    <div class="page active">
      <div class="page-header">
        <h1>
          <span class="seal-stamp" style="width: 28px; height: 28px; font-size: 11px;">進</span>
          학습 현황
        </h1>
        <p class="subtitle">나의 천자문 학습 진도를 확인하세요</p>
      </div>

      <!-- Overall Progress Circle -->
      <div class="section" style="padding-bottom: var(--space-3);">
        <div class="glass-card glass-card--static" style="padding: var(--space-8); text-align: center;">
          <div style="position: relative; width: 160px; height: 160px; margin: 0 auto var(--space-5);">
            <svg viewBox="0 0 160 160" style="transform: rotate(-90deg);">
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--color-cream-dark)" stroke-width="8"/>
              <circle cx="80" cy="80" r="70" fill="none" stroke="url(#goldGrad)" stroke-width="8"
                stroke-dasharray="${2 * Math.PI * 70}" 
                stroke-dashoffset="${2 * Math.PI * 70 * (1 - percentage / 100)}"
                stroke-linecap="round"
                style="transition: stroke-dashoffset 1s ease;"/>
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="var(--color-gold)"/>
                  <stop offset="100%" stop-color="var(--color-gold-dark)"/>
                </linearGradient>
              </defs>
            </svg>
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div style="font-size: 36px; font-weight: var(--weight-black); color: var(--color-ink);">${percentage}%</div>
              <div style="font-size: var(--text-xs); color: var(--color-ink-muted);">전체 진도</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-around;">
            <div>
              <div style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--color-success);">${learnedCount}</div>
              <div style="font-size: 10px; color: var(--color-ink-muted);">학습 완료</div>
            </div>
            <div style="width: 1px; background: var(--color-cream-dark);"></div>
            <div>
              <div style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--color-ink-muted);">${totalPhrases - learnedCount}</div>
              <div style="font-size: 10px; color: var(--color-ink-muted);">미학습</div>
            </div>
            <div style="width: 1px; background: var(--color-cream-dark);"></div>
            <div>
              <div style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--color-gold-dark);">${bookmarkCount}</div>
              <div style="font-size: 10px; color: var(--color-ink-muted);">북마크</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quiz Stats -->
      <div class="section" style="padding-top: 0; padding-bottom: var(--space-3);">
        <div class="section-title">
          <span class="icon">📊</span> 퀴즈 통계
        </div>
        <div class="glass-card glass-card--static" style="padding: var(--space-5);">
          <div style="display: flex; justify-content: space-around; margin-bottom: var(--space-4);">
            <div style="text-align: center;">
              <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--color-success);">${progress.totalQuizCorrect}</div>
              <div style="font-size: 10px; color: var(--color-ink-muted);">총 정답</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: var(--text-xl); font-weight: var(--weight-bold);">${progress.totalQuizAttempts}</div>
              <div style="font-size: 10px; color: var(--color-ink-muted);">총 시도</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--color-gold-dark);">${quizRate}%</div>
              <div style="font-size: 10px; color: var(--color-ink-muted);">정답률</div>
            </div>
          </div>
          <!-- Mini bar chart -->
          <div style="background: var(--color-ivory); border-radius: var(--radius-md); height: 8px; overflow: hidden;">
            <div style="width: ${quizRate}%; height: 100%; background: linear-gradient(90deg, var(--color-gold), var(--color-success)); border-radius: var(--radius-md); transition: width 1s ease;"></div>
          </div>
        </div>
      </div>

      <!-- Per-Phrase Progress Grid -->
      <div class="section" style="padding-top: 0;">
        <div class="section-title">
          <span class="icon">📋</span> 구절별 학습 현황
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-2);">
          ${phraseStats.map(p => {
            let bg = 'var(--color-cream-dark)';
            let color = 'var(--color-ink-muted)';
            let icon = '';
            if (p.isLearned) {
              bg = 'var(--color-success)';
              color = 'white';
              icon = '✓';
            } else if (p.isBookmarked) {
              bg = 'var(--color-gold)';
              color = 'white';
              icon = '⭐';
            }
            return `
              <a href="#/learn/${p.id}" 
                 style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-2); border-radius: var(--radius-md); background: ${bg}; color: ${color}; text-decoration: none; font-size: 11px; font-weight: var(--weight-semibold); min-height: 48px; transition: transform var(--transition-fast);"
                 title="${p.text} (${p.reading})">
                <span style="font-size: 10px;">${icon || p.id}</span>
                <span style="font-size: 10px; opacity: 0.8; margin-top: 2px;">${p.text.substring(0,2)}</span>
              </a>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Reset -->
      <div class="section" style="text-align: center;">
        <button class="btn btn-ghost btn-sm" id="reset-btn" style="color: var(--color-vermillion); font-size: var(--text-xs);">
          ⚠ 진도 초기화
        </button>
      </div>
    </div>
  `;

  // --- Reset ---
  container.querySelector('#reset-btn').addEventListener('click', () => {
    if (confirm('정말로 모든 학습 진도를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      resetProgress();
      renderProgress(container);
    }
  });
}
