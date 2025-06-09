/**
 * @file script.js
 * @description 12345热线AI应急响应系统演示页面的动态交互逻辑。
 */

// 1. 定义模拟数据
/**
 * @typedef {Object} TranscriptItem
 * @property {number} time - 时间点（秒）
 * @property {string} speaker - 说话人（市民/AI）
 * @property {string} text - 语音转文字内容
 */

/**
 * @typedef {Object} Location
 * @property {string} address - 地址
 * @property {number[]} coordinates - 坐标 [经度, 纬度]
 */

/**
 * @typedef {Object} Audio
 * @property {string} file - 音频文件名
 * @property {number} duration - 音频时长（秒）
 */

/**
 * @typedef {Object} EmergencyScenario
 * @property {string} id - 场景ID
 * @property {string} name - 场景名称
 * @property {string} type - 事件类型
 * @property {string} severity - 紧急程度
 * @property {Audio} audio - 音频信息
 * @property {TranscriptItem[]} transcript - 语音转文字内容
 * @property {Location} location - 地点信息
 * @property {number} involvedPeople - 涉及人数
 * @property {string} reporter - 报警人
 * @property {string} incidentNature - 事件性质
 * @property {string} responseFlow - 响应流程
 * @property {string[]} disposalMeasures - 处置措施清单
 * @property {{time: string, description: string}[]} timeline - 时间轴
 */

const emergencyScenarios = [
    {
        id: "scenario_001",
        name: "建筑火灾",
        type: "火灾 🚨",
        severity: "特急",
        audio: {
            file: "fire_emergency.mp3", // 实际演示中需要一个音频文件，请放置在CJ_L目录下
            duration: 45 // 假设音频时长45秒
        },
        transcript: [
            { time: 0, speaker: "市民", text: "喂，12345吗？我这里是朝阳区建国路88号，发生火灾了！" },
            { time: 5, speaker: "AI助手", text: "请您保持冷静，收到火灾报警。请问现场情况如何？" },
            { time: 12, speaker: "市民", text: "火势很大，浓烟滚滚，好像有20多个人被困在里面了，快来人啊！" },
            { time: 20, speaker: "AI助手", text: "收到，火势较大，约20人被困。请您告知具体楼层和周边环境。" },
            { time: 30, speaker: "市民", text: "是3楼，附近有加油站，很危险！" },
            { time: 35, speaker: "AI助手", text: "明白了，朝阳区建国路88号3楼，附近有加油站。AI系统正在为您匹配最优应急方案。" },
            { time: 42, speaker: "AI助手", text: "请您尽快撤离到安全区域，救援力量正在赶往。" }
        ],
        location: {
            address: "朝阳区建国路88号",
            coordinates: [116.4800, 39.9100] // 模拟坐标
        },
        involvedPeople: 25,
        reporter: "张先生 (138****1234)",
        incidentNature: "建筑火灾",
        responseFlow: "接警 → 信息核实 → 等级评估 → 资源调度 → 现场处置 → 后续跟进",
        disposalMeasures: [
            "立即派遣消防队伍",
            "通知医疗救护",
            "疏散周边人员",
            "交通管制",
            "媒体应对准备"
        ],
        timeline: [
            { time: "14:30", description: "接到报警电话" },
            { time: "14:31", description: "AI分析完成，生成应急预案" },
            { time: "14:32", description: "消防队伍出动指令下达" },
            { time: "14:35", description: "预计到达现场时间" },
            { time: "14:40", description: "医疗队伍到位" }
        ]
    },
    // 可以添加更多场景
];

/**
 * @typedef {Object} ResourceUnit
 * @property {string} id - 单元ID
 * @property {string} status - 状态
 * @property {number[]} location - 坐标 [经度, 纬度]
 * @property {number|null} eta - 预计到达时间（分钟）
 */

/**
 * @typedef {Object} EmergencyResource
 * @property {string} type - 资源类型
 * @property {number} total - 总数量
 * @property {number} available - 可用数量
 * @property {ResourceUnit[]} units - 具体单位信息
 */

