import os, json, argparse
import cv2
import dlib

# —— 路径配置 —— 
INPUT_DIR  = "/Users/huangzheheng/Desktop/NY"
OUTPUT_DIR = "/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/dog_keypoints"
MODEL_PATH = "/Users/huangzheheng/Desktop/AdvX/ratio_similarity/models/shape_predictor_68_face_landmarks.dat"

# —— dlib 初始化 —— 
detector  = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(MODEL_PATH)

# —— 68 点语义 —— 
LANDMARK_MAP_68 = {
    30: "nose_tip",  8:  "chin",
    36: "left_eye_outer", 39: "left_eye_inner",
    42: "right_eye_inner",45: "right_eye_outer",
    31: "nose_left", 35: "nose_right",
    48: "mouth_left",54: "mouth_right",
    51: "upper_lip",57: "lower_lip",
    17: "left_eyebrow_start", 21: "left_eyebrow_end",
    22: "right_eyebrow_start",26: "right_eyebrow_end"
}
FACE_IDS = set(LANDMARK_MAP_68.keys())

def detect_dog_kps(img_path):
    img = cv2.imread(img_path)
    if img is None:
        raise IOError(f"无法读取图片: {img_path}")
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    rects = detector(gray, 1)
    if not rects:
        return []
    shape = predictor(gray, rects[0])
    pts = []
    for i in range(68):
        if i not in FACE_IDS:
            continue
        part = shape.part(i)
        pts.append({
            "id":   i,
            "name": LANDMARK_MAP_68.get(i, f"point_{i}"),
            "x":    float(part.x),
            "y":    float(part.y)
        })
    return pts

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input_dir",  default=INPUT_DIR,  help="狗狗图片目录或单张图片")
    p.add_argument("--output_dir", default=OUTPUT_DIR, help="输出 JSON 目录")
    args = p.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    # 收集所有图片路径
    if os.path.isdir(args.input_dir):
        imgs = [
            os.path.join(args.input_dir, f)
            for f in os.listdir(args.input_dir)
            if f.lower().endswith((".jpg", ".png"))
        ]
    else:
        imgs = [args.input_dir]

    for img_path in imgs:
        try:
            kps = detect_dog_kps(img_path)
        except Exception as e:
            print(f"[DOG][ERROR] {img_path} → 处理出错: {e}")
            continue

        if not kps:
            print(f"[DOG][FAILED] {img_path} → 未检测到关键点，已跳过")
            continue

        fn   = os.path.splitext(os.path.basename(img_path))[0] + ".json"
        outp = os.path.join(args.output_dir, fn)
        with open(outp, "w") as f:
            json.dump({"image": img_path, "keypoints": kps}, f, indent=2)
        print(f"[DOG][OK] {img_path} → 检测到 {len(kps)} 个关键点，已保存至 {outp}")

if __name__ == "__main__":
    main()
