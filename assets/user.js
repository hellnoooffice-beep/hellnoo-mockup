/* Hellnoo mockup — viewer pages */
const libGate = (k, title, icon, text) => `<div class="empty">${ic(icon)}<h2 style="margin-top:12px">${title}</h2><p>${text}</p><button class="btn pri" data-act="signin">Sign in</button></div>`;
const cw = () => S.history.map(VID).filter(canSee).slice(0, 4);

/* Home / Trending / Latest */
route(/^home$/, () => {
  CUR.title = 'Home';
  const seen = signedIn() ? cw().map(v => v.id) : [];
  const all = PUB().filter(v => v.ch !== 'av' && !seen.includes(v.id));
  let m = '';
  if (signedIn() && cw().length) m += `<section class="sec"><div class="sec-h"><h2>Continue watching</h2><div class="sp"></div><a class="btn ghost sm" href="#/history">See all</a></div><div class="grid">${cw().map((v, i) => card(v, { prog: [62, 30, 85, 15][i] })).join('')}</div></section>`;
  m += `<section class="sec">${seen.length ? '<div class="sec-h"><h2>For you</h2></div>' : ''}<div class="grid">${all.map(v => card(v)).join('')}</div></section>`;
  return shell('home', 'all', m);
});
route(/^trending$/, () => {
  CUR.title = 'Trending';
  const list = PUB().filter(v => v.days <= 31).sort((a, b) => b.views / (b.days + 2) - a.views / (a.days + 2)).slice(0, 12);
  return shell('', 'trending', `<div class="ph"><div><h1>Trending</h1><div class="mu">Most watched on Hellnoo over the last few days. Updated every hour.</div></div></div>${list.map((v, i) => hrow(v, { rank: i + 1 })).join('')}`);
});
route(/^latest$/, () => {
  CUR.title = 'Latest';
  const list = PUB().slice().sort((a, b) => a.days - b.days);
  const grp = [['Today', v => v.days < 1], ['This week', v => v.days >= 1 && v.days < 7], ['This month', v => v.days >= 7 && v.days < 31], ['Older', v => v.days >= 31]];
  return shell('', 'latest', `<div class="ph"><div><h1>Latest</h1><div class="mu">Newest uploads from every channel, newest first.</div></div></div>` + grp.map(([n, f]) => { const vs = list.filter(f); return vs.length ? `<section class="sec"><div class="sec-h"><h2>${n}</h2></div><div class="grid">${vs.map(v => card(v)).join('')}</div></section>` : ''; }).join(''));
});

/* Subscriptions */
route(/^subs$/, () => {
  CUR.title = 'Subscriptions';
  if (!signedIn()) return shell('subs', '', libGate('subs', 'Don’t miss new videos', 'subs', 'Sign in to see the latest uploads from channels you subscribe to.'));
  const chs = S.subs.map(CH).filter(Boolean);
  if (!chs.length) return shell('subs', '', `<div class="empty"><h2>No subscriptions yet</h2><p>Subscribe to channels and their new videos will show up here.</p><a class="btn pri" href="#/home">Explore videos</a></div>`);
  const vs = PUB().filter(v => S.subs.includes(v.ch)).sort((a, b) => a.days - b.days);
  const strip = `<div class="row" style="gap:18px;overflow-x:auto;padding-bottom:6px;margin-bottom:22px">${chs.map(c => `<a href="#/@${c.handle}" class="col" style="align-items:center;gap:6px;width:84px;flex:none;font-size:12px;text-align:center">${`<span class="av lg" style="background:${c.color}">${c.logo}</span>`}<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%">${esc(c.name)}</span></a>`).join('')}<button class="btn sm" data-act="manage" style="flex:none">Manage</button></div>`;
  const grp = [['Today', v => v.days < 1], ['This week', v => v.days >= 1 && v.days < 7], ['This month', v => v.days >= 7 && v.days < 31], ['Older', v => v.days >= 31]];
  return shell('subs', '', strip + grp.map(([n, f]) => { const g = vs.filter(f); return g.length ? `<section class="sec"><div class="sec-h"><h2>${n}</h2></div><div class="grid">${g.map(v => card(v)).join('')}</div></section>` : ''; }).join(''));
});
ACT.manage = () => {
  modal('Manage subscriptions', S.subs.map(CH).filter(Boolean).map(c => `<div class="row" style="padding:8px 0"><span class="av" style="background:${c.color}">${c.logo}</span><div style="flex:1"><b>${esc(c.name)}</b><div class="mu" style="font-size:12px">@${c.handle} · ${num(c.subs)} subscribers</div></div><button class="btn sm" data-act="unsubm" data-id="${c.id}">Unsubscribe</button></div>`).join('') || '<p class="mu">No subscriptions.</p>');
};
ACT.unsubm = el => { toggle(S.subs, el.dataset.id); toast('Unsubscribed from ' + CH(el.dataset.id).name); ACT.manage(); };

/* History */
route(/^history$/, () => {
  CUR.title = 'History';
  if (!signedIn()) return shell('history', '', libGate('history', 'Keep track of what you watch', 'hist', 'Watch history isn’t viewable when signed out.'));
  const vs = S.history.map(VID).filter(canSee);
  const groups = [['Today', vs.slice(0, 2)], ['Yesterday', vs.slice(2, 4)], ['Earlier this week', vs.slice(4)]];
  const list = vs.length ? groups.map(([n, g]) => g.length ? `<h3 style="margin:18px 0 6px">${n}</h3>` + g.map(v => hrow(v, { remove: 'rmhist', prog: 40 })).join('') : '').join('') : `<div class="empty">Your history is empty.</div>`;
  const side = `<div class="card" style="position:sticky;top:80px"><div class="row" style="border-bottom:1px solid var(--line);padding-bottom:10px;margin-bottom:12px">${ic('search')}<input class="inp" style="border:0;background:none;height:30px;padding:0" placeholder="Search watch history"></div><button class="btn ghost" style="width:100%" data-act="clearhist">${ic('trash')}Clear all watch history</button><div class="row" style="padding:8px 16px"><span style="flex:1;font-weight:600">${ic('pause')} Pause watch history</span><button class="tog ${S.pauseHistory ? 'on' : ''}" data-act="pausehist"></button></div><button class="btn ghost" style="width:100%" data-act="go" data-to="#/settings">${ic('gear')}Manage all history</button></div>`;
  return shell('history', '', `<div class="ph"><h1>Watch history</h1></div><div style="display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:24px" class="hgrid"><div>${list}</div><div class="hide-m">${side}</div></div>`);
});
ACT.clearhist = () => modal('Clear watch history?', '<p class="mu" style="margin:0">Your Hellnoo watch history will be cleared from all devices. Recommendations will start fresh.</p>', '<button class="btn ghost" data-act="close">Cancel</button><button class="btn dan" data-act="doclearhist">Clear watch history</button>');
ACT.doclearhist = () => { S.history = []; save(); closeModal(); toast('Watch history cleared'); render(); };
ACT.pausehist = () => { S.pauseHistory = !S.pauseHistory; save(); toast(S.pauseHistory ? 'Watch history paused' : 'Watch history turned on'); rerender(); };

