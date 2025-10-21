
  const dropdown = document.getElementById('dropdown');
    const btn = dropdown.querySelector('.menu-btn');

    btn.addEventListener('click', () => {
      if (dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
        btn.classList.remove('change');
        return;
      }
      dropdown.classList.toggle('open');
      btn.classList.toggle('change');
    });
