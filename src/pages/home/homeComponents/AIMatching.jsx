import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Link } from 'react-router-dom';
import redbookLogo from '../../../assets/redbook.png';

const AIMatching = () => {
  const webcamRef = useRef(null);
  const [userImgSrc, setUserImgSrc] = useState(null);
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [similarity, setSimilarity] = useState(0);
  const [masterImage, setMasterImage] = useState(null);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [isMasterDecrypted, setIsMasterDecrypted] = useState(false);

  useEffect(() => {
    if (masterImage) {
      const timer = setTimeout(() => {
        setIsMasterModalOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [masterImage]);

  const capture = useCallback(async () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    const previousUserImage = localStorage.getItem('lastUserImage');
    if (previousUserImage) {
      setMasterImage(previousUserImage);
    }
    localStorage.setItem('lastUserImage', screenshot);
    
    setUserImgSrc(screenshot);
    setMatching(true);

    const blob = await fetch(screenshot).then((res) => res.blob());
    const formData = new FormData();
    formData.append("image", blob, "selfie.jpg");

    fetch("http://127.0.0.1:5001/api/compare", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        const best = data.results.find((r) => r.image) || data.results[0];
        const sim = Math.max(0, Math.min(100, Math.round((1 - best.distance) * 100)));
        setSimilarity(sim);
        setMatchResult({
          id: best.dog_file.replace('_ratios.json', ''),
          petImage: best.image,
          petName: best.dog_file.replace('_ratios.json', ''),
          shortDescription: '我叫小黄，来自一个温暖的救助站。我最喜欢在草地上打滚和追自己的尾巴。虽然我有点胆小，但我有一颗火热的心，正在等待那个能给我温暖的家的人。',
          age: '约2岁',
          breed: '中华田园犬',
          gender: '男孩',
        });
      })
      .catch((err) => {
        console.error("上传失败：", err);
        // Mock data for UI testing
        setSimilarity(85);
        setMatchResult({
            id: 'stray-dog-001',
            petName: '小黄',
            petImage: 'https://images.dog.ceo/breeds/terrier-norwich/n02094258_1003.jpg',
            shortDescription: '我叫小黄，来自一个温暖的救助站。我最喜欢在草地上打滚和追自己的尾巴。虽然我有点胆小，但我有一颗火热的心，正在等待那个能给我温暖的家的人。',
            age: '约2岁',
            breed: '中华田园犬',
            gender: '男孩',
        });
      })
      .finally(() => {
        setMatching(false);
      });
  }, [webcamRef]);

  const reset = () => {
    setUserImgSrc(null);
    setMatching(false);
    setMatchResult(null);
    setMasterImage(null);
    setIsMasterModalOpen(false);
    setIsMasterDecrypted(false);
  };

  return (
    <div id="ai-matching-section" className="container mx-auto px-4 py-16 text-center">
      
      {!matchResult && !matching && (
        <div className="card bg-base-100 shadow-xl max-w-lg mx-auto">
          <div className="card-body">
            <h2 className="card-title text-2xl">开启摄像头，遇见你的‘另一半’</h2>
            <p>请允许我们使用你的摄像头，并正对镜头，让我们认识一下你。</p>
            <div className="w-full border-2 border-dashed rounded-lg p-2 my-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-auto rounded"
              />
            </div>
            <div className="card-actions justify-center">
              <button onClick={capture} className="btn btn-primary">定格此刻</button>
            </div>
          </div>
        </div>
      )}

      {matching && (
        <div className="card bg-base-100 shadow-xl max-w-lg mx-auto">
            <div className="card-body items-center text-center">
                <h2 className="card-title">缘分正在连接...</h2>
                <p>正在庞大的流浪狗数据库中为你寻找，请稍候。</p>
                <div className="mt-4">
                    <span className="loading loading-spinner text-primary loading-lg"></span>
                </div>
            </div>
        </div>
      )}

      {matchResult && !matching && (
        <div className="w-full">
          <h2 className="text-3xl font-bold mb-8">匹配成功！</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="card w-64 bg-base-100 shadow-xl">
              <figure><img src={userImgSrc} alt="Your selfie" className="w-full h-auto" /></figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">这是你</h2>
              </div>
            </div>

            <div className="text-3xl font-bold text-secondary">{similarity}% <br /> 相似</div>

            <div className="card w-64 bg-base-100 shadow-xl">
              <figure><img src={matchResult.petImage} alt={matchResult.petName} className="w-full h-auto" /></figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">这是 {matchResult.petName}</h2>
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-2xl mx-auto">
            <div className="card bg-base-100 shadow-xl p-6">
                <h3 className="text-2xl font-bold text-left">它的故事</h3>
                <p className="my-4 text-left">{matchResult.shortDescription}</p>
                <div className="flex justify-start gap-2 flex-wrap">
                    <div className="badge badge-outline">{matchResult.age}</div>
                    <div className="badge badge-outline">{matchResult.breed}</div>
                    <div className="badge badge-outline">{matchResult.gender}</div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                    <div className="card-actions">
                        <button onClick={reset} className="btn btn-ghost">再试一次</button>
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
            <h3 className="font-bold text-lg text-center">WHO'S YOUR MASTER?</h3>
            <p className="py-2 text-center">你知道这个小狗的主人是谁吗？狗界翻版的你主人是谁呢？</p>
            
            <div className="my-4 flex justify-center">
              {isMasterDecrypted ? (
                <img src={masterImage} alt="The previous user" className="w-full h-auto rounded-lg max-w-xs" />
              ) : (
                <div className="w-full h-48 rounded-lg">
                  <img src={redbookLogo} alt="Post to Xiaohongshu to reveal" className="w-full h-full object-cover rounded-lg" />
                </div>
              )}
            </div>

            {!isMasterDecrypted ? (
                <div className="text-center">
                    <p>分享到小红书，带上话题 <span className="font-bold">#WHOSYOURMASTER</span> 揭晓TA的真面目！</p>
                    <button onClick={() => setIsMasterDecrypted(true)} className="btn btn-error mt-4 text-white">我已分享，立即揭晓</button>
                </div>
            ) : (
                <div className="text-center">
                  <p className="font-bold">已揭晓！</p>
                </div>
            )}

            <div className="modal-action">
                <button className="btn" onClick={() => { setIsMasterModalOpen(false) }}>关闭</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AIMatching; 