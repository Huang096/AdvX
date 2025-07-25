# app.py
#!/usr/bin/env python3
import os
import tempfile
from flask import Flask, request, jsonify
from ratio_similarity.main import pipeline  # 导入你现成的 pipeline

app = Flask(__name__)

# 假设你的 dogRatios 永远存放在项目目录下的这个位置
BASE_DIR      = os.path.dirname(__file__)                # .../AdvX/ratio_similarity
DOG_RATIO_DIR = os.path.join(BASE_DIR, "data", "dogRatios")

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
        # dog_ratio_dir 保持不变
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

        # 4. 格式化输出
        out = [
            {"dog_file": fn, "distance": dist}
            for fn, dist in results[:top_k]
        ]
    # 临时目录里所有文件都已自动删除
    return jsonify({"results": out})

if __name__ == "__main__":
    # 开发时跑 5000 端口
    app.run(host="0.0.0.0", port=5001, debug=True)
