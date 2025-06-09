/**
 * @fileoverview Demo page script for 12345 Hotline AI Assistant.
 */

// DOM Elements
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const volumeSlider = document.getElementById('volume-slider');
const callDurationSpan = document.getElementById('call-duration');
const callStatusSpan = document.getElementById('call-status');
const scenarioList = document.querySelectorAll('.scenario-selection li');
const transcriptionOutputDiv = document.getElementById('transcription-output');
const sentimentSpan = document.getElementById('sentiment');
const topicsSpan = document.getElementById('topics');
const keywordsSpan = document.getElementById('keywords');
const intentSpan = document.getElementById('intent');
const estimatedTimeSpan = document.getElementById('estimated-time');
const summaryOutputDiv = document.getElementById('summary-output');
const workOrderIdSpan = document.getElementById('work-order-id');
const workOrderTimeSpan = document.getElementById('work-order-time');
const workOrderCategorySpan = document.getElementById('work-order-category');
const workOrderPrioritySpan = document.getElementById('work-order-priority');
const workOrderStatusSpan = document.getElementById('work-order-status');
const workOrderHandlerSpan = document.getElementById('work-order-handler');
const workOrderFollowupSpan = document.getElementById('work-order-followup');
const todayCallsSpan = document.getElementById('today-calls');
const avgDurationSpan = document.getElementById('avg-duration');
const resolutionRateSpan = document.getElementById('resolution-rate');
const satisfactionSpan = document.getElementById('satisfaction');
const popularIssuesSpan = document.getElementById('popular-issues');
const waveformCanvas = document.getElementById('waveform-canvas');
const waveformCanvasCtx = waveformCanvas.getContext('2d');
const currentSpeakerSpan = document.getElementById('current-speaker');
const systemStatusSpan = document.getElementById('system-status');
const aiStatusSpan = document.getElementById('ai-status');

// Waveform variables
let audioContext = null;
let analyser = null;
let waveformDataArray = null;
let waveformInterval = null;
let currentAudioLevel = 0; // Simulate audio level based on transcription

// Analysis variables
let analysisInterval = null;
let analysisProgress = 0; // 0 to 1, simulating analysis completion

