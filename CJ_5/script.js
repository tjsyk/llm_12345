/**
 * 智能实时舆情分析系统演示脚本
 * @description 演示AI舆情"哨兵"助力应对城市突发大面积停水事件
 * @author AI Assistant
 * @version 1.0.0
 */

/**
 * 全局状态管理
 */
class DemoState {
    constructor() {
        /** @type {string} 当前演示阶段 */
        this.currentStage = 'dashboard';
        
        /** @type {boolean} 演示是否运行中 */
        this.isRunning = false;
        
        /** @type {number} 当前时间戳 */
        this.currentTime = new Date('2024-06-12 14:00:00');
        
        /** @type {Array} 演示步骤队列 */
        this.demoSteps = [];
        
        /** @type {number} 当前步骤索引 */
        this.currentStepIndex = 0;
    }
}

/**
 * 舆情分析系统演示控制器
 */
class SentimentAnalysisDemo {
    /**
     * 构造函数，初始化演示系统
     */
    constructor() {
        this.state = new DemoState();
        this.initElements();
        this.bindEvents();
        this.setupDemoSteps();
    }

    /**
     * 初始化DOM元素引用
     */
    initElements() {
        // 控制按钮
        this.startBtn = document.getElementById('startDemoBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.skipBtn = document.getElementById('skipToAlert');
        
        // 主要界面容器
        this.dashboardMain = document.getElementById('dashboardMain');
        this.analysisInterface = document.getElementById('analysisInterface');
        this.reportInterface = document.getElementById('reportInterface');
        
        // 时间显示
        this.timeDisplay = document.getElementById('timeDisplay');
        this.analysisTime = document.getElementById('analysisTime');
        
        // 热线监控相关
        this.wordcloudContainer = document.getElementById('wordcloudContainer');
        this.hotlineStatus = document.getElementById('hotlineStatus');
        this.rankingList = document.getElementById('rankingList');
        
        // 预警相关
        this.alertContainer = document.getElementById('alertContainer');
        this.viewDetailBtn = document.getElementById('viewDetailBtn');
        
        // 分析相关
        this.emotionWarning = document.getElementById('emotionWarning');
        this.crossChannelAlerts = document.getElementById('crossChannelAlerts');
        this.actionSection = document.getElementById('actionSection');
        this.generateReportBtn = document.getElementById('generateReportBtn');
        
        // 简报相关
        this.downloadReportBtn = document.getElementById('downloadReportBtn');
        this.shareReportBtn = document.getElementById('shareReportBtn');
        this.restartDemoBtn = document.getElementById('restartDemoBtn');
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        this.startBtn?.addEventListener('click', () => this.startDemo());
        this.resetBtn?.addEventListener('click', () => this.resetDemo());
        this.skipBtn?.addEventListener('click', () => this.skipToAlert());
        this.viewDetailBtn?.addEventListener('click', () => this.showAnalysisInterface());
        this.generateReportBtn?.addEventListener('click', () => this.generateReport());
        this.downloadReportBtn?.addEventListener('click', () => this.downloadReport());
        this.shareReportBtn?.addEventListener('click', () => this.shareReport());
        this.restartDemoBtn?.addEventListener('click', () => this.restartDemo());
    }

    /**
     * 设置演示步骤序列
     */
    setupDemoSteps() {
        this.state.demoSteps = [
            { name: 'start', delay: 0, action: () => this.initializeDashboard() },
            { name: 'wordcloud_change', delay: 2000, action: () => this.animateWordcloud() },
            { name: 'ranking_update', delay: 4000, action: () => this.updateRanking() },
            { name: 'area_alert', delay: 6000, action: () => this.triggerAreaAlert() },
            { name: 'show_alert', delay: 8000, action: () => this.showAlert() },
            { name: 'enable_skip', delay: 10000, action: () => this.enableSkipButton() }
        ];
    }

    /**
     * 开始演示
     */
    async startDemo() {
        if (this.state.isRunning) return;
        
        this.state.isRunning = true;
        this.state.currentStepIndex = 0;
        
        // 禁用开始按钮，启用重置按钮
        this.startBtn.disabled = true;
        this.startBtn.textContent = '🔄 演示进行中...';
        
        console.log('🚀 开始舆情分析演示');
        
        // 执行演示步骤
        for (let i = 0; i < this.state.demoSteps.length; i++) {
            if (!this.state.isRunning) break;
            
            const step = this.state.demoSteps[i];
            
            await this.delay(step.delay);
            
            if (this.state.isRunning) {
                console.log(`执行步骤: ${step.name}`);
                step.action();
                this.state.currentStepIndex = i;
            }
        }
    }

    /**
     * 初始化驾驶舱界面
     */
    initializeDashboard() {
        this.updateTimeDisplay('2024-06-12 14:00');
        this.hotlineStatus.textContent = '正常';
        this.hotlineStatus.className = 'status-indicator normal';
        
        // 确保显示正确的界面
        this.showDashboardInterface();
    }

    /**
     * 动画词云变化
     */
    animateWordcloud() {
        const wordItems = this.wordcloudContainer.querySelectorAll('.word-item');
        
        // 找到"停水"和"没水"词汇并高亮
        wordItems.forEach(item => {
            if (item.textContent.includes('停水') || item.textContent.includes('没水')) {
                item.classList.add('highlight');
                item.style.fontSize = '24px';
                item.style.fontWeight = 'bold';
            }
        });
        
        // 更新热线状态
        setTimeout(() => {
            this.hotlineStatus.textContent = '异常';
            this.hotlineStatus.className = 'status-indicator warning';
        }, 1000);
    }

    /**
     * 更新排行榜
     */
    updateRanking() {
        const waterItem = this.rankingList.querySelector('[data-topic="water"]');
        const trafficItem = this.rankingList.querySelector('[data-topic="traffic"]');
        
        if (waterItem && trafficItem) {
            // 隐藏原有第一名
            trafficItem.style.display = 'none';
            
            // 显示"停水"并设为第一名
            waterItem.style.display = 'flex';
            waterItem.classList.add('rising');
            
            // 动态增加数量
            const countElement = waterItem.querySelector('.count');
            this.animateCount(countElement, 0, 320, 2000);
        }
        
        this.updateTimeDisplay('2024-06-12 14:15');
    }

    /**
     * 触发区域预警
     */
    triggerAreaAlert() {
        const cityWest = document.getElementById('cityWest');
        if (cityWest) {
            cityWest.className = 'area-item alert';
        }
    }

    /**
     * 显示预警通知
     */
    showAlert() {
        this.alertContainer.style.display = 'block';
        this.updateTimeDisplay('2024-06-12 14:20');
    }

    /**
     * 启用跳转按钮
     */
    enableSkipButton() {
        this.skipBtn.style.display = 'inline-block';
    }

    /**
     * 跳转到预警界面
     */
    skipToAlert() {
        // 直接执行所有前置步骤
        this.initializeDashboard();
        this.animateWordcloud();
        this.updateRanking();
        this.triggerAreaAlert();
        this.showAlert();
        this.enableSkipButton();
    }

    /**
     * 显示分析界面
     */
    showAnalysisInterface() {
        this.state.currentStage = 'analysis';
        
        // 隐藏驾驶舱，显示分析界面
        this.dashboardMain.style.display = 'none';
        this.analysisInterface.style.display = 'block';
        
        this.updateTimeDisplay('2024-06-12 14:20');
        
        // 启动分析动画序列
        this.startAnalysisSequence();
    }

    /**
     * 开始分析序列动画
     */
    async startAnalysisSequence() {
        // 1. 显示地图热力扩散
        setTimeout(() => this.animateMapHeatSpread(), 1000);
        
        // 2. 显示情绪预警
        setTimeout(() => this.showEmotionWarning(), 3000);
        
        // 3. 显示跨渠道预警
        setTimeout(() => this.showCrossChannelAlerts(), 5000);
        
        // 4. 显示生成简报按钮
        setTimeout(() => this.showActionSection(), 7000);
    }

    /**
     * 动画地图热力扩散
     */
    animateMapHeatSpread() {
        const westArea = document.getElementById('westArea');
        if (westArea) {
            westArea.classList.add('affected');
            
            // 动态增加影响范围文本
            const affectedArea = document.getElementById('affectedArea');
            if (affectedArea) {
                this.typeWriter(affectedArea, 'A、B、C三个街道，约15万居民', 50);
            }
            
            const spreadTrend = document.getElementById('spreadTrend');
            if (spreadTrend) {
                setTimeout(() => {
                    this.typeWriter(spreadTrend, '投诉源头正从A街道向B、C街道蔓延', 50);
                }, 1000);
            }
        }
    }

    /**
     * 显示情绪预警
     */
    showEmotionWarning() {
        this.emotionWarning.style.display = 'flex';
        this.updateTimeDisplay('2024-06-12 14:25');
    }

    /**
     * 显示跨渠道预警
     */
    showCrossChannelAlerts() {
        // 更新渠道状态
        const channelItems = document.querySelectorAll('.channel-item');
        channelItems.forEach(item => {
            const name = item.querySelector('.channel-name').textContent;
            if (name.includes('微博') || name.includes('论坛')) {
                item.classList.add('warning');
                item.querySelector('.channel-status').textContent = '发现异常';
            }
        });
        
        // 显示跨渠道预警信息
        this.crossChannelAlerts.style.display = 'block';
        this.updateTimeDisplay('2024-06-12 14:35');
    }

    /**
     * 显示操作区域
     */
    showActionSection() {
        this.actionSection.style.display = 'block';
    }

    /**
     * 生成应对简报
     */
    generateReport() {
        this.state.currentStage = 'report';
        
        // 显示生成中状态
        this.generateReportBtn.textContent = '📊 生成中...';
        this.generateReportBtn.disabled = true;
        
        setTimeout(() => {
            // 隐藏分析界面，显示简报界面
            this.analysisInterface.style.display = 'none';
            this.reportInterface.style.display = 'block';
            
            this.updateTimeDisplay('2024-06-12 14:40');
            
            console.log('📋 应对简报生成完成');
        }, 2000);
    }

    /**
     * 下载简报
     */
    downloadReport() {
        // 模拟下载
        const blob = new Blob(['城西停水事件应对简报'], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '城西停水事件应对简报.txt';
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('📥 简报下载完成');
    }

    /**
     * 分享简报
     */
    shareReport() {
        if (navigator.share) {
            navigator.share({
                title: '城西停水事件应对简报',
                text: '智能实时舆情分析系统生成的应对建议',
                url: window.location.href
            });
        } else {
            // 复制到剪贴板
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('🔗 链接已复制到剪贴板');
            });
        }
        
        console.log('🔗 简报分享完成');
    }

