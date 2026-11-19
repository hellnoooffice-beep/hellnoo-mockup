/* Hellnoo clickable mockup — dummy data only. Nothing here is real. */
(function () {
  // seeded random so numbers stay the same on every reload
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  const channels = [
    { id: 'kd', name: 'Kashmir Diaries', handle: 'kashmirdiaries', logo: 'KD', color: '#f0973a', cat: 'Travel & food', subs: 48200, joined: 2024, banner: 'sc-sunset', desc: 'Slow travel, street food and village life from every corner of Kashmir. New video every Tuesday and Friday.' },
    { id: 'rb', name: 'Recap Bhai', handle: 'recapbhai', logo: 'RB', color: '#2EC4B6', cat: 'Movie recaps', subs: 312000, joined: 2023, banner: 'sc-red', desc: 'Full movie stories in 15 minutes, in simple Hindi. Ending explained, every week.' },
    { id: 'zk', name: 'Zaika-e-Kashmir', handle: 'zaikaekashmir', logo: 'ZK', color: '#ff7a7a', cat: 'Cooking', subs: 91000, joined: 2024, banner: 'sc-food', desc: 'Wazwan and home cooking from Kashmiri kitchens.' },
    { id: 'pp', name: 'Padhai Point', handle: 'padhaipoint', logo: 'PP', color: '#8fb3ff', cat: 'Education', subs: 27400, joined: 2025, banner: 'sc-blue', desc: 'Class 9 and 10 maths and science in one-shot videos.' },
    { id: 'vf', name: 'Valley Frames', handle: 'valleyframes', logo: 'VF', color: '#c59bff', cat: 'Travel', subs: 15800, joined: 2025, banner: 'sc-valley', desc: 'Drone shots and treks across the valley.' },
    { id: 'ws', name: 'Wular Sounds', handle: 'wularsounds', logo: 'WS', color: '#ffd166', cat: 'Music', subs: 8900, joined: 2025, banner: 'sc-gold', desc: 'Sufi kalam and folk music, recorded live.' },
    { id: 'ts', name: 'Tech Saathi', handle: 'techsaathi', logo: 'TS', color: '#7ee08a', cat: 'Tech', subs: 141000, joined: 2023, banner: 'sc-tech', desc: 'Phones, laptops and apps explained in Hindi.' },
    { id: 'gs', name: 'Gully Sports', handle: 'gullysports', logo: 'GS', color: '#5fd3f3', cat: 'Sports', subs: 64000, joined: 2024, banner: 'sc-cricket', desc: 'Local cricket, highlights and match talk.' },
    { id: 'av', name: 'Aamir Vlogs', handle: 'aamirvlogs', logo: 'AV', color: '#8fb3ff', cat: 'Vlogs', subs: 1240, joined: 2026, banner: 'sc-snow', desc: 'Travel, food and everyday life from Kashmir. New vlog every Friday.', mine: true }
  ];

  const V = (id, ch, title, big, sc, len, views, days, extra) =>
    Object.assign({ id, ch, title, big, sc, len, views, days, likes: Math.round(views * (0.03 + rnd() * 0.04)), comments: Math.round(views * (0.002 + rnd() * 0.004)), vis: 'Public' }, extra || {});

  const videos = [
    V('v1', 'kd', 'Gulmarg mein pehli barf ❄ Winter vlog 2026', 'Pehli <em>barf</em>!', 'sc-snow', '18:05', 31204, 0.2),
    V('v2', 'rb', 'Ek Raat Ki Kahani – full movie recap in Hindi', 'Ending <em>explained</em>', 'sc-red', '14:32', 248000, 2),
    V('v3', 'zk', 'Kashmiri Wazwan ghar par: Rogan Josh recipe', 'Rogan <em>Josh</em>', 'sc-food', '12:47', 87000, 7),
    V('v4', 'pp', 'Class 10 Maths: quadratic equations in 20 minutes', 'x² + 5x <em>+ 6 = 0</em>', 'sc-maths', '21:10', 12000, 3),
    V('v5', 'vf', 'Dal Lake sunrise – 4K drone shots', 'Dal Lake <em>4K</em>', 'sc-lake', '6:22', 5400, 92),
    V('v6', 'ts', 'Top 10 budget phones under ₹15,000 (Nov 2026)', 'Under <em>₹15K</em>', 'sc-tech', '16:48', 156000, 4),
    V('v7', 'ws', 'Sufi kalam live – Bandipora mehfil', 'Live <em>mehfil</em>', 'sc-gold', '32:15', 9800, 31),
    V('v8', 'gs', 'J&K vs Punjab – last over thriller | Highlights', '6 balls, <em>12 runs</em>', 'sc-cricket', '11:03', 64000, 18),
    V('v9', 'rb', 'Andhera Ghar – horror movie recap', 'Andhera <em>ghar</em>', 'sc-night', '15:20', 1200000, 12),
    V('v10', 'kd', 'Srinagar street food tour – part 2', 'Street <em>food</em>', 'sc-food2', '17:05', 42000, 61),
    V('v11', 'pp', 'Physics: motion in one go (Class 9)', 'Motion <em>one shot</em>', 'sc-blue', '39:40', 230000, 5),
    V('v12', 'vf', 'Pahalgam trek – Day 1 (Aru valley)', 'Aru <em>valley</em>', 'sc-valley', '15:58', 8100, 34),
    V('v13', 'rb', 'Teen Bhai – comedy movie recap', 'Teen <em>bhai</em>', 'sc-red', '13:11', 410000, 9),
    V('v14', 'ts', 'Is this ₹9,999 laptop worth it?', '₹9,999 <em>laptop</em>', 'sc-tech', '10:42', 77000, 15),
    V('v15', 'zk', 'Nadru monje – lotus stem fritters', 'Nadru <em>monje</em>', 'sc-food', '8:15', 21000, 40),
    V('v16', 'gs', 'Bandipora Premier League final', 'BPL <em>final</em>', 'sc-cricket', '22:47', 15000, 2.5),
    V('v17', 'kd', 'Sonamarg in winter – is it open?', 'Sonamarg <em>winter</em>', 'sc-snow', '14:02', 18300, 1),
    V('v18', 'ws', 'Rouf dance at a Kashmiri wedding', 'Rouf <em>dance</em>', 'sc-gold', '7:30', 4100, 70),
    V('v19', 'pp', 'Trigonometry tricks you will never forget', 'Trig <em>tricks</em>', 'sc-maths', '18:20', 9300, 11),
    V('v20', 'vf', 'Gurez valley – the hidden Kashmir', 'Gurez <em>valley</em>', 'sc-valley', '19:44', 26000, 150),
    // my channel (Aamir Vlogs)
    V('a1', 'av', 'Gulmarg first snowfall 2026 – full day vlog', 'First <em>snow</em>!', 'sc-snow', '18:05', 4200, 3),
    V('a2', 'av', 'Dal Lake shikara ride at sunrise', 'Shikara <em>sunrise</em>', 'sc-lake', '9:41', 2800, 10),
    V('a3', 'av', 'Aru valley trek – Day 1', 'Aru <em>trek</em>', 'sc-valley', '15:58', 1900, 17),
    V('a4', 'av', 'Srinagar street food – ₹500 challenge', '₹500 <em>food</em>', 'sc-food2', '17:05', 6100, 24),
    V('a5', 'av', 'Wazwan at a Kashmiri wedding', 'Shaadi <em>wazwan</em>', 'sc-food', '12:47', 3300, 31),
    V('a6', 'av', 'Sufi night in Bandipora', 'Sufi <em>night</em>', 'sc-gold', '21:30', 980, 38),
    V('a7', 'av', 'Night drive to Sonamarg', 'Night <em>drive</em>', 'sc-night', '11:12', 1400, 45, { vis: 'Unlisted' }),
    V('a8', 'av', 'Gully cricket with village kids', 'Gully <em>cricket</em>', 'sc-cricket', '8:55', 2200, 52),
    V('a17', 'av', 'Kahwa stall at Lal Chowk – 5 am', 'Lal Chowk <em>5 am</em>', 'sc-gold', '7:12', 0, 1.4),
    V('a11', 'av', 'Yusmarg day trip – meadows and pine forest', 'Yusmarg <em>day trip</em>', 'sc-valley', '14:20', 0, 66),
    V('a12', 'av', 'Kashmiri kahwa at home with my mother', 'Ghar ka <em>kahwa</em>', 'sc-gold', '7:48', 0, 80),
    V('a13', 'av', 'Wular lake boat ride', 'Wular <em>lake</em>', 'sc-lake', '10:05', 0, 101),
    V('a14', 'av', 'Doodhpathri in the rain', 'Doodh<em>pathri</em>', 'sc-valley', '12:31', 0, 130),
    V('a15', 'av', 'Old city Srinagar walk', 'Old <em>city</em>', 'sc-food2', '16:12', 0, 160),
    V('a16', 'av', 'Why I started vlogging', 'Why I <em>started</em>', 'sc-snow', '6:40', 0, 247),
    V('a9', 'av', 'My vlog kit under ₹15,000 (draft)', 'Vlog <em>kit</em>', 'sc-tech', '9:02', 0, 0, { vis: 'Draft' }),
    V('a10', 'av', 'Pahalgam with family (scheduled)', 'Pahalgam <em>trip</em>', 'sc-valley', '13:30', 0, 0, { vis: 'Scheduled', sched: 'Fri, 20 Nov 2026 · 6:00 pm' })
  ];
  videos.forEach(v => {
    v.desc = 'A short description of this video. In the real site the creator writes this when uploading. Tags and links appear here too.';
    v.tags = ['#kashmir', '#hellnoo'];
  });

  /* ---- my channel (Aamir Vlogs): ONE source of truth ----
     90 days of daily views, newest last (index 89 = 16 Nov 2026).
     Each day's views are split across the videos that were live that day, so
     video views, channel analytics, counted views and earnings all add up. */
  const days = 90, series = { views: [], watch: [], impr: [], subs: [] };
  const TODAY = new Date(2026, 10, 16);
  const dayDate = i => new Date(TODAY - (days - 1 - i) * 864e5);
  const monthKey = i => { const d = dayDate(i); return d.getFullYear() + '-' + (d.getMonth() + 1); };
  const pop = { a17: 1.6, a1: 2.6, a2: 1.0, a3: 0.8, a4: 1.7, a5: 1.1, a6: 0.5, a7: 0.25, a8: 0.9, a11: 1.0, a12: 0.7, a13: 0.6, a14: 0.8, a15: 0.6, a16: 0.4 };
  const early = { a13: 1900, a14: 3400, a15: 2600, a16: 1800 }; // views before the 90-day window
  const mine = videos.filter(v => v.ch === 'av' && (v.vis === 'Public' || v.vis === 'Unlisted'));
  mine.forEach(v => { v.pub = days - 1 - Math.round(v.days); v.daily = new Array(days).fill(0); v.m = {}; });
  for (let i = 0; i < days; i++) {
    const base = 430 + i * 6.2, wave = 1 + Math.sin(i / 4) * 0.08;
    const boost = mine.filter(v => v.pub >= 0 && i >= v.pub && i - v.pub < 4).reduce((s, v) => s + pop[v.id] * 160 / (1 + i - v.pub), 0);
    const total = Math.round(base * wave + boost + rnd() * 60);
    const live = mine.filter(v => v.pub <= i);
    const w = live.map(v => pop[v.id] * (Math.exp(-(i - v.pub) / 16) + 0.1));
    const W = w.reduce((a, b) => a + b, 0);
    let got = 0; live.forEach((v, k) => { const n = Math.round(total * w[k] / W); v.daily[i] = n; got += n; });
    series.views.push(got);
    series.subs.push(Math.max(1, Math.round(got / 110 + rnd() * 2)));
  }
  /* per video, per day: impressions, click-through rate, watch time, likes, comments.
     Channel impressions and watch time are the sum of these, so every page adds up. */
  const spread = (total, weights) => { // whole numbers that add up exactly to total
    const W = weights.reduce((a, b) => a + b, 0) || 1, raw = weights.map(w => total * w / W), out = raw.map(Math.floor);
    let left = total - out.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - out[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { out[i]++; left--; } });
    return out;
  };
  series.impr = new Array(days).fill(0); series.watch = new Array(days).fill(0);
  mine.forEach((v, k) => {
    const [mm, ss] = v.len.split(':').map(Number), lenS = mm * 60 + ss;
    v.ctrBase = 0.062 + (k % 5) * 0.009; v.avdBase = lenS * (0.36 + (k % 6) * 0.035);
    v.dImpr = []; v.dWatch = [];
    for (let i = 0; i < days; i++) {
      const n = v.daily[i], age = i - v.pub;
      const c = v.ctrBase * (1 + 0.35 * Math.exp(-Math.max(0, age) / 5) + 0.07 * Math.sin(i * 1.3 + k));
      const im = n ? Math.round(n / c) : 0;
      const wh = n * v.avdBase * (1 + 0.09 * Math.sin(i * 0.9 + k)) / 3600;
      v.dImpr.push(im); v.dWatch.push(wh); series.impr[i] += im; series.watch[i] += wh;
    }
    const e = early[v.id] || 0;
    v.views = v.daily.reduce((a, b) => a + b, 0) + e;
    v.impr = v.dImpr.reduce((a, b) => a + b, 0) + Math.round(e / v.ctrBase);
    v.watchH = v.dWatch.reduce((a, b) => a + b, 0) + e * v.avdBase / 3600;
    v.avdS = v.views ? v.watchH * 3600 / v.views : 0;
    v.likes = Math.round(v.views * (0.04 + (v.views % 13) / 400)); v.comments = Math.round(v.views * (0.003 + (v.views % 7) / 2000));
    // likes and comments by day follow the views; the 90-day part is the share of views inside the window
    const inWin = v.views ? (v.views - e) / v.views : 0;
    v.dLikes = spread(Math.round(v.likes * inWin), v.daily); v.dComments = spread(Math.round(v.comments * inWin), v.daily);
    // views by hour over the last 24 hours (today's views, shaped like a normal day in India)
    const shape = [2, 1, 1, 1, 1, 2, 3, 5, 6, 6, 6, 6, 7, 7, 6, 6, 7, 8, 9, 10, 11, 10, 7, 4];
    v.hourly = spread(v.daily[days - 1], shape);
    for (let i = 0; i < days; i++) { const k = monthKey(i); v.m[k] = v.m[k] || { views: 0, counted: 0 }; v.m[k].views += v.daily[i]; }
    // counted views leave out repeats within 24 h, very short views and suspicious traffic (about 71% here)
    Object.values(v.m).forEach(o => { o.counted = Math.round(o.views * 0.71); });
    /* 1,000-view rule: a video earns only once it passes 1,000 lifetime views.
       Views are counted from the very first one; when the video passes 1,000, the counted
       views from earlier months are "unlocked" and paid in the month it passed. */
    let cum = e; v.crossDay = e >= 1000 ? -1 : null;
    for (let i = 0; i < days && v.crossDay === null; i++) { cum += v.daily[i]; if (cum >= 1000) v.crossDay = i; }
    v.crossMonth = v.crossDay === null ? null : v.crossDay < 0 ? 'before' : monthKey(v.crossDay);
    let backlog = 0, crossed = v.crossMonth === 'before';
    Object.keys(v.m).forEach(k => { // months are stored in date order
      const o = v.m[k]; if (k === v.crossMonth) crossed = true;
      if (!crossed) { o.paid = 0; o.unlocked = 0; backlog += o.counted; return; }
      o.unlocked = backlog; o.paid = o.counted + backlog; backlog = 0;
    });
    v.waiting = backlog; // counted views of a video still under 1,000 (not paid unless it passes)
  });
  /* audience by country: each viewer's country comes from their IP at the edge (Cloudflare adds it to every request).
     Only the country is stored, never the IP. Every video has its own mix, so channel totals are the sum of the videos. */
  const COUNTRIES = [['IN', 'India', 0.56], ['US', 'United States', 0.1], ['PK', 'Pakistan', 0.06], ['AE', 'United Arab Emirates', 0.05], ['GB', 'United Kingdom', 0.045], ['SA', 'Saudi Arabia', 0.035], ['CA', 'Canada', 0.03], ['BD', 'Bangladesh', 0.02], ['XX', 'Other countries', 0.1]];
  mine.forEach((v, k) => {
    v.cw = COUNTRIES.map(([, , w], j) => w * (1 + 0.35 * Math.sin(k * 1.7 + j * 2.1)));
    v.watchFrac = COUNTRIES.map((c, j) => 0.85 + 0.3 * ((k + j) % 4) / 3); // watch time per view differs a little by country
  });
  const byCountry = (list, viewsOf) => { // exact whole numbers that add up to the views
    const out = COUNTRIES.map(([code, name]) => ({ code, name, views: 0, watchH: 0 }));
    list.forEach(v => { const n = viewsOf(v); if (!n) return; spread(n, v.cw).forEach((x, j) => { out[j].views += x; out[j].watchH += x * v.avdBase * v.watchFrac[j] / 3600; }); });
    return out;
  };
  const myMonth = k => { const r = { views: 0, counted: 0, paid: 0, unlocked: 0 }; mine.forEach(v => { if (v.m[k]) { r.views += v.m[k].views; r.counted += v.m[k].counted; r.paid += v.m[k].paid; r.unlocked += v.m[k].unlocked; } }); return r; };
  const myM = { aug: myMonth('2026-8'), sep: myMonth('2026-9'), oct: myMonth('2026-10'), nov: myMonth('2026-11') };

  // platform-wide (admin)
  const plat = { dau: [], newUsers: [], uploads: [], watchHours: [] };
  for (let i = 0; i < 120; i++) {
    const base = 2200 + i * 38 + Math.sin(i / 3.5) * 260 + rnd() * 300;
    plat.dau.push(Math.round(base));
    plat.newUsers.push(Math.round(base * (0.05 + rnd() * 0.03)));
    plat.uploads.push(Math.round(20 + i * 0.4 + rnd() * 18));
    plat.watchHours.push(Math.round(base * (0.31 + rnd() * 0.06)));
  }

  const people = ['Aamir Wani', 'Sana Mir', 'Rahul Verma', 'Imran Lone', 'Mehvish Bhat', 'Faisal Dar', 'Priya Sharma', 'Owais Shah', 'Nida Qadri', 'Arjun Singh', 'Zoya Malik', 'Bilal Ahmad', 'Kavya Nair', 'Tariq Rather', 'Huma Jan', 'Rohit Gupta'];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const users = people.map((n, i) => {
    const channel = i === 0 ? 'av' : (['kd', 'rb', 'zk', 'pp', 'vf', 'ws', 'ts', 'gs'][i - 1] || null);
    const cj = channel && channels.find(c => c.id === channel).joined; // an owner's account is never newer than their channel
    return {
      id: 'u' + (i + 1), name: n, handle: n.toLowerCase().replace(' ', '.'),
      method: ['Google', 'Email', 'Google', 'Google'][i % 4],
      joined: i === 0 ? '2 Jan 2026' : cj ? (i * 5 % 27 + 1) + ' ' + MON[i % 12] + ' ' + cj : (i * 7 % 28 + 1) + ' ' + ['Aug', 'Sep', 'Oct', 'Nov'][i % 4] + ' 2026',
      lastSeen: ['2 min ago', '1 h ago', 'Today', 'Yesterday', '3 days ago'][i % 5],
      status: i === 9 ? 'Suspended' : 'Active',
      channel,
      watchH: Math.round(5 + rnd() * 140)
    };
  });

  /* creator fund, in US dollars: rate per 1,000 paid views = min(R, B×1000÷Q).
     Paid views = counted views of videos that have passed 1,000 lifetime views (so views of small videos never dilute the fund). */
  const fund = { month: 'October 2026', B: 800, R: 0.6, Q: 1600000, threshold: 20, minViews: 1000, minVideos: 10, minDays: 30 };
  fund.rate = Math.min(fund.R, fund.B * 1000 / fund.Q);
  const RATES = { aug: 0.56, sep: 0.53, oct: fund.rate }; // Aug and Sep were set the same way in their own month
  const r2 = n => Math.round(n * 100) / 100;

  // October pay list. `paid` = paid views in October. Aamir Vlogs comes from the daily data above.
  // Payouts go to the creator's PayPal or Payoneer account (email only; Hellnoo never asks for a password).
  const payoutRows = [
    { ch: 'rb', paid: 520000, flags: 0, status: 'Ready', method: 'Payoneer' },
    { ch: 'ts', paid: 288000, flags: 1, status: 'Ready', method: 'PayPal' },
    { ch: 'zk', paid: 196000, flags: 0, status: 'Ready', method: 'PayPal' },
    { ch: 'pp', paid: 171000, flags: 0, status: 'Exported', method: 'Payoneer' },
    { ch: 'gs', paid: 133000, flags: 2, status: 'Held – 5× spike', method: 'PayPal' },
    { ch: 'kd', paid: 96000, flags: 0, status: 'Paid', utr: '7RX41209876543210', method: 'PayPal' },
    { ch: 'vf', paid: 52000, flags: 0, status: 'Paid', utr: 'PO-88120934', method: 'Payoneer' },
    { ch: 'av', paid: myM.oct.paid, flags: 0, status: '', method: 'PayPal' }
  ];

  /* Ledger per channel: earned each month, carried in, balance and status.
     Rules: below $20 the balance carries to the next month; month locked by the 7th, paid automatically 15th–20th. */
  function ledger(id) {
    const row = payoutRows.find(p => p.ch === id);
    if (!row) return [];
    const mineCh = id === 'av';
    const counted = mineCh ? { aug: null, sep: myM.sep.paid, oct: myM.oct.paid, nov: myM.nov.paid }
      : { aug: Math.round(row.paid * 0.7 / 100) * 100, sep: Math.round(row.paid * 0.86 / 100) * 100, oct: row.paid, nov: Math.round(row.paid * 0.55 / 100) * 100 };
    const out = []; let carry = 0;
    [['aug', 'August 2026', 'Oct'], ['sep', 'September 2026', 'Oct'], ['oct', 'October 2026', 'Nov']].forEach(([k, label]) => {
      if (counted[k] == null) { out.push({ k, month: label, counted: null, rate: null, amount: 0, carryIn: 0, balance: 0, status: 'Not eligible yet', note: 'Not in the earnings programme yet.' }); return; }
      const amount = r2(counted[k] * RATES[k] / 1000), carryIn = r2(carry), balance = r2(carry + amount);
      let status, note;
      if (balance < fund.threshold) { status = 'Carried forward'; note = 'Below $20, added to next month. Nothing is lost.'; carry = balance; }
      else {
        status = k === 'oct' ? row.status : 'Paid'; carry = 0;
        note = k !== 'oct' ? 'Paid by ' + row.method + ' 15–20 ' + (k === 'aug' ? 'Sep' : 'Oct') : row.status === 'Paid' ? 'Paid by ' + row.method + ' · ID ' + row.utr : row.status.startsWith('Held') ? 'On hold while unusual traffic is checked' : 'In the pay run for 15–20 Nov (' + row.method + ')';
      }
      out.push({ k, month: label, counted: counted[k], rate: RATES[k], amount, carryIn, balance, status, note });
    });
    const nov = { k: 'nov', month: 'November 2026', counted: counted.nov, rate: null, est: r2(counted.nov * fund.rate / 1000), amount: null, carryIn: r2(carry), balance: null, status: 'Counting', note: 'Month not finished. Estimate at about $' + fund.rate.toFixed(2) + ' per 1,000.' };
    return [nov].concat(out.reverse());
  }
  payoutRows.forEach(p => {
    const oct = ledger(p.ch).find(m => m.k === 'oct');
    p.amount = oct.amount; p.carryIn = oct.carryIn; p.balance = oct.balance;
    if (oct.status === 'Carried forward') p.status = 'Carried (below $20)';
  });
  // the rest of the 1,600,000 paid views belong to small channels whose balance is under $20
  const others = { channels: 41, views: fund.Q - payoutRows.reduce((s, p) => s + p.paid, 0) };
  others.amount = r2(others.views * fund.rate / 1000);
  const payRun = () => {
    const inRun = payoutRows.filter(p => !p.status.startsWith('Carried') && !p.status.startsWith('Held'));
    const paid = inRun.filter(p => p.status === 'Paid');
    return { rows: inRun, total: r2(inRun.reduce((s, p) => s + p.balance, 0)), paid: r2(paid.reduce((s, p) => s + p.balance, 0)), paidN: paid.length };
  };

  const myEarnings = ledger('av');

  const reports = [
    { id: 'r1', type: 'Video', target: 'v13', reason: 'Copyright – full movie clips', by: 'Priya Sharma', when: '12 min ago', status: 'Open', count: 7 },
    { id: 'r2', type: 'Comment', target: '“Fake channel, don’t trust”', reason: 'Harassment', by: 'Owais Shah', when: '1 h ago', status: 'Open', count: 2 },
    { id: 'r3', type: 'Channel', target: 'gs', reason: 'Impersonation', by: 'Zoya Malik', when: '3 h ago', status: 'Open', count: 1 },
    { id: 'r4', type: 'Video', target: 'v14', reason: 'Misleading title', by: 'Huma Jan', when: 'Yesterday', status: 'Open', count: 3 },
    { id: 'r5', type: 'Video', target: 'v9', reason: 'Violent content', by: 'Kavya Nair', when: '2 days ago', status: 'Dismissed', count: 1 },
    { id: 'r6', type: 'Comment', target: '“Spam link bit.ly/…”', reason: 'Spam', by: 'Faisal Dar', when: '2 days ago', status: 'Removed', count: 5 }
  ];

  const fmt = n => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const run0 = payRun();
  const audit = [
    ['16 Nov 2026, 11:42', 'Admin (Basit)', 'Dismissed report r5 on video “Andhera Ghar”'],
    ['16 Nov 2026, 10:05', 'Admin (Basit)', 'Marked Kashmir Diaries Oct payout as paid · PayPal ID 7RX41209876543210'],
    ['16 Nov 2026, 09:50', 'Admin (Basit)', 'Marked Valley Frames Oct payout as paid · Payoneer ID PO-88120934'],
    ['15 Nov 2026, 19:30', 'Admin (Basit)', `Built pay list for October 2026 (${run0.rows.length} channels, ${fmt(run0.total)}; Gully Sports held)`],
    ['15 Nov 2026, 18:02', 'Admin (Basit)', 'Approved monetization for Tech Saathi'],
    ['14 Nov 2026, 09:15', 'Moderator (Owais)', 'Removed comment “Spam link bit.ly/…”'],
    ['12 Nov 2026, 16:40', 'Admin (Basit)', 'Suspended user Arjun Singh (spam uploads)'],
    ['7 Nov 2026, 21:00', 'Admin (Basit)', 'Locked October 2026 earnings']
  ];

  const notifications = [
    { ch: 'kd', text: 'Kashmir Diaries uploaded: Gulmarg mein pehli barf ❄ Winter vlog 2026', when: '5 h', v: 'v1', unread: true },
    { ch: 'rb', text: 'Recap Bhai uploaded: Ek Raat Ki Kahani – full movie recap in Hindi', when: '2 d', v: 'v2', unread: true },
    { ch: 'av', text: '@sana.travels replied to your comment: “Phase 2 is open from December”', when: '3 d', v: 'v1', unread: true },
    { ch: 'zk', text: 'Zaika-e-Kashmir uploaded: Kashmiri Wazwan ghar par', when: '1 w', v: 'v3' },
    { ch: 'av', text: `Your video “Srinagar street food – ₹500 challenge” passed ${(Math.floor(videos.find(v => v.id === 'a4').views / 1000) * 1000).toLocaleString('en-IN')} views`, when: '1 w', v: 'a4', mine: true }
  ];
  notifications[2].mine = true; // reply to the creator's own comment

  const commentPool = [
    ['Sana Mir', 'sana.travels', 'The gondola shot at 9:40 is unreal. Is Phase 2 open this early in the season?', 86, 3],
    ['Rahul Verma', 'rahul_from_pune', 'Planning a trip in December because of this video. What did the hotel cost per night?', 41, 0],
    ['Imran Lone', 'imran.bandipora', 'Kahwa in the snow hits different ☕❄', 27, 0],
    ['Mehvish Bhat', 'mehvish.b', 'Your editing has improved so much since the first videos. Keep going!', 19, 1],
    ['Faisal Dar', 'faisal_dar', 'Which camera do you use?', 6, 2]
  ];

  // total accounts: everyone who signed up before this 120-day window plus the daily sign-ups in it
  const accounts = 26400 + plat.newUsers.reduce((a, b) => a + b, 0);

  // channels that pressed "Submit for monetization" (10 public videos and 30 days old), waiting for the admin
  const applications = [
    { id: 'ap1', ch: 'ws', sent: '14 Nov 2026', videos: 14, age: 310, views: 9800, flags: 0, status: 'Waiting' },
    { id: 'ap2', name: 'Chinar Comedy', handle: 'chinarcomedy', logo: 'CC', color: '#ff9f6b', sent: '12 Nov 2026', videos: 11, age: 41, views: 2300, flags: 1, note: '2 videos look re-uploaded from another site', status: 'Waiting' }
  ];

  window.HN = { channels, videos, series, plat, users, accounts, fund, RATES, payoutRows, ledger, others, payRun, myM, myEarnings, reports, audit, notifications, commentPool, rnd, dayDate, monthKey, COUNTRIES, byCountry, applications };
})();
