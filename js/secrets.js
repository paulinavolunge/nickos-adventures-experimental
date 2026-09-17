/* Nicko's Adventures - secrets: hidden discoveries that reward curiosity.
   Multi-tap counters, state sequences, light/dark reveals and odd combos.
   Secrets are celebrated big; everything else stays quiet. */
window.Secrets = (function () {
  'use strict';
  var taps = {};

  function count(key, n, cb) {
    taps[key] = (taps[key] || 0) + 1;
    if (taps[key] >= n) {
      taps[key] = 0;
      if (cb) cb();
      return true;
    }
    return false;
  }
  function tapCount(key) { return taps[key] || 0; }
  function reset(key) { taps[key] = 0; }

  /* A secret was found: count it, maybe award the secret-seeker achievement. */
  function found(key) {
    var G = window.G;
    if (!G) return;
    if (G.once('secret_' + key)) {
      var n = (window.Store.data.secrets || 0) + 1;
      window.Store.data.secrets = n;
      window.Store.save();
      window.AudioSys.play('fanfare');
      if (n >= 3) G.achieve('secret-seeker');
      return true;
    }
    return false;
  }

  return { count: count, tapCount: tapCount, reset: reset, found: found };
})();
