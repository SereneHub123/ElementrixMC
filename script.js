/* ===== ELEMENTRIX SMP - SHARED JAVASCRIPT ===== */

// Server Configuration
const MC_HOST = "play.elementrix.it";
const DISCORD_URL = "https://discord.com/f33Xv67uVz";
const SAME_DOMAIN = false;

// Placeholder URLs (replace these later)
const STORE_URL = "#STORE_URL_PLACEHOLDER";
const VOTE_URL = "#VOTE_URL_PLACEHOLDER";
const RULES_URL = "#RULES_URL_PLACEHOLDER";

// ===== DOM READY =====
document.addEventListener("DOMContentLoaded", function() {
    initNavigation();
    initCopyButtons();
    initDynamicContent();
    initFooterYear();
    
    // Only run ping on pages with status card
    if (document.getElementById("status-text")) {
        pingServer();
        setInterval(pingServer, 15000);
    }
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
    
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function(link) {
        const href = link.getAttribute("href");
        if (href === currentPage || (currentPage === "" && href === "index.html")) {
            link.classList.add("active");
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
    
    // Navbar Copy IP button (scrolls to IP box first if on home page)
    const navCopyBtn = document.querySelector("[data-nav-copy-ip]");
    if (navCopyBtn) {
        navCopyBtn.addEventListener("click", function() {
            const ipBox = document.getElementById("ip-box");
            if (ipBox) {
                ipBox.scrollIntoView({ behavior: "smooth", block: "center" });
                setTimeout(copyIP, 300);
            } else {
                // Not on home page, just copy
                copyIP();
            }
        });
    }
}

function copyIP() {
    if (MC_HOST.includes("PLACEHOLDER") || MC_HOST === "") {
        alert("Server IP not configured yet. Please edit the script.js file.");
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
    // Set IP text
    document.querySelectorAll("[data-ip-text]").forEach(function(el) {
        el.textContent = MC_HOST;
    });
    
    // Set Discord links
    document.querySelectorAll("[data-discord-link]").forEach(function(el) {
        el.href = DISCORD_URL;
    });
    
    // Set Store links
    document.querySelectorAll("[data-store-link]").forEach(function(el) {
        el.href = STORE_URL;
    });
    
    // Set Vote links
    document.querySelectorAll("[data-vote-link]").forEach(function(el) {
        el.href = VOTE_URL;
    });
    
    // Set Rules links
    document.querySelectorAll("[data-rules-link]").forEach(function(el) {
        el.href = RULES_URL;
    });
    
    // Set Discord tag display
    document.querySelectorAll("[data-discord-tag]").forEach(function(el) {
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
    const timeoutId = setTimeout(function() {
        controller.abort();
    }, 7000);
    
    // Determine ping URL
    let pingUrl;
    if (SAME_DOMAIN) {
        pingUrl = window.location.origin + "/status-ping?" + Date.now();
    } else {
        pingUrl = "https://" + MC_HOST + "/?" + Date.now();
    }
    
    fetch(pingUrl, {
        mode: "no-cors",
        signal: controller.signal
    }).then(function() {
        clearTimeout(timeoutId);
        const ping = Math.round(performance.now() - startTime);
        
        statusText.textContent = "Online";
        statusText.className = "status-value online";
        statusIndicator.className = "status-indicator online";
        pingText.textContent = ping + " ms";
    }).catch(function(err) {
        clearTimeout(timeoutId);
        
        // Even with no-cors, a network error means offline
        statusText.textContent = "Offline";
        statusText.className = "status-value offline";
        statusIndicator.className = "status-indicator offline";
        pingText.textContent = "—";
    });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.addEventListener("click", function(e) {
    const link = e.target.closest("a[href^='#']");
    if (link) {
        const targetId = link.getAttribute("href");
        if (targetId === "#") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
        }
    }
});

// ===== BACK TO TOP =====
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}
