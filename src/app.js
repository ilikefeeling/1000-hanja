/* ============================================
   천자문 앱 — SPA Router & App Core
   ============================================ */

import { renderHome } from './pages/home.js';
import { renderLearn } from './pages/learn.js';
import { renderPhraseList } from './pages/phrase-list.js';
import { renderGallery } from './pages/gallery.js';
import { renderQuiz } from './pages/quiz.js';
import { renderProgress } from './pages/progress.js';

const container = document.getElementById('page-container');
const navItems = document.querySelectorAll('.nav-item');
const modal = document.getElementById('char-modal');
const modalBody = document.getElementById('modal-body');
const modalCloseBtn = document.getElementById('modal-close-btn');

// --- Modal ---
export function openCharModal(html) {
  modalBody.innerHTML = html;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

export function closeCharModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

modalCloseBtn.addEventListener('click', closeCharModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeCharModal();
});

// --- Router ---
const routes = {
  '/': { render: renderHome, nav: 'home' },
  '/learn': { render: renderPhraseList, nav: 'learn' },
  '/learn/:id': { render: renderLearn, nav: 'learn' },
  '/gallery': { render: renderGallery, nav: 'gallery' },
  '/quiz': { render: renderQuiz, nav: 'quiz' },
  '/progress': { render: renderProgress, nav: 'progress' },
};

function parseHash() {
  const hash = window.location.hash.slice(1) || '/';
  // Check for param routes like /learn/3
  const learnMatch = hash.match(/^\/learn\/(\d+)$/);
  if (learnMatch) {
    return { route: '/learn/:id', params: { id: parseInt(learnMatch[1]) } };
  }
  return { route: hash, params: {} };
}

function updateNav(activeNav) {
  navItems.forEach(item => {
    if (item.dataset.page === activeNav) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

async function navigateTo() {
  const { route, params } = parseHash();
  const routeConfig = routes[route];

  if (!routeConfig) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🔍</div>
        <div class="empty-state__title">페이지를 찾을 수 없습니다</div>
        <div class="empty-state__desc">올바른 경로를 확인해 주세요</div>
      </div>
    `;
    return;
  }

  // Fade out
  container.style.opacity = '0';
  container.style.transform = 'translateY(8px)';

  await new Promise(r => setTimeout(r, 150));

  // Render
  routeConfig.render(container, params);
  updateNav(routeConfig.nav);

  // Scroll to top
  container.scrollTop = 0;
  window.scrollTo(0, 0);

  // Fade in
  requestAnimationFrame(() => {
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  });
}

// Page transition styles
container.style.transition = 'opacity 250ms ease, transform 250ms ease';

// Listen for hash changes
window.addEventListener('hashchange', navigateTo);

// Initial load
navigateTo();
