/* Hellnoo mockup — Channel Studio (creator) */
const MYV = () => H.videos.filter(v => v.ch === 'av');
const studio = (active, main) => {
  if (!hasCh()) return shell('', '', `<div class="empty"><h2>Channel Studio is for channel owners</h2><p>Create a channel to upload videos and see analytics.</p>${signedIn() ? '<button class="btn pri" data-act="createch">Create channel</button>' : '<button class="btn pri" data-act="signin">Sign in</button>'}</div>`);
  return areaShell('studio', active, main);
};
const visPill = v => ({ Public: `<span class="pill g">${ic('globe', 'sm')}Public</span>`, Unlisted: `<span class="pill y">${ic('link', 'sm')}Unlisted</span>`, Private: `<span class="pill">${ic('lock', 'sm')}Private</span>`, Draft: `<span class="pill">${ic('edit', 'sm')}Draft</span>`, Scheduled: `<span class="pill a">${ic('cal', 'sm')}Scheduled</span>` })[v.vis];
const dateOf = d => { const t = new Date(new Date(2026, 10, 16) - d * 864e5); return t.getDate() + ' ' + t.toLocaleString('en', { month: 'short' }) + ' ' + t.getFullYear(); };
/* per-video totals come from the same daily data as the charts (see data.js) */
const avd = v => mmss(v.avdS || 0);
const impr = v => v.impr || 0;
const ctr = v => (v.impr ? v.views / v.impr * 100 : 0).toFixed(1) + '%';
const MK = { sep: '2026-9', oct: '2026-10', nov: '2026-11' };
const LED = () => H.myEarnings; // same ledger the admin tool uses for Aamir Vlogs
const LM = k => LED().find(m => m.k === k);
/* split a month's earnings across videos in paise, so the video rows add up exactly to the month total */
function vidEarn(k) {
  const vs = MYV().filter(v => v.m && v.m[MK[k]] && v.m[MK[k]].counted), tot = vs.reduce((s, v) => s + v.m[MK[k]].counted, 0);
  const rate = k === 'nov' ? H.fund.rate : LM(k).rate, paise = Math.round(tot * rate / 10);
  const raw = vs.map(v => v.m[MK[k]].counted * rate / 10), base = raw.map(Math.floor); let left = paise - sum(base);
  raw.map((r, i) => [r - base[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { base[i]++; left--; } });
  const out = {}; vs.forEach((v, i) => out[v.id] = { counted: v.m[MK[k]].counted, earned: base[i] / 100 }); return out;
}
const pubCount = () => MYV().filter(v => v.vis === 'Public').length;

/* ---------- Upload flow ---------- */
let UP = {};
ACT.upload = () => {
  if (needSignIn('Sign in to upload videos.')) return;
  if (!hasCh()) { modal('Create a channel first', '<p class="mu" style="margin-top:0">You need a channel before you can upload. It takes a minute: name, username and description.</p>', '<button class="btn ghost" data-act="close">Not now</button><button class="btn pri" data-act="createch">Create channel</button>'); return; }
  UP = { step: 1, title: '', vis: 'Public', th: 0, pct: 0 }; upStep();
};
function upStep() {
  const st = `<div class="steps">${[1, 2, 3].map(i => `<span class="${UP.step >= i ? 'on' : ''}"></span>`).join('')}</div>`;
  if (UP.step === 1) return modal('Upload video', `${st}<div class="drop">${ic('up')}<h2 style="margin:12px 0 6px">Drag and drop a video file</h2><p class="mu">Your video stays private until you publish it.</p><button class="btn pri" data-act="upfile">Select file</button><p class="hint" style="margin-top:18px">MP4, MOV, MKV or WEBM · up to 4 GB · up to 2 hours</p></div><p class="hint">By uploading you confirm you own the rights to this video or have permission to share it.</p>`, '', true);
  const prog = `<div class="row" style="background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:10px 12px;margin-bottom:16px">${ic('video')}<div style="flex:1"><div style="font-size:13px;font-weight:600">gulmarg-day2-final.mp4 · 1.4 GB</div><div class="bar" style="margin-top:6px"><i id="upb" style="width:${UP.pct}%"></i></div></div><span class="mu" id="upt" style="font-size:12px;width:150px;text-align:right">${UP.pct < 100 ? 'Uploading ' + UP.pct + '%' : 'Processing… ready soon'}</span></div>`;
  if (UP.step === 2) {
    const ths = ['sc-snow', 'sc-valley', 'sc-lake'].map((c, i) => `<div class="th ${c} ${UP.th === i ? 'on' : ''}" data-act="upth" data-i="${i}"><span class="big" style="font-size:13px;bottom:10px">Frame ${i + 1}</span></div>`).join('') + `<div class="up" data-act="toast" data-msg="Pick your own image, 1280×720 recommended">${ic('img')} Upload</div>`;
    modal('Details', `${st}${prog}<div class="fld"><label>Title (required)</label><input class="inp" id="ut" maxlength="100" value="${esc(UP.title)}" placeholder="Add a title that describes your video"><span class="hint"><span id="utc">${UP.title.length}</span>/100</span></div><div class="fld"><label>Description</label><textarea class="inp" id="ud" placeholder="Tell viewers about your video">${esc(UP.desc || '')}</textarea></div><div class="fld"><label>Thumbnail</label><div class="th-pick">${ths}</div></div><div class="two"><div class="fld"><label>Tags</label><input class="inp" placeholder="kashmir, snow, travel"><span class="hint">Separate with commas</span></div><div class="fld"><label>Language</label><select class="inp"><option>Hindi</option><option>Urdu</option><option>Kashmiri</option><option>English</option><option>Other</option></select></div></div><div class="fld"><label>Category</label><select class="inp"><option>Travel & events</option><option>Food</option><option>Education</option><option>Entertainment</option><option>Music</option><option>Sports</option><option>Tech</option></select></div><div class="fld"><label>Subtitles (optional)</label><button class="btn" style="width:max-content" data-act="toast" data-msg="Upload an .srt or .vtt file you made yourself">${ic('cc')}Add subtitle file</button></div><label class="chk"><input type="checkbox" id="urights">I own this video or have permission to upload it, and it follows the Community Guidelines.</label>`, `<button class="btn ghost" data-act="updraft">Save as draft</button><button class="btn pri" data-act="upnext">Next</button>`, true);
    const t = $('#ut'); t.addEventListener('input', () => { UP.title = t.value; $('#utc').textContent = t.value.length; });
    upTick(); return;
  }
  if (UP.step === 3) {
    const opt = (k, d) => `<label class="chk" style="padding:10px 12px;border:1px solid ${UP.vis === k ? 'var(--ac)' : 'var(--line)'};border-radius:10px;margin-bottom:8px;cursor:pointer" data-act="upvis" data-k="${k}"><input type="radio" ${UP.vis === k ? 'checked' : ''}><div><b>${k}</b><div class="mu">${d}</div></div></label>`;
    modal('Visibility', `${st}${prog}${opt('Public', 'Everyone can watch and find your video')}${opt('Unlisted', 'Anyone with the link can watch. Not shown on your channel or in search')}${opt('Private', 'Only you can watch')}${opt('Schedule', 'Choose when it goes public')}${UP.vis === 'Schedule' ? `<div class="two"><input class="inp" type="date" value="2026-11-20"><input class="inp" type="time" value="18:00"></div>` : ''}`, `<button class="btn ghost" data-act="upback">Back</button><button class="btn pri" data-act="uppublish">${UP.vis === 'Schedule' ? 'Schedule' : UP.vis === 'Public' ? 'Publish' : 'Save'}</button>`, true);
    upTick(); return;
  }
  if (UP.step === 4) modal('Video published', `<div style="display:grid;grid-template-columns:240px 1fr;gap:18px" class="two"><div>${thumb({ id: 'a1', sc: ['sc-snow', 'sc-valley', 'sc-lake'][UP.th], big: esc(UP.title || 'New video'), len: '18:05', views: 0, days: 0, vis: 'Draft' }, { noage: 1 })}</div><div><b>${esc(UP.title || 'Untitled video')}</b><p class="mu">${UP.vis === 'Schedule' ? 'Goes public on Fri, 20 Nov 2026 at 6:00 pm.' : UP.vis === 'Public' ? 'Your video is live. Processing to all qualities finishes in a few minutes.' : 'Saved as ' + UP.vis.toLowerCase() + '.'}</p><div class="row" style="background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:6px 6px 6px 12px"><span style="flex:1;font-size:13px">hellnoo.com/v/x8Kq2</span><button class="btn sm" data-act="toast" data-msg="Link copied">${ic('copy', 'sm')}Copy</button></div><div class="row" style="margin-top:12px"><button class="btn sm" data-act="share" data-id="a1">${ic('share', 'sm')}Share</button></div></div></div>`, `<a class="btn" href="#/studio/content" data-act="go" data-to="#/studio/content">Go to Content</a><button class="btn pri" data-act="close">Done</button>`, true);
}
function upTick() { clearInterval(UP.iv); if (UP.pct >= 100) return; UP.iv = setInterval(() => { UP.pct = Math.min(100, UP.pct + 7); const b = $('#upb'), t = $('#upt'); if (!b) { clearInterval(UP.iv); return; } b.style.width = UP.pct + '%'; t.textContent = UP.pct < 100 ? 'Uploading ' + UP.pct + '%' : 'Processing… ready soon'; if (UP.pct >= 100) clearInterval(UP.iv); }, 350); }
Object.assign(ACT, {
  upfile() { UP.step = 2; UP.title = 'Gulmarg day 2 – gondola Phase 2'; upStep(); },
  upth(el) { UP.th = +el.dataset.i; UP.desc = $('#ud').value; upStep(); },
  upnext() { if (!$('#ut').value.trim()) { toast('Add a title first'); return; } if (!$('#urights').checked) { toast('Tick the rights box to continue'); return; } UP.step = 3; upStep(); },
  upvis(el) { UP.vis = el.dataset.k; upStep(); },
  upback() { UP.step = 2; upStep(); },
  uppublish() { UP.step = 4; upStep(); },
  updraft() { clearInterval(UP.iv); closeModal(); toast('Saved as a draft. Find it in Content → Drafts & scheduled.'); }
});

/* ---------- Dashboard ---------- */
route(/^studio$/, () => {
  CUR.title = 'Studio';
  const last = MYV().filter(v => v.vis === 'Public').sort((a, b) => a.days - b.days)[0];
  const s = H.series, v28 = sum(s.views.slice(-28)), p28 = sum(s.views.slice(-56, -28));
  const m = `<div class="ph"><div><h1>Channel dashboard</h1><div class="mu">Numbers update every hour. Last update 16 Nov 2026, 11:00.</div></div><div class="sp"></div><button class="btn pri" data-act="upload">${ic('up')}Upload video</button></div>
  <div class="three">
    <div class="card"><h2>Latest video</h2>${thumb(last, { noage: 1 })}<b style="display:block;margin:10px 0">${esc(last.title)}</b><div class="mu" style="font-size:13px;margin-bottom:8px">First ${Math.round(last.days)} days compared to your usual</div>${[['Views', full(last.views), 'g', '▲ 38%'], ['Impressions', full(impr(last)), 'g', '▲ 12%'], ['Click-through rate', ctr(last), '', '≈ usual'], ['Avg. view duration', avd(last), 'g', '▲ 0:42']].map(([k, v, c, d]) => `<div class="row" style="padding:6px 0;border-bottom:1px solid var(--line)"><span style="flex:1">${k}</span><b>${v}</b><span class="${c === 'g' ? 'grn' : 'mu'}" style="font-size:12px;width:56px;text-align:right">${d}</span></div>`).join('')}<div class="row" style="margin-top:12px"><a class="btn sm" href="#/studio/analytics/${last.id}">Video analytics</a><a class="btn sm" href="#/studio/comments">See comments (${last.comments})</a></div></div>
    <div class="card"><h2>Channel analytics</h2><div class="mu" style="font-size:13px">Current subscribers</div><div style="font-size:32px;font-weight:800">${full(ME.subs)}</div><div class="grn" style="font-size:13px;margin-bottom:12px">+${sum(s.subs.slice(-28))} in last 28 days</div><h3>Summary · last 28 days</h3>${[['Views', full(v28), Math.round((v28 / p28 - 1) * 100)], ['Watch time (hours)', full(Math.round(sum(s.watch.slice(-28)))), 9], ['Impressions', full(sum(s.impr.slice(-28))), 6]].map(([k, v, d]) => `<div class="row" style="padding:6px 0;border-bottom:1px solid var(--line)"><span style="flex:1">${k}</span><b>${v}</b><span class="${d >= 0 ? 'grn' : 'red'}" style="font-size:12px;width:50px;text-align:right">${d >= 0 ? '▲' : '▼'} ${Math.abs(d)}%</span></div>`).join('')}<div style="margin-top:10px">${barChart(s.views.slice(-28), { h: 90, left: '28 days ago', right: 'Today' })}</div><a class="btn sm" href="#/studio/analytics" style="margin-top:8px">Go to analytics</a></div>
    <div class="col" style="gap:16px"><div class="card"><h2>Earnings</h2><div class="mu" style="font-size:13px">November so far (estimate)</div><div style="font-size:28px;font-weight:800">${inr(LM('nov').est)}</div><div class="mu" style="font-size:13px;margin:6px 0 10px">Carried from Sep + Oct: <b>${inr(LM('nov').carryIn)}</b></div>${payBar()}<a class="btn sm" href="#/studio/earnings" style="margin-top:12px">Earnings details</a></div>
    <div class="card"><h2>Latest comments</h2>${H.commentPool.slice(0, 3).map(([n, h, t]) => `<div style="padding:8px 0;border-bottom:1px solid var(--line);font-size:13px"><b>@${h}</b> <span class="mu2">· 2h</span><div class="mu">${esc(t.slice(0, 70))}…</div></div>`).join('')}<a class="btn sm" href="#/studio/comments" style="margin-top:10px">View more</a></div></div>
  </div>`;
  return studio('studio', m);
});

const payBar = () => { const n = LM('nov'), t = Math.round((n.carryIn + n.est) * 100) / 100; return `<div class="bar"><i style="width:${Math.min(100, t / 5)}%"></i></div><div class="hint" style="margin-top:6px">${t >= H.fund.threshold ? `${inr(t)} with this month’s estimate · ₹500 minimum reached · paid 15–20 Dec` : `${inr(t)} of ₹500 · the rest carries forward`}</div>`; };

/* ---------- Content ---------- */
route(/^studio\/content(?:\/(\w+))?$/, f => {
  CUR.title = 'Content'; f = f || 'all';
  let vs = MYV().slice().sort((a, b) => a.days - b.days);
  if (f === 'drafts') vs = vs.filter(v => v.vis === 'Draft' || v.vis === 'Scheduled');
  const cq = (window._cq || '').toLowerCase(), cv = window._cv || '';
  if (cq) vs = vs.filter(v => v.title.toLowerCase().includes(cq));
  if (cv) vs = vs.filter(v => v.vis === cv);
  const rows = vs.map(v => `<tr><td><input type="checkbox" class="chkb" style="accent-color:var(--ac)"></td><td><div class="row" style="min-width:320px"><div style="width:120px">${thumb(v, { noage: 1 })}</div><div style="min-width:0"><a href="#/studio/video/${v.id}" style="font-weight:700">${esc(v.title)}</a><div class="mu2" style="font-size:12px;margin-top:2px">${v.vis === 'Scheduled' ? 'Goes public ' + v.sched : v.vis === 'Draft' ? 'Draft · add details and publish when ready' : v.len + ' · ' + esc(v.desc.slice(0, 48)) + '…'}</div><div class="row" style="gap:2px;margin-top:4px"><a class="ib" style="width:30px;height:30px" href="#/studio/video/${v.id}" title="Details">${ic('edit', 'sm')}</a><a class="ib" style="width:30px;height:30px" href="#/studio/analytics/${v.id}" title="Analytics">${ic('chart', 'sm')}</a><a class="ib" style="width:30px;height:30px" href="#/studio/comments" title="Comments">${ic('cmt', 'sm')}</a><a class="ib" style="width:30px;height:30px" href="#/watch/${v.id}" title="View on Hellnoo">${ic('ext', 'sm')}</a><button class="ib" style="width:30px;height:30px" data-act="cmenu2" data-id="${v.id}">${ic('dots', 'sm')}</button></div></div></div></td><td>${visPill(v)}</td><td class="mu">${v.days ? dateOf(v.days) + '<br><span class="mu2" style="font-size:12px">Published</span>' : v.vis === 'Scheduled' ? '20 Nov 2026<br><span class="mu2" style="font-size:12px">Scheduled</span>' : '—'}</td><td class="num">${v.views ? full(v.views) : '—'}</td><td class="num">${v.views ? v.comments : '—'}</td><td class="num">${v.views ? (100 - (1 + v.views % 4)) + '%' : '—'}</td></tr>`).join('') || `<tr><td colspan="7" class="mu" style="text-align:center;padding:30px">No videos match.</td></tr>`;
  const m = `<div class="ph"><div><h1>Channel content</h1></div><div class="sp"></div><button class="btn pri" data-act="upload">${ic('up')}Upload</button></div><div class="ctabs"><a href="#/studio/content" class="${f === 'all' ? 'on' : ''}">Videos</a><a href="#/studio/content/drafts" class="${f === 'drafts' ? 'on' : ''}">Drafts & scheduled</a></div><div class="row" style="margin-bottom:12px">${ic('filter')}<input class="inp" style="max-width:340px" placeholder="Search your videos (press Enter)" value="${esc(window._cq || '')}" onchange="window._cq=this.value;rerender()"><select class="inp" style="width:170px" onchange="window._cv=this.value;rerender()">${[['', 'All visibility'], ['Public', 'Public'], ['Unlisted', 'Unlisted'], ['Draft', 'Draft'], ['Scheduled', 'Scheduled']].map(([k, l]) => `<option value="${k}" ${cv === k ? 'selected' : ''}>${l}</option>`).join('')}</select><div class="sp"></div><button class="btn sm" data-act="bulk">Edit selected</button></div><div class="tbw"><table class="tb"><tr><th></th><th>Video</th><th>Visibility</th><th>Date</th><th class="num">Views</th><th class="num">Comments</th><th class="num">Likes (vs. dislikes)</th></tr>${rows}</table></div><div class="row mu" style="justify-content:flex-end;margin-top:10px;font-size:13px">Rows per page: 30 · 1–${vs.length} of ${vs.length}</div>`;
  return studio('studio/content', m);
});
ACT.cmenu2 = el => { const v = VID(el.dataset.id); menu(el, [{ i: 'edit', l: 'Edit title and description', f: () => go('#/studio/video/' + v.id) }, { i: 'share', l: 'Get shareable link', f: () => toast('hellnoo.com/v/' + v.id + ' copied') }, { i: 'dl', l: 'Download', f: () => toast('Your original file starts downloading') }, '-', { i: 'trash', l: 'Delete forever', cls: 'red', f: () => modal('Delete this video forever?', `<p class="mu" style="margin-top:0">“${esc(v.title)}” and its comments, views and earnings history will be removed. This can’t be undone.</p><label class="chk"><input type="checkbox" id="delok">I understand this can’t be undone</label>`, '<button class="btn ghost" data-act="close">Cancel</button><button class="btn dan" data-act="dodelvid">Delete forever</button>') }]); };
ACT.dodelvid = () => { if (!$('#delok').checked) { toast('Tick the box to confirm'); return; } closeModal(); toast('Mockup: the video would be deleted now. Nothing was removed.'); };
ACT.bulk = el => { const n = document.querySelectorAll('.chkb:checked').length; if (!n) { toast('Tick one or more videos first'); return; } menu(el, [{ i: 'globe', l: 'Change visibility', f: () => toast(n + ' videos updated') }, { i: 'trash', l: 'Delete', f: () => toast('Asks to confirm before deleting ' + n + ' videos') }]); };

/* ---------- Video details ---------- */
route(/^studio\/video\/(\w+)$/, id => {
  const v = VID(id); if (!v || v.ch !== 'av') return studio('studio/content', '<div class="empty">Video not found.</div>');
  CUR.title = 'Video details';
  const m = `<div class="ph"><a class="btn ghost" href="#/studio/content">${ic('back')}Content</a><h1 style="margin:0">Video details</h1><div class="sp"></div><button class="btn ghost" data-act="toast" data-msg="Changes undone">Undo changes</button><button class="btn pri" data-act="toast" data-msg="Saved. Changes show on Hellnoo within a minute.">Save</button></div><div class="ctabs"><a class="on">Details</a><a href="#/studio/analytics/${id}">Analytics</a><a href="#/studio/comments">Comments</a></div>
  <div class="wp" style="grid-template-columns:minmax(0,1fr) 340px"><div><div class="fld"><label>Title (required)</label><input class="inp" value="${esc(v.title)}" maxlength="100"></div><div class="fld"><label>Description</label><textarea class="inp" style="min-height:150px">${esc(v.desc)}\n\n${v.tags.join(' ')}</textarea></div><div class="fld"><label>Thumbnail</label><div class="th-pick">${['sc-snow', 'sc-valley', 'sc-lake'].map((c, i) => `<div class="th ${i ? c : v.sc} ${i ? '' : 'on'}" data-act="toast" data-msg="Thumbnail selected"><span class="big" style="font-size:13px;bottom:10px">${i ? 'Frame ' + i : 'Current'}</span></div>`).join('')}<div class="up" data-act="toast" data-msg="Upload your own thumbnail">${ic('img')} Upload</div></div></div><div class="two"><div class="fld"><label>Tags</label><input class="inp" value="${v.tags.join(', ').replace(/#/g, '')}"></div><div class="fld"><label>Language</label><select class="inp"><option>Hindi</option><option>Urdu</option><option>Kashmiri</option><option>English</option></select></div></div><div class="two"><div class="fld"><label>Category</label><select class="inp"><option>Travel & events</option><option>Food</option></select></div><div class="fld"><label>Comments</label><select class="inp"><option>On – show all</option><option>Hold all for review</option><option>Off</option></select></div></div><div class="fld"><label>Subtitles</label><div class="row"><span class="mu" style="font-size:13px">No subtitle file</span><button class="btn sm" data-act="toast" data-msg="Upload .srt or .vtt">${ic('cc', 'sm')}Upload file</button></div></div></div>
  <div><div class="card" style="padding:0;overflow:hidden">${thumb(v, { noage: 1 })}<div style="padding:14px"><div class="mu" style="font-size:12px">Video link</div><div class="row"><a class="ac" style="flex:1" href="#/watch/${id}">hellnoo.com/v/${id}</a><button class="ib" data-act="toast" data-msg="Link copied">${ic('copy')}</button></div><div class="mu" style="font-size:12px;margin-top:8px">File name</div><div style="font-size:13px">${id}-original.mp4 · 1080p</div></div></div><div class="card" style="margin-top:14px"><div class="fld"><label>Visibility</label><select class="inp"><option ${v.vis === 'Public' ? 'selected' : ''}>Public</option><option ${v.vis === 'Unlisted' ? 'selected' : ''}>Unlisted</option><option>Private</option><option ${v.vis === 'Scheduled' ? 'selected' : ''}>Scheduled</option></select></div>${v.vis === 'Scheduled' ? `<div class="two"><input class="inp" type="date" value="2026-11-20"><input class="inp" type="time" value="18:00"></div>` : ''}<div class="hint">Published ${v.days ? dateOf(v.days) : '—'}</div></div></div></div>`;
  return studio('studio/content', m);
});

/* ---------- Analytics ---------- */
const RANGE = () => window._rng || 28;
ACT.rng = el => { window._rng = +el.value; rerender(); };
ACT.met = el => { window._met = el.dataset.k; rerender(); };
route(/^studio\/analytics$/, () => {
  CUR.title = 'Analytics'; const n = RANGE(), s = H.series, met = window._met || 'views';
  const cut = a => a.slice(-n), prev = a => a.slice(-2 * n, -n);
  const pct = (a, b) => Math.round((a / b - 1) * 100);
  const dCtr = (V, I) => V.map((x, i) => I[i] ? x / I[i] * 100 : 0), dAvd = (V, W) => V.map((x, i) => x ? W[i] * 3600 / x : 0);
  const ctrOf = f => sum(f(s.views)) / sum(f(s.impr)) * 100, avdOf = f => sum(f(s.watch)) * 3600 / sum(f(s.views));
  const M = {
    views: { l: 'Views', v: full(sum(cut(s.views))), d: pct(sum(cut(s.views)), sum(prev(s.views))), cur: cut(s.views), old: prev(s.views) },
    watch: { l: 'Watch time (hours)', v: full(Math.round(sum(cut(s.watch)))), d: pct(sum(cut(s.watch)), sum(prev(s.watch))), cur: cut(s.watch), old: prev(s.watch), fmt: x => x.toFixed(0) },
    subs: { l: 'Subscribers', v: '+' + full(sum(cut(s.subs))), d: pct(sum(cut(s.subs)), sum(prev(s.subs))), cur: cut(s.subs), old: prev(s.subs) },
    impr: { l: 'Impressions', v: full(sum(cut(s.impr))), d: pct(sum(cut(s.impr)), sum(prev(s.impr))), cur: cut(s.impr), old: prev(s.impr) },
    ctr: { l: 'Impressions click-through rate', v: ctrOf(cut).toFixed(1) + '%', d: pct(ctrOf(cut), ctrOf(prev)), cur: dCtr(cut(s.views), cut(s.impr)), old: dCtr(prev(s.views), prev(s.impr)), fmt: x => x.toFixed(1) + '%', sub: 'How often people clicked after seeing a thumbnail' },
    avd: { l: 'Average view duration', v: mmss(avdOf(cut)), d: pct(avdOf(cut), avdOf(prev)), cur: dAvd(cut(s.views), cut(s.watch)), old: dAvd(prev(s.views), prev(s.watch)), fmt: mmss, sub: 'Average time spent per view' }
  };
  const card = k => { const o = M[k]; return `<div class="kpi click ${met === k ? 'sel' : ''}" data-act="met" data-k="${k}" title="Show ${o.l.toLowerCase()} by day"><div class="k">${o.l}</div><div class="v">${o.v}</div><div class="d ${o.d >= 0 ? 'grn' : 'red'}">${o.d >= 0 ? '▲' : '▼'} ${Math.abs(o.d)}% vs previous ${n} days</div>${o.sub ? `<div class="d mu">${o.sub}</div>` : ''}</div>`; };
  const cm = M[met] || M.views;
  const pv = v => sum(v.daily.slice(-n));
  const tv = MYV().filter(v => v.daily && pv(v)).sort((a, b) => pv(b) - pv(a));
  const top = tv.map(v => { const p = pv(v), wt = sum(v.dWatch.slice(-n)), im = sum(v.dImpr.slice(-n)); return `<tr class="cl" data-act="go" data-to="#/studio/analytics/${v.id}"><td><div class="row"><div style="width:90px;flex:none">${thumb(v, { noage: 1 })}</div><span style="font-weight:600">${esc(v.title)}</span></div></td><td class="num">${full(p)}</td><td class="num">${(p / sum(cut(s.views)) * 100).toFixed(1)}%</td><td class="num">${full(im)}</td><td class="num">${(p / im * 100).toFixed(1)}%</td><td class="num">${mmss(wt * 3600 / p)}</td><td class="num">${wt.toFixed(1)}</td></tr>`; }).join('');
  /* recent activity: last 24 hours / 7 days / 28 days */
  const rt = window._rt || '24h';
  const hrs = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const hl = h => (h % 12 || 12) + (h < 12 ? ' am' : ' pm');
  let bars, ticks, rtv, tip;
  if (rt === '24h') {
    bars = hrs.map(h => sum(MYV().filter(v => v.hourly).map(v => v.hourly[h])));
    ticks = [[0, hl(12)], [6, hl(18)], [12, hl(0)], [18, hl(6)], [23, 'Now']]; tip = (i, x) => hl(hrs[i]) + ': ' + x + ' views';
    rtv = v => v.hourly ? sum(v.hourly) : 0;
  } else {
    const d = rt === '7d' ? 7 : 28; bars = s.views.slice(-d);
    const lab = i => { const t = H.dayDate(90 - d + i); return t.getDate() + ' ' + t.toLocaleString('en', { month: 'short' }); };
    ticks = (d === 7 ? [0, 1, 2, 3, 4, 5, 6] : [0, 7, 14, 21, 27]).map(i => [i, i === d - 1 ? 'Today' : lab(i)]); tip = (i, x) => lab(i) + ': ' + full(x) + ' views';
    rtv = v => v.daily ? sum(v.daily.slice(-d)) : 0;
  }
  const rtTop = MYV().filter(v => rtv(v)).sort((a, b) => rtv(b) - rtv(a)).slice(0, 5), rtMax = rtTop.length ? rtv(rtTop[0]) : 1;
  const recent = `<div class="card" style="margin-top:16px"><div class="row wrap" style="margin-bottom:12px"><h2 style="margin:0">Recent activity</h2><div class="sp"></div><div class="chips">${[['24h', 'Last 24 hours'], ['7d', 'Last 7 days'], ['28d', 'Last 28 days']].map(([k, l]) => `<button class="chip ${rt === k ? 'on' : ''}" data-act="rtsel" data-k="${k}">${l}</button>`).join('')}</div></div>
  <div class="rtgrid"><div><div class="mu" style="font-size:13px">Views · ${({ '24h': 'last 24 hours', '7d': 'last 7 days', '28d': 'last 28 days' })[rt]}</div><div style="font-size:30px;font-weight:800">${full(sum(bars))}</div><div style="margin-top:8px">${barChart(bars, { h: 130, ticks, tip })}</div><div class="hint">${rt === '24h' ? 'By hour, up to now (IST).' : 'By day. The last bar is today so far.'}</div></div>
  <div><div class="mu" style="font-size:13px;margin-bottom:8px">Top videos in this period</div>${rtTop.map(v => `<div class="row cl" data-act="go" data-to="#/studio/analytics/${v.id}" style="padding:7px 0;border-bottom:1px solid var(--line);align-items:center;cursor:pointer"><div style="width:72px;flex:none">${thumb(v, { noage: 1 })}</div><div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(v.title)}</div><div class="bar" style="height:5px;margin-top:6px"><i style="width:${rtv(v) / rtMax * 100}%"></i></div></div><b style="font-size:13px;font-variant-numeric:tabular-nums">${full(rtv(v))}</b></div>`).join('') || '<div class="mu">No views yet.</div>'}</div></div></div>`;
  const m = `<div class="ph"><div><h1>Channel analytics</h1><div class="mu">Your channel got ${full(sum(cut(s.views)))} views in the last ${n} days</div></div><div class="sp"></div><select class="inp" style="width:180px" onchange="ACT.rng(this)">${[7, 28, 90].map(d => `<option value="${d}" ${n === d ? 'selected' : ''}>Last ${d} days</option>`).join('')}</select></div>
  <div class="kpis" style="margin-bottom:14px">${['views', 'watch', 'subs', 'impr'].map(card).join('')}</div>
  <div class="card"><h3>${cm.l} by day</h3>${lineChart(cm.cur, { labels: dayLabels(n), compare: cm.old, fmt: cm.fmt })}<div class="row mu" style="font-size:12px;margin-top:6px"><span style="width:18px;height:3px;background:var(--ac)"></span>Last ${n} days <span style="width:18px;border-top:2px dashed #6b7383;margin-left:10px"></span>Previous ${n} days</div></div>
  <div class="two" style="margin-top:16px">${card('ctr')}${card('avd')}</div>
  ${recent}
  <div class="ph" style="margin-top:24px"><h2 style="margin:0">Videos in the last ${n} days</h2></div><div class="tbw"><table class="tb"><tr><th>Video</th><th class="num">Views</th><th class="num">Share</th><th class="num">Impressions</th><th class="num">CTR</th><th class="num">Avg. view duration</th><th class="num">Watch time (h)</th></tr>${top}<tr><td><b>Total</b></td><td class="num"><b>${full(sum(cut(s.views)))}</b></td><td class="num">100%</td><td class="num">${full(sum(cut(s.impr)))}</td><td class="num">${M.ctr.v}</td><td class="num">${M.avd.v}</td><td class="num">${sum(cut(s.watch)).toFixed(1)}</td></tr></table></div>
  <div class="note" style="margin-top:16px">Hellnoo counts these numbers with its own tracking, so the same figures appear here, on the admin tool, and in Earnings.</div>`;
  return studio('studio/analytics', m);
});
ACT.rtsel = el => { window._rt = el.dataset.k; rerender(); };
ACT.vmet = el => { window._vmet = el.dataset.k; rerender(); };
ACT.lcsel = el => { window._lc = el.dataset.k; rerender(); };
route(/^studio\/analytics\/(\w+)$/, id => {
  const v = VID(id); if (!v || v.ch !== 'av') return studio('studio/analytics', '<div class="empty">Video not found.</div>');
  CUR.title = 'Video analytics';
  if (!v.daily) return studio('studio/analytics', `<div class="ph"><a class="btn ghost" href="#/studio/analytics">${ic('back')}Channel analytics</a></div><div class="empty">${ic('chart')}<h2 style="margin-top:12px">${esc(v.title)}</h2><p>${v.vis === 'Scheduled' ? 'Analytics start when this video goes public on ' + v.sched + '.' : 'Analytics start when this draft is published.'}</p><a class="btn pri" href="#/studio/video/${id}">Edit details</a></div>`);
  const from = Math.max(0, v.pub), sl = a => a.slice(from), met = window._vmet || 'views', lc = window._lc || 'likes';
  const V = sl(v.daily), I = sl(v.dImpr), W = sl(v.dWatch);
  const D = {
    views: { l: 'Views', t: 'Views by day', v: full(v.views), data: V, inWin: sum(V), tot: v.views, unit: 'views' },
    impr: { l: 'Impressions', t: 'Impressions by day', v: full(impr(v)), data: I, inWin: sum(I), tot: impr(v), unit: 'impressions' },
    ctr: { l: 'Click-through rate', t: 'Click-through rate by day', v: ctr(v), data: V.map((x, i) => I[i] ? x / I[i] * 100 : 0), fmt: x => x.toFixed(1) + '%' },
    avd: { l: 'Average view duration', t: 'Average view duration by day', v: avd(v), data: V.map((x, i) => x ? W[i] * 3600 / x : 0), fmt: mmss },
    watch: { l: 'Watch time (hours)', t: 'Watch time by day (hours)', v: full(Math.round(v.watchH)), data: W, fmt: x => x.toFixed(1), inWin: sum(W), tot: v.watchH, unit: 'hours', dec: 1 },
    likes: { l: 'Likes · comments', t: lc === 'likes' ? 'Likes by day' : 'Comments by day', v: full(v.likes) + ' · ' + v.comments, data: sl(lc === 'likes' ? v.dLikes : v.dComments), inWin: sum(sl(lc === 'likes' ? v.dLikes : v.dComments)), tot: lc === 'likes' ? v.likes : v.comments, unit: lc }
  };
  const cm = D[met] || D.views;
  const lbl = from > 0 ? ['Published', '', '', '', 'Today'] : dayLabels(90);
  const before = cm.tot != null ? cm.tot - cm.inWin : 0;
  const chartData = cm.data.length > 1 ? cm.data : [0].concat(cm.data);
  const er = ['sep', 'oct', 'nov'].map(k => [k, vidEarn(k)[id]]).filter(([, e]) => e);
  const mname = { sep: 'September', oct: 'October', nov: 'November so far' };
  const earn = er.length ? er.map(([k, e]) => `<div class="row" style="padding:6px 0;border-bottom:1px solid var(--line)"><span style="flex:1">${mname[k]}<div class="mu2" style="font-size:12px">${full(e.counted)} counted views × ₹${(k === 'nov' ? H.fund.rate : LM(k).rate).toFixed(2)} per 1,000${k === 'nov' ? ' (estimate)' : ''}</div></span><b class="${k === 'nov' ? 'mu' : 'ac'}">${inr(e.earned)}</b></div>`).join('') : '<p class="mu">No counted views yet.</p>';
  const kpi = k => `<div class="kpi click ${met === k ? 'sel' : ''}" data-act="vmet" data-k="${k}" title="Show ${D[k].t.toLowerCase()}"><div class="k">${D[k].l}${k === 'views' ? ' (all time)' : ''}</div><div class="v">${D[k].v}</div></div>`;
  const hrs = v.hourly || null;
  const m = `<div class="ph"><a class="btn ghost" href="#/studio/analytics">${ic('back')}Channel analytics</a><div class="sp"></div></div><div class="row wrap" style="margin-bottom:18px;align-items:flex-start"><div style="width:220px;flex:none">${thumb(v, { noage: 1 })}</div><div style="min-width:0"><h1>${esc(v.title)}</h1><div class="mu">Published ${dateOf(v.days)} · ${v.len} long · ${v.vis}</div><div class="row" style="margin-top:10px"><a class="btn sm" href="#/studio/video/${id}">${ic('edit', 'sm')}Edit details</a><a class="btn sm" href="#/watch/${id}">${ic('ext', 'sm')}Watch</a></div></div></div>
  <div class="kpis" style="margin-bottom:14px">${['views', 'impr', 'ctr', 'avd', 'watch', 'likes'].map(kpi).join('')}</div>
  <div class="card"><div class="row wrap" style="margin-bottom:8px"><h3 style="margin:0">${cm.t}${from > 0 ? ' since publishing' : ' · last 90 days'}</h3><div class="sp"></div>${met === 'likes' ? `<div class="chips"><button class="chip ${lc === 'likes' ? 'on' : ''}" data-act="lcsel" data-k="likes">Likes</button><button class="chip ${lc === 'comments' ? 'on' : ''}" data-act="lcsel" data-k="comments">Comments</button></div>` : ''}</div>${lineChart(chartData, { labels: lbl, fmt: cm.fmt })}<div class="hint" style="margin-top:4px">${met === 'ctr' || met === 'avd' ? 'Daily value. The card shows the figure for the whole life of the video.' : `Daily numbers add up to ${cm.dec ? cm.inWin.toFixed(1) : full(cm.inWin)} ${cm.unit}${before > 0.05 ? `; the other ${cm.dec ? before.toFixed(1) : full(Math.round(before))} came before this 90-day window` : ''}.`}</div></div>
  <div class="two" style="margin-top:16px"><div class="card"><h3>Views in the last 24 hours</h3>${hrs ? barChart([12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(h => hrs[h]), { h: 100, ticks: [[0, '12 pm'], [12, '12 am'], [23, 'Now']] }) : ''}<div class="hint">${full(hrs ? sum(hrs) : 0)} views by hour (IST).</div></div><div class="card"><h3>Earnings from this video</h3>${earn}<div class="hint" style="margin-top:8px">Counted views leave out repeat views from the same person within 24 hours, very short views and suspicious traffic. October matches Earnings → “October by video”.</div></div></div>`;
  return studio('studio/analytics', m);
});

