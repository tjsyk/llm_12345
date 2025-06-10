/**
 * AI实时质检教练系统演示脚本
 * 实现通话模拟、实时质检提醒、质检报告生成等功能
 */

class QualityCoachDemo {
    constructor() {
        this.isRunning = false;
        this.currentStep = 0;
        this.callStartTime = null;
        this.callTimer = null;
        this.qualityAlerts = [];
        this.positiveMarks = [];
        this.violations = [];
        
        this.init();
    }

    /**
     * 初始化演示系统
     */
    init() {
        this.bindEvents();
        this.setupInitialState();
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 控制按钮事件
        document.getElementById('startDemo').addEventListener('click', () => {
            console.log('开始演示按钮被点击');
            this.startDemo();
        });
        document.getElementById('resetDemo').addEventListener('click', () => {
            console.log('重置按钮被点击');
            this.resetDemo();
        });
        document.getElementById('generateReport').addEventListener('click', () => {
            console.log('生成报告按钮被点击');
            this.generateQualityReport();
        });
        
        // 演示要点功能
        const pointsBtn = document.getElementById('pointsBtn');
        const pointsCloseBtn = document.getElementById('pointsCloseBtn');
        const pointsPopupOverlay = document.getElementById('pointsPopupOverlay');
        
        pointsBtn?.addEventListener('click', () => this.showPointsPopup());
        pointsCloseBtn?.addEventListener('click', () => this.hidePointsPopup());
        pointsPopupOverlay?.addEventListener('click', (e) => {
            if (e.target === pointsPopupOverlay) {
                this.hidePointsPopup();
            }
        });
        
        // 通话控制事件
        document.getElementById('answerBtn').addEventListener('click', () => this.answerCall());
        document.getElementById('hangupBtn').addEventListener('click', () => this.hangupCall());
        
        // 模态框事件
        document.getElementById('closeReportModal').addEventListener('click', () => this.closeReportModal());
        document.getElementById('closeReportBtn').addEventListener('click', () => this.closeReportModal());
        document.getElementById('exportReportBtn').addEventListener('click', () => this.exportReport());
        
        // 点击模态框外部关闭
        document.getElementById('reportModal').addEventListener('click', (e) => {
            if (e.target.id === 'reportModal') {
                this.closeReportModal();
            }
        });
    }

    /**
     * 设置初始状态
     */
    setupInitialState() {
        this.updateAgentStatus('待机中');
        this.updateQualityStatus('待机');
        this.updateCallTime('00:00');
        this.resetQualityIndicator();
    }

    /**
     * 开始演示
     */
     async startDemo() {
        if (this.isRunning) {
            console.log('演示已在运行中，忽略重复启动');
            return;
        }
        
        console.log('开始演示流程');
        this.isRunning = true;
        this.currentStep = 0;
        
        // 更新控制按钮状态
        const startBtn = document.getElementById('startDemo');
        if (startBtn) {
            startBtn.textContent = '🎬 演示中...';
            startBtn.disabled = true;
        }
        
        // 开始演示流程
        await this.runDemoSequence();
        
        // 演示完成后更新按钮状态
        if (startBtn) {
            startBtn.textContent = '✅ 演示完成';
            startBtn.disabled = true;
        }
    }

