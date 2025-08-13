/**
 * ClearCutParenting - Minimalist Design Implementation
 * Optimized JavaScript for Performance and User Experience
 * 
 * Key Features:
 * - Clean, minimalist interactions
 * - Optimized performance with debouncing and throttling
 * - Accessibility-first approach
 * - Progressive enhancement
 */

class MinimalistParentingApp {
  constructor() {
    this.config = {
      searchDelay: 200,
      scrollThrottle: 16,
      resizeDebounce: 150,
      animationDuration: 200,
      toastDuration: 3000
    };
    
    this.state = {
      isLoaded: false,
      isScrolled: false,
      searchResults: [],
      activeSection: 'pregnancy',
      lastScrollY: 0,
      searchTimeout: null,
      isSearching: false
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
      // Performance: Use requestAnimationFrame for initial setup
      requestAnimationFrame(() => {
        this.cacheElements();
        this.setupEventListeners();
        this.initializeFeatures();
        this.setupPerformanceOptimizations();
        this.initAccessibility();
        
        this.state.isLoaded = true;
        console.log('✨ Minimalist ClearCutParenting App initialized');
      });
    } catch (err) {
      console.error('❌ Initialization error:', err);
      this.handleInitError();
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
      navLinks: document.querySelectorAll('.nav-link[data-section]'),
      questionCards: document.querySelectorAll('.question-card'),
      storyButtons: document.querySelectorAll('.story-btn'),
      images: document.querySelectorAll('img[loading="lazy"]')
    };
  }

