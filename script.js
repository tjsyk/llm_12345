// DOM Elements
const phoneNumberInput = document.getElementById('phoneNumber');
const dialpadButtons = document.querySelectorAll('.dialpad .buttons button');
const dialButton = document.getElementById('dialButton');
const hangupButton = document.getElementById('hangupButton');
const answerButton = document.getElementById('answerButton');
const muteButton = document.getElementById('muteButton');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const callStatusSpan = document.getElementById('callStatus');
const callDurationSpan = document.getElementById('callDuration');
const callLocationSpan = document.getElementById('callLocation');
const callIdSpan = document.getElementById('callId');
const aiAssistantStatusSpan = document.getElementById('aiAssistantStatus');
const serviceQualitySpan = document.getElementById('serviceQuality');
const scenarioButtons = document.querySelectorAll('.scenario-buttons button');
const waveformCanvas = document.getElementById('waveformCanvas');
const userSpeakingStatusSpan = document.getElementById('userSpeakingStatus');
const aiSpeakingStatusSpan = document.getElementById('aiSpeakingStatus');
const waitingStatusSpan = document.getElementById('waitingStatus');
const userVolumeControl = document.getElementById('userVolume');
const userVolumeValueSpan = document.getElementById('userVolumeValue');
const aiVolumeControl = document.getElementById('aiVolume');
const aiVolumeValueSpan = document.getElementById('aiVolumeValue');
const transcriptContentDiv = document.getElementById('transcriptContent');
const processingStatusContentDiv = document.getElementById('processingStatusContent');

// Canvas Context for Waveform
const ctx = waveformCanvas.getContext('2d');

// Call State Variables
let callState = 'idle'; // 'idle', 'dialing', 'connected', 'ended'
let callStartTime = null;
let callDurationInterval = null;
let currentCallId = null;
let aiAssistantStatus = '离线';

// Animation Variables
let animationFrameId = null; // To store requestAnimationFrame ID

// Simulation Variables
let simulationInterval = null;
let currentScenario = null;
let scenarioStep = 0;
let dialogueHistory = [];
let processingSteps = [];

// --- Utility Functions ---

/**
 * 更新通话状态显示
 * @param {string} status - 通话状态 ('空闲', '拨号中', '已接通', '已结束')
 */
function updateCallStatus(status) {
    callStatusSpan.textContent = status;
    callState = status === '空闲' ? 'idle' : status === '拨号中' ? 'dialing' : status === '已接通' ? 'connected' : 'ended';
    updateButtonStates();
}

/**
 * 更新AI助手状态显示
 * @param {string} status - AI助手状态 ('在线', '离线', '处理中')
 */
function updateAIAssistantStatus(status) {
    aiAssistantStatusSpan.textContent = status;
    aiAssistantStatus = status;
}

/**
 * 更新通话时长显示
 */
function updateCallDuration() {
    if (callStartTime) {
        const elapsed = Math.floor((Date.now() - callStartTime) / 1000);
        const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const seconds = String(elapsed % 60).padStart(2, '0');
        callDurationSpan.textContent = `${minutes}:${seconds}:00`; // Simplified to mm:ss:00 for demo
    }
}

/**
 * 生成唯一的通话ID
 * @returns {string} 通话ID
 */
function generateCallId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `CALL_${year}${month}${day}_${hour}${minute}${second}_${random}`;
}

/**
 * 添加对话消息到转录区
 * @param {'user' | 'ai' | 'system'} type - 消息类型
 * @param {string} content - 消息内容
 * @param {number} timestamp - 时间戳 (秒)
 * @param {number} confidence - 识别置信度 (0-100%) (可选)
 */
