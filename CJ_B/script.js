/**
 * 模拟数据：通话信息
 */
const mockCallData = {
    caller: {
        phone: "138****5678",
        name: "李女士",
        location: "北京市朝阳区",
        vipLevel: "VIP",
        callHistory: 2
    },
    conversation: [
        { speaker: "citizen", content: "你好，我想咨询一下房产证办理的问题，我的房子是去年买的，但是到现在还没有拿到房产证。", timestamp: "14:25:45", confidence: 0.96, emotion: { sentiment: "negative", intensity: 0.6, emotions: ["焦虑"] }, entities: [{ type: "issue", value: "房产证办理" }, { type: "time", value: "去年" }] },
        { speaker: "ai", content: "🤖 AI提示: 检测到\"房产证办理\"关键词，已为您准备相关政策和办理流程", timestamp: "14:25:50", confidence: 1, isTip: true },
        { speaker: "agent", content: "您好李女士，我来帮您查询一下房产证办理的相关情况。请问您当时是否收到了开发商的办理通知？", timestamp: "14:26:02", confidence: 1 },
        { speaker: "ai", content: "💡 AI建议: \"李女士，根据您的情况，房产证办理一般需要15个工作日。请问您当时是否收到了开发商的办理通知？我帮您查询一下具体进度。\"", timestamp: "14:26:05", confidence: 0.95, isSuggestion: true },
        { speaker: "ai", content: "💡 AI建议: \"您好，房产证延迟可能有几种原因，我需要了解一些具体信息来帮您分析...\"", timestamp: "14:26:06", confidence: 0.87, isSuggestion: true },
        { speaker: "citizen", content: "没有收到通知。开发商那边一直说在办，但是总推脱。", timestamp: "14:26:15", confidence: 0.94, emotion: { sentiment: "negative", intensity: 0.7, emotions: ["不满"] }, entities: [{ type: "organization", value: "开发商" }] },
         { speaker: "ai", content: "🧠 知识推荐: 《不动产登记暂行条例实施细则》第XX条：开发商应在XX日内提供办理材料。", timestamp: "14:26:20", confidence: 0.91, isKnowledge: true },
        { speaker: "agent", content: "我理解您的心情，这种情况确实比较让人着急。根据规定，开发商确实有义务在一定时间内提供相关材料协助业主办理房产证。", timestamp: "14:26:35", confidence: 1 },
        { speaker: "ai", content: "💡 AI建议: \"我理解您的担心，根据规定，开发商在商品房交付后60日内应提交资料协助办理。请问您是否可以提供购房合同信息，我帮您进一步查询开发商的办理状态？\"", timestamp: "14:26:40", confidence: 0.92, isSuggestion: true },
        { speaker: "citizen", content: "好的，合同在我旁边，我看一下...", timestamp: "14:26:55", confidence: 0.98 },
        { speaker: "agent", content: "好的，您慢慢找。", timestamp: "14:27:00", confidence: 1 }
    ],
     contextAnalysis: [
        { type: "intent", content: "识别意图: 房产证办理咨询 (96%)" },
        { type: "emotion", content: "情绪分析: 略显焦虑 😟 (担心程度: 中)" },
        { type: "entities", content: "关键实体: 时间: 去年购买, 问题: 房产证未到手, 客户: 李女士 (VIP), 组织: 开发商" },
        { type: "progress", content: "对话进展: 问题描述: ✓ 已完成, 信息收集: 🔄 进行中, 解决方案: ⏳ 待提供, 结果确认: ⏳ 待完成" },
        { type: "next-step", content: "建议下一步: 查询具体办理进度，了解购房合同信息" }
     ],
     knowledge: [
         { type: "policy", content: "📋 相关政策文档: 《不动产登记暂行条例实施细则》" },
         { type: "policy", content: "📋 相关政策文档: 《房产证办理指南2024版》" },
         { type: "policy", content: "📋 相关政策文档: 《购房合同备案查询办法》" },
         { type: "procedure", content: "📝 办理流程: 准备材料 → 网上预约 → 提交申请 → 缴纳费用 → 等待审核" },
         { type: "faq", content: "⚠️ 常见问题: 开发商未办理初始登记, 购房合同未备案, 房屋存在抵押情况" }
     ],
     similarCases: [
         { title: "开发商延迟办证", details: "时间: 2024-01-10, 问题: 购房2年未拿到房产证, 解决: 联系开发商，协助催办, 结果: 15天后成功拿证" },
         { title: "房屋抵押影响办证", details: "时间: 2024-01-08, 问题: 开发商未解除抵押, 解决: 指导客户通过法律途径维权, 结果: 通过调解成功解决" }
     ]
};

