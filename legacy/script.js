// ============================================
// Scroll-based Interactions & Highlighting
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Smooth Scrolling for Navigation
    // ============================================
    
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ============================================
    // Section 2: Gap Section - Scroll Highlighting
    // ============================================
    
    const gapSection = document.querySelector('#gap');
    const gapSteps = document.querySelectorAll('.path-step');
    const gapTextBlocks = document.querySelectorAll('.text-block');
    
    if (gapSection) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.3
        };
        
        const gapObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Highlight steps based on scroll position
                    const scrollProgress = getScrollProgress(gapSection);
                    
                    gapSteps.forEach((step, index) => {
                        step.classList.remove('active');
                        if (scrollProgress > index * 0.25 && scrollProgress <= (index + 1) * 0.25) {
                            step.classList.add('active');
                        }
                    });
                    
                    gapTextBlocks.forEach((block, index) => {
                        block.classList.remove('active');
                        if (scrollProgress > index * 0.33 && scrollProgress <= (index + 1) * 0.33) {
                            block.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        gapObserver.observe(gapSection);
    }
    
    // ============================================
    // Section 3: Horizons - Highlight on Scroll
    // ============================================
    
    const portfolioSection = document.querySelector('#portfolio');
    const horizons = document.querySelectorAll('.horizon');
    const horizonBlocks = document.querySelectorAll('.horizon-block');
    
    if (portfolioSection) {
        const portfolioObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const scrollProgress = getScrollProgress(portfolioSection);
                    
                    horizons.forEach((horizon, index) => {
                        horizon.classList.remove('active');
                        if (scrollProgress > index * 0.33 && scrollProgress <= (index + 1) * 0.33) {
                            horizon.classList.add('active');
                        }
                    });
                    
                    horizonBlocks.forEach((block, index) => {
                        block.classList.remove('active');
                        if (scrollProgress > index * 0.33 && scrollProgress <= (index + 1) * 0.33) {
                            block.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        portfolioObserver.observe(portfolioSection);
    }
    
    // ============================================
    // Section 4: SPTSi - Step Highlighting
    // ============================================
    
    const executionSection = document.querySelector('#execution');
    const sptsiSteps = document.querySelectorAll('.sptsi-step');
    const sptsiContents = document.querySelectorAll('.sptsi-content');
    
    if (executionSection) {
        const executionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const scrollProgress = getScrollProgress(executionSection);
                    
                    sptsiSteps.forEach((step, index) => {
                        step.classList.remove('active');
                        if (scrollProgress > index * 0.25 && scrollProgress <= (index + 1) * 0.25) {
                            step.classList.add('active');
                        }
                    });
                    
                    sptsiContents.forEach((content, index) => {
                        content.classList.remove('active');
                        if (scrollProgress > index * 0.25 && scrollProgress <= (index + 1) * 0.25) {
                            content.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        executionObserver.observe(executionSection);
    }
    
    // ============================================
    // Section 5: 5P - Highlight on Hover/Scroll
    // ============================================
    
    const pItems = document.querySelectorAll('.p-item');
    
    pItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            pItems.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // ============================================
    // Fixed CTA Button - Scroll to Top
    // ============================================
    
    const ctaButton = document.querySelector('.cta-fixed');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ============================================
    // Utility Functions
    // ============================================
    
    function getScrollProgress(section) {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        
        // Calculate progress (0 to 1)
        let progress = 1 - (sectionTop / (windowHeight - sectionHeight));
        progress = Math.max(0, Math.min(1, progress));
        
        return progress;
    }
    
    // ============================================
    // Navbar Background on Scroll
    // ============================================
    
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // ============================================
    // Animate on Scroll (Fade In)
    // ============================================
    
    const animateElements = document.querySelectorAll('.text-block, .horizon-block, .sptsi-content, .metric-block, .resource-card');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s, transform 0.5s';
        fadeObserver.observe(el);
    });
    
});
