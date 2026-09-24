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
/* auto-dismiss timer for the Golden Paw Print celebration modal */
var goldTimer = null;

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
function dismissToast(el) {
  if (!el || el.classList.contains('out')) return;
  el.classList.add('out');
  setTimeout(function () { el.remove(); }, 350);
}
G.toast = function (msg, icon) {
  var wrap = $('#toast-wrap');
  var el = document.createElement('div');
  el.className = 'toast';
  el.textContent = (icon ? icon + ' ' : '') + msg;
  el.addEventListener('click', function () { dismissToast(el); });
  wrap.appendChild(el);
  while (wrap.children.length > 2) wrap.removeChild(wrap.firstChild);
  setTimeout(function () { dismissToast(el); }, 2400);
  lastInteract = Date.now();
};

/* A hint for kids who can't read: the bubble sits at the top (never over
   Nicko), a bouncing sparkle marks the exact object, and a speaker button
   reads the hint aloud with the device's own voice. No network, no service. */
G.hint = function (msg, icon, targetId) {
  var wrap = $('#toast-wrap');
  var el = document.createElement('div');
  el.className = 'toast hint-toast';
  var inner = '<span class="hint-text">' + (icon ? icon + ' ' : '') + msg + '</span>';
  if ('speechSynthesis' in window) {
    inner = '<button class="hint-speak" aria-label="Hear the hint">🔊</button>' + inner;
  }
  el.innerHTML = inner;
  el.addEventListener('click', function (ev) {
    if (ev.target.closest('.hint-speak')) return;
    dismissToast(el);
  });
  var speakBtn = el.querySelector('.hint-speak');
  if (speakBtn) speakBtn.addEventListener('click', function (ev) {
    ev.stopPropagation();
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(msg);
      u.pitch = 1.25; u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  });
  wrap.appendChild(el);
  while (wrap.children.length > 2) wrap.removeChild(wrap.firstChild);
  setTimeout(function () { dismissToast(el); }, 5000);
  lastInteract = Date.now();
  /* bouncing sparkle directly over the thing the hint is about */
  if (targetId) {
    var t = G.el(targetId);
    if (t && !t.querySelector('.hint-marker')) {
      var m = document.createElement('div');
      m.className = 'hint-marker';
      m.textContent = '✨';
      t.appendChild(m);
      setTimeout(function () { if (m.parentNode) m.parentNode.removeChild(m); }, 5000);
    }
  }
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
    if (window.FX) FX.pips(Nicko.pos(), 30, Math.max(2, Math.min(5, Math.round(n / 4))));
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
  if (window.FX) FX.sticker(def.icon, def.name);
  Nicko.react('proud', 1600);
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
  G.points(10);
  /* The big moment: golden glow -> print reveal -> sparkle burst -> Nicko celebrates. */
  var name = def ? def.name : 'Golden Paw Print';
  var nx = Nicko.pos();
  if (window.FX) FX.goldenPaw(nx, 42, name, G.S.collectibles.length + ' of 10 found');
  Nicko.setFace('surprised');
  setTimeout(function () { Nicko.react('love', 1800); }, 500);
  setTimeout(function () {
    openModal('<div class="gold-card-inner"><div class="big-paw">🐾</div>' +
      '<p class="sub">A Golden Paw Print!</p><h2>' + name + '</h2>' +
      '<p class="sub">' + G.S.collectibles.length + ' of 10 found</p></div>' +
      '<button class="modal-close">Keep playing!</button>', true);
    /* The celebration must never trap play: if the child keeps playing
       instead of closing it, it quietly goes away on its own. */
    if (goldTimer) clearTimeout(goldTimer);
    goldTimer = setTimeout(function () {
      goldTimer = null;
      var w = $('#modal-wrap');
      if (!w.classList.contains('hidden') && w.querySelector('.gold-card')) closeModal();
    }, 7000);
  }, 2100);
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
  } finally {
    /* The lock must always release, even if a walk is interrupted or a
       handler throws; otherwise every later tap is ignored (dead game). */
    locked = false;
  }
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
  await G.sendTo(blockId, 58, 72 - n * 10, 500);
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
  if (n === 0) { G.hint('Tap the blocks to stack them!', '🧱', 'tower'); return; }
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
  G.setFlag('pajamasOn', true);
  Nicko.syncWear(Store.data.equipped);
  G.sfx('giggle');
  await Nicko.react('love');
  Needs.rest(8);
};

