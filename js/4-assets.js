// 4. ASSETS + AUDIO
// Fungsi: Menyimpan path URL dan menginisialisasi semua resource gambar dan audio.
// Fokus ke file ini jika Anda ingin mengubah musik (BGM), Sound Effect (SFX), sprite karakter saat lari/lompat/idle, atau fungsi manajemen pemutaran suara.

const repoRawBase = "https://raw.githubusercontent.com/Eija-01/HMVN-RPG/";
const walkSfx = new Audio(`${repoRawBase}main/Assets/SFX/SFX%20Jalan%20Jack.mp3`);
const runSfx = new Audio(`${repoRawBase}main/Assets/SFX/SFX%20Lari%20Jack.mp3`);
walkSfx.loop = true; runSfx.loop = true;

const bgmUrl = "https://raw.githubusercontent.com/Eija-01/HMVN-RPG/4ce92f56d3f355ec32d74065a7a8392a1e72ac80/Assets/BGM/19%20-%20Town.mp3";
const gameBgm = new Audio(bgmUrl);
gameBgm.loop = true;
gameBgm.volume = 0.4;

const jumpSfx = new Audio("https://raw.githubusercontent.com/Eija-01/HMVN-RPG/1076469896ed64862830280ab084984499e3be7a/Assets/SFX/Jump-Sfx.mp3");

const charBase = `${repoRawBase}d2b8dd9a8d76bbf134f47b795b18b85d644fcf2d/Assets/Main%20Char/Jack/`;
const runBase = `${repoRawBase}main/Assets/Main%20Char/Jack/Run/`;
const jumpBase = `https://raw.githubusercontent.com/Eija-01/HMVN-RPG/4dd65ad685e6979b7193b523cbbaec6b2a204ba1/Assets/Main%20Char/Jack/Jump/`;
const shadowUrl = "https://raw.githubusercontent.com/Eija-01/HMVN-RPG/064535ca75d47790273457dc5fff14d6d98686b1/Assets/Main%20Char/Char-Shadow.gif";

const assetPaths = {
  walk: { up: charBase+"Jack-Walk-Y2.gif", down: charBase+"Jack-Walk-X1.gif", left: charBase+"Jack-Walk-Y1.gif", right: charBase+"Jack-Walk-X2.gif" },
  run: { left: runBase+"Jack-Run-Y.gif", up: runBase+"Jack-Run-Y.gif", down: runBase+"Jack-Run-X.gif", right: runBase+"Jack-Run-X.gif" },
  idle: { up: charBase+"IdleY-2.png", down: charBase+"IdleX-1.png", left: charBase+"IdleY-1.png", right: charBase+"IdleX-2.png" },
  jump: { x: jumpBase+"JumpX.png", y: jumpBase+"JumpY.png" }
};

function preloadAssets() {
  const urls = [...Object.values(assetPaths.walk), ...Object.values(assetPaths.run), ...Object.values(assetPaths.idle), ...Object.values(assetPaths.jump), shadowUrl];
  urls.forEach(url => { const img = new Image(); img.src = url; });
  shadow.style.backgroundImage = `url('${shadowUrl}')`;
}

function setPlayerImage(url, mirror = false) {
  if (currentImgUrl !== url) { player.style.backgroundImage = `url('${url}')`; currentImgUrl = url; }
  player.style.transform = `translate3d(-50%, -50%, 0) ${mirror ? 'scaleX(-1)' : 'scaleX(1)'}`;
}

function handleSfx(isMoving, isRunning) {
  if (isMoving && !isJumping) {
    if (isRunning) { if (runSfx.paused) runSfx.play().catch(()=>{}); walkSfx.pause(); }
    else { if (walkSfx.paused) walkSfx.play().catch(()=>{}); runSfx.pause(); }
  } else { walkSfx.pause(); runSfx.pause(); }
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