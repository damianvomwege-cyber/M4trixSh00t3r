# 🎮 M4trix Sh00t3r

A Matrix-themed 2D space shooter built with vanilla JavaScript and HTML5 Canvas.

![Matrix Style](https://img.shields.io/badge/Style-Matrix-00ff9a)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)

## 🕹️ Play

Open `index.html` in your browser - no server required!

### Single Player Controls
- `W A S D` or `Arrow Keys` - Move
- `Space` - Shoot
- `1-4` - Switch Weapons
- `P` - Pause
- `M` - Menu
- `O` - Admin Panel

### 👥 Local Multiplayer Controls
Play with a friend on the same keyboard!

| Player | Move | Shoot |
|--------|------|-------|
| **P1** (Green) | `W A S D` | `Space` |
| **P2** (Red) | `Arrow Keys` | `Enter` or `Numpad 0` |

## ✨ Features

### 🔫 Weapons
| Key | Weapon | Description |
|-----|--------|-------------|
| 1 | Blaster | Standard rapid-fire |
| 2 | Laser | High damage beam |
| 3 | Rocket | Explosive projectiles |
| 4 | Homing Missile | Auto-tracking missiles |

### ⚡ Power-Ups
- **Rapid Fire** - Increased fire rate (stackable up to 20 levels)
- **Shield** - Temporary invulnerability
- **Speed** - 50% movement boost
- **Spread** - Triple shot pattern
- **Extra Life** - +1 HP

### 👾 Enemies
- **Normal** - Standard movement
- **Zigzag** - Erratic patterns
- **Shooter** - Fires back at you
- **Shielded** - Requires multiple hits

### 👹 Bosses
Epic boss battles every 5 levels with:
- 3 distinct phases
- Multiple attack patterns (spread, spiral, laser, charge, summon)
- Increasing difficulty

### 🤖 AI Helper
Unlock at Level 2! An AI companion that:
- Fights alongside you
- Collects power-ups
- Evades enemies

### 👥 Local Multiplayer
Couch co-op mode for 2 players:
- Both players share the screen
- Separate life counts
- Work together to beat the bosses!

### 🌐 Online Lobby System
Play with friends over the internet:
- **Create Lobby**: Get a 6-character code to share
- **Join Lobby**: Enter a friend's code to connect
- Real-time synchronized gameplay via Socket.io
- Works across all networks!

**Server Setup:** See `server/README.md` for deployment instructions.

### 🏪 Shop System
Earn credits by defeating enemies and buy:
- New weapons
- Consumables
- Permanent upgrades

### 🏆 Progression
- Achievements system
- Highscore leaderboard
- Story cutscenes
- Persistent upgrades

### 🎨 Visual Effects
- Matrix rain background
- Screen shake
- Slow-motion kills
- Damage numbers
- Combo multipliers
- Particle effects

### 🎵 Audio
- Procedural sound effects
- Dynamic background music

## 🛠️ Admin Panel

Press `O` to access the Admin Panel and customize:
- Level, Lives, Score, Credits
- Spawn rates
- Power-up chances
- AI settings
- Audio volumes
- Reset progress

## 📱 Mobile Support

Touch controls available for mobile devices.

## 🚀 Tech Stack

- **HTML5 Canvas** - Rendering
- **Vanilla JavaScript** - Game logic
- **Web Audio API** - Sound generation
- **CSS3** - UI styling
- **LocalStorage** - Save data

## 📄 License

MIT License - Feel free to modify and share!

---

Made with 💚 and Matrix vibes