/* Visible running water: the sink SVG draws its stream in `.water-stream`
   (the old code looked for `.sink-water`, which never matched). */
G.setSinkWater = function (on) {
  G.setFlag('waterOn', !!on);
  var el = G.el('sink');
  if (el) el.classList.toggle('water-on', !!on);
};

G.sinkTap = async function () {
  var on = !G.flag('waterOn');
  G.setSinkWater(on);
  if (window.Living) Living.sinkToggled();
  G.sfx(on ? 'splash' : 'click');
  if (on) {
    G.splashAt(20, 68);
    /* splashing at the sink gets him a little damp */
    if (window.Living) Living.setWet(true);
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
  /* scrubbing under running water: now he is wet AND soapy */
  if (window.Living) Living.soapScrubbed();
  G.sfx('scrub');
  for (var i = 0; i < 6; i++) G.sparkleAt(Nicko.pos() + (Math.random() * 10 - 5), 55 + Math.random() * 10, 2);
  if (window.FX) FX.bubbles(Nicko.pos(), 58, 10);
  await Nicko.action('shakeoff');
  await Nicko.react('wow');
  Needs.change('clean', 10);
  G.setGlow('towel', true);
  Nicko.think('🛁');
};

G.towelTap = async function () {
  if (!G.flag('soaped')) {
    if (!G.flag('waterOn')) {
      /* towel before water: the water needs to be on first */
      await Nicko.react('confused');
      Nicko.think('🚰');
      G.setGlow('sink', true);
      return;
    }
    if ((window.Living && Living.isWet()) || Nicko.isDirty()) {
      /* damp or grubby but not soapy: a quick pat dry, no full wash */
      G.sfx('pop');
      await Nicko.action('wiggle');
      if (window.Living) Living.setWet(false);
      Needs.change('clean', 10);
      await Nicko.react('happy', 900);
      return;
    }
    /* already clean and dry: the towel is just cozy */
    G.sfx('pop');
    await Nicko.action('wiggle');
    G.sfx('purr');
    await Nicko.react('veryHappy', 1100);
    return;
  }
  G.sfx('pop');
  await Nicko.action('wiggle');
  if (window.FX) FX.bubbles(Nicko.pos(), 58, 6);
  G.sfx('purr');
  await Nicko.react('veryHappy', 1300);
  Needs.change('clean', 55);
  Nicko.mood('dirty', false);
  if (window.Living) Living.towelDried();
  else G.setFlag('soaped', false);
  if (G.once('fullBath')) {
    G.achieve('clean-paws');
    G.collect('print-bathroom');
  }
};

/* The foods live inside the fridge; extracted so room re-entry can
   respawn the exact same visible open-fridge state the child left. */
function fridgeFoodDefs() {
  return [
    { id: 'fish', x: 44, y: 50, w: 9, label: 'Fish', glow: true, drag: true,
      svg: '<svg viewBox="0 0 90 70"><ellipse cx="40" cy="38" rx="24" ry="16" fill="#6BA8E8"/><path d="M62 38 L82 24 L82 52 Z" fill="#4A7FC1"/><circle cx="30" cy="34" r="4" fill="#1E2A33"/><path d="M40 22 q6 -8 14 -6" stroke="#4A7FC1" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
      onTap: async function (g) { await Feed.feedFood(g, 'fish', false); } },
    { id: 'broccoli', x: 52, y: 58, w: 8, label: 'Broccoli', glowSoft: true, drag: true,
      svg: '<svg viewBox="0 0 70 80"><rect x="30" y="46" width="10" height="26" rx="4" fill="#7CB85C"/><circle cx="22" cy="34" r="12" fill="#3E8E3E"/><circle cx="40" cy="28" r="13" fill="#4CA64C"/><circle cx="52" cy="38" r="11" fill="#3E8E3E"/></svg>',
      onTap: async function (g) { await Feed.feedFood(g, 'broccoli', false); } }
  ];
}

G.applyFridge = function (open) {
  G.setFlag('fridgeOpen', !!open);
  var el = G.el('fridge');
  if (open) {
    if (el) el.classList.add('fridge-open');
    fridgeFoodDefs().forEach(function (d) { if (!G.el(d.id)) G.spawn(d); });
  } else {
    if (el) el.classList.remove('fridge-open');
    G.despawn('fish');
    G.despawn('broccoli');
  }
};

G.fridgeTap = async function () {
  var open = !G.flag('fridgeOpen');
  G.applyFridge(open);
  G.sfx(open ? 'pop' : 'click');
  if (open) {
    await Nicko.react('wow');
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
    /* A lasting consequence: watered flowers stay visibly grown. */
    if (el) el.classList.add('grown');
    if (G.once('flowersWatered')) {
      G.points(10);
      G.yardDiscover('flowers');
    }
  }
  Needs.play(6);
};

G.applyTv = function (on) {
  G.setFlag('tvOn', !!on);
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
};

G.toggleTv = async function () {
  var on = !G.flag('tvOn');
  G.applyTv(on);
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
    if (G.once('paperHint')) G.hint('Drag the paper into the trash!', '🗑️', 'paperball');
    return;
  }
  G.sfx('whoosh');
  await G.sendTo('paperball', 86, 60, 600);
  G.despawn('paperball');
  G.sfx('pop');
  await Nicko.react('happy', 900);
  if (G.once('trashToss')) G.points(5);
};

