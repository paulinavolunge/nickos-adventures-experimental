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
  $('#coll-count').textContent = G.S.collectibles.length + '/10';
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

/* Quiet discovery: sparkles and a small chime, no banner. Big celebrations
   are reserved for Golden Paw Prints, secrets, and real achievements. */
G.discover = function (text, pts) {
  if (pts === undefined) pts = 5;
  G.sfx('discover');
  G.sparkleAt(Nicko.pos(), 45, 8);
  G.achieve('curious-kitten');
  G.points(pts);
};

G.collect = function (id) {
  if (G.S.collectibles.indexOf(id) >= 0) return;
  var def = null;
  for (var i = 0; i < COLLECTIBLES.length; i++) if (COLLECTIBLES[i].id === id) def = COLLECTIBLES[i];
  G.S.collectibles.push(id); Store.save(); updateHUD();
  G.sfx('magic');
  G.sparkleAt(Nicko.pos(), 40, 14);
  G.points(10);
  /* A Golden Paw Print is a big moment: a real celebration card. */
  var name = def ? def.name : 'Golden Paw Print';
  setTimeout(function () {
    openModal('<h2>🐾</h2><p class="sub">A Golden Paw Print!</p><h2>' + name + '</h2>' +
      '<p class="sub">' + G.S.collectibles.length + ' of 10 found</p>' +
      '<button class="modal-close">Keep playing!</button>');
  }, 900);
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
    if (def.drag && window.Drag) Drag.press(def, el, ev);
    else onObjTap(def, el);
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
    var tx = def.x;
    if (el && el.style.left) { var px = parseFloat(el.style.left); if (!isNaN(px)) tx = px; }
    await Nicko.walkTo(tx);
    await def.onTap(G);
  } catch (e) {
    if (window.console) console.error('tap error on ' + def.id, e);
  }
  locked = false;
}
/* shared tap flow, also used when a drag ends up being a simple tap */
G.tapDef = onObjTap;
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
  G.points(5);
  var remaining = PLAY_TOYS.filter(function (id) { return !!G.el(id); });
  if (remaining.length === 0 && G.once('playroomTidy')) {
    G.achieve('toy-master');
    G.points(25);
    G.collect('print-playroom');
  }
};

