// 预警中心页面 JavaScript

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

// 模拟数据函数
/**
 * 模拟获取预警事件数据
 * @returns {Promise<AlertEvent[]>}
 */
async function fetchMockAlertEvents() {
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
    const now = new Date();
    return [
        { id: "alert-001", title: "某区域群体性事件苗头", description: "关于XX问题的投诉短期内激增", riskLevel: "high", district: "海淀区", relatedCalls: 55, createdTime: new Date(now.getTime() - 3600 * 1000).toISOString(), status: "active", suggestions: ["立即派人调查", "安抚群众情绪"] },
        { id: "alert-002", title: "XX政策解读不清导致大量咨询", description: "大量来电询问新出台的XX政策细节", riskLevel: "medium", district: "全市", relatedCalls: 120, createdTime: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(), status: "active", suggestions: ["发布官方解读", "加强宣传力度"] },
        { id: "alert-003", title: "物业费纠纷升级", description: "某小区物业费问题长期未解决，引发居民强烈不满", riskLevel: "high", district: "朝阳区", relatedCalls: 30, createdTime: new Date(now.getTime() - 5 * 3600 * 1000).toISOString(), status: "active", suggestions: ["介入协调", "召开居民大会"] },
        { id: "alert-004", title: "施工噪音投诉增多", description: "夜间施工噪音扰民问题，居民投诉不断", riskLevel: "medium", district: "丰台区", relatedCalls: 80, createdTime: new Date(now.getTime() - 10 * 3600 * 1000).toISOString(), status: "resolved", suggestions: ["核查施工许可", "要求限时整改"] },
        { id: "alert-005", title: "环境卫生问题", description: "部分区域垃圾清理不及时，影响市容环境", riskLevel: "low", district: "西城区", relatedCalls: 15, createdTime: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(), status: "active", suggestions: ["加强环卫巡查", "增设垃圾桶"] }
    ];
}

/**
 * 模拟生成预警趋势数据
 * @returns {object}
 */
function generateAlertTrendData() {
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return `${d.getMonth() + 1}-${d.getDate()}`;
    }).reverse();
    const highRisk = dates.map(() => Math.floor(Math.random() * 5) + 1);
    const mediumRisk = dates.map(() => Math.floor(Math.random() * 8) + 3);
    const lowRisk = dates.map(() => Math.floor(Math.random() * 12) + 5);
    return { dates, highRisk, mediumRisk, lowRisk };
}

// 更新风险等级卡片
/**
 * 更新风险等级统计卡片数据
 * @param {AlertEvent[]} alerts
 */
function updateRiskLevelCards(alerts) {
    const highCount = alerts.filter(a => a.riskLevel === 'high' && a.status === 'active').length;
    const mediumCount = alerts.filter(a => a.riskLevel === 'medium' && a.status === 'active').length;
    const lowCount = alerts.filter(a => a.riskLevel === 'low' && a.status === 'active').length;

    document.getElementById('highRiskCount').innerText = highCount;
    document.getElementById('mediumRiskCount').innerText = mediumCount;
    document.getElementById('lowRiskCount').innerText = lowCount;
}

// 渲染预警事件列表
/**
 * 渲染预警事件表格
 * @param {AlertEvent[]} alerts
 */
function renderAlertTable(alerts) {
    const tbody = document.getElementById('alertTableBody');
    tbody.innerHTML = ''; // 清空现有内容

    alerts.forEach(alert => {
        const row = tbody.insertRow();
        row.insertCell().innerText = alert.title;
        const riskCell = row.insertCell();
        riskCell.innerHTML = `<span class="risk-level-tag ${alert.riskLevel}">${alert.riskLevel === 'high' ? '高' : alert.riskLevel === 'medium' ? '中' : '低'}风险</span>`;
        row.insertCell().innerText = alert.district;
        row.insertCell().innerText = alert.relatedCalls;
        row.insertCell().innerText = new Date(alert.createdTime).toLocaleString();
        const statusCell = row.insertCell();
        statusCell.innerText = alert.status === 'active' ? '活跃' : '已解决';
        statusCell.style.color = alert.status === 'active' ? 'var(--danger-color)' : 'var(--success-color)';
        row.insertCell().innerText = alert.suggestions.join(', ');
    });
}

// ECharts 实例
let alertTrendChart;

/**
 * 初始化预警趋势图表
 */
function initAlertTrendChart() {
    alertTrendChart = echarts.init(document.getElementById('alertTrendChart'));
    updateAlertTrendChart(); // 初始渲染一次
}

/**
 * 更新预警趋势图表数据
 */
function updateAlertTrendChart() {
    const trendData = generateAlertTrendData();
    alertTrendChart.setOption({
        title: { text: '预警数量变化趋势', left: 'center' },
        tooltip: { trigger: 'axis' },
        legend: { data: ['高风险', '中风险', '低风险'], bottom: 0 },
        xAxis: { type: 'category', boundaryGap: false, data: trendData.dates },
        yAxis: { type: 'value' },
        series: [
            { name: '高风险', type: 'line', smooth: true, data: trendData.highRisk, itemStyle: { color: 'var(--danger-color)' } },
            { name: '中风险', type: 'line', smooth: true, data: trendData.mediumRisk, itemStyle: { color: 'var(--warning-color)' } },
            { name: '低风险', type: 'line', smooth: true, data: trendData.lowRisk, itemStyle: { color: 'var(--success-color)' } }
        ]
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async () => {
    console.log('预警中心页面加载完成，开始模拟数据加载并初始化图表...');

    const alerts = await fetchMockAlertEvents();
    updateRiskLevelCards(alerts);
    renderAlertTable(alerts);
    initAlertTrendChart();

    // 模拟实时数据和图表更新 (每30秒)
    setInterval(async () => {
        const updatedAlerts = await fetchMockAlertEvents();
        updateRiskLevelCards(updatedAlerts);
        renderAlertTable(updatedAlerts);
        updateAlertTrendChart();
    }, 30000);
}); 