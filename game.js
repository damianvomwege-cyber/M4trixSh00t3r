// ============================================================================
// M4TRIX SH00T3R - Extended Edition
// Features: Weapons, Boss Phases, Combos, Shop, Achievements, Story, Touch
// ============================================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// DOM Elements
const scoreEl = document.getElementById("score");
const comboEl = document.getElementById("combo");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");
const weaponEl = document.getElementById("weapon");
const buffsEl = document.getElementById("buffs");
const aiEl = document.getElementById("ai");
const aiLivesEl = document.getElementById("ai-lives");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlaySubtitle = document.getElementById("overlay-subtitle");
const overlayButtons = document.getElementById("overlay-buttons");
const restartBtn = document.getElementById("restart-btn");
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
const startBtn = document.getElementById("start-btn");
const multiplayerBtn = document.getElementById("multiplayer-btn");
const storyBtn = document.getElementById("story-btn");
const p2StatsEl = document.getElementById("p2-stats");
const p2LivesEl = document.getElementById("p2-lives");
const achievementsBtn = document.getElementById("achievements-btn");
const highscoreBtn = document.getElementById("highscore-btn");
const adminBtn = document.getElementById("admin-btn");
const adminPanel = document.getElementById("admin");
const adminApply = document.getElementById("admin-apply");
const adminClose = document.getElementById("admin-close");
const adminReset = document.getElementById("admin-reset");
const shopPanel = document.getElementById("shop");
const shopGrid = document.getElementById("shop-grid");
const shopCredits = document.getElementById("shop-credits");
const shopClose = document.getElementById("shop-close");
const storyPanel = document.getElementById("story");
const storyTitle = document.getElementById("story-title");
const storyText = document.getElementById("story-text");
const storySpeaker = document.getElementById("story-speaker");
const storyNext = document.getElementById("story-next");
const storySkip = document.getElementById("story-skip");
const achievementsPanel = document.getElementById("achievements");
const achievementsList = document.getElementById("achievements-list");
const achievementsClose = document.getElementById("achievements-close");
const highscoresPanel = document.getElementById("highscores");
const highscoreList = document.getElementById("highscore-list");
const highscoreClose = document.getElementById("highscore-close");
const levelComplete = document.getElementById("level-complete");
const levelStats = document.getElementById("level-stats");
const levelShop = document.getElementById("level-shop");
const levelContinue = document.getElementById("level-continue");
const bossHpBar = document.getElementById("boss-hp-bar");
const bossHpFill = document.getElementById("boss-hp-fill");
const bossPhaseEl = document.getElementById("boss-phase");
const achievementPopup = document.getElementById("achievement-popup");
const achievementName = document.getElementById("achievement-name");
const achievementDesc = document.getElementById("achievement-desc");

// Online Lobby elements
const onlineBtn = document.getElementById("online-btn");
const lobbyPanel = document.getElementById("lobby");
const lobbyStatus = document.getElementById("lobby-status");
const lobbyMenu = document.getElementById("lobby-menu");
const lobbyCreate = document.getElementById("lobby-create");
const lobbyJoin = document.getElementById("lobby-join");
const lobbyBack = document.getElementById("lobby-back");
const lobbyHost = document.getElementById("lobby-host");
const lobbyCodeEl = document.getElementById("lobby-code");
const lobbyGuest = document.getElementById("lobby-guest");
const lobbyStartGame = document.getElementById("lobby-start-game");
const lobbyCancelHost = document.getElementById("lobby-cancel-host");
const lobbyJoinForm = document.getElementById("lobby-join-form");
const lobbyCodeInput = document.getElementById("lobby-code-input");
const lobbyConnect = document.getElementById("lobby-connect");
const lobbyCancelJoin = document.getElementById("lobby-cancel-join");
const lobbyWaiting = document.getElementById("lobby-waiting");
const lobbyHostName = document.getElementById("lobby-host-name");
const lobbyLeave = document.getElementById("lobby-leave");
const connectionStatus = document.getElementById("connection-status");
const connectionText = document.getElementById("connection-text");

// Touch controls
const joystickZone = document.getElementById("joystick-zone");
const joystickBase = document.getElementById("joystick-base");
const joystickStick = document.getElementById("joystick-stick");
const touchFire = document.getElementById("touch-fire");
const touchWeapon = document.getElementById("touch-weapon");

// Joystick state
const joystick = {
  active: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  dx: 0,
  dy: 0,
  maxDistance: 40,
};

// Audio
let audioCtx = null;
let adminWasPaused = false;
const audioState = {
  enabled: true,
  lastShot: 0,
  bgmPlaying: false,
  bgmNodes: [],
  bgmTimer: null,
  bgmMaster: null,
  sfxVolume: 1,
  bgmVolume: 1,
};

// ============================================================================
// ONLINE MULTIPLAYER (Socket.io)
// ============================================================================
// Server URL - Change this to your deployed server URL
const SERVER_URL = "https://m4trixsh00t3r.onrender.com"; // Will be updated after deployment

let socket = null;
const netState = {
  connected: false,
  isHost: false,
  lobbyCode: null,
  guestConnected: false,
  lastSync: 0,
  syncInterval: 50, // ms between syncs
  remotePlayer: { x: 0, y: 0, lives: 3, shooting: false },
  remoteBullets: [],
};

// ============================================================================
// WEAPONS SYSTEM
// ============================================================================
const WEAPONS = [
  { id: 1, name: "Blaster", color: "#7fffe3", speed: 520, damage: 1, cooldown: 0.18, spread: 0, unlocked: true, price: 0 },
  { id: 2, name: "Laser", color: "#ff00ff", speed: 800, damage: 2, cooldown: 0.25, spread: 0, unlocked: false, price: 500, desc: "Piercing beam" },
  { id: 3, name: "Rockets", color: "#ff6a00", speed: 350, damage: 5, cooldown: 0.5, spread: 0, unlocked: false, price: 1000, desc: "Explosive damage" },
  { id: 4, name: "Homing", color: "#b000ff", speed: 400, damage: 3, cooldown: 0.35, spread: 0, unlocked: false, price: 2000, desc: "Seeks targets" },
];

// ============================================================================
// ACHIEVEMENTS
// ============================================================================
const ACHIEVEMENTS = [
  { id: "first_kill", name: "First Blood", desc: "Destroy your first enemy", icon: "💀", unlocked: false },
  { id: "combo_10", name: "Combo Master", desc: "Reach 10x combo", icon: "🔥", unlocked: false },
  { id: "combo_25", name: "Combo Legend", desc: "Reach 25x combo", icon: "⚡", unlocked: false },
  { id: "boss_kill", name: "Boss Slayer", desc: "Defeat a boss", icon: "👑", unlocked: false },
  { id: "level_10", name: "Veteran", desc: "Reach level 10", icon: "🎖", unlocked: false },
  { id: "score_10k", name: "Point Collector", desc: "Score 10,000 points", icon: "💎", unlocked: false },
  { id: "score_50k", name: "High Roller", desc: "Score 50,000 points", icon: "🏆", unlocked: false },
  { id: "no_damage", name: "Untouchable", desc: "Complete a level without damage", icon: "🛡", unlocked: false },
  { id: "all_weapons", name: "Arsenal", desc: "Unlock all weapons", icon: "🔫", unlocked: false },
  { id: "ai_friend", name: "Teamwork", desc: "Use AI helper", icon: "🤖", unlocked: false },
];

// ============================================================================
// STORY / CUTSCENES
// ============================================================================
const STORY = [
  { chapter: 1, scenes: [
    { speaker: "SYSTEM", text: "Year 2087. The Matrix has evolved." },
    { speaker: "SYSTEM", text: "Digital entities are breaking through the firewall." },
    { speaker: "COMMANDER", text: "Agent, you're our last defense. The code is counting on you." },
    { speaker: "SYSTEM", text: "Destroy all hostile programs. Survive the storm." },
  ]},
  { chapter: 5, scenes: [
    { speaker: "???", text: "You're persistent, Agent. But can you handle a real threat?" },
    { speaker: "BOSS", text: "I am SENTINEL. The guardian of this sector." },
    { speaker: "COMMANDER", text: "Watch out! It's a Level 5 entity!" },
  ]},
  { chapter: 10, scenes: [
    { speaker: "SENTINEL", text: "You destroyed my brothers... but I have evolved." },
    { speaker: "SYSTEM", text: "WARNING: Phase 2 transformation detected." },
    { speaker: "COMMANDER", text: "It's changing form! Stay focused!" },
  ]},
];

// ============================================================================
// SHOP UPGRADES
// ============================================================================
const SHOP_ITEMS = [
  { id: "weapon_2", name: "Laser Gun", icon: "🔫", price: 500, type: "weapon", weaponId: 2 },
  { id: "weapon_3", name: "Rockets", icon: "🚀", price: 1000, type: "weapon", weaponId: 3 },
  { id: "weapon_4", name: "Homing Missiles", icon: "🎯", price: 2000, type: "weapon", weaponId: 4 },
  { id: "life_up", name: "Extra Life", icon: "❤️", price: 300, type: "consumable", effect: "life" },
  { id: "shield_up", name: "Shield Boost", icon: "🛡", price: 200, type: "consumable", effect: "shield" },
  { id: "speed_up", name: "Speed Boost", icon: "⚡", price: 150, type: "consumable", effect: "speed" },
  { id: "damage_up", name: "Damage +10%", icon: "💥", price: 800, type: "upgrade", stat: "damage", owned: false },
  { id: "fire_rate", name: "Fire Rate +15%", icon: "🔥", price: 600, type: "upgrade", stat: "firerate", owned: false },
];

// ============================================================================
// GAME STATE
// ============================================================================
const state = {
  width: 0,
  height: 0,
  lastTime: 0,
  paused: false,
  running: true,
  inMenu: true,
  inShop: false,
  inStory: false,
  multiplayer: false,
  onlineMultiplayer: false,
  score: 0,
  credits: 0,
  lives: 3,
  level: 1,
  waveTimer: 0,
  enemyTimer: 0,
  spawnInterval: 1.2,
  rapid: 0,
  rapidLevel: 0,
  shield: 0,
  speed: 0,
  spread: 0,
  aiEnabled: false,
  aiUnlockLevel: 2,
  bossActive: false,
  bossLevel: 0,
  currentBoss: null,
  currentWeapon: 1,
  combo: 0,
  comboTimer: 0,
  maxCombo: 0,
  killsThisLevel: 0,
  damageTakenThisLevel: 0,
  storyChapter: 0,
  storyScene: 0,
  damageMultiplier: 1,
  fireRateMultiplier: 1,
  keys: new Set(),
  touchKeys: new Set(),
  // Visual effects
  screenShake: 0,
  screenShakeIntensity: 0,
  slowMo: 0,
  slowMoFactor: 1,
  flash: 0,
  flashColor: "#ffffff",
};

const player = {
  x: 0,
  y: 0,
  w: 26,
  h: 26,
  speed: 280,
  baseCooldown: 0.18,
  cooldown: 0,
  color: "#00ff9a",
};

const bullets = [];
const allyBullets = [];
const enemyBullets = [];
const enemies = [];
const powerups = [];
const particles = [];
const rainColumns = [];
const lasers = [];
const rockets = [];
const homingMissiles = [];
const damageNumbers = [];
const trails = [];
const lightnings = [];

const rainGlyphs = "01アイウエオカキクケコサシスセソタチツテトネノハヒフヘホ";

const powerupChances = { life: 15, speed: 15, rapid: 40, shield: 15, spread: 15 };

const config = {
  level: 1,
  lives: 3,
  score: 0,
  credits: 0,
  spawnInterval: 1.2,
  aiUnlockLevel: 2,
  aiEnabled: false,
  aiLives: 3,
  rapidLevel: 0,
  rapidTime: 0,
  shieldTime: 0,
  speedTime: 0,
  spreadTime: 0,
};

const ally = {
  x: 0,
  y: 0,
  w: 22,
  h: 22,
  speed: 220,
  baseCooldown: 0.22,
  cooldown: 0,
  color: "#6de2ff",
  active: false,
  lives: 3,
};

// Player 2 for local multiplayer
const player2 = {
  x: 0,
  y: 0,
  w: 26,
  h: 26,
  speed: 280,
  baseCooldown: 0.18,
  cooldown: 0,
  color: "#ff6a6a",
  active: false,
  lives: 3,
  invincibleTimer: 0, // Invincibility frames after taking damage
};

const p2Bullets = [];
const p2Keys = new Set();

let highscores = JSON.parse(localStorage.getItem("m4trix_highscores") || "[]");
let unlockedAchievements = JSON.parse(localStorage.getItem("m4trix_achievements") || "[]");
let ownedUpgrades = JSON.parse(localStorage.getItem("m4trix_upgrades") || "[]");

// Load achievements
ACHIEVEMENTS.forEach(a => { a.unlocked = unlockedAchievements.includes(a.id); });
WEAPONS.forEach(w => { if (ownedUpgrades.includes(`weapon_${w.id}`)) w.unlocked = true; });

// ============================================================================
// RESIZE & INIT
// ============================================================================
function resize() {
  const { innerWidth, innerHeight } = window;
  canvas.width = innerWidth * window.devicePixelRatio;
  canvas.height = innerHeight * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  state.width = innerWidth;
  state.height = innerHeight;
  player.x = state.width / 2 - player.w / 2;
  player.y = state.height - player.h - 60;
  initRain();
}

function initRain() {
  rainColumns.length = 0;
  const fontSize = 18;
  const columns = Math.floor(state.width / fontSize);
  for (let i = 0; i < columns; i++) {
    rainColumns.push({
      x: i * fontSize,
      y: Math.random() * state.height,
      speed: 50 + Math.random() * 120,
      fontSize,
      opacity: 0.2 + Math.random() * 0.5,
    });
  }
}

