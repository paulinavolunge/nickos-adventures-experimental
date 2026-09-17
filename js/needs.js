/* Nicko's Adventures - care system: gentle persistent needs that create play.
   Four needs, never stressful: they floor at 12 and only nudge the child
   toward fun with visual thought bubbles, never scolding text. */
window.Needs = (function () {
  'use strict';

  var META = {
    happy:  { icon: '❤️', label: 'Happiness' },
    hunger: { icon: '🍎', label: 'Fullness' },
    clean:  { icon: '✨', label: 'Cleanliness' },
    energy: { icon: '⚡', label: 'Energy' }
  };
  var ORDER = ['happy', 'hunger', 'clean', 'energy'];
  var FLOOR = 12;
  var lastNag = { hunger: 0, clean: 0, energy: 0, happy: 0 };

  function data() { return window.Store.data.needs; }
  function clamp(v) { return Math.max(FLOOR, Math.min(100, Math.round(v))); }

  function change(key, delta, silent) {
    var d = data();
    d[key] = clamp(d[key] + delta);
    window.Store.save();
    if (!silent && window.G && window.G.renderNeeds) window.G.renderNeeds();
    return d[key];
  }
  function get(key) { return data()[key]; }

  /* Feeding: foodId looks up Nicko's personality table for his honest reaction. */
  async function feed(foodId) {
    var t = Nicko.TASTES[foodId] || { react: 'confused', hunger: 0, happy: 0, funny: true };
    if (t.hunger > 0) {
      change('hunger', t.hunger, true);
      change('happy', t.happy || 6, true);
      if (window.G && window.G.renderNeeds) window.G.renderNeeds();
      window.AudioSys.play('munch');
      await Nicko.react(t.react, 1500);
      Nicko.clearThought();
    } else {
      /* Funny refusal: he does not want it. No need change, just comedy. */
      await Nicko.taste(foodId);
      if (t.happy) change('happy', t.happy, true);
    }
    return t;
  }

  function wash(amount) {
    change('clean', amount || 30);
    change('happy', 8);
    Nicko.mood('dirty', false);
    Nicko.clearThought();
  }
  function play(amount) {
    change('happy', amount || 14);
    change('energy', -8);
    change('hunger', -4);
  }
  function rest(amount) {
    change('energy', amount || 45);
    change('happy', 8);
    Nicko.clearThought();
  }

  /* Gentle decay, called on an interval from the game loop. */
  function tick() {
    var d = data();
    d.hunger = clamp(d.hunger - 2);
    d.energy = clamp(d.energy - 1);
    d.happy = clamp(d.happy - 1);
    d.clean = clamp(d.clean - 1);
    window.Store.save();
    if (window.G && window.G.renderNeeds) window.G.renderNeeds();
    nag();
  }

  /* Visual nudges only: thought bubbles, occasional yawns. No nagging text. */
  function nag() {
    if (!window.G || window.G.isLocked()) return;
    var now = Date.now();
    var d = data();
    function cooled(k) { return now - (lastNag[k] || 0) > 55000; }
    if (d.hunger < 34 && cooled('hunger')) {
      lastNag.hunger = now;
      window.AudioSys.play('tummy');
      Nicko.think('🍎');
      Nicko.emote('sad', 1400);
    } else if (d.clean < 32 && cooled('clean')) {
      lastNag.clean = now;
      Nicko.mood('dirty', true);
      Nicko.think('🛁');
    } else if (d.energy < 30 && cooled('energy')) {
      lastNag.energy = now;
      window.AudioSys.play('yawn');
      Nicko.think('😴');
      Nicko.react('sleepy', 1800);
    } else if (d.happy < 30 && cooled('happy')) {
      lastNag.happy = now;
      Nicko.think('🎾');
      Nicko.emote('sad', 1400);
    }
  }

  return {
    META: META, ORDER: ORDER,
    get: get, change: change,
    feed: feed, wash: wash, play: play, rest: rest,
    tick: tick, nag: nag
  };
})();
