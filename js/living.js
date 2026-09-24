/* Nicko's Adventures - living world layer: hide the learning inside the play.
   A thin layer over the existing systems (Needs, Nicko, combos, room helpers).
   It adds no new rooms, currencies, quests, or objectives. It only connects
   what is already there into believable cause and effect:

   - Bath: dirty -> wet -> soapy -> clean and dry, with a visible wet state.
   - Food: repeated favorites get playful personality, not bigger rewards.
   - Bedtime: pajamas + blanket + lamp-off combine into real coziness.
   - Nature: rain grows flowers; watering grown flowers invites a butterfly.
   - Nicko sometimes starts a small moment on his own when the child is idle.

   Needs never punish: they floor at 12 and only ever create invitations. */
(function () {
'use strict';

var GOLD_BUTTERFLY = '<svg viewBox="0 0 100 90"><defs><radialGradient id="lg-bflyg2" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#FFE066"/><stop offset="1" stop-color="#F2B73C"/></radialGradient></defs><g class="wings"><ellipse cx="32" cy="40" rx="22" ry="28" fill="url(#lg-bflyg2)" transform="rotate(-24 32 40)"/><ellipse cx="68" cy="40" rx="22" ry="28" fill="url(#lg-bflyg2)" transform="rotate(24 68 40)"/><circle cx="32" cy="40" r="7" fill="#C9920E"/><circle cx="68" cy="40" r="7" fill="#C9920E"/><circle cx="32" cy="40" r="2.5" fill="#fff"/><circle cx="68" cy="40" r="2.5" fill="#fff"/></g><rect x="46" y="26" width="8" height="40" rx="4" fill="#8A6B1F"/><circle cx="50" cy="24" r="7" fill="#8A6B1F"/><path d="M47 18 q-6 -8 -12 -9 M53 18 q6 -8 12 -9" stroke="#8A6B1F" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>';

/* ---------- wet state (chain B) ----------
   Persisted as a flag so a mid-bath room change or reload keeps Nicko wet.
   Toweling is the only thing that dries him. */
function setWet(on) {
  window.G.setFlag('wetPaws', !!on);
  Nicko.mood('wet', !!on);
}
function isWet() { return !!window.G.flag('wetPaws'); }

/* Reapply believable visuals after a room change or a reload. */
function restoreNicko() {
  Nicko.mood('dirty', Needs.get('clean') < 60);
  Nicko.mood('wet', isWet());
}

/* Called when soap scrubs under running water: Nicko is now wet. */
function soapScrubbed() { setWet(true); }

/* Called when the towel finishes its job: dry, clean, no longer soapy. */
function towelDried() {
  setWet(false);
  window.G.setFlag('soaped', false);
}

/* ---------- food personality (chain A) ----------
   Same food twice in a row: a happy "again!" thought. Three or more:
   Nicko hams it up. Hunger still fills; the joke is the reward. */
var _feed = Needs.feed, lastFood = null, streak = 0;
Needs.feed = async function (foodId) {
  if (foodId === lastFood) streak++; else { lastFood = foodId; streak = 1; }
  var t = await _feed.call(Needs, foodId);
  if (t.hunger > 0 && streak === 2) {
    Nicko.think('😋');
  } else if (t.hunger > 0 && streak >= 3) {
    await Nicko.react('tongue', 1200);
    window.G.sfx('giggle');
  }
  return t;
};

/* ---------- nature cause and effect (chain D) ---------- */

/* Rain is water too: a cloud shower on thirsty flowers grows them. */
function rainGrows() {
  var G = window.G;
  if (G.flag('flowersGrown')) return;
  G.setFlag('flowersGrown', true);
  var el = G.el('flowers');
  if (el) el.classList.add('grown');
  G.yardDiscover('flowers');
  Nicko.think('🌧️');
}

/* Watering already-grown flowers: Nicko notices a visitor coming first,
   then a golden butterfly drifts by and he tries (and fails) to catch it.
   The chase is the fun; he never catches it. */
var _waterFlowers = window.G.waterFlowers, lastBfVisit = 0;
window.G.waterFlowers = async function () {
  var G = window.G;
  var wasGrown = G.flag('flowersGrown');
  await _waterFlowers.apply(G, arguments);
  if (wasGrown && G.roomName() === 'backyard' && Date.now() - lastBfVisit > 90000) {
    lastBfVisit = Date.now();
    butterflyVisit();
  }
};

async function butterflyVisit() {
  var G = window.G;
  try {
    await Nicko.walkTo(34);
    Nicko.think('🦋');
    await G.wait(900);
    var el = G.spawn({ id: '__bfly', x: -10, y: 30, w: 9, label: '', svg: GOLD_BUTTERFLY, onTap: async function () {} });
    if (el) el.style.pointerEvents = 'none';
    G.sfx('magic');
    G.sendTo('__bfly', 60, 26, 3500).then(function () { G.despawn('__bfly'); });
    await Nicko.react('wow');
    await Nicko.action('pounce');
    G.sfx('giggle');
    await Nicko.react('happy', 900);
  } catch (e) {}
}

/* ---------- micro-secret: playing in the stream ----------
   Toggling the faucet a bunch makes Nicko pounce at the stream. */
var toggles = [];
function sinkToggled() {
  var now = Date.now();
  toggles = toggles.filter(function (t) { return now - t < 60000; });
  toggles.push(now);
  if (toggles.length >= 5) {
    toggles = [];
    streamPlay();
  }
}

async function streamPlay() {
  var G = window.G;
  try {
    G.splashAt(20, 68);
    G.sfx('splash');
    await Nicko.walkTo(20);
    await Nicko.action('pounce');
    G.sfx('giggle');
    await Nicko.react('happy');
    Secrets.found('streamPlay');
    G.toast('Nicko loves the splishy stream!', '💦');
  } catch (e) {}
}

/* ---------- micro-secret: the coziest night ----------
   Pajamas on, blanket on the bed, lamp off: tapping the stars makes
   Nicko drift into a dream. The coziest combination in the house. */
async function starsDream() {
  var G = window.G;
  if (!G.flag('pajamasOn') || !G.flag('blanketOnBed') || G.flag('lampOn') !== false) return false;
  try {
    G.sparkleAt(50, 24, 14);
    G.floatText(50, 40, '💤');
    await Nicko.react('sleepy', 2200);
    Secrets.found('starlightDream');
  } catch (e) {}
  return true;
}

/* ---------- Nicko starts something (Part 1) ----------
   When the child has been idle a while, Nicko creates a small situation
   on his own: a toy boop, sudden zoomies, a curious sniff, or a sleepy
   yawn when his energy is low. Never during an interaction, a modal, a
   drag, or a hidden tab. Never urgent, never a demand. */
var lastActive = Date.now(), lastAuto = 0;
document.addEventListener('pointerdown', function () { lastActive = Date.now(); }, true);
document.addEventListener('keydown', function () { lastActive = Date.now(); }, true);

setInterval(function () {
  var G = window.G;
  if (!G || document.hidden || G.isLocked()) return;
  var mw = document.getElementById('modal-wrap');
  if (mw && !mw.classList.contains('hidden')) return;
  if (window.Drag && Drag.isActive()) return;
  if (Date.now() - lastActive < 25000) return;
  if (Date.now() - lastAuto < 75000) return;
  lastAuto = Date.now();
  autonomousMoment();
}, 8000);

async function autonomousMoment() {
  var G = window.G;
  try {
    var roll = Math.random();
    if (roll < 0.35 && G.el('ball')) {
      /* boop the ball on his own */
      await Nicko.walkTo(50);
      G.sfx('boing');
      await Nicko.action('pounce');
      await Nicko.react('happy', 900);
    } else if (roll < 0.6) {
      /* zoomies: a sudden happy dash across the room */
      var to = Nicko.pos() < 50 ? 78 : 22;
      Nicko.face(to > Nicko.pos() ? 'right' : 'left');
      await Nicko.walkTo(to);
      await Nicko.react('happy', 900);
    } else if (Needs.get('energy') < 35) {
      /* tired shows in his body, not in a warning */
      G.sfx('yawn');
      Nicko.think('😴');
      await Nicko.react('sleepy', 1500);
    } else {
      Nicko.think('❓');
      await Nicko.react('wow', 1000);
    }
  } catch (e) {}
}

window.Living = {
  setWet: setWet, isWet: isWet, restoreNicko: restoreNicko,
  soapScrubbed: soapScrubbed, towelDried: towelDried,
  rainGrows: rainGrows, sinkToggled: sinkToggled,
  starsDream: starsDream
};

})();
