/**
 * @file script.js
 * @description 12345热线AI预测分析Demo页面的动态逻辑和数据模拟。
 */

// 数据模拟规则
const mockDataRules = {
    callVolume: {
        baseValue: 100,
        randomRange: 50,
        peakHours: [9, 14, 16],
        seasonalFactor: 1.2
    },
    waitTime: {
        baseValue: 120, // 秒
        maxValue: 600,
        correlateWithVolume: true
    },
    connectionRate: {
        baseValue: 0.85,
        minValue: 0.6,
        maxValue: 0.98
    },
    issueTypes: [
        { name: '服务咨询', weight: 0.4 },
        { name: '政策解读', weight: 0.25 },
        { name: '投诉建议', weight: 0.2 },
        { name: '业务办理', weight: 0.1 },
        { name: '其他', weight: 0.05 }
    ]
};

// 全局图表实例
let callVolume24hChart;
let callVolume7dChart;
let seasonalMonthlyChart;
let issueTypeChart;
let annualTrendChart;

/**
 * 生成指定范围内的随机整数。
 * @param {number} min - 最小值（包含）。
 * @param {number} max - 最大值（包含）。
 * @returns {number} 随机整数。
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成指定范围内的随机浮点数。
 * @param {number} min - 最小值（包含）。
 * @param {number} max - 最大值（包含）。
 * @returns {number} 随机浮点数。
 */
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * 更新当前时间显示。
 */
function updateCurrentTime() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById('current-time').textContent = now.toLocaleDateString('zh-CN', options);
}

/**
 * 更新实时监控面板数据。
 */
function updateRealtimeMonitor() {
    // 模拟在线座席数
    const onlineAgents = getRandomInt(80, 120);
    document.getElementById('online-agents').textContent = onlineAgents;

    // 模拟实时来电计数
    const realtimeCalls = getRandomInt(mockDataRules.callVolume.baseValue - mockDataRules.callVolume.randomRange / 2, mockDataRules.callVolume.baseValue + mockDataRules.callVolume.randomRange / 2);
    document.getElementById('realtime-calls').textContent = realtimeCalls;

    // 模拟平均等待时长
    let avgWaitTime = mockDataRules.waitTime.baseValue;
    if (mockDataRules.waitTime.correlateWithVolume) {
        // 等待时长与来电量正相关
        avgWaitTime = avgWaitTime + (realtimeCalls - mockDataRules.callVolume.baseValue) * 1.5;
        avgWaitTime = Math.max(mockDataRules.waitTime.baseValue / 2, Math.min(avgWaitTime, mockDataRules.waitTime.maxValue));
    }
    document.getElementById('avg-wait-time').textContent = `${Math.round(avgWaitTime)}s`;

    // 模拟接通率
    let connectionRate = mockDataRules.connectionRate.baseValue;
    if (realtimeCalls > mockDataRules.callVolume.baseValue * 1.2 && onlineAgents < 90) {
        connectionRate = Math.max(connectionRate - 0.1, mockDataRules.connectionRate.minValue); // 来电量高且座席少时接通率下降
    } else if (onlineAgents > 110 && realtimeCalls < mockDataRules.callVolume.baseValue * 0.8) {
        connectionRate = Math.min(connectionRate + 0.05, mockDataRules.connectionRate.maxValue); // 座席多且来电量低时接通率上升
    }
    document.getElementById('connection-rate').textContent = `${(connectionRate * 100).toFixed(1)}%`;

    // 更新系统状态灯
    const statusLight = document.getElementById('system-status-light');
    const statusText = document.getElementById('system-status-text');

    statusLight.className = 'fas fa-circle'; // Reset classes
    if (realtimeCalls > mockDataRules.callVolume.baseValue * 1.5 || avgWaitTime > 300) {
        statusLight.classList.add('status-danger');
        statusText.textContent = '超负荷运行';
    } else if (realtimeCalls > mockDataRules.callVolume.baseValue * 1.2 || avgWaitTime > 180) {
        statusLight.classList.add('status-warning');
        statusText.textContent = '负载较高';
    } else {
        statusLight.classList.add('status-normal');
        statusText.textContent = '正常运行';
    }
}

/**
 * 生成24小时来电量预测数据。
 * @returns {object} 包含标签和数据的数据对象。
 */
function generate24hCallVolumeData() {
    const labels = Array.from({ length: 24 }, (_, i) => `${i}时`);
    const data = labels.map((_, i) => {
        let value = mockDataRules.callVolume.baseValue + getRandomInt(-mockDataRules.callVolume.randomRange / 4, mockDataRules.callVolume.randomRange / 4);
        if (mockDataRules.callVolume.peakHours.includes(i)) {
            value += getRandomInt(mockDataRules.callVolume.baseValue * 0.3, mockDataRules.callVolume.baseValue * 0.6);
        }
        return Math.max(0, Math.round(value));
    });
    return { labels, data };
}