/* ---------- Comments ---------- */
route(/^studio\/comments(?:\/(\w+))?$/, f => {
  CUR.title = 'Comments'; f = f || 'pub';
  const list = (f === 'held' ? [['Spam Bot', 'win.prize.now', 'Get 10K subscribers free 👉 bit.ly/…', 0, 0]] : H.commentPool).map(([n, h, t, l], i) => `<div class="row" data-crow style="align-items:flex-start;padding:14px 0;border-bottom:1px solid var(--line)"><span class="av r" style="background:hsl(${i * 67},55%,65%)">${n[0]}</span><div style="flex:1" data-cbody><div style="font-size:13px"><b>@${h}</b> <span class="mu2">· ${[2, 5, 9, 14, 20][i]} hours ago</span></div><div style="margin:3px 0 6px">${esc(t)}</div><div class="row" style="gap:4px"><button class="btn ghost sm" data-act="reply">Reply</button><button class="ib" data-act="clike">${ic('like', 'sm')}</button><span class="mu" style="font-size:12px">${l}</span><button class="ib" data-act="toast" data-msg="Hearted. The viewer gets a notification.">${ic('heart', 'sm')}</button><button class="ib" data-act="cm3" data-what="${esc(t)}">${ic('dots', 'sm')}</button>${f === 'held' ? '<button class="btn sm" data-act="rmrow" data-msg="Approved and published">Approve</button><button class="btn sm dan" data-act="rmrow" data-msg="Removed">Remove</button>' : ''}</div></div><div style="width:200px" class="hide-m"><div style="width:120px;margin-left:auto">${thumb(VID('a1'), { noage: 1 })}</div><div class="mu" style="font-size:12px;text-align:right;margin-top:4px">Gulmarg first snowfall…</div></div></div>`).join('');
  const m = `<div class="ph"><h1>Comments</h1></div><div class="ctabs"><a href="#/studio/comments" class="${f === 'pub' ? 'on' : ''}">Published</a><a href="#/studio/comments/held" class="${f === 'held' ? 'on' : ''}">Held for review (1)</a></div><div class="chips" style="margin-bottom:8px"><button class="chip on">All</button><button class="chip" data-act="toast" data-msg="Showing comments you haven’t replied to">Not replied</button><button class="chip" data-act="toast" data-msg="Showing questions">Contains a question</button></div>${list}`;
  return studio('studio/comments', m);
});
ACT.rmrow = el => { const r = el.closest('[data-crow]'); if (r) r.remove(); toast(el.dataset.msg); if (!document.querySelector('[data-crow]')) $('.main').insertAdjacentHTML('beforeend', `<div class="empty">${ic('check')}<h2 style="margin-top:12px">Nothing held for review</h2></div>`); };
ACT.cm3 = el => menu(el, [{ i: 'pinI', l: 'Pin', f: () => toast('Pinned to the top') }, { i: 'ban', l: 'Hide user from channel', f: () => toast('This user’s comments are now hidden') }, { i: 'trash', l: 'Remove', f: () => toast('Comment removed') }, { i: 'flag', l: 'Report', f: () => ACT.report(null, 'comment', el.dataset.what) }]);

