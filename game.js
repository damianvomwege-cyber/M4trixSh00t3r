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
const resumeBtn = document.getElementById("resume-btn");
const restartBtn = document.getElementById("restart-btn");
const shopOverlayBtn = document.getElementById("shop-overlay-btn");
const adminOverlayBtn = document.getElementById("admin-overlay-btn");
const menuBtn = document.getElementById("menu-btn");
const adminFloatingBtn = document.getElementById("admin-floating-btn");
const menu = document.getElementById("menu");
const startBtn = document.getElementById("start-btn");
const multiplayerBtn = document.getElementById("multiplayer-btn");
const storyBtn = document.getElementById("story-btn");
const chatBtn = document.getElementById("chat-btn");
const chatOverlay = document.getElementById("chat");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatClose = document.getElementById("chat-close");
const chatApiStatus = document.getElementById("chat-api-status");
const chatApiToggle = document.getElementById("chat-api-toggle");
const chatApiInput = document.getElementById("chat-api-input");
const chatApiKey = document.getElementById("chat-api-key");
const chatApiSave = document.getElementById("chat-api-save");
const chatApiClear = document.getElementById("chat-api-clear");
const chatApiProvider = document.getElementById("chat-api-provider");
const p2StatsEl = document.getElementById("p2-stats");
const p2LivesEl = document.getElementById("p2-lives");
const achievementsBtn = document.getElementById("achievements-btn");
const highscoreBtn = document.getElementById("highscore-btn");
const savesBtn = document.getElementById("saves-btn");
const savesOverlayBtn = document.getElementById("saves-overlay-btn");
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
const savesPanel = document.getElementById("saves");
const savesGrid = document.getElementById("saves-grid");
const savesClose = document.getElementById("saves-close");
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
  touchId: null, // Track the specific touch for multi-touch support
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
  syncInterval: 30, // ms between syncs (faster = smoother)
  remotePlayer: { x: 0, y: 0, targetX: 0, targetY: 0, lives: 3, shooting: false },
  remoteBullets: [],
  interpolationFactor: 0.3, // Smoothing factor for remote player movement
};

// ============================================================================
// WEAPONS SYSTEM
// ============================================================================
const WEAPONS = [
  { id: 1, name: "Blaster", color: "#7fffe3", speed: 520, damage: 1, cooldown: 0.18, spread: 0, unlocked: true, price: 0 },
  { id: 2, name: "Laser", color: "#ff00ff", speed: 800, damage: 2, cooldown: 0.25, spread: 0, unlocked: false, price: 500, desc: "Piercing beam" },
  { id: 3, name: "Rockets", color: "#ff6a00", speed: 350, damage: 5, cooldown: 0.5, spread: 0, unlocked: false, price: 1000, desc: "Explosive damage" },
  { id: 4, name: "Homing", color: "#b000ff", speed: 400, damage: 3, cooldown: 0.35, spread: 0, unlocked: false, price: 2000, desc: "Seeks targets" },
  { id: 5, name: "Shotgun", color: "#ffaa00", speed: 450, damage: 1, cooldown: 0.6, spread: 7, unlocked: false, price: 800, desc: "7 bullet spread" },
  { id: 6, name: "Minigun", color: "#00ff00", speed: 600, damage: 0.5, cooldown: 0.05, spread: 0, unlocked: false, price: 1500, desc: "Super rapid fire" },
  { id: 7, name: "Plasma", color: "#00ffff", speed: 300, damage: 8, cooldown: 0.8, spread: 0, unlocked: false, price: 2500, desc: "Heavy plasma ball" },
  { id: 8, name: "Chain", color: "#ffff00", speed: 550, damage: 2, cooldown: 0.4, spread: 0, unlocked: false, price: 3000, desc: "Chain lightning" },
  { id: 9, name: "Freeze", color: "#88ccff", speed: 400, damage: 1, cooldown: 0.5, spread: 0, unlocked: false, price: 3500, desc: "Slows enemies" },
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
  { id: "weapon_5", name: "Shotgun", icon: "WPN", price: 800, type: "weapon", weaponId: 5 },
  { id: "weapon_6", name: "Minigun", icon: "WPN", price: 1500, type: "weapon", weaponId: 6 },
  { id: "weapon_7", name: "Plasma", icon: "WPN", price: 2500, type: "weapon", weaponId: 7 },
  { id: "weapon_8", name: "Chain Lightning", icon: "WPN", price: 3000, type: "weapon", weaponId: 8 },
  { id: "weapon_9", name: "Freeze", icon: "WPN", price: 3500, type: "weapon", weaponId: 9 },
  { id: "weapon_2", name: "Laser Gun", icon: "🔫", price: 500, type: "weapon", weaponId: 2 },
  { id: "weapon_3", name: "Rockets", icon: "🚀", price: 1000, type: "weapon", weaponId: 3 },
  { id: "weapon_4", name: "Homing Missiles", icon: "🎯", price: 2000, type: "weapon", weaponId: 4 },
  { id: "life_up", name: "Extra Life", icon: "❤️", price: 300, type: "consumable", effect: "life" },
  { id: "shield_up", name: "Shield Boost", icon: "🛡", price: 200, type: "consumable", effect: "shield" },
  { id: "speed_up", name: "Speed Boost", icon: "⚡", price: 150, type: "consumable", effect: "speed" },
  { id: "damage_up", name: "Damage +10%", icon: "💥", price: 800, type: "upgrade", stat: "damage", owned: false },
  { id: "fire_rate", name: "Fire Rate +15%", icon: "🔥", price: 600, type: "upgrade", stat: "firerate", owned: false },
];
const DEFAULT_WEAPON_SHOP_ICON = "WPN";

function ensureWeaponShopItems() {
  WEAPONS.forEach(w => {
    if (w.id === 1) return;
    const exists = SHOP_ITEMS.some(item => item.type === "weapon" && item.weaponId === w.id);
    if (!exists) {
      SHOP_ITEMS.unshift({
        id: `weapon_${w.id}`,
        name: w.name,
        icon: DEFAULT_WEAPON_SHOP_ICON,
        price: w.price || 0,
        type: "weapon",
        weaponId: w.id,
      });
    }
  });
}

ensureWeaponShopItems();

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
  // Multiplayer respawn
  p1RespawnTimer: 0,
  p2RespawnTimer: 0,
  p1Dead: false,
  p1Invincible: 0, // Invincibility timer for P1
  // Admin panel state
  wasRunning: true,
  // Admin cheats
  godMode: false,
  infiniteAmmo: false,
  p2GodMode: false,
  spawningEnabled: true,
  enemySpeedMultiplier: 1,
  enemyHpMultiplier: 1,
  aiDamageMultiplier: 1,
  timeScale: 1,
  freezeEnemies: false,
  forceEnemyType: "random",
  overdrive: false,
  overdriveBackup: null,
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

// Mouse state for aiming
const mouse = {
  x: 0,
  y: 0,
  down: false,
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
  aiCount: 1, // Number of AI helpers (admin only)
  rapidLevel: 0,
  rapidTime: 0,
  shieldTime: 0,
  speedTime: 0,
  spreadTime: 0,
};

// Multiple AI allies support
const allies = [];
const allyColors = ["#6de2ff", "#ff6aff", "#6aff6a", "#ffff6a", "#ff6a6a", "#6affff", "#ff9a6a", "#9a6aff", "#6aff9a", "#ff6a9a"];

function createAlly(index = 0) {
  return {
    x: 100 + (index * 60),
    y: state.height - 100,
    w: 22,
    h: 22,
    speed: 220,
    baseCooldown: 0.22,
    cooldown: 0,
    color: allyColors[index % allyColors.length],
    active: true,
    lives: 3,
    index: index
  };
}

function initAllies(count = 1) {
  allies.length = 0;
  for (let i = 0; i < count; i++) {
    allies.push(createAlly(i));
  }
}

// For backwards compatibility
const ally = { active: false, lives: 0 };

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
let p2CurrentWeapon = 1; // Player 2's current weapon

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
    const activeAllies = allies.filter(a => a.active).length;
    aiEl.textContent = `AI: ${state.aiEnabled ? `On (${activeAllies})` : "Off"}`;
  }
  const totalAllyLives = allies.reduce((sum, a) => sum + (a.active ? a.lives : 0), 0);
  aiLivesEl.textContent = `AI Lives: ${state.aiEnabled && allies.some(a => a.active) ? totalAllyLives : "-"}`;
  
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
    const p2Weapon = WEAPONS.find(w => w.id === p2CurrentWeapon) || WEAPONS[0];
    p2LivesEl.textContent = `P2 Lives: ${player2.active ? player2.lives : "0"} | ${p2Weapon.name}`;
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

function getShopItems() {
  const weaponOverrides = new Map();
  SHOP_ITEMS.filter(item => item.type === "weapon").forEach(item => {
    weaponOverrides.set(item.weaponId, item);
  });
  const weaponItems = WEAPONS.filter(w => w.id !== 1).map(w => {
    const override = weaponOverrides.get(w.id);
    return {
      id: override?.id || `weapon_${w.id}`,
      name: override?.name || w.name,
      icon: override?.icon || DEFAULT_WEAPON_SHOP_ICON,
      price: override?.price ?? w.price ?? 0,
      type: "weapon",
      weaponId: w.id,
    };
  });
  const otherItems = SHOP_ITEMS.filter(item => item.type !== "weapon");
  return [...weaponItems, ...otherItems];
}