/**
 * 获取DOM元素
 */
const elements = {
    btnAnswer: document.getElementById('btn-answer'),
    btnHangup: document.getElementById('btn-hangup'),
    callerInfo: document.getElementById('caller-info'),
    customerInfo: document.getElementById('customer-info'),
    transcriptContent: document.getElementById('transcript-content'),
    transcriptConfidence: document.getElementById('transcript-confidence'),
    knowledgeContent: document.getElementById('knowledge-content'),
    suggestionsContent: document.getElementById('suggestions-content'),
    contextAnalysisContent: document.getElementById('context-analysis-content'),
    similarCases: document.getElementById('similar-cases'),
    policyContent: document.getElementById('policy-content'),
    queryInput: document.getElementById('query-input'),
    btnQuery: document.getElementById('btn-query'),
    queryResults: document.getElementById('query-results'),
    onlineDuration: document.getElementById('online-duration'),
    callsToday: document.getElementById('calls-today'),
    resolutionRate: document.getElementById('resolution-rate'),
    serviceScore: document.getElementById('service-score')
};

let currentCall = null; // 当前通话状态
let messageIndex = 0; // 当前播放到对话的哪条消息
let onlineTimer = null; // 上线计时器
let durationSeconds = 0; // 上线时长秒数
let callsCount = 0; // 今日接听数

/**
 * 格式化时间为 HH:MM:SS
 * @param {number} totalSeconds - 总秒数
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * 更新上线时长显示
 */
function updateOnlineDuration() {
    durationSeconds++;
    elements.onlineDuration.textContent = formatTime(durationSeconds);
}

/**
 * 开始模拟通话
 */
function startCall() {
    currentCall = mockCallData;
    messageIndex = 0;
    callsCount++;

    // 更新坐席信息
    if (elements.callsToday) elements.callsToday.textContent = callsCount;
    // TODO: 更新解决率和服务评分 (需要更多模拟数据或逻辑)

    // 更新来电和客户信息
    if (elements.callerInfo) elements.callerInfo.innerHTML = `号码: ${currentCall.caller.phone}<br>归属地: ${currentCall.caller.location}<br>来电时间: ${new Date().toLocaleTimeString()}<br>历史通话: ${currentCall.caller.callHistory}次`;
    if (elements.customerInfo) elements.customerInfo.innerHTML = `姓名: ${currentCall.caller.name}<br>身份: 已验证 ✓<br>标签: ${currentCall.caller.vipLevel}`;

    // 清空转录和AI区域
    if (elements.transcriptContent) elements.transcriptContent.innerHTML = '';
    if (elements.knowledgeContent) elements.knowledgeContent.innerHTML = '等待对话开始...';
    if (elements.suggestionsContent) elements.suggestionsContent.innerHTML = '等待对话开始...';
    if (elements.contextAnalysisContent) elements.contextAnalysisContent.innerHTML = '等待对话开始...';
    if (elements.similarCases) elements.similarCases.innerHTML = '暂无相似案例';
    if (elements.policyContent) elements.policyContent.innerHTML = '等待对话开始...';
    if (elements.queryResults) elements.queryResults.innerHTML = '';

    // 启用/禁用按钮
    if (elements.btnAnswer) elements.btnAnswer.disabled = true;
    if (elements.btnHangup) elements.btnHangup.disabled = false;
    if (elements.btnMute) elements.btnMute.disabled = false;
    if (elements.btnHold) elements.btnHold.disabled = false;
    if (elements.btnTransfer) elements.btnTransfer.disabled = false;
    if (elements.btnRecord) elements.btnRecord.disabled = false;
    if (elements.btnTicket) elements.btnTicket.disabled = false;
    if (elements.btnQuery) elements.btnQuery.disabled = false;
    if (elements.queryInput) elements.queryInput.disabled = false;

    // 模拟对话消息和AI更新
    simulateConversation();
}

