/* Nicko's Adventures - game engine: rooms, movement, HUD, rewards, events */
(function () {
'use strict';

function $(s) { return document.querySelector(s); }
var stage = $('#stage'), roomWrap = $('#room-wrap'), roomBg = $('#room-bg'),
    objectsEl = $('#objects'), fxEl = $('#fx');

var ORDER = ['bedroom', 'bathroom', 'kitchen', 'living', 'playroom', 'backyard'];
var current = 'living';
var locked = false;
var objDefs = {};
var lastInteract = Date.now();

var G = window.G = {};
G.S = Store.data;

/* ---------- utilities ---------- */
G.wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
G.sfx = function (n, a) { AudioSys.play(n, a); };
G.lock = function () { locked = true; };
G.unlock = function () { locked = false; };
G.isLocked = function () { return locked; };
G.flag = function (k) { return G.S.flags[k]; };
G.setFlag = function (k, v) { G.S.flags[k] = (v === undefined ? true : v); Store.save(); };
G.once = function (k) { if (G.S.flags[k]) return false; G.S.flags[k] = true; Store.save(); return true; };
G.dim = function (on) { $('#dim').classList.toggle('on', !!on); };
G.def = function (id) { return objDefs[id]; };
G.roomName = function () { return current; };

/* ---------- toast ---------- */
G.toast = function (msg, icon) {
  var wrap = $('#toast-wrap');
  var el = document.createElement('div');
  el.className = 'toast';
  el.textContent = (icon ? icon + ' ' : '') + msg;
  wrap.appendChild(el);
  while (wrap.children.length > 2) wrap.removeChild(wrap.firstChild);
  setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 350); }, 2400);
  lastInteract = Date.now();
};

/* ---------- HUD ---------- */
function updateHUD() {
  $('#points').textContent = G.S.points;
  $('#coll-count').textContent = G.S.collectibles.length + '/8';
  $('#btn-mute').textContent = AudioSys.isMuted() ? '🔇' : '🔊';
}

/* ---------- points / discoveries ---------- */
G.points = function (n, reason) {
  if (n > 0) {
    G.S.points += n; Store.save(); updateHUD();
    var pill = $('#points-pill');
    pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump');
    G.floatText(Nicko.pos(), 26, '+' + n);
    G.sfx('chime');
    if (G.S.points >= 150) G.achieve('paw-champion');
  }
  if (reason) G.toast(reason, '⭐');
};

function findAch(id) {
  for (var i = 0; i < ACHIEVEMENTS.length; i++) if (ACHIEVEMENTS[i].id === id) return ACHIEVEMENTS[i];
  return null;
}

G.achieve = function (id) {
  if (G.S.achievements.indexOf(id) >= 0) return;
  var def = findAch(id); if (!def) return;
  G.S.achievements.push(id); Store.save();
  G.sfx('fanfare');
  var pop = document.createElement('div');
  pop.id = 'achieve-pop';
  pop.innerHTML = '<div class="ai">' + def.icon + '</div><div class="an">' + def.name + '</div><div class="ad">' + def.desc + '</div>';
  stage.appendChild(pop);
  setTimeout(function () { pop.remove(); }, 2700);
};

G.discover = function (text, pts) {
  if (pts === undefined) pts = 5;
  G.sfx('discover');
  G.achieve('curious-kitten');
  G.points(pts, text);
};

G.collect = function (id) {
  if (G.S.collectibles.indexOf(id) >= 0) return;
  G.S.collectibles.push(id); Store.save(); updateHUD();
  G.sfx('magic');
  G.sparkleAt(Nicko.pos(), 40, 14);
  G.points(10, 'Golden Paw Print found!');
};

