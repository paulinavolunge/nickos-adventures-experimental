/* Nicko's Adventures - rooms part B: living room, playroom, backyard */
window.ROOMS = window.ROOMS || {};

Object.assign(window.ROOMS, {

/* ================= LIVING ROOM ================= */
living: {
  id: 'living', label: 'Living Room', icon: '🛋️',
  bg: wallFloor('#F6E3CE', '#D99A55',
    '<rect x="330" y="60" width="340" height="220" rx="14" fill="#fff" stroke="#E8B06E" stroke-width="6"/>' +
    '<circle cx="500" cy="150" r="52" fill="#FFE9A8"/><path d="M440 210 q60 -40 120 0" stroke="#E8B06E" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="500" cy="560" rx="330" ry="48" fill="#C46B4A" opacity="0.55"/>'),
  objects: [
    { id: 'ball', x: 52, y: 82, w: 9, label: 'Ball', glow: true,
      svg: '<svg viewBox="0 0 90 90"><circle cx="45" cy="45" r="38" fill="#FF6B5E"/><path d="M45 7 a38 38 0 0 1 0 76" fill="none" stroke="#fff" stroke-width="7"/><circle cx="45" cy="45" r="12" fill="#fff" opacity="0.85"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(44);
        await Nicko.action('pounce');
        G.sfx('boing');
        await G.sendTo('ball', 78, 82, 900);
        await Nicko.walkTo(72);
        await Nicko.action('pounce');
        G.sfx('pop');
        await Nicko.react('happy');
        if (G.once('ballPlay')) {
          G.achieve('curious-kitten');
          G.discover('Nicko loves the bouncy ball!', 5);
        }
      } },
    { id: 'couch', x: 30, y: 62, w: 31, label: 'Couch',
      svg: '<svg viewBox="0 0 310 170"><rect x="14" y="40" width="50" height="100" rx="20" fill="#7FB6D9"/><rect x="246" y="40" width="50" height="100" rx="20" fill="#7FB6D9"/><rect x="14" y="14" width="282" height="80" rx="24" fill="#8FC3E3"/><rect x="30" y="80" width="250" height="60" rx="18" fill="#7FB6D9"/><rect x="30" y="132" width="20" height="30" rx="8" fill="#5A6B76"/><rect x="260" y="132" width="20" height="30" rx="8" fill="#5A6B76"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(30);
        G.sfx('purr');
        await Nicko.react('love');
        if (G.once('couchKnead')) G.discover('Kneady paws, happy cat!', 5);
      } },
    { id: 'cushion', x: 21, y: 56, w: 11, label: 'Cushion', glowSoft: true,
      svg: '<svg viewBox="0 0 110 90"><rect x="8" y="12" width="94" height="66" rx="20" fill="#FFD65A"/><rect x="20" y="24" width="70" height="42" rx="12" fill="#FFDE8A"/><circle cx="55" cy="45" r="12" fill="#FF9D6B"/></svg>',
      onTap: async function (G) {
        var el = G.el('cushion');
        if (el) { el.classList.remove('tumble'); void el.offsetWidth; el.classList.add('tumble'); }
        G.sfx('thud');
        await G.wait(500);
        G.hide('cushion');
        await Nicko.react('surprised');
        if (G.once('mouseFound')) {
          G.spawn({ id: 'toyMouse', x: 21, y: 76, w: 8, label: 'Toy mouse', glow: true,
            svg: '<svg viewBox="0 0 90 70"><ellipse cx="40" cy="40" rx="26" ry="18" fill="#9AA1A8"/><circle cx="24" cy="22" r="9" fill="#9AA1A8"/><circle cx="56" cy="22" r="9" fill="#9AA1A8"/><circle cx="24" cy="22" r="4" fill="#F4A7B9"/><circle cx="56" cy="22" r="4" fill="#F4A7B9"/><circle cx="52" cy="36" r="3.4" fill="#1E2A33"/><path d="M64 44 q22 4 20 20" stroke="#9AA1A8" stroke-width="5" fill="none" stroke-linecap="round"/></svg>',
            onTap: async function (G2) {
              G2.sfx('squeak');
              await Nicko.action('pounce');
              await Nicko.react('happy');
              if (G2.once('mouseSqueak')) G2.discover('Squeaky mouse found!', 10);
            } });
          G.discover('A lost toy mouse!', 10);
          G.toast('Tap the mouse!', '🐭');
        } else {
          G.sfx('giggle');
          setTimeout(function () { try { G.show('cushion'); } catch (e) {} }, 20000);
        }
      } },
    { id: 'remote', x: 58, y: 76, w: 7, label: 'Remote', glowSoft: true,
      svg: '<svg viewBox="0 0 60 110"><rect x="10" y="6" width="40" height="98" rx="14" fill="#4A4F55"/><circle cx="30" cy="26" r="8" fill="#FF5A3C"/><circle cx="22" cy="48" r="5" fill="#8A9099"/><circle cx="38" cy="48" r="5" fill="#8A9099"/><circle cx="22" cy="64" r="5" fill="#8A9099"/><circle cx="38" cy="64" r="5" fill="#8A9099"/><circle cx="30" cy="84" r="7" fill="#8A9099"/></svg>',
      onTap: async function (G) {
        var on = !G.flag('tvOn');
        G.setFlag('tvOn', on);
        G.sfx('click');
        var tv = G.el('tv');
        if (tv) tv.classList.toggle('tv-on', on);
        if (on) {
          G.sfx('pop');
          await Nicko.walkTo(66);
          await Nicko.react('wow');
          if (G.once('tvFun')) G.discover('Nicko watches kitty TV!', 5);
        } else {
          G.toast('TV off.', '📺');
        }
      } },
    { id: 'tv', x: 76, y: 40, w: 21, label: 'TV',
      svg: '<svg viewBox="0 0 210 150"><rect x="10" y="10" width="190" height="120" rx="14" fill="#2E3A45"/><rect class="tv-screen" x="24" y="24" width="162" height="92" rx="8" fill="#1E262E"/><rect x="90" y="130" width="30" height="12" rx="4" fill="#2E3A45"/></svg>',
      onTap: async function (G) { await G.objTap('remote'); } },
    { id: 'cattree', x: 83, y: 58, w: 13, label: 'Cat tree',
      svg: '<svg viewBox="0 0 130 190"><rect x="52" y="60" width="26" height="110" rx="10" fill="#A9764F"/><ellipse cx="65" cy="170" rx="52" ry="14" fill="#C68B59"/><ellipse cx="65" cy="52" rx="46" ry="20" fill="#D9A066"/><ellipse cx="65" cy="46" rx="36" ry="14" fill="#E8BE85"/><rect x="92" y="100" width="30" height="10" rx="5" fill="#A9764F"/><circle cx="112" cy="122" r="12" fill="#FF8A7A"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(84);
        G.sfx('whoosh');
        await Nicko.react('proud');
        G.sparkleAt(91, 40, 8);
        if (G.once('treeClimb')) G.discover('King of the cat tree!', 10);
        else G.toast('What a view!', '👑');
      } },
    { id: 'curtain', x: 8, y: 38, w: 13, label: 'Curtain',
      svg: '<svg viewBox="0 0 130 190"><rect x="30" y="30" width="70" height="130" rx="8" fill="#9AD6F2" stroke="#7FB6D9" stroke-width="5"/><rect x="14" y="8" width="102" height="14" rx="7" fill="#8A5A3B"/><path class="curtain-l" d="M14 22 L52 22 L44 168 L8 168 Z" fill="#FF9D6B"/><path class="curtain-r" d="M116 22 L78 22 L86 168 L122 168 Z" fill="#FF9D6B"/><circle cx="90" cy="90" r="12" fill="#FFE9A8"/></svg>',
      onTap: async function (G) {
        var el = G.el('curtain');
        if (el) { el.classList.remove('swish'); void el.offsetWidth; el.classList.add('swish'); }
        G.sfx('whoosh');
        await Nicko.react('surprised');
        if (G.once('curtainPrint')) {
          G.collect('print-living');
          G.toast('A Golden Paw Print was behind the curtain!', '🐾');
        } else {
          G.toast('Just sunshine back here!', '☀️');
        }
      } },
    { id: 'livinglamp', x: 64, y: 62, w: 9, label: 'Lamp',
      svg: '<svg viewBox="0 0 100 150"><rect x="42" y="110" width="16" height="34" rx="6" fill="#8A5A3B"/><ellipse cx="50" cy="146" rx="26" ry="6" fill="#6E452D"/><path d="M22 108 L78 108 L66 56 L34 56 Z" fill="#FFE9A8"/></svg>',
      onTap: async function (G) { G.sfx('click'); await Nicko.react('happy'); G.toast('Cozy light!', '💡'); } }
  ]
},