// ============================================================================
// HUD UPDATE
// ============================================================================
function updateHud() {
  scoreEl.textContent = `Score: ${state.score}`;
  comboEl.textContent = state.combo > 1 ? `Combo: x${state.combo}` : "Combo: x1";
  livesEl.textContent = `Lives: ${state.lives}`;
  levelEl.textContent = `Level: ${state.level}`;
  
  const weapon = WEAPONS.find(w => w.id === state.currentWeapon);
  weaponEl.textContent = `Weapon: ${weapon ? weapon.name : "Blaster"}`;
  
  const active = [];
  if (state.rapid > 0) active.push(`Rapid x${state.rapidLevel} (${Math.ceil(state.rapid)}s)`);
  if (state.shield > 0) active.push(`Shield (${Math.ceil(state.shield)}s)`);
  if (state.speed > 0) active.push(`Speed (${Math.ceil(state.speed)}s)`);
  if (state.spread > 0) active.push(`Spread (${Math.ceil(state.spread)}s)`);
  buffsEl.textContent = `Powerups: ${active.length ? active.join(" + ") : "-"}`;
  
  if (state.level < state.aiUnlockLevel) {
    aiEl.textContent = "AI: Locked";
  } else {
    aiEl.textContent = `AI: ${state.aiEnabled ? "On" : "Off"}`;
  }
  aiLivesEl.textContent = `AI Lives: ${ally.active ? ally.lives : "-"}`;
  
  // Boss HP bar
  if (state.bossActive && state.currentBoss) {
    bossHpBar.classList.remove("hidden");
    const pct = (state.currentBoss.hp / state.currentBoss.maxHp) * 100;
    bossHpFill.style.width = `${pct}%`;
    bossPhaseEl.textContent = `Phase ${state.currentBoss.phase}`;
  } else {
    bossHpBar.classList.add("hidden");
  }
  
  // Player 2 HUD
  if (state.multiplayer && p2LivesEl) {
    p2LivesEl.textContent = `P2 Lives: ${player2.active ? player2.lives : "0"}`;
  }
}

// ============================================================================
// COMBO SYSTEM
// ============================================================================
function addCombo() {
  state.combo++;
  state.comboTimer = 2;
  if (state.combo > state.maxCombo) state.maxCombo = state.combo;
  checkAchievement("combo_10", state.combo >= 10);
  checkAchievement("combo_25", state.combo >= 25);
}

function updateCombo(delta) {
  if (state.combo > 0) {
    state.comboTimer -= delta;
    if (state.comboTimer <= 0) {
      state.combo = 0;
    }
  }
}

function getScoreMultiplier() {
  return 1 + Math.floor(state.combo / 5) * 0.5;
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================
function checkAchievement(id, condition) {
  if (!condition) return;
  const achievement = ACHIEVEMENTS.find(a => a.id === id);
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    unlockedAchievements.push(id);
    localStorage.setItem("m4trix_achievements", JSON.stringify(unlockedAchievements));
    showAchievementPopup(achievement);
  }
}

function showAchievementPopup(achievement) {
  achievementName.textContent = achievement.name;
  achievementDesc.textContent = achievement.desc;
  achievementPopup.classList.remove("hidden");
  setTimeout(() => achievementPopup.classList.add("hidden"), 4000);
}

function renderAchievements() {
  achievementsList.innerHTML = ACHIEVEMENTS.map(a => `
    <div class="achievement-item ${a.unlocked ? 'unlocked' : ''}">
      <div class="icon">${a.icon}</div>
      <div class="info">
        <div class="name">${a.name}</div>
        <div class="desc">${a.desc}</div>
      </div>
    </div>
  `).join("");
}

// ============================================================================
// HIGHSCORES
// ============================================================================
function saveHighscore() {
  highscores.push({ score: state.score, level: state.level, date: Date.now() });
  highscores.sort((a, b) => b.score - a.score);
  highscores = highscores.slice(0, 10);
  localStorage.setItem("m4trix_highscores", JSON.stringify(highscores));
}

function renderHighscores() {
  highscoreList.innerHTML = highscores.length ? highscores.map((h, i) => `
    <div class="highscore-entry">
      <span class="highscore-rank">#${i + 1}</span>
      <span class="highscore-score">${h.score}</span>
      <span>Level ${h.level}</span>
    </div>
  `).join("") : "<p>No highscores yet.</p>";
}

// ============================================================================
// SHOP
// ============================================================================
function openShop() {
  state.inShop = true;
  shopPanel.classList.remove("hidden");
  renderShop();
}

function closeShop() {
  state.inShop = false;
  shopPanel.classList.add("hidden");
}

function renderShop() {
  shopCredits.textContent = `Credits: ${state.credits}`;
  shopGrid.innerHTML = SHOP_ITEMS.map(item => {
    const owned = item.type === "weapon" ? WEAPONS.find(w => w.id === item.weaponId)?.unlocked : 
                  item.type === "upgrade" ? ownedUpgrades.includes(item.id) : false;
    const canBuy = state.credits >= item.price && !owned;
    return `
      <div class="shop-item ${owned ? 'owned' : ''} ${!canBuy && !owned ? 'locked' : ''}" 
           onclick="buyItem('${item.id}')" data-id="${item.id}">
        <div class="shop-item-icon">${item.icon}</div>
        <div class="shop-item-name">${item.name}</div>
        <div class="shop-item-price">${owned ? 'OWNED' : `${item.price} credits`}</div>
      </div>
    `;
  }).join("");
}

window.buyItem = function(itemId) {
  const item = SHOP_ITEMS.find(i => i.id === itemId);
  if (!item || state.credits < item.price) return;
  
  if (item.type === "weapon") {
    const weapon = WEAPONS.find(w => w.id === item.weaponId);
    if (weapon && !weapon.unlocked) {
      weapon.unlocked = true;
      state.credits -= item.price;
      ownedUpgrades.push(itemId);
      localStorage.setItem("m4trix_upgrades", JSON.stringify(ownedUpgrades));
      playPickup();
      checkAchievement("all_weapons", WEAPONS.every(w => w.unlocked));
    }
  } else if (item.type === "consumable") {
    state.credits -= item.price;
    if (item.effect === "life") state.lives = Math.min(5, state.lives + 1);
    if (item.effect === "shield") state.shield = Math.min(120, state.shield + 60);
    if (item.effect === "speed") state.speed = Math.min(120, state.speed + 60);
    playPickup();
  } else if (item.type === "upgrade" && !ownedUpgrades.includes(item.id)) {
    state.credits -= item.price;
    ownedUpgrades.push(item.id);
    localStorage.setItem("m4trix_upgrades", JSON.stringify(ownedUpgrades));
    if (item.stat === "damage") state.damageMultiplier += 0.1;
    if (item.stat === "firerate") state.fireRateMultiplier += 0.15;
    playPickup();
  }
  renderShop();
  updateHud();
};

// ============================================================================
// STORY / CUTSCENES
// ============================================================================
function startStory(chapter) {
  const story = STORY.find(s => s.chapter === chapter);
  if (!story) return false;
  state.inStory = true;
  state.storyChapter = chapter;
  state.storyScene = 0;
  storyPanel.classList.remove("hidden");
  showStoryScene();
  return true;
}

function showStoryScene() {
  const story = STORY.find(s => s.chapter === state.storyChapter);
  if (!story || state.storyScene >= story.scenes.length) {
    endStory();
    return;
  }
  const scene = story.scenes[state.storyScene];
  storyTitle.textContent = `CHAPTER ${state.storyChapter}`;
  storySpeaker.textContent = scene.speaker;
  typewriterEffect(storyText, scene.text);
}

function typewriterEffect(element, text) {
  element.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      element.textContent += text[i];
      i++;
    } else {
      clearInterval(interval);
    }
  }, 30);
}

function nextStoryScene() {
  state.storyScene++;
  showStoryScene();
}

function endStory() {
  state.inStory = false;
  storyPanel.classList.add("hidden");
  if (state.inMenu) {
    startGame();
  }
}

// ============================================================================
// AUDIO
// ============================================================================
function initAudio() {
  if (!audioState.enabled) return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  if (!audioState.bgmPlaying) startBgm();
}

function stopBgm() {
  if (audioState.bgmTimer) {
    clearInterval(audioState.bgmTimer);
    audioState.bgmTimer = null;
  }
  for (const node of audioState.bgmNodes) {
    try { node.disconnect?.(); node.stop?.(); } catch {}
  }
  audioState.bgmNodes = [];
  audioState.bgmMaster = null;
  audioState.bgmPlaying = false;
}

function startBgm() {
  if (!audioCtx) return;
  stopBgm();
  const master = audioCtx.createGain();
  master.gain.setValueAtTime(audioState.bgmVolume, audioCtx.currentTime);
  master.connect(audioCtx.destination);
  audioState.bgmNodes = [master];
  audioState.bgmPlaying = true;
  audioState.bgmMaster = master;

  const tempo = 132;
  const beat = 60 / tempo;
  const loopBeats = 8;
  const loopLength = beat * loopBeats;

  const scheduleKick = (time) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(50, time + 0.18);
    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);
    osc.connect(gain);
    gain.connect(master);
    osc.start(time);
    osc.stop(time + 0.21);
  };

  const scheduleSnare = (time) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, time);
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);
    osc.connect(gain);
    gain.connect(master);
    osc.start(time);
    osc.stop(time + 0.13);
  };

  const scheduleHat = (time) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(2000, time);
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);
    osc.connect(gain);
    gain.connect(master);
    osc.start(time);
    osc.stop(time + 0.05);
  };

  const scheduleBass = (time, freq) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + beat * 0.9);
    osc.connect(gain);
    gain.connect(master);
    osc.start(time);
    osc.stop(time + beat);
  };

  const scheduleArp = (time, freq) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + beat * 0.45);
    osc.connect(gain);
    gain.connect(master);
    osc.start(time);
    osc.stop(time + beat * 0.5);
  };

  const scheduleLoop = (startTime) => {
    for (let i = 0; i < loopBeats; i++) {
      const t = startTime + i * beat;
      scheduleHat(t);
      if (i % 2 === 0) scheduleKick(t);
      if (i === 2 || i === 6) scheduleSnare(t + beat * 0.02);
    }
    const bassPattern = [55, 73.42, 65.41, 82.41];
    for (let i = 0; i < loopBeats; i += 2) {
      scheduleBass(startTime + i * beat, bassPattern[(i / 2) % bassPattern.length]);
    }
    const arpPattern = [220, 277, 330, 440];
    for (let i = 0; i < loopBeats * 2; i++) {
      scheduleArp(startTime + i * (beat / 2), arpPattern[i % arpPattern.length]);
    }
  };

  const start = audioCtx.currentTime + 0.05;
  scheduleLoop(start);
  audioState.bgmTimer = setInterval(() => {
    if (!audioState.enabled || !audioCtx) return;
    scheduleLoop(audioCtx.currentTime + 0.05);
  }, loopLength * 1000);
}

function playShoot() {
  if (!audioCtx || !audioState.enabled) return;
  const now = performance.now();
  if (now - audioState.lastShot < 50) return;
  audioState.lastShot = now;
  const start = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(900, start);
  osc.frequency.exponentialRampToValueAtTime(3200, start + 0.06);
  gain.gain.setValueAtTime(0.1 * audioState.sfxVolume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.07);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + 0.07);
}

function playLaser() {
  if (!audioCtx || !audioState.enabled) return;
  const start = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1200, start);
  osc.frequency.linearRampToValueAtTime(800, start + 0.15);
  gain.gain.setValueAtTime(0.15 * audioState.sfxVolume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.15);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + 0.15);
}

function playRocket() {
  if (!audioCtx || !audioState.enabled) return;
  const start = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(100, start);
  osc.frequency.exponentialRampToValueAtTime(50, start + 0.3);
  gain.gain.setValueAtTime(0.2 * audioState.sfxVolume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + 0.3);
}

function playExplosion() {
  if (!audioCtx || !audioState.enabled) return;
  const start = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(220, start);
  osc.frequency.exponentialRampToValueAtTime(60, start + 0.25);
  gain.gain.setValueAtTime(0.2 * audioState.sfxVolume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + 0.28);
}

function playPickup() {
  if (!audioCtx || !audioState.enabled) return;
  const start = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(520, start);
  osc.frequency.exponentialRampToValueAtTime(1240, start + 0.12);
  gain.gain.setValueAtTime(0.1 * audioState.sfxVolume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + 0.12);
}

function playGameOver() {
  if (!audioCtx || !audioState.enabled) return;
  const start = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(260, start);
  osc.frequency.exponentialRampToValueAtTime(90, start + 0.5);
  gain.gain.setValueAtTime(0.18 * audioState.sfxVolume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + 0.55);
}

// ============================================================================
// GAME FLOW
// ============================================================================
function togglePause() {
  if (state.inMenu || state.inShop || state.inStory || !state.running) return;
  state.paused = !state.paused;
  overlay.classList.toggle("hidden", !state.paused);
  overlayTitle.textContent = state.paused ? "Paused" : "";
  overlaySubtitle.textContent = state.paused ? "Press P to continue" : "";
  // Hide game over buttons when pausing (not game over)
  if (overlayButtons) overlayButtons.classList.add("hidden");
}

function gameOver() {
  state.running = false;
  overlay.classList.remove("hidden");
  overlayTitle.textContent = "Game Over";
  overlaySubtitle.textContent = `Score: ${state.score}`;
  // Show buttons for mobile users
  if (overlayButtons) overlayButtons.classList.remove("hidden");
  playGameOver();
  stopBgm();
  saveHighscore();
}

