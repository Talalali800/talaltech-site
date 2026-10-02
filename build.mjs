// Builds every page of tech.thequreshico.ca from content/ into the repo root,
// which GitHub Pages serves as-is. The header, menu and footer live here once.
//
//   node build.mjs
//
// No dependencies. Commit the generated .html files along with the sources.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { apps } from './content/apps.mjs';

const SITE = 'https://tech.thequreshico.ca';
const COMPANY = 'The Qureshi Co.';
const EMAIL = 'contact@thequreshico.ca';
const YEAR = new Date().getFullYear();

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const icons = {
  chev: '<svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  faq: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17.2" r="1.2" fill="currentColor"/></svg>',
  howto: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 12l2.5 2.5 4.5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  bug: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v13M5 13h14M7 8a5 5 0 0 1 10 0v6a5 5 0 0 1-10 0V8zM9 4l1.5 2M15 4l-1.5 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  // Generic glyphs — not the stores' trademarked badges.
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5v17a.8.8 0 0 0 1.2.7l14-8.5a.8.8 0 0 0 0-1.4l-14-8.5A.8.8 0 0 0 6 3.5z" fill="currentColor"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10.5 18.5h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};

function appIcon(app, size = '') {
  if (app.icon) return `<img class="app-icon ${size}" src="${app.icon}" alt="" width="96" height="96">`;
  return `<span class="app-icon mono ${size}" aria-hidden="true">${esc(app.monogram)}</span>`;
}

function header(active) {
  const appsMenu = apps
    .map((a) => `<li><a href="/${a.slug}/">${appIcon(a)}<div><strong>${esc(a.name)}</strong><span>${esc(a.tagline)}</span></div></a></li>`)
    .join('');
  const cur = (k) => (active === k ? ' aria-current="page"' : '');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="/" aria-label="${COMPANY} Tech — home">
      <span class="brand-mark" aria-hidden="true">Q</span>
      <span class="brand-name">${COMPANY}</span><span class="brand-tag">Tech</span>
    </a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">${icons.menu}</button>
    <nav id="site-nav" class="nav" aria-label="Main">
      <a href="/"${cur('home')}>Home</a>
      <div class="drop">
        <button class="drop-btn${active === 'apps' ? ' is-current' : ''}" aria-expanded="false" aria-controls="apps-menu">Apps ${icons.chev}</button>
        <ul id="apps-menu" class="drop-menu">${appsMenu}</ul>
      </div>
      <a href="/about/"${cur('about')}>About</a>
      <a href="/contact/"${cur('contact')}>Contact</a>
    </nav>
  </div>
</header>`;
}

function footer() {
  const appLinks = apps.map((a) => `<li><a href="/${a.slug}/">${esc(a.name)}</a></li>`).join('');
  const policyLinks = apps
    .map((a) => `<li><a href="/${a.slug}/${a.policy ? 'privacy/' : '#privacy'}">${esc(a.name)}</a></li>`)
    .join('');
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="brand" href="/"><span class="brand-mark" aria-hidden="true">Q</span><span class="brand-name">${COMPANY}</span><span class="brand-tag">Tech</span></a>
        <p>Thoughtful apps that respect your time and your privacy.</p>
      </div>
      <div><h4>Apps</h4><ul>${appLinks}</ul></div>
      <div><h4>Company</h4><ul><li><a href="/">Home</a></li><li><a href="/about/">About</a></li><li><a href="/contact/">Contact</a></li></ul></div>
      <div><h4>Privacy</h4><ul>${policyLinks}</ul></div>
    </div>
    <div class="foot-bottom"><span>© ${YEAR} ${COMPANY} All rights reserved.</span><a href="mailto:${EMAIL}">${EMAIL}</a></div>
  </div>
</footer>`;
}

function page({ path, title, description, active, body }) {
  const full = title ? `${title} — ${COMPANY}` : `${COMPANY} Tech`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE}${path}">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE}${path}">
<meta name="theme-color" content="#0f1d3a">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css">
</head>
<body>
${header(active)}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/site.js"></script>
</body>
</html>
`;
}

function write(path, html) {
  const file = path.endsWith('/') ? `.${path}index.html` : `.${path}`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log('wrote', file);
}

// ---------- Home ----------
const appCards = apps
  .map(
    (a) => `<a class="card app-card" href="/${a.slug}/">
      ${appIcon(a)}
      <div><h3>${esc(a.name)}</h3></div>
      <p>${esc(a.summary)}</p>
      <span class="pill">${esc(a.platforms)}</span>
      <span class="more">Learn more →</span>
    </a>`
  )
  .join('');

write('/', page({
  path: '/',
  title: '',
  active: 'home',
  description: 'The Qureshi Co. builds thoughtful apps — Calamus3, AdaptivePlanner and Granteez — that respect your time and your privacy.',
  body: `<section class="hero">
  <div class="wrap hero-grid">
    <div>
    <p class="eyebrow">${COMPANY} · Tech</p>
    <h1>Thoughtful apps for everyday life.</h1>
    <p class="lead">We build software that respects your time and keeps your information where it belongs — private messaging, a planner that adapts to your day, and grant funding for nonprofits.</p>
    <div class="btn-row">
      <a class="btn btn-primary" href="#apps">Explore our apps</a>
      <a class="btn btn-ghost" href="/contact/">Contact us</a>
    </div>
    </div>
    <div class="hero-art" aria-hidden="true">${apps.map((a) => `<div class="hero-chip">${appIcon(a)}<div><strong>${esc(a.name)}</strong><span>${esc(a.tagline)}</span></div></div>`).join('')}</div>
  </div>
</section>

<section class="section" id="apps">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Our apps</p>
      <h2>Built to be useful, and private by design.</h2>
      <p>Each app does one job well. None of them sell your data.</p>
    </div>
    <div class="grid">${appCards}</div>
  </div>
</section>

<section class="section alt">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">How we work</p>
      <h2>Three promises behind every app.</h2>
    </div>
    <div class="grid">
      <div class="card"><p class="value-num">01</p><h3>Privacy first</h3><p>We collect only what an app needs to work, and we explain it plainly in each privacy policy.</p></div>
      <div class="card"><p class="value-num">02</p><h3>No selling your data</h3><p>We never sell, rent or trade your personal information, or share it for advertising.</p></div>
      <div class="card"><p class="value-num">03</p><h3>You stay in control</h3><p>Every app lets you delete your account and your data yourself, at any time.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="cta-band">
      <div><h2>Questions or feedback?</h2><p>We read every message and aim to reply within a few days.</p></div>
      <a class="btn btn-primary" href="/contact/">Get in touch</a>
    </div>
  </div>
</section>`,
}));

// ---------- About ----------
write('/about/', page({
  path: '/about/',
  title: 'About',
  active: 'about',
  description: 'About The Qureshi Co. and the apps we make.',
  body: `<section class="page-head">
  <div class="wrap">
    <p class="crumbs"><a href="/">Home</a> / About</p>
    <h1>About us</h1>
    <p>${COMPANY} is a small Canadian software studio. We build apps for people and organizations who want tools that work well and treat their information with care.</p>
  </div>
</section>
<section class="section">
  <div class="wrap prose">
    <h2>What we make</h2>
    <p>We focus on a few apps and try to do each one properly:</p>
    <ul>
      ${apps.map((a) => `<li><a href="/${a.slug}/"><strong>${esc(a.name)}</strong></a> — ${esc(a.summary)}</li>`).join('\n      ')}
    </ul>
    <h2>How we think about privacy</h2>
    <p>Privacy is not a feature we add at the end. In Calamus3, messages are end-to-end encrypted and stored on your phone, so we could not read them even if asked. AdaptivePlanner reads your calendars on your phone and never uploads them. Granteez encrypts every organization’s documents separately.</p>
    <p>Across all our apps, we do not sell personal information, we explain what we collect in plain language, and you can delete your data from inside the app.</p>
    <h2>Get in touch</h2>
    <p>Have a question, an idea or a problem to report? Email us at <a href="mailto:${EMAIL}">${EMAIL}</a> or visit the <a href="/contact/">contact page</a>.</p>
  </div>
</section>`,
}));

// ---------- Contact ----------
write('/contact/', page({
  path: '/contact/',
  title: 'Contact',
  active: 'contact',
  description: 'Contact The Qureshi Co. about Calamus3, AdaptivePlanner or Granteez.',
  body: `<section class="page-head">
  <div class="wrap">
    <p class="crumbs"><a href="/">Home</a> / Contact</p>
    <h1>Contact us</h1>
    <p>Questions, feedback, privacy requests or a problem with one of our apps — we’d like to hear from you.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="grid">
      <div class="card contact-card"><span class="ico">${icons.mail}</span><div><h3>Email</h3><p><a class="big-mail" href="mailto:${EMAIL}">${EMAIL}</a></p><p>Please tell us which app your message is about.</p></div></div>
      <div class="card contact-card"><span class="ico">${icons.bug}</span><div><h3>Report a problem</h3><p>The fastest way is from inside the app: open <strong>Settings → Help &amp; Support</strong>. It fills in the details we need to help.</p></div></div>
      <div class="card contact-card"><span class="ico">${icons.clock}</span><div><h3>Privacy requests</h3><p>To ask about or request a copy of your data, email us. We aim to reply within 30 days.</p></div></div>
    </div>
  </div>
</section>`,
}));

// ---------- App pages ----------
function storeButton(kind, store) {
  const label = kind === 'play'
    ? { small: 'Get it on', big: 'Google Play', icon: icons.play }
    : { small: 'Download on the', big: 'App Store', icon: icons.phone };
  if (store?.url) {
    return `<a class="store-btn" href="${store.url}" rel="noopener">${label.icon}<span><small>${label.small}</small><strong>${label.big}</strong></span></a>`;
  }
  const soon = store?.note || 'Coming soon';
  return `<span class="store-btn is-soon" aria-disabled="true">${label.icon}<span><small>${esc(soon)}</small><strong>${label.big}</strong></span></span>`;
}

function readPolicy(app) {
  return app.policy ? readFileSync(`content/policies/${app.policy}`, 'utf8') : null;
}

for (const app of apps) {
  const policy = readPolicy(app);
  const faqs = app.faqs
    .map(([q, a]) => `<details class="faq"><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`)
    .join('\n');
  const steps = app.howTo.map(([t, d]) => `<li><strong>${esc(t)}</strong><span>${esc(d)}</span></li>`).join('\n');
  const features = app.features.map(([t, d]) => `<li><strong>${esc(t)}</strong><span>${esc(d)}</span></li>`).join('');
  const policyBody = policy
    ? `<div class="policy">${policy}</div><a class="policy-link" href="/${app.slug}/privacy/">Open the privacy policy on its own page →</a>`
    : `<div class="policy"><p>${esc(app.name)}’s privacy policy will be published here before it launches. Until then, if you have a question about how your information would be handled, email <a href="mailto:${EMAIL}">${EMAIL}</a>.</p></div>`;

  write(`/${app.slug}/`, page({
    path: `/${app.slug}/`,
    title: app.name,
    active: 'apps',
    description: `${app.name}: ${app.tagline} ${app.summary}`,
    body: `<section class="page-head">
  <div class="wrap">
    <p class="crumbs"><a href="/">Home</a> / <a href="/#apps">Apps</a> / ${esc(app.name)}</p>
    <div class="app-hero">
      ${appIcon(app, 'lg')}
      <div>
        <h1>${esc(app.name)}</h1>
        <p class="tagline">${esc(app.tagline)}</p>
        <span class="pill">${esc(app.platforms)}</span>
      </div>
    </div>
    <div class="stores">${storeButton('play', app.stores.play)}${storeButton('appStore', app.stores.appStore)}</div>
    ${app.storeNote ? `<p class="store-note">${esc(app.storeNote)}</p>` : ''}
    <ul class="features">${features}</ul>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="accordion">
      <details class="panel" id="faq">
        <summary><span class="ico">${icons.faq}</span><span>FAQs<span class="sub">Answers to common questions</span></span>${icons.chev}</summary>
        <div class="panel-body">${faqs}</div>
      </details>
      <details class="panel" id="how-to">
        <summary><span class="ico">${icons.howto}</span><span>How to use ${esc(app.name)}<span class="sub">Get started in a few steps</span></span>${icons.chev}</summary>
        <div class="panel-body"><ol class="steps">${steps}</ol></div>
      </details>
      <details class="panel" id="privacy">
        <summary><span class="ico">${icons.shield}</span><span>Privacy Policy<span class="sub">${esc(app.policyUpdated || 'Coming before launch')}</span></span>${icons.chev}</summary>
        <div class="panel-body">${policyBody}</div>
      </details>
    </div>
  </div>
</section>`,
  }));

  // A plain page per policy, for store listings (Google Play asks for a URL
  // that shows the policy directly, not one hidden behind a click).
  if (policy) {
    write(`/${app.slug}/privacy/`, page({
      path: `/${app.slug}/privacy/`,
      title: `${app.name} Privacy Policy`,
      active: 'apps',
      description: `Privacy policy for ${app.name}.`,
      body: `<section class="page-head">
  <div class="wrap">
    <p class="crumbs"><a href="/">Home</a> / <a href="/${app.slug}/">${esc(app.name)}</a> / Privacy Policy</p>
    <h1>${esc(app.name)} Privacy Policy</h1>
  </div>
</section>
<section class="section">
  <div class="wrap prose policy">${policy}</div>
</section>`,
    }));
  }
}

// ---------- 404 ----------
write('/404.html', page({
  path: '/404.html',
  title: 'Page not found',
  active: '',
  description: 'That page does not exist.',
  body: `<section class="page-head"><div class="wrap"><h1>Page not found</h1><p>That page doesn’t exist. Try the <a href="/">home page</a> or one of our apps from the menu.</p></div></section>`,
}));

writeFileSync('CNAME', 'tech.thequreshico.ca\n');
console.log('wrote ./CNAME');
