/* ToolNest — homepage search + category filter (grouped grid) */
document.addEventListener('DOMContentLoaded', () => {
  const q = document.getElementById('tool-search');
  const chips = document.querySelectorAll('.chip[data-cat]');
  const cards = document.querySelectorAll('.tool-card');
  const groups = document.querySelectorAll('.catgroup');
  const count = document.getElementById('result-count');
  const noRes = document.getElementById('no-results');
  const total = cards.length;
  let cat = 'all';

  function apply(){
    const term = (q ? q.value.trim().toLowerCase() : '');
    let visible = 0;
    cards.forEach(c => {
      const okCat = cat === 'all' || c.dataset.cat === cat;
      const okTerm = !term || (c.dataset.name + ' ' + c.dataset.desc).toLowerCase().includes(term);
      const show = okCat && okTerm;
      c.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    groups.forEach(g => {
      const any = Array.from(g.querySelectorAll('.tool-card')).some(c => c.style.display !== 'none');
      g.style.display = any ? '' : 'none';
    });
    if (count) {
      count.textContent = (cat === 'all' && !term)
        ? 'Showing all ' + total + ' tools'
        : 'Showing ' + visible + ' of ' + total + ' tools';
    }
    if (noRes) noRes.classList.toggle('show', visible === 0);
  }

  function setCat(next){
    cat = next;
    chips.forEach(x => x.classList.toggle('on', x.dataset.cat === cat));
    apply();
  }

  if (q) q.addEventListener('input', apply);
  chips.forEach(ch => ch.addEventListener('click', () => setCat(ch.dataset.cat)));
  document.querySelectorAll('[data-catgo]').forEach(el => {
    el.addEventListener('click', () => {
      setCat(el.dataset.catgo);
      const t = document.getElementById('tools');
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
  });
  const go = document.getElementById('search-go');
  if (go) go.addEventListener('click', () => {
    apply();
    const t = document.getElementById('tools');
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
  const clear = document.getElementById('clear-search');
  if (clear) clear.addEventListener('click', () => {
    if (q) q.value = '';
    setCat('all');
    if (q) q.focus();
  });
  apply();
});