// Mock Data (Simplified)
const mockScenarios = {
    1: {
        name: '户籍迁移咨询',
        duration: '00:03:45',
        transcription: [
            { time: '14:32:15', speaker: '市民', text: '您好，我想咨询一下户籍迁移的手续，我准备从北京搬到上海。', delay: 1000 },
            { time: '14:32:20', speaker: '客服', text: '您好，女士/先生。很高兴为您服务。请问您的具体情况是？比如您在北京的户口性质、在上海是否有房产或者稳定的工作等。', delay: 1500 },
            { time: '14:32:35', speaker: '市民', text: '我在北京是集体户口，在上海有购买的商品房，工作也在上海。' , delay: 1200},
            { time: '14:32:47', speaker: '客服', text: '好的，根据您的情况，您符合通过购房渠道将户籍迁入上海的条件。主要的流程和材料我给您介绍一下。' , delay: 1000},
            { time: '14:32:57', speaker: '客服', text: '首先，您需要在上海的房屋所在地派出所咨询并提交申请材料。' , delay: 800},
            { time: '14:33:05', speaker: '市民', text: '需要准备哪些材料呢？', delay: 700 },
            { time: '14:33:12', speaker: '客服', text: '您需要准备您的身份证、户口本（北京的）、上海的房产证。如果房产证是您和配偶共有，可能还需要结婚证。另外还需要您的社保缴纳证明或者劳动合同等证明您在上海工作生活的材料。' , delay: 2500},
            { time: '14:33:37', speaker: '市民', text: '哦，好的。那这个流程大概需要多久呢？' , delay: 900},
            { time: '14:33:46', speaker: '客服', text: '一般来说，派出所会对您的材料进行初审，然后报送分局或市局审批。整个审批流程大概需要15个工作日。审批通过后，会通知您去北京的原户籍地办理迁出手续，然后回到上海办理落户。' , delay: 2000},
            { time: '14:34:06', speaker: '市民', text: '听起来有点复杂。有没有详细的材料清单我可以参考？' , delay: 900},
            { time: '14:34:15', speaker: '客服', text: '有的，女士/先生。我稍后可以将详细的材料清单和具体的办理流程通过短信发送到您的手机上，您按照清单准备就不会遗漏了。' , delay: 1500},
            { time: '14:34:30', speaker: '市民', text: '太好了，谢谢！那如果我在准备材料或者办理过程中遇到问题，可以再打电话咨询吗？' , delay: 1200},
            { time: '14:34:42', speaker: '客服', text: '当然可以。我们的热线24小时为您开通，您有任何疑问都可以随时拨打。如果涉及到具体材料的问题，建议您直接联系您房屋所在地派出所的户籍窗口，他们能给您更具体的指导。' , delay: 2000},
            { time: '14:35:02', speaker: '市民', text: '好的，非常感谢您的详细解答和帮助！' , delay: 800},
            { time: '14:35:10', speaker: '客服', text: '不客气，这是我们应该做的。请注意查收短信。祝您办理顺利！再见。' , delay: 1200},
            { time: '14:35:22', speaker: '市民', text: '好的，再见。' , delay: 500},
            // End of conversation
        ],
        analysis: {
            sentiment: '😊 积极 (85%)',
            topics: '#户籍迁移 #政务咨询 #上海落户',
            keywords: '户籍迁移、北京、上海、购房、材料清单、办理流程、派出所、审批、工作日、短信、咨询电话',
            intent: '咨询户籍迁移办理流程和所需材料',
            estimatedTime: '2-3分钟'
        },
        summary: `
            <h4>👤 来电人信息</h4>
            <ul>
                <li>电话号码: 138****5678</li>
                <li>来电时间: 2024-01-15 14:32:15</li>
                <li>来电类型: 政务咨询</li>
                <li>情感状态: 积极配合 😊</li>
            </ul>
            <h4>❓ 问题描述</h4>
            <p>市民咨询其集体户口（北京）通过购房方式迁移至上海的具体办理流程和所需材料。</p>
            <h4>💬 关键讨论点</h4>
            <ul>
                <li>确认购房落户条件（符合）</li>
                <li>说明主要流程：上海派出所申请 -> 材料初审 -> 分局/市局审批 -> 北京原籍迁出 -> 上海落户</li>
                <li>列举所需材料：身份证、户口本、上海房产证、结婚证（如适用）、社保/劳动合同证明</li>
                <li>告知办理时限：审批约15个工作日</li>
                <li>提供详细材料清单和流程的短信发送服务</li>
                <li>告知后续咨询途径（热线或派出所户籍窗口）</li>
            </ul>
            <h4>✅ 解决方案/已采取行动</h4>
            <ul>
                <li>已详细说明通过购房渠道户籍迁移上海的流程和所需主要材料。</li>
                <li>承诺将详细材料清单和办理流程通过短信发送给市民。</li>
                <li>提供了后续咨询的热线电话和具体负责办理的派出所户籍窗口建议。</li>
                <li>市民对解答表示满意。</li>
            </ul>
            <h4>📊 通话质量评估</h4>
            <ul>
                <li>问题解决度: ⭐⭐⭐⭐⭐ (完全解决)</li>
                <li>服务满意度: ⭐⭐⭐⭐⭐ (非常满意)</li>
                <li>通话时长: 3分07秒 (更新以匹配新的对话长度)</li>
                <li>转接次数: 0次</li>
            </ul>
        `,
        crm: {
            id: 'WD20240115001',
            time: '2024-01-15 14:35:22',
            category: '政务咨询 > 户籍管理 > 迁移办理 > 购房落户',
            priority: '普通',
            status: '已解决 ✅',
            handler: '张客服 (工号: CS001)',
            followup: '无需跟进 - 已发送短信和告知咨询渠道'
        }
    },
    2: {
        name: '社保卡办理投诉',
        duration: '00:05:10',
        transcription: [
            { time: '10:01:15', speaker: '市民', text: '喂，12345吗？我要投诉社保中心，我的社保卡一直办不下来！' , delay: 1500},
            { time: '10:01:30', speaker: '客服', text: '您好，请问您办理的是新卡还是补换卡呢？具体是在哪个环节遇到了问题？' , delay: 1200},
            { time: '10:01:42', speaker: '市民', text: '是新卡，我材料都交上去了，都一个多月了还没信儿！我急着用呢！' , delay: 1000},
            { time: '10:01:52', speaker: '客服', text: '请您先别着急，我这边帮您查询一下办理进度。请问您的姓名和身份证号码是多少？' , delay: 1200},
            { time: '10:02:04', speaker: '市民', text: '我叫王XX，身份证号是XXX...。' , delay: 800},
            { time: '10:02:12', speaker: '客服', text: '好的，王先生/女士。我正在为您查询... 系统显示您的社保卡申请已经在审批环节，目前状态是"待制卡"。' , delay: 2000},
            { time: '10:02:32', speaker: '市民', text: '待制卡？这都等了一个月了！正常不是两周就能办好吗？是不是材料有问题啊？也没人通知我。' , delay: 1500},
            { time: '10:02:47', speaker: '客服', text: '请您稍等，我帮您核实一下具体的办理时限和当前进度异常的原因。根据规定，社保卡办理通常在材料齐全后15个工作日内完成制发。您的件确实有点超时了。' , delay: 2000},
            { time: '10:03:07', speaker: '客服', text: '系统显示，您的申请材料是齐全的，超时可能是由于近期办理业务量较大或者制卡中心排队造成的。' , delay: 1500},
            { time: '10:03:22', speaker: '市民', text: '业务量大也不能这么久啊！我下周就要用！你们得赶紧给我办！' , delay: 1000},
            { time: '10:03:32', speaker: '客服', text: '非常理解您的心情。我已经将您的情况特殊加急备注，并转报给社保中心制卡部门进行优先处理。同时，我会将您的联系方式提供给他们，请社保中心的工作人员尽快与您联系，告知具体的制卡完成时间。' , delay: 2500},
            { time: '10:03:57', speaker: '市民', text: '那他们大概什么时候会联系我？' , delay: 800},
            { time: '10:04:05', speaker: '客服', text: '我已经备注了"紧急联系"，他们收到转办件后会尽快联系您，预计今天或者明天就会有回复。请您保持电话畅通。' , delay: 1500},
            { time: '10:04:20', speaker: '市民', text: '行吧，那我就等他们电话。希望这次能快点。' , delay: 900},
            { time: '10:04:29', speaker: '客服', text: '好的，请您耐心等待。如果两天内没有接到电话，您也可以再次拨打12345查询进度或者直接联系社保中心。给您带来不便非常抱歉。' , delay: 1500},
            { time: '10:04:44', speaker: '市民', text: '嗯，知道了。' , delay: 500},
             { time: '10:04:49', speaker: '客服', text: '好的，王先生/女士。请问还有其他需要帮助的吗？' , delay: 800},
            { time: '10:04:57', speaker: '市民', text: '没有了。' , delay: 500},
            { time: '10:05:02', speaker: '客服', text: '好的，祝您生活愉快，再见。' , delay: 800},
            { time: '10:05:10', speaker: '市民', text: '再见。' , delay: 500},
        ],
        analysis: {
            sentiment: '😟 消极 -> 转换为 🙂 中性 (60%)', // 起始消极，处理后转为中性
            topics: '#社保卡办理 #投诉 #办理进度 #超时',
            keywords: '社保中心、社保卡、办理进度、超时、制卡、投诉、加急、联系、身份证',
            intent: '投诉社保卡办理进度慢',
            estimatedTime: '4-5分钟'
        },
        summary: `
            <h4>👤 来电人信息</h4>
            <ul>
                <li>电话号码: 138****5678</li>
                <li>来电时间: 2024-01-15 10:01:15</li>
                <li>来电类型: 投诉</li>
                <li>情感状态: 不满 -> 缓解</li>
            </ul>
            <h4>❓ 问题描述</h4>
            <p>市民王先生/女士投诉，其社保卡办理已超过1个月，远超正常时限（15工作日），急需用卡，对办理进度和无人通知表示不满。</p>
            <h4>💬 关键讨论点</h4>
            <ul>
                <li>市民办理的是新社保卡</li>
                <li>查询系统显示申请状态为"待制卡"，材料齐全</li>
                <li>核实到办理确实超时</li>
                <li>解释超时原因（办理量大/制卡排队）</li>
                <li>市民表达急切需求和不满</li>
                <li>客服采取的加急处理措施</li>
                <li>告知社保中心将尽快回电</li>
                <li>提供后续查询和联系方式</li>
            </ul>
            <h4>✅ 解决方案/已采取行动</h4>
            <ul>
                <li>已查询并告知市民社保卡办理进度和状态（待制卡）。</li>
                <li>已确认市民材料齐全，并承认办理超时。</li>
                <li>已将市民情况特殊加急备注，并转报社保中心制卡部门优先处理。</li>
                <li>已提供市民联系方式给社保中心，要求尽快回电告知具体完成时间。</li>
                <li>告知市民预计回电时间（今天/明天），并建议保持电话畅通。</li>
                <li>提供两天内未接到电话的后续处理建议（再次拨打热线或联系社保中心）。</li>
            </ul>
            <h4>📊 通话质量评估</h4>
            <ul>
                <li>问题解决度: ⭐⭐⭐⭐☆ (已转办核查，待处理结果)</li>
                <li>服务满意度: ⭐⭐⭐⭐☆ (市民情绪得到缓解，接受后续处理)</li>
                <li>通话时长: 3分55秒</li>
                <li>转接次数: 0次</li>
            </ul>
        `,
        crm: {
            id: 'WD20240115002',
            time: '2024-01-15 10:05:10',
            category: '投诉 > 社保服务 > 社保卡办理',
            priority: '紧急',
            status: '已转办待回访',
            handler: '李客服 (工号: CS002)',
            followup: '社保中心需回访，确认制卡及发卡时间'
        }
    },
};

