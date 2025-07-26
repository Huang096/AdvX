import React, { useState, useRef, useCallback } from 'react';
import Webcam from "react-webcam";

const AIMatching = () => {
  const webcamRef = useRef(null);

  // 截图后的本地预览
  const [userImgSrc, setUserImgSrc] = useState(null);
  // 是否在等待后端返回
  const [loading, setLoading] = useState(false);

  const [matchResult, setMatchResult] = useState(null);

  const capture = useCallback(async () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    setUserImgSrc(screenshot);
    setLoading(true);
    setMatchResult(null);

    try {
      // dataURL → Blob
      const blob = await fetch(screenshot).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "selfie.jpg");

      // 调用 /api/compare
      const res = await fetch("http://127.0.0.1:5001/api/compare", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "服务器返回非 2xx 状态");
      }

      // 设置匹配结果
      setMatchResult({
        petImage: data.image, // base64 图像
        description: data.description, // 文字描述
      });
    } catch (err) {
      console.error("接口调用失败：", err);
      // 如果要做 UI 测试，可以在这里填 mock
      setMatchResult({
        petImage:
          "https://images.dog.ceo/breeds/terrier-norwich/n02094258_1003.jpg",
        description: "模拟：这是一只可爱的流浪狗，叫小黄，喜欢打滚……",
      });
    } finally {
      setLoading(false);
    }
  }, [webcamRef]);

  const reset = () => {
    setUserImgSrc(null);
    setMatchResult(null);
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      {/* 1. 没截图也没在加载时，显示摄像头 */}
      {!userImgSrc && !loading && (
        <div className="card bg-base-100 shadow-xl max-w-lg mx-auto">
          <div className="card-body">
            <h2 className="card-title text-2xl">开启摄像头，遇见你的伙伴</h2>
            <p>请允许我们使用摄像头，并正对镜头。</p>
            <div className="w-full border-2 border-dashed rounded-lg p-2 my-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-auto rounded"
              />
            </div>
            <div className="card-actions justify-center">
              <button onClick={capture} className="btn btn-primary">
                定格此刻
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 请求中 */}
      {loading && (
        <div className="card bg-base-100 shadow-xl max-w-lg mx-auto">
          <div className="card-body items-center text-center">
            <h2 className="card-title">缘分正在连接...</h2>
            <p>正在为你生成描述，请稍候。</p>
            <span className="loading loading-spinner text-primary loading-lg mt-4"></span>
          </div>
        </div>
      )}

      {/* 3. 请求完成后，显示截图 + 后端返回的图片 + 描述 */}
      {matchResult && !loading && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="card w-56 bg-base-100 shadow-xl">
              <figure>
                <img
                  src={userImgSrc}
                  alt="你的图片"
                  className="w-full h-auto"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">这是你</h3>
              </div>
            </div>

            <div className="card w-56 bg-base-100 shadow-xl">
              <figure>
                <img
                  src={matchResult.petImage}
                  alt="匹配结果"
                  className="w-full h-auto"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">这是世界上另一个你</h3>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl p-6 text-left">
            <h3 className="text-2xl font-bold mb-4">它的故事</h3>
            <p className="whitespace-pre-wrap">{matchResult.description}</p>
            <div className="mt-6 flex justify-end">
              <button onClick={reset} className="btn btn-ghost">
                再试一次
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMatching;
