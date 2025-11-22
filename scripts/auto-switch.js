const autoImg = document.getElementById("main-img");

const defaultImg = "assets/main.GIF";

const randomImages = [
    "assets/main1.GIF", //默认
    "assets/main2.GIF",
    "assets/main3.GIF",
    "assets/main4.GIF",
];

const triggerInterval = 20000;   // 10 秒触发一次
const displayTime = 20000;        // 随机图显示 5 秒

function showRandomImageOnce(){
    const rand = Math.floor(Math.random() * randomImages.length);
    autoImg.src = randomImages[rand];
    setTimeout(()=>{
        autoImg.src = defaultImg;
    },displayTime);
}

setInterval(showRandomImageOnce, triggerInterval);


