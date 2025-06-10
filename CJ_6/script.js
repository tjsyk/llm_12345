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
        this.map = null;
        this.heatmap = null;
        
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

        // 地图点击事件将在地图初始化后绑定

        // 关闭分析弹窗
        document.getElementById('closeAnalysis')?.addEventListener('click', () => this.closeAreaAnalysis());

        // 模拟相关
        document.getElementById('runSimulation')?.addEventListener('click', () => this.runSimulation());
        document.getElementById('approveDecision')?.addEventListener('click', () => this.approveDecision());
        document.getElementById('modifyDecision')?.addEventListener('click', () => this.modifyDecision());
        document.getElementById('moreSimulation')?.addEventListener('click', () => this.moreSimulation());

        // 地图刷新按钮
        document.getElementById('refreshMapBtn')?.addEventListener('click', () => this.refreshMap());

        // 点击弹窗外部关闭
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('area-analysis') || e.target.classList.contains('voice-modal')) {
                this.closeAreaAnalysis();
                this.closeVoiceModal();
            }
        });

        // 窗口大小变化时重新调整地图
        window.addEventListener('resize', debounce(() => {
            if (this.map) {
                setTimeout(() => {
                    this.map.getSize();
                    this.map.setFitView();
                }, 100);
            }
        }, 300));
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
            setTimeout(() => {
                this.animateCharts();
                this.initMap();
            }, 500);
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

    /**
     * 初始化高德地图
     */
    initMap() {
        if (this.map) {
            return; // 地图已初始化
        }

        const mapContainer = document.getElementById('cityMap');
        if (!mapContainer) {
            console.error('地图容器未找到');
            return;
        }

        // 显示加载状态
        mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #667eea; font-size: 14px;"><div class="spinner" style="width: 20px; height: 20px; margin-right: 10px;"></div>正在加载地图...</div>';

        // 确保容器有正确的尺寸
        setTimeout(() => {
            // 创建地图实例
            this.map = new AMap.Map('cityMap', {
                zoom: 12,
                center: [116.397428, 39.90923], // 北京市中心
                mapStyle: 'amap://styles/light',
                resizeEnable: true,
                rotateEnable: false,
                pitchEnable: false,
                zoomEnable: true,
                dragEnable: true
            });

            // 地图加载完成后的回调
            this.map.on('complete', () => {
                console.log('高德地图加载完成');
                // 地图加载完成后重新调整大小
                setTimeout(() => {
                    this.map.getSize();
                    this.map.setFitView();
                }, 100);
            });

            // 地图错误处理
            this.map.on('hotspotclick', (e) => {
                console.log('地图热点点击:', e);
            });

            // 监听地图移动完成
            this.map.on('moveend', () => {
                console.log('地图移动完成');
            });

            // 监听地图缩放完成
            this.map.on('zoomend', () => {
                console.log('地图缩放完成，当前级别:', this.map.getZoom());
            });

            // 投诉热力数据点
            const heatmapData = [
                // A街道区域 (高密度)
                { lng: 116.38, lat: 39.92, count: 85 },
                { lng: 116.381, lat: 39.921, count: 78 },
                { lng: 116.382, lat: 39.919, count: 92 },
                { lng: 116.379, lat: 39.918, count: 88 },
                { lng: 116.383, lat: 39.922, count: 95 },

                // B广场区域 (高密度)
                { lng: 116.42, lat: 39.89, count: 89 },
                { lng: 116.421, lat: 39.891, count: 83 },
                { lng: 116.419, lat: 39.888, count: 91 },
                { lng: 116.422, lat: 39.892, count: 87 },

                // 其他中等密度区域
                { lng: 116.405, lat: 39.915, count: 45 },
                { lng: 116.395, lat: 39.905, count: 52 },
                { lng: 116.41, lat: 39.895, count: 48 },
                { lng: 116.385, lat: 39.885, count: 41 },

                // 低密度区域
                { lng: 116.43, lat: 39.92, count: 25 },
                { lng: 116.37, lat: 39.88, count: 28 },
                { lng: 116.44, lat: 39.88, count: 22 },
                { lng: 116.36, lat: 39.93, count: 31 }
            ];

            // 创建热力图
            this.heatmap = new AMap.HeatMap(this.map, {
                radius: 35,
                opacity: [0, 0.85],
                gradient: {
                    0.2: '#4CAF50',   // 绿色 - 低密度
                    0.4: '#FFC107',   // 黄色 - 中低密度
                    0.6: '#FF9800',   // 橙色 - 中等密度
                    0.8: '#F44336',   // 红色 - 高密度
                    1.0: '#9C27B0'    // 紫色 - 极高密度
                },
                blur: 0.85,
                zooms: [3, 18]
            });

            // 设置热力图数据
            this.heatmap.setDataSet({
                data: heatmapData.map(point => ({
                    lng: point.lng,
                    lat: point.lat,
                    count: point.count
                })),
                max: 100
            });

            // 添加标记点
            this.addMapMarkers();

            // 添加地图控件
            this.map.addControl(new AMap.Scale());
            this.map.addControl(new AMap.ToolBar());

            // 强制重新渲染地图，解决显示不完整问题
            setTimeout(() => {
                this.map.getSize();
                this.map.setFitView();
                window.dispatchEvent(new Event('resize'));
            }, 300);
        }, 100);
    }

    /**
     * 添加地图标记点
     */
    addMapMarkers() {
        // A街道标记
        const markerA = new AMap.Marker({
            position: [116.38, 39.92],
            title: 'A街道',
            icon: new AMap.Icon({
                size: new AMap.Size(30, 30),
                image: 'data:image/svg+xml;base64,' + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                        <circle cx="15" cy="15" r="12" fill="#ff4757" stroke="#fff" stroke-width="2"/>
                        <text x="15" y="19" text-anchor="middle" fill="white" font-size="12" font-weight="bold">A</text>
                    </svg>
                `)
            })
        });

        // B广场标记
        const markerB = new AMap.Marker({
            position: [116.42, 39.89],
            title: 'B广场',
            icon: new AMap.Icon({
                size: new AMap.Size(30, 30),
                image: 'data:image/svg+xml;base64,' + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                        <circle cx="15" cy="15" r="12" fill="#ff4757" stroke="#fff" stroke-width="2"/>
                        <text x="15" y="19" text-anchor="middle" fill="white" font-size="12" font-weight="bold">B</text>
                    </svg>
                `)
            })
        });

        // 添加标记到地图
        this.map.add([markerA, markerB]);

        // 添加点击事件
        markerA.on('click', () => this.showAreaAnalysis('A街道'));
        markerB.on('click', () => this.showAreaAnalysis('B广场'));

        // 添加信息窗体
        const infoWindowA = new AMap.InfoWindow({
            content: '<div style="padding:10px;"><h4>A街道</h4><p>停车投诉热点区域</p><p>点击查看详细分析</p></div>',
            offset: new AMap.Pixel(0, -30)
        });

        const infoWindowB = new AMap.InfoWindow({
            content: '<div style="padding:10px;"><h4>B广场</h4><p>停车投诉热点区域</p><p>点击查看详细分析</p></div>',
            offset: new AMap.Pixel(0, -30)
        });

        markerA.on('mouseover', () => infoWindowA.open(this.map, markerA.getPosition()));
        markerA.on('mouseout', () => infoWindowA.close());
        markerB.on('mouseover', () => infoWindowB.open(this.map, markerB.getPosition()));
        markerB.on('mouseout', () => infoWindowB.close());
    }

    /**
     * 手动刷新地图
     */
    refreshMap() {
        if (this.map) {
            setTimeout(() => {
                this.map.getSize();
                this.map.setFitView();
                console.log('地图已手动刷新');
            }, 100);
        }
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