const emergencyResources = [
    {
        type: "消防车",
        total: 5,
        available: 3,
        units: [
            { id: "fire_001", status: "待命", location: [116.4074, 39.9042], eta: null },
            { id: "fire_002", status: "待命", location: [116.4274, 39.9242], eta: null },
            { id: "fire_003", status: "待命", location: [116.3874, 39.8942], eta: null },
            { id: "fire_004", status: "在途", location: [116.4500, 39.9000], eta: 5 },
            { id: "fire_005", status: "在途", location: [116.4600, 39.9050], eta: 8 }
        ]
    },
    {
        type: "救护车",
        total: 3,
        available: 2,
        units: [
            { id: "ambu_001", status: "待命", location: [116.4100, 39.9100], eta: null },
            { id: "ambu_002", status: "待命", location: [116.4300, 39.9300], eta: null },
            { id: "ambu_003", status: "在途", location: [116.4400, 39.9150], eta: 7 }
        ]
    },
    {
        type: "消防人员",
        total: 50,
        available: 35,
        units: []
    },
    {
        type: "医护人员",
        total: 20,
        available: 12,
        units: []
    },
    {
        type: "交警",
        total: 10,
        available: 6,
        units: []
    }
];

// 2. 获取DOM元素
const startDemoBtn = document.getElementById('start-demo');
const resetDemoBtn = document.getElementById('reset-demo');
const demoProgress = document.getElementById('demo-progress');
const currentStatusSpan = document.getElementById('current-status');

const callerNumberSpan = document.getElementById('caller-number');
const callTimeSpan = document.getElementById('call-time');
const callRegionSpan = document.getElementById('call-region');
const emergencyLight = document.getElementById('emergency-light');
const answerCallBtn = document.getElementById('answer-call');
const hangupCallBtn = document.getElementById('hangup-call');
const callDurationSpan = document.getElementById('call-duration');
const voiceTranscriptDiv = document.getElementById('voice-transcript');

const eventTypeRecognitionDiv = document.getElementById('event-type-recognition');
const severityAssessmentDiv = document.getElementById('severity-assessment');
const keyInfoExtractionUl = document.getElementById('key-info-extraction');

const responseFlowDiv = document.getElementById('response-flow');
const disposalMeasuresUl = document.getElementById('disposal-measures');
const timelineDiv = document.getElementById('timeline');

const mapDisplayDiv = document.getElementById('map-display');
const resourceStatusListUl = document.getElementById('resource-status-list');

// 3. 初始化状态
let demoInterval = null;
let currentScenarioIndex = 0;
let callTimer = 0;
let transcriptIndex = 0;
let currentDemoTime = 0; // 当前演示时间，单位：秒

/**
 * @description 重置所有UI元素到初始状态。
 */
function resetUI() {
    clearInterval(demoInterval);
    callTimer = 0;
    transcriptIndex = 0;
    currentDemoTime = 0;

    demoProgress.style.width = '0%';
    currentStatusSpan.textContent = '等待来电...';

    callerNumberSpan.textContent = '来电号码: 138****1234';
    callTimeSpan.textContent = '时间: --:--:--';
    callRegionSpan.textContent = '地区: --';
    emergencyLight.className = 'light';
    answerCallBtn.disabled = false;
    hangupCallBtn.disabled = true;
    callDurationSpan.textContent = '00:00';
    voiceTranscriptDiv.innerHTML = '<p>[市民]: ...</p><p>[AI助手]: ...</p>';
    voiceTranscriptDiv.scrollTop = 0;

    eventTypeRecognitionDiv.className = 'recognition-box';
    eventTypeRecognitionDiv.innerHTML = '<span class="placeholder">待识别</span>';
    severityAssessmentDiv.className = 'assessment-box';
    severityAssessmentDiv.innerHTML = '<span class="placeholder">待评估</span>';
    keyInfoExtractionUl.innerHTML = `
        <li class="placeholder">📍 事发地点: 待提取</li>
        <li class="placeholder">⏰ 事发时间: 待提取</li>
        <li class="placeholder">👥 涉及人数: 待提取</li>
        <li class="placeholder">🔥 事件性质: 待提取</li>
        <li class="placeholder">📞 报警人: 待提取</li>
    `;

    responseFlowDiv.className = 'flow-chart';
    responseFlowDiv.innerHTML = '<span class="placeholder">等待生成流程图...</span>';
    disposalMeasuresUl.innerHTML = '<li class="placeholder">等待生成处置措施...</li>';
    timelineDiv.innerHTML = `
        <div class="timeline-item placeholder">
            <span class="time">--:--</span>
            <span class="description">等待生成时间轴...</span>
        </div>
    `;

    mapDisplayDiv.innerHTML = '<span class="placeholder">加载地图中...</span>';
    resourceStatusListUl.innerHTML = `
        <li class="placeholder">🚒 消防车辆: 待调度</li>
        <li class="placeholder">🚑 救护车: 待调度</li>
        <li class="placeholder">👨‍🚒 消防人员: 待调度</li>
        <li class="placeholder">👨‍⚕️ 医护人员: 待调度</li>
        <li class="placeholder">🚧 交警: 待调度</li>
    `;

    startDemoBtn.disabled = false;
    resetDemoBtn.disabled = true;
}

