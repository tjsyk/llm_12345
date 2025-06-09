// 模拟数据结构 (参考 PRD 7. 数据需求)
/**
 * @typedef {object} CallRecord
 * @property {string} id
 * @property {string} timestamp - ISO 8601 datetime string
 * @property {string} content
 * @property {string} category
 * @property {string} subcategory
 * @property {string} district
 * @property {'positive'|'neutral'|'negative'} sentiment
 * @property {'high'|'medium'|'low'} urgency
 * @property {string[]} keywords
 * @property {'pending'|'processing'|'resolved'} status
 */

/**
 * @typedef {object} StatsData
 * @property {string} date - YYYY-MM-DD string
 * @property {number} totalCalls
 * @property {{[key: string]: number}} categoryStats
 * @property {{positive: number, neutral: number, negative: number}} sentimentStats
 * @property {{[key: string]: number}} districtStats
 */

/**
 * @typedef {object} AlertEvent
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'high'|'medium'|'low'} riskLevel
 * @property {string} district
 * @property {number} relatedCalls
 * @property {string} createdTime - ISO 8601 datetime string
 * @property {'active'|'resolved'} status
 * @property {string[]} suggestions
 */

// 模拟数据函数 (简化)
/**
 * 模拟获取统计数据
 * @returns {Promise<StatsData>}
 */
async function fetchMockStats() {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockData = {
        date: new Date().toISOString().split('T')[0],
        totalCalls: Math.floor(Math.random() * 1000) + 500,
        categoryStats: { "投诉": 300, "咨询": 450, "建议": 200, "求助": 50 },
        sentimentStats: { positive: 600, neutral: 300, negative: 100 },
        districtStats: { "东城区": 200, "西城区": 300, "海淀区": 400, "朝阳区": 250 }
    };
    return mockData;
}

/**
 * 模拟获取预警事件数据
 * @returns {Promise<AlertEvent[]>}
 */
async function fetchMockAlerts() {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    const mockAlerts = [
        { id: "alert-001", title: "某区域群体性事件苗头", description: "关于XX问题的投诉短期内激增", riskLevel: "high", district: "海淀区", relatedCalls: 55, createdTime: new Date().toISOString(), status: "active", suggestions: ["立即派人调查", "安抚群众情绪"] },
        { id: "alert-002", title: "XX政策解读不清导致大量咨询", description: "大量来电询问新出台的XX政策细节", riskLevel: "medium", district: "全市", relatedCalls: 120, createdTime: new Date().toISOString(), status: "active", suggestions: ["发布官方解读", "加强宣传力度"] }
    ];
    return mockAlerts;
}

// 更新仪表板数据 (占位)
/**
 * 更新页面统计卡片数据
 */
async function updateDashboardStats() {
    try {
        const stats = await fetchMockStats();
        document.getElementById('total-calls').innerText = stats.totalCalls;
        // 模拟热点问题和预警数量，实际应从后端获取
        document.getElementById('hot-topics').innerText = Object.keys(stats.categoryStats).length; // 简单模拟
        const alerts = await fetchMockAlerts();
        document.getElementById('alerts').innerText = alerts.filter(a => a.status === 'active').length;
        // 模拟处理完成率
        document.getElementById('completion-rate').innerText = '85%'; // 静态值
    } catch (error) {
        console.error("Failed to fetch mock stats:", error);
        document.getElementById('total-calls').innerText = '加载失败';
        document.getElementById('hot-topics').innerText = '加载失败';
        document.getElementById('alerts').innerText = '加载失败';
        document.getElementById('completion-rate').innerText = '加载失败';
    }
}

// 模拟图表数据生成函数
/**
 * 模拟生成来电趋势数据
 * @returns {object}
 */
function generateMockTrendData() {
    const labels = [];
    const data = [];
    const now = new Date();
    // 生成过去24小时的数据
    for (let i = 23; i >= 0; i--) {
        const hour = (now.getHours() - i + 24) % 24;
        labels.push(`${hour}:00`);
        data.push(Math.floor(Math.random() * 50) + 10);
    }
    return { labels, data };
}

/**
 * 模拟生成问题分类占比数据
 * @returns {object[]}
 */