/**
 * 模拟对话过程，逐条显示消息和AI辅助内容
 */
function simulateConversation() {
    if (!currentCall || messageIndex >= currentCall.conversation.length) {
        return; // 对话结束
    }

    const message = currentCall.conversation[messageIndex];
    const messageElement = document.createElement('div');
    messageElement.classList.add('transcript-message');

    if (message.isTip) {
        messageElement.classList.add('ai-tip');
        messageElement.textContent = message.content;
         // 显示知识推荐
        displayKnowledge(currentCall.knowledge);
         // 显示相似案例
        displaySimilarCases(currentCall.similarCases);
         // 显示相关政策
        displayPolicies(currentCall.knowledge.filter(item => item.type === 'policy'));
    } else if (message.isSuggestion) {
         // 显示建议回复
         displaySuggestions(currentCall.conversation.slice(messageIndex)); // 从当前消息开始找建议
    }
    else {
        messageElement.innerHTML = `<span class="speaker-${message.speaker}">${message.speaker === 'citizen' ? '👤 市民' : '👨‍💼 坐席'} [${message.timestamp}]:</span> <span class="message-content">${message.content}</span>`;
        elements.transcriptConfidence.textContent = `置信度: ${message.confidence * 100}%`;

        // 如果是市民的消息，更新上下文分析
        if (message.speaker === 'citizen') {
             displayContextAnalysis(currentCall.contextAnalysis);
        }
    }

    // 只添加非建议/非提示消息到转录区，建议和提示会单独处理显示
     if (!message.isTip && !message.isSuggestion) {
        elements.transcriptContent.appendChild(messageElement);
        // 滚动到底部
        elements.transcriptContent.scrollTop = elements.transcriptContent.scrollHeight;
     }


    messageIndex++;

    // 模拟下一条消息的延迟
    setTimeout(simulateConversation, Math.random() * 1500 + 500); // 随机延迟0.5到2秒
}

/**
 * 显示知识推荐内容
 * @param {Array<object>} knowledgeItems - 知识条目数组
 */
function displayKnowledge(knowledgeItems) {
    elements.knowledgeContent.innerHTML = ''; // 清空旧内容
     const nonPolicyKnowledge = knowledgeItems.filter(item => item.type !== 'policy');
    if (nonPolicyKnowledge.length === 0) {
         elements.knowledgeContent.innerHTML = '暂无相关知识推荐';
         return;
    }
    nonPolicyKnowledge.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('knowledge-item');
        itemElement.innerHTML = `<strong>${item.type === 'procedure' ? '📝 办理流程' : '⚠️ 常见问题'} :</strong> ${item.content}`;
        elements.knowledgeContent.appendChild(itemElement);
    });
}

/**
 * 显示相关政策法规
 * @param {Array<object>} policyItems - 政策条目数组
 */
function displayPolicies(policyItems) {
    elements.policyContent.innerHTML = ''; // 清空旧内容
     if (policyItems.length === 0) {
         elements.policyContent.innerHTML = '暂无相关政策法规';
         return;
     }
    policyItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('policy-item');
         itemElement.innerHTML = `<strong>📄 ${item.content.split(':')[0]} :</strong> ${item.content.split(': ')[1]} <button class="use-suggestion-btn" data-content="${item.content.split(': ')[1]}">[复制条文]</button>`;
        elements.policyContent.appendChild(itemElement);
    });
}

