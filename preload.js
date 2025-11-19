const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  runPipeline: async () => {
    const res = await fetch("http://127.0.0.1:5005/run");
    return res.json();
  }
});

contextBridge.exposeInMainWorld("electronAPI",{
  onWindowMoving:(callback) => ipcRenderer.on("window-moving",callback),
  sendClick:() => ipcRenderer.send("window-click"),
  onSwitch:(cb) => ipcRenderer.on("image-switch",cb),
  startDrag: (data) => ipcRenderer.send("start-drag", data),
  startDragAbs: (data) => ipcRenderer.send("start-drag-abs", data),

  getWindowPos: (callback) => {
    ipcRenderer.once("reply-window-pos", (_, pos) => callback(pos.x, pos.y));
    ipcRenderer.send("get-window-pos");
  }
});