/* list pages: Watch later / Liked / playlist */
function listPage(o) {
  const vs = o.ids.map(VID).filter(canSee), first = vs[0];
  const head = `<div class="card ${first ? first.sc : ''}" style="position:sticky;top:80px;padding:0;overflow:hidden;background-image:linear-gradient(180deg,rgba(15,17,21,.2),rgba(22,25,32,1) 70%)"><div style="padding:18px">${first ? `<div style="border-radius:12px;overflow:hidden">${thumb(first, { noage: 1 })}</div>` : `<div class="th sc-night"></div>`}<h1 style="margin-top:16px">${esc(o.title)}</h1><div class="mu" style="font-size:13px">${o.owner || 'Aamir Wani'} · ${vs.length} videos${o.vis ? ` · ${ic(o.vis === 'Private' ? 'lock' : 'globe', 'sm')} ${o.vis}` : ''}</div><div class="row" style="margin-top:16px"><a class="btn pri" style="flex:1;justify-content:center" href="${first ? '#/watch/' + first.id : '#/home'}">${ic('play')}Play all</a><button class="btn" data-act="toast" data-msg="Shuffle play starts from a random video">Shuffle</button>${o.menu ? `<button class="ib" data-act="${o.menu}" data-id="${o.pid || ''}">${ic('dots')}</button>` : ''}</div></div></div>`;
  const rows = vs.length ? vs.map(v => hrow(v, { sm: 1, grip: o.grip, remove: o.remove })).join('') : `<div class="empty">${o.empty}</div>`;
  return `<div class="wp" style="grid-template-columns:340px minmax(0,1fr)"><div>${head}</div><div>${o.sort ? `<div class="chips" style="margin-bottom:10px"><button class="chip on">Date added</button><button class="chip" data-act="toast" data-msg="Sorted by most popular">Most popular</button></div>` : ''}${rows}</div></div>`;
}
route(/^later$/, () => { CUR.title = 'Watch later'; if (!signedIn()) return shell('later', '', libGate('later', 'Save videos for later', 'later', 'Sign in to keep a list of videos you want to watch.')); return shell('later', '', listPage({ title: 'Watch later', ids: S.later, vis: 'Private', grip: 1, remove: 'rmlater', sort: 1, empty: 'No videos yet. Use ⋮ on any video and pick “Save to Watch later”.' })); });
route(/^liked$/, () => { CUR.title = 'Liked videos'; if (!signedIn()) return shell('liked', '', libGate('liked', 'Videos you like', 'like', 'Sign in to see videos you liked.')); return shell('liked', '', listPage({ title: 'Liked videos', ids: S.liked, vis: 'Private', remove: 'rmliked', empty: 'Videos you like will show up here.' })); });
route(/^playlists$/, () => {
  CUR.title = 'Playlists';
  if (!signedIn()) return shell('playlists', '', libGate('playlists', 'Make your own playlists', 'list', 'Sign in to create and save playlists.'));
  const all = [{ id: 'later', name: 'Watch later', vis: 'Private', items: S.later }, { id: 'liked', name: 'Liked videos', vis: 'Private', items: S.liked }].concat(S.playlists);
  const pc = p => { const v = VID(p.items[0]); const href = p.id === 'later' ? '#/later' : p.id === 'liked' ? '#/liked' : '#/playlist/' + p.id; return `<div class="vc"><a href="${href}" class="th ${v ? v.sc : 'sc-night'}" style="box-shadow:6px -6px 0 -1px #2a2f3a,12px -12px 0 -2px #20242c;margin:12px 12px 0 0">${v ? `<span class="big">${v.big}</span>` : ''}<span class="vw">${ic('list', 'sm')} ${p.items.length} videos</span></a><div class="meta"><div style="flex:1"><a href="${href}" class="t">${esc(p.name)}</a><div class="c">${ic(p.vis === 'Private' ? 'lock' : 'globe', 'sm')} ${p.vis} · <a href="${href}">View full playlist</a></div></div></div></div>`; };
  return shell('playlists', '', `<div class="ph"><h1>Playlists</h1><div class="sp"></div><button class="btn pri" data-act="newplpage">${ic('plus')}New playlist</button></div><div class="grid">${all.map(pc).join('')}</div>`);
});
ACT.newplpage = () => modal('New playlist', `<div class="fld"><label>Title</label><input class="inp" id="npt" placeholder="e.g. Winter trip"></div><div class="fld"><label>Visibility</label><select class="inp" id="npv"><option>Private</option><option>Unlisted</option><option>Public</option></select></div>`, `<button class="btn ghost" data-act="close">Cancel</button><button class="btn pri" data-act="donewpl">Create</button>`);
ACT.donewpl = () => { const n = $('#npt').value.trim() || 'Untitled playlist'; S.playlists.push({ id: 'p' + Date.now(), name: n, vis: $('#npv').value, items: [] }); save(); closeModal(); toast('Playlist created'); render(); };
route(/^playlist\/(\w+)$/, id => {
  const p = S.playlists.find(x => x.id === id); if (!p) return shell('playlists', '', '<div class="empty">Playlist not found.</div>');
  CUR.title = p.name; return shell('playlists', '', listPage({ title: p.name, ids: p.items, vis: p.vis, grip: 1, menu: 'plmenu', pid: id, empty: 'This playlist is empty. Add videos with the ⋮ menu.' }));
});
ACT.plmenu = el => { const p = S.playlists.find(x => x.id === el.dataset.id); menu(el, [{ i: 'edit', l: 'Rename', f: () => { modal('Rename playlist', `<input class="inp" id="rnp" value="${esc(p.name)}">`, `<button class="btn pri" data-act="dornp" data-id="${p.id}">Save</button>`); } }, { i: 'lock', l: 'Change visibility (' + p.vis + ')', f: () => { p.vis = p.vis === 'Private' ? 'Public' : 'Private'; save(); toast('Now ' + p.vis); render(); } }, { i: 'share', l: 'Share', f: () => toast('Playlist link copied') }, '-', { i: 'trash', l: 'Delete playlist', f: () => { S.playlists = S.playlists.filter(x => x !== p); save(); toast('Playlist deleted'); go('#/playlists'); } }]); };
ACT.dornp = el => { S.playlists.find(x => x.id === el.dataset.id).name = $('#rnp').value; save(); closeModal(); render(); };

