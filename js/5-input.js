// 5. INPUT CONTROLS (Tambahan)
// Fungsi: Menangkap seluruh event kontroler dari pemain (Keyboard fisik atau Sentuhan Virtual).
// Fokus ke file ini mutlak saat Anda ingin MEREVISI ATAU MENAMBAH TOMBOL BARU. Segala logika yang membaca masukan user ditampung di sini.

function setupControls() {
  const touchMap = { 'touchUp': 'arrowup', 'touchDown': 'arrowdown', 'touchLeft': 'arrowleft', 'touchRight': 'arrowright' };
  
  Object.keys(touchMap).forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); activeKey = touchMap[id]; startBGM(); });
    const end = (e) => { e.preventDefault(); if (activeKey === touchMap[id]) activeKey = null; stopMove(); };
    el.addEventListener('pointerup', end); el.addEventListener('pointerleave', end);
  });

  const aBtn = document.getElementById('touchA');
  aBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); isAPressed = true; startBGM(); });
  const aEnd = (e) => { e.preventDefault(); isAPressed = false; stopMove(); };
  aBtn.addEventListener('pointerup', aEnd); aBtn.addEventListener('pointerleave', aEnd);

  const l1Btn = document.getElementById('touchL1');
  l1Btn.addEventListener('pointerdown', (e) => { e.preventDefault(); performJump(); });

  ['touchSelect', 'touchStart'].forEach(id => {
    document.getElementById(id).addEventListener('pointerdown', (e) => { e.preventDefault(); startBGM(); });
  });
}

document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (["arrowup","arrowdown","arrowleft","arrowright"].includes(k)) activeKey = k;
  if (k === "x" || k === "shift") isAPressed = true;
  if (k === "r") performJump(); 
  startBGM();
});

document.addEventListener("keyup", (e) => {
  const k = e.key.toLowerCase();
  if (k === activeKey) activeKey = null;
  if (k === "x" || k === "shift") isAPressed = false;
  stopMove();
});