const mockStatistics = {
    todayCalls: 156,
    avgDuration: '4分12秒',
    resolutionRate: '94.2%',
    satisfaction: '4.8/5.0',
    popularIssues: '户籍迁移(23%) 社保查询(18%) 证件办理(15%)'
};


let currentScenario = null;
let transcriptionIndex = 0;
let callInterval = null;
let callTime = 0;

/**
 * Updates the call duration display.
 */
function updateCallDuration() {
    const hours = String(Math.floor(callTime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((callTime % 3600) / 60)).padStart(2, '0');
    const seconds = String(callTime % 60).padStart(2, '0');
    callDurationSpan.textContent = `${hours}:${minutes}:${seconds}`;
    callTime++;
}

/**
 * Simulates the typing effect for transcription.
 */
function simulateTranscription() {
    if (!currentScenario || transcriptionIndex >= currentScenario.transcription.length) {
        clearInterval(callInterval);
        callStatusSpan.textContent = '已结束';
        aiStatusSpan.textContent = '空闲';
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        displaySummaryAndCrm();
        return;
    }

    const line = currentScenario.transcription[transcriptionIndex];
    const p = document.createElement('p');
    p.innerHTML = `<b>${line.speaker} [${line.time}]</b>: `;
    transcriptionOutputDiv.appendChild(p);

    let textIndex = 0;
    const typeInterval = setInterval(() => {
        if (textIndex < line.text.length) {
            p.innerHTML += line.text.charAt(textIndex);
            transcriptionOutputDiv.scrollTop = transcriptionOutputDiv.scrollHeight; // Auto scroll
            textIndex++;
        } else {
            clearInterval(typeInterval);
            transcriptionIndex++;
            
            if (transcriptionIndex < currentScenario.transcription.length) {
                 // Simulate delay before next line if there are more lines
                 setTimeout(simulateTranscription, Math.random() * 1000 + 500);
            } else {
                 // Transcription finished, display final results
                 clearInterval(callInterval); // Stop duration timer
                 callStatusSpan.textContent = '已结束';
                 aiStatusSpan.textContent = '空闲';
                 playBtn.disabled = false;
                 pauseBtn.disabled = true;
                 stopBtn.disabled = true;
                 clearInterval(waveformInterval); // Stop waveform drawing
                 currentAudioLevel = 0; // Reset audio level
                 drawWaveform(); // Draw final flat waveform
                 
                 displaySummaryAndCrm(); // Display summary and CRM
                 updateAIAnalysis(); // Display final analysis
            }
        }
    }, 50); // Typing speed

    currentSpeakerSpan.textContent = line.speaker;
}

/**
 * Displays the summary and CRM information for the current scenario.
 */
function displaySummaryAndCrm() {
    if (currentScenario) {
        summaryOutputDiv.innerHTML = currentScenario.summary;
        workOrderIdSpan.textContent = currentScenario.crm.id || '--';
        workOrderTimeSpan.textContent = currentScenario.crm.time || '--';
        workOrderCategorySpan.textContent = currentScenario.crm.category || '--';
        workOrderPrioritySpan.textContent = currentScenario.crm.priority || '--';
        workOrderStatusSpan.textContent = currentScenario.crm.status || '--';
        workOrderHandlerSpan.textContent = currentScenario.crm.handler || '--';
        workOrderFollowupSpan.textContent = currentScenario.crm.followup || '--';
    } else {
        summaryOutputDiv.innerHTML = '<p>--</p>';
        workOrderIdSpan.textContent = '--';
        workOrderTimeSpan.textContent = '--';
        workOrderCategorySpan.textContent = '--';
        workOrderPrioritySpan.textContent = '--';
        workOrderStatusSpan.textContent = '--';
        workOrderHandlerSpan.textContent = '--';
        workOrderFollowupSpan.textContent = '--';
    }
}

/**
 * Updates the AI analysis section with mock data.
 */
function updateAIAnalysis() {
    if (currentScenario && currentScenario.analysis) {
        sentimentSpan.textContent = currentScenario.analysis.sentiment || '--';
        topicsSpan.textContent = currentScenario.analysis.topics || '--';
        keywordsSpan.textContent = currentScenario.analysis.keywords || '--';
        intentSpan.textContent = currentScenario.analysis.intent || '--';
        estimatedTimeSpan.textContent = currentScenario.analysis.estimatedTime || '--';
        aiStatusSpan.textContent = '分析中';
    } else {
        sentimentSpan.textContent = '--';
        topicsSpan.textContent = '--';
        keywordsSpan.textContent = '--';
        intentSpan.textContent = '--';
        estimatedTimeSpan.textContent = '--';
        aiStatusSpan.textContent = '空闲';
    }
}

/**
 * Initializes the data statistics display.
 */
function initializeStatistics() {
    todayCallsSpan.textContent = mockStatistics.todayCalls;
    avgDurationSpan.textContent = mockStatistics.avgDuration;
    resolutionRateSpan.textContent = mockStatistics.resolutionRate;
    satisfactionSpan.textContent = mockStatistics.satisfaction;
    popularIssuesSpan.textContent = mockStatistics.popularIssues;
}

/**
 * Initializes the waveform canvas (placeholder).
 */
function initializeWaveform() {
    // No drawing on init, will be drawn during call simulation
    waveformCanvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
}

/**
 * Draws a simple dynamic waveform.
 */
function drawWaveform() {
    waveformCanvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    waveformCanvasCtx.fillStyle = '#e6f7ff'; // Background fill
    waveformCanvasCtx.fillRect(0, 0, waveformCanvas.width, waveformCanvas.height);

    const barWidth = 2;
    const gap = 1;
    const totalBarWidth = barWidth + gap;
    const numBars = Math.floor(waveformCanvas.width / totalBarWidth);
    const baseHeight = waveformCanvas.height / 2;

    waveformCanvasCtx.fillStyle = '#1890FF'; // Waveform color

    // Simple dynamic drawing based on currentAudioLevel
    for (let i = 0; i < numBars; i++) {
        // Introduce some variation based on index and current level
        const height = baseHeight * (0.1 + currentAudioLevel * (0.5 + Math.sin(i * 0.1 + callTime * 0.5) * 0.2));
        waveformCanvasCtx.fillRect(
            i * totalBarWidth,
            baseHeight - height / 2,
            barWidth,
            height
        );
    }
}

/**
 * Resets the demo to the initial state, but keeps the selected scenario if one exists.
 */
function resetDemoState() {
    console.log('resetDemoState called. currentScenario before reset:', currentScenario ? currentScenario.name : 'null');
    clearInterval(callInterval);
    callTime = 0;
    transcriptionIndex = 0;
    // Do NOT set currentScenario to null here. It should only be null on initial load or full reset.

    callDurationSpan.textContent = '00:00:00';
    callStatusSpan.textContent = '待机';
    transcriptionOutputDiv.innerHTML = '';
    currentSpeakerSpan.textContent = '--';
    aiStatusSpan.textContent = '空闲';
    currentAudioLevel = 0; // Reset audio level
    waveformCanvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height); // Clear waveform canvas

    playBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;

    // Only reset the displayed analysis/summary if no scenario is selected
    if (!currentScenario) {
        console.log('resetDemoState: No scenario selected, clearing display.');
        sentimentSpan.textContent = '--';
        topicsSpan.textContent = '--';
        keywordsSpan.textContent = '--';
        intentSpan.textContent = '--';
        estimatedTimeSpan.textContent = '--';
        summaryOutputDiv.innerHTML = '<p>--</p>';
        // Also clear CRM details if no scenario
        workOrderIdSpan.textContent = '--';
        workOrderTimeSpan.textContent = '--';
        workOrderCategorySpan.textContent = '--';
        workOrderPrioritySpan.textContent = '--';
        workOrderStatusSpan.textContent = '--';
        workOrderHandlerSpan.textContent = '--';
        workOrderFollowupSpan.textContent = '--';
    } else {
         console.log('resetDemoState: Scenario selected, keeping preview display.');
    }
     console.log('resetDemoState finished. currentScenario after reset:', currentScenario ? currentScenario.name : 'null');
}

