/* ============================================
   홈 (대시보드) 페이지
   ============================================ */

import phrases from '../data/data-loader.js';
import { loadProgress } from '../utils/storage.js';

export function renderHome(container) {
  const progress = loadProgress();
  const totalPhrases = phrases.length;
  const learnedCount = progress.learned.length;
  const learnedPercent = totalPhrases > 0 ? Math.round((learnedCount / totalPhrases) * 100) : 0;
  const quizAccuracy = progress.totalQuizAttempts > 0
    ? Math.round((progress.totalQuizCorrect / progress.totalQuizAttempts) * 100)
    : 0;

  // Pick today's phrase (based on day of year)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const todayPhraseIdx = dayOfYear % totalPhrases;
  const todayPhrase = phrases[todayPhraseIdx];

  // Recent phrases (last 4 not yet learned)
  const unlearned = phrases.filter(p => !progress.learned.includes(p.id)).slice(0, 4);

  container.innerHTML = `
    <div class="page active">
      <!-- Hero Section -->
      <section class="home-hero ink-card" style="margin: var(--space-4); padding: var(--space-8) var(--space-6);">
        <div style="position: relative; z-index: 1;">
          <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);">
            <span class="seal-stamp">千</span>
            <span style="font-size: var(--text-sm); opacity: 0.7;">한석봉 천자문</span>
          </div>
          <h1 style="font-family: var(--font-display); font-size: var(--text-2xl); font-weight: var(--weight-bold); margin-bottom: var(--space-6);">
            천자문과 함께하는<br/>한자 여행
          </h1>
          
          <!-- Stats -->
          <div class="stats-grid" style="background: rgba(255,255,255,0.08); border-radius: var(--radius-lg); padding: var(--space-3);">
            <div class="stat-item">
              <div class="stat-value" style="color: var(--color-gold-light);">${learnedCount}</div>
              <div class="stat-label" style="color: rgba(245,240,232,0.6);">학습 완료</div>
            </div>
            <div class="stat-item">
              <div class="stat-value" style="color: var(--color-gold-light);">${totalPhrases}</div>
              <div class="stat-label" style="color: rgba(245,240,232,0.6);">전체 구절</div>
            </div>
            <div class="stat-item">
              <div class="stat-value" style="color: var(--color-gold-light);">${quizAccuracy}%</div>
              <div class="stat-label" style="color: rgba(245,240,232,0.6);">퀴즈 정답률</div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div style="margin-top: var(--space-4);">
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
              <span style="font-size: var(--text-xs); opacity: 0.6;">전체 진행률</span>
              <span style="font-size: var(--text-xs); color: var(--color-gold-light);">${learnedPercent}%</span>
            </div>
            <div class="progress-bar" style="background: rgba(255,255,255,0.15);">
              <div class="progress-bar__fill" style="width: ${learnedPercent}%;"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Today's Phrase -->
      <section class="section">
        <div class="section-title">
          <span class="icon">📜</span> 오늘의 구절
        </div>
        <a href="#/learn/${todayPhrase.id}" class="glass-card glass-card--gold" style="display: block; padding: var(--space-6); text-decoration: none;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-4);">
            <div>
              <div style="font-size: var(--text-xs); color: var(--color-gold-dark); font-weight: var(--weight-semibold); margin-bottom: var(--space-1);">
                제${todayPhrase.id}구절
              </div>
              <div class="hanja-char hanja-char--lg shimmer-gold" style="font-size: var(--text-3xl);">
                ${todayPhrase.text}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-family: var(--font-display); font-size: var(--text-sm); color: var(--color-ink-muted);">
                ${todayPhrase.reading}
              </div>
            </div>
          </div>
          <div style="font-size: var(--text-sm); color: var(--color-ink-light); line-height: var(--leading-relaxed);">
            ${todayPhrase.meaning}
          </div>
          <div style="display: flex; gap: var(--space-2); margin-top: var(--space-3); flex-wrap: wrap;">
            ${todayPhrase.keywords.map(k => `<span class="tag">${k}</span>`).join('')}
          </div>
        </a>
      </section>

      <!-- Quick Actions -->
      <section class="section" style="padding-top: 0;">
        <div class="section-title">
          <span class="icon">⚡</span> 바로가기
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
          <a href="#/learn" class="glass-card" style="padding: var(--space-5); text-align: center; text-decoration: none;">
            <div style="font-size: 28px; margin-bottom: var(--space-2);">📖</div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-ink);">맥락 학습</div>
            <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-top: var(--space-1);">스토리와 함께</div>
          </a>
          <a href="#/gallery" class="glass-card" style="padding: var(--space-5); text-align: center; text-decoration: none;">
            <div style="font-size: 28px; margin-bottom: var(--space-2);">🖌️</div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-ink);">서예 미술관</div>
            <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-top: var(--space-1);">해서 vs 초서</div>
          </a>
          <a href="#/quiz" class="glass-card" style="padding: var(--space-5); text-align: center; text-decoration: none;">
            <div style="font-size: 28px; margin-bottom: var(--space-2);">❓</div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-ink);">맥락 퀴즈</div>
            <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-top: var(--space-1);">빈칸 채우기</div>
          </a>
          <a href="#/progress" class="glass-card" style="padding: var(--space-5); text-align: center; text-decoration: none;">
            <div style="font-size: 28px; margin-bottom: var(--space-2);">📊</div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-ink);">학습 현황</div>
            <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-top: var(--space-1);">진도 확인</div>
          </a>
        </div>
      </section>

      <!-- Continue Learning -->
      ${unlearned.length > 0 ? `
      <section class="section" style="padding-top: 0;">
        <div class="section-title">
          <span class="icon">🎯</span> 학습할 구절
        </div>
        <div class="stagger-children" style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${unlearned.map(p => `
            <a href="#/learn/${p.id}" class="glass-card" style="display: flex; align-items: center; padding: var(--space-4); text-decoration: none; gap: var(--space-4);">
              <div class="hanja-char" style="font-size: var(--text-2xl); min-width: 100px; text-align: center; letter-spacing: 0.02em;">
                ${p.text}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-ink);">${p.reading}</div>
                <div style="font-size: var(--text-xs); color: var(--color-ink-muted); margin-top: 2px;" class="truncate">${p.meaning}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-muted)" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          `).join('')}
        </div>
      </section>
      ` : ''}
    </div>
  `;
}
