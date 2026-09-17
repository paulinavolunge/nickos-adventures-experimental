/* Nicko's Adventures - reusable drag & drop + combination system.
   Any object def can set drag:true to become pickable. Drop targets declare
   accepts:[ids] (or acceptAny:true) plus onDrop. Named combinations live in
   Combos. Dropping on Nicko or on a door also works. Invalid combos get a
   funny confused reaction and the item floats home. Touch + mouse + keyboard
   accessible via pointer events. */
window.Drag = (function () {
  'use strict';
  var active = null;        // def being dragged
  var activeEl = null;
  var startPX = 0, startPY = 0;
  var moved = false;
  var home = null;          // {x, y} percent to return to
  var carried = null;       // {id, def} carried through a door

  function stagePos(clientX, clientY) {
    var r = document.getElementById('stage').getBoundingClientRect();
    return { x: (clientX - r.left) / r.width * 100, y: (clientY - r.top) / r.height * 100 };
  }
  function elCenter(el) {
    var r = el.getBoundingClientRect();
    var s = document.getElementById('stage').getBoundingClientRect();
    return { x: (r.left + r.width / 2 - s.left) / s.width * 100,
             y: (r.top + r.height / 2 - s.top) / s.height * 100 };
  }
  function hitRect(el, p) {
    var r = el.getBoundingClientRect();
    var s = document.getElementById('stage').getBoundingClientRect();
    var x = (p.x / 100) * s.width + s.left, y = (p.y / 100) * s.height + s.top;
    var pad = 14;
    return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;
  }

  /* Called from addObject's pointerdown when def.drag is set. */
  function press(def, el, ev) {
    active = def; activeEl = el;
    startPX = ev.clientX; startPY = ev.clientY;
    moved = false;
    home = { x: parseFloat(el.style.left) || def.x, y: parseFloat(el.style.top) || def.y };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up, { once: true });
    window.addEventListener('pointercancel', cancel, { once: true });
  }
  function move(ev) {
    if (!active) return;
    if (!moved && Math.hypot(ev.clientX - startPX, ev.clientY - startPY) < 12) return;
    if (!moved) {
      moved = true;
      activeEl.classList.add('dragging');
      activeEl.style.zIndex = 60;
      activeEl.style.pointerEvents = 'none';
      window.AudioSys.play('pickup');
      if (window.Nicko) Nicko.face(stagePos(ev.clientX, ev.clientY).x < Nicko.pos() ? 'left' : 'right');
    }
    var p = stagePos(ev.clientX, ev.clientY);
    activeEl.style.transition = 'none';
    activeEl.style.left = p.x + '%';
    activeEl.style.top = p.y + '%';
    /* highlight the drop target under the pointer */
    try {
      var tgt = findTarget(active, activeEl, p);
      var prev = document.querySelectorAll('#objects .obj.drop-hot');
      for (var i = 0; i < prev.length; i++) {
        if (!tgt || prev[i] !== tgt.el) prev[i].classList.remove('drop-hot');
      }
      if (tgt && tgt.el && !tgt.el.classList.contains('drop-hot')) {
        tgt.el.classList.add('drop-hot');
      }
    } catch (e) { /* highlight is best-effort */ }
  }
  function clearHot() {
    var prev = document.querySelectorAll('#objects .obj.drop-hot');
    for (var i = 0; i < prev.length; i++) prev[i].classList.remove('drop-hot');
  }
  function cleanupListeners() {
    window.removeEventListener('pointermove', move);
  }
  function cancel() {
    cleanupListeners();
    clearHot();
    if (activeEl) sendHome();
    active = null; activeEl = null;
  }
  function sendHome() {
    if (!activeEl || !home) return;
    var el = activeEl;
    el.classList.remove('dragging');
    el.style.pointerEvents = '';
    el.style.zIndex = '';
    el.style.transition = 'left .45s ease, top .45s ease';
    el.style.left = home.x + '%';
    el.style.top = home.y + '%';
    setTimeout(function () { try { el.style.transition = ''; } catch (e) {} }, 500);
  }

  async function up(ev) {
    cleanupListeners();
    clearHot();
    window.removeEventListener('pointercancel', cancel);
    var def = active, el = activeEl, h = home;
    active = null; activeEl = null; home = null;
    if (!def || !el) return;
    if (!moved) {
      /* It was a tap, not a drag: run the normal tap flow. */
      if (window.G && window.G.tapDef) window.G.tapDef(def, el);
      return;
    }
    el.classList.remove('dragging');
    el.style.pointerEvents = '';
    el.style.zIndex = '';
    el._home = h;
    var p = stagePos(ev.clientX, ev.clientY);
    var target = findTarget(def, el, p);
    if (!target) { tweenHome(el, h); return; }
    await resolveDrop(def, el, target, p, h);
  }
  function tweenHome(el, h) {
    if (!el || !h) return;
    el.style.transition = 'left .45s ease, top .45s ease';
    el.style.left = h.x + '%';
    el.style.top = h.y + '%';
    setTimeout(function () { try { el.style.transition = ''; } catch (e) {} }, 500);
  }

  function findTarget(def, el, p) {
    /* Doors: dropping here means "carry this through" */
    var doors = document.querySelectorAll('#objects .obj.door');
    for (var i = 0; i < doors.length; i++) {
      if (hitRect(doors[i], p)) return { kind: 'door', id: doors[i].dataset.obj, el: doors[i] };
    }
    /* Objects with accepts / acceptAny + onDrop, or a registered combo pair */
    var objs = document.querySelectorAll('#objects .obj');
    for (var j = 0; j < objs.length; j++) {
      var o = objs[j];
      if (o === el) continue;
      var d = o._def;
      if (!d) continue;
      var droppable = (typeof d.onDrop === 'function' &&
        (d.acceptAny || (d.accepts && d.accepts.indexOf(def.id) >= 0))) ||
        (window.Combos && Combos.has(def.id, d.id));
      if (droppable && hitRect(o, p)) return { kind: 'obj', id: d.id, el: o, def: d };
    }
    /* Nicko himself (generous zone, checked last so objects win ties) */
    if (window.Nicko && Math.abs(p.x - Nicko.pos()) < 13 && p.y > 52) {
      return { kind: 'nicko', id: '__nicko' };
    }
    return null;
  }

  async function resolveDrop(def, el, target, p, h) {
    var G = window.G;
    function goHome() { tweenHome(el, h); }
    if (target.kind === 'nicko') {
      var handled = await Combos.run(def.id, '__nicko', G);
      if (handled === 'consume') {
        if (G) G.despawn(def.id);
        return;
      }
      if (handled === 'stay') return;
      if (!handled) {
        window.AudioSys.play('giggle');
        await Nicko.react('confused', 1200);
        goHome();
        return;
      }
      goHome();
      return;
    }
    if (target.kind === 'door') {
      carryThrough(def, el, target);
      return;
    }
    /* object target */
    var res = await Combos.run(def.id, target.id, G);
    if (res === 'consume') {
      if (G) G.despawn(def.id);
      return;
    }
    if (res === 'stay') return;
    if (res === true || res === 'handled') {
      goHome();
      return;
    }
    /* no combo matched: try the target's generic onDrop, else funny fail */
    if (target.def && typeof target.def.onDrop === 'function') {
      try {
        var r2 = await target.def.onDrop(G, def.id);
        if (r2 === 'consume') { if (G) G.despawn(def.id); return; }
        if (r2 === 'stay') return;
      } catch (e) { if (window.console) console.error('onDrop error', e); }
      goHome();
      return;
    }
    window.AudioSys.play('giggle');
    await Nicko.react('confused', 1200);
    goHome();
  }

  /* Carry an item through a door into the next room. */
  function carryThrough(def, el, target) {
    var G = window.G;
    carried = { id: def.id, def: def };
    if (G) G.despawn(def.id);
    window.AudioSys.play('pop');
    Nicko.emote('⭐', 1200);
    var dest = target.el._def && target.el._def.goto;
    if (dest && G) G.gotoRoom(dest, target.id === '__doorL' ? 'left' : 'right');
  }
  function takeCarried() {
    var c = carried; carried = null; return c;
  }
  function hasCarried() { return !!carried; }
  function peekCarried() { return carried; }

  function isActive() { return !!activeEl; }

  /* Test helper: run a combo directly without pointer events. */
  async function simulate(dragId, targetId) {
    var G = window.G;
    return Combos.run(dragId, targetId, G);
  }

  return {
    press: press, isActive: isActive,
    takeCarried: takeCarried, hasCarried: hasCarried, peekCarried: peekCarried,
    simulate: simulate
  };
})();

/* Named object combinations. Key: "dragId>targetId". Handler returns
   'consume' (remove dragged item), 'stay' (leave where dropped),
   or anything else (item floats home). '__nicko' is Nicko himself. */
window.Combos = (function () {
  'use strict';
  var table = {};
  function register(dragId, targetId, fn) {
    table[dragId + '>' + targetId] = fn;
  }
  async function run(dragId, targetId, G) {
    var fn = table[dragId + '>' + targetId];
    /* tray-spawned copies (inv_x) share the base item's combos */
    if (!fn && dragId.indexOf('inv_') === 0) fn = table[dragId.slice(4) + '>' + targetId];
    if (!fn) return false;
    try { return await fn(G, dragId, targetId); }
    catch (e) { if (window.console) console.error('combo error ' + dragId + '>' + targetId, e); return false; }
  }
  function has(dragId, targetId) { return !!table[dragId + '>' + targetId]; }
  return { register: register, run: run, has: has };
})();
