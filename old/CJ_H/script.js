/**
 * @file script.js
 * @description 12345热线AI质检Demo演示页面JavaScript逻辑。
 */

// 模拟数据
const mockCallData = {
    callerNumber: "138****1234",
    callTime: "2024-01-15 14:30:25",
    callType: "投诉咨询",
    agentInfo: {
        id: "CS001",
        name: "张小明"
    },
    duration: 265 // 秒
};

const mockQualityScore = {
    overall: 85,
    attitude: { score: 90, label: "服务态度" },
    professional: { score: 85, label: "专业能力" },
    communication: { score: 80, label: "沟通效果" },
    procedure: { score: 88, label: "流程规范" }
};

const mockIssues = [
    { id: "issue_001", type: "error", message: "未按规范开场白", timestamp: "00:15", suggestion: "坐席应在开场白中明确告知客户热线名称和工号。" },
    { id: "issue_002", type: "warning", message: "语速过快", timestamp: "02:30", suggestion: "建议放慢语速，确保客户能够清晰理解。" },
    { id: "issue_003", type: "success", message: "积极回应市民诉求", timestamp: "04:20", suggestion: "坐席积极倾听，并对市民的诉求给予了积极回应。" },
    { id: "issue_004", type: "error", message: "未确认市民联系方式", timestamp: "03:50", suggestion: "在结束通话前，应再次确认市民的联系方式以便后续回访。" }
];

const mockNormCheck = [
    { item: "标准开场白", status: "failed" },
    { item: "礼貌用语使用", status: "completed" },
    { item: "问题确认环节", status: "completed" },
    { item: "处理时限告知", status: "pending" },
    { item: "回访安排确认", status: "failed" }
];

const mockDialogueScript = [
    { time: 5, speaker: "agent", text: "您好，这里是12345政务服务热线" },
    { time: 8, speaker: "citizen", text: "你好，我要投诉我们小区的物业问题" },
    { time: 15, speaker: "agent", text: "好的，请您详细说明一下具体情况" },
    { time: 20, speaker: "citizen", text: "我们小区垃圾清理不及时，臭味很大" },
    { time: 30, speaker: "agent", text: "我理解您的困扰，请提供您的详细地址" },
    { time: 45, speaker: "citizen", text: "XX小区XX栋XX单元" },
    { time: 60, speaker: "agent", text: "好的，我已记录。我们尽快转办相关部门处理。" },
    { time: 70, speaker: "citizen", text: "大概多久能有回复？" },
    { time: 80, speaker: "agent", "text": "通常情况下，我们会在3个工作日内给您回复，请您保持电话畅通。" },
    { time: 90, speaker: "citizen", text: "好的，谢谢。" },
    { time: 95, speaker: "agent", text: "不客气，请问还有其他需要帮助的吗？" },
    { time: 100, speaker: "citizen", text: "没有了。" },
    { time: 105, speaker: "agent", text: "好的，再见。" },
    { time: 108, speaker: "citizen", text: "再见。" },
    // 增加模拟对话内容以延长通话时间
    { time: 115, speaker: "agent", text: "您是希望我们立即派人处理，还是有其他期望呢？" },
    { time: 125, speaker: "citizen", text: "希望尽快派人过来，垃圾堆放太久了，影响环境。" },
    { time: 140, speaker: "agent", text: "好的，我们已经记录了您的情况，预计会在今天内安排工作人员到场清理。" },
    { time: 150, speaker: "citizen", text: "那太好了，谢谢你们。" },
    { time: 160, speaker: "agent", text: "这是我们应该做的。请问您的小区具体是哪一期，或有无更详细的标识，以便工作人员准确找到位置？" },
    { time: 175, speaker: "citizen", text: "是XX期XX栋，旁边有个小花园。" },
    { time: 190, speaker: "agent", text: "明白了。另外，关于您提到的异味问题，我们也会一并向物业反馈，争取从源头解决。" },
    { time: 205, speaker: "citizen", text: "好的，那就麻烦你们了。" },
    { time: 220, speaker: "agent", text: "不客气。我们会持续跟进此事的处理进度，您也可以在APP上查询工单状态。" },
    { time: 230, speaker: "citizen", text: "好的，谢谢提醒。" },
    { time: 240, speaker: "agent", text: "请问您还有其他问题需要咨询吗？" },
    { time: 250, speaker: "citizen", text: "暂时没有了。" },
    { time: 260, speaker: "agent", text: "好的，很高兴为您服务，再见。" },
    { time: 265, speaker: "citizen", text: "再见。" }
];

