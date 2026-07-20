/* ============================================================
   KNUCKLEHEAD PROMOTIONS — script.js
   ============================================================ */

/* --- Barbed wire SVG builder --- */
function buildBarbedWire(svgEl, strokeColor) {
  const W = 1400;
  const H = 24;
  const spacing = 70;
  const barbSize = 6;

  svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svgEl.setAttribute('preserveAspectRatio', 'none');
  svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', 0);
  line.setAttribute('y1', H / 2);
  line.setAttribute('x2', W);
  line.setAttribute('y2', H / 2);
  line.setAttribute('stroke', strokeColor);
  line.setAttribute('stroke-width', '1.5');
  svgEl.appendChild(line);

  for (let x = spacing; x < W; x += spacing) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const cy = H / 2;

    const l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l1.setAttribute('x1', x - barbSize); l1.setAttribute('y1', cy - barbSize);
    l1.setAttribute('x2', x + barbSize); l1.setAttribute('y2', cy + barbSize);
    l1.setAttribute('stroke', strokeColor); l1.setAttribute('stroke-width', '1.5');

    const l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l2.setAttribute('x1', x + barbSize); l2.setAttribute('y1', cy - barbSize);
    l2.setAttribute('x2', x - barbSize); l2.setAttribute('y2', cy + barbSize);
    l2.setAttribute('stroke', strokeColor); l2.setAttribute('stroke-width', '1.5');

    g.appendChild(l1);
    g.appendChild(l2);
    svgEl.appendChild(g);
  }
}

document.querySelectorAll('.barbed-wire').forEach(svg => {
  const onYellow = svg.classList.contains('on-yellow');
  buildBarbedWire(svg, onYellow ? '#111111' : '#5A5A5A');
});

/* --- Mobile nav toggle --- */
const navToggle = document.getElementById('nav-toggle');
const navMobile = document.getElementById('nav-mobile');

if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    navToggle.textContent = navMobile.classList.contains('open') ? '✕' : '☰';
  });

  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('open');
      navToggle.textContent = '☰';
    });
  });
}

/* --- Nav scroll highlight --- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 80) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--yellow)' : '';
  });
}, { passive: true });

/* --- Gallery filter tabs --- */
const filterTabs = document.querySelectorAll('.filter-tab');
const galleryItems = document.querySelectorAll('.gallery-item');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const cat = tab.dataset.cat;
    galleryItems.forEach(item => {
      if (cat === 'all' || item.dataset.cat === cat) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

/* --- Pricing tabs --- */
const pricingTabs = document.querySelectorAll('.pricing-tab');
const pricingPanels = document.querySelectorAll('.pricing-panel');

pricingTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    pricingTabs.forEach(t => t.classList.remove('active'));
    pricingPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.panel).classList.add('active');
  });
});

/* --- Contact form --- */
const contactForm = document.getElementById('contact-form');
const CONTACT_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw_LzBleUaya5GAqO_2AkBX90HyIGxtDFH3ZF80bUYk2IBpdGj_AatQAGyCrvOaLkEkPg/exec';

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-submit');
    const formData = new FormData(contactForm);

    // Google Apps Script web apps don't return CORS headers, so the response
    // is opaque (mode: 'no-cors'). We can't read success/failure from it —
    // fire the request and optimistically confirm to the user.
    fetch(CONTACT_FORM_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    }).catch(() => {
      /* Network errors are swallowed here for the same reason — no readable response either way. */
    });

    btn.textContent = 'Message sent.';
    btn.disabled = true;
    btn.style.background = '#1a1a1a';
    btn.style.borderColor = '#1a1a1a';
    btn.style.color = 'var(--yellow)';
    contactForm.reset();
  });
}