/* Watch page */
route(/^watch\/(\w+)$/, id => {
  const v = VID(id); if (!canSee(v)) return shell('', '', `<div class="empty">${ic('ban')}<h2 style="margin-top:12px">This video isn’t available</h2><p>It may have been removed or made private.</p><a class="btn pri" href="#/home">Go home</a></div>`);
  const ch = CH(v.ch); CUR.title = v.title;
  if (signedIn() && !S.pauseHistory && S.history[0] !== id) { S.history = [id].concat(S.history.filter(x => x !== id)).slice(0, 30); save(); }
  const liked = S.liked.includes(id), dis = S.disliked.includes(id), subd = S.subs.includes(ch.id), mine = ch.mine && hasCh();
  const player = `<div class="player ${v.sc}" id="pl"><span class="big" style="position:absolute;left:28px;bottom:80px;font-weight:900;font-size:clamp(22px,4vw,46px);text-transform:uppercase;color:#fff;text-shadow:0 3px 14px rgba(0,0,0,.6)">${v.big}</span><button class="ib" data-act="playtoggle" style="position:absolute;inset:0;margin:auto;width:76px;height:76px;border-radius:50%;background:rgba(0,0,0,.55);color:#fff">${ic('play')}</button><div class="ctl"><div class="sk"><i style="width:34%"></i><b style="left:calc(34% - 6px)"></b></div><div class="row" style="gap:4px;color:#fff"><button class="ib" data-act="playtoggle">${ic('play')}</button><button class="ib" data-act="toast" data-msg="Next video">${ic('next')}</button><button class="ib" data-act="toast" data-msg="Volume">${ic('vol')}</button><span style="font-size:13px">6:08 / ${v.len}</span><div class="sp"></div><button class="ib wide" data-act="autoplay" title="Autoplay next">${S.autoplay ? '<span class="pill a">Autoplay on</span>' : '<span class="pill">Autoplay off</span>'}</button><button class="ib" data-act="quality" title="Settings">${ic('gear')}</button><button class="ib" data-act="toast" data-msg="Theatre mode">${ic('video')}</button><button class="ib" data-act="fullscreen" title="Full screen (f)">${ic('full')}</button></div></div></div>`;
  const acts = `<div class="row wrap wacts" style="gap:8px"><div class="seg"><button class="${liked ? 'on' : ''}" data-act="like" data-id="${id}">${ic('like')}${num(v.likes + (liked ? 1 : 0))}</button><button class="${dis ? 'on' : ''}" data-act="dislike" data-id="${id}" title="Dislike">${ic('dislike')}</button></div><button class="btn" data-act="share" data-id="${id}">${ic('share')}Share</button><button class="btn" data-act="addpl" data-id="${id}">${ic('save')}Save</button><button class="ib" data-act="wmenu" data-id="${id}" style="background:var(--p2)">${ic('dots')}</button></div>`;
  const subBtn = mine ? `<a class="btn" href="#/studio/video/${id}">${ic('edit')}Edit video</a><a class="btn" href="#/studio/analytics/${id}">${ic('chart')}Analytics</a>` : `<button class="btn ${subd ? '' : 'pri'}" data-act="sub" data-id="${ch.id}">${subd ? ic('check') + 'Subscribed' : 'Subscribe'}</button>`;
  const info = `<div class="wtitle">${esc(v.title)}</div><div class="row wrap" style="gap:14px"><div class="row">${av(ch, 'lg')}<div><a href="#/@${ch.handle}" style="font-weight:700">${esc(ch.name)}</a><div class="mu" style="font-size:12px">${num(ch.subs)} subscribers</div></div>${subBtn}</div><div class="sp"></div>${acts}</div>`;
  /* description and comments start closed, so suggested videos come up sooner (on phones they sit right under the video) */
  const fold = `<div class="wfold"><button class="fbtn" data-act="fold" data-t="descBox"><span><b>${full(v.views)} views · ${ageLong(v.days)}</b><span class="mu"> · Description</span></span>${ic('next', 'sm')}</button><button class="fbtn" data-act="fold" data-t="cmBox"><span><b>Comments</b><span class="mu"> · ${full(v.comments)}</span></span>${ic('next', 'sm')}</button></div>`;
  const desc = `<div class="desc hide" id="descBox"><b>${full(v.views)} views · ${ageLong(v.days)}</b> <span class="ac">${v.tags.join(' ')}</span><div style="margin-top:6px">${esc(v.desc)}</div><p>📍 Filmed in Kashmir. Music licensed for this video.</p><p>Follow the channel for a new video every Friday.</p><div class="row" style="margin-top:12px">${av(ch)}<div><b>${esc(ch.name)}</b><div class="mu" style="font-size:12px">${num(ch.subs)} subscribers</div></div><a class="btn sm" href="#/@${ch.handle}" style="margin-left:auto">Videos</a><a class="btn sm" href="#/@${ch.handle}/about">About</a></div><button class="btn ghost sm" style="padding:0;margin-top:8px" data-act="fold" data-t="descBox">Hide description</button></div>`;
  const cms = H.commentPool.map(([n, h, t, l, r], i) => `<div class="cm"><span class="av r" style="background:hsl(${i * 67},55%,65%)">${n[0]}</span><div style="flex:1"><div class="n">@${h}<span>${[2, 5, 9, 14, 20][i]} hours ago</span></div><div style="margin-top:3px">${esc(t)}</div><div class="acts"><button class="ib" data-act="clike">${ic('like', 'sm')}</button>${l}<button class="ib" data-act="clike">${ic('dislike', 'sm')}</button><button class="btn ghost sm" data-act="reply">Reply</button>${mine ? `<button class="ib" data-act="toast" data-msg="Hearted">${ic('heart', 'sm')}</button>` : ''}</div>${r ? `<button class="btn ghost sm ac" style="padding:0 8px" data-act="toast" data-msg="Shows ${r} replies under this comment">▾ ${r} ${r > 1 ? 'replies' : 'reply'}</button>` : ''}</div><button class="ib" data-act="cmenu" data-what="${esc(t)}">${ic('dots')}</button></div>`).join('');
  const pinned = `<div class="cm"><span class="av" style="background:${ch.color}">${ch.logo}</span><div style="flex:1"><div class="pin">${ic('pinI', 'sm')} Pinned by ${esc(ch.name)}</div><div class="n">@${ch.handle} <span class="pill a" style="height:18px">Creator</span><span>1 day ago</span></div><div style="margin-top:3px">Thanks for watching! Next video: the Gulmarg gondola Phase 2 at sunrise. Tell me below what you want to see.</div><div class="acts"><button class="ib" data-act="clike">${ic('like', 'sm')}</button>112<button class="btn ghost sm" data-act="reply">Reply</button></div></div></div>`;
  const comments = `<div style="margin-top:18px" class="hide" id="cmBox"><div class="row"><h2 style="margin:0">${full(v.comments)} comments</h2><button class="btn ghost sm" data-act="csort">${ic('filter', 'sm')}Sort by</button><div class="sp"></div><button class="btn ghost sm" data-act="fold" data-t="cmBox">Hide comments</button></div><div class="row" style="margin-top:16px;align-items:flex-start">${signedIn() ? userAv() : '<span class="av r" style="background:#3a4252">?</span>'}<div style="flex:1"><input class="inp" id="cin" placeholder="Add a comment…" style="border:0;border-bottom:1px solid var(--line);border-radius:0;background:none;padding:0" data-act2="cfocus"><div class="row hide" id="cbtns" style="justify-content:flex-end;margin-top:8px"><button class="btn ghost sm" data-act="ccancel">Cancel</button><button class="btn pri sm" data-act="cpost">Comment</button></div></div></div><div id="newc"></div>${pinned}${cms}</div>`;
  const onlyCh = window._upch === v.ch;
  const rec = PUB().filter(x => x.id !== id && (!onlyCh || x.ch === v.ch)).sort((a, b) => (b.ch === v.ch) - (a.ch === v.ch) || b.views - a.views).slice(0, 12);
  const right = `<div><div class="row" style="margin-bottom:10px"><b>Up next</b><div class="sp"></div><span class="mu" style="font-size:12px">Autoplay</span><button class="tog ${S.autoplay ? 'on' : ''}" data-act="autoplay"></button></div><div class="chips" style="margin-bottom:10px"><button class="chip ${onlyCh ? '' : 'on'}" data-act="upch" data-k="">All</button><button class="chip ${onlyCh ? 'on' : ''}" data-act="upch" data-k="${ch.id}">From ${esc(ch.name)}</button></div>${rec.length ? rec.map(r => hrow(r, { sm: 1 })).join('') : `<div class="empty" style="padding:30px 10px">No other videos from ${esc(ch.name)} yet.</div>`}</div>`;
  CUR.after = () => {
    const i = $('#cin'); if (i) i.addEventListener('focus', () => { if (needSignIn('Sign in to comment.')) { i.blur(); return; } $('#cbtns').classList.remove('hide'); });
    const p = $('#pl'); if (p) p.addEventListener('dblclick', e => { if (!e.target.closest('.ctl')) ACT.fullscreen(); });
  };
  return shell('', '', `<div class="wp"><div>${player}${info}${fold}${desc}${comments}</div>${right}</div>`);
});
Object.assign(ACT, {
  playtoggle(el) { const p = $('#pl'); p.classList.toggle('playing'); const on = p.classList.contains('playing'); p.querySelectorAll('[data-act=playtoggle]').forEach(b => b.innerHTML = ic(on ? 'pause' : 'play')); p.querySelector('[data-act=playtoggle]').style.opacity = on ? 0 : 1; toast(on ? 'Playing (mockup – no real video yet)' : 'Paused'); },
  autoplay() { S.autoplay = !S.autoplay; save(); toast('Autoplay ' + (S.autoplay ? 'on' : 'off')); rerender(); },
  /* the tick shows only next to the option in use */
  quality(el) {
    const qs = ['Auto', '1080p', '720p', '480p', '360p', '240p'], sp = ['0.5', '0.75', 'Normal', '1.25', '1.5', '2'];
    const pick = (list, key, label) => () => menu(el, list.map(q => ({ i: S[key] === q ? 'check' : '', l: q === 'Auto' ? 'Auto (720p now)' : q, f: () => { S[key] = q; save(); toast(label + ' ' + q); } })));
    menu(el, [{ i: 'gear', l: 'Quality: ' + (S.quality === 'Auto' ? 'Auto (720p)' : S.quality), f: pick(qs, 'quality', 'Quality set to') }, { i: 'clock', l: 'Playback speed: ' + S.speed, f: pick(sp, 'speed', 'Speed') }, { i: 'cc', l: 'Subtitles: Off', f: () => toast('Subtitles show only when the creator uploads a subtitle file') }]);
  },
  fullscreen() {
    const p = $('#pl'); if (!p) return;
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    (p.requestFullscreen ? p.requestFullscreen() : Promise.reject()).catch(() => toast('This browser blocked full screen'));
  },
  fold(el) {
    const box = document.getElementById(el.dataset.t); if (!box) return;
    box.classList.toggle('hide');
    document.querySelectorAll(`.fbtn[data-t="${el.dataset.t}"]`).forEach(b => b.classList.toggle('open', !box.classList.contains('hide')));
    if (!box.classList.contains('hide')) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },
  wmenu(el) { const id = el.dataset.id; menu(el, [{ i: 'later', l: 'Save to Watch later', f: () => { if (needSignIn()) return; if (!S.later.includes(id)) S.later.push(id); save(); toast('Saved to Watch later'); } }, { i: 'flag', l: 'Report', f: () => ACT.report(null, 'video', VID(id).title) }, { i: 'help', l: 'Send feedback', f: ACT.feedback }]); },
  upch(el) { window._upch = el.dataset.k; rerender(); },
  clike(el) { if (needSignIn('Sign in to like comments.')) return; el.classList.toggle('ac'); },
  reply(el) { if (needSignIn('Sign in to reply.')) return; const c = el.closest('[data-cbody]') || el.closest('.cm > div'); if (!c || c.querySelector('.rbox')) return; c.insertAdjacentHTML('beforeend', `<div class="rbox row" style="margin-top:8px">${userAv('xs')}<input class="inp" placeholder="Add a reply…" style="height:34px"><button class="btn pri sm" data-act="doreply">Reply</button></div>`); c.querySelector('.rbox input').focus(); },
  doreply(el) { const b = el.closest('.rbox'), t = b.querySelector('input').value.trim(); if (!t) { toast('Write a reply first'); return; } b.outerHTML = `<div class="cm" style="margin-top:10px">${userAv('xs')}<div><div class="n">@${hasCh() ? ME.handle : 'aamir.wani'}<span>just now</span></div><div style="margin-top:3px">${esc(t)}</div></div></div>`; toast('Reply posted'); },
  cmenu(el) { menu(el, [{ i: 'flag', l: 'Report comment', f: () => ACT.report(null, 'comment', el.dataset.what) }]); },
  csort(el) { menu(el, [{ i: 'trend', l: 'Top comments', f: () => toast('Sorted by top comments') }, { i: 'clock', l: 'Newest first', f: () => toast('Sorted by newest') }]); },
  ccancel() { $('#cin').value = ''; $('#cbtns').classList.add('hide'); },
  cpost() { const t = $('#cin').value.trim(); if (!t) { toast('Write something first'); return; } $('#newc').insertAdjacentHTML('afterbegin', `<div class="cm">${userAv()}<div><div class="n">@${hasCh() ? ME.handle : 'aamir.wani'}<span>just now</span></div><div style="margin-top:3px">${esc(t)}</div></div></div>`); ACT.ccancel(); toast('Comment posted'); }
});