/**
 * 生成未来7天来电量趋势数据。
 * @returns {object} 包含标签和数据的数据对象。
 */
function generate7dCallVolumeData() {
    const labels = ['今天', '明天', '后天', '大后天', '第5天', '第6天', '第7天'];
    const data = labels.map(() => getRandomInt(mockDataRules.callVolume.baseValue * 0.8, mockDataRules.callVolume.baseValue * 1.5));
    return { labels, data };
}

/**
 * 生成月度来电量对比数据。
 * @returns {object} 包含标签和数据的数据对象。
 */
function generateMonthlyCallVolumeData() {
    const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const data = labels.map((_, i) => {
        let value = mockDataRules.callVolume.baseValue * (0.8 + Math.sin(i / 12 * 2 * Math.PI) * 0.4) * mockDataRules.callVolume.seasonalFactor;
        return Math.round(value + getRandomInt(-20, 20));
    });
    return { labels, data };
}

/**
 * 生成问题类型分布数据。
 * @returns {object} 包含标签和数据的数据对象。
 */
function generateIssueTypeData() {
    const labels = mockDataRules.issueTypes.map(type => type.name);
    const data = mockDataRules.issueTypes.map(type => Math.round(type.weight * 1000 + getRandomInt(-20, 20))); // 模拟数量
    return { labels, data };
}

/**
 * 生成年度趋势数据。
 * @returns {object} 包含标签和数据的数据对象。
 */
function generateAnnualTrendData() {
    const labels = ['2021', '2022', '2023', '2024'];
    const data = labels.map((_, i) => {
        // 模拟一个逐渐上升的趋势，并有随机波动
        let base = 500 + i * 100;
        return Math.round(base + getRandomInt(-50, 50));
    });
    return { labels, data };
}

/**
 * 生成季节性热力图数据。
 * @returns {Array<Array<number>>} 12个月 x 7天的来电量模拟数据。
 */
function generateHeatmapData() {
    const heatmapData = [];
    for (let month = 0; month < 12; month++) {
        const monthData = [];
        for (let day = 0; day < 7; day++) {
            // 模拟数据，考虑季节性（如夏季和冬季可能波动大）和周末（周末可能较低）
            let value = mockDataRules.callVolume.baseValue + getRandomInt(-mockDataRules.callVolume.randomRange / 2, mockDataRules.callVolume.randomRange / 2);

            // 模拟季节性影响
            if (month >= 5 && month <= 8) { // 夏季
                value *= getRandomFloat(1.1, 1.3);
            } else if (month === 0 || month === 11) { // 冬季
                value *= getRandomFloat(0.9, 1.1);
            }

            // 模拟周末影响 (假设周六日数据较低)
            if (day === 5 || day === 6) { // 0=周一, 6=周日
                value *= getRandomFloat(0.7, 0.9);
            }
            monthData.push(Math.round(value));
        }
        heatmapData.push(monthData);
    }
    return heatmapData;
}

/**
 * 生成问题词云数据。
 * @returns {Array<object>} 包含词语和大小的数据对象。
 */
function generateWordCloudData() {
    const wordCloudData = [];
    const totalWeight = mockDataRules.issueTypes.reduce((sum, type) => sum + type.weight, 0);

    mockDataRules.issueTypes.forEach(type => {
        // 简单映射权重到字体大小范围 (例如 16px - 48px)
        const minSize = 16;
        const maxSize = 48;
        const size = minSize + (type.weight / totalWeight) * (maxSize - minSize);
        wordCloudData.push({ text: type.name, size: `${Math.round(size)}px` });
    });
    // 随机排序以增加视觉多样性
    return wordCloudData.sort(() => 0.5 - Math.random());
}

/**
 * 渲染24小时来电量预测图表。
 */
function renderCallVolume24hChart() {
    const ctx = document.getElementById('callVolume24hChart').getContext('2d');
    const { labels, data } = generate24hCallVolumeData();
    if (callVolume24hChart) {
        callVolume24hChart.destroy();
    }
    callVolume24hChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '预测来电量',
                data: data,
                borderColor: '#1890FF',
                backgroundColor: 'rgba(24, 144, 255, 0.2)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#1890FF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '来电量'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '时间'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw;
                            return label;
                        }
                    }
                }
            }
        }
    });

    // 更新座席配置建议
    const peakHour = data.indexOf(Math.max(...data));
    const suggestedAgents = Math.round(Math.max(...data) / 10); // 简单估算
    document.getElementById('agent-suggestion').innerHTML = `
        根据24小时来电预测，预计**${peakHour}时**将迎来峰值（约${Math.max(...data)}次来电）。
        建议在此期间配置**${suggestedAgents}名**座席以应对高峰。
    `;
}

