const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  runPipeline: async () => {
    const res = await fetch("http://127.0.0.1:5005/run");
    return res.json();
  }
});




