/**
 * ============================================================================
 * SOLEIL INTERACTIONS - Enhanced UI Interactions for Horizon Theme
 * ============================================================================
 * 
 * Purpose: Advanced interactive features for Soleil sections
 * Author: Senior Shopify Theme Engineer
 * Integration Date: Current
 * 
 * Features:
 * - Scroll animations
 * - Intersection Observer
 * - Smooth scrolling
 * - Form validations
 * - Modal management
 * - Accordion functionality
 * 
 * Dependencies:
 * - Modern browser with IntersectionObserver support
 * 
 * Aquí puedes agregar nueva información al código sin romperlo.
 * ============================================================================
 */

(function() {
  'use strict';

  // START: Scroll Animations
  const ScrollAnimations = {
    init() {
      if (!('IntersectionObserver' in window)) {
        // Fallback: show all elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
          el.classList.add('is-visible');
        });
        return;
      }

      const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      }, options);

      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
      });

      console.log('✓ Scroll animations initialized');
    }
  };
  // END: Scroll Animations

  // START: Smooth Scrolling
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href === '#') return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });

      console.log('✓ Smooth scrolling initialized');
    }
  };
  // END: Smooth Scrolling

  // START: Form Validation
  const FormValidation = {
    init() {
      const forms = document.querySelectorAll('[data-soleil-form]');
      
      forms.forEach(form => {
        form.addEventListener('submit', (e) => {
          if (!this.validateForm(form)) {
            e.preventDefault();
          }
        });

        // Real-time validation
        form.querySelectorAll('input, textarea').forEach(field => {
          field.addEventListener('blur', () => {
            this.validateField(field);
          });
        });
      });

      console.log(`✓ Form validation initialized (${forms.length} forms)`);
    },

    validateForm(form) {
      let isValid = true;
      const fields = form.querySelectorAll('[required]');

      fields.forEach(field => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });

      return isValid;
    },

    validateField(field) {
      const value = field.value.trim();
      const type = field.type;
      let isValid = true;
      let message = '';

      // Required check
      if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
      }

      // Email validation
      if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          message = 'Please enter a valid email';
        }
      }

      // Phone validation
      if (type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
          isValid = false;
          message = 'Please enter a valid phone number';
        }
      }

      this.showFieldError(field, isValid, message);
      return isValid;
    },

    showFieldError(field, isValid, message) {
      const wrapper = field.closest('.form-field') || field.parentElement;
      let errorEl = wrapper.querySelector('.field-error');

      if (!isValid) {
        field.classList.add('field-invalid');
        field.classList.remove('field-valid');

        if (!errorEl) {
          errorEl = document.createElement('span');
          errorEl.className = 'field-error';
          wrapper.appendChild(errorEl);
        }
        errorEl.textContent = message;
      } else {
        field.classList.remove('field-invalid');
        field.classList.add('field-valid');
        if (errorEl) {
          errorEl.remove();
        }
      }
    }
  };
  // END: Form Validation

  // START: Modal Management
  const ModalManager = {
    activeModal: null,

    init() {
      // Open modal triggers
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal-open]');
        if (trigger) {
          e.preventDefault();
          const modalId = trigger.dataset.modalOpen;
          this.open(modalId);
        }

        // Close modal triggers
        const closeTrigger = e.target.closest('[data-modal-close]');
        if (closeTrigger) {
          e.preventDefault();
          this.close();
        }

        // Close on overlay click
        if (e.target.classList.contains('modal-overlay')) {
          this.close();
        }
      });

      // Close on ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.activeModal) {
          this.close();
        }
      });

      console.log('✓ Modal manager initialized');
    },

    open(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;

      this.activeModal = modal;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      // Focus first focusable element
      const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) {
        setTimeout(() => focusable.focus(), 100);
      }

      // Trigger custom event
      document.dispatchEvent(new CustomEvent('soleil:modal:open', {
        detail: { modalId }
      }));
    },

    close() {
      if (!this.activeModal) return;

      this.activeModal.classList.remove('is-open');
      document.body.style.overflow = '';

      const modalId = this.activeModal.id;
      this.activeModal = null;

      // Trigger custom event
      document.dispatchEvent(new CustomEvent('soleil:modal:close', {
        detail: { modalId }
      }));
    }
  };
  // END: Modal Management

  // START: Accordion Functionality
  const Accordion = {
    init() {
      const accordions = document.querySelectorAll('[data-accordion]');

      accordions.forEach(accordion => {
        const triggers = accordion.querySelectorAll('[data-accordion-trigger]');

        triggers.forEach(trigger => {
          trigger.addEventListener('click', () => {
            const item = trigger.closest('[data-accordion-item]');
            const content = item.querySelector('[data-accordion-content]');
            const isOpen = item.classList.contains('is-open');

            // Close all if single mode
            if (accordion.dataset.accordion === 'single') {
              accordion.querySelectorAll('[data-accordion-item]').forEach(otherItem => {
                if (otherItem !== item) {
                  otherItem.classList.remove('is-open');
                  const otherContent = otherItem.querySelector('[data-accordion-content]');
                  if (otherContent) {
                    otherContent.style.maxHeight = null;
                  }
                }
              });
            }

            // Toggle current
            if (isOpen) {
              item.classList.remove('is-open');
              content.style.maxHeight = null;
            } else {
              item.classList.add('is-open');
              content.style.maxHeight = content.scrollHeight + 'px';
            }
          });
        });
      });

      console.log(`✓ Accordion initialized (${accordions.length} accordions)`);
    }
  };
  // END: Accordion Functionality

  // START: Lazy Loading Images
  const LazyLoad = {
    init() {
      if (!('IntersectionObserver' in window)) {
        // Fallback: load all images
        document.querySelectorAll('[data-lazy-src]').forEach(img => {
          img.src = img.dataset.lazySrc;
        });
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.lazySrc;
            img.removeAttribute('data-lazy-src');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('[data-lazy-src]').forEach(img => {
        observer.observe(img);
      });

      console.log('✓ Lazy loading initialized');
    }
  };
  // END: Lazy Loading Images

  // START: Tabs Functionality
  const Tabs = {
    init() {
      const tabGroups = document.querySelectorAll('[data-tabs]');

      tabGroups.forEach(group => {
        const triggers = group.querySelectorAll('[data-tab-trigger]');
        const panels = group.querySelectorAll('[data-tab-panel]');

        triggers.forEach(trigger => {
          trigger.addEventListener('click', () => {
            const targetId = trigger.dataset.tabTrigger;

            // Update triggers
            triggers.forEach(t => {
              t.classList.remove('is-active');
              t.setAttribute('aria-selected', 'false');
            });
            trigger.classList.add('is-active');
            trigger.setAttribute('aria-selected', 'true');

            // Update panels
            panels.forEach(panel => {
              if (panel.id === targetId) {
                panel.classList.add('is-active');
                panel.removeAttribute('hidden');
              } else {
                panel.classList.remove('is-active');
                panel.setAttribute('hidden', '');
              }
            });
          });
        });
      });

      console.log(`✓ Tabs initialized (${tabGroups.length} tab groups)`);
    }
  };
  // END: Tabs Functionality

  // START: Initialize All
  const SoleilInteractions = {
    init() {
      try {
        ScrollAnimations.init();
        SmoothScroll.init();
        FormValidation.init();
        ModalManager.init();
        Accordion.init();
        LazyLoad.init();
        Tabs.init();

        console.log('✓ Soleil Interactions initialized');
      } catch (error) {
        console.error('Soleil Interactions initialization error:', error);
      }
    }
  };
  // END: Initialize All

  // START: Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SoleilInteractions.init());
  } else {
    SoleilInteractions.init();
  }
  // END: Auto-initialize on DOM ready

  // Expose to window
  window.SoleilInteractions = SoleilInteractions;

  // Aquí puedes agregar nueva información al código sin romperlo

})();

/**
 * ============================================================================
 * END OF SOLEIL INTERACTIONS
 * ============================================================================
 * 
 * Usage Examples:
 * 
 * // Scroll animations
 * <div class="animate-on-scroll">Content</div>
 * 
 * // Forms
 * <form data-soleil-form>
 *   <input type="email" required>
 * </form>
 * 
 * // Modals
 * <button data-modal-open="my-modal">Open</button>
 * <div id="my-modal" class="modal">...</div>
 * 
 * // Accordions
 * <div data-accordion="single">
 *   <div data-accordion-item>
 *     <button data-accordion-trigger>Title</button>
 *     <div data-accordion-content>Content</div>
 *   </div>
 * </div>
 * 
 * Aquí puedes agregar nueva información al código sin romperlo.
 * ============================================================================
 */
