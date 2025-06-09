/**
 * @fileoverview 12345热线AI语音助手演示Demo页面的核心交互逻辑和动画控制。
 * @author Cursor
 */

// 模拟数据：对话脚本
const conversationScript = [
    { speaker: 'ai', text: '嘟…您好！这里是12345政务服务热线。通过来电号码识别，请问是尾号为5678的王先生吗？', duration: 3000, analysis: 'step1' },
    { speaker: 'citizen', text: '对，是我。', duration: 1000 },
    { speaker: 'ai', text: '王先生您好！系统记录显示您上个月曾咨询过关于办理准生证的事宜。请问今天来电，是想咨询关于新生儿落户的问题吗？', duration: 4500, analysis: 'step2' },
    { speaker: 'citizen', text: '哇，太厉害了，就是这个事！对，我想问问给我刚出生的宝宝办户口，都需要准备些什么材料？', duration: 4000 },
    { speaker: 'ai', text: '好的，很高兴能帮到您。为您查询到了本市新生儿落户所需的最新材料清单。请问您和您的配偶户口都在本市吗？这会影响所需材料的类型。', duration: 5000, analysis: 'step3' },
    { speaker: 'citizen', text: '哦对，我们俩户口都在，都是本市的。', duration: 2000 },
    { speaker: 'ai', text: '好的，对于双方均为本市户籍的情况，您需要准备以下五项核心材料：第一，父母双方的身份证原件；第二，父母双方的户口本原件；第三，父母的结婚证；第四，孩子的《出生医学证明》；第五，由您或您的配偶…', duration: 6000 },
    { speaker: 'citizen', text: '等等，结婚证？我的结婚证好像找不到了，这可怎么办？能补办吗？补办结婚证这个事是归你们管还是我得问民政局？', duration: 6000, analysis: 'step4' },
    { speaker: 'ai', text: '我理解您现在可能有些着急。补办结婚证属于民政部门的业务范围。12345热线可以为您提供相关的政策咨询。您现在的需求已经变更为"咨询补办结婚证流程"，并涉及到"民政局"这个具体部门。我可以直接为您转接到民政局的专业人工客服，由他们为您提供最权威的解答。需要现在为您转接吗？', duration: 10000 },
    { speaker: 'citizen', text: '好，太好了，那赶紧帮我转过去吧！', duration: 2500 },
    { speaker: 'ai', text: '好的，正在为您转接至民政局专席，请稍候。在转接前，我已将刚才提到的"新生儿落户材料清单"以短信形式发送到了您尾号为5678的手机上，方便您随时查阅。感谢您的来电，祝您生活愉快！', duration: 9000, analysis: 'step5', sms: '【12345热线】王先生您好，您所需的新生儿落户材料清单如下：\n1. 父母双方身份证原件\n2. 父母双方户口本原件\n3. 父母结婚证\n4. 孩子《出生医学证明》\n5. （此项需进一步咨询）'}
];

// 模拟数据：AI分析点
const analysisPoints = {
    step1: {
        title: '个性化识别',
        content: '通过来电号码识别出老用户王先生<br/><strong>系统判断为老用户</strong>'
    },
    step2: {
        title: '历史关联与预测',
        content: '基于"准生证"咨询，预测本次意图为"<strong>新生儿落户</strong>"'
    },
    step3: {
        title: '精准问答 / 澄清式提问',
        content: 'AI直接从知识库提取信息，并主动提问关键变量（<strong>户籍情况</strong>）以提供更精准答案'
    },
    step4: {
        title: '话题切换识别 / 意图与实体识别 / 智能路由决策',
        content: 'AI精准捕捉用户问题已从"新生儿落户"转移到"补办结婚证"。\n<br/>新意图：<strong>补办结婚证流程</strong>\n<br/>新实体：<strong>民政局</strong>\n<br/><strong>智能IVR判断并建议直接转接</strong>'
    },
    step5: {
        title: '多模态协同 / 任务闭环',
        content: 'AI处理语音同时调用短信接口，实现"<strong>语音+文本</strong>"协同服务。\n<br/>问题以文本形式固化，服务周到。'
    }
};

// 获取DOM元素
const dialogueArea = document.querySelector('.dialogue-area');
const analysisCard = document.querySelector('.ai-analysis-card');
const analysisContent = document.querySelector('.ai-analysis-card .analysis-content');
const smsPopup = document.querySelector('.sms-popup');
const smsContent = document.querySelector('.sms-content');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const callTimeSpan = document.querySelector('.call-time');

// 演示状态变量
let currentStep = 0;
let isPlaying = false;
let callTimerInterval;
let callSeconds = 0;