/* ---------- persistent visible states ----------
   Saved flags (blanketOnBed, waterOn, fridgeOpen, tvOn, lampOn, flowersGrown)
   are restored on every room entry so the room always looks the way the
   child left it. The child's actions must be trustworthy. */
G.showBlanketOnBed = function (on) {
  var el = G.el('bed');
  if (!el) return;
  var old = el.querySelector('.bed-blanket');
  if (old) old.remove();
  if (!on) return;
  var svg = el.querySelector('svg');
  if (!svg) return;
  var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('class', 'bed-blanket');
  g.innerHTML = '<rect x="150" y="56" width="112" height="58" rx="16" fill="#C49BE8" stroke="#A87FD0" stroke-width="4"/>' +
    '<rect x="150" y="98" width="112" height="12" fill="#A87FD0"/>' +
    '<circle cx="188" cy="78" r="9" fill="#FFD65A"/>' +
    '<circle cx="224" cy="74" r="9" fill="#FF9DC6"/>';
  svg.appendChild(g);
};

/* The lights-out stars (spawned by the lamp, and restored on room entry). */
G.spawnStars = function () {
  if (G.el('__stars')) return;
  G.spawn({ id: '__stars', x: 50, y: 26, w: 30, label: 'Stars',
    svg: '<svg viewBox="0 0 300 90"><g fill="#FFE9A8"><path d="M30 20 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 Z"/><path d="M90 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z"/><path d="M160 16 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 Z"/><path d="M220 44 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z"/><path d="M270 22 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 Z"/></g></svg>',
    onTap: async function (G2) {
      /* the coziest night: pajamas + blanket + lights out = a dream */
      if (window.Living) await Living.starsDream();
      await Nicko.react('wow');
      G2.sparkleAt(50, 24, 10);
      if (Secrets.found('stars')) {
        G2.collect('print-night');
      }
    } });
};

