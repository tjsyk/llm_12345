
这个场景将重点展示AI如何像一位“随身教练”一样，**在通话过程中**对坐席进行实时监控、提醒和评估，并在通话结束后秒级生成质检报告。

---

### **演示场景：AI“质检教练”与坐席小王的实时互动**

**场景目标：** 展示实时智能质检系统如何从事中干预、事后复盘两个维度，动态提升服务质量，并为坐席提供即时、精准的反馈。

**屏幕布局：**
*   **主屏幕：** 坐席小王的工作台界面，包含通话控制、对话转录等。
*   **右下角悬浮窗：** 一个半透明的**“AI实时质检”**窗口，通常是绿色的，表示一切正常。
*   **班长端（可分屏展示）：** 一个管理驾驶舱，能看到所有坐席的实时质检状态。

**【场景开始】**

**1. 开场白合规性实时提醒**

*   **坐席小王 (接听电话)**: “喂，您好。”
*   **AI实时质检窗口 (瞬间变化)**:
    *   窗口边框由**绿色**变为**橙色**闪烁一下。
    *   窗口内出现一条文字提示：`💡 提醒：缺少标准开场白（问候+报号）。`
*   **坐席小王 (立刻意识到并纠正)**: “哦，不好意思。您好，这里是12345热线，工号008号小王为您服务。请问有什么可以帮您？”

    *   **演示要点 (屏幕高亮标注)**:
        *   **即时纠偏**: AI在违规发生的1-2秒内就给出了提醒，坐席得以在不影响市民体验的情况下迅速改正。这体现了**事中干预**的价值。

**2. 不当用语实时监测与建议**

*   **市民**: “我的医保卡好像出问题了，上周去药店买药，怎么刷都刷不了！”
*   **坐席小王**: “医保卡刷不了啊… **你必须**带上身份证和医保卡，去最近的社保中心查一下。”
*   **AI实时质检窗口 (再次变化)**:
    *   窗口内出现一条新提示：`⚠️ 不当用语：“你必须…”。建议替换为：“我们建议您…”或“您需要…”。`
*   **对话转录区 (同步变化)**: 在小王的对话气泡中，“你必须”三个字被**红色波浪线**标记出来，鼠标悬停时会显示替代建议。

    *   **演示要点**:
        *   **微观干预**: 质检深入到具体的用词层面，帮助坐席养成更专业、更柔和的沟通习惯。
        *   **上下文感知**: AI知道“必须”这个词在服务场景中过于生硬，体现了其对服务规范的理解。

**3. 声学特征与情绪实时分析**

*   **市民 (听起来有些迷茫)**: “社保中心？我不知道在哪啊，我这附近有吗？我年纪大了，跑一趟不方便。”
*   **坐席小王 (可能因为问题简单，回答得有些快)**: “您在哪个区我帮您查一下最近的地址和上班时间很快的。” (语速明显加快)
*   **AI实时质检窗口 (实时更新声学分析)**:
    *   `📈 坐席语速：180字/分钟 (偏快)`
    *   `市民情绪：困惑 😕`
    *   窗口内弹出提示：`💨 语速稍快，建议放慢，并耐心解释。`

    *   **演示要点**:
        *   **超越文本**: AI质检不仅分析“说了什么”，还分析“怎么说”，包括语速、语调等声学特征。
        *   **双向情绪追踪**: 同时关注坐席和市民的情绪状态，为坐席提供调整沟通策略的依据。

**4. 优秀服务行为实时标记**

*   **坐席小王 (看到提示，立刻调整)**: “好的阿姨，您别着急。我放慢点说。您只要告诉我您大概在哪个街道，我就能帮您找到最近、最方便的社保中心，还会告诉您他们的工作时间，确保您不用白跑一趟。”
*   **AI实时质检窗口 (变为绿色)**:
    *   窗口内出现一条**绿色**的表扬提示：`👍 优秀行为：主动安抚，并提供了清晰、增值的服务承诺。`
*   **班长端屏幕 (同步变化)**: 班长的管理驾驶舱里，坐席小王的头像旁边，短暂地亮起一个**金色的“👍”图标**。

    *   **演示要点**:
        *   **正向激励**: 实时质检不仅“找茬”，也“点赞”，能即时强化坐席的优秀行为。
        *   **案例发现**: 这个被标记的“优秀服务片段”可以被系统自动存入案例库，用于后续培训。

**5. 通话结束与质检报告秒级生成**

*   **(通话正常结束)**
*   **坐席小王 (点击“结束通话”)**
*   **屏幕显示**: 在小王的工作台界面，一个**“本次通话质检报告”**的按钮立刻变为可点击状态。
*   **交互操作**: 点击该按钮。
*   **屏幕切换**: 弹出一个完整的质检报告页面。
    *   **报告内容**:
        *   **综合得分**: `88分 (良好)`
        *   **得分详情 (图表)**: 展示在`流程规范`、`沟通技巧`等维度的具体得分。
        *   **问题事件时间轴**:
            *   `[00:05] 🔴 开场白不合规`
            *   `[01:15] 🟡 不当用语：“你必须”`
            *   `[01:45] 🟡 语速过快`
        *   **亮点表现**:
            *   `[02:10] 🟢 主动安抚并提供增值服务`
        *   **AI综合点评**: `本次服务整体流畅，业务解答准确。主要不足在于开场流程和部分服务用语的规范性，建议加强《标准服务话术》的学习。`

    *   **演示要点**:
        *   **即时复盘**: 坐席可以在记忆最清晰的时候，立刻复盘自己的表现，学习效果最佳。
        *   **效率提升**: 省去了传统质检员听录音、打分、写评语的漫长过程，实现了质检工作的完全自动化和实时化。

**【场景结束】**