function generateMockCategoryData() {
    const categories = ["投诉", "咨询", "建议", "求助", "其他"];
    const data = categories.map(category => ({
        name: category,
        value: Math.floor(Math.random() * 200) + 50
    }));
    return data;
}

/**
 * 模拟生成热力图数据 (简化)
 * @returns {object[]}
 */
function generateMockHeatmapData() {
    // 简单的二维数据，例如按小时和天分布
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const data = [];
    days.forEach((day, dayIndex) => {
        hours.forEach((hour, hourIndex) => {
            data.push([hourIndex, dayIndex, Math.floor(Math.random() * 100)]);
        });
    });
    return { hours, days, data };
}

/**
 * 模拟生成词云数据 (简化)
 * @returns {object[]}
 */
function generateMockWordcloudData() {
    const words = ['交通', '噪音', '环境卫生', '市政设施', '教育', '医疗', '就业', '社保', '房屋', '物业', '公共安全', '消费维权', '服务态度', '政策咨询', '建议', '投诉', '咨询', '求助'];
    const data = words.map(word => ({ name: word, value: Math.floor(Math.random() * 500) + 50 }));
    return data;
}

// ECharts 初始化和数据更新
let realtimeCallsHeatmapChart;
let hotTopicsWordcloudChart;
let callsTrendChart;
let categoryDistributionChart;

/**
 * 初始化所有图表
 */
function initCharts() {
    realtimeCallsHeatmapChart = echarts.init(document.getElementById('realtime-calls-heatmap'));
    hotTopicsWordcloudChart = echarts.init(document.getElementById('hot-topics-wordcloud'));
    callsTrendChart = echarts.init(document.getElementById('calls-trend-chart'));
    categoryDistributionChart = echarts.init(document.getElementById('category-distribution-chart'));
}

/**
 * 更新所有图表数据
 */
function updateCharts() {
    // 来电趋势图
    const trendData = generateMockTrendData();
    callsTrendChart.setOption({
        title: { text: '来电趋势图', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: trendData.labels },
        yAxis: { type: 'value' },
        series: [{
            name: '来电数量',
            type: 'line',
            smooth: true,
            data: trendData.data
        }]
    });

    // 问题分类占比图
    const categoryData = generateMockCategoryData();
    categoryDistributionChart.setOption({
        title: { text: '问题分类占比图', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
            {
                name: '问题分类',
                type: 'pie',
                radius: '50%',
                data: categoryData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    });

    // 热力图 (基础配置)
    const heatmapData = generateMockHeatmapData();
    realtimeCallsHeatmapChart.setOption({
        title: { text: '实时来电热力图', left: 'center' },
        tooltip: { position: 'top' },
        grid: { height: '50%', top: '10%' },
        xAxis: { type: 'category', data: heatmapData.hours, splitArea: { show: true } },
        yAxis: { type: 'category', data: heatmapData.days, splitArea: { show: true } },
        visualMap: { min: 0, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: 'bottom' },
        series: [{
            name: '来电密度',
            type: 'heatmap',
            data: heatmapData.data,
            label: { show: false },
            emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }]
    });

    // 词云图 (基础配置)
    const wordcloudData = generateMockWordcloudData();
    hotTopicsWordcloudChart.setOption({
        title: { text: '热点问题词云', left: 'center' },
        tooltip: { trigger: 'item' },
        series: [{
            type: 'wordCloud',
            shape: 'circle',
            left: 'center',
            top: 'center',
            width: '90%',
            height: '90%',
            right: null,
            bottom: null,
            sizeRange: [12, 60],
            rotationRange: [-90, 90],
            rotationStep: 45,
            gridSize: 8,
            drawOutOfBound: false,
            shrinkToFit: false,
            textStyle: {
                color: function () {
                    return 'rgb(' + [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                    ].join(',') + ')';
                },
                emphasis: { shadowBlur: 10, shadowColor: '#333' }
            },
            data: wordcloudData
        }]
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    console.log("Demo页面加载完成，开始模拟数据加载并初始化图表...");
    initCharts();
    updateDashboardStats();
    updateCharts();

    // 模拟实时数据和图表更新 (每30秒)
    setInterval(() => {
        updateDashboardStats();
        updateCharts();
    }, 30000);
}); 