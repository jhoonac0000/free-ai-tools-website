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
