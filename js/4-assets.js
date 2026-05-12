// 4. ASSETS + AUDIO
// Fungsi: Menyimpan path URL dan menginisialisasi semua resource gambar dan audio secara LOKAL.

// --- AUDIO ---
// Asumsi folder audio (BGM & SFX) juga berada di dalam folder ASSETS
const sfxBase = "./ASSETS/SFX/";
const walkSfx = new Audio(`${sfxBase}SFX Jalan Jack.mp3`);
const runSfx = new Audio(`${sfxBase}SFX Lari Jack.mp3`);
walkSfx.loop = true; runSfx.loop = true;

const bgmUrl = `./ASSETS/BGM/19 - Town.mp3`;
const gameBgm = new Audio(bgmUrl);
gameBgm.loop = true;
gameBgm.volume = 0.4;

const jumpSfx = new Audio(`${sfxBase}Jump-Sfx.mp3`);

const startSfx = new Audio(`${sfxBase}Select.mp3`);


// --- GAMBAR KARAKTER ---
const charBase = `./ASSETS/CHAR/MC/JACK/`;
const walkBase = `./ASSETS/CHAR/MC/JACK/WALK/`; // <-- Ini untuk animasi Walk
const runBase = `./ASSETS/CHAR/MC/JACK/RUN/`;
const jumpBase = `./ASSETS/CHAR/MC/JACK/JUMP/`;
const idleBase = `./ASSETS/CHAR/MC/JACK/IDLE/`; 
const shadowUrl = `./ASSETS/CHAR/Char-Shadow.gif`; // Posisi baru shadow

const assetPaths = {
  walk: { 
    left: walkBase+"Jack-Walk-Y.gif", 
    up: walkBase+"Jack-Walk-Y.gif", 
    down: walkBase+"Jack-Walk-X.gif", 
    right: walkBase+"Jack-Walk-X.gif" 
  },
  run: { 
    left: runBase+"Jack-Run-Y.gif", 
    up: runBase+"Jack-Run-Y.gif", 
    down: runBase+"Jack-Run-X.gif", 
    right: runBase+"Jack-Run-X.gif" 
  },
  idle: { 
    up: idleBase+"IdleY-2.png", 
    down: idleBase+"IdleX-1.png", 
    left: idleBase+"IdleY-1.png", 
    right: idleBase+"IdleX-2.png" 
  },
  jump: { 
    x: jumpBase+"JumpY.png", 
    y: jumpBase+"JumpX.png" 
  }
};

function preloadAssets() {
  const preloaderDiv = document.getElementById("preloader");
  
  const urls = [
    ...Object.values(assetPaths.walk), 
    ...Object.values(assetPaths.run), 
    ...Object.values(assetPaths.idle), 
    ...Object.values(assetPaths.jump), 
    shadowUrl
  ];
  
  urls.forEach(url => { 
    // Buat elemen <img> asli
    const img = document.createElement("img"); 
    img.src = url; 
    // Masukkan ke dalam HTML agar browser melakukan "Hard Render"
    preloaderDiv.appendChild(img); 
  });
  
  shadow.style.backgroundImage = `url('${shadowUrl}')`;
}

function setPlayerImage(url, mirror = false) {
  if (currentImgUrl !== url) { 
    player.style.backgroundImage = `url('${url}')`; 
    currentImgUrl = url; 
  }
  player.style.transform = `translate3d(-50%, -50%, 0) ${mirror ? 'scaleX(-1)' : 'scaleX(1)'}`;
}

function handleSfx(isMoving, isRunning) {
  if (isMoving && !isJumping) {
    if (isRunning) { 
      if (runSfx.paused) runSfx.play().catch(()=>{}); 
      walkSfx.pause(); 
    } else { 
      if (walkSfx.paused) walkSfx.play().catch(()=>{}); 
      runSfx.pause(); 
    }
  } else { 
    walkSfx.pause(); 
    runSfx.pause(); 
  }
}

function startBGM() {
  if (gameBgm.paused && !gameBgm.muted) {
    gameBgm.play().catch(() => {
      window.addEventListener('click', () => gameBgm.play(), { once: true });
    });
  }
}

function toggleMute() {
  gameBgm.muted = !gameBgm.muted;
  btnMute.innerText = gameBgm.muted ? "🔇 MUSIK: OFF" : "🔊 MUSIK: ON";
  if (!gameBgm.muted) startBGM();
}

btnMute.addEventListener("click", toggleMute);