/* ---------- Earnings ---------- */
route(/^studio\/earnings$/, () => {
  CUR.title = 'Earnings';
  const L = LED(), nov = L[0], oct = LM('oct'), sep = LM('sep'), carried = nov.carryIn, tot = Math.round((carried + nov.est) * 100) / 100, pc = pubCount();
  const elig = [['100 subscribers', full(ME.subs), ME.subs >= 100], ['10 public videos', pc + ' public' + (MYV().some(v => v.vis === 'Unlisted') ? ' (unlisted don’t count)' : ''), pc >= 10], ['Account at least 30 days old', 'Since 2 Jan 2026', 1], ['1,000 counted views in a month', full(oct.counted) + ' in Oct', oct.counted >= 1000]];
  const allOk = elig.every(e => e[2]);
  const pill = s => ({ Counting: '<span class="pill a">Counting</span>', 'Carried forward': '<span class="pill y">Carried forward</span>', 'Not eligible yet': '<span class="pill">Not eligible yet</span>', Paid: '<span class="pill g">Paid</span>' })[s] || `<span class="pill">${s}</span>`;
  const rows = L.map(e => `<tr><td><b>${e.month}</b></td><td class="num">${e.counted != null ? full(e.counted) : '—'}</td><td class="num">${e.rate ? '₹' + e.rate.toFixed(2) : e.k === 'nov' ? '≈ ₹' + H.fund.rate.toFixed(2) : '—'}</td><td class="num">${e.k === 'nov' ? '<span class="mu">≈ ' + inr(e.est) + '</span>' : e.counted != null ? inr(e.amount) : '—'}</td><td class="num">${e.carryIn ? inr(e.carryIn) : '—'}</td><td class="num">${e.k === 'nov' ? '<span class="mu">≈ ' + inr(tot) + '</span>' : e.counted != null ? '<b>' + inr(e.balance) + '</b>' : '—'}</td><td>${pill(e.status)}</td><td class="mu" style="font-size:12px">${e.note}</td></tr>`).join('');
  const ve = vidEarn('oct');
  const vrows = MYV().filter(v => ve[v.id]).sort((a, b) => ve[b.id].counted - ve[a.id].counted).map(v => `<tr class="cl" data-act="go" data-to="#/studio/analytics/${v.id}"><td>${esc(v.title)}${v.vis !== 'Public' ? ` <span class="pill" style="height:18px">${v.vis}</span>` : ''}</td><td class="num">${full(ve[v.id].counted)}</td><td class="num">${inr(ve[v.id].earned)}</td></tr>`).join('');
  const m = `<div class="ph"><div><h1>Earnings</h1><div class="mu">Paid from the Hellnoo Creator Fund. Money is sent to your bank or UPI, never through PayPal or Payoneer.</div></div><div class="sp"></div><a class="btn" href="#/studio/payout">${ic('lock')}Payout details</a></div>
  <div class="kpis" style="margin-bottom:16px"><div class="kpi"><div class="k">November so far (estimate)</div><div class="v">${inr(nov.est)}</div><div class="d mu">${full(nov.counted)} counted views × about ₹${H.fund.rate.toFixed(2)} per 1,000</div></div><div class="kpi"><div class="k">Carried forward</div><div class="v">${inr(carried)}</div><div class="d mu">Sep ${inr(sep.amount)} + Oct ${inr(oct.amount)}, together below ₹500</div></div><div class="kpi"><div class="k">Next payout</div><div class="v">${tot >= 500 ? '15–20 Dec' : 'Not yet'}</div><div class="d ${tot >= 500 ? 'grn' : 'mu'}">${tot >= 500 ? `Carried + November ≈ ${inr(tot)} · above ₹500 ✓` : `≈ ${inr(tot)} of ₹500`}</div></div><div class="kpi"><div class="k">Paid to you so far</div><div class="v">₹0</div><div class="d mu">First payment due in December</div></div></div>
  <div class="two" style="margin-bottom:16px"><div class="card"><h2>How your pay is worked out</h2><p style="margin-top:0">Each month Hellnoo sets a fund. Your share depends on your <b>counted views</b>.</p><ol style="padding-left:18px;color:var(--mu);font-size:13.5px;line-height:1.7"><li>Counted views leave out repeats, very short views and fake traffic.</li><li>Rate per 1,000 views = the lower of <b>₹${H.fund.R}</b> or <i>fund × 1,000 ÷ all counted views on Hellnoo</i>.</li><li>October: ₹${full(H.fund.B)} × 1,000 ÷ ${full(H.fund.Q)} views → <b>₹${H.fund.rate.toFixed(2)}</b> per 1,000.</li><li>Below ₹500? It carries to the next month. Nothing is lost.</li><li>Month is locked by the 7th and paid between the 15th and 20th.</li></ol></div><div class="card"><h2>Eligibility</h2>${elig.map(([k, v, ok]) => `<div class="row" style="padding:8px 0;border-bottom:1px solid var(--line)"><span class="${ok ? 'grn' : 'yel'}">${ic(ok ? 'check' : 'clock')}</span><span style="flex:1">${k}</span><span class="mu" style="font-size:13px">${v}</span></div>`).join('')}${allOk ? `<div class="hint" style="margin-top:12px">All four met. If public videos drop below 10, earnings pause until you are back above it.</div>` : `<div class="note" style="margin-top:12px">Earnings are paused until every bar above is met.</div>`}</div></div>
  <h2>Monthly statements</h2><div class="tbw" style="margin-bottom:20px"><table class="tb"><tr><th>Month</th><th class="num">Counted views</th><th class="num">Rate / 1,000</th><th class="num">Earned</th><th class="num">Carried in</th><th class="num">Balance</th><th>Status</th><th>Note</th></tr>${rows}</table></div>
  <h2>October by video</h2><div class="tbw"><table class="tb"><tr><th>Video</th><th class="num">Counted views</th><th class="num">Earned</th></tr>${vrows}<tr><td><b>Total October</b></td><td class="num"><b>${full(oct.counted)}</b></td><td class="num"><b>${inr(oct.amount)}</b></td></tr></table></div>`;
  return studio('studio/earnings', m);
});

