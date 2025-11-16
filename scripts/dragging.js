//Electron默认对资源使用 index.html 的相对路径
const img = document.getElementById("main-img");
const normalImg = "assets/test.png";   // 松开时的图片
const draggingImg = "assets/test2.png";   // 拖动时的图片

let isDragging = false;
let dragTimer = null;

// 每当窗口移动都会触发
window.electronAPI.onWindowMoving(() => {

  // === 开始拖动 ===
  if (!isDragging) {
    isDragging = true;
    img.src = draggingImg;    // 切换为拖动图片
  }

  // === 重置计时器（判断是否松开）===
  clearTimeout(dragTimer);
  dragTimer = setTimeout(() => {
    isDragging = false;
    img.src = normalImg;      // 恢复原图
  }, 150);
});
