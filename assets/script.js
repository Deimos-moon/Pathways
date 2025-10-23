
document.addEventListener('DOMContentLoaded', function(){
  const menuBtn = document.querySelector('[data-menu]');
  const drawer = document.querySelector('[data-drawer]');
  if(menuBtn && drawer){
    menuBtn.addEventListener('click', () => {
      const open = drawer.style.display === 'block';
      drawer.style.display = open ? 'none' : 'block';
      menuBtn.setAttribute('aria-expanded', String(!open));
    });
    document.addEventListener('click', (e) => {
      if(!drawer.contains(e.target) && !menuBtn.contains(e.target)){
        drawer.style.display = 'none';
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Gallery loader
  const galleryEl = document.querySelector('[data-gallery]');
  if(galleryEl){
    fetch('./assets/gallery/manifest.json')
      .then(r => r.json())
      .then(list => {
        const tiles = [];
        list.forEach((item, idx) => {
          const a = document.createElement('a');
          a.href = `./assets/gallery/${item.src}`;
          a.className = 'tile';
          a.setAttribute('data-index', idx);
          a.innerHTML = `<img loading="lazy" src="./assets/gallery/${item.src}" alt="${item.alt || ''}">`;
          galleryEl.appendChild(a);
          tiles.push(a);
        });
        setupLightbox(tiles, list);
      })
      .catch(err => {
        galleryEl.innerHTML = '<p style="color:#b91c1c">Gallery manifest not found. Add images and a manifest.json.</p>';
        console.error(err);
      });
  }

  function setupLightbox(tiles, list){
    const lb = document.querySelector('.lightbox');
    const img = lb.querySelector('img');
    const prev = lb.querySelector('.prev');
    const next = lb.querySelector('.next');
    const close = lb.querySelector('.close');
    let current = 0;

    function open(i){
      current = i;
      const item = list[i];
      img.src = `./assets/gallery/${item.src}`;
      img.alt = item.alt || '';
      lb.classList.add('open');
    }
    function nav(delta){
      let i = current + delta;
      if(i < 0) i = list.length - 1;
      if(i >= list.length) i = 0;
      open(i);
    }

    tiles.forEach((t, i) => t.addEventListener('click', (e) => {
      e.preventDefault();
      open(i);
    }));
    prev.addEventListener('click', () => nav(-1));
    next.addEventListener('click', () => nav(1));
    close.addEventListener('click', () => lb.classList.remove('open'));
    window.addEventListener('keydown', (e) => {
      if(!lb.classList.contains('open')) return;
      if(e.key === 'Escape') lb.classList.remove('open');
      if(e.key === 'ArrowLeft') nav(-1);
      if(e.key === 'ArrowRight') nav(1);
    });
  }
});