const mockReportOverview = {
    callDuration: "8分32秒", // 实际应根据mockCallData.duration计算
    finalScore: 85,
    result: "已转办相关部门",
    satisfaction: "满意",
    issueCount: {
        total: 5,
        resolved: 3,
        pending: 2
    }
};

const mockDetailedReport = {
    excellentPerformance: [
        "坐席耐心倾听市民诉求，并准确记录了问题关键信息。",
        "在处理市民投诉时，坐席表现出良好的同理心和专业素养。",
        "积极回应市民关切，并及时告知了处理流程和预期。"
    ],
    areasForImprovement: [
        "开场白部分未能完全遵循标准规范，建议加强练习。",
        "在解释处理时限时语速略快，可能影响市民理解。",
        "未主动向市民确认是否还有其他疑问，建议在通话结束前进行礼貌询问。"
    ],
    trainingSuggestions: [
        "建议参加标准服务流程和话术培训，提升开场白规范性。",
        "进行语速和语气控制训练，确保沟通效果。",
        "加强客户回访意识培训，提升服务闭环能力。"
    ]
};

// 获取DOM元素
const callerInfoCard = document.getElementById('callerInfoCard');
const waveformCanvas = document.getElementById('waveformCanvas');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeSpan = document.getElementById('currentTime');
const totalTimeSpan = document.getElementById('totalTime');
const volumeControl = document.getElementById('volumeControl');
const playbackSpeedSelect = document.getElementById('playbackSpeed');
const dialogueContent = document.getElementById('dialogueContent');
const mainScoreDiv = document.getElementById('mainScore');
const subScoresDiv = document.getElementById('subScores');
const issueList = document.getElementById('issueList');
const normCheckList = document.getElementById('normCheckList');
const emotionChartCanvas = document.getElementById('emotionChartCanvas');
const reportOverviewDiv = document.getElementById('reportOverview');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const detailedAnalysisReportDiv = document.getElementById('detailedAnalysisReport');

let currentCallTime = 0; // 当前通话时间（秒）
let callInterval = null; // 定时器句柄
let isPlaying = false;

/**
 * 根据分数获取对应的颜色类名
 * @param {number} score - 评分数值
 * @returns {string} 对应的CSS类名
 */
function getScoreColorClass(score) {
    if (score >= 90) return 'score-90-100';
    if (score >= 80) return 'score-80-89';
    if (score >= 70) return 'score-70-79';
    return 'score-lt-70';
}

/**
 * 格式化时间为MM:SS
 * @param {number} totalSeconds - 总秒数
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * 初始化页面内容
 */