    /**
     * 重置演示
     */
    resetDemo() {
        console.log('重置演示开始...'); // 调试信息
        
        // 强制停止演示
        this.isRunning = false;
        this.currentStep = 0;
        
        // 重置控制按钮
        const startBtn = document.getElementById('startDemo');
        if (startBtn) {
            startBtn.textContent = '▶️ 开始演示';
            startBtn.disabled = false;
        }
        document.getElementById('generateReport').style.display = 'none';
        
        // 停止通话计时器
        if (this.callTimer) {
            clearInterval(this.callTimer);
            this.callTimer = null;
        }
        
        // 重置界面状态
        this.setupInitialState();
        this.clearConversation();
        this.clearQualityAlerts();
        this.resetMetrics();
        this.resetComplianceChecklist();
        this.updateHints('准备接听市民来电...');
        this.resetSupervisorPanel();
        
        // 重置数据
        this.qualityAlerts = [];
        this.positiveMarks = [];
        this.violations = [];
        this.callStartTime = null;
        
        // 重置通话按钮
        document.getElementById('answerBtn').style.display = 'inline-block';
        document.getElementById('hangupBtn').style.display = 'none';
        document.getElementById('recordingIndicator').style.display = 'none';
        
        // 重置班长面板的坐席状态
        const activeAgent = document.querySelector('.agent-card.active');
        if (activeAgent) {
            const statusElement = activeAgent.querySelector('.agent-call-status');
            const badgeElement = activeAgent.querySelector('.quality-badge');
            if (statusElement) statusElement.textContent = '待机';
            if (badgeElement) {
                badgeElement.textContent = '--';
                badgeElement.className = 'quality-badge';
            }
        }
        
        // 重置实时质检窗口
        const qualityWindow = document.getElementById('realtimeQuality');
        if (qualityWindow) {
            qualityWindow.className = 'realtime-quality-window';
        }
        
        console.log('重置演示完成'); // 调试信息
    }

    /**
     * 运行演示序列
     */
    async runDemoSequence() {
        // 演示场景步骤
        const demoSteps = [
            () => this.step1_PrepareCall(),
            () => this.step2_StartCall(),
            () => this.step3_OpeningViolation(),
            () => this.step4_ImproperLanguage(),
            () => this.step5_SpeechAnalysis(),
            () => this.step6_PositiveBehavior(),
            () => this.step7_EndCall()
        ];

        for (let i = 0; i < demoSteps.length; i++) {
            if (!this.isRunning) break;
            
            this.currentStep = i;
            await demoSteps[i]();
            
            // 步骤间暂停
            if (i < demoSteps.length - 1) {
                await this.delay(2000);
            }
        }
    }

    /**
     * 步骤1: 准备接听电话
     */
    async step1_PrepareCall() {
        if (!this.isRunning) return;
        
        this.updateAgentStatus('有来电');
        this.updateHints('有市民来电，准备接听...');
        
        // 模拟来电铃声效果
        await this.delay(1000);
        
        if (!this.isRunning) return;
        
        // 自动点击接听
        this.answerCall();
    }

    /**
     * 步骤2: 开始通话
     */
    async step2_StartCall() {
        if (!this.isRunning) return;
        
        this.updateAgentStatus('通话中');
        this.updateQualityStatus('监控中');
        this.updateHints('开始质检监控，注意开场白规范...');
        
        // 开始录音指示
        document.getElementById('recordingIndicator').style.display = 'flex';
        
        // 更新班长面板的坐席状态
        this.updateSupervisorAgentStatus('通话中');
        this.updateSupervisorStats();
        
        await this.delay(1000);
    }

    /**
     * 步骤3: 开场白违规提醒
     */
    async step3_OpeningViolation() {
        if (!this.isRunning) return;
        
        // 坐席说了不规范的开场白
        this.addMessage('agent', '喂，您好。');
        
        await this.delay(500);
        if (!this.isRunning) return;
        
        // AI实时提醒
        this.showQualityAlert('warning', '💡 提醒：缺少标准开场白（问候+报号）。');
        this.setQualityIndicator('warning', '⚠️', '需要纠正');
        this.updateViolation('开场白不合规', '00:05');
        
        // 在班长面板显示违规事件
        this.showSupervisorAlert('小王(008)', 'warning', '开场白不规范提醒');
        
        await this.delay(1500);
        if (!this.isRunning) return;
        
        // 坐席立即纠正
        this.addMessage('agent', '哦，不好意思。您好，这里是12345热线，工号008号小王为您服务。请问有什么可以帮您？');
        this.updateComplianceItem('标准开场白', 'completed');
        
        // 清除警告状态
        await this.delay(1000);
        if (!this.isRunning) return;
        
        this.setQualityIndicator('normal', '✅', '服务正常');
        this.updateHints('开场白已纠正，继续监控...');
    }