function openMenu() {
  state.inMenu = true;
  state.running = false;
  state.paused = false;
  menu.classList.remove("hidden");
  overlay.classList.add("hidden");
}

function startGame() {
  state.inMenu = false;
  state.multiplayer = false;
  state.onlineMultiplayer = false;
  menu.classList.add("hidden");
  reset();
  initAudio();
  hideConnectionStatus();
  // Check for story
  if (STORY.find(s => s.chapter === 1) && state.storyChapter === 0) {
    startStory(1);
  }
}

function startMultiplayer() {
  state.inMenu = false;
  state.multiplayer = true;
  menu.classList.add("hidden");
  reset();
  initAudio();
}

function reset() {
  state.score = config.score;
  state.credits = config.credits || 0;
  state.lives = config.lives;
  state.level = config.level;
  state.waveTimer = 0;
  state.enemyTimer = 0;
  state.spawnInterval = config.spawnInterval;
  state.rapid = config.rapidTime;
  state.rapidLevel = config.rapidLevel;
  state.shield = config.shieldTime;
  state.speed = config.speedTime;
  state.spread = config.spreadTime;
  state.aiEnabled = config.aiEnabled;
  state.aiUnlockLevel = config.aiUnlockLevel;
  state.paused = false;
  state.running = true;
  state.bossActive = false;
  state.bossLevel = 0;
  state.currentBoss = null;
  state.combo = 0;
  state.comboTimer = 0;
  state.maxCombo = 0;
  state.killsThisLevel = 0;
  state.damageTakenThisLevel = 0;
  state.currentWeapon = 1;
  
  overlay.classList.add("hidden");
  if (overlayButtons) overlayButtons.classList.add("hidden");
  bullets.length = 0;
  allyBullets.length = 0;
  enemyBullets.length = 0;
  enemies.length = 0;
  powerups.length = 0;
  particles.length = 0;
  lasers.length = 0;
  rockets.length = 0;
  homingMissiles.length = 0;
  
  ally.active = config.aiEnabled;
  ally.lives = config.aiLives;
  player.x = state.width / 2 - player.w / 2;
  player.y = state.height - player.h - 60;
  
  // Multiplayer Player 2
  p2Bullets.length = 0;
  player2.active = state.multiplayer;
  player2.lives = 3;
  player2.cooldown = 0;
  player2.invincibleTimer = 0;
  player2.x = state.width / 2 - player2.w / 2 + 60;
  player2.y = state.height - player2.h - 60;
  
  if (state.multiplayer) {
    p2StatsEl.classList.remove("hidden");
    // Disable AI in multiplayer
    state.aiEnabled = false;
    ally.active = false;
  } else {
    p2StatsEl.classList.add("hidden");
  }
  
  updateHud();
}

function nextLevel() {
  const prevLevel = state.level;
  state.level++;
  state.killsThisLevel = 0;
  state.credits += 50 + state.level * 10;
  state.spawnInterval = Math.max(0.4, state.spawnInterval - 0.05);
  
  // Check achievements
  checkAchievement("level_10", state.level >= 10);
  checkAchievement("no_damage", state.damageTakenThisLevel === 0);
  state.damageTakenThisLevel = 0;
  
  // Check for story
  const story = STORY.find(s => s.chapter === state.level);
  if (story) {
    startStory(state.level);
    return;
  }
  
  // Only show level complete screen after boss kills (every 5 levels)
  if (prevLevel % 5 === 0) {
    showLevelComplete();
  } else {
    // Quick level up notification
    addExplosion(state.width / 2, state.height / 2, "#00ff9a", 20);
    updateHud();
  }
}

function showLevelComplete() {
  levelComplete.classList.remove("hidden");
  levelStats.innerHTML = `
    Level ${state.level - 1} Complete!<br>
    Score: ${state.score}<br>
    Max Combo: x${state.maxCombo}<br>
    Credits earned: ${100 + (state.level - 1) * 20}
  `;
}

function continueFromLevelComplete() {
  levelComplete.classList.add("hidden");
  state.spawnInterval = Math.max(0.4, state.spawnInterval - 0.08);
  updateHud();
}

// ============================================================================
// SPAWNING
// ============================================================================
function spawnEnemy() {
  const size = 20 + Math.random() * 16;
  const types = ["normal", "normal", "zigzag", "shooter", "shielded"];
  const type = state.level < 3 ? "normal" : types[Math.floor(Math.random() * types.length)];
  
  enemies.push({
    x: Math.random() * (state.width - size),
    y: -size - Math.random() * 120,
    w: size,
    h: size,
    speed: 60 + Math.random() * 80 + state.level * 8,
    hp: 1 + Math.floor(state.level / 3),
    maxHp: 1 + Math.floor(state.level / 3),
    type,
    shield: type === "shielded" ? 2 : 0,
    shootTimer: type === "shooter" ? Math.random() * 2 : 0,
    zigzagTimer: 0,
    zigzagDir: Math.random() > 0.5 ? 1 : -1,
  });
}

function spawnBoss() {
  state.bossActive = true;
  state.bossLevel = state.level;
  
  // Much stronger bosses!
  const bossNum = Math.floor(state.level / 5);
  const bossHp = 80 + state.level * 15 + bossNum * 50;
  const bossSize = 80 + bossNum * 15;
  
  const boss = {
    x: state.width / 2 - bossSize / 2,
    y: -150,
    w: bossSize,
    h: bossSize,
    speed: 40 + bossNum * 10,
    hp: bossHp,
    maxHp: bossHp,
    type: "boss",
    phase: 1,
    shootTimer: 0,
    moveTimer: 0,
    moveDir: 1,
    patterns: ["spread", "aimed", "spiral", "barrage", "laser", "summon"],
    currentPattern: 0,
    patternTimer: 0,
    enraged: false,
    chargeTimer: 0,
    summonTimer: 0,
    laserCharging: false,
    laserTimer: 0,
  };
  
  enemies.push(boss);
  state.currentBoss = boss;
  
  // Epic boss entrance
  screenShake(0.5, 10);
  triggerFlash("#ff2255", 0.3);
  addDamageNumber(state.width / 2, state.height / 3, "⚠ BOSS INCOMING ⚠", true);
}

function spawnPowerup(x, y) {
  const roll = Math.random() * 100;
  let type = "rapid";
  let cumulative = 0;
  
  for (const [key, chance] of Object.entries(powerupChances)) {
    cumulative += chance;
    if (roll < cumulative) {
      type = key;
      break;
    }
  }
  
  if (type === "life" && state.lives >= 5) type = "rapid";
  
  powerups.push({ x, y, w: 22, h: 22, speed: 90, type });
}

// ============================================================================
// WEAPONS / SHOOTING
// ============================================================================
function shoot() {
  if (player.cooldown > 0) return;
  
  // Send network bullet in online mode
  if (state.onlineMultiplayer && netState.connected) {
    sendNetworkData("bullet_fired", {
      x: player.x + player.w / 2 - 3,
      y: player.y - 6,
    });
  }
  
  const weapon = WEAPONS.find(w => w.id === state.currentWeapon) || WEAPONS[0];
  const cooldown = weapon.cooldown * state.fireRateMultiplier;
  
  if (state.rapid > 0) {
    const rapidBoost = 1 - (state.rapidLevel * 0.08);
    player.cooldown = Math.max(0.04, cooldown * rapidBoost);
  } else {
    player.cooldown = cooldown;
  }
  
  const cx = player.x + player.w / 2;
  const cy = player.y;
  
  switch (weapon.id) {
    case 1: // Blaster
      fireBullet(cx, cy, weapon);
      if (state.spread > 0) {
        fireBullet(cx - 10, cy, weapon, -0.2);
        fireBullet(cx + 10, cy, weapon, 0.2);
      }
      playShoot();
      break;
    case 2: // Laser
      fireLaser(cx, cy, weapon);
      playLaser();
      break;
    case 3: // Rockets
      fireRocket(cx, cy, weapon);
      playRocket();
      break;
    case 4: // Homing
      fireHoming(cx, cy, weapon);
      playShoot();
      break;
  }
}

function fireBullet(x, y, weapon, angle = 0) {
  bullets.push({
    x: x - 3,
    y: y - 6,
    w: 6,
    h: 10,
    speed: weapon.speed,
    damage: weapon.damage * state.damageMultiplier,
    color: weapon.color,
    angle,
  });
}

function fireLaser(x, y, weapon) {
  lasers.push({
    x: x - 2,
    y: 0,
    w: 4,
    h: y,
    damage: weapon.damage * state.damageMultiplier,
    color: weapon.color,
    life: 0.1,
    pierce: true,
  });
}

function fireRocket(x, y, weapon) {
  rockets.push({
    x: x - 6,
    y: y - 10,
    w: 12,
    h: 16,
    speed: weapon.speed,
    damage: weapon.damage * state.damageMultiplier,
    color: weapon.color,
    explosionRadius: 60,
  });
}

function fireHoming(x, y, weapon) {
  homingMissiles.push({
    x: x - 4,
    y: y - 8,
    w: 8,
    h: 12,
    speed: weapon.speed,
    damage: weapon.damage * state.damageMultiplier,
    color: weapon.color,
    target: null,
    angle: -Math.PI / 2,
  });
}

function switchWeapon(delta = 1) {
  const unlockedWeapons = WEAPONS.filter(w => w.unlocked);
  const currentIdx = unlockedWeapons.findIndex(w => w.id === state.currentWeapon);
  const nextIdx = (currentIdx + delta + unlockedWeapons.length) % unlockedWeapons.length;
  state.currentWeapon = unlockedWeapons[nextIdx].id;
  updateHud();
}

function allyShoot() {
  if (!ally.active || ally.cooldown > 0) return;
  allyBullets.push({
    x: ally.x + ally.w / 2 - 3,
    y: ally.y - 6,
    w: 6,
    h: 10,
    speed: 480,
    damage: 1,
    color: "#6de2ff",
  });
  ally.cooldown = ally.baseCooldown;
}

// ============================================================================
// EXPLOSIONS & PARTICLES
// ============================================================================
function addExplosion(x, y, color, size = 12) {
  for (let i = 0; i < size; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 160,
      vy: (Math.random() - 0.5) * 160,
      life: 0.5 + Math.random() * 0.4,
      color,
    });
  }
}

function addBigExplosion(x, y, radius) {
  for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * Math.PI * 2;
    const speed = 100 + Math.random() * 100;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.8 + Math.random() * 0.4,
      color: ["#ff6a00", "#ff2255", "#ffaa00"][Math.floor(Math.random() * 3)],
    });
  }
  // Damage enemies in radius
  for (const enemy of enemies) {
    const dx = (enemy.x + enemy.w / 2) - x;
    const dy = (enemy.y + enemy.h / 2) - y;
    if (Math.hypot(dx, dy) < radius) {
      enemy.hp -= 3;
    }
  }
  screenShake(0.3, 15);
}

// ============================================================================
// EPIC VISUAL EFFECTS
// ============================================================================
function screenShake(duration, intensity) {
  state.screenShake = duration;
  state.screenShakeIntensity = intensity;
}

function triggerSlowMo(duration, factor = 0.3) {
  state.slowMo = duration;
  state.slowMoFactor = factor;
}

function triggerFlash(color = "#ffffff", duration = 0.1) {
  state.flash = duration;
  state.flashColor = color;
}

function addDamageNumber(x, y, damage, isCrit = false) {
  damageNumbers.push({
    x,
    y,
    text: isCrit ? `${damage}!` : `${damage}`,
    color: isCrit ? "#ff0" : "#fff",
    size: isCrit ? 24 : 16,
    life: 1,
    vy: -80,
  });
}

function addTrail(x, y, color) {
  trails.push({
    x,
    y,
    life: 0.2,
    color,
    size: 4,
  });
}

function addLightning(x1, y1, x2, y2, color = "#00e5ff") {
  const segments = [];
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const px = x1 + (x2 - x1) * t + (i > 0 && i < steps ? (Math.random() - 0.5) * 30 : 0);
    const py = y1 + (y2 - y1) * t + (i > 0 && i < steps ? (Math.random() - 0.5) * 30 : 0);
    segments.push({ x: px, y: py });
  }
  lightnings.push({ segments, color, life: 0.15 });
}

function addMegaExplosion(x, y) {
  // Epic explosion for boss kills
  for (let ring = 0; ring < 3; ring++) {
    setTimeout(() => {
      for (let i = 0; i < 40; i++) {
        const angle = (i / 40) * Math.PI * 2;
        const speed = 150 + ring * 80 + Math.random() * 100;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.2 + Math.random() * 0.5,
          color: ["#ff00ff", "#00ffff", "#ffff00", "#ff6a00"][Math.floor(Math.random() * 4)],
        });
      }
    }, ring * 100);
  }
  screenShake(0.8, 25);
  triggerFlash("#ff00ff", 0.2);
  triggerSlowMo(1.5, 0.2);
}

function addComboText(combo) {
  if (combo >= 5) {
    const texts = ["NICE!", "GREAT!", "AWESOME!", "INCREDIBLE!", "UNSTOPPABLE!", "GODLIKE!"];
    const idx = Math.min(Math.floor((combo - 5) / 5), texts.length - 1);
    damageNumbers.push({
      x: state.width / 2,
      y: state.height / 2,
      text: texts[idx],
      color: `hsl(${(combo * 20) % 360}, 100%, 60%)`,
      size: 32 + combo,
      life: 1.5,
      vy: -30,
    });
  }
}

