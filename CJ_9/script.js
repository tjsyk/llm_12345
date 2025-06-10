/**
 * 场景9：对话式数据分析演示脚本
 * 实现智能数据分析平台的交互功能
 */

class DataAnalysisDemo {
    constructor() {
        this.currentStep = 0;
        this.isRunning = false;
        this.conversationHistory = [];
        this.reportData = [];
        
        this.init();
    }

    /**
     * 初始化组件和事件监听器
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
        document.getElementById('startBtn').addEventListener('click', () => this.startDemo());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetDemo());
        document.getElementById('pointsBtn').addEventListener('click', () => this.showPoints());
        
        // 推荐问题卡片点击事件
        document.querySelectorAll('.question-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleQuestionCard(e));
        });
        
        // 发送消息事件
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('questionInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // 弹窗关闭事件
        document.getElementById('pointsCloseBtn').addEventListener('click', () => this.hidePoints());
        document.getElementById('pointsPopupOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.hidePoints();
        });
        
        // 报告按钮事件
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadReport());
        document.getElementById('shareBtn').addEventListener('click', () => this.shareReport());
    }

    /**
     * 设置初始状态
     */
    setupInitialState() {
        this.disableInputs();
        this.hideAllSections();
        document.getElementById('analysisPlatform').style.display = 'block';
    }

    /**
     * 开始演示
     */
    async startDemo() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.currentStep = 0;
        this.enableInputs();
        
        // 更新按钮状态
        document.getElementById('startBtn').textContent = '🎯 演示进行中...';
        document.getElementById('startBtn').disabled = true;
        