function initializePage() {
    // 初始化来电信息卡片
    callerInfoCard.innerHTML = `
        <p><strong>来电号码：</strong>${mockCallData.callerNumber}</p>
        <p><strong>来电时间：</strong>${mockCallData.callTime}</p>
        <p><strong>来电类型：</strong>${mockCallData.callType}</p>
        <p><strong>坐席信息：</strong>${mockCallData.agentInfo.name} (${mockCallData.agentInfo.id})</p>
    `;

    // 初始化通话总时长
    totalTimeSpan.textContent = formatTime(mockCallData.duration);
    progressBar.max = mockCallData.duration;

    // 初始化实时评分
    mainScoreDiv.textContent = mockQualityScore.overall;
    mainScoreDiv.className = `main-score ${getScoreColorClass(mockQualityScore.overall)}`;
    for (const key in mockQualityScore) {
        if (key !== 'overall') {
            const item = mockQualityScore[key];
            const div = document.createElement('div');
            div.innerHTML = `<span>${item.label}</span><span class="${getScoreColorClass(item.score)}">${item.score}</span>`;
            subScoresDiv.appendChild(div);
        }
    }

    // 初始化问题识别
    updateIssueList();

    // 初始化规范检查
    updateNormCheckList();

    // 初始化对话内容，在页面加载时就显示所有对话
    mockDialogueScript.forEach(msg => {
        const p = document.createElement('p');
        p.className = `message-bubble message-${msg.speaker}`;
        p.textContent = `[${formatTime(msg.time)}] ${msg.speaker === 'agent' ? '坐席' : '市民'}：${msg.text}`;
        dialogueContent.appendChild(p);
    });
    dialogueContent.scrollTop = dialogueContent.scrollHeight; // 自动滚动到底部

    // 初始化报告概览
    reportOverviewDiv.innerHTML = `
        <p><strong>通话时长：</strong>${formatTime(mockCallData.duration)}</p>
        <p><strong>最终评分：</strong><span class="${getScoreColorClass(mockQualityScore.overall)}">${mockQualityScore.overall}</span></p>
        <p><strong>处理结果：</strong>${mockReportOverview.result}</p>
        <p><strong>市民满意度：</strong>${mockReportOverview.satisfaction}</p>
        <p><strong>问题统计：</strong>总计 ${mockReportOverview.issueCount.total} 条，已解决 ${mockReportOverview.issueCount.resolved} 条，待处理 ${mockReportOverview.issueCount.pending} 条</p>
    `;

    // 填充详细分析报告
    detailedAnalysisReportDiv.innerHTML = `
        <h3>详细分析报告（简化）</h3>
        <h4>优秀表现</h4>
        <ul>
            ${mockDetailedReport.excellentPerformance.map(item => `<li>${item}</li>`).join('')}
        </ul>
        <h4>需要改进</h4>
        <ul>
            ${mockDetailedReport.areasForImprovement.map(item => `<li>${item}</li>`).join('')}
        </ul>
        <h4>培训建议</h4>
        <ul>
            ${mockDetailedReport.trainingSuggestions.map(item => `<li>${item}</li>`).join('')}
        </ul>
        <button id="exportPdfBtn">导出PDF（功能简化）</button>
    `;
    // 重新获取exportPdfBtn元素，因为其父元素innerHTML被更新了
    document.getElementById('exportPdfBtn').addEventListener('click', () => {
        alert('生成PDF报告功能（简化）：此为演示功能，实际需后端支持或前端库实现。');
    });

    // 绘制简化的波形图和情绪图
    drawSimplifiedWaveform();
    drawSimplifiedEmotionChart();
}

/**
 * 更新问题识别列表
 */
function updateIssueList() {
    issueList.innerHTML = '';
    mockIssues.forEach(issue => {
        const li = document.createElement('li');
        li.className = `issue-${issue.type}`;
        li.innerHTML = `<strong>${issue.type === 'error' ? '🔴' : issue.type === 'warning' ? '🟡' : '🟢'} ${issue.message}</strong> - ${formatTime(issue.timestamp.split(':')[0] * 60 + parseInt(issue.timestamp.split(':')[1]))} <span class="suggestion-tooltip" title="${issue.suggestion}">ⓘ</span>`;
        issueList.appendChild(li);
    });
}

/**
 * 更新规范检查列表
 */
function updateNormCheckList() {
    normCheckList.innerHTML = '';
    mockNormCheck.forEach(item => {
        const li = document.createElement('li');
        let statusIcon = '';
        if (item.status === 'completed') statusIcon = '✅';
        else if (item.status === 'pending') statusIcon = '⏳';
        else if (item.status === 'failed') statusIcon = '❌';
        li.className = `status-${item.status}`;
        li.innerHTML = `${statusIcon} ${item.item}`;
        normCheckList.appendChild(li);
    });
}

/**
 * 绘制简化的音频波形图（仅示意）
 */
function drawSimplifiedWaveform() {
    const ctx = waveformCanvas.getContext('2d');
    const width = waveformCanvas.width;
    const height = waveformCanvas.height;
    ctx.clearRect(0, 0, width, height);

    // 绘制背景网格
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < height; i += 10) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }

    // 模拟波形数据
    ctx.beginPath();
    ctx.strokeStyle = 'blue'; // 坐席
    ctx.lineWidth = 1.5;
    ctx.moveTo(0, height / 2);
    for (let i = 0; i < width; i++) {
        const y = height / 2 + Math.sin(i * 0.1 + currentCallTime * 0.5) * (height / 4 * (0.5 + Math.random() * 0.5));
        ctx.lineTo(i, y);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'green'; // 市民
    ctx.lineWidth = 1.5;
    ctx.moveTo(0, height / 2);
    for (let i = 0; i < width; i++) {
        const y = height / 2 + Math.cos(i * 0.08 + currentCallTime * 0.6) * (height / 4 * (0.5 + Math.random() * 0.5));
        ctx.lineTo(i, y);
    }
    ctx.stroke();

    // 绘制播放进度线
    const progressX = (currentCallTime / mockCallData.duration) * width;
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.moveTo(progressX, 0);
    ctx.lineTo(progressX, height);
    ctx.stroke();
}

