/* ToolNest — all tool logic, 100% client-side. No network calls. */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function out(id, html){ const el = $(id); if(el){ el.innerHTML = html; } }
function copyText(id, btn){
  const el = $(id); if(!el) return;
  const t = el.innerText || el.value || '';
  navigator.clipboard.writeText(t).then(()=>{ if(btn){ const o = btn.textContent; btn.textContent = 'Copied!'; setTimeout(()=>btn.textContent = o, 1500); } });
}
function pick(arr, n){ return [...arr].sort(()=>Math.random()-0.5).slice(0, n); }

/* ---------- 1. Resume Builder + Cover Letter ---------- */
function buildResume(){
  const name = $('r-name').value.trim(), role = $('r-role').value.trim(), email = $('r-email').value.trim(),
    phone = $('r-phone').value.trim(), city = $('r-city').value.trim(), summary = $('r-summary').value.trim(),
    skills = $('r-skills').value.split(',').map(s=>s.trim()).filter(Boolean),
    exp = $('r-exp').value.trim(), edu = $('r-edu').value.trim();
  if(!name || !role){ out('r-out', '<p>Please add at least your name and target role.</p>'); return; }
  const skillHtml = skills.length ? `<h3>Skills</h3><p>${esc(skills.join(' · '))}</p>` : '';
  const html = `<div class="print-area">
    <h2 style="margin:0">${esc(name)}</h2>
    <p><strong>${esc(role)}</strong> · ${esc(city)} · ${esc(email)} ${phone ? '· ' + esc(phone) : ''}</p>
    <hr>
    ${summary ? `<h3>Professional Summary</h3><p>${esc(summary)}</p>` : ''}
    ${skillHtml}
    ${exp ? `<h3>Experience</h3><p>${esc(exp)}</p>` : ''}
    ${edu ? `<h3>Education</h3><p>${esc(edu)}</p>` : ''}
    </div>`;
  out('r-out', html);
  const comp = $('r-company').value.trim() || 'the company';
  const letter = `Dear Hiring Manager,\n\nI am applying for the ${role} position at ${comp}. My background in ${skills.slice(0,3).join(', ') || role} and my experience below make me a strong fit for this role.\n\n${exp ? exp.split('\n')[0] + '\n\n' : ''}I would welcome the chance to discuss how I can contribute to your team. Thank you for your time and consideration.\n\nSincerely,\n${name}\n${email}${phone ? ' · ' + phone : ''}`;
  out('r-letter', esc(letter));
}

/* ---------- 2. Etsy / Amazon Product Description Generator ---------- */
function buildEtsy(){
  const product = $('e-product').value.trim(), feats = $('e-feats').value.split('\n').map(s=>s.trim()).filter(Boolean),
    audience = $('e-aud').value.trim(), tone = $('e-tone').value;
  if(!product){ out('e-out', '<p>Please enter your product name.</p>'); return; }
  const bullets = feats.length ? feats.map(f=>`• ${f}`).join('\n') : '• Thoughtfully made and ready to ship\n• A great gift for someone special';
  const toneOpen = {friendly:'You will love this one — ', premium:'Crafted for people who notice the details — ', playful:'Say hello to your new favourite — ', minimal:'Simple. Useful. Beautiful — '}[tone] || '';
  const desc = `${toneOpen}${product} is made for ${audience || 'everyday life'}.\n\n${bullets}\n\nWhy buyers love it:\nThis piece is designed to be used, gifted, and enjoyed — not left in a drawer. Order today and enjoy fast, careful shipping.\n\nPerfect for: ${audience || 'home, gifts, and everyday use'}.\n\nTags: ${product.toLowerCase().replace(/[^a-z0-9 ]/g,'').split(' ').filter(Boolean).slice(0,4).join(', ')}, gift, handmade, ${audience || 'everyday'}`;
  out('e-out', esc(desc));
}

/* ---------- 3. Cold Email + Subject Line Generator ---------- */
function buildCold(){
  const biz = $('c-biz').value.trim(), theirs = $('c-theirs').value.trim(), offer = $('c-offer').value.trim(), name = $('c-name').value.trim();
  if(!biz || !theirs || !offer){ out('c-out', '<p>Please fill in their business, your business, and your offer.</p>'); return; }
  const subjects = [
    `Quick question about ${theirs}`,
    `${theirs} + ${offer} — worth a look?`,
    `An idea for ${theirs} (2 minutes to read)`,
    `Helping ${theirs} get more customers`,
    `${theirs}: a small change with a real result?`
  ];
  const body = `Hi there,\n\nI noticed ${biz} and had one specific idea for you: ${offer}.\n\nMost businesses like yours lose enquiries because of one small gap — and fixing it usually takes less than a week. Would you be open to a quick 10-minute look at what that gap is for ${theirs}?\n\nNo pressure at all — if it is not a fit, I will leave you alone.\n\nBest regards,\n${name || 'Your Name'}`;
  out('c-out', 'SUBJECT LINES\n' + subjects.map((s,i)=>`${i+1}. ${s}`).join('\n') + '\n\nEMAIL\n' + body);
}

/* ---------- 4. Loan / Mortgage / Tax Calculators ---------- */
function pmt(principal, annualRate, years){
  const r = annualRate / 100 / 12, n = years * 12;
  if(r === 0) return principal / n;
  return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}
function fmt(n){ return '$' + n.toLocaleString('en-US', {maximumFractionDigits: 2}); }
function calcLoan(){
  const p = +$('l-principal').value, rate = +$('l-rate').value, yrs = +$('l-years').value;
  if(!p || !yrs){ out('l-out', '<p>Please enter the loan amount and years.</p>'); return; }
  const m = pmt(p, rate, yrs), total = m * yrs * 12;
  out('l-out', `Monthly payment: ${fmt(m)}\nTotal paid: ${fmt(total)}\nTotal interest: ${fmt(total - p)}`);
}
function calcMortgage(){
  const price = +$('m-price').value, down = +$('m-down').value, rate = +$('m-rate').value, yrs = +$('m-years').value;
  if(!price || !yrs){ out('m-out', '<p>Please enter the home price and years.</p>'); return; }
  const loan = price * (1 - down / 100), m = pmt(loan, rate, yrs);
  out('m-out', `Down payment: ${fmt(price * down / 100)}\nLoan amount: ${fmt(loan)}\nMonthly payment (principal + interest): ${fmt(m)}`);
}
function calcTax(){
  const income = +$('t-income').value, exp = +$('t-exp').value, rate = +$('t-rate').value;
  if(!income){ out('t-out', '<p>Please enter your annual income.</p>'); return; }
  const taxable = Math.max(0, income - exp), tax = taxable * rate / 100;
  out('t-out', `Taxable income: ${fmt(taxable)}\nEstimated tax: ${fmt(tax)}\nSet aside each month: ${fmt(tax / 12)}\nEstimated take-home: ${fmt(income - tax)}`);
}

/* ---------- 5. YouTube Title / Description / Hashtag Generator ---------- */
function buildYT(){
  const kw = $('y-kw').value.trim(), aud = $('y-aud').value.trim();
  if(!kw){ out('y-out', '<p>Please enter a video topic or keyword.</p>'); return; }
  const titles = [
    `${kw} — The Beginner's Guide That Actually Works`,
    `I Tried ${kw} for 30 Days — Here's What Happened`,
    `${kw} in 10 Minutes: Everything You Need to Know`,
    `Stop Doing ${kw} Wrong (Do This Instead)`,
    `${kw} for ${aud || 'Beginners'}: Step by Step`,
    `7 ${kw} Mistakes You Are Probably Making`,
    `${kw} Explained Simply — No Jargon`,
    `How I Learned ${kw} Faster Than Everyone Else`,
    `${kw} 2026: What Is New and What Still Works`,
    `The Truth About ${kw} Nobody Tells You`
  ];
  const desc = `${kw} — in this video, you will learn the essentials, the common mistakes, and the fastest way to get results.\n\nTIMESTAMPS\n00:00 Intro\n01:30 The basics\n05:00 The mistakes to avoid\n08:00 My recommended approach\n\nSubscribe for more videos like this one.`;
  const tags = kw.toLowerCase().replace(/[^a-z0-9 ]/g,'').split(' ').filter(Boolean).map(w=>'#'+w).join(' ');
  out('y-out', 'TITLES\n' + titles.map((t,i)=>`${i+1}. ${t}`).join('\n') + '\n\nDESCRIPTION\n' + desc + '\n\nHASHTAGS\n' + tags + ' #howto #tutorial #learn');
}

