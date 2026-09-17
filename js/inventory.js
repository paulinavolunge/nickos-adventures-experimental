/* Nicko's Adventures - toybox inventory: visual collection of unlocked toys
   and wearable accessories. Everything is earned through play. No text-heavy
   menus: tap an item to give it to Nicko, tap again on a wearable to wear it. */
window.Inventory = (function () {
  'use strict';

  function owned() { return window.Store.data.inventory; }
  function equipped() { return window.Store.data.equipped; }

  function unlock(id) {
    if (!window.ITEMS[id] || owned().indexOf(id) >= 0) return false;
    owned().push(id);
    window.Store.save();
    window.AudioSys.play('magic');
    if (window.G) {
      window.G.sparkleAt(window.Nicko.pos(), 55, 10);
      window.G.renderTray();
    }
    return true;
  }
  function has(id) { return owned().indexOf(id) >= 0; }

  function toggleWear(id) {
    var item = window.ITEMS[id];
    if (!item || !item.wear || !has(id)) return;
    var eq = equipped();
    var on = !eq[id];
    /* Only one head item at a time (hat), glasses and bowtie can combine. */
    eq[id] = on;
    if (!on) delete eq[id];
    window.Store.save();
    window.Nicko.syncWear(eq);
    window.AudioSys.play('pop');
    if (window.G) window.G.renderTray();
    if (on) window.Nicko.react('proud', 1200);
  }

  /* Give a toy to Nicko: it appears at his feet, draggable, ready to play. */
  async function give(id) {
    var item = window.ITEMS[id];
    if (!item || !has(id)) return;
    if (item.wear) { toggleWear(id); return; }
    var G = window.G;
    if (!G) return;
    if (G.el('inv_' + id)) {
      G.despawn('inv_' + id);
      return;
    }
    var nx = Math.max(8, Math.min(92, window.Nicko.pos() + 10));
    G.spawn({
      id: 'inv_' + id, x: nx, y: 84, w: 9, label: item.name, drag: true,
      svg: ToySvgs[id] || ('<svg viewBox="0 0 80 80"><text x="40" y="52" font-size="44" text-anchor="middle">' + item.icon + '</text></svg>'),
      onTap: async function (g) {
        if (id === 'toyMouse') { g.sfx('squeak'); await Nicko.react('hunt', 1300); window.Needs.play(12); }
        else if (id === 'ball') { await Nicko.action('pounce'); await Nicko.react('happy'); window.Needs.play(14); }
        else if (id === 'blanket') { await Nicko.react('love'); window.Needs.change('happy', 8); }
        else { await Nicko.react('happy'); window.Needs.play(8); }
      }
    });
    window.AudioSys.play('pop');
    await Nicko.react('happy', 1100);
  }

  /* Simple SVG art for tray-spawned toys (emoji fallback otherwise). */
  var ToySvgs = {
    toyMouse: '<svg viewBox="0 0 90 70"><ellipse cx="40" cy="40" rx="26" ry="18" fill="#9AA1A8"/><circle cx="24" cy="22" r="9" fill="#9AA1A8"/><circle cx="56" cy="22" r="9" fill="#9AA1A8"/><circle cx="24" cy="22" r="4" fill="#F4A7B9"/><circle cx="56" cy="22" r="4" fill="#F4A7B9"/><circle cx="52" cy="36" r="3.4" fill="#1E2A33"/><path d="M64 44 q22 4 20 20" stroke="#9AA1A8" stroke-width="5" fill="none" stroke-linecap="round"/></svg>',
    ball: '<svg viewBox="0 0 90 90"><circle cx="45" cy="45" r="38" fill="#FF6B5E"/><path d="M45 7 a38 38 0 0 1 0 76" fill="none" stroke="#fff" stroke-width="7"/><circle cx="45" cy="45" r="12" fill="#fff" opacity="0.85"/></svg>',
    blanket: '<svg viewBox="0 0 100 80"><rect x="8" y="14" width="84" height="56" rx="12" fill="#C49BE8"/><rect x="8" y="54" width="84" height="12" fill="#A87FD0"/><circle cx="30" cy="36" r="8" fill="#FFD65A"/><circle cx="55" cy="30" r="8" fill="#FF9DC6"/></svg>',
    book: '<svg viewBox="0 0 100 80"><path d="M14 66 Q36 50 50 66 Q64 50 86 66 L86 30 Q64 16 50 30 Q36 16 14 30 Z" fill="#fff" stroke="#6BA8E8" stroke-width="4"/><line x1="50" y1="30" x2="50" y2="66" stroke="#6BA8E8" stroke-width="3"/></svg>'
  };

  return {
    unlock: unlock, has: has, give: give, toggleWear: toggleWear,
    owned: owned, equipped: equipped
  };
})();
