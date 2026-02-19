// ====== Update these (if needed) ======
const PROFILE = {
  name: "Wu Zekai",
  email: "2201764@sit.singaporetech.edu.sg",
  linkedin: "https://www.linkedin.com/in/zekai-wu-wzk/",
  github: "https://github.com/wzk111"
};

// Projects shown on the website
const PROJECTS = [
  {
    title: "pls-organize — Preview-first file organizer",
    badge: "Dev Tool",
    desc: "Deterministic organizer with preview + rollback (scan→plan→apply→undo).",
    tags: ["Python", "CLI", "YAML", "Safety"],
    details: `
      <ul>
        <li>Designed a deterministic <b>scan → plan → apply → undo</b> pipeline (preview-first, human-approved execution).</li>
        <li>Implemented a transactional <b>journal</b> so file operations are rollback-safe.</li>
        <li>Supports YAML rules and explainable plans (rule reason + confidence).</li>
      </ul>
    `,
    primary: { label: "GitHub", url: "https://github.com/wzk111/pls-organize" },
    links: [
      { label: "GitHub", url: "https://github.com/wzk111/pls-organize" }
    ]
  },
  {
    title: "pls-readme — README generator",
    badge: "Dev Tool",
    desc: "CLI that scans repos to generate README drafts with stack inference.",
    tags: ["Python", "CLI", "Markdown"],
    details: `
      <ul>
        <li>Scans repository structure to generate a clean, standardized <code>README.md</code>.</li>
        <li>Infers tech stack from files/configs and supports safe overwrite with explicit confirmation.</li>
        <li>Optional directory tree rendering and badges.</li>
      </ul>
    `,
    primary: { label: "GitHub", url: "https://github.com/wzk111/pls-readme" },
    links: [
      { label: "GitHub", url: "https://github.com/wzk111/pls-readme" }
    ]
  },
  {
    title: "Invenio Engine — Custom 3D game engine",
    badge: "Engine",
    desc: "Built a PhysX-based C++ physics layer and exposed it to C# gameplay via native bindings.",
    tags: ["C++", "C#", "PhysX", "Interop"],
    details: `
      <ul>
        <li>Built a C++ physics layer on NVIDIA PhysX and exposed APIs to C# for efficient cross-language calls.</li>
        <li>Implemented rigid bodies, colliders, and physics-driven interactions; supported <b>1,000+</b> concurrent objects.</li>
        <li>Designed architecture to keep the physics layer scalable and maintainable.</li>
      </ul>
    `,
    primary: null,
    links: [ { label: "Game Demo Video", url: "https://www.youtube.com/watch?v=aFhAFdCKcBw" }]
  },
  {
    title: "Insight Engine — Custom 2D physics engine",
    badge: "Game Engine",
    desc: "Custom 2D physics + collision system optimized with an implicit grid broad-phase.",
    tags: ["C++", "ECS", "SAT", "Spatial Hashing"],
    details: `
      <ul>
        <li>Implemented 2D rigid bodies + box/circle colliders with ECS integration.</li>
        <li>Collision detection/handling for static, dynamic, and kinematic bodies.</li>
        <li>Optimized broad-phase using an Implicit Grid, scaling from <b>60 → 600</b> objects at 60 FPS.</li>
      </ul>
    `,
    primary: null,
    links: [
      { label: "Engine Demo Video", url: "https://www.youtube.com/watch?v=ztrM86Iz1bM&list=PLTEWNGDCjfENdTdvsIIrAyv_HB1xBJHbx",
        label: "Game Demo Video", url: "https://www.youtube.com/watch?v=XxKPY0HtbqA"
       }
    ]
  }
];

// ====== Typing effect ======
const phrases = [
  "C++ systems engineering.",
  "ROS2 robotics integration.",
  "performance optimization.",
  "tools and game engines."
];

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

async function typeLoop(el){
  let i = 0;
  while(true){
    const text = phrases[i % phrases.length];
    for(let k=0; k<=text.length; k++){
      el.textContent = text.slice(0, k);
      await sleep(32);
    }
    await sleep(800);
    for(let k=text.length; k>=0; k--){
      el.textContent = text.slice(0, k);
      await sleep(18);
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
    const tags = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join("");
    const primaryBtn = p.primary
      ? `<a class="btn btn--ghost" href="${p.primary.url}" target="_blank" rel="noopener">${p.primary.label}</a>`
      : "";

    return `
      <article class="project">
        <div class="project__top">
          <h3 class="project__title">${p.title}</h3>
          <span class="badge">${p.badge}</span>
        </div>
        <p class="project__desc">${p.desc}</p>
        <div class="tags">${tags}</div>
        <div class="project__actions">
          ${primaryBtn}
          <button class="btn btn--ghost" data-details="${idx}" type="button">Details</button>
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

  foot.innerHTML = linkButtons || `<span class="muted">Links can be added in <code>script.js</code>.</span>`;

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
  const y = document.getElementById("year");
  if(y) y.textContent = String(new Date().getFullYear());

  initTheme();
  initMenu();
  initReveal();
  initScrollUI();
  renderProjects();
  initContact();

  const t = document.getElementById("typeTarget");
  if(t) typeLoop(t);

  const themeBtn = document.getElementById("themeBtn");
  if(themeBtn){
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }
})();
