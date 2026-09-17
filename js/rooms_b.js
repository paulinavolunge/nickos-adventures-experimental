/* Nicko's Adventures - rooms part B: living room, playroom, backyard */
window.ROOMS = window.ROOMS || {};

Object.assign(window.ROOMS, {

/* ================= LIVING ROOM ================= */
living: {
  id: 'living', label: 'Living Room', icon: '🛋️',
  bg: wallFloor('#F6E3CE', '#D99A55',
    '<g><rect x="330" y="60" width="340" height="220" rx="16" fill="#FFFDF4" stroke="#E8B06E" stroke-width="6"/><rect x="330" y="60" width="340" height="50" rx="16" fill="#F6C177"/><circle cx="500" cy="170" r="52" fill="#FFE066"/><circle cx="500" cy="170" r="66" fill="#FFE066" opacity="0.3"/><path d="M440 230 q60 -40 120 0" stroke="#E8B06E" stroke-width="7" fill="none" stroke-linecap="round"/></g>' +
    '<g opacity="0.55"><ellipse cx="500" cy="560" rx="330" ry="46" fill="#C46B4A"/><ellipse cx="500" cy="554" rx="280" ry="36" fill="#D98868"/><ellipse cx="500" cy="548" rx="230" ry="27" fill="#E8A87F"/></g>'),
  objects: [
    { id: 'ball', x: 52, y: 82, w: 9, label: 'Ball', glow: true, drag: true,
      svg: '<svg viewBox="0 0 90 90"><defs><radialGradient id="lg-ball" cx="0.38" cy="0.3" r="0.95"><stop offset="0" stop-color="#FF8A7A"/><stop offset="1" stop-color="#E84A4A"/></radialGradient></defs><ellipse cx="45" cy="84" rx="30" ry="5" fill="rgba(90,55,25,0.2)"/><circle cx="45" cy="45" r="38" fill="url(#lg-ball)"/><path d="M45 7 a38 38 0 0 1 0 76" fill="none" stroke="#fff" stroke-width="7" opacity="0.9"/><circle cx="45" cy="45" r="12" fill="#fff" opacity="0.85"/><ellipse cx="32" cy="30" rx="9" ry="12" fill="#fff" opacity="0.35"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(44);
        await Nicko.action('pounce');
        G.sfx('boing');
        await G.sendTo('ball', 78, 82, 900);
        await Nicko.walkTo(72);
        await Nicko.action('pounce');
        G.sfx('pop');
        await Nicko.react('happy');
        Needs.play(10);
        if (G.once('ballPlay')) {
          G.achieve('curious-kitten');
          G.points(5);
        }
      } },
    { id: 'couch', x: 30, y: 62, w: 31, label: 'Couch',
      svg: '<svg viewBox="0 0 310 170"><defs><linearGradient id="lg-couch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CCFEF"/><stop offset="1" stop-color="#6FA3CC"/></linearGradient></defs><ellipse cx="155" cy="162" rx="140" ry="8" fill="rgba(90,55,25,0.2)"/><rect x="30" y="132" width="20" height="30" rx="8" fill="#5A6B76"/><rect x="260" y="132" width="20" height="30" rx="8" fill="#5A6B76"/><rect x="14" y="40" width="50" height="100" rx="20" fill="url(#lg-couch)"/><rect x="246" y="40" width="50" height="100" rx="20" fill="url(#lg-couch)"/><rect x="14" y="14" width="282" height="80" rx="24" fill="url(#lg-couch)"/><rect x="14" y="14" width="282" height="26" rx="13" fill="#fff" opacity="0.25"/><rect x="30" y="80" width="250" height="60" rx="18" fill="#6FA3CC"/><rect x="30" y="80" width="250" height="18" rx="9" fill="#fff" opacity="0.2"/><rect x="36" y="52" width="54" height="30" rx="10" fill="#FFD65A"/><rect x="220" y="52" width="54" height="30" rx="10" fill="#FF9D6B"/><rect x="40" y="56" width="46" height="22" rx="8" fill="#FFE066"/><rect x="224" y="56" width="46" height="22" rx="8" fill="#FFB98A"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(30);
        G.sfx('purr');
        await Nicko.react('love');
        Needs.change('happy', 6);
        if (G.once('couchKnead')) G.points(5);
      } },
    { id: 'cushion', x: 21, y: 56, w: 11, label: 'Cushion', glowSoft: true,
      svg: '<svg viewBox="0 0 110 90"><defs><radialGradient id="lg-cush" cx="0.4" cy="0.35" r="0.9"><stop offset="0" stop-color="#FFE066"/><stop offset="1" stop-color="#F2B73C"/></radialGradient></defs><ellipse cx="55" cy="82" rx="42" ry="6" fill="rgba(90,55,25,0.18)"/><rect x="8" y="12" width="94" height="66" rx="20" fill="url(#lg-cush)"/><rect x="20" y="24" width="70" height="42" rx="12" fill="#FFE9A8"/><circle cx="55" cy="45" r="12" fill="#FF9D6B"/><circle cx="51" cy="41" r="4" fill="#FFB98A"/></svg>',
      onTap: async function (G) {
        var el = G.el('cushion');
        if (el) { el.classList.remove('tumble'); void el.offsetWidth; el.classList.add('tumble'); }
        G.sfx('thud');
        await G.wait(500);
        G.hide('cushion');
        await Nicko.react('surprised');
        if (G.once('mouseFound')) {
          G.spawn({ id: 'toyMouse', x: 21, y: 76, w: 8, label: 'Toy mouse', glow: true, drag: true,
            svg: '<svg viewBox="0 0 90 70"><defs><radialGradient id="lg-tmouse" cx="0.4" cy="0.35" r="0.9"><stop offset="0" stop-color="#B9BFC6"/><stop offset="1" stop-color="#8A9099"/></radialGradient></defs><ellipse cx="40" cy="64" rx="28" ry="5" fill="rgba(90,55,25,0.18)"/><circle cx="24" cy="22" r="9" fill="url(#lg-tmouse)"/><circle cx="56" cy="22" r="9" fill="url(#lg-tmouse)"/><circle cx="24" cy="22" r="4" fill="#F4A7B9"/><circle cx="56" cy="22" r="4" fill="#F4A7B9"/><ellipse cx="40" cy="40" rx="26" ry="18" fill="url(#lg-tmouse)"/><ellipse cx="32" cy="34" rx="8" ry="6" fill="#fff" opacity="0.35"/><circle cx="52" cy="36" r="3.4" fill="#1E2A33"/><circle cx="53" cy="35" r="1.1" fill="#fff"/><ellipse cx="58" cy="44" rx="3" ry="2.2" fill="#F4A7B9"/><path d="M64 44 q22 4 20 20" stroke="#8A9099" stroke-width="5" fill="none" stroke-linecap="round"/></svg>',
            onTap: async function (G2) {
              G2.sfx('squeak');
              await Nicko.react('hunt', 1300);
              Needs.play(12);
              if (G2.once('mouseSqueak')) G2.points(10);
            } });
          if (Inventory.unlock('toyMouse')) G.toast('Toy mouse added to the toybox!', '🐭');
          G.collect('print-living');
          G.points(10);
        } else {
          G.sfx('giggle');
          setTimeout(function () { try { G.show('cushion'); } catch (e) {} }, 20000);
        }
      } },
    { id: 'remote', x: 66, y: 70, w: 7, label: 'Remote', glowSoft: true, drag: true,
      svg: '<svg viewBox="0 0 60 110"><defs><linearGradient id="lg-remote" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5A6067"/><stop offset="0.5" stop-color="#4A4F55"/><stop offset="1" stop-color="#3A3E44"/></linearGradient></defs><ellipse cx="30" cy="104" rx="22" ry="4" fill="rgba(90,55,25,0.2)"/><rect x="10" y="6" width="40" height="98" rx="14" fill="url(#lg-remote)"/><rect x="14" y="10" width="12" height="90" rx="6" fill="#fff" opacity="0.12"/><circle cx="30" cy="26" r="8" fill="#FF5A3C"/><circle cx="30" cy="26" r="3" fill="#FF8A6B"/><circle cx="22" cy="48" r="5" fill="#8A9099"/><circle cx="38" cy="48" r="5" fill="#8A9099"/><circle cx="22" cy="64" r="5" fill="#8A9099"/><circle cx="38" cy="64" r="5" fill="#8A9099"/><circle cx="30" cy="84" r="7" fill="#8A9099"/><circle cx="30" cy="84" r="3" fill="#A9B0B8"/></svg>',
      onTap: async function (G) { await G.toggleTv(); } },
    { id: 'tv', x: 76, y: 40, w: 21, label: 'TV',
      svg: '<svg viewBox="0 0 210 150"><defs><linearGradient id="lg-tv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A4650"/><stop offset="1" stop-color="#242C34"/></linearGradient></defs><ellipse cx="105" cy="144" rx="70" ry="5" fill="rgba(90,55,25,0.18)"/><rect x="10" y="10" width="190" height="120" rx="14" fill="url(#lg-tv)"/><rect class="tv-screen" x="24" y="24" width="162" height="92" rx="8" fill="#1E262E"/><rect x="90" y="130" width="30" height="12" rx="4" fill="#2E3A45"/><circle cx="190" cy="124" r="3.5" fill="#FF5A3C"/></svg>',
      onTap: async function (G) { await G.toggleTv(); } },
    { id: 'cattree', x: 83, y: 58, w: 13, label: 'Cat tree',
      svg: '<svg viewBox="0 0 130 190"><defs><linearGradient id="lg-ctree" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8BE85"/><stop offset="1" stop-color="#C68B59"/></linearGradient></defs><ellipse cx="65" cy="182" rx="56" ry="8" fill="rgba(90,55,25,0.2)"/><rect x="52" y="60" width="26" height="110" rx="10" fill="#A9764F"/><rect x="52" y="60" width="10" height="110" rx="5" fill="#C08A52"/><ellipse cx="65" cy="170" rx="52" ry="14" fill="url(#lg-ctree)"/><ellipse cx="65" cy="52" rx="46" ry="20" fill="url(#lg-ctree)"/><ellipse cx="65" cy="46" rx="36" ry="14" fill="#F2D9AE"/><rect x="92" y="100" width="30" height="10" rx="5" fill="#A9764F"/><g class="amb-sway"><line x1="107" y1="110" x2="112" y2="122" stroke="#A9764F" stroke-width="3"/><circle cx="112" cy="128" r="12" fill="#FF8A7A"/><circle cx="108" cy="124" r="4" fill="#FFB0A0"/></g></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(84);
        G.sfx('whoosh');
        await Nicko.react('proud');
        G.sparkleAt(91, 40, 8);
        Needs.change('happy', 6);
        if (G.once('treeClimb')) G.points(10);
      } },
    { id: 'curtain', x: 8, y: 38, w: 13, label: 'Curtain',
      svg: '<svg viewBox="0 0 130 190"><defs><linearGradient id="lg-curt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFB98A"/><stop offset="0.5" stop-color="#FF9D6B"/><stop offset="1" stop-color="#E87F4E"/></linearGradient></defs><rect x="30" y="30" width="70" height="130" rx="8" fill="#9AD6F2" stroke="#7FB6D9" stroke-width="5"/><rect x="36" y="36" width="58" height="118" rx="5" fill="#BFE6FA"/><rect x="14" y="8" width="102" height="14" rx="7" fill="#8A5A3B"/><circle cx="30" cy="15" r="4" fill="#FFD65A"/><circle cx="100" cy="15" r="4" fill="#FFD65A"/><path class="curtain-l" d="M14 22 L52 22 L44 168 L8 168 Z" fill="url(#lg-curt)"/><path class="curtain-r" d="M116 22 L78 22 L86 168 L122 168 Z" fill="url(#lg-curt)"/><path class="curtain-l" d="M24 30 L30 160" stroke="#D96A3C" stroke-width="5" fill="none" opacity="0.5"/><path class="curtain-r" d="M106 30 L100 160" stroke="#D96A3C" stroke-width="5" fill="none" opacity="0.5"/><circle cx="90" cy="90" r="12" fill="#FFE9A8"/><circle cx="90" cy="90" r="17" fill="#FFE9A8" opacity="0.3"/></svg>',
      onTap: async function (G) {
        var el = G.el('curtain');
        if (el) { el.classList.remove('swish'); void el.offsetWidth; el.classList.add('swish'); }
        G.sfx('whoosh');
        await Nicko.react('surprised');
        if (G.once('curtainPrint')) {
          G.collect('print-living');
        } else if (Secrets.count('curtainSneeze', 3, async function () {
          /* SECRET: swish the curtain a lot and Nicko sneezes */
          G.sfx('sneeze');
          await Nicko.react('sneeze', 1400);
          G.sfx('giggle');
          Secrets.found('curtainSneeze');
          G.points(10);
        })) { return; }
      } },
    { id: 'livingshelf', x: 64, y: 30, w: 12, label: 'Shelf',
      svg: '<svg viewBox="0 0 120 100"><defs><linearGradient id="lg-lshelf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08A52"/><stop offset="1" stop-color="#96622F"/></linearGradient></defs><rect x="8" y="70" width="104" height="12" rx="5" fill="url(#lg-lshelf)"/><rect x="8" y="70" width="104" height="4" rx="2" fill="#DCA964"/><rect x="20" y="30" width="24" height="40" rx="5" fill="#FF9D6B"/><rect x="20" y="30" width="24" height="14" rx="5" fill="#FFB98A"/><circle cx="72" cy="48" r="18" fill="#C49BE8"/><circle cx="72" cy="48" r="8" fill="#8A5FA8"/><circle cx="69" cy="45" r="2.5" fill="#fff"/></svg>',
      onTap: async function (G) {
        G.sfx('pop');
        await Nicko.react('wow');
        if (Inventory.unlock('glasses')) G.toast('Star glasses found! Tap them in the toybox to wear.', '🤩');
        else await Nicko.react('happy', 900);
      } },
    { id: 'livinglamp', x: 64, y: 62, w: 9, label: 'Lamp',
      svg: '<svg viewBox="0 0 100 150"><defs><linearGradient id="lg-llamp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3D0"/><stop offset="1" stop-color="#FFE066"/></linearGradient></defs><ellipse cx="50" cy="144" rx="28" ry="6" fill="rgba(90,55,25,0.2)"/><rect x="42" y="110" width="16" height="34" rx="7" fill="#8A5A3B"/><rect x="42" y="110" width="7" height="34" rx="3.5" fill="#A9764F"/><ellipse cx="50" cy="146" rx="26" ry="6" fill="#6E452D"/><path d="M22 108 L78 108 L66 56 L34 56 Z" fill="url(#lg-llamp)"/><path d="M34 56 L44 56 L36 108 L22 108 Z" fill="#fff" opacity="0.25"/><rect x="44" y="46" width="12" height="12" rx="6" fill="#8A5A3B"/></svg>',
      onTap: async function (G) { G.sfx('click'); await Nicko.react('happy', 900); } }
  ]
},

