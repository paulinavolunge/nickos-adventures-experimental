/* Nicko's Adventures - object combinations. Every "what happens if..."
   lives here as a named pair, so rooms stay declarative and the rules are
   consistent everywhere. */
(function () {
'use strict';

/* Feed Nicko a food. inBowl just changes where he eats. Foods respawn. */
async function feedFood(G, foodId, inBowl) {
  await Nicko.walkTo(inBowl ? 62 : Math.max(10, Math.min(90, Nicko.pos())));
  var t = await Needs.feed(foodId);
  if (t.hunger > 0) {
    G.sparkleAt(Nicko.pos(), 62, 8);
    G.points(5);
    if (t.note === 'favorite') {
      /* favorite food: full-body happy wiggle plus hearts */
      if (window.FX) FX.hearts(Nicko.pos(), 58, 7);
      await Nicko.action('wiggle');
      await Nicko.react('veryHappy', 1400);
      G.sfx('purr');
    } else {
      await Nicko.react('yum', 1100);
    }
    if (t.note === 'favorite' && G.once('favFood')) {
      G.achieve('combo-cook');
      G.points(15);
    }
    G.setFlag('fed', true);
    if (window.G.checkKitchen) window.G.checkKitchen();
  }
  /* respawn the food after a while so the game never runs dry */
  var def = G.def(foodId);
  if (def && (t.hunger > 0)) {
    G.despawn(foodId);
    setTimeout(function () {
      try { if (!G.el(foodId) && window.G) G.spawn(def); } catch (e) {}
    }, 50000);
  }
  return 'consume';
}

function playChase(G) {
  return (async function () {
    await Nicko.react('excited', 900);
    Nicko.think('⚽');
    await Nicko.action('pounce');
    G.sfx('boing');
    await Nicko.action('wiggle');
    await Nicko.react('happy');
    Needs.play(14);
    if (G.once('chasePlay')) G.points(5);
    return true;
  })();
}

/* ---------- food -> Nicko / bowl ---------- */
['fish', 'apple', 'milk'].forEach(function (f) {
  Combos.register(f, '__nicko', function (G) { return feedFood(G, f, false); });
  Combos.register(f, 'bowl', function (G) { return feedFood(G, f, true); });
});
Combos.register('lemon', '__nicko', async function (G) {
  /* sour lemon comedy: sniff first, then the big sour face */
  await Nicko.react('suspicious', 1100);
  await Nicko.taste('lemon');
  await Nicko.action('shakeoff');
  G.sfx('giggle');
  await Nicko.react('silly', 1300);
  Nicko.think('🍋');
  if (G.once('lemonFun')) G.points(5);
  return true;
});
Combos.register('lemon', 'bowl', async function (G) {
  await Nicko.walkTo(66);
  await Nicko.react('suspicious', 1100);
  await Nicko.react('confused');
  Nicko.think('🍋');
  G.sfx('giggle');
  return true;
});
['broccoli'].forEach(function (f) {
  Combos.register(f, '__nicko', async function (G) {
    /* suspicious broccoli tasting: inspect, tiny nibble, verdict */
    await Nicko.react('suspicious', 1200);
    await Nicko.taste('broccoli');
    G.sfx('giggle');
    await Nicko.react('silly', 1100);
    Nicko.think('🥦');
    if (G.once('broccoliFun')) G.points(5);
    return true;
  });
  Combos.register(f, 'bowl', async function (G) {
    await Nicko.walkTo(66);
    await Nicko.react('tongue');
    G.sfx('giggle');
    return true;
  });
});

/* ---------- toys -> Nicko ---------- */
Combos.register('ball', '__nicko', playChase);
Combos.register('yball', '__nicko', playChase);
Combos.register('toyMouse', '__nicko', async function (G) {
  G.sfx('squeak');
  Nicko.think('🐭');
  await Nicko.react('hunt', 1400);
  await Nicko.action('pounce');
  G.sparkleAt(Nicko.pos(), 60, 6);
  await Nicko.react('proud', 1300);
  Needs.play(14);
  if (G.once('huntPlay')) G.points(10);
  return true;
});

/* ---------- bathroom chain ---------- */
Combos.register('soap', 'sink', async function (G) {
  if (!G.flag('waterOn')) {
    await Nicko.react('confused');
    Nicko.think('🚰');
    G.setGlow('sink', true);
    return true;
  }
  await G.soapTap();
  return true;
});
Combos.register('towel', '__nicko', async function (G) {
  await G.towelTap();
  return true;
});

/* ---------- bedroom comfort ---------- */
Combos.register('blanket', 'bed', async function (G) {
  G.sfx('pop'); G.sparkleAt(78, 60, 8);
  await Nicko.walkTo(74);
  await Nicko.react('sleepy', 1600);
  await Nicko.action('curl');
  if (window.FX) FX.zs(74, 52, 3);
  G.sfx('yawn');
  Needs.rest(20);
  if (G.once('cozyBed')) G.points(10);
  return 'consume';
});
Combos.register('book', 'bed', async function (G) {
  G.sfx('magic'); G.sparkleAt(78, 58, 8);
  await Nicko.walkTo(74);
  await Nicko.react('curious', 1200);
  Nicko.think('📖');
  await Nicko.react('love');
  Needs.change('happy', 10);
  if (G.once('storyTime')) G.points(10);
  return 'stay';
});
Combos.register('pajamas', '__nicko', async function (G) {
  await G.wearPajamas();
  return 'consume';
});
Combos.register('hat', '__nicko', async function (G) {
  Inventory.toggleWear('hat');
  return 'consume';
});
Combos.register('teddy', 'underbed', async function (G) {
  G.setFlag('teddyStashed', true);
  G.sfx('giggle');
  await Nicko.react('playful', 1100);
  await Nicko.action('crouch');
  Nicko.think('🐭');
  return 'consume';
});

/* ---------- living room ---------- */
Combos.register('remote', 'tv', async function (G) {
  await G.toggleTv();
  return true;
});

/* ---------- backyard ---------- */
Combos.register('can', 'flowers', async function (G) {
  await G.waterFlowers();
  return true;
});
Combos.register('can', '__nicko', async function (G) {
  /* mischief: splashing Nicko is funny but he gets damp */
  G.sfx('splash'); G.splashAt(Nicko.pos(), 66);
  await Nicko.react('surprised', 1200);
  await Nicko.action('shakeoff');
  G.sfx('giggle');
  await Nicko.react('silly', 1100);
  Needs.change('clean', -8);
  return true;
});

/* ---------- blocks: drop any block on another to stack ---------- */
['blockA', 'blockB', 'blockC'].forEach(function (a) {
  ['blockA', 'blockB', 'blockC'].forEach(function (b) {
    if (a === b) return;
    Combos.register(a, b, async function (G) {
      await G.stackBlock(a);
      return 'stay';
    });
  });
});

/* ---------- tidying ---------- */
['ptoy1', 'ptoy2', 'ptoy3', 'ptoy4'].forEach(function (t) {
  Combos.register(t, 'ptoys', async function (G) {
    await G.tidyPlayToy(t);
    return 'stay';
  });
});
Combos.register('teddy', 'toybox', async function (G) {
  await G.tidyToy('teddy', 'toybox');
  return 'stay';
});
Combos.register('duck', 'toybox', async function (G) {
  await G.tidyToy('duck', 'toybox');
  return 'stay';
});
Combos.register('paperball', 'trash', async function (G) {
  await G.tossPaper();
  return 'consume';
});

/* expose feed for tap fallbacks (fish tap etc.) */
window.Feed = { feedFood: feedFood };

})();