/**
 * @description 更新通话时长显示。
 */
function updateCallDuration() {
    callTimer++;
    const minutes = Math.floor(callTimer / 60).toString().padStart(2, '0');
    const seconds = (callTimer % 60).toString().padStart(2, '0');
    callDurationSpan.textContent = `${minutes}:${seconds}`;
}

/**
 * @description 更新语音转文字显示。
 * @param {TranscriptItem[]} transcript - 语音转文字数组。
 */
function updateTranscript(transcript) {
    if (transcriptIndex < transcript.length && currentDemoTime >= transcript[transcriptIndex].time) {
        const item = transcript[transcriptIndex];
        const p = document.createElement('p');
        p.textContent = `[${item.speaker}]: ${item.text}`;
        voiceTranscriptDiv.appendChild(p);
        voiceTranscriptDiv.scrollTop = voiceTranscriptDiv.scrollHeight;
        transcriptIndex++;
    }
}

/**
 * @description 更新AI分析区域。
 * @param {EmergencyScenario} scenario - 当前应急场景数据。
 */
function updateAIAnalysis(scenario) {
    // 事件类型识别
    eventTypeRecognitionDiv.classList.add('identified');
    eventTypeRecognitionDiv.innerHTML = `<span>${scenario.type}</span>`;

    // 紧急程度评估
    severityAssessmentDiv.classList.add('evaluated');
    let severityClass = '';
    if (scenario.severity === '特急') {
        severityClass = 'critical';
        emergencyLight.classList.add('red');
    } else if (scenario.severity === '紧急') {
        severityClass = 'urgent';
    } else {
        severityClass = 'normal';
    }
    severityAssessmentDiv.classList.add(severityClass);
    severityAssessmentDiv.innerHTML = `<span>${scenario.severity}</span>`;

    // 关键信息提取
    keyInfoExtractionUl.innerHTML = `
        <li class="extracted">📍 事发地点: ${scenario.location.address}</li>
        <li class="extracted">⏰ 事发时间: ${new Date().toLocaleTimeString()}</li>
        <li class="extracted">👥 涉及人数: 约${scenario.involvedPeople}人</li>
        <li class="extracted">🔥 事件性质: ${scenario.incidentNature}</li>
        <li class="extracted">📞 报警人: ${scenario.reporter}</li>
    `;
}

/**
 * @description 更新应急响应方案区域。
 * @param {EmergencyScenario} scenario - 当前应急场景数据。
 */
function updateResponsePlan(scenario) {
    // 响应流程图
    responseFlowDiv.classList.add('generated');
    responseFlowDiv.innerHTML = `<span>${scenario.responseFlow}</span>`;

    // 处置措施清单
    disposalMeasuresUl.innerHTML = '';
    scenario.disposalMeasures.forEach(measure => {
        const li = document.createElement('li');
        li.textContent = `✅ ${measure}`;
        li.classList.add('completed'); // 模拟已完成
        disposalMeasuresUl.appendChild(li);
    });

    // 时间轴展示
    timelineDiv.innerHTML = '';
    scenario.timeline.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('timeline-item');
        if (index === 0) div.classList.add('active'); // 模拟当前进行
        div.innerHTML = `
            <span class="time">${item.time}</span>
            <span class="description">${item.description}</span>
        `;
        timelineDiv.appendChild(div);
    });
}

/**
 * @description 更新资源调度可视化区域。
 * @param {EmergencyResource[]} resources - 应急资源数据。
 */
