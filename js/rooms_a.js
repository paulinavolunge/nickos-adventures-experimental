/* Nicko's Adventures - rooms part A: bedroom, bathroom, kitchen */
window.ROOMS = window.ROOMS || {};

function wallFloor(wall, floor, extra) {
  return '<svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="0" y="0" width="1000" height="470" fill="' + wall + '"/>' +
    '<rect x="0" y="470" width="1000" height="150" fill="' + floor + '"/>' +
    '<rect x="0" y="462" width="1000" height="12" fill="rgba(0,0,0,0.12)"/>' +
    '<g stroke="rgba(0,0,0,0.07)" stroke-width="3">' +
    '<line x1="0" y1="510" x2="1000" y2="510"/><line x1="0" y1="560" x2="1000" y2="560"/><line x1="0" y1="610" x2="1000" y2="610"/>' +
    '</g>' + (extra || '') + '</svg>';
}

Object.assign(window.ROOMS, {

/* ================= BEDROOM ================= */
bedroom: {
  id: 'bedroom', label: 'Bedroom', icon: '🛏️',
  bg: wallFloor('#FDEBD3', '#D99A55',
    '<ellipse cx="500" cy="560" rx="300" ry="46" fill="#F6C177" opacity="0.7"/>' +
    '<circle cx="880" cy="120" r="46" fill="#FFE9A8"/><circle cx="880" cy="120" r="60" fill="#FFE9A8" opacity="0.35"/>' +
    '<rect x="120" y="90" width="130" height="100" rx="14" fill="#fff" stroke="#E8B06E" stroke-width="6"/>' +
    '<path d="M150 150 q30 -34 70 0" stroke="#E8B06E" stroke-width="6" fill="none" stroke-linecap="round"/>'),
  objects: [
    { id: 'lamp', x: 13, y: 56, w: 10, label: 'Lamp', glowSoft: true,
      svg: '<svg viewBox="0 0 100 130"><rect x="42" y="95" width="16" height="30" rx="6" fill="#8A5A3B"/><ellipse cx="50" cy="128" rx="26" ry="6" fill="#6E452D"/><path d="M20 95 L80 95 L68 40 L32 40 Z" fill="#FFD65A"/><path class="lamp-glow" d="M20 95 L80 95 L68 40 L32 40 Z" fill="#FFE9A8" opacity="0.0"/></svg>',
      onTap: async function (G) {
        var on = !G.flag('lampOn');
        G.setFlag('lampOn', on);
        G.dim(!on);
        G.sfx('click');
        var el = G.el('lamp');
        if (el) el.querySelector('.lamp-glow').setAttribute('opacity', on ? '0.0' : '0.85');
        if (!on && G.flag('pjs') && !G.flag('bedtimeDone')) {
          await G.wait(600);
          await Nicko.walkTo(74);
          G.toast('Shhh... sleepy time', '🌙');
          Nicko.mood('sleeping', true);
          await Nicko.react('sleepy', 2600);
          G.sfx('snore');
          await G.wait(2400);
          Nicko.mood('sleeping', false);
          G.dim(false); G.setFlag('lampOn', true);
          var lampEl = G.el('lamp');
          if (lampEl) lampEl.querySelector('.lamp-glow').setAttribute('opacity', '0.0');
          await Nicko.react('happy');
          G.setFlag('bedtimeDone', true);
          G.achieve('bedtime-star');
          G.points(30, 'Bedtime routine complete!');
        } else {
          G.toast(on ? 'Lights on!' : 'Lights out!', on ? '💡' : '🌙');
        }
      } },
    { id: 'clock', x: 22, y: 62, w: 8, label: 'Alarm clock',
      svg: '<svg viewBox="0 0 100 100"><rect x="18" y="60" width="64" height="34" rx="10" fill="#FF8A7A"/><circle cx="50" cy="42" r="26" fill="#fff" stroke="#FF8A7A" stroke-width="6"/><line x1="50" y1="42" x2="50" y2="26" stroke="#4A2F2A" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="42" x2="62" y2="48" stroke="#4A2F2A" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="42" r="4" fill="#4A2F2A"/><path d="M28 22 L20 8 M72 22 L80 8" stroke="#FF8A7A" stroke-width="7" stroke-linecap="round"/></svg>',
      onTap: async function (G) {
        G.sfx('ring');
        await Nicko.react('surprised');
        if (G.once('clockFun')) G.discover('Ring ring! Nicko jumped!', 5);
        else G.toast('Ring ring!', '⏰');
      } },
    { id: 'pajamas', x: 66, y: 55, w: 9, label: 'Nightcap', glowSoft: true,
      svg: '<svg viewBox="0 0 100 100"><path d="M30 70 Q50 10 84 44 L70 58 Q52 34 40 72 Z" fill="#6BA8E8"/><circle cx="84" cy="44" r="11" fill="#fff"/><rect x="24" y="66" width="52" height="14" rx="7" fill="#4A7FC1"/></svg>',
      onTap: async function (G) {
        if (G.flag('pjs')) { G.toast('Already cozy!', '💤'); return; }
        G.setFlag('pjs', true);
        Nicko.mood('nightcap', true);
        G.sfx('pop');
        await Nicko.react('happy');
        G.hide('pajamas');
        G.discover('Cozy nightcap on!', 5);
        if (!G.flag('lampOn') || G.flag('lampOn') === false) { /* lamp state unknown */ }
        G.toast('Now tap the lamp!', '💡');
      } },
    { id: 'window', x: 48, y: 30, w: 16, label: 'Window',
      svg: '<svg viewBox="0 0 160 140"><rect x="8" y="8" width="144" height="124" rx="10" fill="#9AD6F2" stroke="#8A5A3B" stroke-width="8"/><line x1="80" y1="8" x2="80" y2="132" stroke="#8A5A3B" stroke-width="6"/><line x1="8" y1="70" x2="152" y2="70" stroke="#8A5A3B" stroke-width="6"/><circle cx="118" cy="40" r="16" fill="#FFE9A8"/><path d="M20 110 q20 -18 40 0 t40 0" stroke="#57C4AD" stroke-width="8" fill="none" stroke-linecap="round"/></svg>',
      onTap: async function (G) {
        var night = '<svg viewBox="0 0 160 140"><rect x="8" y="8" width="144" height="124" rx="10" fill="#2B3A55" stroke="#8A5A3B" stroke-width="8"/><line x1="80" y1="8" x2="80" y2="132" stroke="#8A5A3B" stroke-width="6"/><line x1="8" y1="70" x2="152" y2="70" stroke="#8A5A3B" stroke-width="6"/><circle cx="118" cy="40" r="14" fill="#F4F1DE"/><circle cx="40" cy="36" r="2.4" fill="#fff"/><circle cx="66" cy="60" r="2" fill="#fff"/><circle cx="100" cy="90" r="2.4" fill="#fff"/><circle cx="52" cy="100" r="2" fill="#fff"/><circle cx="128" cy="100" r="2" fill="#fff"/><ellipse cx="46" cy="52" rx="12" ry="8" fill="#8A6F4D"/><circle cx="42" cy="50" r="2.4" fill="#2B3A55"/><circle cx="52" cy="50" r="2.4" fill="#2B3A55"/></svg>';
        var day = G.el('window') ? G.el('window').dataset.daySvg : null;
        if (!G.el('window').dataset.daySvg) G.el('window').dataset.daySvg = G.el('window').innerHTML;
        G.setSvg('window', night);
        G.sfx('owl');
        await Nicko.react('surprised');
        if (G.once('windowNight')) G.discover('A sleepy owl says hello!', 10);
        setTimeout(function () { try { var el = G.el('window'); if (el && el.dataset.daySvg) el.innerHTML = el.dataset.daySvg; } catch (e) {} }, 6000);
      } },
    { id: 'bed', x: 74, y: 64, w: 30, label: 'Bed',
      svg: '<svg viewBox="0 0 300 190"><rect x="14" y="60" width="30" height="110" rx="10" fill="#8A5A3B"/><rect x="256" y="60" width="30" height="110" rx="10" fill="#8A5A3B"/><rect x="10" y="90" width="280" height="46" rx="16" fill="#7FB6D9"/><rect x="10" y="60" width="280" height="52" rx="16" fill="#A8D4F0"/><rect x="24" y="30" width="90" height="52" rx="18" fill="#fff" stroke="#E8E2D8" stroke-width="4"/><path d="M150 80 q40 -22 90 -6" stroke="#FF9D6B" stroke-width="10" fill="none" stroke-linecap="round"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(74);
        var el = G.el('bed');
        if (el) { el.classList.remove('bounce'); void el.offsetWidth; el.classList.add('bounce'); }
        G.sfx('boing');
        await Nicko.react('happy');
        if (G.once('bedBounce')) G.discover('Bouncy bed!', 5);
      } },
    { id: 'underbed', x: 74, y: 86, w: 24, label: 'Under the bed',
      svg: '<svg viewBox="0 0 240 60"><rect x="10" y="6" width="220" height="48" rx="20" fill="rgba(20,10,20,0.55)"/><circle cx="70" cy="30" r="7" fill="#FFE9A8" opacity="0.9"><animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite"/></circle><circle cx="170" cy="30" r="7" fill="#FFE9A8" opacity="0.9"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite"/></circle></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(74);
        await Nicko.react('surprised');
        if (G.once('underbedPrint')) {
          G.collect('print-bedroom');
          G.toast('A Golden Paw Print was hiding!', '🐾');
        } else {
          G.toast('Just dust bunnies now.', '🐰');
          G.sfx('giggle');
        }
      } },
    { id: 'books', x: 90, y: 30, w: 12, label: 'Books',
      svg: '<svg viewBox="0 0 120 110"><rect x="6" y="80" width="108" height="12" rx="4" fill="#8A5A3B"/><rect x="16" y="30" width="18" height="52" rx="3" fill="#FF8A7A"/><rect x="36" y="22" width="18" height="60" rx="3" fill="#57C4AD"/><rect x="56" y="34" width="18" height="48" rx="3" fill="#6BA8E8"/><rect x="76" y="26" width="18" height="56" rx="3" fill="#FFD65A"/></svg>',
      onTap: async function (G) {
        G.setSvg('books', '<svg viewBox="0 0 120 110"><rect x="6" y="80" width="108" height="12" rx="4" fill="#8A5A3B"/><path d="M20 78 Q45 60 60 78 Q75 60 100 78 L100 40 Q75 24 60 40 Q45 24 20 40 Z" fill="#fff" stroke="#6BA8E8" stroke-width="4"/><line x1="60" y1="40" x2="60" y2="78" stroke="#6BA8E8" stroke-width="3"/></svg>');
        G.sfx('magic'); G.sparkleAt(90, 26, 8);
        await Nicko.react('happy');
        if (G.once('booksRead')) G.discover('Story time!', 5);
        setTimeout(function () {
          try { G.setSvg('books', '<svg viewBox="0 0 120 110"><rect x="6" y="80" width="108" height="12" rx="4" fill="#8A5A3B"/><rect x="16" y="30" width="18" height="52" rx="3" fill="#FF8A7A"/><rect x="36" y="22" width="18" height="60" rx="3" fill="#57C4AD"/><rect x="56" y="34" width="18" height="48" rx="3" fill="#6BA8E8"/><rect x="76" y="26" width="18" height="56" rx="3" fill="#FFD65A"/></svg>'); } catch (e) {}
        }, 5000);
      } },
    { id: 'toybox', x: 14, y: 80, w: 12, label: 'Toy box',
      svg: '<svg viewBox="0 0 120 110"><path d="M14 50 L106 50 L96 104 L24 104 Z" fill="#FF9D6B"/><rect x="10" y="38" width="100" height="22" rx="8" fill="#E87F4E"/><circle cx="60" cy="49" r="7" fill="#7A4A2A"/></svg>',
      onTap: async function (G) { G.toast('Tap the toys to tidy them!', '🧸'); G.sfx('click'); } },
    { id: 'teddy', x: 38, y: 84, w: 8, label: 'Teddy bear', glowSoft: true,
      svg: '<svg viewBox="0 0 100 100"><circle cx="30" cy="26" r="12" fill="#C68B59"/><circle cx="70" cy="26" r="12" fill="#C68B59"/><circle cx="50" cy="52" r="26" fill="#D9A066"/><ellipse cx="50" cy="62" rx="13" ry="10" fill="#F3D9B8"/><circle cx="42" cy="46" r="4" fill="#3A2A1A"/><circle cx="58" cy="46" r="4" fill="#3A2A1A"/><ellipse cx="50" cy="56" rx="5" ry="4" fill="#3A2A1A"/></svg>',
      onTap: async function (G) { await G.tidyToy('teddy', 'toybox'); } },
    { id: 'duck', x: 58, y: 87, w: 8, label: 'Rubber duck', glowSoft: true,
      svg: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="66" rx="28" ry="20" fill="#FFD65A"/><circle cx="66" cy="42" r="16" fill="#FFD65A"/><circle cx="70" cy="38" r="3.4" fill="#3A2A1A"/><path d="M80 44 l14 5 -14 6 z" fill="#FF9D2E"/><path d="M30 52 q10 -12 22 -8" stroke="#E8A93C" stroke-width="6" fill="none" stroke-linecap="round"/></svg>',
      onTap: async function (G) { await G.tidyToy('duck', 'toybox'); } }
  ]
},