    /**
     * 步骤4: 不当用语监测
     */
    async step4_ImproperLanguage() {
        if (!this.isRunning) return;
        
        // 市民问题
        this.addMessage('citizen', '我的医保卡好像出问题了，上周去药店买药，怎么刷都刷不了！');
        
        await this.delay(1500);
        if (!this.isRunning) return;
        
        // 坐席使用不当用语
        const agentMessage = '医保卡刷不了啊… <span class="highlight">你必须</span>带上身份证和医保卡，去最近的社保中心查一下。';
        this.addMessage('agent', agentMessage, true);
        
        await this.delay(800);
        if (!this.isRunning) return;
        
        // AI提醒不当用语
        this.showQualityAlert('warning', '⚠️ 不当用语："你必须…"。建议替换为："我们建议您…"或"您需要…"。');
        this.updateViolation('不当用语："你必须"', '01:15');
        this.updateComplianceItem('服务用语规范', 'failed');
        this.updateSupervisorStats(); // 更新班长面板统计
        
        // 在班长面板显示违规事件
        this.showSupervisorAlert('小王(008)', 'warning', '不当用语："你必须"');
        
        await this.delay(1000);
        if (!this.isRunning) return;
        
        this.updateHints('检测到不当用语，建议使用更温和的表达...');
    }

    /**
     * 步骤5: 语音特征分析
     */
    async step5_SpeechAnalysis() {
        if (!this.isRunning) return;
        
        // 市民回复
        this.addMessage('citizen', '社保中心？我不知道在哪啊，我这附近有吗？我年纪大了，跑一趟不方便。');
        
        await this.delay(1500);
        if (!this.isRunning) return;
        
        // 坐席语速过快
        this.addMessage('agent', '您在哪个区我帮您查一下最近的地址和上班时间很快的。');
        
        // 实时更新语音分析数据
        this.updateMetrics({
            speechRate: '180 字/分钟',
            volume: '65 dB',
            tone: '偏快'
        });
        
        this.updateEmotion('agent', '😤 急躁');
        this.updateEmotion('citizen', '😕 困惑');
        
        await this.delay(800);
        if (!this.isRunning) return;
        
        // AI提醒语速问题
        this.showQualityAlert('warning', '💨 语速稍快，建议放慢，并耐心解释。');
        this.updateViolation('语速过快', '01:45');
        this.updateSupervisorStats(); // 更新班长面板统计
        
        // 在班长面板显示违规事件
        this.showSupervisorAlert('小王(008)', 'warning', '语速过快提醒');
        
        await this.delay(1000);
        if (!this.isRunning) return;
        
        this.updateHints('语速分析：当前180字/分钟，建议控制在120-150字/分钟...');
    }

    /**
     * 步骤6: 优秀服务行为
     */
    async step6_PositiveBehavior() {
        if (!this.isRunning) return;
        
        // 坐席调整服务态度
        this.addMessage('agent', '好的阿姨，您别着急。我放慢点说。您只要告诉我您大概在哪个街道，我就能帮您找到最近、最方便的社保中心，还会告诉您他们的工作时间，确保您不用白跑一趟。');
        
        // 更新语音分析
        this.updateMetrics({
            speechRate: '140 字/分钟',
            volume: '58 dB',
            tone: '温和'
        });
        
        this.updateEmotion('agent', '😊 耐心');
        this.updateEmotion('citizen', '😌 安心');
        
        await this.delay(1000);
        if (!this.isRunning) return;
        
        // AI标记优秀行为
        this.showQualityAlert('success', '👍 优秀行为：主动安抚，并提供了清晰、增值的服务承诺。');
        this.setQualityIndicator('normal', '✅', '服务正常');
        this.updatePositiveMark('主动安抚并提供增值服务', '02:10');
        this.updateComplianceItem('服务用语规范', 'completed');
        
        // 在班长端显示优秀标记
        this.showSupervisorAlert('小王(008)', 'positive', '获得优秀服务标记');
        this.updateSupervisorStats(); // 更新班长面板统计
        
        await this.delay(1500);
        if (!this.isRunning) return;
        
        this.updateHints('检测到优秀服务行为，已标记为培训案例...');
    }

