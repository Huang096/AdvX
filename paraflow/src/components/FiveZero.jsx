import React from "react";

// 注意：部分样式依赖外部 CSS 和字体图标库，需在项目入口引入
// 如需进一步组件化，可拆分为更小的组件

const FiveZero = () => (
  <div
    id="5:0"
    className="font-[-apple-system,BlinkMacSystemFont,'Segoe UI'] flex relative flex-col justify-between w-[1440px] min-h-[844px]"
    style={{
      backgroundColor: "rgba(255, 251, 253, 1)",
      marginRight: "auto",
      marginLeft: "auto",
      lineHeight: 1.5,
      color: "rgba(79, 79, 79, 1)",
    }}
    title="Pawsitive Match Home Page"
  >
    {/* 顶部公告栏 */}
    <div className="flex justify-center items-center w-full h-10" style={{ backgroundColor: "rgba(255, 217, 102, 1)", color: "rgba(93, 64, 55, 1)" }}>
      <p className="text-center font-medium">【NGO 公益】本周大型犬领养活动开放！</p>
    </div>
    {/* 顶部状态栏 */}
    <div className="text-sm flex justify-between items-center h-11 pr-6 pl-6 font-medium">
      <div className="time">9:41</div>
      <div className="text-xs flex" style={{ rowGap: "0.375rem", columnGap: "0.375rem" }}>
        <i className="fas fa-signal-perfect"></i>
        <i className="fas fa-wifi-strong"></i>
        <i className="fas fa-battery-three-quarters"></i>
      </div>
    </div>
    {/* Header 区域 */}
    <header className="flex justify-between items-center h-20 pr-16 pl-16 rounded-br-[16px] rounded-bl-[16px]" style={{ backgroundColor: "rgba(250, 209, 226, 1)", paddingTop: "0.375rem", paddingBottom: "0.375rem" }}>
      <div className="flex items-center">
        <div className="flex justify-center items-center w-10 h-10 mr-3">
          <i className="fas fa-paw text-2xl" style={{ color: "rgba(93, 64, 55, 1)" }}></i>
        </div>
        <h1 className="logo-text" style={{ color: "rgba(93, 64, 55, 1)" }}>Pawsitive Match</h1>
      </div>
      <div className="flex items-center gap-y-6 gap-x-6">
        <a href="#" className="font-medium" style={{ color: "rgba(93, 64, 55, 1)" }}>首页</a>
        <a href="#" className="font-medium" style={{ color: "rgba(93, 64, 55, 1)" }}>关于我们</a>
        <a href="#" className="font-medium" style={{ color: "rgba(93, 64, 55, 1)" }}>领养流程</a>
        <a href="#" className="font-medium" style={{ color: "rgba(93, 64, 55, 1)" }}>联系方式</a>
      </div>
    </header>
    {/* 横幅 */}
    <div className="flex items-center mt-6 mr-16 mb-6 ml-16" style={{ backgroundColor: "rgba(205, 232, 249, 1)" }}>
      <div className="flex justify-center items-center w-6 h-6 mr-2">
        <i className="fas fa-heart" style={{ color: "rgba(93, 64, 55, 1)" }}></i>
      </div>
      <p className="banner-text" style={{ color: "rgba(93, 64, 55, 1)" }}>100% of proceeds go to local animal shelters</p>
    </div>
    {/* 主体内容 */}
    <main className="grid grid-cols-2 gap-y-8 gap-x-8 pt-8 pr-16 pb-8 pl-16">
      {/* 左侧内容 */}
      <section className="flex flex-col">
        <h2 className="headline-text mb-4" style={{ color: "rgba(79, 79, 79, 1)" }}>找到您完美的毛茸茸伴侣</h2>
        <p className="body-text mb-6">我们的AI匹配系统分析您的个性，为您匹配最适合您生活方式的狗狗。</p>
        <div className="flex items-center mb-8 pt-4 pr-4 pb-4 pl-4 rounded-tl-[16px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px]" style={{ backgroundColor: "rgba(255, 255, 255, 1)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}>
          <div className="flex justify-center items-center w-12 h-12 mr-4 rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-full" style={{ backgroundColor: "rgba(253, 232, 240, 1)" }}>
            <i className="fas fa-wand-magic" style={{ color: "rgba(93, 64, 55, 1)" }}></i>
          </div>
          <div>
            <h3 className="mb-1 text-[16px] font-medium">✨ AI驱动的匹配</h3>
            <p className="text-[14px]" style={{ color: "rgba(130, 130, 130, 1)" }}>我们的技术确保您和新朋友之间的兼容性</p>
          </div>
        </div>
        {/* 三个功能卡片 */}
        <div className="grid grid-cols-3 gap-y-6 gap-x-6 mt-6">
          {/* 自拍上传卡片 */}
          <div className="pt-4 pr-4 pb-4 pl-4 rounded-tl-[16px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px]" style={{ backgroundColor: "rgba(255, 255, 255, 1)", boxShadow: "0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)" }}>
            <h3 className="mb-3 text-[16px] font-medium">让我们从自拍开始</h3>
            <p className="mb-4 text-[14px]" style={{ color: "rgba(130, 130, 130, 1)" }}>点击上传自拍，找到最像你的狗狗～</p>
            <div className="upload-container flex flex-col justify-center items-center pt-6 pr-6 pb-6 pl-6 rounded-tl-[16px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px]" style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}>
              <div className="flex justify-center items-center w-16 h-16 mb-4 rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-full" style={{ backgroundColor: "rgba(253, 232, 240, 1)" }}>
                <i className="fas fa-camera-alt text-xl" style={{ color: "rgba(93, 64, 55, 1)" }}></i>
              </div>
              <p className="text-center mb-2 text-[14px]">点击上传照片</p>
            </div>
          </div>
          {/* AI 匹配中卡片 */}
          <div className="pt-4 pr-4 pb-4 pl-4 rounded-tl-[16px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px]" style={{ backgroundColor: "rgba(255, 255, 255, 1)", boxShadow: "0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)" }}>
            <h3 className="mb-3 text-[16px] font-medium">AI 正在匹配中</h3>
            <p className="mb-4 text-[14px]" style={{ color: "rgba(130, 130, 130, 1)" }}>AI 正在匹配中，请稍候...</p>
            <div className="flex justify-center items-center pt-6 pr-6 pb-6 pl-6">
              <div className="loading-spinner w-[50px] h-[50px] border-t-solid border-r-solid border-b-solid border-l-solid border-t-[4px] border-r-[4px] border-b-[4px] border-l-[4px]" style={{ borderTopColor: "rgba(93, 64, 55, 1)", borderRightColor: "rgba(253, 232, 240, 1)", borderBottomColor: "rgba(253, 232, 240, 1)", borderLeftColor: "rgba(253, 232, 240, 1)", borderTopLeftRadius: "50%", borderTopRightRadius: "50%", borderBottomRightRadius: "50%", borderBottomLeftRadius: "50%" }}></div>
            </div>
          </div>
          {/* 推荐犬只卡片 */}
          <div className="pt-4 pr-4 pb-4 pl-4 rounded-tl-[16px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px]" style={{ backgroundColor: "rgba(255, 255, 255, 1)", boxShadow: "0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)" }}>
            <h3 className="mb-3 text-[16px] font-medium">推荐犬只</h3>
            <div className="flex flex-col items-center">
              <img src="https://static.paraflowcontent.com/public/resource/image/dd79a574-76d2-4325-a37a-f4fc93724d81.jpeg" alt="A cute small dog named Coco with light brown fur, looking playful and energetic" className="w-[120px] h-[120px] mb-3 rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-full" />
              <p className="font-medium">Coco, 3岁, 活泼好动</p>
              <div className="flex gap-y-2 gap-x-2 mt-3">
                <button className="text-sm pt-1 pr-3 pb-1 pl-3 border-t-solid border-r-solid border-b-solid border-l-solid border-t-[1px] border-r-[1px] border-b-[1px] border-l-[1px] rounded-tl-[8px] rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px]" style={{ backgroundColor: "rgba(255, 255, 255, 1)", color: "rgba(93, 64, 55, 1)", borderTopColor: "rgba(250, 209, 226, 1)", borderRightColor: "rgba(250, 209, 226, 1)", borderBottomColor: "rgba(250, 209, 226, 1)", borderLeftColor: "rgba(250, 209, 226, 1)" }}>查看详情</button>
                <button className="text-sm pt-1 pr-3 pb-1 pl-3 rounded-tl-[8px] rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px]" style={{ backgroundColor: "rgba(255, 217, 102, 1)", color: "rgba(93, 64, 55, 1)" }}>立即领养</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 右侧图片与按钮 */}
      <section className="flex flex-col justify-center items-center">
        <img src="https://static.paraflowcontent.com/public/resource/image/bd36ae9e-94ac-4ebf-82d2-9b6ad3084eb3.jpeg" alt="A happy person hugging a dog, showing the joy of a successful match, the person smiling while petting a golden retriever" className="w-[500px] h-[400px] mb-6 rounded-tl-[24px] rounded-tr-[24px] rounded-br-[24px] rounded-bl-[24px]" />
        <div className="flex flex-col items-center mt-4">
          <p className="text-center mb-6 text-[14px] italic" style={{ color: "rgba(130, 130, 130, 1)" }}>您的完美伴侣正在等待您！</p>
          <button className="flex justify-center items-center gap-y-2 gap-x-2 w-[300px] pt-3 pr-8 pb-3 pl-8 rounded-tl-[16px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] font-medium" style={{ backgroundColor: "rgba(255, 217, 102, 1)", color: "rgba(93, 64, 55, 1)" }}>
            <i className="fas fa-paw"></i>
            <span>开始匹配</span>
          </button>
          <p className="text-center mt-3 text-[12px]" style={{ color: "rgba(130, 130, 130, 1)" }}>继续操作即表示您同意我们的服务条款</p>
        </div>
      </section>
    </main>
  </div>
);

export default FiveZero; 