/**
 * 渲染未来7天来电量趋势图表。
 */
function renderCallVolume7dChart() {
    const ctx = document.getElementById('callVolume7dChart').getContext('2d');
    const { labels, data } = generate7dCallVolumeData();
    if (callVolume7dChart) {
        callVolume7dChart.destroy();
    }
    callVolume7dChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '预测来电量',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '来电量'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '日期'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw;
                            return label;
                        }
                    }
                }
            }
        }
    });
}

/**
 * 渲染月度来电量对比图表。
 */
function renderSeasonalMonthlyChart() {
    const ctx = document.getElementById('seasonalMonthlyChart').getContext('2d');
    const { labels, data } = generateMonthlyCallVolumeData();
    if (seasonalMonthlyChart) {
        seasonalMonthlyChart.destroy();
    }
    seasonalMonthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '月度来电量',
                data: data,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '来电量'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '月份'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw;
                            return label;
                        }
                    }
                }
            }
        }
    });
}

/**
 * 渲染问题类型分布图表。
 */
function renderIssueTypeChart() {
    const ctx = document.getElementById('issueTypeChart').getContext('2d');
    const { labels, data } = generateIssueTypeData();
    const backgroundColors = [
        '#1890FF', '#52C41A', '#FA8C16', '#F5222D', '#A0D911', '#FADB14', '#EB2F96', '#722ED1'
    ];
    if (issueTypeChart) {
        issueTypeChart.destroy();
    }
    issueTypeChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, data.length),
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw;
                            return label;
                        }
                    }
                }
            }
        }
    });

    // 更新热点问题预警和解决方案
    const trendingIssue = labels[data.indexOf(Math.max(...data))];
    const issueWarningElement = document.getElementById('issue-warning');
    let solutionText = '';

    if (trendingIssue === '服务咨询') {
        solutionText = '建议加强智能客服和常见问题解答（FAQ）的建设，优化知识库，提升自助服务能力。';
    } else if (trendingIssue === '政策解读') {
        solutionText = '建议组织政策宣讲会，发布简洁明了的政策解读材料，并通过多渠道进行宣传，减少重复咨询。';
    } else if (trendingIssue === '投诉建议') {
        solutionText = '建议优化投诉处理流程，缩短响应时间，并对高频投诉类型进行根源分析，及时改进服务质量。';
    } else {
        solutionText = '请关注近期热门话题，及时调整服务策略。';
    }

    issueWarningElement.innerHTML = `
        当前热点问题集中在：**${trendingIssue}**。<br>
        **解决方案建议**：${solutionText}
    `;
}

/**
 * 渲染年度趋势图表。
 */
function renderAnnualTrendChart() {
    const ctx = document.getElementById('annualTrendChart').getContext('2d');
    const { labels, data } = generateAnnualTrendData();
    if (annualTrendChart) {
        annualTrendChart.destroy();
    }
    annualTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '年度总来电量',
                data: data,
                borderColor: '#52C41A',
                backgroundColor: 'rgba(82, 196, 26, 0.2)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#52C41A'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '来电量'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '年份'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw;
                            return label;
                        }
                    }
                }
            }
        }
    });
}

/**
 * 渲染季节性热力图。
 */
function renderSeasonalHeatmap() {
    const heatmapContainer = document.getElementById('seasonalHeatmap');
    heatmapContainer.innerHTML = ''; // 清空现有内容

    const heatmapData = generateHeatmapData();
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const weekdays = ['一', '二', '三', '四', '五', '六', '日'];

    // 创建头部（星期）
    const headerRow = document.createElement('div');
    headerRow.classList.add('heatmap-row', 'heatmap-header');
    headerRow.appendChild(document.createElement('div')); // 空单元格对应月份标签
    weekdays.forEach(day => {
        const headerCell = document.createElement('div');
        headerCell.classList.add('heatmap-cell', 'heatmap-header-cell');
        headerCell.textContent = `周${day}`;
        headerRow.appendChild(headerCell);
    });
    heatmapContainer.appendChild(headerRow);

    // 创建热力图内容
    heatmapData.forEach((monthData, monthIndex) => {
        const row = document.createElement('div');
        row.classList.add('heatmap-row');

        const monthLabelCell = document.createElement('div');
        monthLabelCell.classList.add('heatmap-cell', 'heatmap-month-label');
        monthLabelCell.textContent = months[monthIndex];
        row.appendChild(monthLabelCell);

        monthData.forEach(value => {
            const cell = document.createElement('div');
            cell.classList.add('heatmap-cell');
            // 根据值设置颜色（简单的颜色梯度）
            let colorIntensity = Math.min(1, value / (mockDataRules.callVolume.baseValue * 2)); // 假设最大值是基值的两倍
            let r = 255 - Math.round(100 * colorIntensity);
            let g = 255 - Math.round(200 * colorIntensity);
            let b = 255 - Math.round(255 * colorIntensity);
            cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            cell.title = `来电量: ${value}`; // 悬停显示数据
            cell.textContent = value; // 可以显示数值或留空
            row.appendChild(cell);
        });
        heatmapContainer.appendChild(row);
    });
}