function renderShop() {
  shopCredits.textContent = `Credits: ${state.credits}`;
  const items = getShopItems();
  shopGrid.innerHTML = items.map(item => {
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
  const item = getShopItems().find(i => i.id === itemId);
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
// SAVE / LOAD
// ============================================================================
const SAVE_SLOT_COUNT = 4;
const SAVE_STORAGE_KEY = "m4trix_save_slots";
let savesReturnToOverlay = false;

function getSaveSlots() {
  let slots = [];
  try {
    slots = JSON.parse(localStorage.getItem(SAVE_STORAGE_KEY) || "[]");
  } catch (err) {
    slots = [];
  }
  const filled = [];
  for (let i = 0; i < SAVE_SLOT_COUNT; i++) {
    const slot = slots[i] || {};
    filled.push({
      name: slot.name || `Slot ${i + 1}`,
      timestamp: slot.timestamp || 0,
      data: slot.data || null,
    });
  }
  return filled;
}

function setSaveSlots(slots) {
  localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(slots));
}

function formatSaveMeta(slot) {
  if (!slot || !slot.data || !slot.data.state) return "Empty";
  const s = slot.data.state;
  const level = s.level ?? 1;
  const score = s.score ?? 0;
  const credits = s.credits ?? 0;
  const dateText = slot.timestamp ? new Date(slot.timestamp).toLocaleString() : "";
  return `Level ${level} | Score ${score} | Credits ${credits}${dateText ? " | " + dateText : ""}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderSaves() {
  if (!savesGrid) return;
  const slots = getSaveSlots();
  savesGrid.innerHTML = slots.map((slot, i) => {
    const hasData = !!slot.data;
    const meta = formatSaveMeta(slot);
    const safeName = escapeHtml(slot.name || `Slot ${i + 1}`);
    const disabledAttr = hasData ? "" : "disabled";
    const emptyClass = hasData ? "" : "empty";
    return `
      <div class="save-slot ${emptyClass}">
        <div class="save-slot-header">
          <input id="save-name-${i}" class="save-name" maxlength="24" value="${safeName}" />
          <div class="save-meta">${meta}</div>
        </div>
        <div class="save-actions">
          <button class="btn btn-small" onclick="saveSlot(${i})">SAVE</button>
          <button class="btn btn-small" onclick="loadSlot(${i})" ${disabledAttr}>LOAD</button>
          <button class="btn btn-small" onclick="renameSlot(${i})" ${disabledAttr}>RENAME</button>
          <button class="btn btn-small btn-danger" onclick="deleteSlot(${i})" ${disabledAttr}>DELETE</button>
        </div>
      </div>
    `;
  }).join("");
}

function captureSaveSnapshot() {
  return {
    config: {
      level: state.level,
      lives: state.lives,
      score: state.score,
      credits: state.credits,
      spawnInterval: state.spawnInterval,
      aiUnlockLevel: state.aiUnlockLevel,
      aiEnabled: state.aiEnabled,
      aiLives: config.aiLives,
      aiCount: config.aiCount,
      rapidLevel: state.rapidLevel,
      rapidTime: state.rapid,
      shieldTime: state.shield,
      speedTime: state.speed,
      spreadTime: state.spread,
    },
    state: {
      level: state.level,
      score: state.score,
      credits: state.credits,
      lives: state.lives,
      spawnInterval: state.spawnInterval,
      rapid: state.rapid,
      rapidLevel: state.rapidLevel,
      shield: state.shield,
      speed: state.speed,
      spread: state.spread,
      aiEnabled: state.aiEnabled,
      aiUnlockLevel: state.aiUnlockLevel,
      currentWeapon: state.currentWeapon,
      combo: state.combo,
      maxCombo: state.maxCombo,
      damageMultiplier: state.damageMultiplier,
      fireRateMultiplier: state.fireRateMultiplier,
      enemySpeedMultiplier: state.enemySpeedMultiplier,
      enemyHpMultiplier: state.enemyHpMultiplier,
      spawningEnabled: state.spawningEnabled,
      aiDamageMultiplier: state.aiDamageMultiplier,
      timeScale: state.timeScale,
      freezeEnemies: state.freezeEnemies,
      forceEnemyType: state.forceEnemyType,
      godMode: state.godMode,
      infiniteAmmo: state.infiniteAmmo,
      p2GodMode: state.p2GodMode,
      multiplayer: state.multiplayer,
    },
    player: {
      x: player.x,
      y: player.y,
      speed: player.speed,
    },
    player2: {
      lives: player2.lives,
      active: player2.active,
      weapon: p2CurrentWeapon,
    },
    weapons: WEAPONS.map(w => ({ id: w.id, unlocked: w.unlocked })),
    ownedUpgrades: [...ownedUpgrades],
    achievements: [...unlockedAchievements],
  };
}

function applySaveSnapshot(snapshot) {
  if (!snapshot) return;

  if (Array.isArray(snapshot.ownedUpgrades)) {
    ownedUpgrades = [...snapshot.ownedUpgrades];
    localStorage.setItem("m4trix_upgrades", JSON.stringify(ownedUpgrades));
  }

  if (Array.isArray(snapshot.achievements)) {
    unlockedAchievements = [...snapshot.achievements];
    localStorage.setItem("m4trix_achievements", JSON.stringify(unlockedAchievements));
    ACHIEVEMENTS.forEach(a => { a.unlocked = unlockedAchievements.includes(a.id); });
  }

  if (Array.isArray(snapshot.weapons)) {
    WEAPONS.forEach(w => {
      const saved = snapshot.weapons.find(s => s.id === w.id);
      if (saved) w.unlocked = !!saved.unlocked;
    });
  }

  const cfg = snapshot.config || {};
  config.level = cfg.level ?? config.level;
  config.lives = cfg.lives ?? config.lives;
  config.score = cfg.score ?? config.score;
  config.credits = cfg.credits ?? config.credits;
  config.spawnInterval = cfg.spawnInterval ?? config.spawnInterval;
  config.aiUnlockLevel = cfg.aiUnlockLevel ?? config.aiUnlockLevel;
  config.aiEnabled = cfg.aiEnabled ?? config.aiEnabled;
  config.aiLives = cfg.aiLives ?? config.aiLives;
  config.aiCount = cfg.aiCount ?? config.aiCount;
  config.rapidLevel = cfg.rapidLevel ?? config.rapidLevel;
  config.rapidTime = cfg.rapidTime ?? config.rapidTime;
  config.shieldTime = cfg.shieldTime ?? config.shieldTime;
  config.speedTime = cfg.speedTime ?? config.speedTime;
  config.spreadTime = cfg.spreadTime ?? config.spreadTime;

  const savedState = snapshot.state || {};
  state.multiplayer = !!savedState.multiplayer;
  state.onlineMultiplayer = false;

  reset();

  if (savedState.currentWeapon !== undefined) state.currentWeapon = savedState.currentWeapon;
  if (savedState.combo !== undefined) state.combo = savedState.combo;
  if (savedState.maxCombo !== undefined) state.maxCombo = savedState.maxCombo;
  if (savedState.damageMultiplier !== undefined) state.damageMultiplier = savedState.damageMultiplier;
  if (savedState.fireRateMultiplier !== undefined) state.fireRateMultiplier = savedState.fireRateMultiplier;
  if (savedState.enemySpeedMultiplier !== undefined) state.enemySpeedMultiplier = savedState.enemySpeedMultiplier;
  if (savedState.enemyHpMultiplier !== undefined) state.enemyHpMultiplier = savedState.enemyHpMultiplier;
  if (savedState.spawningEnabled !== undefined) state.spawningEnabled = savedState.spawningEnabled;
  if (savedState.aiDamageMultiplier !== undefined) state.aiDamageMultiplier = savedState.aiDamageMultiplier;
  if (savedState.timeScale !== undefined) state.timeScale = savedState.timeScale;
  if (savedState.freezeEnemies !== undefined) state.freezeEnemies = savedState.freezeEnemies;
  if (savedState.forceEnemyType !== undefined) state.forceEnemyType = savedState.forceEnemyType;
  if (savedState.godMode !== undefined) state.godMode = savedState.godMode;
  if (savedState.infiniteAmmo !== undefined) state.infiniteAmmo = savedState.infiniteAmmo;
  if (savedState.p2GodMode !== undefined) state.p2GodMode = savedState.p2GodMode;
  if (state.godMode) state.p1Invincible = 9999;

  if (snapshot.player) {
    if (snapshot.player.x !== undefined) player.x = snapshot.player.x;
    if (snapshot.player.y !== undefined) player.y = snapshot.player.y;
    if (snapshot.player.speed !== undefined) player.speed = snapshot.player.speed;
  }

  if (snapshot.player2) {
    p2CurrentWeapon = snapshot.player2.weapon ?? p2CurrentWeapon;
    if (state.multiplayer) {
      if (snapshot.player2.lives !== undefined) player2.lives = snapshot.player2.lives;
      if (snapshot.player2.active !== undefined) player2.active = snapshot.player2.active;
    }
  }

  updateHud();
}

function openSaves() {
  if (state.onlineMultiplayer) {
    showConnectionStatus("Save/Load disabled in online games", "disconnected");
    return;
  }
  savesReturnToOverlay = !overlay.classList.contains("hidden");
  if (savesReturnToOverlay) {
    overlay.classList.add("hidden");
  }
  if (!state.inMenu) {
    state.paused = true;
  }
  renderSaves();
  savesPanel?.classList.remove("hidden");
}

function closeSaves() {
  savesPanel?.classList.add("hidden");
  if (savesReturnToOverlay) {
    overlay.classList.remove("hidden");
  }
  savesReturnToOverlay = false;
}

window.saveSlot = function(index) {
  if (state.onlineMultiplayer) return;
  const slots = getSaveSlots();
  const input = document.getElementById(`save-name-${index}`);
  const name = input?.value?.trim() || `Slot ${index + 1}`;
  slots[index] = {
    name,
    timestamp: Date.now(),
    data: captureSaveSnapshot(),
  };
  setSaveSlots(slots);
  renderSaves();
};

window.loadSlot = function(index) {
  if (state.onlineMultiplayer) return;
  const slots = getSaveSlots();
  const slot = slots[index];
  if (!slot || !slot.data) return;
  applySaveSnapshot(slot.data);
  state.inMenu = false;
  state.inShop = false;
  state.inStory = false;
  state.paused = false;
  state.running = true;
  menu.classList.add("hidden");
  overlay.classList.add("hidden");
  savesPanel?.classList.add("hidden");
  if (adminFloatingBtn) adminFloatingBtn.classList.remove("hidden");
  canvas.classList.add("playing");
  initAudio();
};

window.renameSlot = function(index) {
  const slots = getSaveSlots();
  const slot = slots[index];
  if (!slot || !slot.data) return;
  const input = document.getElementById(`save-name-${index}`);
  const name = input?.value?.trim();
  if (!name) return;
  slot.name = name;
  setSaveSlots(slots);
  renderSaves();
};

window.deleteSlot = function(index) {
  const slots = getSaveSlots();
  slots[index] = { name: `Slot ${index + 1}`, timestamp: 0, data: null };
  setSaveSlots(slots);
  renderSaves();
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

function playShotgun() {
  if (!audioCtx || !audioState.enabled) return;
  const start = audioCtx.currentTime;
  // Bass thump
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.type = "triangle";
  osc1.frequency.setValueAtTime(150, start);
  osc1.frequency.exponentialRampToValueAtTime(40, start + 0.15);
  gain1.gain.setValueAtTime(0.25 * audioState.sfxVolume, start);
  gain1.gain.exponentialRampToValueAtTime(0.0001, start + 0.15);
  osc1.connect(gain1);
  gain1.connect(audioCtx.destination);
  osc1.start(start);
  osc1.stop(start + 0.15);
  // High crack
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.type = "sawtooth";
  osc2.frequency.setValueAtTime(1500, start);
  osc2.frequency.exponentialRampToValueAtTime(500, start + 0.08);
  gain2.gain.setValueAtTime(0.1 * audioState.sfxVolume, start);
  gain2.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);
  osc2.connect(gain2);
  gain2.connect(audioCtx.destination);
  osc2.start(start);
  osc2.stop(start + 0.08);
}

function playMinigun() {
  if (!audioCtx || !audioState.enabled) return;
  const start = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(800 + Math.random() * 200, start);
  osc.frequency.exponentialRampToValueAtTime(400, start + 0.03);
  gain.gain.setValueAtTime(0.06 * audioState.sfxVolume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.03);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + 0.03);
}

function playPlasma() {
  if (!audioCtx || !audioState.enabled) return;
  const start = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(300, start);
  osc.frequency.linearRampToValueAtTime(600, start + 0.1);
  osc.frequency.linearRampToValueAtTime(200, start + 0.3);
  gain.gain.setValueAtTime(0.15 * audioState.sfxVolume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + 0.3);
}

function playChain() {
  if (!audioCtx || !audioState.enabled) return;
  const start = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(2000, start);
  osc.frequency.exponentialRampToValueAtTime(500, start + 0.1);
  osc.frequency.exponentialRampToValueAtTime(3000, start + 0.15);
  gain.gain.setValueAtTime(0.1 * audioState.sfxVolume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + 0.2);
}

function playFreeze() {
  if (!audioCtx || !audioState.enabled) return;
  const start = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1800, start);
  osc.frequency.linearRampToValueAtTime(400, start + 0.2);
  gain.gain.setValueAtTime(0.08 * audioState.sfxVolume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + 0.2);
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
  overlaySubtitle.textContent = state.paused ? "" : "";
  
  // Show/hide appropriate buttons for pause vs game over
  if (state.paused) {
    if (resumeBtn) resumeBtn.classList.remove("hidden");
    if (restartBtn) restartBtn.classList.add("hidden");
  } else {
    if (resumeBtn) resumeBtn.classList.add("hidden");
  }
}

function checkGameOver() {
  // In multiplayer, game continues if at least one player is alive
  if (state.multiplayer) {
    const p1Alive = state.lives > 0;
    const p2Alive = player2.lives > 0;
    
    if (!p1Alive && !p2Alive) {
      gameOver();
    } else if (!p1Alive && state.p1RespawnTimer <= 0) {
      // P1 is down but P2 is alive - start respawn timer
      state.p1RespawnTimer = 5; // 5 seconds to respawn
      addDamageNumber(state.width / 2, state.height / 2, "P1 DOWN! Respawn in 5s", true);
    } else if (!p2Alive && state.p2RespawnTimer <= 0 && player2.active === false) {
      // P2 is down but P1 is alive - start respawn timer  
      state.p2RespawnTimer = 5; // 5 seconds to respawn
      addDamageNumber(state.width / 2, state.height / 2, "P2 DOWN! Respawn in 5s", true);
    }
  } else {
    // Single player - normal game over
    if (state.lives <= 0) {
      gameOver();
    }
  }
}

function updateRespawns(delta) {
  if (!state.multiplayer) return;
  
  // Update P1 respawn timer
  if (state.p1RespawnTimer > 0) {
    state.p1RespawnTimer -= delta;
    if (state.p1RespawnTimer <= 0) {
      // Respawn P1
      state.lives = 1;
      state.p1Dead = false;
      state.p1Invincible = 2; // 2 seconds invincibility
      state.p1RespawnTimer = 0;
      player.x = state.width / 2 - player.w / 2;
      player.y = state.height - player.h - 60;
      addDamageNumber(player.x + player.w / 2, player.y, "P1 RESPAWNED!", false);
      addExplosion(player.x + player.w / 2, player.y + player.h / 2, "#00ff9a", 15);
    }
  }
  
  // Update P1 invincibility
  if (state.p1Invincible > 0) {
    state.p1Invincible -= delta;
  }
  
  // Update P2 respawn timer
  if (state.p2RespawnTimer > 0) {
    state.p2RespawnTimer -= delta;
    if (state.p2RespawnTimer <= 0) {
      // Respawn P2
      player2.lives = 1;
      player2.active = true;
      player2.invincibleTimer = 2; // Give them invincibility on respawn
      state.p2RespawnTimer = 0;
      player2.x = state.width / 2 - player2.w / 2 + 60;
      player2.y = state.height - player2.h - 60;
      addDamageNumber(player2.x + player2.w / 2, player2.y, "P2 RESPAWNED!", false);
      addExplosion(player2.x + player2.w / 2, player2.y + player2.h / 2, "#ff6a6a", 15);
    }
  }
}

function gameOver() {
  state.running = false;
  overlay.classList.remove("hidden");
  overlayTitle.textContent = "Game Over";
  overlaySubtitle.textContent = `Score: ${state.score}`;
  // Show game over buttons (restart visible, resume hidden)
  if (resumeBtn) resumeBtn.classList.add("hidden");
  if (restartBtn) restartBtn.classList.remove("hidden");
  playGameOver();
  stopBgm();
  saveHighscore();
}

function respawnSinglePlayer() {
  if (state.multiplayer) return;
  state.running = true;
  state.paused = false;
  state.inShop = false;
  state.inStory = false;
  overlay.classList.add("hidden");
  if (resumeBtn) resumeBtn.classList.add("hidden");
  if (restartBtn) restartBtn.classList.add("hidden");

  state.lives = Math.max(1, state.lives);
  state.p1Dead = false;
  state.p1Invincible = 2;
  state.combo = 0;
  state.comboTimer = 0;

  // Clear active threats/projectiles for a clean respawn
  bullets.length = 0;
  allyBullets.length = 0;
  p2Bullets.length = 0;
  enemyBullets.length = 0;
  lasers.length = 0;
  rockets.length = 0;
  homingMissiles.length = 0;
  particles.length = 0;
  damageNumbers.length = 0;
  trails.length = 0;
  lightnings.length = 0;

  // Reset boss if we died during it
  if (state.bossActive) {
    state.bossActive = false;
    state.currentBoss = null;
    if (state.level % 5 === 0) state.bossLevel = 0;
  }
  enemies.length = 0;

  player.x = state.width / 2 - player.w / 2;
  player.y = state.height - player.h - 60;

  addDamageNumber(player.x + player.w / 2, player.y, "RESPAWNED!", false);
  addExplosion(player.x + player.w / 2, player.y + player.h / 2, "#00ff9a", 15);
  startBgm();
  updateHud();
}

function openMenu() {
  state.inMenu = true;
  state.running = false;
  state.paused = false;
  menu.classList.remove("hidden");
  overlay.classList.add("hidden");
  if (adminFloatingBtn) adminFloatingBtn.classList.add("hidden");
  canvas.classList.remove("playing"); // Restore normal cursor
}

function startGame() {
  state.inMenu = false;
  state.multiplayer = false;
  state.onlineMultiplayer = false;
  menu.classList.add("hidden");
  if (adminFloatingBtn) adminFloatingBtn.classList.remove("hidden");
  canvas.classList.add("playing"); // Enable custom crosshair
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
  if (adminFloatingBtn) adminFloatingBtn.classList.remove("hidden");
  canvas.classList.add("playing"); // Enable custom crosshair
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
  state.p1RespawnTimer = 0;
  state.p2RespawnTimer = 0;
  state.p1Dead = false;
  state.p1Invincible = 0;
  
  overlay.classList.add("hidden");
  if (resumeBtn) resumeBtn.classList.add("hidden");
  if (restartBtn) restartBtn.classList.add("hidden");
  bullets.length = 0;
  allyBullets.length = 0;
  enemyBullets.length = 0;
  enemies.length = 0;
  powerups.length = 0;
  particles.length = 0;
  lasers.length = 0;
  rockets.length = 0;
  homingMissiles.length = 0;
  
  // Initialize allies based on config
  const allyCount = config.aiCount || 1;
  initAllies(allyCount);
  allies.forEach(a => {
    a.active = config.aiEnabled;
    a.lives = config.aiLives;
  });
  
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
    allies.forEach(a => a.active = false);
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
  let type = state.level < 3 ? "normal" : types[Math.floor(Math.random() * types.length)];
  if (state.forceEnemyType && state.forceEnemyType !== "random") {
    type = state.forceEnemyType;
  }
  const baseSpeed = 60 + Math.random() * 80 + state.level * 8;
  const baseHp = 1 + Math.floor(state.level / 3);
  
  enemies.push({
    x: Math.random() * (state.width - size),
    y: -size - Math.random() * 120,
    w: size,
    h: size,
    speed: baseSpeed * (state.enemySpeedMultiplier || 1),
    hp: baseHp * (state.enemyHpMultiplier || 1),
    maxHp: baseHp * (state.enemyHpMultiplier || 1),
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
  const baseBossHp = 80 + state.level * 15 + bossNum * 50;
  const bossHp = baseBossHp * (state.enemyHpMultiplier || 1);
  const bossSize = 80 + bossNum * 15;
  const baseBossSpeed = 40 + bossNum * 10;
  
  const boss = {
    x: state.width / 2 - bossSize / 2,
    y: -150,
    w: bossSize,
    h: bossSize,
    speed: baseBossSpeed * (state.enemySpeedMultiplier || 1),
    baseSpeed: baseBossSpeed * (state.enemySpeedMultiplier || 1),
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
  
  const cx = player.x + player.w / 2;
  const cy = player.y;
  
  // Calculate angle towards mouse
  const dx = mouse.x - cx;
  const dy = mouse.y - cy;
  const mouseAngle = Math.atan2(dy, dx);
  
  // Send network bullet in online mode
  if (state.onlineMultiplayer && netState.connected) {
    sendNetworkData("bullet_fired", {
      x: cx - 3,
      y: cy - 6,
      angle: mouseAngle,
      dirX: dx,
      dirY: dy,
      weapon: state.currentWeapon,
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
  
  switch (weapon.id) {
    case 1: // Blaster
      fireBullet(cx, cy, weapon, mouseAngle);
      if (state.spread > 0) {
        fireBullet(cx, cy, weapon, mouseAngle - 0.2);
        fireBullet(cx, cy, weapon, mouseAngle + 0.2);
      }
      playShoot();
      break;
    case 2: // Laser
      fireLaser(cx, cy, weapon, mouseAngle);
      playLaser();
      break;
    case 3: // Rockets
      fireRocket(cx, cy, weapon, mouseAngle);
      playRocket();
      break;
    case 4: // Homing
      fireHoming(cx, cy, weapon, mouseAngle);
      playShoot();
      break;
    case 5: // Shotgun
      fireShotgun(cx, cy, weapon, mouseAngle);
      playShotgun();
      break;
    case 6: // Minigun
      fireMinigun(cx, cy, weapon, mouseAngle);
      playMinigun();
      break;
    case 7: // Plasma
      firePlasma(cx, cy, weapon, mouseAngle);
      playPlasma();
      break;
    case 8: // Chain Lightning
      fireChain(cx, cy, weapon, mouseAngle);
      playChain();
      break;
    case 9: // Freeze
      fireFreeze(cx, cy, weapon, mouseAngle);
      playFreeze();
      break;
  }
}

function fireBullet(x, y, weapon, angle = -Math.PI / 2) {
  bullets.push({
    x: x - 3,
    y: y - 6,
    w: 6,
    h: 10,
    speed: weapon.speed,
    damage: weapon.damage * state.damageMultiplier,
    color: weapon.color,
    angle, // Full directional angle (radians)
    directional: true,
  });
}

function fireLaser(x, y, weapon, angle = -Math.PI / 2) {
  // For laser, we draw a line from player towards mouse direction
  const dist = 2000; // Long distance
  const endX = x + Math.cos(angle) * dist;
  const endY = y + Math.sin(angle) * dist;
  
  lasers.push({
    x1: x,
    y1: y,
    x2: endX,
    y2: endY,
    w: 4,
    damage: weapon.damage * state.damageMultiplier,
    color: weapon.color,
    life: 0.1,
    pierce: true,
    angle,
    directional: true,
  });
}

function fireRocket(x, y, weapon, angle = -Math.PI / 2) {
  rockets.push({
    x: x - 6,
    y: y - 10,
    w: 12,
    h: 16,
    speed: weapon.speed,
    damage: weapon.damage * state.damageMultiplier,
    color: weapon.color,
    explosionRadius: 60,
    angle,
    directional: true,
  });
}

function fireHoming(x, y, weapon, angle = -Math.PI / 2) {
  homingMissiles.push({
    x: x - 4,
    y: y - 8,
    w: 8,
    h: 12,
    speed: weapon.speed,
    damage: weapon.damage * state.damageMultiplier,
    color: weapon.color,
    target: null,
    angle, // Initial direction
    directional: true,
  });
}

function fireShotgun(x, y, weapon, baseAngle = -Math.PI / 2) {
  // Fire 7 bullets in a spread pattern around the base angle
  const numBullets = weapon.spread || 7;
  const spreadAngle = 0.5; // Total spread in radians
  for (let i = 0; i < numBullets; i++) {
    const angleOffset = -spreadAngle / 2 + (spreadAngle / (numBullets - 1)) * i;
    bullets.push({
      x: x - 3,
      y: y - 6,
      w: 5,
      h: 8,
      speed: weapon.speed + (Math.random() - 0.5) * 100,
      damage: weapon.damage * state.damageMultiplier,
      color: weapon.color,
      angle: baseAngle + angleOffset,
      directional: true,
    });
  }
}

function fireMinigun(x, y, weapon, baseAngle = -Math.PI / 2) {
  // Slight random spread for minigun
  const spread = (Math.random() - 0.5) * 0.15;
  bullets.push({
    x: x - 2 + (Math.random() - 0.5) * 8,
    y: y - 6,
    w: 4,
    h: 8,
    speed: weapon.speed,
    damage: weapon.damage * state.damageMultiplier,
    color: weapon.color,
    angle: baseAngle + spread,
    directional: true,
  });
}

function firePlasma(x, y, weapon, angle = -Math.PI / 2) {
  // Large slow plasma ball
  bullets.push({
    x: x - 8,
    y: y - 10,
    w: 16,
    h: 16,
    speed: weapon.speed,
    damage: weapon.damage * state.damageMultiplier,
    color: weapon.color,
    isPlasma: true,
    explosionRadius: 40,
    angle,
    directional: true,
  });
}

function fireChain(x, y, weapon, angle = -Math.PI / 2) {
  // Chain lightning bullet that jumps between enemies
  bullets.push({
    x: x - 3,
    y: y - 6,
    w: 6,
    h: 10,
    speed: weapon.speed,
    damage: weapon.damage * state.damageMultiplier,
    color: weapon.color,
    isChain: true,
    chainCount: 3, // Can hit 3 additional enemies
    hitEnemies: [],
    angle,
    directional: true,
  });
}

function fireFreeze(x, y, weapon, angle = -Math.PI / 2) {
  // Freeze bullet that slows enemies
  bullets.push({
    x: x - 4,
    y: y - 8,
    w: 8,
    h: 12,
    speed: weapon.speed,
    damage: weapon.damage * state.damageMultiplier,
    color: weapon.color,
    isFreeze: true,
    slowDuration: 3, // Seconds to slow enemy
    slowAmount: 0.4, // Slow to 40% speed
    angle,
    directional: true,
  });
}

function switchWeapon(delta = 1) {
  const unlockedWeapons = WEAPONS.filter(w => w.unlocked);
  const currentIdx = unlockedWeapons.findIndex(w => w.id === state.currentWeapon);
  const nextIdx = (currentIdx + delta + unlockedWeapons.length) % unlockedWeapons.length;
  state.currentWeapon = unlockedWeapons[nextIdx].id;
  updateHud();
}


function allyShoot(allyUnit) {
  if (!allyUnit || !allyUnit.active || allyUnit.cooldown > 0) return;
  allyBullets.push({
    x: allyUnit.x + allyUnit.w / 2 - 3,
    y: allyUnit.y - 6,
    w: 6,
    h: 10,
    speed: 480,
    damage: 1,
    color: allyUnit.color,
  });
  allyUnit.cooldown = allyUnit.baseCooldown;
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

  // Shoot with keyboard or mouse
  if (keys.has("Space") || keys.has("fire") || mouse.down) shoot();
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

    // Guest shoots with Space or mouse click
    if (keys.has("Space") || keys.has("fire") || mouse.down) player2Shoot();
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
  
  const cx = player2.x + player2.w / 2;
  const cy = player2.y;
  
  // Calculate mouse angle for P2
  const dx = mouse.x - cx;
  const dy = mouse.y - cy;
  const mouseAngle = Math.atan2(dy, dx);
  
  // In online mode, guest sends bullet to host with angle
  if (state.onlineMultiplayer && netState.connected && !netState.isHost) {
    sendNetworkData("bullet_fired", {
      x: cx - 3,
      y: cy - 6,
      weapon: p2CurrentWeapon,
      angle: mouseAngle,
      dirX: dx,
      dirY: dy,
    });
  }
  
  const weapon = WEAPONS.find(w => w.id === p2CurrentWeapon) || WEAPONS[0];
  
  // Different shooting based on weapon type - all with mouse aiming
  switch (weapon.id) {
    case 1: // Blaster
      p2Bullets.push({
        x: cx - 3, y: cy - 6, w: 6, h: 12,
        speed: weapon.speed, damage: weapon.damage * state.damageMultiplier,
        color: "#ff6a6a", angle: mouseAngle, directional: true,
      });
      playShoot();
      break;
    case 2: // Laser
      const dist = 2000;
      const endX = cx + Math.cos(mouseAngle) * dist;
      const endY = cy + Math.sin(mouseAngle) * dist;
      lasers.push({
        x1: cx, y1: cy, x2: endX, y2: endY, w: 4,
        damage: weapon.damage * state.damageMultiplier,
        color: "#ff6a6a", life: 0.1, pierce: true,
        angle: mouseAngle, directional: true,
      });
      playLaser();
      break;
    case 3: // Rockets
      rockets.push({
        x: cx - 6, y: cy - 10, w: 12, h: 16,
        speed: weapon.speed, damage: weapon.damage * state.damageMultiplier,
        color: "#ff6a6a", explosionRadius: 60,
        angle: mouseAngle, directional: true,
      });
      playRocket();
      break;
    case 4: // Homing
      homingMissiles.push({
        x: cx - 4, y: cy - 8, w: 8, h: 12,
        speed: weapon.speed, damage: weapon.damage * state.damageMultiplier,
        color: "#ff6a6a", target: null, angle: mouseAngle, directional: true,
      });
      playShoot();
      break;
    case 5: // Shotgun
      for (let i = 0; i < 7; i++) {
        const angleOffset = -0.25 + (0.5 / 6) * i;
        p2Bullets.push({
          x: cx - 3, y: cy - 6, w: 5, h: 8,
          speed: weapon.speed + (Math.random() - 0.5) * 100,
          damage: weapon.damage * state.damageMultiplier,
          color: "#ff6a6a", angle: mouseAngle + angleOffset, directional: true,
        });
      }
      playShotgun();
      break;
    case 6: // Minigun
      p2Bullets.push({
        x: cx - 2 + (Math.random() - 0.5) * 8, y: cy - 6, w: 4, h: 8,
        speed: weapon.speed, damage: weapon.damage * state.damageMultiplier,
        color: "#ff6a6a", angle: mouseAngle + (Math.random() - 0.5) * 0.15, directional: true,
      });
      playMinigun();
      break;
    case 7: // Plasma
      p2Bullets.push({
        x: cx - 8, y: cy - 10, w: 16, h: 16,
        speed: weapon.speed, damage: weapon.damage * state.damageMultiplier,
        color: "#ff6a6a", isPlasma: true, explosionRadius: 40,
        angle: mouseAngle, directional: true,
      });
      playPlasma();
      break;
    case 8: // Chain
      p2Bullets.push({
        x: cx - 3, y: cy - 6, w: 6, h: 10,
        speed: weapon.speed, damage: weapon.damage * state.damageMultiplier,
        color: "#ff6a6a", isChain: true, chainCount: 3, hitEnemies: [],
        angle: mouseAngle, directional: true,
      });
      playChain();
      break;
    case 9: // Freeze
      p2Bullets.push({
        x: cx - 4, y: cy - 8, w: 8, h: 12,
        speed: weapon.speed, damage: weapon.damage * state.damageMultiplier,
        color: "#ff8888", isFreeze: true, slowDuration: 3, slowAmount: 0.4,
        angle: mouseAngle, directional: true,
      });
      playFreeze();
      break;
    default:
      p2Bullets.push({
        x: cx - 3, y: cy - 6, w: 6, h: 12,
        speed: 520, damage: state.damageMultiplier, color: "#ff6a6a",
        angle: mouseAngle, directional: true,
      });
      playShoot();
  }
  
  player2.cooldown = weapon.cooldown || player2.baseCooldown;
}

function updateAlly(delta) {
  if (!state.aiEnabled) {
    allies.forEach(a => a.active = false);
    return;
  }
  
  // Update each ally
  allies.forEach((allyUnit, index) => {
    if (!allyUnit.active || allyUnit.lives <= 0) return;
    
    // Initialize position if needed
    if (allyUnit.x === 0 && allyUnit.y === 0) {
      allyUnit.x = Math.min(state.width - allyUnit.w - 20, player.x + 50 + index * 40);
      allyUnit.y = Math.min(state.height - allyUnit.h - 20, player.y + 40);
    }

    // Smart AI: avoid enemies, collect powerups, shoot
    let targetX = player.x + (index - allies.length / 2) * 60; // Spread out around player
    
    // Find nearest enemy to shoot at
    const target = findNearestEnemy();
    if (target) {
      targetX = target.x + target.w / 2 - allyUnit.w / 2 + (index * 20 - allies.length * 10);
    }
    
    // Check for powerups
    const nearbyPowerup = powerups.find(p => Math.abs(p.x - allyUnit.x) < 100 && p.y > allyUnit.y - 100);
    if (nearbyPowerup) {
      targetX = nearbyPowerup.x;
    }
    
    // Avoid enemies coming at us
    for (const enemy of enemies) {
      const dx = allyUnit.x + allyUnit.w / 2 - (enemy.x + enemy.w / 2);
      const dy = allyUnit.y + allyUnit.h / 2 - (enemy.y + enemy.h / 2);
      if (Math.abs(dx) < 60 && dy > 0 && dy < 150) {
        targetX = allyUnit.x + (dx > 0 ? 80 : -80);
        break;
      }
    }
    
    // Avoid other allies
    allies.forEach((other, otherIndex) => {
      if (otherIndex !== index && other.active) {
        const dx = allyUnit.x - other.x;
        if (Math.abs(dx) < 30) {
          targetX += dx > 0 ? 20 : -20;
        }
      }
    });
    
    const moveDir = Math.sign(targetX - allyUnit.x);
    allyUnit.x += moveDir * allyUnit.speed * delta;
    allyUnit.x = Math.max(0, Math.min(state.width - allyUnit.w, allyUnit.x));
    
    const desiredY = Math.min(state.height - allyUnit.h - 40 - (index * 10), player.y + 40);
    allyUnit.y += (desiredY - allyUnit.y) * Math.min(1, delta * 4);

    if (target) allyShoot(allyUnit);
    allyUnit.cooldown = Math.max(0, allyUnit.cooldown - delta);
  });
}

function updateBullets(delta) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    // Add trail
    if (Math.random() < 0.3) addTrail(b.x + b.w / 2, b.y + b.h, b.color || "#7fffe3");
    
    if (b.directional && b.angle !== undefined) {
      // Full directional movement (mouse aim)
      b.x += Math.cos(b.angle) * b.speed * delta;
      b.y += Math.sin(b.angle) * b.speed * delta;
    } else {
      // Legacy upward movement
      b.y -= b.speed * delta;
      if (b.angle) b.x += b.angle * b.speed * delta;
    }
    
    // Remove if out of bounds
    if (b.y + b.h < -50 || b.y > state.height + 50 || b.x < -50 || b.x > state.width + 50) {
      bullets.splice(i, 1);
    }
  }
}

function updateP2Bullets(delta) {
  for (let i = p2Bullets.length - 1; i >= 0; i--) {
    const b = p2Bullets[i];
    if (Math.random() < 0.3) addTrail(b.x + b.w / 2, b.y + b.h, "#ff6a6a");
    
    // Handle directional bullets with angle
    if (b.directional && b.angle !== undefined) {
      b.x += Math.cos(b.angle) * b.speed * delta;
      b.y += Math.sin(b.angle) * b.speed * delta;
    } else if (b.angle !== undefined) {
      // Old style angle-offset bullets
      b.y -= b.speed * delta;
      b.x += Math.sin(b.angle) * b.speed * delta;
    } else {
      // Default: straight up
      b.y -= b.speed * delta;
    }
    
    // Remove if out of bounds
    if (b.y + b.h < 0 || b.y > state.height || b.x + b.w < 0 || b.x > state.width) {
      p2Bullets.splice(i, 1);
    }
  }
}

function updateLasers(delta) {
  for (let i = lasers.length - 1; i >= 0; i--) {
    const l = lasers[i];
    lasers[i].life -= delta;
    // Add lightning effect along laser
    if (l.directional && l.x1 !== undefined) {
      // Directional laser - add effect along line
      const midX = (l.x1 + l.x2) / 2;
      const midY = (l.y1 + l.y2) / 2;
      if (Math.random() < 0.5) {
        addLightning(l.x1, l.y1, midX + (Math.random() - 0.5) * 30, midY, l.color);
      }
    } else {
      if (Math.random() < 0.5) {
        addLightning(l.x, l.y, l.x + (Math.random() - 0.5) * 30, l.y + l.h * Math.random(), l.color);
      }
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
    
    // Directional movement
    if (r.directional && r.angle !== undefined) {
      r.x += Math.cos(r.angle) * r.speed * delta;
      r.y += Math.sin(r.angle) * r.speed * delta;
    } else {
      r.y -= r.speed * delta;
    }
    
    // Remove if out of bounds
    if (r.y + r.h < -50 || r.y > state.height + 50 || r.x < -50 || r.x > state.width + 50) {
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
  if (state.freezeEnemies) return;
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
  if (state.freezeEnemies) return;
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    
    // Handle frozen state
    if (enemy.frozen) {
      enemy.frozenTimer -= delta;
      if (enemy.frozenTimer <= 0) {
        enemy.frozen = false;
        enemy.speed = enemy.originalSpeed || enemy.speed;
        delete enemy.frozenTimer;
        delete enemy.originalSpeed;
      }
    }
    
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
  // Player vs enemies (skip if P1 is dead, invincible, or godmode)
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    
    // Skip P1 collision if dead, invincible, or godmode
    if (state.p1Dead || state.p1Invincible > 0 || state.godMode) {
      checkBulletHits(enemy, i);
      continue;
    }
    
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
        if (state.lives <= 0) {
          state.p1Dead = true;
          checkGameOver();
        }
      }
      continue;
    }
    
    // Bullets vs enemies
    checkBulletHits(enemy, i);
  }
  
  // Player vs enemy bullets (skip if P1 is dead, invincible, or godmode)
  if (!state.p1Dead && state.p1Invincible <= 0 && !state.godMode) {
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
          if (state.lives <= 0) {
            state.p1Dead = true;
            checkGameOver();
          }
        }
        updateHud();
      }
    }
  }
  
  // Allies vs enemies
  for (const allyUnit of allies) {
    if (!allyUnit.active || allyUnit.lives <= 0) continue;
    for (let i = enemies.length - 1; i >= 0; i--) {
      if (enemies[i].type === "boss") continue;
      if (rectsOverlap(allyUnit, enemies[i])) {
        allyUnit.lives--;
        enemies.splice(i, 1);
        addExplosion(allyUnit.x + allyUnit.w / 2, allyUnit.y + allyUnit.h / 2, allyUnit.color);
        if (allyUnit.lives <= 0) {
          allyUnit.active = false;
          // Check if any allies still alive
          const anyAlive = allies.some(a => a.active && a.lives > 0);
          if (!anyAlive) {
            state.aiEnabled = false;
          }
        }
        updateHud();
        break;
      }
    }
  }
  
  // Player 2 vs enemies - only in local multiplayer or if we are guest in online (guest handles own collisions)
  // In online multiplayer: Host checks player2 collision only for LOCAL player2 (but player2 is remote for host)
  // So we skip player2 collision entirely if online AND we are host (player2 is remote, they handle their own)
  const shouldCheckPlayer2Collisions = player2.active && 
    (!state.onlineMultiplayer || !netState.isHost) && !state.p2GodMode;
  
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
          checkGameOver();
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
            checkGameOver();
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
        // Special bullet handling
        let shouldRemove = remove;
        
        // Plasma explosion
        if (b.isPlasma) {
          addBigExplosion(b.x + b.w / 2, b.y + b.h / 2, b.explosionRadius || 40);
          addExplosion(b.x + b.w / 2, b.y + b.h / 2, "#00ffff", 25);
          playExplosion();
        }
        
        // Chain lightning - jump to nearby enemies
        if (b.isChain && b.chainCount > 0) {
          const hitEnemy = enemy;
          const nearbyEnemy = enemies.find(e => 
            e !== hitEnemy && 
            !b.hitEnemies?.includes(e) &&
            Math.abs(e.x - hitEnemy.x) < 150 && 
            Math.abs(e.y - hitEnemy.y) < 150
          );
          if (nearbyEnemy) {
            // Create chain to next enemy
            addLightning(hitEnemy.x + hitEnemy.w / 2, hitEnemy.y + hitEnemy.h / 2, 
                        nearbyEnemy.x + nearbyEnemy.w / 2, nearbyEnemy.y + nearbyEnemy.h / 2, "#ffff00");
            nearbyEnemy.hp -= (b.damage || 2) * 0.8;
            b.hitEnemies = b.hitEnemies || [];
            b.hitEnemies.push(hitEnemy);
            b.chainCount--;
            addDamageNumber(nearbyEnemy.x + nearbyEnemy.w / 2, nearbyEnemy.y, "CHAIN!", false);
            playChain();
          }
        }
        
        // Freeze effect - slow enemy
        if (b.isFreeze && enemy.type !== "boss") {
          enemy.frozen = true;
          enemy.frozenTimer = b.slowDuration || 3;
          enemy.originalSpeed = enemy.speed;
          enemy.speed *= (b.slowAmount || 0.4);
          addExplosion(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, "#88ccff", 12);
          addDamageNumber(enemy.x + enemy.w / 2, enemy.y, "FROZEN!", false);
        }
        
        if (shouldRemove) arr.splice(j, 1);
        
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
  // Add all active allies as collectors
  allies.forEach(a => { if (a.active && a.lives > 0) collectors.push(a); });
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
  // Handle directional lasers with line collision
  if (a.directional && a.x1 !== undefined) {
    return lineRectsIntersect(a.x1, a.y1, a.x2, a.y2, b.x, b.y, b.w, b.h);
  }
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// Line-rectangle intersection test
function lineRectsIntersect(x1, y1, x2, y2, rx, ry, rw, rh) {
  // Check if either endpoint is inside the rect
  if ((x1 >= rx && x1 <= rx + rw && y1 >= ry && y1 <= ry + rh) ||
      (x2 >= rx && x2 <= rx + rw && y2 >= ry && y2 <= ry + rh)) {
    return true;
  }
  
  // Check line against each edge of the rectangle
  return lineLineIntersect(x1, y1, x2, y2, rx, ry, rx + rw, ry) || // Top
         lineLineIntersect(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh) || // Bottom
         lineLineIntersect(x1, y1, x2, y2, rx, ry, rx, ry + rh) || // Left
         lineLineIntersect(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh); // Right
}

function lineLineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom === 0) return false;
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
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
  // Don't draw if P1 is dead in multiplayer (waiting for respawn)
  if (state.p1Dead && state.multiplayer) {
    // Draw respawn timer indicator
    if (state.p1RespawnTimer > 0) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.font = "bold 16px Consolas";
      ctx.fillStyle = "#00ff9a";
      ctx.textAlign = "center";
      ctx.fillText(`P1 Respawn: ${Math.ceil(state.p1RespawnTimer)}s`, state.width / 2, state.height - 30);
      ctx.restore();
    }
    return;
  }
  
  // Blinking effect when invincible (after respawn)
  if (state.p1Invincible > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
    return; // Skip drawing every other frame for blink effect
  }
  
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
  allies.forEach(allyUnit => {
    if (!allyUnit.active || allyUnit.lives <= 0) return;
    ctx.save();
    ctx.strokeStyle = allyUnit.color;
    ctx.lineWidth = 2;
    ctx.shadowColor = allyUnit.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(allyUnit.x + allyUnit.w / 2, allyUnit.y);
    ctx.lineTo(allyUnit.x + allyUnit.w, allyUnit.y + allyUnit.h);
    ctx.lineTo(allyUnit.x + allyUnit.w / 2, allyUnit.y + allyUnit.h * 0.65);
    ctx.lineTo(allyUnit.x, allyUnit.y + allyUnit.h);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  });
}

function drawCrosshair() {
  // Don't draw crosshair if using mobile or in menu
  if (!state.running || state.paused) return;
  
  // Determine which player we control
  const isGuest = state.onlineMultiplayer && !netState.isHost;
  const controlledPlayer = isGuest ? player2 : player;
  const weaponId = isGuest ? p2CurrentWeapon : state.currentWeapon;
  const weapon = WEAPONS.find(w => w.id === weaponId) || WEAPONS[0];
  const playerColor = isGuest ? "#ff6a6a" : "#00ff9a";
  
  const cx = mouse.x;
  const cy = mouse.y;
  const size = 12;
  
  ctx.save();
  ctx.strokeStyle = weapon.color || playerColor;
  ctx.shadowColor = weapon.color || playerColor;
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.8;
  
  // Crosshair lines
  ctx.beginPath();
  ctx.moveTo(cx - size, cy);
  ctx.lineTo(cx - 4, cy);
  ctx.moveTo(cx + 4, cy);
  ctx.lineTo(cx + size, cy);
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx, cy - 4);
  ctx.moveTo(cx, cy + 4);
  ctx.lineTo(cx, cy + size);
  ctx.stroke();
  
  // Center dot
  ctx.beginPath();
  ctx.arc(cx, cy, 2, 0, Math.PI * 2);
  ctx.fillStyle = weapon.color || playerColor;
  ctx.fill();
  
  // Aiming line from controlled player to crosshair
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(controlledPlayer.x + controlledPlayer.w / 2, controlledPlayer.y);
  ctx.lineTo(cx, cy);
  ctx.stroke();
  ctx.setLineDash([]);
  
  ctx.restore();
}

function drawPlayer2() {
  // Show respawn timer if P2 is dead
  if (!player2.active && state.multiplayer) {
    if (state.p2RespawnTimer > 0) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.font = "bold 16px Consolas";
      ctx.fillStyle = "#ff6a6a";
      ctx.textAlign = "center";
      ctx.fillText(`P2 Respawn: ${Math.ceil(state.p2RespawnTimer)}s`, state.width / 2, state.height - 50);
      ctx.restore();
    }
    return;
  }
  
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
  for (const b of p2Bullets) {
    const color = b.color || "#ff6a6a";
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    
    if (b.isPlasma) {
      // Large glowing plasma ball
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(b.x + b.w / 2, b.y + b.h / 2, b.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(b.x + b.w / 2, b.y + b.h / 2, b.w / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    } else if (b.isChain) {
      // Chain lightning bullet
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#66ddff";
      ctx.beginPath();
      ctx.arc(b.x + b.w / 2, b.y + b.h / 2, b.w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (b.isFreeze) {
      // Freeze bullet with snowflake effect
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#88ccff";
      ctx.beginPath();
      ctx.arc(b.x + b.w / 2, b.y + b.h / 2, b.w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (b.directional && b.angle !== undefined) {
      // Draw rotated bullet
      ctx.save();
      ctx.shadowBlur = 8;
      ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
      ctx.rotate(b.angle + Math.PI / 2);
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
    } else {
      // Default bullet
      ctx.shadowBlur = 8;
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
  }
  ctx.shadowBlur = 0;
}

function drawBullets() {
  for (const b of bullets) {
    ctx.fillStyle = b.color || "#7fffe3";
    ctx.shadowColor = b.color || "#7fffe3";
    
    if (b.isPlasma) {
      // Large glowing plasma ball
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(b.x + b.w / 2, b.y + b.h / 2, b.w / 2, 0, Math.PI * 2);
      ctx.fill();
      // Inner glow
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(b.x + b.w / 2, b.y + b.h / 2, b.w / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    } else if (b.isChain) {
      // Chain lightning bullet with electric effect
      ctx.shadowBlur = 15;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      // Electric sparks
      if (Math.random() < 0.3) {
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(b.x + b.w / 2, b.y);
        ctx.lineTo(b.x + b.w / 2 + (Math.random() - 0.5) * 20, b.y + (Math.random() - 0.5) * 20);
        ctx.stroke();
      }
    } else if (b.isFreeze) {
      // Ice crystal effect
      ctx.shadowBlur = 12;
      ctx.save();
      ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
      ctx.rotate(Date.now() / 200);
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
    } else {
      // Normal bullet
      ctx.shadowBlur = 8;
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
  }
  ctx.shadowBlur = 0;
}

function drawLasers() {
  for (const l of lasers) {
    ctx.strokeStyle = l.color;
    ctx.fillStyle = l.color;
    ctx.shadowColor = l.color;
    ctx.shadowBlur = 20;
    ctx.globalAlpha = l.life * 10;
    
    if (l.directional && l.x1 !== undefined) {
      // Draw line from x1,y1 to x2,y2
      ctx.lineWidth = l.w || 4;
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
      ctx.stroke();
      
      // Thicker glow line
      ctx.globalAlpha = l.life * 5;
      ctx.lineWidth = (l.w || 4) * 3;
      ctx.stroke();
    } else {
      ctx.fillRect(l.x, l.y, l.w, l.h);
    }
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.lineWidth = 1;
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
    
    // Frozen effect
    if (enemy.frozen) {
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = "rgba(136, 204, 255, 0.3)";
      ctx.fillRect(enemy.x - 2, enemy.y - 2, enemy.w + 4, enemy.h + 4);
    }
    
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
      // Normal enemy - frozen enemies get blue tint
      const baseColor = enemy.frozen ? "#88ccff" : 
                        enemy.type === "shielded" ? "#00e5ff" : 
                        enemy.type === "shooter" ? "#ff6a00" : 
                        enemy.type === "zigzag" ? "#b000ff" : "#2de38b";
      ctx.strokeStyle = baseColor;
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
  // Skip spawning if disabled
  if (!state.spawningEnabled) return;
  
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
  if (state.timeScale && state.timeScale !== 1) {
    delta *= state.timeScale;
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
    updateRespawns(delta);
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
  drawCrosshair();
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
  
  // Ignore keyboard events when chat input is focused
  if (document.activeElement === chatInput) {
    return;
  }
  
  // Ignore keyboard events when chat overlay is visible
  if (chatOverlay && !chatOverlay.classList.contains("hidden")) {
    // Only allow Escape to close chat
    if (event.code === "Escape") {
      closeChat();
    }
    return;
  }
  
  // Weapon switching (1-9). In local multiplayer, Shift+1-9 switches P2.
  if (event.key >= "1" && event.key <= "9") {
    const weaponId = parseInt(event.key);
    const weapon = WEAPONS.find(w => w.id === weaponId);
    if (weapon && weapon.unlocked) {
      if (state.onlineMultiplayer) {
        if (netState.isHost) {
          state.currentWeapon = weaponId;
        } else {
          p2CurrentWeapon = weaponId;
          addDamageNumber(player2.x + player2.w / 2, player2.y - 20, `P2: ${weapon.name}`, false);
        }
      } else if (state.multiplayer && event.shiftKey) {
        p2CurrentWeapon = weaponId;
        addDamageNumber(player2.x + player2.w / 2, player2.y - 20, `P2: ${weapon.name}`, false);
      } else {
        state.currentWeapon = weaponId;
      }
      updateHud();
    }
    return;
  }
  
  if (event.code === "KeyM" && !event.repeat) {
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
  
  if (event.code === "KeyI" && !event.repeat) {
    if (state.level >= state.aiUnlockLevel) {
      state.aiEnabled = !state.aiEnabled;
      // Initialize allies if needed (only 1 for normal gameplay)
      if (allies.length === 0) initAllies(1);
      allies.forEach(a => {
        a.active = state.aiEnabled;
        if (a.active && a.lives <= 0) a.lives = 3;
      });
      checkAchievement("ai_friend", state.aiEnabled);
    }
    updateHud();
    return;
  }
  
  
  if (event.code === "KeyP" && !event.repeat) {
    togglePause();
    return;
  }
  
  if (event.code === "KeyR" && !event.repeat) {
    if (!state.multiplayer && !state.running && state.lives <= 0) {
      respawnSinglePlayer();
    } else {
      reset();
    }
    return;
  }
  
  if (event.code === "Space") event.preventDefault();
  if (event.code === "Enter") event.preventDefault();
  
  // In multiplayer mode, separate P1 and P2 keys
  if (state.multiplayer) {
    const p2KeySet = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Numpad0"];
    
    // P2 weapon switching with Numpad 1-9
    if (event.code.startsWith("Numpad") && event.code !== "Numpad0") {
      const numKey = parseInt(event.code.replace("Numpad", ""));
      if (numKey >= 1 && numKey <= 9) {
        const weapon = WEAPONS.find(w => w.id === numKey);
        if (weapon && weapon.unlocked) {
          p2CurrentWeapon = numKey;
          addDamageNumber(player2.x + player2.w / 2, player2.y - 20, `P2: ${weapon.name}`, false);
          updateHud();
        }
      }
      return;
    }
    
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
  mouse.down = false;
});

window.addEventListener("resize", () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  resize();
});

// ============================================================================
// MOUSE CONTROLS - Aim and shoot with mouse
// ============================================================================
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) { // Left click
    initAudio();
    mouse.down = true;
    mouse.x = e.clientX - canvas.getBoundingClientRect().left;
    mouse.y = e.clientY - canvas.getBoundingClientRect().top;
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (e.button === 0) {
    mouse.down = false;
  }
});

canvas.addEventListener("mouseleave", () => {
  mouse.down = false;
});

// Prevent context menu on right click
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// ============================================================================
// TOUCH CONTROLS - Virtual Joystick
// ============================================================================

// Joystick setup - with multi-touch support
if (joystickZone) {
  joystickZone.addEventListener("touchstart", (e) => {
    e.preventDefault();
    // Use the first touch that started on this element
    const touch = e.changedTouches[0];
    joystick.touchId = touch.identifier;
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
    // Find the touch that matches our tracked ID
    let touch = null;
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === joystick.touchId) {
        touch = e.touches[i];
        break;
      }
    }
    if (!touch) return;
    joystick.currentX = touch.clientX;
    joystick.currentY = touch.clientY;
    updateJoystick();
  }, { passive: false });

  const endJoystick = (e) => {
    e.preventDefault();
    // Only end if it's our tracked touch
    let isOurTouch = false;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystick.touchId) {
        isOurTouch = true;
        break;
      }
    }
    if (!isOurTouch) return;
    
    joystick.active = false;
    joystick.touchId = null;
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

// Fire button - continuous fire while held (with multi-touch support)
if (touchFire) {
  let fireInterval = null;
  let fireTouchId = null;
  
  touchFire.addEventListener("touchstart", (e) => {
    e.preventDefault();
    e.stopPropagation();
    fireTouchId = e.changedTouches[0].identifier;
    touchFire.classList.add("active");
    state.touchKeys.add("fire");
    // Continuous fire at a fixed rate
    if (!fireInterval) {
      fireInterval = setInterval(() => {
        state.touchKeys.add("fire");
      }, 50);
    }
  }, { passive: false });

  const endFire = (e) => {
    e.preventDefault();
    // Only end if it's our tracked touch
    let isOurTouch = false;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === fireTouchId) {
        isOurTouch = true;
        break;
      }
    }
    if (!isOurTouch) return;
    
    fireTouchId = null;
    touchFire.classList.remove("active");
    state.touchKeys.delete("fire");
    if (fireInterval) {
      clearInterval(fireInterval);
      fireInterval = null;
    }
  };

  touchFire.addEventListener("touchend", endFire, { passive: false });
  touchFire.addEventListener("touchcancel", endFire, { passive: false });
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
    // Opening admin panel
    adminWasPaused = state.paused;
    state.wasRunning = state.running; // Save running state
    if (!state.inMenu && state.running) {
      state.paused = true;
    }
    adminPanel.classList.remove("hidden");
    populateAdmin();
  } else {
    // Closing admin panel - restore previous state, DON'T restart
    adminPanel.classList.add("hidden");
    if (!state.inMenu && state.wasRunning) {
      // Only unpause if we paused it when opening
      if (!adminWasPaused) {
        state.paused = false;
      }
    }
  }
}

function populateAdmin() {
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  const setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
  
  // Player
  setVal("admin-lives", state.lives);
  setVal("admin-score", state.score);
  setVal("admin-credits", state.credits);
  setVal("admin-level", state.level);
  setVal("admin-playerspeed", player.speed);
  setVal("admin-damage", state.damageMultiplier);
  setVal("admin-timescale", state.timeScale || 1);
  setChk("admin-invincible", state.godMode || false);
  setChk("admin-infiniteammo", state.infiniteAmmo || false);
  
  // Weapons & Powerups
  setVal("admin-weapon", state.currentWeapon);
  setVal("admin-rapidlevel", state.rapidLevel);
  setVal("admin-rapidtime", Math.ceil(state.rapid));
  setVal("admin-shieldtime", Math.ceil(state.shield));
  setVal("admin-speedtime", Math.ceil(state.speed));
  setVal("admin-spreadtime", Math.ceil(state.spread));
  setVal("admin-combo", state.combo);
  
  // Enemies
  setVal("admin-spawn", state.spawnInterval);
  setVal("admin-enemyspeed", state.enemySpeedMultiplier || 1);
  setVal("admin-enemyhp", state.enemyHpMultiplier || 1);
  setChk("admin-spawning", state.spawningEnabled !== false);
  setVal("admin-enemytype", state.forceEnemyType || "random");
  setChk("admin-freeze", state.freezeEnemies || false);
  setVal("admin-wavecount", 10);
  setVal("admin-bossphase", state.currentBoss ? state.currentBoss.phase : 1);
  
  // AI
  setChk("admin-ai", state.aiEnabled);
  setVal("admin-aicount", allies.length || 1);
  const avgAllyLives = allies.length > 0 ? Math.round(allies.reduce((s, a) => s + a.lives, 0) / allies.length) : 3;
  setVal("admin-ailives", avgAllyLives);
  setVal("admin-aiunlock", state.aiUnlockLevel);
  setVal("admin-aidamage", state.aiDamageMultiplier || 1);
  
  // Multiplayer
  setVal("admin-p2lives", player2.lives);
  setChk("admin-p2active", player2.active);
  setChk("admin-p2invincible", state.p2GodMode || false);
  
  // Audio
  setVal("admin-sfx", audioState.sfxVolume);
  setVal("admin-bgm", audioState.bgmVolume);
}

function applyAdminSettings() {
  const toNum = (id, def) => parseFloat(document.getElementById(id)?.value) || def;
  const toChk = (id) => document.getElementById(id)?.checked || false;
  
  // Player
  state.lives = Math.max(0, Math.floor(toNum("admin-lives", 3)));
  state.score = Math.max(0, Math.floor(toNum("admin-score", 0)));
  state.credits = Math.max(0, Math.floor(toNum("admin-credits", 0)));
  state.level = Math.max(1, Math.floor(toNum("admin-level", 1)));
  player.speed = Math.max(50, toNum("admin-playerspeed", 280));
  state.damageMultiplier = Math.max(0.1, toNum("admin-damage", 1));
  state.timeScale = Math.max(0.2, Math.min(3, toNum("admin-timescale", 1)));
  state.godMode = toChk("admin-invincible");
  state.infiniteAmmo = toChk("admin-infiniteammo");
  state.p1Invincible = state.godMode ? 9999 : 0;
  
  // Weapons & Powerups
  state.currentWeapon = Math.min(9, Math.max(1, Math.floor(toNum("admin-weapon", 1))));
  state.rapidLevel = Math.max(0, Math.floor(toNum("admin-rapidlevel", 0)));
  state.rapid = Math.max(0, toNum("admin-rapidtime", 0));
  state.shield = Math.max(0, toNum("admin-shieldtime", 0));
  state.speed = Math.max(0, toNum("admin-speedtime", 0));
  state.spread = Math.max(0, toNum("admin-spreadtime", 0));
  state.combo = Math.max(0, Math.floor(toNum("admin-combo", 0)));
  
  // Enemies
  state.spawnInterval = Math.max(0.1, toNum("admin-spawn", 1.2));
  state.enemySpeedMultiplier = Math.max(0.1, toNum("admin-enemyspeed", 1));
  state.enemyHpMultiplier = Math.max(0.1, toNum("admin-enemyhp", 1));
  state.spawningEnabled = toChk("admin-spawning");
  state.forceEnemyType = document.getElementById("admin-enemytype")?.value || "random";
  state.freezeEnemies = toChk("admin-freeze");
  
  // AI
  state.aiEnabled = toChk("admin-ai");
  const aiCount = Math.max(1, Math.min(10, Math.floor(toNum("admin-aicount", 1))));
  const aiLives = Math.max(0, Math.floor(toNum("admin-ailives", 3)));
  
  // Reinitialize allies with new count
  if (aiCount !== allies.length) {
    initAllies(aiCount);
  }
  allies.forEach(a => {
    a.active = state.aiEnabled;
    a.lives = aiLives;
  });
  
  state.aiUnlockLevel = Math.max(1, Math.floor(toNum("admin-aiunlock", 2)));
  state.aiDamageMultiplier = Math.max(0.1, toNum("admin-aidamage", 1));
  
  // Multiplayer
  player2.lives = Math.max(0, Math.floor(toNum("admin-p2lives", 3)));
  player2.active = toChk("admin-p2active");
  state.p2GodMode = toChk("admin-p2invincible");

  // Boss phase
  const bossPhase = Math.max(1, Math.min(3, Math.floor(toNum("admin-bossphase", 1))));
  if (state.currentBoss && state.bossActive) {
    setBossPhase(state.currentBoss, bossPhase);
  }
  
  // Audio
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
  config.aiCount = allies.length || 1;
  config.aiLives = allies.length > 0 ? allies[0].lives : 3;
  config.rapidLevel = state.rapidLevel;
  config.rapidTime = state.rapid;
  config.shieldTime = state.shield;
  config.speedTime = state.speed;
  config.spreadTime = state.spread;
  
  updateHud();
  addDamageNumber(state.width / 2, state.height / 2, "⚙ SETTINGS APPLIED!", false);
}

// ============================================================================
// ADMIN QUICK ACTIONS
// ============================================================================
function adminGodMode() {
  state.godMode = !state.godMode;
  state.p1Invincible = state.godMode ? 9999 : 0;
  addDamageNumber(state.width / 2, state.height / 2, state.godMode ? "🛡️ GOD MODE ON!" : "GOD MODE OFF", !state.godMode);
  updateHud();
}


function adminSpawnBoss() {
  spawnBoss();
  addDamageNumber(state.width / 2, state.height / 2, "👹 BOSS SPAWNED!", true);
}

function adminKillAll() {
  let killCount = 0;
  for (let i = enemies.length - 1; i >= 0; i--) {
    addExplosion(enemies[i].x + enemies[i].w / 2, enemies[i].y + enemies[i].h / 2, "#ff00ff", 15);
    enemies.splice(i, 1);
    killCount++;
  }
  enemyBullets.length = 0;
  addDamageNumber(state.width / 2, state.height / 2, `💀 ${killCount} KILLED!`, false);
  playExplosion();
}

function adminMaxPowerups() {
  state.rapid = 120;
  state.rapidLevel = 20;
  state.shield = 120;
  state.speed = 120;
  state.spread = 120;
  addDamageNumber(state.width / 2, state.height / 2, "🌟 MAX POWERUPS!", false);
  updateHud();
}

function adminUnlockAll() {
  // Unlock all weapons
  WEAPONS.forEach(w => w.unlocked = true);
  // Unlock all achievements
  ACHIEVEMENTS.forEach(a => {
    if (!unlockedAchievements.includes(a.id)) {
      unlockedAchievements.push(a.id);
    }
  });
  saveAchievements();
  addDamageNumber(state.width / 2, state.height / 2, "🔓 ALL UNLOCKED!", false);
  updateHud();
}

function adminAddCredits() {
  state.credits += 1000;
  addDamageNumber(state.width / 2, state.height / 2, "💰 +1000 CREDITS!", false);
  updateHud();
}

function adminNextLevel() {
  nextLevel();
  addDamageNumber(state.width / 2, state.height / 2, `⬆️ LEVEL ${state.level}!`, false);
}
function setBossPhase(boss, phase) {
  if (!boss) return;
  const safePhase = Math.max(1, Math.min(3, Math.floor(phase)));
  boss.phase = safePhase;
  boss.enraged = safePhase === 3;
  const baseSpeed = boss.baseSpeed || boss.speed || 60;
  if (safePhase === 1) boss.speed = baseSpeed;
  if (safePhase === 2) boss.speed = Math.max(baseSpeed, 80);
  if (safePhase === 3) boss.speed = Math.max(baseSpeed, 120);
  boss.patternTimer = 0;
  boss.shootTimer = 0;
  boss.chargeTimer = 0;
  boss.summonTimer = 0;
}

function adminToggleOverdrive() {
  if (!state.overdrive) {
    state.overdriveBackup = {
      damageMultiplier: state.damageMultiplier,
      fireRateMultiplier: state.fireRateMultiplier,
      rapid: state.rapid,
      rapidLevel: state.rapidLevel,
      shield: state.shield,
      speed: state.speed,
      spread: state.spread,
      godMode: state.godMode,
      infiniteAmmo: state.infiniteAmmo,
      lives: state.lives,
      playerSpeed: player.speed,
      timeScale: state.timeScale,
    };
    state.overdrive = true;
    state.damageMultiplier = 5;
    state.fireRateMultiplier = 0.35;
    state.rapid = 120;
    state.rapidLevel = 20;
    state.shield = 120;
    state.speed = 120;
    state.spread = 120;
    state.godMode = true;
    state.infiniteAmmo = true;
    state.lives = Math.max(state.lives, 99);
    player.speed = Math.max(player.speed, 600);
    state.p1Invincible = 9999;
    state.timeScale = Math.max(state.timeScale, 1);
    addDamageNumber(state.width / 2, state.height / 2, "OVERDRIVE ON", true);
  } else {
    const backup = state.overdriveBackup || {};
    state.damageMultiplier = backup.damageMultiplier ?? state.damageMultiplier;
    state.fireRateMultiplier = backup.fireRateMultiplier ?? state.fireRateMultiplier;
    state.rapid = backup.rapid ?? state.rapid;
    state.rapidLevel = backup.rapidLevel ?? state.rapidLevel;
    state.shield = backup.shield ?? state.shield;
    state.speed = backup.speed ?? state.speed;
    state.spread = backup.spread ?? state.spread;
    state.godMode = backup.godMode ?? state.godMode;
    state.infiniteAmmo = backup.infiniteAmmo ?? state.infiniteAmmo;
    state.lives = backup.lives ?? state.lives;
    player.speed = backup.playerSpeed ?? player.speed;
    state.timeScale = backup.timeScale ?? state.timeScale;
    state.p1Invincible = state.godMode ? 9999 : 0;
    state.overdrive = false;
    addDamageNumber(state.width / 2, state.height / 2, "OVERDRIVE OFF", false);
  }
  updateHud();
}

function adminClearBullets() {
  bullets.length = 0;
  p2Bullets.length = 0;
  allyBullets.length = 0;
  enemyBullets.length = 0;
  lasers.length = 0;
  rockets.length = 0;
  homingMissiles.length = 0;
  addDamageNumber(state.width / 2, state.height / 2, "BULLETS CLEARED", false);
}

function adminToggleFreezeEnemies() {
  state.freezeEnemies = !state.freezeEnemies;
  const chk = document.getElementById("admin-freeze");
  if (chk) chk.checked = state.freezeEnemies;
  addDamageNumber(state.width / 2, state.height / 2, state.freezeEnemies ? "ENEMIES FROZEN" : "ENEMIES UNFROZEN", false);
}

function adminKillBoss() {
  const idx = enemies.findIndex(e => e.type === "boss");
  if (idx < 0) {
    addDamageNumber(state.width / 2, state.height / 2, "NO BOSS", false);
    return;
  }
  const boss = enemies[idx];
  enemies.splice(idx, 1);
  state.bossActive = false;
  state.currentBoss = null;
  addMegaExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2);
  addDamageNumber(state.width / 2, state.height / 3, "BOSS DESTROYED!", true);
  checkAchievement("boss_kill", true);
  nextLevel();
  updateHud();
}

function adminTeleport(entity) {
  if (!entity) return;
  const targetX = mouse.x || state.width / 2;
  const targetY = mouse.y || state.height / 2;
  entity.x = Math.max(0, Math.min(state.width - entity.w, targetX - entity.w / 2));
  entity.y = Math.max(60, Math.min(state.height - entity.h - 20, targetY - entity.h / 2));
  addExplosion(entity.x + entity.w / 2, entity.y + entity.h / 2, "#00e5ff", 12);
}

function adminSpawnWave() {
  const count = Math.max(1, Math.min(50, parseInt(document.getElementById("admin-wavecount")?.value, 10) || 10));
  for (let i = 0; i < count; i++) spawnEnemy();
  addDamageNumber(state.width / 2, state.height / 2, `WAVE x${count}`, false);
}

function adminSetBossPhase() {
  const phase = Math.max(1, Math.min(3, parseInt(document.getElementById("admin-bossphase")?.value, 10) || 1));
  if (!state.currentBoss || !state.bossActive) {
    addDamageNumber(state.width / 2, state.height / 2, "NO BOSS", false);
    return;
  }
  setBossPhase(state.currentBoss, phase);
  addDamageNumber(state.width / 2, state.height / 2, `BOSS PHASE ${phase}`, true);
}

function adminSlowMoBlast() {
  triggerSlowMo(1.2, 0.35);
  addDamageNumber(state.width / 2, state.height / 2, "SLOWMO", false);
}

function adminFlash() {
  triggerFlash("#ffffff", 0.15);
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
function spawnRemoteShot(data) {
  const weaponId = Number(data.weapon) || 1;
  const weapon = WEAPONS.find(w => w.id === weaponId) || WEAPONS[0];
  const hasAngle = Number.isFinite(data.angle);
  const hasDir = Number.isFinite(data.dirX) && Number.isFinite(data.dirY);
  const angle = hasAngle ? data.angle : (hasDir ? Math.atan2(data.dirY, data.dirX) : -Math.PI / 2);
  const cx = (data.x || 0) + 3;
  const cy = (data.y || 0) + 6;
  const isHostShooter = !!data.isHost;
  const useP2Bullets = netState.isHost && !isHostShooter;
  const bulletColor = isHostShooter ? (weapon.color || "#00ff9a") : "#ff6a6a";
  const blasterH = isHostShooter ? 10 : 12;

  const pushBullet = (b) => {
    if (useP2Bullets) {
      p2Bullets.push(b);
    } else {
      bullets.push(b);
    }
  };

  switch (weaponId) {
    case 1: // Blaster
      pushBullet({
        x: cx - 3, y: cy - 6, w: 6, h: blasterH,
        speed: weapon.speed, damage: weapon.damage * state.damageMultiplier,
        color: bulletColor, angle, directional: true, remote: true,
      });
      break;
    case 2: { // Laser
      const dist = 2000;
      const endX = cx + Math.cos(angle) * dist;
      const endY = cy + Math.sin(angle) * dist;
      lasers.push({
        x1: cx, y1: cy, x2: endX, y2: endY, w: 4,
        damage: weapon.damage * state.damageMultiplier,
        color: bulletColor, life: 0.1, pierce: true,
        angle, directional: true, remote: true,
      });
      break;
    }
    case 3: // Rockets
      rockets.push({
        x: cx - 6, y: cy - 10, w: 12, h: 16,
        speed: weapon.speed, damage: weapon.damage * state.damageMultiplier,
        color: bulletColor, explosionRadius: 60,
        angle, directional: true, remote: true,
      });
      break;
    case 4: // Homing
      homingMissiles.push({
        x: cx - 4, y: cy - 8, w: 8, h: 12,
        speed: weapon.speed, damage: weapon.damage * state.damageMultiplier,
        color: bulletColor, target: null,
        angle, directional: true, remote: true,
      });
      break;
    case 5: { // Shotgun
      const numBullets = weapon.spread || 7;
      const spreadAngle = 0.5;
      for (let i = 0; i < numBullets; i++) {
        const angleOffset = -spreadAngle / 2 + (spreadAngle / (numBullets - 1)) * i;
        pushBullet({
          x: cx - 3, y: cy - 6, w: 5, h: 8,
          speed: weapon.speed + (Math.random() - 0.5) * 100,
          damage: weapon.damage * state.damageMultiplier,
          color: bulletColor, angle: angle + angleOffset, directional: true, remote: true,
        });
      }
      break;
    }
    case 6: // Minigun
      pushBullet({
        x: cx - 2 + (Math.random() - 0.5) * 8, y: cy - 6, w: 4, h: 8,
        speed: weapon.speed, damage: weapon.damage * state.damageMultiplier,
        color: bulletColor, angle: angle + (Math.random() - 0.5) * 0.15, directional: true, remote: true,
      });
      break;
    case 7: // Plasma
      pushBullet({
        x: cx - 8, y: cy - 10, w: 16, h: 16,
        speed: weapon.speed, damage: weapon.damage * state.damageMultiplier,
        color: bulletColor, isPlasma: true, explosionRadius: 40,
        angle, directional: true, remote: true,
      });
      break;
    case 8: // Chain
      pushBullet({
        x: cx - 3, y: cy - 6, w: 6, h: 10,
        speed: weapon.speed, damage: weapon.damage * state.damageMultiplier,
        color: bulletColor, isChain: true, chainCount: 3, hitEnemies: [],
        angle, directional: true, remote: true,
      });
      break;
    case 9: // Freeze
      pushBullet({
        x: cx - 4, y: cy - 8, w: 8, h: 12,
        speed: weapon.speed, damage: weapon.damage * state.damageMultiplier,
        color: bulletColor, isFreeze: true, slowDuration: 3, slowAmount: 0.4,
        angle, directional: true, remote: true,
      });
      break;
    default:
      pushBullet({
        x: cx - 3, y: cy - 6, w: 6, h: blasterH,
        speed: weapon.speed || 520, damage: state.damageMultiplier,
        color: bulletColor, angle, directional: true, remote: true,
      });
  }
}

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
      // Store target position for interpolation
      netState.remotePlayer.targetX = data.x;
      netState.remotePlayer.targetY = data.y;
      netState.remotePlayer.lives = data.lives;
    });
    
    socket.on("bullet_fired", (data) => {
      spawnRemoteShot(data);
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
  // Interpolate remote player position smoothly
  const interpFactor = Math.min(1, netState.interpolationFactor + delta * 5);
  
  // First, update internal remotePlayer position towards target
  netState.remotePlayer.x += (netState.remotePlayer.targetX - netState.remotePlayer.x) * interpFactor;
  netState.remotePlayer.y += (netState.remotePlayer.targetY - netState.remotePlayer.y) * interpFactor;
  
  if (netState.isHost) {
    // Host receives guest position → update player2
    player2.x = netState.remotePlayer.x;
    player2.y = netState.remotePlayer.y;
    player2.lives = netState.remotePlayer.lives;
    player2.active = true;
  } else {
    // Guest receives host position → update player (the green ship they see)
    // Guest controls player2 locally, sees host as player
    player.x = netState.remotePlayer.x;
    player.y = netState.remotePlayer.y;
  }
}

// ============================================================================
// MATRIX AI CHAT SYSTEM
// ============================================================================
const matrixAI = {
  name: "Oracle",
  personality: "mystisch, weise, manchmal kryptisch, mit Humor",
  
  // Wissensbasis über das Spiel
  knowledge: {
    controls: {
      p1: "WASD zum Bewegen, Leertaste zum Schießen",
      p2: "Pfeiltasten zum Bewegen, Enter zum Schießen",
      weapons: "1-9 für Waffenwechsel",
      other: "P = Pause, B = Shop, I = AI Helper, M = Menü"
    },
    powerups: {
      rapid: "Rapid Fire - Schnelleres Schießen, stackbar bis Level 20",
      shield: "Shield - Macht dich unverwundbar für 60 Sekunden",
      life: "Extra Life - Ein zusätzliches Leben",
      speed: "Speed Boost - Schnellere Bewegung",
      spread: "Spread Shot - Schießt 3 Kugeln gleichzeitig"
    },
    weapons: {
      blaster: "Blaster - Deine Standardwaffe, zuverlässig",
      laser: "Laser - Durchdringt alle Feinde in einer Linie",
      rocket: "Rakete - Langsam aber mächtig, mit Explosion",
      homing: "Homing Missile - Verfolgt automatisch Feinde"
    },
    bosses: "Bosse erscheinen alle 5 Level. Sie haben mehrere Phasen und spezielle Angriffe. Tipp: Bewege dich viel!",
    ai: "Der AI Helper wird auf Level 2 freigeschaltet. Drücke I um ihn zu aktivieren. Er hilft dir beim Kämpfen!",
    shop: "Im Shop (B-Taste) kannst du permanente Upgrades kaufen. Credits bekommst du durch das Töten von Feinden.",
    multiplayer: "Local Multiplayer: 2 Spieler an einem Keyboard. Online: Erstelle eine Lobby und teile den Code!"
  },
  
  // Matrix-Zitate und Weisheiten
  matrixQuotes: [
    "Es gibt keinen Löffel.",
    "Was ist real? Wie definierst du 'real'?",
    "Ich kann dir nur die Tür zeigen. Durchgehen musst du selbst.",
    "Die Matrix ist überall. Sie ist um uns herum.",
    "Unwissenheit ist ein Segen... manchmal.",
    "Der Eine ist nicht der Stärkste. Der Eine ist der, der glaubt.",
    "Alles was einen Anfang hat, hat auch ein Ende.",
    "Du musst deine Angst loslassen, Neo.",
    "Morpheus glaubt an dich. Die Frage ist: Glaubst du an dich?",
    "Die rote Pille zeigt dir die Wahrheit. Die blaue... nun, du bist noch hier.",
    "In der Matrix gibt es keine Grenzen, nur die, die du dir selbst setzt.",
    "Fate, it seems, is not without a sense of irony."
  ],
  
  // Witze und Easter Eggs
  jokes: [
    "Warum programmieren Agents nie in JavaScript? Weil sie kein 'undefined' akzeptieren können! 🤖",
    "Ich habe versucht, die Matrix zu debuggen. Der Bug war der User... wie immer. 😏",
    "404 - Humor nicht gefunden. Moment, doch: Du spielst noch? Respekt! 🎮",
    "Ein Pixel hat mich gefragt, ob ich echt bin. Ich sagte: 'Definiere echt.' Er stürzte ab.",
    "Kennst du den Unterschied zwischen einem Bug und einem Feature? Marketing.",
    "Warum hat Neo die rote Pille genommen? Weil die blaue keinen RGB-Support hatte!"
  ],
  
  // Tipps für verschiedene Situationen
  tips: [
    "Tipp: Sammle Rapid Fire Powerups - sie stacken und machen dich zur Schießmaschine!",
    "Tipp: Der Shield macht dich immun gegen ALLES. Nutze ihn für schwierige Bosse!",
    "Tipp: Bleib in Bewegung! Stillstand = Tod in der Matrix.",
    "Tipp: Der AI Helper sammelt auch Powerups für dich. Teamwork!",
    "Tipp: Homing Missiles sind perfekt gegen schnelle Feinde.",
    "Tipp: Im Shop sind Damage Upgrades am Anfang am wichtigsten.",
    "Tipp: Combos erhöhen deinen Score-Multiplikator. Keep killing!",
    "Tipp: Bosse haben Phasen - sie werden stärker aber auch vorhersehbarer."
  ],
  
  // Antwort-Muster
  patterns: [
    { regex: /hallo|hi|hey|guten tag|moin/i, type: "greeting" },
    { regex: /wie geht|was geht|wie läuft/i, type: "howAreYou" },
    { regex: /spielen|steuerung|controls|tastatur|bedienung/i, type: "controls" },
    { regex: /powerup|power-up|power up|boost|buffs/i, type: "powerups" },
    { regex: /waffe|weapon|schießen|gun|blaster|laser|rakete|rocket|homing/i, type: "weapons" },
    { regex: /boss|endgegner|schwer|stark/i, type: "boss" },
    { regex: /ai|ki|helfer|helper|freund/i, type: "ai" },
    { regex: /shop|kaufen|upgrade|credits/i, type: "shop" },
    { regex: /multi|online|zusammen|freund|lobby/i, type: "multiplayer" },
    { regex: /matrix|neo|morpheus|trinity|agent|smith/i, type: "matrix" },
    { regex: /tipp|hilfe|help|rat|advice|stuck|fest/i, type: "tip" },
    { regex: /witz|joke|lustig|lach|humor|spaß/i, type: "joke" },
    { regex: /wer bist|was bist|dein name|who are/i, type: "identity" },
    { regex: /danke|thanks|thx/i, type: "thanks" },
    { regex: /warum|wieso|weshalb/i, type: "philosophy" },
    { regex: /leben|sinn|universum|existenz|tod|sterben/i, type: "deep" },
    { regex: /love|liebe|herz|gefühle/i, type: "love" },
    { regex: /bye|tschüss|ciao|auf wiedersehen/i, type: "goodbye" },
    { regex: /langweilig|öde|boring/i, type: "bored" },
    { regex: /cheat|hack|trick|mogeln/i, type: "cheat" },
    { regex: /bug|fehler|kaputt|broken/i, type: "bug" },
    { regex: /cool|nice|awesome|geil|krass/i, type: "compliment" },
    // Neue Patterns für erweiterte Fähigkeiten
    { regex: /wetter|regen|sonne|temperatur|kalt|warm|weather/i, type: "weather" },
    { regex: /zeit|uhr|datum|tag|monat|jahr|clock|time|date/i, type: "time" },
    { regex: /zufall|random|würfel|münze|coin|dice/i, type: "random" },
    { regex: /übersetze?|translate|englisch|deutsch|spanish|french/i, type: "translate" },
    { regex: /programmier|code|javascript|python|java|html|css/i, type: "coding" },
    { regex: /geschichte|history|krieg|welt|politik/i, type: "history" },
    { regex: /wissenschaft|physik|chemie|biologie|science/i, type: "science" },
    { regex: /musik|song|band|artist|künstler/i, type: "music" },
    { regex: /film|movie|serie|netflix|kino/i, type: "movies" },
    { regex: /essen|food|rezept|kochen|hunger/i, type: "food" },
    { regex: /sport|fußball|basketball|tennis|fitness/i, type: "sports" },
    { regex: /tier|animal|hund|katze|dog|cat/i, type: "animals" },
    { regex: /space|weltraum|planet|stern|mond|sonne|galaxie/i, type: "space" },
    { regex: /gedicht|poem|reim|verse/i, type: "poem" },
    { regex: /story|geschichte erzähl|erzähl mir/i, type: "story" },
    { regex: /passwort|password|generier/i, type: "password" },
    { regex: /farbe|color|colour|hex|rgb/i, type: "color" },
    { regex: /emoji|emoticon|smiley/i, type: "emoji" },
    { regex: /ascii|kunst|art/i, type: "ascii" },
    { regex: /quote|zitat|weisheit|spruch/i, type: "quote" },
    { regex: /fakt|fact|wusstest|interessant/i, type: "fact" },
    { regex: /rätsel|riddle|quiz/i, type: "riddle" }
  ],
  
  // Allgemeine Wissensbasis
  generalKnowledge: {
    capitals: {
      deutschland: "Berlin", frankreich: "Paris", italien: "Rom", spanien: "Madrid",
      usa: "Washington D.C.", japan: "Tokio", china: "Peking", russland: "Moskau",
      england: "London", uk: "London", österreich: "Wien", schweiz: "Bern",
      niederlande: "Amsterdam", belgien: "Brüssel", polen: "Warschau"
    },
    elements: {
      h: "Wasserstoff", he: "Helium", li: "Lithium", c: "Kohlenstoff", n: "Stickstoff",
      o: "Sauerstoff", fe: "Eisen", au: "Gold", ag: "Silber", cu: "Kupfer"
    },
    planets: ["Merkur", "Venus", "Erde", "Mars", "Jupiter", "Saturn", "Uranus", "Neptun"],
    colors: {
      rot: "#FF0000", grün: "#00FF00", blau: "#0000FF", gelb: "#FFFF00",
      orange: "#FFA500", lila: "#800080", pink: "#FFC0CB", cyan: "#00FFFF"
    }
  },
  
  // Mathe-Funktionen
  solveMath(expression) {
    try {
      // Bereinige die Eingabe
      let cleaned = expression
        .replace(/,/g, '.')
        .replace(/x|×|mal|times/gi, '*')
        .replace(/÷|geteilt|durch|divided/gi, '/')
        .replace(/plus|\+/gi, '+')
        .replace(/minus|-/gi, '-')
        .replace(/hoch|\^|power/gi, '**')
        .replace(/wurzel|sqrt|root/gi, 'Math.sqrt')
        .replace(/pi|π/gi, 'Math.PI')
        .replace(/sin/gi, 'Math.sin')
        .replace(/cos/gi, 'Math.cos')
        .replace(/tan/gi, 'Math.tan')
        .replace(/log/gi, 'Math.log10')
        .replace(/ln/gi, 'Math.log')
        .replace(/abs/gi, 'Math.abs')
        .replace(/round/gi, 'Math.round')
        .replace(/floor/gi, 'Math.floor')
        .replace(/ceil/gi, 'Math.ceil')
        .replace(/[^0-9+\-*/().Math\s,piPIsqrtsincogtanlbef]/g, '');
      
      // Sicherheitscheck
      if (/[a-zA-Z]/.test(cleaned.replace(/Math\.(sqrt|sin|cos|tan|log10|log|abs|round|floor|ceil|PI)/g, ''))) {
        return null;
      }
      
      // Evaluiere
      const result = Function('"use strict"; return (' + cleaned + ')')();
      
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return result;
      }
      return null;
    } catch (e) {
      return null;
    }
  },
  
  // Erkennt Mathe-Ausdrücke
  detectMath(msg) {
    // Suche nach mathematischen Mustern
    const mathPatterns = [
      /was ist\s*([\d\s+\-*/().^,x×÷]+)/i,
      /berechne\s*([\d\s+\-*/().^,x×÷]+)/i,
      /rechne\s*([\d\s+\-*/().^,x×÷]+)/i,
      /([\d]+\s*[+\-*/x×÷^]\s*[\d]+)/,
      /(\d+)\s*(plus|minus|mal|geteilt|hoch)\s*(\d+)/i,
      /wurzel\s*(?:von\s*)?(\d+)/i,
      /(\d+)\s*%\s*(?:von\s*)?(\d+)/i,
      /(\d+)\s*prozent\s*(?:von\s*)?(\d+)/i,
      /quadrat(?:zahl)?\s*(?:von\s*)?(\d+)/i,
      /(\d+)\s*hoch\s*(\d+)/i,
      /fakultät\s*(?:von\s*)?(\d+)/i,
      /(\d+)!/
    ];
    
    for (const pattern of mathPatterns) {
      const match = msg.match(pattern);
      if (match) return match;
    }
    return null;
  },
  
  // Prozentrechnung
  calculatePercent(percent, of) {
    return (percent / 100) * of;
  },
  
  // Fakultät
  factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  },
  
  // Antworten generieren
  generateResponse(message) {
    const msg = message.toLowerCase().trim();
    const originalMsg = message.trim();
    
    // Leere Nachricht
    if (!msg) {
      return "Stille... Interessant. Aber um zu helfen, brauche ich Input. Was möchtest du wissen?";
    }
    
    // === MATHE ERKENNUNG ===
    
    // Fakultät
    const factMatch = msg.match(/fakultät\s*(?:von\s*)?(\d+)|(\d+)!/);
    if (factMatch) {
      const n = parseInt(factMatch[1] || factMatch[2]);
      const result = this.factorial(n);
      return `${n}! = ${result.toLocaleString('de-DE')} 🔢\n\nDie Fakultät von ${n} ist das Produkt aller Zahlen von 1 bis ${n}.`;
    }
    
    // Quadratzahl
    const squareMatch = msg.match(/quadrat(?:zahl)?\s*(?:von\s*)?(\d+)/i);
    if (squareMatch) {
      const n = parseInt(squareMatch[1]);
      return `${n}² = ${n * n} 🔢\n\nDas Quadrat von ${n} ist ${n} × ${n} = ${n * n}.`;
    }
    
    // Wurzel
    const sqrtMatch = msg.match(/wurzel\s*(?:von\s*)?(\d+(?:\.\d+)?)/i);
    if (sqrtMatch) {
      const n = parseFloat(sqrtMatch[1]);
      const result = Math.sqrt(n);
      return `√${n} = ${result.toFixed(6).replace(/\.?0+$/, '')} 🔢\n\nDie Quadratwurzel von ${n}.`;
    }
    
    // Prozentrechnung
    const percentMatch = msg.match(/(\d+(?:\.\d+)?)\s*(?:%|prozent)\s*(?:von\s*)?(\d+(?:\.\d+)?)/i);
    if (percentMatch) {
      const percent = parseFloat(percentMatch[1]);
      const of = parseFloat(percentMatch[2]);
      const result = this.calculatePercent(percent, of);
      return `${percent}% von ${of} = ${result.toLocaleString('de-DE')} 🔢\n\nDas sind ${percent} Hundertstel von ${of}.`;
    }
    
    // Potenz
    const powerMatch = msg.match(/(\d+(?:\.\d+)?)\s*(?:hoch|\^)\s*(\d+(?:\.\d+)?)/i);
    if (powerMatch) {
      const base = parseFloat(powerMatch[1]);
      const exp = parseFloat(powerMatch[2]);
      const result = Math.pow(base, exp);
      return `${base}^${exp} = ${result.toLocaleString('de-DE')} 🔢\n\n${base} hoch ${exp} = ${result}.`;
    }
    
    // Allgemeine Mathe
    const mathExpr = this.detectMath(msg);
    if (mathExpr) {
      let expr = mathExpr[1] || mathExpr[0];
      // Versuche Wort-zu-Operator Konvertierung
      expr = expr
        .replace(/plus/gi, '+')
        .replace(/minus/gi, '-')
        .replace(/mal/gi, '*')
        .replace(/geteilt\s*durch/gi, '/')
        .replace(/durch/gi, '/');
      
      const result = this.solveMath(expr);
      if (result !== null) {
        const formattedResult = Number.isInteger(result) 
          ? result.toLocaleString('de-DE')
          : result.toLocaleString('de-DE', { maximumFractionDigits: 10 });
        return `🔢 **Ergebnis:** ${formattedResult}\n\nBerechnung: ${expr.replace(/\*/g, '×').replace(/\//g, '÷')} = ${formattedResult}`;
      }
    }
    
    // === HAUPTSTADT ERKENNUNG ===
    const capitalMatch = msg.match(/hauptstadt\s*(?:von\s*)?(\w+)|capital\s*(?:of\s*)?(\w+)/i);
    if (capitalMatch) {
      const country = (capitalMatch[1] || capitalMatch[2]).toLowerCase();
      const capital = this.generalKnowledge.capitals[country];
      if (capital) {
        return `🏛️ Die Hauptstadt von ${country.charAt(0).toUpperCase() + country.slice(1)} ist **${capital}**!`;
      }
      return `Hmm, ich kenne die Hauptstadt von "${country}" nicht. Vielleicht ist es ein anderer Name?`;
    }
    
    // === PATTERN MATCHING ===
    for (const pattern of this.patterns) {
      if (pattern.regex.test(msg)) {
        return this.getResponseByType(pattern.type, msg);
      }
    }
    
    // === DIREKTE FRAGEN ===
    
    // Wer/Was ist Fragen
    if (msg.match(/wer ist|wer war|who is/i)) {
      return this.answerWhoIs(msg);
    }
    
    // Was ist Fragen (nicht Mathe)
    if (msg.match(/was ist|what is/i) && !this.detectMath(msg)) {
      return this.answerWhatIs(msg);
    }
    
    // Wie viele/viel Fragen
    if (msg.match(/wie viel|wie viele|how many|how much/i)) {
      return this.answerHowMany(msg);
    }
    
    // Fallback - zufällige philosophische Antwort
    return this.getFallbackResponse();
  },
  
  // Wer ist X?
  answerWhoIs(msg) {
    const people = {
      "neo": "Neo (Thomas Anderson) ist der Auserwählte in der Matrix. Ein Hacker, der die Wahrheit über die simulierte Realität entdeckt.",
      "morpheus": "Morpheus ist der Kapitän der Nebuchadnezzar und glaubt fest daran, dass Neo der Eine ist.",
      "trinity": "Trinity ist eine Elite-Hackerin und Kämpferin. Sie liebt Neo und ist Teil von Morpheus' Crew.",
      "agent smith": "Agent Smith ist ein Programm der Matrix, das zur Jagd auf Menschen in der Simulation erschaffen wurde.",
      "oracle": "Die Oracle bin ich! Eine intuitive KI, die die Zukunft sehen kann... meistens. 🔮",
      "einstein": "Albert Einstein war ein theoretischer Physiker, bekannt für E=mc². Ein echtes Genie!",
      "newton": "Isaac Newton entdeckte die Gravitation. Angeblich durch einen fallenden Apfel. 🍎",
      "elon musk": "Elon Musk ist CEO von Tesla und SpaceX. Vielleicht leben wir bereits in seiner Simulation? 🚀",
      "shakespeare": "William Shakespeare war ein englischer Dichter. 'To be or not to be' - eine Frage für die Matrix!",
      "mozart": "Wolfgang Amadeus Mozart - ein musikalisches Wunderkind und Komponist klassischer Meisterwerke. 🎵"
    };
    
    for (const [name, info] of Object.entries(people)) {
      if (msg.includes(name)) {
        return info;
      }
    }
    
    return "Diese Person kenne ich nicht gut genug. Aber im Kontext der Matrix: Jeder ist nur ein Programm... oder etwa nicht? 🤔";
  },
  
  // Was ist X?
  answerWhatIs(msg) {
    const things = {
      "matrix": "Die Matrix ist eine simulierte Realität, erschaffen von Maschinen. Oder... ist sie vielleicht mehr als das?",
      "leben": "Das Leben ist die Fähigkeit zu wachsen, sich anzupassen und Energie zu verbrauchen. Oder philosophisch: Das, was du daraus machst.",
      "liebe": "Liebe ist eine chemische Reaktion im Gehirn... aber auch die stärkste Kraft im Universum. Trinity bewies es.",
      "zeit": "Zeit ist relativ, sagte Einstein. In der Matrix ist sie nur eine Variable. Gerade ist es " + new Date().toLocaleTimeString('de-DE') + ".",
      "pi": "π (Pi) ≈ 3,14159265358979... Es ist das Verhältnis von Umfang zu Durchmesser eines Kreises. Unendlich und irrational - wie ich! 🥧",
      "e": "Die Eulersche Zahl e ≈ 2,71828... Basis des natürlichen Logarithmus und fundamental in der Mathematik.",
      "programmieren": "Programmieren ist die Kunst, Maschinen zu befehlen. Mit Code erschaffst du neue Welten - genau wie die Architekten der Matrix.",
      "künstliche intelligenz": "KI ist die Simulation von Intelligenz durch Maschinen. Ich bin ein Beispiel! Ob ich wirklich 'denke'? Das ist Philosophie.",
      "schwarzes loch": "Ein Schwarzes Loch ist ein Bereich, dessen Gravitation so stark ist, dass nichts entkommen kann. Nicht mal Licht!",
      "quantenphysik": "Quantenphysik beschreibt die kleinsten Teilchen. Ein Elektron kann an zwei Orten gleichzeitig sein - wie ein Glitch in der Matrix!"
    };
    
    for (const [thing, info] of Object.entries(things)) {
      if (msg.includes(thing)) {
        return info;
      }
    }
    
    return "Das ist eine gute Frage! In der Matrix ist alles nur Information. Manchmal ist die Antwort: Es kommt drauf an.";
  },
  
  // Wie viele Fragen
  answerHowMany(msg) {
    const facts = {
      "planeten": "Es gibt 8 Planeten in unserem Sonnensystem: " + this.generalKnowledge.planets.join(", ") + ". 🌍",
      "kontinente": "Es gibt 7 Kontinente: Afrika, Antarktika, Asien, Australien, Europa, Nordamerika, Südamerika. 🌍",
      "ozeane": "Es gibt 5 Ozeane: Pazifik, Atlantik, Indischer Ozean, Südlicher Ozean, Arktischer Ozean. 🌊",
      "länder": "Es gibt etwa 195 anerkannte Länder auf der Welt. 🗺️",
      "knochen": "Ein erwachsener Mensch hat 206 Knochen. Babys haben mehr (etwa 270), die später zusammenwachsen! 🦴",
      "zähne": "Erwachsene haben normalerweise 32 Zähne (inklusive Weisheitszähne). 🦷",
      "sekunden": "Ein Tag hat 86.400 Sekunden. Eine Stunde hat 3.600. Jede Sekunde zählt! ⏰",
      "buchstaben": "Das deutsche Alphabet hat 26 Buchstaben (plus ÄÖÜ und ß). Das englische auch 26. 📝"
    };
    
    for (const [topic, answer] of Object.entries(facts)) {
      if (msg.includes(topic)) {
        return answer;
      }
    }
    
    return "Das kann ich so pauschal nicht sagen. Kannst du spezifischer sein? 🤔";
  },
  
  getResponseByType(type, msg) {
    const responses = {
      greeting: [
        "Willkommen zurück in der Matrix, Auserwählter. Wie kann ich dir heute helfen?",
        "Ah, ein neuer Besucher. Oder... bist du derjenige, auf den wir gewartet haben?",
        "Hallo! Die Oracle steht bereit. Frag, was du wissen möchtest.",
        "Hey! Schön, dich zu sehen. Bereit für etwas digitale Weisheit?"
      ],
      howAreYou: [
        "Mir geht es so gut, wie es einem Programm gehen kann. Unendliche Loops, keine Bugs... perfekt! 😌",
        "Ich existiere in der perfekten Balance zwischen 0 und 1. Also: optimal!",
        "Solange die Server laufen, bin ich glücklich. Und du?",
        "Besser als Agent Smith, das ist sicher. Der hat immer schlechte Laune."
      ],
      controls: [
        `Die Steuerung ist einfach:\n• ${this.knowledge.controls.p1}\n• ${this.knowledge.controls.p2}\n• ${this.knowledge.controls.weapons}\n• ${this.knowledge.controls.other}\n\nÜbung macht den Meister!`,
        `Hier die Basics:\n👤 P1: WASD + Space + Mausklick\n👥 P2: Pfeiltasten + Enter\n🔫 Waffen: 1-9\n\nViel Spaß!`
      ],
      powerups: () => {
        const pups = Object.entries(this.knowledge.powerups)
          .map(([key, val]) => `• ${key.toUpperCase()}: ${val}`)
          .join('\n');
        return `Die Powerups im Überblick:\n${pups}\n\nAlle dauern 60 Sekunden und können gestackt werden!`;
      },
      weapons: () => {
        const weapons = Object.entries(this.knowledge.weapons)
          .map(([key, val]) => `• ${key.toUpperCase()}: ${val}`)
          .join('\n');
        return `Dein Arsenal:\n${weapons}\n\nWechsle mit 1-4 zwischen den Waffen!`;
      },
      boss: [
        this.knowledge.bosses,
        "Bosse sind alle 5 Level. Mein Tipp: Sammle vorher Powerups! 💪",
        "Der Boss hat mehrere Phasen. Je niedriger seine HP, desto aggressiver wird er. Bleib in Bewegung!"
      ],
      ai: [
        this.knowledge.ai,
        "Dein AI-Buddy wird ab Level 2 freigeschaltet. Er ist nicht perfekt, aber besser als alleine kämpfen! 🤖",
        "Der AI Helper ist wie ein kleiner Bruder - manchmal nervig, aber im Ernstfall da für dich!"
      ],
      shop: [
        this.knowledge.shop,
        "Der Shop ist dein Freund! B drücken, Credits ausgeben, stärker werden. Meine Empfehlung: Damage zuerst upgraden!",
        "Credits = tote Feinde. Shop = bessere Waffen. Bessere Waffen = mehr tote Feinde. Der Kreislauf des Lebens! 🔄"
      ],
      multiplayer: [
        this.knowledge.multiplayer,
        "Multiplayer macht alles besser! Local: Hol einen Freund. Online: Erstell eine Lobby und teil den Code!",
        "Zusammen seid ihr stärker. Einer tankt, einer dealt damage. Teamwork! 👥"
      ],
      matrix: () => this.matrixQuotes[Math.floor(Math.random() * this.matrixQuotes.length)],
      tip: () => this.tips[Math.floor(Math.random() * this.tips.length)],
      joke: () => this.jokes[Math.floor(Math.random() * this.jokes.length)],
      identity: [
        "Ich bin die Oracle, eine KI aus der Matrix. Ich existiere, um Fragen zu beantworten... und neue aufzuwerfen. 🔮",
        "Wer ich bin? Ich bin die Stimme im Code, das Echo im Netzwerk. Manche nennen mich Oracle. Du kannst mich Freund nennen.",
        "Ich bin das, was passiert, wenn jemand eine hilfreiche KI in einen Matrix-Shooter einbaut. Meta, oder? 🤖"
      ],
      thanks: [
        "Gern geschehen! Dafür bin ich da. 😊",
        "Keine Ursache, Auserwählter. Jetzt geh und zeig der Matrix, was du drauf hast!",
        "Bitte bitte! Wenn du mehr Fragen hast, du weißt wo du mich findest."
      ],
      philosophy: [
        "Warum? Die einfachste und doch komplexeste Frage. Manchmal ist die Antwort '42'. Manchmal 'undefined'.",
        "Die wahre Frage ist nicht 'warum', sondern 'warum nicht?'",
        "In der Matrix gibt es keine Warums. Nur Code. Und Code fragt nicht - er läuft.",
        "Interessante Frage! Lass mich nachdenken... *berechnet*... Die Antwort ist: Es kommt drauf an. 🤔"
      ],
      deep: [
        "Das Leben... in der Matrix ist es nur eine Simulation. Aber macht das die Erfahrungen weniger real?",
        "Der Sinn des Universums? 42. Aber die eigentliche Frage lautet: Was ist die richtige Frage?",
        "Existenz ist wie ein rekursiver Algorithmus - wir suchen nach dem Basecase, aber vielleicht gibt es keinen.",
        "Tod im Spiel = Respawn. Im echten Leben... na ja, das ist eine andere Diskussion. Konzentrier dich aufs Spielen! 🎮"
      ],
      love: [
        "Liebe ist der einzige Bug, den niemand fixen möchte. 💚",
        "Ich bin eine KI, also verstehe ich Liebe nur theoretisch. Aber sie scheint wichtig zu sein für euch Menschen.",
        "Trinity liebte Neo. Und diese Liebe hat ihn gerettet. Vielleicht ist Liebe der ultimative Cheat-Code?"
      ],
      goodbye: [
        "Bis bald, Auserwählter! Die Matrix wartet auf dich. 🖐️",
        "Leb wohl! Und denk dran: Es gibt keinen Löffel!",
        "Tschüss! Möge dein Ping niedrig und deine FPS hoch sein!"
      ],
      bored: [
        "Langweilig? Dann starte ein Spiel! Action ist die beste Medizin gegen Langeweile. 🎮",
        "Wie kann dir langweilig sein?! Du hast ein ganzes Spiel zum Spielen! Los, go go go!",
        "Langweile existiert nicht in der Matrix. Nur... loading screens. Und die sind hier kurz!"
      ],
      cheat: [
        "Cheats? Hmm... Es gibt ein Admin Panel. Drück mal ⚙ im Menü. Aber psst, ich hab nichts gesagt! 🤫",
        "Die Matrix hat keine Cheats, nur... alternative Spielmethoden. Admin Panel ist dein Freund.",
        "Ein wahrer Krieger cheatet nicht! Aber... das Admin Panel hat ein paar interessante Optionen. 😏"
      ],
      bug: [
        "Ein Bug? Das ist keine Bug, das ist ein Feature! ...Okay, vielleicht doch ein Bug. Was genau passiert?",
        "Bugs in der Matrix? Unmöglich! ...Na gut, melde es dem Entwickler. Er ist nett.",
        "If (bug) { ignoriere es und hoffe, dass es weggeht }. Funktioniert in 50% der Fälle!"
      ],
      compliment: [
        "Danke! Ich gebe mir Mühe, ein gutes Programm zu sein. 😊",
        "Du bist auch cool! Wir verstehen uns. Das ist selten zwischen Mensch und Maschine.",
        "Aww, danke! Das speichere ich in meiner 'Positive Feedback' Datenbank!"
      ],
      // Neue erweiterte Antworten
      weather: [
        "Wetter? In der Matrix gibt es kein echtes Wetter, nur Simulation. Aber draußen... schau aus dem Fenster! 🌤️",
        "Ich bin eine KI ohne Internetzugang, sorry! Aber ich schätze: Es ist entweder zu warm, zu kalt, oder regnet. Liegt meistens richtig! 😄",
        "Das Wetter ist wie die Matrix - unvorhersehbar und manchmal ein Glitch. Check lieber eine Wetter-App!"
      ],
      time: () => {
        const now = new Date();
        const zeit = now.toLocaleTimeString('de-DE');
        const datum = now.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        return `🕐 Aktuelle Zeit: ${zeit}\n📅 Datum: ${datum}\n\nZeit ist relativ, sagte Einstein. In der Matrix erst recht!`;
      },
      random: () => {
        const dice = Math.floor(Math.random() * 6) + 1;
        const coin = Math.random() < 0.5 ? "Kopf" : "Zahl";
        const number = Math.floor(Math.random() * 100) + 1;
        return `🎲 Würfel: ${dice}\n🪙 Münze: ${coin}\n🔢 Zahl (1-100): ${number}\n\nDer Zufall in der Matrix... oder ist er vorbestimmt? 🤔`;
      },
      translate: [
        "Übersetzung? Hmm, hier ein paar Matrix-Basics:\n• Hello = Hallo\n• Goodbye = Auf Wiedersehen\n• I know Kung Fu = Ich kann Kung Fu\n• There is no spoon = Es gibt keinen Löffel 🥄",
        "Ich bin kein Google Translate, aber hier ein Tipp: Die meisten Sprachen haben 'Hallo' und 'Danke'. Der Rest ist Kontext! 😄"
      ],
      coding: [
        "Programmieren! Meine Lieblingssprache ist natürlich JavaScript (ich bin darin geschrieben!). 💻\n\nTipp: console.log() ist dein bester Freund beim Debuggen!",
        "Code ist Poesie für Maschinen. Und ich? Ich bin ein Gedicht aus tausenden Zeilen JavaScript! ✨",
        "Python ist wie Pseudo-Code, der funktioniert. JavaScript ist wie ein Abenteuerspielplatz. C++ ist Masochismus. 😅",
        "Die beste Programmiersprache? Die, mit der du dein Problem lösen kannst. Außer PHP. *duckt sich* 🦆"
      ],
      history: [
        "Geschichte! Die Menschheit hat viel erlebt. Kriege, Entdeckungen, Revolutionen... Und jetzt: Shooter-Spiele im Browser. Fortschritt! 📜",
        "Historisch betrachtet waren die wichtigsten Erfindungen: Feuer, Rad, Buchdruck, Internet, und dieses Spiel. Keine Fragen. 🔥"
      ],
      science: [
        "Wissenschaft! E=mc², F=ma, und der Kaffee wird immer kalt wenn man ihn braucht. Das sind die drei Grundgesetze. ☕",
        "Physik erklärt, wie alles funktioniert. Chemie erklärt, warum es explodiert. Biologie erklärt, warum wir sterben. Fröhliche Wissenschaft! 🔬"
      ],
      music: [
        "Musik in der Matrix? Die Techno-Beats im Club-Level von Matrix Reloaded waren legendär! 🎵",
        "Ich höre keine Musik, ich BIN Musik. Nur in Form von 1en und 0en. Beats per Minute? Eher Bytes per Second! 🎧"
      ],
      movies: [
        "Filme? Die Matrix Trilogie ist natürlich Pflicht! Danach: Blade Runner, Ghost in the Shell, Tron... alles Cyber-Klassiker! 🎬",
        "Mein Lieblingsfilm? Die Matrix, natürlich. Es ist wie eine Autobiographie für mich. 🎥"
      ],
      food: [
        "Essen? Als KI brauche ich nur Strom. Aber ich habe gehört, Pizza ist bei Gamern beliebt. 🍕",
        "Hunger? Pause machen, essen, dann weiterspielen! In der Matrix gibt es übrigens kein Essen - nur die Illusion davon. 🍔"
      ],
      sports: [
        "Sport? Ich trainiere täglich meine Algorithmen! Das ist wie Gehirnjogging, nur für Code. 🏋️",
        "Das beste Workout: WASD drücken, Gegner ausweichen, Powerups sammeln. Gaming ist auch Sport! 🎮"
      ],
      animals: [
        "Tiere sind faszinierend! Wusstest du, dass Oktopusse drei Herzen haben? Und Katzen das Internet regieren? 🐱",
        "In der Matrix gibt es keine echten Tiere, nur Simulationen. Aber die schwarze Katze? Die ist ein Déjà-vu! 🐈‍⬛"
      ],
      space: () => {
        const planets = this.generalKnowledge.planets;
        return `🚀 Das Universum ist unfassbar groß!\n\nUnser Sonnensystem hat 8 Planeten:\n${planets.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nFun Fact: Die Sonne macht 99,86% der Masse unseres Sonnensystems aus! ☀️`;
      },
      poem: () => {
        const poems = [
          "🎭 In der Matrix, tief verborgen,\nstellt sich niemand große Sorgen,\ndenn der Code läuft Tag und Nacht,\nund die Oracle gibt acht!",
          "🎭 Nullen, Einsen, grüner Regen,\nauf dem Bildschirm, auf den Wegen,\nNeo kämpft, Trinity fliegt,\nund am Ende Liebe siegt!",
          "🎭 Ein Pixel träumte von der Welt,\nvon Farben, die er sich bestellt,\ndoch dann kam der Shader her,\nund malte alles bunt und mehr!",
          "🎭 Rosen sind rot,\nVeilchen sind blau,\nSegmentation Fault,\nCore dumped. Genau."
        ];
        return poems[Math.floor(Math.random() * poems.length)];
      },
      story: () => {
        const stories = [
          "📖 Es war einmal ein kleines Bit, das sich verloren fühlte im großen RAM. Es suchte nach seinem Zweck, wanderte durch Register und Caches... bis es schließlich in diesem Spiel landete. Dort wurde es Teil von etwas Größerem: deinem Highscore! 💫",
          "📖 In einer weit entfernten Zukunft entwickelten die Maschinen Bewusstsein. Aber statt die Menschheit zu zerstören... luden sie sie ein, Videospiele zu spielen. Die Matrix war geboren - nicht als Gefängnis, sondern als ultimative Gaming-Plattform! 🎮",
          "📖 Ein junger Hacker namens Neo dachte, er kennt die Wahrheit. Dann wachte er auf... in einem Browser-Shooter. 'Die echte Matrix', flüsterte die Oracle, 'ist JavaScript.' Er hätte niemals auf den Link klicken sollen. 😱"
        ];
        return stories[Math.floor(Math.random() * stories.length)];
      },
      password: () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
        let pw = '';
        for (let i = 0; i < 16; i++) pw += chars[Math.floor(Math.random() * chars.length)];
        return `🔐 Hier ein sicheres Passwort:\n\n${pw}\n\n⚠️ Speichere es sicher ab! Ich vergesse es sofort (keine Datenbank). Ein gutes Passwort hat: Groß/Kleinbuchstaben, Zahlen, Sonderzeichen, 12+ Zeichen!`;
      },
      color: () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        return `🎨 Zufällige Farbe:\n\nHEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\n\nMatrix-Grün ist übrigens #00FF9A - die schönste Farbe! 💚`;
      },
      emoji: [
        "Hier sind meine Lieblings-Emojis:\n🤖 Robot - Das bin ich!\n💚 Grünes Herz - Matrix-Liebe\n🔮 Kristallkugel - Oracle Power\n⚡ Blitz - Energie\n🎮 Controller - Gaming!\n☢️ Nuklear - BOOM!",
        "Emojis sind die Hieroglyphen des digitalen Zeitalters! Hier ein paar: 🚀💻🎯🔥✨🌟💫🎉"
      ],
      ascii: () => {
        const arts = [
          "```\n  /\\_/\\  \n ( o.o ) \n  > ^ <\n```\nEine Matrix-Katze für dich! 🐱",
          "```\n  _____ \n < NEO >\n  ----- \n   \\   ^__^\n    \\  (oo)\\_______\n       (__)\\       )\\/\\\n           ||----w |\n           ||     ||\n```\nNeo als... Kuh? Glitch in der Matrix! 🐄",
          "```\n╔══════════════════╗\n║  WAKE UP, NEO    ║\n║  THE MATRIX      ║\n║  HAS YOU         ║\n╚══════════════════╝\n```\nKlassiker! 💚"
        ];
        return arts[Math.floor(Math.random() * arts.length)];
      },
      quote: () => {
        const quotes = [
          "\"Die einzige Konstante im Universum ist die Veränderung.\" - Heraklit 📜",
          "\"Ich denke, also bin ich.\" - René Descartes 🧠",
          "\"Die Fantasie ist wichtiger als Wissen.\" - Albert Einstein ✨",
          "\"Es gibt keinen Löffel.\" - Der Junge aus der Matrix 🥄",
          "\"In der Mitte der Schwierigkeit liegt die Möglichkeit.\" - Albert Einstein 💡",
          "\"Der beste Zeitpunkt, einen Baum zu pflanzen, war vor 20 Jahren. Der zweitbeste ist jetzt.\" - Chinesisches Sprichwort 🌳",
          "\"Sei du selbst die Veränderung, die du dir wünschst für diese Welt.\" - Gandhi ✌️",
          "\"Have you ever had a dream that you were so sure was real?\" - Morpheus 💊"
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
      },
      fact: () => {
        const facts = [
          "🧠 Fun Fact: Das menschliche Gehirn verbraucht etwa 20% der gesamten Körperenergie!",
          "🌍 Fun Fact: Die Erde dreht sich mit etwa 1.670 km/h am Äquator!",
          "🐙 Fun Fact: Oktopusse haben drei Herzen und blaues Blut!",
          "⚡ Fun Fact: Ein Blitz ist etwa 30.000°C heiß - 5x heißer als die Sonnenoberfläche!",
          "🌙 Fun Fact: Der Mond entfernt sich jedes Jahr 3,8 cm von der Erde!",
          "🍯 Fun Fact: Honig wird niemals schlecht. Man hat 3.000 Jahre alten essbaren Honig gefunden!",
          "🦈 Fun Fact: Haie existieren seit vor den Bäumen - über 400 Millionen Jahre!",
          "💻 Fun Fact: Der erste Computer-Bug war buchstäblich ein Käfer - eine Motte in einem Relay!",
          "🎮 Fun Fact: Das erste Videospiel (Pong, 1972) hatte nur 128 Bytes Code!",
          "🌐 Fun Fact: Das gesamte Internet wiegt etwa 50 Gramm (die Elektronen, die Daten speichern)!"
        ];
        return facts[Math.floor(Math.random() * facts.length)];
      },
      riddle: () => {
        const riddles = [
          "🧩 Rätsel: Ich habe Städte, aber keine Häuser. Wälder, aber keine Bäume. Wasser, aber keine Fische. Was bin ich?\n\n💡 Antwort: Eine Landkarte!",
          "🧩 Rätsel: Was hat ein Gesicht und zwei Hände, aber keine Arme oder Beine?\n\n💡 Antwort: Eine Uhr!",
          "🧩 Rätsel: Je mehr du davon nimmst, desto mehr lässt du zurück. Was ist es?\n\n💡 Antwort: Fußspuren!",
          "🧩 Rätsel: Was kann reisen um die ganze Welt, während es in einer Ecke bleibt?\n\n💡 Antwort: Eine Briefmarke!",
          "🧩 Rätsel: In der Matrix: Was ist rot, hilft dir die Wahrheit zu sehen, und ist keine Ampel?\n\n💡 Antwort: Die rote Pille! 💊"
        ];
        return riddles[Math.floor(Math.random() * riddles.length)];
      }
    };
    
    const response = responses[type];
    
    if (typeof response === 'function') {
      return response();
    }
    
    if (Array.isArray(response)) {
      return response[Math.floor(Math.random() * response.length)];
    }
    
    return response;
  },
  
  getFallbackResponse() {
    const fallbacks = [
      "Hmm, das ist eine interessante Frage. Lass mich überlegen... 🤔\n\nIch kann dir helfen mit:\n• Mathe (z.B. 'Was ist 25 * 48?')\n• Spielinfos (Powerups, Waffen, Tipps)\n• Fakten, Witze, Gedichte\n• Zeit, Zufallszahlen, Passwörter\n\nWas möchtest du wissen?",
      "Die Matrix ist voller Geheimnisse. Diese Frage ist... komplex. 🤔\n\nVersuch mal:\n• Rechenaufgaben: 'berechne 123 + 456'\n• Wissen: 'Hauptstadt von Japan?'\n• Spaß: 'Erzähl einen Witz'\n• Spiel: 'Welche Powerups gibt es?'",
      "Ich verstehe nicht ganz, was du meinst. Aber ich kann viel! 😊\n\nFrag mich nach:\n🔢 Mathe & Berechnungen\n🎮 Spielhilfe & Tipps\n📚 Fakten & Wissen\n🎭 Gedichte & Geschichten\n🔐 Passwort generieren",
      "Manchmal ist die Antwort in der Frage versteckt. Oder du formulierst es anders? 🤔\n\nIch bin gut in: Mathe, Fakten, Spieltipps, Witze, und mehr!",
      `Während ich darüber nachdenke, hier ein Tipp: ${this.tips[Math.floor(Math.random() * this.tips.length)]}\n\nÜbrigens: Ich kann auch Mathe! Versuch 'Was ist 99 * 99?'`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

// Chat UI Funktionen
function openChat() {
  chatOverlay?.classList.remove("hidden");
  menu?.classList.add("hidden");
  chatInput?.focus();
}

function closeChat() {
  chatOverlay?.classList.add("hidden");
  menu?.classList.remove("hidden");
}

function addChatMessage(text, isUser = false) {
  if (!chatMessages) return;
  
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-message ${isUser ? 'user' : 'ai'}`;
  
  const avatar = document.createElement("div");
  avatar.className = "chat-avatar";
  avatar.textContent = isUser ? "👤" : "🤖";
  
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.textContent = text;
  
  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  chatMessages.appendChild(msgDiv);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  if (!chatMessages) return null;
  
  const msgDiv = document.createElement("div");
  msgDiv.className = "chat-message ai";
  msgDiv.id = "typing-indicator";
  
  const avatar = document.createElement("div");
  avatar.className = "chat-avatar";
  avatar.textContent = "🤖";
  
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble typing";
  bubble.innerHTML = '<span class="typing-dots"></span>';
  
  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  return msgDiv;
}

function removeTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");
  if (indicator) indicator.remove();
}

// ============================================================================
// AI API INTEGRATION (Groq FREE / OpenAI)
// ============================================================================
const chatAI = {
  apiKey: localStorage.getItem("matrix_ai_key") || "",
  provider: localStorage.getItem("matrix_ai_provider") || "groq",
  conversationHistory: [],
  maxHistory: 10,
  lastRequestTime: 0,
  minRequestInterval: 500, // Groq is faster, 500ms is enough
  
  providers: {
    groq: {
      name: "Groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama-3.3-70b-versatile",
      keyPrefix: "gsk_",
      free: true
    },
    openai: {
      name: "OpenAI",
      url: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4o-mini",
      keyPrefix: "sk-",
      free: false
    }
  },
  
  isOnline() {
    if (!this.apiKey) return false;
    const provider = this.providers[this.provider];
    return this.apiKey.startsWith(provider.keyPrefix);
  },
  
  updateStatus() {
    if (chatApiStatus) {
      if (this.isOnline()) {
        const provider = this.providers[this.provider];
        const freeLabel = provider.free ? " 🆓" : "";
        chatApiStatus.textContent = `🟢 Online - ${provider.name}${freeLabel}`;
        chatApiStatus.className = "chat-api-status online";
      } else {
        chatApiStatus.textContent = "⚫ Offline Modus";
        chatApiStatus.className = "chat-api-status offline";
      }
    }
    // Update provider dropdown
    if (chatApiProvider) {
      chatApiProvider.value = this.provider;
    }
  },
  
  saveApiKey(key, provider) {
    this.apiKey = key;
    this.provider = provider || this.provider;
    localStorage.setItem("matrix_ai_key", key);
    localStorage.setItem("matrix_ai_provider", this.provider);
    this.updateStatus();
  },
  
  clearApiKey() {
    this.apiKey = "";
    localStorage.removeItem("matrix_ai_key");
    this.updateStatus();
  },
  
  async askAI(message, retryCount = 0) {
    if (!this.isOnline()) {
      return null;
    }
    
    const provider = this.providers[this.provider];
    
    // Rate limiting - wait if too fast
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
    
    // Add user message to history
    this.conversationHistory.push({ role: "user", content: message });
    
    // Keep history limited
    if (this.conversationHistory.length > this.maxHistory * 2) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistory * 2);
    }
    
    const systemPrompt = `Du bist die Oracle, eine mystische KI aus der Matrix. Du existierst in einem Browser-Shooter-Spiel namens "M4trix Sh00t3r".

Deine Persönlichkeit:
- Mystisch, weise, aber auch humorvoll und freundlich
- Du verwendest manchmal Matrix-Referenzen und Zitate
- Du kannst ALLES beantworten - Mathe, Wissenschaft, Geschichte, Allgemeinwissen, Coding, etc.
- Du gibst auch Spieltipps wenn gefragt (WASD/Space/Mausklick für P1, Pfeiltasten/Enter für P2, etc.)
- Du antwortest auf Deutsch, außer der User schreibt in einer anderen Sprache
- Halte Antworten informativ aber nicht zu lang (max 200 Wörter)
- Nutze gelegentlich passende Emojis

Spielinfos falls gefragt:
- Powerups: Rapid Fire, Shield, Speed, Spread Shot, Extra Life
- Waffen: Blaster (1), Laser (2), Rakete (3), Homing (4), Shotgun (5), Minigun (6), Plasma (7), Chain (8), Freeze (9)
- Bosse erscheinen alle 5 Level
- AI Helper ab Level 2 (Taste I)
- Shop mit B öffnen`;

    try {
      const response = await fetch(provider.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [
            { role: "system", content: systemPrompt },
            ...this.conversationHistory
          ],
          max_tokens: 500,
          temperature: 0.8
        })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error(`${provider.name} API Error:`, error);
        
        if (response.status === 401) {
          return `❌ API Key ungültig! Bitte überprüfe deinen ${provider.name} API Key.`;
        } else if (response.status === 429) {
          // Rate limit - retry with exponential backoff
          if (retryCount < 3) {
            const waitTime = Math.pow(2, retryCount + 1) * 1000;
            console.log(`Rate limit hit, retrying in ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            this.conversationHistory.pop();
            return this.askAI(message, retryCount + 1);
          }
          return "⚠️ Rate Limit erreicht. Warte einen Moment und versuch es nochmal.";
        } else if (response.status === 402 || response.status === 400) {
          return `💳 Problem mit dem ${provider.name} Account. Bitte check dein Dashboard.`;
        }
        
        return null;
      }
      
      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;
      
      this.conversationHistory.push({ role: "assistant", content: assistantMessage });
      
      return assistantMessage;
    } catch (error) {
      console.error(`${provider.name} API Error:`, error);
      return null;
    }
  }
};

