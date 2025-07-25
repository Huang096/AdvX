#!/usr/bin/env python3
import os
import sys
print("当前 Python 可执行文件：", sys.executable)
print("当前 sys.path：", sys.path)
import json
import argparse

from .utils.keypoint_detection.run_human_keypoints import detect_kps
from .utils.ratio.compute_human_ratios     import extract_points, compute_ratios
from .utils.ratio.compare_ratios           import load_ratios, weighted_dist, WEIGHTS



def pipeline(image_path, human_kpt_dir, human_ratio_dir, dog_ratio_dir, top_k=3):
    """
    完整流水线：
    1. 检测人脸关键点并保存 JSON
    2. 计算人脸 ratios 并保存 JSON
    3. 与所有狗狗 ratios 比较，输出 Top-K 最相似结果
    """
    os.makedirs(human_kpt_dir, exist_ok=True)
    os.makedirs(human_ratio_dir, exist_ok=True)

    # 1. 提取关键点
    kps = detect_kps(image_path)
    if not kps:
        print(f"❌ 未检测到人脸关键点：{image_path}")
        sys.exit(1)
    base = os.path.splitext(os.path.basename(image_path))[0]
    kpt_out = os.path.join(human_kpt_dir, base + ".json")
    with open(kpt_out, "w") as f:
        json.dump({"image": image_path, "keypoints": kps}, f, indent=2)
    print(f"[HUMAN] 关键点已保存至 {kpt_out}")

    # 2. 计算 ratios
    pts = extract_points(kps)
    try:
        ratios = compute_ratios(pts)
    except ValueError as e:
        print(f"❌ 计算 ratios 出错：{e}")
        sys.exit(1)
    ratio_out = os.path.join(human_ratio_dir, base + "_ratios.json")
    with open(ratio_out, "w") as f:
        json.dump({"image": image_path, "ratios": ratios}, f, indent=2)
    print(f"[HUMAN] ratios 已保存至 {ratio_out}")

    # 3. 加载人脸 ratios 并与狗狗比对
    human_ratios = ratios
    results = []
    for fn in os.listdir(dog_ratio_dir):
        if not fn.endswith(".json"): continue
        dog_path = os.path.join(dog_ratio_dir, fn)
        dog_ratios = load_ratios(dog_path)
        dist = weighted_dist(human_ratios, dog_ratios, WEIGHTS)
        results.append((fn, dist))

    results.sort(key=lambda x: x[1])
    print("\n🐶 Top-%d 狗狗相似度排行：" % top_k)
    for idx, (fn, d) in enumerate(results[:top_k], 1):
        print(f"  {idx}. {fn:20s}  距离={d:.4f}")

    return results


def main():
    p = argparse.ArgumentParser(description="全流程：关键点 -> ratios -> 与狗狗比对")
    p.add_argument("--input_image", required=True, help="待比对的人脸图片路径")
    p.add_argument("--human_kpt_dir", default="data/humanKeypoint", help="关键点输出目录")
    p.add_argument("--human_ratio_dir", default="data/humanRatios", help="人脸 ratios 输出目录")
    p.add_argument("--dog_ratio_dir", default="data/dogRatios", help="狗狗 ratios 目录")
    p.add_argument("--top_k", type=int, default=3, help="展示 Top-K 个结果")
    args = p.parse_args()

    pipeline(
        args.input_image,
        args.human_kpt_dir,
        args.human_ratio_dir,
        args.dog_ratio_dir,
        args.top_k
    )


if __name__ == "__main__":
    main()