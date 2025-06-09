// 全局变量
let currentTab = 'overview';
let analysisLevel = 0;
let analysisPath = ['全市概览'];
let updateInterval;

// 模拟数据
const mockData = {
    overview: {
        totalCalls: 1247,
        answerRate: 95.2,
        waitTime: '2:15',
        satisfaction: 88.2,
        departments: [
            { name: '住建局', load: 85, status: 'warning' },
            { name: '交通局', load: 62, status: 'normal' },
            { name: '环保局', load: 45, status: 'normal' },
            { name: '教育局', load: 38, status: 'normal' }
        ]
    },
    analysis: {
        level0: [
            { region: '老城区', calls: 312, percentage: 25, trend: '+15%' },
            { region: '新城区', calls: 245, percentage: 20, trend: '+8%' },
            { region: '开发区', calls: 189, percentage: 15, trend: '-2%' },
            { region: '郊区', calls: 156, percentage: 12, trend: '+5%' }
        ],
        level1: [
            { issue: '供暖问题', calls: 203, percentage: 65, trend: '+45%' },
            { issue: '停水问题', calls: 56, percentage: 18, trend: '+12%' },
            { issue: '噪音投诉', calls: 37, percentage: 12, trend: '-5%' },
            { issue: '其他问题', calls: 16, percentage: 5, trend: '+2%' }
        ],
        level2: [
            { detail: '无暖气', calls: 141, percentage: 45, trend: '+60%' },
            { detail: '暖气不热', calls: 109, percentage: 35, trend: '+35%' },
            { detail: '管道漏水', calls: 62, percentage: 20, trend: '+25%' }
        ]
    },
    aiSummaries: [
        '老城区供暖问题激增，主要集中在建设路、民主街片区。经分析，与昨夜气温骤降至-15°C及老旧管网承压能力不足相关。预计今日电话量将持续攀升。',
        '无暖气问题主要源于3个换热站故障，影响1.2万户居民。管道漏水集中在使用20年以上的老旧小区。建议立即启动应急预案，调配移动供热设备。',
        '供暖设备老化严重，建议加大基础设施投入。短期内可通过移动供热车缓解，长期需制定老旧小区改造计划。'
    ],
    wordCloud: [
        { text: '供暖', size: 32, color: '#ef4444' },
        { text: '太冷了', size: 28, color: '#f59e0b' },
        { text: '老小区', size: 24, color: '#3b82f6' },
        { text: '什么时候修好', size: 20, color: '#8b5cf6' },
        { text: '孩子生病', size: 18, color: '#ef4444' },
        { text: '老人受不了', size: 16, color: '#f59e0b' },
        { text: '暖气片', size: 14, color: '#3b82f6' },
        { text: '管道', size: 12, color: '#10b981' }
    ],
    predictions: {
        labels: ['今天', '明天', '后天', '第4天', '第5天', '第6天', '第7天'],
        data: [312, 450, 380, 320, 280, 250, 220]
    },
    simulations: {
        '启动应急预案，调用3台移动供热车': {
            result: '模拟结果：预计可解决60%的无暖气问题（约85通电话），明日相关投诉预计下降40%，市民满意度预计回升1.5个百分点。成本投入：约15万元。建议同步措施：发布官方通告，说明解决时间表，可进一步降低投诉20%。',
            impact: { calls: -40, satisfaction: +1.5, cost: 15 }
        },
        '增加客服人员20%': {
            result: '模拟结果：平均等待时长预计缩短至1分30秒，接通率提升至98%，市民满意度预计提升0.8个百分点。人力成本增加：约8万元/月。建议配合培训提升服务质量。',
            impact: { waitTime: -45, answerRate: +2.8, satisfaction: +0.8, cost: 8 }
        },
        '发布官方通告说明情况': {
            result: '模拟结果：预计可降低重复咨询电话25%，负面情绪下降30%，市民满意度提升1.2个百分点。建议在通告中明确解决时间表和进展情况，每4小时更新一次。',
            impact: { calls: -25, satisfaction: +1.2, emotion: +30 }
        }
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    startRealTimeUpdates();
    bindEvents();
});

