// 主应用控制器
class DashboardApp {
    constructor() {
        this.chartManager = new ChartManager();
        this.animationManager = new AnimationManager();
        this.currentTab = 'quality';
        this.currentAgent = 'A025';
        this.currentProblem = 'noise';
        
        this.init();
    }

    init() {
        this.initEventListeners();
        this.initTime();
        this.loadInitialData();
        this.startAutoUpdate();
        
        // 延迟显示异常预警
        setTimeout(() => {
            this.showAlert();
        }, 3000);
    }

    initEventListeners() {
        // 标签页切换
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchTab(e.target.closest('.nav-item').dataset.tab);
            });
        });

        // 坐席选择
        const agentSelect = document.getElementById('agentSelect');
        if (agentSelect) {
            agentSelect.addEventListener('change', (e) => {
                this.switchAgent(e.target.value);
            });
        }

        // 问题类型选择
        const problemSelect = document.getElementById('problemSelect');
        if (problemSelect) {
            problemSelect.addEventListener('change', (e) => {
                this.switchProblem(e.target.value);
            });
        }

        // 模态框关闭
        const modal = document.getElementById('alertModal');
        const closeBtn = modal.querySelector('.close');
        const buttons = modal.querySelectorAll('.btn');
        
        closeBtn.addEventListener('click', () => this.hideAlert());
        buttons.forEach(btn => {
            btn.addEventListener('click', () => this.hideAlert());
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideAlert();
            }
        });
    }

    initTime() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const timeElement = document.getElementById('current-time');
            if (timeElement) {
                timeElement.textContent = timeString;
            }
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }

    loadInitialData() {
        // 加载质检数据
        this.loadQualityData();
        
        // 加载坐席数据
        this.loadAgentData();
        
        // 加载洞察数据
        this.loadInsightData();
        
        // 初始化动画
        setTimeout(() => {
            this.animationManager.initNumberAnimations();
            this.animationManager.initCardAnimations();
            this.animationManager.initScrollAnimations();
        }, 500);
    }

    loadQualityData() {
        // 初始化图表
        this.chartManager.initQualityChart();
        
        // 加载质检流水
        this.updateQualityStream();
    }

    loadAgentData() {
        // 初始化雷达图
        this.chartManager.initRadarChart();
        
        // 加载培训推荐
        this.updateTrainingRecommendations();
    }

    loadInsightData() {
        this.updateProblemAnalysis();
    }

    switchTab(tabName) {
        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // 切换内容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        this.currentTab = tabName;
        
        // 重新初始化当前标签页的图表
        if (tabName === 'quality') {
            setTimeout(() => this.chartManager.initQualityChart(), 100);
        } else if (tabName === 'agent') {
            setTimeout(() => this.chartManager.initRadarChart(), 100);
        }
    }

    switchAgent(agentId) {
        this.currentAgent = agentId;
        this.chartManager.updateRadarChart(agentId);
        this.updateTrainingRecommendations();
    }

    switchProblem(problemType) {
        this.currentProblem = problemType;
        this.updateProblemAnalysis();
    }

    updateQualityStream() {
        const streamContainer = document.getElementById('qualityStream');
        if (!streamContainer) return;
        
        const streamData = generateQualityStream();
        
        streamContainer.innerHTML = streamData.map(item => `
            <div class="stream-item">
                <div class="stream-info">
                    <span class="agent-id">${item.agent}</span>
                    <span class="stream-time">${item.time}</span>
                    <span class="stream-score">得分: ${item.score}</span>
                </div>
                <span class="stream-status ${item.status}">${item.statusLabel}</span>
            </div>
        `).join('');
    }

    updateTrainingRecommendations() {
        const container = document.getElementById('recommendationList');
        if (!container) return;
        
        const agent = mockData.agents[this.currentAgent];
        if (!agent) return;
        
        container.innerHTML = agent.recommendations.map(rec => `
            <div class="recommendation-item">
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
                <div class="recommendation-meta">
                    <span class="duration">⏱️ ${rec.duration}</span>
                    <span class="priority ${rec.priority}">${rec.type}</span>
                </div>
            </div>
        `).join('');
    }

    updateProblemAnalysis() {
        const problem = mockData.problems[this.currentProblem];
        if (!problem) return;
        
        // 更新概览统计
        this.updateOverviewStats(problem.overview);
        
        // 更新链条分析
        this.updateChainAnalysis(problem.stages);
        
        // 更新根源洞察
        this.updateRootCauses(problem.rootCauses);
        
        // 更新改进计划
        this.updateImprovementPlan(problem.improvements);
    }

    updateOverviewStats(overview) {
        const container = document.getElementById('overviewStats');
        if (!container) return;
        
        container.innerHTML = `
            <div class="overview-stat ${overview.satisfaction < 70 ? 'warning' : ''}">
                <div class="number">${overview.satisfaction}%</div>
                <div class="label">满意度</div>
            </div>
            <div class="overview-stat">
                <div class="number">${overview.callVolume}</div>
                <div class="label">来电量</div>
            </div>
            <div class="overview-stat">
                <div class="number">${overview.avgDuration}分钟</div>
                <div class="label">平均时长</div>
            </div>
            <div class="overview-stat ${overview.resolutionRate < 50 ? 'warning' : ''}">
                <div class="number">${overview.resolutionRate}%</div>
                <div class="label">一次解决率</div>
            </div>
        `;
    }

    updateChainAnalysis(stages) {
        // 来电阶段
        const callStage = document.getElementById('callStageData');
        if (callStage) {
            callStage.innerHTML = `
                <div class="stage-data-item">
                    <span>来电量</span>
                    <span class="value">${stages.call.volume}通 (↑${stages.call.volumeChange}%)</span>
                </div>
                <div class="stage-data-item">
                    <span>平均通话时长</span>
                    <span class="value ${stages.call.avgDuration > stages.call.standardDuration ? 'warning' : ''}">${stages.call.avgDuration}分钟</span>
                </div>
                <div class="stage-data-item">
                    <span>一次解决率</span>
                    <span class="value ${stages.call.resolutionRate < stages.call.avgResolutionRate ? 'warning' : 'good'}">${stages.call.resolutionRate}%</span>
                </div>
            `;
        }
        
        // 派单阶段
        const dispatchStage = document.getElementById('dispatchStageData');
        if (dispatchStage) {
            dispatchStage.innerHTML = `
                <div class="stage-data-item">
                    <span>平均派单时长</span>
                    <span class="value ${stages.dispatch.avgTime <= stages.dispatch.standardTime ? 'good' : 'warning'}">${stages.dispatch.avgTime}小时</span>
                </div>
                <div class="stage-data-item">
                    <span>承办单位响应率</span>
                    <span class="value good">${stages.dispatch.responseRate}%</span>
                </div>
                <div class="stage-data-item">
                    <span>处理周期</span>
                    <span class="value ${stages.dispatch.processingDays > stages.dispatch.promisedDays ? 'warning' : 'good'}">${stages.dispatch.processingDays}天</span>
                </div>
            `;
        }
        
        // 回访阶段
        const followupStage = document.getElementById('followupStageData');
        if (followupStage) {
            followupStage.innerHTML = `
                <div class="stage-data-item">
                    <span>回访接通率</span>
                    <span class="value">${stages.followup.contactRate}%</span>
                </div>
                <div class="stage-data-item">
                    <span>问题解决满意度</span>
                    <span class="value ${stages.followup.satisfaction < 70 ? 'warning' : 'good'}">${stages.followup.satisfaction}%</span>
                </div>
                <div class="stage-data-item">
                    <span>主要不满原因</span>
                    <span class="value">${stages.followup.mainReasons[0].reason}(${stages.followup.mainReasons[0].percentage}%)</span>
                </div>
            `;
        }
    }

    updateRootCauses(causes) {
        const container = document.getElementById('causeList');
        if (!container) return;
        
        container.innerHTML = causes.map(cause => `
            <div class="cause-item">
                <h4>${cause.title}</h4>
                <p>${cause.description}</p>
            </div>
        `).join('');
    }

    updateImprovementPlan(improvements) {
        const container = document.getElementById('planTimeline');
        if (!container) return;
        
        container.innerHTML = improvements.map(item => `
            <div class="timeline-item">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <div class="timeline-meta">
                    <span class="timeline-tag ${item.type}">${item.timeline}</span>
                </div>
            </div>
        `).join('');
    }

    showAlert() {
        const modal = document.getElementById('alertModal');
        modal.style.display = 'block';
        
        // 添加脉冲效果到相关统计卡片
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length > 0) {
            this.animationManager.pulseElement(statCards[0]);
        }
    }

    hideAlert() {
        const modal = document.getElementById('alertModal');
        modal.style.display = 'none';
    }

    startAutoUpdate() {
        // 每30秒更新一次质检流水
        setInterval(() => {
            if (this.currentTab === 'quality') {
                this.updateQualityStream();
            }
        }, 30000);
        
        // 每5分钟模拟数据更新
        setInterval(() => {
            this.simulateDataUpdate();
        }, 300000);
    }

    simulateDataUpdate() {
        // 模拟数据变化
        const variation = (Math.random() - 0.5) * 2; // -1 到 1 的随机数
        mockData.qualityStats.averageScore += variation;
        mockData.qualityStats.averageScore = Math.max(80, Math.min(95, mockData.qualityStats.averageScore));
        
        // 更新显示
        if (this.currentTab === 'quality') {
            const scoreElement = document.querySelector('.stat-number[data-target="87.3"]');
            if (scoreElement) {
                this.animationManager.animateNumber(scoreElement, mockData.qualityStats.averageScore, 1000);
            }
        }
    }

    destroy() {
        this.chartManager.destroy();
        this.animationManager.cleanup();
    }
}

// 应用启动
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardApp = new DashboardApp();
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    if (window.dashboardApp) {
        window.dashboardApp.destroy();
    }
});