/**
 * 添加对话气泡到对话区域。
 * @param {string} speaker - 发言者 ('ai' 或 'citizen')。
 * @param {string} text - 对话文本。
 * @returns {Promise<void>}
 */
function addMessageBubble(speaker, text) {
    return new Promise(resolve => {
        const bubble = document.createElement('div');
        bubble.classList.add('message-bubble', `${speaker}-message`);
        dialogueArea.appendChild(bubble);
        dialogueArea.scrollTop = dialogueArea.scrollHeight; // 滚动到底部

        // 直接显示文字，不使用打字机效果
        bubble.textContent = text;
        gsap.to(bubble, { opacity: 1, y: 0, duration: 0.3, onComplete: resolve });
        dialogueArea.scrollTop = dialogueArea.scrollHeight; // 滚动到底部
    });
}

/**
 * 显示AI分析卡片。
 * @param {object} analysisData - 包含title和content的分析数据。
 */
function showAnalysisCard(analysisData) {
    analysisCard.style.display = 'block';
    analysisCard.querySelector('h3').textContent = analysisData.title;
    analysisContent.innerHTML = analysisData.content;
    gsap.to(analysisCard, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
}

/**
 * 隐藏AI分析卡片。
 */
function hideAnalysisCard() {
    gsap.to(analysisCard, { opacity: 0, scale: 0.8, duration: 0.3, onComplete: () => {
        analysisCard.style.display = 'none';
    }});
}

/**
 * 显示短信弹窗。
 * @param {string} text - 短信内容。
 */
function showSmsPopup(text) {
    smsContent.textContent = text;
    smsPopup.classList.add('active');
    // 持续一段时间后自动隐藏
    setTimeout(() => {
        hideSmsPopup();
    }, 5000);
}

/**
 * 隐藏短信弹窗。
 */
function hideSmsPopup() {
    smsPopup.classList.remove('active');
}

/**
 * 更新通话时间。
 */
function updateCallTime() {
    callSeconds++;
    const minutes = String(Math.floor(callSeconds / 60)).padStart(2, '0');
    const seconds = String(callSeconds % 60).padStart(2, '0');
    callTimeSpan.textContent = `通话中 ${minutes}:${seconds}`;
}

/**
 * 启动或暂停通话计时器。
 * @param {boolean} start - 是否启动计时器。
 */
function toggleCallTimer(start) {
    if (start) {
        if (!callTimerInterval) {
            callTimerInterval = setInterval(updateCallTime, 1000);
        }
    } else {
        clearInterval(callTimerInterval);
        callTimerInterval = null;
    }
}

/**
 * 执行演示的下一步。
 */
async function nextStep() {
    if (currentStep >= conversationScript.length) {
        // 演示结束
        isPlaying = false;
        toggleCallTimer(false);
        startBtn.textContent = '▶️ 开始演示';
        return;
    }

    const stepData = conversationScript[currentStep];

    // 隐藏之前的分析卡片（如果存在）
    if (currentStep > 0 && conversationScript[currentStep - 1].analysis) {
        hideAnalysisCard();
    }

    // 添加对话气泡
    await addMessageBubble(stepData.speaker, stepData.text);

    // 显示AI分析卡片
    if (stepData.analysis && analysisPoints[stepData.analysis]) {
        showAnalysisCard(analysisPoints[stepData.analysis]);
    }

    // 显示短信弹窗
    if (stepData.sms) {
        showSmsPopup(stepData.sms);
    }

    currentStep++;

    if (isPlaying) {
        // 自动播放下一条
        setTimeout(nextStep, stepData.duration + 500); // 增加一些间隔时间
    }
}

/**
 * 开始或暂停演示。
 */
function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        startBtn.textContent = '⏸️ 暂停演示';
        toggleCallTimer(true);
        if (currentStep === 0) {
            // 初始状态，开始电话接通音（可选）
            // ... 添加音效逻辑
        }
        nextStep();
    } else {
        startBtn.textContent = '▶️ 开始演示';
        toggleCallTimer(false);
    }
}

/**
 * 重置演示。
 */
function resetDemo() {
    isPlaying = false;
    currentStep = 0;
    callSeconds = 0;
    toggleCallTimer(false);
    callTimeSpan.textContent = '通话中 00:00:00';
    startBtn.textContent = '▶️ 开始演示';
    dialogueArea.innerHTML = ''; // 清空对话
    hideAnalysisCard();
    hideSmsPopup();
    // 恢复初始界面或"拨打12345"的初始画面 (当前为空，可以添加初始欢迎语或图片)
}



// 事件监听器
startBtn.addEventListener('click', togglePlay);
resetBtn.addEventListener('click', resetDemo);

// 初始状态设置
resetDemo(); 