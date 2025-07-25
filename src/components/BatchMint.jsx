import React, { useState } from 'react';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;

const pinFileToIPFS = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Pinata 上传失败');
  const data = await res.json();
  return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
};

const pinJSONToIPFS = async (json) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    },
    body: JSON.stringify({ pinataContent: json }),
  });
  if (!res.ok) throw new Error('Pinata 上传 metadata 失败');
  const data = await res.json();
  return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
};

const BatchMint = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [nftData, setNftData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const [minting, setMinting] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    // 为每个文件创建默认的 NFT 数据
    const defaultNftData = files.map((file, index) => ({
      name: file.name.replace(/\.[^/.]+$/, ""), // 移除文件扩展名
      description: `NFT #${index + 1} - 通过 WHO'S YOUR MASTER 平台铸造`,
      file: file
    }));
    setNftData(defaultNftData);
  };

  const updateNftData = (index, field, value) => {
    setNftData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleUploadToIPFS = async () => {
    setUploading(true);
    setUploadResults([]);
    try {
      const results = [];
      for (let i = 0; i < nftData.length; i++) {
        const nft = nftData[i];
        // 1. 上传图片
        const imageUrl = await pinFileToIPFS(nft.file);
        // 2. 生成 metadata
        const metadata = {
          name: nft.name,
          description: nft.description,
          image: imageUrl,
          attributes: [
            {
              trait_type: "Created By",
              value: "WHO'S YOUR MASTER"
            },
            {
              trait_type: "Batch",
              value: `Batch-${Date.now()}`
            }
          ]
        };
        // 3. 上传 metadata
        const metadataUrl = await pinJSONToIPFS(metadata);
        results.push({
          fileName: nft.file.name,
          name: nft.name,
          description: nft.description,
          imageUrl,
          metadataUrl,
        });
      }
      setUploadResults(results);
    } catch (err) {
      alert('上传失败: ' + err.message);
    }
    setUploading(false);
  };

  const handleMintNFTs = async () => {
    setMinting(true);
    try {
      // TODO: 集成 Injective CosmWasm CW721 合约调用
      alert(`即将铸造 ${uploadResults.length} 个 NFT！\n\n目前正在开发合约集成功能，敬请期待...`);
    } catch (err) {
      alert('铸造失败: ' + err.message);
    }
    setMinting(false);
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="hero bg-gradient-to-r from-primary to-secondary text-white rounded-lg mb-8">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-4xl font-bold">🎨 批量铸造 NFT</h1>
            <p className="mb-5">在 Injective 区块链上一键创建你的专属 NFT 集合</p>
          </div>
        </div>
      </div>

      {/* 步骤 1: 上传图片 */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">📸 步骤 1: 上传图片</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">选择图片文件</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered file-input-primary w-full"
            />
            <label className="label">
              <span className="label-text-alt">支持 JPG、PNG、GIF 等格式，可多选</span>
            </label>
          </div>
        </div>
      </div>

      {/* 步骤 2: 编辑 NFT 信息 */}
      {nftData.length > 0 && (
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">✏️ 步骤 2: 编辑 NFT 信息</h2>
            <div className="grid gap-4">
              {nftData.map((nft, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <img 
                      src={URL.createObjectURL(nft.file)} 
                      alt={nft.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">NFT 名称</span>
                        </label>
                        <input
                          type="text"
                          value={nft.name}
                          onChange={(e) => updateNftData(index, 'name', e.target.value)}
                          className="input input-bordered"
                          placeholder="输入 NFT 名称"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">NFT 描述</span>
                        </label>
                        <textarea
                          value={nft.description}
                          onChange={(e) => updateNftData(index, 'description', e.target.value)}
                          className="textarea textarea-bordered"
                          placeholder="描述这个 NFT 的特色..."
                          rows="2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 步骤 3: 上传到 IPFS */}
      {nftData.length > 0 && (
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">☁️ 步骤 3: 上传到 IPFS</h2>
            <p className="mb-4">将图片和元数据上传到去中心化存储网络 IPFS</p>
            <button
              onClick={handleUploadToIPFS}
              disabled={uploading || nftData.length === 0}
              className="btn btn-primary btn-lg"
            >
              {uploading ? (
                <span className="loading loading-spinner"></span>
              ) : null}
              {uploading ? '上传中...' : `上传 ${nftData.length} 个 NFT 到 IPFS`}
            </button>
          </div>
        </div>
      )}

      {/* 步骤 4: 上传结果 */}
      {uploadResults.length > 0 && (
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">✅ 上传成功！</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>NFT 名称</th>
                    <th>图片链接</th>
                    <th>元数据链接</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadResults.map((result, index) => (
                    <tr key={index}>
                      <td>{result.name}</td>
                      <td>
                        <a 
                          href={result.imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="link link-primary"
                        >
                          查看图片
                        </a>
                      </td>
                      <td>
                        <a 
                          href={result.metadataUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="link link-secondary"
                        >
                          查看元数据
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 步骤 5: 铸造 NFT */}
      {uploadResults.length > 0 && (
        <div className="card bg-success text-success-content shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title text-2xl justify-center mb-4">🚀 步骤 4: 铸造 NFT</h2>
            <p className="mb-4">一切准备就绪！点击按钮将 NFT 铸造到你的钱包</p>
            <button
              onClick={handleMintNFTs}
              disabled={minting}
              className="btn btn-lg btn-warning"
            >
              {minting ? (
                <span className="loading loading-spinner"></span>
              ) : null}
              {minting ? '铸造中...' : `铸造 ${uploadResults.length} 个 NFT 到钱包`}
            </button>
            <div className="text-sm opacity-80 mt-2">
              * 需要连接 Injective 钱包并支付少量 Gas 费用
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchMint;