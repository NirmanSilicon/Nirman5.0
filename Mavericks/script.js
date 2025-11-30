// =======================
// NAVBAR TOGGLE (MOBILE)
// =======================
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
    }
  });
}

// =======================
// SMOOTH SCROLLING
// =======================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId.length > 1) {
      e.preventDefault();
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        window.scrollTo({
          top: targetEl.offsetTop - 70,
          behavior: "smooth",
        });
      }
    }
  });
});

// =======================
// DASHBOARD MOCK
// =======================
const simulateBtn = document.getElementById("simulate-btn");
const creditsCount = document.getElementById("credits-count");

if (simulateBtn && creditsCount) {
  simulateBtn.addEventListener("click", () => {
    const current = parseInt(creditsCount.textContent.replace(/,/g, ""), 10);
    const increment = Math.floor(Math.random() * 300 + 200); // +200 to +500
    const updated = current + increment;
    creditsCount.textContent = updated.toLocaleString();
  });
}

// =======================
// FAQ ACCORDION
// =======================
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    // Close all
    faqItems.forEach((i) => i.classList.remove("open"));
    // Toggle current
    if (!isOpen) {
      item.classList.add("open");
    }
  });
});

// =======================
// CONTACT FORM
// =======================
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in all required fields.";
      formStatus.style.color = "#d00000";
      return;
    }

    formStatus.textContent = "Thank you! We’ll get back to you soon.";
    formStatus.style.color = "#0077b6";
    contactForm.reset();
  });
}

// =======================
// FOOTER YEAR
// =======================
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ================================
// ✅ METAMASK WALLET CONNECTION
// ================================
const connectWalletBtn = document.getElementById("connect-wallet");
const walletAddressEl = document.getElementById("wallet-address");

if (connectWalletBtn && walletAddressEl) {
  connectWalletBtn.addEventListener("click", async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask not detected! Please install MetaMask.");
      return;
    }

    try {
      // Request wallet connection
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = accounts[0];

      // Display wallet address
      walletAddressEl.textContent = `Connected: ${account}`;
      console.log("Wallet connected:", account);
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Wallet connection failed or was rejected.");
    }
  });
}