/**
 * 显示建议回复
 * @param {Array<object>} messages - 从当前消息开始的对话消息
 */
function displaySuggestions(messages) {
     elements.suggestionsContent.innerHTML = ''; // 清空旧内容
     const suggestionMessages = messages.filter(msg => msg.isSuggestion);
     if (suggestionMessages.length === 0) {
         //elements.suggestionsContent.innerHTML = '暂无回复建议'; // 不清空，等下一条建议
         return;
     }

     suggestionMessages.forEach((suggestion, index) => {
         const suggestionElement = document.createElement('div');
         suggestionElement.classList.add('suggestion-item');
         suggestionElement.innerHTML = `<strong>💡 AI建议 ${index + 1}:</strong> ${suggestion.content.replace('💡 AI建议: ', '')} <button class="use-suggestion-btn" data-content="${suggestion.content.replace('💡 AI建议: ', '')}">[使用此回复]</button>`;
         elements.suggestionsContent.appendChild(suggestionElement);
     });
}

/**
 * 显示上下文分析结果
 * @param {Array<object>} analysisItems - 分析结果数组
 */
function displayContextAnalysis(analysisItems) {
     elements.contextAnalysisContent.innerHTML = ''; // 清空旧内容
     if (analysisItems.length === 0) {
         elements.contextAnalysisContent.innerHTML = '等待对话开始...';
         return;
     }
    analysisItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('context-analysis-item');
        itemElement.innerHTML = `<strong>🎯 ${item.content.split(':')[0]} :</strong> ${item.content.split(': ')[1]}`;
        elements.contextAnalysisContent.appendChild(itemElement);
    });
}

/**
 * 显示相似案例
 * @param {Array<object>} caseItems - 案例数组
 */
function displaySimilarCases(caseItems) {
     elements.similarCases.innerHTML = ''; // 清空旧内容
     if (caseItems.length === 0) {
         elements.similarCases.innerHTML = '暂无相似案例';
         return;
     }
    caseItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('case-item');
        itemElement.innerHTML = `<strong>📁 案例: ${item.title} :</strong> ${item.details}`;
        elements.similarCases.appendChild(itemElement);
    });
}


/**
 * 结束通话
 */
function endCall() {
    currentCall = null;
    messageIndex = 0;

    // 更新转录和AI区域为结束状态
    elements.transcriptContent.innerHTML += '<div class="ai-tip">---- 通话结束 ----</div>';
    elements.knowledgeContent.innerHTML = '等待通话接入...';
    elements.suggestionsContent.innerHTML = '等待通话接入...';
    elements.contextAnalysisContent.innerHTML = '等待通话接入...';
     elements.similarCases.innerHTML = '暂无相似案例';
     elements.policyContent.innerHTML = '等待通话接入...';
     elements.queryResults.innerHTML = '';

     // 更新来电和客户信息
    elements.callerInfo.innerHTML = `号码: 待接入<br>归属地: -<br>来电时间: -<br>历史通话: -`;
    elements.customerInfo.innerHTML = `姓名: -<br>身份: 未验证<br>标签: -`;


    // 启用/禁用按钮
    elements.btnAnswer.disabled = false;
    elements.btnHangup.disabled = true;
    elements.btnMute.disabled = true;
    elements.btnHold.disabled = true;
    elements.btnTransfer.disabled = true;
    elements.btnRecord.disabled = true;
    elements.btnTicket.disabled = true;
    elements.btnQuery.disabled = true;
    elements.queryInput.disabled = true;
    elements.queryInput.value = '';
}

/**
 * 处理建议回复按钮点击
 * @param {Event} event - 点击事件对象
 */
