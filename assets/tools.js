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
  const body = `Hi there,\n\nI came across ${theirs} and had one specific idea for you: ${offer}.\n\nI run ${biz}. Most businesses like yours lose enquiries because of one small gap — and fixing it usually takes less than a week. Would you be open to a quick 10-minute look at what that gap is for ${theirs}?\n\nNo pressure at all — if it is not a fit, I will leave you alone.\n\nBest regards,\n${name || 'Your Name'}`;
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
/* Safe rewording, in three layers:
   1) Whole-phrase swaps whose grammar cannot break ("in order to" → "to").
   2) Verb swaps matched to the EXACT inflected form (uses→utilizes, used→utilized),
      so tense and subject–verb agreement are preserved by construction.
   3) A small set of adjectives/nouns with true one-word equivalents.
   Guards keep noun uses out of the verb layer ("the use of…", "used car") and
   phrasal verbs intact ("get up" never becomes "obtain up"). */
const PARA_PHRASES = [
  ['in spite of the fact that', 'although'], ['due to the fact that', 'because'],
  ['in order to', 'to'], ['so as to', 'to'],
  ['a large number of', 'many'], ['a lot of', 'many'], ['lots of', 'many'],
  ['has the ability to', 'can'], ['have the ability to', 'can'],
  ['is able to', 'can'], ['are able to', 'can'], ['was able to', 'could'], ['were able to', 'could'],
  ['in the event that', 'if'], ['at this point in time', 'now'], ['at the present time', 'currently'],
  ['in the near future', 'soon'], ['prior to', 'before'], ['subsequent to', 'after'],
  ['in addition to', 'besides'], ['with regard to', 'about'], ['in regards to', 'about'],
  ['take into consideration', 'consider'], ['takes into consideration', 'considers'], ['took into consideration', 'considered'],
  ['make a decision', 'decide'], ['makes a decision', 'decides'], ['made a decision', 'decided'],
  ['make sure', 'ensure'], ['makes sure', 'ensures'], ['make use of', 'use'],
  ['first of all', 'first'], ['as a result of', 'because of'], ['on a daily basis', 'daily'],
  ['each and every', 'each'], ['by the way', 'incidentally'], ['in my opinion', 'in my view']
];
/* [base, -s, past, -ing] → [base, -s, past, -ing]. Every cell is swapped only
   for the identical cell, so agreement and tense survive by construction. */
