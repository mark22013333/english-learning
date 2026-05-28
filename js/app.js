// ── State ──
let units = [];
let reviewItems = [];
let mistakes = [];
let currentUnit = null;

// ── Init ──
async function init() {
  try {
    const [unitRes, reviewRes, mistakeRes] = await Promise.all([
      fetch('data/units.json'),
      fetch('data/review-items.json'),
      fetch('data/mistakes.json')
    ]);

    units = await unitRes.json();
    reviewItems = await reviewRes.json();
    mistakes = await mistakeRes.json();

    renderNav();
    route();
    window.addEventListener('hashchange', route);
  } catch (e) {
    document.getElementById('content').innerHTML = '<p>Error loading data. Please check the console.</p>';
    console.error(e);
  }
}

function route() {
  const hash = location.hash.slice(1);
  if (hash && hash.startsWith('unit')) {
    loadUnit(hash);
  } else {
    showHome();
  }
  updateNav();
}

// ── Utilities ──
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isDue(item) {
  return !item.nextReview || item.nextReview <= todayKey();
}

function getUnitMeta(id) {
  return units.find(u => u.id === id);
}

function getDueReviewItems() {
  const due = reviewItems
    .filter(isDue)
    .sort((a, b) => b.difficulty - a.difficulty || a.nextReview.localeCompare(b.nextReview));
  return due.length ? due : reviewItems.slice(0, 4);
}

function getReviewTypeLabel(type) {
  const labels = {
    mistake: '常犯錯',
    vocabulary: '詞彙',
    speaking: '口說',
    pattern: '句型'
  };
  return labels[type] || type;
}

function getTypeIcon(type) {
  const icons = {
    mistake: '⚠',
    vocabulary: 'Aa',
    speaking: '↗',
    pattern: '§'
  };
  return icons[type] || '•';
}

// ── Navigation ──
function updateNav() {
  const hash = location.hash.slice(1);
  document.querySelectorAll('.nav-btn[data-unit]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.unit === hash);
  });
  document.querySelector('.nav-btn[data-unit="home"]')
    ?.classList.toggle('active', !hash || hash === 'home');
}

function renderNav() {
  const nav = document.getElementById('nav');
  let html = '<button class="nav-btn active" data-unit="home" onclick="location.hash=\'\'">Today</button>';
  units.forEach(u => {
    html += `<button class="nav-btn" data-unit="${u.id}" onclick="location.hash='${u.id}'">${u.icon} ${u.title} <span class="level-tag">${u.level}</span></button>`;
  });
  nav.innerHTML = html;
}

// ── Home / Daily Review Dashboard ──
function showHome() {
  currentUnit = null;
  const dueItems = getDueReviewItems();
  const highPriorityMistakes = mistakes.filter(m => m.priority === 'High').slice(0, 3);
  const completedCount = units.filter(u => u.status === 'Completed').length;

  let html = `
    <section class="daily-hero">
      <div>
        <p class="kicker">Daily Review / ${todayKey()}</p>
        <h2>今天先複習最容易忘的英文。</h2>
        <p>從常犯錯開始，再練詞彙、句型與口說。每一題都小小的，但每天都做，英文就不會只在 PDF 裡躺平。</p>
      </div>
      <div class="daily-stats" aria-label="Learning progress">
        <div><strong>${dueItems.length}</strong><span>今日任務</span></div>
        <div><strong>${units.length}</strong><span>學習單元</span></div>
        <div><strong>${completedCount}</strong><span>已完成</span></div>
      </div>
    </section>

    <section class="review-layout">
      <div class="review-main">
        <div class="panel-heading">
          <span>今日複習清單</span>
          <small>依日期與難度排序</small>
        </div>
        <div class="review-list">`;

  dueItems.forEach(item => {
    const unit = getUnitMeta(item.sourceUnit);
    html += `
      <article class="review-card ${item.type}">
        <div class="review-icon">${getTypeIcon(item.type)}</div>
        <div class="review-content">
          <div class="review-meta">
            <span>${getReviewTypeLabel(item.type)}</span>
            <span>${unit ? unit.title : item.sourceUnit}</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.prompt}</p>
          <details>
            <summary>查看提示 / 參考答案</summary>
            <div>${item.answer}</div>
          </details>
          <div class="tag-row">${item.mistakeTags.map(tag => `<span>${tag}</span>`).join('')}</div>
        </div>
      </article>`;
  });

  html += `
        </div>
      </div>
      <aside class="review-side">
        <div class="panel-heading">
          <span>弱點提醒</span>
          <small>練習前先掃過</small>
        </div>`;

  highPriorityMistakes.forEach(mistake => {
    html += `
      <article class="mistake-strip">
        <span>${mistake.chinese}</span>
        <h3>${mistake.title}</h3>
        <p>${mistake.watchFor}</p>
        <div><del>${mistake.wrong}</del><strong>${mistake.better}</strong></div>
      </article>`;
  });

  html += `
      </aside>
    </section>

    <section class="unit-library">
      <div class="panel-heading">
        <span>單元入口</span>
        <small>Markdown 是長期知識庫，網站是每日任務台</small>
      </div>
      <div class="home-grid">`;

  units.forEach(u => {
    html += `
      <div class="unit-card" onclick="location.hash='${u.id}'">
        <div class="icon">${u.icon}</div>
        <div class="info">
          <span class="level">${u.level} · ${u.status || 'Active'}</span>
          <h3>${u.title}</h3>
          <p>${u.description}</p>
        </div>
      </div>`;
  });

  html += '</div></section>';
  document.getElementById('content').innerHTML = html;
}