function updateEffects(delta) {
  // Screen shake
  if (state.screenShake > 0) {
    state.screenShake -= delta;
  }
  
  // Slow motion
  if (state.slowMo > 0) {
    state.slowMo -= delta;
  }
  
  // Flash
  if (state.flash > 0) {
    state.flash -= delta;
  }
  
  // Damage numbers
  for (let i = damageNumbers.length - 1; i >= 0; i--) {
    const d = damageNumbers[i];
    d.life -= delta;
    d.y += d.vy * delta;
    d.vy *= 0.95;
    if (d.life <= 0) damageNumbers.splice(i, 1);
  }
  
  // Trails
  for (let i = trails.length - 1; i >= 0; i--) {
    trails[i].life -= delta;
    if (trails[i].life <= 0) trails.splice(i, 1);
  }
  
  // Lightnings
  for (let i = lightnings.length - 1; i >= 0; i--) {
    lightnings[i].life -= delta;
    if (lightnings[i].life <= 0) lightnings.splice(i, 1);
  }
}

// ============================================================================
// UPDATE FUNCTIONS
// ============================================================================
function updateRain(delta) {
  for (const col of rainColumns) {
    col.y += col.speed * delta;
    if (col.y > state.height + 40) {
      col.y = -Math.random() * 120;
      col.speed = 50 + Math.random() * 120;
    }
  }
}

function updatePlayer(delta) {
  // In online mode, guest doesn't control local player directly - it's synced from host
  if (state.onlineMultiplayer && !netState.isHost) {
    // Guest's "player" is controlled by network sync, not input
    // Guest controls their own ship which appears as player2 on host
    return;
  }
  
  let dx = 0;
  let dy = 0;
  const keys = new Set([...state.keys, ...state.touchKeys]);
  
  // In local multiplayer, P1 uses WASD only
  if (state.multiplayer && !state.onlineMultiplayer) {
    if (keys.has("KeyA")) dx -= 1;
    if (keys.has("KeyD")) dx += 1;
    if (keys.has("KeyW")) dy -= 1;
    if (keys.has("KeyS")) dy += 1;
  } else {
    if (keys.has("ArrowLeft") || keys.has("KeyA") || keys.has("left")) dx -= 1;
    if (keys.has("ArrowRight") || keys.has("KeyD") || keys.has("right")) dx += 1;
    if (keys.has("ArrowUp") || keys.has("KeyW") || keys.has("up")) dy -= 1;
    if (keys.has("ArrowDown") || keys.has("KeyS") || keys.has("down")) dy += 1;
  }

  const length = Math.hypot(dx, dy) || 1;
  const speedBoost = state.speed > 0 ? 1.45 : 1;
  player.x += (dx / length) * player.speed * speedBoost * delta;
  player.y += (dy / length) * player.speed * speedBoost * delta;
  player.x = Math.max(0, Math.min(state.width - player.w, player.x));
  player.y = Math.max(60, Math.min(state.height - player.h - 20, player.y));

  if (keys.has("Space") || keys.has("fire")) shoot();
  player.cooldown = Math.max(0, player.cooldown - delta);
  
  // Update powerup timers
  state.rapid = Math.max(0, state.rapid - delta);
  state.shield = Math.max(0, state.shield - delta);
  state.speed = Math.max(0, state.speed - delta);
  state.spread = Math.max(0, state.spread - delta);
  if (state.rapid === 0) state.rapidLevel = 0;
  
  updateCombo(delta);
}

function updatePlayer2(delta) {
  if (!player2.active) return;
  
  // Decrement invincibility timer
  if (player2.invincibleTimer > 0) {
    player2.invincibleTimer -= delta;
  }
  
  // In online mode as guest, player2 represents OUR ship (controlled by us)
  if (state.onlineMultiplayer && !netState.isHost) {
    let dx = 0;
    let dy = 0;
    const keys = new Set([...state.keys, ...state.touchKeys]);
    
    // Guest uses all movement keys
    if (keys.has("ArrowLeft") || keys.has("KeyA") || keys.has("left")) dx -= 1;
    if (keys.has("ArrowRight") || keys.has("KeyD") || keys.has("right")) dx += 1;
    if (keys.has("ArrowUp") || keys.has("KeyW") || keys.has("up")) dy -= 1;
    if (keys.has("ArrowDown") || keys.has("KeyS") || keys.has("down")) dy += 1;

    const length = Math.hypot(dx, dy) || 1;
    player2.x += (dx / length) * player2.speed * delta;
    player2.y += (dy / length) * player2.speed * delta;
    player2.x = Math.max(0, Math.min(state.width - player2.w, player2.x));
    player2.y = Math.max(60, Math.min(state.height - player2.h - 20, player2.y));

    // Guest shoots with Space
    if (keys.has("Space") || keys.has("fire")) player2Shoot();
    player2.cooldown = Math.max(0, player2.cooldown - delta);
    return;
  }
  
  // Local multiplayer: P2 uses Arrow Keys
  let dx = 0;
  let dy = 0;
  
  if (p2Keys.has("ArrowLeft")) dx -= 1;
  if (p2Keys.has("ArrowRight")) dx += 1;
  if (p2Keys.has("ArrowUp")) dy -= 1;
  if (p2Keys.has("ArrowDown")) dy += 1;

  const length = Math.hypot(dx, dy) || 1;
  player2.x += (dx / length) * player2.speed * delta;
  player2.y += (dy / length) * player2.speed * delta;
  player2.x = Math.max(0, Math.min(state.width - player2.w, player2.x));
  player2.y = Math.max(60, Math.min(state.height - player2.h - 20, player2.y));

  // P2 shoots with Enter or Numpad0
  if (p2Keys.has("Enter") || p2Keys.has("Numpad0")) player2Shoot();
  player2.cooldown = Math.max(0, player2.cooldown - delta);
}

function player2Shoot() {
  if (!player2.active || player2.cooldown > 0) return;
  
  // In online mode, guest sends bullet to host
  if (state.onlineMultiplayer && netState.connected && !netState.isHost) {
    sendNetworkData("bullet_fired", {
      x: player2.x + player2.w / 2 - 3,
      y: player2.y - 6,
    });
    // Guest creates their own bullet locally too
  }
  
  const cx = player2.x + player2.w / 2;
  const cy = player2.y;
  
  p2Bullets.push({
    x: cx - 3,
    y: cy - 6,
    w: 6,
    h: 12,
    speed: 520,
    damage: 1 * state.damageMultiplier,
    color: "#ff6a6a",
  });
  
  player2.cooldown = player2.baseCooldown;
  playShoot();
}

function updateAlly(delta) {
  if (!state.aiEnabled) {
    ally.active = false;
    return;
  }
  if (!ally.active) {
    ally.active = true;
    ally.x = Math.min(state.width - ally.w - 20, player.x + 50);
    ally.y = Math.min(state.height - ally.h - 20, player.y + 40);
  }

  // Smart AI: avoid enemies, collect powerups, shoot
  let targetX = player.x;
  
  // Find nearest enemy to shoot at
  const target = findNearestEnemy();
  if (target) {
    targetX = target.x + target.w / 2 - ally.w / 2;
  }
  
  // Check for powerups
  const nearbyPowerup = powerups.find(p => Math.abs(p.x - ally.x) < 100 && p.y > ally.y - 100);
  if (nearbyPowerup) {
    targetX = nearbyPowerup.x;
  }
  
  // Avoid enemies coming at us
  for (const enemy of enemies) {
    const dx = ally.x + ally.w / 2 - (enemy.x + enemy.w / 2);
    const dy = ally.y + ally.h / 2 - (enemy.y + enemy.h / 2);
    if (Math.abs(dx) < 60 && dy > 0 && dy < 150) {
      targetX = ally.x + (dx > 0 ? 80 : -80);
      break;
    }
  }
  
  const moveDir = Math.sign(targetX - ally.x);
  ally.x += moveDir * ally.speed * delta;
  ally.x = Math.max(0, Math.min(state.width - ally.w, ally.x));
  
  const desiredY = Math.min(state.height - ally.h - 40, player.y + 40);
  ally.y += (desiredY - ally.y) * Math.min(1, delta * 4);

  if (target) allyShoot();
  ally.cooldown = Math.max(0, ally.cooldown - delta);
}

function updateBullets(delta) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    // Add trail
    if (Math.random() < 0.3) addTrail(b.x + b.w / 2, b.y + b.h, b.color || "#7fffe3");
    b.y -= b.speed * delta;
    if (b.angle) b.x += b.angle * b.speed * delta;
    if (b.y + b.h < 0 || b.x < -50 || b.x > state.width + 50) bullets.splice(i, 1);
  }
}

function updateP2Bullets(delta) {
  for (let i = p2Bullets.length - 1; i >= 0; i--) {
    const b = p2Bullets[i];
    if (Math.random() < 0.3) addTrail(b.x + b.w / 2, b.y + b.h, "#ff6a6a");
    b.y -= b.speed * delta;
    if (b.y + b.h < 0) p2Bullets.splice(i, 1);
  }
}

function updateLasers(delta) {
  for (let i = lasers.length - 1; i >= 0; i--) {
    const l = lasers[i];
    lasers[i].life -= delta;
    // Add lightning effect along laser
    if (Math.random() < 0.5) {
      addLightning(l.x, l.y, l.x + (Math.random() - 0.5) * 30, l.y + l.h * Math.random(), l.color);
    }
    if (lasers[i].life <= 0) lasers.splice(i, 1);
  }
}

function updateRockets(delta) {
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    // Smoke trail
    addTrail(r.x + r.w / 2, r.y + r.h + 5, "#ff6a00");
    if (Math.random() < 0.5) {
      particles.push({
        x: r.x + r.w / 2 + (Math.random() - 0.5) * 8,
        y: r.y + r.h + 10,
        vx: (Math.random() - 0.5) * 30,
        vy: 50 + Math.random() * 30,
        life: 0.3 + Math.random() * 0.2,
        color: ["#ff6a00", "#ff9900", "#ffcc00"][Math.floor(Math.random() * 3)],
      });
    }
    r.y -= r.speed * delta;
    if (r.y + r.h < 0) {
      rockets.splice(i, 1);
    }
  }
}

function updateHomingMissiles(delta) {
  for (let i = homingMissiles.length - 1; i >= 0; i--) {
    const m = homingMissiles[i];
    
    // Purple trail
    addTrail(m.x + m.w / 2, m.y + m.h / 2, "#b000ff");
    
    // Find target
    if (!m.target || enemies.indexOf(m.target) === -1) {
      m.target = findNearestEnemy();
    }
    
    if (m.target) {
      // Draw targeting line occasionally
      if (Math.random() < 0.1) {
        addLightning(m.x + m.w / 2, m.y, m.target.x + m.target.w / 2, m.target.y + m.target.h / 2, "#b000ff");
      }
      const tx = m.target.x + m.target.w / 2;
      const ty = m.target.y + m.target.h / 2;
      const dx = tx - m.x;
      const dy = ty - m.y;
      const targetAngle = Math.atan2(dy, dx);
      const angleDiff = targetAngle - m.angle;
      m.angle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), 5 * delta);
    }
    
    m.x += Math.cos(m.angle) * m.speed * delta;
    m.y += Math.sin(m.angle) * m.speed * delta;
    
    if (m.y < -50 || m.y > state.height + 50 || m.x < -50 || m.x > state.width + 50) {
      homingMissiles.splice(i, 1);
    }
  }
}

function updateAllyBullets(delta) {
  for (let i = allyBullets.length - 1; i >= 0; i--) {
    allyBullets[i].y -= allyBullets[i].speed * delta;
    if (allyBullets[i].y + allyBullets[i].h < 0) allyBullets.splice(i, 1);
  }
}

function updateEnemyBullets(delta) {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    b.x += Math.cos(b.angle) * b.speed * delta;
    b.y += Math.sin(b.angle) * b.speed * delta;
    if (b.y > state.height + 20 || b.y < -20 || b.x < -20 || b.x > state.width + 20) {
      enemyBullets.splice(i, 1);
    }
  }
}

function updateEnemies(delta) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    
    if (enemy.type === "boss") {
      updateBoss(enemy, delta);
      continue;
    }
    
    enemy.y += enemy.speed * delta;
    
    // Type-specific behavior
    if (enemy.type === "zigzag") {
      enemy.zigzagTimer += delta;
      if (enemy.zigzagTimer > 0.5) {
        enemy.zigzagDir *= -1;
        enemy.zigzagTimer = 0;
      }
      enemy.x += enemy.zigzagDir * 100 * delta;
      enemy.x = Math.max(0, Math.min(state.width - enemy.w, enemy.x));
    }
    
    if (enemy.type === "shooter") {
      enemy.shootTimer -= delta;
      if (enemy.shootTimer <= 0) {
        enemyShoot(enemy);
        enemy.shootTimer = 1.5 + Math.random();
      }
    }
    
    if (enemy.y > state.height + enemy.h) {
      enemies.splice(i, 1);
    }
  }
}