/* ---------- fx ---------- */
G.sparkleAt = function (x, y, n) {
  n = n || 8;
  var shapes = ['✨', '⭐', '💫'];
  for (var i = 0; i < n; i++) {
    (function (i) {
      var s = document.createElement('div');
      s.className = 'sparkle';
      s.textContent = shapes[i % 3];
      s.style.left = x + '%'; s.style.top = y + '%';
      s.style.setProperty('--dx', (Math.random() * 130 - 65) + 'px');
      s.style.setProperty('--dy', (-Math.random() * 90 - 20) + 'px');
      fxEl.appendChild(s);
      setTimeout(function () { s.remove(); }, 1100);
    })(i);
  }
};
G.splashAt = function (x, y) {
  for (var i = 0; i < 7; i++) {
    (function () {
      var d = document.createElement('div');
      d.className = 'splash-drop';
      d.style.left = x + '%'; d.style.top = y + '%';
      d.style.setProperty('--dx', (Math.random() * 110 - 55) + 'px');
      d.style.setProperty('--dy', (Math.random() * 60 + 30) + 'px');
      fxEl.appendChild(d);
      setTimeout(function () { d.remove(); }, 900);
    })();
  }
};
G.floatText = function (x, y, text) {
  var f = document.createElement('div');
  f.className = 'float-text';
  f.style.left = x + '%'; f.style.top = y + '%';
  f.textContent = text;
  fxEl.appendChild(f);
  setTimeout(function () { f.remove(); }, 1200);
};
G.hotBadge = function (x, y, text) {
  var b = document.createElement('div');
  b.className = 'hot-badge';
  b.style.left = x + '%'; b.style.top = y + '%';
  b.textContent = '🔥 ' + text;
  fxEl.appendChild(b);
  setTimeout(function () { b.remove(); }, 1700);
};
G.heatWaves = function (x, y) {
  for (var i = 0; i < 3; i++) {
    (function (i) {
      var w = document.createElement('div');
      w.className = 'heat-wave';
      w.style.left = (x - 4 + i * 4) + '%'; w.style.top = y + '%';
      w.style.animationDelay = (i * 0.3) + 's';
      fxEl.appendChild(w);
      setTimeout(function () { w.remove(); }, 2000);
    })(i);
  }
};

/* ---------- objects ---------- */
function addObject(def) {
  var el = document.createElement('div');
  el.className = 'obj' + (def.glow ? ' glow' : '') + (def.glowSoft ? ' glow-soft' : '');
  el.dataset.obj = def.id;
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', def.label || def.id);
  el.style.left = def.x + '%';
  el.style.top = def.y + '%';
  el.style.width = def.w + '%';
  el.innerHTML = def.svg;
  el._def = def;
  el.addEventListener('pointerdown', function (ev) {
    ev.stopPropagation();
    onObjTap(def, el);
  });
  objectsEl.appendChild(el);
  return el;
}

G.el = function (id) { return objectsEl.querySelector('[data-obj="' + id + '"]'); };
G.setSvg = function (id, svg) { var el = G.el(id); if (el) el.innerHTML = svg; };
G.setGlow = function (id, on) {
  var el = G.el(id);
  if (el) { el.classList.toggle('glow', !!on); if (on) el.classList.remove('glow-soft'); }
};
G.hide = function (id) { var el = G.el(id); if (el) el.style.display = 'none'; };
G.show = function (id) { var el = G.el(id); if (el) el.style.display = ''; };
G.spawn = function (def) {
  var old = G.el(def.id);
  if (old) old.remove();
  objDefs[def.id] = def;
  return addObject(def);
};
G.despawn = function (id) { var el = G.el(id); if (el) el.remove(); delete objDefs[id]; };
G.sendTo = function (id, x, y, ms) {
  return new Promise(function (resolve) {
    var el = G.el(id);
    if (!el) { resolve(); return; }
    ms = ms || 700;
    el.style.transition = 'left ' + ms + 'ms ease, top ' + ms + 'ms ease';
    el.style.left = x + '%'; el.style.top = y + '%';
    setTimeout(function () { try { el.style.transition = ''; } catch (e) {} resolve(); }, ms + 60);
  });
};

