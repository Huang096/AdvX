# 这里的用途是借用kimi的模型能力进行更加人性化的图片比对，目前的如果单单是用模型来比较五官比例
# 等方面的话，稍稍有点不那么人性化而且可能需要更多的模型来形成更完整的感知，所以我们先根据五官
# 比例来筛选，然后再调用模型接口来进行“人性化”的感官上的比对，最后筛选出最贴合的option

import os
import base64
import glob
from typing import List
from openai import OpenAI

# ====== 配置区域 ======
USER_IMAGE_PATH = "/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/humanImg/humanImg1.jpg"
DOG_IMG_DIR = "/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/dogImg"
GROUP_SIZE = 3  # 每轮比对的图片数

client = OpenAI(
    api_key=os.environ.get("MOONSHOT_API_KEY"),
    base_url="https://api.moonshot.cn/v1",
)

# ====== 工具函数 ======

def encode_image_base64(path: str) -> str:
    with open(path, "rb") as f:
        image_data = f.read()
    ext = os.path.splitext(path)[1].replace(".", "")
    return f"data:image/{ext};base64,{base64.b64encode(image_data).decode()}"

def compare_images_with_user(user_image: str, candidate_images: List[str]) -> str:
    """
    与用户图像比对多张候选图，返回最像的一张图路径
    """
    contents = [
        {
            "type": "image_url",
            "image_url": { "url": encode_image_base64(user_image) }
        },
        { "type": "text", "text": "请从下列狗狗图片中挑选出一张与我上传的图片（上面）最相似的，并说明原因。" }
    ]

    for i, path in enumerate(candidate_images):
        contents.append({
            "type": "image_url",
            "image_url": { "url": encode_image_base64(path) }
        })
        contents.append({ "type": "text", "text": f"图片 {i+1}" })

    completion = client.chat.completions.create(
        model="moonshot-v1-8k-vision-preview",
        messages=[
            { "role": "system", "content": "你是一个图像识别专家，擅长判断图像相似度。" },
            { "role": "user", "content": contents }
        ]
    )

    response = completion.choices[0].message.content
    print("\n== 模型回复 ==\n", response)

    # 简单规则：返回提到最多的 "图片 X"
    for i, path in enumerate(candidate_images):
        if f"图片 {i+1}" in response:
            return path

    return candidate_images[0]  # fallback

def tournament_compare(user_image_path: str, dog_img_dir: str, group_size: int = 3) -> str:
    candidates = glob.glob(os.path.join(dog_img_dir, "*.jpg")) + \
                 glob.glob(os.path.join(dog_img_dir, "*.png"))

    if not candidates:
        raise RuntimeError("未找到任何候选图片")

    round_num = 1
    while len(candidates) > 1:
        print(f"\n=== 第 {round_num} 轮比对，共 {len(candidates)} 张图片 ===")
        next_round = []
        for i in range(0, len(candidates), group_size):
            group = candidates[i:i+group_size]
            winner = compare_images_with_user(user_image_path, group)
            print(f"本组最像的是：{os.path.basename(winner)}")
            next_round.append(winner)
        candidates = next_round
        round_num += 1

    print(f"\n🎉 最终最像的图片是：{candidates[0]}")
    return candidates[0]

# ====== 主程序入口 ======

if __name__ == "__main__":
    tournament_compare(USER_IMAGE_PATH, DOG_IMG_DIR, GROUP_SIZE)