G.stackBlock = async function (blockId) {
  var n = G.flag('towerH') || 0;
  if (n >= 3) return;
  var el = G.el(blockId);
  if (!el || el.dataset.stacked) return;
  await G.sendTo(blockId, 62, 72 - n * 10, 500);
  G.sfx('pop');
  n++; G.setFlag('towerH', n);
  el.dataset.stacked = '1';
  await Nicko.react('happy');
  if (n === 3) {
    var t = G.el('tower');
    if (t) t.classList.add('glow');
    await Nicko.action('hop');
    G.sfx('magic');
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
    G.collect('print-blocks');
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

/* ---------- needs HUD + toybox tray ---------- */
G.renderNeeds = function () {
  var bar = $('#needs-bar');
  if (!bar) return;
  var icons = { happy: '😺', hunger: '🍎', clean: '🛁', energy: '⚡' };
  var keymap = { happy: 'happy', hunger: 'hunger', clean: 'clean', energy: 'energy' };
  var html = '';
  Object.keys(icons).forEach(function (k) {
    var v = Math.round(Needs.get(keymap[k]));
    var cls = v > 60 ? 'ok' : (v > 30 ? 'mid' : 'low');
    html += '<div class="need ' + cls + '" data-need="' + k + '" title="' + k + '">' +
      '<span class="need-icon">' + icons[k] + '</span>' +
      '<span class="need-fill"><span style="width:' + v + '%"></span></span></div>';
  });
  bar.innerHTML = html;
  /* thought-bubble nudges handled in Needs.js via Nicko.think */
};

G.renderTray = function () {
  var tray = $('#tray');
  if (!tray) return;
  var wasOpen = tray.querySelector('.tray-items') &&
    !tray.querySelector('.tray-items').classList.contains('hidden');
  var items = Inventory.owned();
  var html = '<div class="tray-handle">🧸</div>';
  html += '<div class="tray-items' + (wasOpen ? '' : ' hidden') + '">';
  if (!items.length) {
    html += '<div class="tray-empty">Play to find toys!</div>';
  } else {
    items.forEach(function (id) {
      var item = ITEMS[id];
      var worn = Inventory.equipped()[id] ? ' worn' : '';
      html += '<button class="tray-item' + worn + '" data-item="' + id + '" aria-label="' + item.name + '">' +
        '<span class="tray-icon">' + item.icon + '</span><span class="tray-name">' + item.name + '</span></button>';
    });
  }
  html += '</div>';
  tray.innerHTML = html;
  tray.querySelector('.tray-handle').addEventListener('pointerdown', function (ev) {
    ev.stopPropagation();
    tray.querySelector('.tray-items').classList.toggle('hidden');
    G.sfx('click');
  });
  tray.querySelectorAll('.tray-item').forEach(function (btn) {
    btn.addEventListener('pointerdown', function (ev) {
      ev.stopPropagation();
      AudioSys.ensure();
      var id = btn.dataset.item;
      if (ITEMS[id] && ITEMS[id].wear) Inventory.toggleWear(id);
      else Inventory.give(id);
    });
  });
};

/* ---------- room action helpers ---------- */
G.wearPajamas = async function () {
  await Nicko.walkTo(60);
  G.sfx('pop');
  Nicko.syncWear({ pajamas: true });
  G.sfx('giggle');
  await Nicko.react('love');
  Needs.rest(8);
  G.setFlag('pajamasOn', true);
};

G.sinkTap = async function () {
  var on = !G.flag('waterOn');
  G.setFlag('waterOn', on);
  var el = G.el('sink');
  if (el) {
    var spout = el.querySelector('.sink-water');
    if (spout) spout.style.display = on ? '' : 'none';
    el.classList.toggle('water-on', on);
  }
  G.sfx(on ? 'splash' : 'click');
  if (on) {
    await Nicko.react('wow');
    G.setGlow('soap', true);
    if (G.once('waterHint')) Nicko.think('🧼');
  } else {
    await Nicko.react('happy', 900);
  }
};

G.soapTap = async function () {
  if (!G.flag('waterOn')) {
    await Nicko.react('confused');
    Nicko.think('🚰');
    G.setGlow('sink', true);
    return;
  }
  G.setFlag('soaped', true);
  G.sfx('scrub');
  for (var i = 0; i < 6; i++) G.sparkleAt(Nicko.pos() + (Math.random() * 10 - 5), 55 + Math.random() * 10, 2);
  await Nicko.action('shakeoff');
  await Nicko.react('wow');
  Needs.change('clean', 10);
  G.setGlow('towel', true);
  Nicko.think('🛁');
};

G.towelTap = async function () {
  if (!G.flag('soaped')) {
    await Nicko.react('confused');
    Nicko.think('🧼');
    G.setGlow('soap', true);
    return;
  }
  G.sfx('pop');
  await Nicko.action('wiggle');
  G.sfx('purr');
  await Nicko.react('happy');
  Needs.change('clean', 55);
  Nicko.mood('dirty', false);
  G.setFlag('soaped', false);
  if (G.once('fullBath')) {
    G.achieve('clean-paws');
    G.collect('print-bathroom');
  }
};

G.fridgeTap = async function () {
  var open = !G.flag('fridgeOpen');
  G.setFlag('fridgeOpen', open);
  var el = G.el('fridge');
  G.sfx(open ? 'pop' : 'click');
  if (open) {
    if (el) el.classList.add('fridge-open');
    await Nicko.react('wow');
    var fishDef = {
      id: 'fish', x: 44, y: 50, w: 9, label: 'Fish', glow: true, drag: true,
      svg: '<svg viewBox="0 0 90 70"><ellipse cx="40" cy="38" rx="24" ry="16" fill="#6BA8E8"/><path d="M62 38 L82 24 L82 52 Z" fill="#4A7FC1"/><circle cx="30" cy="34" r="4" fill="#1E2A33"/><path d="M40 22 q6 -8 14 -6" stroke="#4A7FC1" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
      onTap: async function (g) { await Feed.feedFood(g, 'fish', false); }
    };
    var brocDef = {
      id: 'broccoli', x: 52, y: 58, w: 8, label: 'Broccoli', glowSoft: true, drag: true,
      svg: '<svg viewBox="0 0 70 80"><rect x="30" y="46" width="10" height="26" rx="4" fill="#7CB85C"/><circle cx="22" cy="34" r="12" fill="#3E8E3E"/><circle cx="40" cy="28" r="13" fill="#4CA64C"/><circle cx="52" cy="38" r="11" fill="#3E8E3E"/></svg>',
      onTap: async function (g) { await Feed.feedFood(g, 'broccoli', false); }
    };
    if (!G.el('fish')) G.spawn(fishDef);
    if (!G.el('broccoli')) G.spawn(brocDef);
    var opens = (G.flag('fridgeOpens') || 0) + 1;
    G.setFlag('fridgeOpens', opens);
    if (opens === 3 && Secrets.found('fridgeClimb')) {
      await Nicko.walkTo(46);
      G.sfx('whoosh');
      await Nicko.action('wiggle', 1500);
      G.sfx('giggle');
      await Nicko.react('surprised', 1200);
      Nicko.think('❄️');
    }
  } else {
    if (el) el.classList.remove('fridge-open');
    G.despawn('fish');
    G.despawn('broccoli');
  }
};

G.waterFlowers = async function () {
  var grown = G.flag('flowersGrown');
  G.sfx('splash');
  var el = G.el('flowers');
  if (el) { el.classList.remove('bloom'); void el.offsetWidth; el.classList.add('bloom'); }
  await Nicko.walkTo(28);
  G.sparkleAt(28, 62, 10);
  await Nicko.react('happy');
  if (!grown) {
    G.setFlag('flowersGrown', true);
    if (G.once('flowersWatered')) {
      G.points(10);
      G.yardDiscover('flowers');
    }
  }
  Needs.play(6);
};

G.toggleTv = async function () {
  var on = !G.flag('tvOn');
  G.setFlag('tvOn', on);
  var el = G.el('tv');
  if (el) {
    var screen = el.querySelector('.tv-screen');
    if (screen) screen.setAttribute('fill', on ? '#7ECBF2' : '#1E262E');
    if (on) {
      screen.innerHTML = '<circle cx="60" cy="46" r="16" fill="#FFD65A"/><rect x="100" y="30" width="40" height="30" rx="6" fill="#FF9D6B"/>';
      el.classList.add('tv-on');
    } else {
      screen.innerHTML = '';
      el.classList.remove('tv-on');
    }
  }
  G.sfx(on ? 'magic' : 'click');
  if (on) {
    await Nicko.action('dance');
    await Nicko.react('music');
    Needs.play(8);
    if (G.once('tvFun')) G.points(5);
  }
};

G.tossPaper = async function () {
  var el = G.el('paperball');
  if (!el) {
    G.spawn({
      id: 'paperball', x: 78, y: 40, w: 7, label: 'Crumpled paper', drag: true, glowSoft: true,
      svg: '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="22" fill="#F4F1E8" stroke="#D8D2C2" stroke-width="4"/><path d="M16 28 q10 -8 20 0 q10 -8 14 2" stroke="#D8D2C2" stroke-width="3" fill="none"/></svg>',
      onTap: async function (g) { await g.tossPaper(); }
    });
    if (G.once('paperHint')) G.toast('Drag the paper into the trash!', '🗑️');
    return;
  }
  G.sfx('whoosh');
  await G.sendTo('paperball', 86, 60, 600);
  G.despawn('paperball');
  G.sfx('pop');
  await Nicko.react('happy', 900);
  if (G.once('trashToss')) G.points(5);
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
    goto: prev,
    onTap: async function () { await G.gotoRoom(prev, 'left'); } });
  var dr = addObject({ id: '__doorR', x: 95, y: 62, w: 9, label: 'Go to ' + ROOMS[next].label, svg: doorSvg('right', next),
    goto: next,
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
  /* respawn anything the child is carrying through the door */
  if (window.Drag && Drag.hasCarried()) {
    var carried = Drag.takeCarried();
    carried.def.x = entry === 'right' ? 20 : 78;
    carried.def.y = 74;
    addObject(carried.def);
    if (carried.def.draggableOnce) carried.def.drag = false;
  }
  if (entry === 'right') { Nicko.face('right'); Nicko.setX(14); }
  else if (entry === 'left') { Nicko.face('left'); Nicko.setX(86); }
  else { Nicko.setX(current === 'backyard' ? 30 : 50); }
  Nicko.syncWear();
  G.renderNeeds();
  G.renderTray();
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
  if (window.Drag && Drag.isActive()) return;
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
  var html = '<h2>🎒 Golden Paw Prints</h2><p class="sub">' + G.S.collectibles.length + ' of 10 found</p><div class="collect-grid">' +
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

/* ---------- opening: a child should be playing within 20 seconds ---------- */
async function opening() {
  await G.wait(600);
  try {
    var el = G.spawn({ id: '__fly0', x: -10, y: 24, w: 9, label: '', svg: BUTTERFLY_SVG, onTap: async function () {} });
    if (el) el.style.pointerEvents = 'none';
    G.sfx('magic');
    G.sendTo('__fly0', 110, 20, 7000).then(function () { G.despawn('__fly0'); });
  } catch (e) {}
  await G.wait(1200);
  await Nicko.react('wow');
  G.setGlow('underbed', true);
  G.toast('Something sparkles under the bed!', '👆');
  await G.wait(9000);
  if (Date.now() - lastInteract > 12000) {
    G.toast('Psst... drag the pajamas to Nicko!', '👆');
  }
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
    /* drag & combos */
    await G.gotoRoom('bedroom', 'right');
    log(!!G.el('pajamas'), 'pajamas draggable object exists');
    await G.gotoRoom('kitchen', 'right');
    var h0 = Needs.get('hunger');
    await Drag.simulate('apple', '__nicko');
    log(Needs.get('hunger') > h0, 'apple->Nicko combo feeds (hunger ' + Math.round(h0) + ' -> ' + Math.round(Needs.get('hunger')) + ')');
    var r = await Drag.simulate('apple', 'stove');
    log(r === false, 'apple->stove has no combo (graceful fail)');
    Store.save();
    log(!!window.localStorage.getItem('nickoAdvSaveV1'), 'save v2 persists to localStorage');
    /* wash chain */
    await G.gotoRoom('bathroom', 'right');
    await G.objTap('sink'); await G.objTap('soap'); await G.objTap('towel');
    log(G.S.achievements.indexOf('clean-paws') >= 0, 'clean-paws achievement unlocked');
    log(!Nicko.isDirty(), 'paws are clean after wash chain');
    log(Needs.get('clean') > 80, 'cleanliness need rose (' + Math.round(Needs.get('clean')) + ')');
    /* bedroom print: peek under the bed */
    await G.gotoRoom('bedroom', 'right');
    await Drag.simulate('pajamas', '__nicko');
    log(!!G.flag('pajamasOn'), 'pajamas worn via drag combo');
    await G.objTap('underbed');
    log(G.S.collectibles.indexOf('print-bedroom') >= 0, 'bedroom golden print collected');
    /* blocks via drag combos */
    await G.gotoRoom('playroom', 'right');
    await Drag.simulate('blockA', 'blockB');
    await Drag.simulate('blockC', 'blockA');
    await Drag.simulate('blockB', 'blockC');
    log((G.flag('towerH') || 0) >= 3, 'blocks stack via drag (' + (G.flag('towerH') || 0) + ')');
    await G.objTap('tower');
    log(G.S.collectibles.indexOf('print-blocks') >= 0, 'builder print collected after topple');
    await G.objTap('ptoy1'); await G.objTap('ptoy2'); await G.objTap('ptoy3'); await G.objTap('ptoy4');
    log(G.S.achievements.indexOf('toy-master') >= 0, 'toy-master achievement unlocked');
    /* inventory */
    await G.gotoRoom('living', 'right');
    await G.objTap('cushion');
    log(Inventory.has('toyMouse'), 'toy mouse unlocked to toybox');
    /* backyard */
    await G.gotoRoom('backyard', 'right');
    await G.objTap('sandbox');
    log(G.S.collectibles.indexOf('print-backyard') >= 0, 'backyard print dug up');
    log(G.S.achievements.indexOf('house-explorer') >= 0, 'house-explorer achievement unlocked');
    Store.save();
    var raw = null;
    try { raw = window.localStorage.getItem('nickoAdvSaveV1'); } catch (e) {}
    log(!!raw && JSON.parse(raw).v === 2, 'save schema is version 2');
    /* sounds referenced by the new code */
    ['pickup', 'munch', 'tummy', 'yawn', 'sneeze'].forEach(function (sn) {
      log(!!AudioSys.has(sn), 'sound "' + sn + '" exists');
    });
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
  renderRoom('bedroom', null);
  Nicko.setX(50);
  /* restore persistent dirty state from the cleanliness need */
  Nicko.mood('dirty', Needs.get('clean') < 60);
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