/* ---------- 6. Invoice Generator ---------- */
function buildInvoice(){
  const from = $('i-from').value.trim(), to = $('i-to').value.trim(), num = $('i-num').value.trim() || 'INV-001',
    date = $('i-date').value || new Date().toISOString().slice(0,10), taxRate = +$('i-tax').value || 0;
  const rows = [];
  document.querySelectorAll('.inv-row').forEach(r => {
    const d = r.querySelector('.inv-desc').value.trim(), q = +r.querySelector('.inv-qty').value || 0, p = +r.querySelector('.inv-price').value || 0;
    if(d && q && p) rows.push({d, q, p, total: q * p});
  });
  if(!from || !to || !rows.length){ out('i-out', '<p>Please add your business, your client, and at least one item.</p>'); return; }
  const sub = rows.reduce((s, r) => s + r.total, 0), tax = sub * taxRate / 100, total = sub + tax;
  const lines = rows.map(r => `${r.d} — ${r.q} × $${r.p.toFixed(2)} = $${r.total.toFixed(2)}`).join('\n');
  out('i-out', `<div class="print-area"><h2>INVOICE ${esc(num)}</h2><p><strong>From:</strong> ${esc(from)}<br><strong>To:</strong> ${esc(to)}<br><strong>Date:</strong> ${esc(date)}</p><hr><p>${esc(lines)}</p><hr><p>Subtotal: $${sub.toFixed(2)}<br>Tax (${taxRate}%): $${tax.toFixed(2)}<br><strong>Total due: $${total.toFixed(2)}</strong></p><p>Thank you for your business.</p></div>`);
}

/* ---------- 7. Text Summarizer (extractive, runs in your browser) ---------- */
function summarize(){
  const text = $('s-text').value.trim(), ratio = +$('s-len').value || 30;
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  if(sentences.length < 2){ out('s-out', '<p>Please paste at least a few sentences.</p>'); return; }
  const stop = new Set('the,a,an,and,or,but,is,are,was,were,be,been,to,of,in,on,for,with,by,at,from,as,it,this,that,these,those,you,your,we,our,they,their,he,she,his,her,not,no,do,does,did,can,could,should,would,will,just,than,then,so,very,more,most,other,into,over,after,before,when,while,about,up,out,all,any,have,has,had'.split(','));
  const freq = {};
  text.toLowerCase().replace(/[^a-z ]/g,'').split(/\s+/).forEach(w => { if(w && !stop.has(w)) freq[w] = (freq[w] || 0) + 1; });
  const scored = sentences.map((s, i) => {
    const words = s.toLowerCase().replace(/[^a-z ]/g,'').split(/\s+/);
    const score = words.reduce((sum, w) => sum + (freq[w] || 0), 0) / Math.max(1, words.length);
    return {s: s.trim(), score, i};
  });
  const keep = Math.max(1, Math.round(sentences.length * ratio / 100));
  const chosen = scored.sort((a,b) => b.score - a.score).slice(0, keep).sort((a,b) => a.i - b.i).map(x => x.s).join(' ');
  out('s-out', `SUMMARY (${keep} of ${sentences.length} sentences)\n\n${chosen}`);
}

/* ---------- 8. Paraphraser + Grammar Checker ---------- */
const SYN = {good:['great','excellent','strong'], bad:['poor','weak','unfavourable'], big:['large','huge','massive'], small:['tiny','compact','little'], fast:['quick','rapid','swift'], important:['crucial','vital','essential'], help:['assist','support','guide'], make:['create','build','produce'], use:['utilize','apply','employ'], show:['demonstrate','display','reveal'], happy:['delighted','pleased','glad'], learn:['master','discover','grasp'], work:['effort','labour','task'], easy:['simple','straightforward','effortless'], hard:['difficult','challenging','tough']};
function paraphrase(){
  const text = $('p-text').value.trim();
  if(!text){ out('p-out', '<p>Please paste some text.</p>'); return; }
  let para = text;
  Object.keys(SYN).forEach(w => {
    const re = new RegExp('\\b' + w + '\\b', 'gi');
    para = para.replace(re, m => {
      const opts = SYN[w.toLowerCase()];
      const choice = opts[Math.floor(Math.random() * opts.length)];
      return m[0] === m[0].toUpperCase() ? choice[0].toUpperCase() + choice.slice(1) : choice;
    });
  });
  const issues = [];
  if(/\s{2,}/.test(text)) issues.push('Double spaces found — cleaned up.');
  if(/\b(\w+)\s+\1\b/i.test(text)) issues.push('A repeated word was found — check it.');
  if(/\bteh\b/i.test(text)) issues.push('"teh" looks like a typo for "the".');
  if(/\brecieve\b/i.test(text)) issues.push('"recieve" looks like a typo for "receive".');
  if(!/[.!?]$/.test(text.trim())) issues.push('The text does not end with a full stop.');
  if(/\bi\b/.test(text)) issues.push('Standalone "i" should be capital "I".');
  out('p-out', 'PARAPHRASED\n' + para + '\n\nGRAMMAR NOTES\n' + (issues.length ? issues.map(i => '• ' + i).join('\n') : '• No common issues found.'));
}

/* ---------- 9. LinkedIn Headline + Bio Generator ---------- */
function buildLinkedIn(){
  const role = $('li-role').value.trim(), field = $('li-field').value.trim(), win = $('li-win').value.trim();
  if(!role){ out('li-out', '<p>Please enter your role.</p>'); return; }
  const heads = [
    `${role} | Helping ${field || 'businesses'} grow with practical results`,
    `${role} — ${win || 'Turning ideas into outcomes'}`,
    `${role} | ${field || 'Growth'} · Results · No fluff`
  ];
  const about = `I am a ${role} working in ${field || 'my field'}. ${win ? 'One result I am proud of: ' + win + '. ' : ''}I share practical lessons here — what works, what does not, and how to do good work without wasting time. Open to conversations, collaborations, and new opportunities.`;
  out('li-out', 'HEADLINES\n' + heads.map((h,i) => `${i+1}. ${h}`).join('\n') + '\n\nABOUT SECTION\n' + about);
}

/* ---------- 10. Instagram Caption + Bio Generator ---------- */
function buildInsta(){
  const topic = $('ig-topic').value.trim(), tone = $('ig-tone').value;
  if(!topic){ out('ig-out', '<p>Please enter a topic.</p>'); return; }
  const open = {fun:'POV: ', insp:'Reminder: ', calm:'Slow mornings, ', bold:'No more waiting. '}[tone] || '';
  const caps = [
    `${open}${topic} — and it feels better than I expected.`,
    `Little moments, big lessons: ${topic}.`,
    `${topic}. Saved this one for the days I need it.`,
    `If ${topic} taught me anything, it is this: keep going.`,
    `Today's note to self: more ${topic}, less noise.`
  ];
  const bio = `${topic} lover · Sharing the journey, one post at a time · New here? Start with my favourites below.`;
  const tags = topic.toLowerCase().replace(/[^a-z0-9 ]/g,'').split(' ').filter(Boolean).map(w => '#' + w).join(' ');
  out('ig-out', 'CAPTIONS\n' + caps.map((c,i) => `${i+1}. ${c}`).join('\n') + '\n\nBIO\n' + bio + '\n\nHASHTAGS\n' + tags + ' #instagood #daily');
}

/* ---------- 11. Business Name + Slogan Generator ---------- */
function buildBiz(){
  const kw = $('b-kw').value.trim(), style = $('b-style').value;
  if(!kw){ out('b-out', '<p>Please enter a keyword for your business.</p>'); return; }
  const pre = ['Bright','Prime','True','Nova','Swift','Golden','Urban','Ever'];
  const suf = ['Studio','Lab','Works','Hub','Co','Nest','Lane','Craft'];
  const names = [];
  pre.slice(0,4).forEach(p => names.push(p + ' ' + kw));
  suf.slice(0,4).forEach(s => names.push(kw + ' ' + s));
  const slogans = [
    `${kw}, done right.`,
    `Simple ${kw.toLowerCase()} for busy people.`,
    `Where ${kw.toLowerCase()} meets quality.`,
    `${kw} that works as hard as you do.`,
    `Less fuss. Better ${kw.toLowerCase()}.`
  ];
  out('b-out', 'BUSINESS NAMES\n' + names.map((n,i) => `${i+1}. ${n}`).join('\n') + '\n\nSLOGANS\n' + slogans.map((s,i) => `${i+1}. ${s}`).join('\n'));
}

/* ---------- 12. Freelance Rate Calculator ---------- */
function calcRate(){
  const income = +$('f-income').value, hours = +$('f-hours').value, exp = +$('f-exp').value, tax = +$('f-tax').value;
  if(!income || !hours){ out('f-out', '<p>Please enter your target income and billable hours.</p>'); return; }
  const gross = income + exp, withTax = gross / Math.max(0.5, (1 - tax / 100));
  const hourly = withTax / hours;
  out('f-out', `Hourly rate: $${hourly.toFixed(2)}\nDay rate (8 hours): $${(hourly * 8).toFixed(2)}\nWeekly (30 billable hours): $${(hourly * 30).toFixed(2)}\n\nThis covers your expenses and tax — never quote below this number.`);
}

