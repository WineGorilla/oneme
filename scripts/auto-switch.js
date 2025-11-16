const autoImg = document.getElementById("main-img");

const defaultImg = "assets/test.png";

const randomImages = [
    "assets/1.png", //默认
    "assets/2.png"
];

const triggerInterval = 10000;   // 10 秒触发一次
const displayTime = 5000;        // 随机图显示 5 秒

function showRandomImageOnce(){
    const rand = Math.floor(Math.random() * randomImages.length);
    autoImg.src = randomImages[rand];
    setTimeout(()=>{
        autoImg.src = defaultImg;
    },displayTime);
}

setInterval(showRandomImageOnce, triggerInterval);


