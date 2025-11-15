import os
import subprocess
import time
from TTS.api import TTS
import time,socket
from opencc import OpenCC
from faster_whisper import WhisperModel

# 环境变量配置
UTILS_DIR = os.path.dirname(os.path.abspath(__file__))          # backend/utils
BASE_DIR = os.path.dirname(UTILS_DIR)                           # backend
MODEL_DIR = os.path.join(BASE_DIR, "models")                    # backend/models
OLLAMA_DIR = os.path.join(BASE_DIR, "ollama")                   # backend/ollama
OLLAMA_PATH = os.path.join(OLLAMA_DIR, "ollama")                # backend/ollama/ollama 可执行文件

# === 环境变量配置 ===
os.environ["OLLAMA_MODELS"] = MODEL_DIR
os.environ["OLLAMA_DEFAULT_MODEL"] = "qwen2:1.5b"

OLLAMA_PORT = 11434

def start_ollama():
    """启动 Ollama 后端（如果尚未运行）"""
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.connect(("127.0.0.1", OLLAMA_PORT))
        print(f"Ollama 已在端口 {OLLAMA_PORT} 运行。")
        s.close()
        return
    except socket.error:
        pass

    print("启动 Ollama 后端服务...")
    process = subprocess.Popen(
        [OLLAMA_PATH, "serve"],
        env=os.environ.copy(),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True
    )

    # 等待 Ollama 启动成功
    for _ in range(30):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect(("127.0.0.1", OLLAMA_PORT))
            s.close()
            print("Ollama 启动成功！监听在 http://127.0.0.1:11434")
            break
        except socket.error:
            time.sleep(1)
    else:
        print("Ollama 启动超时，请检查路径或端口占用。")

    return process


def wait_for_ollama(port=11434, timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        s = socket.socket()
        try:
            s.connect(("127.0.0.1", port))
            s.close()
            print("Ollama 端口已就绪。")
            return True
        except socket.error:
            time.sleep(1)
    raise TimeoutError("Ollama 服务启动超时。")

def load_tts_model():
    print("正在加载语音合成模型")
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
    print("TTS 模型加载完成，可生成语音。")
    return tts

def load_speech_model():
    model = WhisperModel("small", device="cpu")
    return model

def load_lang_model():
    cc = OpenCC("t2s")
    return cc



