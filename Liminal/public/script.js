// ===================================
// FIN-FORGE - Production JavaScript
// ===================================

// State Management
let currentPage = 0;
let mobileMenuOpen = false;
let soundEnabled = true;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupScrollObserver();
    setupKeyboardNavigation();
});

// Initialize Application
function initializeApp() {
    console.log('Fin-Forge initialized');
    updateActiveNav();
}

// Navigation Functions
function scrollToPage(index) {
    currentPage = index;
    const pageElement = document.getElementById(`page-${index}`);
    
    if (pageElement) {
        pageElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    updateActiveNav();
    
    // Close mobile menu if open
    if (mobileMenuOpen) {
        toggleMobileMenu();
    }
}

function updateActiveNav() {
    // Update desktop nav buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach((button, index) => {
        if (index === currentPage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update mobile nav buttons
    const mobileNavButtons = document.querySelectorAll('.mobile-nav-button');
    mobileNavButtons.forEach((button, index) => {
        if (index === currentPage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update page dots
    const pageDots = document.querySelectorAll('.page-dot');
    pageDots.forEach((dot, index) => {
        if (index === currentPage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    const mobileMenu = document.getElementById('mobileMenu');
    const menuButton = document.getElementById('mobileMenuButton');
    const menuIcon = menuButton.querySelector('.menu-icon');
    const closeIcon = menuButton.querySelector('.close-icon');
    
    if (mobileMenuOpen) {
        mobileMenu.classList.add('open');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        menuButton.classList.add('active');
    } else {
        mobileMenu.classList.remove('open');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        menuButton.classList.remove('active');
    }
}

// Sound Toggle
function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundToggle = document.getElementById('soundToggle');
    const soundOn = soundToggle.querySelector('.sound-on');
    const soundOff = soundToggle.querySelector('.sound-off');
    
    if (soundEnabled) {
        soundOn.classList.remove('hidden');
        soundOff.classList.add('hidden');
        soundToggle.style.color = '#FFD700';
    } else {
        soundOn.classList.add('hidden');
        soundOff.classList.remove('hidden');
        soundToggle.style.color = '#6b7280';
    }
    
    // Update mobile sound button text
    const mobileControlButtons = document.querySelectorAll('.mobile-control-button');
    if (mobileControlButtons[0]) {
        const buttonText = mobileControlButtons[0].querySelector('span');
        if (buttonText) {
            buttonText.textContent = soundEnabled ? 'Sound On' : 'Sound Off';
        }
    }
}

// Achievements Modal
function openAchievements() {
    const modal = document.getElementById('achievementsModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeAchievements() {
    const modal = document.getElementById('achievementsModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

// Close modal on outside click
document.addEventListener('click', function(event) {
    const modal = document.getElementById('achievementsModal');
    if (modal && event.target === modal) {
        closeAchievements();
    }
});

// Scroll Observer for auto-updating current page
function setupScrollObserver() {
    const pages = document.querySelectorAll('.page');
    
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pageId = entry.target.id;
                const pageIndex = parseInt(pageId.split('-')[1]);
                if (!isNaN(pageIndex)) {
                    currentPage = pageIndex;
                    updateActiveNav();
                }
            }
        });
    }, observerOptions);
    
    pages.forEach(page => {
        observer.observe(page);
    });
}

// Keyboard Navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        // Arrow Down or Page Down - next page
        if (event.key === 'ArrowDown' || event.key === 'PageDown') {
            event.preventDefault();
            if (currentPage < 6) {
                scrollToPage(currentPage + 1);
            }
        }
        // Arrow Up or Page Up - previous page
        else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
            event.preventDefault();
            if (currentPage > 0) {
                scrollToPage(currentPage - 1);
            }
        }
        // Home - go to first page
        else if (event.key === 'Home') {
            event.preventDefault();
            scrollToPage(0);
        }
        // End - go to last page
        else if (event.key === 'End') {
            event.preventDefault();
            scrollToPage(6);
        }
        // Escape - close modal/mobile menu
        else if (event.key === 'Escape') {
            if (mobileMenuOpen) {
                toggleMobileMenu();
            }
            closeAchievements();
        }
        // Number keys 1-7 - go to specific page
        else if (event.key >= '1' && event.key <= '7') {
            const pageIndex = parseInt(event.key) - 1;
            scrollToPage(pageIndex);
        }
    });
}

// Smooth scroll behavior for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add hover sound effects (optional - requires audio files)
function playHoverSound() {
    if (soundEnabled) {
        // Placeholder for sound effect
        // const audio = new Audio('sounds/hover.mp3');
        // audio.volume = 0.2;
        // audio.play();
    }
}

function playClickSound() {
    if (soundEnabled) {
        // Placeholder for sound effect
        // const audio = new Audio('sounds/click.mp3');
        // audio.volume = 0.3;
        // audio.play();
    }
}

// Add click sound to all buttons
document.addEventListener('DOMContentLoaded', function() {
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('click', playClickSound);
    });
});

// Parallax effect for background elements
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.radial-glow');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll handler
window.addEventListener('scroll', throttle(function() {
    // Additional scroll-based animations can go here
}, 100));

// Intersection Observer for fade-in animations
const fadeInObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
        }
    });
}, {
    threshold: 0.1
});

// Observe elements that should fade in
document.querySelectorAll('.problem-card, .solution-card, .forge-card').forEach(el => {
    fadeInObserver.observe(el);
});

// Console welcome message
console.log('%c🔥 Welcome to Fin-Forge! 🔥', 'font-size: 20px; font-weight: bold; color: #FFD700;');
console.log('%cGamified Financial Education Platform', 'font-size: 14px; color: #9ca3af;');
console.log('%cKeyboard shortcuts:', 'font-size: 12px; color: #FFD700; margin-top: 10px;');
console.log('%c↑/↓ - Navigate pages', 'font-size: 11px; color: #9ca3af;');
console.log('%c1-7 - Jump to specific page', 'font-size: 11px; color: #9ca3af;');
console.log('%cHome/End - First/Last page', 'font-size: 11px; color: #9ca3af;');
console.log('%cEsc - Close modals', 'font-size: 11px; color: #9ca3af;');

// Prevent default drag behavior on images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
});

// Add loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    console.log('✅ Fin-Forge fully loaded');
});

// Export functions for inline event handlers
window.scrollToPage = scrollToPage;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleSound = toggleSound;
window.openAchievements = openAchievements;
window.closeAchievements = closeAchievements;