function updateBoss(boss, delta) {
  // Move down to position
  if (boss.y < 60) {
    boss.y += 80 * delta;
    return;
  }
  
  // Phase transitions with epic effects
  const hpPercent = boss.hp / boss.maxHp;
  if (hpPercent < 0.25 && boss.phase < 3) {
    boss.phase = 3;
    boss.speed = 120;
    boss.enraged = true;
    addExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, "#ff00ff", 40);
    screenShake(0.8, 15);
    triggerSlowMo(0.5);
    addDamageNumber(boss.x + boss.w / 2, boss.y - 30, "⚡ ENRAGED ⚡", true);
  } else if (hpPercent < 0.5 && boss.phase < 2) {
    boss.phase = 2;
    boss.speed = 80;
    addExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, "#00ffff", 30);
    screenShake(0.5, 10);
    addDamageNumber(boss.x + boss.w / 2, boss.y - 30, "PHASE 2", true);
  }
  
  // Aggressive movement - chase player when enraged
  boss.moveTimer += delta;
  if (boss.enraged) {
    const targetX = player.x + player.w / 2 - boss.w / 2;
    boss.x += (targetX - boss.x) * 2 * delta;
  } else {
    if (boss.moveTimer > 1.5) {
      boss.moveDir *= -1;
      boss.moveTimer = 0;
    }
    boss.x += boss.moveDir * boss.speed * delta;
  }
  boss.x = Math.max(20, Math.min(state.width - boss.w - 20, boss.x));
  
  // Vertical movement in later phases
  if (boss.phase >= 2) {
    boss.y += Math.sin(Date.now() / 500) * 30 * delta;
    boss.y = Math.max(40, Math.min(150, boss.y));
  }
  
  // Charge attack in phase 3
  if (boss.phase === 3) {
    boss.chargeTimer -= delta;
    if (boss.chargeTimer <= 0) {
      bossChargeAttack(boss);
      boss.chargeTimer = 4 + Math.random() * 2;
    }
  }
  
  // Summon minions
  if (boss.phase >= 2) {
    boss.summonTimer -= delta;
    if (boss.summonTimer <= 0) {
      bossSummonMinions(boss);
      boss.summonTimer = boss.phase === 3 ? 5 : 8;
    }
  }
  
  // Attack patterns - much faster
  boss.shootTimer -= delta;
  boss.patternTimer += delta;
  
  const patternDuration = boss.phase === 3 ? 2 : boss.phase === 2 ? 3 : 4;
  if (boss.patternTimer > patternDuration) {
    boss.currentPattern = (boss.currentPattern + 1) % boss.patterns.length;
    boss.patternTimer = 0;
  }
  
  const shootDelay = boss.phase === 3 ? 0.15 : boss.phase === 2 ? 0.25 : 0.4;
  if (boss.shootTimer <= 0) {
    const pattern = boss.patterns[boss.currentPattern];
    bossAttack(boss, pattern);
    boss.shootTimer = shootDelay;
  }
}

function bossAttack(boss, pattern) {
  const cx = boss.x + boss.w / 2;
  const cy = boss.y + boss.h;
  const phase = boss.phase;
  
  switch (pattern) {
    case "spread":
      // More bullets in higher phases
      const spreadCount = phase === 3 ? 9 : phase === 2 ? 7 : 5;
      for (let i = -(spreadCount - 1) / 2; i <= (spreadCount - 1) / 2; i++) {
        enemyBullets.push({
          x: cx, y: cy, w: 10, h: 10,
          speed: 250 + phase * 30,
          angle: Math.PI / 2 + i * 0.15,
          color: "#ff2255",
        });
      }
      break;
      
    case "aimed":
      // Multi-shot aimed attack
      const dx = player.x + player.w / 2 - cx;
      const dy = player.y + player.h / 2 - cy;
      const angle = Math.atan2(dy, dx);
      const aimCount = phase === 3 ? 5 : phase === 2 ? 3 : 1;
      for (let i = 0; i < aimCount; i++) {
        setTimeout(() => {
          enemyBullets.push({
            x: cx, y: cy, w: 12, h: 12,
            speed: 350 + phase * 30,
            angle: angle + (Math.random() - 0.5) * 0.3,
            color: "#ff6a00",
          });
        }, i * 50);
      }
      break;
      
    case "spiral":
      // Double or triple spiral
      const spirals = phase === 3 ? 3 : phase === 2 ? 2 : 1;
      for (let s = 0; s < spirals; s++) {
        const spiralAngle = (Date.now() / 80) % (Math.PI * 2) + (s * Math.PI * 2 / spirals);
        enemyBullets.push({
          x: cx, y: cy, w: 8, h: 8,
          speed: 200 + phase * 20,
          angle: spiralAngle,
          color: "#b000ff",
        });
      }
      break;
      
    case "barrage":
      // Rain of bullets from above
      for (let i = 0; i < 3 + phase * 2; i++) {
        enemyBullets.push({
          x: Math.random() * state.width,
          y: 0,
          w: 6, h: 15,
          speed: 300 + phase * 50,
          angle: Math.PI / 2 + (Math.random() - 0.5) * 0.2,
          color: "#00ff88",
        });
      }
      break;
      
    case "laser":
      // Wide laser beam warning then damage
      if (!boss.laserCharging) {
        boss.laserCharging = true;
        boss.laserTimer = 1.5;
        boss.laserX = cx;
      }
      boss.laserTimer -= 0.016;
      if (boss.laserTimer <= 0 && boss.laserCharging) {
        // Fire massive laser
        for (let i = 0; i < 20; i++) {
          enemyBullets.push({
            x: boss.laserX + (Math.random() - 0.5) * 30,
            y: boss.y + boss.h,
            w: 15, h: 15,
            speed: 500,
            angle: Math.PI / 2,
            color: "#ff0066",
          });
        }
        screenShake(0.3, 8);
        boss.laserCharging = false;
      }
      break;
      
    case "summon":
      // Already handled in updateBoss
      break;
  }
}

function bossChargeAttack(boss) {
  // Boss charges down at player
  const oldY = boss.y;
  const targetY = player.y - boss.h - 20;
  
  addDamageNumber(boss.x + boss.w / 2, boss.y - 20, "⚠ CHARGE ⚠", true);
  screenShake(0.2, 5);
  
  // Create charge trail
  setTimeout(() => {
    boss.y = Math.min(targetY, state.height / 2);
    screenShake(0.5, 12);
    
    // Explosion of bullets on impact
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      enemyBullets.push({
        x: boss.x + boss.w / 2,
        y: boss.y + boss.h,
        w: 10, h: 10,
        speed: 300,
        angle: a,
        color: "#ff00ff",
      });
    }
    
    addExplosion(boss.x + boss.w / 2, boss.y + boss.h, "#ff00ff", 25);
    
    // Return to position
    setTimeout(() => {
      boss.y = 60;
    }, 500);
  }, 300);
}

function bossSummonMinions(boss) {
  const count = boss.phase === 3 ? 4 : 2;
  addDamageNumber(boss.x + boss.w / 2, boss.y - 20, "SUMMON!", true);
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const minion = {
        x: boss.x + boss.w / 2 - 15 + (Math.random() - 0.5) * 60,
        y: boss.y + boss.h,
        w: 30,
        h: 30,
        speed: 100 + Math.random() * 50,
        hp: 2,
        type: "shooter",
        color: "#ff44aa",
        shootTimer: 1 + Math.random(),
      };
      enemies.push(minion);
      addExplosion(minion.x, minion.y, "#ff44aa", 8);
    }, i * 200);
  }
}

function enemyShoot(enemy) {
  const cx = enemy.x + enemy.w / 2;
  const cy = enemy.y + enemy.h;
  const dx = player.x + player.w / 2 - cx;
  const dy = player.y + player.h / 2 - cy;
  const angle = Math.atan2(dy, dx);
  
  enemyBullets.push({
    x: cx, y: cy, w: 6, h: 6,
    speed: 200,
    angle,
    color: "#ff4444",
  });
}

function updatePowerups(delta) {
  for (let i = powerups.length - 1; i >= 0; i--) {
    powerups[i].y += powerups[i].speed * delta;
    if (powerups[i].y > state.height + 30) powerups.splice(i, 1);
  }
}

function updateParticles(delta) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= delta;
    p.x += p.vx * delta;
    p.y += p.vy * delta;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

// ============================================================================
// COLLISION DETECTION
// ============================================================================
function checkCollisions() {
  // Player vs enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    
    if (rectsOverlap(player, enemy)) {
      if (state.shield > 0) {
        state.shield = 0;
        enemies.splice(i, 1);
        addExplosion(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, "#00e5ff", 15);
        addDamageNumber(player.x + player.w / 2, player.y, "BLOCKED!", false);
        screenShake(0.15, 8);
        triggerFlash("#00e5ff", 0.1);
        updateHud();
      } else {
        state.lives--;
        state.damageTakenThisLevel++;
        state.combo = 0;
        enemies.splice(i, 1);
        addExplosion(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, "#ff2255", 20);
        addExplosion(player.x + player.w / 2, player.y + player.h / 2, "#ff2255", 15);
        addDamageNumber(player.x + player.w / 2, player.y - 20, "-1 LIFE", true);
        screenShake(0.4, 20);
        triggerFlash("#ff2255", 0.2);
        triggerSlowMo(0.3, 0.3);
        playExplosion();
        updateHud();
        if (state.lives <= 0) gameOver();
      }
      continue;
    }
    
    // Bullets vs enemies
    checkBulletHits(enemy, i);
  }
  
  // Player vs enemy bullets
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    if (rectsOverlap(player, enemyBullets[i])) {
      const b = enemyBullets[i];
      enemyBullets.splice(i, 1);
      addExplosion(b.x, b.y, b.color || "#ff2255", 8);
      if (state.shield > 0) {
        state.shield = 0;
        addDamageNumber(player.x + player.w / 2, player.y, "BLOCKED!");
        screenShake(0.1, 5);
        triggerFlash("#00e5ff", 0.05);
      } else {
        state.lives--;
        state.damageTakenThisLevel++;
        state.combo = 0;
        addDamageNumber(player.x + player.w / 2, player.y - 20, "-1 LIFE", true);
        screenShake(0.3, 15);
        triggerFlash("#ff2255", 0.15);
        triggerSlowMo(0.2, 0.4);
        playExplosion();
        if (state.lives <= 0) gameOver();
      }
      updateHud();
    }
  }
  
  // Ally vs enemies
  if (ally.active) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      if (enemies[i].type === "boss") continue;
      if (rectsOverlap(ally, enemies[i])) {
        ally.lives--;
        enemies.splice(i, 1);
        addExplosion(ally.x + ally.w / 2, ally.y + ally.h / 2, "#6de2ff");
        if (ally.lives <= 0) {
          ally.active = false;
          state.aiEnabled = false;
        }
        updateHud();
      }
    }
  }
  
  // Player 2 vs enemies - only in local multiplayer or if we are guest in online (guest handles own collisions)
  // In online multiplayer: Host checks player2 collision only for LOCAL player2 (but player2 is remote for host)
  // So we skip player2 collision entirely if online AND we are host (player2 is remote, they handle their own)
  const shouldCheckPlayer2Collisions = player2.active && 
    (!state.onlineMultiplayer || !netState.isHost);
  
  if (shouldCheckPlayer2Collisions && player2.invincibleTimer <= 0) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      if (enemy.type === "boss") continue;
      if (rectsOverlap(player2, enemy)) {
        player2.lives--;
        player2.invincibleTimer = 1.5; // 1.5 seconds of invincibility
        enemies.splice(i, 1);
        addExplosion(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, "#ff6a6a", 15);
        addExplosion(player2.x + player2.w / 2, player2.y + player2.h / 2, "#ff6a6a", 10);
        addDamageNumber(player2.x + player2.w / 2, player2.y - 20, "P2 -1", true);
        screenShake(0.3, 15);
        playExplosion();
        if (player2.lives <= 0) {
          player2.active = false;
          addDamageNumber(player2.x + player2.w / 2, player2.y, "P2 DOWN!", true);
        }
        updateHud();
        break; // Only take one hit per frame
      }
    }
    
    // Player 2 vs enemy bullets
    if (player2.invincibleTimer <= 0) {
      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        if (rectsOverlap(player2, enemyBullets[i])) {
          const b = enemyBullets[i];
          enemyBullets.splice(i, 1);
          player2.lives--;
          player2.invincibleTimer = 1.5; // 1.5 seconds of invincibility
          addExplosion(b.x, b.y, "#ff6a6a", 8);
          addDamageNumber(player2.x + player2.w / 2, player2.y - 20, "P2 -1", true);
          screenShake(0.2, 10);
          playExplosion();
          if (player2.lives <= 0) {
            player2.active = false;
            addDamageNumber(player2.x + player2.w / 2, player2.y, "P2 DOWN!", true);
          }
          updateHud();
          break; // Only take one hit per frame
        }
      }
    }
  }
}