/* ================= PLAYROOM ================= */
playroom: {
  id: 'playroom', label: 'Playroom', icon: '🧸',
  bg: wallFloor('#E8F6E8', '#D9A05A',
    '<circle cx="150" cy="140" r="60" fill="#FFD65A" opacity="0.8"/><circle cx="850" cy="120" r="44" fill="#FF9D6B" opacity="0.8"/>' +
    '<rect x="380" y="80" width="240" height="160" rx="16" fill="#fff" stroke="#A8D4A0" stroke-width="6"/>' +
    '<path d="M420 160 q40 -50 80 0 q40 -50 80 0" stroke="#A8D4A0" stroke-width="8" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="500" cy="560" rx="360" ry="50" fill="#BFE3BF" opacity="0.6"/>'),
  objects: [
    { id: 'blockA', x: 28, y: 76, w: 8, label: 'Red block', glowSoft: true,
      svg: '<svg viewBox="0 0 80 80"><rect x="8" y="8" width="64" height="64" rx="10" fill="#FF6B5E"/><rect x="20" y="20" width="40" height="40" rx="6" fill="#FF8A7A"/></svg>',
      onTap: async function (G) { await G.stackBlock('blockA'); } },
    { id: 'blockB', x: 38, y: 80, w: 8, label: 'Blue block', glowSoft: true,
      svg: '<svg viewBox="0 0 80 80"><rect x="8" y="8" width="64" height="64" rx="10" fill="#6BA8E8"/><circle cx="40" cy="40" r="18" fill="#8FC3F0"/></svg>',
      onTap: async function (G) { await G.stackBlock('blockB'); } },
    { id: 'blockC', x: 48, y: 76, w: 8, label: 'Yellow block', glowSoft: true,
      svg: '<svg viewBox="0 0 80 80"><rect x="8" y="8" width="64" height="64" rx="10" fill="#FFD65A"/><path d="M40 18 L58 56 L22 56 Z" fill="#FFDE8A"/></svg>',
      onTap: async function (G) { await G.stackBlock('blockC'); } },
    { id: 'tower', x: 62, y: 78, w: 10, label: 'Block tower',
      svg: '<svg viewBox="0 0 100 120"><rect x="10" y="92" width="80" height="20" rx="6" fill="#8A5A3B" opacity="0.35"/></svg>',
      onTap: async function (G) { await G.toppleTower(); } },
    { id: 'ballpit', x: 82, y: 74, w: 19, label: 'Ball pit',
      svg: '<svg viewBox="0 0 190 140"><ellipse cx="95" cy="100" rx="80" ry="34" fill="#FF9D6B"/><g><circle cx="45" cy="78" r="18" fill="#FF6B5E"/><circle cx="75" cy="66" r="18" fill="#FFD65A"/><circle cx="105" cy="76" r="18" fill="#6BA8E8"/><circle cx="135" cy="66" r="18" fill="#8FD16F"/><circle cx="60" cy="90" r="18" fill="#C49BE8"/><circle cx="120" cy="90" r="18" fill="#FF9DC6"/></g></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(82);
        G.sfx('boing');
        var w = Nicko.el();
        w.style.transition = 'opacity .3s'; w.style.opacity = '0';
        await G.wait(350);
        G.sfx('splash');
        for (var i = 0; i < 5; i++) G.sparkleAt(76 + Math.random() * 12, 66, 3);
        await G.wait(500);
        w.style.opacity = '1';
        await Nicko.react('happy');
        if (G.once('pitDive')) G.discover('Cannonball into the pit!', 10);
      } },
    { id: 'easel', x: 15, y: 58, w: 14, label: 'Easel', glowSoft: true,
      svg: '<svg viewBox="0 0 140 170"><path d="M70 20 L30 160 M70 20 L110 160 M48 110 L92 110" stroke="#8A5A3B" stroke-width="9" stroke-linecap="round"/><rect class="painting" x="38" y="34" width="64" height="60" rx="6" fill="#fff" stroke="#8A5A3B" stroke-width="5"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(16);
        G.sfx('pop');
        var el = G.el('easel');
        if (el) {
          var p = el.querySelector('.painting');
          if (p) p.innerHTML = '<ellipse cx="32" cy="30" rx="16" ry="13" fill="#FF9D6B"/><circle cx="18" cy="14" r="6" fill="#FF9D6B"/><circle cx="32" cy="10" r="6" fill="#FF9D6B"/><circle cx="46" cy="14" r="6" fill="#FF9D6B"/>';
        }
        G.sparkleAt(13, 52, 8);
        await Nicko.react('proud');
        if (G.once('paintingMade')) G.discover('Nicko painted a paw print!', 15);
      } },
    { id: 'drum', x: 62, y: 88, w: 10, label: 'Drum',
      svg: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="66" rx="34" ry="22" fill="#FF8A7A"/><ellipse cx="50" cy="52" rx="34" ry="16" fill="#FFE9D6"/><ellipse cx="50" cy="52" rx="34" ry="16" fill="none" stroke="#E86A5A" stroke-width="5"/><rect x="20" y="14" width="9" height="34" rx="4" fill="#8A5A3B" transform="rotate(-24 24 30)"/><rect x="71" y="14" width="9" height="34" rx="4" fill="#8A5A3B" transform="rotate(24 75 30)"/></svg>',
      onTap: async function (G) {
        var n = G.flag('drumCount') || 0;
        G.setFlag('drumCount', n + 1);
        G.sfx('drum', n);
        var el = G.el('drum');
        if (el) { el.classList.remove('bounce'); void el.offsetWidth; el.classList.add('bounce'); }
        await Nicko.action('dance');
        await Nicko.react('music');
        if (n === 0 && G.once('drumFun')) G.discover('Nicko the drummer!', 5);
      } },
    { id: 'ptoys', x: 8, y: 82, w: 12, label: 'Toy box',
      svg: '<svg viewBox="0 0 120 110"><path d="M14 50 L106 50 L96 104 L24 104 Z" fill="#6BA8E8"/><rect x="10" y="38" width="100" height="22" rx="8" fill="#4A7FC1"/><circle cx="60" cy="49" r="7" fill="#2E4A6B"/></svg>',
      onTap: async function (G) { G.toast('Tap the toys to tidy them!', '🧸'); } },
    { id: 'ptoy1', x: 24, y: 88, w: 7, label: 'Toy car', glowSoft: true,
      svg: '<svg viewBox="0 0 90 60"><rect x="8" y="18" width="60" height="24" rx="10" fill="#FF6B5E"/><rect x="22" y="8" width="30" height="18" rx="8" fill="#FF8A7A"/><circle cx="24" cy="48" r="10" fill="#3A3E44"/><circle cx="60" cy="48" r="10" fill="#3A3E44"/></svg>',
      onTap: async function (G) { await G.tidyPlayToy('ptoy1'); } },
    { id: 'ptoy2', x: 38, y: 90, w: 7, label: 'Toy robot', glowSoft: true,
      svg: '<svg viewBox="0 0 70 90"><rect x="14" y="20" width="42" height="46" rx="10" fill="#9AA1A8"/><rect x="22" y="30" width="26" height="14" rx="4" fill="#1E2A33"/><circle cx="28" cy="37" r="3" fill="#7ECBF2"/><circle cx="42" cy="37" r="3" fill="#7ECBF2"/><rect x="28" y="6" width="14" height="16" rx="4" fill="#9AA1A8"/><circle cx="35" cy="6" r="5" fill="#FFD65A"/></svg>',
      onTap: async function (G) { await G.tidyPlayToy('ptoy2'); } },
    { id: 'ptoy3', x: 72, y: 90, w: 7, label: 'Toy plane', glowSoft: true,
      svg: '<svg viewBox="0 0 90 70"><path d="M8 40 L70 40 L82 30 L82 50 L70 44 Z" fill="#6BA8E8"/><path d="M40 40 L34 62 L46 62 Z" fill="#4A7FC1"/></svg>',
      onTap: async function (G) { await G.tidyPlayToy('ptoy3'); } },
    { id: 'ptoy4', x: 90, y: 88, w: 7, label: 'Toy giraffe', glowSoft: true,
      svg: '<svg viewBox="0 0 70 90"><rect x="28" y="34" width="12" height="44" rx="6" fill="#FFD65A"/><circle cx="40" cy="22" r="14" fill="#FFD65A"/><circle cx="44" cy="10" r="5" fill="#FFD65A"/><circle cx="34" cy="20" r="3" fill="#3A2A1A"/><circle cx="34" cy="46" r="4" fill="#C68B59"/><circle cx="34" cy="60" r="4" fill="#C68B59"/></svg>',
      onTap: async function (G) { await G.tidyPlayToy('ptoy4'); } },
    { id: 'sorter', x: 84, y: 50, w: 11, label: 'Shape sorter', glowSoft: true,
      svg: '<svg viewBox="0 0 110 110"><rect x="14" y="50" width="82" height="50" rx="12" fill="#C49BE8"/><circle cx="34" cy="70" r="11" fill="#8A5FA8"/><rect x="50" y="60" width="20" height="20" rx="3" fill="#8A5FA8"/><path d="M78 82 L90 60 L102 82 Z" fill="#8A5FA8"/><circle class="shape-ball" cx="30" cy="26" r="13" fill="#FF6B5E"/><rect class="shape-cube" x="52" y="14" width="24" height="24" rx="4" fill="#6BA8E8"/></svg>',
      onTap: async function (G) {
        var n = (G.flag('sortCount') || 0) + 1;
        G.setFlag('sortCount', n);
        G.sfx('pop');
        await Nicko.react('happy');
        G.sparkleAt(93, 48, 6);
        if (n >= 2 && G.once('sortDone')) G.discover('Shapes sorted!', 10);
        else G.toast('Plip! Shape in!', '🔷');
      } }
  ]
},

