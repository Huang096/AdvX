# compute_dog_ratios.py
import os
import json
import math
import argparse

# —— 目录配置 —— 
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR  = "/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/dog_keypoints"
OUTPUT_DIR = "/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/dogRatios"

def dist(p1, p2):
    return math.hypot(p1["x"] - p2["x"], p1["y"] - p2["y"])

def extract_points(kps):
    return {p["name"]: p for p in kps}

def compute_ratios(pts):
    # 需要的关键点
    required = [
        "left_eyebrow_start", "left_eyebrow_end",
        "right_eyebrow_start", "right_eyebrow_end",
        "left_eye_outer",      "right_eye_outer",
        "nose_left",           "nose_right", "nose_tip",
        "mouth_left",          "mouth_right",
        "upper_lip",           "lower_lip"
    ]
    missing = [r for r in required if r not in pts]
    if missing:
        raise ValueError(f"Missing keypoints: {missing}")

    # —— 计算中间点 —— 
    # 眉毛中心
    lb = pts["left_eyebrow_start"]; le = pts["left_eyebrow_end"]
    rb = pts["right_eyebrow_start"]; re = pts["right_eyebrow_end"]
    left_brow_center  = {"x": (lb["x"] + le["x"]) / 2, "y": (lb["y"] + le["y"]) / 2}
    right_brow_center = {"x": (rb["x"] + re["x"]) / 2, "y": (rb["y"] + re["y"]) / 2}

    # —— 计算长度 —— 
    brow_width    = dist(left_brow_center, right_brow_center)
    eye_width     = dist(pts["left_eye_outer"], pts["right_eye_outer"])
    nose_width    = dist(pts["nose_left"], pts["nose_right"])
    mouth_width   = dist(pts["mouth_left"], pts["mouth_right"])
    mouth_height  = dist(pts["upper_lip"], pts["lower_lip"])
    nose_to_mouth = dist(pts["nose_tip"], pts["upper_lip"])

    # —— 归一化比例 —— 
    return {
        "brow_width_ratio":    brow_width    / nose_width    if nose_width    > 0 else None,
        "eye_width_ratio":     eye_width     / nose_width    if nose_width    > 0 else None,
        "mouth_width_ratio":   mouth_width   / nose_width    if nose_width    > 0 else None,
        "mouth_height_ratio":  mouth_height  / nose_width    if nose_width    > 0 else None,
        "nose_to_mouth_ratio": nose_to_mouth / nose_width    if nose_width    > 0 else None,
        "lip_aspect_ratio":    mouth_height  / mouth_width   if mouth_width   > 0 else None,
    }

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input_dir",  default=INPUT_DIR,  help="狗脸 keypoints JSON 目录")
    p.add_argument("--output_dir", default=OUTPUT_DIR, help="输出比例 JSON 目录")
    args = p.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)

    for fn in os.listdir(args.input_dir):
        if not fn.endswith(".json"):
            continue
        data = json.load(open(os.path.join(args.input_dir, fn)))
        pts  = extract_points(data["keypoints"])
        try:
            ratios = compute_ratios(pts)
        except ValueError as e:
            print(f"[SKIP] {fn}: {e}")
            continue

        out_name = os.path.splitext(fn)[0] + "_ratios.json"
        with open(os.path.join(args.output_dir, out_name), "w") as f:
            json.dump({
                "image":  data["image"],
                "ratios": ratios
            }, f, indent=2)
        print(f"[OK]   {fn} → {out_name}")

if __name__ == "__main__":
    main()