/* Channel page (card style) */
route(/^@([\w.]+)(?:\/(videos|playlists|about))?$/, (h, tab) => {
  const ch = CHH(h); if (!ch) return shell('', '', '<div class="empty"><h2>Channel not found</h2></div>');
  if (ch.mine && !hasCh()) return shell('', '', '<div class="empty"><h2>This channel isn’t available</h2></div>');
  tab = tab || 'videos'; CUR.title = ch.name;
  const owner = ch.mine && hasCh(), subd = S.subs.includes(ch.id);
  const vids = H.videos.filter(v => v.ch === ch.id && (v.vis === 'Public'));
  const total = sum(vids.map(v => v.views));
  const btns = owner ? `<a class="btn pri" href="#/studio/customize">${ic('edit')}Customize channel</a><a class="btn" href="#/studio/content">${ic('video')}Manage videos</a><a class="btn" href="#/studio">${ic('chart')}Studio</a>` : `<button class="btn ${subd ? '' : 'pri'}" data-act="sub" data-id="${ch.id}">${subd ? ic('check') + 'Subscribed' : 'Subscribe'}</button>${subd ? `<button class="ib" data-act="bell" style="background:var(--p2)" title="Notifications">${ic('bell')}</button>` : ''}<button class="ib" data-act="chmenu" data-id="${ch.id}" style="background:var(--p2)">${ic('dots')}</button>`;
  const head = `<div class="chcard"><div class="bn ${ch.banner}"><button class="ib" data-act="share" data-id="${ch.handle}" title="Share channel">${ic('share')}</button></div><div class="body"><span class="av xl lg2 lg" style="background:${ch.color};width:96px;height:96px;font-size:30px">${ch.logo}</span><div style="flex:1;min-width:0"><div class="nm"><h1>${esc(ch.name)}</h1>${btns}</div><div class="mu" style="margin-top:4px">@${ch.handle} · ${num(ch.subs)} subscribers · ${vids.length} videos · ${ch.cat}</div><div style="margin-top:8px;max-width:760px">${esc(ch.desc)} <a class="ac" href="#/@${ch.handle}/about">More</a></div></div></div></div>`;
  const tabs = `<div class="ctabs">${['videos', 'playlists', 'about'].map(t => `<a href="#/@${ch.handle}/${t}" class="${tab === t ? 'on' : ''}">${t[0].toUpperCase() + t.slice(1)}</a>`).join('')}</div>`;
  let body = '';
  if (tab === 'videos') {
    const sort = CUR.sort = (window._chsort || 'latest');
    const vs = vids.slice().sort((a, b) => sort === 'popular' ? b.views - a.views : sort === 'oldest' ? b.days - a.days : a.days - b.days);
    body = `<div class="chips" style="margin-bottom:18px">${[['latest', 'Latest'], ['popular', 'Popular'], ['oldest', 'Oldest']].map(([k, l]) => `<button class="chip ${sort === k ? 'on' : ''}" data-act="chsort" data-k="${k}">${l}</button>`).join('')}</div>${vs.length ? `<div class="grid">${vs.map(v => card(v, { noch: 1 })).join('')}</div>` : '<div class="empty">No videos yet.</div>'}`;
  } else if (tab === 'playlists') {
    body = `<div class="grid">${[['Best of ' + ch.name, vids.slice(0, 4)], ['Most watched', vids.slice().sort((a, b) => b.views - a.views).slice(0, 3)]].filter(p => p[1].length).map(([n, vs]) => `<div class="vc"><a class="th ${vs[0].sc}" href="#/watch/${vs[0].id}" style="box-shadow:6px -6px 0 -1px #2a2f3a;margin:6px 6px 0 0"><span class="big">${vs[0].big}</span><span class="vw">${ic('list', 'sm')} ${vs.length} videos</span></a><div class="meta"><a class="t" href="#/watch/${vs[0].id}">${esc(n)}</a></div></div>`).join('')}</div>`;
  } else {
    body = `<div class="two"><div class="card"><h2>About</h2><p style="white-space:pre-line">${esc(ch.desc)}</p><h3 style="margin-top:18px">Links</h3><div class="col"><a class="ac" href="#" data-act="toast" data-msg="Opens Instagram in a new tab">${ic('link', 'sm')} instagram.com/${ch.handle}</a><a class="ac" href="#" data-act="toast" data-msg="Opens Facebook in a new tab">${ic('link', 'sm')} facebook.com/${ch.handle}</a></div></div><div class="card"><h2>Channel details</h2><div class="col"><div class="row">${ic('globe')}hellnoo.com/@${ch.handle}</div><div class="row">${ic('users')}${full(ch.subs)} subscribers</div><div class="row">${ic('video')}${vids.length} videos</div><div class="row">${ic('trend')}${full(total)} views</div><div class="row">${ic('cal')}Joined ${ch.joined}</div></div><div class="row" style="margin-top:18px"><button class="btn" data-act="share" data-id="${ch.handle}">${ic('share')}Share channel</button>${owner ? '' : `<button class="btn" data-act="report" data-kind="channel" data-what="${esc(ch.name)}">${ic('flag')}Report</button>`}</div></div></div>`;
  }
  return shell('ch-' + ch.handle, '', head + tabs + body);
});
ACT.chsort = el => { window._chsort = el.dataset.k; rerender(); };
ACT.bell = el => menu(el, [{ i: 'bell', l: 'All uploads', f: () => toast('You’ll be told about every upload') }, { i: 'bell', l: 'Personalised', f: () => toast('Only some uploads will notify you') }, { i: 'x', l: 'None', f: () => toast('No notifications from this channel') }, '-', { i: 'x', l: 'Unsubscribe', f: () => ACT.sub({ dataset: { id: el.closest('.chcard') ? CHH(location.hash.split('@')[1].split('/')[0]).id : '' } }) }]);
ACT.chmenu = el => { const ch = CH(el.dataset.id); menu(el, [{ i: 'share', l: 'Share channel', f: () => ACT.share(null, ch.handle) }, { i: 'copy', l: 'Copy channel link', f: () => toast('hellnoo.com/@' + ch.handle + ' copied') }, { i: 'help', l: 'About this channel', f: () => go('#/@' + ch.handle + '/about') }, '-', { i: 'ban', l: 'Don’t recommend this channel', f: () => toast('We won’t recommend ' + ch.name + ' to you') }, { i: 'flag', l: 'Report channel', f: () => ACT.report(null, 'channel', ch.name) }]); };