// 应用初始化
function initializeApp() {
    updateCurrentTime();
    updateLastUpdateTime();
    initializeOverview();
    initializeCityMap();
    initializeWordCloud();
    initializeCharts();
    
    // 设置默认显示的tab
    showTab('overview');
}

// 绑定事件
function bindEvents() {
    // 导航菜单点击
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const tab = this.dataset.tab;
            showTab(tab);
            
            // 更新菜单状态
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 预设问题按钮
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.question;
            document.getElementById('questionInput').value = question;
        });
    });

    // 模拟按钮
    document.getElementById('simulateBtn').addEventListener('click', function() {
        const question = document.getElementById('questionInput').value.trim();
        if (question) {
            runSimulation(question);
        }
    });

    // 快捷操作按钮
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            showNotification(`已执行操作：${action}`, 'success');
        });
    });
}

// 显示标签页
function showTab(tabName) {
    // 隐藏所有tab内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 显示指定tab
    document.getElementById(tabName).classList.add('active');
    currentTab = tabName;
    
    // 根据tab执行特定初始化
    switch(tabName) {
        case 'overview':
            animateKPICards();
            break;
        case 'analysis':
            initializeAnalysis();
            break;
        case 'sentiment':
            animateTopicRanking();
            break;
        case 'prediction':
            updatePredictionChart();
            break;
    }
}

// 更新当前时间
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('currentTime').textContent = timeString;
}

// 更新最后更新时间
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN');
    const updateElement = document.getElementById('lastUpdate');
    if (updateElement) {
        updateElement.textContent = timeString;
    }
}

// 初始化概览页面
function initializeOverview() {
    const data = mockData.overview;
    
    // 更新KPI数值
    animateNumber('totalCalls', data.totalCalls);
    animateNumber('answerRate', data.answerRate, '%');
    document.getElementById('waitTime').textContent = data.waitTime;
    animateNumber('satisfaction', data.satisfaction, '%');
}

