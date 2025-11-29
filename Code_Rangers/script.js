console.log("Script.js loaded successfully!");

/* =========================
1. ELEMENT REFERENCES
========================= */

// Auth tab switch
const switchButtons = document.querySelectorAll(".switch-btn");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

// Signup fields
const signupNameInput = document.getElementById("signupName");
const signupGenderSelect = document.getElementById("signupGender");
const signupEmailInput = document.getElementById("signupEmail");
const signupMobileInput = document.getElementById("signupMobile");
const signupPasswordInput = document.getElementById("signupPassword");
const signupConfirmPasswordInput = document.getElementById("signupConfirmPassword");
const passwordStrengthText = document.getElementById("passwordStrength");

// Login fields
const loginIdInput = document.getElementById("loginId");
const loginPasswordInput = document.getElementById("loginPassword");

// Screens
const authScreen = document.getElementById("authScreen");
const landingPage = document.getElementById("landingPage");

// Landing page
const landingUsername = document.getElementById("landingUsername");
const trackBusBtn = document.getElementById("trackBusBtn");
const bookTicketBtn = document.getElementById("bookTicketBtn");
const swipeDownHint = document.getElementById("swipeDownHint");
const moreContentSection = document.getElementById("more-content");

// Bus status form
const busStatusForm = document.getElementById("busStatusForm");
const pickupInput = document.getElementById("pickup");
const destinationInput = document.getElementById("destination");
const pickupTimeInput = document.getElementById("pickupTime");

// Eco Points Elements
const ecoPointsDisplay = document.getElementById('ecoPoints');
const ecoRewardsBtn = document.getElementById('ecoRewardsBtn');
const ecoRewardsModal = document.getElementById('ecoRewardsModal');
const closeModal = document.getElementById('closeModal');
const modalPointsTotal = document.getElementById('modalPointsTotal');
const rewardsGrid = document.getElementById('rewardsGrid');

// User data storage (in-memory demo)
let registeredUser = null;

// User eco points data
let userEcoPoints = 100; // Starting points for demo

// Available rewards
const availableRewards = [
  {
    id: 1,
    name: "Amazon Voucher",
    description: "₹500 Amazon Gift Card",
    points: 1000,
    type: "voucher"
  },
  {
    id: 2,
    name: "Bus Ticket Discount",
    description: "50% off on next 5 trips",
    points: 500,
    type: "discount"
  },
  {
    id: 3,
    name: "Starbucks Coffee",
    description: "Free medium coffee",
    points: 250,
    type: "voucher"
  },
  {
    id: 4,
    name: "Movie Tickets",
    description: "2 cinema tickets",
    points: 800,
    type: "voucher"
  },
  {
    id: 5,
    name: "Food Coupon",
    description: "₹200 food court voucher",
    points: 300,
    type: "voucher"
  },
  {
    id: 6,
    name: "Premium Membership",
    description: "1 month free premium",
    points: 1500,
    type: "membership"
  }
];

/* =========================
2. HELPERS
========================= */

function isValidGmail(email) {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return gmailRegex.test(email);
}

function isValidMobile(mobile) {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobile);
}

function evaluatePasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length === 0) {
    return { label: "-", className: "" };
  } else if (score <= 2) {
    return { label: "Weak", className: "password-strength-weak" };
  } else if (score === 3 || score === 4) {
    return { label: "Medium", className: "password-strength-medium" };
  } else {
    return { label: "Strong", className: "password-strength-strong" };
  }
}

/* =========================
3. SHOW LANDING PAGE FUNCTION
========================= */

function showLanding(displayName) {
  console.log("showLanding called with:", displayName);

  // Set the username
  if (landingUsername) {
    landingUsername.textContent = displayName || "User";
  }

  // Hide auth screen completely
  if (authScreen) {
    authScreen.style.display = "none";
  }

  // Show landing page
  if (landingPage) {
    landingPage.style.display = "block";
  }

  // Initialize eco points system
  initializeEcoPoints();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "instant" });
}

/* =========================
4. ECO POINTS SYSTEM FUNCTIONS
========================= */