    /**
     * 重新开始演示
     */
    restartDemo() {
        this.resetDemo();
        setTimeout(() => this.startDemo(), 500);
    }

    /**
     * 重置演示
     */
    resetDemo() {
        this.state.isRunning = false;
        this.state.currentStage = 'dashboard';
        this.state.currentStepIndex = 0;
        
        // 重置按钮状态
        this.startBtn.disabled = false;
        this.startBtn.textContent = '🚀 开始演示';
        this.skipBtn.style.display = 'none';
        this.generateReportBtn.textContent = '📊 生成应对简报';
        this.generateReportBtn.disabled = false;
        
        // 显示驾驶舱界面
        this.showDashboardInterface();
        
        // 重置所有状态
        this.resetAllStates();
        
        console.log('🔄 演示已重置');
    }

    /**
     * 显示驾驶舱界面
     */
    showDashboardInterface() {
        this.dashboardMain.style.display = 'block';
        this.analysisInterface.style.display = 'none';
        this.reportInterface.style.display = 'none';
        this.alertContainer.style.display = 'none';
    }

    /**
     * 重置所有状态
     */
    resetAllStates() {
        // 重置时间
        this.updateTimeDisplay('2024-06-12 14:00');
        
        // 重置热线状态
        this.hotlineStatus.textContent = '正常';
        this.hotlineStatus.className = 'status-indicator normal';
        
        // 重置词云
        const wordItems = this.wordcloudContainer.querySelectorAll('.word-item');
        wordItems.forEach(item => {
            item.classList.remove('highlight');
            item.style.fontSize = '';
            item.style.fontWeight = '';
        });
        
        // 重置排行榜
        const waterItem = this.rankingList.querySelector('[data-topic="water"]');
        const trafficItem = this.rankingList.querySelector('[data-topic="traffic"]');
        if (waterItem && trafficItem) {
            waterItem.style.display = 'none';
            waterItem.classList.remove('rising');
            trafficItem.style.display = 'flex';
        }
        
        // 重置区域状态
        const cityWest = document.getElementById('cityWest');
        if (cityWest) {
            cityWest.className = 'area-item normal';
        }
        
        // 重置分析界面状态
        this.emotionWarning.style.display = 'none';
        this.crossChannelAlerts.style.display = 'none';
        this.actionSection.style.display = 'none';
        
        // 重置渠道状态
        const channelItems = document.querySelectorAll('.channel-item');
        channelItems.forEach(item => {
            item.classList.remove('warning');
            item.querySelector('.channel-status').textContent = '正常监控';
        });
    }

