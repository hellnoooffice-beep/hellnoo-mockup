/* Hellnoo mockup — core: state, helpers, shell, router, popups */
const H = window.HN;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- state (kept in this browser only) ---------- */
const DEF = { role: 'creator', monet: 'approved', res: 'IN', payout: { paypal: 'aamir.wani@gmail.com', payoneer: '', upi: '', pref: 'PayPal' }, quality: 'Auto', speed: 'Normal', subs: ['kd', 'rb', 'zk', 'pp', 'ts'], later: ['v3', 'v7', 'v12'], liked: ['v1', 'v2', 'v9', 'v13'], disliked: [], history: ['v1', 'v2', 'v6', 'v3', 'v10', 'v8'], pauseHistory: false, autoplay: true, hidden: [], playlists: [{ id: 'p1', name: 'Kashmir trip ideas', vis: 'Private', items: ['v1', 'v5', 'v12', 'v17', 'v20'] }, { id: 'p2', name: 'Recaps to watch', vis: 'Public', items: ['v2', 'v9', 'v13'] }], readN: false };
let S;
try { S = Object.assign({}, DEF, JSON.parse(localStorage.getItem('hn-mock') || '{}')); } catch (e) { S = Object.assign({}, DEF); }
const save = () => { try { localStorage.setItem('hn-mock', JSON.stringify(S)); } catch (e) { } };
const signedIn = () => S.role !== 'guest';
const hasCh = () => S.role === 'creator';
const ME = H.channels.find(c => c.mine);
if (S.myName) { ME.name = S.myName; ME.handle = S.myHandle; ME.logo = S.myName.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase(); }

/* ---------- lookups and formatting ---------- */
const CH = id => H.channels.find(c => c.id === id);
const CHH = h => H.channels.find(c => c.handle === h);
const VID = id => H.videos.find(v => v.id === id);
/* Aamir Vlogs only exists once the viewer has created it (creator role) */
const canSee = v => !!v && (v.ch !== 'av' || hasCh());
const PUB = () => H.videos.filter(v => v.vis === 'Public' && !S.hidden.includes(v.id) && canSee(v));
const num = n => n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace('.0', '') + 'M' : n >= 1e3 ? (n / 1e3).toFixed(n >= 1e4 ? 0 : 1).replace('.0', '') + 'K' : String(n);
const full = n => Number(n).toLocaleString('en-IN');
const inr = n => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: n % 1 ? 2 : 0 });
/* all creator earnings are in US dollars */
const usd = n => (n < 0 ? '−$' : '$') + Math.abs(Number(n)).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const rate$ = r => '$' + Number(r).toFixed(2);
const age = d => d < 1 ? Math.max(1, Math.round(d * 24)) + 'h' : d < 30 ? Math.round(d) + 'd' : d < 365 ? Math.round(d / 30) + (Math.round(d / 30) > 1 ? ' months' : ' month') : Math.round(d / 365) + (d >= 730 ? ' years' : ' year');
const ageLong = d => d < 1 ? Math.max(1, Math.round(d * 24)) + ' hours ago' : d < 30 ? Math.round(d) + (Math.round(d) > 1 ? ' days ago' : ' day ago') : age(d) + ' ago';