function updateEcoPointsDisplay() {
  if (ecoPointsDisplay) {
    ecoPointsDisplay.textContent = userEcoPoints;
  }
  if (modalPointsTotal) {
    modalPointsTotal.textContent = userEcoPoints;
  }
}

function populateRewardsGrid() {
  if (!rewardsGrid) return;
  
  rewardsGrid.innerHTML = '';
  
  availableRewards.forEach(reward => {
    const canRedeem = userEcoPoints >= reward.points;
    
    const rewardElement = document.createElement('div');
    rewardElement.className = 'reward-item';
    rewardElement.innerHTML = `
      <div class="reward-info">
        <h4>${reward.name}</h4>
        <p>${reward.description}</p>
        <div class="reward-points">${reward.points} points</div>
      </div>
      <button class="redeem-btn" 
              data-reward-id="${reward.id}"
              data-points-cost="${reward.points}"
              ${!canRedeem ? 'disabled' : ''}>
        ${canRedeem ? 'Redeem' : 'Need More Points'}
      </button>
    `;
    
    rewardsGrid.appendChild(rewardElement);
  });
  
  // Add event listeners to redeem buttons
  document.querySelectorAll('.redeem-btn').forEach(btn => {
    btn.addEventListener('click', handleRewardRedemption);
  });
}

function handleRewardRedemption(event) {
  const button = event.target;
  const rewardId = parseInt(button.dataset.rewardId);
  const pointsCost = parseInt(button.dataset.pointsCost);
  
  if (userEcoPoints >= pointsCost) {
    const reward = availableRewards.find(r => r.id === rewardId);
    
    if (reward) {
      userEcoPoints -= pointsCost;
      updateEcoPointsDisplay();
      populateRewardsGrid();
      
      alert(`🎉 Congratulations! You redeemed ${reward.name}!\n${reward.description}\n\nYour voucher code will be sent to your registered email.`);
    }
  }
}

function simulatePointsEarning() {
  // Simulate earning points (in real app, this would be based on actual user activity)
  setInterval(() => {
    // Random points earning simulation
    if (Math.random() > 0.7) {
      const earnedPoints = Math.floor(Math.random() * 20) + 5;
      userEcoPoints += earnedPoints;
      updateEcoPointsDisplay();
      populateRewardsGrid();
      
      // Show notification
      showPointsNotification(earnedPoints);
    }
  }, 30000); // Check every 30 seconds
}

