/* Nicko's Adventures - rooms part A: bedroom, bathroom, kitchen.
   Objects are playthings now: drag food to Nicko, drag soap to the sink,
   drop toys on targets, carry things through doors. Small actions stay
   quiet (Nicko reacts); only real discoveries make noise. */
window.ROOMS = window.ROOMS || {};

/* unique gradient ids per background (inline SVGs share the document) */
var _bgN = 0;
function shade(hex, amt) {
  var n = parseInt(hex.replace('#', ''), 16);
  var r = Math.max(0, Math.min(255, (n >> 16) + amt));
  var g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  var b = Math.max(0, Math.min(255, (n & 255) + amt));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

/* Layered cozy room shell: lit wall, wallpaper dots, wainscot, baseboard,
   wood plank floor, warm top light. Same signature as before. */
function wallFloor(wall, floor, extra) {
  var u = 'bg' + (++_bgN);
  var dots = '';
  for (var r = 0; r < 5; r++) for (var c = 0; c < 12; c++) {
    dots += '<circle cx="' + (45 + c * 88 + (r % 2) * 44) + '" cy="' + (56 + r * 66) + '" r="6.5" fill="rgba(150,105,60,0.09)"/>';
  }
  var planks = '';
  for (var x = 62; x < 1000; x += 125) {
    planks += '<line x1="' + x + '" y1="480" x2="' + x + '" y2="620" stroke="rgba(90,55,25,0.16)" stroke-width="3"/>';
  }
  return '<svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
    '<linearGradient id="w' + u + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#FFFDF7"/><stop offset="1" stop-color="' + wall + '"/>' +
    '</linearGradient>' +
    '<linearGradient id="f' + u + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + shade(floor, 14) + '"/><stop offset="1" stop-color="' + shade(floor, -22) + '"/>' +
    '</linearGradient>' +
    '<radialGradient id="v' + u + '" cx="0.5" cy="0.12" r="1">' +
      '<stop offset="0" stop-color="#FFF3D0" stop-opacity="0.55"/><stop offset="0.6" stop-color="#FFF3D0" stop-opacity="0.12"/><stop offset="1" stop-color="#FFF3D0" stop-opacity="0"/>' +
    '</radialGradient>' +
    '</defs>' +
    '<rect x="0" y="0" width="1000" height="472" fill="url(#w' + u + ')"/>' +
    dots +
    '<rect x="0" y="352" width="1000" height="120" fill="#FFFFFF" opacity="0.35"/>' +
    '<rect x="0" y="348" width="1000" height="12" rx="5" fill="#F1DFC0"/>' +
    '<rect x="0" y="348" width="1000" height="4" fill="#FFFDF4" opacity="0.85"/>' +
    '<rect x="0" y="464" width="1000" height="16" fill="#FBF3E2"/>' +
    '<rect x="0" y="464" width="1000" height="5" fill="#E3CDA6"/>' +
    '<rect x="0" y="480" width="1000" height="140" fill="url(#f' + u + ')"/>' +
    planks +
    '<line x1="0" y1="540" x2="1000" y2="540" stroke="rgba(90,55,25,0.10)" stroke-width="3"/>' +
    '<ellipse cx="500" cy="560" rx="420" ry="60" fill="#FFF3D0" opacity="0.25"/>' +
    '<rect x="0" y="0" width="1000" height="620" fill="url(#v' + u + ')"/>' +
    (extra || '') + '</svg>';
}

Object.assign(window.ROOMS, {

/* ================= BEDROOM ================= */
bedroom: {
  id: 'bedroom', label: 'Bedroom', icon: '🛏️',
  bg: wallFloor('#F9E4C4', '#C98F5A',
    '<ellipse cx="500" cy="566" rx="300" ry="44" fill="#B4653A" opacity="0.35"/>' +
    '<ellipse cx="500" cy="560" rx="270" ry="38" fill="#E8A05C"/>' +
    '<ellipse cx="500" cy="560" rx="220" ry="30" fill="#F2BC7D"/>' +
    '<ellipse cx="500" cy="560" rx="170" ry="23" fill="#F8D29A"/>' +
    '<g class="amb-twinkle" fill="#FFE9A8">' +
    '<path d="M240 120 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 Z"/>' +
    '<path d="M700 90 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z"/>' +
    '<path d="M620 180 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 Z"/></g>' +
    '<g opacity="0.9"><circle cx="880" cy="110" r="44" fill="#FFE9A8"/><circle cx="880" cy="110" r="60" fill="#FFE9A8" opacity="0.3"/>' +
    '<circle cx="866" cy="98" r="8" fill="#F5D47A" opacity="0.7"/><circle cx="892" cy="120" r="6" fill="#F5D47A" opacity="0.7"/></g>'),
  objects: [
    { id: 'lamp', x: 13, y: 56, w: 10, label: 'Lamp', glowSoft: true,
      svg: '<svg viewBox="0 0 100 130"><defs><linearGradient id="lg-lamp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE066"/><stop offset="1" stop-color="#FFB62E"/></linearGradient></defs><ellipse cx="50" cy="126" rx="28" ry="7" fill="rgba(90,55,25,0.25)"/><rect x="42" y="94" width="16" height="30" rx="7" fill="#8A5A3B"/><rect x="42" y="94" width="7" height="30" rx="3.5" fill="#A9764F"/><ellipse cx="50" cy="128" rx="26" ry="6" fill="#6E452D"/><path d="M20 94 L80 94 L68 40 L32 40 Z" fill="url(#lg-lamp)"/><path d="M32 40 L44 40 L36 94 L20 94 Z" fill="#fff" opacity="0.25"/><path class="lamp-glow" d="M20 94 L80 94 L68 40 L32 40 Z" fill="#FFF3D0" opacity="0.0"/><rect x="44" y="30" width="12" height="12" rx="6" fill="#8A5A3B"/></svg>',
      onTap: async function (G) {
        var on = !G.flag('lampOn');
        G.setFlag('lampOn', on);
        G.dim(!on);
        G.sfx('click');
        var el = G.el('lamp');
        if (el) el.querySelector('.lamp-glow').setAttribute('opacity', on ? '0.0' : '0.85');
        if (!on) {
          /* SECRET: lights out reveals glowing stars */
          G.spawnStars();
          if (G.flag('pajamasOn') && !G.flag('bedtimeDone')) {
            await G.wait(600);
            await Nicko.walkTo(74);
            Nicko.mood('sleeping', true);
            await Nicko.react('sleepy', 2600);
            G.sfx('snore');
            await G.wait(2400);
            Nicko.mood('sleeping', false);
            G.dim(false); G.setFlag('lampOn', true);
            var lampEl = G.el('lamp');
            if (lampEl) lampEl.querySelector('.lamp-glow').setAttribute('opacity', '0.0');
            G.despawn('__stars');
            await Nicko.react('happy');
            G.setFlag('bedtimeDone', true);
            Needs.rest(60);
            G.achieve('bedtime-star');
            G.points(30);
            G.toast('Bedtime routine complete!', '🌙');
          }
        } else {
          G.despawn('__stars');
          G.sfx('click');
        }
      } },
    { id: 'painting', x: 32, y: 26, w: 14, label: 'Painting',
      svg: '<svg viewBox="0 0 140 110"><defs><linearGradient id="lg-paint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF4"/><stop offset="1" stop-color="#F7ECD4"/></linearGradient></defs><rect x="4" y="4" width="132" height="102" rx="10" fill="#7C4F22"/><rect x="8" y="8" width="124" height="94" rx="8" fill="#A9764F"/><rect x="16" y="16" width="108" height="78" fill="url(#lg-paint)"/><circle cx="60" cy="50" r="20" fill="#FF9D6B"/><circle cx="54" cy="44" r="6" fill="#FFB98A" opacity="0.8"/><path d="M38 82 q32 -24 64 0" stroke="#57C4AD" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M44 88 q26 -18 52 0" stroke="#8FD16F" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.7"/></svg>',
      onTap: async function (G) {
        /* SECRET: tap the painting three times */
        if (Secrets.count('painting', 3, async function () {
          G.setSvg('painting', '<svg viewBox="0 0 140 110"><rect x="4" y="4" width="132" height="102" rx="10" fill="#7C4F22"/><rect x="8" y="8" width="124" height="94" rx="8" fill="#A9764F"/><rect x="16" y="16" width="108" height="78" fill="#FFFDF4"/><ellipse cx="70" cy="54" rx="27" ry="21" fill="#B9C0C7"/><ellipse cx="70" cy="48" rx="27" ry="18" fill="#C9D1DA"/><circle cx="60" cy="48" r="4.4" fill="#2E3A45"/><circle cx="80" cy="48" r="4.4" fill="#2E3A45"/><circle cx="61.5" cy="46.5" r="1.4" fill="#fff"/><circle cx="81.5" cy="46.5" r="1.4" fill="#fff"/><path d="M52 26 L46 8 L64 20 Z" fill="#B9C0C7"/><path d="M88 26 L94 8 L76 20 Z" fill="#B9C0C7"/><path d="M62 68 q8 5 16 0" stroke="#4A4F55" stroke-width="3" fill="none" stroke-linecap="round"/></svg>');
          G.sfx('magic'); G.sparkleAt(32, 24, 10);
          await Nicko.react('wow');
          Secrets.found('painting');
          G.points(15);
          G.toast('Nicko painted himself behind the painting!', '🎨');
        })) return;
        G.sfx('knock');
        await Nicko.react('confused', 900);
      } },
    { id: 'clock', x: 22, y: 62, w: 8, label: 'Alarm clock',
      svg: '<svg viewBox="0 0 100 100"><defs><radialGradient id="lg-clock" cx="0.4" cy="0.35" r="0.9"><stop offset="0" stop-color="#FFB3A6"/><stop offset="1" stop-color="#F0664A"/></radialGradient></defs><ellipse cx="50" cy="94" rx="30" ry="5" fill="rgba(90,55,25,0.2)"/><rect x="18" y="60" width="64" height="34" rx="12" fill="url(#lg-clock)"/><rect x="18" y="60" width="64" height="12" rx="6" fill="#fff" opacity="0.25"/><circle cx="50" cy="40" r="27" fill="#FFFDF7" stroke="url(#lg-clock)" stroke-width="7"/><circle cx="50" cy="40" r="21" fill="none" stroke="#F3E2C8" stroke-width="2"/><line x1="50" y1="40" x2="50" y2="25" stroke="#5A3D2B" stroke-width="4.5" stroke-linecap="round"/><line x1="50" y1="40" x2="62" y2="46" stroke="#5A3D2B" stroke-width="4.5" stroke-linecap="round"/><circle cx="50" cy="40" r="4.5" fill="#5A3D2B"/><path d="M28 20 L20 6 M72 20 L80 6" stroke="#F0664A" stroke-width="8" stroke-linecap="round"/></svg>',
      onTap: async function (G) {
        G.sfx('ring');
        await Nicko.react('surprised');
        if (G.once('clockFun')) { G.points(5); }
      } },
    { id: 'pajamas', x: 56, y: 52, w: 9, label: 'Nightcap', glowSoft: true, drag: true,
      svg: '<svg viewBox="0 0 100 100"><defs><linearGradient id="lg-pj" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FBEF0"/><stop offset="1" stop-color="#5A8FD0"/></linearGradient></defs><ellipse cx="50" cy="90" rx="30" ry="6" fill="rgba(90,55,25,0.2)"/><path d="M28 68 Q48 8 84 42 L70 58 Q52 32 38 70 Z" fill="url(#lg-pj)"/><path d="M38 60 Q52 32 66 44" stroke="#fff" stroke-width="4" fill="none" opacity="0.4" stroke-linecap="round"/><circle cx="84" cy="42" r="12" fill="#FFFDF7"/><circle cx="84" cy="42" r="12" fill="none" stroke="#E3D5BC" stroke-width="3"/><rect x="22" y="64" width="54" height="15" rx="7.5" fill="#4A7FC1"/><circle cx="40" cy="40" r="4" fill="#FFE066"/><circle cx="56" cy="28" r="4" fill="#FFE066"/></svg>',
      onTap: async function (G) { await G.wearPajamas(); } },
    { id: 'chair', x: 45, y: 68, w: 13, label: 'Chair',
      svg: '<svg viewBox="0 0 130 150"><defs><linearGradient id="lg-chair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08A52"/><stop offset="1" stop-color="#96622F"/></linearGradient></defs><ellipse cx="65" cy="144" rx="48" ry="7" fill="rgba(90,55,25,0.22)"/><rect x="36" y="74" width="11" height="66" rx="5.5" fill="#6E452D"/><rect x="83" y="74" width="11" height="66" rx="5.5" fill="#6E452D"/><rect x="30" y="60" width="70" height="16" rx="8" fill="url(#lg-chair)"/><rect x="30" y="14" width="70" height="54" rx="12" fill="url(#lg-chair)"/><rect x="36" y="20" width="58" height="42" rx="8" fill="#D09A5E" opacity="0.6"/><rect class="chair-blanket" x="22" y="42" width="86" height="32" rx="14" fill="#C49BE8"/><rect class="chair-blanket" x="22" y="42" width="86" height="12" rx="6" fill="#D4B5F0"/><circle class="chair-blanket" cx="40" cy="58" r="5" fill="#fff" opacity="0.5"/><circle class="chair-blanket" cx="70" cy="58" r="5" fill="#fff" opacity="0.5"/></svg>',
      onTap: async function (G) {
        var el = G.el('chair');
        if (el && el.querySelector('.chair-blanket')) {
          el.querySelector('.chair-blanket').remove();
          G.sfx('pop');
          await Nicko.react('happy');
          if (Inventory.unlock('blanket')) G.toast('Blanket added to the toybox! Drag it to the bed.', '🛌');
        } else {
          G.sfx('thud');
          await Nicko.react('happy', 900);
        }
      } },
    { id: 'window', x: 58, y: 30, w: 16, label: 'Window',
      svg: '<svg viewBox="0 0 160 140"><defs><linearGradient id="lg-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE6FA"/><stop offset="1" stop-color="#8FCBEF"/></linearGradient></defs><rect x="4" y="4" width="152" height="132" rx="12" fill="#FFFDF7"/><rect x="10" y="10" width="140" height="120" rx="8" fill="url(#lg-win)" stroke="#A9764F" stroke-width="7"/><line x1="80" y1="10" x2="80" y2="130" stroke="#A9764F" stroke-width="6"/><line x1="10" y1="70" x2="150" y2="70" stroke="#A9764F" stroke-width="6"/><g class="amb-flicker"><circle cx="118" cy="40" r="15" fill="#FFE066"/><circle cx="118" cy="40" r="21" fill="#FFE066" opacity="0.3"/></g><g class="amb-bob" opacity="0.9"><ellipse cx="40" cy="44" rx="16" ry="8" fill="#fff"/></g><path d="M18 112 q22 -20 44 0 t44 0" stroke="#57C4AD" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="30" cy="104" r="6" fill="#FF9DC6"/><circle cx="52" cy="106" r="6" fill="#FF9DC6"/></svg>',
      onTap: async function (G) {
        var el = G.el('window');
        if (!el.dataset.daySvg) el.dataset.daySvg = el.innerHTML;
        G.setSvg('window', '<svg viewBox="0 0 160 140"><rect x="8" y="8" width="144" height="124" rx="10" fill="#2B3A55" stroke="#8A5A3B" stroke-width="8"/><line x1="80" y1="8" x2="80" y2="132" stroke="#8A5A3B" stroke-width="6"/><line x1="8" y1="70" x2="152" y2="70" stroke="#8A5A3B" stroke-width="6"/><circle cx="118" cy="40" r="14" fill="#F4F1DE"/><circle cx="40" cy="36" r="2.4" fill="#fff"/><circle cx="66" cy="60" r="2" fill="#fff"/><circle cx="100" cy="90" r="2.4" fill="#fff"/><circle cx="52" cy="100" r="2" fill="#fff"/><circle cx="128" cy="100" r="2" fill="#fff"/><ellipse cx="46" cy="52" rx="12" ry="8" fill="#8A6F4D"/><circle cx="42" cy="50" r="2.4" fill="#2B3A55"/><circle cx="52" cy="50" r="2.4" fill="#2B3A55"/></svg>');
        G.sfx('owl');
        await Nicko.react('surprised');
        if (G.once('windowNight')) G.points(10);
        setTimeout(function () { try { var e2 = G.el('window'); if (e2 && e2.dataset.daySvg) e2.innerHTML = e2.dataset.daySvg; } catch (e) {} }, 6000);
      } },
    { id: 'bed', x: 78, y: 64, w: 28, label: 'Bed',
      svg: '<svg viewBox="0 0 300 190"><defs><linearGradient id="lg-bed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC8E8"/><stop offset="1" stop-color="#6FA3CC"/></linearGradient><linearGradient id="lg-quilt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD9A0"/><stop offset="1" stop-color="#F2A95C"/></linearGradient></defs><ellipse cx="150" cy="182" rx="140" ry="10" fill="rgba(90,55,25,0.22)"/><rect x="16" y="58" width="32" height="114" rx="12" fill="#8A5A3B"/><rect x="252" y="58" width="32" height="114" rx="12" fill="#8A5A3B"/><circle cx="32" cy="52" r="16" fill="#A9764F"/><circle cx="268" cy="52" r="16" fill="#A9764F"/><rect x="12" y="92" width="276" height="48" rx="18" fill="url(#lg-bed)"/><rect x="12" y="62" width="276" height="54" rx="18" fill="url(#lg-quilt)"/><path d="M30 76 q60 -14 120 0 t120 0" stroke="#fff" stroke-width="6" fill="none" opacity="0.5" stroke-linecap="round"/><path d="M30 96 q60 -14 120 0 t120 0" stroke="#E87F4E" stroke-width="5" fill="none" opacity="0.5" stroke-linecap="round"/><rect x="26" y="28" width="96" height="56" rx="20" fill="#FFFDF7" stroke="#EBDCC2" stroke-width="4"/><rect x="34" y="36" width="80" height="40" rx="14" fill="#F7ECD4"/><path d="M150 84 q44 -24 96 -8" stroke="#E87F4E" stroke-width="11" fill="none" stroke-linecap="round"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(74);
        var el = G.el('bed');
        if (el) { el.classList.remove('bounce'); void el.offsetWidth; el.classList.add('bounce'); }
        G.sfx('boing');
        await Nicko.react('happy');
        if (G.once('bedBounce')) G.points(5);
      } },
    { id: 'underbed', x: 78, y: 86, w: 22, label: 'Under the bed',
      svg: '<svg viewBox="0 0 240 60"><rect x="10" y="8" width="220" height="46" rx="22" fill="rgba(30,16,26,0.55)"/><rect x="10" y="8" width="220" height="16" rx="8" fill="rgba(255,255,255,0.08)"/><circle cx="70" cy="31" r="7" fill="#FFE9A8" opacity="0.9"><animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite"/></circle><circle cx="170" cy="31" r="7" fill="#FFE9A8" opacity="0.9"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite"/></circle></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(74);
        /* SECRET: the teddy's mouse family moves in if you stash him */
        if (G.flag('teddyStashed') && G.once('mouseParty')) {
          G.sfx('squeak'); G.sparkleAt(78, 84, 10);
          await Nicko.react('wow');
          Secrets.found('mouseParty');
          G.points(20);
          G.toast('The teddy is having a tea party with mice!', '🐭');
          return;
        }
        await Nicko.react('surprised');
        if (G.once('underbedPrint')) {
          G.collect('print-bedroom');
        } else {
          G.sfx('giggle');
        }
      } },
    { id: 'books', x: 90, y: 30, w: 12, label: 'Books',
      svg: '<svg viewBox="0 0 120 110"><defs><linearGradient id="lg-shelf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08A52"/><stop offset="1" stop-color="#96622F"/></linearGradient></defs><ellipse cx="60" cy="102" rx="52" ry="6" fill="rgba(90,55,25,0.2)"/><rect x="6" y="82" width="108" height="14" rx="5" fill="url(#lg-shelf)"/><rect x="6" y="82" width="108" height="5" rx="2.5" fill="#DCA964"/><rect x="16" y="32" width="19" height="52" rx="4" fill="#F0664A"/><rect x="16" y="32" width="7" height="52" rx="3" fill="#fff" opacity="0.3"/><rect x="37" y="24" width="19" height="60" rx="4" fill="#57C4AD"/><rect x="37" y="24" width="7" height="60" rx="3" fill="#fff" opacity="0.3"/><rect x="58" y="36" width="19" height="48" rx="4" fill="#6BA8E8"/><rect x="58" y="36" width="7" height="48" rx="3" fill="#fff" opacity="0.3"/><rect x="79" y="28" width="19" height="56" rx="4" fill="#FFD65A"/><rect x="79" y="28" width="7" height="56" rx="3" fill="#fff" opacity="0.35"/></svg>',
      onTap: async function (G) {
        G.sfx('magic'); G.sparkleAt(90, 26, 8);
        await Nicko.react('happy');
        if (Inventory.unlock('book')) G.toast('Book added to the toybox!', '📖');
        else if (G.once('booksRead')) G.points(5);
      } },
    { id: 'toybox', x: 14, y: 80, w: 12, label: 'Toy box',
      svg: '<svg viewBox="0 0 120 110"><defs><linearGradient id="lg-tbox" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB37E"/><stop offset="1" stop-color="#E87F4E"/></linearGradient></defs><ellipse cx="60" cy="104" rx="48" ry="7" fill="rgba(90,55,25,0.2)"/><path d="M14 52 L106 52 L96 102 L24 102 Z" fill="url(#lg-tbox)"/><path d="M14 52 L30 52 L26 102 L24 102 Z" fill="#fff" opacity="0.18"/><rect x="10" y="38" width="100" height="24" rx="9" fill="#D96A3C"/><rect x="10" y="38" width="100" height="8" rx="4" fill="#F08A52"/><circle cx="60" cy="50" r="8" fill="#7A4A2A"/><circle cx="60" cy="50" r="3.5" fill="#FFD65A"/></svg>',
      onTap: async function (G) { G.sfx('click'); await Nicko.react('happy', 900); } },
    { id: 'teddy', x: 34, y: 84, w: 8, label: 'Teddy bear', glowSoft: true, drag: true,
      svg: '<svg viewBox="0 0 100 100"><defs><radialGradient id="lg-teddy" cx="0.4" cy="0.35" r="0.9"><stop offset="0" stop-color="#E8B983"/><stop offset="1" stop-color="#C68B59"/></radialGradient></defs><ellipse cx="50" cy="94" rx="30" ry="6" fill="rgba(90,55,25,0.2)"/><circle cx="29" cy="25" r="13" fill="url(#lg-teddy)"/><circle cx="71" cy="25" r="13" fill="url(#lg-teddy)"/><circle cx="29" cy="25" r="6" fill="#F3D9B8"/><circle cx="71" cy="25" r="6" fill="#F3D9B8"/><ellipse cx="50" cy="58" rx="24" ry="30" fill="url(#lg-teddy)"/><ellipse cx="50" cy="66" rx="13" ry="11" fill="#F3D9B8"/><circle cx="41" cy="50" r="4.4" fill="#3A2A1A"/><circle cx="59" cy="50" r="4.4" fill="#3A2A1A"/><circle cx="42.5" cy="48.5" r="1.4" fill="#fff"/><circle cx="60.5" cy="48.5" r="1.4" fill="#fff"/><ellipse cx="50" cy="60" rx="5.5" ry="4.4" fill="#3A2A1A"/><path d="M50 64 q0 4 -5 4 M50 64 q0 4 5 4" stroke="#3A2A1A" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="32" cy="80" rx="10" ry="12" fill="url(#lg-teddy)"/><ellipse cx="68" cy="80" rx="10" ry="12" fill="url(#lg-teddy)"/></svg>',
      onTap: async function (G) { await G.tidyToy('teddy', 'toybox'); } },
    { id: 'duck', x: 56, y: 87, w: 8, label: 'Rubber duck', glowSoft: true, drag: true,
      svg: '<svg viewBox="0 0 100 100"><defs><radialGradient id="lg-duck" cx="0.38" cy="0.32" r="0.95"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#F2B73C"/></radialGradient></defs><ellipse cx="50" cy="92" rx="30" ry="6" fill="rgba(90,55,25,0.18)"/><ellipse cx="50" cy="66" rx="28" ry="21" fill="url(#lg-duck)"/><ellipse cx="40" cy="58" rx="10" ry="7" fill="#fff" opacity="0.4"/><circle cx="66" cy="42" r="17" fill="url(#lg-duck)"/><circle cx="70" cy="38" r="3.6" fill="#3A2A1A"/><circle cx="71" cy="37" r="1.2" fill="#fff"/><path d="M81 44 l15 5 -15 7 z" fill="#F08A2E"/><path d="M81 44 l15 5 -7 1 z" fill="#FFB35C"/><path d="M28 54 q12 -13 25 -9" stroke="#D89A2E" stroke-width="6" fill="none" stroke-linecap="round"/></svg>',
      onTap: async function (G) { await G.tidyToy('duck', 'toybox'); } }
  ]
},

/* ================= BATHROOM ================= */
bathroom: {
  id: 'bathroom', label: 'Bathroom', icon: '🛁',
  bg: wallFloor('#CFE8F5', '#A9CBE0',
    '<g><rect x="0" y="0" width="1000" height="352" fill="#DFF0FA"/>' +
    '<g fill="#EAF6FC" stroke="#C4DCEC" stroke-width="4">' +
    '<rect x="56" y="36" width="124" height="124" rx="10"/><rect x="216" y="36" width="124" height="124" rx="10"/><rect x="376" y="36" width="124" height="124" rx="10"/><rect x="536" y="36" width="124" height="124" rx="10"/><rect x="696" y="36" width="124" height="124" rx="10"/><rect x="856" y="36" width="124" height="124" rx="10"/>' +
    '<rect x="56" y="196" width="124" height="124" rx="10"/><rect x="216" y="196" width="124" height="124" rx="10"/><rect x="376" y="196" width="124" height="124" rx="10"/><rect x="536" y="196" width="124" height="124" rx="10"/><rect x="696" y="196" width="124" height="124" rx="10"/><rect x="856" y="196" width="124" height="124" rx="10"/></g>' +
    '<g fill="#fff" opacity="0.35"><rect x="66" y="46" width="50" height="18" rx="9"/><rect x="226" y="46" width="50" height="18" rx="9"/><rect x="386" y="206" width="50" height="18" rx="9"/><rect x="706" y="46" width="50" height="18" rx="9"/></g></g>' +
    '<ellipse cx="500" cy="560" rx="200" ry="30" fill="#fff" opacity="0.35"/>'),
  objects: [
    { id: 'sink', x: 20, y: 60, w: 17, label: 'Sink', glowSoft: true,
      svg: '<svg viewBox="0 0 170 150"><defs><linearGradient id="lg-sink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCEBF5"/></linearGradient><linearGradient id="lg-tap" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9FB4C4"/><stop offset="0.5" stop-color="#D5E3ED"/><stop offset="1" stop-color="#8FA5B8"/></linearGradient></defs><ellipse cx="85" cy="144" rx="60" ry="7" fill="rgba(70,90,110,0.18)"/><rect x="60" y="104" width="50" height="40" rx="9" fill="url(#lg-tap)"/><rect x="60" y="104" width="50" height="10" rx="5" fill="#fff" opacity="0.35"/><ellipse cx="85" cy="80" rx="64" ry="32" fill="url(#lg-sink)" stroke="#B9CFDE" stroke-width="5"/><ellipse cx="85" cy="76" rx="47" ry="20" fill="#CFE8F7"/><ellipse cx="68" cy="70" rx="16" ry="7" fill="#fff" opacity="0.6"/><path d="M85 52 L85 22" stroke="url(#lg-tap)" stroke-width="11" stroke-linecap="round"/><path d="M85 24 q-26 0 -32 20" stroke="url(#lg-tap)" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="53" cy="44" r="7" fill="#D5E3ED"/><g class="water-stream" opacity="0"><rect x="47" y="42" width="13" height="52" rx="6.5" fill="#7ECBF2"><animate attributeName="y" values="42;48;42" dur="0.5s" repeatCount="indefinite"/></rect><rect x="50" y="42" width="4" height="52" rx="2" fill="#BFE6FA" opacity="0.8"><animate attributeName="y" values="42;48;42" dur="0.5s" repeatCount="indefinite"/></rect></g></svg>',
      onTap: async function (G) { await G.sinkTap(); } },
    { id: 'soap', x: 35, y: 52, w: 8, label: 'Soap', drag: true,
      svg: '<svg viewBox="0 0 80 90"><defs><linearGradient id="lg-soap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC2DA"/><stop offset="1" stop-color="#F27FAE"/></linearGradient></defs><ellipse cx="40" cy="84" rx="28" ry="5" fill="rgba(70,90,110,0.15)"/><rect x="14" y="46" width="52" height="36" rx="13" fill="url(#lg-soap)"/><rect x="14" y="46" width="52" height="13" rx="6.5" fill="#FFD3E4"/><ellipse cx="28" cy="58" rx="7" ry="4" fill="#fff" opacity="0.5"/><g class="amb-bob"><circle cx="28" cy="30" r="8" fill="#CDE9FB"/><circle cx="46" cy="21" r="10" fill="#CDE9FB"/><circle cx="60" cy="33" r="7" fill="#CDE9FB"/><circle cx="28" cy="28" r="2.5" fill="#fff"/><circle cx="46" cy="19" r="3" fill="#fff"/></g></svg>',
      onTap: async function (G) { await G.soapTap(); } },
    { id: 'towel', x: 82, y: 46, w: 10, label: 'Towel', drag: true,
      svg: '<svg viewBox="0 0 100 120"><defs><linearGradient id="lg-towel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8FE3D8"/><stop offset="0.5" stop-color="#6FD3C6"/><stop offset="1" stop-color="#57BFAF"/></linearGradient></defs><rect x="28" y="4" width="44" height="14" rx="7" fill="#8A5A3B"/><circle cx="50" cy="11" r="4" fill="#5A3A22"/><rect x="22" y="18" width="56" height="94" rx="12" fill="url(#lg-towel)"/><rect x="22" y="18" width="14" height="94" rx="7" fill="#fff" opacity="0.22"/><rect x="22" y="90" width="56" height="11" fill="#4AA89C"/><rect x="22" y="30" width="56" height="9" fill="#4AA89C"/><path d="M30 104 q4 4 8 0 q4 -4 8 0 q4 4 8 0 q4 -4 8 0" stroke="#fff" stroke-width="3" fill="none" opacity="0.6"/></svg>',
      onTap: async function (G) { await G.towelTap(); } },
    { id: 'tub', x: 60, y: 68, w: 27, label: 'Bathtub',
      svg: '<svg viewBox="0 0 260 150"><defs><linearGradient id="lg-tub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D5E7F3"/></linearGradient><linearGradient id="lg-tubw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8D9F2"/><stop offset="1" stop-color="#7EC3EA"/></linearGradient></defs><ellipse cx="130" cy="142" rx="115" ry="9" fill="rgba(70,90,110,0.18)"/><rect x="30" y="126" width="18" height="18" rx="5" fill="#8FA5B8"/><rect x="212" y="126" width="18" height="18" rx="5" fill="#8FA5B8"/><g class="tub-water" opacity="0.25"><rect x="38" y="48" width="184" height="28" rx="13" fill="#7ECBF2"/></g><path d="M22 60 L238 60 L222 138 Q221 144 214 144 L46 144 Q39 144 38 138 Z" fill="url(#lg-tub)" stroke="#B9CFDE" stroke-width="5"/><ellipse cx="130" cy="60" rx="108" ry="26" fill="url(#lg-tubw)"/><ellipse cx="130" cy="57" rx="92" ry="18" fill="#C9E8FA"/><ellipse cx="95" cy="52" rx="26" ry="7" fill="#fff" opacity="0.55"/><g class="tub-bubbles" opacity="0.55"><circle cx="80" cy="52" r="7" fill="#fff"/><circle cx="100" cy="58" r="5" fill="#fff"/><circle cx="150" cy="52" r="6" fill="#fff"/><circle cx="170" cy="59" r="4.5" fill="#fff"/><circle cx="125" cy="60" r="5" fill="#fff"/></g><rect x="196" y="18" width="12" height="44" rx="6" fill="url(#lg-tub)"/><rect x="190" y="18" width="26" height="10" rx="5" fill="#8FA5B8"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(60);
        var el = G.el('tub');
        if (el) el.querySelector('.tub-water').setAttribute('opacity', '0.9');
        G.sfx('pour');
        await G.wait(700);
        await Nicko.react('happy');
        G.sfx('splash'); G.splashAt(60, 62);
        G.sfx('bubbles');
        await Nicko.action('shakeoff');
        await Nicko.react('happy');
        if (G.once('tubFun')) G.points(10);
        if (el) el.querySelector('.tub-water').setAttribute('opacity', '0.25');
      } },
    { id: 'toilet', x: 82, y: 66, w: 12, label: 'Toilet',
      svg: '<svg viewBox="0 0 130 140"><defs><linearGradient id="lg-loo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D9E8F2"/></linearGradient></defs><ellipse cx="65" cy="134" rx="50" ry="7" fill="rgba(70,90,110,0.16)"/><rect x="40" y="86" width="50" height="48" rx="10" fill="url(#lg-loo)" stroke="#B9CFDE" stroke-width="4"/><rect x="32" y="42" width="66" height="26" rx="10" fill="url(#lg-loo)" stroke="#B9CFDE" stroke-width="4"/><rect x="32" y="42" width="66" height="9" rx="4.5" fill="#fff" opacity="0.5"/><ellipse cx="65" cy="88" rx="38" ry="14" fill="url(#lg-loo)" stroke="#B9CFDE" stroke-width="4"/><ellipse cx="65" cy="86" rx="26" ry="8" fill="#9AD6F2"/></svg>',
      onTap: async function (G) {
        G.sfx('flush');
        await Nicko.react('scared');
        G.sfx('giggle');
        if (G.once('toiletFun')) G.points(5);
      } },
    { id: 'mirror', x: 46, y: 32, w: 14, label: 'Mirror',
      svg: '<svg viewBox="0 0 140 150"><defs><linearGradient id="lg-mir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8F6FD"/><stop offset="0.5" stop-color="#BFE3F4"/><stop offset="1" stop-color="#D8EFFA"/></linearGradient></defs><ellipse cx="70" cy="144" rx="52" ry="6" fill="rgba(70,90,110,0.15)"/><rect x="22" y="6" width="96" height="132" rx="44" fill="#C08A52"/><rect x="26" y="10" width="88" height="124" rx="40" fill="#96622F"/><rect x="34" y="18" width="72" height="108" rx="32" fill="url(#lg-mir)"/><path d="M44 30 L60 118" stroke="#fff" stroke-width="10" opacity="0.55" stroke-linecap="round"/><path d="M60 26 L74 118" stroke="#fff" stroke-width="5" opacity="0.35" stroke-linecap="round"/><circle cx="108" cy="72" r="4" fill="#FFD166" stroke="#B57E1B" stroke-width="2"/></svg>',
      onTap: async function (G) {
        await Nicko.react('love');
        G.sparkleAt(46, 30, 8);
        G.sfx('pop');
        /* Wearing an accessory + mirror = extra proud */
        var eq = window.Store.data.equipped;
        if ((eq.hat || eq.glasses || eq.bowtie) && G.once('mirrorFancy')) {
          await Nicko.react('proud');
          G.sfx('giggle');
          G.points(10);
        } else if (G.once('mirrorFun')) G.points(5);
      } },
    { id: 'drawer', x: 62, y: 30, w: 10, label: 'Drawer',
      svg: '<svg viewBox="0 0 150 90"><defs><linearGradient id="lg-draw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D9E8F2"/></linearGradient></defs><rect x="8" y="8" width="134" height="74" rx="10" fill="url(#lg-draw)" stroke="#B9CFDE" stroke-width="4"/><rect x="8" y="8" width="134" height="20" rx="10" fill="#fff" opacity="0.5"/><rect x="58" y="36" width="34" height="12" rx="6" fill="#8FA5B8"/><circle cx="75" cy="42" r="3" fill="#5A6E7E"/></svg>',
      onTap: async function (G) {
        G.sfx('pop');
        await Nicko.react('wow');
        if (Inventory.unlock('bowtie')) G.toast('Bow tie found! Tap it in the toybox to wear it.', '🎀');
        else await Nicko.react('happy', 900);
      } },
    { id: 'puddle', x: 36, y: 90, w: 13, label: 'Puddle',
      svg: '<svg viewBox="0 0 130 50"><ellipse cx="65" cy="26" rx="58" ry="20" fill="#7ECBF2" opacity="0.85"/><ellipse cx="45" cy="22" rx="20" ry="8" fill="#fff" opacity="0.45"/><ellipse cx="80" cy="30" rx="12" ry="5" fill="#fff" opacity="0.35"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(36);
        G.sfx('slide');
        await Nicko.action('slip');
        await Nicko.react('surprised');
        G.splashAt(36, 88);
        if (G.once('slipFun')) G.points(5);
      } },
    { id: 'shelf', x: 82, y: 24, w: 13, label: 'High shelf',
      svg: '<svg viewBox="0 0 130 90"><defs><linearGradient id="lg-hshelf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08A52"/><stop offset="1" stop-color="#96622F"/></linearGradient></defs><rect x="6" y="66" width="118" height="12" rx="5" fill="url(#lg-hshelf)"/><rect x="6" y="66" width="118" height="4" rx="2" fill="#DCA964"/><rect x="24" y="30" width="26" height="36" rx="6" fill="#FFD65A"/><rect x="24" y="30" width="26" height="12" rx="6" fill="#FFE066"/><rect x="56" y="22" width="30" height="44" rx="6" fill="#FF9D6B"/><rect x="56" y="22" width="30" height="14" rx="6" fill="#FFB98A"/><circle cx="102" cy="48" r="16" fill="#CDE9FB"/><circle cx="96" cy="42" r="5" fill="#fff" opacity="0.7"/></svg>',
      onTap: async function (G) {
        await Nicko.react('wow');
        if (G.once('shelfPrint')) {
          G.collect('print-bathroom');
        }
      } }
  ]
},

