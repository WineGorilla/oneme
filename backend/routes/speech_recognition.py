import sounddevice as sd
import soundfile as sf
import numpy as np
import tempfile
import os
from faster_whisper import WhisperModel
from opencc import OpenCC


class SpeechRecorder:
    """语音录制与识别类（支持开始、结束录音）"""

    def __init__(self, model,cc, device="cpu", samplerate=16000):
        # 初始化语音识别模型与参数
        self.model = model
        self.cc = cc

        # 录音相关
        self._recording = []
        self._stream = None
        self._is_recording = False
        self.samplerate = samplerate

    def _convert_to_simplified(self, text):
        """繁体转简体"""
        return self.cc.convert(text)

    def _transcribe_audio(self, audio):
        """识别音频内容"""
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            sf.write(tmp.name, audio, self.samplerate)
            temp_path = tmp.name
        segments, _ = self.model.transcribe(temp_path, beam_size=5, language="zh")
        text = "".join([seg.text for seg in segments])
        os.remove(temp_path)
        return self._convert_to_simplified(text.strip())

    def start(self):
        """开始录音"""
        if self._is_recording:
            print("录音已在进行中...")
            return

        print("开始录音...")
        self._is_recording = True
        self._recording = []

        def callback(indata, frames, time, status):
            self._recording.append(indata.copy())

        self._stream = sd.InputStream(
            samplerate=self.samplerate,
            channels=1,
            dtype="float32",
            callback=callback
        )
        self._stream.start()

    def stop(self):
        """停止录音并识别"""
        if not self._is_recording:
            print("当前没有在录音。")
            return None

        print("停止录音，正在识别...")
        self._is_recording = False

        try:
            self._stream.stop()
            self._stream.close()
        except Exception:
            pass

        audio = np.concatenate(self._recording, axis=0).squeeze()
        text = self._transcribe_audio(audio)
        print("识别结果：", text)
        return text
