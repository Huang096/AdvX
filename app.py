import os
import json
import math
from glob import glob
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from tempfile import TemporaryDirectory
from ratio_similarity.utils.ratio.compute_human_ratios import compute_ratios, extract_points
from ratio_similarity.utils.keypoint_detection.run_human_keypoints import detect_kps

BASE_DIR = os.path.dirname(__file__)
DOG_RATIO_DIR = os.path.join(BASE_DIR, "ratio_similarity", "data", "dogRatios")
DOG_IMAGE_DIR = os.path.join(BASE_DIR, "ratio_similarity", "data", "images")

# 映射：狗 ratio 字段 -> 人 ratio 字段
FIELD_MAP = {
    "eye_distance_ratio": "eye_width_ratio",
    "mouth_eye_ratio": "mouth_width_ratio",
    "nose_mouth_vertical_ratio": "mouth_height_ratio",
    "chin_nose_to_upperface_ratio": "face_aspect_ratio"
}

# ✅ 初始化 Flask，指向 dist/ 为前端目录
app = Flask(__name__, static_folder="dist", static_url_path="")
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ✅ 前端首页路由（React 页面）
@app.route("/")
def serve_frontend():
    return send_from_directory(app.static_folder, "index.html")

# ✅ 默认图片服务（狗图像）
@app.route("/static/<filename>")
def serve_image(filename):
    return send_from_directory(DOG_IMAGE_DIR, filename)

# ✅ 错误页面 fallback 给 React 路由支持
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")

# ✅ 欧氏距离计算函数
def ratio_distance(dog_ratios, human_ratios):
    dist = 0.0
    used = 0
    for dog_k, human_k in FIELD_MAP.items():
        if dog_k in dog_ratios and human_k in human_ratios:
            d = dog_ratios[dog_k] - human_ratios[human_k]
            dist += d * d
            used += 1
    return math.sqrt(dist) if used > 0 else float('inf')

# ✅ 核心匹配接口
@app.route("/api/ratio-match", methods=["POST"])
def ratio_match():
    if "image" not in request.files:
        return jsonify({"error": "No image file"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:
        k = int(request.form.get("top_k", 5))
    except ValueError:
        k = 5

    with TemporaryDirectory() as td:
        image_path = os.path.join(td, file.filename)
        file.save(image_path)
        print(f"[DEBUG] 上传图像已保存到：{image_path}")

        try:
            keypoints = detect_kps(image_path)
            if not keypoints:
                print("❌ 未检测到人脸关键点")
                return jsonify({"error": "未检测到人脸关键点"}), 400

            pts = extract_points(keypoints)
            human_ratios = compute_ratios(pts)
            print("[INFO] human_ratios =", human_ratios)
        except Exception as e:
            print("❌ 人脸处理出错：", str(e))
            return jsonify({"error": str(e)}), 500

        dog_files = glob(os.path.join(DOG_RATIO_DIR, '*_ratios.json'))
        all_results = []
        print(f"[INFO] 共找到 {len(dog_files)} 个狗 ratio 文件")

        for path in dog_files:
            with open(path) as f:
                dog_data = json.load(f)
            dog_ratios = dog_data.get("ratios", {})
            dist = ratio_distance(dog_ratios, human_ratios)
            image_base_name = os.path.basename(path).replace("_ratios.json", "")

            found = False
            for ext in [".jpg", ".jpeg", ".png"]:
                image_name = image_base_name + ext
                source_image_path = os.path.join(DOG_IMAGE_DIR, image_name)

                if os.path.exists(source_image_path):
                    print(f"[DEBUG] ✅ 找到匹配图片: {source_image_path}")
                    all_results.append({
                        "image_name": image_name,
                        "image_url": f"/static/{image_name}",
                        "distance": round(dist, 4)
                    })
                    found = True
                    break
            if not found:
                print(f"[DEBUG] ❌ 没找到对应图像: {image_base_name}.[jpg/jpeg/png]")

        topk = sorted(all_results, key=lambda x: x["distance"])[:k]
        print("\n📊 Top {} 最像的人类狗狗结果：".format(k))
        for i, item in enumerate(topk, 1):
            print(f"#{i}: {item['image_name']} → Distance = {item['distance']}")

        print("[DEBUG] 最终 topk 返回结果：")
        print(json.dumps(topk, indent=2, ensure_ascii=False))

        return jsonify({"results": topk})

# ✅ 启动（Render 兼容）
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
