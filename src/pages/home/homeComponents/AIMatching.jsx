import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Link } from 'react-router-dom';

const AIMatching = () => {
  const webcamRef = useRef(null);
  const [userImgSrc, setUserImgSrc] = useState(null);
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [similarity, setSimilarity] = useState(0);

  const capture = useCallback(async () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;
    
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

            <div className="text-3xl font-bold text-primary">{similarity}% <br /> 相似</div>

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
                <div className="card-actions justify-end mt-6">
                    <button onClick={reset} className="btn btn-ghost">再试一次</button>
                    <Link to={`/pet/${matchResult.id}`} className="btn btn-primary">
                        进入它的主页，开始云养
                    </Link>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMatching; 