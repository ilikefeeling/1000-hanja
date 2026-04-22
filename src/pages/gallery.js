/* ============================================
   서예 갤러리 페이지 (Gallery)
   해서 vs 초서 비교, 초서 변이 시각화, 난해 초서 리스트
   ============================================ */

import phrases from '../data/data-loader.js';

// Simulated cursive difficulty data
const cursiveDifficulty = {
  '天': 'easy', '地': 'medium', '玄': 'hard', '黃': 'hard',
  '宇': 'medium', '宙': 'medium', '洪': 'hard', '荒': 'hard',
  '日': 'easy', '月': 'easy', '盈': 'hard', '昃': 'hard',
  '辰': 'medium', '宿': 'hard', '列': 'medium', '張': 'hard',
  '寒': 'hard', '來': 'medium', '暑': 'medium', '往': 'easy',
  '秋': 'medium', '收': 'hard', '冬': 'easy', '藏': 'hard',
  '閏': 'hard', '餘': 'hard', '成': 'easy', '歲': 'hard',
  '律': 'medium', '呂': 'medium', '調': 'hard', '陽': 'medium',
  '雲': 'hard', '騰': 'hard', '致': 'medium', '雨': 'easy',
  '露': 'hard', '結': 'medium', '爲': 'hard', '霜': 'hard',
  '金': 'easy', '生': 'easy', '麗': 'hard', '水': 'easy',
  '玉': 'easy', '出': 'easy', '崑': 'hard', '岡': 'medium',
  '劍': 'hard', '號': 'hard', '巨': 'easy', '闕': 'hard',
  '珠': 'medium', '稱': 'hard', '夜': 'medium', '光': 'easy',
  '果': 'easy', '珍': 'medium', '李': 'easy', '柰': 'medium',
  '菜': 'medium', '重': 'easy', '芥': 'medium', '薑': 'hard',
};

const difficultyLabel = { easy: '쉬움', medium: '보통', hard: '어려움' };
const difficultyColor = { easy: 'var(--color-success)', medium: 'var(--color-warning)', hard: 'var(--color-vermillion)' };