async function onObjTap(def, el) {
  AudioSys.ensure();
  if (locked) return;
  if (!$('#modal-wrap').classList.contains('hidden')) return;
  locked = true;
  lastInteract = Date.now();
  try {
    await Nicko.walkTo(def.x);
    await def.onTap(G);
  } catch (e) {
    if (window.console) console.error('tap error on ' + def.id, e);
  }
  locked = false;
}
// direct invocation (no walk, no lock) for chained interactions like the TV remote
G.objTap = async function (id) {
  var el = G.el(id);
  if (!el || !el._def) return;
  await el._def.onTap(G);
};

/* ---------- room-specific helpers ---------- */
G.tidyToy = async function (toyId, boxId) {
  var box = G.el(boxId);
  var bx = 14, by = 78;
  if (box) { bx = parseFloat(box.style.left) || 14; by = parseFloat(box.style.top) || 78; }
  await G.sendTo(toyId, bx, by, 600);
  G.despawn(toyId);
  G.sfx('pop'); G.sparkleAt(bx, by - 4, 6);
  await Nicko.react('happy');
  G.points(5, 'Toy tidied!');
  if (!G.el('teddy') && !G.el('duck') && G.once('bedroomTidy')) {
    G.sfx('fanfare');
    G.points(10, 'Bedroom all tidy!');
  }
};

var PLAY_TOYS = ['ptoy1', 'ptoy2', 'ptoy3', 'ptoy4'];
G.tidyPlayToy = async function (toyId) {
  await G.sendTo(toyId, 8, 80, 600);
  G.despawn(toyId);
  G.sfx('pop'); G.sparkleAt(8, 76, 6);
  await Nicko.react('happy');
  G.points(5, 'Toy tidied!');
  var remaining = PLAY_TOYS.filter(function (id) { return !!G.el(id); });
  if (remaining.length === 0 && G.once('playroomTidy')) {
    G.achieve('toy-master');
    G.points(25, 'Playroom all tidy!');
    G.collect('print-playroom');
    G.toast('A Golden Paw Print was in the toy box!', '🐾');
  }
};

G.stackBlock = async function (blockId) {
  var n = G.flag('towerH') || 0;
  if (n >= 3) { G.toast('So tall! Tap the tower!', '🗼'); return; }
  var el = G.el(blockId);
  if (!el || el.dataset.stacked) return;
  await G.sendTo(blockId, 62, 72 - n * 10, 500);
  G.sfx('pop');
  n++; G.setFlag('towerH', n);
  el.dataset.stacked = '1';
  await Nicko.react('happy');
  if (n === 3) {
    G.toast('Amazing tower! Tap it!', '😲');
    var t = G.el('tower');
    if (t) t.classList.add('glow');
  } else {
    G.toast('Stack it higher!', '🧱');
  }
};

G.toppleTower = async function () {
  var n = G.flag('towerH') || 0;
  if (n === 0) { G.toast('Tap the blocks to stack them!', '🧱'); return; }
  var t = G.el('tower');
  if (t) t.classList.remove('glow');
  G.sfx('crash');
  if (t) { t.classList.remove('wobble'); void t.offsetWidth; t.classList.add('wobble'); }
  var homes = { blockA: [28, 76], blockB: [38, 80], blockC: [48, 76] };
  ['blockA', 'blockB', 'blockC'].forEach(function (id) {
    var el = G.el(id);
    if (el && el.dataset.stacked) {
      delete el.dataset.stacked;
      var h = homes[id];
      el.style.transition = 'left .7s ease, top .7s ease';
      el.style.left = (h[0] + (Math.random() * 12 - 6)) + '%';
      el.style.top = (h[1] + (Math.random() * 6 - 2)) + '%';
      setTimeout(function () { try { el.style.transition = ''; } catch (e) {} }, 780);
    }
  });
  G.setFlag('towerH', 0);
  await Nicko.react('surprised');
  G.sfx('giggle');
  if (n >= 3 && G.once('towerTopple')) {
    G.discover('Timber! What a crash!', 10);
    G.collect('print-blocks');
  } else {
    G.toast('Crash! Build it again!', '😂');
  }
};