/**
 * Starts the call simulation.
 */
function startCall() {
    console.log('startCall called. currentScenario:', currentScenario ? currentScenario.name : 'null');
    if (!currentScenario) {
        alert('请先选择一个演示场景。');
        return;
    }

    // Reset the *previous call's state* before starting a new one, but keep the selected scenario.
    resetDemoState(); // Renamed for clarity

    callStatusSpan.textContent = '进行中';
    aiStatusSpan.textContent = '分析中';
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;

    // Simulate call duration and transcription
    callInterval = setInterval(updateCallDuration, 1000);
    
    // Start waveform drawing interval
    waveformInterval = setInterval(() => {
        // Update audio level based on speaker activity
        // In a real app, this would come from audio analysis
        if (currentSpeakerSpan.textContent !== '--' && callStatusSpan.textContent === '进行中') {
            currentAudioLevel = Math.min(1, currentAudioLevel + 0.05); // Increase level when speaking
        } else {
            currentAudioLevel = Math.max(0, currentAudioLevel - 0.1); // Decrease level when not speaking or paused
        }
        drawWaveform();
    }, 50); // Draw waveform every 50ms
    
    // Start analysis progression interval
    analysisInterval = setInterval(() => {
        if (callStatusSpan.textContent === '进行中') {
            analysisProgress = Math.min(1, analysisProgress + 0.01); // Simulate analysis progress
            updateProgressiveAnalysis(); // Update analysis display
        }
    }, 100); // Update analysis progress every 100ms
    
    simulateTranscription();
    updateAIAnalysis(); // Ensure analysis is updated at call start
    // summary and CRM are displayed/updated at the END of the transcription simulation
}

