#!/usr/bin/env python3
import os
import sys
import json
import glob
import random
import argparse
import base64
import cv2

# 打印下当前环境，方便调试
print("当前 Python 可执行文件：", sys.executable)
print("当前 sys.path：", sys.path)

# OpenAI 客户端（Kimi Vision）
from openai import OpenAI
client = OpenAI(
    api_key=os.environ.get("MOONSHOT_API_KEY"),
    base_url="https://api.moonshot.cn/v1",
)

# Kimi 调用的辅助函数
def encode_image_base64(path: str) -> str:
    with open(path, "rb") as f:
        data = f.read()
    ext = os.path.splitext(path)[1].lstrip(".")
    return f"data:image/{ext};base64,{base64.b64encode(data).decode()}"

def compare_images_with_user(user_image: str, candidate_images: list[str]) -> str:
    """
    调用 Moonshot Vision 模型，从 candidate_images 中挑出最相似的一张
    """
    parts = [
        {"type": "image_url", "image_url": {"url": encode_image_base64(user_image)}},
        {"type": "text",      "text": "请从下列狗狗图片中挑选一张与我上传的图片最相似，并简要说明理由。"}
    ]
    for idx, img in enumerate(candidate_images, start=1):
        parts.append({"type": "image_url", "image_url": {"url": encode_image_base64(img)}})
        parts.append({"type": "text",      "text": f"图片 {idx}"})

    resp = client.chat.completions.create(
        model="moonshot-v1-8k-vision-preview",
        messages=[
            {"role": "system", "content": "你是一个图像识别专家，擅长判断图像相似度。"},
            {"role": "user",   "content": parts},
        ]
    )
    text = resp.choices[0].message.content
    print("\n== Kimi 模型回复 ==\n", text)

    # 简单匹配 “图片 X” 来选出最像的那张
    for idx, img in enumerate(candidate_images, start=1):
        if f"图片 {idx}" in text:
            return img
    return candidate_images[0]


# 原有的关键点、ratio 计算函数
from .utils.keypoint_detection.run_human_keypoints import detect_kps
from .utils.ratio.compute_human_ratios     import extract_points, compute_ratios
from .utils.ratio.compare_ratios           import load_ratios, weighted_dist, WEIGHTS

def pipeline(image_path, human_kpt_dir, human_ratio_dir,
dog_ratio_dir, dog_img_dir, top_k=3):
    """
    1. 检测人脸关键点
    2. 计算人脸 ratios
    3. ratio 排序 -> Top-K 输出
    4. 从 Top-3 随机 2 张 + 其余随机 4 张 -> 调用 Kimi Vision 做最终语义比对
    """
    if not os.path.exists(image_path):
        print(f"❌ 输入路径不存在：{image_path}")
        sys.exit(1)
    if os.path.isfile(image_path):
        if cv2.imread(image_path) is None:
            print(f"❌ OpenCV 无法解码此文件（可能格式不支持或已损坏）：{image_path}")
            sys.exit(1)
    # —— 如果传入的是目录，就从里头取第一张图片 —— 
    if os.path.isdir(image_path):
        files = sorted(
            f for f in os.listdir(image_path)
            if f.lower().endswith((".jpg", ".jpeg", ".png"))
        )
        if not files:
            print(f"❌ 目录里没图片：{image_path}")
            sys.exit(1)
        # 选第一张
        first = files[0]
        image_path = os.path.join(image_path, first)
        print(f"▶️ 输入是目录，选用第一张人脸图：{image_path}")
    # —— 目录处理完毕，下面开始原有流程 —— 

    os.makedirs(human_kpt_dir, exist_ok=True)
    os.makedirs(human_ratio_dir, exist_ok=True)

    # 1) 检测关键点
    kps = detect_kps(image_path)
    if not kps:
        print(f"❌ 未检测到人脸关键点：{image_path}")
        sys.exit(1)
    base = os.path.splitext(os.path.basename(image_path))[0]
    kpt_out = os.path.join(human_kpt_dir, base + ".json")
    with open(kpt_out, "w") as f:
        json.dump({"image": image_path, "keypoints": kps}, f, indent=2)
    print(f"[HUMAN] 关键点已保存至 {kpt_out}")

    # 2) 计算 ratios
    pts = extract_points(kps)
    try:
        ratios = compute_ratios(pts)
    except ValueError as e:
        print(f"❌ 计算 ratios 出错：{e}")
        sys.exit(1)
    ratio_out = os.path.join(human_ratio_dir, base + "_ratios.json")
    with open(ratio_out, "w") as f:
        json.dump({"image": image_path, "ratios": ratios}, f, indent=2)
    print(f"[HUMAN] ratios 已保存至 {ratio_out}")

    # 3) ratio 排序
    human_ratios = ratios
    results = []
    for fn in os.listdir(dog_ratio_dir):
        if not fn.endswith(".json"):
            continue
        dog_json = os.path.join(dog_ratio_dir, fn)
        dog_ratios = load_ratios(dog_json)
        dist = weighted_dist(human_ratios, dog_ratios, WEIGHTS)
        results.append((fn, dist))
    results.sort(key=lambda x: x[1])

    # 输出 Top-K ratio 排名
    print(f"\n🐶 Top-{top_k} 狗狗相似度（ratio）排行：")
    for i, (fn, d) in enumerate(results[:top_k], start=1):
        print(f"  {i}. {fn:20s}  距离={d:.4f}")

    # 4) 构造 6 张用于语义比对的子集
    top3 = results[:3]
    pick2 = random.sample(top3, k=min(2, len(top3)))
    rest = results[3:]
    pick4 = random.sample(rest, k=min(4, len(rest)))
    subset = pick2 + pick4

    # 根据 JSON 名称揪出真实图片路径
    def json2img(fn: str):
        name = fn.replace("_ratios.json", "")
        for ext in (".jpg", ".png"):
            p = os.path.join(dog_img_dir, name + ext)
            if os.path.exists(p):
                return p
        raise FileNotFoundError(f"找不到图片文件 for {fn}")

    candidate_imgs = [json2img(fn) for fn, _ in subset]

    # 5) 调用 Kimi 做“人性化”比对
    print("\n🔍 调用 Kimi Vision 进行语义比对...")
    final = compare_images_with_user(image_path, candidate_imgs)
    print(f"\n🎉 最终最贴合的狗狗图片是：{final}")

    return results, final


def main():
    p = argparse.ArgumentParser(
        description="全流程：关键点 -> ratios -> Top-K -> Kimi 语义比对"
    )
    p.add_argument("--input_image",     required=True, help="待比对的人脸图片")
    p.add_argument("--human_kpt_dir",   default="data/humanKeypoint", help="人脸关键点输出")
    p.add_argument("--human_ratio_dir", default="data/humanRatios",  help="人脸 ratios 输出")
    p.add_argument("--dog_ratio_dir",   default="data/dogRatios",    help="狗狗 ratios 目录")
    p.add_argument("--dog_img_dir",     default="data/dogImg",       help="狗狗原始图片目录")
    p.add_argument("--top_k",           type=int, default=3,         help="展示 Top-K 个 ratio 结果")
    args = p.parse_args()

    pipeline(
        args.input_image,
        args.human_kpt_dir,
        args.human_ratio_dir,
        args.dog_ratio_dir,
        args.dog_img_dir,
        args.top_k
    )


if __name__ == "__main__":
    main()