/* ---------- 13. Meeting Notes Summarizer ---------- */
function summarizeMeeting(){
  const text = $('mn-text').value.trim();
  if(!text){ out('mn-out', '<p>Please paste your meeting notes.</p>'); return; }
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const actions = lines.filter(l => /^(action|todo|task|follow[- ]?up|next)[\s:]/i.test(l) || /\b(will|shall|must|should)\b/i.test(l));
  const decisions = lines.filter(l => /^(decision|decided|agreed|conclusion)[\s:]/i.test(l));
  const dates = text.match(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}\b/g) || [];
  const key = lines.filter(l => l.length > 40).slice(0, 3);
  out('mn-out', 'KEY POINTS\n' + (key.length ? key.map(k => '• ' + k).join('\n') : '• (No long notes found — add detail lines.)') +
    '\n\nDECISIONS\n' + (decisions.length ? decisions.map(d => '• ' + d).join('\n') : '• None marked — mark decisions with "Decision:".') +
    '\n\nACTION ITEMS\n' + (actions.length ? actions.map(a => '• ' + a).join('\n') : '• None found — mark actions with "Action:".') +
    (dates.length ? '\n\nDATES MENTIONED\n• ' + [...new Set(dates)].join(', ') : ''));
}

/* ---------- 14. Blog Title + Outline Generator ---------- */
function buildBlog(){
  const topic = $('bl-topic').value.trim(), aud = $('bl-aud').value.trim();
  if(!topic){ out('bl-out', '<p>Please enter a blog topic.</p>'); return; }
  const titles = [
    `${topic}: A Complete Beginner's Guide`,
    `10 Things Nobody Tells You About ${topic}`,
    `How to Master ${topic} in 30 Days`,
    `${topic} — Mistakes, Myths, and What Actually Works`,
    `The Ultimate ${topic} Checklist for ${aud || 'Beginners'}`,
    `${topic} Explained: Everything You Need in One Place`,
    `Why ${topic} Matters More Than Ever in 2026`,
    `A Practical ${topic} Plan You Can Start Today`
  ];
  const outline = `OUTLINE — ${titles[0]}\n\n1. Introduction: why ${topic} matters and who this is for\n2. The basics: what ${topic} really means (plain language)\n3. The 5 most common mistakes\n4. A step-by-step approach that works\n5. Real examples and quick wins\n6. Tools and resources worth trying\n7. FAQ: the questions everyone asks\n8. Conclusion: your first 3 actions this week`;
  out('bl-out', 'TITLES\n' + titles.map((t,i) => `${i+1}. ${t}`).join('\n') + '\n\n' + outline);
}

/* ---------- 15. Real Estate Listing Description Generator ---------- */
function buildRE(){
  const type = $('re-type').value, beds = $('re-beds').value, baths = $('re-baths').value,
    area = $('re-area').value.trim(), feat = $('re-feat').value.split('\n').map(s => s.trim()).filter(Boolean),
    price = $('re-price').value.trim();
  if(!area){ out('re-out', '<p>Please enter the location/area.</p>'); return; }
  const featLine = feat.length ? feat.join(', ') + '. ' : '';
  const desc = `FOR SALE — ${beds}-Bedroom, ${baths}-Bathroom ${type} in ${area}${price ? ' — ' + price : ''}.\n\nThis ${type.toLowerCase()} offers comfortable living in a sought-after part of ${area}. ${featLine}The layout is practical for families, professionals, and first-time buyers alike.\n\nHighlights:\n• ${beds} bedrooms and ${baths} bathrooms\n• Located in ${area}\n${feat.map(f => '• ' + f).join('\n')}\n\nBook a viewing today — homes in ${area} at this standard do not stay on the market for long.`;
  out('re-out', esc(desc));
}

/* ============================================================
   FILE TOOLS (16–21) — added 2026-11-07
   Everything runs 100% in the visitor's browser. Files are
   never uploaded anywhere. Libraries (pdf-lib, pdf.js, docx,
   mammoth, html2pdf) are loaded per-page from CDN.
   ============================================================ */
function ftKB(bytes){ return (bytes/1024).toFixed(1) + ' KB'; }
function ftMB(bytes){ return (bytes/1048576).toFixed(2) + ' MB'; }
function ftSize(bytes){ return bytes >= 1048576 ? ftMB(bytes) : ftKB(bytes); }
function ftBase(name){ return (name || 'file').replace(/\.[^.]+$/, ''); }
function ftDownload(blob, filename){
  window.__ftLastBlob = blob; window.__ftLastName = filename;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
}
function ftLoadImage(file){
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => res({ img, url });
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('That file could not be read as an image.')); };
    img.src = url;
  });
}
function ftCanvasBlob(canvas, type, quality){
  return new Promise(res => canvas.toBlob(res, type, quality));
}

/* ---------- 16. Image Compressor (target size) ---------- */
let ftCompFile = null;
function ftCompPick(input){
  ftCompFile = input.files && input.files[0];
  const info = $('ic-info'), out = $('ic-out');
  if (!ftCompFile){ info.textContent = ''; return; }
  info.textContent = 'Selected: ' + ftCompFile.name + ' — ' + ftSize(ftCompFile.size);
  out.innerHTML = '';
}
function ftCompTarget(){
  const sel = $('ic-target').value;
  if (sel === 'custom'){
    const v = parseFloat($('ic-custom').value);
    return isNaN(v) || v <= 0 ? null : Math.round(v * 1024);
  }
  return parseInt(sel, 10) * 1024;
}
async function ftCompress(){
  const out = $('ic-out');
  if (!ftCompFile){ out.innerHTML = '<p>Please choose an image first.</p>'; return; }
  const target = ftCompTarget();
  if (!target){ out.innerHTML = '<p>Please enter a valid custom target size in KB.</p>'; return; }
  const format = $('ic-format').value; // image/jpeg or image/webp
  const ext = format === 'image/webp' ? 'webp' : 'jpg';
  out.innerHTML = '<p>Working…</p>';
  try {
    if (ftCompFile.size <= target && (ftCompFile.type === format)){
      out.innerHTML = '<p>Your image is already smaller than the target (' + ftSize(ftCompFile.size) + '). Here is a copy:</p>';
      ftShowImageResult(out, ftCompFile, ftBase(ftCompFile.name) + '.' + ext);
      return;
    }
    const { img, url } = await ftLoadImage(ftCompFile);
    let scale = 1, best = null;
    for (let round = 0; round < 14; round++){
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const ctx = cv.getContext('2d');
      if (format === 'image/jpeg'){ ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); }
      ctx.drawImage(img, 0, 0, w, h);
      // binary search the highest quality that still fits the target
      let lo = 0.05, hi = 0.95, fit = null;
      const minBlob = await ftCanvasBlob(cv, format, lo);
      if (minBlob && minBlob.size <= target){ fit = minBlob; }
      for (let i = 0; i < 9 && fit !== minBlob; i++){
        const mid = (lo + hi) / 2;
        const b = await ftCanvasBlob(cv, format, mid);
        if (!b) break;
        if (b.size <= target){ fit = b; lo = mid; } else { hi = mid; }
      }
      if (fit){ best = fit; break; }
      scale *= 0.82; // still too big at lowest quality — shrink dimensions and retry
    }
    URL.revokeObjectURL(url);
    if (!best){ out.innerHTML = '<p>Sorry — this image could not be brought down to that target. Try a slightly larger target size.</p>'; return; }
    const name = ftBase(ftCompFile.name) + '-' + Math.round(target/1024) + 'kb.' + ext;
    out.innerHTML = '<p><strong>Done.</strong> ' + ftSize(ftCompFile.size) + ' → <strong>' + ftSize(best.size) + '</strong> (target ' + ftSize(target) + ').</p>';
    ftShowImageResult(out, best, name);
  } catch(e){
    out.innerHTML = '<p>Something went wrong: ' + esc(e.message || e) + '</p>';
  }
}
function ftShowImageResult(out, blob, name){
  const url = URL.createObjectURL(blob);
  const wrap = document.createElement('div');
  const im = document.createElement('img');
  im.src = url; im.alt = 'Result image preview';
  im.style.cssText = 'max-width:100%;height:auto;border-radius:10px;margin:10px 0';
  const btn = document.createElement('button');
  btn.className = 'btn'; btn.textContent = 'Download ' + name + ' (' + ftSize(blob.size) + ')';
  btn.onclick = () => ftDownload(blob, name);
  wrap.appendChild(im); wrap.appendChild(btn);
  out.appendChild(wrap);
  window.__ftLastBlob = blob; window.__ftLastName = name;
}

