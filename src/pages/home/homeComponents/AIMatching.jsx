import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Link } from 'react-router-dom';
import redbookLogo from '../../../assets/redbook.png';

const AIMatching = () => {
  const webcamRef = useRef(null);

  // 截图后的本地预览
  const [userImgSrc, setUserImgSrc] = useState(null);
  // 是否在等待后端返回
  const [loading, setLoading] = useState(false);

  const [matchResult, setMatchResult] = useState(null);
  const [similarity, setSimilarity] = useState(0);
  const [masterImage, setMasterImage] = useState(null);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [isMasterDecrypted, setIsMasterDecrypted] = useState(false);

  useEffect(() => {
    if (!loading && matchResult) {
      const timer = setTimeout(() => {
        setIsMasterModalOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading, matchResult]);

  const capture = useCallback(async () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    const previousUserImage = localStorage.getItem("lastUserImage");
    if (previousUserImage) {
      setMasterImage(previousUserImage);
    }
    localStorage.setItem("lastUserImage", screenshot);

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
    setMasterImage(null);
    setIsMasterModalOpen(false);
    setIsMasterDecrypted(false);
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

          <div className="mt-8 max-w-2xl mx-auto">
            <div className="card bg-base-100 shadow-xl p-6">
              <h3 className="text-2xl font-bold text-left">它的故事</h3>
              <p className="my-4 text-left">{matchResult.shortDescription}</p>
              <div className="mt-4 text-left">
                <p className="whitespace-pre-wrap">{matchResult.description}</p>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div className="card-actions">
                  <button onClick={reset} className="btn btn-ghost">
                    再试一次
                  </button>
                  <Link to="/userdashboard" className="btn btn-primary">
                    进入它的主页，开始云养
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMasterModalOpen && (
        <dialog open className="modal modal-bottom sm:modal-middle modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">
              WHO'S YOUR MASTER?
            </h3>
            <p className="py-2 text-center">
              你知道这个小狗的主人是谁吗？狗界翻版的你主人是谁呢？
            </p>

            <div className="my-4 flex justify-center">
              {isMasterDecrypted ? (
                <img
                  src={masterImage}
                  alt="The previous user"
                  className="w-full h-auto rounded-lg max-w-xs"
                />
              ) : (
                <div className="w-full h-48 rounded-lg">
                  <img
                    src={redbookLogo}
                    alt="Post to Xiaohongshu to reveal"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {!isMasterDecrypted ? (
              <div className="text-center">
                <p>
                  分享到小红书，带上话题{" "}
                  <span className="font-bold">#WHOSYOURMASTER</span>{" "}
                  揭晓TA的真面目！
                </p>
                <button
                  onClick={() => setIsMasterDecrypted(true)}
                  className="btn btn-error mt-4 text-white"
                >
                  我已分享，立即揭晓
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-bold">已揭晓！</p>
              </div>
            )}

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setIsMasterModalOpen(false);
                }}
              >
                关闭
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AIMatching;
