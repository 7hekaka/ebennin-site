// Shared helpers for Ernest Bernin site
// - Loads content from data/data.json when hosted
// - Falls back to embedded defaultData when opened via file://

// NOTE: Keep this defaultData aligned with the CMS schema in /admin/config.yml
const defaultData = {
  heroTitle: 'Ernest Bernin',
  heroSubtitle: 'PhD Candidate in Chemistry',
  tagline: 'Research • Teaching • Outreach',

  // About
  aboutShort:
    'Ernest Bernin is a doctoral candidate in chemistry at [University Name], exploring cutting-edge research in synthetic organic chemistry and catalysis.',
  aboutLong:
    'Ernest Bernin is a doctoral candidate in chemistry at [University Name], exploring cutting-edge research in synthetic organic chemistry and catalysis. His work focuses on developing novel molecules and understanding the reaction mechanisms that drive complex transformations. With a passion for discovery and a commitment to education, Ernest strives to advance scientific understanding and share his findings with the community.\n\nOutside the lab, Ernest mentors junior researchers and contributes to outreach efforts that help make chemistry more accessible to students and the public.',

  // Research (cards)
  research: [
    {
      title: 'Synthetic Organic Chemistry',
      description:
        'Designing new reaction pathways and building complex molecules efficiently and selectively.',
      image: ''
    },
    {
      title: 'Catalysis & Mechanisms',
      description:
        'Developing catalytic methods and probing mechanisms using kinetics and spectroscopy.',
      image: ''
    },
    {
      title: 'Computational Chemistry',
      description:
        'Using modeling to interpret experiments, predict reactivity, and guide molecular design.',
      image: ''
    }
  ],

  // Publications (cards)
  publications: [
    {
      title: 'Title 1',
      journal: 'Journal Name',
      year: '2024',
      link: '',
      image: ''
    },
    {
      title: 'Title 2',
      journal: 'Journal Name',
      year: '2025',
      link: '',
      image: ''
    }
  ],
  publicationsNote:
    'For a full list of publications, please see my CV or contact me directly.',

  // Projects (cards)
  projects: [
    {
      title: 'Project Title 1',
      description:
        'A brief description of a notable research project or award. Explain the goals, your contribution, and the outcomes or recognition received.',
      image: ''
    },
    {
      title: 'Project Title 2',
      description: 'A brief description of another significant project or scholarly achievement.',
      image: ''
    }
  ],

  // Contact
  contactEmail: 'ernest.bernin@example.com',
  contactLinkedIn: 'https://www.linkedin.com/in/ernestbernin',
  contactLocation: 'Knoxville, TN (or your city)',
  contactAvailability: 'Open to collaborations and speaking opportunities.',
  cvFile: ''
};

async function loadSiteData() {
  try {
    // Try common relative paths depending on whether we're on /index.html or /about.html etc.
    const candidates = ['data/data.json', '../data/data.json'];
    let lastErr = null;
    for (const path of candidates) {
      try {
        const res = await fetch(path, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Failed to load ' + path);
        return await res.json();
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error('Failed to load data.json');
  } catch (e) {
    return defaultData;
  }
}

function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function wireMobileNav() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!menuToggle || !navLinks) return;
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (typeof text === 'string') node.textContent = text;
  return node;
}

function card(item, variant, clickUrl) {
  const c = el('div', 'card');
  if (item.image) {
    const img = el('img', 'card-image');
    img.src = item.image;
    img.alt = item.title || variant;
    c.appendChild(img);
  }
  const body = el('div', 'card-body');
  const h = el('h3', '', item.title || '');
  body.appendChild(h);

  if (variant === 'publication') {
    const meta = el('p', 'meta', [item.journal, item.year].filter(Boolean).join(' • '));
    if (meta.textContent) body.appendChild(meta);
  }

  const desc = el('p', '', item.description || '');
  if (desc.textContent) body.appendChild(desc);

  // Avoid nesting links: if clickUrl wraps the card, skip the inner link.
  if (variant === 'publication' && item.link && !clickUrl) {
    const a = el('a', 'text-link', 'View publication');
    a.href = item.link;
    a.target = '_blank';
    a.rel = 'noopener';
    body.appendChild(a);
  }
  c.appendChild(body);

  if (clickUrl) {
    const a = el('a', 'card-link');
    a.href = clickUrl;
    a.appendChild(c);
    return a;
  }

  return c;
}

function mountCarousel(container, items, variant, clickUrl) {
  if (!container) return;

  const wrap = el('div', 'carousel');
  const prev = el('button', 'carousel-btn', '‹');
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Scroll left');

  const next = el('button', 'carousel-btn', '›');
  next.type = 'button';
  next.setAttribute('aria-label', 'Scroll right');

  const track = el('div', 'carousel-track');
  items.forEach((it) => track.appendChild(card(it, variant, clickUrl)));

  const scrollBy = () => Math.max(260, Math.floor(track.clientWidth * 0.8));
  prev.addEventListener('click', () => track.scrollBy({ left: -scrollBy(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: scrollBy(), behavior: 'smooth' }));

  wrap.appendChild(prev);
  wrap.appendChild(track);
  wrap.appendChild(next);
  container.innerHTML = '';
  container.appendChild(wrap);
}

export { loadSiteData, setYear, wireMobileNav, mountCarousel, card };