/* Search */
route(/^search\/(.+)$/, q => {
  CUR.q = q; CUR.title = q;
  const ql = q.toLowerCase();
  const chs = H.channels.filter(c => (!c.mine || hasCh()) && (c.name.toLowerCase().includes(ql) || c.handle.includes(ql) || c.cat.toLowerCase().includes(ql)));
  let vs = PUB().filter(v => (v.title + ' ' + CH(v.ch).name + ' ' + CH(v.ch).cat).toLowerCase().includes(ql));
  const none = !vs.length && !chs.length;
  if (none) vs = PUB().slice(0, 4);
  const sf = window._sf || 'all';
  const filters = `<div class="chips" style="margin-bottom:18px">${[['all', 'All'], ['videos', 'Videos'], ['channels', 'Channels']].map(([k, l]) => `<button class="chip ${sf === k ? 'on' : ''}" data-act="sf" data-k="${k}">${l}</button>`).join('')}<button class="chip" data-act="sfilter">${ic('filter', 'sm')} Filters</button></div>`;
  const chRows = chs.slice(0, 2).map(c => `<div class="hrow" style="align-items:center"><div style="width:248px;display:grid;place-items:center" class="hide-m"><span class="av xl" style="background:${c.color};width:110px;height:110px;font-size:34px">${c.logo}</span></div><span class="av lg only-m" style="background:${c.color}">${c.logo}</span><div style="flex:1"><a href="#/@${c.handle}" class="t" style="font-size:17px">${esc(c.name)}</a><div class="c">@${c.handle} · ${num(c.subs)} subscribers</div><div class="d">${esc(c.desc)}</div></div><button class="btn ${S.subs.includes(c.id) ? '' : 'pri'}" data-act="sub" data-id="${c.id}">${S.subs.includes(c.id) ? 'Subscribed' : 'Subscribe'}</button></div>`).join('');
  return shell('', '', `${filters}${none ? `<div class="note" style="margin-bottom:18px">No results for “${esc(q)}”. Try different words. Here are some popular videos instead.</div>` : `<div class="mu" style="margin-bottom:8px">About ${vs.length + chs.length} results for “${esc(q)}”</div>`}${sf === 'videos' ? '' : chRows}${sf === 'channels' ? (chs.length ? '' : `<div class="empty">No channels match “${esc(q)}”.</div>`) : vs.map(v => hrow(v)).join('')}`);
});
ACT.sf = el => { window._sf = el.dataset.k; rerender(); };
ACT.sfilter = () => modal('Search filters', `<div class="three">${[['Upload date', ['Last hour', 'Today', 'This week', 'This month', 'This year']], ['Duration', ['Under 4 minutes', '4–20 minutes', 'Over 20 minutes']], ['Sort by', ['Relevance', 'Upload date', 'View count']]].map(([h, o]) => `<div><h3>${h}</h3>${o.map(x => `<label class="chk" style="padding:5px 0"><input type="radio" name="${h}">${x}</label>`).join('')}</div>`).join('')}</div>`, `<button class="btn ghost" data-act="close">Cancel</button><button class="btn pri" data-act="done" data-msg="Filters applied">Apply</button>`, true);