        await this.executeDemo();
    }

    /**
     * 执行演示流程
     */
    async executeDemo() {
        const steps = [
            () => this.showWelcomeMessage(),
            () => this.simulateFirstQuestion(),
            () => this.simulateSecondQuestion(),
            () => this.simulateThirdQuestion(),
            () => this.generateReport()
        ];
        
        for (let i = 0; i < steps.length; i++) {
            await this.delay(2000);
            await steps[i]();
            this.currentStep++;
        }
        
        this.completeDemo();
    }

    /**
     * 显示欢迎消息
     */
    async showWelcomeMessage() {
        await this.addAIMessage(
            '欢迎使用12345热线智能数据分析平台！我将为您演示如何通过自然语言交互获取深度数据洞察。让我们从一个简单的问题开始...'
        );
    }

    /**
     * 模拟第一个问题：上周热线整体情况
     */
    async simulateFirstQuestion() {
        const question = "上周热线整体情况怎么样？";
        await this.simulateUserQuestion(question);
        
        await this.delay(1500);
        
        const response = `
            <div class="data-card">
                <h4>📊 上周（6月3日-6月9日）热线运行概况</h4>
                <div class="data-metrics">
                    <div class="metric-item">
                        <span class="metric-value">85,430</span>
                        <div class="metric-label">通话总量</div>
                        <div class="metric-change positive">环比上升 5.2%</div>
                    </div>
                    <div class="metric-item">
                        <span class="metric-value">91.5%</span>
                        <div class="metric-label">综合满意度</div>
                        <div class="metric-change negative">较前周 -0.8%</div>
                    </div>
                    <div class="metric-item">
                        <span class="metric-value">88.2%</span>
                        <div class="metric-label">首次解决率</div>
                        <div class="metric-change positive">较前周 +1.5%</div>
                    </div>
                </div>
                <div class="chart-container">
                    <h5>📈 通话量和满意度趋势</h5>
                    <div id="trendChart" class="echarts-container"></div>
                </div>
                <p><strong>热点问题：</strong>主要集中在"中考招生政策咨询"和"夏季市容环境投诉"</p>
            </div>
        `;
        
        await this.addAIMessage(response);
        
        // 渲染趋势图表
        setTimeout(() => {
            this.renderTrendChart();
        }, 500);
        
        this.reportData.push({
            question: question,
            response: "上周数据概览",
            key_metrics: ["通话量85,430通", "满意度91.5%", "首次解决率88.2%"]
        });
    }

    /**
     * 模拟第二个问题：满意度下降分析
     */
    async simulateSecondQuestion() {
        const question = "为什么满意度下降了？具体是哪些方面的问题？";
        await this.simulateUserQuestion(question);
        
        await this.delay(2000);
        
        const response = `
            <div class="data-card">
                <h4>🔍 满意度下降归因分析</h4>
                <p>通过对低分（不满意）工单的文本内容进行AI聚类分析，发现导致满意度下降的主要原因：</p>
                <div class="data-metrics">
                    <div class="metric-item">
                        <span class="metric-value">45%</span>
                        <div class="metric-label">处理时效过长</div>
                        <div class="metric-change">老旧小区加装电梯</div>
                    </div>
                    <div class="metric-item">
                        <span class="metric-value">30%</span>
                        <div class="metric-label">解决方案无效</div>
                        <div class="metric-change">共享单车乱停放</div>
                    </div>
                    <div class="metric-item">
                        <span class="metric-value">15%</span>
                        <div class="metric-label">服务态度问题</div>
                        <div class="metric-change">社保卡补办咨询</div>
                    </div>
                </div>
                <div class="chart-container">
                    <h5>🥧 问题原因分布饼图</h5>
                    <div id="pieChart" class="pie-chart-container"></div>
                </div>
            </div>
        `;
        
        await this.addAIMessage(response);
        
        // 渲染饼图
        setTimeout(() => {
            this.renderPieChart();
        }, 500);
        
        this.reportData.push({
            question: question,
            response: "满意度下降原因分析",
            key_findings: ["处理时效过长45%", "解决方案无效30%", "服务态度15%"]
        });
    }

    /**
     * 模拟第三个问题：部门处理时效排名
     */
    async simulateThirdQuestion() {
        const question = "把处理时效最长的工单按承办部门列个排名";
        await this.simulateUserQuestion(question);
        
        await this.delay(1500);
        
        const response = `
            <div class="data-card">
                <h4>⏱️ 各部门工单平均处理时长排行榜 (TOP 5)</h4>
                <table class="ranking-table">
                    <thead>
                        <tr>
                            <th>排名</th>
                            <th>承办部门</th>
                            <th>平均处理时长</th>
                            <th>超时率</th>
                            <th>主要问题类型</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span class="rank-number">1</span></td>
                            <td>住建委</td>
                            <td>18.5天</td>
                            <td>35%</td>
                            <td>老旧小区改造</td>
                        </tr>
                        <tr>
                            <td><span class="rank-number">2</span></td>
                            <td>规自局</td>
                            <td>15.2天</td>
                            <td>28%</td>
                            <td>违建拆除</td>
                        </tr>
                        <tr>
                            <td><span class="rank-number">3</span></td>
                            <td>人社局</td>
                            <td>9.8天</td>
                            <td>15%</td>
                            <td>劳动仲裁</td>
                        </tr>
                        <tr>
                            <td><span class="rank-number">4</span></td>
                            <td>交通委</td>
                            <td>7.3天</td>
                            <td>12%</td>
                            <td>道路维护</td>
                        </tr>
                        <tr>
                            <td><span class="rank-number">5</span></td>
                            <td>环保局</td>
                            <td>5.1天</td>
                            <td>8%</td>
                            <td>噪音投诉</td>
                        </tr>
                    </tbody>
                </table>
                <p><strong>💡 关键洞察：</strong>住建委在老旧小区改造类工单处理上存在明显瓶颈，建议重点关注流程优化。</p>
            </div>
        `;
        
        await this.addAIMessage(response);
        this.reportData.push({
            question: question,
            response: "部门处理时效排名",
            key_insight: "住建委处理时长最长（18.5天），需要流程优化"
        });
    }

    /**
     * 生成报告
     */
    async generateReport() {
        const question = "把刚才我们聊的这些，给我生成一份关于上周服务质量问题的分析报告，要PPT格式的";
        await this.simulateUserQuestion(question);
        
        await this.delay(1000);
        await this.addAIMessage("好的！我正在为您生成专业的分析报告，请稍候...");
        
        // 显示报告生成区域
        document.getElementById('reportSection').style.display = 'block';
        
        await this.animateReportGeneration();
    }

    /**
     * 动画演示报告生成过程
     */
    async animateReportGeneration() {
        const statusElement = document.getElementById('reportStatus');
        const progressElement = document.getElementById('progressFill');
        const previewElement = document.getElementById('reportPreview');
        
        const steps = [
            { text: "正在分析对话内容...", progress: 20 },
            { text: "正在提取关键数据...", progress: 40 },
            { text: "正在生成图表...", progress: 60 },
            { text: "正在撰写分析报告...", progress: 80 },
            { text: "正在生成PPT格式...", progress: 100 }
        ];
        
        for (const step of steps) {
            statusElement.textContent = step.text;
            progressElement.style.width = step.progress + '%';
            await this.delay(1500);
        }
        
        // 显示报告预览
        previewElement.innerHTML = `
            <div style="text-align: left;">
                <h4>📋 12345热线服务质量分析报告（6月3日-6月9日）</h4>
                <br>
                <p><strong>📊 第一页 - 数据概览：</strong></p>
                <ul>
                    <li>通话总量：85,430通（环比+5.2%）</li>
                    <li>综合满意度：91.5%（较前周-0.8%）</li>
                    <li>首次解决率：88.2%（较前周+1.5%）</li>
                </ul>
                <br>
                <p><strong>🔍 第二页 - 问题分析：</strong></p>
                <ul>
                    <li>处理时效过长：45%（老旧小区加装电梯）</li>
                    <li>解决方案无效：30%（共享单车乱停放）</li>
                    <li>服务态度问题：15%（社保卡补办咨询）</li>
                </ul>
                <br>
                <p><strong>📈 第三页 - 部门效能：</strong></p>
                <ul>
                    <li>住建委平均处理时长：18.5天（需重点关注）</li>
                    <li>规自局平均处理时长：15.2天</li>
                    <li>人社局平均处理时长：9.8天</li>
                </ul>
                <br>
                <p><strong>💡 第四页 - 改进建议：</strong></p>
                <ul>
                    <li>优化住建委老旧小区改造工单流程</li>
                    <li>加强坐席关于社保业务的专项培训</li>
                    <li>建立共享单车乱停放长效治理机制</li>
                </ul>
            </div>
        `;
        
        // 启用下载和分享按钮
        document.getElementById('downloadBtn').disabled = false;
        document.getElementById('shareBtn').disabled = false;
        
        await this.addAIMessage("✅ 报告生成完成！我已经将我们的对话分析转化为一份结构化的PPT报告，包含数据概览、问题分析、部门效能和改进建议四个部分。您可以点击下载按钮获取完整的PPT文件。");
    }

    /**
     * 模拟用户提问
     */
    async simulateUserQuestion(question) {
        await this.addUserMessage(question);
        // 显示AI思考状态
        await this.delay(500);
        await this.addAIMessage("正在分析您的问题，请稍候...", true);
        await this.delay(1000);
        // 移除思考状态消息
        this.removeLastMessage();
    }

    /**
     * 处理推荐问题卡片点击
     */
    async handleQuestionCard(e) {
        if (!this.isRunning) return;
        
        const card = e.currentTarget;
        const question = card.dataset.question;
        
        // 添加点击效果
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        // 禁用所有推荐问题卡片
        document.querySelectorAll('.question-card').forEach(c => {
            c.style.opacity = '0.5';
            c.style.pointerEvents = 'none';
        });
        
        await this.addUserMessage(question);
        // 这里可以添加对应的AI响应逻辑
    }

    /**
     * 发送消息
     */
    async sendMessage() {
        const input = document.getElementById('questionInput');
        const message = input.value.trim();
        
        if (!message || !this.isRunning) return;
        
        input.value = '';
        await this.addUserMessage(message);
        
        // 简单的自动回复逻辑
        await this.delay(1000);
        await this.addAIMessage("感谢您的问题！在实际应用中，我会基于您的具体问题提供相应的数据分析结果。");
    }

    /**
     * 添加用户消息
     */
    async addUserMessage(message) {
        const messagesContainer = document.getElementById('chatMessages');
        
        const messageElement = document.createElement('div');
        messageElement.className = 'user-message';
        messageElement.innerHTML = `
            <div class="user-avatar">👤</div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        this.conversationHistory.push({
            type: 'user',
            content: message,
            timestamp: new Date()
        });
    }

    /**
     * 添加AI消息
     */
    async addAIMessage(message, isThinking = false) {
        const messagesContainer = document.getElementById('chatMessages');
        
        const messageElement = document.createElement('div');
        messageElement.className = 'ai-message';
        if (isThinking) messageElement.dataset.thinking = 'true';
        
        messageElement.innerHTML = `
            <div class="ai-avatar">🤖</div>
            <div class="message-content">
                ${isThinking ? '<p>🤔 正在思考...</p>' : message}
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        if (!isThinking) {
            this.conversationHistory.push({
                type: 'ai',
                content: message,
                timestamp: new Date()
            });
        }
    }

    /**
     * 移除最后一条消息
     */
    removeLastMessage() {
        const messagesContainer = document.getElementById('chatMessages');
        const lastMessage = messagesContainer.querySelector('[data-thinking="true"]');
        if (lastMessage) {
            lastMessage.remove();
        }
    }

    /**
     * 滚动到底部
     */
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * 完成演示
     */
    completeDemo() {
        this.isRunning = false;
        document.getElementById('startBtn').textContent = '✅ 演示完成';
        document.getElementById('startBtn').disabled = false;
    }

    /**
     * 重置演示
     */
    resetDemo() {
        this.isRunning = false;
        this.currentStep = 0;
        this.conversationHistory = [];
        this.reportData = [];
        
        // 重置UI状态
        document.getElementById('startBtn').textContent = '🎯 开始演示';
        document.getElementById('startBtn').disabled = false;
        
        // 清空对话
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = `
            <div class="system-message">
                <div class="ai-avatar">🤖</div>
                <div class="message-content">
                    <p>您好！我是小慧，您的智能数据分析助手。您可以用自然语言向我询问任何关于12345热线运营数据的问题。</p>
                </div>
            </div>
        `;
        
        // 重置其他状态
        this.setupInitialState();
        
        // 恢复推荐问题卡片
        document.querySelectorAll('.question-card').forEach(card => {
            card.style.opacity = '';
            card.style.pointerEvents = '';
        });
        
        // 重置报告区域
        document.getElementById('reportSection').style.display = 'none';
        document.getElementById('reportStatus').textContent = '准备生成...';
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('reportPreview').innerHTML = '报告预览将在这里显示...';
        document.getElementById('downloadBtn').disabled = true;
        document.getElementById('shareBtn').disabled = true;
        
        document.getElementById('questionInput').value = '';
        
        // 清理图表
        this.disposeCharts();
    }

    /**
     * 启用输入
     */
    enableInputs() {
        document.getElementById('questionInput').disabled = false;
        document.getElementById('sendBtn').disabled = false;
    }

    /**
     * 禁用输入
     */
    disableInputs() {
        document.getElementById('questionInput').disabled = true;
        document.getElementById('sendBtn').disabled = true;
    }

    /**
     * 隐藏所有区域
     */
    hideAllSections() {
        document.getElementById('dataDisplay').style.display = 'none';
        document.getElementById('reportSection').style.display = 'none';
    }

    /**
     * 下载报告
     */
    downloadReport() {
        // 模拟下载
        const btn = document.getElementById('downloadBtn');
        const originalText = btn.textContent;
        
        btn.textContent = '📥 正在下载...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.textContent = '✅ 下载完成';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
        }, 2000);
        
        // 显示模拟下载提示
        this.showNotification('💼 PPT报告已生成并开始下载！包含完整的数据分析和改进建议。');
    }

    /**
     * 分享报告
     */
    shareReport() {
        // 模拟分享
        const btn = document.getElementById('shareBtn');
        const originalText = btn.textContent;
        
        btn.textContent = '📤 正在分享...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.textContent = '✅ 分享成功';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
        }, 1500);
        
        // 显示模拟分享提示
        this.showNotification('📤 报告分享链接已生成！相关人员可通过链接查看完整报告。');
    }

    /**
     * 显示通知
     */
    showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            max-width: 300px;
            word-wrap: break-word;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 动画显示
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    /**
     * 显示演示要点
     */
    showPoints() {
        document.getElementById('pointsPopupOverlay').classList.add('active');
    }

    /**
     * 隐藏演示要点
     */
    hidePoints() {
        document.getElementById('pointsPopupOverlay').classList.remove('active');
    }

    /**
     * 清理图表
     */
    disposeCharts() {
        const trendChart = echarts.getInstanceByDom(document.getElementById('trendChart'));
        const pieChart = echarts.getInstanceByDom(document.getElementById('pieChart'));
        
        if (trendChart) {
            trendChart.dispose();
        }
        if (pieChart) {
            pieChart.dispose();
        }
    }

    /**
     * 渲染趋势图表
     */
    renderTrendChart() {
        const chartDom = document.getElementById('trendChart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        
        const option = {
            title: {
                text: '',
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    color: '#2c3e50'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['通话量', '满意度'],
                top: 20
            },
            xAxis: {
                type: 'category',
                data: ['6月3日', '6月4日', '6月5日', '6月6日', '6月7日', '6月8日', '6月9日'],
                axisLabel: {
                    color: '#6c757d',
                    fontSize: 12
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '通话量',
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}',
                        color: '#6c757d'
                    }
                },
                {
                    type: 'value',
                    name: '满意度(%)',
                    position: 'right',
                    axisLabel: {
                        formatter: '{value}%',
                        color: '#6c757d'
                    }
                }
            ],
            series: [
                {
                    name: '通话量',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: [12800, 13200, 12500, 13800, 12100, 11900, 13030],
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#667eea' },
                            { offset: 1, color: '#764ba2' }
                        ])
                    }
                },
                {
                    name: '满意度',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [92.1, 91.8, 92.3, 91.2, 90.8, 91.0, 91.5],
                    lineStyle: {
                        color: '#27ae60',
                        width: 3
                    },
                    itemStyle: {
                        color: '#27ae60'
                    },
                    symbol: 'circle',
                    symbolSize: 6
                }
            ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            }
        };
        
        myChart.setOption(option);
        
        // 响应式处理
        window.addEventListener('resize', () => {
            myChart.resize();
        });
    }

    /**
     * 渲染饼图
     */
    renderPieChart() {
        const chartDom = document.getElementById('pieChart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        
        const option = {
            title: {
                text: '',
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    color: '#2c3e50'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}% ({d}%)'
            },
            legend: {
                orient: 'horizontal',
                bottom: '5%',
                left: 'center',
                textStyle: {
                    color: '#6c757d'
                }
            },
            series: [
                {
                    name: '问题原因',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '45%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{b}\n{c}%',
                        fontSize: 12,
                        color: '#2c3e50'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 14,
                            fontWeight: 'bold'
                        },
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    labelLine: {
                        show: true
                    },
                    data: [
                        {
                            value: 45,
                            name: '处理时效过长',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#ff6b6b' },
                                    { offset: 1, color: '#ffa726' }
                                ])
                            }
                        },
                        {
                            value: 30,
                            name: '解决方案无效',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#667eea' },
                                    { offset: 1, color: '#764ba2' }
                                ])
                            }
                        },
                        {
                            value: 15,
                            name: '服务态度问题',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#f093fb' },
                                    { offset: 1, color: '#f5576c' }
                                ])
                            }
                        },
                        {
                            value: 10,
                            name: '其他原因',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#4facfe' },
                                    { offset: 1, color: '#00f2fe' }
                                ])
                            }
                        }
                    ]
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 响应式处理
        window.addEventListener('resize', () => {
            myChart.resize();
        });
    }

    /**
     * 延迟函数
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 页面加载完成后初始化演示
document.addEventListener('DOMContentLoaded', () => {
    new DataAnalysisDemo();
});