/**
 * 渲染问题词云。
 */
function renderIssueWordCloud() {
    const wordcloudContainer = document.getElementById('issueWordCloud');
    wordcloudContainer.innerHTML = ''; // 清空现有内容

    const wordCloudData = generateWordCloudData();

    wordCloudData.forEach(word => {
        const span = document.createElement('span');
        span.classList.add('wordcloud-item');
        span.textContent = word.text;
        span.style.fontSize = word.size;
        // 随机颜色 (可选)
        const colors = ['#1890FF', '#52C41A', '#FA8C16', '#F5222D', '#722ED1', '#EB2F96'];
        span.style.color = colors[getRandomInt(0, colors.length - 1)];
        wordcloudContainer.appendChild(span);
    });
}

/**
 * 更新智能决策建议。
 */
function updateSmartSuggestions() {
    // 人力配置建议
    const hrSuggestions = document.getElementById('hr-suggestions');
    hrSuggestions.innerHTML = `
        <li class="list-group-item"><i class="fas fa-check-circle"></i> 错峰排班：根据预测的峰值时段调整座席排班，确保高峰期人力充足。</li>
        <li class="list-group-item"><i class="fas fa-check-circle"></i> 弹性用工：考虑在预测高负荷时期引入临时座席或弹性工作制度。</li>
        <li class="list-group-item"><i class="fas fa-check-circle"></i> 技能培训：针对不同热点问题，对座席进行专项培训，提高处理效率。</li>
    `;

    // 应对方案推荐
    const solutionRecommendations = document.getElementById('solution-recommendations');
    solutionRecommendations.innerHTML = `
        <li class="list-group-item"><i class="fas fa-lightbulb"></i> 推广自助渠道：引导用户使用官网、App或小程序解决常见问题。</li>
        <li class="list-group-item"><i class="fas fa-lightbulb"></i> 预案管理：针对常见的突发事件或季节性高发问题，制定并演练应急预案。</li>
        <li class="list-group-item"><i class="fas fa-lightbulb"></i> 信息发布：通过官方渠道及时发布热点问题解答和最新政策信息。</li>
    `;

    // 效率优化建议
    const efficiencySuggestions = document.getElementById('efficiency-suggestions');
    efficiencySuggestions.innerHTML = `
        <li class="list-group-item"><i class="fas fa-cogs"></i> 流程自动化：利用RPA等技术自动化处理重复性高、规则明确的业务。</li>
        <li class="list-group-item"><i class="fas fa-cogs"></i> 智能辅助：为座席提供知识库、话术推荐等智能辅助工具。</li>
        <li class="list-group-item"><i class="fas fa-cogs"></i> 数据分析：定期分析热线数据，识别瓶颈和优化点，持续改进服务流程。</li>
    `;
}

/**
 * 初始化所有图表和数据更新。
 */
function initDashboard() {
    updateCurrentTime();
    updateRealtimeMonitor();
    renderCallVolume24hChart();
    renderCallVolume7dChart();
    renderSeasonalMonthlyChart();
    renderIssueTypeChart();
    renderAnnualTrendChart();
    renderSeasonalHeatmap();
    renderIssueWordCloud();
    updateSmartSuggestions();

    // 每30秒更新一次数据
    setInterval(() => {
        updateCurrentTime();
        updateRealtimeMonitor();
        renderCallVolume24hChart(); // 图表数据也需要动态更新
        renderCallVolume7dChart();
        renderSeasonalMonthlyChart();
        renderIssueTypeChart();
        renderAnnualTrendChart();
        renderSeasonalHeatmap();
        renderIssueWordCloud();
        updateSmartSuggestions();
    }, 30000); // 30秒
}

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', initDashboard);