/* Mobile "You" page */
route(/^you$/, () => {
  CUR.title = 'You';
  if (!signedIn()) return shell('you', '', libGate('you', 'Enjoy your favourite videos', 'user', 'Sign in to see your history, playlists and channel.'));
  const ln = (h, i, l, n) => `<a href="#/${h}" class="row" style="height:48px;padding:0 6px;border-bottom:1px solid var(--line)">${ic(i)}<span style="flex:1;font-weight:600">${l}</span>${n !== undefined ? `<span class="mu">${n}</span>` : ''}${ic('next', 'sm')}</a>`;
  const top = `<div class="row" style="margin-bottom:18px">${userAv('lg')}<div><h2 style="margin:0">${hasCh() ? esc(ME.name) : 'Aamir Wani'}</h2><div class="mu" style="font-size:13px">${hasCh() ? '@' + ME.handle : 'aamir.wani@gmail.com'}</div></div></div>`;
  const cta = hasCh() ? `<a class="btn pri" style="width:100%;justify-content:center;height:44px;margin-bottom:10px" href="#/@${ME.handle}">${ic('video')}Your channel</a><a class="btn" style="width:100%;justify-content:center;height:44px;margin-bottom:18px" href="#/studio">${ic('chart')}Channel Studio</a>` : `<button class="btn pri" style="width:100%;justify-content:center;height:44px;margin-bottom:18px" data-act="createch">${ic('plus')}Create channel</button>`;
  const hist = `<div class="sec-h"><h2>History</h2><div class="sp"></div><a class="btn ghost sm" href="#/history">View all</a></div><div class="row" style="overflow-x:auto;gap:12px;margin-bottom:18px;align-items:flex-start">${cw().map(v => `<div style="width:160px;flex:none">${thumb(v, { prog: 50, noage: 1 })}<div style="font-size:12px;font-weight:600;margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(v.title)}</div></div>`).join('')}</div>`;
  return shell('you', '', top + cta + hist + ln('later', 'later', 'Watch later', S.later.length) + ln('playlists', 'list', 'Playlists', S.playlists.length) + ln('liked', 'like', 'Liked videos', S.liked.length) + ln('settings', 'gear', 'Settings') + `<button class="row" style="height:48px;padding:0 6px;width:100%;background:none;border:0;color:var(--red)" data-act="signout">${ic('out')}<span style="font-weight:600">Sign out</span></button>`);
});