    /**
     * 步骤7: 结束通话
     */
    async step7_EndCall() {
        if (!this.isRunning) return;
        
        // 继续对话模拟
        this.addMessage('citizen', '好的，谢谢您！我在朝阳区建国门附近。');
        await this.delay(1000);
        if (!this.isRunning) return;
        
        this.addMessage('agent', '好的阿姨，建国门这边最近的是朝阳区社保中心，地址是建国门外大街。工作时间是周一到周五上午9点到下午5点。您可以坐地铁1号线到建国门站，A口出来就是。');
        await this.delay(1500);
        if (!this.isRunning) return;
        
        this.addMessage('citizen', '太好了，谢谢小王！你们服务真好。');
        await this.delay(1000);
        if (!this.isRunning) return;
        
        this.addMessage('agent', '不客气阿姨，这是我应该做的。还有其他问题可以随时联系我们12345热线。祝您生活愉快！');
        
        this.updateComplianceItem('问题解答完整', 'completed');
        
        await this.delay(2000);
        if (!this.isRunning) return;
        
        // 自动挂断
        this.hangupCall();
        
        // 更新班长面板显示通话结束状态
        this.updateSupervisorAgentStatus('空闲');
        
        // 显示质检报告按钮
        document.getElementById('generateReport').style.display = 'inline-block';
        this.updateHints('通话结束，可生成质检报告进行复盘...');
    }

    /**
     * 接听电话
     */
    answerCall() {
        document.getElementById('answerBtn').style.display = 'none';
        document.getElementById('hangupBtn').style.display = 'inline-block';
        
        // 开始通话计时
        this.callStartTime = new Date();
        this.startCallTimer();
    }

    /**
     * 挂断电话
     */
    hangupCall() {
        document.getElementById('answerBtn').style.display = 'inline-block';
        document.getElementById('hangupBtn').style.display = 'none';
        document.getElementById('recordingIndicator').style.display = 'none';
        
        // 停止通话计时
        if (this.callTimer) {
            clearInterval(this.callTimer);
            this.callTimer = null;
        }
        
        this.updateAgentStatus('空闲');
        this.updateQualityStatus('待机');
    }