/* ---------- 17. Image Converter (JPG / PNG / WebP) ---------- */
let ftConvFile = null;
function ftConvPick(input){
  ftConvFile = input.files && input.files[0];
  const info = $('iv-info');
  if (!ftConvFile){ info.textContent = ''; return; }
  info.textContent = 'Selected: ' + ftConvFile.name + ' — ' + ftSize(ftConvFile.size);
  $('iv-out').innerHTML = '';
}
async function ftConvert(){
  const out = $('iv-out');
  if (!ftConvFile){ out.innerHTML = '<p>Please choose an image first.</p>'; return; }
  const format = $('iv-format').value;
  const ext = format === 'image/png' ? 'png' : (format === 'image/webp' ? 'webp' : 'jpg');
  const q = parseFloat($('iv-quality').value) || 0.92;
  out.innerHTML = '<p>Working…</p>';
  try {
    const { img, url } = await ftLoadImage(ftConvFile);
    const cv = document.createElement('canvas');
    cv.width = img.naturalWidth; cv.height = img.naturalHeight;
    const ctx = cv.getContext('2d');
    if (format === 'image/jpeg'){ ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cv.width, cv.height); }
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    const blob = await ftCanvasBlob(cv, format, q);
    if (!blob){ out.innerHTML = '<p>Conversion failed — your browser could not create that format.</p>'; return; }
    const name = ftBase(ftConvFile.name) + '.' + ext;
    out.innerHTML = '<p><strong>Done.</strong> ' + ftSize(ftConvFile.size) + ' → <strong>' + ftSize(blob.size) + '</strong> (' + ext.toUpperCase() + ').</p>';
    ftShowImageResult(out, blob, name);
  } catch(e){
    out.innerHTML = '<p>Something went wrong: ' + esc(e.message || e) + '</p>';
  }
}

/* ---------- 18. PDF Merge ---------- */
let ftMergeFiles = [];
function ftMergePick(input){
  const out = $('pm-out');
  Array.from(input.files || []).forEach(f => { if (f.type === 'application/pdf' || /\.pdf$/i.test(f.name)) ftMergeFiles.push(f); });
  input.value = '';
  ftMergeRender();
  out.innerHTML = '';
}
function ftMergeRender(){
  const list = $('pm-list');
  if (!ftMergeFiles.length){ list.innerHTML = '<p class="note">No PDFs added yet.</p>'; return; }
  list.innerHTML = '';
  ftMergeFiles.forEach((f, i) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:6px 0';
    const label = document.createElement('span');
    label.textContent = (i + 1) + '. ' + f.name + ' (' + ftSize(f.size) + ')';
    label.style.flex = '1';
    const up = document.createElement('button'); up.className = 'btn secondary'; up.textContent = '↑ Up';
    up.onclick = () => { if (i > 0){ [ftMergeFiles[i-1], ftMergeFiles[i]] = [ftMergeFiles[i], ftMergeFiles[i-1]]; ftMergeRender(); } };
    const dn = document.createElement('button'); dn.className = 'btn secondary'; dn.textContent = '↓ Down';
    dn.onclick = () => { if (i < ftMergeFiles.length - 1){ [ftMergeFiles[i+1], ftMergeFiles[i]] = [ftMergeFiles[i], ftMergeFiles[i+1]]; ftMergeRender(); } };
    const rm = document.createElement('button'); rm.className = 'btn secondary'; rm.textContent = 'Remove';
    rm.onclick = () => { ftMergeFiles.splice(i, 1); ftMergeRender(); };
    row.appendChild(label); row.appendChild(up); row.appendChild(dn); row.appendChild(rm);
    list.appendChild(row);
  });
}
async function ftMerge(){
  const out = $('pm-out');
  if (ftMergeFiles.length < 2){ out.innerHTML = '<p>Please add at least two PDF files to merge.</p>'; return; }
  if (typeof PDFLib === 'undefined'){ out.innerHTML = '<p>The PDF library is still loading — check your connection and try again.</p>'; return; }
  out.innerHTML = '<p>Working…</p>';
  try {
    const merged = await PDFLib.PDFDocument.create();
    let pages = 0;
    for (const f of ftMergeFiles){
      const doc = await PDFLib.PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      const copied = await merged.copyPages(doc, doc.getPageIndices());
      copied.forEach(p => merged.addPage(p));
      pages += doc.getPageCount();
    }
    const bytes = await merged.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    out.innerHTML = '<p><strong>Done.</strong> ' + ftMergeFiles.length + ' PDFs merged into one — ' + pages + ' pages, ' + ftSize(blob.size) + '.</p>';
    const btn = document.createElement('button');
    btn.className = 'btn'; btn.textContent = 'Download merged.pdf';
    btn.onclick = () => ftDownload(blob, 'merged.pdf');
    out.appendChild(btn);
    window.__ftLastBlob = blob; window.__ftLastName = 'merged.pdf';
  } catch(e){
    out.innerHTML = '<p>Something went wrong: ' + esc(e.message || e) + ' — one of the files may be damaged or password-protected.</p>';
  }
}

/* ---------- 19. PDF Compress (re-render pages as images) ---------- */
async function ftCompressPdf(){
  const out = $('pc-out');
  const input = $('pc-file');
  const file = input.files && input.files[0];
  if (!file){ out.innerHTML = '<p>Please choose a PDF file first.</p>'; return; }
  if (typeof pdfjsLib === 'undefined' || typeof window.jspdf === 'undefined'){
    out.innerHTML = '<p>The PDF libraries are still loading — check your connection and try again.</p>'; return;
  }
  const level = $('pc-level').value; // high | medium | low compression
  const conf = { high: { scale: 1.1, q: 0.5 }, medium: { scale: 1.5, q: 0.65 }, low: { scale: 2.0, q: 0.8 } }[level] || { scale: 1.5, q: 0.65 };
  out.innerHTML = '<p>Working — this can take a moment on long PDFs…</p>';
  try {
    const data = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    const { jsPDF } = window.jspdf;
    async function build(c){
      let doc = null;
      for (let p = 1; p <= pdf.numPages; p++){
        const page = await pdf.getPage(p);
        const base = page.getViewport({ scale: 1 });
        const vp = page.getViewport({ scale: c.scale });
        const cv = document.createElement('canvas');
        cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
        const ctx = cv.getContext('2d');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cv.width, cv.height);
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
        const imgData = cv.toDataURL('image/jpeg', c.q);
        if (!doc){
          doc = new jsPDF({ unit: 'pt', format: [base.width, base.height], orientation: base.width > base.height ? 'landscape' : 'portrait', compress: true });
        } else {
          doc.addPage([base.width, base.height], base.width > base.height ? 'landscape' : 'portrait');
        }
        doc.addImage(imgData, 'JPEG', 0, 0, base.width, base.height);
        out.innerHTML = '<p>Working — page ' + p + ' of ' + pdf.numPages + '…</p>';
      }
      return doc.output('blob');
    }
    let blob = await build(conf);
    let stronger = false;
    if (blob.size >= file.size){
      // automatically retry stronger settings before reporting honestly
      const tries = [{ scale: 1.0, q: 0.5 }, { scale: 0.8, q: 0.42 }];
      for (const t of tries){
        if (t.scale === conf.scale && t.q === conf.q) continue;
        const b2 = await build(t);
        if (b2.size < blob.size){ blob = b2; stronger = true; }
        if (blob.size < file.size) break;
      }
    }
    const saved = file.size - blob.size;
    if (saved <= 0){
      out.innerHTML = '<p><strong>Honest result:</strong> even at the strongest setting, the re-rendered version came out at ' + ftSize(blob.size) + ' — no smaller than your original (' + ftSize(file.size) + '). This happens with text-based PDFs, which are already stored very efficiently. Your original file is the better copy to keep.</p>';
      window.__ftLastBlob = blob; window.__ftLastName = ftBase(file.name) + '-compressed.pdf';
      return;
    }
    const name = ftBase(file.name) + '-compressed.pdf';
    out.innerHTML = '<p><strong>Done.</strong> ' + ftSize(file.size) + ' → <strong>' + ftSize(blob.size) + '</strong> (' + Math.round(saved / file.size * 100) + '% smaller, ' + pdf.numPages + ' pages)' + (stronger ? ' — a stronger setting was used automatically to beat your original size' : '') + '. Note: pages were re-rendered as images, so text is no longer selectable.</p>';
    const btn = document.createElement('button');
    btn.className = 'btn'; btn.textContent = 'Download ' + name;
    btn.onclick = () => ftDownload(blob, name);
    out.appendChild(btn);
    window.__ftLastBlob = blob; window.__ftLastName = name;
  } catch(e){
    out.innerHTML = '<p>Something went wrong: ' + esc(e.message || e) + ' — the file may be damaged or password-protected.</p>';
  }
}

