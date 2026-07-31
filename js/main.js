document.getElementById('year').textContent = new Date().getFullYear();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});
// Close the menu after tapping a link (mobile)
navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- load content & render ---------- */
async function loadContent() {
  const res = await fetch('content/data.json');
  const data = await res.json();

  // Nav + footer name
  const siteName = document.title.split(' —')[0];
  document.getElementById('nav-brand').textContent = siteName;
  document.getElementById('footer-name').textContent = siteName;

  // Hero
  document.getElementById('hero-kicker').append(document.createTextNode(data.hero.kicker));
  document.getElementById('hero-headline').innerHTML =
    `${data.hero.headline_line1}<br><span>${data.hero.headline_highlight}</span>`;
  document.getElementById('hero-tagline').textContent = data.hero.tagline;

  const ctaPrimary = document.getElementById('cta-primary');
  ctaPrimary.textContent = data.hero.cta_primary_label;
  ctaPrimary.href = data.hero.cta_primary_link;

  const ctaSecondary = document.getElementById('cta-secondary');
  ctaSecondary.textContent = data.hero.cta_secondary_label;
  ctaSecondary.href = data.hero.cta_secondary_link;

  // Stats
  const statsWrap = document.getElementById('stats');
  data.stats.forEach(s => {
    const el = document.createElement('div');
    el.className = 'stat';
    el.innerHTML = `<div class="num" data-count="${s.value}" data-suffix="${s.suffix}">0</div><div class="lbl">${s.label}</div>`;
    statsWrap.appendChild(el);
  });

  // About
  document.getElementById('about-heading').textContent = data.about.heading;
  document.getElementById('about-body').textContent = data.about.body;

  // Experience timeline
  const timeline = document.getElementById('timeline');
  data.experience.forEach(job => {
    const item = document.createElement('div');
    item.className = 't-item';
    item.innerHTML = `
      <div class="t-head"><span class="t-role">${job.role}</span><span class="t-period">${job.period}</span></div>
      <div class="t-company">${job.company}</div>
      <ul>${job.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
    `;
    timeline.appendChild(item);
  });

  // Skills
  const skillsWrap = document.getElementById('skills-wrap');
  data.skill_categories.forEach(cat => {
    const block = document.createElement('div');
    block.className = 'skill-cat';
    block.innerHTML = `
      <p class="skill-cat-name">${cat.name}</p>
      <div class="skill-pills">${cat.skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}</div>
    `;
    skillsWrap.appendChild(block);
  });

  // Projects
  const projGrid = document.getElementById('proj-grid');
  data.projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'proj-card';
    card.dataset.cat = p.source;
    const srcClass = p.source === 'upwork' ? 'src-upwork' : 'src-work';
    const srcLabel = p.source === 'upwork' ? 'Upwork' : 'Employment';
    const img = p.image ? `<img class="proj-img" src="${p.image}" alt="${p.title}" loading="lazy">` : '';
    card.innerHTML = `
      ${img}
      <div class="proj-body">
        <span class="proj-src ${srcClass}">${srcLabel}</span>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
      </div>
    `;
    projGrid.appendChild(card);
  });

  // Education / Languages
  document.getElementById('edu-degree').innerHTML = `<strong>${data.education.degree}</strong>`;
  document.getElementById('edu-school').textContent = data.education.school;
  document.getElementById('edu-note').textContent = data.education.note;

  const langList = document.getElementById('lang-list');
  data.languages.forEach(l => {
    const row = document.createElement('div');
    row.className = 'lang-row';
    row.innerHTML = `<span>${l.name}</span><span>${l.level}</span>`;
    langList.appendChild(row);
  });

  // Contact
  document.getElementById('contact-heading').textContent = data.contact.heading;
  document.getElementById('contact-body').textContent = data.contact.body;
  const contactLinks = document.getElementById('contact-links');
  contactLinks.innerHTML = `
    <a href="mailto:${data.contact.email}">Email</a>
  
    <a href="${data.contact.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
    <a href="${data.contact.github}" target="_blank" rel="noopener">GitHub</a>
  `;

  buildDiagram();
  initScrollEffects();
  initProjectFilters();
}

/* ---------- network diagram ---------- */
function buildDiagram() {
  const svgNS = "http://www.w3.org/2000/svg";
  const hub = {x:380, y:110};
  const labels = ["AWS","DOCKER","K8S","TERRAFORM","ANSIBLE","PROMETHEUS"];
  const radiusX = 320, radiusY = 85;
  const nodeGroup = document.getElementById('nodes');
  const edgeGroup = document.getElementById('edges');
  const pulseGroup = document.getElementById('pulses');

  labels.forEach((label, i) => {
    const angle = (i / labels.length) * Math.PI * 2 - Math.PI/2;
    const x = hub.x + Math.cos(angle) * radiusX * 0.62;
    const y = hub.y + Math.sin(angle) * radiusY * 1.05;
    const clampedX = Math.max(46, Math.min(714, x));

    const edge = document.createElementNS(svgNS, 'path');
    const d = `M ${hub.x} ${hub.y} Q ${(hub.x+clampedX)/2} ${y}, ${clampedX} ${y}`;
    edge.setAttribute('d', d);
    edge.setAttribute('class', 'edge');
    edgeGroup.appendChild(edge);

    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', clampedX);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', 26);
    circle.setAttribute('class', 'node-circle');
    nodeGroup.appendChild(circle);

    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', clampedX);
    text.setAttribute('y', y + 4);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'node-label');
    text.textContent = label;
    nodeGroup.appendChild(text);

    if (!reduceMotion) {
      const pulse = document.createElementNS(svgNS, 'circle');
      pulse.setAttribute('r', 3);
      pulse.setAttribute('class', 'pulse');
      const motion = document.createElementNS(svgNS, 'animateMotion');
      motion.setAttribute('dur', (3 + i * 0.4).toFixed(1) + 's');
      motion.setAttribute('repeatCount', 'indefinite');
      motion.setAttribute('path', d);
      motion.setAttribute('begin', (i * 0.3).toFixed(1) + 's');
      pulse.appendChild(motion);
      pulseGroup.appendChild(pulse);
    }
  });
}

/* ---------- scroll reveal + count-up ---------- */
function initScrollEffects() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold:.12});
  document.querySelectorAll('.fade').forEach(el => revealObserver.observe(el));
  revealObserver.observe(document.getElementById('timeline'));

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = reduceMotion ? 0 : 1100;
      const start = performance.now();
      function tick(now){
        const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, {threshold:.5});
  document.querySelectorAll('.num').forEach(el => countObserver.observe(el));
}

/* ---------- project filter tabs ---------- */
function initProjectFilters() {
  const tabs = document.querySelectorAll('.proj-tab');
  const cards = document.querySelectorAll('#proj-grid .proj-card');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cards.forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.cat === filter) ? '' : 'none';
      });
    });
  });
}

loadContent().catch(err => {
  console.error('Failed to load content:', err);
});
