/**
 * CP Slider - A flexible, lightweight carousel component
 * Easy to integrate into any HTML site
 */
(function(window) {
    'use strict';

    // Default configuration
    const DEFAULT_CONFIG = {
        containerSelector: '.cp-slider',
        slideSelector: '.cp-slide',
        loop: true,
        autoplay: false,
        autoplayInterval: 3000,
        slidesPerView: {
            desktop: 1,
            tablet: 1,
            mobile: 1
        },
        breakpoints: {
            mobile: 576,
            tablet: 992
        },
        transition: {
            duration: '1s',
            easing: 'ease-in-out'
        },
        navigation: {
            show: true,
            prevText: '←',
            nextText: '→',
            containerClass: 'cp-slider-nav'
        },
        pagination: {
            show: false,
            containerClass: 'cp-slider-pagination'
        },
        classes: {
            container: 'cp-slider',
            track: 'cp-slider-track',
            slide: 'cp-slide',
            navContainer: 'cp-slider-nav',
            prevButton: 'cp-slider-prev',
            nextButton: 'cp-slider-next',
            disabled: 'cp-slider-disabled',
            active: 'cp-slider-active'
        }
    };

    /**
     * CP Slider Class
     */
    class CPSlider {
        constructor(selector, options = {}) {
            this.config = this.mergeConfig(DEFAULT_CONFIG, options);
            this.container = document.querySelector(selector);
            
            if (!this.container) {
                console.error(`CP Slider: Container "${selector}" not found`);
                return;
            }

            this.track = this.container.querySelector(this.config.slideSelector).parentElement;
            this.slides = Array.from(this.container.querySelectorAll(this.config.slideSelector));
            this.currentIndex = 0;
            this.isTransitioning = false;
            this.autoplayTimer = null;

            this.init();
        }

        mergeConfig(defaultConfig, userConfig) {
            const merged = { ...defaultConfig };
            
            // Deep merge for nested objects
            for (const key in userConfig) {
                if (typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key])) {
                    merged[key] = { ...merged[key], ...userConfig[key] };
                } else {
                    merged[key] = userConfig[key];
                }
            }
            
            return merged;
        }

        init() {
            this.setupSlides();
            this.setupNavigation();
            this.setupPagination();
            this.setupEvents();
            
            if (this.config.loop) {
                this.setupLoop();
            }

            if (this.config.autoplay) {
                this.startAutoplay();
            }

            // Emit initialized event
            this.emitEvent('initialized', { slider: this });
        }

        setupSlides() {
            const slidesPerView = this.getCurrentSlidesPerView();
            const slideWidth = 100 / slidesPerView;

            this.slides.forEach((slide, index) => {
                slide.style.flex = `0 0 ${slideWidth}%`;
                slide.style.width = `${slideWidth}%`;
                slide.setAttribute('data-slide-index', index);
            });

            this.track.style.display = 'flex';
            this.track.style.transition = `transform ${this.config.transition.duration} ${this.config.transition.easing}`;
        }

        setupNavigation() {
            if (!this.config.navigation.show) return;

            // Create navigation container
            const navContainer = document.createElement('div');
            navContainer.className = this.config.classes.navContainer;

            // Create previous button
            const prevButton = document.createElement('button');
            prevButton.className = this.config.classes.prevButton;
            prevButton.innerHTML = this.config.navigation.prevText;
            prevButton.setAttribute('aria-label', 'Previous slide');

            // Create next button
            const nextButton = document.createElement('button');
            nextButton.className = this.config.classes.nextButton;
            nextButton.innerHTML = this.config.navigation.nextText;
            nextButton.setAttribute('aria-label', 'Next slide');

            // Append to container
            navContainer.appendChild(prevButton);
            navContainer.appendChild(nextButton);
            this.container.appendChild(navContainer);

            // Store references
            this.prevButton = prevButton;
            this.nextButton = nextButton;

            this.updateNavigationState();
        }

        setupPagination() {
            if (!this.config.pagination.show) return;

            const paginationContainer = document.createElement('div');
            paginationContainer.className = this.config.classes.pagination;

            this.slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = this.config.classes.pagination + '-dot';
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => this.goToSlide(index));
                paginationContainer.appendChild(dot);
            });

            this.container.appendChild(paginationContainer);
            this.paginationDots = paginationContainer.querySelectorAll('.cp-slider-pagination-dot');
            this.updatePagination();
        }

        setupEvents() {
            // Navigation events
            if (this.prevButton) {
                this.prevButton.addEventListener('click', () => this.prev());
            }

            if (this.nextButton) {
                this.nextButton.addEventListener('click', () => this.next());
            }

            // Transition end event
            this.track.addEventListener('transitionend', (e) => {
                if (e.propertyName === 'transform') {
                    this.isTransitioning = false;
                    this.handleTransitionEnd();
                }
            });

            // Keyboard navigation
            this.container.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            });

            // Touch events for mobile
            this.setupTouchEvents();

            // Pause autoplay on hover
            if (this.config.autoplay) {
                this.container.addEventListener('mouseenter', () => this.stopAutoplay());
                this.container.addEventListener('mouseleave', () => {
                    if (this.config.autoplay) this.startAutoplay();
                });
            }

            // Window resize
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => this.handleResize(), 250);
            });
        }

        setupTouchEvents() {
            let startX = 0;
            let endX = 0;
            let isDragging = false;

            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                this.stopAutoplay();
            });

            this.track.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                endX = e.touches[0].clientX;
            });

            this.track.addEventListener('touchend', () => {
                if (!isDragging) return;
                isDragging = false;

                const diff = startX - endX;
                const threshold = 50;

                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        this.next();
                    } else {
                        this.prev();
                    }
                }

                if (this.config.autoplay) {
                    this.startAutoplay();
                }
            });
        }

        setupLoop() {
            if (this.slides.length < 2) return;

            // Clone first and last slides
            const firstClone = this.slides[0].cloneNode(true);
            const lastClone = this.slides[this.slides.length - 1].cloneNode(true);

            firstClone.setAttribute('data-clone', 'first');
            lastClone.setAttribute('data-clone', 'last');

            this.track.appendChild(firstClone);
            this.track.insertBefore(lastClone, this.slides[0]);

            // Update slides array
            this.slides = Array.from(this.track.querySelectorAll(this.config.slideSelector));

            // Start at first real slide
            this.currentIndex = 1;
            this.updateSliderPosition(false);
        }

        getCurrentSlidesPerView() {
            const width = window.innerWidth;
            
            if (width <= this.config.breakpoints.mobile) {
                return this.config.slidesPerView.mobile;
            } else if (width <= this.config.breakpoints.tablet) {
                return this.config.slidesPerView.tablet;
            } else {
                return this.config.slidesPerView.desktop;
            }
        }

        prev() {
            if (this.isTransitioning) return;

            if (this.config.loop) {
                this.currentIndex--;
                this.updateSliderPosition();
            } else {
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                    this.updateSliderPosition();
                }
            }

            this.emitEvent('slideChange', { 
                direction: 'prev', 
                index: this.getRealIndex(),
                slider: this 
            });
        }

        next() {
            if (this.isTransitioning) return;

            if (this.config.loop) {
                this.currentIndex++;
                this.updateSliderPosition();
            } else {
                if (this.currentIndex < this.slides.length - 1) {
                    this.currentIndex++;
                    this.updateSliderPosition();
                }
            }

            this.emitEvent('slideChange', { 
                direction: 'next', 
                index: this.getRealIndex(),
                slider: this 
            });
        }

        goToSlide(index) {
            if (this.isTransitioning || index === this.getRealIndex()) return;

            if (this.config.loop) {
                this.currentIndex = index + 1;
            } else {
                this.currentIndex = index;
            }

            this.updateSliderPosition();
            this.emitEvent('slideChange', { 
                direction: 'goto', 
                index: this.getRealIndex(),
                slider: this 
            });
        }

        updateSliderPosition(animate = true) {
            if (!animate) {
                this.track.style.transition = 'none';
            } else {
                this.track.style.transition = `transform ${this.config.transition.duration} ${this.config.transition.easing}`;
                this.isTransitioning = true;
            }

            const slideWidth = 100 / this.getCurrentSlidesPerView();
            const offset = -this.currentIndex * slideWidth;
            this.track.style.transform = `translateX(${offset}%)`;

            this.updateNavigationState();
            this.updatePagination();
        }

        handleTransitionEnd() {
            if (!this.config.loop) return;

            const currentSlide = this.slides[this.currentIndex];
            
            // Handle loop boundaries
            if (currentSlide.getAttribute('data-clone') === 'last') {
                this.currentIndex = this.slides.length - 2;
                this.updateSliderPosition(false);
            } else if (currentSlide.getAttribute('data-clone') === 'first') {
                this.currentIndex = 1;
                this.updateSliderPosition(false);
            }
        }

        getRealIndex() {
            if (!this.config.loop) {
                return this.currentIndex;
            }

            // Convert loop index to real index
            if (this.currentIndex === 0) {
                return this.slides.length - 3; // Last real slide
            } else if (this.currentIndex === this.slides.length - 1) {
                return 0; // First real slide
            } else {
                return this.currentIndex - 1;
            }
        }

        updateNavigationState() {
            if (!this.prevButton || !this.nextButton) return;

            if (this.config.loop) {
                // Loop mode - buttons always enabled
                this.prevButton.classList.remove(this.config.classes.disabled);
                this.nextButton.classList.remove(this.config.classes.disabled);
                this.prevButton.disabled = false;
                this.nextButton.disabled = false;
            } else {
                // Non-loop mode - disable at boundaries
                if (this.currentIndex <= 0) {
                    this.prevButton.classList.add(this.config.classes.disabled);
                    this.prevButton.disabled = true;
                } else {
                    this.prevButton.classList.remove(this.config.classes.disabled);
                    this.prevButton.disabled = false;
                }

                if (this.currentIndex >= this.slides.length - 1) {
                    this.nextButton.classList.add(this.config.classes.disabled);
                    this.nextButton.disabled = true;
                } else {
                    this.nextButton.classList.remove(this.config.classes.disabled);
                    this.nextButton.disabled = false;
                }
            }
        }

        updatePagination() {
            if (!this.paginationDots) return;

            const realIndex = this.getRealIndex();
            this.paginationDots.forEach((dot, index) => {
                if (index === realIndex) {
                    dot.classList.add(this.config.classes.active);
                } else {
                    dot.classList.remove(this.config.classes.active);
                }
            });
        }

        startAutoplay() {
            if (this.autoplayTimer) return;

            this.autoplayTimer = setInterval(() => {
                this.next();
            }, this.config.autoplayInterval);
        }

        stopAutoplay() {
            if (this.autoplayTimer) {
                clearInterval(this.autoplayTimer);
                this.autoplayTimer = null;
            }
        }

        handleResize() {
            this.setupSlides();
            this.updateSliderPosition(false);
        }

        emitEvent(eventName, data) {
            const event = new CustomEvent(`cpslider:${eventName}`, { 
                detail: data,
                bubbles: true 
            });
            this.container.dispatchEvent(event);
        }

        // Public API methods
        destroy() {
            this.stopAutoplay();
            
            // Remove event listeners
            this.prevButton?.removeEventListener('click', this.prev);
            this.nextButton?.removeEventListener('click', this.next);
            
            // Remove generated elements
            this.container.querySelector(`.${this.config.classes.navContainer}`)?.remove();
            this.container.querySelector(`.${this.config.classes.pagination}`)?.remove();
            
            // Reset styles
            this.track.style.cssText = '';
            this.slides.forEach(slide => {
                slide.style.cssText = '';
                slide.removeAttribute('data-slide-index');
                slide.removeAttribute('data-clone');
            });

            // Remove cloned slides
            this.track.querySelectorAll('[data-clone]').forEach(clone => clone.remove());

            this.emitEvent('destroyed', { slider: this });
        }

        updateConfig(newConfig) {
            this.config = this.mergeConfig(this.config, newConfig);
            this.handleResize();
            
            if (this.config.autoplay && !this.autoplayTimer) {
                this.startAutoplay();
            } else if (!this.config.autoplay && this.autoplayTimer) {
                this.stopAutoplay();
            }
        }
    }

    // Export to global scope
    window.CPSlider = CPSlider;

    // Auto-initialization function for backward compatibility
    window.cpSlider = function(selector, options) {
        return new CPSlider(selector, options);
    };

    // Auto-initialize if data-cp-slider attribute exists
    document.addEventListener('DOMContentLoaded', () => {
        const sliders = document.querySelectorAll('[data-cp-slider]');
        sliders.forEach(element => {
            const selector = element.getAttribute('data-cp-slider') || '.' + element.className.split(' ')[0];
            const config = element.getAttribute('data-cp-config');
            const options = config ? JSON.parse(config) : {};
            new CPSlider(selector, options);
        });
    });

})(window);