/* ---------- 20. PDF to Word (position-aware: headings, bold, alignment, images, header/footer) ---------- */
async function ftPdfToWord(){
  const out = $('pw-out');
  const input = $('pw-file');
  const file = input.files && input.files[0];
  if (!file){ out.innerHTML = '<p>Please choose a PDF file first.</p>'; return; }
  if (typeof pdfjsLib === 'undefined' || typeof docx === 'undefined'){
    out.innerHTML = '<p>The conversion libraries are still loading — check your connection and try again.</p>'; return;
  }
  out.innerHTML = '<p>Working — reading your PDF…</p>';
  try {
    const data = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    const OPS = pdfjsLib.OPS || {};

    // --- helpers (kept inside this function so nothing else on the page is affected) ---
    // real font names (e.g. "Helvetica-Bold") live on the loaded font objects, not in tc.styles
    async function fontNameMap(page, tc){
      const map = {}, ids = {};
      tc.items.forEach(it => { ids[it.fontName] = 1; });
      const label = f => f ? ((f.name || '') + (f.bold ? ' Bold' : '') + (f.italic ? ' Italic' : '')) : '';
      for (const id of Object.keys(ids)){
        try { map[id] = label(page.commonObjs.get(id)); } catch(e){ map[id] = ''; }
        if (!map[id]){
          map[id] = await new Promise(res => {
            let done = false; const fin = v => { if (!done){ done = true; res(v); } };
            try { page.commonObjs.get(id, f => fin(label(f))); } catch(e){ fin(''); }
            setTimeout(() => fin(''), 1200);
          });
        }
        if (!map[id]){ const s = tc.styles && tc.styles[id]; map[id] = (s && s.fontFamily) || id; }
      }
      return map;
    }
    const sizeOf = it => { const t = it.transform; const s = Math.hypot(t[2], t[3]); return s > 0 ? s : (it.height || 12); };

    function imgToPng(img){
      return new Promise(res => {
        try {
          if (img && img.bitmap){
            const c = document.createElement('canvas');
            c.width = img.width || img.bitmap.width; c.height = img.height || img.bitmap.height;
            c.getContext('2d').drawImage(img.bitmap, 0, 0);
            c.toBlob(b => b ? b.arrayBuffer().then(ab => res({ data: ab, w: c.width, h: c.height })) : res(null), 'image/png');
            return;
          }
          if (!img || !img.data || !img.width || !img.height){ res(null); return; }
          const w = img.width, h = img.height, src = img.data, kind = img.kind; // pdf.js ImageKind: 1 gray, 2 RGB, 3 RGBA
          const c = document.createElement('canvas'); c.width = w; c.height = h;
          const ctx = c.getContext('2d'); const idata = ctx.createImageData(w, h); const d = idata.data;
          for (let i = 0, j = 0; i < w * h; i++){
            if (kind === 1){ const g = src[i]; d[j++] = g; d[j++] = g; d[j++] = g; d[j++] = 255; }
            else if (kind === 3){ d[j++] = src[i*4]; d[j++] = src[i*4+1]; d[j++] = src[i*4+2]; d[j++] = src[i*4+3]; }
            else { d[j++] = src[i*3]; d[j++] = src[i*3+1]; d[j++] = src[i*3+2]; d[j++] = 255; }
          }
          ctx.putImageData(idata, 0, 0);
          c.toBlob(b => b ? b.arrayBuffer().then(ab => res({ data: ab, w, h })) : res(null), 'image/png');
        } catch(e){ res(null); }
      });
    }
    function getImg(page, name){
      return new Promise(res => {
        let done = false; const fin = v => { if (!done){ done = true; res(v); } };
        try { page.objs.get(name, v => fin(v)); } catch(e){ fin(null); }
        setTimeout(() => fin(null), 4000);
      });
    }
    async function pageImages(page){
      const imgs = [];
      try {
        const opList = await page.getOperatorList();
        let ctm = [1,0,0,1,0,0]; const stack = [];
        const mul = (m, n) => [ m[0]*n[0] + m[2]*n[1], m[1]*n[0] + m[3]*n[1], m[0]*n[2] + m[2]*n[3], m[1]*n[2] + m[3]*n[3], m[0]*n[4] + m[2]*n[5] + m[4], m[1]*n[4] + m[3]*n[5] + m[5] ];
        for (let i = 0; i < opList.fnArray.length; i++){
          const fn = opList.fnArray[i], args = opList.argsArray[i];
          if (fn === OPS.save) stack.push(ctm.slice());
          else if (fn === OPS.restore){ if (stack.length) ctm = stack.pop(); }
          else if (fn === OPS.transform) ctm = mul(ctm, args);
          else if (fn === OPS.paintImageXObject || fn === OPS.paintJpegXObject || fn === OPS.paintInlineImageXObject){
            const cs = [[0,0],[1,0],[0,1],[1,1]].map(pt => [ctm[0]*pt[0] + ctm[2]*pt[1] + ctm[4], ctm[1]*pt[0] + ctm[3]*pt[1] + ctm[5]]);
            const xs = cs.map(c => c[0]), ys = cs.map(c => c[1]);
            const rec = { x: Math.min.apply(null, xs), yTop: Math.max.apply(null, ys), wPt: Math.max.apply(null, xs) - Math.min.apply(null, xs), hPt: Math.max.apply(null, ys) - Math.min.apply(null, ys) };
            const raw = (fn === OPS.paintInlineImageXObject) ? args[0] : await getImg(page, args[0]);
            const png = raw ? await imgToPng(raw) : null;
            if (png && rec.wPt > 4 && rec.hPt > 4){ rec.png = png; imgs.push(rec); }
          }
        }
      } catch(e){ /* images are best-effort — the text still converts */ }
      return imgs;
    }

    let totalChars = 0, totalImages = 0;
    const bodyChildren = [];
    let headerParas = null, footerParas = null, docHasHeader = false, docHasFooter = false;

    for (let p = 1; p <= pdf.numPages; p++){
      const page = await pdf.getPage(p);
      const vp = page.getViewport({ scale: 1 });
      const pageW = vp.width, pageH = vp.height;
      // a light render first: pdf.js only resolves the real font data (names, bold/italic) once a page has been painted
      try {
        const rv = page.getViewport({ scale: 0.25 });
        const rc = document.createElement('canvas'); rc.width = rv.width; rc.height = rv.height;
        await page.render({ canvasContext: rc.getContext('2d'), viewport: rv }).promise;
      } catch(e){ /* best-effort — conversion continues without it */ }
      const tc = await page.getTextContent();
      const fnames = await fontNameMap(page, tc);

      // group items into lines, keeping each run's own formatting
      const rawLines = [];
      tc.items.forEach(it => {
        if (!it.str) return;
        const y = Math.round(it.transform[5]);
        let line = null;
        for (const L of rawLines){ if (Math.abs(L.y - y) <= 2){ line = L; break; } }
        if (!line){ line = { y, runs: [], x0: it.transform[4], x1: it.transform[4] + (it.width || 0), size: 0 }; rawLines.push(line); }
        const fam = fnames[it.fontName] || '';
        line.runs.push({ text: it.str, bold: /bold/i.test(fam), ital: /italic|oblique/i.test(fam), size: sizeOf(it) });
        line.x0 = Math.min(line.x0, it.transform[4]);
        line.x1 = Math.max(line.x1, it.transform[4] + (it.width || 0));
        line.size = Math.max(line.size, sizeOf(it));
      });
      rawLines.sort((a, b) => b.y - a.y); // PDF coordinates run bottom-up
      rawLines.forEach(L => { L.text = L.runs.map(r => r.text).join(' ').replace(/\s+/g, ' ').trim(); });
      const lines = rawLines.filter(L => L.text);

      const imgs = await pageImages(page);
      const inHeader = y => y > pageH - 92, inFooter = y => y < 72;
      const runsOf = L => {
        const arr = []; let prevEndsSpace = true;
        L.runs.forEach(r => {
          let t = r.text;
          if (!prevEndsSpace && t && !/^\s/.test(t)) t = ' ' + t;
          prevEndsSpace = /\s$/.test(t) || t === '';
          arr.push(new docx.TextRun({ text: t, bold: r.bold || undefined, italics: r.ital || undefined }));
        });
        return arr;
      };

      // body font size first (from all lines): a running header/footer is small text —
      // a big line in the top band is a document title and must stay in the body
      const freqAll = {}; lines.forEach(L => { const s = Math.round(L.size); freqAll[s] = (freqAll[s] || 0) + L.text.length; });
      let bodySizeAll = 12, bestAll = -1; Object.keys(freqAll).forEach(s => { if (freqAll[s] > bestAll){ bestAll = freqAll[s]; bodySizeAll = +s; } });
      const isHeaderLine = L => inHeader(L.y) && L.size <= bodySizeAll + 1;
      const isFooterLine = L => inFooter(L.y) && L.size <= bodySizeAll + 1;

      // page 1's top/bottom bands become a real Word header/footer
      if (p === 1){
        const hLines = lines.filter(isHeaderLine);
        const fLines = lines.filter(isFooterLine);
        const hImgs = imgs.filter(im => inHeader(im.yTop - im.hPt / 2));
        if (hLines.length || hImgs.length){
          docHasHeader = true; headerParas = [];
          hImgs.forEach(im => {
            const wPx = Math.min(170, Math.max(24, Math.round(im.wPt * 4 / 3)));
            headerParas.push(new docx.Paragraph({ children: [new docx.ImageRun({ data: im.png.data, transformation: { width: wPx, height: Math.round(wPx * im.png.h / im.png.w) } })] }));
            totalImages++;
          });
          hLines.forEach(L => headerParas.push(new docx.Paragraph({ children: runsOf(L) })));
        }
        if (fLines.length){
          docHasFooter = true;
          footerParas = fLines.map(L => new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: runsOf(L) }));
        }
      }
      const bandImg = im => (im.yTop - im.hPt / 2);
      const bodyLines = lines.filter(L => {
        if (p === 1) return !isHeaderLine(L) && !isFooterLine(L);
        if (docHasHeader && inHeader(L.y)) return false;
        if (docHasFooter && inFooter(L.y)) return false;
        return true;
      });
      const bodyImgs = imgs.filter(im => {
        if (p === 1) return !inHeader(bandImg(im)) && !inFooter(bandImg(im));
        if (docHasHeader && inHeader(bandImg(im))) return false;
        if (docHasFooter && inFooter(bandImg(im))) return false;
        return true;
      });

      // body font size = the size carrying the most text on this page
      const freq = {}; bodyLines.forEach(L => { const s = Math.round(L.size); freq[s] = (freq[s] || 0) + L.text.length; });
      let bodySize = 12, best = -1; Object.keys(freq).forEach(s => { if (freq[s] > best){ best = freq[s]; bodySize = +s; } });

      const els = [];
      bodyLines.forEach(L => els.push({ kind: 'line', y: L.y, L }));
      bodyImgs.forEach(im => els.push({ kind: 'img', y: im.yTop, im }));
      els.sort((a, b) => b.y - a.y);

      const alignOf = L => { const c = (L.x0 + L.x1) / 2; return (Math.abs(c - pageW / 2) < 26 && L.x0 > 36) ? docx.AlignmentType.CENTER : undefined; };
      let cur = null, prev = null;
      const flush = () => { if (cur && cur.runs.length){ bodyChildren.push(new docx.Paragraph({ children: cur.runs })); } cur = null; };

      for (const el of els){
        if (el.kind === 'img'){
          flush();
          const wPx = Math.min(620, Math.max(24, Math.round(el.im.wPt * 4 / 3)));
          const cx = el.im.x + el.im.wPt / 2;
          const al = Math.abs(cx - pageW / 2) < 30 ? docx.AlignmentType.CENTER : (el.im.x > pageW * 0.55 ? docx.AlignmentType.RIGHT : undefined);
          bodyChildren.push(new docx.Paragraph({ alignment: al, children: [new docx.ImageRun({ data: el.im.png.data, transformation: { width: wPx, height: Math.round(wPx * el.im.png.h / el.im.png.w) } })] }));
          totalImages++; prev = el; continue;
        }
        const L = el.L, ratio = bodySize ? L.size / bodySize : 1;
        const mkRuns = forHeading => {
          const arr = []; let prevEndsSpace = true;
          L.runs.forEach(r => {
            let t = r.text;
            if (!prevEndsSpace && t && !/^\s/.test(t)) t = ' ' + t;
            prevEndsSpace = /\s$/.test(t) || t === '';
            const o = { text: t, bold: r.bold || undefined, italics: r.ital || undefined };
            if (!forHeading && Math.round(r.size) !== Math.round(bodySize)) o.size = Math.round(r.size * 2);
            arr.push(new docx.TextRun(o));
          });
          return arr;
        };
        if (ratio >= 1.22){
          flush();
          bodyChildren.push(new docx.Paragraph({ heading: ratio >= 1.42 ? docx.HeadingLevel.HEADING_1 : docx.HeadingLevel.HEADING_2, alignment: alignOf(L), children: mkRuns(true) }));
          totalChars += L.text.length; prev = el; continue;
        }
        const gap = (prev && prev.kind === 'line') ? (prev.L.y - L.y) : 999;
        if (cur && gap <= L.size * 1.9 && !alignOf(L)){
          const extra = mkRuns(false);
          cur.runs.push(new docx.TextRun(' '));
          extra.forEach(r => cur.runs.push(r));
          totalChars += L.text.length + 1;
        } else if (alignOf(L)){
          flush();
          bodyChildren.push(new docx.Paragraph({ alignment: alignOf(L), children: mkRuns(false) }));
          totalChars += L.text.length;
        } else {
          flush();
          cur = { runs: mkRuns(false) };
          totalChars += L.text.length;
        }
        prev = el;
      }
      flush();
      if (p < pdf.numPages) bodyChildren.push(new docx.Paragraph({ children: [new docx.PageBreak()] }));
      out.innerHTML = '<p>Working — page ' + p + ' of ' + pdf.numPages + '…</p>';
    }

    if (totalChars < 10){
      out.innerHTML = '<p><strong>No readable text was found.</strong> This PDF is most likely scanned images — a text-based converter cannot read it. It needs OCR (reading the pictures of the pages), which this free tool does not do.</p>';
      return;
    }
    const section = { properties: {}, children: bodyChildren };
    if (headerParas) section.headers = { default: new docx.Header({ children: headerParas }) };
    if (footerParas) section.footers = { default: new docx.Footer({ children: footerParas }) };
    const doc = new docx.Document({ sections: [section] });
    const blob = await docx.Packer.toBlob(doc);
    const name = ftBase(file.name) + '.docx';
    out.innerHTML = '<p><strong>Done.</strong> Converted about ' + totalChars.toLocaleString() + ' characters' + (totalImages ? ' and ' + totalImages + ' image(s)' : '') + ' from ' + pdf.numPages + ' page(s) into a Word file (' + ftSize(blob.size) + '). Headings, bold text, alignment, headers/footers and images are carried over where the PDF has them; the exact layout, columns and table borders are not.</p>';
    const btn = document.createElement('button');
    btn.className = 'btn'; btn.textContent = 'Download ' + name;
    btn.onclick = () => ftDownload(blob, name);
    out.appendChild(btn);
    window.__ftLastBlob = blob; window.__ftLastName = name;
  } catch(e){
    out.innerHTML = '<p>Something went wrong: ' + esc(e.message || e) + ' — the file may be damaged or password-protected.</p>';
  }
}