function updateResourceDispatch(resources) {
    // 模拟地图加载完成
    mapDisplayDiv.innerHTML = '<span>地图加载完成，显示事发地点和资源</span>';
    mapDisplayDiv.style.backgroundColor = '#f0f5ff';

    // 资源状态面板
    resourceStatusListUl.innerHTML = '';
    resources.forEach(resource => {
        let statusText = '';
        if (resource.type.includes('车')) {
            const inTransit = resource.units.filter(unit => unit.status === '在途').length;
            const standby = resource.units.filter(unit => unit.status === '待命').length;
            statusText = `🚒 ${resource.type}: ${resource.total}辆 (${inTransit}辆在途, ${standby}辆待命)`;
        } else {
            statusText = `👨‍🚒 ${resource.type}: ${resource.total}人`;
        }

        const li = document.createElement('li');
        li.textContent = statusText;
        li.classList.add('dispatched');
        resourceStatusListUl.appendChild(li);
    });
}

/**
 * @description 模拟音频播放。
 * @param {string} audioFile - 音频文件路径。
 */
function playAudio(audioFile) {
    // 在实际部署中，您需要将fire_emergency.mp3文件放置在CJ_L目录下
    const audio = new Audio(audioFile);
    audio.play().catch(e => console.error("音频播放失败 (请确保fire_emergency.mp3文件存在):", e));
}

/**
 * @description 开始演示。
 */
function startDemo() {
    resetUI(); // 确保开始前UI是重置的
    startDemoBtn.disabled = true;
    resetDemoBtn.disabled = false;

    const currentScenario = emergencyScenarios[currentScenarioIndex];
    const totalDemoDuration = currentScenario.audio.duration + 45; // 音频时长 + AI分析+方案生成+调度时间 (45s是估算值)

    // 模拟来电显示
    callerNumberSpan.textContent = '来电号码: 138****1234';
    callTimeSpan.textContent = new Date().toLocaleTimeString();
    callRegionSpan.textContent = '地区: 朝阳区';

    currentStatusSpan.textContent = '模拟来电铃声响起...';

    // 模拟电话接听
    setTimeout(() => {
        answerCallBtn.disabled = true;
        hangupCallBtn.disabled = false;
        currentStatusSpan.textContent = 'AI助手已接听，开始语音识别...';
        playAudio(currentScenario.audio.file); // 播放模拟音频

        // 第一阶段: 来电接听 & 语音播放 (0-音频时长)
        demoInterval = setInterval(() => {
            currentDemoTime++;
            updateCallDuration();
            updateTranscript(currentScenario.transcript);

            const progress = (currentDemoTime / totalDemoDuration) * 100;
            demoProgress.style.width = `${progress}%`;

            if (currentDemoTime === Math.floor(currentScenario.audio.duration / 2)) {
                currentStatusSpan.textContent = 'AI正在智能分析中...';
            }

            // 第二阶段: AI分析 (音频播放结束后开始，或在特定时间点)
            if (currentDemoTime === currentScenario.audio.duration) {
                currentStatusSpan.textContent = 'AI分析完成，生成应急预案...';
                updateAIAnalysis(currentScenario);
            }

            // 第三阶段: 方案生成 (AI分析后约15秒)
            if (currentDemoTime === currentScenario.audio.duration + 15) {
                currentStatusSpan.textContent = '应急预案已生成，开始资源调度...';
                updateResponsePlan(currentScenario);
            }

            // 第四阶段: 资源调度 (方案生成后约15秒)
            if (currentDemoTime === currentScenario.audio.duration + 30) {
                currentStatusSpan.textContent = '资源调度中，地图可视化更新...';
                updateResourceDispatch(emergencyResources);
            }

            if (currentDemoTime >= totalDemoDuration) {
                clearInterval(demoInterval);
                currentStatusSpan.textContent = '演示完成！';
                hangupCallBtn.disabled = true;
                startDemoBtn.disabled = false; // 演示完成后允许再次开始
            }
        }, 1000);
    }, 2000); // 2秒后自动接听
}

// 4. 事件监听
startDemoBtn.addEventListener('click', startDemo);
resetDemoBtn.addEventListener('click', resetUI);

// 初始加载时重置UI
document.addEventListener('DOMContentLoaded', resetUI); 