/* ================= BATHROOM ================= */
bathroom: {
  id: 'bathroom', label: 'Bathroom', icon: '🛁',
  bg: wallFloor('#D6EBF5', '#B9D6E8',
    '<rect x="0" y="0" width="1000" height="470" fill="#D6EBF5"/>' +
    '<g fill="#EAF6FC"><rect x="60" y="40" width="120" height="120" rx="8"/><rect x="220" y="40" width="120" height="120" rx="8"/><rect x="380" y="40" width="120" height="120" rx="8"/><rect x="540" y="40" width="120" height="120" rx="8"/><rect x="700" y="40" width="120" height="120" rx="8"/><rect x="860" y="40" width="120" height="120" rx="8"/><rect x="60" y="200" width="120" height="120" rx="8"/><rect x="220" y="200" width="120" height="120" rx="8"/><rect x="380" y="200" width="120" height="120" rx="8"/><rect x="540" y="200" width="120" height="120" rx="8"/><rect x="700" y="200" width="120" height="120" rx="8"/><rect x="860" y="200" width="120" height="120" rx="8"/></g>'),
  objects: [
    { id: 'sink', x: 20, y: 60, w: 17, label: 'Sink', glowSoft: true,
      svg: '<svg viewBox="0 0 170 150"><rect x="60" y="105" width="50" height="40" rx="8" fill="#8FA8B8"/><ellipse cx="85" cy="80" rx="62" ry="30" fill="#fff" stroke="#C9DCE8" stroke-width="6"/><ellipse cx="85" cy="76" rx="46" ry="19" fill="#D6EBF5"/><path d="M85 50 L85 20" stroke="#8FA8B8" stroke-width="10" stroke-linecap="round"/><path d="M85 22 q-24 0 -30 18" stroke="#8FA8B8" stroke-width="10" fill="none" stroke-linecap="round"/><g class="water-stream" opacity="0"><rect x="48" y="40" width="12" height="52" rx="6" fill="#7ECBF2"><animate attributeName="y" values="40;46;40" dur="0.5s" repeatCount="indefinite"/></rect></g></svg>',
      onTap: async function (G) {
        var el = G.el('sink');
        if (!G.flag('waterOn')) {
          G.setFlag('waterOn', true);
          if (el) el.querySelector('.water-stream').setAttribute('opacity', '1');
          G.sfx('water');
          G.toast('Now the soap!', '🧼');
          G.setGlow('soap', true);
        } else if (G.flag('soaped') && !G.flag('rinsed')) {
          G.setFlag('rinsed', true);
          Nicko.mood('dirty', false);
          G.sfx('sparkle'); G.sparkleAt(20, 62, 10);
          await Nicko.react('happy');
          G.toast('Rinsed! Grab the towel!', '✨');
          G.setGlow('towel', true);
        } else {
          G.sfx('splash'); G.splashAt(20, 66);
          await Nicko.react('happy');
        }
      } },
    { id: 'soap', x: 35, y: 52, w: 8, label: 'Soap',
      svg: '<svg viewBox="0 0 80 90"><rect x="14" y="46" width="52" height="36" rx="12" fill="#FF9DC6"/><rect x="14" y="46" width="52" height="14" rx="7" fill="#FFB9D6"/><circle cx="28" cy="30" r="8" fill="#BFE6FA"/><circle cx="46" cy="22" r="10" fill="#BFE6FA"/><circle cx="60" cy="34" r="7" fill="#BFE6FA"/></svg>',
      onTap: async function (G) {
        if (!G.flag('waterOn')) { await Nicko.react('confused'); G.toast('Turn on the water first!', '🚰'); return; }
        if (G.flag('soaped')) { G.toast('Already soapy!', '🧼'); return; }
        G.setFlag('soaped', true);
        G.sfx('bubbles'); G.sparkleAt(35, 54, 8);
        await Nicko.react('bath');
        G.toast('Bubbly! Rinse at the sink!', '🫧');
        G.setGlow('soap', false);
      } },
    { id: 'towel', x: 82, y: 46, w: 10, label: 'Towel',
      svg: '<svg viewBox="0 0 100 120"><rect x="30" y="6" width="40" height="12" rx="6" fill="#8A5A3B"/><rect x="22" y="18" width="56" height="92" rx="10" fill="#7FDBD0"/><rect x="22" y="88" width="56" height="10" fill="#5BC4B8"/><rect x="22" y="30" width="56" height="8" fill="#5BC4B8"/></svg>',
      onTap: async function (G) {
        if (!G.flag('rinsed')) { await Nicko.react('confused'); G.toast('Wash and rinse first!', '🧼'); return; }
        if (G.flag('dried')) { G.toast('All dry already!', '✨'); return; }
        G.setFlag('dried', true);
        await Nicko.action('shakeoff');
        G.sfx('sparkle'); G.sparkleAt(50, 60, 14);
        await Nicko.react('proud');
        G.achieve('clean-paws');
        G.points(30, 'Clean paws!');
        G.setGlow('towel', false);
      } },
    { id: 'tub', x: 60, y: 68, w: 27, label: 'Bathtub',
      svg: '<svg viewBox="0 0 270 150"><g class="tub-water" opacity="0.25"><rect x="30" y="46" width="210" height="30" rx="14" fill="#7ECBF2"/></g><path d="M20 60 L250 60 L232 132 Q230 142 218 142 L52 142 Q40 142 38 132 Z" fill="#fff" stroke="#C9DCE8" stroke-width="6"/><rect x="52" y="138" width="18" height="10" rx="4" fill="#8FA8B8"/><rect x="200" y="138" width="18" height="10" rx="4" fill="#8FA8B8"/><circle cx="52" cy="40" r="10" fill="#C0D6E4"/><path d="M52 40 L52 22" stroke="#8FA8B8" stroke-width="7" stroke-linecap="round"/></svg>',
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
        if (G.once('tubFun')) G.discover('Splashy tub!', 10);
        if (el) el.querySelector('.tub-water').setAttribute('opacity', '0.25');
      } },
    { id: 'toilet', x: 82, y: 66, w: 12, label: 'Toilet',
      svg: '<svg viewBox="0 0 120 140"><rect x="30" y="14" width="60" height="56" rx="12" fill="#fff" stroke="#C9DCE8" stroke-width="5"/><ellipse cx="60" cy="96" rx="42" ry="26" fill="#fff" stroke="#C9DCE8" stroke-width="5"/><ellipse cx="60" cy="92" rx="28" ry="15" fill="#D6EBF5"/><rect x="44" y="116" width="32" height="18" rx="6" fill="#EAF2F8"/></svg>',
      onTap: async function (G) {
        G.sfx('flush');
        await Nicko.react('scared');
        G.sfx('giggle');
        if (G.once('toiletFun')) G.discover('Whoosh! So swirly!', 5);
      } },
    { id: 'mirror', x: 46, y: 32, w: 14, label: 'Mirror',
      svg: '<svg viewBox="0 0 140 120"><ellipse cx="70" cy="60" rx="60" ry="52" fill="#BFE6FA" stroke="#8A5A3B" stroke-width="7"/><ellipse cx="70" cy="60" rx="48" ry="41" fill="#DFF3FD"/><circle cx="56" cy="52" r="8" fill="#fff"/><circle cx="86" cy="52" r="8" fill="#fff"/><circle cx="57" cy="53" r="3.6" fill="#2E3A45"/><circle cx="87" cy="53" r="3.6" fill="#2E3A45"/><path d="M62 76 q8 6 16 0" stroke="#4A2F2A" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
      onTap: async function (G) {
        await Nicko.react('love');
        G.sparkleAt(46, 30, 8);
        G.sfx('pop');
        if (G.once('mirrorFun')) G.discover('Hello, handsome!', 5);
      } },
    { id: 'puddle', x: 36, y: 90, w: 13, label: 'Puddle',
      svg: '<svg viewBox="0 0 130 50"><ellipse cx="65" cy="26" rx="58" ry="20" fill="#7ECBF2" opacity="0.85"/><ellipse cx="45" cy="22" rx="20" ry="8" fill="#A8DCF7" opacity="0.8"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(36);
        G.sfx('slide');
        await Nicko.action('slip');
        await Nicko.react('surprised');
        G.splashAt(36, 88);
        if (G.once('slipFun')) G.toast('Slippery! No harm done.', '💦');
        else G.toast('Wheee!', '💦');
      } },
    { id: 'shelf', x: 82, y: 24, w: 13, label: 'High shelf',
      svg: '<svg viewBox="0 0 130 90"><rect x="6" y="66" width="118" height="10" rx="4" fill="#8A5A3B"/><rect x="24" y="30" width="26" height="36" rx="5" fill="#FFD65A"/><rect x="56" y="22" width="30" height="44" rx="5" fill="#FF9D6B"/><circle cx="102" cy="48" r="16" fill="#BFE6FA"/></svg>',
      onTap: async function (G) {
        await Nicko.react('wow');
        if (G.once('shelfPrint')) {
          G.collect('print-bathroom');
          G.toast('A Golden Paw Print was on the shelf!', '🐾');
        } else {
          G.toast('Just bottles up here.', '🧴');
        }
      } }
  ]
},