    /**
     * 更新时间显示
     * @param {string} timeStr - 时间字符串
     */
    updateTimeDisplay(timeStr) {
        if (this.timeDisplay) {
            this.timeDisplay.textContent = timeStr;
        }
        if (this.analysisTime) {
            this.analysisTime.textContent = timeStr;
        }
    }

    /**
     * 数字动画效果
     * @param {HTMLElement} element - 目标元素
     * @param {number} start - 起始值
     * @param {number} end - 结束值
     * @param {number} duration - 动画时长
     */
    animateCount(element, start, end, duration) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * 打字机效果
     * @param {HTMLElement} element - 目标元素
     * @param {string} text - 要显示的文本
     * @param {number} speed - 打字速度（毫秒）
     */
    typeWriter(element, text, speed = 100) {
        element.textContent = '';
        let index = 0;
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    /**
     * 延迟函数
     * @param {number} ms - 延迟毫秒数
     * @returns {Promise}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * 页面加载完成后初始化演示系统
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 智能实时舆情分析系统演示已加载');
    
    // 初始化演示控制器
    window.sentimentDemo = new SentimentAnalysisDemo();
    
    // 添加键盘快捷键支持
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            window.sentimentDemo.startDemo();
        } else if (e.key === 'Escape') {
            window.sentimentDemo.resetDemo();
        }
    });
    
    console.log('💡 快捷键提示：Ctrl+Enter 开始演示，Esc 重置演示');
});

/**
 * 页面卸载时清理资源
 */
window.addEventListener('beforeunload', () => {
    if (window.sentimentDemo) {
        window.sentimentDemo.state.isRunning = false;
    }
});
