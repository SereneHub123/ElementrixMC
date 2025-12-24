/* sum js */

// config & constants (feel free to tweak)
const SERVER_IP = "play.elementrix.it";
const API_URL = "https://api.mcsrvstat.us/2/" + SERVER_IP;
const DISCORD_URL = "https://dsc.gg/elementrixmc
const STORE_URL = "#";
const VOTE_URL = "#";

document.addEventListener("DOMContentLoaded", () => {
    initServerStatus();
    initCopyButtons();
    initScrollAnimations();
    initLinks();
    updateFooterYear();
    initMobileMenu();
    initThemeToggle();
});

/* theme toggle: light too dark */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const icon = document.getElementById('theme-icon');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const isDark = theme === 'dark';
        toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        toggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        if (icon) {
            icon.innerHTML = isDark
                ? `
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                `
                : `
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M12 2v2"></path>
                    <path d="M12 20v2"></path>
                    <path d="M4.93 4.93l1.41 1.41"></path>
                    <path d="M17.66 17.66l1.41 1.41"></path>
                    <path d="M2 12h2"></path>
                    <path d="M20 12h2"></path>
                    <path d="M4.93 19.07l1.41-1.41"></path>
                    <path d="M17.66 6.34l1.41-1.41"></path>
                `;
        }
        const statusEl = document.getElementById('theme-status');
        if (statusEl) statusEl.innerText = isDark ? 'Dark mode enabled' : 'Light mode enabled';
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    }

    const stored = localStorage.getItem('theme');
    if (stored) applyTheme(stored);
    else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    toggle.addEventListener('click', toggleTheme);
}

function initServerStatus() {
    const statusText = document.getElementById("status-text");
    const playerCount = document.getElementById("player-count");
    const maxPlayers = document.getElementById("max-players");
    const indicator = document.getElementById("status-indicator");
    const motdElement = document.getElementById("server-motd");
    const versionElement = document.getElementById("server-version");
    const navCount = document.getElementById("nav-player-count");
    const iconElement = document.getElementById("server-icon");

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (data.online) {
                // Server is Online
                if (statusText) {
                    statusText.innerText = "Online";
                    statusText.style.color = "var(--accent-earth)";
                }

                if (playerCount) playerCount.innerText = data.players.online;
                if (maxPlayers) maxPlayers.innerText = data.players.max;

                // Update Badge in Navbar
                if (navCount) navCount.innerText = `${data.players.online} Online`;

                // Update Indicator
                if (indicator) indicator.classList.add("online");

                // Small celebration burst on the card (subtle)
                const statusCard = document.querySelector('.status-card');
                if (statusCard) {
                    statusCard.classList.add('online', 'status-burst');
                    setTimeout(() => statusCard.classList.remove('status-burst'), 900);
                }

                // Update Version
                if (versionElement) versionElement.innerText = data.version;

                // Update Icon if exists
                if (data.icon && iconElement) {
                    iconElement.src = data.icon;
                }

                // Clean MOTD (Remove color codes)
                if (data.motd && data.motd.clean && motdElement) {
                    motdElement.innerText = data.motd.clean.join(" ");
                }
            } else {
                // Server is Offline
                setOfflineStatus();
            }
        })
        .catch(err => {
            console.error("Failed to fetch server status:", err);
            setOfflineStatus();
        });

    function setOfflineStatus() {
        if (statusText) {
            statusText.innerText = "Offline";
            statusText.style.color = "var(--accent-fire)";
        }
        if (indicator) indicator.classList.add("offline");
        if (navCount) navCount.innerText = "Offline";
        if (motdElement) motdElement.innerText = "Server is currently offline.";
    }
}

/* copy IP: clipboard magic */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll("[data-copy-ip]");

    copyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            navigator.clipboard.writeText(SERVER_IP).then(() => {
                const originalText = btn.innerHTML;
                const isMini = btn.classList.contains('mini-ip-box');

                if (isMini) {
                    const hint = btn.querySelector(".copy-hint");
                    const originalHint = hint ? hint.innerText : '';
                    if (hint) {
                        hint.innerText = "COPIED!";
                        hint.style.color = "var(--accent-earth)";
                        setTimeout(() => {
                            hint.innerText = originalHint;
                            hint.style.color = "";
                        }, 2000);
                    }
                } else {
                    btn.classList.add("copied");
                    if (btn.classList.contains("btn-copy")) {
                        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    } else {
                        const span = btn.querySelector("span");
                        if (span) span.innerText = "Copied!";
                    }

                    setTimeout(() => {
                        btn.classList.remove("copied");
                        btn.innerHTML = originalText;
                    }, 2000);
                }
            }).catch(err => {
                console.error('Copy failed', err);
                alert('Copy failed. IP: ' + SERVER_IP);
            });
        });
    });
}


function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

function initLinks() {
    document.querySelectorAll("[data-discord-link]").forEach(el => el.href = DISCORD_URL);
    document.querySelectorAll("[data-store-link]").forEach(el => el.href = STORE_URL);
    document.querySelectorAll("[data-vote-link]").forEach(el => el.href = VOTE_URL);
}

/* utils & helpers */
function updateFooterYear() {
    const yearEl = document.getElementById("footer-year");
    if (yearEl) yearEl.innerText = new Date().getFullYear();
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initMobileMenu() {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const nav = document.querySelector(".nav-links");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            nav.classList.toggle("active");
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
            });
        });
    }
}