function handleSuggestionClick(event) {
    const content = event.target.dataset.content;
    if (content) {
        // 模拟坐席使用了建议回复，添加到转录区
         const messageElement = document.createElement('div');
         messageElement.classList.add('transcript-message', 'agent-response');
         messageElement.innerHTML = `<span class="speaker-agent">👨‍💼 坐席 [${new Date().toLocaleTimeString()}]:</span> <span class="message-content">${content}</span>`;
         elements.transcriptContent.appendChild(messageElement);
         // 滚动到底部
         elements.transcriptContent.scrollTop = elements.transcriptContent.scrollHeight;

         // 清空建议回复区域，模拟使用后建议消失
         elements.suggestionsContent.innerHTML = ''; // 清空旧内容
         elements.suggestionsContent.innerHTML = '暂无回复建议'; // 留下提示文本

         // TODO: 可以在这里触发模拟对话的下一阶段或AI的进一步分析
         console.log("坐席使用了建议回复:", content);
    }
}

/**
 * 处理快速查询按钮点击 (模拟功能)
 */
function handleQuickQuery() {
    const query = elements.queryInput.value.trim();
    elements.queryResults.innerHTML = ''; // 清空旧结果

    if (query) {
        elements.queryResults.innerHTML = `正在模拟查询: "<strong>${query}</strong>"...`;
        // 模拟异步查询延迟
        setTimeout(() => {
            elements.queryResults.innerHTML = '';
            // 模拟查询结果 (这里简化处理，只显示一个硬编码结果)
             const mockResult = `<strong>查询结果:</strong> 找到关于"${query}"的政策文件《模拟政策文件》。`;
             const resultElement = document.createElement('div');
             resultElement.classList.add('query-result-item');
             resultElement.innerHTML = mockResult;
             elements.queryResults.appendChild(resultElement);

        }, 1000); // 模拟1秒延迟
    } else {
        elements.queryResults.innerHTML = '请输入查询内容。';
    }
}

/**
 * 初始化函数
 */
function init() {
    // 启动上线计时器
    onlineTimer = setInterval(updateOnlineDuration, 1000);

    // 添加事件监听器
    elements.btnAnswer.addEventListener('click', startCall);
    elements.btnHangup.addEventListener('click', endCall);

    // 监听建议回复区域的点击事件，使用事件委托
    elements.suggestionsContent.addEventListener('click', function(event) {
        if (event.target.classList.contains('use-suggestion-btn')) {
            handleSuggestionClick(event);
        }
    });

     // 监听相关政策区域的复制条文按钮点击事件
     elements.policyContent.addEventListener('click', function(event) {
        if (event.target.classList.contains('use-suggestion-btn')) {
             const content = event.target.dataset.content;
             if (content) {
                 // 模拟复制到剪贴板 (实际应用需要更复杂的权限处理)
                 navigator.clipboard.writeText(content).then(() => {
                     alert('政策条文已复制到剪贴板！');
                 }).catch(err => {
                     console.error('复制失败:', err);
                     alert('复制失败，请手动复制。');
                 });
             }
        }
     });


     // 快速查询按钮事件
     elements.btnQuery.addEventListener('click', handleQuickQuery);
     // 快速查询输入框回车事件
     elements.queryInput.addEventListener('keypress', function(event) {
         if (event.key === 'Enter') {
             handleQuickQuery();
         }
     });

    // 初始化按钮状态
     if (elements.btnHangup) elements.btnHangup.disabled = true;
     if (elements.btnMute) elements.btnMute.disabled = true;
     if (elements.btnHold) elements.btnHold.disabled = true;
     if (elements.btnTransfer) elements.btnTransfer.disabled = true;
     if (elements.btnRecord) elements.btnRecord.disabled = true;
     if (elements.btnTicket) elements.btnTicket.disabled = true;
     if (elements.btnQuery) elements.btnQuery.disabled = true;
     if (elements.queryInput) elements.queryInput.disabled = true;
     if (elements.queryInput) elements.queryInput.value = '';
}

// 页面加载完成后执行初始化
// window.addEventListener('load', init);
document.addEventListener('DOMContentLoaded', init); 