G.checkKitchen = function () {
  if (G.flag('stoveLearned') && G.flag('fed')) G.achieve('kitchen-explorer');
};

G.yardDiscover = function (key) {
  var k = 'yard_' + key;
  if (G.flag(k)) return;
  G.setFlag(k, true);
  var keys = ['butterfly', 'flowers', 'sandbox', 'puddle', 'bird', 'rain'];
  var count = keys.filter(function (k2) { return G.flag('yard_' + k2); }).length;
  if (count >= 3) G.achieve('backyard-detective');
};

/* ---------- doors & navigation ---------- */
function doorSvg(dir, neighbor) {
  var icon = ROOMS[neighbor].icon;
  var arrow = dir === 'right' ? '➡️' : '⬅️';
  return '<svg viewBox="0 0 100 160"><rect x="14" y="10" width="72" height="140" rx="30" fill="#8A5A3B"/>' +
    '<rect x="24" y="22" width="52" height="118" rx="20" fill="#5A3A22"/>' +
    '<circle cx="66" cy="88" r="6" fill="#FFD65A"/></svg>' +
    '<div class="door-arrow" style="position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:30px;">' + arrow + '</div>' +
    '<div style="position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);font-size:24px;background:#fff;border-radius:50%;width:42px;height:42px;display:flex;align-items:center;justify-content:center;border:3px solid #FFD65A;">' + icon + '</div>';
}

function addDoors() {
  var idx = ORDER.indexOf(current);
  var prev = ORDER[(idx + ORDER.length - 1) % ORDER.length];
  var next = ORDER[(idx + 1) % ORDER.length];
  var dl = addObject({ id: '__doorL', x: 5, y: 62, w: 9, label: 'Go to ' + ROOMS[prev].label, svg: doorSvg('left', prev),
    onTap: async function () { await G.gotoRoom(prev, 'left'); } });
  var dr = addObject({ id: '__doorR', x: 95, y: 62, w: 9, label: 'Go to ' + ROOMS[next].label, svg: doorSvg('right', next),
    onTap: async function () { await G.gotoRoom(next, 'right'); } });
  dl.classList.add('door', 'door-left');
  dr.classList.add('door');
  objDefs.__doorL = dl._def; objDefs.__doorR = dr._def;
}

function renderRoom(id, entry) {
  current = id;
  var def = ROOMS[id];
  roomBg.innerHTML = def.bg;
  objectsEl.innerHTML = '';
  objDefs = {};
  def.objects.forEach(function (d) { objDefs[d.id] = d; addObject(d); });
  addDoors();
  if (G.S.roomsVisited.indexOf(id) < 0) {
    G.S.roomsVisited.push(id); Store.save();
    if (G.S.roomsVisited.length >= 6) G.achieve('house-explorer');
  }
  G.dim(false);
  if (entry === 'right') { Nicko.face('right'); Nicko.setX(14); }
  else if (entry === 'left') { Nicko.face('left'); Nicko.setX(86); }
  updateHUD();
  document.title = "Nicko's Adventures: " + def.label;
}

G.gotoRoom = async function (id, dir) {
  if (id === current) return;
  G.sfx('whoosh');
  roomWrap.classList.add(dir === 'left' ? 'slide-out-right' : 'slide-out-left');
  await G.wait(360);
  renderRoom(id, dir === 'right' ? 'right' : 'left');
  roomWrap.classList.remove('slide-out-right', 'slide-out-left');
  roomWrap.classList.add(dir === 'left' ? 'slide-in-right' : 'slide-in-left');
  setTimeout(function () { roomWrap.classList.remove('slide-in-right', 'slide-in-left'); }, 450);
  lastInteract = Date.now();
};