function addDialogueMessage(type, content, timestamp, confidence = null) {
    const messageElement = document.createElement('p');
    messageElement.classList.add(`${type}-message`);

    const minutes = String(Math.floor(timestamp / 60)).padStart(2, '0');
    const seconds = String(timestamp % 60).padStart(2, '0');
    const timeString = `[${minutes}:${seconds}]`;

    let prefix = '';
    if (type === 'user') {
        prefix = `👤 市民 ${timeString}: `;
    } else if (type === 'ai') {
        prefix = `🤖 AI助手 ${timeString}: `;
    } else if (type === 'system') {
        // System messages don't need a timestamp prefix in the example format
        messageElement.classList.add('system-message');
        messageElement.textContent = content;
        transcriptContentDiv.appendChild(messageElement);
        transcriptContentDiv.scrollTop = transcriptContentDiv.scrollHeight; // Auto scroll
        return;
    }

    messageElement.textContent = prefix + content;

    if (type === 'user' && confidence !== null) {
        const confidenceSpan = document.createElement('span');
        confidenceSpan.textContent = ` [置信度: ${confidence.toFixed(0)}%]`;
        confidenceSpan.style.fontSize = '0.9em';
        const textSecondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
        confidenceSpan.style.color = textSecondaryColor;
        messageElement.appendChild(confidenceSpan);
    }

    dialogueHistory.push({ type, content, timestamp, confidence });
    transcriptContentDiv.appendChild(messageElement);
    transcriptContentDiv.scrollTop = transcriptContentDiv.scrollHeight; // Auto scroll
}

/**
 * 更新AI处理状态显示
 * @param {string} step - 当前处理步骤描述
 * @param {object} details - 步骤详情 (如意图、耗时等)
 */
function updateAIProcessingStatus(step, details = {}) {
    processingSteps.push({ step, details, timestamp: Math.floor((Date.now() - callStartTime) / 1000) });
    processingStatusContentDiv.innerHTML = ''; // Clear previous status

    processingSteps.forEach(item => {
        const statusElement = document.createElement('p');
        let content = `[${String(Math.floor(item.timestamp / 60)).padStart(2, '0')}:${String(item.timestamp % 60).padStart(2, '0')}] ${item.step}`;

        if (item.details.intent) {
            content += ` - 🎯 意图识别: ${item.details.intent.name} (置信度: ${item.details.intent.confidence.toFixed(0)}%)`;
        }
        if (item.details.knowledgeSearch) {
            content += ` - 📚 知识库检索: ${item.details.knowledgeSearch.query} (结果: ${item.details.knowledgeSearch.results})`;
        }
        if (item.details.routing) {
            content += ` - 🎯 分流建议: ${item.details.routing.departments.join(', ')}`;
        }
        if (item.details.timing) {
             content += ` - ⚡ 耗时: ${item.details.timing.total}ms`;
        }
        // Add other details as needed based on the structure

        statusElement.textContent = content;
        processingStatusContentDiv.appendChild(statusElement);
    });
     // Optionally, add current total time
     if (callStartTime) {
        const totalElapsed = Date.now() - callStartTime;
        const totalTimeElement = document.createElement('p');
        totalTimeElement.textContent = `⚡ 总处理耗时: ${totalElapsed.toFixed(0)}ms`;
        processingStatusContentDiv.appendChild(totalTimeElement);
     }
}

/**
 * 模拟语音波形动画
 * @param {'user' | 'ai' | 'idle'} status - 说话状态
 */
function animateWaveform(status) {
    // Cancel previous animation frame if any
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    const width = waveformCanvas.width;
    const height = waveformCanvas.height;
    ctx.clearRect(0, 0, width, height);

    if (callState === 'ended' || callState === 'idle') {
         ctx.strokeStyle = 'gray';
         ctx.lineWidth = 1;
         ctx.beginPath();
         ctx.moveTo(0, height / 2);
         ctx.lineTo(width, height / 2);
         ctx.stroke();
         userSpeakingStatusSpan.style.fontWeight = 'normal';
         aiSpeakingStatusSpan.style.fontWeight = 'normal';
         waitingStatusSpan.style.fontWeight = 'bold';
         animationFrameId = null; // Clear animation ID when idle/ended
         return;
    }

    const color = status === 'user' ? 'red' : 'blue';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, height / 2);

    for (let i = 0; i < width; i++) {
        const amplitude = Math.random() * (height / 4);
        const y = height / 2 + Math.sin(i * 0.05) * amplitude;
        ctx.lineTo(i, y);
    }
    ctx.stroke();

    userSpeakingStatusSpan.style.fontWeight = status === 'user' ? 'bold' : 'normal';
    aiSpeakingStatusSpan.style.fontWeight = status === 'ai' ? 'bold' : 'normal';
    waitingStatusSpan.style.fontWeight = 'normal';

    // Store the new animation frame ID
    animationFrameId = requestAnimationFrame(() => animateWaveform(status));
}

/**
 * 更新按钮的可用状态
 */
