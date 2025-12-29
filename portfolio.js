

/* THEME */
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  if (themeToggle) themeToggle.textContent = isDark ?  "🖌️ Dark" : "🖌️ Light";
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// On load: saved theme > system theme
const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme || getSystemTheme());

// If user clicks toggle: save preference
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  });
}

// changes automatically
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  const saved = localStorage.getItem("theme");
  if (!saved) applyTheme(getSystemTheme());
});

/* NAV: Smooth scrolling + update URL hash */
document.querySelectorAll('.top-nav a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    
    history.pushState(null, "", `#${id}`);
  });
});


/* SCROLLSPY*/
function setActiveNav(sectionId) {
  document.querySelectorAll(".top-nav a").forEach((a) => a.classList.remove("active"));
  const active = document.querySelector(`.top-nav a[href="#${sectionId}"]`);
  if (active) active.classList.add("active");
}


const sectionIds = ["aboutme", "projects", "certifications", "publications", "contact"];
const observedSections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

let currentActive = null;

const observer = new IntersectionObserver(
  (entries) => {

    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (!visible.length) return;

    const id = visible[0].target.id;
    if (id !== currentActive) {
      currentActive = id;
      setActiveNav(id);
    }
  },
  {
    root: null,

    
    rootMargin: "-90px 0px -55% 0px",

    threshold: [0.2, 0.35, 0.5, 0.65]
  }
);


observedSections.forEach((s) => observer.observe(s));


window.addEventListener("load", () => {
  const id = (location.hash || "#aboutme").replace("#", "");
  setActiveNav(id);
});


window.addEventListener("hashchange", () => {
  const id = (location.hash || "#aboutme").replace("#", "");
  setActiveNav(id);
});


/* CITE MODAL */
function openCite() {
  const modal = document.getElementById("citeModal");
  if (!modal) return;
  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");
}

function closeCite() {
  const modal = document.getElementById("citeModal");
  if (!modal) return;
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");

  const status = document.getElementById("copyStatus");
  if (status) status.textContent = "";
}

function getBibtex() {
  const el = document.getElementById("bibtexText");
  return el ? el.textContent : "";
}

async function copyBibtex() {
  const bib = getBibtex();
  const status = document.getElementById("copyStatus");

  try {
    await navigator.clipboard.writeText(bib);
    if (status) status.textContent = "Copied to clipboard.";
  } catch (e) {
    
    const ta = document.createElement("textarea");
    ta.value = bib;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    if (status) status.textContent = "Copied to clipboard.";
  }
}

function downloadBibtex() {
  const bib = getBibtex();
  const blob = new Blob([bib], { type: "application/x-bibtex;charset=utf-8" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "sriha-ettireddy-publication.bib";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);

  const status = document.getElementById("copyStatus");
  if (status) status.textContent = "Downloaded .bib file.";
}


window.addEventListener("click", (e) => {
  const modal = document.getElementById("citeModal");
  if (modal && e.target === modal) closeCite();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCite();
});
