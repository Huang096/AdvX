import os
import json
import math
import argparse

# 权重放大重点区域（口部、眉眼、鼻距）
WEIGHTS = {
    "brow_width_ratio":    3.0,
    "eye_width_ratio":     2.5,
    "mouth_width_ratio":   4.0,
    "mouth_height_ratio":  5.0,
    "nose_to_mouth_ratio": 4.5,
    "lip_aspect_ratio":    4.0
}


def load_ratios(path):
    with open(path) as f:
        data = json.load(f)
    return data["ratios"]

# —— 替换旧的 euclid_dist 函数，加入权重 ——
def weighted_dist(r1, r2, weights):
    score = 0.0
    count = 0
    for k, w in weights.items():
        if k in r1 and k in r2 and r1[k] is not None and r2[k] is not None:
            diff = r1[k] - r2[k]
            score += w * (diff ** 2)
            count += 1
    if count == 0:
        return float("inf")
    return math.sqrt(score)

def main():
    p = argparse.ArgumentParser(
        description="Compare one human ratio against multiple dog ratios and find the closest match"
    )
    p.add_argument(
        "--dog_dir",
        default="/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/dogRatios",
        help="狗狗 ratio JSON 绝对路径目录"
    )
    args = p.parse_args()

    human_path = "/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/humanRatios/humanImg1_ratios.json"

    if not os.path.exists(human_path):
        raise RuntimeError(f"Human ratio file not found: {human_path}")
    
    human_ratios = load_ratios(human_path)
    print(f"Loaded human ratios from {os.path.basename(human_path)}, keys: {list(human_ratios.keys())}")

    dog_files = [f for f in os.listdir(args.dog_dir) if f.endswith(".json")]
    if not dog_files:
        raise RuntimeError(f"No dog .json in {args.dog_dir}")

    results = []
    for fn in dog_files:
        dog_path = os.path.join(args.dog_dir, fn)
        dog_ratios = load_ratios(dog_path)
        d = weighted_dist(human_ratios, dog_ratios, WEIGHTS)  # 使用加权距离
        results.append((fn, d))

    results.sort(key=lambda x: x[1])

    print("\nTop matches (closest first):")
    for fn, dist in results:
        print(f"  {fn:20s}  distance = {dist:.4f}")

    best_fn, best_d = results[0]
    print(f"\n✅ Best match: {best_fn}  (distance = {best_d:.4f})")

if __name__ == "__main__":
    main()