/* ================= PLAYROOM ================= */
playroom: {
  id: 'playroom', label: 'Playroom', icon: '🧸',
  bg: wallFloor('#E4F4E4', '#C9A05A',
    '<circle cx="150" cy="140" r="60" fill="#FFD65A" opacity="0.8"/><circle cx="150" cy="140" r="76" fill="#FFD65A" opacity="0.3"/>' +
    '<circle cx="850" cy="120" r="44" fill="#FF9D6B" opacity="0.8"/><circle cx="850" cy="120" r="58" fill="#FF9D6B" opacity="0.3"/>' +
    '<g><rect x="380" y="80" width="240" height="160" rx="18" fill="#FFFDF4" stroke="#A8D4A0" stroke-width="6"/><rect x="380" y="80" width="240" height="40" rx="18" fill="#C9E8C9"/><path d="M420 170 q40 -50 80 0 q40 -50 80 0" stroke="#7FBF7F" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="440" cy="130" r="10" fill="#FF9DC6"/><circle cx="560" cy="130" r="10" fill="#FFD65A"/></g>' +
    '<g opacity="0.6"><ellipse cx="500" cy="560" rx="360" ry="50" fill="#BFE3BF"/><ellipse cx="500" cy="554" rx="300" ry="40" fill="#CDEBC9"/></g>'),
  objects: [
    { id: 'blockA', x: 28, y: 76, w: 8, label: 'Red block', glowSoft: true, drag: true,
      svg: '<svg viewBox="0 0 80 80"><defs><linearGradient id="lg-blk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A6E"/><stop offset="1" stop-color="#E84A4A"/></linearGradient></defs><rect x="8" y="8" width="64" height="64" rx="12" fill="url(#lg-blk)"/><rect x="8" y="8" width="64" height="20" rx="10" fill="#fff" opacity="0.22"/><rect x="20" y="22" width="40" height="38" rx="6" fill="#FF8A7A"/><circle cx="40" cy="41" r="9" fill="#fff" opacity="0.6"/></svg>',
      onTap: async function (G) { await G.stackBlock('blockA'); } },
    { id: 'blockB', x: 38, y: 80, w: 8, label: 'Blue block', glowSoft: true, drag: true,
      svg: '<svg viewBox="0 0 80 80"><defs><linearGradient id="lg-blkb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB6F0"/><stop offset="1" stop-color="#4A7FC1"/></linearGradient></defs><rect x="8" y="8" width="64" height="64" rx="12" fill="url(#lg-blkb)"/><rect x="8" y="8" width="64" height="20" rx="10" fill="#fff" opacity="0.22"/><circle cx="40" cy="40" r="18" fill="#8FC3F0"/><circle cx="34" cy="34" r="6" fill="#BFE0FA"/></svg>',
      onTap: async function (G) { await G.stackBlock('blockB'); } },
    { id: 'blockC', x: 48, y: 76, w: 8, label: 'Yellow block', glowSoft: true, drag: true,
      svg: '<svg viewBox="0 0 80 80"><defs><linearGradient id="lg-blky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE066"/><stop offset="1" stop-color="#F2B73C"/></linearGradient></defs><rect x="8" y="8" width="64" height="64" rx="12" fill="url(#lg-blky)"/><rect x="8" y="8" width="64" height="20" rx="10" fill="#fff" opacity="0.25"/><path d="M40 18 L58 56 L22 56 Z" fill="#FFDE8A"/><path d="M40 30 L50 52 L30 52 Z" fill="#FFF3C4"/></svg>',
      onTap: async function (G) { await G.stackBlock('blockC'); } },
    { id: 'tower', x: 62, y: 78, w: 10, label: 'Block tower',
      svg: '<svg viewBox="0 0 100 120"><rect x="10" y="92" width="80" height="22" rx="8" fill="#8A5A3B" opacity="0.3"/><g class="tower-blocks"></g></svg>',
      onTap: async function (G) { await G.toppleTower(); } },
    { id: 'box', x: 70, y: 78, w: 13, label: 'Cardboard box', glowSoft: true,
      svg: '<svg viewBox="0 0 130 110"><defs><linearGradient id="lg-cbox" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9B183"/><stop offset="1" stop-color="#B98F5E"/></linearGradient></defs><ellipse cx="65" cy="104" rx="48" ry="6" fill="rgba(90,55,25,0.18)"/><path d="M14 44 L116 44 L106 100 L24 100 Z" fill="url(#lg-cbox)"/><path d="M14 44 L40 20 L92 20 L116 44" fill="#E8C795"/><path d="M14 44 L40 20 L52 20 L26 44 Z" fill="#C9A26E"/><line x1="65" y1="20" x2="65" y2="44" stroke="#A87F52" stroke-width="4"/><rect x="46" y="60" width="38" height="20" rx="4" fill="#FFF6E8" opacity="0.75"/><path d="M52 70 h20" stroke="#C49A6C" stroke-width="3" stroke-linecap="round"/></svg>',
      onTap: async function (G) {
        /* SECRET: if Nicko fits, he sits */
        await Nicko.walkTo(70);
        G.sfx('whoosh');
        await Nicko.action('wiggle');
        G.sfx('giggle');
        await Nicko.react('happy');
        Needs.play(10);
        if (Secrets.found('box')) {
          G.collect('print-box');
        } else if (G.once('boxFun')) G.points(10);
      } },
    { id: 'hatshelf', x: 16, y: 30, w: 11, label: 'Hat shelf',
      svg: '<svg viewBox="0 0 110 100"><defs><linearGradient id="lg-hshelf2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08A52"/><stop offset="1" stop-color="#96622F"/></linearGradient></defs><rect x="8" y="70" width="94" height="12" rx="5" fill="url(#lg-hshelf2)"/><rect x="8" y="70" width="94" height="4" rx="2" fill="#DCA964"/><ellipse cx="55" cy="58" rx="30" ry="9" fill="#8A5A3B"/><path d="M32 56 L38 20 L72 20 L78 56 Z" fill="#5A3A22"/><path d="M38 20 L44 20 L40 56 L32 56 Z" fill="#7A5230"/><rect x="32" y="48" width="46" height="9" fill="#FFD65A"/><rect x="32" y="48" width="46" height="3.5" fill="#FFE066"/></svg>',
      onTap: async function (G) {
        G.sfx('pop');
        await Nicko.react('wow');
        if (Inventory.unlock('hat')) G.toast('Silly hat found! Tap it in the toybox to wear it.', '🎩');
        else {
          G.spawn({ id: 'hat', x: 16, y: 52, w: 9, label: 'Silly hat', drag: true,
            svg: '<svg viewBox="0 0 100 80"><defs><linearGradient id="lg-hat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E452D"/><stop offset="1" stop-color="#4A2E1A"/></linearGradient></defs><ellipse cx="50" cy="70" rx="36" ry="6" fill="rgba(90,55,25,0.2)"/><ellipse cx="50" cy="62" rx="34" ry="10" fill="#8A5A3B"/><path d="M22 60 L30 16 L70 16 L78 60 Z" fill="url(#lg-hat)"/><path d="M30 16 L38 16 L34 60 L22 60 Z" fill="#8A5A3B"/><rect x="22" y="52" width="56" height="10" fill="#FFD65A"/><rect x="22" y="52" width="56" height="4" fill="#FFE066"/><circle cx="50" cy="14" r="8" fill="#FF9D6B"/><circle cx="47" cy="11" r="2.5" fill="#FFB98A"/></svg>',
            onTap: async function (G2) { Inventory.toggleWear('hat'); } });
        }
      } },
    { id: 'ballpit', x: 86, y: 74, w: 19, label: 'Ball pit',
      svg: '<svg viewBox="0 0 190 140"><defs><radialGradient id="lg-pit" cx="0.5" cy="0.35" r="0.9"><stop offset="0" stop-color="#FFAB8F"/><stop offset="1" stop-color="#E87F4E"/></radialGradient></defs><ellipse cx="95" cy="130" rx="82" ry="10" fill="rgba(90,55,25,0.18)"/><ellipse cx="95" cy="100" rx="80" ry="34" fill="url(#lg-pit)"/><ellipse cx="95" cy="94" rx="70" ry="24" fill="#D96A3C" opacity="0.55"/><g><circle cx="45" cy="78" r="18" fill="#FF6B5E"/><circle cx="41" cy="72" r="6" fill="#FF8A7A"/><circle cx="75" cy="66" r="18" fill="#FFD65A"/><circle cx="71" cy="60" r="6" fill="#FFE066"/><circle cx="105" cy="76" r="18" fill="#6BA8E8"/><circle cx="101" cy="70" r="6" fill="#8FC3F0"/><circle cx="135" cy="66" r="18" fill="#8FD16F"/><circle cx="131" cy="60" r="6" fill="#B7E3A0"/><circle cx="60" cy="90" r="18" fill="#C49BE8"/><circle cx="56" cy="84" r="6" fill="#D4B5F0"/><circle cx="120" cy="90" r="18" fill="#FF9DC6"/><circle cx="116" cy="84" r="6" fill="#FFB9D6"/></g></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(86);
        G.sfx('boing');
        var w = Nicko.el();
        w.style.transition = 'opacity .3s'; w.style.opacity = '0';
        await G.wait(350);
        G.sfx('splash');
        for (var i = 0; i < 5; i++) G.sparkleAt(80 + Math.random() * 12, 66, 3);
        await G.wait(500);
        w.style.opacity = '1';
        await Nicko.react('happy');
        Needs.play(12);
        if (G.once('pitDive')) G.points(10);
      } },
    { id: 'easel', x: 15, y: 58, w: 14, label: 'Easel', glowSoft: true,
      svg: '<svg viewBox="0 0 140 170"><defs><linearGradient id="lg-easel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08A52"/><stop offset="1" stop-color="#96622F"/></linearGradient></defs><ellipse cx="70" cy="164" rx="44" ry="6" fill="rgba(90,55,25,0.18)"/><path d="M70 20 L30 160 M70 20 L110 160 M48 110 L92 110" stroke="url(#lg-easel)" stroke-width="9" stroke-linecap="round"/><g class="painting"><rect x="38" y="34" width="64" height="60" rx="6" fill="#FFFDF4" stroke="#8A5A3B" stroke-width="5"/><rect x="44" y="40" width="52" height="48" rx="4" fill="#F7ECD4" opacity="0.6"/></g></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(16);
        G.sfx('pop');
        var el = G.el('easel');
        if (el) {
          var p = el.querySelector('.painting');
          if (p) p.innerHTML = '<ellipse cx="70" cy="66" rx="17" ry="14" fill="#FF9D6B"/><circle cx="56" cy="50" r="6.5" fill="#FF9D6B"/><circle cx="70" cy="46" r="6.5" fill="#FF9D6B"/><circle cx="84" cy="50" r="6.5" fill="#FF9D6B"/><circle cx="70" cy="66" r="6" fill="#FFD65A"/><path d="M70 80 L70 88" stroke="#57C4AD" stroke-width="4" stroke-linecap="round"/>';
        }
        G.sparkleAt(13, 52, 8);
        await Nicko.react('proud');
        Needs.change('happy', 8);
        if (G.once('paintingMade')) G.points(15);
      } },
    { id: 'drum', x: 62, y: 88, w: 10, label: 'Drum',
      svg: '<svg viewBox="0 0 100 100"><defs><radialGradient id="lg-drum" cx="0.4" cy="0.35" r="0.9"><stop offset="0" stop-color="#FF9D92"/><stop offset="1" stop-color="#E86A5A"/></radialGradient></defs><ellipse cx="50" cy="94" rx="34" ry="6" fill="rgba(90,55,25,0.18)"/><ellipse cx="50" cy="66" rx="34" ry="22" fill="url(#lg-drum)"/><ellipse cx="50" cy="52" rx="34" ry="16" fill="#FFF3DC"/><ellipse cx="50" cy="52" rx="34" ry="16" fill="none" stroke="#E86A5A" stroke-width="5"/><ellipse cx="50" cy="52" rx="22" ry="9" fill="#fff" opacity="0.4"/><rect x="20" y="14" width="9" height="34" rx="4" fill="#8A5A3B" transform="rotate(-24 24 30)"/><circle cx="17" cy="50" r="6" fill="#FFD65A"/><rect x="71" y="14" width="9" height="34" rx="4" fill="#8A5A3B" transform="rotate(24 75 30)"/><circle cx="84" cy="50" r="6" fill="#FFD65A"/></svg>',
      onTap: async function (G) {
        var n = G.flag('drumCount') || 0;
        G.setFlag('drumCount', n + 1);
        G.sfx('drum', n);
        var el = G.el('drum');
        if (el) { el.classList.remove('bounce'); void el.offsetWidth; el.classList.add('bounce'); }
        await Nicko.action('dance');
        await Nicko.react('music');
        Needs.play(6);
        if (n === 0 && G.once('drumFun')) G.points(5);
        /* SECRET: drum really fast for a dance party */
        var now = Date.now();
        var hits = G.flag('drumHits') || [];
        hits = hits.filter(function (t) { return now - t < 3000; });
        hits.push(now);
        G.setFlag('drumHits', hits);
        if (hits.length >= 6 && Secrets.found('drumParty')) {
          G.sfx('fanfare');
          for (var i = 0; i < 6; i++) G.sparkleAt(50 + Math.random() * 24, 50 + Math.random() * 20, 4);
          await Nicko.action('dance', 1200);
          await Nicko.react('wow');
          G.points(20);
          G.toast('Drum solo dance party!', '🥁');
        }
      } },
    { id: 'ptoys', x: 8, y: 82, w: 12, label: 'Toy box',
      svg: '<svg viewBox="0 0 120 110"><defs><linearGradient id="lg-ptbox" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB6F0"/><stop offset="1" stop-color="#4A7FC1"/></linearGradient></defs><ellipse cx="60" cy="106" rx="48" ry="6" fill="rgba(90,55,25,0.18)"/><path d="M14 50 L106 50 L96 104 L24 104 Z" fill="url(#lg-ptbox)"/><path d="M14 50 L30 50 L26 104 L24 104 Z" fill="#fff" opacity="0.18"/><rect x="10" y="38" width="100" height="22" rx="8" fill="#3D6BA3"/><rect x="10" y="38" width="100" height="8" rx="4" fill="#5A8FD0"/><circle cx="60" cy="49" r="7" fill="#2E4A6B"/><circle cx="60" cy="49" r="3" fill="#FFD65A"/></svg>',
      onTap: async function (G) { G.sfx('click'); await Nicko.react('happy', 900); } },
    { id: 'ptoy1', x: 24, y: 88, w: 7, label: 'Toy car', glowSoft: true, drag: true,
      svg: '<svg viewBox="0 0 90 60"><defs><linearGradient id="lg-car" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A6E"/><stop offset="1" stop-color="#E84A4A"/></linearGradient></defs><ellipse cx="45" cy="56" rx="34" ry="4" fill="rgba(90,55,25,0.2)"/><rect x="8" y="18" width="60" height="24" rx="10" fill="url(#lg-car)"/><rect x="8" y="18" width="60" height="9" rx="4.5" fill="#fff" opacity="0.25"/><rect x="22" y="8" width="30" height="18" rx="8" fill="#FF8A7A"/><rect x="27" y="11" width="20" height="10" rx="5" fill="#BFE6FA"/><circle cx="24" cy="48" r="10" fill="#3A3E44"/><circle cx="24" cy="48" r="4" fill="#8A9099"/><circle cx="60" cy="48" r="10" fill="#3A3E44"/><circle cx="60" cy="48" r="4" fill="#8A9099"/></svg>',
      onTap: async function (G) { await G.tidyPlayToy('ptoy1'); } },
    { id: 'ptoy2', x: 38, y: 90, w: 7, label: 'Toy robot', glowSoft: true, drag: true,
      svg: '<svg viewBox="0 0 70 90"><defs><linearGradient id="lg-robot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B9BFC6"/><stop offset="0.5" stop-color="#9AA1A8"/><stop offset="1" stop-color="#8A9099"/></linearGradient></defs><ellipse cx="35" cy="86" rx="24" ry="4" fill="rgba(90,55,25,0.18)"/><rect x="14" y="20" width="42" height="46" rx="10" fill="url(#lg-robot)"/><rect x="14" y="20" width="42" height="12" rx="6" fill="#fff" opacity="0.25"/><rect x="22" y="30" width="26" height="14" rx="4" fill="#1E2A33"/><circle cx="28" cy="37" r="3" fill="#7ECBF2"><animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite"/></circle><circle cx="42" cy="37" r="3" fill="#7ECBF2"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite"/></circle><rect x="28" y="6" width="14" height="16" rx="4" fill="#9AA1A8"/><circle cx="35" cy="6" r="5" fill="#FFD65A"/><rect x="28" y="52" width="14" height="8" rx="3" fill="#7A828A"/></svg>',
      onTap: async function (G) { await G.tidyPlayToy('ptoy2'); } },
    { id: 'ptoy3', x: 72, y: 90, w: 7, label: 'Toy plane', glowSoft: true, drag: true,
      svg: '<svg viewBox="0 0 90 70"><defs><linearGradient id="lg-plane" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7FB6F0"/><stop offset="1" stop-color="#4A7FC1"/></linearGradient></defs><path d="M8 40 L70 40 L82 30 L82 50 L70 44 Z" fill="url(#lg-plane)"/><path d="M8 40 L30 40 L26 46 L8 46 Z" fill="#fff" opacity="0.25"/><path d="M40 40 L34 62 L46 62 Z" fill="#3D6BA3"/><rect x="52" y="34" width="14" height="8" rx="4" fill="#BFE6FA"/></svg>',
      onTap: async function (G) { await G.tidyPlayToy('ptoy3'); } },
    { id: 'ptoy4', x: 90, y: 88, w: 7, label: 'Toy giraffe', glowSoft: true, drag: true,
      svg: '<svg viewBox="0 0 70 90"><defs><radialGradient id="lg-gir" cx="0.4" cy="0.3" r="0.9"><stop offset="0" stop-color="#FFE066"/><stop offset="1" stop-color="#F2B73C"/></radialGradient></defs><ellipse cx="35" cy="86" rx="22" ry="4" fill="rgba(90,55,25,0.18)"/><rect x="28" y="34" width="12" height="44" rx="6" fill="url(#lg-gir)"/><circle cx="40" cy="22" r="14" fill="url(#lg-gir)"/><circle cx="46" cy="8" r="5" fill="url(#lg-gir)"/><circle cx="30" cy="8" r="5" fill="url(#lg-gir)"/><circle cx="34" cy="20" r="3" fill="#3A2A1A"/><circle cx="34" cy="19" r="1" fill="#fff"/><ellipse cx="44" cy="26" rx="3" ry="2.2" fill="#E87F4E"/><circle cx="34" cy="46" r="4" fill="#C68B59"/><circle cx="34" cy="60" r="4" fill="#C68B59"/><circle cx="34" cy="74" r="4" fill="#C68B59"/></svg>',
      onTap: async function (G) { await G.tidyPlayToy('ptoy4'); } },
    { id: 'sorter', x: 88, y: 50, w: 11, label: 'Shape sorter', glowSoft: true,
      svg: '<svg viewBox="0 0 110 110"><defs><linearGradient id="lg-sort" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D4B5F0"/><stop offset="1" stop-color="#A87FD1"/></linearGradient></defs><ellipse cx="55" cy="104" rx="40" ry="5" fill="rgba(90,55,25,0.18)"/><rect x="14" y="50" width="82" height="50" rx="12" fill="url(#lg-sort)"/><rect x="14" y="50" width="82" height="16" rx="8" fill="#fff" opacity="0.22"/><circle cx="34" cy="70" r="11" fill="#8A5FA8"/><rect x="50" y="60" width="20" height="20" rx="3" fill="#8A5FA8"/><path d="M78 82 L90 60 L102 82 Z" fill="#8A5FA8"/><circle class="shape-ball" cx="30" cy="26" r="13" fill="#FF6B5E"/><circle class="shape-ball" cx="26" cy="22" r="4" fill="#FF8A7A"/><rect class="shape-cube" x="52" y="14" width="24" height="24" rx="4" fill="#6BA8E8"/><rect class="shape-cube" x="56" y="18" width="10" height="8" rx="2" fill="#8FC3F0"/></svg>',
      onTap: async function (G) {
        var n = (G.flag('sortCount') || 0) + 1;
        G.setFlag('sortCount', n);
        G.sfx('pop');
        await Nicko.react('happy', 900);
        G.sparkleAt(93, 48, 6);
        if (n >= 2 && G.once('sortDone')) G.points(10);
      } }
  ]
},

