(() => {

    const img = document.getElementById("main-img");
    img.addEventListener("dragstart", (e) => e.preventDefault());

    const normalImg = "assets/main.GIF";
    const longPressImg = "assets/longclick.GIF";  // 长按成立但没动的图
    const draggingImg = "assets/drag.GIF";        // 长按成立后移动的图

    const LONG_PRESS_TIME = 100;    // 长按判定时间
    const MOVE_THRESHOLD = 3;       // 移动判定阈值

    let isPressing = false;   
    let isLongPressed = false;    
    let isDragging = false;   
    let pressTimer = null;

    let startX = 0;
    let startY = 0;

    let offsetX = 0;
    let offsetY = 0;


    // 获取窗口坐标
    function getWindowPos(cb) {
        window.electronAPI.getWindowPos((x, y) => cb(x, y));
    }


    // 鼠标按下
    img.addEventListener("mousedown", (e) => {

        isPressing = true;
        isLongPressed = false;
        isDragging = false;

        startX = e.screenX;
        startY = e.screenY;

        pressTimer = setTimeout(() => {
            if (!isPressing) return;

            isLongPressed = true;
            img.src = longPressImg;   

        }, LONG_PRESS_TIME);
    });


    // 鼠标移动
    document.addEventListener("mousemove", (e) => {
        if (!isPressing) return;

        const dx = Math.abs(e.screenX - startX);
        const dy = Math.abs(e.screenY - startY);
        const distance = dx + dy;

        if (!isLongPressed) return;

        // 检测是否移动
        if (distance > MOVE_THRESHOLD && !isDragging) {

            isDragging = true;

            getWindowPos((winX, winY) => {
                offsetX = e.screenX - winX;
                offsetY = e.screenY - winY;
            });

            img.src = draggingImg;
        }

        // === 拖动窗口 ===
        if (isDragging) {
            const x = e.screenX - offsetX;
            const y = e.screenY - offsetY;
            window.electronAPI.startDragAbs({ x, y });
        }
    });


    // 鼠标松开
    document.addEventListener("mouseup", () => {

        isPressing = false;
        clearTimeout(pressTimer);

        if (isLongPressed || isDragging) {
            img.src = normalImg;
        }

        isLongPressed = false;
        isDragging = false;
    });

})();


