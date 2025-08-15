// Brittany Chiang Portfolio - Simplified Recreation JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    // Initialize all components
    initScrollSpy();
    initSmoothScrolling();
    initSpotlightEffect();
    initHoverEffects();
    initAccessibility();
    
    console.log('Portfolio initialized');
}

// Navigation scroll spy - updates active nav links based on scroll position
function initScrollSpy() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    let isScrolling = false;
    
    function updateActiveNavLink() {
        if (isScrolling) return;
        
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // If we're at the bottom of the page, activate the last nav item
        if (scrollY + windowHeight >= documentHeight - 50) {
            setActiveNavLink(navLinks[navLinks.length - 1]);
            return;
        }
        
        // Find the current section based on scroll position
        let currentSection = null;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionHeight = rect.height;
            
            // Check if section is in view (with some offset for better UX)
            if (scrollY >= sectionTop - 200 && scrollY < sectionTop + sectionHeight - 200) {
                currentSection = section;
            }
        });
        
        // Update active nav link
        if (currentSection) {
            const targetNavLink = document.querySelector(`a[href="#${currentSection.id}"]`);
            if (targetNavLink && targetNavLink.classList.contains('nav-link')) {
                setActiveNavLink(targetNavLink);
            }
        }
    }
    
    function setActiveNavLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    // Throttled scroll handler for better performance
    let scrollTimeout;
    function handleScroll() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavLink, 10);
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    updateActiveNavLink();
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                isScrolling = true;
                
                // Calculate position accounting for sticky mobile headers
                const offsetTop = targetSection.offsetTop;
                const isMobile = window.innerWidth < 1024;
                const offset = isMobile ? 100 : 50; // More offset on mobile for sticky headers
                
                window.scrollTo({
                    top: offsetTop - offset,
                    behavior: 'smooth'
                });
                
                // Reset scrolling flag after animation completes
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        });
    });
}

// Static spotlight effect
function initSpotlightEffect() {
    const spotlight = document.querySelector('.spotlight-overlay');
    if (!spotlight) return;
    
    // Keep spotlight static at top-left position
    // The CSS already handles this with: radial-gradient(600px circle at 0% 0%, ...)
    // No JavaScript interaction needed for static positioning
    
    console.log('Static spotlight effect initialized at top-left position');
}

// Enhanced hover effects for experience and project cards
function initHoverEffects() {
    // Experience cards
    const experienceList = document.querySelector('.experience-list');
    const experienceCards = document.querySelectorAll('.experience-card');
    
    if (experienceList && experienceCards.length > 0) {
        experienceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (window.innerWidth >= 1024) {
                    experienceCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            otherCard.style.opacity = '0.5';
                        }
                    });
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (window.innerWidth >= 1024) {
                    experienceCards.forEach(otherCard => {
                        otherCard.style.opacity = '';
                    });
                }
            });
        });
    }
    
    // Project cards
    const projectsList = document.querySelector('.projects-list');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (projectsList && projectCards.length > 0) {
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (window.innerWidth >= 1024) {
                    projectCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            otherCard.style.opacity = '0.5';
                        }
                    });
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (window.innerWidth >= 1024) {
                    projectCards.forEach(otherCard => {
                        otherCard.style.opacity = '';
                    });
                }
            });
        });
    }
    
    // Special text effects (Korok seeds rainbow animation)
    const specialText = document.querySelector('.special-text');
    if (specialText) {
        // Add click handler for mobile users to trigger the animation
        specialText.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
        });
    }
}

// Accessibility enhancements
function initAccessibility() {
    // Enhanced focus management
    document.addEventListener('keydown', function(e) {
        // Enable focus-visible for keyboard navigation
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });
    
    // Skip to content link functionality
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#content');
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Announce page navigation to screen readers
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const targetId = this.getAttribute('href').replace('#', '');
            const targetSection = document.querySelector(`#${targetId}`);
            
            if (targetSection) {
                const sectionLabel = targetSection.getAttribute('aria-label') || targetId;
                announceToScreenReader(`Navigated to ${sectionLabel} section`);
            }
        });
    });
    
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.scrollBehavior = 'auto';
    }
}

// Utility function for screen reader announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Handle window resize events
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Reset hover effects on mobile
        if (window.innerWidth < 1024) {
            const cards = document.querySelectorAll('.experience-card, .project-card');
            cards.forEach(card => {
                card.style.opacity = '';
            });
        }
    }, 250);
});

// Intersection Observer for subtle animations (optional enhancement)
function initScrollAnimations() {
    // Only add animations if user hasn't requested reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in effect
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        // Set initial state
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(section);
    });
}

// Initialize scroll animations after page load
window.addEventListener('load', function() {
    setTimeout(initScrollAnimations, 100);
});

// Performance optimization: Intersection Observer for lazy loading images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger loading
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
initLazyLoading();

// Export functions for potential external use
window.portfolioUtils = {
    scrollToSection: function(sectionId) {
        const section = document.querySelector(`#${sectionId}`);
        if (section) {
            const offsetTop = section.offsetTop;
            const offset = window.innerWidth < 1024 ? 100 : 50;
            
            window.scrollTo({
                top: offsetTop - offset,
                behavior: 'smooth'
            });
        }
    },
    
    getCurrentSection: function() {
        const sections = document.querySelectorAll('.section[id]');
        const scrollY = window.scrollY;
        
        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionHeight = rect.height;
            
            if (scrollY >= sectionTop - 200 && scrollY < sectionTop + sectionHeight - 200) {
                return section.id;
            }
        }
        
        return null;
    },
    
    getSpotlightPosition: function() {
        // Spotlight is now static at top-left (0%, 0%)
        return { x: 0, y: 0, position: 'top-left' };
    }
};

// Development helper (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🎨 Portfolio development mode');
    console.log('Available utils:', Object.keys(window.portfolioUtils));
}