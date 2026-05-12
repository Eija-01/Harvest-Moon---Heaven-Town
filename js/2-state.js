// 2. STATE
// Fungsi: Berisi variabel yang menyimpan kondisi permainan saat ini yang nilainya dinamis (berubah-ubah seiring waktu).
// Fokus ke file ini untuk memantau data yang sedang berlangsung seperti posisi karakter (X/Y), status tombol ditekan (isAPressed/activeKey), arah hadap karakter, atau resolusi gambar map yang sedang aktif.

let targetResHeight = 480; 
let activeKey = null;
let isAPressed = false; 
let lastDirection = "down";
let worldX = 0; 
let worldY = 0;
let currentNaturalWidth = 1920; 
let currentNaturalHeight = 1080; 
let currentImgUrl = ""; 
let isJumping = false;
let jumpOffset = 0;
let jumpTime = 0;