    /**
     * 开始通话计时器
     */
    startCallTimer() {
        this.callTimer = setInterval(() => {
            if (this.callStartTime) {
                const elapsed = Math.floor((new Date() - this.callStartTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                this.updateCallTime(timeStr);
            }
        }, 1000);
    }

    /**
     * 添加对话消息
     */
    addMessage(sender, content, hasWarning = false) {
        const messageList = document.getElementById('messageList');
        const placeholder = messageList.querySelector('.conversation-placeholder');
        
        // 移除占位符
        if (placeholder) {
            placeholder.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}${hasWarning ? ' warning' : ''}`;
        messageDiv.innerHTML = content;
        
        messageList.appendChild(messageDiv);
        messageList.scrollTop = messageList.scrollHeight;
    }

    /**
     * 清空对话记录
     */
    clearConversation() {
        const messageList = document.getElementById('messageList');
        messageList.innerHTML = '<div class="conversation-placeholder">点击"开始演示"开始通话...</div>';
    }

    /**
     * 显示质检提醒
     */
    showQualityAlert(type, content) {
        const alertsContainer = document.getElementById('qualityAlerts');
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `quality-alert ${type}`;
        alertDiv.textContent = content;
        
        alertsContainer.appendChild(alertDiv);
        
        // 保存到质检记录
        this.qualityAlerts.push({
            type,
            content,
            time: this.getCurrentCallTime()
        });
        
        // 自动清除旧提醒（保持最多3条）
        setTimeout(() => {
            if (alertsContainer.children.length > 3) {
                alertsContainer.removeChild(alertsContainer.firstChild);
            }
        }, 5000);
    }

    /**
     * 清空质检提醒
     */
    clearQualityAlerts() {
        document.getElementById('qualityAlerts').innerHTML = '';
    }

    /**
     * 设置质检指示器状态
     */
    setQualityIndicator(status, icon, text) {
        const indicator = document.getElementById('qualityIndicator');
        const iconElement = indicator.querySelector('.indicator-icon');
        const textElement = indicator.querySelector('.indicator-text');
        const window = document.getElementById('realtimeQuality');
        
        // 移除所有状态类
        window.className = 'realtime-quality-window';
        indicator.className = 'quality-indicator';
        
        // 添加新状态
        window.classList.add(status);
        indicator.classList.add(status);
        
        iconElement.textContent = icon;
        textElement.textContent = text;
    }

    /**
     * 重置质检指示器
     */
    resetQualityIndicator() {
        this.setQualityIndicator('normal', '✅', '服务正常');
    }

    /**
     * 更新实时指标
     */
    updateMetrics(metrics) {
        if (metrics.speechRate) {
            document.getElementById('speechRate').textContent = metrics.speechRate;
        }
        if (metrics.volume) {
            document.getElementById('volume').textContent = metrics.volume;
        }
        if (metrics.tone) {
            document.getElementById('tone').textContent = metrics.tone;
        }
    }

    /**
     * 重置指标
     */
    resetMetrics() {
        this.updateMetrics({
            speechRate: '-- 字/分钟',
            volume: '-- dB',
            tone: '正常'
        });
        this.updateEmotion('agent', '😐 中性');
        this.updateEmotion('citizen', '😐 中性');
    }

    /**
     * 更新情绪分析
     */
    updateEmotion(target, emotion) {
        const elementId = target === 'agent' ? 'agentEmotion' : 'citizenEmotion';
        document.getElementById(elementId).textContent = emotion;
    }

    /**
     * 更新规范性检查项
     */
    updateComplianceItem(itemText, status) {
        const items = document.querySelectorAll('.compliance-item');
        
        items.forEach(item => {
            const text = item.querySelector('.item-text').textContent;
            if (text === itemText) {
                item.className = `compliance-item ${status}`;
                const checkbox = item.querySelector('.checkbox');
                
                switch (status) {
                    case 'completed':
                        checkbox.textContent = '✅';
                        break;
                    case 'failed':
                        checkbox.textContent = '❌';
                        break;
                    case 'pending':
                        checkbox.textContent = '⏳';
                        break;
                }
            }
        });
    }

    /**
     * 重置规范性检查清单
     */
    resetComplianceChecklist() {
        const items = ['标准开场白', '服务用语规范', '问题解答完整'];
        items.forEach(item => {
            this.updateComplianceItem(item, 'pending');
        });
    }

    /**
     * 显示班长端提醒
     */
    showSupervisorAlert(agent, type, text) {
        const eventsList = document.getElementById('eventsList');
        
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-item';
        eventDiv.innerHTML = `
            <div class="event-time">${this.getCurrentTime()}</div>
            <div class="event-content">
                <span class="agent-tag">${agent}</span>
                <span class="event-text ${type}">${text}</span>
            </div>
        `;
        
        // 插入到顶部
        eventsList.insertBefore(eventDiv, eventsList.firstChild);
        
        // 保持最多5条记录
        while (eventsList.children.length > 5) {
            eventsList.removeChild(eventsList.lastChild);
        }
    }

    /**
     * 更新状态显示
     */
    updateAgentStatus(status) {
        document.getElementById('agentStatus').textContent = status;
    }

    updateQualityStatus(status) {
        document.getElementById('qualityStatus').textContent = status;
    }

    updateCallTime(time) {
        document.getElementById('callTime').textContent = time;
    }

    updateHints(hint) {
        const hintsContent = document.querySelector('.hints-content');
        hintsContent.innerHTML = `<div class="hint-item">${hint}</div>`;
    }

    /**
     * 记录违规事件
     */
    updateViolation(violation, time) {
        this.violations.push({
            violation,
            time,
            type: 'warning'
        });
        
        // 更新班长面板中的质检分数
        this.updateQualityScore();
    }

    /**
     * 记录优秀表现
     */
    updatePositiveMark(behavior, time) {
        this.positiveMarks.push({
            behavior,
            time,
            type: 'success'
        });
        
        // 更新班长面板中的质检分数
        this.updateQualityScore();
    }
    
    /**
     * 更新质检分数显示
     */
    updateQualityScore() {
        const score = this.calculateQualityScore();
        const activeAgent = document.querySelector('.agent-card.active');
        if (activeAgent) {
            const badgeElement = activeAgent.querySelector('.quality-badge');
            if (badgeElement) {
                badgeElement.textContent = score + '分';
                badgeElement.className = `quality-badge ${score >= 90 ? 'excellent' : score >= 80 ? 'good' : ''}`;
            }
        }
    }

    /**
     * 生成质检报告
     */
    generateQualityReport() {
        const reportContent = this.createReportContent();
        document.getElementById('reportContent').innerHTML = reportContent;
        document.getElementById('reportModal').style.display = 'flex';
    }

    /**
     * 创建报告内容
     */
    createReportContent() {
        const score = this.calculateQualityScore();
        const callDuration = this.getCallDuration();
        
        return `
            <div class="report-section">
                <h4>📊 综合评分</h4>
                <div class="score-display" style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 48px; font-weight: bold; color: ${score >= 90 ? '#27ae60' : score >= 80 ? '#f39c12' : '#e74c3c'};">${score}分</div>
                    <div style="color: #6c757d; margin-top: 5px;">${this.getScoreLevel(score)}</div>
                </div>
            </div>

            <div class="report-section">
                <h4>📈 得分详情</h4>
                <div class="score-breakdown">
                    <div class="score-item">
                        <span>流程规范</span>
                        <span>85分</span>
                    </div>
                    <div class="score-item">
                        <span>沟通技巧</span>
                        <span>90分</span>
                    </div>
                    <div class="score-item">
                        <span>服务态度</span>
                        <span>92分</span>
                    </div>
                    <div class="score-item">
                        <span>业务能力</span>
                        <span>88分</span>
                    </div>
                </div>
            </div>

            <div class="report-section">
                <h4>⏰ 问题事件时间轴</h4>
                <div class="timeline">
                    ${this.violations.map(v => `
                        <div class="timeline-item warning">
                            <span class="time-mark">[${v.time}]</span>
                            <span class="event-desc">🔴 ${v.violation}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="report-section">
                <h4>✨ 亮点表现</h4>
                <div class="timeline">
                    ${this.positiveMarks.map(p => `
                        <div class="timeline-item success">
                            <span class="time-mark">[${p.time}]</span>
                            <span class="event-desc">🟢 ${p.behavior}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="report-section">
                <h4>🤖 AI综合点评</h4>
                <div class="ai-summary">
                    <p>本次服务整体流畅，业务解答准确。通话时长${callDuration}，服务态度良好。</p>
                    <p><strong>主要优点：</strong></p>
                    <ul>
                        <li>能够及时纠正开场白不规范问题</li>
                        <li>主动安抚市民情绪，提供增值服务</li>
                        <li>业务解答准确、详细</li>
                    </ul>
                    <p><strong>改进建议：</strong></p>
                    <ul>
                        <li>加强《标准服务话术》的学习，避免使用"你必须"等强制性用语</li>
                        <li>注意控制语速，特别是面对老年人等特殊群体时</li>
                        <li>开场白应一次性规范，避免需要纠正</li>
                    </ul>
                    <p><strong>培训建议：</strong>参加下一期"温暖服务沟通技巧"培训课程。</p>
                </div>
            </div>

            <style>
                .report-section { margin-bottom: 25px; }
                .report-section h4 { 
                    color: #2c3e50; 
                    margin-bottom: 15px; 
                    padding-bottom: 8px; 
                    border-bottom: 2px solid #ecf0f1; 
                }
                .score-breakdown { display: flex; flex-direction: column; gap: 8px; }
                .score-item { 
                    display: flex; 
                    justify-content: space-between; 
                    padding: 8px 12px; 
                    background: #f8f9fa; 
                    border-radius: 6px; 
                }
                .timeline { display: flex; flex-direction: column; gap: 8px; }
                .timeline-item { 
                    display: flex; 
                    gap: 10px; 
                    padding: 8px; 
                    border-radius: 6px; 
                }
                .timeline-item.warning { background: #fff5f5; border-left: 3px solid #ff6b6b; }
                .timeline-item.success { background: #f0f9ff; border-left: 3px solid #27ae60; }
                .time-mark { 
                    font-family: monospace; 
                    font-weight: bold; 
                    color: #6c757d; 
                    min-width: 60px; 
                }
                .event-desc { flex: 1; }
                .ai-summary { 
                    background: #f8f9fa; 
                    padding: 15px; 
                    border-radius: 8px; 
                    line-height: 1.6; 
                }
                .ai-summary ul { margin: 8px 0; padding-left: 20px; }
                .ai-summary li { margin-bottom: 4px; }
            </style>
        `;
    }

    /**
     * 计算质检评分
     */
    calculateQualityScore() {
        let baseScore = 100;
        
        // 违规扣分
        this.violations.forEach(violation => {
            if (violation.violation.includes('开场白')) {
                baseScore -= 5;
            } else if (violation.violation.includes('不当用语')) {
                baseScore -= 8;
            } else if (violation.violation.includes('语速')) {
                baseScore -= 4;
            }
        });
        
        // 优秀表现加分
        this.positiveMarks.forEach(() => {
            baseScore += 3;
        });
        
        return Math.max(60, Math.min(100, baseScore));
    }

    /**
     * 获取评分等级
     */
    getScoreLevel(score) {
        if (score >= 95) return '优秀';
        if (score >= 90) return '良好';
        if (score >= 80) return '合格';
        if (score >= 70) return '待改进';
        return '不合格';
    }

    /**
     * 获取通话时长
     */
    getCallDuration() {
        const callTimeElement = document.getElementById('callTime');
        return callTimeElement.textContent || '03:24';
    }

    /**
     * 关闭报告模态框
     */
    closeReportModal() {
        document.getElementById('reportModal').style.display = 'none';
    }

    /**
     * 导出报告
     */
    exportReport() {
        alert('📤 质检报告已导出到本地文件系统');
    }

    /**
     * 获取当前通话时间
     */
    getCurrentCallTime() {
        if (!this.callStartTime) return '00:00';
        
        const elapsed = Math.floor((new Date() - this.callStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * 获取当前时间
     */
    getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    /**
     * 更新班长面板的坐席状态
     */
    updateSupervisorAgentStatus(status) {
        const activeAgent = document.querySelector('.agent-card.active');
        if (activeAgent) {
            const statusElement = activeAgent.querySelector('.agent-call-status');
            if (statusElement) {
                statusElement.textContent = status;
            }
        }
    }

    /**
     * 更新班长面板统计数据
     */
    updateSupervisorStats() {
        // 更新当前通话数
        const currentCallsElement = document.querySelector('.stat-item .stat-value');
        if (currentCallsElement && currentCallsElement.textContent === '15') {
            // 演示过程中动态更新
            if (this.isRunning) {
                currentCallsElement.textContent = '16';
            }
        }
        
        // 更新违规提醒数
        const violationStats = document.querySelectorAll('.stat-item .stat-value');
        if (violationStats.length >= 3) {
            const violationCount = violationStats[2];
            if (violationCount) {
                violationCount.textContent = this.violations.length.toString();
            }
        }
        
        // 更新优秀标记数
        if (violationStats.length >= 4) {
            const positiveCount = violationStats[3];
            if (positiveCount) {
                positiveCount.textContent = (12 + this.positiveMarks.length).toString();
            }
        }
    }

    /**
     * 重置班长面板
     */
    resetSupervisorPanel() {
        // 重置事件列表为初始状态
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = `
            <div class="event-item">
                <div class="event-time">14:23</div>
                <div class="event-content">
                    <span class="agent-tag">小张(010)</span>
                    <span class="event-text positive">获得优秀服务标记</span>
                </div>
            </div>
            <div class="event-item">
                <div class="event-time">14:20</div>
                <div class="event-content">
                    <span class="agent-tag">小李(009)</span>
                    <span class="event-text warning">语速过快提醒</span>
                </div>
            </div>
        `;
        
        // 重置统计数据
        const statValues = document.querySelectorAll('.stat-value');
        const defaultValues = ['15', '89%', '3', '12'];
        statValues.forEach((element, index) => {
            if (defaultValues[index]) {
                element.textContent = defaultValues[index];
            }
        });
    }

    /**
     * 延迟函数
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 显示演示要点弹窗
     */
    showPointsPopup() {
        const overlay = document.getElementById('pointsPopupOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    /**
     * 隐藏演示要点弹窗
     */
    hidePointsPopup() {
        const overlay = document.getElementById('pointsPopupOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
}

// 页面加载完成后初始化演示系统
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，初始化演示系统...');
    window.qualityCoachDemo = new QualityCoachDemo();
    console.log('演示系统初始化完成');
});