/**
 * Pauses the call simulation.
 */
function pauseCall() {
    clearInterval(callInterval);
    callStatusSpan.textContent = '暂停';
    clearInterval(analysisInterval); // Stop analysis interval
    aiStatusSpan.textContent = '暂停';
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = false;
}

/**
 * Stops the call simulation.
 */
function stopCall() {
     console.log('stopCall called. currentScenario:', currentScenario ? currentScenario.name : 'null');
    // When stopping, reset the call state but keep the selected scenario.
    clearInterval(waveformInterval); // Stop waveform drawing
    clearInterval(analysisInterval); // Stop analysis interval
    analysisProgress = 1; // Set progress to 1 to show full analysis
    resetDemoState(); // Renamed for clarity
    // Display final results after stopping the call
    updateAIAnalysis();
    // After stopping, display the summary and CRM for the selected scenario
    // This is already handled by displaySummaryAndCrm being called within resetDemoState if currentScenario is not null,
    // but we can call it again explicitly here to be sure.
    displaySummaryAndCrm();
     console.log('stopCall finished. currentScenario:', currentScenario ? currentScenario.name : 'null');
}

/**
 * Handles scenario selection.
 * @param {Event} event - The click event.
 */
function handleScenarioSelect(event) {
    const scenarioId = event.target.dataset.scenario;
    console.log('handleScenarioSelect called for scenarioId:', scenarioId);
    if (scenarioId) {
        // Find the previously active scenario item and remove the 'active' class
        const activeItem = document.querySelector('.scenario-selection li.active');
        if (activeItem) {
            activeItem.classList.remove('active');
             console.log('handleScenarioSelect: Removed active class from previously selected item.');
        }

        // Set the current scenario and add 'active' class to the clicked item
        currentScenario = mockScenarios[scenarioId];
        event.target.classList.add('active');

        console.log('Selected Scenario:', currentScenario.name);

        // When a new scenario is selected, reset the call state and clear display areas, keep scenario selected
        resetDemoState(); // Resets call state and clears display, keeps currentScenario
        
        // Clear analysis and summary/CRM previews immediately on scenario select
        sentimentSpan.textContent = '--';
        topicsSpan.textContent = '--';
        keywordsSpan.textContent = '--';
        intentSpan.textContent = '--';
        estimatedTimeSpan.textContent = '--';
        summaryOutputDiv.innerHTML = '<p>--</p>';
        workOrderIdSpan.textContent = '--';
        workOrderTimeSpan.textContent = '--';
        workOrderCategorySpan.textContent = '--';
        workOrderPrioritySpan.textContent = '--';
        workOrderStatusSpan.textContent = '--';
        workOrderHandlerSpan.textContent = '--';
        workOrderFollowupSpan.textContent = '--';
        aiStatusSpan.textContent = '空闲'; // AI is idle until play is pressed

    }
     console.log('handleScenarioSelect finished. currentScenario:', currentScenario ? currentScenario.name : 'null');
}