/**
 * 绘制简化的情绪分析图（仅示意）
 */
function drawSimplifiedEmotionChart() {
    const ctx = emotionChartCanvas.getContext('2d');
    const width = emotionChartCanvas.width;
    const height = emotionChartCanvas.height;
    ctx.clearRect(0, 0, width, height);

    // 绘制背景网格
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }

    // 模拟情绪数据点
    const citizenEmotionPoints = [
        { time: 0, intensity: 0.8 }, { time: 30, intensity: 0.6 }, { time: 60, intensity: 0.4 },
        { time: 90, intensity: 0.3 }, { time: 120, intensity: 0.2 }, { time: 150, intensity: 0.3 },
        { time: 180, intensity: 0.5 }, { time: 210, intensity: 0.7 }, { time: mockCallData.duration, intensity: 0.9 }
    ];
    const agentEmotionPoints = [
        { time: 0, intensity: 0.9 }, { time: 30, intensity: 0.8 }, { time: 60, intensity: 0.85 },
        { time: 90, intensity: 0.9 }, { time: 120, intensity: 0.8 }, { time: 150, intensity: 0.75 },
        { time: 180, intensity: 0.8 }, { time: 210, intensity: 0.85 }, { time: mockCallData.duration, intensity: 0.95 }
    ];

    // 绘制市民情绪曲线 (红色)
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.moveTo(0, height - citizenEmotionPoints[0].intensity * height);
    citizenEmotionPoints.forEach(p => {
        const x = (p.time / mockCallData.duration) * width;
        const y = height - p.intensity * height;
        ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 绘制坐席情绪曲线 (蓝色)
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.moveTo(0, height - agentEmotionPoints[0].intensity * height);
    agentEmotionPoints.forEach(p => {
        const x = (p.time / mockCallData.duration) * width;
        const y = height - p.intensity * height;
        ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 绘制播放进度线
    const progressX = (currentCallTime / mockCallData.duration) * width;
    ctx.beginPath();
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.moveTo(progressX, 0);
    ctx.lineTo(progressX, height);
    ctx.stroke();
    ctx.setLineDash([]); // 重置虚线
}

/**
 * 更新通话时间和进度条
 */
function updateCallProgress() {
    if (currentCallTime < mockCallData.duration) {
        currentCallTime += 1;
        currentTimeSpan.textContent = formatTime(currentCallTime);
        progressBar.value = currentCallTime;
        drawSimplifiedWaveform(); // 更新波形图播放线
        drawSimplifiedEmotionChart(); // 更新情绪图播放线
        updateDialogueContent();
        updateRealtimeScore(); // 模拟实时评分变化
        updateRealtimeIssues(); // 模拟实时问题识别
        updateRealtimeNormCheck(); // 模拟实时规范检查
    } else {
        clearInterval(callInterval);
        isPlaying = false;
        playPauseBtn.textContent = '重播';
        currentCallTime = 0; // 重置时间准备重播
    }
}

/**
 * 根据当前时间更新对话内容
 * @param {number} time - 当前通话时间（秒）
 */
function updateDialogueContent() {
    dialogueContent.innerHTML = ''; // 清空所有现有内容
    mockDialogueScript.forEach(msg => {
        if (msg.time <= currentCallTime) {
            const p = document.createElement('p');
            p.className = `message-bubble message-${msg.speaker}`;
            p.textContent = `[${formatTime(msg.time)}] ${msg.speaker === 'agent' ? '坐席' : '市民'}：${msg.text}`;
            dialogueContent.appendChild(p);
        }
    });
    dialogueContent.scrollTop = dialogueContent.scrollHeight; // 自动滚动到底部
}

/**
 * 模拟实时评分变化（简化）
 */
function updateRealtimeScore() {
    // 简单模拟分数变化，每隔一段时间随机增减
    if (currentCallTime % 10 === 0 && currentCallTime > 0) {
        const newOverallScore = Math.min(100, Math.max(60, mockQualityScore.overall + Math.floor(Math.random() * 5) - 2));
        mockQualityScore.overall = newOverallScore;
        mainScoreDiv.textContent = newOverallScore;
        mainScoreDiv.className = `main-score ${getScoreColorClass(newOverallScore)}`;

        // 模拟分项评分变化
        for (const key in mockQualityScore) {
            if (key !== 'overall') {
                const item = mockQualityScore[key];
                const newScore = Math.min(100, Math.max(60, item.score + Math.floor(Math.random() * 3) - 1));
                item.score = newScore;
                const span = subScoresDiv.querySelector(`span:nth-child(2).${getScoreColorClass(item.score)}`);
                if (span) {
                    span.textContent = newScore;
                    span.className = getScoreColorClass(newScore);
                }
            }
        }
    }
}

/**
 * 模拟实时问题识别（简化）
 */
function updateRealtimeIssues() {
    // 假设在特定时间点出现新问题
    const issuesAtTime = mockIssues.filter(issue => {
        const [min, sec] = issue.timestamp.split(':').map(Number);
        return min * 60 + sec === currentCallTime;
    });

    issuesAtTime.forEach(issue => {
        const li = document.createElement('li');
        li.className = `issue-${issue.type} issue-new`; // 添加新问题样式用于闪烁
        li.innerHTML = `<strong>${issue.type === 'error' ? '🔴' : issue.type === 'warning' ? '🟡' : '🟢'} ${issue.message}</strong> - ${formatTime(issue.timestamp.split(':')[0] * 60 + parseInt(issue.timestamp.split(':')[1]))} <span class="suggestion-tooltip" title="${issue.suggestion}">ⓘ</span>`;
        issueList.prepend(li); // 新问题放在最前面

        // 模拟闪烁效果，然后移除class
        setTimeout(() => {
            li.classList.remove('issue-new');
        }, 2000);

        // 列表最多显示5条
        while (issueList.children.length > 5) {
            issueList.removeChild(issueList.lastChild);
        }
    });
}

/**
 * 模拟实时规范检查更新（简化）
 */
function updateRealtimeNormCheck() {
    // 假设在特定时间点更新规范检查状态
    if (currentCallTime === 5) {
        const item = mockNormCheck.find(i => i.item === "标准开场白");
        if (item) item.status = "failed";
        updateNormCheckList();
    } else if (currentCallTime === 30) {
        const item = mockNormCheck.find(i => i.item === "问题确认环节");
        if (item) item.status = "completed";
        updateNormCheckList();
    } else if (currentCallTime === 80) {
        const item = mockNormCheck.find(i => i.item === "处理时限告知");
        if (item) item.status = "failed";
        updateNormCheckList();
    }
}

// 事件监听器
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        clearInterval(callInterval);
        playPauseBtn.textContent = '播放';
    } else {
        if (currentCallTime >= mockCallData.duration) {
            currentCallTime = 0; // 如果是重播，则重置时间
            dialogueContent.innerHTML = ''; // 清空对话内容
        }
        callInterval = setInterval(updateCallProgress, 1000 / parseFloat(playbackSpeedSelect.value)); // 根据倍速调整间隔
        playPauseBtn.textContent = '暂停';
    }
    isPlaying = !isPlaying;
});