function restoreRoomState(id) {
  /* Worn accessories + pajamas must survive room changes. */
  Nicko.syncWear(Store.data.equipped);
  /* The living-world layer reapplies believable body states (dirty, wet)
     so a mid-bath room change or a reload keeps Nicko looking right. */
  if (window.Living) Living.restoreNicko();
  if (id === 'bedroom') {
    if (G.flag('blanketOnBed')) G.showBlanketOnBed(true);
    /* unlocked hatch: the padlock is gone */
    if (G.flag('hideoutUnlocked')) {
      var hatchEl = G.el('hatch');
      if (hatchEl) hatchEl.classList.add('unlocked');
    }
    if (G.flag('lampOn') === false) {
      G.dim(true);
      var lampEl = G.el('lamp');
      if (lampEl) { var gl = lampEl.querySelector('.lamp-glow'); if (gl) gl.setAttribute('opacity', '0.85'); }
      G.spawnStars();
    }
  } else if (id === 'bathroom') {
    if (G.flag('waterOn')) G.setSinkWater(true);
  } else if (id === 'kitchen') {
    if (G.flag('fridgeOpen')) G.applyFridge(true);
  } else if (id === 'living') {
    if (G.flag('tvOn')) G.applyTv(true);
  } else if (id === 'backyard') {
    if (G.flag('flowersGrown')) { var fl = G.el('flowers'); if (fl) fl.classList.add('grown'); }
  } else if (id === 'hideout') {
    G.refreshHideout();
  }
}

/* ---------- doors & navigation ---------- */
function doorSvg(dir, neighbor) {
  var icon = ROOMS[neighbor].icon;
  var arrow = dir === 'right' ? '➡️' : '⬅️';
  return '<svg viewBox="0 0 100 160">' +
    '<defs><linearGradient id="doorG" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" stop-color="#B07B4A"/><stop offset="0.5" stop-color="#C9975F"/><stop offset="1" stop-color="#A96F3E"/>' +
    '</linearGradient></defs>' +
    '<ellipse cx="50" cy="152" rx="40" ry="7" fill="rgba(90,55,25,0.25)"/>' +
    '<rect x="12" y="8" width="76" height="144" rx="34" fill="url(#doorG)" stroke="#7C4F22" stroke-width="3"/>' +
    '<rect x="24" y="24" width="52" height="46" rx="18" fill="#8A5A30" opacity="0.55"/>' +
    '<rect x="24" y="80" width="52" height="58" rx="14" fill="#8A5A30" opacity="0.55"/>' +
    '<rect x="28" y="28" width="44" height="38" rx="14" fill="none" stroke="#E8C98F" stroke-width="2.5" opacity="0.7"/>' +
    '<rect x="28" y="84" width="44" height="50" rx="10" fill="none" stroke="#E8C98F" stroke-width="2.5" opacity="0.7"/>' +
    '<circle cx="68" cy="104" r="7" fill="#FFD166" stroke="#B57E1B" stroke-width="2.5"/>' +
    '<circle cx="68" cy="104" r="2.5" fill="#FFF3D0"/></svg>' +
    '<div class="door-arrow" style="position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:30px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.25));">' + arrow + '</div>' +
    '<div style="position:absolute;bottom:-12px;left:50%;transform:translateX(-50%);font-size:24px;background:#FFFDF7;border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;border:3px solid #FFD166;box-shadow:0 4px 10px rgba(60,40,20,.25);">' + icon + '</div>';
}

function addDoors() {
  /* The Hero Hideout is secret: not in the door loop. One door leads home. */
  if (current === 'hideout') {
    var back = addObject({ id: '__doorBack', x: 5, y: 62, w: 9, label: 'Back to the bedroom',
      svg: doorSvg('left', 'bedroom'), goto: 'bedroom',
      onTap: async function () { await G.gotoRoom('bedroom', 'left'); } });
    back.classList.add('door', 'door-left');
    objectsEl.insertBefore(back, objectsEl.firstChild);
    objDefs.__doorBack = back._def;
    return;
  }
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
  /* Deliberate stacking: room objects render above doors, so a room object
     always wins a tap over a door's invisible padding (lamp vs left door,
     cat tree vs right door). Doors stay fully tappable everywhere else, and
     drag carry-through still checks doors first in Drag.findTarget. */
  objectsEl.insertBefore(dr, objectsEl.firstChild);
  objectsEl.insertBefore(dl, objectsEl.firstChild);
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
  restoreRoomState(id);
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
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  /* Keyboard moves obey the same rules as taps: never interrupt an object
     interaction (that used to strand the tap lock) or a modal. */
  if (locked) return;
  if (!$('#modal-wrap').classList.contains('hidden')) return;
  AudioSys.ensure();
  Nicko.walkTo(Nicko.pos() + (e.key === 'ArrowRight' ? 10 : -10));
});

