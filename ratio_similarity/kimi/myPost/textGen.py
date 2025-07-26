import os
import base64
from openai import OpenAI

# —— 1. 从环境变量读取 Key —— #
_key = os.getenv("MOONSHOT_API_KEY") or os.getenv("OPENAI_API_KEY")
if not _key:
    raise RuntimeError("请先设置环境变量 MOONSHOT_API_KEY 或 OPENAI_API_KEY")

client = OpenAI(
    api_key=_key,
    base_url="https://api.moonshot.cn/v1",
)

def describe_image_with_kimi(image_path: str) -> str:
    """
    用 moonshot-v1-8k-vision-preview 对单张图片生成中文描述。
    """
    # 读取并编码为 Base64 URL
    with open(image_path, "rb") as img_file:
        img_data = img_file.read()
    ext = os.path.splitext(image_path)[1].lstrip(".").lower()
    img_base64 = base64.b64encode(img_data).decode("utf-8")
    data_url = f"data:image/{ext};base64,{img_base64}"

    # 发起请求
    completion = client.chat.completions.create(
        model="moonshot-v1-8k-vision-preview",  # 支持图像输入
        messages=[
            {"role": "system", "content": "你是 Kimi，由 Moonshot AI 提供的智能助手，擅长生动、有趣地描述图片内容。"},
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": data_url}
                    },
                    {
                        "type": "text",
                        "text": "请用中文描述这张图片中的流浪狗，给他虚构名字，名字里面不要带颜色，可以参考中国风一点土狗的名字，然后还要 地点 外观 性格 病史 简短经历描述, 都要是现实中存在的，不要太抽象"
                    }
                ]
            }
        ],
        temperature=0.7,
    )

    return completion.choices[0].message.content