function updateButtonStates() {
    dialButton.style.display = callState === 'idle' ? 'block' : 'none';
    hangupButton.style.display = callState !== 'idle' ? 'block' : 'none';
    answerButton.style.display = 'none'; // Assuming incoming calls are not part of this demo

    const callActive = callState === 'connected' || callState === 'dialing';
    muteButton.disabled = !callActive;
    pauseButton.disabled = !callActive;
    scenarioButtons.forEach(button => button.disabled = !callActive);

    // Initial speaking status
    if (callState === 'connected') {
        animateWaveform('idle'); // Start idle animation when connected
    } else {
        animateWaveform('idle'); // Default to idle when not connected or ended
    }

    updateAIAssistantStatus(callState === 'connected' ? '在线' : '离线');
}

/**
 * 清空所有状态，回到初始状态
 */
function resetDemo() {
    clearInterval(callDurationInterval);
    // Stop the waveform animation
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = null;

    // Clear any pending simulation timeouts
    // This is a simplification. A more robust solution would track all timeout IDs.
    // For this demo, setting callState to idle prevents further execution in callbacks.
    
    callState = 'idle';
    callStartTime = null;
    currentCallId = null;
    dialogueHistory = [];
    processingSteps = [];

    phoneNumberInput.value = '12345';
    callStatusSpan.textContent = '空闲';
    callDurationSpan.textContent = '00:00:00';
    callLocationSpan.textContent = '模拟地区';
    callIdSpan.textContent = 'N/A';
    aiAssistantStatusSpan.textContent = '离线';
    serviceQualitySpan.textContent = 'N/A';
    transcriptContentDiv.innerHTML = '';
    processingStatusContentDiv.innerHTML = '';

    updateButtonStates();
    animateWaveform('idle'); // Ensure waveform is reset to idle state
}

// --- Simulation Logic ---

/**
 * 模拟完整的拨号和接通过程
 */
function simulateCallStart() {
    updateCallStatus('拨号中');
    callIdSpan.textContent = generateCallId();
    callLocationSpan.textContent = '北京市朝阳区'; // Simulated location
    serviceQualitySpan.textContent = '⭐⭐⭐⭐⭐'; // Simulated quality

    // Simulate dialing sound (optional, requires audio API)
    // setTimeout(() => { /* play dialing tone */ }, 500);

    setTimeout(() => {
        // Only proceed if still in dialing state (not reset)
        if (callState !== 'dialing') return;

        updateCallStatus('已接通');
        callStartTime = Date.now();
        callDurationInterval = setInterval(updateCallDuration, 1000);
        animateWaveform('idle');
        addDialogueMessage('system', '通话已接通', 0);
        simulateAIPrompt();
    }, 3000); // Simulate 3 seconds to connect
}

/**
 * 模拟AI助手开场白
 */
function simulateAIPrompt() {
     // Only proceed if call is connected
     if (callState !== 'connected') return;

     updateAIAssistantStatus('处理中');
     animateWaveform('ai');
     // Simulate AI thinking/processing
     updateAIProcessingStatus('🤖 AI助手: 正在准备开场白...');
     setTimeout(() => {
         // Only proceed if call is connected
         if (callState !== 'connected') return;

         updateAIProcessingStatus('🤖 AI助手: 开场白生成完成', { timing: { total: 800 } });
         addDialogueMessage('ai', '您好，这里是12345政务服务热线，我是AI智能助手小政，很高兴为您服务。请问有什么可以帮助您的吗？', Math.floor((Date.now() - callStartTime) / 1000));
         animateWaveform('idle');
         updateAIAssistantStatus('在线');
     }, 1500); // Simulate AI response time
}

/**
 * 模拟用户输入和AI回复流程
 * @param {string} userInput - 模拟的用户输入文本
 */
function simulateUserInteraction(userInput) {
    if (callState !== 'connected') return;

    const userTimestamp = Math.floor((Date.now() - callStartTime) / 1000);
    addDialogueMessage('user', userInput, userTimestamp, 95); // Simulate high confidence

    // Simulate AI processing flow based on scenario/input
    simulateAIResponse(userInput);
}

/**
 * 模拟AI处理和回复
 * @param {string} userInput - 用户输入文本
 */
