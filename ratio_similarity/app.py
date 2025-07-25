
#!/usr/bin/env python3
import os
import tempfile
import base64
from flask import Flask, request, jsonify
from ratio_similarity.main import pipeline  # 导入你现成的 pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# 假设你的 dogRatios 永远存放在项目目录下的这个位置
BASE_DIR      = os.path.dirname(__file__)                # .../AdvX/ratio_similarity
DOG_RATIO_DIR = os.path.join(BASE_DIR, "data", "dogRatios")
DOG_IMG_DIR   = os.path.join(BASE_DIR, "data", "dogImg")

@app.route("/api/compare", methods=["POST"])
def compare():
    # 1. 校验图片
    if "image" not in request.files:
        return jsonify({"error": "No image file"}), 400
    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # 2. 读取 top_k 参数
    try:
        top_k = int(request.form.get("top_k", 3))
    except ValueError:
        top_k = 3

    # 3. 用临时目录存放人脸图片、keypoints、ratios
    with tempfile.TemporaryDirectory() as td:
        img_path = os.path.join(td, file.filename)
        file.save(img_path)

        human_kpt_dir   = os.path.join(td, "human_kpt")
        human_ratio_dir = os.path.join(td, "human_ratio")

        try:
            results = pipeline(
                img_path,
                human_kpt_dir,
                human_ratio_dir,
                DOG_RATIO_DIR,
                top_k=top_k
            )
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        # 4. 格式化输出，并把图片读进来做 Base64 编码
        out = []
        for fn, dist in results[:top_k]:
            # fn 例如 "10_ratios.json"，去掉 "_ratios.json" 后缀拿到 "10"
            base = os.path.splitext(fn)[0].replace("_ratios", "")
            img_file = os.path.join(DOG_IMG_DIR, base + ".jpg")
            img_b64 = None
            if os.path.exists(img_file):
                with open(img_file, "rb") as f:
                    img_b64 = base64.b64encode(f.read()).decode("utf-8")
            out.append({
                "dog_file": fn,
                "distance": dist,
                "image": f"data:image/jpeg;base64,{img_b64}" if img_b64 else None
            })

    # 临时目录里所有文件都已自动删除
    return jsonify({"results": out})

if __name__ == "__main__":
    # 开发时跑 5001 端口
    app.run(host="0.0.0.0", port=5001, debug=True)
