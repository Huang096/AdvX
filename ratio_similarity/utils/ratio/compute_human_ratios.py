# compute_ratios.py
import os, json, math, argparse

# —— 目录配置 —— 
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR   = "/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/humanKeypoint"
OUTPUT_DIR  = "/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/humanRatios"

def dist(p1, p2):
    return math.hypot(p1["x"] - p2["x"], p1["y"] - p2["y"])

def extract_points(kps):
    return {p["name"]: p for p in kps}

def compute_ratios(pts):
    # 必须要的关键点
    required = [
        "left_eye_outer", "right_eye_outer",
        "left_eye_top",   "left_eye_bottom",
        "right_eye_top",  "right_eye_bottom",
        "nose_tip",
        "upper_lip", "lower_lip",
        "mouth_left", "mouth_right",
        "cheek_left", "cheek_right",
        "forehead_center", "chin_center"
    ]
    missing = [r for r in required if r not in pts]
    if missing:
        raise ValueError(f"Missing keypoints: {missing}")

    # —— 计算各段长度 —— 
    eye_width        = dist(pts["left_eye_outer"], pts["right_eye_outer"])
    eye_height_left  = dist(pts["left_eye_top"],   pts["left_eye_bottom"])
    eye_height_right = dist(pts["right_eye_top"],  pts["right_eye_bottom"])
    eye_height       = (eye_height_left + eye_height_right) / 2

    eye_to_nose      = (dist(pts["left_eye_outer"], pts["nose_tip"])
                       + dist(pts["right_eye_outer"], pts["nose_tip"])) / 2

    mouth_width      = dist(pts["mouth_left"], pts["mouth_right"])
    mouth_height     = dist(pts["upper_lip"], pts["lower_lip"])

    face_width       = dist(pts["cheek_left"], pts["cheek_right"])
    face_height      = dist(pts["forehead_center"], pts["chin_center"])

    # —— 归一化比例 —— 
    ratios = {
        # 水平比例
        "eye_width_ratio":       eye_width      / face_width   if face_width   > 0 else None,
        "mouth_width_ratio":     mouth_width    / face_width   if face_width   > 0 else None,
        # 垂直比例
        "mouth_height_ratio":    mouth_height   / face_height  if face_height  > 0 else None,
        "eye_height_ratio":      eye_height     / eye_width    if eye_width     > 0 else None,
        # 纵横比
        "face_aspect_ratio":     face_height    / face_width   if face_width   > 0 else None,
        # 纵向结构
        "eye_to_mouth_ratio":    eye_to_nose    / mouth_height if mouth_height > 0 else None,
        # 嘴部纵横比
        "lip_aspect_ratio":      mouth_height   / mouth_width  if mouth_width   > 0 else None,
    }
    return ratios

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input_dir",  default=INPUT_DIR,  help="keypoints JSON 目录")
    p.add_argument("--output_dir", default=OUTPUT_DIR, help="比例 JSON 输出目录")
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