function checkBulletHits(enemy, enemyIdx) {
  const bulletArrays = [
    { arr: bullets, remove: true },
    { arr: allyBullets, remove: true },
    { arr: p2Bullets, remove: true },
    { arr: lasers, remove: false },
    { arr: rockets, remove: true, explode: true },
    { arr: homingMissiles, remove: true },
  ];
  
  for (const { arr, remove, explode } of bulletArrays) {
    for (let j = arr.length - 1; j >= 0; j--) {
      const b = arr[j];
      if (rectsOverlap(b, enemy)) {
        if (remove) arr.splice(j, 1);
        
        if (explode) {
          addBigExplosion(b.x + b.w / 2, b.y + b.h / 2, b.explosionRadius || 60);
          playExplosion();
        }
        
        // Shield first
        if (enemy.shield > 0) {
          enemy.shield -= b.damage || 1;
          addExplosion(enemy.x + enemy.w / 2, enemy.y, "#00e5ff", 6);
          addDamageNumber(enemy.x + enemy.w / 2, enemy.y, "SHIELD");
          addLightning(b.x, b.y, enemy.x + enemy.w / 2, enemy.y, "#00e5ff");
          return;
        }
        
        const damage = b.damage || 1;
        enemy.hp -= damage;
        
        // Damage number with critical chance
        const isCrit = Math.random() < 0.15;
        const displayDamage = isCrit ? Math.floor(damage * 1.5) : damage;
        if (isCrit) enemy.hp -= damage * 0.5;
        addDamageNumber(enemy.x + enemy.w / 2 + (Math.random() - 0.5) * 20, enemy.y, displayDamage, isCrit);
        
        // Hit effect
        if (enemy.hp > 0) {
          screenShake(0.05, 3);
          addExplosion(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, b.color || "#00ff9a", 4);
        }
        
        if (enemy.hp <= 0) {
          const isBoss = enemy.type === "boss";
          enemies.splice(enemyIdx, 1);
          
          const baseScore = isBoss ? 1000 : 100;
          const multiplier = getScoreMultiplier();
          const earnedScore = Math.floor(baseScore * multiplier);
          state.score += earnedScore;
          state.killsThisLevel++;
          addCombo();
          
          // Epic visual effects
          if (isBoss) {
            addMegaExplosion(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2);
            addDamageNumber(state.width / 2, state.height / 3, "BOSS DESTROYED!", true);
          } else {
            addExplosion(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, "#00ff9a", 12);
            screenShake(0.1, 5);
            triggerFlash("#00ff9a", 0.03);
          }
          playExplosion();
          
          // Score popup
          addDamageNumber(enemy.x + enemy.w / 2, enemy.y - 20, `+${earnedScore}`);
          
          // Combo text
          if (state.combo >= 5 && state.combo % 5 === 0) {
            addComboText(state.combo);
          }
          
          if (Math.random() < 0.2) {
            spawnPowerup(enemy.x + enemy.w / 2 - 11, enemy.y + enemy.h / 2 - 11);
          }
          
          // Check achievements
          checkAchievement("first_kill", true);
          checkAchievement("score_10k", state.score >= 10000);
          checkAchievement("score_50k", state.score >= 50000);
          
          // Add credits per kill
          state.credits += isBoss ? 500 : 10 + Math.floor(state.combo / 5) * 5;
          
          if (isBoss) {
            state.bossActive = false;
            state.currentBoss = null;
            checkAchievement("boss_kill", true);
            nextLevel();
          } else if (!state.bossActive) {
            // Level up after enough kills (10 + level * 2 kills per level)
            const killsNeeded = 10 + state.level * 2;
            if (state.killsThisLevel >= killsNeeded) {
              nextLevel();
            }
          }
          
          updateHud();
        }
        return;
      }
    }
  }
}

