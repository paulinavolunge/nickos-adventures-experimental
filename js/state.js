/* Nicko's Adventures - save state, achievements, collectibles, inventory */
window.ACHIEVEMENTS = [
  { id: 'curious-kitten', name: 'Curious Kitten', icon: '🐾', desc: 'Made your very first discovery' },
  { id: 'house-explorer', name: 'House Explorer', icon: '🗺️', desc: 'Visited all six rooms of the house' },
  { id: 'clean-paws', name: 'Bathroom Helper', icon: '🧼', desc: 'Washed, rinsed and dried those dirty paws' },
  { id: 'kitchen-explorer', name: 'Kitchen Explorer', icon: '🍳', desc: 'Learned the stove is hot and fed Nicko' },
  { id: 'toy-master', name: 'Toy Master', icon: '🧸', desc: 'Tidied every toy in the playroom' },
  { id: 'backyard-detective', name: 'Backyard Detective', icon: '🔍', desc: 'Made three backyard discoveries' },
  { id: 'bedtime-star', name: 'Bedtime Star', icon: '🌙', desc: 'Finished the whole bedtime routine' },
  { id: 'paw-champion', name: 'Paw Champion', icon: '🏆', desc: 'Earned 150 Paw Points' },
  { id: 'combo-cook', name: 'Combo Cook', icon: '🍲', desc: 'Mixed the perfect meal in the bowl' },
  { id: 'secret-seeker', name: 'Secret Seeker', icon: '🕵️', desc: 'Found three hidden secrets' }
];

window.COLLECTIBLES = [
  { id: 'print-bedroom', name: 'Bedroom Print', hint: 'Something hides under the bed...' },
  { id: 'print-living', name: 'Living Room Print', hint: 'Something squeaks behind the cushion...' },
  { id: 'print-backyard', name: 'Backyard Print', hint: 'Dig in the sandbox' },
  { id: 'print-playroom', name: 'Playroom Print', hint: 'Tidy ALL the toys to find it' },
  { id: 'print-kitchen', name: 'Kitchen Print', hint: 'Rattle the cabinet twice' },
  { id: 'print-bathroom', name: 'Bathroom Print', hint: 'Wash, rinse and dry Nicko completely' },
  { id: 'print-blocks', name: 'Builder Print', hint: 'Stack blocks super tall, then topple the tower' },
  { id: 'print-butterfly', name: 'Golden Print', hint: 'A rare golden butterfly carries one...' },
  { id: 'print-night', name: 'Starlight Print', hint: 'Turn the bedroom lamp off...' },
  { id: 'print-box', name: 'Box Print', hint: 'If Nicko fits, he sits' }
];

/* Inventory catalog: toys Nicko owns + wearable accessories. Everything is
   earned through play. icon is an emoji used in the toybox tray. */
window.ITEMS = {
  toyMouse:  { name: 'Toy mouse', icon: '🐭', wear: false },
  blanket:   { name: 'Blanket', icon: '🛌', wear: false },
  book:      { name: 'Book', icon: '📖', wear: false },
  ball:      { name: 'Ball', icon: '⚽', wear: false },
  hat:       { name: 'Silly hat', icon: '🎩', wear: true },
  glasses:   { name: 'Star glasses', icon: '🤩', wear: true },
  bowtie:    { name: 'Bow tie', icon: '🎀', wear: true }
};

window.Store = (function () {
  'use strict';
  var KEY = 'nickoAdvSaveV1';
  function needsDefaults() {
    return { happy: 82, hunger: 78, clean: 80, energy: 84 };
  }
  function defaults() {
    return {
      v: 2, points: 0, collectibles: [], achievements: [],
      flags: {}, roomsVisited: [], muted: false,
      needs: needsDefaults(),
      inventory: [], equipped: {},
      secrets: 0, badges: []
    };
  }
  function migrate(d) {
    if (!d || typeof d !== 'object') return defaults();
    var out = defaults();
    Object.keys(out).forEach(function (k) {
      if (d[k] !== undefined) out[k] = d[k];
    });
    out.v = 2;
    if (!out.needs || typeof out.needs.hunger !== 'number') out.needs = needsDefaults();
    if (!Array.isArray(out.inventory)) out.inventory = [];
    if (!out.equipped || typeof out.equipped !== 'object') out.equipped = {};
    return out;
  }
  var data = defaults();
  try {
    var raw = window.localStorage.getItem(KEY);
    if (raw) data = migrate(JSON.parse(raw));
  } catch (e) { /* storage unavailable, play session-only */ }
  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }
  return {
    data: data,
    save: save,
    reset: function () { data = defaults(); save(); }
  };
})();