/* ---------- floor tap to walk ---------- */
stage.addEventListener('pointerdown', function (ev) {
  AudioSys.ensure();
  if (locked) return;
  if (!$('#modal-wrap').classList.contains('hidden')) return;
  if (ev.target.closest('#hud') || ev.target.closest('#modal-wrap') || ev.target.closest('#toast-wrap')) return;
  var rect = stage.getBoundingClientRect();
  var xPct = (ev.clientX - rect.left) / rect.width * 100;
  lastInteract = Date.now();
  Nicko.walkTo(xPct);
});
stage.addEventListener('contextmenu', function (ev) { ev.preventDefault(); });

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') { AudioSys.ensure(); Nicko.walkTo(Nicko.pos() - 10); }
  else if (e.key === 'ArrowRight') { AudioSys.ensure(); Nicko.walkTo(Nicko.pos() + 10); }
});

/* ---------- modals ---------- */
function openModal(html) {
  var w = $('#modal-wrap');
  w.innerHTML = '<div class="modal-card">' + html + '</div>';
  w.classList.remove('hidden');
  var btn = w.querySelector('.modal-close');
  if (btn) btn.addEventListener('click', closeModal);
  w.addEventListener('pointerdown', function (ev) {
    if (ev.target === w) closeModal();
  });
}
function closeModal() {
  var w = $('#modal-wrap');
  w.classList.add('hidden');
  w.innerHTML = '';
}
G.openCollection = function () {
  var html = '<h2>🎒 Golden Paw Prints</h2><p class="sub">' + G.S.collectibles.length + ' of 8 found</p><div class="collect-grid">' +
    COLLECTIBLES.map(function (c) {
      var found = G.S.collectibles.indexOf(c.id) >= 0;
      return '<div class="collect-slot' + (found ? ' found' : '') + '"><div class="ci">🐾</div><div class="cn">' + c.name + '</div>' +
        (found ? '' : '<div class="ch">' + c.hint + '</div>') + '</div>';
    }).join('') + '</div><button class="modal-close">Keep playing!</button>';
  openModal(html);
};
G.openAchievements = function () {
  var html = '<h2>🏅 Achievements</h2><p class="sub">' + G.S.achievements.length + ' of ' + ACHIEVEMENTS.length + ' earned</p>' +
    ACHIEVEMENTS.map(function (a) {
      var got = G.S.achievements.indexOf(a.id) >= 0;
      return '<div class="achieve-row' + (got ? '' : ' locked') + '"><div class="ai">' + a.icon + '</div>' +
        '<div><div class="an">' + a.name + '</div><div class="ad">' + a.desc + '</div></div></div>';
    }).join('') + '<button class="modal-close">Keep playing!</button>';
  openModal(html);
};

/* ---------- mini events ---------- */
var BUTTERFLY_SVG = '<svg viewBox="0 0 100 90"><g class="wings"><ellipse cx="32" cy="40" rx="22" ry="28" fill="#FF9DC6" transform="rotate(-24 32 40)"/><ellipse cx="68" cy="40" rx="22" ry="28" fill="#FF9DC6" transform="rotate(24 68 40)"/></g><rect x="46" y="26" width="8" height="40" rx="4" fill="#5A4A6B"/><circle cx="50" cy="24" r="7" fill="#5A4A6B"/></svg>';

