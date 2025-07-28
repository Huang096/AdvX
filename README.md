工作流程

准备工作
1. 关于后端还有模型相关的文件我们全都放在了ratio-similarity这个文件夹里。所有狗狗的照片都会从ratio_similarity/data/dogImg读取。
2. 在往dogImg文件里面存了图片之后，我们就可以开始生成狗狗面部的关键点位生成。用于生成点位的模型我们存在了ratio_similarity/models。（目前来说这里用到的模型只是用来进行人类面部检测的，所以放在狗狗脸上实际上效果非常不好。后面需要更换专门针对于狗狗面部的模型）实际生成点位的话我们可以去到ratio_similarity/utils/keypoint_detection 然后执行 python run_dog_keypoint.py。然后，生成的狗狗面部点位文件就会以json的格式存到ratio_similarity/data/dog_keypoints。
3. 在获取了狗狗面部关键点的坐标之后，我们会需要计算出一些相关的比例用来方便后续比较。具体的计算还有比例的生成我们需要在ratio_similarity/utils/ratio 执行 python compute_dog_ratios.py，生成好的比例文件我们会放到ratio_similarity/data/dogRatios。然后这个地方具体计算的“比例”，目前都还只是让gpt自己生成的，具体我们需要哪些比例，可能要看一些cognitive science的相关资料。
4. 在获取了狗狗图片对应的比例之后呢，我们的模型相关准备工作就完成了。
5. 当然前端还需要 npm install。

项目启动
1. 前端 在项目根目录下执行 npm run dev (前端是stephnie写的，我只是把接口调通了，感谢S姐)
2. 后端 同样是在项目根目录下 执行 python -m ratio_similarity.app

使用流程以及data flow
1. landing page的主文件是在AdvX/src/pages/home/homeComponents/AIMatching.jsx。进来之后主要的互动功能就是 webcam，也就意味着我们用来比对的人脸的图片是实时获取的，（后续可能?作为网站本身功能的话 应该加多一个入口是允许用户上传其他的照片？但是好像打开webcam的这个步骤能够让用户更好的运用平台 小红书/抖音 吧？）
2. 我们在用拍照的时候会调用capture。（这一部分的话我们本来藏了一个demo用彩蛋是 上一位跟你匹配到同一只小狗的人的照片会显示出来，不过这部分具体要怎么玩我们当时没弄明白，所以这里就稍稍写了一半。）成功获取截图之后，我们会通过http://127.0.0.1:5001/api/compare (定义在ratio/similarity里面的pp.py)这里的接口把截图发给后端，然后就会执行我们提前定义好在 ratio_similarity/main.py 里面的pipeline流程。
3. pipeline的流程 大致是 检测人脸关键点 - 计算人脸 ratios - 算出相关ratios的距离 - 排序 - 输出前k个最相似的 - 把前k个最相似的随机选取一张，在剩下的狗狗面部照片数据集里面选取5张 - 调用kimi多模态图像模型进行 更“合理的”比对。（逻辑解释：因为点位测试的话对于图像input的要求会比较高，仅仅是简单的歪头，或者拍摄的角度都会对于data output很有影响。再加上，因为模型的问题 as mentioned before... 可能匹配出来的结果永远都是那么几只狗狗，因为这几只狗狗确实长得最像人，所以和人的“距离”就是最近的。）为了暂时解决这种一看起来就很没有脑子的outcome，我非常聪明地 多套用了一层 多模态模型用来做 分组胜者筛选机制(我也不知道术语是什么)(反正听懂掌声)。
4. 这个pipeline会返回两个数据，final_img 和 description。final_img也就是pipelinerun完之后 匹配出来长得最像的狗狗照片，description就是关于这只狗狗的描述，前端就会获取这两个数据然后display在页面里面。（demo里面我们暂时用的是kimi来自动生成对应狗狗的描述，后续的话这种信息肯定是从网上直接获取。因为sacramento的收容所里面，我记得狗狗 相关性格/身体情况/在哪发现的 这些信息记录得很详细。国内的数据源暂时还没看质量怎么样w）。
5. 这就是完整的匹配流程，其中还有几个写了一半 or 写了没用上的功能 以及非常多的可以优化/重做的模块。后续的update我会尝试把每一步都记录下来，有需要的朋友随时找我。

