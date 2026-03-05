/**
 * INTEGRATED FROM: Codigo Soleil (Assets/theme.js)
 * INTEGRATION DATE: 2026-02-11
 * CHANGES: Renamed with soleil- prefix to avoid conflicts with Horizon assets
 * NOTE: Uses Codigo Soleil's custom patterns (global IIFE, window.* globals)
 */

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ============================================
// Header Functionality
// ============================================
class Header {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.searchToggle = document.querySelector('#search-toggle');
    this.searchOverlay = document.querySelector('.search-overlay');

    this.lastScrollTop = 0;
    this.scrollThreshold = 100;

    if (this.header) {
      this.init();
    }
  }

  init() {
    this.handleScroll();
    this.handleMobileMenu();
    this.handleSearch();
    this.handleDropdowns();
  }

  handleScroll() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

          if (scrollTop > 50) {
            this.header.classList.add('is-scrolled');
          } else {
            this.header.classList.remove('is-scrolled');
          }

          if (scrollTop > this.scrollThreshold) {
            if (scrollTop > this.lastScrollTop) {
              this.header.classList.add('is-hidden');
            } else {
              this.header.classList.remove('is-hidden');
            }
          } else {
            this.header.classList.remove('is-hidden');
          }

          this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
          ticking = false;
        });

        ticking = true;
      }
    });
  }

  handleMobileMenu() {
    if (!this.mobileMenuToggle || !this.mobileMenu) return;

    this.mobileMenuToggle.addEventListener('click', () => {
      const isOpen = this.mobileMenu.classList.toggle('is-open');
      this.mobileMenuToggle.classList.toggle('is-active');
      document.body.classList.toggle('menu-open', isOpen);

      this.mobileMenuToggle.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!this.mobileMenu.contains(e.target) && !this.mobileMenuToggle.contains(e.target)) {
        this.mobileMenu.classList.remove('is-open');
        this.mobileMenuToggle.classList.remove('is-active');
        document.body.classList.remove('menu-open');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    const submenuToggles = this.mobileMenu.querySelectorAll('.has-submenu > a');
    submenuToggles.forEach((toggle) => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggle.parentElement.classList.toggle('is-open');
      });
    });
  }

  handleSearch() {
    if (!this.searchToggle || !this.searchOverlay) return;

    this.searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.searchOverlay.classList.add('is-open');
      document.body.classList.add('search-open');

      const searchInput = this.searchOverlay.querySelector('input[type="search"]');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 300);
      }
    });

    const closeSearch = this.searchOverlay.querySelector('.search-overlay-close, .search-close');
    if (closeSearch) {
      closeSearch.addEventListener('click', () => {
        this.searchOverlay.classList.remove('is-open');
        document.body.classList.remove('search-open');
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.searchOverlay.classList.contains('is-open')) {
        this.searchOverlay.classList.remove('is-open');
        document.body.classList.remove('search-open');
      }
    });
  }

  handleDropdowns() {
    if (!this.header) return;

    const dropdowns = this.header.querySelectorAll('.has-dropdown');
    dropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector('a');
      toggle.addEventListener('mouseenter', () => {
        dropdown.classList.add('is-open');
      });
      dropdown.addEventListener('mouseleave', () => {
        dropdown.classList.remove('is-open');
      });
    });
  }
}

class Cart {
  constructor() {
    this.cartDrawer = document.querySelector('.mini-cart');
    this.cartToggle = document.querySelector('.cart-toggle');
    this.cartClose = document.querySelector('.mini-cart-close');
    this.cartCount = document.querySelector('.cart-count');

    if (this.cartDrawer) {
      this.init();
    }
  }

  init() {
    this.handleToggle();
    this.handleQuantityChange();
    this.handleRemoveItem();
  }

  handleToggle() {
    if (this.cartToggle) {
      this.cartToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }

    if (this.cartClose) {
      this.cartClose.addEventListener('click', () => {
        this.close();
      });
    }

    const overlay = this.cartDrawer.querySelector('.mini-cart-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        this.close();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.cartDrawer.classList.contains('is-open')) {
        this.close();
      }
    });
  }

  open() {
    this.cartDrawer.classList.add('is-open');
    document.body.classList.add('cart-open');
  }

  close() {
    this.cartDrawer.classList.remove('is-open');
    document.body.classList.remove('cart-open');
  }

  handleQuantityChange() {
    const quantityInputs = this.cartDrawer.querySelectorAll('.quantity-input');

    quantityInputs.forEach((input) => {
      const minusBtn = input.querySelector('.quantity-minus');
      const plusBtn = input.querySelector('.quantity-plus');
      const qtyInput = input.querySelector('input[type="number"]');

      if (minusBtn) {
        minusBtn.addEventListener('click', () => {
          const currentValue = parseInt(qtyInput.value);
          if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
            this.updateCart(qtyInput);
          }
        });
      }

      if (plusBtn) {
        plusBtn.addEventListener('click', () => {
          const currentValue = parseInt(qtyInput.value);
          qtyInput.value = currentValue + 1; // Fixed addition
          this.updateCart(qtyInput);
        });
      }

      if (qtyInput) {
        qtyInput.addEventListener('change', () => {
          this.updateCart(qtyInput);
        });
      }
    });
  }

  handleRemoveItem() {
    const removeButtons = this.cartDrawer.querySelectorAll('.cart-item-remove');

    removeButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const lineItem = button.closest('.cart-item');
        const key = button.dataset.key;
        this.removeItem(key, lineItem);
      });
    });
  }

  async updateCart(input) {
    const line = input.dataset.line;
    const quantity = parseInt(input.value);

    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line, quantity }),
      });
      const cart = await response.json();
      this.refreshCart(cart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }

  async removeItem(key, lineItem) {
    lineItem.style.opacity = '0.5';
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: 0 }),
      });
      const cart = await response.json();
      lineItem.remove();
      this.refreshCart(cart);
    } catch (error) {
      console.error('Error removing item:', error);
      lineItem.style.opacity = '1';
    }
  }

  refreshCart(cart) {
    if (this.cartCount) {
      this.cartCount.textContent = cart.item_count;

      if (cart.item_count > 0) {
        this.cartCount.classList.add('has-items');
      } else {
        this.cartCount.classList.remove('has-items');
      }
    }

    const cartTotal = this.cartDrawer.querySelector('.cart-total-price');
    if (cartTotal) {
      cartTotal.textContent = this.formatMoney(cart.total_price);
    }

    document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
  }

  formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }
}

// Initialize theme components
function init() {
  new Header();
  new Cart();
  // Initialize other components as needed
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();

  // Example: Dynamically apply a color variable to an element
const element = document.querySelector('.my-button');
const yellowColor = getComputedStyle(document.documentElement).getPropertyValue('--color-yellow').trim();
element.style.backgroundColor = yellowColor;

}