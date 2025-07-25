# compare_ratios.py
import os
import json
import math
import argparse

def load_ratios(path):
    with open(path) as f:
        data = json.load(f)
    return data["ratios"]

def euclid_dist(r1, r2):
    common = set(r1.keys()) & set(r2.keys())
    if not common:
        return float("inf")
    s = 0.0
    for k in common:
        v1, v2 = r1[k], r2[k]
        if v1 is None or v2 is None:
            continue
        s += (v1 - v2) ** 2
    return math.sqrt(s)

def main():
    p = argparse.ArgumentParser(
        description="Compare one human ratio against multiple dog ratios and find the closest match"
    )
    p.add_argument(
        "--human_dir",
        default="/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/humanRatios",
        help="人脸 ratio JSON 绝对路径目录（只取第1个 .json）"
    )
    p.add_argument(
        "--dog_dir",
        default="/Users/huangzheheng/Desktop/AdvX/ratio_similarity/data/dogRatios",
        help="狗狗 ratio JSON 绝对路径目录"
    )
    args = p.parse_args()

    human_files = [f for f in os.listdir(args.human_dir) if f.endswith(".json")]
    if not human_files:
        raise RuntimeError(f"No human .json in {args.human_dir}")
    human_path = os.path.join(args.human_dir, human_files[0])
    human_ratios = load_ratios(human_path)
    print(f"Loaded human ratios from {human_files[0]}, keys: {list(human_ratios.keys())}")

    dog_files = [f for f in os.listdir(args.dog_dir) if f.endswith(".json")]
    if not dog_files:
        raise RuntimeError(f"No dog .json in {args.dog_dir}")

    results = []
    for fn in dog_files:
        dog_path = os.path.join(args.dog_dir, fn)
        dog_ratios = load_ratios(dog_path)
        d = euclid_dist(human_ratios, dog_ratios)
        results.append((fn, d))

    results.sort(key=lambda x: x[1])

    print("\nTop matches (closest first):")
    for fn, dist in results:
        print(f"  {fn:20s}  distance = {dist:.4f}")

    best_fn, best_d = results[0]
    print(f"\n✅ Best match: {best_fn}  (distance = {best_d:.4f})")

if __name__ == "__main__":
    main()