var EVENTS = [
  { id: 'flyby', run: async function () {
      var el = G.spawn({ id: '__fly', x: -10, y: 24, w: 9, label: '', svg: BUTTERFLY_SVG, onTap: async function () {} });
      if (el) el.style.pointerEvents = 'none';
      G.sfx('magic');
      await G.sendTo('__fly', 110, 20, 7000);
      G.despawn('__fly');
    } },
  { id: 'rumble', run: async function () {
      G.sfx('knock');
      Nicko.emote('confused', 1300);
      await G.wait(500);
      await Nicko.react('surprised', 1200);
      G.toast('What was that sound?', '👂');
    } },
  { id: 'rolltoy', rooms: ['living'], run: async function () {
      var el = G.spawn({ id: '__roll', x: 108, y: 84, w: 7, label: '', svg: '<svg viewBox="0 0 90 90"><circle cx="45" cy="45" r="38" fill="#6BA8E8"/><circle cx="45" cy="45" r="14" fill="#fff" opacity="0.8"/></svg>', onTap: async function () {} });
      if (el) el.style.pointerEvents = 'none';
      G.sfx('boing');
      await G.sendTo('__roll', 30, 84, 1600);
      G.despawn('__roll');
      G.toast('A ball rolled under the couch!', '🔍');
      Nicko.face('left');
      await Nicko.react('surprised', 1100);
    } },
  { id: 'rainy', rooms: ['backyard'], run: async function () {
      G.sfx('rain');
      for (var i = 0; i < 8; i++) G.splashAt(30 + Math.random() * 40, 25 + Math.random() * 15);
      G.toast('A surprise sprinkle!', '🌧️');
      await Nicko.react('surprised', 1100);
    } }
];

var nextEvent = Date.now() + 30000;
setInterval(async function () {
  if (document.hidden || locked) return;
  if (!$('#modal-wrap').classList.contains('hidden')) return;
  if (Date.now() < nextEvent) return;
  nextEvent = Date.now() + 38000 + Math.random() * 26000;
  var pool = EVENTS.filter(function (e) { return !e.rooms || e.rooms.indexOf(current) >= 0; });
  if (!pool.length) return;
  var e = pool[Math.floor(Math.random() * pool.length)];
  try { await e.run(); } catch (err) { if (window.console) console.error('event error', err); }
}, 4000);

/* idle hint: gently highlight something after 45s of no taps */
setInterval(function () {
  if (document.hidden || locked) return;
  if (!$('#modal-wrap').classList.contains('hidden')) return;
  if (Date.now() - lastInteract < 45000) return;
  var objs = objectsEl.querySelectorAll('.obj');
  if (!objs.length) return;
  var el = objs[Math.floor(Math.random() * objs.length)];
  if (el.dataset.obj && el.dataset.obj.indexOf('__') === 0) return;
  el.classList.add('glow-soft');
  setTimeout(function () { el.classList.remove('glow-soft'); }, 4500);
  lastInteract = Date.now();
}, 10000);

/* ---------- opening ---------- */
async function opening() {
  await G.wait(700);
  try {
    var el = G.spawn({ id: '__fly0', x: -10, y: 24, w: 9, label: '', svg: BUTTERFLY_SVG, onTap: async function () {} });
    if (el) el.style.pointerEvents = 'none';
    G.sfx('magic');
    G.sendTo('__fly0', 110, 20, 7000).then(function () { G.despawn('__fly0'); });
  } catch (e) {}
  await G.wait(1200);
  Nicko.emote('wow', 1600);
  G.toast('Tap the shiny ball!', '👆');
  await G.wait(9000);
  if (Nicko.isDirty()) G.toast("Nicko's paws are dirty! Find the bathroom!", '🧼');
}