function checkPowerupPickup() {
  const collectors = [player];
  if (ally.active) collectors.push(ally);
  if (player2.active) collectors.push(player2);
  
  const colors = { life: "#ff4488", shield: "#00e5ff", speed: "#ffcc00", rapid: "#00ff9a", spread: "#b000ff" };
  const names = { life: "+1 LIFE", shield: "SHIELD!", speed: "SPEED!", rapid: "RAPID!", spread: "SPREAD!" };
  
  for (const collector of collectors) {
    for (let i = powerups.length - 1; i >= 0; i--) {
      const p = powerups[i];
      if (!rectsOverlap(collector, p)) continue;
      
      powerups.splice(i, 1);
      playPickup();
      
      // Epic pickup effects
      const color = colors[p.type] || "#00ff9a";
      addExplosion(p.x + p.w / 2, p.y + p.h / 2, color, 15);
      addDamageNumber(p.x + p.w / 2, p.y - 10, names[p.type] || "POWER!", false);
      triggerFlash(color, 0.05);
      
      // Ring explosion effect
      for (let j = 0; j < 12; j++) {
        const angle = (j / 12) * Math.PI * 2;
        particles.push({
          x: p.x + p.w / 2,
          y: p.y + p.h / 2,
          vx: Math.cos(angle) * 120,
          vy: Math.sin(angle) * 120,
          life: 0.5,
          color,
        });
      }
      
      switch (p.type) {
        case "life":
          state.lives = Math.min(5, state.lives + 1);
          screenShake(0.1, 5);
          break;
        case "shield":
          state.shield = state.shield > 0 ? Math.min(120, state.shield + 30) : 60;
          // Shield activation lightning
          for (let k = 0; k < 4; k++) {
            addLightning(
              collector.x + collector.w / 2,
              collector.y + collector.h / 2,
              collector.x + (Math.random() - 0.5) * 80,
              collector.y + (Math.random() - 0.5) * 80,
              "#00e5ff"
            );
          }
          break;
        case "speed":
          state.speed = state.speed > 0 ? Math.min(120, state.speed + 30) : 60;
          break;
        case "spread":
          state.spread = state.spread > 0 ? Math.min(120, state.spread + 30) : 60;
          break;
        case "rapid":
          if (state.rapid > 0) {
            state.rapid = Math.min(120, state.rapid + 30);
            state.rapidLevel = Math.min(20, state.rapidLevel + 1);
          } else {
            state.rapid = 60;
            state.rapidLevel = 1;
          }
          break;
      }
      updateHud();
    }
  }
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function findNearestEnemy() {
  if (enemies.length === 0) return null;
  let nearest = null;
  let bestDist = Infinity;
  const px = player.x + player.w / 2;
  const py = player.y + player.h / 2;
  for (const enemy of enemies) {
    const ex = enemy.x + enemy.w / 2;
    const ey = enemy.y + enemy.h / 2;
    const dist = Math.hypot(ex - px, ey - py);
    if (dist < bestDist) {
      bestDist = dist;
      nearest = enemy;
    }
  }
  return nearest;
}

// ============================================================================
// DRAWING
// ============================================================================
function drawRain() {
  ctx.fillStyle = "rgba(0, 10, 6, 0.35)";
  ctx.fillRect(0, 0, state.width, state.height);
  for (const col of rainColumns) {
    ctx.font = `${col.fontSize}px Consolas`;
    ctx.fillStyle = `rgba(0, 255, 154, ${col.opacity})`;
    const glyph = rainGlyphs[Math.floor(Math.random() * rainGlyphs.length)];
    ctx.fillText(glyph, col.x, col.y);
  }
}

function drawPlayer() {
  ctx.save();
  const cx = player.x + player.w / 2;
  const cy = player.y + player.h / 2;
  
  // Aura effects based on active powerups
  const hasPowerup = state.rapid > 0 || state.speed > 0 || state.spread > 0;
  if (hasPowerup) {
    const time = Date.now() / 100;
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = state.rapid > 0 ? "#00ff9a" : state.speed > 0 ? "#ffcc00" : "#b000ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, player.w + 8 + Math.sin(time) * 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  
  // Engine flame
  const flameHeight = 8 + Math.random() * 6;
  ctx.fillStyle = state.speed > 0 ? "#ffcc00" : "#00ff9a";
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(player.x + player.w * 0.3, player.y + player.h);
  ctx.lineTo(cx, player.y + player.h + flameHeight);
  ctx.lineTo(player.x + player.w * 0.7, player.y + player.h);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  
  // Main ship
  ctx.strokeStyle = player.color;
  ctx.lineWidth = 2;
  ctx.shadowColor = player.color;
  ctx.shadowBlur = state.shield > 0 ? 30 : hasPowerup ? 20 : 12;
  ctx.beginPath();
  ctx.moveTo(cx, player.y);
  ctx.lineTo(player.x + player.w, player.y + player.h);
  ctx.lineTo(cx, player.y + player.h * 0.65);
  ctx.lineTo(player.x, player.y + player.h);
  ctx.closePath();
  ctx.stroke();
  
  // Shield bubble
  if (state.shield > 0) {
    const pulseSize = Math.sin(Date.now() / 150) * 3;
    ctx.strokeStyle = "#00e5ff";
    ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 200) * 0.2;
    ctx.beginPath();
    ctx.arc(cx, cy, player.w + 5 + pulseSize, 0, Math.PI * 2);
    ctx.stroke();
    // Inner shield glow
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#00e5ff";
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  
  ctx.restore();
}

function drawAlly() {
  if (!ally.active) return;
  ctx.save();
  ctx.strokeStyle = ally.color;
  ctx.lineWidth = 2;
  ctx.shadowColor = ally.color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(ally.x + ally.w / 2, ally.y);
  ctx.lineTo(ally.x + ally.w, ally.y + ally.h);
  ctx.lineTo(ally.x + ally.w / 2, ally.y + ally.h * 0.65);
  ctx.lineTo(ally.x, ally.y + ally.h);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawPlayer2() {
  if (!player2.active) return;
  
  // Blinking effect when invincible
  if (player2.invincibleTimer > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
    return; // Skip drawing every other frame for blink effect
  }
  
  ctx.save();
  const cx = player2.x + player2.w / 2;
  const cy = player2.y + player2.h / 2;
  
  // Engine flame (red/orange)
  const flameHeight = 8 + Math.random() * 6;
  ctx.fillStyle = "#ff6a00";
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(player2.x + player2.w * 0.3, player2.y + player2.h);
  ctx.lineTo(cx, player2.y + player2.h + flameHeight);
  ctx.lineTo(player2.x + player2.w * 0.7, player2.y + player2.h);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  
  // Main ship (red color) - glow more when invincible
  const isInvincible = player2.invincibleTimer > 0;
  ctx.strokeStyle = isInvincible ? "#ffffff" : player2.color;
  ctx.lineWidth = isInvincible ? 3 : 2;
  ctx.shadowColor = isInvincible ? "#ffffff" : player2.color;
  ctx.shadowBlur = isInvincible ? 20 : 12;
  ctx.beginPath();
  ctx.moveTo(cx, player2.y);
  ctx.lineTo(player2.x + player2.w, player2.y + player2.h);
  ctx.lineTo(cx, player2.y + player2.h * 0.65);
  ctx.lineTo(player2.x, player2.y + player2.h);
  ctx.closePath();
  ctx.stroke();
  
  // P2 indicator
  ctx.font = "bold 10px Consolas";
  ctx.fillStyle = isInvincible ? "#ffffff" : "#ff6a6a";
  ctx.textAlign = "center";
  ctx.fillText("P2", cx, player2.y - 8);
  
  // Invincibility shield effect
  if (isInvincible) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, player2.w + 5, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawP2Bullets() {
  ctx.fillStyle = "#ff6a6a";
  ctx.shadowColor = "#ff6a6a";
  ctx.shadowBlur = 8;
  for (const b of p2Bullets) {
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }
  ctx.shadowBlur = 0;
}

function drawBullets() {
  for (const b of bullets) {
    ctx.fillStyle = b.color || "#7fffe3";
    ctx.shadowColor = b.color || "#7fffe3";
    ctx.shadowBlur = 8;
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }
  ctx.shadowBlur = 0;
}

function drawLasers() {
  for (const l of lasers) {
    ctx.fillStyle = l.color;
    ctx.shadowColor = l.color;
    ctx.shadowBlur = 20;
    ctx.globalAlpha = l.life * 10;
    ctx.fillRect(l.x, l.y, l.w, l.h);
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

function drawRockets() {
  for (const r of rockets) {
    ctx.fillStyle = r.color;
    ctx.shadowColor = r.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(r.x + r.w / 2, r.y);
    ctx.lineTo(r.x + r.w, r.y + r.h);
    ctx.lineTo(r.x, r.y + r.h);
    ctx.closePath();
    ctx.fill();
    // Trail
    ctx.fillStyle = "#ff6a00";
    ctx.globalAlpha = 0.5;
    ctx.fillRect(r.x + r.w / 4, r.y + r.h, r.w / 2, 10);
    ctx.globalAlpha = 1;
  }
  ctx.shadowBlur = 0;
}

function drawHomingMissiles() {
  for (const m of homingMissiles) {
    ctx.save();
    ctx.translate(m.x + m.w / 2, m.y + m.h / 2);
    ctx.rotate(m.angle + Math.PI / 2);
    ctx.fillStyle = m.color;
    ctx.shadowColor = m.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, -m.h / 2);
    ctx.lineTo(m.w / 2, m.h / 2);
    ctx.lineTo(-m.w / 2, m.h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.shadowBlur = 0;
}

function drawAllyBullets() {
  ctx.fillStyle = "#6de2ff";
  ctx.shadowColor = "#6de2ff";
  ctx.shadowBlur = 8;
  for (const b of allyBullets) {
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }
  ctx.shadowBlur = 0;
}

function drawEnemyBullets() {
  for (const b of enemyBullets) {
    ctx.fillStyle = b.color;
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.w / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

function drawEnemies() {
  for (const enemy of enemies) {
    ctx.save();
    
    if (enemy.type === "boss") {
      // Boss drawing
      ctx.strokeStyle = enemy.phase === 3 ? "#ff00ff" : enemy.phase === 2 ? "#ff6a00" : "#ff2255";
      ctx.lineWidth = 3;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 20;
      ctx.strokeRect(enemy.x, enemy.y, enemy.w, enemy.h);
      ctx.strokeRect(enemy.x + 5, enemy.y + 5, enemy.w - 10, enemy.h - 10);
      // Core
      ctx.fillStyle = ctx.strokeStyle;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(enemy.x + 10, enemy.y + 10, enemy.w - 20, enemy.h - 20);
      ctx.globalAlpha = 1;
    } else {
      // Normal enemy
      ctx.strokeStyle = enemy.type === "shielded" ? "#00e5ff" : 
                        enemy.type === "shooter" ? "#ff6a00" : 
                        enemy.type === "zigzag" ? "#b000ff" : "#2de38b";
      ctx.lineWidth = 2;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 10;
      ctx.strokeRect(enemy.x, enemy.y, enemy.w, enemy.h);
      
      // Shield indicator
      if (enemy.shield > 0) {
        ctx.strokeStyle = "#00e5ff";
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(enemy.x - 4, enemy.y - 4, enemy.w + 8, enemy.h + 8);
        ctx.setLineDash([]);
      }
    }
    
    ctx.restore();
  }
}

function drawPowerups() {
  const labels = { life: "L", shield: "S", speed: "SP", rapid: "R", spread: "W" };
  const colors = { life: "#ff4488", shield: "#00e5ff", speed: "#ffcc00", rapid: "#00ff9a", spread: "#b000ff" };
  
  for (const p of powerups) {
    ctx.strokeStyle = colors[p.type] || "#00ff9a";
    ctx.fillStyle = colors[p.type] || "#00ff9a";
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 10;
    ctx.strokeRect(p.x, p.y, p.w, p.h);
    ctx.font = "bold 10px Consolas";
    ctx.textAlign = "center";
    ctx.fillText(labels[p.type] || "?", p.x + p.w / 2, p.y + p.h / 2 + 4);
  }
  ctx.shadowBlur = 0;
  ctx.textAlign = "left";
}

function drawParticles() {
  for (const p of particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3 + (1 - p.life) * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

function drawTrails() {
  for (const t of trails) {
    ctx.fillStyle = t.color;
    ctx.globalAlpha = t.life * 5;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.size * t.life * 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawLightnings() {
  for (const l of lightnings) {
    ctx.strokeStyle = l.color;
    ctx.lineWidth = 2;
    ctx.shadowColor = l.color;
    ctx.shadowBlur = 15;
    ctx.globalAlpha = l.life * 7;
    ctx.beginPath();
    ctx.moveTo(l.segments[0].x, l.segments[0].y);
    for (let i = 1; i < l.segments.length; i++) {
      ctx.lineTo(l.segments[i].x, l.segments[i].y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

function drawDamageNumbers() {
  for (const d of damageNumbers) {
    ctx.font = `bold ${d.size}px Consolas`;
    ctx.textAlign = "center";
    ctx.fillStyle = d.color;
    ctx.shadowColor = d.color;
    ctx.shadowBlur = 10;
    ctx.globalAlpha = Math.min(1, d.life * 2);
    ctx.fillText(d.text, d.x, d.y);
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.textAlign = "left";
}

// ============================================================================
// SPAWNING LOGIC
// ============================================================================
function updateSpawns(delta) {
  // Check for boss spawn
  if (!state.bossActive && state.level > 0 && state.level % 5 === 0 && state.bossLevel !== state.level) {
    spawnBoss();
    return;
  }
  
  if (state.bossActive) return;
  
  state.enemyTimer += delta;
  if (state.enemyTimer >= state.spawnInterval) {
    state.enemyTimer = 0;
    spawnEnemy();
  }
}

// ============================================================================
// MAIN GAME LOOP
// ============================================================================
function tick(timestamp) {
  if (!state.lastTime) state.lastTime = timestamp;
  let delta = Math.min(0.033, (timestamp - state.lastTime) / 1000);
  state.lastTime = timestamp;
  
  // Apply slow-motion
  const slowMoActive = state.slowMo > 0;
  if (slowMoActive) {
    delta *= state.slowMoFactor;
  }

  if (!state.inMenu && !state.inShop && !state.inStory && state.running && !state.paused) {
    updateRain(delta);
    updatePlayer(delta);
    updateBullets(delta);
    updateLasers(delta);
    updateRockets(delta);
    updateHomingMissiles(delta);
    updateAlly(delta);
    updateAllyBullets(delta);
    updatePlayer2(delta);
    updateP2Bullets(delta);
    
    // Online multiplayer sync
    if (state.onlineMultiplayer && netState.connected) {
      sendPlayerUpdate();
      updateOnlineRemotePlayer(delta);
      // Host sends game state periodically
      if (netState.isHost && Date.now() % 500 < 20) {
        sendGameState();
      }
    }
    
    updateEnemyBullets(delta);
    updateEnemies(delta);
    updatePowerups(delta);
    updateParticles(delta);
    updateSpawns(delta);
    updateEffects(slowMoActive ? delta / state.slowMoFactor : delta);
    checkCollisions();
    checkPowerupPickup();
    updateHud();
  }

  // Apply screen shake
  ctx.save();
  if (state.screenShake > 0) {
    const shakeX = (Math.random() - 0.5) * state.screenShakeIntensity;
    const shakeY = (Math.random() - 0.5) * state.screenShakeIntensity;
    ctx.translate(shakeX, shakeY);
  }

  drawRain();
  drawTrails();
  drawLasers();
  drawBullets();
  drawRockets();
  drawHomingMissiles();
  drawAllyBullets();
  drawEnemyBullets();
  drawEnemies();
  drawPowerups();
  drawAlly();
  drawPlayer2();
  drawP2Bullets();
  drawPlayer();
  drawLightnings();
  drawParticles();
  drawDamageNumbers();
  
  ctx.restore();
  
  // Flash effect
  if (state.flash > 0) {
    ctx.fillStyle = state.flashColor;
    ctx.globalAlpha = state.flash * 5;
    ctx.fillRect(0, 0, state.width, state.height);
    ctx.globalAlpha = 1;
  }
  
  // Slow-mo visual effect
  if (slowMoActive) {
    ctx.fillStyle = "rgba(0, 255, 255, 0.05)";
    ctx.fillRect(0, 0, state.width, state.height);
  }

  requestAnimationFrame(tick);
}

// ============================================================================
// INPUT HANDLING
// ============================================================================
window.addEventListener("keydown", (event) => {
  initAudio();
  
  // Weapon switching
  if (event.key >= "1" && event.key <= "4") {
    const weaponId = parseInt(event.key);
    const weapon = WEAPONS.find(w => w.id === weaponId);
    if (weapon && weapon.unlocked) {
      state.currentWeapon = weaponId;
      updateHud();
    }
    return;
  }
  
  if (event.code === "KeyM") {
    if (!state.inMenu) openMenu();
    return;
  }
  
  if (event.code === "KeyB") {
    if (!state.inMenu && !state.inShop) {
      openShop();
    } else if (state.inShop) {
      closeShop();
    }
    return;
  }
  
  if (event.code === "KeyO") {
    toggleAdmin();
    return;
  }
  
  if (state.inMenu) {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      startGame();
    }
    return;
  }
  
  if (event.code === "KeyI") {
    if (state.level >= state.aiUnlockLevel) {
      state.aiEnabled = !state.aiEnabled;
      ally.active = state.aiEnabled;
      if (ally.active && ally.lives <= 0) ally.lives = 3;
      checkAchievement("ai_friend", state.aiEnabled);
    }
    updateHud();
    return;
  }
  
  if (event.code === "KeyP") {
    togglePause();
    return;
  }
  
  if (event.code === "KeyR") {
    reset();
    return;
  }
  
  if (event.code === "Space") event.preventDefault();
  if (event.code === "Enter") event.preventDefault();
  
  // In multiplayer mode, separate P1 and P2 keys
  if (state.multiplayer) {
    const p2KeySet = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Numpad0"];
    if (p2KeySet.includes(event.code)) {
      p2Keys.add(event.code);
    } else {
      state.keys.add(event.code);
    }
  } else {
    state.keys.add(event.code);
  }
});

window.addEventListener("keyup", (event) => {
  state.keys.delete(event.code);
  p2Keys.delete(event.code);
});

window.addEventListener("blur", () => {
  state.keys.clear();
  p2Keys.clear();
});

window.addEventListener("resize", () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  resize();
});

// ============================================================================
// TOUCH CONTROLS - Virtual Joystick
// ============================================================================

// Joystick setup
if (joystickZone) {
  joystickZone.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = joystickBase.getBoundingClientRect();
    joystick.active = true;
    joystick.startX = rect.left + rect.width / 2;
    joystick.startY = rect.top + rect.height / 2;
    joystick.currentX = touch.clientX;
    joystick.currentY = touch.clientY;
    updateJoystick();
    joystickStick.classList.add("active");
  }, { passive: false });

  joystickZone.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!joystick.active) return;
    const touch = e.touches[0];
    joystick.currentX = touch.clientX;
    joystick.currentY = touch.clientY;
    updateJoystick();
  }, { passive: false });

  const endJoystick = (e) => {
    e.preventDefault();
    joystick.active = false;
    joystick.dx = 0;
    joystick.dy = 0;
    joystickStick.style.transform = "translate(-50%, -50%)";
    joystickStick.classList.remove("active");
    state.touchKeys.delete("left");
    state.touchKeys.delete("right");
    state.touchKeys.delete("up");
    state.touchKeys.delete("down");
  };

  joystickZone.addEventListener("touchend", endJoystick, { passive: false });
  joystickZone.addEventListener("touchcancel", endJoystick, { passive: false });
}

function updateJoystick() {
  let dx = joystick.currentX - joystick.startX;
  let dy = joystick.currentY - joystick.startY;
  const distance = Math.hypot(dx, dy);
  
  // Clamp to max distance
  if (distance > joystick.maxDistance) {
    dx = (dx / distance) * joystick.maxDistance;
    dy = (dy / distance) * joystick.maxDistance;
  }
  
  // Update stick position
  joystickStick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  
  // Normalize for input (-1 to 1)
  joystick.dx = dx / joystick.maxDistance;
  joystick.dy = dy / joystick.maxDistance;
  
  // Update touch keys based on joystick position
  const threshold = 0.3;
  
  state.touchKeys.delete("left");
  state.touchKeys.delete("right");
  state.touchKeys.delete("up");
  state.touchKeys.delete("down");
  
  if (joystick.dx < -threshold) state.touchKeys.add("left");
  if (joystick.dx > threshold) state.touchKeys.add("right");
  if (joystick.dy < -threshold) state.touchKeys.add("up");
  if (joystick.dy > threshold) state.touchKeys.add("down");
}

// Fire button - continuous fire while held
if (touchFire) {
  let fireInterval = null;
  
  touchFire.addEventListener("touchstart", (e) => {
    e.preventDefault();
    touchFire.classList.add("active");
    state.touchKeys.add("fire");
    // Continuous fire at a fixed rate
    fireInterval = setInterval(() => {
      state.touchKeys.add("fire");
    }, 50);
  }, { passive: false });

  const endFire = (e) => {
    e.preventDefault();
    touchFire.classList.remove("active");
    state.touchKeys.delete("fire");
    if (fireInterval) {
      clearInterval(fireInterval);
      fireInterval = null;
    }
  };

  touchFire.addEventListener("touchend", endFire, { passive: false });
  touchFire.addEventListener("touchcancel", endFire, { passive: false });
  touchFire.addEventListener("touchleave", endFire, { passive: false });
}

// Weapon switch button
if (touchWeapon) {
  touchWeapon.addEventListener("touchstart", (e) => {
    e.preventDefault();
    touchWeapon.classList.add("active");
    switchWeapon();
  }, { passive: false });

  touchWeapon.addEventListener("touchend", (e) => {
    e.preventDefault();
    touchWeapon.classList.remove("active");
  }, { passive: false });
}

// ============================================================================
// ADMIN PANEL
// ============================================================================
function toggleAdmin(forceOpen) {
  const isOpen = !adminPanel.classList.contains("hidden");
  if (forceOpen === true || (!isOpen && forceOpen !== false)) {
    adminWasPaused = state.paused;
    if (!state.inMenu) state.paused = true;
    adminPanel.classList.remove("hidden");
    populateAdmin();
  } else {
    adminPanel.classList.add("hidden");
    if (!state.inMenu && !adminWasPaused) state.paused = false;
  }
}

function populateAdmin() {
  document.getElementById("admin-level").value = state.level;
  document.getElementById("admin-lives").value = state.lives;
  document.getElementById("admin-score").value = state.score;
  document.getElementById("admin-credits").value = state.credits;
  document.getElementById("admin-spawn").value = state.spawnInterval;
  document.getElementById("admin-aiunlock").value = state.aiUnlockLevel;
  document.getElementById("admin-ailives").value = ally.lives;
  document.getElementById("admin-ai").checked = state.aiEnabled;
  document.getElementById("admin-weapon").value = state.currentWeapon;
  document.getElementById("admin-rapidlevel").value = state.rapidLevel;
  document.getElementById("admin-rapidtime").value = Math.ceil(state.rapid);
  document.getElementById("admin-shieldtime").value = Math.ceil(state.shield);
  document.getElementById("admin-speedtime").value = Math.ceil(state.speed);
  document.getElementById("admin-spreadtime").value = Math.ceil(state.spread);
  document.getElementById("admin-sfx").value = audioState.sfxVolume;
  document.getElementById("admin-bgm").value = audioState.bgmVolume;
}

function applyAdminSettings() {
  const toNum = (id, def) => parseFloat(document.getElementById(id)?.value) || def;
  
  state.level = Math.max(1, Math.floor(toNum("admin-level", 1)));
  state.lives = Math.max(0, Math.floor(toNum("admin-lives", 3)));
  state.score = Math.max(0, Math.floor(toNum("admin-score", 0)));
  state.credits = Math.max(0, Math.floor(toNum("admin-credits", 0)));
  state.spawnInterval = Math.max(0.2, toNum("admin-spawn", 1.2));
  state.aiUnlockLevel = Math.max(1, Math.floor(toNum("admin-aiunlock", 2)));
  ally.lives = Math.max(0, Math.floor(toNum("admin-ailives", 3)));
  state.aiEnabled = document.getElementById("admin-ai")?.checked || false;
  ally.active = state.aiEnabled;
  state.currentWeapon = Math.min(4, Math.max(1, Math.floor(toNum("admin-weapon", 1))));
  state.rapidLevel = Math.max(0, Math.floor(toNum("admin-rapidlevel", 0)));
  state.rapid = Math.max(0, toNum("admin-rapidtime", 0));
  state.shield = Math.max(0, toNum("admin-shieldtime", 0));
  state.speed = Math.max(0, toNum("admin-speedtime", 0));
  state.spread = Math.max(0, toNum("admin-spreadtime", 0));
  audioState.sfxVolume = Math.max(0, Math.min(1, toNum("admin-sfx", 1)));
  audioState.bgmVolume = Math.max(0, Math.min(1, toNum("admin-bgm", 1)));
  
  if (audioState.bgmMaster) {
    audioState.bgmMaster.gain.setValueAtTime(audioState.bgmVolume, audioCtx.currentTime);
  }
  
  // Save to config
  config.level = state.level;
  config.lives = state.lives;
  config.score = state.score;
  config.credits = state.credits;
  config.spawnInterval = state.spawnInterval;
  config.aiUnlockLevel = state.aiUnlockLevel;
  config.aiEnabled = state.aiEnabled;
  config.aiLives = ally.lives;
  config.rapidLevel = state.rapidLevel;
  config.rapidTime = state.rapid;
  config.shieldTime = state.shield;
  config.speedTime = state.speed;
  config.spreadTime = state.spread;
  
  updateHud();
}

function resetAllProgress() {
  if (!confirm("Willst du wirklich ALLES zurücksetzen?\n\n- Highscores\n- Achievements\n- Gekaufte Upgrades\n- Aktuelles Spiel")) {
    return;
  }
  
  // Clear localStorage
  localStorage.removeItem("m4trix_highscores");
  localStorage.removeItem("m4trix_achievements");
  localStorage.removeItem("m4trix_upgrades");
  
  // Reset in-memory arrays
  highscores = [];
  unlockedAchievements = [];
  ownedUpgrades = [];
  
  // Reset config to defaults
  config.level = 1;
  config.lives = 3;
  config.score = 0;
  config.credits = 0;
  config.spawnInterval = 1.2;
  config.aiUnlockLevel = 2;
  config.aiEnabled = false;
  config.aiLives = 3;
  config.rapidLevel = 0;
  config.rapidTime = 0;
  config.shieldTime = 0;
  config.speedTime = 0;
  config.spreadTime = 0;
  
  // Reset current game state
  reset();
  
  // Close admin panel and show confirmation
  toggleAdmin(false);
  alert("✓ Spielstand wurde komplett zurückgesetzt!");
  
  // Reload admin inputs
  loadAdminSettings();
}

// ============================================================================
// ONLINE LOBBY FUNCTIONS (Socket.io)
// ============================================================================
function connectToServer() {
  return new Promise((resolve, reject) => {
    console.log("Connecting to server:", SERVER_URL);
    
    socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5
    });
    
    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
      resolve(socket.id);
    });
    
    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
      reject(new Error("Server nicht erreichbar"));
    });
    
    socket.on("disconnect", (reason) => {
      console.log("⚠️ Disconnected:", reason);
      handleDisconnect();
    });
    
    // Lobby events
    socket.on("lobby_created", (data) => {
      console.log("Lobby created:", data.code);
      netState.lobbyCode = data.code;
      lobbyCodeEl.textContent = data.code;
    });
    
    socket.on("guest_joined", (data) => {
      console.log("Guest joined:", data.guestId);
      netState.guestConnected = true;
      netState.connected = true;
      lobbyGuest.textContent = "👤 Spieler verbunden!";
      lobbyGuest.classList.remove("waiting");
      lobbyGuest.classList.add("connected");
      lobbyStartGame.disabled = false;
      showConnectionStatus("🔗 Spieler verbunden!", "connected");
    });
    
    socket.on("joined_lobby", (data) => {
      console.log("Joined lobby:", data.code);
      netState.connected = true;
      lobbyStatus.classList.add("hidden");
      lobbyWaiting.classList.remove("hidden");
      showConnectionStatus("🔗 Verbunden!", "connected");
    });
    
    socket.on("join_error", (data) => {
      console.error("Join error:", data.message);
      showJoinError(data.message);
    });
    
    socket.on("game_start", () => {
      console.log("Game starting!");
      if (!netState.isHost) {
        lobbyPanel.classList.add("hidden");
        state.inMenu = false;
        state.multiplayer = true;
        state.onlineMultiplayer = true;
        reset();
        initAudio();
        showConnectionStatus("🔗 Online Spiel", "connected");
      }
    });
    
    socket.on("player_update", (data) => {
      netState.remotePlayer.x = data.x;
      netState.remotePlayer.y = data.y;
      netState.remotePlayer.lives = data.lives;
    });
    
    socket.on("bullet_fired", (data) => {
      const bullet = {
        x: data.x,
        y: data.y,
        w: 6,
        h: 12,
        speed: 520,
        damage: 1,
        color: data.isHost ? "#00ff9a" : "#ff6a6a",
        remote: true,
      };
      if (netState.isHost) {
        p2Bullets.push(bullet);
      } else {
        bullets.push(bullet);
      }
    });
    
    socket.on("game_state", (data) => {
      if (!netState.isHost) {
        syncGameState(data);
      }
    });
    
    socket.on("enemy_killed", (data) => {
      state.score = data.score;
      state.killsThisLevel = data.kills;
    });
    
    socket.on("powerup_collected", (data) => {
      const idx = powerups.findIndex(p => p.id === data.id);
      if (idx >= 0) powerups.splice(idx, 1);
    });
    
    socket.on("player_disconnected", (data) => {
      console.log("Player disconnected, was host:", data.isHost);
      handleDisconnect();
    });
    
    // Timeout
    setTimeout(() => {
      if (!socket.connected) {
        reject(new Error("Verbindungs-Timeout"));
      }
    }, 10000);
  });
}

function syncGameState(gameState) {
  if (gameState.enemies) {
    enemies.length = 0;
    gameState.enemies.forEach(e => enemies.push(e));
  }
  if (gameState.powerups) {
    powerups.length = 0;
    gameState.powerups.forEach(p => powerups.push(p));
  }
  state.score = gameState.score || state.score;
  state.level = gameState.level || state.level;
  state.bossActive = gameState.bossActive || false;
}

function sendNetworkData(type, data = {}) {
  if (socket && socket.connected) {
    socket.emit(type, data);
  }
}

function sendPlayerUpdate() {
  const now = Date.now();
  if (now - netState.lastSync < netState.syncInterval) return;
  netState.lastSync = now;
  
  // Host sends player position, Guest sends player2 position
  if (netState.isHost) {
    sendNetworkData("player_update", {
      x: player.x,
      y: player.y,
      lives: state.lives,
    });
  } else {
    sendNetworkData("player_update", {
      x: player2.x,
      y: player2.y,
      lives: player2.lives,
    });
  }
}

function sendGameState() {
  if (!netState.isHost) return;
  
  sendNetworkData("game_state", {
    enemies: enemies.map(e => ({ ...e })),
    powerups: powerups.map(p => ({ ...p })),
    score: state.score,
    level: state.level,
    bossActive: state.bossActive,
  });
}

function handleDisconnect() {
  netState.connected = false;
  netState.guestConnected = false;
  
  if (state.onlineMultiplayer && !state.inMenu) {
    showConnectionStatus("❌ Verbindung verloren", "disconnected");
    setTimeout(() => {
      openMenu();
      state.onlineMultiplayer = false;
    }, 2000);
  }
  
  if (lobbyHost && !lobbyHost.classList.contains("hidden")) {
    lobbyGuest.textContent = "⏳ Warte auf Spieler...";
    lobbyGuest.classList.add("waiting");
    lobbyGuest.classList.remove("connected");
    lobbyStartGame.disabled = true;
  }
}

function showConnectionStatus(text, type) {
  connectionText.textContent = text;
  connectionStatus.className = "connection-status " + type;
  connectionStatus.classList.remove("hidden");
}

function hideConnectionStatus() {
  connectionStatus.classList.add("hidden");
}

function openLobby() {
  menu.classList.add("hidden");
  lobbyPanel.classList.remove("hidden");
  lobbyStatus.textContent = "Verbinde zum Server...";
  lobbyMenu.classList.add("hidden");
  lobbyHost.classList.add("hidden");
  lobbyJoinForm.classList.add("hidden");
  lobbyWaiting.classList.add("hidden");
  
  // Cleanup existing socket
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  
  // Connect to server
  connectToServer().then(() => {
    lobbyStatus.classList.add("hidden");
    lobbyMenu.classList.remove("hidden");
  }).catch(err => {
    console.error("Failed to connect:", err);
    lobbyStatus.textContent = "❌ " + err.message;
  });
}

function closeLobby() {
  lobbyPanel.classList.add("hidden");
  menu.classList.remove("hidden");
  
  if (socket) {
    socket.emit("leave_lobby");
    socket.disconnect();
    socket = null;
  }
  
  netState.connected = false;
  netState.isHost = false;
  netState.guestConnected = false;
  hideConnectionStatus();
}

function createLobby() {
  netState.isHost = true;
  
  lobbyMenu.classList.add("hidden");
  lobbyHost.classList.remove("hidden");
  lobbyCodeEl.textContent = "...";
  lobbyGuest.textContent = "⏳ Warte auf Spieler...";
  lobbyGuest.classList.add("waiting");
  lobbyGuest.classList.remove("connected");
  lobbyStartGame.disabled = true;
  
  socket.emit("create_lobby");
}

function showJoinForm() {
  lobbyMenu.classList.add("hidden");
  lobbyJoinForm.classList.remove("hidden");
  lobbyCodeInput.value = "";
  lobbyCodeInput.focus();
}

function joinLobby() {
  const code = lobbyCodeInput.value.toUpperCase().trim();
  if (code.length !== 6) {
    lobbyCodeInput.style.borderColor = "var(--matrix-red)";
    showJoinError("Code muss 6 Zeichen haben!");
    return;
  }
  
  lobbyCodeInput.style.borderColor = "";
  netState.isHost = false;
  netState.lobbyCode = code;
  
  lobbyJoinForm.classList.add("hidden");
  lobbyStatus.textContent = "🔗 Verbinde zu Lobby " + code + "...";
  lobbyStatus.classList.remove("hidden");
  
  socket.emit("join_lobby", { code });
}

function showJoinError(message) {
  lobbyStatus.textContent = "❌ " + message;
  lobbyStatus.classList.remove("hidden");
  lobbyJoinForm.classList.remove("hidden");
  lobbyCodeInput.style.borderColor = "var(--matrix-red)";
  
  setTimeout(() => {
    lobbyCodeInput.style.borderColor = "";
  }, 3000);
}

function startOnlineGame() {
  if (!netState.isHost || !netState.guestConnected) return;
  
  socket.emit("start_game");
  
  lobbyPanel.classList.add("hidden");
  state.inMenu = false;
  state.multiplayer = true;
  state.onlineMultiplayer = true;
  reset();
  initAudio();
  
  showConnectionStatus("🔗 Online Spiel", "connected");
}

function leaveLobby() {
  closeLobby();
}

function updateOnlineRemotePlayer(delta) {
  if (netState.isHost) {
    // Host receives guest position → update player2
    player2.x += (netState.remotePlayer.x - player2.x) * 0.3;
    player2.y += (netState.remotePlayer.y - player2.y) * 0.3;
    player2.lives = netState.remotePlayer.lives;
    player2.active = true;
  } else {
    // Guest receives host position → update player (the green ship they see)
    player.x += (netState.remotePlayer.x - player.x) * 0.3;
    player.y += (netState.remotePlayer.y - player.y) * 0.3;
    // Note: Guest sees host as the "main" green player
  }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================
startBtn?.addEventListener("click", () => startGame());
multiplayerBtn?.addEventListener("click", () => startMultiplayer());
onlineBtn?.addEventListener("click", () => openLobby());
lobbyCreate?.addEventListener("click", () => createLobby());
lobbyJoin?.addEventListener("click", () => showJoinForm());
lobbyBack?.addEventListener("click", () => closeLobby());
lobbyConnect?.addEventListener("click", () => joinLobby());
lobbyCancelHost?.addEventListener("click", () => closeLobby());
lobbyCancelJoin?.addEventListener("click", () => { lobbyJoinForm.classList.add("hidden"); lobbyMenu.classList.remove("hidden"); });
lobbyStartGame?.addEventListener("click", () => startOnlineGame());
lobbyLeave?.addEventListener("click", () => leaveLobby());
lobbyCodeInput?.addEventListener("keydown", (e) => { if (e.key === "Enter") joinLobby(); });
storyBtn?.addEventListener("click", () => { startStory(1); });
achievementsBtn?.addEventListener("click", () => { renderAchievements(); achievementsPanel.classList.remove("hidden"); });
highscoreBtn?.addEventListener("click", () => { renderHighscores(); highscoresPanel.classList.remove("hidden"); });
adminBtn?.addEventListener("click", () => toggleAdmin(true));
adminApply?.addEventListener("click", () => applyAdminSettings());
adminClose?.addEventListener("click", () => toggleAdmin(false));
adminReset?.addEventListener("click", () => resetAllProgress());
shopClose?.addEventListener("click", () => closeShop());
achievementsClose?.addEventListener("click", () => achievementsPanel.classList.add("hidden"));
highscoreClose?.addEventListener("click", () => highscoresPanel.classList.add("hidden"));
storyNext?.addEventListener("click", () => nextStoryScene());
storySkip?.addEventListener("click", () => endStory());
levelShop?.addEventListener("click", () => { levelComplete.classList.add("hidden"); openShop(); });
levelContinue?.addEventListener("click", () => continueFromLevelComplete());

// Game Over buttons
restartBtn?.addEventListener("click", () => {
  overlay.classList.add("hidden");
  if (overlayButtons) overlayButtons.classList.add("hidden");
  reset();
});

menuBtn?.addEventListener("click", () => {
  overlay.classList.add("hidden");
  if (overlayButtons) overlayButtons.classList.add("hidden");
  openMenu();
});

// ============================================================================
// INIT
// ============================================================================
resize();
updateHud();
requestAnimationFrame(tick);
 