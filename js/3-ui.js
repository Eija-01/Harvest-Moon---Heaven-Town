// 3. UI & DOM (Tambahan)
// Fungsi: Mengambil dan menangani elemen HTML, serta logika antar muka pengguna (pengaturan rasio layar, overlay menu, orientasi layar).
// Fokus ke file ini jika ingin mengubah perilaku DOM di luar gameplay (misal: mengganti orientasi ke lanskap/potret, menampilkan menu setting, transisi HUD gamepad).

const gameContainer = document.getElementById("gameContainer");
const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const shadow = document.getElementById("shadow");
const ratioSelect = document.getElementById("ratioSelect");
const mapSelect = document.getElementById("mapSelect");
const sideMenu = document.getElementById("settingsOverlay");
const openBtn = document.getElementById("openSettings");
const togglePadBtn = document.getElementById("btnTogglePad");
const btnMute = document.getElementById("btnMute");

// --- AUTO ROTATE DETECTOR ---
function handleAutoRotate() {
  // window.matchMedia membaca sensor fisik / ukuran asli layar saat ini
  if (window.matchMedia("(orientation: landscape)").matches) {
    document.body.classList.add("landscape-mode");
  } else {
    document.body.classList.remove("landscape-mode");
  }
  // Panggil changeRatio() untuk merapikan UI dan rasio canvas game
  setTimeout(changeRatio, 100); 
}

// Pasang "telinga" agar JS bereaksi setiap kali layar di-resize atau hape diputar
window.addEventListener("resize", handleAutoRotate);
window.addEventListener("orientationchange", handleAutoRotate);

// Panggil fungsi sekali di awal agar game langsung menyesuaikan posisi saat baru pertama kali dibuka
handleAutoRotate();
// ----------------------------

togglePadBtn.onclick = (e) => {
  e.stopPropagation();
  document.body.classList.toggle("pad-active");
  togglePadBtn.innerText = document.body.classList.contains("pad-active") ? "❌ HIDE" : "🎮 PAD";
  changeRatio();
  startBGM(); // Ini akan memanggil fungsi dari assets.js nanti
};

openBtn.onclick = (e) => {
  e.stopPropagation();
  sideMenu.classList.toggle("active");
  startBGM();
};

window.onclick = (event) => {
  if (!sideMenu.contains(event.target) && event.target !== openBtn) {
    if (sideMenu.classList.contains("active")) {
      sideMenu.classList.remove("active");
    }
  }
  startBGM();
};

function changeRatio() {
  const v = ratioSelect.value;
  const isPadActive = document.body.classList.contains("pad-active");
  const isLandscape = document.body.classList.contains("landscape-mode");
  let maxHeightValue = (isPadActive && !isLandscape) ? 60 : 100;
  gameContainer.style.maxWidth = "100vw";
  if (v === "full") { 
    targetResHeight = 720; 
    gameContainer.style.width = "100vw"; 
    gameContainer.style.height = maxHeightValue + "vh"; 
    gameContainer.style.aspectRatio = "unset";
  } else { 
    const p = v.split('x'); 
    const targetW = parseInt(p[0]);
    const targetH = parseInt(p[1]);
    targetResHeight = targetH; 
    const ratio = targetW / targetH;
    gameContainer.style.aspectRatio = `${targetW} / ${targetH}`;
    gameContainer.style.height = "auto";
    gameContainer.style.maxHeight = maxHeightValue + "vh";
    gameContainer.style.width = `min(100vw, calc(${maxHeightValue}vh * ${ratio}))`;
  }
  // setTimeout(updateVisuals, 100); -> Dipanggil di logic.js
}
ratioSelect.addEventListener("change", changeRatio);

function changeMap() {
  // Langsung ambil nama file dari value HTML
  const mapName = mapSelect.value;
  // Arahkan ke folder lokal
  const url = `./ASSETS/MAPS/${mapName}`;
  
  const img = new Image();
  img.onload = () => {
    currentNaturalWidth = img.naturalWidth; 
    currentNaturalHeight = img.naturalHeight;
    gameArea.style.backgroundImage = `url('${url}')`; 
  };
  img.src = url;
}
mapSelect.addEventListener("change", changeMap);