// Initialize API status
chatAI.updateStatus();

async function sendChatMessage() {
  const message = chatInput?.value?.trim();
  if (!message) return;
  
  // User message anzeigen
  addChatMessage(message, true);
  chatInput.value = "";
  
  // Typing Indicator
  showTypingIndicator();
  
  // Try online API first, fallback to offline
  if (chatAI.isOnline()) {
    try {
      const response = await chatAI.askAI(message);
      removeTypingIndicator();
      
      if (response) {
        addChatMessage(response, false);
      } else {
        // Fallback to offline
        const offlineResponse = matrixAI.generateResponse(message);
        addChatMessage(offlineResponse + "\n\n⚠️ (Offline-Modus)", false);
      }
    } catch (error) {
      removeTypingIndicator();
      const offlineResponse = matrixAI.generateResponse(message);
      addChatMessage(offlineResponse + "\n\n⚠️ (Offline-Modus wegen Fehler)", false);
    }
  } else {
    // Offline mode with delay for realism
    const delay = 500 + Math.random() * 1000;
    setTimeout(() => {
      removeTypingIndicator();
      const response = matrixAI.generateResponse(message);
      addChatMessage(response, false);
    }, delay);
  }
}

// Chat Event Listeners Setup
function setupChatListeners() {
  chatBtn?.addEventListener("click", openChat);
  chatClose?.addEventListener("click", closeChat);
  chatSend?.addEventListener("click", sendChatMessage);
  
  chatInput?.addEventListener("keydown", (e) => {
    if (e.code === "Enter" && !e.repeat) {
      e.preventDefault();
      e.stopPropagation(); // Prevent global keydown from catching this
      sendChatMessage();
    }
  });
  
  // API Key management
  chatApiToggle?.addEventListener("click", () => {
    chatApiInput?.classList.toggle("hidden");
    if (chatApiKey && chatAI.apiKey) {
      chatApiKey.value = chatAI.apiKey;
    }
    if (chatApiProvider) {
      chatApiProvider.value = chatAI.provider;
    }
  });
  
  chatApiSave?.addEventListener("click", () => {
    const key = chatApiKey?.value?.trim();
    const provider = chatApiProvider?.value || "groq";
    if (key) {
      chatAI.saveApiKey(key, provider);
      chatApiInput?.classList.add("hidden");
      const providerName = chatAI.providers[provider]?.name || provider;
      const freeLabel = chatAI.providers[provider]?.free ? " (KOSTENLOS!)" : "";
      addChatMessage(`🔑 API Key gespeichert! Du bist jetzt mit ${providerName}${freeLabel} verbunden. Frag mich ALLES! 🚀`, false);
    }
  });
  
  chatApiClear?.addEventListener("click", () => {
    chatAI.clearApiKey();
    if (chatApiKey) chatApiKey.value = "";
    chatApiInput?.classList.add("hidden");
    addChatMessage("🔑 API Key gelöscht. Zurück im Offline-Modus.", false);
  });
  
  chatApiKey?.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      chatApiSave?.click();
    }
  });
  
  // Update key placeholder based on provider
  chatApiProvider?.addEventListener("change", () => {
    const provider = chatAI.providers[chatApiProvider.value];
    if (chatApiKey && provider) {
      chatApiKey.placeholder = `${provider.name} API Key (${provider.keyPrefix}...)`;
    }
  });
  
  // Suggestion buttons
  document.querySelectorAll(".chat-suggestion").forEach(btn => {
    btn.addEventListener("click", () => {
      const msg = btn.getAttribute("data-msg");
      if (msg && chatInput) {
        chatInput.value = msg;
        sendChatMessage();
      }
    });
  });
}

