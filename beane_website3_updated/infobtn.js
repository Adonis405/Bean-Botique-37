document.querySelectorAll('.info-btn').forEach(btn => {
  const target = document.getElementById(btn.getAttribute('aria-controls'));
  const collapse = new bootstrap.Collapse(target, { toggle: false });
  let wantOpen = false;
  let timer;

  const sync = () => {
    if (target.classList.contains('collapsing')) return; // mid-animation, wait for event
    const isOpen = target.classList.contains('show');
    if (wantOpen && !isOpen) collapse.show();
    else if (!wantOpen && isOpen) collapse.hide();
    btn.setAttribute('aria-expanded', String(wantOpen));
  };

  // when an animation ends, apply whatever the latest intent is
  target.addEventListener('shown.bs.collapse', sync);
  target.addEventListener('hidden.bs.collapse', sync);

  const setOpen = (open, delay) => {
    wantOpen = open;
    clearTimeout(timer);
    timer = setTimeout(sync, delay);
  };

  btn.addEventListener('mouseenter', () => setOpen(true, 200));
  btn.addEventListener('mouseleave', () => setOpen(false, 200));

  // keyboard only (a mouse click won't leave it stuck open)
  btn.addEventListener('focus', () => {
    if (btn.matches(':focus-visible')) setOpen(true, 0);
  });
  btn.addEventListener('blur', () => setOpen(false, 0));
});

function initInfoBtn(btn) {
  const target = document.getElementById(btn.getAttribute('aria-controls'));
  const collapse = new bootstrap.Collapse(target, { toggle: false });
  let wantOpen = false;
  let timer;

  const sync = () => {
    if (target.classList.contains('collapsing')) return; // mid-animation, wait for event
    const isOpen = target.classList.contains('show');
    if (wantOpen && !isOpen) collapse.show();
    else if (!wantOpen && isOpen) collapse.hide();
    btn.setAttribute('aria-expanded', String(wantOpen));
  };

  target.addEventListener('shown.bs.collapse', sync);
  target.addEventListener('hidden.bs.collapse', sync);

  const setOpen = (open, delay) => {
    wantOpen = open;
    clearTimeout(timer);
    timer = setTimeout(sync, delay);
  };

  btn.addEventListener('mouseenter', () => setOpen(true, 0));
  btn.addEventListener('mouseleave', () => setOpen(false, 0));
  btn.addEventListener('focus', () => {
    if (btn.matches(':focus-visible')) setOpen(true, 0);
  });
  btn.addEventListener('blur', () => setOpen(false, 0));
}