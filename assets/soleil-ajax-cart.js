/**
 * ============================================================================
 * SOLEIL AJAX CART - JavaScript Functionality for Horizon Theme
 * ============================================================================
 * 
 * Purpose: Enhanced cart functionality with AJAX updates for Soleil sections
 * Author: Senior Shopify Theme Engineer
 * Integration Date: Current
 * 
 * Features:
 * - AJAX add to cart
 * - Cart quantity updates
 * - Item removal
 * - Free shipping progress
 * - Cart drawer management
 * - Error handling
 * 
 * Dependencies:
 * - Shopify Cart API
 * - sections/soleil-mini-cart.liquid
 * 
 * Aquí puedes agregar nueva información al código sin romperlo.
 * ============================================================================
 */

(function() {
  'use strict';

  // START: Cart State Management
  const SoleilCart = {
    // Cart state
    state: {
      cart: null,
      isUpdating: false,
      drawer: null
    },

    // Configuration
    config: {
      cartEndpoint: '/cart.js',
      addEndpoint: '/cart/add.js',
      updateEndpoint: '/cart/update.js',
      changeEndpoint: '/cart/change.js',
      clearEndpoint: '/cart/clear.js'
    },

    /**
     * Initialize cart functionality
     */
    init() {
      try {
        this.state.drawer = document.getElementById('soleil-mini-cart');
        
        if (!this.state.drawer) {
          console.warn('Soleil mini cart not found');
          return;
        }

        this.bindEvents();
        this.fetchCart();
        
        console.log('✓ Soleil AJAX Cart initialized');
      } catch (error) {
        console.error('Soleil Cart initialization error:', error);
      }
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
      // Add to cart buttons
      document.addEventListener('click', (e) => {
        const addButton = e.target.closest('[data-soleil-add-to-cart]');
        if (addButton) {
          e.preventDefault();
          this.handleAddToCart(addButton);
        }
      });

      // Quantity changes
      if (this.state.drawer) {
        this.state.drawer.addEventListener('change', (e) => {
          if (e.target.matches('.soleil-quantity-value')) {
            this.handleQuantityChange(e.target);
          }
        });

        // Quantity buttons
        this.state.drawer.addEventListener('click', (e) => {
          const minusBtn = e.target.closest('.soleil-quantity-minus');
          const plusBtn = e.target.closest('.soleil-quantity-plus');
          const removeBtn = e.target.closest('.soleil-cart-item-remove');

          if (minusBtn) {
            this.handleQuantityButton(minusBtn, -1);
          } else if (plusBtn) {
            this.handleQuantityButton(plusBtn, 1);
          } else if (removeBtn) {
            this.handleRemoveItem(removeBtn);
          }
        });

        // Cart note
        const noteTextarea = this.state.drawer.querySelector('#soleil-cart-note');
        if (noteTextarea) {
          noteTextarea.addEventListener('blur', () => {
            this.updateCartNote(noteTextarea.value);
          });
        }
      }

      // Aquí puedes agregar nueva información al código sin romperlo
    },

    /**
     * Fetch current cart state
     */
    async fetchCart() {
      try {
        const response = await fetch(this.config.cartEndpoint);
        if (!response.ok) throw new Error('Failed to fetch cart');
        
        this.state.cart = await response.json();
        this.updateCartUI();
        
        return this.state.cart;
      } catch (error) {
        console.error('Error fetching cart:', error);
        this.showError('Failed to load cart');
      }
    },

    /**
     * Add item to cart
     */
    async addToCart(variantId, quantity = 1, properties = {}) {
      if (this.state.isUpdating) return;
      
      this.state.isUpdating = true;
      this.showLoading();

      try {
        const response = await fetch(this.config.addEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            id: variantId,
            quantity: quantity,
            properties: properties
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.description || 'Failed to add to cart');
        }

        const item = await response.json();
        await this.fetchCart();
        this.openDrawer();
        this.showSuccess('Added to cart!');
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('soleil:cart:add', {
          detail: { item, cart: this.state.cart }
        }));

        return item;
      } catch (error) {
        console.error('Error adding to cart:', error);
        this.showError(error.message);
      } finally {
        this.state.isUpdating = false;
        this.hideLoading();
      }
    },

    /**
     * Update item quantity
     */
    async updateQuantity(line, quantity) {
      if (this.state.isUpdating) return;
      
      this.state.isUpdating = true;

      try {
        const response = await fetch(this.config.changeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            line: line,
            quantity: Math.max(0, quantity)
          })
        });

        if (!response.ok) throw new Error('Failed to update quantity');

        this.state.cart = await response.json();
        this.updateCartUI();

        // Trigger custom event
        document.dispatchEvent(new CustomEvent('soleil:cart:update', {
          detail: { cart: this.state.cart }
        }));

      } catch (error) {
        console.error('Error updating quantity:', error);
        this.showError('Failed to update quantity');
        await this.fetchCart(); // Revert to actual state
      } finally {
        this.state.isUpdating = false;
      }
    },

    /**
     * Remove item from cart
     */
    async removeItem(key) {
      if (this.state.isUpdating) return;
      
      this.state.isUpdating = true;

      try {
        const response = await fetch(this.config.changeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            id: key,
            quantity: 0
          })
        });

        if (!response.ok) throw new Error('Failed to remove item');

        this.state.cart = await response.json();
        this.updateCartUI();
        this.showSuccess('Item removed');

        // Trigger custom event
        document.dispatchEvent(new CustomEvent('soleil:cart:remove', {
          detail: { cart: this.state.cart }
        }));

      } catch (error) {
        console.error('Error removing item:', error);
        this.showError('Failed to remove item');
      } finally {
        this.state.isUpdating = false;
      }
    },

    /**
     * Update cart note
     */
    async updateCartNote(note) {
      try {
        const response = await fetch(this.config.updateEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ note: note })
        });

        if (!response.ok) throw new Error('Failed to update note');

        this.state.cart = await response.json();
      } catch (error) {
        console.error('Error updating note:', error);
      }
    },

    /**
     * Handle add to cart button click
     */
    handleAddToCart(button) {
      const variantId = button.dataset.variantId || button.dataset.soleilAddToCart;
      const quantity = parseInt(button.dataset.quantity || 1);
      
      if (!variantId) {
        console.error('No variant ID found');
        return;
      }

      this.addToCart(variantId, quantity);
    },

    /**
     * Handle quantity input change
     */
    handleQuantityChange(input) {
      const line = parseInt(input.dataset.line);
      const quantity = parseInt(input.value);
      
      if (isNaN(line) || isNaN(quantity)) return;
      
      this.updateQuantity(line, quantity);
    },

    /**
     * Handle quantity button click
     */
    handleQuantityButton(button, change) {
      const line = parseInt(button.dataset.line);
      const input = this.state.drawer.querySelector(`input[data-line="${line}"]`);
      
      if (!input) return;
      
      const currentQty = parseInt(input.value);
      const newQty = Math.max(1, currentQty + change);
      
      input.value = newQty;
      this.updateQuantity(line, newQty);
    },

    /**
     * Handle remove item button click
     */
    handleRemoveItem(button) {
      const key = button.dataset.key;
      const cartItem = button.closest('.soleil-cart-item');
      
      if (cartItem) {
        cartItem.classList.add('removing');
      }
      
      this.removeItem(key);
    },

    /**
     * Update cart UI
     */
    updateCartUI() {
      if (!this.state.cart || !this.state.drawer) return;

      // Update cart count
      const countElements = document.querySelectorAll('[data-cart-count]');
      countElements.forEach(el => {
        el.textContent = this.state.cart.item_count;
      });

      // Update cart total
      const totalElements = document.querySelectorAll('[data-cart-total]');
      totalElements.forEach(el => {
        el.textContent = this.formatMoney(this.state.cart.total_price);
      });

      // Update free shipping progress
      this.updateShippingProgress();

      // Aquí puedes agregar nueva información al código sin romperlo
    },

    /**
     * Update free shipping progress bar
     */
    updateShippingProgress() {
      const progressBar = this.state.drawer?.querySelector('[data-progress-bar]');
      const message = this.state.drawer?.querySelector('[data-shipping-message]');
      const remainingAmount = this.state.drawer?.querySelector('[data-remaining-amount]');
      
      if (!progressBar || !this.state.cart) return;

      // Get threshold from settings (default $50)
      const threshold = 5000; // $50 in cents
      const progress = Math.min(100, (this.state.cart.total_price / threshold) * 100);
      
      progressBar.style.width = `${progress}%`;

      if (remainingAmount) {
        const remaining = Math.max(0, threshold - this.state.cart.total_price);
        remainingAmount.textContent = this.formatMoney(remaining);
      }
    },

    /**
     * Open cart drawer
     */
    openDrawer() {
      if (!this.state.drawer) return;
      
      this.state.drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      
      // Trigger custom event
      document.dispatchEvent(new CustomEvent('soleil:cart:open'));
    },

    /**
     * Close cart drawer
     */
    closeDrawer() {
      if (!this.state.drawer) return;
      
      this.state.drawer.classList.remove('is-open');
      document.body.style.overflow = '';
      
      // Trigger custom event
      document.dispatchEvent(new CustomEvent('soleil:cart:close'));
    },

    /**
     * Show loading state
     */
    showLoading() {
      // Add loading class to drawer
      this.state.drawer?.classList.add('is-loading');
    },

    /**
     * Hide loading state
     */
    hideLoading() {
      this.state.drawer?.classList.remove('is-loading');
    },

    /**
     * Show success message
     */
    showSuccess(message) {
      console.log('✓', message);
      // Could implement toast notification here
    },

    /**
     * Show error message
     */
    showError(message) {
      console.error('✗', message);
      // Could implement toast notification here
      alert(message); // Fallback
    },

    /**
     * Format money
     */
    formatMoney(cents) {
      const dollars = (cents / 100).toFixed(2);
      return `$${dollars}`;
    }
  };
  // END: Cart State Management

  // START: Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SoleilCart.init());
  } else {
    SoleilCart.init();
  }
  // END: Initialize on DOM ready

  // Expose to window for external access
  window.SoleilCart = SoleilCart;

  // Aquí puedes agregar nueva información al código sin romperlo

})();

/**
 * ============================================================================
 * END OF SOLEIL AJAX CART
 * ============================================================================
 * 
 * Usage Examples:
 * 
 * // Add to cart
 * SoleilCart.addToCart(12345678, 2);
 * 
 * // Open drawer
 * SoleilCart.openDrawer();
 * 
 * // Listen to events
 * document.addEventListener('soleil:cart:add', (e) => {
 *   console.log('Item added:', e.detail);
 * });
 * 
 * Aquí puedes agregar nueva información al código sin romperlo.
 * ============================================================================
 */
