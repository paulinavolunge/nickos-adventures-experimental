/* Nicko's Adventures - Nicko the kitten: SVG character, movement, reactions */
window.Nicko = (function () {
  'use strict';
  var wrap = null, body = null;
  var x = 50; // percent across stage
  var walking = false, walkTimer = null;

  var EMOTES = {
    happy: '😺', love: '😻', surprised: '😲', scared: '🙀', sad: '😿',
    sleepy: '😴', confused: '😕', proud: '😼', wow: '🤩', idea: '💡',
    yum: '😋', sick: '🤢', music: '🎵', star: '⭐', bath: '🛁'
  };

  function svg() {
    return '' +
    '<svg viewBox="0 0 200 175" xmlns="http://www.w3.org/2000/svg" aria-label="Nicko the kitten">' +
      // tail
      '<path class="tail" d="M28 128 C 6 118, 4 92, 22 82 C 30 78, 36 84, 32 92 C 24 104, 30 116, 42 120 Z" fill="#B9C0C7"/>' +
      '<path class="tail" d="M14 100 l12 3 M12 110 l12 2" stroke="#4A4F55" stroke-width="4" stroke-linecap="round"/>' +
      // back legs
      '<rect class="leg l3" x="52" y="132" width="20" height="30" rx="10" fill="#9AA1A8"/>' +
      '<rect class="leg l4" x="128" y="132" width="20" height="30" rx="10" fill="#9AA1A8"/>' +
      // body
      '<ellipse cx="100" cy="118" rx="50" ry="38" fill="#B9C0C7"/>' +
      '<ellipse cx="100" cy="130" rx="27" ry="24" fill="#FFF7EE"/>' +
      // back stripes
      '<path d="M58 96 q6 -10 12 0 M100 88 q6 -10 12 0 M142 96 q6 -10 12 0" stroke="#4A4F55" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      // front legs
      '<rect class="leg l1" x="66" y="138" width="20" height="30" rx="10" fill="#B9C0C7"/>' +
      '<rect class="leg l2" x="114" y="138" width="20" height="30" rx="10" fill="#B9C0C7"/>' +
      // mud spots on paws (dirty mood)
      '<g class="mud" fill="#7A5230">' +
        '<ellipse cx="76" cy="160" rx="11" ry="7"/><ellipse cx="124" cy="160" rx="11" ry="7"/>' +
        '<ellipse cx="62" cy="152" rx="9" ry="6"/><ellipse cx="138" cy="152" rx="9" ry="6"/>' +
      '</g>' +
      // ears
      '<path d="M62 44 L52 8 L88 30 Z" fill="#B9C0C7"/>' +
      '<path d="M64 36 L59 16 L80 28 Z" fill="#F4A7B9"/>' +
      '<path d="M138 44 L148 8 L112 30 Z" fill="#B9C0C7"/>' +
      '<path d="M136 36 L141 16 L120 28 Z" fill="#F4A7B9"/>' +
      // head
      '<circle cx="100" cy="66" r="46" fill="#B9C0C7"/>' +
      // forehead stripes
      '<path d="M84 26 l0 12 M100 22 l0 14 M116 26 l0 12" stroke="#4A4F55" stroke-width="5" stroke-linecap="round"/>' +
      // cheek stripes
      '<path d="M58 66 l-10 -3 M58 76 l-10 2 M142 66 l10 -3 M142 76 l10 2" stroke="#4A4F55" stroke-width="4" stroke-linecap="round"/>' +
      // blush
      '<circle cx="70" cy="84" r="8" fill="#F4A7B9" opacity="0.45"/>' +
      '<circle cx="130" cy="84" r="8" fill="#F4A7B9" opacity="0.45"/>' +
      // eyes
      '<g class="eye"><ellipse cx="82" cy="62" rx="11" ry="13" fill="#fff"/><circle class="pupil" cx="84" cy="64" r="5.5" fill="#2E3A45"/><circle cx="86" cy="61" r="1.8" fill="#fff"/></g>' +
      '<g class="eye"><ellipse cx="118" cy="62" rx="11" ry="13" fill="#fff"/><circle class="pupil" cx="116" cy="64" r="5.5" fill="#2E3A45"/><circle cx="118" cy="61" r="1.8" fill="#fff"/></g>' +
      // nose + mouth
      '<path d="M95 82 L105 82 L100 88 Z" fill="#E87A90"/>' +
      '<path d="M100 88 q0 6 -8 6 M100 88 q0 6 8 6" stroke="#4A4F55" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      // whiskers
      '<path d="M52 80 l-20 -4 M52 88 l-20 2 M148 80 l20 -4 M148 88 l20 2" stroke="#E8E2D8" stroke-width="2.5" stroke-linecap="round"/>' +
      // nightcap (pajama mood)
      '<g class="nightcap-g">' +
        '<path d="M70 34 Q100 -14 142 22 L128 40 Q100 6 82 42 Z" fill="#6BA8E8"/>' +
        '<circle cx="142" cy="22" r="10" fill="#fff"/>' +
        '<path d="M70 34 Q100 -14 142 22" stroke="#4A7FC1" stroke-width="4" fill="none"/>' +
      '</g>' +
    '</svg>';
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function init() {
    wrap = document.getElementById('nicko-wrap');
    body = document.getElementById('nicko');
    body.innerHTML = svg();
    setX(x, true);
  }

  function setX(nx, instant) {
    x = Math.max(4, Math.min(96, nx));
    if (instant) {
      var prev = wrap.style.transition;
      wrap.style.transition = 'none';
      wrap.style.left = x + '%';
      void wrap.offsetWidth;
      wrap.style.transition = prev;
    } else {
      wrap.style.left = x + '%';
    }
  }

  function face(dir) {
    wrap.classList.toggle('flip', dir === 'left');
  }

  function walkTo(nx, opts) {
    opts = opts || {};
    nx = Math.max(5, Math.min(95, nx));
    var dist = Math.abs(nx - x);
    face(nx < x ? 'left' : 'right');
    if (dist < 1.5) return Promise.resolve();
    var dur = Math.max(220, Math.min(1500, dist * 16));
    wrap.style.transitionDuration = dur + 'ms';
    wrap.classList.add('walking');
    walking = true;
    if (walkTimer) clearTimeout(walkTimer);
    setX(nx);
    window.AudioSys.play('click');
    return new Promise(function (resolve) {
      walkTimer = setTimeout(function () {
        wrap.classList.remove('walking');
        walking = false;
        resolve();
      }, dur + 40);
    });
  }

  function stop() {
    if (walkTimer) clearTimeout(walkTimer);
    wrap.classList.remove('walking');
    walking = false;
  }

  var emoteTimer = null;
  function emote(kind, ms) {
    var el = document.getElementById('emote');
    el.textContent = EMOTES[kind] || kind || '😺';
    el.classList.remove('hidden');
    if (emoteTimer) clearTimeout(emoteTimer);
    emoteTimer = setTimeout(function () { el.classList.add('hidden'); }, ms || 1500);
  }

  // kinds: happy, surprised, scared, sad, sleepy, confused, proud, love, wow
  function react(kind, ms) {
    ms = ms || 1300;
    emote(kind === 'happy' ? 'happy' : kind, ms);
    var cls = null, sfx = null;
    if (kind === 'happy' || kind === 'love' || kind === 'proud' || kind === 'wow') { cls = 'happy-jump'; sfx = kind === 'love' ? 'purr' : 'happyMeow'; }
    else if (kind === 'surprised' || kind === 'scared') { cls = 'startled'; sfx = 'meow'; }
    else if (kind === 'sad') { sfx = 'meow'; }
    else if (kind === 'sleepy') { wrap.classList.add('sleeping'); sfx = 'snore'; setTimeout(function(){ wrap.classList.remove('sleeping'); }, ms); }
    if (cls) {
      wrap.classList.remove(cls); void wrap.offsetWidth; wrap.classList.add(cls);
      setTimeout(function () { wrap.classList.remove(cls); }, 650);
    }
    if (sfx) window.AudioSys.play(sfx);
    return wait(Math.min(ms, 700));
  }

  function action(name, ms) {
    // pounce, dance, shakeoff, slip, sleeping(add/remove)
    wrap.classList.remove(name); void wrap.offsetWidth; wrap.classList.add(name);
    return new Promise(function (resolve) {
      setTimeout(function () { wrap.classList.remove(name); resolve(); }, ms || 650);
    });
  }

  function mood(name, on) {
    wrap.classList.toggle(name, on !== false);
  }

  function isDirty() { return wrap.classList.contains('dirty'); }

  return {
    init: init, walkTo: walkTo, stop: stop, face: face,
    react: react, emote: emote, action: action, mood: mood, isDirty: isDirty,
    setX: function (nx) { setX(nx, true); },
    pos: function () { return x; },
    isWalking: function () { return walking; },
    el: function () { return wrap; }
  };
})();