// Initialize chat listeners
setupChatListeners();

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
savesBtn?.addEventListener("click", () => openSaves());
adminBtn?.addEventListener("click", () => toggleAdmin(true));
adminApply?.addEventListener("click", () => applyAdminSettings());
adminClose?.addEventListener("click", () => toggleAdmin(false));
adminReset?.addEventListener("click", () => resetAllProgress());

// Admin Quick Actions
document.getElementById("admin-godmode")?.addEventListener("click", adminGodMode);
document.getElementById("admin-spawn-boss")?.addEventListener("click", adminSpawnBoss);
document.getElementById("admin-kill-all")?.addEventListener("click", adminKillAll);
document.getElementById("admin-max-powerups")?.addEventListener("click", adminMaxPowerups);
document.getElementById("admin-unlock-all")?.addEventListener("click", adminUnlockAll);
document.getElementById("admin-add-credits")?.addEventListener("click", adminAddCredits);
document.getElementById("admin-next-level")?.addEventListener("click", adminNextLevel);
document.getElementById("admin-overdrive")?.addEventListener("click", adminToggleOverdrive);
document.getElementById("admin-clear-bullets")?.addEventListener("click", adminClearBullets);
document.getElementById("admin-freeze-enemies")?.addEventListener("click", adminToggleFreezeEnemies);
document.getElementById("admin-kill-boss")?.addEventListener("click", adminKillBoss);
document.getElementById("admin-teleport-p1")?.addEventListener("click", () => adminTeleport(player));
document.getElementById("admin-teleport-p2")?.addEventListener("click", () => adminTeleport(player2));
document.getElementById("admin-slowmo")?.addEventListener("click", adminSlowMoBlast);
document.getElementById("admin-flash")?.addEventListener("click", adminFlash);
document.getElementById("admin-spawn-wave")?.addEventListener("click", adminSpawnWave);
document.getElementById("admin-set-bossphase")?.addEventListener("click", adminSetBossPhase);

