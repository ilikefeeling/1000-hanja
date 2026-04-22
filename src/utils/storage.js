/* ============================================
   천자문 앱 — Local Storage Utility
   ============================================ */

const STORAGE_KEY = 'hanja-1000';

const defaultState = {
  learned: [],        // phrase IDs that are marked as learned
  bookmarks: [],      // phrase IDs bookmarked
  notes: {},          // { phraseId: "note text" }
  quizScores: {},     // { phraseId: { correct: 0, total: 0 } }
  lastVisited: null,  // last viewed phrase ID
  totalQuizCorrect: 0,
  totalQuizAttempts: 0,
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

export function saveProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save progress:', e);
  }
}

export function toggleLearned(phraseId) {
  const state = loadProgress();
  const idx = state.learned.indexOf(phraseId);
  if (idx > -1) {
    state.learned.splice(idx, 1);
  } else {
    state.learned.push(phraseId);
  }
  saveProgress(state);
  return state;
}

export function toggleBookmark(phraseId) {
  const state = loadProgress();
  const idx = state.bookmarks.indexOf(phraseId);
  if (idx > -1) {
    state.bookmarks.splice(idx, 1);
  } else {
    state.bookmarks.push(phraseId);
  }
  saveProgress(state);
  return state;
}

export function saveNote(phraseId, text) {
  const state = loadProgress();
  if (text.trim()) {
    state.notes[phraseId] = text.trim();
  } else {
    delete state.notes[phraseId];
  }
  saveProgress(state);
  return state;
}

export function recordQuiz(phraseId, isCorrect) {
  const state = loadProgress();
  if (!state.quizScores[phraseId]) {
    state.quizScores[phraseId] = { correct: 0, total: 0 };
  }
  state.quizScores[phraseId].total += 1;
  state.totalQuizAttempts += 1;
  if (isCorrect) {
    state.quizScores[phraseId].correct += 1;
    state.totalQuizCorrect += 1;
  }
  saveProgress(state);
  return state;
}

export function setLastVisited(phraseId) {
  const state = loadProgress();
  state.lastVisited = phraseId;
  saveProgress(state);
  return state;
}

export function resetProgress() {
  saveProgress({ ...defaultState });
  return { ...defaultState };
}
