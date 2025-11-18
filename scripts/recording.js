const recImg = document.getElementById("main-img");

// 图片路径
const normalRecImg = "assets/main.GIF";
const recordingImg = "assets/listen.GIF";

let isRecording = false;

document.addEventListener("keydown", async (e) => {
  if (e.code === "Backquote" && !isRecording) {
    isRecording = true;

    // 切换图片为录音状态
    recImg.src = recordingImg;

    await fetch("http://127.0.0.1:5005/start_record", {
      method: "POST"
    });
  }
});

document.addEventListener("keyup", async (e) => {
  if (e.code === "Backquote" && isRecording) {
    isRecording = false;

    const res = await fetch("http://127.0.0.1:5005/stop_record", {
      method: "POST"
    });
    const data = await res.json();

    // 播放返回音频
    const audioRes = await fetch(data.audio_url);
    const audioBlob = await audioRes.blob();
    const audioURL = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioURL);
    audio.play();

    // 恢复原图
    recImg.src = normalRecImg;
  }
});
