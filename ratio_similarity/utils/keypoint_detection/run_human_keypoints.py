# run_human_keypoints.py
import cv2, os, json, argparse
import mediapipe as mp

# —— 配置路径 ——
INPUT_DIR = "/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/humanImg/humanImg1.jpg"
OUTPUT_DIR = "/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/humanKeypoint"

# —— 语义映射表（带 name） ——
LANDMARK_MAP = {
    1: "nose_tip",
    33: "left_eye_outer",
    133: "left_eye_inner",
    159: "left_eye_top",
    145: "left_eye_bottom",
    263: "right_eye_outer",
    362: "right_eye_inner",
    386: "right_eye_top",
    374: "right_eye_bottom",
    13: "upper_lip",
    14: "lower_lip",
    61: "mouth_left",
    291: "mouth_right",
    17: "chin_center",
    10: "forehead_center",
    234: "cheek_left",
    454: "cheek_right",
    70: "left_eyebrow_top",
    105: "left_eyebrow_bottom",
    300: "right_eyebrow_top",
    334: "right_eyebrow_bottom",
    152: "jaw_bottom",
    0: "face_center"
}

# —— 初始化 MediaPipe ——
mp_face = mp.solutions.face_mesh.FaceMesh(static_image_mode=True)

def detect_kps(image_path):
    img = cv2.imread(image_path)
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    res = mp_face.process(rgb)
    if not res.multi_face_landmarks:
        return []

    h, w, _ = img.shape
    lm = res.multi_face_landmarks[0]

    keypoints = []
    for idx, p in enumerate(lm.landmark):
        keypoints.append({
            "id": idx,
            "name": LANDMARK_MAP.get(idx, f"point_{idx}"),
            "x": p.x * w,
            "y": p.y * h,
            "z": p.z * w
        })
    return keypoints

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input_dir",  default=INPUT_DIR, help="图片或目录")
    p.add_argument("--output_dir", default=OUTPUT_DIR, help="输出 JSON 目录")
    args = p.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)

    # 支持单张图或目录
    if os.path.isdir(args.input_dir):
        imgs = [os.path.join(args.input_dir, f)
                for f in os.listdir(args.input_dir)
                if f.lower().endswith((".jpg", ".png"))]
    else:
        imgs = [args.input_dir]

    for img_path in imgs:
        kps = detect_kps(img_path)
        name = os.path.splitext(os.path.basename(img_path))[0] + ".json"
        out_path = os.path.join(args.output_dir, name)
        with open(out_path, "w") as f:
            json.dump({"image": img_path, "keypoints": kps}, f, indent=2)
        print(f"[HUMAN] {img_path} → {len(kps)} points saved to {out_path}")

if __name__ == "__main__":
    main()
