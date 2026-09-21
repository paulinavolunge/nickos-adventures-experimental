/* Nicko's Adventures - Nicko the kitten: SVG character, movement, expressions, personality.
   Visual design: small chubby silver-grey tabby kitten. Oversized round head,
   cream belly, charcoal stripes, big expressive eyes. Expression system drives
   eyes / ears / mouth / head tilt / tail / blush so a child reads his mood
   with no words. */
window.Nicko = (function () {
  'use strict';
  var wrap = null, body = null;
  var x = 50; // percent across stage
  var walking = false, walkTimer = null, walkResolve = null;

  /* Settle any in-flight walk: an interrupted walk must resolve its promise,
     otherwise a tap waiting on it hangs the global interaction lock forever. */
  function settleWalk() {
    if (walkTimer) { clearTimeout(walkTimer); walkTimer = null; }
    if (walkResolve) { var r = walkResolve; walkResolve = null; r(); }
  }

  var EMOTES = {
    happy: '😺', love: '😻', surprised: '😲', scared: '🙀', sad: '😿',
    sleepy: '😴', confused: '😕', proud: '😼', wow: '🤩', idea: '💡',
    yum: '😋', sick: '🤢', music: '🎵', star: '⭐', bath: '🛁',
    hunt: '🐭', sneeze: '🤧', angry: '😾', tongue: '😛', sparkle: '✨'
  };

  /* Nicko's personality: how he reacts to each food. Kids learn to predict him. */
  var TASTES = {
    fish:   { react: 'love',      sfx: 'purr',      hunger: 34, happy: 12, note: 'favorite' },
    milk:   { react: 'yum',       sfx: 'purr',      hunger: 22, happy: 8 },
    apple:  { react: 'yum',       sfx: 'happyMeow', hunger: 14, happy: 8 },
    lemon:  { react: 'sick',      sfx: 'meow',      hunger: 0,  happy: -4, funny: true },
    broccoli:{ react: 'confused', sfx: 'meow',      hunger: 6,  happy: 0, funny: true },
    cookie: { react: 'yum',       sfx: 'happyMeow', hunger: 10, happy: 12 },
    soup:   { react: 'yum',       sfx: 'purr',      hunger: 26, happy: 8 }
  };

  /* Expression presets: eyes / mouth / ears / blush / head tilt / tail.
     Every emote kind maps to one of these; combos can also call setFace directly. */
  var FACES = {
    neutral:    { eyes: 'open',   mouth: 'smile',  ears: 'up',   blush: 0, tilt: 0 },
    happy:      { eyes: 'open',   mouth: 'cat',    ears: 'up',   blush: 1, tilt: 0 },
    veryHappy:  { eyes: 'happy',  mouth: 'open',   ears: 'up',   blush: 2, tilt: 0 },
    curious:    { eyes: 'open',   mouth: 'smile',  ears: 'perk', blush: 0, tilt: 1 },
    confused:   { eyes: 'dizzy',  mouth: 'flat',   ears: 'flop', blush: 0, tilt: -1 },
    surprised:  { eyes: 'wide',   mouth: 'open',   ears: 'up',   blush: 0, tilt: 0 },
    scared:     { eyes: 'wide',   mouth: 'open',   ears: 'flat', blush: 0, tilt: 0, tail: 'puff' },
    sleepy:     { eyes: 'sleepy', mouth: 'smile',  ears: 'flop', blush: 0, tilt: 1 },
    hungry:     { eyes: 'open',   mouth: 'tongue', ears: 'up',   blush: 0, tilt: 0 },
    sick:       { eyes: 'dizzy',  mouth: 'frown',  ears: 'flop', blush: 0, tilt: -1 },
    proud:      { eyes: 'susp',   mouth: 'cat',    ears: 'up',   blush: 0, tilt: 'back' },
    excited:    { eyes: 'happy',  mouth: 'open',   ears: 'perk', blush: 1, tilt: 0 },
    suspicious: { eyes: 'susp',   mouth: 'flat',   ears: 'side', blush: 0, tilt: 1 },
    playful:    { eyes: 'open',   mouth: 'tongue', ears: 'perk', blush: 1, tilt: 0, tail: 'fast' },
    sad:        { eyes: 'sleepy', mouth: 'frown',  ears: 'flop', blush: 0, tilt: 0 },
    silly:      { eyes: 'dizzy',  mouth: 'tongue', ears: 'flop', blush: 1, tilt: 1 }
  };

  function svg() {
    var s = '';
    s += '<svg viewBox="0 0 200 235" xmlns="http://www.w3.org/2000/svg" aria-label="Nicko the kitten">';
    s += '<defs>' +
      '<linearGradient id="furG" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#D3D9E1"/><stop offset="0.55" stop-color="#BCC4CF"/><stop offset="1" stop-color="#A7AFC0"/>' +
      '</linearGradient>' +
      '<linearGradient id="bellyG" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#FFFBF3"/><stop offset="1" stop-color="#F3E6D2"/>' +
      '</linearGradient>' +
      '<radialGradient id="blushG" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#F4A7B9" stop-opacity="0.85"/><stop offset="1" stop-color="#F4A7B9" stop-opacity="0"/>' +
      '</radialGradient>' +
    '</defs>';
    /* soft ground shadow */
    s += '<ellipse cx="100" cy="222" rx="52" ry="10" fill="#5A3F28" opacity="0.18"/>';
    /* tail (behind body) */
    s += '<g class="nko-tail">' +
      '<path d="M148 182 C 178 174, 188 142, 172 128 C 163 121, 154 128, 158 139 C 164 154, 152 166, 138 168 Z" fill="url(#furG)" stroke="#8E97A6" stroke-width="2"/>' +
      '<path d="M160 150 l14 -4 M166 138 l12 -6" stroke="#3E4650" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M172 128 C 168 124, 162 126, 162 132 C 162 138, 168 142, 172 138 C 175 135, 175 131, 172 128 Z" fill="#D3D9E1"/>' +
    '</g>';
    /* back feet */
    s += '<ellipse cx="60" cy="206" rx="17" ry="12" fill="#9AA2B1"/>' +
         '<ellipse cx="140" cy="206" rx="17" ry="12" fill="#9AA2B1"/>';
    /* chubby body */
    s += '<ellipse cx="100" cy="168" rx="55" ry="45" fill="url(#furG)" stroke="#8E97A6" stroke-width="2"/>';
    s += '<ellipse cx="100" cy="184" rx="32" ry="29" fill="url(#bellyG)"/>';
    /* body stripes */
    s += '<g stroke="#3E4650" stroke-width="5" stroke-linecap="round" fill="none">' +
      '<path d="M56 148 q5 -11 11 -3"/>' +
      '<path d="M144 148 q-5 -11 -11 -3"/>' +
      '<path d="M62 176 q5 -9 10 -2"/>' +
    '</g>';
    /* front legs + paws */
    s += '<g class="leg l1"><rect x="70" y="188" width="27" height="34" rx="13" fill="url(#furG)" stroke="#8E97A6" stroke-width="2"/>' +
         '<path d="M79 214 v6 M88 214 v6" stroke="#8E97A6" stroke-width="2.5" stroke-linecap="round"/></g>';
    s += '<g class="leg l2"><rect x="103" y="188" width="27" height="34" rx="13" fill="url(#furG)" stroke="#8E97A6" stroke-width="2"/>' +
         '<path d="M112 214 v6 M121 214 v6" stroke="#8E97A6" stroke-width="2.5" stroke-linecap="round"/></g>';
    /* ===== HEAD ===== */
    s += '<g class="nko-head">';
    /* ears */
    s += '<g class="nko-ear nko-ear-l">' +
      '<path d="M60 56 L46 8 L94 34 Z" fill="url(#furG)" stroke="#8E97A6" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M62 46 L56 20 L82 34 Z" fill="#F4A7B9"/>' +
    '</g>';
    s += '<g class="nko-ear nko-ear-r">' +
      '<path d="M140 56 L154 8 L106 34 Z" fill="url(#furG)" stroke="#8E97A6" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M138 46 L144 20 L118 34 Z" fill="#F4A7B9"/>' +
    '</g>';
    /* big round head */
    s += '<circle cx="100" cy="94" r="55" fill="url(#furG)" stroke="#8E97A6" stroke-width="2"/>';
    /* forehead stripes */
    s += '<g stroke="#3E4650" stroke-width="5.5" stroke-linecap="round">' +
      '<path d="M82 46 v13"/><path d="M100 42 v15"/><path d="M118 46 v13"/>' +
    '</g>';
    /* cheek stripes */
    s += '<g stroke="#3E4650" stroke-width="4" stroke-linecap="round">' +
      '<path d="M50 92 l-11 -4"/><path d="M50 102 l-11 3"/>' +
      '<path d="M150 92 l11 -4"/><path d="M150 102 l11 3"/>' +
    '</g>';
    /* blush */
    s += '<g class="nko-blush" opacity="0">' +
      '<ellipse cx="64" cy="110" rx="13" ry="9" fill="url(#blushG)"/>' +
      '<ellipse cx="136" cy="110" rx="13" ry="9" fill="url(#blushG)"/>' +
    '</g>';
    /* white chin */
    s += '<ellipse cx="100" cy="132" rx="15" ry="10" fill="#FFFBF3"/>';
    /* ---- eyes (one group visible at a time) ---- */
    /* open */
    s += '<g class="nko-eyes nko-e-open">' +
      '<ellipse cx="78" cy="90" rx="13" ry="15.5" fill="#fff"/>' +
      '<ellipse cx="122" cy="90" rx="13" ry="15.5" fill="#fff"/>' +
      '<circle cx="80" cy="93" r="6.5" fill="#2E3A45"/><circle cx="120" cy="93" r="6.5" fill="#2E3A45"/>' +
      '<circle cx="82.5" cy="90" r="2.4" fill="#fff"/><circle cx="122.5" cy="90" r="2.4" fill="#fff"/>' +
      '<circle cx="78" cy="96" r="1.2" fill="#fff" opacity="0.9"/><circle cx="118" cy="96" r="1.2" fill="#fff" opacity="0.9"/>' +
    '</g>';
    /* happy closed (arches) */
    s += '<g class="nko-eyes nko-e-happy" style="display:none">' +
      '<path d="M64 92 Q78 76 92 92" stroke="#2E3A45" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<path d="M108 92 Q122 76 136 92" stroke="#2E3A45" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '</g>';
    /* sleepy (soft downward curves) */
    s += '<g class="nko-eyes nko-e-sleepy" style="display:none">' +
      '<path d="M65 90 Q78 98 91 90" stroke="#2E3A45" stroke-width="5.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M109 90 Q122 98 135 90" stroke="#2E3A45" stroke-width="5.5" fill="none" stroke-linecap="round"/>' +
    '</g>';
    /* wide (surprised / scared) */
    s += '<g class="nko-eyes nko-e-wide" style="display:none">' +
      '<ellipse cx="78" cy="90" rx="15" ry="17.5" fill="#fff"/>' +
      '<ellipse cx="122" cy="90" rx="15" ry="17.5" fill="#fff"/>' +
      '<circle cx="78" cy="92" r="4" fill="#2E3A45"/><circle cx="122" cy="92" r="4" fill="#2E3A45"/>' +
      '<circle cx="79.5" cy="90" r="1.6" fill="#fff"/><circle cx="123.5" cy="90" r="1.6" fill="#fff"/>' +
    '</g>';
    /* suspicious (half lidded) */
    s += '<g class="nko-eyes nko-e-susp" style="display:none">' +
      '<ellipse cx="78" cy="94" rx="13" ry="11" fill="#fff"/><ellipse cx="122" cy="94" rx="13" ry="11" fill="#fff"/>' +
      '<circle cx="80" cy="97" r="5.5" fill="#2E3A45"/><circle cx="120" cy="97" r="5.5" fill="#2E3A45"/>' +
      '<path d="M63 88 L93 82 L93 90 L63 96 Z" fill="url(#furG)"/>' +
      '<path d="M137 88 L107 82 L107 90 L137 96 Z" fill="url(#furG)"/>' +
    '</g>';
    /* dizzy (confused / sick / silly) */
    s += '<g class="nko-eyes nko-e-dizzy" style="display:none" stroke="#2E3A45" stroke-width="5.5" stroke-linecap="round" fill="none">' +
      '<path d="M68 82 L80 90 L68 98"/><path d="M132 82 L120 90 L132 98"/>' +
    '</g>';
    /* blink overlay (JS shows briefly) */
    s += '<g class="nko-eyes nko-e-blink" style="display:none">' +
      '<path d="M66 90 Q78 94 90 90" stroke="#2E3A45" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M110 90 Q122 94 134 90" stroke="#2E3A45" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '</g>';
    /* nose */
    s += '<path d="M93 108 L107 108 L100 116 Z" fill="#E87A90" stroke-linejoin="round"/>';
    s += '<path d="M100 116 v3" stroke="#C25A72" stroke-width="2.5" stroke-linecap="round"/>';
    /* ---- mouths ---- */
    s += '<g class="nko-mouth nko-m-smile">' +
      '<path d="M100 119 q0 6 -9 5 M100 119 q0 6 9 5" stroke="#3E4650" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
    '</g>';
    s += '<g class="nko-mouth nko-m-open" style="display:none">' +
      '<ellipse cx="100" cy="126" rx="8" ry="10" fill="#7A3B3B"/>' +
      '<ellipse cx="100" cy="130" rx="4.5" ry="5" fill="#F48CA0"/>' +
    '</g>';
    s += '<g class="nko-mouth nko-m-cat" style="display:none">' +
      '<path d="M91 121 Q96 127 100 122 Q104 127 109 121" stroke="#3E4650" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
    '</g>';
    s += '<g class="nko-mouth nko-m-frown" style="display:none">' +
      '<path d="M91 128 Q100 121 109 128" stroke="#3E4650" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
    '</g>';
    s += '<g class="nko-mouth nko-m-tongue" style="display:none">' +
      '<path d="M100 119 q0 5 -8 4 M100 119 q0 5 8 4" stroke="#3E4650" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="100" cy="130" rx="6" ry="9" fill="#F48CA0" stroke="#D96A84" stroke-width="1.5"/>' +
      '<path d="M100 126 v7" stroke="#D96A84" stroke-width="1.5"/>' +
    '</g>';
    s += '<g class="nko-mouth nko-m-flat" style="display:none">' +
      '<path d="M92 124 L108 124" stroke="#3E4650" stroke-width="3.5" stroke-linecap="round"/>' +
    '</g>';
    /* whiskers */
    s += '<g stroke="#F5EFE4" stroke-width="2.5" stroke-linecap="round" opacity="0.9">' +
      '<path d="M46 106 L24 100"/><path d="M46 114 L25 114"/><path d="M48 121 L30 128"/>' +
      '<path d="M154 106 L176 100"/><path d="M154 114 L175 114"/><path d="M152 121 L170 128"/>' +
    '</g>';
    s += '</g>'; /* end head */
    /* dirt overlay (dirty mood) */
    s += '<g class="nko-dirt" style="display:none" fill="#7A5230" opacity="0.85">' +
      '<ellipse cx="140" cy="70" rx="12" ry="9"/><ellipse cx="148" cy="80" rx="7" ry="5"/>' +
      '<ellipse cx="66" cy="150" rx="14" ry="10"/><ellipse cx="120" cy="200" rx="12" ry="8"/>' +
      '<ellipse cx="82" cy="206" rx="10" ry="6"/><ellipse cx="118" cy="206" rx="10" ry="6"/>' +
      '<circle cx="52" cy="120" r="4"/><circle cx="150" cy="160" r="5"/><circle cx="96" cy="60" r="3.5"/>' +
    '</g>';
    /* nightcap (pajama mood) */
    s += '<g class="nightcap-g" style="display:none">' +
      '<path d="M64 52 Q96 -6 150 34 L134 54 Q98 12 76 58 Z" fill="#6BA8E8"/>' +
      '<circle cx="150" cy="34" r="11" fill="#fff"/>' +
      '<circle cx="150" cy="34" r="11" fill="none" stroke="#D8E6F5" stroke-width="3"/>' +
      '<path d="M64 52 Q96 -6 150 34" stroke="#4A7FC1" stroke-width="4" fill="none"/>' +
      '<circle cx="100" cy="30" r="4" fill="#FFD65A"/><circle cx="118" cy="22" r="4" fill="#FFD65A"/>' +
    '</g>';
    /* wearable accessories (toggled by Inventory) */
    s += '<g class="acc acc-hat" style="display:none">' +
      '<ellipse cx="100" cy="34" rx="38" ry="11" fill="#8A5A3B"/>' +
      '<path d="M70 32 L78 -14 L122 -14 L130 32 Z" fill="#5A3A22"/>' +
      '<rect x="70" y="22" width="60" height="11" fill="#FFD65A"/>' +
      '<circle cx="100" cy="-16" r="9" fill="#FF9D6B"/>' +
    '</g>';
    s += '<g class="acc acc-glasses" style="display:none">' +
      '<circle cx="78" cy="90" r="19" fill="rgba(255,255,255,0.25)" stroke="#FF8A5C" stroke-width="6"/>' +
      '<circle cx="122" cy="90" r="19" fill="rgba(255,255,255,0.25)" stroke="#FF8A5C" stroke-width="6"/>' +
      '<path d="M97 90 L103 90" stroke="#FF8A5C" stroke-width="6"/>' +
      '<path d="M66 78 l8 8 M134 78 l-8 8" stroke="#fff" stroke-width="4" stroke-linecap="round"/>' +
    '</g>';
    s += '<g class="acc acc-bowtie" style="display:none">' +
      '<path d="M100 142 L72 128 L72 156 Z" fill="#FF6B8E"/>' +
      '<path d="M100 142 L128 128 L128 156 Z" fill="#FF6B8E"/>' +
      '<circle cx="100" cy="142" r="8" fill="#E84A72"/>' +
      '<circle cx="100" cy="142" r="8" fill="none" stroke="#C23A5E" stroke-width="2"/>' +
    '</g>';
    s += '</svg>';
    return s;
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function init() {
    wrap = document.getElementById('nicko-wrap');
    body = document.getElementById('nicko');
    body.innerHTML = svg();
    setFace('neutral');
    setX(x, true);
    startBlinking();
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

  /* ---------- expression system ---------- */
  var currentFace = 'neutral';
  function setFace(name) {
    var f = FACES[name] || FACES.neutral;
    currentFace = name;
    if (!body) return;
    var eyes = body.querySelectorAll('.nko-eyes');
    for (var i = 0; i < eyes.length; i++) {
      var e = eyes[i];
      if (e.classList.contains('nko-e-blink')) continue;
      e.style.display = e.classList.contains('nko-e-' + f.eyes) ? 'block' : 'none';
    }
    var mouths = body.querySelectorAll('.nko-mouth');
    for (var j = 0; j < mouths.length; j++) {
      mouths[j].style.display = mouths[j].classList.contains('nko-m-' + f.mouth) ? 'block' : 'none';
    }
    var blush = body.querySelector('.nko-blush');
    if (blush) blush.setAttribute('opacity', f.blush === 2 ? '0.95' : (f.blush === 1 ? '0.55' : '0'));
    var head = body.querySelector('.nko-head');
    if (head) {
      head.classList.remove('ears-up', 'ears-perk', 'ears-flat', 'ears-flop', 'ears-side',
        'tilt-1', 'tilt--1', 'tilt-back');
      head.classList.add('ears-' + f.ears);
      if (f.tilt === 1) head.classList.add('tilt-1');
      else if (f.tilt === -1) head.classList.add('tilt--1');
      else if (f.tilt === 'back') head.classList.add('tilt-back');
    }
    var tail = body.querySelector('.nko-tail');
    if (tail) {
      tail.classList.remove('tail-puff', 'tail-fast');
      if (f.tail === 'puff') tail.classList.add('tail-puff');
      if (f.tail === 'fast') tail.classList.add('tail-fast');
    }
  }

  /* gentle periodic blinking (only over open/wide eyes) */
  var blinkTimer = null;
  function startBlinking() {
    if (blinkTimer) clearInterval(blinkTimer);
    function schedule() {
      blinkTimer = setTimeout(function () {
        if (!document.hidden && body &&
            (currentFace === 'neutral' || currentFace === 'happy' || currentFace === 'curious' ||
             currentFace === 'hungry' || currentFace === 'playful')) {
          var f = FACES[currentFace] || FACES.neutral;
          var open = body.querySelector('.nko-e-' + f.eyes);
          var blink = body.querySelector('.nko-e-blink');
          if (open && blink) {
            open.style.display = 'none';
            blink.style.display = 'block';
            setTimeout(function () {
              blink.style.display = 'none';
              if (currentFace && body) {
                var cur = FACES[currentFace] || FACES.neutral;
                var back = body.querySelector('.nko-e-' + cur.eyes);
                if (back) back.style.display = 'block';
              }
            }, 150);
          }
        }
        schedule();
      }, 2600 + Math.random() * 3200);
    }
    schedule();
  }

  function walkTo(nx, opts) {
    opts = opts || {};
    nx = Math.max(5, Math.min(95, nx));
    var dist = Math.abs(nx - x);
    face(nx < x ? 'left' : 'right');
    if (dist < 1.5) return Promise.resolve();
    /* A new walk cancels the previous one; resolve the old promise first so
       any tap awaiting it can finish and release the interaction lock. */
    settleWalk();
    var dur = Math.max(220, Math.min(1500, dist * 16));
    wrap.style.transitionDuration = dur + 'ms';
    wrap.classList.add('walking');
    walking = true;
    setX(nx);
    window.AudioSys.play('click');
    return new Promise(function (resolve) {
      walkResolve = resolve;
      walkTimer = setTimeout(function () {
        walkTimer = null; walkResolve = null;
        wrap.classList.remove('walking');
        walking = false;
        resolve();
      }, dur + 40);
    });
  }

  function stop() {
    settleWalk();
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

  /* Thought bubble: a pure visual cue, no reading needed */
  var thoughtTimer = null;
  function think(icon, ms) {
    var el = document.getElementById('thought');
    if (!el) return;
    el.textContent = icon;
    el.classList.remove('hidden');
    if (thoughtTimer) clearTimeout(thoughtTimer);
    thoughtTimer = setTimeout(function () { el.classList.add('hidden'); }, ms || 2600);
  }
  function clearThought() {
    var el = document.getElementById('thought');
    if (el) el.classList.add('hidden');
    if (thoughtTimer) clearTimeout(thoughtTimer);
  }

  /* reaction kind -> face + body animation + sound. Returns after the beat. */
  var faceTimer = null;
  function react(kind, ms) {
    ms = ms || 1300;
    emote(kind, ms);
    var faceName = 'happy', cls = null, sfx = null;
    if (kind === 'happy') { faceName = 'happy'; cls = 'happy-jump'; sfx = 'happyMeow'; }
    else if (kind === 'love') { faceName = 'veryHappy'; cls = 'happy-jump'; sfx = 'purr'; }
    else if (kind === 'proud') { faceName = 'proud'; cls = 'happy-jump'; sfx = 'happyMeow'; }
    else if (kind === 'wow') { faceName = 'excited'; cls = 'happy-jump'; sfx = 'happyMeow'; }
    else if (kind === 'yum') { faceName = 'happy'; cls = 'happy-jump'; sfx = 'purr'; }
    else if (kind === 'sparkle') { faceName = 'veryHappy'; cls = 'happy-jump'; sfx = 'happyMeow'; }
    else if (kind === 'surprised') { faceName = 'surprised'; cls = 'startled'; sfx = 'meow'; }
    else if (kind === 'scared') { faceName = 'scared'; cls = 'startled'; sfx = 'meow'; }
    else if (kind === 'sad') { faceName = 'sad'; sfx = 'meow'; }
    else if (kind === 'sick') { faceName = 'sick'; cls = 'shakeoff'; sfx = 'meow'; }
    else if (kind === 'confused') { faceName = 'confused'; sfx = 'meow'; }
    else if (kind === 'hunt') { faceName = 'playful'; cls = 'pounce'; sfx = 'meow'; }
    else if (kind === 'sneeze') { faceName = 'surprised'; cls = 'shakeoff'; sfx = 'sneeze'; }
    else if (kind === 'angry') { faceName = 'suspicious'; sfx = 'meow'; }
    else if (kind === 'tongue') { faceName = 'silly'; cls = 'wiggle'; sfx = 'giggle'; }
    else if (kind === 'sleepy') { faceName = 'sleepy'; wrap.classList.add('sleeping'); sfx = 'snore'; setTimeout(function(){ wrap.classList.remove('sleeping'); }, ms); }
    else if (kind === 'music') { faceName = 'happy'; cls = 'dance'; sfx = null; }
    else if (kind === 'bath') { faceName = 'happy'; cls = 'shakeoff'; sfx = 'bubbles'; }
    setFace(faceName);
    if (faceTimer) clearTimeout(faceTimer);
    faceTimer = setTimeout(function () { setFace('neutral'); }, Math.max(ms, 900));
    if (cls) {
      wrap.classList.remove(cls); void wrap.offsetWidth; wrap.classList.add(cls);
      setTimeout(function () { wrap.classList.remove(cls); }, 700);
    }
    if (sfx) window.AudioSys.play(sfx);
    return wait(Math.min(ms, 700));
  }

  function action(name, ms) {
    // pounce, dance, shakeoff, slip, sleeping(add/remove), wiggle, climbIn, crouch, stretch, curl
    wrap.classList.remove(name); void wrap.offsetWidth; wrap.classList.add(name);
    return new Promise(function (resolve) {
      setTimeout(function () { wrap.classList.remove(name); resolve(); }, ms || 650);
    });
  }

  function mood(name, on) {
    wrap.classList.toggle(name, on !== false);
    if (name === 'dirty') {
      var d = body && body.querySelector('.nko-dirt');
      if (d) d.style.display = (on === false ? 'none' : 'block');
    }
  }

  function isDirty() { return wrap.classList.contains('dirty'); }

  /* Wearable accessories: hat, glasses, bowtie */
  function wear(item, on) {
    var g = body.querySelector('.acc-' + item);
    if (g) g.style.display = (on === false ? 'none' : 'block');
  }
  function syncWear(equipped) {
    ['hat', 'glasses', 'bowtie'].forEach(function (it) { wear(it, !!(equipped && equipped[it])); });
    /* Pajamas are a saved flag, not an equipped item; reapply the nightcap
       so wearing them (and reloading / changing rooms) stays visible. */
    var paj = !!(equipped && equipped.pajamas);
    try { if (window.Store && Store.data && Store.data.flags && Store.data.flags.pajamasOn) paj = true; } catch (e) {}
    var w = document.getElementById('nicko-wrap');
    if (w) w.classList.toggle('nightcap', paj);
  }

  /* Personality: taste a food, get Nicko's honest reaction */
  async function taste(foodId) {
    var t = TASTES[foodId] || { react: 'confused', sfx: 'meow', hunger: 0, happy: 0, funny: true };
    await react(t.react, 1500);
    if (t.funny) window.AudioSys.play('giggle');
    return t;
  }

  return {
    init: init, walkTo: walkTo, stop: stop, face: face,
    react: react, emote: emote, action: action, mood: mood, isDirty: isDirty,
    think: think, clearThought: clearThought, setFace: setFace,
    wear: wear, syncWear: syncWear, taste: taste, TASTES: TASTES,
    setX: function (nx) { setX(nx, true); },
    pos: function () { return x; },
    isWalking: function () { return walking; },
    el: function () { return wrap; }
  };
})();
