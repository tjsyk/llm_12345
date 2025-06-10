/**
 * 智慧城市驾驶舱演示系统
 * @description 实现市长解决停车难问题的完整演示流程
 * @author AI Assistant
 * @version 1.0.0
 */

class SmartCityDashboard {
    constructor() {
        this.currentStep = 1;
        this.isVoiceActive = false;
        this.voiceCommands = [
            "小慧，调出昨天的城市服务日报",
            "深入分析'停车难'问题",
            "针对A街道的车位不足问题，如果我们在附近的废弃C地块，新建一个有300个车位的智慧停车场，进行'What-If'模拟"
        ];
        this.currentCommandIndex = 0;
        
        this.init();
    }

    /**
     * 初始化系统
     */
    init() {
        this.bindEvents();
        this.updateTime();
        this.animateCharts();
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 主控制按钮
        document.getElementById('startDemoBtn')?.addEventListener('click', () => this.startDemo());
        document.getElementById('voiceControlBtn')?.addEventListener('click', () => this.toggleVoiceModal());
        document.getElementById('resetBtn')?.addEventListener('click', () => this.resetDemo());

        // 语音相关按钮
        document.getElementById('voiceBtn')?.addEventListener('click', () => this.toggleVoiceModal());
        document.getElementById('closeVoice')?.addEventListener('click', () => this.closeVoiceModal());

        // 步骤间导航
        document.getElementById('analyzeParking')?.addEventListener('click', () => this.goToStep(2));
        document.getElementById('backToStep1')?.addEventListener('click', () => this.goToStep(1));
        document.getElementById('simulateDecision')?.addEventListener('click', () => this.goToStep(3));
        document.getElementById('backToStep2')?.addEventListener('click', () => this.goToStep(2));

        // 地图热点点击
        document.querySelectorAll('.hotspot').forEach(hotspot => {
            hotspot.addEventListener('click', (e) => this.showAreaAnalysis(e.target.closest('.hotspot').dataset.area));
        });

        // 关闭分析弹窗
        document.getElementById('closeAnalysis')?.addEventListener('click', () => this.closeAreaAnalysis());

        // 模拟相关
        document.getElementById('runSimulation')?.addEventListener('click', () => this.runSimulation());
        document.getElementById('approveDecision')?.addEventListener('click', () => this.approveDecision());
        document.getElementById('modifyDecision')?.addEventListener('click', () => this.modifyDecision());
        document.getElementById('moreSimulation')?.addEventListener('click', () => this.moreSimulation());

        // 点击弹窗外部关闭
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('area-analysis') || e.target.classList.contains('voice-modal')) {
                this.closeAreaAnalysis();
                this.closeVoiceModal();
            }
        });
    }

    /**
     * 开始演示
     */
    startDemo() {
        this.showVoiceAssistant();
        setTimeout(() => {
            this.simulateVoiceCommand("小慧，调出昨天的城市服务日报");
            setTimeout(() => {
                this.showDailyReport();
            }, 2000);
        }, 1000);
    }

    /**
     * 重置演示
     */
    resetDemo() {
        this.currentStep = 1;
        this.currentCommandIndex = 0;
        this.hideAllSteps();
        document.getElementById('step1').style.display = 'block';
        document.getElementById('dailyReport').style.display = 'none';
        document.getElementById('voiceWaves').style.display = 'none';
        document.getElementById('assistantStatus').textContent = '等待指令中...';
        this.closeAreaAnalysis();
        this.closeVoiceModal();
        this.resetSimulation();
    }

    /**
     * 跳转到指定步骤
     * @param {number} step - 步骤编号
     */
    goToStep(step) {
        this.currentStep = step;
        this.hideAllSteps();
        document.getElementById(`step${step}`).style.display = 'block';
        
        if (step === 2) {
            setTimeout(() => this.animateCharts(), 300);
        }
    }

    /**
     * 隐藏所有步骤
     */
    hideAllSteps() {
        document.querySelectorAll('.step-container').forEach(step => {
            step.style.display = 'none';
        });
    }

    /**
     * 显示语音助手活动状态
     */
    showVoiceAssistant() {
        document.getElementById('voiceWaves').style.display = 'flex';
        document.getElementById('assistantStatus').textContent = '正在聆听...';
    }

    /**
     * 模拟语音指令
     * @param {string} command - 语音指令内容
     */
    simulateVoiceCommand(command) {
        const commandElement = document.getElementById('assistantStatus');
        commandElement.textContent = `"${command}"`;
        commandElement.style.color = '#667eea';
        commandElement.style.fontWeight = '600';
        
        setTimeout(() => {
            commandElement.textContent = 'AI正在处理中...';
            commandElement.style.color = '#6c757d';
            commandElement.style.fontWeight = '400';
        }, 2000);
    }

    /**
     * 显示城市服务日报
     */
    showDailyReport() {
        document.getElementById('dailyReport').style.display = 'block';
        document.getElementById('voiceWaves').style.display = 'none';
        document.getElementById('assistantStatus').textContent = '报告生成完毕';
        
        // 高亮显示停车问题
        setTimeout(() => {
            const highlightCard = document.querySelector('.metric-card.highlight');
            highlightCard.style.animation = 'pulse 1s ease-in-out 3';
        }, 1000);
    }

    /**
     * 切换语音模态框
     */
    toggleVoiceModal() {
        const modal = document.getElementById('voiceModal');
        const isVisible = modal.style.display === 'block';
        
        if (!isVisible) {
            modal.style.display = 'block';
            this.isVoiceActive = true;
            this.startVoiceRecognition();
        } else {
            this.closeVoiceModal();
        }
    }

    /**
     * 关闭语音模态框
     */
    closeVoiceModal() {
        document.getElementById('voiceModal').style.display = 'none';
        this.isVoiceActive = false;
    }

    /**
     * 模拟语音识别
     */
    startVoiceRecognition() {
        const commandElement = document.getElementById('voiceCommand');
        let currentCommand = '';
        
        if (this.currentCommandIndex < this.voiceCommands.length) {
            currentCommand = this.voiceCommands[this.currentCommandIndex];
            this.currentCommandIndex++;
        } else {
            currentCommand = "请说出您的指令...";
        }
        
        // 模拟逐字识别
        let index = 0;
        const interval = setInterval(() => {
            if (index <= currentCommand.length) {
                commandElement.textContent = currentCommand.substring(0, index);
                index++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    this.closeVoiceModal();
                    this.processVoiceCommand(currentCommand);
                }, 1000);
            }
        }, 100);
    }

    /**
     * 处理语音指令
     * @param {string} command - 识别到的语音指令
     */
    processVoiceCommand(command) {
        if (command.includes('日报')) {
            this.showDailyReport();
        } else if (command.includes('停车难')) {
            setTimeout(() => this.goToStep(2), 500);
        } else if (command.includes('模拟')) {
            setTimeout(() => this.goToStep(3), 500);
        }
    }

    /**
     * 显示区域分析
     * @param {string} area - 区域名称
     */
    showAreaAnalysis(area) {
        const analysisData = {
            'A街道': {
                title: '🔍 A街道停车问题根源分析',
                content: `
                    <h4>核心矛盾</h4>
                    <p>该区域为老旧小区，原始车位配比严重不足（车位:户数 ≈ 1:5）</p>
                    
                    <h4>数据关联发现</h4>
                    <ul>
                        <li>70%的"乱停车"投诉，发生在周边500米内无公共停车场的区域</li>
                        <li>停车问题投诉量与居民密度呈强正相关（R²=0.89）</li>
                        <li>晚间投诉占比高达85%，主要集中在19:00-21:00</li>
                    </ul>
                    
                    <h4>市民原声热词</h4>
                    <p><strong>"没地方停"、"贴条"、"抢车位"、"太难了"</strong></p>
                    
                    <h4>周边环境分析</h4>
                    <ul>
                        <li>距离最近公共停车场：1.2公里</li>
                        <li>道路宽度限制，无法增设路边停车位</li>
                        <li>附近有一块闲置土地（C地块），面积约8000平方米</li>
                    </ul>
                `
            },
            'B广场': {
                title: '🔍 B广场停车问题根源分析',
                content: `
                    <h4>核心矛盾</h4>
                    <p>公共停车场收费标准不一，且价格较高（均价 > 15元/小时）</p>
                    
                    <h4>数据关联发现</h4>
                    <ul>
                        <li>周边道路违停投诉量，与停车场价格调整呈强正相关</li>
                        <li>85%的市民在咨询收费标准时，都表达了"太贵"的情绪</li>
                        <li>价格每上涨1元/小时，违停投诉增加约12%</li>
                    </ul>
                    
                    <h4>市民原声热词</h4>
                    <p><strong>"停不起"、"收费乱"、"为什么这么贵"、"不合理"</strong></p>
                    
                    <h4>收费现状分析</h4>
                    <ul>
                        <li>商业中心停车费：15-25元/小时</li>
                        <li>周边道路临停：10元/小时，但车位稀缺</li>
                        <li>市民期望价格：8-12元/小时</li>
                    </ul>
                `
            }
        };

        const data = analysisData[area];
        if (data) {
            document.getElementById('analysisTitle').textContent = data.title;
            document.getElementById('analysisBody').innerHTML = data.content;
            document.getElementById('areaAnalysis').style.display = 'flex';
        }
    }

    /**
     * 关闭区域分析
     */
    closeAreaAnalysis() {
        document.getElementById('areaAnalysis').style.display = 'none';
    }

    /**
     * 运行模拟
     */
    runSimulation() {
        const targetArea = document.getElementById('targetArea').value;
        const solution = document.getElementById('solution').value;
        
        document.getElementById('simulationResults').style.display = 'block';
        document.getElementById('loadingAnimation').style.display = 'block';
        document.getElementById('resultsContent').style.display = 'none';
        
        // 模拟AI分析过程
        setTimeout(() => {
            document.getElementById('loadingAnimation').style.display = 'none';
            document.getElementById('resultsContent').style.display = 'block';
            document.getElementById('finalActions').style.display = 'flex';
            
            // 根据选择更新结果内容
            this.updateSimulationResults(targetArea, solution);
        }, 3000);
    }

    /**
     * 更新模拟结果
     * @param {string} area - 目标区域
     * @param {string} solution - 解决方案
     */
    updateSimulationResults(area, solution) {
        // 这里可以根据不同的区域和方案显示不同的结果
        // 当前显示的是默认的A街道新建停车场方案
        console.log(`模拟结果: ${area} - ${solution}`);
        
        // 添加动画效果
        const items = document.querySelectorAll('.impact-item, .risk-item, .recommendation-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    /**
     * 批准决策
     */
    approveDecision() {
        this.showMessage('✅ 方案已批准，正在生成实施计划...', 'success');
        setTimeout(() => {
            this.showMessage('📋 实施计划已生成，已派发至相关部门执行', 'success');
        }, 2000);
    }

    /**
     * 修改方案
     */
    modifyDecision() {
        this.showMessage('📝 进入方案修改模式...', 'info');
        // 这里可以添加修改界面的逻辑
    }

    /**
     * 更多模拟
     */
    moreSimulation() {
        this.resetSimulation();
        this.showMessage('🔄 准备进行新的模拟分析...', 'info');
    }

    /**
     * 重置模拟
     */
    resetSimulation() {
        document.getElementById('simulationResults').style.display = 'none';
        document.getElementById('finalActions').style.display = 'none';
    }

    /**
     * 显示消息提示
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型
     */
    showMessage(message, type = 'info') {
        // 创建消息提示元素
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-toast ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#667eea'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        // 显示动画
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动移除
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }

    /**
     * 更新时间显示
     */
    updateTime() {
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            timeElement.textContent = now.toLocaleDateString('zh-CN', options);
        }
    }

    /**
     * 图表动画
     */
    animateCharts() {
        // 柱状图动画
        const chartItems = document.querySelectorAll('.chart-item');
        chartItems.forEach((item, index) => {
            const value = item.querySelector('.chart-value').textContent;
            const width = value.replace('%', '');
            
            setTimeout(() => {
                item.style.setProperty('--chart-width', width + '%');
                item.querySelector('::before') && (item.querySelector('::before').style.width = width + '%');
            }, index * 200);
        });

        // 趋势图动画
        const trendBars = document.querySelectorAll('.trend-bar');
        trendBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.opacity = '1';
                bar.style.transform = 'scaleX(1)';
            }, index * 300);
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new SmartCityDashboard();
});

/**
 * 全局工具函数
 */

/**
 * 格式化数字显示
 * @param {number} num - 数字
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的字符串
 */
function formatNumber(num, decimals = 1) {
    return Number(num).toFixed(decimals);
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 限制时间
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 添加一些实用的CSS动画类
const style = document.createElement('style');
style.textContent = `
    .chart-item::before {
        width: var(--chart-width, 0%);
    }
    
    .trend-bar {
        opacity: 0;
        transform: scaleX(0);
        transform-origin: left;
        transition: all 0.6s ease;
    }
    
    .message-toast {
        font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
        font-weight: 500;
        font-size: 14px;
    }
`;
document.head.appendChild(style);
