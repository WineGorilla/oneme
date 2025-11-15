import os
from TTS.api import TTS

def synthesize_speech(tts, text, speaker_wav="test.wav", out_path="outputs/output.wav"):
    """使用加载好的 TTS 模型生成语音"""
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    tts.tts_to_file(text=text, speaker_wav=speaker_wav, language="zh", file_path=out_path)
    return out_path