/* ---------- 21. Word to PDF ---------- */
async function ftWordToPdf(){
  const out = $('wp-out');
  const input = $('wp-file');
  const file = input.files && input.files[0];
  if (!file){ out.innerHTML = '<p>Please choose a .docx file first.</p>'; return; }
  if (!/\.docx$/i.test(file.name)){
    out.innerHTML = '<p>This tool reads <strong>.docx</strong> files (Word 2007 and later). Old .doc files need to be saved as .docx first — in Word or Google Docs: File → Save as → Word (.docx).</p>'; return;
  }
  if (typeof mammoth === 'undefined' || typeof html2pdf === 'undefined'){
    out.innerHTML = '<p>The conversion libraries are still loading — check your connection and try again.</p>'; return;
  }
  out.innerHTML = '<p>Working — converting your document…</p>';
  try {
    const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
    const holder = $('wp-render');
    holder.innerHTML = result.value || '<p>(The document appears to be empty.)</p>';
    const name = ftBase(file.name) + '.pdf';
    const opt = {
      margin: 12,
      filename: name,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };
    const blob = await html2pdf().set(opt).from(holder).outputPdf('blob');
    out.innerHTML = '<p><strong>Done.</strong> Your PDF is ready (' + name + ', ' + ftSize(blob.size) + '). Formatting stays close to the original for normal documents; complex tables, text boxes and exact page breaks can differ.</p>';
    const btn = document.createElement('button');
    btn.className = 'btn'; btn.textContent = 'Download ' + name;
    btn.onclick = () => ftDownload(blob, name);
    out.appendChild(btn);
    window.__ftLastBlob = blob; window.__ftLastName = name;
  } catch(e){
    out.innerHTML = '<p>Something went wrong: ' + esc(e.message || e) + ' — the file may be damaged, or it may not be a real .docx file.</p>';
  }
}

