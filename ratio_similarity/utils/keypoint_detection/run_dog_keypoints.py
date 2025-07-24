# run_dog_keypoints.py
import os, json, argparse
import cv2
import dlib

# —— 路径配置 —— 
INPUT_DIR  = "/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/dogImg"
OUTPUT_DIR = "/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/dog_keypoints"
MODEL_PATH = "/Users/huangzheheng/Desktop/AdvX/ratio_similarity/models/shape_predictor_68_face_landmarks.dat"

# —— dlib 初始化 —— 
detector  = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(MODEL_PATH)

# —— 68 点语义（只列出面部常用的） —— 
LANDMARK_MAP_68 = {
    30: "nose_tip",
    8:  "chin",
    36: "left_eye_outer", 39: "left_eye_inner",
    42: "right_eye_inner", 45: "right_eye_outer",
    31: "nose_left",       35: "nose_right",
    48: "mouth_left",      54: "mouth_right",
    51: "upper_lip",       57: "lower_lip",
    17: "left_eyebrow_start", 21: "left_eyebrow_end",
    22: "right_eyebrow_start", 26: "right_eyebrow_end"
    # （其余 pt 用 point_{id} 默认命名）
}

# —— 只保留面部相关 id —— 
FACE_IDS = set(LANDMARK_MAP_68.keys())

def detect_dog_kps(img_path):
    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    rects = detector(gray, 1)
    if not rects:
        return []
    # 只取第一张脸
    shape = predictor(gray, rects[0])
    pts = []
    for i in range(68):
        x, y = shape.part(i).x, shape.part(i).y
        if i not in FACE_IDS:
            continue
        pts.append({
            "id":    i,
            "name":  LANDMARK_MAP_68.get(i, f"point_{i}"),
            "x":     float(x),
            "y":     float(y)
        })
    return pts

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input_dir",  default=INPUT_DIR,  help="狗狗图片目录或单张图片")
    p.add_argument("--output_dir", default=OUTPUT_DIR, help="输出 JSON 目录")
    args = p.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    if os.path.isdir(args.input_dir):
        imgs = [os.path.join(args.input_dir, f)
                for f in os.listdir(args.input_dir)
                if f.lower().endswith((".jpg", ".png"))]
    else:
        imgs = [args.input_dir]

    for img_path in imgs:
        kps = detect_dog_kps(img_path)
        fn = os.path.splitext(os.path.basename(img_path))[0] + ".json"
        outp = os.path.join(args.output_dir, fn)
        with open(outp, "w") as f:
            json.dump({"image": img_path, "keypoints": kps}, f, indent=2)
        print(f"[DOG] {img_path} → {len(kps)} face landmarks saved to {outp}")

if __name__ == "__main__":
    main()
