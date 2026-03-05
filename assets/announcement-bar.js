class AnnouncementBar extends HTMLElement {
  constructor() {
    super();
    this.messagesContainer = this.querySelector('[data-announcement-messages]');
    this.messages = Array.from(
      this.querySelectorAll('[data-announcement-message]')
    );
    this.closeButton = this.querySelector('[data-announcement-close]');
    this.storageKey = this.dataset.storageKey || 'announcement_closed';
    this.currentIndex = 0;
    this.interval = null;
  }

  connectedCallback() {
    if (!this.messages.length) return;

    // Si está cerrado en localStorage, no mostrar
    if (window.localStorage.getItem(this.storageKey) === 'true') {
      this.style.display = 'none';
      this.updateAnnouncementHeight(0);
      return;
    }

    this.initMessages();
    this.updateAnnouncementHeight();
    this.startRotation();

    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.handleClose());
    }

    window.addEventListener('resize', () => this.updateAnnouncementHeight());
  }

  disconnectedCallback() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
    window.removeEventListener('resize', () => this.updateAnnouncementHeight());
  }

  initMessages() {
    this.messages.forEach((msg, index) => {
      msg.classList.toggle('is-active', index === 0);
    });
  }

  startRotation() {
    if (this.messages.length <= 1) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    const speed = this.getRotationSpeed();
    this.interval = window.setInterval(() => this.nextMessage(), speed);
  }

  getRotationSpeed() {
    // 20s por defecto, puedes mapear var(--announcement-speed) si lo deseas
    return 8000;
  }

  nextMessage() {
    const current = this.messages[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.messages.length;
    const next = this.messages[this.currentIndex];

    if (current) current.classList.remove('is-active');
    if (next) next.classList.add('is-active');
  }

  handleClose() {
    this.style.display = 'none';
    window.localStorage.setItem(this.storageKey, 'true');
    this.updateAnnouncementHeight(0);
  }

  updateAnnouncementHeight(forceValue) {
    const height =
      typeof forceValue === 'number'
        ? forceValue
        : this.offsetHeight || 0;

    document.documentElement.style.setProperty(
      '--announcement-height',
      `${height}px`
    );
  }
}

customElements.define('announcement-bar', AnnouncementBar);