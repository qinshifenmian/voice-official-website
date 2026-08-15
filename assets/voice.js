
// ---------- header ----------
const siteHeader = document.getElementById('siteHeader');
addEventListener('scroll', () => siteHeader.classList.toggle('is-scrolled', scrollY > 30), { passive: true });

const navToggle = document.getElementById('navToggle');
const navPanel = document.getElementById('navPanel');
navToggle.addEventListener('click', () => {
  const open = navPanel.classList.toggle('open');
  siteHeader.classList.toggle('nav-open', open);
});
navPanel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navPanel.classList.remove('open');
  siteHeader.classList.remove('nav-open');
}));

// ---------- reveal + counters ----------
const srBlocks = [...document.querySelectorAll('.section-scroll-reveal')];
const counters = [...document.querySelectorAll('.counter')];
const doneSet = new Set();
const countedSet = new Set();

function animateCounter(el) {
  const target = +el.dataset.count, dur = 1400, t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function checkReveals() {
  const vh = window.innerHeight;
  srBlocks.forEach(block => {
    if (doneSet.has(block)) return;
    const r = block.getBoundingClientRect();
    if (r.top < vh - 40) {
      doneSet.add(block);
      block.classList.add('revealed');
      block.querySelectorAll('.counter').forEach(c => {
        if (!countedSet.has(c)) { countedSet.add(c); animateCounter(c); }
      });
    }
  });
  counters.forEach(c => {
    if (countedSet.has(c)) return;
    const r = c.getBoundingClientRect();
    if (r.top < vh - 40) {
      countedSet.add(c);
      animateCounter(c);
    }
  });
}
addEventListener('scroll', checkReveals, { passive: true });
addEventListener('resize', checkReveals);
setInterval(checkReveals, 700);
checkReveals();

// ---------- demo form ----------
document.getElementById('demoForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('demoForm').style.display = 'none';
  document.getElementById('formOk').style.display = 'block';
});

