// 6. GAME LOGIC
// Fungsi: Sistem inti yang memproses mekanik permainan (game loop, perhitungan gravitasi, tabrakan, matematika update posisi visual).
// Fokus ke file ini jika Anda ingin mengubah CARA kerja suatu mekanik, seperti memodifikasi alur matematika lompatan atau algoritma kamera mengikuti pemain.

function performJump() {
  if (isJumping) return;
  isJumping = true;
  jumpTime = Date.now();
  startBGM();
  
  jumpSfx.currentTime = 0;
  jumpSfx.play().catch(()=>{});
  
  let jumpSprite;
  let shouldMirror = false;

  if (lastDirection === "up" || lastDirection === "left") {
    jumpSprite = assetPaths.jump.x;
    if (lastDirection === "up") shouldMirror = true;
  } else {
    jumpSprite = assetPaths.jump.y;
    if (lastDirection === "right") shouldMirror = true;
  }
  
  setPlayerImage(jumpSprite, shouldMirror);
}

function stopMove() {
  if (!activeKey && !isAPressed && !isJumping) { 
    setPlayerImage(assetPaths.idle[lastDirection], false); 
    handleSfx(false, false); 
  }
}

function updateVisuals() {
  const contW = gameContainer.clientWidth; 
  const contH = gameContainer.clientHeight;
  const contentScale = contH / targetResHeight;

  const mapW = currentNaturalWidth * FIXED_ZOOM * contentScale; 
  const mapH = currentNaturalHeight * FIXED_ZOOM * contentScale;
  const limitX = Math.max(0, (mapW - contW) / 2); 
  const limitY = Math.max(0, (mapH - contH) / 2);
  
  const dX = worldX * FIXED_ZOOM * contentScale; 
  const dY = worldY * FIXED_ZOOM * contentScale;
  
  const clX = Math.max(-limitX, Math.min(limitX, dX)); 
  const clY = Math.max(-limitY, Math.min(limitY, dY));
  const pSX = dX - clX; const pSY = dY - clY;

  gameArea.style.backgroundSize = `${mapW}px`;
  gameArea.style.backgroundPosition = `calc(50% - ${clX}px) calc(50% - ${clY}px)`;
  
  let pSize = baseCharSize * FIXED_ZOOM * contentScale;
  if (isJumping) {
      pSize *= jumpScale;
  }
  
  if (isJumping) {
    const elapsed = Date.now() - jumpTime;
    const progress = elapsed / jumpDuration;
    if (progress >= 1) {
      isJumping = false;
      jumpOffset = 0;
      stopMove();
    } else {
      jumpOffset = (4 * jumpMaxHeight * progress * (1 - progress)) * contentScale;
    }
  }

  player.style.width = `${pSize}px`;
  player.style.height = `${pSize}px`;
  player.style.left = `calc(50% + ${pSX}px)`;
  player.style.top = `calc(50% + ${pSY}px - ${jumpOffset}px)`;

  shadow.style.width = `${pSize * 0.75}px`;
  shadow.style.height = `${pSize * 0.75}px`;
  shadow.style.left = `calc(50% + ${pSX}px)`;
  shadow.style.top = `calc(50% + ${pSY}px)`;
}

function gameLoop() {
  let moveDir = activeKey ? activeKey.replace('arrow', '') : (isAPressed ? lastDirection : null);
  if (moveDir) {
    const curSpeed = isAPressed ? runSpeed : walkSpeed;
    const rad = angle * Math.PI / 180;
    const mX = Math.cos(rad) * curSpeed; const mY = Math.sin(rad) * curSpeed;
    handleSfx(true, isAPressed);
    
    switch(moveDir) {
      case "up": worldX += mX; worldY -= mY; lastDirection = "up"; if(!isJumping) setPlayerImage(isAPressed ? assetPaths.run.up : assetPaths.walk.up, true); break;
      case "down": worldX -= mX; worldY += mY; lastDirection = "down"; if(!isJumping) setPlayerImage(isAPressed ? assetPaths.run.down : assetPaths.walk.down, false); break;
      case "left": worldX -= mX; worldY -= mY; lastDirection = "left"; if(!isJumping) setPlayerImage(isAPressed ? assetPaths.run.left : assetPaths.walk.left, false); break;
      case "right": worldX += mX; worldY += mY; lastDirection = "right"; if(!isJumping) setPlayerImage(isAPressed ? assetPaths.run.right : assetPaths.walk.right, true); break;
    }
  }
  updateVisuals();
  requestAnimationFrame(gameLoop);
}

// Inisialisasi awal
window.onload = () => {
  preloadAssets(); 
  setupControls(); 
  mapSelect.value = "Alun Alun Desa Heaven Town.jpg";
  ratioSelect.value = "640x480";
  changeMap(); 
  changeRatio(); 
  gameLoop();
  setPlayerImage(assetPaths.idle.down);


  // --- LOGIKA SPLASH SCREEN ---
  const splash = document.getElementById("splashScreen");
  const splashImg = document.getElementById("splashImg");
  const startText = document.getElementById("startText");
  let isGameStarted = false; 
  
  function startGame(e) {
    if (isGameStarted) return;

    // CEGATAN BARU: Jika yang diklik adalah tombol Fullscreen atau gambar di dalamnya, BATALKAN!
    if (e && (e.target.id === "btnFullscreen" || e.target.closest("#btnFullscreen"))) {
      return; 
    }

    isGameStarted = true;

    // --- Memicu Mode Layar Penuh (Fullscreen) ---
    const elem = document.documentElement; // Mengambil seluruh halaman HTML
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => console.log(err)); // Standar modern
    } else if (elem.webkitRequestFullscreen) { 
      elem.webkitRequestFullscreen(); // Standar untuk Safari / iOS
    }

    // 1. Bunyikan SFX Select
    startSfx.currentTime = 0;
    startSfx.play().catch(()=>{});

    // 2. Ubah layar menjadi hitam & pudarkan isi Splash Screen
    splash.style.backgroundColor = "#000"; 
    splashImg.style.opacity = "0";         
    
    startText.style.animation = "none"; 
    startText.style.opacity = "0";         

    // 3. Tahan di layar hitam selama 2 Detik (2000ms), lalu masuk ke game
    setTimeout(() => {
      startBGM(); 
      splash.classList.add("hidden");
      
      setTimeout(() => {
        splash.style.display = "none";
      }, 800);
      
    }, 2000); 
  }

  // Hilang saat diklik/tap
  window.addEventListener("click", startGame);
  window.addEventListener("touchend", startGame);

  // Hilang saat ditekan tombol Spasi
  window.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Spacebar") {
      startGame();
    }
  });


  // --- LOGIKA TOMBOL FULLSCREEN KELUAR/MASUK ---
  const btnFullscreen = document.getElementById("btnFullscreen");
  
  btnFullscreen.addEventListener("click", () => {
    // Cek apakah layar sedang TIDAK fullscreen
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      // Masuk Fullscreen
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => console.log(err));
      } else if (elem.webkitRequestFullscreen) { 
        elem.webkitRequestFullscreen();
      }
    } else {
      // Keluar Fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  });
  

};