progressBar.addEventListener('input', (event) => {
    currentCallTime = parseInt(event.target.value);
    currentTimeSpan.textContent = formatTime(currentCallTime);
    // 立即更新到拖拽的时间点
    dialogueContent.innerHTML = ''; // 清空对话内容
    mockDialogueScript.forEach(msg => {
        if (msg.time <= currentCallTime) {
            const p = document.createElement('p');
            p.className = `message-bubble message-${msg.speaker}`;
            p.textContent = `[${formatTime(msg.time)}] ${msg.speaker === 'agent' ? '坐席' : '市民'}：${msg.text}`;
            dialogueContent.appendChild(p);
        }
    });
    dialogueContent.scrollTop = dialogueContent.scrollHeight; // 自动滚动到底部

    drawSimplifiedWaveform();
    drawSimplifiedEmotionChart();
    // 模拟实时数据根据拖拽时间点更新
    updateRealtimeScore();
    updateRealtimeIssues();
    updateRealtimeNormCheck();
});

volumeControl.addEventListener('input', (event) => {
    // 模拟音量控制，实际需要AudioContext或audio标签
    console.log('音量设置为：', event.target.value);
});

playbackSpeedSelect.addEventListener('change', (event) => {
    if (isPlaying) {
        clearInterval(callInterval);
        callInterval = setInterval(updateCallProgress, 1000 / parseFloat(event.target.value));
    }
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializePage); 