// ── Unit ──
async function loadUnit(id) {
  const meta = units.find(u => u.id === id);
  if (!meta) { showHome(); return; }

  try {
    const res = await fetch(meta.file);
    const data = await res.json();
    currentUnit = data;
    renderUnit(data, meta);
  } catch (e) {
    document.getElementById('content').innerHTML = '<p>Error loading unit.</p>';
    console.error(e);
  }
}

function renderUnit(unit, meta) {
  const unitReviews = reviewItems.filter(item => item.sourceUnit === unit.id);
  let html = `
    <div class="unit-view">
      <button class="back-btn" onclick="location.hash=''">← Daily Review</button>
      <div class="unit-header">
        <h2>${unit.icon} ${unit.title}</h2>
        <div class="meta">Level ${unit.level} · ${unit.sections.length} sections · ${meta.status || 'Active'}</div>
        ${meta.notes ? `<a class="notes-link" href="${meta.notes}">Open Markdown notes</a>` : ''}
      </div>`;

  if (unitReviews.length) {
    html += '<div class="unit-review-strip">';
    unitReviews.forEach(item => {
      html += `<button onclick="location.hash=''">${getReviewTypeLabel(item.type)} · ${item.title}</button>`;
    });
    html += '</div>';
  }

  unit.sections.forEach((section, si) => {
    html += renderSection(section, si);
  });

  html += '</div>';
  document.getElementById('content').innerHTML = html;
}

function renderSection(section, si) {
  const body = renderSectionBody(section, si);
  return `
    <div class="section" id="section-${si}">
      <div class="section-header" onclick="toggleSection(${si})">
        <h3>${section.title}</h3>
        <span class="toggle open" id="toggle-${si}">▾</span>
      </div>
      ${section.subtitle ? `<p class="section-subtitle">${section.subtitle}</p>` : ''}
      <div class="section-body" id="body-${si}">${body}</div>
    </div>`;
}

function toggleSection(si) {
  const body = document.getElementById(`body-${si}`);
  const toggle = document.getElementById(`toggle-${si}`);
  body.classList.toggle('collapsed');
  toggle.classList.toggle('open');
}

// ── Section Renderers ──
function renderSectionBody(section, si) {
  switch (section.type) {
    case 'vocabulary': return renderVocab(section, si);
    case 'practice': return renderPractice(section, si);
    case 'fill_blank': return renderFillBlank(section, si);
    case 'qa': return renderQA(section, si);
    case 'roleplay': return renderRoleplay(section);
    case 'tips': return renderTips(section);
    case 'notes': return renderNotes(section);
    case 'phrases': return renderPhrases(section);
    case 'grammar': return renderGrammar(section);
    case 'conversation': return renderConversation(section);
    case 'reading': return renderReading(section, si);
    default: return '<p>Unknown section type</p>';
  }
}