/* ============================================================
   FILE TOOLS (22–26) — added 2026-11-07 (second batch)
   ============================================================ */

/* ---------- 22. Image Resizer ---------- */
let ftResFile = null, ftResNat = { w: 0, h: 0 };
function ftResPick(input){
  ftResFile = input.files && input.files[0];
  const info = $('ir-info');
  $('ir-out').innerHTML = '';
  if (!ftResFile){ info.textContent = ''; return; }
  ftLoadImage(ftResFile).then(({ img, url }) => {
    ftResNat = { w: img.naturalWidth, h: img.naturalHeight };
    URL.revokeObjectURL(url);
    info.textContent = 'Selected: ' + ftResFile.name + ' — ' + ftResNat.w + ' × ' + ftResNat.h + ' px, ' + ftSize(ftResFile.size);
    $('ir-w').value = ftResNat.w; $('ir-h').value = ftResNat.h;
  }).catch(e => { info.textContent = e.message; });
}
function ftResSync(from){
  if (!ftResNat.w) return;
  const lock = $('ir-lock').checked;
  const w = parseInt($('ir-w').value, 10), h = parseInt($('ir-h').value, 10);
  if (lock && from === 'w' && w > 0) $('ir-h').value = Math.max(1, Math.round(w * ftResNat.h / ftResNat.w));
  if (lock && from === 'h' && h > 0) $('ir-w').value = Math.max(1, Math.round(h * ftResNat.w / ftResNat.h));
  if (from === 'pct'){
    const p = parseFloat($('ir-pct').value);
    if (p > 0){ $('ir-w').value = Math.max(1, Math.round(ftResNat.w * p / 100)); $('ir-h').value = Math.max(1, Math.round(ftResNat.h * p / 100)); }
  }
}
async function ftResize(){
  const out = $('ir-out');
  if (!ftResFile){ out.innerHTML = '<p>Please choose an image first.</p>'; return; }
  const w = parseInt($('ir-w').value, 10), h = parseInt($('ir-h').value, 10);
  if (!w || !h || w < 1 || h < 1){ out.innerHTML = '<p>Please enter valid width and height in pixels.</p>'; return; }
  let format = $('ir-format').value;
  if (format === 'same') format = ftResFile.type === 'image/png' ? 'image/png' : (ftResFile.type === 'image/webp' ? 'image/webp' : 'image/jpeg');
  const ext = format === 'image/png' ? 'png' : (format === 'image/webp' ? 'webp' : 'jpg');
  out.innerHTML = '<p>Working…</p>';
  try {
    const { img, url } = await ftLoadImage(ftResFile);
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d');
    if (format === 'image/jpeg'){ ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); }
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    const blob = await ftCanvasBlob(cv, format, 0.92);
    const name = ftBase(ftResFile.name) + '-' + w + 'x' + h + '.' + ext;
    out.innerHTML = '<p><strong>Done.</strong> ' + ftResNat.w + ' × ' + ftResNat.h + ' → <strong>' + w + ' × ' + h + '</strong> px (' + ftSize(blob.size) + ').</p>';
    ftShowImageResult(out, blob, name);
  } catch(e){ out.innerHTML = '<p>Something went wrong: ' + esc(e.message || e) + '</p>'; }
}

/* ---------- 23. Image Cropper ---------- */
let ftCrop = null; // {file,img,url,natW,natH, sel:{x,y,w,h} in display px, dispW,dispH}
function ftCropPick(input){
  const file = input.files && input.files[0];
  const out = $('icp-out'); out.innerHTML = '';
  if (!file) return;
  ftLoadImage(file).then(({ img, url }) => {
    ftCrop = { file, img, url, natW: img.naturalWidth, natH: img.naturalHeight, sel: null };
    const stage = $('icp-stage'), pic = $('icp-img');
    pic.src = url;
    stage.style.display = 'block';
    requestAnimationFrame(() => {
      const dw = pic.clientWidth, dh = pic.clientHeight;
      ftCrop.dispW = dw; ftCrop.dispH = dh;
      const s = { x: dw * 0.1, y: dh * 0.1, w: dw * 0.8, h: dh * 0.8 };
      ftCrop.sel = s; ftCropDrawSel();
      $('icp-info').textContent = 'Image: ' + ftCrop.natW + ' × ' + ftCrop.natH + ' px. Drag the box to move it, drag the corner to resize.';
    });
  }).catch(e => { out.innerHTML = '<p>' + esc(e.message) + '</p>'; });
}
function ftCropDrawSel(){
  if (!ftCrop || !ftCrop.sel) return;
  const box = $('icp-sel'), s = ftCrop.sel;
  box.style.display = 'block';
  box.style.left = s.x + 'px'; box.style.top = s.y + 'px';
  box.style.width = s.w + 'px'; box.style.height = s.h + 'px';
  const rx = ftCrop.natW / ftCrop.dispW, ry = ftCrop.natH / ftCrop.dispH;
  $('icp-size').textContent = 'Crop area: ' + Math.round(s.w * rx) + ' × ' + Math.round(s.h * ry) + ' px';
}
function ftCropAspect(){
  if (!ftCrop || !ftCrop.sel) return;
  const v = $('icp-aspect').value;
  if (v === 'free') return;
  const [aw, ah] = v.split(':').map(Number);
  const s = ftCrop.sel;
  s.h = s.w * ah / aw;
  if (s.y + s.h > ftCrop.dispH){ s.h = ftCrop.dispH - s.y; s.w = s.h * aw / ah; }
  ftCropDrawSel();
}
function ftCropPointer(){
  const box = $('icp-sel'), handle = $('icp-handle');
  let drag = null;
  function down(e, mode){
    if (!ftCrop) return;
    e.preventDefault();
    const pt = e.touches ? e.touches[0] : e;
    drag = { mode, sx: pt.clientX, sy: pt.clientY, sel: { ...ftCrop.sel } };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }
  function move(e){
    if (!drag || !ftCrop) return;
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy, s = ftCrop.sel, S = drag.sel;
    if (drag.mode === 'move'){
      s.x = Math.min(Math.max(0, S.x + dx), ftCrop.dispW - s.w);
      s.y = Math.min(Math.max(0, S.y + dy), ftCrop.dispH - s.h);
    } else {
      s.w = Math.min(Math.max(24, S.w + dx), ftCrop.dispW - s.x);
      s.h = Math.min(Math.max(24, S.h + dy), ftCrop.dispH - s.y);
      const av = $('icp-aspect').value;
      if (av !== 'free'){ const [aw, ah] = av.split(':').map(Number); s.h = s.w * ah / aw; if (s.y + s.h > ftCrop.dispH){ s.h = ftCrop.dispH - s.y; s.w = s.h * aw / ah; } }
    }
    ftCropDrawSel();
  }
  function up(){ drag = null; document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); }
  box.addEventListener('pointerdown', e => down(e, 'move'));
  handle.addEventListener('pointerdown', e => { e.stopPropagation(); down(e, 'resize'); });
}
async function ftDoCrop(){
  const out = $('icp-out');
  if (!ftCrop || !ftCrop.sel){ out.innerHTML = '<p>Please choose an image first.</p>'; return; }
  const s = ftCrop.sel, rx = ftCrop.natW / ftCrop.dispW, ry = ftCrop.natH / ftCrop.dispH;
  const sx = Math.round(s.x * rx), sy = Math.round(s.y * ry);
  const sw = Math.max(1, Math.round(s.w * rx)), sh = Math.max(1, Math.round(s.h * ry));
  const format = $('icp-format').value;
  const ext = format === 'image/png' ? 'png' : 'jpg';
  const cv = document.createElement('canvas'); cv.width = sw; cv.height = sh;
  const ctx = cv.getContext('2d');
  if (format === 'image/jpeg'){ ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, sw, sh); }
  ctx.drawImage(ftCrop.img, sx, sy, sw, sh, 0, 0, sw, sh);
  const blob = await ftCanvasBlob(cv, format, 0.92);
  const name = ftBase(ftCrop.file.name) + '-crop-' + sw + 'x' + sh + '.' + ext;
  out.innerHTML = '<p><strong>Done.</strong> Cropped to <strong>' + sw + ' × ' + sh + '</strong> px (' + ftSize(blob.size) + ').</p>';
  ftShowImageResult(out, blob, name);
}