/* ---------- icons ---------- */
const IP = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z', subs: 'M4 6h16M4 12h16M4 18h10M17 15l4 3-4 3z', hist: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 7v5l3 2', later: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 3', list: 'M4 6h12M4 12h12M4 18h8M18 14v6M15 17h6', like: 'M7 10v11H3V10zM7 10l4-8a3 3 0 0 1 3 3v4h6a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 18.6 20H7', dislike: 'M17 14V3h4v11zM17 14l-4 8a3 3 0 0 1-3-3v-4H4a2 2 0 0 1-2-2.3l1.4-7A2 2 0 0 1 5.4 4H17', share: 'M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13', save: 'M5 3h14v18l-7-5-7 5z', bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0', up: 'M12 16V4M7 9l5-5 5 5M4 20h16', search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3', dots: 'M12 5h.01M12 12h.01M12 19h.01', flag: 'M4 22V4M4 4h13l-2 4 2 4H4', gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  chart: 'M3 3v18h18M7 15l4-4 3 3 5-6', money: 'M2 6h20v12H2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 12h.01M18 12h.01', users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8', video: 'M2 6h14v12H2zM16 10l6-4v12l-6-4', cmt: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', check: 'M20 6L9 17l-5-5', x: 'M18 6L6 18M6 6l12 12', play: 'M6 4l14 8-14 8z', pause: 'M6 4h4v16H6zM14 4h4v16h-4z', plus: 'M12 5v14M5 12h14', edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z', trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6', eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4', globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20', copy: 'M9 9h11v11H9zM5 15H4V4h11v1', out: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9', ban: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM4.9 4.9l14.2 14.2', back: 'M15 18l-6-6 6-6', next: 'M9 18l6-6-6-6', vol: 'M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14', full: 'M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3', cc: 'M3 5h18v14H3zM10 10.5a2 2 0 1 0 0 3M17 10.5a2 2 0 1 0 0 3', db: 'M12 8c5 0 9-1.3 9-3s-4-3-9-3-9 1.3-9 3 4 3 9 3zM3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3', log: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8', dl: 'M12 4v12M7 11l5 5 5-5M4 20h16', grip: 'M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01', heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z', pinI: 'M12 17v5M8 3h8l-1 7 3 3H6l3-3z', sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2', user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', help: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01', link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7', cal: 'M3 5h18v16H3zM16 3v4M8 3v4M3 10h18', img: 'M3 3h18v18H3zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21', trend: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6', clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2', filter: 'M22 3H2l8 9.5V19l4 2v-8.5z', ext: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3'
};
/* country the creator lives in (asked when the channel is made; used for tax rules) */
const RES = { IN: 'India', US: 'United States', GB: 'United Kingdom', AE: 'United Arab Emirates', SA: 'Saudi Arabia', PK: 'Pakistan', BD: 'Bangladesh', CA: 'Canada', OT: 'Another country' };
/* payout: the creator fills at least one of PayPal / Payoneer / UPI ID when applying for monetization, and picks which one to be paid by */
const PAYM = [['PayPal', 'paypal'], ['Payoneer', 'payoneer'], ['UPI', 'upi']];
const payBy = () => { const p = S.payout || {}; return p.pref && p[PAYM.find(m => m[0] === p.pref)[1]] ? p.pref : 'PayPal, Payoneer or UPI (the one you choose)'; };
const ic = (n, cls) => `<svg class="i ${cls || ''}" viewBox="0 0 24 24"><path d="${IP[n] || ''}"/></svg>`;

/* ---------- building blocks ---------- */
const av = (ch, cls) => `<a href="#/@${ch.handle}" class="av ${cls || ''}" style="background:${ch.color}" title="${esc(ch.name)}">${ch.logo}</a>`;
const userAv = cls => S.role === 'guest' ? '' : hasCh() ? `<span class="av r ${cls || ''}" style="background:${ME.color}">${ME.logo[0]}</span>` : `<span class="av r ${cls || ''}" style="background:#c59bff">A</span>`;
function thumb(v, o) {
  o = o || {};
  const prog = o.prog ? `<i class="prog" style="width:${o.prog}%"></i>` : '';
  const views = v.vis === 'Draft' || v.vis === 'Scheduled' ? '' : `<span class="vw">${num(v.views)} views</span>`;
  const ag = v.days ? `<span class="age">${age(v.days)}</span>` : '';
  return `<a class="th ${v.sc}" href="#/watch/${v.id}"><span class="big">${v.big}</span>${o.badge ? `<span class="badge">${o.badge}</span>` : ''}<span class="len">${v.len}</span>${views}${o.noage ? '' : ag}${prog}<span class="play"><i></i></span></a>`;
}
function card(v, o) {
  o = o || {}; const ch = CH(v.ch);
  return `<div class="vc">${thumb(v, o)}<div class="meta">${o.noch ? '' : av(ch, 'sm')}<div style="min-width:0;flex:1"><a href="#/watch/${v.id}" class="t">${esc(v.title)}</a>${o.noch ? `<span class="c">${num(v.views)} views · ${ageLong(v.days)}</span>` : `<a class="c" href="#/@${ch.handle}">${esc(ch.name)}</a>`}</div><button class="ib" data-act="vmenu" data-id="${v.id}" title="More">${ic('dots')}</button></div></div>`;
}
function hrow(v, o) {
  o = o || {}; const ch = CH(v.ch);
  return `<div class="hrow ${o.sm ? 'sm' : ''}">${o.rank ? `<div class="rank">${o.rank}</div>` : ''}${o.grip ? `<div class="mu2" style="padding-top:34px">${ic('grip')}</div>` : ''}${thumb(v, o)}<div style="flex:1;min-width:0"><a href="#/watch/${v.id}" class="t">${esc(v.title)}</a><div class="c"><a href="#/@${ch.handle}">${esc(ch.name)}</a> · ${num(v.views)} views · ${ageLong(v.days)}</div>${o.sm ? '' : `<div class="d">${esc(v.desc)}</div>`}</div>${o.remove ? `<button class="ib" data-act="${o.remove}" data-id="${v.id}" title="Remove">${ic('x')}</button>` : ''}<button class="ib" data-act="vmenu" data-id="${v.id}" title="More">${ic('dots')}</button></div>`;
}