function renderVocab(section, si) {
  let html = `
    <div class="section-controls">
      <button class="ctrl-btn" onclick="toggleVocabCol(${si},'chinese')">Toggle 中文</button>
      <button class="ctrl-btn" onclick="toggleVocabCol(${si},'example')">Toggle Examples</button>
    </div>
    <table class="vocab-table" id="vocab-${si}">
      <thead><tr><th>Word</th><th class="col-chinese">中文</th><th class="col-example">Example</th></tr></thead>
      <tbody>`;
  section.items.forEach(item => {
    html += `<tr>
      <td class="vocab-word">${item.word}</td>
      <td class="vocab-chinese col-chinese">${item.chinese}</td>
      <td class="vocab-example col-example">${item.example}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  return html;
}

function toggleVocabCol(si, col) {
  const table = document.getElementById(`vocab-${si}`);
  table.querySelectorAll(`.col-${col}`).forEach(el => {
    if (el.style.filter === 'blur(5px)') {
      el.style.filter = '';
      el.style.userSelect = '';
    } else {
      el.style.filter = 'blur(5px)';
      el.style.userSelect = 'none';
    }
  });
}

function renderPractice(section, si) {
  let html = `
    <div class="section-controls">
      <button class="ctrl-btn" onclick="togglePracticeMode(${si})">Practice Mode (Hide Lines)</button>
    </div>`;
  section.exercises.forEach((ex, ei) => {
    html += `<div class="practice-group" data-practice="${si}">
      <div class="practice-label">${ex.label}</div>
      <div class="practice-lines">`;
    ex.lines.forEach((line, li) => {
      html += `<div class="practice-line" onclick="this.classList.toggle('revealed')">
        <span class="line-number">${li + 1}</span>
        <span class="line-text">${line}</span>
      </div>`;
    });
    html += '</div></div>';
  });
  return html;
}

function togglePracticeMode(si) {
  const groups = document.querySelectorAll(`[data-practice="${si}"] .practice-line`);
  const isHidden = groups[0]?.classList.contains('hidden-text');
  groups.forEach(el => {
    if (isHidden) {
      el.classList.remove('hidden-text');
      el.classList.remove('revealed');
    } else {
      el.classList.add('hidden-text');
      el.classList.remove('revealed');
    }
  });
}

function renderFillBlank(section, si) {
  let html = `
    <div class="section-controls">
      <button class="ctrl-btn" onclick="toggleAllAnswers(${si})">Show/Hide All Answers</button>
    </div>`;
  section.items.forEach(item => {
    html += `<div class="fill-item" data-fill="${si}">
      <div class="fill-prompt">${item.prompt}</div>
      <div class="fill-template">${item.template}</div>
      <div class="fill-answer hidden" onclick="this.classList.toggle('hidden')">${item.answer}</div>
    </div>`;
  });
  return html;
}

function toggleAllAnswers(si) {
  const answers = document.querySelectorAll(`[data-fill="${si}"] .fill-answer`);
  const allVisible = ![...answers].some(a => a.classList.contains('hidden'));
  answers.forEach(a => {
    if (allVisible) a.classList.add('hidden');
    else a.classList.remove('hidden');
  });
}

function renderQA(section, si) {
  let html = '';
  section.items.forEach(item => {
    html += `<div class="qa-item">
      <div class="qa-question">${item.question}</div>
      <div class="qa-hint hidden" onclick="this.classList.toggle('hidden')">${item.hint}</div>
    </div>`;
  });
  return html;
}

function renderRoleplay(section) {
  let html = '';
  section.scenarios.forEach(sc => {
    html += `<div class="scenario-name">🎭 ${sc.name}</div>
    <div class="dialogue">`;
    sc.dialogue.forEach(d => {
      const cls = d.speaker.toLowerCase() === 'b' || d.speaker === 'Mark' ? 'b' : '';
      html += `<div class="dialogue-line">
        <span class="speaker ${cls}">${d.speaker}:</span>
        <span>${d.line}</span>
      </div>`;
    });
    html += '</div>';
  });
  return html;
}

function renderTips(section) {
  let html = '';
  section.items.forEach(item => {
    html += `<div class="tip-card">
      <div>
        <div class="tip-phrase">${item.phrase}</div>
        <div class="tip-chinese">${item.chinese}</div>
      </div>
      <div class="tip-example">${item.example}</div>
    </div>`;
  });
  return html;
}

function renderNotes(section) {
  let html = '';
  section.items.forEach(item => {
    html += `<div class="note-card">
      <div class="note-point">${item.point}</div>
      <div class="note-detail">${item.detail}</div>
      ${item.chinese ? `<div class="note-chinese">${item.chinese}</div>` : ''}
    </div>`;
  });
  return html;
}

function renderPhrases(section) {
  let html = '';
  section.items.forEach(item => {
    html += `<div class="phrase-card">
      <div class="phrase-main">${item.phrase}</div>
      ${item.question ? `<div class="phrase-question">Q: ${item.question}</div>` : ''}
      <div class="phrase-example">→ ${item.example}</div>
    </div>`;
  });
  return html;
}

function renderGrammar(section) {
  let html = '';
  section.items.forEach(item => {
    html += `<div class="grammar-card">
      <div class="grammar-rule">${item.rule}</div>
      <div class="grammar-usage">${item.usage}</div>
      <div class="grammar-examples">`;
    item.examples.forEach(ex => {
      if (ex.length < 30 && !ex.includes(' ')) {
        html += `<span class="grammar-example-tag">${ex}</span>`;
      } else {
        html += `<div class="grammar-example-sentence">${ex}</div>`;
      }
    });
    html += '</div></div>';
  });
  return html;
}

function renderConversation(section) {
  let html = '';
  section.items.forEach(item => {
    html += `<div class="convo-card">
      <div class="convo-question">${item.question}</div>`;
    item.answers.forEach(a => {
      html += `<div class="convo-answer">${a}</div>`;
    });
    html += '</div>';
  });
  return html;
}

function renderReading(section, si) {
  let html = '<div style="margin-bottom:20px">';
  section.paragraphs.forEach(para => {
    html += `<div class="reading-para">
      <div class="reading-text">${para.text}</div>
      <div class="reading-vocab">`;
    para.key_vocab.forEach(v => {
      html += `<span class="reading-vocab-tag">${v}</span>`;
    });
    html += '</div></div>';
  });
  html += '</div>';

  if (section.comprehension) {
    html += '<h4 style="margin:16px 0 10px; font-family: var(--font-heading);">Comprehension Questions</h4>';
    section.comprehension.forEach(item => {
      html += `<div class="comprehension-item">
        <div class="comprehension-q">${item.question}</div>
        <div class="comprehension-a hidden" onclick="this.classList.toggle('hidden')">${item.answer}</div>
      </div>`;
    });
  }
  return html;
}

// ── Start ──
document.addEventListener('DOMContentLoaded', init);