  /**
   * Setup all event listeners with proper event delegation
   */
  setupEventListeners() {
    // Optimized scroll handling
    this.setupScrollHandling();
    
    // Window events
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, this.config.resizeDebounce), { passive: true });

    window.addEventListener('load', () => {
      this.handlePageLoad();
    }, { once: true });

    // Search functionality
    this.setupSearchHandling();

    // Navigation
    this.setupNavigationHandling();

    // Question cards interaction
    this.setupQuestionCardHandling();

    // Story buttons
    this.setupStoryButtonHandling();

    // Keyboard navigation
    this.setupKeyboardHandling();

    // Click outside handlers
    this.setupClickOutsideHandlers();
  }

  /**
   * Setup scroll handling with optimization
   */
  setupScrollHandling() {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Setup search input handling
   */
  setupSearchHandling() {
    if (!this.elements.searchInput) return;

    this.elements.searchInput.addEventListener('input', (e) => {
      this.handleSearchInput(e.target.value);
    });

    this.elements.searchInput.addEventListener('keydown', (e) => {
      this.handleSearchKeydown(e);
    });

    this.elements.searchInput.addEventListener('focus', () => {
      this.handleSearchFocus();
    });

    this.elements.searchInput.addEventListener('blur', () => {
      // Delay hiding to allow click on results
      setTimeout(() => this.hideSearchResults(), 150);
    });
  }

  /**
   * Setup navigation handling
   */
  setupNavigationHandling() {
    this.elements.navLinks.forEach(navLink => {
      navLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNavigation(navLink);
      });
    });
  }

  /**
   * Setup question card handling
   */
  setupQuestionCardHandling() {
    this.elements.questionCards.forEach((card, index) => {
      // Add entrance animation with minimalist approach
      this.addEntranceAnimation(card, index);

      // Click handler
      card.addEventListener('click', (e) => {
        this.handleQuestionCardClick(card, index);
      });

      // Hover effects - subtle for minimalism
      card.addEventListener('mouseenter', () => {
        this.handleQuestionCardHover(card);
      });

      // Keyboard handling
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleQuestionCardClick(card, index);
        }
      });
    });
  }

  /**
   * Setup story button handling
   */
  setupStoryButtonHandling() {
    this.elements.storyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleStoryAction(e.target.dataset.action);
      });
    });
  }

  /**
   * Setup keyboard handling
   */
  setupKeyboardHandling() {
    document.addEventListener('keydown', (e) => {
      // Search shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.focusSearch();
      }

      if (e.key === 'Escape') {
        this.handleEscapeKey();
      }

      // Arrow key navigation in search
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        this.handleArrowNavigation(e);
      }
    });
  }

  /**
   * Setup click outside handlers
   */
  setupClickOutsideHandlers() {
    document.addEventListener('click', (e) => {
      // Close search results when clicking outside
      if (!e.target.closest('.search-section')) {
        this.hideSearchResults();
      }
    });
  }

  /**
   * Handle scroll events - Minimalist approach
   */
  handleScroll() {
    const scrollY = window.scrollY;
    const threshold = 60; // Reduced threshold for minimalist feel

    // Update header state with subtle transition
    if (scrollY > threshold && !this.state.isScrolled) {
      this.state.isScrolled = true;
      this.elements.stickyHeader?.classList.add('scrolled');
    } else if (scrollY <= threshold && this.state.isScrolled) {
      this.state.isScrolled = false;
      this.elements.stickyHeader?.classList.remove('scrolled');
    }

    // Update active section
    this.updateActiveSection();

    this.state.lastScrollY = scrollY;
  }

  /**
   * Handle search input
   */
  handleSearchInput(query) {
    clearTimeout(this.state.searchTimeout);

    this.state.searchTimeout = setTimeout(() => {
      if (query.trim().length > 1) {
        this.performSearch(query.trim());
      } else {
        this.hideSearchResults();
      }
    }, this.config.searchDelay);
  }

  /**
   * Handle search keydown events
   */
  handleSearchKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = e.target.value.trim();
      if (query) {
        this.executeSearch(query);
      }
    } else if (e.key === 'Escape') {
      this.clearSearch();
    }
  }

  /**
   * Handle search focus
   */
  handleSearchFocus() {
    const query = this.elements.searchInput.value.trim();
    if (query.length > 1) {
      this.performSearch(query);
    }
  }

  /**
   * Perform search with enhanced results
   */
  performSearch(query) {
    if (this.state.isSearching) return;

    this.state.isSearching = true;
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
    const results = [];

    // Search through question cards
    this.elements.questionCards.forEach((card, index) => {
      const text = card.textContent.toLowerCase();
      const category = card.dataset.category || 'general';
      
      const matches = searchTerms.filter(term => text.includes(term));
      
      if (matches.length > 0) {
        const tagElement = card.querySelector('.question-tag');
        const questionElement = card.querySelector('.question-text');
        
        results.push({
          index,
          category,
          tag: tagElement?.textContent || '',
          question: questionElement?.textContent || '',
          relevance: matches.length / searchTerms.length,
          element: card
        });
      }
    });

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    this.displaySearchResults(results, query);
    this.highlightSearchMatches(results);

    this.state.isSearching = false;

    // Analytics
    this.trackEvent('search', {
      query,
      results_count: results.length
    });
  }

  /**
   * Display search results - Minimalist style
   */
  displaySearchResults(results, query) {
    if (!this.elements.searchResults) return;

    if (results.length === 0) {
      this.elements.searchResults.innerHTML = `
        <div class="search-result-item no-results">
          <p><strong>No results found for "${query}"</strong></p>
          <small>Try different keywords or browse the categories above</small>
        </div>
      `;
    } else {
      const resultsHTML = results.slice(0, 5).map(result => `
        <div class="search-result-item" data-category="${result.category}" data-index="${result.index}">
          <div class="result-category">${result.tag}</div>
          <div class="result-question">${result.question}</div>
        </div>
      `).join('');

      this.elements.searchResults.innerHTML = resultsHTML;

      // Add click events
      this.elements.searchResults.querySelectorAll('.search-result-item').forEach(item => {
        if (!item.classList.contains('no-results')) {
          item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            this.scrollToQuestionCard(index);
            this.hideSearchResults();
          });
        }
      });
    }

    this.showSearchResults();
  }

  /**
   * Show search results
   */
  showSearchResults() {
    if (this.elements.searchResults) {
      this.elements.searchResults.classList.add('show');
    }
  }

  /**
   * Hide search results
   */
  hideSearchResults() {
    if (this.elements.searchResults) {
      this.elements.searchResults.classList.remove('show');
    }
  }

  /**
   * Highlight search matches - Subtle for minimalism
   */
  highlightSearchMatches(results) {
    // Clear previous highlights
    this.clearSearchHighlights();

    // Add highlights with subtle animation
    results.forEach((result, index) => {
      setTimeout(() => {
        result.element.style.transform = 'translateY(-2px)';
        result.element.style.boxShadow = '0 4px 12px rgba(45, 90, 39, 0.1)';
        result.element.classList.add('search-highlight');
      }, index * 50); // Faster animation for minimalist feel
    });

    // Auto-clear highlights
    setTimeout(() => {
      this.clearSearchHighlights();
    }, 3000);
  }

  /**
   * Clear search highlights
   */
  clearSearchHighlights() {
    this.elements.questionCards.forEach(card => {
      card.style.transform = '';
      card.style.boxShadow = '';
      card.classList.remove('search-highlight');
    });
  }

  /**
   * Handle navigation clicks
   */
  handleNavigation(navLink) {
    const section = navLink.dataset.section;
    
    // Update active state
    this.elements.navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });
    
    navLink.classList.add('active');
    navLink.setAttribute('aria-current', 'page');
    
    this.state.activeSection = section;
    this.scrollToSection(section);
    
    this.trackEvent('navigation', { section });
  }

  /**
   * Handle question card clicks - Minimalist feedback
   */
  handleQuestionCardClick(card, index) {
    const category = card.dataset.category;
    
    // Subtle click animation
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = '';
    }, 100);

    // Show loading state
    this.showToast(`Loading ${category} guidance...`, 'info');

    // Track interaction
    this.trackEvent('question_click', { category, index });

    // Simulate content loading
    setTimeout(() => {
      this.showToast(`${category} content ready!`, 'success');
    }, 600);
  }

  /**
   * Handle question card hover
   */
  handleQuestionCardHover(card) {
    const category = card.dataset.category;
    // Preload content logic here
    this.preloadContent(category);
  }

  /**
   * Handle story actions
   */
  handleStoryAction(action) {
    switch (action) {
      case 'read-more':
        this.showToast('Opening full story...', 'info');
        this.trackEvent('story_read_more');
        setTimeout(() => {
          this.showToast('Story loaded successfully!', 'success');
        }, 500);
        break;
        
      case 'share-story':
        this.showToast('Opening story form...', 'info');
        this.trackEvent('story_share');
        setTimeout(() => {
          this.showToast('Form ready for submission!', 'success');
        }, 400);
        break;
    }
  }

  /**
   * Add entrance animation to elements - Minimalist approach
   */
  addEntranceAnimation(element, index) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      element.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 50 + 100); // Faster animation for minimalist feel
  }

  /**
   * Scroll to section
   */
  scrollToSection(section) {
    const faqSection = document.getElementById('faq-section');
    if (!faqSection) return;

    const headerHeight = this.elements.stickyHeader?.offsetHeight || 140;
    const targetPosition = faqSection.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    this.highlightSectionCards(section);
  }

  /**
   * Scroll to specific question card
   */
  scrollToQuestionCard(index) {
    const card = this.elements.questionCards[index];
    if (!card) return;

    const headerHeight = this.elements.stickyHeader?.offsetHeight || 140;
    const targetPosition = card.offsetTop - headerHeight - 30;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Subtle highlight
    setTimeout(() => {
      card.style.transform = 'translateY(-3px)';
      card.style.boxShadow = '0 4px 12px rgba(45, 90, 39, 0.15)';
      
      setTimeout(() => {
        card.style.transform = '';
        card.style.boxShadow = '';
      }, 1500);
    }, 400);
  }

  /**
   * Highlight cards for specific section - Minimalist style
   */
  highlightSectionCards(section) {
    this.elements.questionCards.forEach(card => {
      if (card.dataset.category === section) {
        card.style.transform = 'translateY(-2px)';
        card.style.boxShadow = '0 2px 8px rgba(45, 90, 39, 0.1)';
      } else {
        card.style.transform = '';
        card.style.boxShadow = '';
      }
    });

    // Clear highlights
    setTimeout(() => {
      this.elements.questionCards.forEach(card => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    }, 2000);
  }

  /**
   * Update active section based on scroll
   */
  updateActiveSection() {
    const cards = this.elements.questionCards;
    const scrollY = window.scrollY;
    const headerHeight = this.elements.stickyHeader?.offsetHeight || 140;

    let activeCategory = this.state.activeSection;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardTop = rect.top + scrollY - headerHeight - 100;
      const cardBottom = cardTop + rect.height;

      if (scrollY >= cardTop && scrollY < cardBottom) {
        activeCategory = card.dataset.category;
      }
    });

    if (activeCategory !== this.state.activeSection) {
      this.state.activeSection = activeCategory;
      this.updateNavigationState(activeCategory);
    }
  }

  /**
   * Update navigation state
   */
  updateNavigationState(activeCategory) {
    this.elements.navLinks.forEach(navLink => {
      if (navLink.dataset.section === activeCategory) {
        navLink.classList.add('active');
        navLink.setAttribute('aria-current', 'page');
      } else {
        navLink.classList.remove('active');
        navLink.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Focus search input
   */
  focusSearch() {
    if (this.elements.searchInput) {
      this.elements.searchInput.focus();
      this.elements.searchInput.select();
    }
  }

  /**
   * Handle escape key
   */
  handleEscapeKey() {
    this.clearSearch();
    document.activeElement?.blur();
    this.hideSearchResults();
  }

  /**
   * Handle arrow key navigation
   */
  handleArrowNavigation(e) {
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
   * Clear search
   */
  clearSearch() {
    if (this.elements.searchInput) {
      this.elements.searchInput.value = '';
    }
    this.hideSearchResults();
    this.clearSearchHighlights();
  }

  /**
   * Execute search (on Enter)
   */
  executeSearch(query) {
    this.performSearch(query);
    this.showToast(`Searching for: "${query}"`, 'info');
    this.trackEvent('search_execute', { query });
  }

  /**
   * Handle page resize
   */
  handleResize() {
    const windowWidth = window.innerWidth;
    
    // Update mobile state
    document.body.classList.toggle('mobile-view', windowWidth < 768);

    // Hide search results on resize
    this.hideSearchResults();

    // Update header height
    if (this.elements.stickyHeader) {
      const headerHeight = this.elements.stickyHeader.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
  }

  /**
   * Handle page load
   */
  handlePageLoad() {
    document.body.classList.add('loaded');
    this.trackEvent('page_load', {
      load_time: performance.now(),
      viewport: `${window.innerWidth}x${window.innerHeight}`
    });
  }

  /**
   * Handle initialization error
   */
  handleInitError() {
    // Fallback: ensure loading overlay is removed
    setTimeout(() => {
      const overlay = document.getElementById('loadingOverlay');
      if (overlay) overlay.remove();
    }, 1000);

    this.showToast('App initialization completed with warnings', 'warning');
  }

  /**
   * Initialize features
   */
  initializeFeatures() {
    this.setupStickyHeader();
    this.setupLazyLoading();
    this.setupSmoothScrolling();
    this.initAnalytics();
  }

  /**
   * Setup sticky header
   */
  setupStickyHeader() {
    if (!this.elements.stickyHeader) return;

    const headerHeight = this.elements.stickyHeader.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  }

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          const headerHeight = this.elements.stickyHeader?.offsetHeight || 140;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    this.setupLazyLoading();
    this.setupIntersectionObservers();
    this.preloadCriticalResources();
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
      }, { 
        threshold: 0.1, 
        rootMargin: '50px' 
      });

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
            entry.target.style.animation = 'fadeInUp 0.4s ease forwards';
            this.observers.animationObserver.unobserve(entry.target);
          }
        });
      }, { 
        threshold: 0.15 
      });

      // Observe question cards for entrance animations
      this.elements.questionCards.forEach(card => {
        this.observers.animationObserver.observe(card);
      });
    }
  }

  /**
   * Preload critical resources
   */
  preloadCriticalResources() {
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = fontUrl;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  /**
   * Preload content
   */
  preloadContent(category) {
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
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Periodic cleanup every 5 minutes
    setInterval(() => {
      this.performPeriodicCleanup();
    }, 300000);
  }

  /**
   * Show toast notification - Minimalist style
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

    this.elements.toastContainer.appendChild(toast);

    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.hideToast(toast);
    });

    // Show animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto-hide
    const hideTimeout = setTimeout(() => {
      this.hideToast(toast);
    }, duration || this.config.toastDuration);

    toast.hideTimeout = hideTimeout;
  }

  /**
   * Get toast icon - Minimalist icons
   */
  getToastIcon(type) {
    const icons = {
      info: 'ℹ',
      success: '✓',
      warning: '⚠',
      error: '✕'
    };
    return icons[type] || icons.info;
  }

  /**
   * Hide toast
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
    }, 200);
  }

  /**
   * Initialize accessibility
   */
  initAccessibility() {
    // Add search hint
    if (this.elements.searchInput) {
      const searchHint = document.createElement('div');
      searchHint.id = 'search-hint';
      searchHint.className = 'sr-only';
      searchHint.textContent = 'Use Ctrl+K to focus search. Press Escape to clear.';
      this.elements.searchInput.parentNode.appendChild(searchHint);
      this.elements.searchInput.setAttribute('aria-describedby', 'search-hint');
    }

    this.setupFocusManagement();
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

    this.lastFocusedElement = lastFocusedElement;
  }

  /**
   * Setup screen reader support
   */
  setupScreenReaderSupport() {
    this.announceChange = (message) => {
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
  }

  /**
   * Initialize analytics
   */
  initAnalytics() {
    console.log('📊 Analytics initialized');
    
    this.trackEvent('page_view', {
      page: 'home',
      user_agent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track events
   */
  trackEvent(eventName, data = {}) {
    const eventData = {
      event: eventName,
      ...data,
      session_id: this.getSessionId(),
      page_url: window.location.href,
      timestamp: new Date().toISOString()
    };

    console.log(`📈 Event: ${eventName}`, eventData);
    
    // In production: send to analytics service
    // gtag('event', eventName, data);
    // analytics.track(eventName, data);
  }

  /**
   * Get session ID
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
    this.clearSearchHighlights();
    
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
    if (this.state.searchTimeout) {
      clearTimeout(this.state.searchTimeout);
    }

    Object.values(this.observers).forEach(observer => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    });

    console.log('🧽 App cleanup completed');
  }

  /**
   * Throttle utility
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
   * Debounce utility
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
}

// Minimalist styles injection
const minimalistStyles = `
  .search-highlight {
    animation: subtlePulse 1.5s ease-in-out;
  }

  @keyframes subtlePulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.95; }
  }

  .loaded {
    animation: fadeInUp 0.6s ease;
  }

  .question-card {
    transform-origin: center center;
    backface-visibility: hidden;
    perspective: 1000px;
  }

  .question-card:hover {
    transform: translateY(-2px) translateZ(0);
  }

  @media (max-width: 768px) {
    .search-results {
      position: fixed;
      top: 180px;
      left: 16px;
      right: 16px;
      max-height: 50vh;
    }
    
    .toast-container {
      top: 200px;
      right: 16px;
      left: 16px;
    }
    
    .toast {
      max-width: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .question-card,
    .nav-link,
    .story-btn {
      transition: none !important;
    }
    
    .question-card:hover {
      transform: none !important;
    }
  }
`;

// Inject minimalist styles
const styleSheet = document.createElement('style');
styleSheet.textContent = minimalistStyles;
document.head.appendChild(styleSheet);

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.minimalistParentingApp = new MinimalistParentingApp();
  });
} else {
  window.minimalistParentingApp = new MinimalistParentingApp();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MinimalistParentingApp;
}