/* ---------- SVG charts ---------- */
function lineChart(data, o) {
  o = o || {}; const W = innerWidth < 700 ? 420 : 760, Hh = o.h || 220, P = 34, max = Math.max(...data) * 1.12 || 1;
  const x = i => P + i * (W - P - 10) / (data.length - 1), y = v => Hh - 24 - (v / max) * (Hh - 40);
  const pts = data.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const grid = [0, .25, .5, .75, 1].map(f => { const val = max * f, yy = y(val); return `<line x1="${P}" x2="${W - 10}" y1="${yy}" y2="${yy}" stroke="#262b35"/><text x="${P - 6}" y="${yy + 4}" fill="#6b7383" font-size="11" text-anchor="end">${o.fmt ? o.fmt(val) : num(Math.round(val))}</text>`; }).join('');
  const lbls = (o.labels || []).map((l, i, a) => { const idx = Math.round(i * (data.length - 1) / (a.length - 1)); return `<text x="${x(idx)}" y="${Hh - 4}" fill="#6b7383" font-size="11" text-anchor="${i === 0 ? 'start' : i === a.length - 1 ? 'end' : 'middle'}">${l}</text>`; }).join('');
  const col = o.color || '#2EC4B6';
  return `<svg class="chart" viewBox="0 0 ${W} ${Hh}">${grid}${lbls}<polygon points="${P},${y(0)} ${pts} ${x(data.length - 1)},${y(0)}" fill="${col}" opacity=".12"/><polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linejoin="round"/>${o.compare ? `<polyline points="${o.compare.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')}" fill="none" stroke="#6b7383" stroke-width="1.5" stroke-dasharray="4 4"/>` : ''}</svg>`;
}
function barChart(data, o) {
  o = o || {}; const W = innerWidth < 700 ? 420 : 760, Hh = o.h || 160, max = Math.max(...data) || 1, bw = (W - 20) / data.length;
  return `<svg class="chart" viewBox="0 0 ${W} ${Hh}">${data.map((v, i) => { const h = (v / max) * (Hh - 24); return `<rect x="${10 + i * bw + 1}" y="${Hh - 18 - h}" width="${bw - 3}" height="${h}" rx="2" fill="${o.color || '#2EC4B6'}" opacity="${i === data.length - 1 ? 1 : .7}"><title>${o.tip ? o.tip(i, v) : v}</title></rect>`; }).join('')}${(o.ticks || []).map(([i, l]) => `<text x="${10 + i * bw + bw / 2}" y="${Hh - 2}" fill="#6b7383" font-size="11" text-anchor="${i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}">${l}</text>`).join('')}<text x="10" y="${Hh - 2}" fill="#6b7383" font-size="11">${o.left || ''}</text><text x="${W - 10}" y="${Hh - 2}" fill="#6b7383" font-size="11" text-anchor="end">${o.right || ''}</text></svg>`;
}
const dayLabels = n => { const out = [], d = new Date(2026, 10, 16); for (let i = 4; i >= 0; i--) { const t = new Date(d - (n - 1) * i / 4 * 864e5); out.push(t.getDate() + ' ' + t.toLocaleString('en', { month: 'short' })); } return out; };
const sum = a => a.reduce((s, v) => s + v, 0);
const mmss = s => { s = Math.round(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
/* notifications about the viewer's own channel only show once they have one */
const NOTES = () => H.notifications.filter(n => (!n.mine || hasCh()) && canSee(VID(n.v)));

/* ---------- shell ---------- */
function topBar(tab) {
  const t = ['all', 'trending', 'latest'].map(k => `<a href="#/${k === 'all' ? 'home' : k}" class="${tab === k ? 'on' : ''}">${k === 'all' ? 'All' : k[0].toUpperCase() + k.slice(1)}</a>`).join('');
  const unread = S.readN ? 0 : NOTES().filter(n => n.unread).length;
  const right = signedIn()
    ? `<button class="btn pri" data-act="upload">${ic('up')}<span class="hide-m">Upload</span></button><button class="ib" data-act="notifs" title="Notifications">${ic('bell')}${unread ? `<span class="dot">${unread}</span>` : ''}</button><button class="ib" data-act="avmenu" title="Account">${userAv()}</button>`
    : `<button class="btn" data-act="signin">${ic('user')}Sign in</button>`;
  return `<header class="top"><a class="logo" href="#/home"><i></i><span>Hellnoo</span></a><nav class="tabs">${t}</nav><div class="sp"></div>${right}</header>`;
}
function sideBar(active) {
  const L = (h, i, l, k) => `<a href="#/${h}" class="${active === k ? 'on' : ''}">${ic(i)}${l}</a>`;
  let s = `<nav class="nav">${L('home', 'home', 'Home', 'home')}${L('subs', 'subs', 'Subscriptions', 'subs')}${L('history', 'hist', 'History', 'history')}${L('later', 'later', 'Watch later', 'later')}${L('playlists', 'list', 'Playlists', 'playlists')}${L('liked', 'like', 'Liked videos', 'liked')}`;
  if (signedIn()) {
    const subs = S.subs.map(CH).filter(Boolean);
    if (subs.length) s += `<div class="lbl">Subscriptions</div>` + subs.map(c => `<a class="sub ${active === 'ch-' + c.handle ? 'on' : ''}" href="#/@${c.handle}"><span class="av xs" style="background:${c.color}">${c.logo}</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.name)}</span></a>`).join('');
  }
  s += `</nav>`;
  if (!signedIn()) s += `<div class="guestbox">Sign in to like videos, comment and subscribe.<br><button class="btn" style="margin-top:10px" data-act="signin">${ic('user')}Sign in</button></div>`;
  const cta = !signedIn() ? '' : hasCh() ? `<a class="btn pri" href="#/@${ME.handle}">${ic('video')}Your channel</a>` : `<button class="btn pri" data-act="createch">${ic('plus')}Create channel</button>`;
  return `<aside class="side">${s}<div class="cta">${cta}</div></aside>`;
}
function mobileNav(active) {
  const A = (h, i, l, k) => `<a href="#/${h}" class="${active === k ? 'on' : ''}">${ic(i)}${l}</a>`;
  return `<nav class="mnav">${A('home', 'home', 'Home', 'home')}${A('subs', 'subs', 'Subscriptions', 'subs')}${A('you', 'user', 'You', 'you')}</nav>`;
}
function shell(active, tab, main) {
  return `${topBar(tab)}<div class="layout">${sideBar(active)}<main class="main">${main}</main></div><form class="sbar" data-form="search">${ic('search')}<input name="q" placeholder="Search Hellnoo" value="${esc(CUR.q || '')}" autocomplete="off"><button class="go" title="Search">${ic('search')}</button></form>${mobileNav(active)}`;
}
/* studio + admin share one layout with their own side menu */
function areaShell(kind, active, main) {
  const items = kind === 'studio'
    ? [['studio', 'home', 'Dashboard'], ['studio/content', 'video', 'Content'], ['studio/analytics', 'chart', 'Analytics'], ['studio/comments', 'cmt', 'Comments'], ['studio/earnings', 'money', 'Earnings'], ['studio/payout', 'lock', 'Payout details'], ['studio/customize', 'edit', 'Customize channel']]
    : [['admin', 'home', 'Overview'], ['admin/users', 'users', 'Users'], ['admin/channels', 'video', 'Channels'], ['admin/videos', 'play', 'Videos'], ['admin/reports', 'flag', 'Reports'], ['admin/payments', 'money', 'Payments'], ['admin/checks', 'db', 'Data checks'], ['admin/audit', 'log', 'Audit log'], ['admin/settings', 'gear', 'Settings']];
  const who = kind === 'studio'
    ? `<div class="who"><span class="av xl" style="background:${ME.color};width:72px;height:72px;font-size:24px">${ME.logo}</span><b>${esc(ME.name)}</b><span class="mu" style="font-size:12px">@${ME.handle}</span></div>`
    : `<div class="who"><span class="av xl" style="background:var(--y);width:72px;height:72px;font-size:24px">BK</span><b>Basit Bashir Khan</b><span class="mu" style="font-size:12px">Owner · full access</span></div>`;
  const reps = H.reports.filter(r => r.status === 'Open').length;
  const nav = items.map(([h, i, l]) => `<a href="#/${h}" class="${active === h ? 'on' : ''}">${ic(i)}${l}${l === 'Reports' && reps ? `<span class="pill r" style="margin-left:auto">${reps}</span>` : ''}</a>`).join('');
  const top = `<header class="top"><a class="logo" href="#/home"><i></i><span>Hellnoo</span></a><span class="pill ${kind === 'studio' ? 'a' : 'y'}" style="margin-left:6px">${kind === 'studio' ? 'Studio' : 'Admin'}</span><div class="sp"></div>${kind === 'studio' ? `<button class="btn pri" data-act="upload">${ic('up')}<span class="hide-m">Upload</span></button>` : `<a class="btn" href="#/home">${ic('ext')}<span class="hide-m">Open site</span></a>`}<button class="ib" data-act="${kind === 'studio' ? 'avmenu' : 'admmenu'}" title="Account">${kind === 'studio' ? userAv() : '<span class="av r" style="background:var(--y)">B</span>'}</button></header>`;
  const mob = `<div class="only-m chips" style="margin-bottom:14px;overflow-x:auto;flex-wrap:nowrap">${items.map(([h, , l]) => `<a href="#/${h}" class="chip ${active === h ? 'on' : ''}" style="display:grid;place-items:center;flex:none">${l}</a>`).join('')}</div>`;
  return `${top}<div class="layout"><aside class="side st">${who}<div class="area">${kind === 'studio' ? 'Channel Studio' : 'Admin tool'}</div><nav class="nav">${nav}</nav><div class="cta"><a class="btn" href="#/home">${ic('back')}Back to Hellnoo</a></div></aside><main class="main" style="padding-bottom:60px">${mob}${main}</main></div>`;
}

/* ---------- popups ---------- */
function closePop() { document.querySelectorAll('.menu,.panel').forEach(m => m.remove()); }
function place(el, anchor, alignRight) {
  document.body.appendChild(el);
  const r = anchor.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
  let x = alignRight ? r.right - w : r.left, y = r.bottom + 6;
  if (x + w > innerWidth - 8) x = innerWidth - w - 8; if (x < 8) x = 8;
  if (y + h > innerHeight - 8) y = Math.max(8, r.top - h - 6);
  el.style.left = x + 'px'; el.style.top = y + 'px';
}
function menu(anchor, items, head) {
  closePop();
  const m = document.createElement('div'); m.className = 'menu';
  m.innerHTML = (head || '') + items.map((it, i) => it === '-' ? '<hr>' : `<button data-mi="${i}" class="${it.cls || ''}">${ic(it.i)}${it.l}</button>`).join('');
  m.addEventListener('click', e => { const b = e.target.closest('[data-mi]'); if (!b) return; closePop(); items[+b.dataset.mi].f(); });
  place(m, anchor, true);
}
function modal(title, body, foot, wide) {
  closeModal();
  const o = document.createElement('div'); o.className = 'ov'; o.id = 'ov';
  o.innerHTML = `<div class="modal ${wide ? 'wide' : ''}"><div class="mhd">${title}<div class="sp"></div><button class="ib" data-act="close">${ic('x')}</button></div><div class="mbd">${body}</div>${foot ? `<div class="mft">${foot}</div>` : ''}</div>`;
  o.addEventListener('mousedown', e => { if (e.target === o) closeModal(); });
  document.body.appendChild(o);
  const f = o.querySelector('input:not([type=checkbox]):not([type=radio]),textarea'); if (f) setTimeout(() => f.focus(), 30);
  return o;
}
function closeModal() { const o = $('#ov'); if (o) o.remove(); }
let tt;
function toast(msg) { document.querySelectorAll('.toast').forEach(t => t.remove()); const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); clearTimeout(tt); tt = setTimeout(() => t.remove(), 2600); }
function needSignIn(why) { if (signedIn()) return false; ACT.signin(null, why); return true; }

/* ---------- actions (every data-act button lands here) ---------- */
const ACT = {
  close: closeModal,
  signin(el, why) {
    modal('Sign in to Hellnoo', `${why ? `<p class="mu" style="margin-top:0">${why}</p>` : ''}<button class="btn" style="width:100%;justify-content:center;height:44px;margin-bottom:10px" data-act="dosignin"><b style="color:#4285f4">G</b> Continue with Google</button><div class="row mu2" style="margin:14px 0"><hr style="flex:1;border-color:var(--line)">or<hr style="flex:1;border-color:var(--line)"></div><div class="fld"><label>Email</label><input class="inp" placeholder="you@example.com"></div><button class="btn pri" style="width:100%;justify-content:center;height:42px" data-act="dosignin">Send me a sign-in link</button><p class="hint" style="margin-bottom:0">By continuing you agree to the Terms and Privacy Policy. Hellnoo is 18+.</p>`);
  },
  dosignin() { S.role = 'viewer'; save(); closeModal(); toast('Signed in as Aamir Wani (no channel yet)'); render(); },
  signout() { S.role = 'guest'; save(); toast('Signed out'); go('#/home'); render(); },
  vmenu(el) {
    const id = el.dataset.id, v = VID(id);
    menu(el, [
      { i: 'later', l: S.later.includes(id) ? 'Remove from Watch later' : 'Save to Watch later', f: () => { if (needSignIn('Sign in to save videos.')) return; toggle(S.later, id); toast(S.later.includes(id) ? 'Saved to Watch later' : 'Removed from Watch later'); rerender(); } },
      { i: 'list', l: 'Add to playlist', f: () => ACT.addpl(null, id) },
      { i: 'share', l: 'Share', f: () => ACT.share(null, id) }, '-',
      { i: 'ban', l: 'Not interested', f: () => { S.hidden.push(id); save(); toast('Video hidden. We will show fewer like this.'); rerender(); } },
      { i: 'flag', l: 'Report', f: () => ACT.report(null, 'video', v.title) }
    ]);
  },
  share(el, id) {
    id = id || (el && el.dataset.id); const v = VID(id), ch = v ? null : CHH(id);
    const url = v ? `hellnoo.com/v/${id}` : `hellnoo.com/@${id}`;
    const ways = [['WhatsApp', '#25d366'], ['Facebook', '#1877f2'], ['X', '#e9ecf1'], ['Telegram', '#2aa1da'], ['Email', '#9aa3b2']];
    modal('Share', `${v ? `<div class="row" style="margin-bottom:16px"><div style="width:140px">${thumb(v, { noage: 1 })}</div><div><b>${esc(v.title)}</b><div class="mu">${esc(CH(v.ch).name)}</div></div></div>` : `<p style="margin-top:0"><b>${esc(ch.name)}</b> <span class="mu">@${ch.handle}</span></p>`}<div class="row" style="gap:14px;margin-bottom:18px">${ways.map(([n, c]) => `<button class="col" style="align-items:center;gap:6px;background:none;border:0;font-size:12px" data-act="toast" data-msg="Opens ${n} with the link ready"><span style="width:52px;height:52px;border-radius:50%;background:${c};display:grid;place-items:center;color:#111;font-weight:900">${n[0]}</span>${n}</button>`).join('')}</div><div class="row" style="background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:6px 6px 6px 14px"><span style="flex:1">${url}</span><button class="btn pri sm" data-act="toast" data-msg="Link copied">${ic('copy', 'sm')}Copy</button></div>${v ? `<label class="chk" style="margin-top:14px"><input type="checkbox">Start at 2:14</label>` : ''}<p class="hint">Links show a preview card with the thumbnail and title when pasted in WhatsApp or Facebook.</p>`);
  },
  toast(el) { toast(el.dataset.msg); },
  report(el, kind, what) {
    kind = kind || el.dataset.kind; what = what || el.dataset.what || '';
    const rs = ['Sexual content', 'Violent or repulsive content', 'Hateful or abusive content', 'Harassment or bullying', 'Harmful or dangerous acts', 'Spam or misleading', 'Copyright – my work is used', 'Impersonation', 'Something else'];
    modal('Report ' + kind, `${what ? `<p class="mu" style="margin-top:0">${esc(what)}</p>` : ''}${rs.map((r, i) => `<label class="chk" style="padding:7px 0"><input type="radio" name="rr" ${i ? '' : 'checked'}>${r}</label>`).join('')}<div class="fld" style="margin-top:10px"><label>Details (optional)</label><textarea class="inp" placeholder="Add time stamps or anything that helps the team"></textarea></div><p class="hint">Reports are anonymous. The person you report is not told who reported them.</p>`, `<button class="btn ghost" data-act="close">Cancel</button><button class="btn pri" data-act="sentreport">Report</button>`);
  },
  sentreport() { if (needSignIn('Sign in to report.')) return; closeModal(); toast('Thanks. Our team will review this report.'); },
  addpl(el, id) {
    if (needSignIn('Sign in to save videos to a playlist.')) return;
    id = id || el.dataset.id;
    const rows = [`<label class="chk" style="padding:8px 0"><input type="checkbox" data-pl="later" ${S.later.includes(id) ? 'checked' : ''}>Watch later</label>`].concat(S.playlists.map(p => `<label class="chk" style="padding:8px 0"><input type="checkbox" data-pl="${p.id}" ${p.items.includes(id) ? 'checked' : ''}>${esc(p.name)}<span class="sp"></span>${ic(p.vis === 'Private' ? 'lock' : 'globe', 'sm')}</label>`)).join('');
    const o = modal('Save video to…', `<div id="pls">${rows}</div><hr style="border-color:var(--line);margin:12px 0"><div class="row"><input class="inp" id="newpl" placeholder="New playlist name"><select class="inp" id="newplv" style="width:120px"><option>Private</option><option>Unlisted</option><option>Public</option></select><button class="btn" data-act="newpl" data-id="${id}">${ic('plus')}Create</button></div>`, `<button class="btn pri" data-act="close">Done</button>`);
    o.querySelector('.mbd').addEventListener('change', e => { const k = e.target.dataset.pl; if (!k) return; if (k === 'later') toggle(S.later, id); else toggle(S.playlists.find(p => p.id === k).items, id); save(); toast(e.target.checked ? 'Saved' : 'Removed'); });
  },
  newpl(el) {
    const n = $('#newpl').value.trim(); if (!n) { toast('Type a playlist name first'); return; }
    S.playlists.push({ id: 'p' + Date.now(), name: n, vis: $('#newplv').value, items: [el.dataset.id] }); save(); toast(`Created “${n}” and saved the video`); ACT.addpl(null, el.dataset.id);
  },
  notifs(el) {
    closePop(); const p = document.createElement('div'); p.className = 'panel';
    p.innerHTML = `<div class="row" style="padding:14px;border-bottom:1px solid var(--line)"><b>Notifications</b><div class="sp"></div><button class="btn ghost sm" data-act="readall">Mark all read</button><button class="ib" data-act="go" data-to="#/settings" title="Settings">${ic('gear')}</button></div>` + NOTES().map(n => { const c = CH(n.ch), v = VID(n.v); return `<div class="nt ${n.unread && !S.readN ? 'un' : ''}" data-act="go" data-to="#/watch/${n.v}"><span class="av" style="background:${c.color}">${c.logo}</span><div style="flex:1;font-size:13px">${esc(n.text)}<div class="mu2" style="margin-top:3px">${n.when}</div></div>${thumb(v, { noage: 1 })}</div>`; }).join('');
    place(p, el, true);
  },
  readall() { S.readN = true; save(); closePop(); toast('All notifications marked as read'); render(); },
  go(el) { closePop(); go(el.dataset.to); },
  avmenu(el) {
    if (!signedIn()) return ACT.signin();
    const head = `<div class="mh">${userAv('lg')}<div><b>${hasCh() ? esc(ME.name) : 'Aamir Wani'}</b><div class="mu" style="font-size:12px">${hasCh() ? '@' + ME.handle : 'aamir.wani@gmail.com'}</div></div></div><hr>`;
    menu(el, [
      hasCh() ? { i: 'video', l: 'Your channel', f: () => go('#/@' + ME.handle) } : { i: 'plus', l: 'Create channel', f: () => ACT.createch() },
      hasCh() ? { i: 'chart', l: 'Channel Studio', f: () => go('#/studio') } : null,
      { i: 'gear', l: 'Settings', f: () => go('#/settings') },
      { i: 'help', l: 'Help & feedback', f: () => ACT.feedback() }, '-',
      { i: 'out', l: 'Sign out', f: () => ACT.signout() }
    ].filter(Boolean), head);
  },
  admmenu(el) {
    menu(el, [
      { i: 'ext', l: 'Open Hellnoo', f: () => go('#/home') },
      { i: 'log', l: 'Audit log', f: () => go('#/admin/audit') },
      { i: 'gear', l: 'Admin settings', f: () => go('#/admin/settings') }, '-',
      { i: 'out', l: 'Sign out of admin', f: () => { toast('Signed out of the admin tool'); go('#/home'); } }
    ], `<div class="mh"><span class="av r lg" style="background:var(--y)">B</span><div><b>Basit Bashir Khan</b><div class="mu" style="font-size:12px">Owner · full access</div></div></div><hr>`);
  },
  feedback() { modal('Send feedback', `<div class="fld"><label>What happened?</label><textarea class="inp" placeholder="Tell us what went wrong or what we can do better"></textarea></div><label class="chk"><input type="checkbox" checked>Attach a screenshot of this page</label>`, `<button class="btn ghost" data-act="close">Cancel</button><button class="btn pri" data-act="sent">Send</button>`); },
  sent() { closeModal(); toast('Sent. Thank you!'); },
  done(el) { closeModal(); toast(el.dataset.msg || 'Done'); },
  sub(el) {
    if (needSignIn('Sign in to subscribe to channels.')) return;
    const id = el.dataset.id; toggle(S.subs, id); save();
    toast(S.subs.includes(id) ? `Subscribed to ${CH(id).name}` : `Unsubscribed from ${CH(id).name}`); rerender();
  },
  like(el) { if (needSignIn('Sign in to like videos.')) return; const id = el.dataset.id; toggle(S.liked, id); S.disliked = S.disliked.filter(x => x !== id); save(); rerender(); },
  dislike(el) { if (needSignIn('Sign in to rate videos.')) return; const id = el.dataset.id; toggle(S.disliked, id); S.liked = S.liked.filter(x => x !== id); save(); rerender(); },
  rmlater(el) { toggle(S.later, el.dataset.id); save(); toast('Removed from Watch later'); rerender(); },
  rmliked(el) { toggle(S.liked, el.dataset.id); save(); toast('Removed from Liked videos'); rerender(); },
  rmhist(el) { S.history = S.history.filter(x => x !== el.dataset.id); save(); toast('Removed from history'); rerender(); }
};
function toggle(arr, id) { const i = arr.indexOf(id); i < 0 ? arr.push(id) : arr.splice(i, 1); save(); }

document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]');
  if (!t) { if (!e.target.closest('.menu,.panel')) closePop(); return; }
  if (t.tagName === 'A' && !t.dataset.act) return;
  e.preventDefault(); e.stopPropagation();
  const f = ACT[t.dataset.act]; if (f) f(t); else toast('Mockup: “' + t.dataset.act + '” has no action yet');
});
document.addEventListener('submit', e => {
  const f = e.target.dataset.form; if (!f) return; e.preventDefault();
  if (f === 'search') { const q = e.target.q.value.trim(); if (q) go('#/search/' + encodeURIComponent(q)); }
  else if (FORMS[f]) FORMS[f](e.target);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closePop(); closeModal(); } if (e.key === 'f' && $('#pl') && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) ACT.fullscreen(); if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { const i = $('.sbar input'); if (i) { e.preventDefault(); i.focus(); } } });