/* ---------- modals ---------- */
function openModal(html, gold) {
  var w = $('#modal-wrap');
  w.innerHTML = '<div class="modal-card' + (gold ? ' gold-card' : '') + '">' + html + '</div>';
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
  if (goldTimer) { clearTimeout(goldTimer); goldTimer = null; }
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

/* ---------- Hero Hideout: picture code, parent gate, badges ----------
   The book "Nicko's 7-Day Little Hero Adventure" hides a secret code that
   unlocks this room. Non-readers unlock it with pictures: tap the 7 hero
   badges in the secret order (lion, heart, star, shield). */
G.openCodeScreen = function () {
  var badges = window.HERO_BADGES;
  var taps = [];
  var html = '<h2>🔐 Secret Code</h2><p class="sub">Tap the hero badges in the secret order!</p>' +
    '<div class="code-slots">' +
    [0, 1, 2, 3].map(function () { return '<div class="code-slot"></div>'; }).join('') +
    '</div><div class="code-grid">' +
    badges.map(function (b) {
      return '<button class="code-btn" data-id="' + b.id + '" aria-label="' + b.name + '"><span>' + b.icon + '</span></button>';
    }).join('') +
    '<button class="code-btn code-undo" data-undo="1" aria-label="Undo"><span>↩️</span></button>' +
    '</div><button class="grownups-link">Grown-ups: get the code</button>' +
    '<button class="modal-close">Keep playing</button>';
  openModal(html);
  var w = $('#modal-wrap');
  var slots = w.querySelectorAll('.code-slot');
  function render() {
    for (var i = 0; i < slots.length; i++) {
      var b = null;
      if (taps[i]) {
        for (var j = 0; j < badges.length; j++) if (badges[j].id === taps[i]) b = badges[j];
      }
      slots[i].innerHTML = b ? b.icon : '';
      slots[i].classList.toggle('filled', !!b);
    }
  }
  w.querySelectorAll('.code-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.dataset.undo) { taps.pop(); render(); G.sfx('click'); return; }
      if (taps.length >= 4) return;
      taps.push(btn.dataset.id);
      render();
      G.sfx('pop');
      if (taps.length === 4) {
        var ok = true;
        for (var i = 0; i < 4; i++) if (taps[i] !== window.HERO_CODE[i]) ok = false;
        setTimeout(function () {
          if (ok) {
            G.setFlag('hideoutUnlocked', true);
            closeModal();
            G.celebrateUnlock();
          } else {
            /* gentle: wiggle, soft sound, clear, unlimited tries */
            var box = w.querySelector('.code-slots');
            if (box) box.classList.add('wiggle');
            G.sfx('boing');
            setTimeout(function () {
              if (box) box.classList.remove('wiggle');
              taps = []; render();
            }, 650);
          }
        }, 350);
      }
    });
  });
  var gl = w.querySelector('.grownups-link');
  if (gl) gl.addEventListener('click', function () { G.openParentGate(); });
};

/* Parent gate: "Grown-ups: tap forty-two", number in words, 6 shuffled
   number buttons. Wrong tap closes quietly. Only the right tap opens the
   book link, in a new tab. This is the ONLY store link in the game. */
