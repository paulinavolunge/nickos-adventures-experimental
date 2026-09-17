/* Nicko's Adventures - save state, achievements, collectibles */
window.ACHIEVEMENTS = [
  { id: 'curious-kitten', name: 'Curious Kitten', icon: '🐾', desc: 'Made your very first discovery' },
  { id: 'house-explorer', name: 'House Explorer', icon: '🗺️', desc: 'Visited all six rooms of the house' },
  { id: 'clean-paws', name: 'Bathroom Helper', icon: '🧼', desc: 'Washed, rinsed and dried those dirty paws' },
  { id: 'kitchen-explorer', name: 'Kitchen Explorer', icon: '🍳', desc: 'Learned the stove is hot and fed Nicko' },
  { id: 'toy-master', name: 'Toy Master', icon: '🧸', desc: 'Tidied every toy in the playroom' },
  { id: 'backyard-detective', name: 'Backyard Detective', icon: '🔍', desc: 'Made three backyard discoveries' },
  { id: 'bedtime-star', name: 'Bedtime Star', icon: '🌙', desc: 'Finished the whole bedtime routine' },
  { id: 'paw-champion', name: 'Paw Champion', icon: '🏆', desc: 'Earned 150 Paw Points' }
];

window.COLLECTIBLES = [
  { id: 'print-bedroom', name: 'Bedroom Print', hint: 'Something hides under the bed...' },
  { id: 'print-living', name: 'Living Room Print', hint: 'Swish the curtains to peek behind them' },
  { id: 'print-backyard', name: 'Backyard Print', hint: 'Dig in the sandbox' },
  { id: 'print-playroom', name: 'Playroom Print', hint: 'Tidy ALL the toys to find it' },
  { id: 'print-kitchen', name: 'Kitchen Print', hint: 'Rattle the cabinet twice' },
  { id: 'print-bathroom', name: 'Bathroom Print', hint: 'Look high on the shelf' },
  { id: 'print-blocks', name: 'Builder Print', hint: 'Stack blocks super tall, then topple the tower' },
  { id: 'print-butterfly', name: 'Golden Print', hint: 'A rare golden butterfly carries one...' }
];

window.Store = (function () {
  'use strict';
  var KEY = 'nickoAdvSaveV1';
  function defaults() {
    return { v: 1, points: 0, collectibles: [], achievements: [], flags: {}, roomsVisited: [], muted: false };
  }
  var data = defaults();
  try {
    var raw = window.localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.v === 1) data = Object.assign(defaults(), parsed);
    }
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
