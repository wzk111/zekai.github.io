// ====== Update these ======
const PROFILE = {
  name: "Wu Zekai",
  email: "2201764@sit.singaporetech.edu.sg",     // <-- change this
  linkedin: "https://www.linkedin.com/in/zekai-wu-wzk/",  // you gave this
  github: "https://github.com/wzk111"       // <-- change this
};

const PROJECTS = [
  {
    title: "Insight Engine — Custom 2D Physics Engine",
    badge: "Game Engine",
    desc: "Custom 2D physics + collision system designed for performant gameplay.",
    tags: ["C++", "SAT", "AABB", "Spatial Hashing"],
    details: `
      <ul>
        <li>Designed core physics primitives (rigidbody, colliders, integration).</li>
        <li>Implemented collision detection (AABB/SAT) + response pipeline.</li>
        <li>Optimized broad-phase with an implicit grid / spatial partitioning.</li>
      </ul>
    `,
    links: [
      { label: "GitHub", url: "https://github.com/wzk111" },
      { label: "Demo Video (Fragment)", url: "https://www.youtube.com/watch?v=XxKPY0HtbqA" }
    ]
  },
  {
    title: "Invenio Engine — Custom 3D Engine",
    badge: "Engine",
    desc: "3D engine with physics system from design to implementation.",
    tags: ["C++", "3D Math", "Physics", "Tools"],
    details: `
      <ul>
        <li>Led overall physics system design and implementation.</li>
        <li>Built core components and debugging tooling for iteration.</li>
        <li>Focused on stability and predictable collision behavior.</li>
      </ul>
    `,
    links: []
  },
  {
    title: "Venti ROS2 Collision Detection",
    badge: "ROS2",
    desc: "Collision checking and performance improvements for autonomous vehicle planning.",
    tags: ["ROS2", "C++", "Performance", "Planning"],
    details: `
      <ul>
        <li>Worked on collision detection logic for ego trajectory vs obstacles.</li>
        <li>Explored broad-phase optimizations for faster runtime checks.</li>
        <li>Integrated within ROS2-based planning and simulation workflows.</li>
      </ul>
    `,
    links: []
  }
];

// ====== Typing effect ======
const phrases = [
  "game engines.",
  "physics systems.",
  "ROS2 tools.",
  "performance-focused code."
];

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

async function typeLoop(el){
  let i = 0;
  while(true){
    const text = phrases[i % phrases.length];
    for(let k=0; k<=text.length; k++){
      el.textContent = text.slice(0, k);
      await sleep(35);
    }
    await sleep(800);
    for(let k=text.length; k>=0; k--){
      el.textContent = text.slice(0, k);
      await sleep(20);
    }
    await sleep(250);
    i++;
  }
}

// ====== Theme toggle ======
function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const icon = document.getElementById("themeIcon");
  if(icon) icon.textContent = theme === "light" ? "🌞" : "🌙";
}

function initTheme(){
  const saved = localStorage.getItem("theme");
  if(saved === "light" || saved === "dark") return applyTheme(saved);
  // default: dark
  applyTheme("dark");
}

// ====== Mobile menu ======
function initMenu(){
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  if(!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = menu.style.display === "grid";
    menu.style.display = isOpen ? "none" : "grid";
    menu.setAttribute("aria-hidden", String(isOpen));
  });

  menu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      menu.style.display = "none";
      menu.setAttribute("aria-hidden", "true");
    });
  });
}

// ====== Reveal on scroll ======
function initReveal(){
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

// ====== Scroll progress & toTop ======
function initScrollUI(){
  const progress = document.getElementById("progress");
  const toTop = document.getElementById("toTop");

  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    if(progress) progress.style.width = `${scrolled}%`;

    if(toTop){
      if(h.scrollTop > 400) toTop.classList.add("show");
      else toTop.classList.remove("show");
    }
  });

  if(toTop){
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

// ====== Projects render + modal ======
function renderProjects(){
  const grid = document.getElementById("projectGrid");
  if(!grid) return;

  grid.innerHTML = PROJECTS.map((p, idx) => {
    const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join("");
    return `
      <article class="project">
        <div class="project__top">
          <h3 class="project__title">${p.title}</h3>
          <span class="badge">${p.badge}</span>
        </div>
        <p class="project__desc">${p.desc}</p>
        <div class="tags">${tags}</div>
        <div class="project__actions">
          <button class="btn btn--ghost" data-details="${idx}">Details</button>
        </div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll("[data-details]").forEach(btn => {
    btn.addEventListener("click", () => openModal(Number(btn.dataset.details)));
  });
}

function openModal(index){
  const p = PROJECTS[index];
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("modalOverlay");
  const closeBtn = document.getElementById("modalClose");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");
  const foot = document.getElementById("modalFoot");

  if(!modal || !overlay || !closeBtn || !title || !body || !foot) return;

  title.textContent = p.title;
  body.innerHTML = p.details;

  const linkButtons = (p.links || []).map(l =>
    `<a class="btn btn--ghost" href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`
  ).join("");

  foot.innerHTML = linkButtons || `<span class="muted">Add GitHub/video links in <code>script.js</code> when ready.</span>`;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");

  const close = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", onKey);
  };

  const onKey = (e) => { if(e.key === "Escape") close(); };

  overlay.onclick = close;
  closeBtn.onclick = close;
  document.addEventListener("keydown", onKey);
}

// ====== Copy email + mailto ======
function initContact(){
  const toast = document.getElementById("toast");
  const copyBtn = document.getElementById("copyEmail");
  const mailBtn = document.getElementById("mailBtn");

  // Update hero social links
  const links = document.querySelectorAll(".social a.social__item");
  links.forEach(a => {
    const label = (a.textContent || "").toLowerCase();
    if(label.includes("linkedin")) a.href = PROFILE.linkedin;
    if(label.includes("github")) a.href = PROFILE.github;
  });

  const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent("Hello Wu Zekai")}`;

  if(mailBtn) mailBtn.href = mailto;

  if(copyBtn){
    copyBtn.addEventListener("click", async () => {
      try{
        await navigator.clipboard.writeText(PROFILE.email);
        if(toast){
          toast.textContent = "Email copied!";
          setTimeout(() => toast.textContent = "", 1200);
        }
      } catch {
        if(toast){
          toast.textContent = "Could not copy. Please copy manually.";
          setTimeout(() => toast.textContent = "", 1500);
        }
      }
    });
  }
}

// ====== Init ======
(function init(){
  // Year
  const y = document.getElementById("year");
  if(y) y.textContent = String(new Date().getFullYear());

  initTheme();
  initMenu();
  initReveal();
  initScrollUI();
  renderProjects();
  initContact();

  // Typing
  const t = document.getElementById("typeTarget");
  if(t) typeLoop(t);

  // Theme button
  const themeBtn = document.getElementById("themeBtn");
  if(themeBtn){
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }
})();
