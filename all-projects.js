

/* CONFIG */
const GITHUB_USERNAME = "Srihareddy";
const PER_PAGE = 100;

/* DOM ELEMENTS */
const statusEl = document.getElementById("status");
const listEl = document.getElementById("projectsList");
const searchEl = document.getElementById("search");
const hideForksEl = document.getElementById("hideForks");


let allRepos = [];

/* HELPERS */
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function escapeHtml(str) {
  return (str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* RENDER */
function render(repos) {
  if (!repos.length) {
    listEl.innerHTML = "";
    statusEl.textContent = "No projects found.";
    return;
  }

  statusEl.textContent = `${repos.length} project(s)`;

  listEl.innerHTML = repos
    .map((r) => {
      const name = escapeHtml(r.name);
      const desc = escapeHtml(r.description || "No description yet.");
      const updated = formatDate(r.updated_at);

      // GitHub Topics -> Tags
      const topics = Array.isArray(r.topics) ? r.topics : [];
      const topicsHtml =
        topics.length > 0
          ? topics
              .slice(0, 6)
              .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
              .join("")
          : `<span class="tag muted">No topics</span>`;

      const homepageLink = r.homepage
        ? `<a href="${r.homepage}" target="_blank" rel="noopener">Live</a>`
        : "";

      return `
        <div class="project-card">
          <h3 class="proj-title">${name}</h3>

          <p class="proj-desc">${desc}</p>

          <div class="proj-tags">
            ${topicsHtml}
          </div>

          <div class="proj-meta">
            <span><strong>Updated:</strong> ${updated}</span>
          </div>

          <div class="project-links">
            <a href="${r.html_url}" target="_blank" rel="noopener">GitHub</a>
            ${homepageLink}
          </div>
        </div>
      `;
    })
    .join(" ");
}

/* FILTER + SORT */
function applyFilters() {
  const q = (searchEl.value || "").toLowerCase().trim();
  const hideForks = hideForksEl.checked;

  let filtered = [...allRepos];

  if (hideForks) filtered = filtered.filter((r) => !r.fork);

  if (q) {
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q) ||
        (Array.isArray(r.topics) ? r.topics.join(" ").toLowerCase() : "").includes(q)
    );
  }


  filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  render(filtered);
}

/* FETCH FROM GITHUB API */
async function fetchRepos() {
  statusEl.textContent = "Loading projects…";

  try {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=${PER_PAGE}&sort=updated`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    allRepos = await res.json();
    applyFilters();
  } catch (err) {
    console.error("Fetch error:", err);
    statusEl.textContent = "Failed to load projects from GitHub.";
  }
}

/* EVENTS */
searchEl.addEventListener("input", applyFilters);
hideForksEl.addEventListener("change", applyFilters);

/* INIT */
fetchRepos();
