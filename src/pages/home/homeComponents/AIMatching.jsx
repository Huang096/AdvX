import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import strayDogImage from '../../../assets/stray-dog.png'; // 导入我们的主角图片
import { Link } from 'react-router-dom';

// 预设的狗狗信息，我们不再从JSON随机读取
const matchedPet = {
    id: 'stray-dog-001',
    petName: '小黄',
    petImage: strayDogImage,
    shortDescription: '我叫小黄，来自一个温暖的救助站。我最喜欢在草地上打滚和追自己的尾巴。虽然我有点胆小，但我有一颗火热的心，正在等待那个能给我温暖的家的人。',
    age: '约2岁',
    breed: '中华田园犬',
    gender: '男孩',
};

const AIMatching = () => {
    const webcamRef = useRef(null);
    const [userImgSrc, setUserImgSrc] = useState(null);
    const [matching, setMatching] = useState(false);
    const [matchResult, setMatchResult] = useState(null);
    const [similarity, setSimilarity] = useState(0);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setUserImgSrc(imageSrc);
        setMatching(true);
        setMatchResult(null);

        // 模拟AI匹配过程
        setTimeout(() => {
            setMatchResult(matchedPet);
            // 生成一个随机的相似度
            setSimilarity(Math.floor(Math.random() * (95 - 75 + 1)) + 75);
            setMatching(false);
        }, 2000);
    }, [webcamRef]);

    const reset = () => {
        setUserImgSrc(null);
        setMatching(false);
        setMatchResult(null);
    };

    return (
        <div id="ai-matching-section" className="container mx-auto px-4 py-16 text-center bg-base-200">
            { !matchResult && (
                <>
                    <h2 className="text-3xl font-bold mb-4">开启摄像头，遇见你的‘另一半’</h2>
                    <p className="mb-8">请允许我们使用你的摄像头，并正对镜头，让我们认识一下你。</p>
                </>
            )}
            
            <div className="flex flex-col items-center">
                {/* 初始视图：摄像头和拍照按钮 */}
                {!userImgSrc && (
                    <div className="w-full max-w-lg border-4 border-dashed rounded-lg p-4 mb-4">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="w-full h-auto rounded"
                        />
                    </div>
                )}
                {!userImgSrc && <button onClick={capture} className="btn btn-primary">定格此刻</button>}

                {/* 加载状态 */}
                {matching && (
                    <div className="mt-4">
                        <p className="text-xl">正在庞大的流浪狗数据库中为你寻找...</p>
                        <p className="text-2xl font-bold">缘分正在连接，请稍候...</p>
                        <span className="loading loading-dots loading-lg mt-4"></span>
                    </div>
                )}
                
                {/* 匹配结果展示 */}
                {matchResult && !matching && (
                    <div className="w-full">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-8">匹配成功！</h2>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                                {/* 用户照片 */}
                                <div className="card w-64 bg-base-100 shadow-xl">
                                    <figure><img src={userImgSrc} alt="Your selfie" className="w-full h-auto" /></figure>
                                    <div className="card-body items-center text-center">
                                        <h2 className="card-title">这是你</h2>
                                    </div>
                                </div>

                                {/* 相似度 */}
                                <div className="text-3xl font-bold text-primary">{similarity}% <br/> 相似</div>

                                {/* 狗狗照片 */}
                                <div className="card w-64 bg-base-100 shadow-xl">
                                    <figure><img src={matchResult.petImage} alt={matchResult.petName} className="w-full h-auto" /></figure>
                                    <div className="card-body items-center text-center">
                                        <h2 className="card-title">这是 {matchResult.petName}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 狗狗详细信息和操作按钮 */}
                        <div className="mt-8 max-w-2xl mx-auto">
                             <div className="card bg-base-100 shadow-xl p-6">
                                <h3 className="text-2xl font-bold">它的故事</h3>
                                <p className="my-4">{matchResult.shortDescription}</p>
                                <div className="flex justify-center gap-4">
                                    <div className="badge badge-info">{matchResult.age}</div>
                                    <div className="badge badge-success">{matchResult.breed}</div>
                                    <div className="badge badge-secondary">{matchResult.gender}</div>
                                </div>
                                <div className="card-actions justify-center mt-6">
                                    <Link to={`/pet/${matchResult.id}`} className="btn btn-primary">进入它的主页，开始云养</Link>
                                    <button onClick={reset} className="btn btn-ghost">再试一次</button>
                                </div>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIMatching; 