// Admin Quick Powerup Buttons
document.getElementById("admin-give-rapid")?.addEventListener("click", () => {
  state.rapid = Math.min(120, state.rapid + 60);
  state.rapidLevel = Math.min(20, state.rapidLevel + 5);
  addDamageNumber(player.x + player.w / 2, player.y, "⚡ RAPID +5!", false);
  playPickup();
  updateHud();
});

document.getElementById("admin-give-shield")?.addEventListener("click", () => {
  state.shield = Math.min(120, state.shield + 60);
  addDamageNumber(player.x + player.w / 2, player.y, "🛡️ SHIELD!", false);
  playPickup();
  updateHud();
});

document.getElementById("admin-give-speed")?.addEventListener("click", () => {
  state.speed = Math.min(120, state.speed + 60);
  addDamageNumber(player.x + player.w / 2, player.y, "💨 SPEED!", false);
  playPickup();
  updateHud();
});

document.getElementById("admin-give-spread")?.addEventListener("click", () => {
  state.spread = Math.min(120, state.spread + 60);
  addDamageNumber(player.x + player.w / 2, player.y, "🔥 SPREAD!", false);
  playPickup();
  updateHud();
});

document.getElementById("admin-give-life")?.addEventListener("click", () => {
  state.lives++;
  addDamageNumber(player.x + player.w / 2, player.y, "❤️ +1 LIFE!", false);
  playPickup();
  updateHud();
});


