/* Nicko's Adventures - FX: particle + celebration effects.
   All particles live in the #fx layer (pointer-events:none) and animate with
   transforms/opacity only, so they stay cheap on phones. Positions are in
   stage percent coordinates, matching the rest of the game. */
window.FX = (function () {
  'use strict';
  var layer = null;

  function init() {
    layer = document.getElementById('fx');
  }

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* one particle div, removed when its animation ends */
  function puff(cls, x, y, vars, life) {
    if (!layer) return;
    var d = document.createElement('div');
    d.className = 'fxp ' + cls;
    d.style.left = x + '%';
    d.style.top = y + '%';
    for (var k in vars) d.style.setProperty(k, vars[k]);
    layer.appendChild(d);
    setTimeout(function () { d.remove(); }, life || 1200);
    return d;
  }

  /* golden star sparkles */
  function sparkles(x, y, n) {
    n = n || 10;
    var shapes = ['✦', '✧', '⭐', '✨'];
    for (var i = 0; i < n; i++) {
      puff('fx-sparkle', x + rnd(-4, 4), y + rnd(-3, 3), {
        '--dx': rnd(-70, 70) + 'px',
        '--dy': rnd(-100, -25) + 'px',
        '--s': rnd(0.7, 1.4),
        '--d': rnd(0, 0.25) + 's',
        'font-size': rnd(14, 26) + 'px'
      }, 1300).textContent = pick(shapes);
    }
  }

  /* soap bubbles: translucent circles that wobble upward */
  function bubbles(x, y, n) {
    n = n || 8;
    for (var i = 0; i < n; i++) {
      var s = rnd(10, 30);
      puff('fx-bubble', x + rnd(-5, 5), y + rnd(-2, 4), {
        '--dx': rnd(-40, 40) + 'px',
        '--dy': rnd(-130, -60) + 'px',
        '--s': s + 'px',
        '--d': rnd(0, 0.4) + 's'
      }, 1900);
    }
  }

  /* pink hearts */
  function hearts(x, y, n) {
    n = n || 6;
    for (var i = 0; i < n; i++) {
      puff('fx-heart', x + rnd(-4, 4), y + rnd(-2, 3), {
        '--dx': rnd(-55, 55) + 'px',
        '--dy': rnd(-90, -30) + 'px',
        '--d': rnd(0, 0.3) + 's',
        'font-size': rnd(15, 26) + 'px'
      }, 1400).textContent = pick(['💗', '💕', '❤️']);
    }
  }

  /* soft grey puffs: dirt, sneezes, poofs */
  function puffs(x, y, n, tint) {
    n = n || 6;
    for (var i = 0; i < n; i++) {
      var s = rnd(14, 30);
      puff('fx-puff', x + rnd(-4, 4), y + rnd(-2, 3), {
        '--dx': rnd(-60, 60) + 'px',
        '--dy': rnd(-70, -10) + 'px',
        '--s': s + 'px',
        '--d': rnd(0, 0.3) + 's',
        '--tint': tint || 'rgba(160,150,140,0.55)'
      }, 1100);
    }
  }

  /* water droplets */
  function drops(x, y, n) {
    n = n || 8;
    for (var i = 0; i < n; i++) {
      puff('fx-drop', x + rnd(-4, 4), y + rnd(-2, 2), {
        '--dx': rnd(-70, 70) + 'px',
        '--dy': rnd(-40, 60) + 'px',
        '--d': rnd(0, 0.2) + 's',
        'font-size': rnd(12, 20) + 'px'
      }, 900).textContent = '💧';
    }
  }

  /* sleep Z's drifting up */
  function zs(x, y, n) {
    n = n || 3;
    for (var i = 0; i < n; i++) {
      setTimeout(function () {
        puff('fx-zz', x + rnd(-2, 2), y, {
          '--dx': rnd(20, 55) + 'px',
          '--dy': rnd(-70, -45) + 'px',
          '--d': '0s',
          'font-size': rnd(20, 30) + 'px'
        }, 2200).textContent = 'Z';
      }, i * 700);
    }
  }

  /* paw pips floating up when points are earned */
  function pips(x, y, n) {
    n = Math.min(n || 3, 6);
    for (var i = 0; i < n; i++) {
      setTimeout(function () {
        puff('fx-pip', x + rnd(-3, 3), y, {
          '--dx': rnd(-35, 35) + 'px',
          '--dy': rnd(-80, -50) + 'px',
          '--d': '0s',
          'font-size': rnd(16, 24) + 'px'
        }, 1200).textContent = '🐾';
      }, i * 130);
    }
  }

  /* leaf drift for the backyard */
  function leaf(x, y) {
    puff('fx-leaf', x, y, {
      '--dx': rnd(-90, -30) + 'px',
      '--dy': rnd(30, 80) + 'px',
      '--d': '0s',
      'font-size': rnd(14, 22) + 'px'
    }, 2600).textContent = pick(['🍃', '🍂']);
  }

  /* ------- Golden Paw Print reveal: the big moment ------- */
  function goldenPaw(x, y, name, countText) {
    if (!layer) return;
    /* 1. golden glow gathers */
    var glow = document.createElement('div');
    glow.className = 'fx-glow';
    glow.style.left = x + '%'; glow.style.top = y + '%';
    layer.appendChild(glow);
    if (window.AudioSys) window.AudioSys.play('magic');
    /* 2. the print pops in with a sparkle burst */
    setTimeout(function () {
      sparkles(x, y, 16);
      var print = document.createElement('div');
      print.className = 'fx-goldprint';
      print.style.left = x + '%'; print.style.top = y + '%';
      print.textContent = '🐾';
      layer.appendChild(print);
      /* 3. it floats upward, trailing sparkles */
      setTimeout(function () {
        print.classList.add('rise');
        var iv = setInterval(function () { sparkles(x + rnd(-3, 3), y - 14, 2); }, 220);
        setTimeout(function () { clearInterval(iv); }, 1400);
      }, 650);
      setTimeout(function () { print.remove(); }, 2300);
    }, 450);
    setTimeout(function () { glow.remove(); }, 2400);
    /* 4. counter does a happy pulse (the modal card follows from G.collect) */
    setTimeout(function () {
      var pill = document.getElementById('points-pill');
      if (pill) { pill.classList.remove('goldbump'); void pill.offsetWidth; pill.classList.add('goldbump'); }
    }, 700);
  }

  /* sticker-style achievement pop */
  function sticker(icon, name) {
    if (!layer) return;
    var d = document.createElement('div');
    d.className = 'fx-sticker';
    d.innerHTML = '<div class="st-ic">' + icon + '</div><div class="st-nm">' + name + '</div>';
    layer.appendChild(d);
    sparkles(50, 30, 8);
    setTimeout(function () { d.classList.add('out'); }, 2100);
    setTimeout(function () { d.remove(); }, 2700);
  }

  return {
    init: init,
    sparkles: sparkles, bubbles: bubbles, hearts: hearts,
    puffs: puffs, drops: drops, zs: zs, pips: pips, leaf: leaf,
    goldenPaw: goldenPaw, sticker: sticker
  };
})();