/* ---------- self test (?selftest=1) ---------- */
function slog(out, lines, ok, msg) {
  lines.push((ok ? 'PASS' : 'FAIL') + ' ' + msg);
  out.innerHTML = lines.map(function (l) {
    return '<div class="' + (l.indexOf('FAIL') === 0 ? 'fail' : '') + '">' + l + '</div>';
  }).join('');
  return ok;
}
async function selftest() {
  var out = $('#selftest-results');
  out.classList.remove('hidden');
  var lines = [], fails = 0;
  function log(ok, msg) { if (!slog(out, lines, ok, msg)) fails++; }
  try {
    log(true, 'boot ok, room=' + current);
    for (var i = 0; i < ORDER.length; i++) {
      await G.gotoRoom(ORDER[i], i % 2 ? 'left' : 'right');
      log(current === ORDER[i], 'goto ' + ORDER[i]);
      var n = objectsEl.querySelectorAll('.obj').length;
      log(n >= 6, ORDER[i] + ' has ' + n + ' tap targets');
    }
    await G.gotoRoom('bedroom', 'right');
    var p0 = G.S.points;
    await G.objTap('bed');
    log(G.S.points > p0, 'bed earns points (' + p0 + ' -> ' + G.S.points + ')');
    await G.objTap('pajamas');
    await G.objTap('underbed');
    log(G.S.collectibles.indexOf('print-bedroom') >= 0, 'bedroom golden print collected');
    await G.gotoRoom('bathroom', 'right');
    await G.objTap('sink'); await G.objTap('soap'); await G.objTap('sink'); await G.objTap('towel');
    log(G.S.achievements.indexOf('clean-paws') >= 0, 'clean-paws achievement unlocked');
    log(!Nicko.isDirty(), 'paws are clean after wash chain');
    await G.gotoRoom('kitchen', 'right');
    await G.objTap('stove');
    log(!!G.flag('stoveLearned'), 'stove safety learned');
    await G.objTap('fridge');
    await G.objTap('fish');
    log(G.S.achievements.indexOf('kitchen-explorer') >= 0, 'kitchen-explorer achievement unlocked');
    await G.gotoRoom('living', 'right');
    await G.objTap('ball');
    log(G.S.achievements.indexOf('curious-kitten') >= 0, 'curious-kitten achievement unlocked');
    await G.objTap('cushion');
    log(!!G.el('toyMouse'), 'hidden toy mouse revealed');
    await G.gotoRoom('playroom', 'right');
    await G.objTap('blockA'); await G.objTap('blockB'); await G.objTap('blockC');
    log((G.flag('towerH') || 0) === 3, 'tower stacked 3 high');
    await G.objTap('tower');
    log(G.S.collectibles.indexOf('print-blocks') >= 0, 'builder print collected after topple');
    await G.objTap('ptoy1'); await G.objTap('ptoy2'); await G.objTap('ptoy3'); await G.objTap('ptoy4');
    log(G.S.achievements.indexOf('toy-master') >= 0, 'toy-master achievement unlocked');
    await G.gotoRoom('backyard', 'right');
    await G.objTap('bush'); await G.objTap('can'); await G.objTap('sandbox');
    log(G.S.collectibles.indexOf('print-backyard') >= 0, 'backyard print dug up');
    log(G.S.achievements.indexOf('house-explorer') >= 0, 'house-explorer achievement unlocked');
    Store.save();
    var raw = null;
    try { raw = window.localStorage.getItem('nickoAdvSaveV1'); } catch (e) {}
    log(!!raw && JSON.parse(raw).points === G.S.points, 'progress persists to localStorage');
    log(true, 'selftest complete, fails=' + fails);
    document.title = 'SELFTEST ' + (fails === 0 ? 'PASS' : 'FAIL');
  } catch (e) {
    log(false, 'exception: ' + (e && e.message));
    document.title = 'SELFTEST FAIL';
  }
}

/* ---------- boot ---------- */
function boot() {
  G.S = Store.data;
  AudioSys.setMuted(!!G.S.muted);
  Nicko.init();
  renderRoom('living', null);
  Nicko.setX(50);
  Nicko.mood('dirty', true);
  updateHUD();

  $('#btn-collection').addEventListener('click', function (ev) { ev.stopPropagation(); AudioSys.ensure(); G.openCollection(); });
  $('#btn-achievements').addEventListener('click', function (ev) { ev.stopPropagation(); AudioSys.ensure(); G.openAchievements(); });
  $('#btn-mute').addEventListener('click', function (ev) {
    ev.stopPropagation();
    AudioSys.ensure();
    var m = !AudioSys.isMuted();
    AudioSys.setMuted(m);
    G.S.muted = m; Store.save();
    updateHUD();
  });

  if (new URLSearchParams(window.location.search).has('selftest')) {
    setTimeout(selftest, 700);
  } else {
    setTimeout(opening, 500);
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})();
