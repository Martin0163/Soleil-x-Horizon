document.addEventListener('DOMContentLoaded', () => {
  const detailsElements = document.querySelectorAll('.mega-menu__details');

  detailsElements.forEach(details => {
    details.addEventListener('toggle', () => {
      // Cerrar otros menús cuando uno se abre
      if (details.open) {
        detailsElements.forEach(other => {
          if (other !== details) other.removeAttribute('open');
        });
      }
    });
  });
});