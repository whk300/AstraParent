/**
 * ClearCutParenting - Professional Website Application
 * Top 0.001% Website Design Implementation
 * Advanced JavaScript with Modern Architecture
 */

class ClearCutParentingApp {
  constructor() {
    this.config = {
      searchDelay: 300,
      scrollThrottle: 16,
      resizeDebounce: 250,
      animationDuration: 300,
      toastDuration: 4000
    };
    
    this.state = {
      isLoaded: false,
      isScrolled: false,
      searchResults: [],
      activeSection: 'pregnancy',
      lastScrollY: 0,
      searchTimeout: null
    };
    
    this.elements = {};
    this.observers = {};
    
    this.init();
  }

  /**
   * Initialize the application
   */
    init() {
    try {
      this.cacheElements();
      this.setupEventListeners();
      this.initializeFeatures();
      this.setupPerformanceOptimizations();
      this.initAccessibility();

      // Mark as initialized
      this.state.isLoaded = true;
      console.log('🚀 ClearCutParenting App initialized successfully');
    } catch (err) {
      console.error('Init error:', err);
    } finally {
      this.safeHideOverlay();  // ensure overlay always goes away
    }
  }

  /**
   * Cache DOM elements for performance
   */
  cacheElements() {
    this.elements = {
      loadingOverlay: document.getElementById('loadingOverlay'),
      stickyHeader: document.getElementById('stickyHeader'),
      searchInput: document.getElementById('searchInput'),
      searchResults: document.getElementById('search-results'),
      toastContainer: document.getElementById('toast-container'),
      navItems: document.querySelectorAll('.nav-item[data-section]'),
      faqItems: document.querySelectorAll('.faq-with-image'),
      storyButtons: document.querySelectorAll('.story-btn'),
      images: document.querySelectorAll('img[loading="lazy"]')
    };
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Scroll events with throttling
    window.addEventListener('scroll', this.throttle(() => {
      this.handleScroll();
    }, this.config.scrollThrottle), { passive: true });

    // Resize events with debouncing
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, this.config.resizeDebounce));

    // Load event
    window.addEventListener('load', () => {
      this.handlePageLoad();
    });

    // Search functionality
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });

      this.elements.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.executeSearch(e.target.value);
        } else if (e.key === 'Escape') {
          this.clearSearch();
        }
      });

      // Click outside to close search results
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-search')) {
          this.hideSearchResults();
        }
      });
    }

    // Navigation click events
    this.elements.navItems.forEach(navItem => {
      navItem.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNavigation(navItem);
      });
    });

    // FAQ item interactions
    this.elements.faqItems.forEach((item, index) => {
      this.setupFAQItemEvents(item, index);
    });

    // Story button events
    this.elements.storyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleStoryAction(e.target.dataset.action);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });
  }

  /**
   * Initialize core features
   */
  initializeFeatures() {
    this.setupStickyHeader();
    this.setupSmoothScrolling();
    this.setupLoadingAnimation();
    this.setupSearchFunctionality();
    this.setupFAQEnhancements();
    this.initAnalytics();
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    const scrollY = window.scrollY;
    const headerHeight = 120;

    // Update sticky header state
    if (scrollY > headerHeight / 2 && !this.state.isScrolled) {
      this.state.isScrolled = true;
      this.elements.stickyHeader?.classList.add('scrolled');
    } else if (scrollY <= headerHeight / 2 && this.state.isScrolled) {
      this.state.isScrolled = false;
      this.elements.stickyHeader?.classList.remove('scrolled');
    }

    // Update active section based on scroll position
    this.updateActiveSection();

    // Store last scroll position
    this.state.lastScrollY = scrollY;
  }

  /**
   * Setup sticky header functionality
   */
  setupStickyHeader() {
    if (!this.elements.stickyHeader) return;

    // Initial setup
    const headerHeight = this.elements.stickyHeader.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    // Add smooth transitions
    this.elements.stickyHeader.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  }
  setupSmoothScrolling() {
    // Already using CSS: scroll-behavior: smooth;
    // Keep this here to avoid runtime errors.
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
  /**
   * Handle search input
   */
  handleSearch(query) {
    // Clear previous timeout
    if (this.state.searchTimeout) {
      clearTimeout(this.state.searchTimeout);
    }

    // Debounce search
    this.state.searchTimeout = setTimeout(() => {
      if (query.trim().length > 2) {
        this.performSearch(query.trim());
      } else {
        this.hideSearchResults();
      }
    }, this.config.searchDelay);
  }

  /**
   * Perform search with real-time highlighting
   */
  performSearch(query) {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
    const results = [];

    // Search through FAQ items
    this.elements.faqItems.forEach((item, index) => {
      const text = item.textContent.toLowerCase();
      const category = item.dataset.category || 'general';
      
      // Check for matches
      const matches = searchTerms.filter(term => text.includes(term));
      
      if (matches.length > 0) {
        const titleElement = item.querySelector('.faq-title');
        const questionElement = item.querySelector('.faq-question');
        
        results.push({
          index,
          category,
          title: titleElement?.textContent || '',
          question: questionElement?.textContent || '',
          relevance: matches.length / searchTerms.length,
          element: item
        });
      }
    });

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    // Update search results
    this.displaySearchResults(results, query);
    
    // Highlight matching FAQ items
    this.highlightSearchMatches(results);

    // Track search event
    this.trackEvent('search', {
      query,
      results_count: results.length,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Display search results dropdown
   */
  displaySearchResults(results, query) {
    if (!this.elements.searchResults) return;

    if (results.length === 0) {
      this.elements.searchResults.innerHTML = `
        <div class="search-result-item no-results">
          <p>No results found for "${query}"</p>
          <small>Try different keywords or browse categories above</small>
        </div>
      `;
    } else {
      const resultsHTML = results.slice(0, 5).map(result => `
        <div class="search-result-item" data-category="${result.category}" data-index="${result.index}">
          <div class="result-category">${result.title}</div>
          <div class="result-question">${result.question}</div>
        </div>
      `).join('');

      this.elements.searchResults.innerHTML = resultsHTML;

      // Add click events to results
      this.elements.searchResults.querySelectorAll('.search-result-item').forEach(item => {
        if (!item.classList.contains('no-results')) {
          item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            this.scrollToFAQItem(index);
            this.hideSearchResults();
          });
        }
      });
    }

    this.showSearchResults();
  }

  /**
   * Show search results dropdown
   */
  showSearchResults() {
    if (this.elements.searchResults) {
      this.elements.searchResults.classList.add('show');
    }
  }

  /**
   * Hide search results dropdown
   */
  hideSearchResults() {
    if (this.elements.searchResults) {
      this.elements.searchResults.classList.remove('show');
    }
  }

  /**
   * Highlight search matches in FAQ items
   */
  highlightSearchMatches(results) {
    // Reset all highlights
    this.elements.faqItems.forEach(item => {
      item.classList.remove('search-highlight');
      item.style.transform = '';
      item.style.boxShadow = '';
    });

    // Highlight matches
    results.forEach(result => {
      result.element.classList.add('search-highlight');
      result.element.style.transform = 'translateY(-3px) scale(1.02)';
      result.element.style.boxShadow = '0 8px 32px rgba(0, 77, 64, 0.2)';
    });

    // Auto-remove highlights after delay
    setTimeout(() => {
      this.clearSearchHighlights();
    }, 5000);
  }

  /**
   * Clear search highlights
   */
  clearSearchHighlights() {
    this.elements.faqItems.forEach(item => {
      item.classList.remove('search-highlight');
      item.style.transform = '';
      item.style.boxShadow = '';
    });
  }

  /**
   * Setup FAQ item interactions
   */
  setupFAQItemEvents(item, index) {
    // Add entrance animation
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    
    // Animate in with delay
    setTimeout(() => {
      item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, index * 150);

    // Click handler
    item.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleFAQClick(item, index);
    });

    // Enhanced hover effects
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-6px) scale(1.02)';
      this.preloadFAQContent(item.dataset.category);
    });

    item.addEventListener('mouseleave', () => {
      if (!item.classList.contains('search-highlight')) {
        item.style.transform = 'translateY(0) scale(1)';
      }
    });

    // Focus events for accessibility
    item.addEventListener('focus', () => {
      item.style.outline = '2px solid var(--primary-color)';
      item.style.outlineOffset = '4px';
    });

    item.addEventListener('blur', () => {
      item.style.outline = '';
      item.style.outlineOffset = '';
    });
  }

  /**
   * Handle FAQ item clicks
   */
  handleFAQClick(item, index) {
    const category = item.dataset.category;
    
    // Add click animation
    item.style.transform = 'scale(0.98)';
    setTimeout(() => {
      item.style.transform = 'translateY(-6px) scale(1.02)';
    }, 150);

    // Show loading state
    this.showToast(`Loading ${category} guidance...`, 'info');

    // Track interaction
    this.trackEvent('faq_click', {
      category,
      index,
      timestamp: new Date().toISOString()
    });

    // Simulate content loading (in real app, this would fetch content)
    setTimeout(() => {
      this.showToast(`${category} content loaded successfully!`, 'success');
    }, 1000);
  }

  /**
   * Handle navigation clicks
   */
  handleNavigation(navItem) {
    const section = navItem.dataset.section;
    
    // Update active state
    this.elements.navItems.forEach(item => {
      item.classList.remove('active');
      item.removeAttribute('aria-current');
    });
    
    navItem.classList.add('active');
    navItem.setAttribute('aria-current', 'page');
    
    // Update state
    this.state.activeSection = section;
    
    // Smooth scroll to relevant FAQ section
    this.scrollToSection(section);
    
    // Track navigation
    this.trackEvent('navigation', {
      section,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Scroll to specific section
   */
  scrollToSection(section) {
    const faqSection = document.getElementById('faq-section');
    if (!faqSection) return;

    const headerHeight = this.elements.stickyHeader?.offsetHeight || 120;
    const targetPosition = faqSection.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Highlight relevant FAQ items
    this.highlightSectionFAQs(section);
  }

  /**
   * Scroll to specific FAQ item
   */
  scrollToFAQItem(index) {
    const faqItem = this.elements.faqItems[index];
    if (!faqItem) return;

    const headerHeight = this.elements.stickyHeader?.offsetHeight || 120;
    const targetPosition = faqItem.offsetTop - headerHeight - 30;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Highlight the specific item
    setTimeout(() => {
      faqItem.style.transform = 'translateY(-6px) scale(1.05)';
      faqItem.style.boxShadow = '0 12px 40px rgba(0, 77, 64, 0.25)';
      
      setTimeout(() => {
        faqItem.style.transform = 'translateY(0) scale(1)';
        faqItem.style.boxShadow = '';
      }, 2000);
    }, 500);
  }

  /**
   * Highlight FAQ items for specific section
   */
  highlightSectionFAQs(section) {
    this.elements.faqItems.forEach(item => {
      if (item.dataset.category === section) {
        item.style.transform = 'translateY(-4px) scale(1.02)';
        item.style.boxShadow = '0 8px 24px rgba(0, 77, 64, 0.15)';
      } else {
        item.style.transform = 'translateY(0) scale(1)';
        item.style.boxShadow = '';
      }
    });

    // Clear highlights after delay
    setTimeout(() => {
      this.elements.faqItems.forEach(item => {
        item.style.transform = 'translateY(0) scale(1)';
        item.style.boxShadow = '';
      });
    }, 3000);
  }

  /**
   * Handle story button actions
   */
  handleStoryAction(action) {
    switch (action) {
      case 'read-more':
        this.showToast('Loading full story...', 'info');
        this.trackEvent('story_read_more', { timestamp: new Date().toISOString() });
        // In real app, this would open modal or navigate to full story
        setTimeout(() => {
          this.showToast('Story loaded! (Demo mode)', 'success');
        }, 1000);
        break;
        
      case 'share-story':
        this.showToast('Opening story submission form...', 'info');
        this.trackEvent('story_share', { timestamp: new Date().toISOString() });
        // In real app, this would open submission form
        setTimeout(() => {
          this.showToast('Form ready! (Demo mode)', 'success');
        }, 800);
        break;
    }
  }

  /**
   * Setup loading animation
   */
  setupLoadingAnimation() {
    if (!this.elements.loadingOverlay) return;

    // Simulate loading time with progressive updates
    const loadingSteps = [
      { delay: 300, text: 'Initializing components...' },
      { delay: 600, text: 'Loading parenting resources...' },
      { delay: 900, text: 'Optimizing experience...' }
    ];

    loadingSteps.forEach(step => {
      setTimeout(() => {
        const textElement = this.elements.loadingOverlay.querySelector('.loading-text');
        if (textElement) {
          textElement.textContent = step.text;
        }
      }, step.delay);
    });

    // Hide loading overlay
    setTimeout(() => {
      this.elements.loadingOverlay.classList.add('fade-out');
      setTimeout(() => {
        if (this.elements.loadingOverlay.parentNode) {
          this.elements.loadingOverlay.parentNode.removeChild(this.elements.loadingOverlay);
        }
      }, 500);
    }, 1200);
  }
  safeHideOverlay() {
    try {
      const overlay = document.getElementById('loadingOverlay');
      if (!overlay) return;
      overlay.classList.add('fade-out');
      setTimeout(() => {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 500);
    } catch (e) {
      // last-ditch: force-remove
      const overlay = document.getElementById('loadingOverlay');
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
  }

  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    // Lazy loading for images
    this.setupLazyLoading();
    
    // Intersection observers
    this.setupIntersectionObservers();
    
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Memory management
    this.setupMemoryManagement();
  }

  /**
   * Setup lazy loading for images
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      this.observers.imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            img.classList.remove('lazy');
            this.observers.imageObserver.unobserve(img);
          }
        });
      }, { threshold: 0.1, rootMargin: '50px' });

      this.elements.images.forEach(img => {
        this.observers.imageObserver.observe(img);
      });
    }
  }

  /**
   * Setup intersection observers for animations
   */
  setupIntersectionObservers() {
    if ('IntersectionObserver' in window) {
      this.observers.animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            this.observers.animationObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      // Observe FAQ items for entrance animations
      this.elements.faqItems.forEach(item => {
        this.observers.animationObserver.observe(item);
      });
    }
  }

  /**
   * Preload critical resources
   */
  preloadCriticalResources() {
    const criticalResources = [
      { rel: 'preload', as: 'font', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap' },
      { rel: 'preload', as: 'font', href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      Object.assign(link, resource);
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  /**
   * Preload FAQ content based on category
   */
  preloadFAQContent(category) {
    // Simulate content preloading
    if (!this.state.preloadedContent) {
      this.state.preloadedContent = new Set();
    }

    if (!this.state.preloadedContent.has(category)) {
      this.state.preloadedContent.add(category);
      console.log(`📋 Preloading content for: ${category}`);
    }
  }

  /**
   * Setup memory management
   */
  setupMemoryManagement() {
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Periodic cleanup
    setInterval(() => {
      this.performPeriodicCleanup();
    }, 300000); // Every 5 minutes
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info', duration = null) {
    if (!this.elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = this.getToastIcon(type);
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close notification">×</button>
      </div>
    `;

    // Add to container
    this.elements.toastContainer.appendChild(toast);

    // Close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.hideToast(toast);
    });

    // Show animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    // Auto-hide
    const hideTimeout = setTimeout(() => {
      this.hideToast(toast);
    }, duration || this.config.toastDuration);

    // Store timeout reference for potential cancellation
    toast.hideTimeout = hideTimeout;
  }

  /**
   * Get appropriate icon for toast type
   */
  getToastIcon(type) {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return icons[type] || icons.info;
  }

  /**
   * Hide toast notification
   */
  hideToast(toast) {
    if (toast.hideTimeout) {
      clearTimeout(toast.hideTimeout);
    }
    
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation(e) {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault();
          this.elements.searchInput?.focus();
          break;
        case '/':
          e.preventDefault();
          this.elements.searchInput?.focus();
          break;
      }
    }

    // Handle escape key
    if (e.key === 'Escape') {
      this.clearSearch();
      document.activeElement?.blur();
    }

    // Handle arrow keys for navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      this.handleArrowKeyNavigation(e);
    }
  }

  /**
   * Handle arrow key navigation in search results
   */
  handleArrowKeyNavigation(e) {
    const searchResults = document.querySelectorAll('.search-result-item:not(.no-results)');
    if (searchResults.length === 0) return;

    const currentFocus = document.activeElement;
    let currentIndex = Array.from(searchResults).indexOf(currentFocus);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % searchResults.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentIndex = currentIndex <= 0 ? searchResults.length - 1 : currentIndex - 1;
    }

    searchResults[currentIndex].focus();
  }

  /**
   * Clear search functionality
   */
  clearSearch() {
    if (this.elements.searchInput) {
      this.elements.searchInput.value = '';
    }
    this.hideSearchResults();
    this.clearSearchHighlights();
  }

  /**
   * Update active section based on scroll position
   */
  updateActiveSection() {
    const faqItems = this.elements.faqItems;
    const scrollY = window.scrollY;
    const headerHeight = this.elements.stickyHeader?.offsetHeight || 120;

    let activeCategory = this.state.activeSection;

    faqItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemTop = rect.top + scrollY - headerHeight - 100;
      const itemBottom = itemTop + rect.height;

      if (scrollY >= itemTop && scrollY < itemBottom) {
        activeCategory = item.dataset.category;
      }
    });

    // Update navigation if changed
    if (activeCategory !== this.state.activeSection) {
      this.state.activeSection = activeCategory;
      this.updateNavigationState(activeCategory);
    }
  }

  /**
   * Update navigation state
   */
  updateNavigationState(activeCategory) {
    this.elements.navItems.forEach(navItem => {
      if (navItem.dataset.section === activeCategory) {
        navItem.classList.add('active');
        navItem.setAttribute('aria-current', 'page');
      } else {
        navItem.classList.remove('active');
        navItem.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Handle page resize
   */
  handleResize() {
    const windowWidth = window.innerWidth;
    
    // Update mobile state
    if (windowWidth < 768) {
      document.body.classList.add('mobile-view');
    } else {
      document.body.classList.remove('mobile-view');
    }

    // Update header height variable
    if (this.elements.stickyHeader) {
      const headerHeight = this.elements.stickyHeader.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }

    // Hide search results on resize
    this.hideSearchResults();
  }

  /**
   * Handle page load completion
   */
  handlePageLoad() {
    document.body.classList.add('loaded');
    this.initAnalytics();
    this.trackEvent('page_load', {
      timestamp: new Date().toISOString(),
      load_time: performance.now()
    });
  }

  /**
   * Initialize accessibility features
   */
  initAccessibility() {
    // Add keyboard navigation hints
    if (this.elements.searchInput) {
      this.elements.searchInput.setAttribute('aria-describedby', 'search-hint');
      
      const searchHint = document.createElement('div');
      searchHint.id = 'search-hint';
      searchHint.className = 'sr-only';
      searchHint.textContent = 'Use Ctrl+K or Cmd+K to focus search. Press Escape to clear.';
      this.elements.searchInput.parentNode.appendChild(searchHint);
    }

    // Enhanced focus management
    this.setupFocusManagement();
    
    // Screen reader announcements
    this.setupScreenReaderSupport();
  }

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    let lastFocusedElement = null;

    document.addEventListener('focusin', (e) => {
      lastFocusedElement = e.target;
    });

    // Trap focus in modals/dialogs when they exist
    this.lastFocusedElement = lastFocusedElement;
  }

  /**
   * Setup screen reader support
   */
  setupScreenReaderSupport() {
    // Announce dynamic content changes
    const announceChange = (message) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    };

    // Store for use in other methods
    this.announceChange = announceChange;
  }

  /**
   * Initialize analytics
   */
  initAnalytics() {
    // Initialize analytics (placeholder for real implementation)
    console.log('📊 Analytics initialized');
    
    // Track initial page view
    this.trackEvent('page_view', {
      page: 'home',
      user_agent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track events for analytics
   */
  trackEvent(eventName, data = {}) {
    // Analytics tracking (placeholder for real implementation)
    const eventData = {
      event: eventName,
      ...data,
      session_id: this.getSessionId(),
      page_url: window.location.href
    };

    console.log(`📈 Event tracked: ${eventName}`, eventData);

    // In production, send to analytics service
    // Example: gtag('event', eventName, data);
    // Example: analytics.track(eventName, data);
  }

  /**
   * Get or create session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('cc_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('cc_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Perform periodic cleanup
   */
  performPeriodicCleanup() {
    // Clear old search highlights
    this.clearSearchHighlights();
    
    // Clean up old toast notifications
    const oldToasts = this.elements.toastContainer?.querySelectorAll('.toast:not(.show)');
    oldToasts?.forEach(toast => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    });

    console.log('🧹 Periodic cleanup completed');
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    // Clear timeouts
    if (this.state.searchTimeout) {
      clearTimeout(this.state.searchTimeout);
    }

    // Disconnect observers
    Object.values(this.observers).forEach(observer => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    });

    // Remove event listeners
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);

    console.log('🧽 Application cleanup completed');
  }

  /**
   * Utility: Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Utility: Debounce function
   */
  debounce(func, wait, immediate = false) {
    let timeout;
    return function(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }

  /**
   * Execute search (when Enter is pressed)
   */
  executeSearch(query) {
    if (!query.trim()) return;

    this.performSearch(query);
    this.showToast(`Searching for: "${query}"`, 'info');
    
    // Track search execution
    this.trackEvent('search_execute', {
      query: query.trim(),
      timestamp: new Date().toISOString()
    });
  }
}

// Additional CSS for search results and toast notifications
const additionalStyles = `
  .search-results {
    background: white;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-medium);
    max-height: 300px;
    overflow-y: auto;
    z-index: 1001;
  }

  .search-result-item {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .search-result-item:last-child {
    border-bottom: none;
  }

  .search-result-item:hover {
    background: var(--secondary-bg);
  }

  .search-result-item.no-results {
    cursor: default;
    color: var(--text-muted);
    text-align: center;
    padding: 20px;
  }

  .result-category {
    font-weight: 600;
    color: var(--primary-color);
    font-size: 0.9rem;
    margin-bottom: 4px;
  }

  .result-question {
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.4;
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 500;
  }

  .toast-icon {
    font-size: 18px;
    flex-shrink: 0;
  }

  .toast-message {
    flex: 1;
  }

  .toast-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: var(--text-muted);
    padding: 0;
    margin-left: 8px;
    transition: color 0.2s ease;
  }

  .toast-close:hover {
    color: var(--text-primary);
  }

  .search-highlight {
    animation: pulse 2s ease-in-out;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }

  .loaded {
    animation: fadeInUp 0.8s ease;
  }

  @media (max-width: 768px) {
    .search-results {
      position: fixed;
      top: var(--header-height);
      left: 5%;
      right: 5%;
      max-height: 50vh;
    }
  }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.clearCutParentingApp = new ClearCutParentingApp();
  });
} else {
  window.clearCutParentingApp = new ClearCutParentingApp();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClearCutParentingApp;
}
