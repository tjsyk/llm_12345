/**
 * @file script.js
 * @description 12345热线AI协同办公演示系统的前端交互逻辑。
 */

document.addEventListener('DOMContentLoaded', () => {
    const answerCallBtn = document.getElementById('answer-call');
    const hangupCallBtn = document.getElementById('hangup-call');
    const startDemoBtn = document.getElementById('start-demo');
    const resetDemoBtn = document.getElementById('reset-demo');
    const callTimeDisplay = document.getElementById('call-time');
    const conversationDisplay = document.getElementById('conversation-display');
    const problemCategory = document.getElementById('problem-category');
    const urgencyLevel = document.getElementById('urgency-level');
    const departmentSuggestions = document.getElementById('department-suggestions');
    const emotionLevel = document.getElementById('emotion-level');
    const emotionFill = document.getElementById('emotion-fill');
    const ticketId = document.getElementById('ticket-id');
    const ticketStatus = document.getElementById('ticket-status');
    const departmentTasks = document.getElementById('department-tasks');
    const flowSteps = document.querySelectorAll('.flow-steps .step');
    const callsToday = document.getElementById('calls-today');
    const callsTrend = document.getElementById('calls-trend');
    const ticketsInProgress = document.getElementById('tickets-in-progress');
    const ticketsTrend = document.getElementById('tickets-trend');
    const avgProcessingTime = document.getElementById('avg-processing-time');
    const avgTimeTrend = document.getElementById('avg-time-trend');
    const satisfactionRate = document.getElementById('satisfaction-rate');
    const satisfactionTrend = document.getElementById('satisfaction-trend');

    let callTimerInterval;
    let conversationIndex = 0;
    let callDuration = 0;
    let demoRunning = false;

    const conversationData = [
        { speaker: 'citizen', text: '您好，我想投诉我们小区物业管理不到位的问题，垃圾堆积了好几天没人清理。', delay: 1500 },
        { speaker: 'operator', text: '您好，请您详细说明一下具体情况，是哪个小区哪个位置呢？', delay: 2000 },
        { speaker: 'citizen', text: '是朝阳区XX小区3号楼后面的垃圾桶，味道太大了，严重影响我们生活。', delay: 2500 },
        { speaker: 'operator', text: '好的，我明白了。请问您贵姓，方便留下您的联系方式吗？我们核实后会尽快处理。', delay: 3000 },
        { speaker: 'citizen', text: '我姓王，电话138****1234。希望你们能尽快解决，这天气再下去就更麻烦了。', delay: 2500 }
    ];

    const aiAnalysisData = {
        problem: '物业管理投诉',
        urgency: { level: '中等紧急', class: 'medium' },
        departments: [
            { name: '住建委物业管理科', role: '主责' },
            { name: '朝阳区XX街道办', role: '协办' }
        ],
        emotion: { level: '轻微不满', fill: 35 }
    };

    const ticketData = {
        id: 'WD' + new Date().toISOString().slice(0,10).replace(/-/g,'') + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        status: '处理中',
        tasks: [
            { department: '住建委物业管理科', status: '已接收 - 调查中', progress: 60, estimated: '2个工作日' },
            { department: '朝阳区XX街道办', status: '配合调查', progress: 40, estimated: '1个工作日' }
        ]
    };

    // 初始和动态变化的看板数据
    let dashboardData = {
        calls: { current: 0, yesterday: 0 },
        tickets: { current: 0, yesterday: 0 },
        avgTime: { current: 0, beforeAI: 0 },
        satisfaction: { current: 0, beforeAI: 0 }
    };

    /**
     * @function updateCallTime
     * @description 更新通话时长显示。
     */
    function updateCallTime() {
        callDuration++;
        const minutes = Math.floor(callDuration / 60).toString().padStart(2, '0');
        const seconds = (callDuration % 60).toString().padStart(2, '0');
        callTimeDisplay.textContent = `00:${minutes}:${seconds}`;
    }

    /**
     * @function appendMessage
     * @param {string} speaker - 发言者类型 (citizen/operator)。
     * @param {string} text - 对话文本。
     * @description 向对话显示区域添加一条消息。
     */
    function appendMessage(speaker, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', speaker);
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        messageDiv.innerHTML = `<span class="speaker">${speaker === 'citizen' ? '市民' : '客服'}：</span><span class="content">${text}</span><span class="timestamp">${timestamp}</span>`;
        conversationDisplay.appendChild(messageDiv);
        conversationDisplay.scrollTop = conversationDisplay.scrollHeight; // 滚动到底部
    }

    /**
     * @function startConversationSimulation
     * @description 开始模拟对话。
     */
    function startConversationSimulation() {
        if (conversationIndex < conversationData.length) {
            const msg = conversationData[conversationIndex];
            appendMessage(msg.speaker, msg.text);
            conversationIndex++;
            setTimeout(startConversationSimulation, msg.delay);
        } else {
            // 对话结束后触发AI分析和工单生成
            updateAIAnalysis();
            generateTicket();
            // 对话结束后，模拟今日接听量增加，并更新看板
            dashboardData.calls.current++;
            dashboardData.tickets.current++; // 模拟有新的工单
            updateDashboardStats();
        }
    }

    /**
     * @function updateAIAnalysis
     * @description 更新AI智能分析面板。
     */
    function updateAIAnalysis() {
        problemCategory.textContent = aiAnalysisData.problem;
        urgencyLevel.textContent = aiAnalysisData.urgency.level;
        urgencyLevel.className = `urgency ${aiAnalysisData.urgency.class}`;

        departmentSuggestions.innerHTML = '';
        aiAnalysisData.departments.forEach(dept => {
            const li = document.createElement('li');
            li.className = dept.role === '主责' ? 'primary' : 'secondary';
            li.textContent = `${dept.name} (${dept.role})`;
            departmentSuggestions.appendChild(li);
        });

        emotionLevel.textContent = aiAnalysisData.emotion.level;
        emotionFill.style.width = `${aiAnalysisData.emotion.fill}%`;
    }

    /**
     * @function generateTicket
     * @description 生成并更新工单信息。
     */
    function generateTicket() {
        ticketId.textContent = `#${ticketData.id}`;
        ticketStatus.textContent = ticketData.status;
        ticketStatus.className = `status ${ticketData.status === '处理中' ? 'processing' : 'completed'}`;

        departmentTasks.innerHTML = '';
        ticketData.tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            taskItem.innerHTML = `
                <div class="department">${task.department}</div>
                <div class="task-status">${task.status}</div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${task.progress}%"></div>
                </div>
                <div class="estimated-time">预计完成：${task.estimated}</div>
            `;
            departmentTasks.appendChild(taskItem);
        });

        // 更新任务流转步骤
        flowSteps.forEach((step, index) => {
            if (index === 0) { // 工单创建
                step.classList.add('active');
            } else if (index === 1) { // 部门分配
                setTimeout(() => step.classList.add('active'), 1000);
            } else if (index === 2) { // 处理中
                setTimeout(() => step.classList.add('active'), 2000);
            } else if (index === 3) { // 结果反馈 (留待后续模拟完成)
                // setTimeout(() => step.classList.add('active'), 3000);
            }
        });
    }

    /**
     * @function updateDashboardStats
     * @description 更新数据统计看板，包括动态计算趋势。
     */
    function updateDashboardStats() {
        // 今日接听
        callsToday.textContent = dashboardData.calls.current.toLocaleString();
        let callsDiff = dashboardData.calls.current - dashboardData.calls.yesterday;
        if (dashboardData.calls.yesterday > 0) {
            let callsPercent = ((callsDiff / dashboardData.calls.yesterday) * 100).toFixed(1);
            callsTrend.textContent = `${callsDiff > 0 ? '↑' : '↓'} ${Math.abs(callsPercent)}% (昨日)`;
            callsTrend.className = `trend ${callsDiff > 0 ? 'up' : 'down'}`;
        } else {
            callsTrend.textContent = `(无对比数据)`;
            callsTrend.className = `trend`;
        }

        // 处理中工单
        ticketsInProgress.textContent = dashboardData.tickets.current;
        let ticketsDiff = dashboardData.tickets.current - dashboardData.tickets.yesterday;
        if (dashboardData.tickets.yesterday > 0) {
            let ticketsPercent = ((ticketsDiff / dashboardData.tickets.yesterday) * 100).toFixed(1);
            ticketsTrend.textContent = `${ticketsDiff > 0 ? '↑' : '↓'} ${Math.abs(ticketsPercent)}% (昨日)`;
            ticketsTrend.className = `trend ${ticketsDiff > 0 ? 'up' : 'down'}`;
        } else {
            ticketsTrend.textContent = `(无对比数据)`;
            ticketsTrend.className = `trend`;
        }

        // 平均处理时长 (模拟AI前后对比)
        avgProcessingTime.textContent = `${dashboardData.avgTime.current}天`;
        let avgTimeDiff = dashboardData.avgTime.beforeAI - dashboardData.avgTime.current; // 期望是下降，所以用beforeAI - current
        if (dashboardData.avgTime.beforeAI > 0) {
            let avgTimePercent = ((avgTimeDiff / dashboardData.avgTime.beforeAI) * 100).toFixed(1);
            avgTimeTrend.textContent = `${avgTimeDiff > 0 ? '↓' : '↑'} ${Math.abs(avgTimePercent)}% (AI前)`;
            avgTimeTrend.className = `trend ${avgTimeDiff > 0 ? 'down' : 'up'}`;
        } else {
            avgTimeTrend.textContent = `(无AI前数据)`;
            avgTimeTrend.className = `trend`;
        }

        // 满意度 (模拟AI前后对比)
        satisfactionRate.textContent = `${dashboardData.satisfaction.current}%`;
        let satisfactionDiff = dashboardData.satisfaction.current - dashboardData.satisfaction.beforeAI; // 期望是上升
        if (dashboardData.satisfaction.beforeAI > 0) {
            let satisfactionPercent = ((satisfactionDiff / dashboardData.satisfaction.beforeAI) * 100).toFixed(1);
            satisfactionTrend.textContent = `${satisfactionDiff > 0 ? '↑' : '↓'} ${Math.abs(satisfactionPercent)}% (AI前)`;
            satisfactionTrend.className = `trend ${satisfactionDiff > 0 ? 'up' : 'down'}`;
        } else {
            satisfactionTrend.textContent = `(无AI前数据)`;
            satisfactionTrend.className = `trend`;
        }
    }

    /**
     * @function resetDemo
     * @description 重置演示状态并初始化数据看板。
     */
    function resetDemo() {
        clearInterval(callTimerInterval);
        demoRunning = false;
        callDuration = 0;
        conversationIndex = 0;

        // 初始化通话相关显示
        callTimeDisplay.textContent = '00:00:00';
        conversationDisplay.innerHTML = '';

        // 初始化AI分析面板
        problemCategory.textContent = '待分析';
        urgencyLevel.className = 'urgency';
        urgencyLevel.textContent = '';
        departmentSuggestions.innerHTML = '';
        emotionLevel.textContent = '待分析';
        emotionFill.style.width = '0%';

        // 初始化工单协同面板
        ticketId.textContent = '#WDYYYYMMDDXXXX';
        ticketStatus.textContent = '待生成';
        ticketStatus.className = 'status';
        departmentTasks.innerHTML = '';
        flowSteps.forEach(step => step.classList.remove('active'));

        // 初始化数据统计看板数据和显示，模拟一些初始值
        dashboardData = {
            calls: { current: 1200, yesterday: 1100 },
            tickets: { current: 100, yesterday: 95 },
            avgTime: { current: 2.5, beforeAI: 3.5 }, // 模拟AI后处理时长减少
            satisfaction: { current: 90, beforeAI: 85 } // 模拟AI后满意度提升
        };
        updateDashboardStats(); // 首次更新看板以显示初始值

        answerCallBtn.disabled = false;
        hangupCallBtn.disabled = true;
        startDemoBtn.disabled = false;
    }

    /**
     * @function startDemo
     * @description 开始整个演示流程。
     */
    function startDemo() {
        if (demoRunning) return;
        demoRunning = true;

        resetDemo(); // 确保从干净状态开始

        answerCallBtn.disabled = false;
        hangupCallBtn.disabled = true;

        // 模拟来电响铃，等待用户点击接听
        setTimeout(() => {
            alert('有新的来电！'); // 简单的来电提示
        }, 500);
    }

    answerCallBtn.addEventListener('click', () => {
        answerCallBtn.disabled = true;
        hangupCallBtn.disabled = false;
        callTimerInterval = setInterval(updateCallTime, 1000);
        startConversationSimulation();
    });

    hangupCallBtn.addEventListener('click', () => {
        clearInterval(callTimerInterval);
        demoRunning = false;
        alert('通话已结束。');
        hangupCallBtn.disabled = true;

        // 模拟工单完成
        ticketStatus.textContent = '已完成';
        ticketStatus.className = 'status completed';
        flowSteps[3].classList.add('active'); // 标记结果反馈为完成

        // 模拟数据看板的最终更新 (假设一通电话导致工单处理完成)
        // calls.current 已经在 startConversationSimulation 增加了
        dashboardData.tickets.current--; // 工单处理完成，处理中工单减少
        dashboardData.avgTime.current = parseFloat((dashboardData.avgTime.current * 0.95).toFixed(1)); // 模拟平均处理时长进一步优化
        dashboardData.satisfaction.current = parseFloat((dashboardData.satisfaction.current * 1.02).toFixed(1)); // 模拟满意度进一步提升
        updateDashboardStats();

    });

    startDemoBtn.addEventListener('click', startDemo);
    resetDemoBtn.addEventListener('click', resetDemo);

    // 页面加载时初始化页面状态和数据看板
    resetDemo();
}); 