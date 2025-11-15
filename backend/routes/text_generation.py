import requests
import json

def query_ollama(prompt: str, model: str = "qwen2:1.5b", host: str = "http://127.0.0.1:11434"):
    """
    向已启动的 Ollama 模型发送请求并返回生成结果。
    """
    prompt = f"请在30字以内回答：{prompt}"
    url = f"{host}/api/generate"
    headers = {"Content-Type": "application/json"}
    data = {
        "model": model,
        "prompt": prompt
    }

    print(f"向 Ollama 发送请求：{prompt}")
    response = requests.post(url, headers=headers, data=json.dumps(data), stream=True)

    # === Ollama 返回的是流式 JSON，一行一个 ===
    output = ""
    for line in response.iter_lines():
        if line:
            chunk = json.loads(line)
            if "response" in chunk:
                output += chunk["response"]
            if chunk.get("done"):
                break

    print("Ollama 响应完成。")
    return output.strip()