/* Settings */
route(/^settings(?:\/(\w+))?$/, tab => {
  CUR.title = 'Settings'; tab = tab || 'account';
  if (!signedIn()) return shell('', '', libGate('', 'Settings', 'gear', 'Sign in to change your settings.'));
  const T = [['account', 'Account'], ['notifications', 'Notifications'], ['privacy', 'Privacy'], ['playback', 'Playback']];
  const tg = (l, d, on) => `<div class="row" style="padding:12px 0;border-bottom:1px solid var(--line)"><div style="flex:1"><b>${l}</b>${d ? `<div class="mu" style="font-size:13px">${d}</div>` : ''}</div><button class="tog ${on ? 'on' : ''}" data-act="tg"></button></div>`;
  let b = '';
  if (tab === 'account') b = `<div class="card" style="max-width:640px"><h2>Your account</h2><div class="row" style="margin-bottom:16px">${userAv('lg')}<div><b>Aamir Wani</b><div class="mu">aamir.wani@gmail.com · Signed in with Google</div></div></div><div class="fld"><label>Display name</label><input class="inp" value="Aamir Wani"></div><div class="fld"><label>Email</label><input class="inp" value="aamir.wani@gmail.com" disabled></div><div class="row"><button class="btn pri" data-act="toast" data-msg="Saved">Save</button></div><hr style="border-color:var(--line);margin:22px 0"><h3>Your channel</h3>${hasCh() ? `<div class="row">${av(ME)}<b>${esc(ME.name)}</b><span class="mu">@${ME.handle}</span><div class="sp"></div><a class="btn sm" href="#/studio/customize">Edit channel</a></div>` : `<div class="row"><span class="mu">You don’t have a channel yet.</span><div class="sp"></div><button class="btn sm pri" data-act="createch">Create channel</button></div>`}<hr style="border-color:var(--line);margin:22px 0"><h3 class="red">Danger zone</h3><p class="mu" style="font-size:13px">Deleting your account removes your channel, videos, comments and history. This can’t be undone.</p><button class="btn dan" data-act="delacct">Delete account</button></div>`;
  if (tab === 'notifications') b = `<div class="card" style="max-width:640px"><h2>Notifications</h2>${tg('Uploads from subscriptions', 'When a channel you follow posts a new video', 1)}${tg('Replies to my comments', '', 1)}${tg('Activity on my channel', 'New comments and subscribers', 1)}${tg('Emails from Hellnoo', 'Product news and tips', 0)}</div>`;
  if (tab === 'privacy') b = `<div class="card" style="max-width:640px"><h2>Privacy</h2>${tg('Keep all my subscriptions private', 'Others can’t see which channels you follow', 1)}${tg('Keep my saved playlists private', '', 1)}${tg('Pause watch history', '', S.pauseHistory)}<div class="row" style="margin-top:16px"><button class="btn" data-act="clearhist">${ic('trash')}Clear watch history</button><button class="btn" data-act="toast" data-msg="A copy of your data will be emailed to you within 48 hours">${ic('dl')}Download my data</button></div></div>`;
  if (tab === 'playback') b = `<div class="card" style="max-width:640px"><h2>Playback</h2>${tg('Autoplay next video', '', S.autoplay)}${tg('Resume where I left off', '', 1)}${tg('Show preview when I hover on a thumbnail', '', 1)}<div class="fld" style="margin-top:14px"><label>Default quality</label><select class="inp"><option>Auto (recommended)</option><option>Higher picture quality</option><option>Data saver</option></select></div></div>`;
  return shell('', '', `<div class="ph"><h1>Settings</h1></div><div class="chips" style="margin-bottom:18px">${T.map(([k, l]) => `<a class="chip ${tab === k ? 'on' : ''}" style="display:grid;place-items:center" href="#/settings/${k}">${l}</a>`).join('')}</div>${b}`);
});
ACT.tg = el => { el.classList.toggle('on'); toast(el.classList.contains('on') ? 'Turned on' : 'Turned off'); };
ACT.delacct = () => modal('Delete account?', '<p class="mu" style="margin-top:0">Type <b>DELETE</b> to confirm. Your channel, videos and history will be removed for good.</p><input class="inp" id="delc" placeholder="DELETE">', '<button class="btn ghost" data-act="close">Cancel</button><button class="btn dan" data-act="dodelacct">Delete my account</button>');
ACT.dodelacct = () => { if ($('#delc').value.trim() !== 'DELETE') { toast('Type DELETE in capitals to confirm'); return; } closeModal(); toast('Mockup: the account would be deleted now. Nothing was removed.'); };