addEventListener('scroll', closePop, true);
const FORMS = {};

/* ---------- router ---------- */
const ROUTES = [];
const route = (re, fn) => ROUTES.push([re, fn]);
let CUR = {};
function go(h) { if (location.hash === h) render(); else location.hash = h; }
function rerender() { const y = scrollY; render(); scrollTo(0, y); }
function render() {
  closePop(); closeModal();
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, '')) || 'home';
  CUR = { path: h };
  for (const [re, fn] of ROUTES) { const m = h.match(re); if (m) { $('#app').innerHTML = fn(...m.slice(1)); document.title = (CUR.title ? CUR.title + ' – ' : '') + 'Hellnoo (mockup)'; if (CUR.after) CUR.after(); mockBar(); return; } }
  $('#app').innerHTML = shell('', '', `<div class="empty"><h1>Page not found</h1><p>This link does not go anywhere.</p><a class="btn pri" href="#/home">Go home</a></div>`); mockBar();
}
addEventListener('hashchange', () => { render(); scrollTo(0, 0); });

/* ---------- mockup switcher (not part of the real site) ---------- */
function mockBar() {
  let b = $('#mock'); if (!b) { b = document.createElement('div'); b.id = 'mock'; b.className = 'mock'; document.body.appendChild(b); b.addEventListener('click', e => { e.stopPropagation(); mockMenu(b); }); }
  b.innerHTML = `${ic('eye', 'sm')}Mockup: ${({ guest: 'Signed out', viewer: 'Viewer, no channel', creator: 'Creator' })[S.role]} ▾`;
}
function mockMenu(b) {
  const set = r => () => { S.role = r; save(); toast('Viewing as: ' + ({ guest: 'Signed out visitor', viewer: 'Signed-in viewer without a channel', creator: 'Creator with a channel' })[r]); render(); };
  menu(b, [
    { i: 'user', l: 'View as signed-out visitor', f: set('guest') },
    { i: 'user', l: 'View as viewer (no channel)', f: set('viewer') },
    { i: 'video', l: 'View as creator (Aamir Vlogs)', f: set('creator') }, '-',
    { i: 'chart', l: 'Open Channel Studio', f: () => { S.role = 'creator'; save(); go('#/studio'); } },
    { i: 'money', l: 'Earnings: ' + ({ new: 'not eligible yet', ready: 'ready to submit', review: 'under review', approved: 'approved' })[S.monet] + ' (change)', f: () => menu(b, [['new', 'Not eligible yet (needs 10 videos, 30 days)'], ['ready', 'Eligible, ready to submit'], ['review', 'Submitted, under review'], ['approved', 'Approved, earning']].map(([k, l]) => ({ i: S.monet === k ? 'check' : '', l, f: () => { S.role = 'creator'; S.monet = k; save(); go('#/studio/earnings'); } }))) },
    { i: 'shield', l: 'Open Admin tool', f: () => go('#/admin') },
    { i: 'list', l: 'Page index (all pages)', f: () => go('#/index') }, '-',
    { i: 'trash', l: 'Reset mockup data', f: () => { try { localStorage.removeItem('hn-mock'); } catch (e) { } location.hash = '#/home'; location.reload(); } }
  ], '<div class="mh mu" style="font-size:12px">This yellow button is only for checking the mockup. It will not exist on the real site.</div><hr>');
}
