/* Nicko's Adventures - synthesized audio (WebAudio, no assets needed) */
window.AudioSys = (function () {
  'use strict';
  var ctx = null, muted = false;

  function ensure() {
    if (ctx) {
      if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
      return ctx;
    }
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch (e) { return null; }
    if (ctx && ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    return ctx;
  }

  function tone(o) {
    var c = ensure(); if (!c) return;
    var t0 = c.currentTime + (o.delay || 0);
    var osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f, t0);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.f2), t0 + o.dur);
    var v = o.vol || 0.18;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
    osc.connect(g); g.connect(c.destination);
    osc.start(t0); osc.stop(t0 + o.dur + 0.05);
  }

  var _noiseBuf = null;
  function noiseBuf() {
    var c = ensure();
    if (!_noiseBuf) {
      _noiseBuf = c.createBuffer(1, c.sampleRate * 1.2, c.sampleRate);
      var d = _noiseBuf.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return _noiseBuf;
  }

  function noise(o) {
    var c = ensure(); if (!c) return;
    var t0 = c.currentTime + (o.delay || 0);
    var src = c.createBufferSource(); src.buffer = noiseBuf(); src.loop = true;
    var f = c.createBiquadFilter(); f.type = o.type || 'lowpass';
    f.frequency.setValueAtTime(o.filter || 1200, t0);
    if (o.slideTo) f.frequency.exponentialRampToValueAtTime(Math.max(40, o.slideTo), t0 + o.dur);
    var g = c.createGain(); var v = o.vol || 0.15;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
    src.connect(f); f.connect(g); g.connect(c.destination);
    src.start(t0); src.stop(t0 + o.dur + 0.05);
  }

  var SFX = {
    click: function () { tone({ f: 700, f2: 500, dur: 0.07, type: 'triangle', vol: 0.12 }); },
    pop: function () { tone({ f: 420, f2: 880, dur: 0.09, type: 'square', vol: 0.1 }); },
    meow: function () {
      tone({ f: 620, f2: 950, dur: 0.16, type: 'sawtooth', vol: 0.1 });
      tone({ f: 950, f2: 480, dur: 0.22, type: 'sawtooth', vol: 0.1, delay: 0.15 });
    },
    happyMeow: function () {
      tone({ f: 700, f2: 1100, dur: 0.12, type: 'sawtooth', vol: 0.09 });
      tone({ f: 900, f2: 1300, dur: 0.12, type: 'sawtooth', vol: 0.09, delay: 0.11 });
      tone({ f: 1100, f2: 1500, dur: 0.16, type: 'sawtooth', vol: 0.09, delay: 0.22 });
    },
    purr: function () {
      var c = ensure(); if (!c) return;
      var t0 = c.currentTime;
      var src = c.createBufferSource(); src.buffer = noiseBuf(); src.loop = true;
      var f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 220;
      var g = c.createGain(); g.gain.value = 0;
      var lfo = c.createOscillator(); lfo.frequency.value = 22;
      var lg = c.createGain(); lg.gain.value = 0.09;
      lfo.connect(lg); lg.connect(g.gain);
      g.gain.setValueAtTime(0.09, t0);
      g.gain.linearRampToValueAtTime(0.0001, t0 + 1.4);
      src.connect(f); f.connect(g); g.connect(c.destination);
      src.start(t0); lfo.start(t0); src.stop(t0 + 1.5); lfo.stop(t0 + 1.5);
    },
    chime: function () {
      tone({ f: 880, dur: 0.25, vol: 0.14 });
      tone({ f: 1174, dur: 0.3, vol: 0.14, delay: 0.09 });
    },
    fanfare: function () {
      var n = [523, 659, 784, 1046];
      n.forEach(function (f, i) { tone({ f: f, dur: 0.28, vol: 0.14, delay: i * 0.11, type: 'triangle' }); });
    },
    sparkle: function () {
      [1568, 2093, 2637].forEach(function (f, i) { tone({ f: f, dur: 0.16, vol: 0.08, delay: i * 0.06 }); });
    },
    discover: function () {
      tone({ f: 523, dur: 0.14, type: 'triangle', vol: 0.13 });
      tone({ f: 784, dur: 0.2, type: 'triangle', vol: 0.13, delay: 0.1 });
      tone({ f: 1046, dur: 0.3, type: 'triangle', vol: 0.13, delay: 0.2 });
    },
    splash: function () { noise({ dur: 0.5, vol: 0.2, filter: 2600, slideTo: 500 }); },
    bubbles: function () {
      [300, 420, 520, 660, 780].forEach(function (f, i) {
        tone({ f: f, f2: f * 1.6, dur: 0.09, vol: 0.1, delay: i * 0.07 });
      });
    },
    water: function () { noise({ dur: 0.9, vol: 0.12, filter: 1800, type: 'bandpass' }); },
    pour: function () { noise({ dur: 0.7, vol: 0.14, filter: 1200, slideTo: 2400 }); },
    thud: function () { tone({ f: 110, f2: 55, dur: 0.22, vol: 0.2 }); },
    crash: function () {
      noise({ dur: 0.4, vol: 0.2, filter: 3200, type: 'highpass' });
      tone({ f: 180, f2: 70, dur: 0.3, vol: 0.16 });
    },
    sizzle: function () { noise({ dur: 1.0, vol: 0.16, filter: 5200, type: 'highpass' }); },
    flush: function () { noise({ dur: 1.1, vol: 0.18, filter: 900, slideTo: 220 }); },
    chirp: function () {
      tone({ f: 2400, f2: 3200, dur: 0.09, vol: 0.08 });
      tone({ f: 2800, f2: 2100, dur: 0.09, vol: 0.08, delay: 0.1 });
      tone({ f: 2500, f2: 3300, dur: 0.12, vol: 0.08, delay: 0.2 });
    },
    ring: function () {
      for (var i = 0; i < 4; i++) tone({ f: 1250, dur: 0.09, type: 'square', vol: 0.07, delay: i * 0.16 });
    },
    boing: function () {
      tone({ f: 180, f2: 720, dur: 0.28, type: 'sine', vol: 0.16 });
      tone({ f: 720, f2: 240, dur: 0.2, type: 'sine', vol: 0.1, delay: 0.26 });
    },
    squeak: function () { tone({ f: 1500, f2: 2200, dur: 0.08, vol: 0.1 }); tone({ f: 2200, f2: 1500, dur: 0.08, vol: 0.1, delay: 0.09 }); },
    knock: function () { tone({ f: 220, f2: 140, dur: 0.1, vol: 0.18 }); tone({ f: 220, f2: 140, dur: 0.1, vol: 0.18, delay: 0.14 }); },
    giggle: function () {
      [700, 850, 780, 950].forEach(function (f, i) { tone({ f: f, dur: 0.08, type: 'triangle', vol: 0.1, delay: i * 0.08 }); });
    },
    snore: function () {
      tone({ f: 140, f2: 90, dur: 0.5, type: 'sawtooth', vol: 0.07 });
      tone({ f: 180, f2: 120, dur: 0.4, type: 'sawtooth', vol: 0.06, delay: 0.6 });
    },
    whoosh: function () { noise({ dur: 0.35, vol: 0.12, filter: 900, slideTo: 3000, type: 'bandpass' }); },
    slide: function () { tone({ f: 900, f2: 200, dur: 0.5, type: 'sine', vol: 0.1 }); },
    drum: function (p) {
      var f = [196, 220, 247, 262, 294][p % 5];
      tone({ f: 120, f2: 60, dur: 0.18, vol: 0.2 });
      tone({ f: f, dur: 0.25, type: 'triangle', vol: 0.12, delay: 0.02 });
    },
    owl: function () { tone({ f: 350, f2: 280, dur: 0.25, vol: 0.1 }); tone({ f: 300, f2: 240, dur: 0.35, vol: 0.1, delay: 0.3 }); },
    rain: function () { noise({ dur: 1.6, vol: 0.1, filter: 4000, type: 'highpass' }); },
    magic: function () {
      [880, 1108, 1318, 1760].forEach(function (f, i) { tone({ f: f, dur: 0.22, vol: 0.09, delay: i * 0.08 }); });
    }
  };

  return {
    ensure: ensure,
    play: function (name, arg) {
      if (muted) return;
      try { ensure(); if (SFX[name]) SFX[name](arg); } catch (e) { /* audio unavailable */ }
    },
    setMuted: function (m) { muted = !!m; },
    isMuted: function () { return muted; }
  };
})();