/* Creator Terms: short summary shown on the create-channel form (the full text is written with a lawyer) */
const TERMS_POINTS = [
  ['Who can create a channel', 'You must be 18 or older, and the details you give must be true. One channel per account.'],
  ['Your videos', 'Upload only videos you made or have permission to use. You keep ownership, and you let Hellnoo show them, make thumbnails and previews, and share them to promote Hellnoo.'],
  ['Not allowed', 'Sexual content, anything involving children, violence or threats, hate, harassment, fake or misleading content, impersonation, copyright theft, spam, and anything illegal in India or your country.'],
  ['You are responsible', 'You are responsible for everything you upload and say. Hellnoo may remove videos, hold earnings or close channels that break these rules, and must act on legal complaints within the times the law sets.'],
  ['Copyright', 'If someone owns the content you used, it can be taken down. Repeated copyright strikes close the channel.'],
  ['Earnings', 'Apply for monetization after you have 10 public videos and your channel is 30 days old. After approval, a video earns once it passes 1,000 views. Earnings are worked out in US dollars and paid once your balance is $20 or more: to your Indian bank account if you live in India (in rupees at that day’s rate), or by PayPal or Payoneer anywhere else. Fake views, bots or paid traffic mean no pay and can close the channel. Rates can change each month. You pay your own taxes.'],
  ['Changes', 'Hellnoo may update these terms. We tell you before changes take effect.']
];
const TERMS_BOX = `<details class="card" style="padding:10px 14px;margin-top:6px"><summary style="cursor:pointer;font-weight:700">Creator Terms – summary (read before creating)</summary><div style="margin-top:8px;max-height:220px;overflow:auto;font-size:13px">${TERMS_POINTS.map(([h, t]) => `<p style="margin:0 0 8px"><b>${h}.</b> <span class="mu">${t}</span></p>`).join('')}<p class="hint" style="margin:0">Full Creator Terms, Community Guidelines and Privacy Policy: hellnoo.com/terms</p></div></details>`;

/* Create channel (with live username check) */
const RESERVED = ['admin', 'hellnoo', 'support', 'help', 'studio', 'official', 'settings', 'about', 'api', 'login'];
const takenNames = () => H.channels.map(c => c.handle);
function checkUser(u) {
  if (!u) return ['', ''];
  if (u.length < 3) return ['bad', 'At least 3 characters'];
  if (u.length > 30) return ['bad', 'At most 30 characters'];
  if (!/^[a-z0-9._]+$/.test(u)) return ['bad', 'Only a–z, 0–9, dot (.) and underscore (_)'];
  if (!/^[a-z0-9]/.test(u) || !/[a-z0-9]$/.test(u)) return ['bad', 'Must start and end with a letter or number'];
  if (u.includes('..')) return ['bad', 'No two dots in a row'];
  if (RESERVED.includes(u)) return ['bad', 'This username is reserved'];
  if (takenNames().includes(u)) return ['bad', 'Taken. Try: ' + [u + '_official', u + '.vlogs', u + '26'].join(', ')];
  return ['ok', '✓ Available · hellnoo.com/@' + u];
}
ACT.createch = () => {
  if (needSignIn('Sign in to create a channel.')) return;
  if (hasCh()) { go('#/@' + ME.handle); return; }
  const o = modal('Create your channel', `<div class="row" style="gap:16px;margin-bottom:16px"><button class="av xl" style="background:#3a4252;border:0;width:84px;height:84px;font-size:12px;color:var(--mu)" data-act="toast" data-msg="Pick a square image, at least 256×256">${ic('img')}</button><div class="mu" style="font-size:13px">Logo (square)<br><span class="hint">Shown square everywhere on Hellnoo</span></div></div><div class="fld"><label>Channel name</label><input class="inp" id="cn" placeholder="e.g. Aamir Vlogs" maxlength="50"><span class="hint">Names can be the same as other channels.</span></div><div class="fld"><label>Username</label><div class="row" style="gap:0"><span class="inp" style="width:auto;display:grid;place-items:center;border-radius:10px 0 0 10px;border-right:0;color:var(--mu)">@</span><input class="inp" id="cu" placeholder="aamirvlogs" style="border-radius:0 10px 10px 0" maxlength="30"></div><span class="hint" id="cuh">Unique. Lower case letters, numbers, dot and underscore. 3–30 characters.</span></div><div class="fld"><label>Description</label><textarea class="inp" id="cd" placeholder="Tell viewers what your channel is about"></textarea></div><div class="fld"><label>Banner (optional)</label><div class="drop" style="padding:20px" data-act="toast" data-msg="Pick a wide image, 2048×512 recommended">${ic('img')} Upload banner</div></div><div class="fld"><label>Country you live in</label><select class="inp" id="cres"><option value="">Choose your country</option>${Object.entries(RES).map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}</select><span class="hint">Decides how you get paid: if you live in India, to your Indian bank account; anywhere else, by PayPal or Payoneer. To change it later you contact support.</span></div>${TERMS_BOX}<label class="chk" style="margin-top:10px"><input type="checkbox" id="cterms">I am 18 or older and I agree to the Hellnoo Creator Terms and Community Guidelines.</label>`, `<button class="btn ghost" data-act="close">Cancel</button><button class="btn pri" data-act="docreatech">Create channel</button>`);
  const cu = o.querySelector('#cu'), cn = o.querySelector('#cn');
  cn.addEventListener('input', () => { if (!cu.dataset.touched) { cu.value = cn.value.toLowerCase().replace(/[^a-z0-9._]/g, ''); cu.dispatchEvent(new Event('input')); } });
  cu.addEventListener('input', e => { if (e.isTrusted) cu.dataset.touched = 1; cu.value = cu.value.toLowerCase(); const [k, m] = checkUser(cu.value); const h = o.querySelector('#cuh'); h.className = k || 'hint'; h.textContent = m || 'Unique. Lower case letters, numbers, dot and underscore. 3–30 characters.'; });
};
ACT.docreatech = () => {
  const n = $('#cn').value.trim(), u = $('#cu').value.trim();
  if (!n) { toast('Add a channel name'); return; }
  if (checkUser(u)[0] !== 'ok') { toast('Choose an available username'); return; }
  const r = $('#cres').value; if (!r) { toast('Choose the country you live in'); return; }
  if (!$('#cterms').checked) { toast('Tick the box to accept the Creator Terms'); return; }
  S.role = 'creator'; S.myName = n; S.myHandle = u; S.res = r; save();
  ME.name = n; ME.handle = u; ME.logo = n.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  closeModal(); toast('Channel created! Welcome to Hellnoo Studio'); go('#/@' + u);
};