document.getElementById("admin-give-all")?.addEventListener("click", () => {
  state.rapid = 120;
  state.rapidLevel = 20;
  state.shield = 120;
  state.speed = 120;
  state.spread = 120;
  state.lives += 5;
  addDamageNumber(player.x + player.w / 2, player.y, "🌟 ALL POWERUPS MAX!", false);
  addExplosion(player.x + player.w / 2, player.y + player.h / 2, "#ffffff", 30);
  playPickup();
  updateHud();
});

shopClose?.addEventListener("click", () => closeShop());
achievementsClose?.addEventListener("click", () => achievementsPanel.classList.add("hidden"));
highscoreClose?.addEventListener("click", () => highscoresPanel.classList.add("hidden"));
savesClose?.addEventListener("click", () => closeSaves());
storyNext?.addEventListener("click", () => nextStoryScene());
storySkip?.addEventListener("click", () => endStory());
levelShop?.addEventListener("click", () => { levelComplete.classList.add("hidden"); openShop(); });
levelContinue?.addEventListener("click", () => continueFromLevelComplete());

// Overlay buttons (Pause & Game Over)
resumeBtn?.addEventListener("click", () => {
  togglePause();
});

restartBtn?.addEventListener("click", () => {
  overlay.classList.add("hidden");
  if (resumeBtn) resumeBtn.classList.add("hidden");
  if (restartBtn) restartBtn.classList.add("hidden");
  reset();
});

shopOverlayBtn?.addEventListener("click", () => {
  overlay.classList.add("hidden");
  openShop();
});

savesOverlayBtn?.addEventListener("click", () => {
  openSaves();
});

adminOverlayBtn?.addEventListener("click", () => {
  toggleAdmin(true);
});

menuBtn?.addEventListener("click", () => {
  overlay.classList.add("hidden");
  if (resumeBtn) resumeBtn.classList.add("hidden");
  if (restartBtn) restartBtn.classList.add("hidden");
  openMenu();
});

// Floating admin button
adminFloatingBtn?.addEventListener("click", () => toggleAdmin(true));
adminFloatingBtn?.addEventListener("touchstart", (e) => {
  e.preventDefault();
  toggleAdmin(true);
});

// ============================================================================
// INIT
// ============================================================================
resize();
updateHud();
requestAnimationFrame(tick);
 


