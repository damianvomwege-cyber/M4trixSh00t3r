// ============================================================================
// M4TRIX SH00T3R - Configuration & Constants
// ============================================================================

const SERVER_URL = "https://m4trixsh00t3r.onrender.com";

// ============================================================================
// WEAPONS
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
// STORY
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
// SHOP
// ============================================================================
const SHOP_ITEMS = [
  { id: "weapon_2", name: "Laser Gun", icon: "🔫", price: 500, type: "weapon", weaponId: 2 },
  { id: "weapon_3", name: "Rockets", icon: "🚀", price: 1000, type: "weapon", weaponId: 3 },
  { id: "weapon_4", name: "Homing Missiles", icon: "🎯", price: 2000, type: "weapon", weaponId: 4 },
  { id: "weapon_5", name: "Shotgun", icon: "💥", price: 800, type: "weapon", weaponId: 5 },
  { id: "weapon_6", name: "Minigun", icon: "🔥", price: 1500, type: "weapon", weaponId: 6 },
  { id: "weapon_7", name: "Plasma Cannon", icon: "⚡", price: 2500, type: "weapon", weaponId: 7 },
  { id: "weapon_8", name: "Chain Lightning", icon: "⛓", price: 3000, type: "weapon", weaponId: 8 },
  { id: "weapon_9", name: "Freeze Ray", icon: "❄️", price: 3500, type: "weapon", weaponId: 9 },
  { id: "life_up", name: "Extra Life", icon: "❤️", price: 300, type: "consumable", effect: "life" },
  { id: "shield_up", name: "Shield Boost", icon: "🛡", price: 200, type: "consumable", effect: "shield" },
  { id: "speed_up", name: "Speed Boost", icon: "⚡", price: 150, type: "consumable", effect: "speed" },
  { id: "damage_up", name: "Damage +10%", icon: "💥", price: 800, type: "upgrade", stat: "damage", owned: false },
  { id: "fire_rate", name: "Fire Rate +15%", icon: "🔥", price: 600, type: "upgrade", stat: "firerate", owned: false },
];

// ============================================================================
// CONFIG DEFAULTS
// ============================================================================
const config = {
  startLevel: 1,
  startLives: 3,
  spawnRate: 1.2,
  aiUnlockLevel: 2,
  aiEnabled: false,
  aiLives: 3,
  aiCount: 1,
  powerupChances: {
    rapid: 0.6,
    shield: 0.2,
    life: 0.2,
    speed: 0.5,
    spread: 0.3,
  },
};
