// ============================================================================
// M4TRIX SH00T3R - Utility Functions
// ============================================================================

function rectsOverlap(a, b) {
  if (a.directional && a.x1 !== undefined) {
    return lineRectsIntersect(a.x1, a.y1, a.x2, a.y2, b.x, b.y, b.w, b.h);
  }
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function lineRectsIntersect(x1, y1, x2, y2, rx, ry, rw, rh) {
  if ((x1 >= rx && x1 <= rx + rw && y1 >= ry && y1 <= ry + rh) ||
      (x2 >= rx && x2 <= rx + rw && y2 >= ry && y2 <= ry + rh)) {
    return true;
  }
  return lineLineIntersect(x1, y1, x2, y2, rx, ry, rx + rw, ry) ||
         lineLineIntersect(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh) ||
         lineLineIntersect(x1, y1, x2, y2, rx, ry, rx, ry + rh) ||
         lineLineIntersect(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
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
    const dx = (enemy.x + enemy.w / 2) - px;
    const dy = (enemy.y + enemy.h / 2) - py;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) {
      bestDist = dist;
      nearest = enemy;
    }
  }
  return nearest;
}

function getScoreMultiplier() {
  if (state.combo <= 0) return 1;
  if (state.combo < 5) return 1 + state.combo * 0.1;
  if (state.combo < 10) return 1.5 + (state.combo - 5) * 0.15;
  if (state.combo < 25) return 2.25 + (state.combo - 10) * 0.1;
  return 3.75 + (state.combo - 25) * 0.05;
}

function addCombo() {
  state.combo++;
  state.comboTimer = 2;
  if (state.combo > state.maxCombo) state.maxCombo = state.combo;
  checkAchievement("combo_10", state.combo >= 10);
  checkAchievement("combo_25", state.combo >= 25);
}

function updateCombo(delta) {
  if (state.comboTimer > 0) {
    state.comboTimer -= delta;
    if (state.comboTimer <= 0) {
      state.combo = 0;
    }
  }
}

function generateLobbyCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function showConnectionStatus(text, type = "info") {
  if (connectionStatus && connectionText) {
    connectionText.textContent = text;
    connectionStatus.className = "connection-status " + type;
    connectionStatus.classList.remove("hidden");
  }
}

function hideConnectionStatus() {
  if (connectionStatus) {
    connectionStatus.classList.add("hidden");
  }
}