function simulateAIResponse(userInput) {
    // Only proceed if call is connected
    if (callState !== 'connected') return;

    updateAIAssistantStatus('处理中');
    animateWaveform('user'); // Simulate listening to user

    // Simulate processing steps over time
    const processingTimes = {
        recognizing: 500,
        understanding: 700,
        searching: 1000,
        routing: 400,
        generating: 800
    };
    let totalProcessingTime = 0;

    // Determine simulated intent and routing based on input
    let simulatedIntent = { name: '未知意图', confidence: 80 };
    let simulatedRouting = { departments: ['待定'], priority: 5 };

    if (userInput.includes('噪音') || userInput.includes('太吵')) {
        simulatedIntent = { name: '噪音投诉', confidence: 96 };
        simulatedRouting = { departments: ['环保局', '城管局'], priority: 1 };
    } else if (userInput.includes('营业执照') || userInput.includes('怎么办证')) {
        simulatedIntent = { name: '证件办理咨询', confidence: 94 };
        simulatedRouting = { departments: ['政务服务中心'], priority: 2 };
    } else if (userInput.includes('受伤') || userInput.includes('紧急')) {
        simulatedIntent = { name: '紧急情况处理', confidence: 98 };
        simulatedRouting = { departments: ['公安局', '卫健委'], priority: 0 }; // Highest priority
    } else if (userInput.includes('乱停') || userInput.includes('停车') || userInput.includes('消防通道')) {
         simulatedIntent = { name: '违章停车举报', confidence: 95 };
         simulatedRouting = { departments: ['交警部门', '城管局'], priority: 1 };
    }
    // Add more intent/routing mappings as needed

    setTimeout(() => {
        // Only proceed if call is connected
        if (callState !== 'connected') return;
        updateAIProcessingStatus('🎯 意图识别', { intent: simulatedIntent, timing: { total: processingTimes.recognizing } });
        totalProcessingTime += processingTimes.recognizing;
        setTimeout(() => {
             // Only proceed if call is connected
             if (callState !== 'connected') return;
             updateAIProcessingStatus('📚 知识库检索', { knowledgeSearch: { query: userInput, results: 3, sources: ['政策库', '问答集'] }, timing: { total: processingTimes.understanding } });
             totalProcessingTime += processingTimes.understanding;
             setTimeout(() => {
                  // Only proceed if call is connected
                  if (callState !== 'connected') return;
                  updateAIProcessingStatus('🔍 信息匹配', { timing: { total: processingTimes.searching } });
                  totalProcessingTime += processingTimes.searching;
                  setTimeout(() => {
                       // Only proceed if call is connected
                       if (callState !== 'connected') return;
                       updateAIProcessingStatus('🎯 分流建议', { routing: simulatedRouting, timing: { total: processingTimes.routing } });
                       totalProcessingTime += processingTimes.routing;
                       setTimeout(() => {
                            // Only proceed if call is connected
                            if (callState !== 'connected') return;
                            updateAIProcessingStatus('📝 回复生成', { timing: { total: processingTimes.generating } });
                            totalProcessingTime += processingTimes.generating;
                            setTimeout(() => {
                                 // Only proceed if call is connected
                                 if (callState !== 'connected') return;
                                updateAIProcessingStatus('✅ 处理完成', { timing: { total: totalProcessingTime } });
                                simulateAIOutput(userInput);
                            }, processingTimes.generating);
                       }, processingTimes.routing);
                  }, processingTimes.searching);
             }, processingTimes.understanding);
        }, processingTimes.recognizing);
    }, 500); // Initial delay before processing starts
}

/**
 * 模拟AI的语音输出和转录
 * @param {string} userInput - 用户输入文本 (用于决定AI回复)
 */
function simulateAIOutput(userInput) {
    // Only proceed if call is connected
    if (callState !== 'connected') return;

     animateWaveform('ai');
     const aiTimestamp = Math.floor((Date.now() - callStartTime) / 1000);
     let aiResponse = '抱歉，我没有理解您的问题。'; // Default response

     // Simple logic to pick a response based on input (for demo)
     if (userInput.includes('噪音') || userInput.includes('太吵')) {
         aiResponse = '根据您反映的噪音问题，我为您分析了处理方案：您可以尝试与楼上邻居沟通，或联系物业。如问题持续，可以拨打环保热线12369。';
     } else if (userInput.includes('营业执照') || userInput.includes('怎么办证')) {
         aiResponse = '办理营业执照需要身份证明、场地证明等材料。具体流程和所需材料请参考政务服务中心指南。您可以在线查询或前往窗口办理。';
     } else if (userInput.includes('受伤') || userInput.includes('紧急')) {
          aiResponse = '检测到您可能遇到紧急情况！如果是生命安全紧急情况，请立即挂断并拨打110、120、119。如需继续咨询，请说"继续咨询"。';
     } else if (userInput.includes('乱停') || userInput.includes('停车') || userInput.includes('消防通道')) {
         aiResponse = '针对小区车辆乱停问题，特别是占用消防通道的情况，您可以联系物业管理处协调，或者拨打交通管理部门或城管部门的举报电话。通常可以拨打122交通事故报警电话或向当地城管部门反映。';
     }
     // Add more conditions for other scenarios

     addDialogueMessage('ai', aiResponse, aiTimestamp);
     animateWaveform('idle'); // AI finished speaking
     updateAIAssistantStatus('在线');
}