/* ---------- Payout details ---------- */
route(/^studio\/payout$/, () => {
  CUR.title = 'Payout details'; const mth = window._pm || 'upi';
  const m = `<div class="ph"><div><h1>Payout details</h1><div class="mu">Where Hellnoo sends your earnings. Only you and the payments team can see this.</div></div></div>
  <div class="wp" style="grid-template-columns:minmax(0,1fr) 340px"><div class="card"><h2>Payment method</h2><div class="row" style="margin-bottom:16px">${[['upi', 'UPI'], ['bank', 'Bank account (IMPS/NEFT)']].map(([k, l]) => `<label class="chk" style="padding:10px 14px;border:1px solid ${mth === k ? 'var(--ac)' : 'var(--line)'};border-radius:10px;cursor:pointer" data-act="pm" data-k="${k}"><input type="radio" ${mth === k ? 'checked' : ''}>${l}</label>`).join('')}</div>
  <div class="fld"><label>Full name (as on bank account)</label><input class="inp" value="Aamir Wani"></div>
  ${mth === 'upi' ? `<div class="fld"><label>UPI ID</label><input class="inp" value="aamirwani@okaxis"><span class="ok">✓ Verified · name matches: AAMIR WANI</span></div>` : `<div class="fld"><label>Account number</label><input class="inp" placeholder="Enter account number"></div><div class="fld"><label>Re-enter account number</label><input class="inp"></div><div class="fld"><label>IFSC</label><input class="inp" placeholder="e.g. JAKA0BANDIP"><span class="hint">Bank and branch will show here after you type the IFSC</span></div>`}
  <div class="fld"><label>PAN</label><input class="inp" placeholder="ABCDE1234F"><span class="hint">Needed for TDS. Without PAN, tax is cut at a higher rate.</span></div>
  <label class="chk" style="margin-bottom:16px"><input type="checkbox" checked>I confirm these details are mine and correct.</label><button class="btn pri" data-act="toast" data-msg="Saved. We’ll send ₹1 to check the account.">Save payout details</button></div>
  <div class="col" style="gap:16px"><div class="card"><h3>${ic('shield')} Your safety</h3><p class="mu" style="font-size:13px;margin:0">Hellnoo will <b>never</b> ask for your PayPal, Payoneer, bank or UPI password or PIN. If someone asks, report it.</p></div><div class="card"><h3>Payment history</h3><div class="empty" style="padding:20px">No payments yet.<br><span class="hint">Your first payment is due 15–20 Dec 2026.</span></div></div></div></div>`;
  return studio('studio/payout', m);
});
ACT.pm = el => { window._pm = el.dataset.k; rerender(); };

