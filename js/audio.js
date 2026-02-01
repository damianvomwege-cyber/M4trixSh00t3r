// ============================================================================
// M4TRIX SH00T3R - Audio System
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