// 数字动画
function animateNumber(elementId, targetValue, suffix = '') {
    const element = document.getElementById(elementId);
    const startValue = 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (targetValue - startValue) * easeOutQuart;
        
        if (suffix === '%') {
            element.textContent = currentValue.toFixed(1) + suffix;
        } else {
            element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// 初始化城市地图
function initializeCityMap() {
    const svg = document.getElementById('cityMap');
    const width = svg.clientWidth;
    const height = 300;
    
    // 清空现有内容
    svg.innerHTML = '';
    
    // 创建地图区域
    const regions = [
        { name: '老城区', x: 50, y: 50, width: 120, height: 80, calls: 312, level: 'danger' },
        { name: '新城区', x: 200, y: 60, width: 100, height: 70, calls: 245, level: 'warning' },
        { name: '开发区', x: 320, y: 80, width: 90, height: 60, calls: 189, level: 'normal' },
        { name: '郊区', x: 80, y: 160, width: 150, height: 90, calls: 156, level: 'normal' }
    ];
    
    regions.forEach(region => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', region.x);
        rect.setAttribute('y', region.y);
        rect.setAttribute('width', region.width);
        rect.setAttribute('height', region.height);
        rect.setAttribute('rx', 8);
        rect.classList.add('map-region');
        
        // 根据级别设置颜色
        let fillColor;
        switch(region.level) {
            case 'danger':
                fillColor = 'rgba(239, 68, 68, 0.7)';
                break;
            case 'warning':
                fillColor = 'rgba(245, 158, 11, 0.7)';
                break;
            default:
                fillColor = 'rgba(16, 185, 129, 0.7)';
        }
        
        rect.setAttribute('fill', fillColor);
        rect.setAttribute('stroke', '#ffffff');
        rect.setAttribute('stroke-width', 1);
        
        // 添加点击事件
        rect.addEventListener('click', () => {
            if (region.name === '老城区') {
                drillDown(region.name);
            }
        });
        
        svg.appendChild(rect);
        
        // 添加文字标签
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', region.x + region.width / 2);
        text.setAttribute('y', region.y + region.height / 2 - 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.textContent = region.name;
        svg.appendChild(text);
        
        // 添加数量标签
        const countText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        countText.setAttribute('x', region.x + region.width / 2);
        countText.setAttribute('y', region.y + region.height / 2 + 10);
        countText.setAttribute('text-anchor', 'middle');
        countText.setAttribute('fill', '#ffffff');
        countText.setAttribute('font-size', '10');
        countText.textContent = `${region.calls}通`;
        svg.appendChild(countText);
    });
}

// 下钻分析
function drillDown(item) {
    analysisLevel++;
    analysisPath.push(item);
    updateBreadcrumb();
    updateAnalysisTable();
    updateAISummary();
    
    // 切换到分析页面
    showTab('analysis');
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelector('[data-tab="analysis"]').classList.add('active');
}

// 更新面包屑导航
function updateBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    breadcrumb.innerHTML = '';
    
    analysisPath.forEach((path, index) => {
        const item = document.createElement('span');
        item.className = 'breadcrumb-item';
        if (index === analysisPath.length - 1) {
            item.classList.add('active');
        }
        item.textContent = path;
        
        // 添加返回功能
        if (index < analysisPath.length - 1) {
            item.addEventListener('click', () => {
                analysisLevel = index;
                analysisPath = analysisPath.slice(0, index + 1);
                updateBreadcrumb();
                updateAnalysisTable();
                updateAISummary();
            });
        }
        
        breadcrumb.appendChild(item);
    });
}

// 初始化分析页面
function initializeAnalysis() {
    analysisLevel = 0;
    analysisPath = ['全市概览'];
    updateBreadcrumb();
    updateAnalysisTable();
    updateAISummary();
}

// 更新分析表格
function updateAnalysisTable() {
    const tableContainer = document.getElementById('analysisTable');
    let data, headers;
    
    switch(analysisLevel) {
        case 0:
            data = mockData.analysis.level0;
            headers = ['区域', '电话量', '占比', '趋势'];
            break;
        case 1:
            data = mockData.analysis.level1;
            headers = ['问题类型', '电话量', '占比', '趋势'];
            break;
        case 2:
            data = mockData.analysis.level2;
            headers = ['具体问题', '电话量', '占比', '趋势'];
            break;
        default:
            return;
    }
    
    let tableHTML = '<table><thead><tr>';
    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
    
    data.forEach(row => {
        tableHTML += '<tr>';
        Object.values(row).forEach((value, index) => {
            if (index === 0 && analysisLevel < 2) {
                tableHTML += `<td><span class="clickable" onclick="drillDownFromTable('${value}')">${value}</span></td>`;
            } else {
                tableHTML += `<td>${value}</td>`;
            }
        });
        tableHTML += '</tr>';
    });
    
    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

// 从表格下钻
function drillDownFromTable(item) {
    if (analysisLevel < 2) {
        drillDown(item);
    }
}

// 更新AI摘要
function updateAISummary() {
    const summaryElement = document.getElementById('aiSummary');
    const summary = mockData.aiSummaries[analysisLevel] || '分析完成。';
    
    // 打字机效果
    summaryElement.innerHTML = '<div class="typing-text"></div>';
    const typingElement = summaryElement.querySelector('.typing-text');
    
    let index = 0;
    const typeWriter = () => {
        if (index < summary.length) {
            typingElement.textContent = summary.slice(0, index + 1);
            index++;
            setTimeout(typeWriter, 50);
        } else {
            typingElement.classList.remove('typing-text');
        }
    };
    
    setTimeout(typeWriter, 500);
}

// 初始化词云
function initializeWordCloud() {
    const container = document.getElementById('wordcloud');
    container.innerHTML = '';
    
    mockData.wordCloud.forEach(word => {
        const wordElement = document.createElement('span');
        wordElement.className = 'word-item';
        wordElement.textContent = word.text;
        wordElement.style.fontSize = word.size + 'px';
        wordElement.style.color = word.color;
        container.appendChild(wordElement);
    });
}

// 话题排行动画
function animateTopicRanking() {
    const topics = document.querySelectorAll('.topic-item');
    topics.forEach((topic, index) => {
        topic.style.opacity = '0';
        topic.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            topic.style.transition = 'all 0.5s ease';
            topic.style.opacity = '1';
            topic.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// 初始化图表
function initializeCharts() {
    initializeEmotionChart();
    initializePredictionChart();
}

// 情感分析图表
function initializeEmotionChart() {
    const ctx = document.getElementById('emotionChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['负面情绪', '中性情绪', '正面情绪'],
            datasets: [{
                data: [78, 15, 7],
                backgroundColor: [
                    '#ef4444',
                    '#6b7280',
                    '#10b981'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// 预测图表
function initializePredictionChart() {
    const ctx = document.getElementById('predictionChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockData.predictions.labels,
            datasets: [{
                label: '预测电话量',
                data: mockData.predictions.data,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#9ca3af'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: '#9ca3af'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// 更新预测图表
function updatePredictionChart() {
    // 这里可以添加图表更新逻辑
}

// 运行模拟
function runSimulation(question) {
    const resultContainer = document.getElementById('simulationResult');
    
    // 显示加载状态
    resultContainer.innerHTML = '<div class="typing-text">正在模拟分析...</div>';
    
    setTimeout(() => {
        const simulation = mockData.simulations[question];
        if (simulation) {
            resultContainer.innerHTML = `
                <h4>模拟分析结果</h4>
                <p>${simulation.result}</p>
                <div class="impact-metrics">
                    <h5>预期影响指标：</h5>
                    <ul>
                        ${Object.entries(simulation.impact).map(([key, value]) => {
                            let label;
                            switch(key) {
                                case 'calls': label = '电话量变化'; break;
                                case 'satisfaction': label = '满意度变化'; break;
                                case 'waitTime': label = '等待时长变化'; break;
                                case 'answerRate': label = '接通率变化'; break;
                                case 'cost': label = '成本投入'; break;
                                case 'emotion': label = '情绪改善'; break;
                                default: label = key;
                            }
                            const prefix = value > 0 ? '+' : '';
                            const suffix = key === 'cost' ? '万元' : key.includes('Rate') || key === 'satisfaction' || key === 'emotion' ? '%' : key === 'waitTime' ? '秒' : '%';
                            return `<li>${label}: ${prefix}${value}${suffix}</li>`;
                        }).join('')}
                    </ul>
                </div>
            `;
        } else {
            resultContainer.innerHTML = `
                <h4>模拟分析结果</h4>
                <p>基于当前数据和历史模式，您提出的方案预计会产生以下影响：</p>
                <ul>
                    <li>电话量可能发生10-30%的变化</li>
                    <li>市民满意度预计变化0.5-2个百分点</li>
                    <li>建议进一步细化方案以获得更精确的预测</li>
                </ul>
            `;
        }
    }, 2000);
}

// KPI卡片动画
function animateKPICards() {
    const cards = document.querySelectorAll('.kpi-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 实时更新
function startRealTimeUpdates() {
    updateInterval = setInterval(() => {
        updateCurrentTime();
        updateLastUpdateTime();
        
        // 模拟数据变化
        if (currentTab === 'overview') {
            simulateDataChanges();
        }
    }, 5000);
}

// 模拟数据变化
function simulateDataChanges() {
    // 随机更新一些数值
    const totalCallsElement = document.getElementById('totalCalls');
    const currentCalls = parseInt(totalCallsElement.textContent.replace(',', ''));
    const newCalls = currentCalls + Math.floor(Math.random() * 10) + 1;
    
    animateNumber('totalCalls', newCalls);
    
    // 更新满意度
    const satisfactionElement = document.getElementById('satisfaction');
    const currentSatisfaction = parseFloat(satisfactionElement.textContent.replace('%', ''));
    const newSatisfaction = Math.max(85, Math.min(95, currentSatisfaction + (Math.random() - 0.5) * 0.5));
    
    animateNumber('satisfaction', newSatisfaction, '%');
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});