export function renderGallery(container) {
  const allChars = phrases.flatMap(p => p.chars.map(c => ({ ...c, phraseId: p.id, phraseText: p.text })));
  const hardChars = allChars.filter(c => cursiveDifficulty[c.char] === 'hard');

  container.innerHTML = `
    <div class="page active">
      <div class="page-header">
        <h1>
          <span class="seal-stamp" style="width: 28px; height: 28px; font-size: 11px;">書</span>
          서예 미술관
        </h1>
        <p class="subtitle">한석봉의 해서와 초서를 비교 감상하세요</p>
      </div>

      <!-- View Tabs -->
      <div class="section" style="padding-bottom: 0;">
        <div style="display: flex; gap: var(--space-2); padding: var(--space-1); background: var(--color-cream-dark); border-radius: var(--radius-full);">
          <button class="gallery-tab active" data-tab="compare" id="tab-compare"
            style="flex: 1; padding: var(--space-2) var(--space-4); border-radius: var(--radius-full); font-size: var(--text-sm); font-weight: var(--weight-semibold); transition: all var(--transition-fast); cursor: pointer; border: none; font-family: var(--font-body);">
            해서 vs 초서
          </button>
          <button class="gallery-tab" data-tab="transform" id="tab-transform"
            style="flex: 1; padding: var(--space-2) var(--space-4); border-radius: var(--radius-full); font-size: var(--text-sm); font-weight: var(--weight-semibold); transition: all var(--transition-fast); cursor: pointer; border: none; background: transparent; font-family: var(--font-body); color: var(--color-ink-muted);">
            초서 변이
          </button>
          <button class="gallery-tab" data-tab="difficult" id="tab-difficult"
            style="flex: 1; padding: var(--space-2) var(--space-4); border-radius: var(--radius-full); font-size: var(--text-sm); font-weight: var(--weight-semibold); transition: all var(--transition-fast); cursor: pointer; border: none; background: transparent; font-family: var(--font-body); color: var(--color-ink-muted);">
            난해 초서
          </button>
        </div>
      </div>

      <!-- COMPARE VIEW -->
      <div id="view-compare" class="gallery-view">
        <div class="section">
          <div style="display: flex; flex-direction: column; gap: var(--space-5);">
            ${phrases.map(p => `
              <div class="glass-card glass-card--static" style="overflow: hidden;">
                <div style="padding: var(--space-3) var(--space-4); background: rgba(26,26,46,0.03); border-bottom: 1px solid var(--color-cream-dark);">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--color-gold-dark);">제${p.id}구절</span>
                    <span style="font-size: var(--text-xs); color: var(--color-ink-muted);">${p.reading}</span>
                  </div>
                </div>
                <div class="gallery-compare">
                  <div class="gallery-item gallery-item--standard">
                    <div class="gallery-item__label">해서(楷書)</div>
                    ${p.chars.map(c => `
                      <div class="char calligraphy-style" style="font-size: var(--text-4xl); margin-bottom: var(--space-2);">${c.char}</div>
                    `).join('')}
                  </div>
                  <div class="gallery-item gallery-item--cursive">
                    <div class="gallery-item__label">초서(草書)</div>
                    ${p.chars.map(c => `
                      <div class="char cursive-style" style="font-size: var(--text-4xl); margin-bottom: var(--space-2);">${c.char}</div>
                    `).join('')}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- TRANSFORM VIEW -->
      <div id="view-transform" class="gallery-view" style="display: none;">
        <div class="section">
          <div style="text-align: center; padding: var(--space-4);">
            <p style="font-size: var(--text-sm); color: var(--color-ink-muted); margin-bottom: var(--space-4);">
              글자를 탭하면 해서에서 초서로 변하는 과정을 확인할 수 있습니다
            </p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-3);">
            ${allChars.slice(0, 32).map(c => `
              <div class="glass-card transform-char" 
                   style="padding: var(--space-4); text-align: center; cursor: pointer; user-select: none;"
                   data-state="standard">
                <div class="transform-display calligraphy-style" style="font-size: var(--text-3xl); margin-bottom: var(--space-2); transition: all 0.8s ease;">
                  ${c.char}
                </div>
                <div style="font-size: 10px; color: var(--color-ink-muted);">${c.eum}</div>
                <div style="margin-top: var(--space-2);">
                  <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${difficultyColor[cursiveDifficulty[c.char] || 'medium']};"></span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- DIFFICULT VIEW -->
      <div id="view-difficult" class="gallery-view" style="display: none;">
        <div class="section">
          <div style="background: rgba(199, 62, 29, 0.05); padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-5); border: 1px solid rgba(199, 62, 29, 0.1);">
            <p style="font-size: var(--text-sm); color: var(--color-vermillion); font-weight: var(--weight-semibold); margin-bottom: var(--space-1);">
              ⚠️ 주의해야 할 초서 ${hardChars.length}자
            </p>
            <p style="font-size: var(--text-xs); color: var(--color-ink-muted);">
              해서와 초서의 형태 차이가 커서 판독이 어려운 한자들입니다
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4);">
            ${hardChars.map(c => `
              <div class="glass-card glass-card--static" style="padding: var(--space-5); text-align: center;">
                <div style="display: flex; justify-content: center; gap: var(--space-6); margin-bottom: var(--space-3);">
                  <div>
                    <div style="font-size: 10px; color: var(--color-gold-dark); font-weight: var(--weight-semibold); margin-bottom: var(--space-1);">해서</div>
                    <div class="calligraphy-style" style="font-size: var(--text-3xl);">${c.char}</div>
                  </div>
                  <div style="display: flex; align-items: center; color: var(--color-ink-muted);">→</div>
                  <div>
                    <div style="font-size: 10px; color: var(--color-vermillion); font-weight: var(--weight-semibold); margin-bottom: var(--space-1);">초서</div>
                    <div class="cursive-style" style="font-size: var(--text-3xl);">${c.char}</div>
                  </div>
                </div>
                <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-gold-dark);">${c.eum}</div>
                <div style="font-size: var(--text-xs); color: var(--color-ink-muted);">${c.hoon}</div>
                <div class="tag tag--vermillion" style="margin-top: var(--space-2); font-size: 10px;">난이도: 어려움</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // --- Tab Switching ---
  const tabs = container.querySelectorAll('.gallery-tab');
  const views = container.querySelectorAll('.gallery-view');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.style.background = 'transparent';
        t.style.color = 'var(--color-ink-muted)';
      });
      tab.classList.add('active');
      tab.style.background = 'var(--color-white)';
      tab.style.color = 'var(--color-ink)';
      tab.style.boxShadow = 'var(--shadow-sm)';

      views.forEach(v => v.style.display = 'none');
      const targetView = container.querySelector(`#view-${tab.dataset.tab}`);
      if (targetView) targetView.style.display = '';
    });
  });

  // Set initial tab style
  const activeTab = container.querySelector('.gallery-tab.active');
  if (activeTab) {
    activeTab.style.background = 'var(--color-white)';
    activeTab.style.color = 'var(--color-ink)';
    activeTab.style.boxShadow = 'var(--shadow-sm)';
  }

  // --- Transform animation ---
  const transformChars = container.querySelectorAll('.transform-char');
  transformChars.forEach(card => {
    card.addEventListener('click', () => {
      const display = card.querySelector('.transform-display');
      const state = card.dataset.state;

      if (state === 'standard') {
        display.classList.remove('calligraphy-style');
        display.classList.add('morph-to-cursive', 'cursive-style');
        card.dataset.state = 'cursive';
        card.style.borderColor = 'var(--color-vermillion)';
      } else {
        display.classList.remove('cursive-style', 'morph-to-cursive');
        display.classList.add('calligraphy-style');
        card.dataset.state = 'standard';
        card.style.borderColor = '';
      }
    });
  });
}