// --- Event Listeners ---

// Dialpad button clicks
dialpadButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Allow dialpad input only in idle state
        if (callState === 'idle') {
            phoneNumberInput.value += button.getAttribute('data-value');
        }
         // Play dialpad tone (optional, requires audio API)
         // const tone = new Audio(`tones/${button.getAttribute('data-value')}.mp3`);
         // tone.play();
    });
});

// Dial button click
dialButton.addEventListener('click', () => {
    // Only allow dialing in idle state
    if (callState === 'idle') {
        simulateCallStart();
    }
});

// Hangup button click
hangupButton.addEventListener('click', () => {
    // Allow hanging up if not already ended
    if (callState !== 'ended' && callState !== 'idle') {
        clearInterval(callDurationInterval);
         // Stop the waveform animation
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = null;

        updateCallStatus('已结束');
        addDialogueMessage('system', '通话已结束', Math.floor((Date.now() - callStartTime) / 1000));
        animateWaveform('idle');
        updateAIAssistantStatus('离线');
        // Optionally, reset after a short delay
        // setTimeout(resetDemo, 5000);
    }
});

// Restart button click
restartButton.addEventListener('click', resetDemo);

// Scenario button clicks
scenarioButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Only allow scenario selection when connected
        if (callState === 'connected') {
            const scenario = button.getAttribute('data-scenario');
            // For a simple demo, we'll just trigger a simulated user interaction based on the scenario
            let simulatedInput = '';
            if (scenario === 'noiseComplaint') {
                simulatedInput = '楼上邻居太吵了，我要投诉噪音。';
            } else if (scenario === 'parkingViolation') {
                 simulatedInput = '小区里有车乱停，堵住消防通道了。';
            } else if (scenario === 'emergency') {
                 simulatedInput = '有人受伤了，情况紧急！';
            } else if (scenario === 'documentProcess') {
                 simulatedInput = '请问怎么办营业执照？需要什么材料？';
            }
            simulateUserInteraction(simulatedInput);
        }
    });
});

// Volume control event listeners
userVolumeControl.addEventListener('input', (event) => {
    userVolumeValueSpan.textContent = `${event.target.value}%`;
    // In a real app, adjust user input volume
});

aiVolumeControl.addEventListener('input', (event) => {
    aiVolumeValueSpan.textContent = `${event.target.value}%`;
    // In a real app, adjust AI output volume (e.g., for TTS playback)
});

muteButton.addEventListener('click', () => {
    // Toggle mute state
    const isMuted = muteButton.textContent.includes('取消');
    if (isMuted) {
        muteButton.textContent = '🔇 静音';
        // Unmute audio input/output
    } else {
        muteButton.textContent = '🔊 取消静音';
        // Mute audio input/output
    }
});

pauseButton.addEventListener('click', () => {
     // Toggle pause state
    const isPaused = pauseButton.textContent.includes('继续');
    if (isPaused) {
        pauseButton.textContent = '⏸️ 暂停';
        // Resume simulation/audio
        if (callDurationInterval === null && callState === 'connected') {
             callDurationInterval = setInterval(updateCallDuration, 1000);
        }
         animateWaveform(aiAssistantStatus === '处理中' ? 'ai' : 'idle');
    } else {
        pauseButton.textContent = '▶️ 继续';
        // Pause simulation/audio
        clearInterval(callDurationInterval);
        animateWaveform('idle'); // Pause waveform animation
    }
});

// --- Initial Setup ---

// Draw initial waveform state (idle)
animateWaveform('idle');
updateButtonStates();

// Note: In a real application, you would initialize audio contexts,
// connect to ASR/TTS/NLU services, and handle real-time audio streams.
// This script provides a simplified simulation of the UI updates based on the PRD. 