G.openParentGate = function () {
  var nums = [24, 42, 12, 40, 44, 32];
  for (var i = nums.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = nums[i]; nums[i] = nums[j]; nums[j] = t;
  }
  var html = '<h2>🔒 Grown-ups</h2><p class="sub">Grown-ups: tap <b>forty-two</b></p>' +
    '<div class="gate-grid">' +
    nums.map(function (n) { return '<button class="gate-btn" data-n="' + n + '">' + n + '</button>'; }).join('') +
    '</div><button class="modal-close">Never mind</button>';
  openModal(html);
  var w = $('#modal-wrap');
  w.querySelectorAll('.gate-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (parseInt(btn.dataset.n, 10) === 42) {
        closeModal();
        try { window.open('https://payhip.com/b/9Wu4k', '_blank', 'noopener'); } catch (e) {}
      } else {
        closeModal();
      }
    });
  });
};

/* Unlock celebration: confetti sparkles, happy Nicko jump, cheerful sound,
   then Nicko enters the Hero Hideout. */
G.celebrateUnlock = async function () {
  G.sfx('fanfare');
  if (window.FX) { FX.sparkles(50, 35, 22); FX.hearts(50, 45, 8); }
  await Nicko.react('happy');
  G.toast('The secret hatch is open!', '🎉');
  await G.wait(900);
  await G.gotoRoom('hideout', 'right');
};

/* Light up one of the 7 hero badges on the hideout wall. */
G.lightBadge = async function (id) {
  if (!G.S.badges) G.S.badges = [];
  var el = G.el('badge-' + id);
  if (G.S.badges.indexOf(id) < 0) {
    G.S.badges.push(id);
    Store.save();
    if (el) el.classList.add('lit');
    G.sfx('chime');
    if (window.FX) FX.sparkles(50, 30, 10);
  } else {
    G.sfx('pop');
  }
  await Nicko.react('happy', 900);
};

/* The secret 8th badge: a golden "Little Hero" star with a red ribbon. */
G.revealHeroBadge = async function () {
  if (!G.S.badges) G.S.badges = [];
  var el = G.el('badge-mystery');
  if (G.S.badges.indexOf('littlehero') >= 0) {
    G.sfx('pop');
    await Nicko.react('happy', 900);
    return;
  }
  G.S.badges.push('littlehero');
  Store.save();
  G.sfx('fanfare');
  if (window.FX) { FX.sparkles(50, 45, 24); FX.hearts(50, 50, 10); }
  if (el) {
    el.classList.add('revealed');
    el.innerHTML = '<div class="badge-medal lit hero-star"><div class="hero-ribbon"></div><span class="badge-icon">⭐</span><div class="hero-label">Little Hero</div></div>';
  }
  await Nicko.react('wow');
  G.toast('You earned the secret Little Hero badge!', '🌟');
  G.achieve('secret-seeker');
};