/* ---------- 24. Image to PDF ---------- */
let ftI2pFiles = [];
function ftI2pPick(input){
  Array.from(input.files || []).forEach(f => { if (/^image\//.test(f.type)) ftI2pFiles.push(f); });
  input.value = '';
  const info = $('ip-info');
  info.innerHTML = ftI2pFiles.length
    ? ftI2pFiles.map((f, i) => (i + 1) + '. ' + esc(f.name) + ' (' + ftSize(f.size) + ')').join('<br>')
    : '';
  $('ip-out').innerHTML = '';
}
async function ftImagesToPdf(){
  const out = $('ip-out');
  if (!ftI2pFiles.length){ out.innerHTML = '<p>Please add at least one image.</p>'; return; }
  if (typeof window.jspdf === 'undefined'){ out.innerHTML = '<p>The PDF library is still loading — check your connection and try again.</p>'; return; }
  out.innerHTML = '<p>Working…</p>';
  try {
    const { jsPDF } = window.jspdf;
    let doc = null;
    for (const f of ftI2pFiles){
      const { img, url } = await ftLoadImage(f);
      const wMm = img.naturalWidth * 25.4 / 96, hMm = img.naturalHeight * 25.4 / 96;
      const orient = wMm > hMm ? 'landscape' : 'portrait';
      if (!doc) doc = new jsPDF({ unit: 'mm', format: [wMm, hMm], orientation: orient });
      else doc.addPage([wMm, hMm], orient);
      const type = f.type === 'image/png' ? 'PNG' : 'JPEG';
      doc.addImage(img, type, 0, 0, wMm, hMm);
      URL.revokeObjectURL(url);
    }
    const blob = doc.output('blob');
    out.innerHTML = '<p><strong>Done.</strong> ' + ftI2pFiles.length + ' image(s) → one PDF (' + ftSize(blob.size) + ').</p>';
    const btn = document.createElement('button');
    btn.className = 'btn'; btn.textContent = 'Download images.pdf';
    btn.onclick = () => ftDownload(blob, 'images.pdf');
    out.appendChild(btn);
    window.__ftLastBlob = blob; window.__ftLastName = 'images.pdf';
  } catch(e){ out.innerHTML = '<p>Something went wrong: ' + esc(e.message || e) + '</p>'; }
}

/* ---------- 25. PDF to Images ---------- */
let ftP2iPages = []; // {blob, name}
async function ftPdfToImages(){
  const out = $('pi-out'), grid = $('pi-grid');
  const file = $('pi-file').files && $('pi-file').files[0];
  if (!file){ out.innerHTML = '<p>Please choose a PDF file first.</p>'; return; }
  if (typeof pdfjsLib === 'undefined'){ out.innerHTML = '<p>The PDF library is still loading — check your connection and try again.</p>'; return; }
  const format = $('pi-format').value; // image/png or image/jpeg
  const ext = format === 'image/png' ? 'png' : 'jpg';
  const scale = parseFloat($('pi-scale').value) || 2;
  out.innerHTML = '<p>Working…</p>'; grid.innerHTML = ''; ftP2iPages = [];
  try {
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    for (let p = 1; p <= pdf.numPages; p++){
      const page = await pdf.getPage(p);
      const vp = page.getViewport({ scale });
      const cv = document.createElement('canvas');
      cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cv.width, cv.height);
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      const blob = await ftCanvasBlob(cv, format, 0.92);
      const name = ftBase(file.name) + '-page-' + p + '.' + ext;
      ftP2iPages.push({ blob, name });
      const card = document.createElement('div');
      card.style.cssText = 'border:1px solid #e2e8f0;border-radius:10px;padding:10px';
      const im = document.createElement('img');
      im.src = URL.createObjectURL(blob); im.alt = 'Page ' + p;
      im.style.cssText = 'width:100%;height:auto;border-radius:6px';
      const b = document.createElement('button');
      b.className = 'btn secondary'; b.textContent = 'Page ' + p + ' — ' + ftSize(blob.size);
      b.onclick = () => ftDownload(blob, name);
      card.appendChild(im); card.appendChild(b);
      grid.appendChild(card);
      out.innerHTML = '<p>Working — page ' + p + ' of ' + pdf.numPages + '…</p>';
    }
    out.innerHTML = '<p><strong>Done.</strong> ' + pdf.numPages + ' page(s) converted to ' + ext.toUpperCase() + '. Download pages one by one, or all together as a ZIP.</p>';
    if (typeof JSZip !== 'undefined' && ftP2iPages.length > 1){
      const zb = document.createElement('button');
      zb.className = 'btn'; zb.textContent = 'Download all as ZIP';
      zb.onclick = async () => {
        const zip = new JSZip();
        ftP2iPages.forEach(pg => zip.file(pg.name, pg.blob));
        const zblob = await zip.generateAsync({ type: 'blob' });
        ftDownload(zblob, ftBase(file.name) + '-images.zip');
      };
      out.appendChild(zb);
    }
    window.__ftLastBlob = ftP2iPages[0] && ftP2iPages[0].blob;
    window.__ftLastName = ftP2iPages[0] && ftP2iPages[0].name;
  } catch(e){ out.innerHTML = '<p>Something went wrong: ' + esc(e.message || e) + ' — the file may be damaged or password-protected.</p>'; }
}

/* ---------- 26. Blur Tool (full image + background via segmentation) ---------- */
let ftBlur = { file: null, img: null, url: null, mask: null, seg: null, segReady: false };
function ftBlurPick(input){
  const f = input.files && input.files[0];
  $('bl-out').innerHTML = '';
  if (!f) return;
  ftLoadImage(f).then(({ img, url }) => {
    ftBlur.file = f; ftBlur.img = img; ftBlur.url = url; ftBlur.mask = null;
    $('bl-info').textContent = 'Selected: ' + f.name + ' — ' + img.naturalWidth + ' × ' + img.naturalHeight + ' px, ' + ftSize(f.size);
    ftBlurDraw();
  }).catch(e => { $('bl-out').innerHTML = '<p>' + esc(e.message) + '</p>'; });
}
function ftBlurMode(){
  const m = document.querySelector('input[name="bl-mode"]:checked');
  return m ? m.value : 'full';
}
async function ftBlurEnsureSeg(statusEl){
  if (ftBlur.segReady) return true;
  if (typeof SelfieSegmentation === 'undefined') return false;
  statusEl.innerHTML = '<p>Loading the people-detection model (one-time download)…</p>';
  ftBlur.seg = new SelfieSegmentation({ locateFile: f => 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1675465747/' + f });
  ftBlur.seg.setOptions({ modelSelection: 1 });
  ftBlur.seg.onResults(res => { ftBlur.mask = res.segmentationMask; ftBlurDraw(); });
  await ftBlur.seg.send({ image: ftBlur.img });
  ftBlur.segReady = true;
  return true;
}
async function ftBlurDraw(){
  const out = $('bl-out');
  if (!ftBlur.img) return;
  const strength = parseInt($('bl-strength').value, 10) || 10;
  $('bl-strength-val').textContent = strength + ' px';
  const img = ftBlur.img, w = img.naturalWidth, h = img.naturalHeight;
  const mode = ftBlurMode();
  if (mode === 'background' && !ftBlur.mask){
    const ok = await ftBlurEnsureSeg(out).catch(() => false);
    if (!ok || !ftBlur.mask){
      out.innerHTML = '<p><strong>Background blur could not start</strong> — the people-detection model did not load (connection or browser support). Full-image blur below still works: switch the mode to “Whole image”.</p>';
      return;
    }
  }
  const base = document.createElement('canvas'); base.width = w; base.height = h;
  const bctx = base.getContext('2d');
  bctx.filter = 'blur(' + strength + 'px)';
  bctx.drawImage(img, -strength, -strength, w + strength * 2, h + strength * 2);
  bctx.filter = 'none';
  const cv = $('bl-canvas');
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d');
  if (mode === 'background' && ftBlur.mask){
    ctx.drawImage(base, 0, 0);
    // person cut-out: original image masked by the segmentation mask
    const person = document.createElement('canvas'); person.width = w; person.height = h;
    const pctx = person.getContext('2d');
    pctx.drawImage(ftBlur.mask, 0, 0, w, h);
    pctx.globalCompositeOperation = 'source-in';
    pctx.drawImage(img, 0, 0);
    ctx.drawImage(person, 0, 0);
  } else {
    ctx.drawImage(base, 0, 0);
  }
  cv.style.display = 'block';
}
function ftBlurDownload(){
  const out = $('bl-out');
  if (!ftBlur.img){ out.innerHTML = '<p>Please choose an image first.</p>'; return; }
  $('bl-canvas').toBlob(blob => {
    const name = ftBase(ftBlur.file.name) + '-blurred.png';
    ftDownload(blob, name);
    window.__ftLastBlob = blob; window.__ftLastName = name;
    out.innerHTML = '<p><strong>Done.</strong> Blurred image downloaded (' + ftSize(blob.size) + ').</p>';
  }, 'image/png');
}