/* ================= BACKYARD ================= */
backyard: {
  id: 'backyard', label: 'Backyard', icon: '🌳',
  bg: '<svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ECBF2"/><stop offset="1" stop-color="#BFE6FA"/></linearGradient>' +
    '<linearGradient id="grassG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD16F"/><stop offset="1" stop-color="#6FAE52"/></linearGradient>' +
    '<linearGradient id="fenceG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9B183"/><stop offset="1" stop-color="#B98F5E"/></linearGradient></defs>' +
    '<rect x="0" y="0" width="1000" height="330" fill="url(#skyG)"/>' +
    '<g class="amb-drift" opacity="0.9"><ellipse cx="200" cy="100" rx="80" ry="26" fill="#fff"/><ellipse cx="260" cy="116" rx="60" ry="20" fill="#fff" opacity="0.85"/><ellipse cx="150" cy="116" rx="50" ry="18" fill="#fff" opacity="0.7"/></g>' +
    '<g class="amb-drift" style="animation-duration:75s" opacity="0.75"><ellipse cx="650" cy="180" rx="70" ry="22" fill="#fff"/><ellipse cx="700" cy="194" rx="50" ry="17" fill="#fff" opacity="0.8"/></g>' +
    '<g opacity="0.8"><circle cx="60" cy="60" r="4" fill="#fff"/><circle cx="420" cy="44" r="3" fill="#fff"/><circle cx="760" cy="60" r="4" fill="#fff"/><circle cx="920" cy="150" r="3" fill="#fff"/></g>' +
    '<rect x="0" y="300" width="1000" height="92" fill="url(#fenceG)"/>' +
    '<g fill="#8A6B45" opacity="0.5">' +
    '<rect x="40" y="300" width="10" height="92"/><rect x="140" y="300" width="10" height="92"/><rect x="240" y="300" width="10" height="92"/><rect x="340" y="300" width="10" height="92"/><rect x="440" y="300" width="10" height="92"/><rect x="540" y="300" width="10" height="92"/><rect x="640" y="300" width="10" height="92"/><rect x="740" y="300" width="10" height="92"/><rect x="840" y="300" width="10" height="92"/><rect x="940" y="300" width="10" height="92"/></g>' +
    '<rect x="0" y="318" width="1000" height="12" fill="#A87F52"/><rect x="0" y="356" width="1000" height="12" fill="#A87F52"/>' +
    '<rect x="0" y="294" width="1000" height="10" rx="5" fill="#E8C795"/>' +
    '<rect x="0" y="390" width="1000" height="230" fill="url(#grassG)"/>' +
    '<ellipse cx="200" cy="560" rx="260" ry="40" fill="#7FC45E" opacity="0.6"/><ellipse cx="800" cy="580" rx="280" ry="40" fill="#7FC45E" opacity="0.6"/>' +
    '<g stroke="#5A9E4B" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.8">' +
    '<path d="M120 520 q4 -18 10 -24 M132 522 q2 -16 -4 -26 M260 560 q4 -18 10 -24 M700 540 q4 -18 10 -24 M712 542 q2 -16 -4 -26 M880 520 q4 -18 10 -24 M60 580 q4 -18 10 -24 M940 580 q4 -18 10 -24"/>' +
    '</g>' +
    '<g class="amb-sway"><circle cx="340" cy="500" r="7" fill="#FF9DC6"/><circle cx="620" cy="530" r="7" fill="#FFD65A"/><circle cx="480" cy="560" r="7" fill="#FF9DC6"/></g>' +
    '</svg>',
  objects: [
    { id: 'butterfly', x: 50, y: 30, w: 9, label: 'Butterfly', glow: true,
      svg: '<svg viewBox="0 0 100 90"><defs><radialGradient id="lg-bfly" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#D4B5F0"/><stop offset="1" stop-color="#A87FD1"/></radialGradient></defs><g class="wings"><ellipse cx="32" cy="40" rx="22" ry="28" fill="url(#lg-bfly)" transform="rotate(-24 32 40)"/><ellipse cx="68" cy="40" rx="22" ry="28" fill="url(#lg-bfly)" transform="rotate(24 68 40)"/><circle cx="32" cy="40" r="7" fill="#8A5FA8"/><circle cx="68" cy="40" r="7" fill="#8A5FA8"/><circle cx="32" cy="40" r="2.5" fill="#fff"/><circle cx="68" cy="40" r="2.5" fill="#fff"/></g><rect x="46" y="26" width="8" height="40" rx="4" fill="#5A4A6B"/><circle cx="50" cy="24" r="7" fill="#5A4A6B"/><path d="M47 18 q-6 -8 -12 -9 M53 18 q6 -8 12 -9" stroke="#5A4A6B" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
      onTap: async function (G) {
        var golden = Math.random() < 0.18 || G.flag('bfTaps') >= 6;
        var taps = (G.flag('bfTaps') || 0) + 1;
        G.setFlag('bfTaps', taps);
        G.sfx('magic');
        if (golden && G.once('goldenBf')) {
          G.setSvg('butterfly', '<svg viewBox="0 0 100 90"><defs><radialGradient id="lg-bflyg" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#FFE066"/><stop offset="1" stop-color="#F2B73C"/></radialGradient></defs><g class="wings"><ellipse cx="32" cy="40" rx="22" ry="28" fill="url(#lg-bflyg)" transform="rotate(-24 32 40)"/><ellipse cx="68" cy="40" rx="22" ry="28" fill="url(#lg-bflyg)" transform="rotate(24 68 40)"/><circle cx="32" cy="40" r="7" fill="#C9920E"/><circle cx="68" cy="40" r="7" fill="#C9920E"/><circle cx="32" cy="40" r="2.5" fill="#fff"/><circle cx="68" cy="40" r="2.5" fill="#fff"/></g><rect x="46" y="26" width="8" height="40" rx="4" fill="#8A6B1F"/><circle cx="50" cy="24" r="7" fill="#8A6B1F"/><path d="M47 18 q-6 -8 -12 -9 M53 18 q6 -8 12 -9" stroke="#8A6B1F" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>');
          G.sparkleAt(50, 28, 12);
          await Nicko.react('wow');
          G.collect('print-butterfly');
          G.yardDiscover('butterfly');
          return;
        }
        await Nicko.walkTo(50);
        G.sparkleAt(50, 30, 6);
        await Nicko.react('wow');
        G.sfx('giggle');
        if (G.once('bfFun')) { G.points(10); G.yardDiscover('butterfly'); }
      } },
    { id: 'can', x: 12, y: 74, w: 10, label: 'Watering can', glowSoft: true, drag: true,
      svg: '<svg viewBox="0 0 110 100"><defs><linearGradient id="lg-can" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB6F0"/><stop offset="1" stop-color="#4A7FC1"/></linearGradient></defs><ellipse cx="55" cy="94" rx="40" ry="6" fill="rgba(60,90,40,0.2)"/><rect x="30" y="34" width="52" height="52" rx="12" fill="url(#lg-can)"/><rect x="30" y="34" width="52" height="16" rx="8" fill="#fff" opacity="0.25"/><path d="M82 44 L104 30" stroke="#4A7FC1" stroke-width="10" stroke-linecap="round"/><circle cx="106" cy="28" r="7" fill="#3D6BA3"/><path d="M30 50 L10 40" stroke="#4A7FC1" stroke-width="10" stroke-linecap="round"/><rect x="44" y="18" width="24" height="18" rx="6" fill="#4A7FC1"/><rect x="44" y="18" width="24" height="7" rx="3.5" fill="#5A8FD0"/></svg>',
      onTap: async function (G) { await G.waterFlowers(); } },
    { id: 'flowers', x: 28, y: 70, w: 17, label: 'Flowers',
      svg: '<svg viewBox="0 0 170 110"><ellipse cx="85" cy="104" rx="70" ry="10" fill="#5A9E4B"/><g class="flower"><line x1="40" y1="106" x2="40" y2="60" stroke="#5A8F3C" stroke-width="7" stroke-linecap="round"/><g class="amb-sway"><circle cx="40" cy="46" r="16" fill="#FF6B5E"/><circle cx="40" cy="46" r="6" fill="#FFD65A"/><circle cx="34" cy="40" r="5" fill="#FF8A7A"/></g></g><g class="flower"><line x1="85" y1="106" x2="85" y2="52" stroke="#5A8F3C" stroke-width="7" stroke-linecap="round"/><g class="amb-sway" style="animation-delay:-1.4s"><circle cx="85" cy="38" r="16" fill="#C49BE8"/><circle cx="85" cy="38" r="6" fill="#FFD65A"/><circle cx="79" cy="32" r="5" fill="#D4B5F0"/></g></g><g class="flower"><line x1="130" y1="106" x2="130" y2="62" stroke="#5A8F3C" stroke-width="7" stroke-linecap="round"/><g class="amb-sway" style="animation-delay:-2.6s"><circle cx="130" cy="48" r="16" fill="#FF9DC6"/><circle cx="130" cy="48" r="6" fill="#FFD65A"/><circle cx="124" cy="42" r="5" fill="#FFB9D6"/></g></g><path d="M58 96 q-10 -6 -18 -4 M112 96 q10 -6 18 -4" stroke="#5A8F3C" stroke-width="6" fill="none" stroke-linecap="round"/></svg>',
      onTap: async function (G) {
        G.sfx('pop');
        G.sparkleAt(28, 62, 6);
        await Nicko.react('happy', 900);
      } },
    { id: 'sandbox', x: 80, y: 78, w: 19, label: 'Sandbox',
      svg: '<svg viewBox="0 0 190 120"><defs><linearGradient id="lg-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9B183"/><stop offset="1" stop-color="#B98F5E"/></linearGradient></defs><ellipse cx="95" cy="112" rx="82" ry="8" fill="rgba(60,90,40,0.18)"/><rect x="14" y="30" width="162" height="76" rx="14" fill="url(#lg-sand)"/><rect x="14" y="30" width="162" height="18" rx="9" fill="#E8C795"/><rect x="28" y="42" width="134" height="52" rx="10" fill="#F0D5A0"/><ellipse cx="80" cy="62" rx="30" ry="12" fill="#E8C795"/><path d="M60 42 l-14 -22 M130 42 l14 -22" stroke="#8A5A3B" stroke-width="8" stroke-linecap="round"/><rect x="40" y="14" width="110" height="12" rx="6" fill="#FF6B5E"/><rect x="40" y="14" width="110" height="5" rx="2.5" fill="#FF8A7A"/><circle cx="120" cy="68" r="10" fill="#FFD65A"/><circle cx="120" cy="68" r="4" fill="#F2B73C"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(80);
        G.sfx('thud');
        await Nicko.action('pounce');
        G.sfx('pop');
        await Nicko.react('surprised');
        Nicko.mood('dirty', true);
        Needs.change('clean', -25);
        if (G.once('sandboxDig')) {
          G.collect('print-backyard');
          G.yardDiscover('sandbox');
        }
      } },
    { id: 'ypuddle', x: 58, y: 88, w: 14, label: 'Puddle',
      svg: '<svg viewBox="0 0 140 50"><ellipse cx="70" cy="26" rx="62" ry="20" fill="#7ECBF2" opacity="0.9"/><ellipse cx="48" cy="22" rx="22" ry="8" fill="#fff" opacity="0.4"/><ellipse cx="92" cy="30" rx="14" ry="6" fill="#fff" opacity="0.3"/></svg>',
      onTap: async function (G) {
        await Nicko.walkTo(58);
        G.sfx('splash'); G.splashAt(58, 86);
        await Nicko.action('shakeoff');
        await Nicko.react('happy');
        Nicko.mood('dirty', true);
        Needs.change('clean', -20);
        Needs.play(8);
        if (G.once('ypuddleFun')) { G.points(5); G.yardDiscover('puddle'); }
      } },
    { id: 'yball', x: 40, y: 86, w: 8, label: 'Ball', drag: true,
      svg: '<svg viewBox="0 0 90 90"><defs><radialGradient id="lg-yball" cx="0.38" cy="0.3" r="0.95"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E3E9EF"/></radialGradient></defs><ellipse cx="45" cy="84" rx="30" ry="5" fill="rgba(60,90,40,0.18)"/><circle cx="45" cy="45" r="38" fill="url(#lg-yball)"/><path d="M45 7 L45 83 M7 45 L83 45" stroke="#FF6B5E" stroke-width="10"/><circle cx="45" cy="45" r="38" fill="none" stroke="#3A3E44" stroke-width="5"/><ellipse cx="32" cy="30" rx="10" ry="13" fill="#fff" opacity="0.7"/></svg>',
      onTap: async function (G) {
        G.sfx('boing');
        await G.sendTo('yball', 66, 86, 800);
        await Nicko.walkTo(62);
        await Nicko.action('pounce');
        await Nicko.react('happy');
        Needs.play(10);
        if (G.once('yballFun')) G.points(5);
        G.sendTo('yball', 40, 86, 1);
      } },
    { id: 'bush', x: 84, y: 60, w: 12, label: 'Bush', glowSoft: true,
      svg: '<svg viewBox="0 0 120 120"><defs><radialGradient id="lg-bush" cx="0.4" cy="0.35" r="0.9"><stop offset="0" stop-color="#7FC45E"/><stop offset="1" stop-color="#4E8A3C"/></radialGradient></defs><ellipse cx="60" cy="112" rx="48" ry="7" fill="rgba(60,90,40,0.2)"/><g class="amb-sway"><circle cx="40" cy="70" r="30" fill="url(#lg-bush)"/><circle cx="75" cy="62" r="34" fill="url(#lg-bush)"/><circle cx="58" cy="44" r="26" fill="url(#lg-bush)"/><circle cx="50" cy="58" r="10" fill="#8FD16F" opacity="0.7"/></g><circle cx="40" cy="70" r="7" fill="#FF6B5E"/><circle cx="80" cy="56" r="7" fill="#FF6B5E"/><circle cx="60" cy="84" r="7" fill="#FFD65A"/><circle cx="37" cy="67" r="2.5" fill="#FF8A7A"/><circle cx="77" cy="53" r="2.5" fill="#FF8A7A"/></svg>',
      onTap: async function (G) {
        G.sfx('chirp');
        G.spawn({ id: 'bird', x: 84, y: 34, w: 8, label: 'Bird',
          svg: '<svg viewBox="0 0 90 70"><defs><radialGradient id="lg-bird" cx="0.4" cy="0.35" r="0.9"><stop offset="0" stop-color="#7FB6F0"/><stop offset="1" stop-color="#4A7FC1"/></radialGradient></defs><ellipse cx="45" cy="40" rx="24" ry="17" fill="url(#lg-bird)"/><ellipse cx="38" cy="34" rx="8" ry="6" fill="#fff" opacity="0.35"/><circle cx="62" cy="28" r="13" fill="url(#lg-bird)"/><circle cx="65" cy="26" r="3" fill="#1E2A33"/><circle cx="66" cy="25" r="1" fill="#fff"/><path d="M73 30 l10 4 -10 5 z" fill="#FFB62E"/><path d="M73 30 l10 4 -6 1 z" fill="#FFD06E"/><path d="M20 40 q-14 -8 -18 -22 q16 2 24 12" fill="#4A7FC1"/><rect x="38" y="54" width="4" height="10" rx="2" fill="#B57E1B"/><rect x="48" y="54" width="4" height="10" rx="2" fill="#B57E1B"/></svg>',
          onTap: async function () {} });
        await Nicko.react('wow');
        await G.sendTo('bird', 60, 18, 1400);
        G.despawn('bird');
        G.sfx('chirp');
        if (G.once('birdFun')) { G.points(5); G.yardDiscover('bird'); }
      } },
    { id: 'gate', x: 20, y: 54, w: 10, label: 'Gate',
      svg: '<svg viewBox="0 0 100 150"><defs><linearGradient id="lg-gate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08A52"/><stop offset="1" stop-color="#96622F"/></linearGradient></defs><rect x="14" y="10" width="72" height="130" rx="10" fill="url(#lg-gate)"/><rect x="26" y="26" width="48" height="98" rx="6" fill="#D9B183"/><rect x="26" y="26" width="48" height="20" rx="6" fill="#E8C795"/><rect x="26" y="60" width="48" height="12" fill="#8A5A3B"/><circle cx="72" cy="76" r="10" fill="#5A3A20"/><rect x="66" y="76" width="14" height="8" rx="4" fill="#FFD65A"/><circle cx="50" cy="14" r="3" fill="#DCA964"/></svg>',
      onTap: async function (G) {
        G.sfx('knock');
        var el = G.el('gate');
        if (el) { el.classList.remove('wobble'); void el.offsetWidth; el.classList.add('wobble'); }
        await Nicko.react('sad');
        if (G.once('gateSafe')) G.points(5);
      } },
    { id: 'sun', x: 86, y: 14, w: 9, label: 'Sun',
      svg: '<svg viewBox="0 0 90 90"><defs><radialGradient id="lg-sun" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stop-color="#FFE066"/><stop offset="1" stop-color="#FFB62E"/></radialGradient></defs><g class="amb-flicker"><circle cx="45" cy="45" r="30" fill="url(#lg-sun)"/><circle cx="45" cy="45" r="38" fill="#FFE066" opacity="0.25"/></g><g stroke="#FFB62E" stroke-width="7" stroke-linecap="round"><line x1="45" y1="2" x2="45" y2="12"/><line x1="45" y1="78" x2="45" y2="88"/><line x1="2" y1="45" x2="12" y2="45"/><line x1="78" y1="45" x2="88" y2="45"/><line x1="14" y1="14" x2="21" y2="21"/><line x1="69" y1="69" x2="76" y2="76"/><line x1="76" y1="14" x2="69" y2="21"/><line x1="21" y1="69" x2="14" y2="76"/></g><circle cx="38" cy="42" r="3.4" fill="#B57E1B"/><circle cx="52" cy="42" r="3.4" fill="#B57E1B"/><path d="M36 52 q9 7 18 0" stroke="#B57E1B" stroke-width="3.4" fill="none" stroke-linecap="round"/></svg>',
      onTap: async function (G) {
        G.sfx('magic'); G.sparkleAt(86, 14, 8);
        await Nicko.react('happy', 900);
      } },
    { id: 'cloud', x: 58, y: 13, w: 14, label: 'Cloud',
      svg: '<svg viewBox="0 0 140 80"><g class="amb-bob"><ellipse cx="50" cy="52" rx="34" ry="22" fill="#fff"/><ellipse cx="86" cy="46" rx="30" ry="24" fill="#fff"/><ellipse cx="68" cy="36" rx="26" ry="20" fill="#F4F8FC"/><ellipse cx="60" cy="44" rx="12" ry="8" fill="#E8F0F8"/></g></svg>',
      onTap: async function (G) {
        G.sfx('rain');
        for (var i = 0; i < 10; i++) G.splashAt(40 + Math.random() * 40, 30 + Math.random() * 20);
        await Nicko.react('surprised');
        var el = G.el('flowers');
        if (el) { el.classList.remove('bloom'); void el.offsetWidth; el.classList.add('bloom'); }
        if (G.once('rainFun')) { G.points(5); G.yardDiscover('rain'); }
      } }
  ]
}

});
