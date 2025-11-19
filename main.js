const {app,BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const {spawn} = require('child_process')

let win = null;
let pythonProcess = null;

function createWindow(){
  win = new BrowserWindow({
    width:500,
    height:500,
    transparent: true,
    frame:false,
    movable: true,         // 允许移动
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences:{
      preload:path.join(__dirname,'preload.js'),
      contextIsolation:true,
    }
  })
  win.loadFile("loading.html");

  win.on("move",()=>{
    win.webContents.send("window-moving");
  })

  win.on("closed",()=>{
    if (pythonProcess){
      pythonProcess.kill("SIGKILL"); //杀死整个进程
      pythonProcess = null;
      console.log("Exit the Backend");
    }
  })
}

ipcMain.on("window-click",()=>{
  win.webContents.send("image-switch");
})

ipcMain.on("start-drag", (event, { dx, dy }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;

  const [x, y] = win.getPosition();
  win.setPosition(x + dx, y + dy);
});

ipcMain.on("start-drag-abs", (event, { x, y }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.setPosition(x, y);
});

ipcMain.on("get-window-pos", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const [x, y] = win.getPosition();
  event.sender.send("reply-window-pos", { x, y });
});



function startPythonBackend(){
   const pythonPath = path.join(__dirname,'oneme/bin/python');
   const backendPath = path.join(__dirname,"backend/app.py")
   console.log("启动后端");

  pythonProcess = spawn(pythonPath, [backendPath], {
    env: { ...process.env }
  });

  pythonProcess.stdout.on('data',(data)=>{  //stdout捕捉打印的日志
    const msg = data.toString();
    console.log('Python',msg);

    if (msg.includes("All Models Down")){
      win.loadFile('index.html');
    }
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python 进程退出，代码: ${code}`);
  });
}

// 启动
app.whenReady().then(()=>{
  createWindow();
  startPythonBackend();
})