/* ================= KITCHEN ================= */
kitchen: {
  id: 'kitchen', label: 'Kitchen', icon: '🍳',
  bg: wallFloor('#FFE3C2', '#C98F5A',
    '<rect x="0" y="0" width="1000" height="200" fill="#FFD9A8"/>' +
    '<rect x="0" y="196" width="1000" height="8" fill="#E8A95C"/>' +
    '<rect x="0" y="204" width="1000" height="148" fill="#FFE9CF"/>' +
    '<g><rect x="120" y="56" width="200" height="112" rx="12" fill="#FFFDF4" stroke="#E8B06E" stroke-width="6"/><rect x="120" y="56" width="200" height="34" rx="12" fill="#F6C177"/><line x1="220" y1="90" x2="220" y2="168" stroke="#E8B06E" stroke-width="4"/><circle cx="208" cy="130" r="6" fill="#B57E1B"/><circle cx="232" cy="130" r="6" fill="#B57E1B"/></g>' +
    '<g><rect x="680" y="56" width="200" height="112" rx="12" fill="#FFFDF4" stroke="#E8B06E" stroke-width="6"/><rect x="680" y="56" width="200" height="34" rx="12" fill="#F6C177"/><line x1="780" y1="90" x2="780" y2="168" stroke="#E8B06E" stroke-width="4"/><circle cx="768" cy="130" r="6" fill="#B57E1B"/><circle cx="792" cy="130" r="6" fill="#B57E1B"/></g>'),
  objects: [
    { id: 'stove', x: 20, y: 60, w: 19, label: 'Stove', glowSoft: true,
      svg: '<svg viewBox="0 0 190 170"><defs><linearGradient id="lg-stove" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E747C"/><stop offset="1" stop-color="#4A4F55"/></linearGradient></defs><ellipse cx="95" cy="162" rx="80" ry="7" fill="rgba(90,55,25,0.22)"/><rect x="40" y="8" width="110" height="26" rx="8" fill="#9AA1A9"/><rect x="40" y="8" width="110" height="9" rx="4" fill="#B9BFC6"/><rect x="14" y="30" width="162" height="120" rx="12" fill="url(#lg-stove)"/><rect x="30" y="46" width="130" height="60" rx="8" fill="#2E3237"/><circle cx="65" cy="70" r="16" fill="#24282C" stroke="#8A9099" stroke-width="3"/><circle cx="125" cy="70" r="16" fill="#24282C" stroke="#8A9099" stroke-width="3"/><rect x="60" y="118" width="70" height="18" rx="8" fill="#2E3237"/><circle cx="76" cy="127" r="5" fill="#C0C7CE"/><circle cx="114" cy="127" r="5" fill="#C0C7CE"/><circle cx="150" cy="127" r="8" fill="#FF5A3C"><animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite"/></circle><circle cx="150" cy="127" r="12" fill="#FF5A3C" opacity="0.25"><animate attributeName="opacity" values="0.25;0.05;0.25" dur="1.2s" repeatCount="indefinite"/></circle></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(24);
        G.heatWaves(15, 52);
        G.hotBadge(15, 38, 'HOT!');
        G.sfx('sizzle');
        await Nicko.react('scared');
        await Nicko.walkTo(38);
        Nicko.face('left');
        await Nicko.react('sad');
        if (G.once('stoveSafe')) {
          G.setFlag('stoveLearned', true);
          G.points(15);
          G.toast('Hot stove! Nicko stays back.', '🔥');
          G.checkKitchen();
        }
      } },
    { id: 'fridge', x: 40, y: 56, w: 17, label: 'Refrigerator',
      svg: '<svg viewBox="0 0 170 220"><defs><linearGradient id="lg-fridge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F4FAFD"/><stop offset="0.5" stop-color="#DCEBF4"/><stop offset="1" stop-color="#BFD4E0"/></linearGradient></defs><ellipse cx="85" cy="212" rx="62" ry="7" fill="rgba(90,55,25,0.18)"/><rect x="20" y="10" width="130" height="200" rx="16" fill="url(#lg-fridge)" stroke="#A9C2D0" stroke-width="5"/><line x1="20" y1="100" x2="150" y2="100" stroke="#A9C2D0" stroke-width="4"/><rect x="128" y="30" width="11" height="50" rx="5.5" fill="#8FA8B8"/><rect x="128" y="120" width="11" height="50" rx="5.5" fill="#8FA8B8"/><rect x="28" y="18" width="20" height="74" rx="6" fill="#fff" opacity="0.45"/><circle cx="60" cy="55" r="14" fill="#FFD65A"/><circle cx="56" cy="51" r="4" fill="#FFE9A8"/><rect x="42" y="130" width="40" height="26" rx="8" fill="#BFE6FA"/><rect x="42" y="130" width="40" height="9" rx="4.5" fill="#fff" opacity="0.5"/></svg>',
      onTap: async function (G) { await G.fridgeTap(); } },
    { id: 'fruitbowl', x: 58, y: 44, w: 13, label: 'Fruit bowl',
      svg: '<svg viewBox="0 0 130 100"><defs><radialGradient id="lg-fbowl" cx="0.5" cy="0.35" r="0.9"><stop offset="0" stop-color="#D89A62"/><stop offset="1" stop-color="#A96F3E"/></radialGradient></defs><ellipse cx="65" cy="90" rx="46" ry="7" fill="rgba(90,55,25,0.2)"/><circle cx="42" cy="52" r="17" fill="#FF6B5E"/><ellipse cx="36" cy="46" rx="6" ry="8" fill="#FF8A7A" opacity="0.7"/><circle cx="68" cy="44" r="17" fill="#FFB62E"/><ellipse cx="62" cy="38" rx="6" ry="8" fill="#FFD166" opacity="0.8"/><circle cx="92" cy="56" r="15" fill="#8FD16F"/><ellipse cx="87" cy="51" rx="5" ry="7" fill="#B7E3A0" opacity="0.8"/><path d="M68 28 q4 -10 12 -12" stroke="#5A8F3C" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="65" cy="72" rx="52" ry="18" fill="url(#lg-fbowl)"/><ellipse cx="65" cy="68" rx="40" ry="10" fill="#7C4F22" opacity="0.5"/></svg>',
      onTap: async function (G) {
        if (!G.el('apple')) {
          G.spawn({ id: 'apple', x: 58, y: 60, w: 7, label: 'Apple', drag: true,
            svg: '<svg viewBox="0 0 70 70"><defs><radialGradient id="lg-apple" cx="0.38" cy="0.3" r="0.9"><stop offset="0" stop-color="#FF8A7A"/><stop offset="1" stop-color="#E84A4A"/></radialGradient></defs><ellipse cx="35" cy="64" rx="20" ry="4" fill="rgba(90,55,25,0.2)"/><path d="M35 16 q4 -10 12 -12" stroke="#5A8F3C" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="44" cy="12" rx="9" ry="5" fill="#57C4AD" transform="rotate(-24 44 12)"/><circle cx="35" cy="38" r="24" fill="url(#lg-apple)"/><ellipse cx="27" cy="32" rx="7" ry="10" fill="#FFB0A0" opacity="0.65"/></svg>',
            onTap: async function (G2) {
              G2.sfx('boing');
              await G2.sendTo('apple', 74, 86, 900);
              await Nicko.walkTo(70);
              await Nicko.action('pounce');
              await Nicko.react('happy');
              G2.despawn('apple');
              if (G2.once('appleChase')) G2.points(5);
            } });
          G.sfx('pop');
          await Nicko.react('happy', 900);
        }
      } },
    { id: 'lemon', x: 68, y: 46, w: 7, label: 'Lemon', drag: true,
      svg: '<svg viewBox="0 0 70 70"><defs><radialGradient id="lg-lemon" cx="0.38" cy="0.3" r="0.9"><stop offset="0" stop-color="#FFF49A"/><stop offset="1" stop-color="#F2C93C"/></radialGradient></defs><ellipse cx="35" cy="62" rx="20" ry="4" fill="rgba(90,55,25,0.2)"/><ellipse cx="35" cy="38" rx="22" ry="18" fill="url(#lg-lemon)"/><path d="M14 34 q-8 -2 -8 -8 M56 42 q8 2 8 8" stroke="#D8A92E" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="28" cy="32" rx="6" ry="8" fill="#FFFBE0" opacity="0.85"/><circle cx="44" cy="44" r="1.6" fill="#D8A92E"/><circle cx="38" cy="46" r="1.6" fill="#D8A92E"/></svg>',
      onTap: async function (G) {
        G.sfx('pop');
        await Nicko.react('confused', 900);
      } },
    { id: 'milk', x: 78, y: 48, w: 8, label: 'Milk carton', drag: true,
      svg: '<svg viewBox="0 0 80 100"><defs><linearGradient id="lg-milk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.5" stop-color="#EFF7FC"/><stop offset="1" stop-color="#D5E7F1"/></linearGradient></defs><ellipse cx="40" cy="94" rx="26" ry="5" fill="rgba(90,55,25,0.18)"/><path d="M20 40 L20 90 L60 90 L60 40 L40 14 Z" fill="url(#lg-milk)" stroke="#A9C2D0" stroke-width="4"/><path d="M20 40 L40 14 L60 40" fill="#DFF3FD" stroke="#A9C2D0" stroke-width="4"/><path d="M20 40 L40 14 L40 40 Z" fill="#fff" opacity="0.5"/><rect x="28" y="52" width="24" height="26" rx="5" fill="#7ECBF2"/><circle cx="40" cy="62" r="6" fill="#fff"/><path d="M34 60 q3 -4 6 0 M40 60 q3 -4 6 0" stroke="#7ECBF2" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
      onTap: async function (G) {
        G.sfx('pop');
        await Nicko.react('yum', 900);
      } },
    { id: 'bowl', x: 66, y: 82, w: 11, label: 'Food bowl',
      svg: '<svg viewBox="0 0 110 80"><defs><radialGradient id="lg-bowl" cx="0.5" cy="0.35" r="0.9"><stop offset="0" stop-color="#FF9D92"/><stop offset="1" stop-color="#E86A5A"/></radialGradient></defs><ellipse cx="55" cy="74" rx="42" ry="6" fill="rgba(90,55,25,0.2)"/><path d="M12 30 L98 30 L86 68 Q84 74 76 74 L34 74 Q26 74 24 68 Z" fill="url(#lg-bowl)"/><path d="M12 30 L30 30 L27 68 Q26.5 71 29 73 L22 73 Q24 71 24 68 Z" fill="#fff" opacity="0.2"/><ellipse cx="55" cy="30" rx="43" ry="12" fill="#D1543F"/><ellipse class="bowl-food" cx="55" cy="28" rx="32" ry="8" fill="#FFF6EE"/><ellipse class="bowl-food" cx="45" cy="27" rx="8" ry="3" fill="#F2D9C4"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(66);
        /* Personality: an empty bowl when hungry gets a confused look */
        if (Needs.get('hunger') < 40 && !G.flag('bowlFull')) {
          await Nicko.react('confused');
          Nicko.think('🍎');
        } else {
          await Nicko.react('yum', 900);
          G.sfx('purr');
        }
      } },
    { id: 'spill', x: 50, y: 90, w: 13, label: 'Spilled juice', glowSoft: true,
      svg: '<svg viewBox="0 0 130 50"><ellipse class="spill-blob" cx="65" cy="26" rx="56" ry="19" fill="#FFB62E" opacity="0.9"/><ellipse cx="45" cy="22" rx="18" ry="7" fill="#fff" opacity="0.35"/><ellipse cx="85" cy="30" rx="12" ry="5" fill="#fff" opacity="0.25"/></svg>',
      onTap: async function (G) {
        var n = (G.flag('spillWipes') || 0) + 1;
        G.setFlag('spillWipes', n);
        G.sfx('pop');
        var el = G.el('spill');
        if (el) { var b = el.querySelector('.spill-blob'); if (b) b.setAttribute('rx', String(56 - n * 16)); }
        await Nicko.react('happy', 900);
        if (n >= 3) {
          G.hide('spill');
          G.sparkleAt(50, 88, 8);
          G.points(10);
          Needs.change('happy', 6);
          G.setFlag('spillWipes', 0);
          setTimeout(function () { try { G.show('spill'); var e2 = G.el('spill'); if (e2) { var b2 = e2.querySelector('.spill-blob'); if (b2) b2.setAttribute('rx', '56'); } } catch (e) {} }, 45000);
        }
      } },
    { id: 'cabinet', x: 86, y: 32, w: 14, label: 'Cabinet',
      svg: '<svg viewBox="0 0 140 120"><defs><linearGradient id="lg-cab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08A52"/><stop offset="1" stop-color="#96622F"/></linearGradient></defs><rect x="14" y="10" width="112" height="100" rx="10" fill="url(#lg-cab)"/><rect x="14" y="10" width="112" height="24" rx="10" fill="#DCA964"/><line x1="70" y1="10" x2="70" y2="110" stroke="#7A5230" stroke-width="5"/><circle cx="60" cy="60" r="6" fill="#5A3A20"/><circle cx="80" cy="60" r="6" fill="#5A3A20"/><circle cx="60" cy="58" r="2" fill="#C08A52"/><circle cx="80" cy="58" r="2" fill="#C08A52"/></svg>',
      onTap: async function (G) {
        G.sfx('crash');
        var el = G.el('cabinet');
        if (el) { el.classList.remove('wobble'); void el.offsetWidth; el.classList.add('wobble'); }
        await Nicko.react('surprised');
        var rattles = (G.flag('cabinetRattles') || 0) + 1;
        G.setFlag('cabinetRattles', rattles);
        if (rattles === 1 && G.once('cabinetFun')) G.points(5);
        if (rattles >= 2 && G.once('cabinetPrint')) {
          G.collect('print-kitchen');
        }
      } },
    { id: 'trash', x: 82, y: 70, w: 11, label: 'Trash can',
      svg: '<svg viewBox="0 0 110 130"><defs><linearGradient id="lg-trash" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A3BAC9"/><stop offset="0.5" stop-color="#8FA8B8"/><stop offset="1" stop-color="#7A93A3"/></linearGradient></defs><ellipse cx="55" cy="124" rx="40" ry="6" fill="rgba(90,55,25,0.18)"/><path d="M22 36 L88 36 L80 118 Q79 124 72 124 L38 124 Q31 124 30 118 Z" fill="url(#lg-trash)"/><path d="M22 36 L36 36 L33 118 Q32.5 121 35 123 L31 123 Q31 121 30 118 Z" fill="#fff" opacity="0.2"/><rect x="16" y="24" width="78" height="16" rx="8" fill="#6E8797"/><rect x="16" y="24" width="78" height="6" rx="3" fill="#8FA8B8"/><rect x="44" y="10" width="22" height="18" rx="6" fill="#6E8797"/></svg>',
      onTap: async function (G) {
        if (G.el('paperball')) return;
        G.spawn({ id: 'paperball', x: 78, y: 40, w: 6, label: 'Paper ball', drag: true,
          svg: '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="22" fill="#FFFDF7" stroke="#D8DEE6" stroke-width="4"/><path d="M18 24 l12 8 M40 20 l-8 12" stroke="#C4CCD6" stroke-width="3" stroke-linecap="round"/><path d="M22 40 q8 6 16 2" stroke="#C4CCD6" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
          onTap: async function (G2) { await G2.tossPaper(); } });
        G.sfx('whoosh');
        await G.sendTo('paperball', 90, 58, 600);
        G.sfx('pop');
        await Nicko.react('happy', 900);
        if (G.once('trashToss')) G.points(5);
      } }
  ]
}

});
