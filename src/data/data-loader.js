/* 천자문 250구절 데이터 로더 — 분할 JSON 병합 */
import p1 from './phrases.json';
import p2 from './phrases-051-100.json';
import p3 from './phrases-101-150.json';
import p4 from './phrases-151-200.json';
import p5 from './phrases-201-250.json';

const allPhrases = [...p1, ...p2, ...p3, ...p4, ...p5];
export default allPhrases;
