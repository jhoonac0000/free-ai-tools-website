/* ToolNest — homepage search + category filter */
document.addEventListener('DOMContentLoaded', () => {
  const q = document.getElementById('tool-search');
  const chips = document.querySelectorAll('.chip[data-cat]');
  const cards = document.querySelectorAll('.tool-card');
  let cat = 'all';
  function apply(){
    const term = (q ? q.value.trim().toLowerCase() : '');
    cards.forEach(c => {
      const okCat = cat === 'all' || c.dataset.cat === cat;
      const okTerm = !term || (c.dataset.name + ' ' + c.dataset.desc).toLowerCase().includes(term);
      c.style.display = (okCat && okTerm) ? '' : 'none';
    });
  }
  if(q) q.addEventListener('input', apply);
  chips.forEach(ch => ch.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('on'));
    ch.classList.add('on');
    cat = ch.dataset.cat;
    apply();
  }));
});