function showPointsNotification(points) {
  // Create a temporary notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #22c55e;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    z-index: 1001;
    animation: slideIn 0.3s ease;
  `;
  notification.innerHTML = `🎉 +${points} Eco Points Earned!`;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function initializeEcoPoints() {
  updateEcoPointsDisplay();
  populateRewardsGrid();
  simulatePointsEarning(); // Remove this in production - points should come from backend
}

/* =========================
5. SIGNUP / LOGIN TAB SWITCH
========================= */

if (switchButtons) {
  switchButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      switchButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;
      if (tab === "signup") {
        signupForm.classList.add("active");
        loginForm.classList.remove("active");
      } else {
        loginForm.classList.add("active");
        signupForm.classList.remove("active");
      }
    });
  });
}

/* =========================
6. PASSWORD STRENGTH LISTENER
========================= */

if (signupPasswordInput && passwordStrengthText) {
  signupPasswordInput.addEventListener("input", () => {
    const { label, className } = evaluatePasswordStrength(
      signupPasswordInput.value
    );

    passwordStrengthText.textContent = `Strength: ${label}`;
    passwordStrengthText.classList.remove(
      "password-strength-weak",
      "password-strength-medium",
      "password-strength-strong"
    );
    if (className) {
      passwordStrengthText.classList.add(className);
    }
  });
}

/* =========================
7. SIGNUP FLOW
========================= */

if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Signup form submitted");

    const name = signupNameInput.value.trim();
    const gender = signupGenderSelect.value;
    const email = signupEmailInput.value.trim();
    const mobile = signupMobileInput.value.trim();
    const password = signupPasswordInput.value;
    const confirmPassword = signupConfirmPasswordInput.value;

    // Basic validation
    if (!name || !gender || !email || !mobile || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (!isValidGmail(email)) {
      alert("Please enter a valid Gmail address (example@gmail.com).");
      signupEmailInput.focus();
      return;
    }

    if (!isValidMobile(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      signupMobileInput.focus();
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      signupConfirmPasswordInput.focus();
      return;
    }

    const strength = evaluatePasswordStrength(password);
    if (strength.label === "Weak") {
      alert(
        "Password is too weak. Use at least 8 characters with uppercase, lowercase, numbers, and special characters."
      );
      signupPasswordInput.focus();
      return;
    }

    // Store user in memory
    registeredUser = { name, gender, email, mobile, password };

    alert(
      `Account created successfully for ${name}!\n\nPlease login with your Gmail or mobile number.`
    );

    // Switch to login tab after successful signup
    if (switchButtons && switchButtons[1]) {
      switchButtons[1].click();
    }
    if (loginIdInput) {
      loginIdInput.value = email;
      loginIdInput.focus();
    }
  });
}

/* =========================
8. LOGIN FLOW
========================= */

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Login form submitted");

    const loginId = loginIdInput.value.trim();
    const password = loginPasswordInput.value;

    if (!loginId || !password) {
      alert("Please enter login ID and password.");
      return;
    }

    if (!registeredUser) {
      alert("Please signup first to create an account.");
      if (switchButtons && switchButtons[0]) {
        switchButtons[0].click();
      }
      return;
    }

    const looksLikeEmail = loginId.includes("@");

    if (looksLikeEmail) {
      if (loginId !== registeredUser.email) {
        alert("Gmail not found. Please use the registered Gmail address.");
        return;
      }
    } else {
      if (loginId !== registeredUser.mobile) {
        alert("Mobile number not found. Please use the registered mobile number.");
        return;
      }
    }

    if (password !== registeredUser.password) {
      alert("Incorrect password.");
      loginPasswordInput.value = "";
      loginPasswordInput.focus();
      return;
    }

    alert(`Welcome back, ${registeredUser.name}!`);
    showLanding(registeredUser.name);
  });
}

/* =========================
9. LANDING PAGE BUTTONS
========================= */

if (trackBusBtn && moreContentSection) {
  trackBusBtn.addEventListener("click", function () {
    moreContentSection.scrollIntoView({ behavior: "smooth" });
  });
}

if (bookTicketBtn) {
  bookTicketBtn.addEventListener("click", function () {
    alert("Book ticket flow to be implemented.");
  });
}

if (swipeDownHint && moreContentSection) {
  swipeDownHint.addEventListener("click", function () {
    moreContentSection.scrollIntoView({ behavior: "smooth" });
  });
}

/* =========================
10. BUS STATUS FORM LOGIC
========================= */

if (busStatusForm && pickupInput && destinationInput && pickupTimeInput) {
  busStatusForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const pickup = pickupInput.value.trim();
    const destination = destinationInput.value.trim();
    const time = pickupTimeInput.value;

    if (!pickup || !destination || !time) {
      alert("Please fill all fields to check bus status.");
      return;
    }

    alert(
      `Demo: searching buses from "${pickup}" to "${destination}" at ${time}. (Map already shows Bhubaneswar region.)`
    );
  });
}

/* =========================
11. ECO POINTS EVENT LISTENERS
========================= */

if (ecoRewardsBtn && ecoRewardsModal) {
  ecoRewardsBtn.addEventListener('click', () => {
    ecoRewardsModal.classList.add('active');
    populateRewardsGrid();
  });
}

if (closeModal) {
  closeModal.addEventListener('click', () => {
    ecoRewardsModal.classList.remove('active');
  });
}

// Close modal when clicking outside
if (ecoRewardsModal) {
  ecoRewardsModal.addEventListener('click', (e) => {
    if (e.target === ecoRewardsModal) {
      ecoRewardsModal.classList.remove('active');
    }
  });
}

/* =========================
12. INITIALIZATION
========================= */

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded and initialized");
  
  // Ensure auth screen is visible and landing page is hidden on load
  if (authScreen) {
    authScreen.style.display = "block";
  }
  if (landingPage) {
    landingPage.style.display = "none";
  }
  
  console.log("Initial screen state: Auth visible, Landing hidden");
});