// Initial setup on page load
/**
 * Initializes the demo on page load.
 */
function initializeDemo() {
     console.log('initializeDemo called.');
    // Set initial state, clearing everything including the selected scenario
    currentScenario = null; // Explicitly set to null on initial load
     console.log('initializeDemo: currentScenario set to null.');
    resetDemoState(); // Use the state reset function
    initializeStatistics(); // Display initial statistics
    initializeWaveform(); // Draw placeholder waveform
    // displaySummaryAndCrm() is called within resetDemoState when currentScenario is null
     console.log('initializeDemo finished.');
}

// Event Listeners
playBtn.addEventListener('click', startCall);
pauseBtn.addEventListener('click', pauseCall);
stopBtn.addEventListener('click', stopCall);
scenarioList.forEach(item => item.addEventListener('click', handleScenarioSelect));

// Run initial setup
initializeDemo(); // Call the new initialization function

displaySummaryAndCrm(); // Display initial placeholder text in summary/CRM

// Function to update AI analysis display based on progress
function updateProgressiveAnalysis() {
    if (!currentScenario || !currentScenario.analysis) return;

    const analysis = currentScenario.analysis;

    // Simulate progressive reveal based on analysisProgress
    // Clear previous state first
    sentimentSpan.textContent = '--';
    topicsSpan.textContent = '--';
    keywordsSpan.textContent = '--';
    intentSpan.textContent = '--';
    estimatedTimeSpan.textContent = '--';

    if (analysisProgress > 0.1) {
        sentimentSpan.textContent = analysis.sentiment || '--';
    }
    if (analysisProgress > 0.3) {
        topicsSpan.textContent = analysis.topics || '--';
    }
    if (analysisProgress > 0.5) {
        keywordsSpan.textContent = analysis.keywords || '--';
    }
    if (analysisProgress > 0.7) {
        intentSpan.textContent = analysis.intent || '--';
    }
    if (analysisProgress > 0.9) {
        estimatedTimeSpan.textContent = analysis.estimatedTime || '--';
    }
} 