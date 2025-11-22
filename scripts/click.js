(() => {
    const img = document.getElementById("main-img");

    const normalImg = "assets/main.GIF";
    const clickImg = "assets/click.GIF";

    let mouseDown = false;
    let startTime = 0;

    img.addEventListener("mousedown", () => {
        mouseDown = true;
        startTime = Date.now();
    });

    document.addEventListener("mouseup", () => {
        if (!mouseDown) return;
        mouseDown = false;

        const dt = Date.now() - startTime;

        if (dt < 180) {
            window.electronAPI.sendClick();
        }
    });

    window.electronAPI.onSwitch(() => {
        img.src = clickImg;
        setTimeout(() => img.src = normalImg, 3000);
    });

})();