const PARA_VERBS = [
  ['use','uses','used','using','utilize','utilizes','utilized','utilizing'],
  ['make','makes','made','making','create','creates','created','creating'],
  ['help','helps','helped','helping','assist','assists','assisted','assisting'],
  ['show','shows','showed','showing','display','displays','displayed','displaying'],
  ['need','needs','needed','needing','require','requires','required','requiring'],
  ['start','starts','started','starting','begin','begins','began','beginning'],
  ['give','gives','gave','giving','provide','provides','provided','providing'],
  ['get','gets','got','getting','obtain','obtains','obtained','obtaining'],
  ['buy','buys','bought','buying','purchase','purchases','purchased','purchasing'],
  ['try','tries','tried','trying','attempt','attempts','attempted','attempting'],
  ['ask','asks','asked','asking','request','requests','requested','requesting'],
  ['find','finds','found','finding','discover','discovers','discovered','discovering'],
  ['keep','keeps','kept','keeping','retain','retains','retained','retaining'],
  ['build','builds','built','building','construct','constructs','constructed','constructing'],
  ['choose','chooses','chose','choosing','select','selects','selected','selecting'],
  ['end','ends','ended','ending','finish','finishes','finished','finishing'],
  ['allow','allows','allowed','allowing','permit','permits','permitted','permitting'],
  ['improve','improves','improved','improving','enhance','enhances','enhanced','enhancing'],
  ['check','checks','checked','checking','verify','verifies','verified','verifying'],
  ['change','changes','changed','changing','modify','modifies','modified','modifying']
];
const PARA_WORDS = {
  important:'essential', big:'large', bigger:'larger', biggest:'largest', small:'little',
  fast:'quick', faster:'quicker', fastest:'quickest', easy:'simple', easier:'simpler', easiest:'simplest',
  difficult:'challenging', main:'primary', sure:'certain', huge:'enormous', smart:'clever',
  cheap:'affordable', expensive:'costly', famous:'well-known', great:'excellent',
  result:'outcome', results:'outcomes', problem:'issue', problems:'issues',
  idea:'concept', ideas:'concepts', way:'method', ways:'methods', tiny:'very small'
};
const PARA_TYPOS = { teh:'the', recieve:'receive', adress:'address', seperate:'separate', definately:'definitely', occured:'occurred', goverment:'government', enviroment:'environment', neccessary:'necessary', accomodate:'accommodate', existance:'existence', independant:'independent' };
const PARA_DET = new Set('the,a,an,this,that,these,those,my,your,his,her,its,our,their,some,any,no,much,many,few,several,each,every,another'.split(','));
const PARA_PREV_VERB_OK = new Set('to,will,can,could,shall,should,would,may,might,must,i,you,we,they,he,she,it,me,him,her,us,them,do,does,did,please'.split(','));
const PARA_PARTICLES = new Set('up,out,off,on,in,back,over,down,away,along,through,across,around,together,apart'.split(','));
function paraphrase(){
  const raw = $('p-text').value.trim();
  if(!raw){ out('p-out', '<p>Please paste some text.</p>'); return; }
  const fixed = [];
  let text = ' ' + raw.replace(/\s+/g, ' ') + ' ';
  // layer 0: safe typo + "could of" fixes (same meaning, strictly more correct)
  Object.keys(PARA_TYPOS).forEach(t => {
    const re = new RegExp('\\b' + t + '\\b', 'gi');
    if(re.test(text)){ text = text.replace(re, m => m[0] === m[0].toUpperCase() ? PARA_TYPOS[t][0].toUpperCase() + PARA_TYPOS[t].slice(1) : PARA_TYPOS[t]); fixed.push(`"${t}" → "${PARA_TYPOS[t]}"`); }
  });
  text = text.replace(/\b(could|should|would|must)\s+of\b/gi, (m, a) => { fixed.push(`"${a.toLowerCase()} of" → "${a.toLowerCase()} have"`); return a + ' have'; });
  text = text.replace(/(^|[.!?]\s+)i\s/g, (m, a) => a + 'I ');
  // layer 1: phrases, protected by placeholders so the word layer cannot re-touch them
  const held = [];
  PARA_PHRASES.forEach(([from, to]) => {
    const re = new RegExp('\\b' + from.replace(/ /g, '\\s+') + '\\b', 'gi');
    text = text.replace(re, m => {
      const rep = m[0] === m[0].toUpperCase() ? to[0].toUpperCase() + to.slice(1) : to;
      held.push(rep);
      return '\u0001' + (held.length - 1) + '\u0002';
    });
  });
  // layer 2 + 3: token-by-token with context guards
  const verbMap = {};
  PARA_VERBS.forEach(f => { for(let i = 0; i < 4; i++) verbMap[f[i]] = f[i + 4]; });
  const tokens = text.split(/(\b[\w']+\b)/); // words at odd indexes
  const wordAt = i => (tokens[i] || '').toLowerCase();
  for(let i = 1; i < tokens.length; i += 2){
    const tok = tokens[i], low = tok.toLowerCase();
    const prev = wordAt(i - 2), next = wordAt(i + 2);
    if(/^[A-Z]/.test(tok) && prev && !/[.!?]/.test(tokens[i - 1])) continue; // mid-sentence capital = name, leave it
    let rep = null;
    if(verbMap[low]){
      const baseForm = PARA_VERBS.some(f => f[0] === low);
      const nounContext = PARA_DET.has(prev) || next === 'of';
      const phrasal = PARA_PARTICLES.has(next) || ((low === 'get' || low === 'gets' || low === 'got') && next === 'to');
      if(baseForm){
        const startsSentence = i < 3 || /[.!?]\s*$/.test(tokens.slice(0, i).join(''));
        if(!nounContext && !phrasal && (PARA_PREV_VERB_OK.has(prev) || startsSentence || /s$/.test(prev))) rep = verbMap[low];
      } else if(!nounContext && !phrasal) rep = verbMap[low];
    } else if(PARA_WORDS[low] && !PARA_DET.has(low)) rep = PARA_WORDS[low];
    if(rep) tokens[i] = /^[A-Z]/.test(tok) ? rep[0].toUpperCase() + rep.slice(1) : rep;
  }
  text = tokens.join('');
  held.forEach((rep, i) => { text = text.split('\u0001' + i + '\u0002').join(rep); });
  text = text.trim().replace(/\s+([,.!?;:])/g, '$1');
  text = text.replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, m => m.toUpperCase());
  const issues = [];
  if(/\s{2,}/.test(raw)) issues.push('Double spaces found — cleaned up.');
  if(/\b(\w+)\s+\1\b/i.test(raw)) issues.push('A repeated word was found — check it.');
  if(!/[.!?]$/.test(raw)) issues.push('The text does not end with a full stop.');
  if(/\bi\b/.test(raw)) issues.push('Standalone "i" was capitalised to "I".');
  fixed.forEach(f => issues.push('Fixed: ' + f + '.'));
  out('p-out', 'PARAPHRASED\n' + text + '\n\nGRAMMAR NOTES\n' + (issues.length ? issues.map(i => '• ' + i).join('\n') : '• No common issues found.'));
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
  const kw = $('b-kw').value.trim(), style = $('b-style').value || 'Modern';
  if(!kw){ out('b-out', '<p>Please enter a keyword for your business.</p>'); return; }
  const K = kw[0].toUpperCase() + kw.slice(1);          // capitalised keyword
  const KJ = K.replace(/\s+/g, '');                      // joined form, e.g. CoffeeShop
  const low = kw.toLowerCase();
  const sets = {
    Modern: {
      names: [`Nova ${K}`, `Swift ${K}`, `Prime ${K}`, `${KJ}Lab`, `${KJ}Hub`, `Urban${KJ}`, `${K} Works`, `Lumen ${K}`],
      slogans: [`${K}, engineered for busy people.`, `Less noise. More ${low}.`, `${K} at the speed of now.`, `Smart ${low}, zero friction.`, `Built for what's next in ${low}.`]
    },
    Classic: {
      names: [`Golden ${K}`, `Heritage ${K}`, `${K} & Co.`, `House of ${K}`, `Royal ${K}`, `The ${K} House`, `Sterling ${K}`, `${K} Co.`],
      slogans: [`${K}, done right since day one.`, `Trusted hands. Honest ${low}.`, `Where ${low} meets quality.`, `The name families recommend for ${low}.`, `Solid ${low}, fairly priced.`]
    },
    Playful: {
      names: [`Happy ${K}`, `Zippy ${K}`, `The ${K} Club`, `${KJ}Pop`, `Jolly ${K}`, `${K} Wagon`, `Sunny ${K}`, `The ${K} Box`],
      slogans: [`${K} that makes you smile.`, `Seriously fun ${low}.`, `Pop in for the best ${low} in town.`, `Little shop, big ${low} energy.`, `Your happy place for ${low}.`]
    }
  };
  const s = sets[style] || sets.Modern;
  out('b-out', `BUSINESS NAMES (${style} style)\n` + s.names.map((n,i) => `${i+1}. ${n}`).join('\n') + '\n\nSLOGANS\n' + s.slogans.map((x,i) => `${i+1}. ${x}`).join('\n'));
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
   mammoth, jspdf) are loaded per-page from CDN.
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
  const mode = ($('pc-mode') && $('pc-mode').value) || 'smart';
  if (mode === 'strong') return ftCompressPdfStrong(file, out);
  return ftCompressPdfSmart(file, out);
}

/* Smart mode: rebuild the PDF with pdf-lib — strip metadata, recompress the
   file structure into object streams, and shrink oversized embedded photos.
   Page content streams are never re-rendered, so text stays 100% selectable
   and searchable. */
async function ftCompressPdfSmart(file, out){
  if (typeof PDFLib === 'undefined'){
    out.innerHTML = '<p>The PDF library is still loading — check your connection and try again.</p>'; return;
  }
  out.innerHTML = '<p>Working — rebuilding your PDF without touching the pages…</p>';
  try {
    const { PDFDocument, PDFName, PDFNumber, PDFRawStream } = PDFLib;
    const doc = await PDFDocument.load(await file.arrayBuffer());
    // 1) metadata strip
    try {
      doc.setTitle(''); doc.setAuthor(''); doc.setSubject(''); doc.setKeywords([]);
      doc.setProducer(''); doc.setCreator('');
      doc.catalog.delete(PDFName.of('Metadata'));
    } catch(e){ /* metadata is best-effort */ }
    // 2) oversized embedded JPEG photos → downscale + re-encode in place
    let photos = 0;
    try {
      for (const [ref, obj] of doc.context.enumerateIndirectObjects()){
        try {
          if (!(obj instanceof PDFRawStream) || !obj.dict || !obj.dict.get) continue;
          const dict = obj.dict;
          const sub = dict.get(PDFName.of('Subtype'));
          if (!sub || sub.toString() !== '/Image') continue;
          const filt = dict.get(PDFName.of('Filter'));
          if (!filt || filt.toString().indexOf('DCTDecode') === -1) continue;
          if (dict.get(PDFName.of('SMask')) || dict.get(PDFName.of('ImageMask'))) continue;
          const cs = (dict.get(PDFName.of('ColorSpace')) || '').toString();
          if (cs.indexOf('DeviceRGB') === -1 && cs.indexOf('DeviceGray') === -1) continue;
          const w = dict.get(PDFName.of('Width')), h = dict.get(PDFName.of('Height'));
          const W = w && w.asNumber ? w.asNumber() : 0, H = h && h.asNumber ? h.asNumber() : 0;
          if (!W || !H || Math.max(W, H) <= 1600) continue;
          const bmp = await createImageBitmap(new Blob([obj.getContents()], { type: 'image/jpeg' }));
          const sc = 1600 / Math.max(W, H), nw = Math.round(W * sc), nh = Math.round(H * sc);
          const cv = document.createElement('canvas'); cv.width = nw; cv.height = nh;
          cv.getContext('2d').drawImage(bmp, 0, 0, nw, nh);
          if (bmp.close) bmp.close();
          const jpg = await ftCanvasBlob(cv, 'image/jpeg', 0.72);
          const bytes = new Uint8Array(await jpg.arrayBuffer());
          dict.set(PDFName.of('Width'), PDFNumber.of(nw));
          dict.set(PDFName.of('Height'), PDFNumber.of(nh));
          dict.set(PDFName.of('Length'), PDFNumber.of(bytes.length));
          dict.set(PDFName.of('ColorSpace'), PDFName.of(cs.indexOf('DeviceGray') !== -1 ? 'DeviceGray' : 'DeviceRGB'));
          dict.set(PDFName.of('BitsPerComponent'), PDFNumber.of(8));
          doc.context.assign(ref, PDFRawStream.of(dict, bytes));
          photos++;
        } catch(e){ /* one bad image never blocks the rest */ }
      }
    } catch(e){ /* image pass is best-effort */ }
    // 2b) recompress page content streams that were stored uncompressed
    // (common in older generators) — same bytes afterwards, just flate-packed,
    // so the text layer is untouched.
    let streamsPacked = 0;
    try {
      const seen = new Set();
      doc.getPages().forEach(pg => {
        const c = pg.node.get(PDFName.of('Contents'));
        if (!c) return;
        const refs = [];
        if (c instanceof PDFLib.PDFRef) refs.push(c);
        else if (c && c.asArray) c.asArray().forEach(r => { if (r instanceof PDFLib.PDFRef) refs.push(r); });
        refs.forEach(ref => {
          if (seen.has(ref.toString())) return;
          seen.add(ref.toString());
          try {
            const obj = doc.context.lookup(ref);
            if (!(obj instanceof PDFRawStream) || obj.dict.get(PDFName.of('Filter'))) return;
            const raw = obj.getContents();
            if (!raw || raw.length < 200) return;
            doc.context.assign(ref, doc.context.flateStream(raw, {}));
            streamsPacked++;
          } catch(e){ /* leave this stream as it was */ }
        });
      });
    } catch(e){ /* stream pass is best-effort */ }
    // 3) save with object streams (recompressed structure)
    const bytes = await doc.save({ useObjectStreams: true });
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const name = ftBase(file.name) + '-compressed.pdf';
    window.__ftLastBlob = blob; window.__ftLastName = name;
    const saved = file.size - blob.size;
    if (saved <= 0){
      out.innerHTML = '<p><strong>Honest result:</strong> the Smart rebuild came out at ' + ftSize(blob.size) + ' — no smaller than your original (' + ftSize(file.size) + '). Your file was already efficiently made, and Smart mode will not damage text just to force a smaller number. If this is a scanned or photo-heavy PDF and size matters more than selectable text, use <strong>Strong</strong> mode instead.</p>';
      return;
    }
    out.innerHTML = '<p><strong>Done.</strong> ' + ftSize(file.size) + ' → <strong>' + ftSize(blob.size) + '</strong> (' + Math.round(saved / file.size * 100) + '% smaller, ' + doc.getPageCount() + ' pages, Smart mode' + (photos ? ' — ' + photos + ' oversized photo(s) shrunk' : '') + (streamsPacked ? ' — ' + streamsPacked + ' uncompressed page stream(s) packed' : '') + '). <strong>Your text is still fully selectable and searchable</strong> — the pages were never re-rendered.</p>';
    const btn = document.createElement('button');
    btn.className = 'btn'; btn.textContent = 'Download ' + name;
    btn.onclick = () => ftDownload(blob, name);
    out.appendChild(btn);
  } catch(e){
    out.innerHTML = '<p>Something went wrong: ' + esc(e.message || e) + ' — the file may be damaged or password-protected.</p>';
  }
}

/* Strong mode: re-render every page as a JPEG picture (the old behaviour).
   Smallest results for scans — but text becomes part of the picture. */
async function ftCompressPdfStrong(file, out){
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

    let totalChars = 0, totalImages = 0, tablesMade = 0;
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
        line.runs.push({ text: it.str, bold: /bold/i.test(fam), ital: /italic|oblique/i.test(fam), size: sizeOf(it), x: it.transform[4], w: it.width || 0 });
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

      /* Table detection: a run of consecutive lines whose runs start at the
         same x positions (columns) becomes a real Word table. Conservative on
         purpose — a group needs >= 3 lines with >= 2 shared columns (>= 2
         lines when there are >= 3 columns), consistent column starts, and no
         heading-sized lines, so justified paragraphs are not misread. */
      const skipLines = new Set();
      const tableAt = new Map();
      {
        const segsOf = L => {
          // whitespace-only runs are pdf.js gap fillers between cells — they
          // span the very gaps that separate columns, so they must not count
          const rs = L.runs.filter(r => r.text && r.text.trim()).slice().sort((a, b) => (a.x || 0) - (b.x || 0));
          const segs = []; let cur = null;
          rs.forEach(r => {
            const rx = r.x || 0;
            if (cur && rx - cur.x1 > 13){ segs.push(cur); cur = null; }
            if (!cur) cur = { x0: rx, x1: rx + (r.w || 0), runs: [r] };
            else { cur.runs.push(r); cur.x1 = Math.max(cur.x1, rx + (r.w || 0)); }
          });
          if (cur) segs.push(cur);
          return segs;
        };
        const segListsAll = bodyLines.map(segsOf);
        let gi = 0;
        while (gi < bodyLines.length){
          if (segListsAll[gi].length < 2){ gi++; continue; } // a table can only start at a tabular line
          const group = [bodyLines[gi]]; const segLists = [segListsAll[gi]]; let gj = gi + 1;
          while (gj < bodyLines.length && segListsAll[gj].length >= 2){
            const Lp = group[group.length - 1], Lc = bodyLines[gj];
            if ((Lp.y - Lc.y) <= Math.max(Lp.size, Lc.size) * 2.6){ group.push(Lc); segLists.push(segListsAll[gj]); gj++; } else break;
          }
          let consumed = false;
          if (group.length >= 2 && !group.some(L => L.size > bodySize * 1.22)){
            {
              const starts = [];
              segLists.forEach(sg => sg.forEach(s2 => starts.push(s2.x0)));
              starts.sort((a, b) => a - b);
              const clusters = [];
              starts.forEach(x => { const c = clusters[clusters.length - 1]; if (c && x - c.max <= 10){ c.max = x; c.sum += x; c.n++; } else clusters.push({ min: x, max: x, sum: x, n: 1 }); });
              const centers = clusters.map(c => c.sum / c.n);
              if ((centers.length >= 2 && group.length >= 3) || (centers.length >= 3 && group.length >= 2)){
                const colOf = x0 => { let bi = 0, bd = 1e9; centers.forEach((c, ci) => { const d = Math.abs(x0 - c); if (d < bd){ bd = d; bi = ci; } }); return bi; };
                if (segLists.every(sg => new Set(sg.map(s2 => colOf(s2.x0))).size >= 2)){
                  const rows = segLists.map(sg => {
                    const cells = centers.map(() => []);
                    sg.forEach(s2 => { s2.runs.forEach(r => cells[colOf(s2.x0)].push(r)); });
                    return cells;
                  });
                  tableAt.set(group[0], rows);
                  group.slice(1).forEach(L => skipLines.add(L));
                  group.forEach(L => { totalChars += L.text.length; });
                  consumed = true;
                }
              }
            }
          }
          gi = consumed ? gj : gi + 1;
        }
      }

      const els = [];
      bodyLines.forEach(L => els.push({ kind: 'line', y: L.y, L }));
      bodyImgs.forEach(im => els.push({ kind: 'img', y: im.yTop, im }));
      els.sort((a, b) => b.y - a.y);

      const alignOf = L => { const c = (L.x0 + L.x1) / 2; return (Math.abs(c - pageW / 2) < 26 && L.x0 > 36) ? docx.AlignmentType.CENTER : undefined; };
      let cur = null, prev = null;
      const flush = () => { if (cur && cur.runs.length){ bodyChildren.push(new docx.Paragraph({ children: cur.runs })); } cur = null; };

      for (const el of els){
        if (el.kind === 'line' && skipLines.has(el.L)){ prev = el; continue; }
        if (el.kind === 'line' && tableAt.has(el.L)){
          flush();
          const bd = { style: docx.BorderStyle.SINGLE, size: 4, color: '999999' };
          const cellRuns = runs => {
            const arr = []; let prevEndsSpace = true;
            runs.forEach(r => {
              let t = r.text;
              if (!prevEndsSpace && t && !/^\s/.test(t)) t = ' ' + t;
              prevEndsSpace = /\s$/.test(t) || t === '';
              arr.push(new docx.TextRun({ text: t, bold: r.bold || undefined, italics: r.ital || undefined }));
            });
            return arr;
          };
          bodyChildren.push(new docx.Table({
            borders: { top: bd, left: bd, bottom: bd, right: bd, insideHorizontal: bd, insideVertical: bd },
            width: { size: 100, type: docx.WidthType.PERCENTAGE },
            rows: tableAt.get(el.L).map(cells => new docx.TableRow({
              children: cells.map(cell => new docx.TableCell({ children: [new docx.Paragraph({ children: cellRuns(cell) })] }))
            }))
          }));
          tablesMade++;
          prev = el; continue;
        }
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
    out.innerHTML = '<p><strong>Done.</strong> Converted about ' + totalChars.toLocaleString() + ' characters' + (totalImages ? ' and ' + totalImages + ' image(s)' : '') + (tablesMade ? ' and ' + tablesMade + ' table(s)' : '') + ' from ' + pdf.numPages + ' page(s) into a Word file (' + ftSize(blob.size) + '). Headings, bold text, alignment, headers/footers and images are carried over where the PDF has them, and tables whose columns line up cleanly are rebuilt as real Word tables; the exact layout and spacing are not preserved.</p>';
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
  if (typeof mammoth === 'undefined' || typeof window.jspdf === 'undefined'){
    out.innerHTML = '<p>The conversion libraries are still loading — check your connection and try again.</p>'; return;
  }
  out.innerHTML = '<p>Working — converting your document…</p>';
  try {
    const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
    const html = result.value || '';
    const holder = $('wp-render');
    if (holder) holder.innerHTML = html || '<p>(The document appears to be empty.)</p>';

    /* Text-based layout: the words are drawn as real PDF text (jsPDF text
       objects), so the result is selectable, copyable and searchable —
       not a photograph of the page. */
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const PAGE_W = 210, PAGE_H = 297, M = 18, MAXW = PAGE_W - 2 * M, BOTTOM = PAGE_H - M;
    const PT = 25.4 / 72;
    let y = 20;
    const lh = size => size * PT * 1.5;
    const ensure = space => { if (y + space > BOTTOM){ pdf.addPage(); y = 20; } };
    function setStyle(size, b, i){
      pdf.setFont('helvetica', b && i ? 'bolditalic' : b ? 'bold' : i ? 'italic' : 'normal');
      pdf.setFontSize(size);
    }
    function wrapRuns(runs, size, maxW){
      const words = [];
      runs.forEach(r => {
        if (r.br){ words.push({ br: true }); return; }
        if (!r.t) return;
        r.t.replace(/\s+/g, ' ').split(/(\s+)/).forEach(part => {
          if (!part) return;
          words.push(/^\s+$/.test(part) ? { space: true } : { t: part, b: r.b, i: r.i });
        });
      });
      const lines = []; let cur = [], curW = 0;
      const pushLine = () => { while (cur.length && cur[cur.length - 1].space) cur.pop(); if (cur.length) lines.push(cur); cur = []; curW = 0; };
      words.forEach(w => {
        if (w.br){ pushLine(); return; }
        if (w.space){ if (cur.length){ setStyle(size, false, false); cur.push(w); curW += pdf.getTextWidth(' '); } return; }
        setStyle(size, w.b, w.i);
        const ww = pdf.getTextWidth(w.t);
        if (cur.length && curW + ww > maxW) pushLine();
        cur.push(w); curW += ww;
      });
      pushLine();
      return lines;
    }
    function drawBlock(runs, size, o){
      o = o || {};
      const indent = o.indent || 0, hang = o.hang || 0;
      y += (o.before || 0);
      const lines = wrapRuns(runs, size, MAXW - indent - hang);
      lines.forEach((line, li) => {
        ensure(lh(size));
        y += size * PT * 1.12;
        let x = M + indent + (li === 0 ? hang : 0);
        if (o.bullet && li === 0){ setStyle(size, false, false); pdf.text(o.bullet, M + indent + 0.5, y); }
        line.forEach(seg => {
          setStyle(size, seg.b, seg.i);
          if (seg.space){ x += pdf.getTextWidth(' '); return; }
          pdf.text(seg.t, x, y);
          x += pdf.getTextWidth(seg.t);
        });
        y += lh(size) - size * PT * 1.12;
      });
      y += (o.after != null ? o.after : 2.5);
    }
    async function drawImage(imgEl){
      const src = imgEl.getAttribute('src') || '';
      if (!/^data:image\//.test(src)) return;
      const dims = await new Promise(res => { const im = new Image(); im.onload = () => res({ w: im.naturalWidth, h: im.naturalHeight }); im.onerror = () => res(null); im.src = src; });
      if (!dims || !dims.w) return;
      let w = Math.min(MAXW, dims.w * 25.4 / 96), h = w * dims.h / dims.w;
      if (h > BOTTOM - 22){ h = BOTTOM - 22; w = h * dims.w / dims.h; }
      ensure(h + 2);
      try { pdf.addImage(src, /png/i.test(src.slice(0, 24)) ? 'PNG' : 'JPEG', M, y, w, h); } catch(e){ return; }
      y += h + 3;
    }
    async function drawRunsBlock(runs, size, o){
      // split at embedded images: text before, image, text after
      let buf = [];
      for (const r of runs){
        if (r.img){ if (buf.length){ drawBlock(buf, size, o); buf = []; } await drawImage(r.img); }
        else buf.push(r);
      }
      if (buf.length) drawBlock(buf, size, o);
    }
    function runsOf(node, b, i){
      const arr = [];
      node.childNodes.forEach(ch => {
        if (ch.nodeType === 3){ if (ch.textContent) arr.push({ t: ch.textContent, b: !!b, i: !!i }); }
        else if (ch.nodeType === 1){
          const tag = ch.tagName;
          if (tag === 'BR') arr.push({ br: true });
          else if (tag === 'IMG') arr.push({ img: ch });
          else runsOf(ch, b || tag === 'STRONG' || tag === 'B', i || tag === 'EM' || tag === 'I').forEach(r => arr.push(r));
        }
      });
      return arr;
    }
    function drawTable(tbl){
      const rows = Array.from(tbl.querySelectorAll('tr')).map(tr =>
        Array.from(tr.querySelectorAll('td,th')).map(td => ({ runs: runsOf(td), header: td.tagName === 'TH' })));
      if (!rows.length) return;
      const ncols = Math.max.apply(null, rows.map(r => r.length).concat([1]));
      const colW = MAXW / ncols, size = 10;
      rows.forEach(cells => {
        const wrapped = [];
        for (let c = 0; c < ncols; c++){
          const cell = cells[c];
          const runs = cell ? cell.runs.filter(r => r.t).map(r => ({ t: r.t, b: r.b || cell.header, i: r.i })) : [];
          wrapped.push(wrapRuns(runs, size, colW - 3));
        }
        const nLines = Math.max.apply(null, wrapped.map(w => w.length).concat([1]));
        const rowH = nLines * lh(size) + 2;
        ensure(rowH);
        const top = y;
        pdf.setDrawColor(150); pdf.setLineWidth(0.2);
        for (let c = 0; c < ncols; c++){
          const x0 = M + c * colW;
          pdf.rect(x0, top, colW, rowH);
          wrapped[c].forEach((line, li) => {
            let x = x0 + 1.5;
            const base = top + 1 + size * PT * 1.12 + li * lh(size);
            line.forEach(seg => {
              setStyle(size, seg.b, seg.i);
              if (seg.space){ x += pdf.getTextWidth(' '); return; }
              pdf.text(seg.t, x, base);
              x += pdf.getTextWidth(seg.t);
            });
          });
        }
        y = top + rowH;
      });
      y += 3;
    }
    async function renderBlocks(container){
      for (const node of Array.from(container.childNodes)){
        if (node.nodeType === 3){ const t = node.textContent.trim(); if (t) drawBlock([{ t }], 11.5, {}); continue; }
        if (node.nodeType !== 1) continue;
        const tag = node.tagName;
        if (/^H[1-6]$/.test(tag)){
          const lvl = +tag[1], size = [20, 16, 14, 12.5, 11.5, 11][lvl - 1];
          await drawRunsBlock(runsOf(node).map(r => r.img || r.br ? r : { t: r.t, b: true, i: r.i }), size, { before: lvl <= 2 ? 5 : 4, after: 2.5 });
        }
        else if (tag === 'P'){
          const runs = runsOf(node);
          if (!runs.some(r => r.img || r.br || (r.t && r.t.trim()))) { y += 2; continue; }
          await drawRunsBlock(runs, 11.5, {});
        }
        else if (tag === 'UL' || tag === 'OL'){
          let n = 0;
          node.querySelectorAll(':scope > li').forEach(li => { n++; drawBlock(runsOf(li).filter(r => !r.img), 11.5, { bullet: tag === 'OL' ? n + '.' : '•', indent: 1, hang: 5.5, after: 1 }); });
          y += 2;
        }
        else if (tag === 'TABLE') drawTable(node);
        else if (tag === 'BLOCKQUOTE') drawBlock(runsOf(node).map(r => r.img || r.br ? r : { t: r.t, b: r.b, i: true }), 11.5, { indent: 8 });
        else if (tag === 'IMG') await drawImage(node);
        else if (tag === 'HR'){ ensure(4); pdf.setDrawColor(150); pdf.line(M, y + 1, PAGE_W - M, y + 1); y += 4; }
        else if (tag === 'DIV' || tag === 'SECTION') await renderBlocks(node);
        else { const runs = runsOf(node); if (runs.length) await drawRunsBlock(runs, 11.5, {}); }
      }
    }
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    await renderBlocks(parsed.body);
    const blob = pdf.output('blob');
    const name = ftBase(file.name) + '.pdf';
    const plain = (parsed.body.textContent || '').replace(/\s/g, '');
    const nonLatin = (plain.match(/[^\u0000-\u024F]/g) || []).length;
    let note = 'The text in this PDF is <strong>real text — selectable, copyable and searchable</strong>, laid out on A4 pages. Exact fonts, spacing and page breaks from Word are approximated, not copied pixel-for-pixel.';
    if (plain.length > 50 && nonLatin / plain.length > 0.05) note += '<br><strong>Note:</strong> this document uses a non-Latin script (such as Urdu, Arabic or Chinese). The built-in PDF font cannot draw those characters, so they may come out blank or wrong — for such documents, export the PDF from Word or Google Docs instead.';
    out.innerHTML = '<p><strong>Done.</strong> Your PDF is ready (' + name + ', ' + ftSize(blob.size) + ', ' + pdf.getNumberOfPages() + ' page(s)). ' + note + '</p>';
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
  $('ip-out').innerHTML = '';
  ftI2pRender();
}
function ftI2pRender(){
  const list = $('ip-list'), info = $('ip-info');
  if (!list) return;
  if (!ftI2pFiles.length){ list.innerHTML = ''; info.textContent = ''; return; }
  list.innerHTML = ftI2pFiles.map((f, i) =>
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #e5e5e5">' +
    '<span>' + (i + 1) + '. ' + esc(f.name) + ' (' + ftSize(f.size) + ')</span>' +
    '<span style="white-space:nowrap">' +
    '<button type="button" class="btn secondary" onclick="ftI2pMove(' + i + ',-1)"' + (i === 0 ? ' disabled' : '') + '>↑ Up</button> ' +
    '<button type="button" class="btn secondary" onclick="ftI2pMove(' + i + ',1)"' + (i === ftI2pFiles.length - 1 ? ' disabled' : '') + '>↓ Down</button> ' +
    '<button type="button" class="btn secondary" onclick="ftI2pRemove(' + i + ')">Remove</button>' +
    '</span></div>').join('');
  info.textContent = ftI2pFiles.length + ' image(s) selected — the PDF follows this order, top first.';
}
function ftI2pMove(i, d){
  const j = i + d;
  if (j < 0 || j >= ftI2pFiles.length) return;
  const t = ftI2pFiles[i]; ftI2pFiles[i] = ftI2pFiles[j]; ftI2pFiles[j] = t;
  $('ip-out').innerHTML = '';
  ftI2pRender();
}
function ftI2pRemove(i){
  ftI2pFiles.splice(i, 1);
  $('ip-out').innerHTML = '';
  ftI2pRender();
}
async function ftImagesToPdf(){
  const out = $('ip-out');
  if (!ftI2pFiles.length){ out.innerHTML = '<p>Please add at least one image.</p>'; return; }
  if (typeof window.jspdf === 'undefined'){ out.innerHTML = '<p>The PDF library is still loading — check your connection and try again.</p>'; return; }
  out.innerHTML = '<p>Working…</p>';
  try {
    const { jsPDF } = window.jspdf;
    const sizeSel = ($('ip-size') && $('ip-size').value) || 'a4'; // a4 | letter | fit
    const margin = parseFloat(($('ip-margin') && $('ip-margin').value) || '10') || 0;
    const pageDims = { a4: [210, 297], letter: [215.9, 279.4] }[sizeSel] || null;
    let doc = null;
    for (const f of ftI2pFiles){
      const { img, url } = await ftLoadImage(f);
      const imgW = img.naturalWidth * 25.4 / 96, imgH = img.naturalHeight * 25.4 / 96; // mm at 96 dpi
      const type = f.type === 'image/png' ? 'PNG' : 'JPEG';
      if (!pageDims){
        // Fit mode: each page is exactly its image's size (previous behaviour)
        const orient = imgW > imgH ? 'landscape' : 'portrait';
        if (!doc) doc = new jsPDF({ unit: 'mm', format: [imgW, imgH], orientation: orient });
        else doc.addPage([imgW, imgH], orient);
        doc.addImage(img, type, 0, 0, imgW, imgH);
      } else {
        // Fixed page size: pick orientation from the image, fit inside the margins, centre.
        const landscape = imgW > imgH;
        const pw = landscape ? pageDims[1] : pageDims[0], ph = landscape ? pageDims[0] : pageDims[1];
        if (!doc) doc = new jsPDF({ unit: 'mm', format: pageDims, orientation: landscape ? 'landscape' : 'portrait' });
        else doc.addPage(pageDims, landscape ? 'landscape' : 'portrait');
        const availW = Math.max(10, pw - 2 * margin), availH = Math.max(10, ph - 2 * margin);
        const sc = Math.min(availW / imgW, availH / imgH);
        const dw = imgW * sc, dh = imgH * sc;
        doc.addImage(img, type, (pw - dw) / 2, (ph - dh) / 2, dw, dh);
      }
      URL.revokeObjectURL(url);
    }
    const blob = doc.output('blob');
    const sizeName = sizeSel === 'fit' ? 'image-sized pages' : (sizeSel === 'letter' ? 'Letter' : 'A4');
    out.innerHTML = '<p><strong>Done.</strong> ' + ftI2pFiles.length + ' image(s) → one PDF (' + ftSize(blob.size) + ', ' + sizeName + (pageDims ? ', ' + margin + ' mm margins' : '') + ').</p>';
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