/* ---------- Customize channel ---------- */
route(/^studio\/customize$/, () => {
  CUR.title = 'Customize channel';
  const m = `<div class="ph"><div><h1>Customize channel</h1></div><div class="sp"></div><a class="btn" href="#/@${ME.handle}">${ic('ext')}View channel</a><button class="btn ghost" data-act="toast" data-msg="Changes cancelled">Cancel</button><button class="btn pri" data-act="toast" data-msg="Published. Your channel is updated.">Publish</button></div>
  <div class="card" style="max-width:820px"><h2>Banner</h2><div class="row" style="align-items:flex-start;gap:18px;margin-bottom:22px"><div class="${ME.banner}" style="width:300px;height:76px;border-radius:10px;flex:none"></div><div class="mu" style="font-size:13px">Shown at the top of your channel. 2048 × 512 px or bigger, up to 6 MB.<div class="row" style="margin-top:10px"><button class="btn sm" data-act="toast" data-msg="Pick an image">Change</button><button class="btn sm ghost" data-act="toast" data-msg="Banner removed">Remove</button></div></div></div>
  <h2>Logo</h2><div class="row" style="align-items:flex-start;gap:18px;margin-bottom:22px"><span class="av xl" style="background:${ME.color}">${ME.logo}</span><div class="mu" style="font-size:13px">Square image, at least 256 × 256 px. Shown square everywhere on Hellnoo.<div class="row" style="margin-top:10px"><button class="btn sm" data-act="toast" data-msg="Pick an image">Change</button></div></div></div>
  <h2>Basic info</h2><div class="fld"><label>Name</label><input class="inp" value="${esc(ME.name)}"></div><div class="fld"><label>Username</label><div class="row" style="gap:0"><span class="inp" style="width:auto;display:grid;place-items:center;border-radius:10px 0 0 10px;border-right:0;color:var(--mu)">@</span><input class="inp" value="${ME.handle}" style="border-radius:0 10px 10px 0" id="cuu"></div><span class="hint" id="cuuh">hellnoo.com/@${ME.handle} · You can change your username once every 30 days.</span></div><div class="fld"><label>Description</label><textarea class="inp">${esc(ME.desc)}</textarea></div><div class="fld"><label>Links</label><div class="col"><div class="row"><input class="inp" value="Instagram" style="width:160px"><input class="inp" value="instagram.com/aamirvlogs"></div><button class="btn sm" style="width:max-content" data-act="toast" data-msg="Link added">${ic('plus', 'sm')}Add link</button></div></div><div class="fld"><label>Contact email (shown on About)</label><input class="inp" placeholder="For business enquiries"></div></div>`;
  CUR.after = () => { const u = $('#cuu'); if (u) u.addEventListener('input', () => { u.value = u.value.toLowerCase(); const [k, msg] = u.value === ME.handle ? ['hint', 'This is your current username'] : checkUser(u.value); const h = $('#cuuh'); h.className = k || 'hint'; h.textContent = msg; }); };
  return studio('studio/customize', m);
});