/* ================= KITCHEN ================= */
kitchen: {
  id: 'kitchen', label: 'Kitchen', icon: '🍳',
  bg: wallFloor('#FFE3C2', '#C98F5A',
    '<rect x="0" y="0" width="1000" height="200" fill="#FFD9A8"/>' +
    '<rect x="0" y="200" width="1000" height="270" fill="#FFE9CF"/>' +
    '<rect x="120" y="60" width="200" height="110" rx="10" fill="#fff" stroke="#E8B06E" stroke-width="6"/>' +
    '<rect x="680" y="60" width="200" height="110" rx="10" fill="#fff" stroke="#E8B06E" stroke-width="6"/>'),
  objects: [
    { id: 'stove', x: 20, y: 60, w: 19, label: 'Stove', glowSoft: true,
      svg: '<svg viewBox="0 0 190 170"><rect x="14" y="30" width="162" height="120" rx="12" fill="#5A5F66"/><rect x="30" y="46" width="130" height="60" rx="8" fill="#3A3E44"/><circle cx="65" cy="70" r="16" fill="#2B2E33" stroke="#777" stroke-width="3"/><circle cx="125" cy="70" r="16" fill="#2B2E33" stroke="#777" stroke-width="3"/><rect x="60" y="118" width="70" height="18" rx="8" fill="#3A3E44"/><circle cx="150" cy="127" r="8" fill="#FF5A3C"><animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite"/></circle><rect x="40" y="8" width="110" height="26" rx="8" fill="#8A9099"/></svg>',
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
          G.discover('Hot stove! Nicko stays back.', 15);
          G.checkKitchen();
        } else {
          G.toast('Too hot! Nicko knows better.', '🔥');
        }
      } },
    { id: 'fridge', x: 40, y: 56, w: 17, label: 'Refrigerator',
      svg: '<svg viewBox="0 0 170 220"><rect x="20" y="10" width="130" height="200" rx="16" fill="#E8F1F5" stroke="#B9CBD6" stroke-width="5"/><line x1="20" y1="100" x2="150" y2="100" stroke="#B9CBD6" stroke-width="4"/><rect class="fridge-handle" x="128" y="30" width="10" height="50" rx="5" fill="#8FA8B8"/><rect class="fridge-handle" x="128" y="120" width="10" height="50" rx="5" fill="#8FA8B8"/><circle cx="60" cy="55" r="14" fill="#FFD65A"/><rect x="42" y="130" width="40" height="26" rx="8" fill="#BFE6FA"/></svg>',
      onTap: async function (G) {
        var open = !G.flag('fridgeOpen');
        G.setFlag('fridgeOpen', open);
        if (open) {
          G.setSvg('fridge', '<svg viewBox="0 0 170 220"><rect x="20" y="10" width="130" height="200" rx="16" fill="#B9CBD6" stroke="#8FA8B8" stroke-width="5"/><rect x="34" y="24" width="102" height="172" rx="10" fill="#FFF6C9"/><rect x="44" y="40" width="82" height="12" rx="4" fill="#E8D9A0"/><rect x="44" y="110" width="82" height="12" rx="4" fill="#E8D9A0"/></svg>');
          G.sfx('pop');
          await Nicko.react('wow');
          if (!G.flag('fed')) {
            G.spawn({ id: 'fish', x: 40, y: 52, w: 9, label: 'Fish', glow: true,
              svg: '<svg viewBox="0 0 100 80"><ellipse cx="48" cy="40" rx="28" ry="18" fill="#7ECBF2"/><path d="M74 40 L96 24 L96 56 Z" fill="#5BA8D8"/><circle cx="36" cy="36" r="4" fill="#1E2A33"/><path d="M48 24 q6 -10 14 -12" stroke="#5BA8D8" stroke-width="6" fill="none" stroke-linecap="round"/></svg>',
              onTap: async function (G2) {
                G2.despawn('fish');
                G2.setFlag('fridgeOpen', false);
                G2.setSvg('fridge', '<svg viewBox="0 0 170 220"><rect x="20" y="10" width="130" height="200" rx="16" fill="#E8F1F5" stroke="#B9CBD6" stroke-width="5"/><line x1="20" y1="100" x2="150" y2="100" stroke="#B9CBD6" stroke-width="4"/><rect class="fridge-handle" x="128" y="30" width="10" height="50" rx="5" fill="#8FA8B8"/><rect class="fridge-handle" x="128" y="120" width="10" height="50" rx="5" fill="#8FA8B8"/><circle cx="60" cy="55" r="14" fill="#FFD65A"/><rect x="42" y="130" width="40" height="26" rx="8" fill="#BFE6FA"/></svg>');
                await Nicko.walkTo(64);
                G2.sfx('pop');
                await Nicko.react('yum');
                G2.sfx('purr');
                G2.sparkleAt(64, 72, 8);
                G2.setFlag('fed', true);
                G2.discover('Yummy fish dinner!', 15);
                G2.checkKitchen();
              } });
            G.toast('Tap the fish!', '🐟');
          }
        } else {
          G.setSvg('fridge', '<svg viewBox="0 0 170 220"><rect x="20" y="10" width="130" height="200" rx="16" fill="#E8F1F5" stroke="#B9CBD6" stroke-width="5"/><line x1="20" y1="100" x2="150" y2="100" stroke="#B9CBD6" stroke-width="4"/><rect class="fridge-handle" x="128" y="30" width="10" height="50" rx="5" fill="#8FA8B8"/><rect class="fridge-handle" x="128" y="120" width="10" height="50" rx="5" fill="#8FA8B8"/><circle cx="60" cy="55" r="14" fill="#FFD65A"/><rect x="42" y="130" width="40" height="26" rx="8" fill="#BFE6FA"/></svg>');
          G.despawn('fish');
          G.sfx('click');
        }
      } },
    { id: 'fruitbowl', x: 58, y: 44, w: 13, label: 'Fruit bowl',
      svg: '<svg viewBox="0 0 130 100"><ellipse cx="65" cy="72" rx="52" ry="18" fill="#C68B59"/><circle cx="42" cy="52" r="17" fill="#FF6B5E"/><circle cx="68" cy="44" r="17" fill="#FFB62E"/><circle cx="92" cy="56" r="15" fill="#8FD16F"/><path d="M68 28 q4 -10 12 -12" stroke="#5A8F3C" stroke-width="5" fill="none" stroke-linecap="round"/></svg>',
      onTap: async function (G) {
        G.spawn({ id: 'apple', x: 58, y: 84, w: 7, label: 'Apple',
          svg: '<svg viewBox="0 0 70 70"><circle cx="35" cy="38" r="24" fill="#FF6B5E"/><path d="M35 16 q4 -10 12 -12" stroke="#5A8F3C" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="27" cy="32" rx="7" ry="10" fill="#FF8A7A" opacity="0.7"/></svg>',
          onTap: async function () {} });
        G.sfx('boing');
        await G.sendTo('apple', 74, 86, 900);
        await Nicko.walkTo(70);
        await Nicko.action('pounce');
        G.sfx('pop');
        await Nicko.react('happy');
        G.despawn('apple');
        if (G.once('appleChase')) G.discover('Nicko caught the runaway apple!', 5);
      } },
    { id: 'bowl', x: 66, y: 82, w: 11, label: 'Food bowl',
      svg: '<svg viewBox="0 0 110 80"><path d="M12 30 L98 30 L86 68 Q84 74 76 74 L34 74 Q26 74 24 68 Z" fill="#FF8A7A"/><ellipse cx="55" cy="30" rx="43" ry="12" fill="#E86A5A"/><ellipse cx="55" cy="28" rx="32" ry="8" fill="#FFF6EE"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(66);
        await Nicko.react('yum');
        G.sfx('purr');
        if (G.once('bowlMilk')) G.discover('Slurp! Tasty milk.', 5);
      } },
    { id: 'spill', x: 50, y: 90, w: 13, label: 'Spilled juice', glowSoft: true,
      svg: '<svg viewBox="0 0 130 50"><ellipse class="spill-blob" cx="65" cy="26" rx="56" ry="19" fill="#FFB62E" opacity="0.9"/><ellipse cx="45" cy="22" rx="18" ry="7" fill="#FFD06E" opacity="0.8"/></svg>',
      onTap: async function (G) {
        var n = (G.flag('spillWipes') || 0) + 1;
        G.setFlag('spillWipes', n);
        G.sfx('pop');
        var el = G.el('spill');
        if (el) { var b = el.querySelector('.spill-blob'); if (b) b.setAttribute('rx', String(56 - n * 16)); }
        await Nicko.react('happy');
        if (n >= 3) {
          G.hide('spill');
          G.sparkleAt(50, 88, 8);
          G.points(10, 'Spill cleaned up. Helpful!');
          G.setFlag('spillWipes', 0);
          setTimeout(function () { try { G.show('spill'); var e2 = G.el('spill'); if (e2) { var b2 = e2.querySelector('.spill-blob'); if (b2) b2.setAttribute('rx', '56'); } } catch (e) {} }, 45000);
        } else {
          G.toast('Wipe wipe... almost!', '🧽');
        }
      } },
    { id: 'cabinet', x: 84, y: 32, w: 14, label: 'Cabinet',
      svg: '<svg viewBox="0 0 140 120"><rect x="14" y="10" width="112" height="100" rx="10" fill="#A9764F"/><line x1="70" y1="10" x2="70" y2="110" stroke="#7A5230" stroke-width="5"/><circle cx="60" cy="60" r="6" fill="#5A3A20"/><circle cx="80" cy="60" r="6" fill="#5A3A20"/></svg>',
      onTap: async function (G) {
        G.sfx('crash');
        var el = G.el('cabinet');
        if (el) { el.classList.remove('wobble'); void el.offsetWidth; el.classList.add('wobble'); }
        await Nicko.react('surprised');
        var rattles = (G.flag('cabinetRattles') || 0) + 1;
        G.setFlag('cabinetRattles', rattles);
        if (rattles === 1 && G.once('cabinetFun')) G.discover('Clatter! Just pots and pans.', 5);
        if (rattles >= 2 && G.once('cabinetPrint')) {
          G.collect('print-kitchen');
          G.toast('A Golden Paw Print fell out!', '🐾');
        }
      } },
    { id: 'trash', x: 81, y: 70, w: 11, label: 'Trash can',
      svg: '<svg viewBox="0 0 110 130"><path d="M22 36 L88 36 L80 118 Q79 124 72 124 L38 124 Q31 124 30 118 Z" fill="#8FA8B8"/><rect x="16" y="24" width="78" height="16" rx="8" fill="#6E8797"/><rect x="44" y="10" width="22" height="18" rx="6" fill="#6E8797"/></svg>',
      onTap: async function (G) {
        G.spawn({ id: 'paperball', x: 78, y: 40, w: 6, label: 'Paper ball',
          svg: '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="22" fill="#fff" stroke="#D8DEE6" stroke-width="4"/><path d="M18 24 l12 8 M40 20 l-8 12" stroke="#D8DEE6" stroke-width="3"/></svg>',
          onTap: async function () {} });
        G.sfx('whoosh');
        await G.sendTo('paperball', 90, 58, 600);
        G.despawn('paperball');
        G.sfx('pop');
        await Nicko.react('happy');
        if (G.once('trashToss')) G.discover('Swish! Into the trash!', 5);
        else G.toast('Nice shot!', '🏀');
      } }
  ]
}

});
