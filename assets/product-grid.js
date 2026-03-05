document.addEventListener('DOMContentLoaded', () => {
  const grids = document.querySelectorAll('.product-grid');

  grids.forEach(grid => {
    const mode = grid.dataset.gridMode;

    // Ajustar columnas dinámicamente según modo
    if (mode === 'zoom-out') {
      document.documentElement.style.setProperty('--product-grid-columns', 4);
    } else if (mode === 'mobile-single') {
      document.documentElement.style.setProperty('--product-grid-columns', 1);
    } else {
      document.documentElement.style.setProperty('--product-grid-columns', 3);
    }
  });
});