/* Reapply saved badge states when entering the hideout. */
G.refreshHideout = function () {
  var badges = G.S.badges || [];
  window.HERO_BADGES.forEach(function (b) {
    var el = G.el('badge-' + b.id);
    if (el && badges.indexOf(b.id) >= 0) el.classList.add('lit');
  });
  if (badges.indexOf('littlehero') >= 0) {
    var m = G.el('badge-mystery');
    if (m && !m.classList.contains('revealed')) {
      m.classList.add('revealed');
      m.innerHTML = '<div class="badge-medal lit hero-star"><div class="hero-ribbon"></div><span class="badge-icon">⭐</span><div class="hero-label">Little Hero</div></div>';
    }
  }
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

/* gentle needs decay: the care loop Needs.tick was designed for. Needs sit
   at their floors while a modal is open or an interaction runs, and never
   while the tab is hidden. */
setInterval(function () {
  if (document.hidden || locked) return;
  if (!$('#modal-wrap').classList.contains('hidden')) return;
  Needs.tick();
}, 45000);

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
  G.sparkleAt(Nicko.pos(), 55, 6);
  G.sfx('happyMeow');
  G.setGlow('underbed', true);
  G.hint('Something sparkles under the bed!', '👆', 'bed');
  await G.wait(9000);
  if (Date.now() - lastInteract > 12000) {
    G.hint('Psst... drag the pajamas to Nicko!', '👆', 'pajamas');
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
    /* wash chain + faucet: visible running water that persists across rooms */
    await G.gotoRoom('bathroom', 'right');
    await G.objTap('sink');
    var stream = G.el('sink').querySelector('.water-stream');
    log(!!stream && window.getComputedStyle(stream).opacity === '1', 'faucet stream visible when water on');
    await G.gotoRoom('kitchen', 'right');
    await G.gotoRoom('bathroom', 'right');
    log(!!G.flag('waterOn') && G.el('sink').classList.contains('water-on'), 'faucet stays on after room return');
    await G.objTap('soap'); await G.objTap('towel');
    log(G.S.achievements.indexOf('clean-paws') >= 0, 'clean-paws achievement unlocked');
    log(!Nicko.isDirty(), 'paws are clean after wash chain');
    log(Needs.get('clean') > 80, 'cleanliness need rose (' + Math.round(Needs.get('clean')) + ')');
    await G.objTap('sink');
    log(!G.flag('waterOn'), 'faucet turns off');
    /* ---- living-world chain tests ---- */
    /* Chain B happy path: dirty -> wet -> soapy -> clean and dry */
    Needs.change('clean', -60); Nicko.mood('dirty', true); Nicko.mood('wet', false);
    await G.objTap('sink');
    log(!!G.flag('waterOn') && !!G.flag('wetPaws') && Nicko.isWet(), 'bath: water on makes Nicko wet');
    await G.objTap('soap');
    log(!!G.flag('soaped'), 'bath: soap under water sets soapy');
    await G.objTap('towel');
    log(!Nicko.isDirty() && !Nicko.isWet() && !G.flag('soaped'), 'bath: towel finishes clean and dry');
    await G.objTap('sink');
    /* Chain B wrong order: towel before water */
    G.setFlag('waterOn', false);
    await G.objTap('towel');
    log(!G.flag('soaped') && !Nicko.isWet(), 'bath wrong order: towel before water does not wash');
    /* Chain B wrong order: soap while dry (water off) */
    await G.objTap('soap');
    log(!G.flag('soaped'), 'bath wrong order: soap while dry does not soap');
    /* cozy towel on a clean dry cat: harmless, stays clean */
    var cleanBefore = Needs.get('clean');
    await G.objTap('towel');
    log(Needs.get('clean') >= cleanBefore, 'bath: cozy towel on clean cat is harmless');
    /* mid-bath room change keeps the state trustworthy */
    await G.objTap('sink'); await G.objTap('soap');
    await G.gotoRoom('kitchen', 'right');
    await G.gotoRoom('bathroom', 'right');
    log(!!G.flag('waterOn') && !!G.flag('soaped') && Nicko.isWet(), 'bath: wet+soapy survive a room change');
    await G.objTap('towel');
    await G.objTap('sink');
    log(!Nicko.isWet() && !G.flag('waterOn'), 'bath: dried and faucet off after return');
    /* reload-style restore: flags set, visuals reapplied */
    G.setFlag('wetPaws', true);
    window.Living.restoreNicko();
    log(Nicko.isWet(), 'bath: wet visual restored from save');
    G.setFlag('wetPaws', false);
    window.Living.restoreNicko();
    log(!Nicko.isWet(), 'bath: dry visual restored from save');
    /* Chain A: repeated food keeps feeding, personality varies, no punishment */
    await G.gotoRoom('kitchen', 'right');
    var hu0 = Needs.get('hunger');
    await Feed.feedFood(G, 'apple', false);
    await Feed.feedFood(G, 'apple', false);
    await Feed.feedFood(G, 'apple', false);
    log(Needs.get('hunger') >= hu0, 'food: repeated feeding still fills (no punishment)');
    /* Chain D: repeated watering is safe; rain grows thirsty flowers */
    await G.gotoRoom('backyard', 'right');
    await G.waterFlowers();
    await G.waterFlowers();
    log(!!G.flag('flowersGrown'), 'nature: repeated watering keeps flowers grown');
    G.setFlag('flowersGrown', false);
    var fl = G.el('flowers'); if (fl) fl.classList.remove('grown');
    await G.objTap('cloud');
    log(!!G.flag('flowersGrown'), 'nature: cloud rain grows thirsty flowers');
    /* Chain C: cozy bed combo (pajamas + blanket) settles cleanly */
    await G.gotoRoom('bedroom', 'right');
    G.setFlag('pajamasOn', true); G.setFlag('blanketOnBed', true);
    Nicko.syncWear(Store.data.equipped);
    await G.objTap('bed');
    log(!G.isLocked(), 'bedtime: cozy bed combo settles cleanly');
    G.setFlag('pajamasOn', false); G.setFlag('blanketOnBed', false);
    Nicko.syncWear(Store.data.equipped);
    /* bedroom print: peek under the bed */
    await G.gotoRoom('bedroom', 'right');
    /* P1 regression: an interrupted walk settles instead of stranding the lock */
    var wp1 = Nicko.walkTo(20);
    var wp2 = Nicko.walkTo(80);
    var walkSettled = false;
    await Promise.race([wp1.then(function () { walkSettled = true; }), G.wait(2500)]);
    log(walkSettled, 'interrupted walk settles its promise (no interaction lock)');
    await wp2;
    await G.objTap('bed');
    log(!G.isLocked(), 'tap lock released after walk interruption');
    await Drag.simulate('pajamas', '__nicko');
    log(!!G.flag('pajamasOn'), 'pajamas worn via drag combo');
    log(document.getElementById('nicko-wrap').classList.contains('nightcap'), 'nightcap visible after wearing pajamas');
    /* blanket: tray copies count as bed drop targets, and the blanket stays visible */
    log(Combos.has('inv_blanket', 'bed'), 'tray blanket recognized as bed drop target');
    Inventory.unlock('blanket');
    await Inventory.give('blanket');
    log(!!G.el('inv_blanket'), 'blanket spawns from toybox');
    var br = await Drag.simulate('inv_blanket', 'bed');
    log(br === 'consume' && !!G.flag('blanketOnBed'), 'blanket->bed combo consumes and flags');
    log(!!(G.el('bed') && G.el('bed').querySelector('.bed-blanket')), 'blanket visible on the bed');
    await G.gotoRoom('kitchen', 'right');
    await G.gotoRoom('bedroom', 'right');
    log(!!(G.el('bed') && G.el('bed').querySelector('.bed-blanket')), 'blanket still on bed after room return');
    /* worn accessories survive room changes */
    Store.data.equipped.hat = true; Store.save();
    Nicko.syncWear(Store.data.equipped);
    await G.gotoRoom('kitchen', 'right');
    await G.gotoRoom('bedroom', 'right');
    var hatEl = document.querySelector('#nicko .acc-hat');
    log(!!hatEl && hatEl.style.display === 'block', 'worn hat stays visible after room change');
    delete Store.data.equipped.hat; Store.save();
    Nicko.syncWear(Store.data.equipped);
    /* lamp-off state restores on room return */
    G.setFlag('lampOn', false);
    await G.gotoRoom('kitchen', 'right');
    await G.gotoRoom('bedroom', 'right');
    var lampGlow = G.el('lamp').querySelector('.lamp-glow');
    log(!!lampGlow && lampGlow.getAttribute('opacity') === '0.85', 'lamp-off glow restored on room return');
    log(!!G.el('__stars'), 'stars restored when lamp is off');
    G.setFlag('lampOn', true);
    G.despawn('__stars');
    G.dim(false);
    var lg2 = G.el('lamp').querySelector('.lamp-glow');
    if (lg2) lg2.setAttribute('opacity', '0.0');
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
    /* care loop: Needs.tick runs and decays gently */
    var hungBefore = Needs.get('hunger');
    Needs.tick();
    log(Needs.get('hunger') <= hungBefore, 'needs tick decays gently (hunger ' + Math.round(hungBefore) + ' -> ' + Math.round(Needs.get('hunger')) + ')');
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
  if (window.FX) FX.init();
  renderRoom('bedroom', null);
  Nicko.setX(50);
  /* persistent dirty/wet visuals are restored by renderRoom via
     Living.restoreNicko, so the boot state always matches the save */
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
