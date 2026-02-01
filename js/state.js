// ============================================================================
// M4TRIX SH00T3R - Game State & Objects
// ============================================================================

// ============================================================================
// DOM ELEMENTS
// ============================================================================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

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
  screenShake: 0,
  screenShakeIntensity: 0,
  slowMo: 0,
  slowMoFactor: 1,
  flash: 0,
  flashColor: "#ffffff",
  p1RespawnTimer: 0,
  p2RespawnTimer: 0,
  p1Dead: false,
  p1Invincible: 0,
  wasRunning: true,
  godMode: false,
  infiniteAmmo: false,
  p2GodMode: false,
  spawningEnabled: true,
  enemySpeedMultiplier: 1,
  enemyHpMultiplier: 1,
  aiDamageMultiplier: 1,
};

// ============================================================================
// PLAYER OBJECTS
// ============================================================================
const player = {
  x: 0, y: 0, w: 26, h: 26,
  speed: 280, baseCooldown: 0.18, cooldown: 0,
  color: "#00ff9a",
};

const mouse = { x: 0, y: 0, down: false };

const player2 = {
  x: 0, y: 0, w: 26, h: 26,
  speed: 280, baseCooldown: 0.18, cooldown: 0,
  color: "#ff6a6a", active: false, lives: 3, invincibleTimer: 0,
};

let p2CurrentWeapon = 1;
const p2Bullets = [];
const p2Keys = new Set();

// ============================================================================
// AI ALLIES
// ============================================================================
let allies = [];
const allyColors = ["#00e5ff", "#ff00ff", "#ffcc00", "#00ff00", "#ff6a00", "#b000ff", "#ff6a6a", "#7fffe3", "#ff00aa", "#00ffaa"];

function createAlly(index) {
  return {
    x: 0, y: 0, w: 22, h: 22,
    speed: 250, baseCooldown: 0.25, cooldown: 0,
    color: allyColors[index % allyColors.length],
    active: false, lives: 3, index: index,
  };
}

// ============================================================================
// GAME ARRAYS
// ============================================================================
const bullets = [];
const allyBullets = [];
const enemies = [];
const enemyBullets = [];
const powerups = [];
const particles = [];
const explosions = [];
const damageNumbers = [];
const trails = [];
const lightnings = [];
const lasers = [];
const rockets = [];
const homingMissiles = [];
let rainColumns = [];

// ============================================================================
// AUDIO STATE
// ============================================================================
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
// NETWORK STATE
// ============================================================================
let socket = null;
const netState = {
  connected: false,
  isHost: false,
  lobbyCode: null,
  guestConnected: false,
  lastSync: 0,
  syncInterval: 30,
  remotePlayer: { x: 0, y: 0, targetX: 0, targetY: 0, lives: 3, shooting: false },
  remoteBullets: [],
  interpolationFactor: 0.3,
};

// ============================================================================
// JOYSTICK STATE
// ============================================================================
const joystick = {
  active: false,
  touchId: null,
  startX: 0, startY: 0,
  currentX: 0, currentY: 0,
  dx: 0, dy: 0,
  maxDistance: 40,
};

// ============================================================================
// PERSISTENCE
// ============================================================================
let highscores = JSON.parse(localStorage.getItem("m4trix_highscores") || "[]");
let unlockedAchievements = JSON.parse(localStorage.getItem("m4trix_achievements") || "[]");
let ownedUpgrades = JSON.parse(localStorage.getItem("m4trix_upgrades") || "[]");
