// 舆情分析页面 JavaScript

// 模拟数据生成函数

/**
 * 模拟生成问题分类分布数据
 * @returns {object[]}
 */
function generateCategoryDistributionData() {
    const categories = ['投诉', '咨询', '建议', '求助', '表扬', '举报'];
    const data = categories.map(name => ({ name, value: Math.floor(Math.random() * 300) + 100 }));
    return data;
}

/**
 * 模拟生成问题分类对比数据 (柱状图)
 * @returns {object}
 */
function generateCategoryComparisonData() {
    const categories = ['投诉', '咨询', '建议', '求助', '表扬', '举报'];
    const data = categories.map(() => Math.floor(Math.random() * 200) + 50);
    return { categories, data };
}

/**
 * 模拟生成问题分类趋势数据
 * @returns {object}
 */
function generateCategoryTrendData() {
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return `${d.getMonth() + 1}-${d.getDate()}`;
    }).reverse();
    const categories = ['投诉', '咨询', '建议', '求助'];
    const series = categories.map(category => ({
        name: category,
        type: 'line',
        smooth: true,
        data: dates.map(() => Math.floor(Math.random() * 100) + 20)
    }));
    return { dates, series };
}

/**
 * 模拟生成情感倾向分布数据
 * @returns {object[]}
 */
function generateSentimentDistributionData() {
    return [
        { value: Math.floor(Math.random() * 500) + 200, name: '正面' },
        { value: Math.floor(Math.random() * 300) + 100, name: '中性' },
        { value: Math.floor(Math.random() * 150) + 50, name: '负面' },
    ];
}

/**
 * 模拟生成情感变化趋势数据
 * @returns {object}
 */
function generateSentimentTrendData() {
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return `${d.getMonth() + 1}-${d.getDate()}`;
    }).reverse();
    const sentiments = ['正面', '中性', '负面'];
    const series = sentiments.map(sentiment => ({
        name: sentiment,
        type: 'line',
        smooth: true,
        data: dates.map(() => Math.floor(Math.random() * 100) + 20)
    }));
    return { dates, series };
}

/**
 * 模拟生成关键词词云数据
 * @returns {object[]}
 */
function generateKeywordWordcloudData() {
    const words = [
        '交通拥堵', '环境污染', '噪音扰民', '市政设施损坏', '教育资源', '医疗服务',
        '就业问题', '社会保障', '房屋租赁', '物业管理', '公共安全', '消费维权',
        '服务态度差', '政策咨询', '行政效率', '社区活动', '垃圾分类', '疫情', '投诉处理'
    ];
    const data = words.map(word => ({ name: word, value: Math.floor(Math.random() * 500) + 50 }));
    return data;
}

/**
 * 模拟生成关键词趋势数据
 * @returns {object}
 */
function generateKeywordTrendData() {
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return `${d.getMonth() + 1}-${d.getDate()}`;
    }).reverse();
    const keywords = ['交通拥堵', '环境污染', '物业管理'];
    const series = keywords.map(keyword => ({
        name: keyword,
        type: 'line',
        smooth: true,
        data: dates.map(() => Math.floor(Math.random() * 80) + 10)
    }));
    return { dates, series };
}

// ECharts 实例
let categoryDistributionChart;
let categoryComparisonChart;
let categoryTrendChart;
let sentimentDistributionChart;
let sentimentTrendChart;
let keywordWordcloudChart;
let keywordTrendChart;

/**
 * 初始化所有图表
 */
function initAnalysisCharts() {
    categoryDistributionChart = echarts.init(document.getElementById('categoryDistributionChart'));
    categoryComparisonChart = echarts.init(document.getElementById('categoryComparisonChart'));
    categoryTrendChart = echarts.init(document.getElementById('categoryTrendChart'));
    sentimentDistributionChart = echarts.init(document.getElementById('sentimentDistributionChart'));
    sentimentTrendChart = echarts.init(document.getElementById('sentimentTrendChart'));
    keywordWordcloudChart = echarts.init(document.getElementById('keywordWordcloudChart'));
    keywordTrendChart = echarts.init(document.getElementById('keywordTrendChart'));

    // 初始渲染一次，避免空白
    updateAnalysisCharts();
}

/**
 * 更新所有图表数据和配置
 */
function updateAnalysisCharts() {
    // 问题分类分布饼图
    const categoryDistData = generateCategoryDistributionData();
    categoryDistributionChart.setOption({
        title: { text: '问题分类分布', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
            {
                name: '问题分类',
                type: 'pie',
                radius: '50%',
                data: categoryDistData,
                emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
            }
        ]
    });

    // 问题分类对比柱状图
    const categoryCompData = generateCategoryComparisonData();
    categoryComparisonChart.setOption({
        title: { text: '各类问题数量对比', left: 'center' },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: { type: 'category', data: categoryCompData.categories },
        yAxis: { type: 'value' },
        series: [{
            name: '数量',
            type: 'bar',
            data: categoryCompData.data,
            itemStyle: { color: '#3B82F6' }
        }]
    });

    // 问题分类趋势图
    const categoryTrend = generateCategoryTrendData();
    categoryTrendChart.setOption({
        title: { text: '问题分类趋势', left: 'center' },
        tooltip: { trigger: 'axis' },
        legend: { data: categoryTrend.series.map(s => s.name), bottom: 0 },
        xAxis: { type: 'category', boundaryGap: false, data: categoryTrend.dates },
        yAxis: { type: 'value' },
        series: categoryTrend.series
    });

    // 情感倾向分布饼图
    const sentimentDistData = generateSentimentDistributionData();
    sentimentDistributionChart.setOption({
        title: { text: '情感倾向分布', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
            {
                name: '情感倾向',
                type: 'pie',
                radius: '50%',
                data: sentimentDistData,
                emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
                itemStyle: {
                    color: function(params) {
                        const colorMap = {
                            '正面': '#10B981',
                            '中性': '#999',
                            '负面': '#EF4444'
                        };
                        return colorMap[params.name] || '#3B82F6';
                    }
                }
            }
        ]
    });

    // 情感变化趋势图
    const sentimentTrend = generateSentimentTrendData();
    sentimentTrendChart.setOption({
        title: { text: '情感变化趋势', left: 'center' },
        tooltip: { trigger: 'axis' },
        legend: { data: sentimentTrend.series.map(s => s.name), bottom: 0 },
        xAxis: { type: 'category', boundaryGap: false, data: sentimentTrend.dates },
        yAxis: { type: 'value' },
        series: sentimentTrend.series
    });

    // 关键词词云图
    const keywordWordcloud = generateKeywordWordcloudData();
    keywordWordcloudChart.setOption({
        title: { text: '热点关键词', left: 'center' },
        tooltip: { trigger: 'item' },
        series: [{
            type: 'wordCloud',
            shape: 'circle',
            left: 'center',
            top: 'center',
            width: '90%',
            height: '90%',
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
            data: keywordWordcloud
        }]
    });

    // 关键词趋势图
    const keywordTrend = generateKeywordTrendData();
    keywordTrendChart.setOption({
        title: { text: '关键词趋势', left: 'center' },
        tooltip: { trigger: 'axis' },
        legend: { data: keywordTrend.series.map(s => s.name), bottom: 0 },
        xAxis: { type: 'category', boundaryGap: false, data: keywordTrend.dates },
        yAxis: { type: 'value' },
        series: keywordTrend.series
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    console.log('舆情分析页面加载完成，初始化图表...');
    initAnalysisCharts();

    // 模拟实时数据和图表更新 (每30秒)
    setInterval(() => {
        updateAnalysisCharts();
    }, 30000);
}); 