from utils.starter import start_ollama, load_tts_model,wait_for_ollama,load_lang_model,load_speech_model
from routes.voice_clone import synthesize_speech
from routes.text_generation import query_ollama
from routes.speech_recognition import *

from flask import Flask, jsonify, send_from_directory,make_response
import time
import os

app = Flask(__name__)
AUDIO_FOLDER = os.path.join(os.path.dirname(__file__), "outputs")
TEST_FILE = os.path.join(os.path.dirname(__file__), "test.wav")
start_ollama()
wait_for_ollama()
tts = load_tts_model()
speech_model = load_speech_model()
cc = load_lang_model()
recorder = SpeechRecorder(model=speech_model, cc=cc, device="cpu")
print("All Models Down")


@app.route("/audio")
def get_audio():
    return send_from_directory(AUDIO_FOLDER, "output.wav")

@app.route("/audio",methods=['DELETE'])
def delete_audio():
    file_path = os.path.join(AUDIO_FOLDER,"output.wav")
    if os.path.exists(file_path):
        os.remove(file_path)
        return jsonify({"status":"deleted"})
    else:
        return jsonify({"status":"not_exists"},404)

@app.route("/start_record",methods=["POST"])
def start_record():
    print("开始录音")
    recorder.start()
    return jsonify({"status":"recording"})

@app.route("/stop_record",methods=['POST'])
def stop_record():
    print("停止录音开始处理")
    text = recorder.stop()
    reply = query_ollama(text)
    output_path = os.path.join(AUDIO_FOLDER, "output.wav")
    synthesize_speech(tts, reply, TEST_FILE, output_path)
    return jsonify({
        "input": text,
        "reply": reply,
        "audio_url":"http://127.0.0.1:5005/audio"
    })



if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5005,
        debug=True,
        use_reloader=False   # 防止重复加载模型
    )