/* ================= BACKYARD ================= */
backyard: {
  id: 'backyard', label: 'Backyard', icon: '🌳',
  bg: '<svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="0" y="0" width="1000" height="330" fill="#9AD6F2"/>' +
    '<circle cx="830" cy="90" r="52" fill="#FFE9A8"/><circle cx="830" cy="90" r="72" fill="#FFE9A8" opacity="0.35"/>' +
    '<ellipse cx="200" cy="100" rx="90" ry="30" fill="#fff" opacity="0.85"/><ellipse cx="280" cy="120" rx="70" ry="24" fill="#fff" opacity="0.7"/>' +
    '<rect x="0" y="300" width="1000" height="90" fill="#C49A6C"/>' +
    '<g stroke="#8A6B45" stroke-width="6"><line x1="40" y1="300" x2="40" y2="390"/><line x1="140" y1="300" x2="140" y2="390"/><line x1="240" y1="300" x2="240" y2="390"/><line x1="340" y1="300" x2="340" y2="390"/><line x1="440" y1="300" x2="440" y2="390"/><line x1="540" y1="300" x2="540" y2="390"/><line x1="640" y1="300" x2="640" y2="390"/><line x1="740" y1="300" x2="740" y2="390"/><line x1="840" y1="300" x2="840" y2="390"/><line x1="940" y1="300" x2="940" y2="390"/></g>' +
    '<rect x="0" y="318" width="1000" height="12" fill="#A87F52"/><rect x="0" y="356" width="1000" height="12" fill="#A87F52"/>' +
    '<rect x="0" y="390" width="1000" height="230" fill="#8FD16F"/>' +
    '<ellipse cx="200" cy="560" rx="260" ry="40" fill="#7FC45E" opacity="0.7"/><ellipse cx="800" cy="580" rx="280" ry="40" fill="#7FC45E" opacity="0.7"/>' +
    '</svg>',
  objects: [
    { id: 'butterfly', x: 50, y: 30, w: 9, label: 'Butterfly', glow: true,
      svg: '<svg viewBox="0 0 100 90"><g class="wings"><ellipse cx="32" cy="40" rx="22" ry="28" fill="#C49BE8" transform="rotate(-24 32 40)"/><ellipse cx="68" cy="40" rx="22" ry="28" fill="#C49BE8" transform="rotate(24 68 40)"/><circle cx="32" cy="40" r="7" fill="#8A5FA8"/><circle cx="68" cy="40" r="7" fill="#8A5FA8"/></g><rect x="46" y="26" width="8" height="40" rx="4" fill="#5A4A6B"/><circle cx="50" cy="24" r="7" fill="#5A4A6B"/></svg>',
      onTap: async function (G) {
        var golden = Math.random() < 0.18 || G.flag('bfTaps') >= 6;
        var taps = (G.flag('bfTaps') || 0) + 1;
        G.setFlag('bfTaps', taps);
        G.sfx('magic');
        if (golden && G.once('goldenBf')) {
          G.setSvg('butterfly', '<svg viewBox="0 0 100 90"><g class="wings"><ellipse cx="32" cy="40" rx="22" ry="28" fill="#FFD65A" transform="rotate(-24 32 40)"/><ellipse cx="68" cy="40" rx="22" ry="28" fill="#FFD65A" transform="rotate(24 68 40)"/><circle cx="32" cy="40" r="7" fill="#C9920E"/><circle cx="68" cy="40" r="7" fill="#C9920E"/></g><rect x="46" y="26" width="8" height="40" rx="4" fill="#8A6B1F"/><circle cx="50" cy="24" r="7" fill="#8A6B1F"/></svg>');
          G.sparkleAt(50, 28, 12);
          await Nicko.react('wow');
          G.collect('print-butterfly');
          G.toast('A GOLDEN butterfly! It left a print!', '🦋');
          G.yardDiscover('butterfly');
          return;
        }
        await Nicko.walkTo(50);
        G.sparkleAt(50, 30, 6);
        await Nicko.react('wow');
        G.sfx('giggle');
        G.toast('It tickles!', '🦋');
        if (G.once('bfFun')) { G.discover('Butterfly friend!', 10); G.yardDiscover('butterfly'); }
      } },
    { id: 'can', x: 12, y: 74, w: 10, label: 'Watering can', glowSoft: true,
      svg: '<svg viewBox="0 0 110 100"><rect x="30" y="34" width="52" height="52" rx="12" fill="#6BA8E8"/><path d="M82 44 L104 30" stroke="#4A7FC1" stroke-width="10" stroke-linecap="round"/><path d="M30 50 L10 40" stroke="#4A7FC1" stroke-width="10" stroke-linecap="round"/><rect x="44" y="18" width="24" height="18" rx="6" fill="#4A7FC1"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(16);
        G.sfx('pour');
        G.splashAt(26, 62);
        var el = G.el('flowers');
        if (el) { el.classList.remove('bloom'); void el.offsetWidth; el.classList.add('bloom'); }
        await Nicko.react('happy');
        if (G.once('flowersWatered')) {
          G.discover('The flowers drink up!', 10);
          G.yardDiscover('flowers');
        }
        G.setGlow('can', false);
      } },
    { id: 'flowers', x: 28, y: 70, w: 17, label: 'Flowers',
      svg: '<svg viewBox="0 0 170 110"><g class="flower"><line x1="40" y1="106" x2="40" y2="60" stroke="#5A8F3C" stroke-width="7"/><circle cx="40" cy="46" r="16" fill="#FF6B5E"/><circle cx="40" cy="46" r="6" fill="#FFD65A"/></g><g class="flower"><line x1="85" y1="106" x2="85" y2="52" stroke="#5A8F3C" stroke-width="7"/><circle cx="85" cy="38" r="16" fill="#C49BE8"/><circle cx="85" cy="38" r="6" fill="#FFD65A"/></g><g class="flower"><line x1="130" y1="106" x2="130" y2="62" stroke="#5A8F3C" stroke-width="7"/><circle cx="130" cy="48" r="16" fill="#FF9DC6"/><circle cx="130" cy="48" r="6" fill="#FFD65A"/></g><ellipse cx="85" cy="104" rx="70" ry="10" fill="#6FAE52"/></svg>',
      onTap: async function (G) {
        G.sfx('pop');
        G.sparkleAt(28, 62, 6);
        await Nicko.react('happy');
        G.toast('Sniff sniff... lovely!', '🌸');
      } },
    { id: 'sandbox', x: 80, y: 78, w: 19, label: 'Sandbox',
      svg: '<svg viewBox="0 0 190 120"><rect x="14" y="30" width="162" height="76" rx="14" fill="#C49A6C"/><rect x="28" y="42" width="134" height="52" rx="10" fill="#E8C98F"/><path d="M60 42 l-14 -22 M130 42 l14 -22" stroke="#8A5A3B" stroke-width="8" stroke-linecap="round"/><rect x="40" y="14" width="110" height="12" rx="6" fill="#FF6B5E"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(80);
        G.sfx('thud');
        await Nicko.action('pounce');
        G.sfx('pop');
        await Nicko.react('surprised');
        Nicko.mood('dirty', true);
        if (G.once('sandboxDig')) {
          G.collect('print-backyard');
          G.toast('Buried treasure! And muddy paws...', '🐾');
          G.yardDiscover('sandbox');
          G.toast('Wash those paws in the bathroom!', '🧼');
        } else {
          G.toast('Diggy diggy!', '🏖️');
        }
      } },
    { id: 'ypuddle', x: 58, y: 88, w: 14, label: 'Puddle',
      svg: '<svg viewBox="0 0 140 50"><ellipse cx="70" cy="26" rx="62" ry="20" fill="#7ECBF2" opacity="0.9"/><ellipse cx="48" cy="22" rx="22" ry="8" fill="#A8DCF7" opacity="0.85"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(58);
        G.sfx('splash'); G.splashAt(58, 86);
        await Nicko.action('shakeoff');
        await Nicko.react('happy');
        Nicko.mood('dirty', true);
        if (G.once('ypuddleFun')) {
          G.discover('Splish splash!', 5);
          G.yardDiscover('puddle');
          G.toast('Muddy paws! Bathroom time?', '🧼');
        }
      } },
    { id: 'yball', x: 40, y: 86, w: 8, label: 'Ball',
      svg: '<svg viewBox="0 0 90 90"><circle cx="45" cy="45" r="38" fill="#fff"/><path d="M45 7 L45 83 M7 45 L83 45" stroke="#FF6B5E" stroke-width="10"/><circle cx="45" cy="45" r="38" fill="none" stroke="#3A3E44" stroke-width="5"/></svg>',
      onTap: async function (G) {
        G.sfx('boing');
        await G.sendTo('yball', 66, 86, 800);
        await Nicko.walkTo(62);
        await Nicko.action('pounce');
        await Nicko.react('happy');
        if (G.once('yballFun')) G.discover('Backyard soccer!', 5);
        G.sendTo('yball', 40, 86, 1);
      } },
    { id: 'bush', x: 84, y: 60, w: 12, label: 'Bush', glowSoft: true,
      svg: '<svg viewBox="0 0 120 120"><circle cx="40" cy="70" r="30" fill="#5A9E4B"/><circle cx="75" cy="62" r="34" fill="#6FAE52"/><circle cx="58" cy="44" r="26" fill="#7FC45E"/><circle cx="40" cy="70" r="7" fill="#FF6B5E"/><circle cx="80" cy="56" r="7" fill="#FF6B5E"/><circle cx="60" cy="84" r="7" fill="#FFD65A"/></svg>',
      onTap: async function (G) {
        G.sfx('chirp');
        G.spawn({ id: 'bird', x: 84, y: 34, w: 8, label: 'Bird',
          svg: '<svg viewBox="0 0 90 70"><ellipse cx="45" cy="40" rx="24" ry="17" fill="#6BA8E8"/><circle cx="62" cy="28" r="13" fill="#6BA8E8"/><circle cx="65" cy="26" r="3" fill="#1E2A33"/><path d="M73 30 l10 4 -10 5 z" fill="#FFB62E"/><path d="M20 40 q-14 -8 -18 -22 q16 2 24 12" fill="#4A7FC1"/></svg>',
          onTap: async function () {} });
        await Nicko.react('wow');
        await G.sendTo('bird', 60, 18, 1400);
        G.despawn('bird');
        G.sfx('chirp');
        if (G.once('birdFun')) { G.discover('A bird says hello!', 5); G.yardDiscover('bird'); }
      } },
    { id: 'gate', x: 20, y: 54, w: 10, label: 'Gate',
      svg: '<svg viewBox="0 0 100 150"><rect x="14" y="10" width="72" height="130" rx="10" fill="#A9764F"/><rect x="26" y="26" width="48" height="98" rx="6" fill="#C49A6C"/><rect x="26" y="60" width="48" height="12" fill="#8A5A3B"/><circle cx="72" cy="76" r="10" fill="#5A3A20"/><rect x="66" y="76" width="14" height="8" rx="4" fill="#FFD65A"/></svg>',
      onTap: async function (G) {
        G.sfx('knock');
        var el = G.el('gate');
        if (el) { el.classList.remove('wobble'); void el.offsetWidth; el.classList.add('wobble'); }
        await Nicko.react('sad');
        G.toast('Locked. Safe kitties stay inside!', '🔒');
        if (G.once('gateSafe')) G.discover('The gate keeps Nicko safe!', 5);
      } },
    { id: 'sun', x: 86, y: 14, w: 9, label: 'Sun',
      svg: '<svg viewBox="0 0 90 90"><g stroke="#FFB62E" stroke-width="7" stroke-linecap="round"><line x1="45" y1="4" x2="45" y2="18"/><line x1="45" y1="72" x2="45" y2="86"/><line x1="4" y1="45" x2="18" y2="45"/><line x1="72" y1="45" x2="86" y2="45"/><line x1="16" y1="16" x2="26" y2="26"/><line x1="64" y1="64" x2="74" y2="74"/><line x1="74" y1="16" x2="64" y2="26"/><line x1="26" y1="64" x2="16" y2="74"/></g><circle cx="45" cy="45" r="24" fill="#FFD65A"/><circle cx="38" cy="42" r="3.4" fill="#B57E1B"/><circle cx="52" cy="42" r="3.4" fill="#B57E1B"/><path d="M36 52 q9 7 18 0" stroke="#B57E1B" stroke-width="3.4" fill="none" stroke-linecap="round"/></svg>',
      onTap: async function (G) {
        G.sfx('magic'); G.sparkleAt(86, 14, 8);
        await Nicko.react('happy');
        G.toast('What a sunny day!', '☀️');
      } },
    { id: 'cloud', x: 58, y: 13, w: 14, label: 'Cloud',
      svg: '<svg viewBox="0 0 140 80"><ellipse cx="50" cy="52" rx="34" ry="22" fill="#fff"/><ellipse cx="86" cy="46" rx="30" ry="24" fill="#fff"/><ellipse cx="68" cy="36" rx="26" ry="20" fill="#F4F8FC"/></svg>',
      onTap: async function (G) {
        G.sfx('rain');
        for (var i = 0; i < 10; i++) G.splashAt(40 + Math.random() * 40, 30 + Math.random() * 20);
        G.toast('A tickly rain shower!', '🌧️');
        await Nicko.react('surprised');
        var el = G.el('flowers');
        if (el) { el.classList.remove('bloom'); void el.offsetWidth; el.classList.add('bloom'); }
        if (G.once('rainFun')) { G.discover('Rain makes flowers happy!', 5); G.yardDiscover('rain'); }
      } }
  ]
}

});
