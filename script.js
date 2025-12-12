/* ===== ELEMENTRIX SMP - SHARED JAVASCRIPT ===== */

// Server Configuration
const MC_HOST = "play.elementrix.it";
const DISCORD_URL = "https://discord.com/f33Xv67uVz";
const SAME_DOMAIN = false;

// Placeholder URLs (replace these later)
const STORE_URL = "#";
const VOTE_URL = "#";
const RULES_URL = "#";

// ===== DOM READY =====
document.addEventListener("DOMContentLoaded", function() {
    initNavigation();
    initCopyButtons();
    initDynamicContent();
    initFooterYear();
    initScrollHighlight();
    
    // Server Ping
    pingServer();
    setInterval(pingServer, 15000);
});

// ===== NAVIGATION =====
function initNavigation() {
    const menuToggle = document.querySelector(".mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function() {
            navLinks.classList.toggle("active");
            const isOpen = navLinks.classList.contains("active");
            menuToggle.textContent = isOpen ? "✕" : "☰";
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll("a").forEach(function(link) {
            link.addEventListener("click", function() {
                navLinks.classList.remove("active");
                menuToggle.textContent = "☰";
            });
        });
    }
}

// ===== SCROLL HIGHLIGHTING =====
function initScrollHighlight() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Simple scroll spy
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // 150px offset for the navbar
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
        
        // Highlight home if at the very top
        if (window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            if(navLinks[0]) navLinks[0].classList.add('active');
        }
    });
}

// ===== COPY FUNCTIONALITY =====
function initCopyButtons() {
    // Copy IP buttons
    document.querySelectorAll("[data-copy-ip]").forEach(function(btn) {
        btn.addEventListener("click", function() {
            copyIP();
        });
    });
    
    // Navbar Copy IP button (scrolls to IP box)
    const navCopyBtn = document.querySelector("[data-nav-copy-ip]");
    if (navCopyBtn) {
        navCopyBtn.addEventListener("click", function() {
            const ipBox = document.getElementById("ip-box");
            if (ipBox) {
                ipBox.scrollIntoView({ behavior: "smooth", block: "center" });
                setTimeout(copyIP, 300);
            } else {
                copyIP();
            }
        });
    }
}

function copyIP() {
    if (MC_HOST === "") {
        alert("Server IP not configured.");
        return;
    }
    
    navigator.clipboard.writeText(MC_HOST).then(function() {
        showCopyFeedback("IP copied: " + MC_HOST);
    }).catch(function() {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = MC_HOST;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
            showCopyFeedback("IP copied: " + MC_HOST);
        } catch (err) {
            alert("Failed to copy. IP: " + MC_HOST);
        }
        document.body.removeChild(textArea);
    });
}

function showCopyFeedback(message) {
    let feedback = document.querySelector(".copy-feedback");
    if (!feedback) {
        feedback = document.createElement("div");
        feedback.className = "copy-feedback";
        document.body.appendChild(feedback);
    }
    feedback.textContent = message;
    feedback.classList.add("show");
    
    setTimeout(function() {
        feedback.classList.remove("show");
    }, 2000);
}

// ===== DYNAMIC CONTENT =====
function initDynamicContent() {
    document.querySelectorAll("[data-ip-text]").forEach(el => el.textContent = MC_HOST);
    document.querySelectorAll("[data-discord-link]").forEach(el => el.href = DISCORD_URL);
    document.querySelectorAll("[data-store-link]").forEach(el => el.href = STORE_URL);
    document.querySelectorAll("[data-vote-link]").forEach(el => el.href = VOTE_URL);
    document.querySelectorAll("[data-rules-link]").forEach(el => el.href = RULES_URL);
    
    document.querySelectorAll("[data-discord-tag]").forEach(el => {
        el.textContent = DISCORD_URL.replace("https://", "").substring(0, 25) + "...";
    });
}

// ===== FOOTER YEAR =====
function initFooterYear() {
    const yearEl = document.getElementById("footer-year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// ===== SERVER STATUS PING =====
function pingServer() {
    const statusText = document.getElementById("status-text");
    const statusIndicator = document.getElementById("status-indicator");
    const pingText = document.getElementById("ping-text");
    
    if (!statusText || !statusIndicator || !pingText) return;
    
    // Set checking state
    statusText.textContent = "Checking...";
    statusText.className = "status-value";
    statusIndicator.className = "status-indicator";
    
    const startTime = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);
    
    const pingUrl = "https://" + MC_HOST + "/?" + Date.now();
    
    fetch(pingUrl, {
        mode: "no-cors",
        signal: controller.signal
    }).then(() => {
        clearTimeout(timeoutId);
        const ping = Math.round(performance.now() - startTime);
        
        statusText.textContent = "Online";
        statusText.className = "status-value online";
        statusIndicator.className = "status-indicator online";
        pingText.textContent = ping + " ms";
    }).catch((err) => {
        clearTimeout(timeoutId);
        // Even with no-cors, a network error implies offline/unreachable for this context
        statusText.textContent = "Offline";
        statusText.className = "status-value offline";
        statusIndicator.className = "status-indicator offline";
        pingText.textContent = "—";
    });
}

// ===== BACK TO TOP =====
