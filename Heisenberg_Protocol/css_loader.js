/**
 * Dynamic CSS Loader
 * This script dynamically loads CSS files for web pages
 */

(function () {
    'use strict';

    /**
     * Loads a CSS file dynamically
     * @param {string} cssPath - Path to the CSS file
     * @param {string} id - Optional ID for the link element
     * @returns {Promise} Promise that resolves when CSS is loaded
     */
    function loadCSS(cssPath, id) {
        return new Promise((resolve, reject) => {
            // Check if CSS is already loaded
            if (id && document.getElementById(id)) {
                resolve();
                return;
            }

            // Create link element
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cssPath;

            if (id) {
                link.id = id;
            }

            // Add load and error handlers
            link.onload = function () {
                console.log('CSS loaded successfully:', cssPath);
                resolve();
            };

            link.onerror = function () {
                console.warn('Failed to load CSS:', cssPath);
                reject(new Error(`Failed to load CSS: ${cssPath}`));
            };

            // Append to head
            document.head.appendChild(link);
        });
    }

    /**
     * Auto-loads page-specific CSS based on current page name
     */
    async function autoLoadPageCSS() {
        // Get current page name from URL
        const path = window.location.pathname;
        const pageName = path.split('/').pop().replace('.html', '');

        if (pageName && pageName !== '') {
            // Try to load page-specific CSS
            const cssPath = `./${pageName}.css`;
            try {
                await loadCSS(cssPath, `page-css-${pageName}`);
                console.log(`Page-specific CSS loaded for: ${pageName}`);
            } catch (error) {
                // Page-specific CSS doesn't exist, which is normal
                console.log(`No page-specific CSS found for: ${pageName}`);
            }
        }
    }

    /**
     * Loads generic/common CSS files
     */
    async function loadGenericCSS() {
        // Common CSS file names to try
        const commonCSSFiles = [
            'style.css',
        ];

        for (let i = 0; i < commonCSSFiles.length; i++) {
            const cssFile = commonCSSFiles[i];
            try {
                await loadCSS(`./${cssFile}`, `generic-css-${i}`);
                console.log(`Generic CSS loaded: ${cssFile}`);
                break; // Stop after first successful load
            } catch (error) {
                // Continue to next file
                continue;
            }
        }
    }

    /**
     * Initialize CSS loading when DOM is ready
     */
    function init() {
        const loadAllCSS = async () => {
            try {
                // Load generic CSS first
                await loadGenericCSS();
                // Then load page-specific CSS
                await autoLoadPageCSS();
                console.log('CSS loading complete');
            } catch (error) {
                console.error('Error during CSS loading:', error);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadAllCSS);
        } else {
            loadAllCSS();
        }
    }

    // Expose public API
    window.CSSLoader = {
        load: loadCSS,
        autoLoad: autoLoadPageCSS,
        loadGeneric: loadGenericCSS,
        init: init
    };

    // Auto-initialize
    init();
})();
