
#!/usr/bin/env python3
import os
import tempfile
import base64
from flask import Flask, request, jsonify
from ratio_similarity.main import pipeline  # 导入你现成的 pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# dogRatio是肯定不会变的，所以这里写死，后面接数据库就好了
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

    # 2. 读取 top_k 参数（内部仍然传给 pipeline，但我们只关心最终那一张）
    try:
        top_k = int(request.form.get("top_k", 3))
    except ValueError:
        top_k = 3

    # 3. 存到临时目录并调用 pipeline
    with tempfile.TemporaryDirectory() as td:
        img_path = os.path.join(td, file.filename)
        file.save(img_path)

        human_kpt_dir   = os.path.join(td, "human_kpt")
        human_ratio_dir = os.path.join(td, "human_ratio")

        try:
            final_img, description = pipeline(
                img_path,
                human_kpt_dir,
                human_ratio_dir,
                DOG_RATIO_DIR,
                DOG_IMG_DIR,
                top_k=top_k
            )
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        # 4. 把最终选中的图片读成 base64
        img_b64 = None
        if os.path.exists(final_img):
            with open(final_img, "rb") as f:
                img_b64 = base64.b64encode(f.read()).decode("utf-8")

    # 临时目录清理后返回结果
    return jsonify({
        "image_path": final_img,
        "image":      f"data:image/jpeg;base64,{img_b64}" if img_b64 else None,
        "description": description
    })


if __name__ == "__main__":
    # 开发时跑 5001 端口
    app.run(host="0.0.0.0", port=5001, debug=True)
