// 模拟数据生成
const districts = ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '通州区', '顺义区'];
const categories = ['投诉', '咨询', '建议', '求助'];
const topics = ['交通拥堵', '噪音扰民', '物业服务', '教育资源', '医疗卫生', '市政建设', '环境保护', '社会保障'];
const keywords = ['公交', '地铁', '学校', '医院', '垃圾', '施工', '停车', '维修', '物业费', '暖气', '噪音'];

/**
 * 生成随机来电记录
 * @returns {object} 来电记录对象
 */
function generateCallRecord() {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const district = districts[Math.floor(Math.random() * districts.length)];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const sentiment = ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)];
    const urgency = ['high', 'medium', 'low'][Math.floor(Math.random() * 3)];
    
    // 随机生成2-4个关键词
    const recordKeywords = [];
    const keywordCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < keywordCount; i++) {
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        if (!recordKeywords.includes(keyword)) {
            recordKeywords.push(keyword);
        }
    }

    return {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        timestamp: new Date().toISOString(),
        content: `关于${district}${topic}的${category}`,
        category,
        district,
        sentiment,
        urgency,
        keywords: recordKeywords
    };
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('实时监控页面初始化...');
    
    // 初始化地区选择器
    const districtFilter = document.getElementById('districtFilter');
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtFilter.appendChild(option);
    });

    // 初始化问题类型选择器
    const problemTypeFilter = document.getElementById('problemTypeFilter');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        problemTypeFilter.appendChild(option);
    });

    // 初始化各个模块
    initCallStream();
    initHotTopics();
    initGeoDistribution();
});

// 实时来电流模块
let isStreamPaused = false;
const callList = document.getElementById('callList');
const pauseButton = document.getElementById('pauseStream');

function initCallStream() {
    // 初始化暂停/播放按钮事件
    pauseButton.addEventListener('click', () => {
        isStreamPaused = !isStreamPaused;
        pauseButton.innerHTML = isStreamPaused ? 
            '<span class="icon">▶</span> 播放' : 
            '<span class="icon">⏸</span> 暂停';
    });

    // 初始化筛选器事件
    document.getElementById('categoryFilter').addEventListener('change', updateCallList);
    document.getElementById('districtFilter').addEventListener('change', updateCallList);

    // 添加初始数据
    for (let i = 0; i < 10; i++) {
        addCallRecord();
    }

    // 定时添加新数据
    setInterval(() => {
        if (!isStreamPaused) {
            addCallRecord();
        }
    }, 3000);
}

function addCallRecord() {
    const record = generateCallRecord();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const districtFilter = document.getElementById('districtFilter').value;

    // 根据筛选条件判断是否显示
    if ((categoryFilter && record.category !== categoryFilter) ||
        (districtFilter && record.district !== districtFilter)) {
        return;
    }

    const callItem = document.createElement('div');
    callItem.className = 'call-item';
    callItem.innerHTML = `
        <span class="call-time">${new Date(record.timestamp).toLocaleTimeString()}</span>
        <span class="call-content">${record.content}</span>
        <span class="call-tag ${record.urgency === 'high' ? 'urgent' : ''}">${record.category}</span>
        <span class="sentiment-indicator sentiment-${record.sentiment}"></span>
    `;

    callList.insertBefore(callItem, callList.firstChild);

    // 限制显示的记录数量
    if (callList.children.length > 50) {
        callList.removeChild(callList.lastChild);
    }
}

function updateCallList() {
    // 清空现有列表
    callList.innerHTML = '';
    // 重新添加初始数据
    for (let i = 0; i < 10; i++) {
        addCallRecord();
    }
}

// 热点话题监控模块
let topicTrendChart;

function initHotTopics() {
    // 初始化热门话题列表
    updateHotTopicsList();
    setInterval(updateHotTopicsList, 10000);

    // 初始化趋势图表
    topicTrendChart = echarts.init(document.getElementById('topicTrendChart'));
    updateTopicTrendChart();
    setInterval(updateTopicTrendChart, 10000);
}

function updateHotTopicsList() {
    const hotTopicsList = document.getElementById('hotTopicsList');
    hotTopicsList.innerHTML = '';

    // 生成模拟数据
    const topicCounts = topics.map(topic => ({
        name: topic,
        count: Math.floor(Math.random() * 100) + 20
    })).sort((a, b) => b.count - a.count);

    // 显示前5个热门话题
    topicCounts.slice(0, 5).forEach(topic => {
        const topicItem = document.createElement('div');
        topicItem.className = 'topic-item';
        topicItem.innerHTML = `
            <span class="topic-name">${topic.name}</span>
            <span class="topic-count">${topic.count}条</span>
        `;
        hotTopicsList.appendChild(topicItem);
    });
}

function updateTopicTrendChart() {
    const hours = Array.from({length: 24}, (_, i) => `${i}:00`);
    const data = Array.from({length: 24}, () => Math.floor(Math.random() * 50) + 10);

    const option = {
        title: {
            text: '话题热度趋势',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: hours
        },
        yAxis: {
            type: 'value',
            name: '提及次数'
        },
        series: [{
            name: '热度',
            type: 'line',
            smooth: true,
            data: data,
            areaStyle: {
                opacity: 0.3
            }
        }]
    };

    topicTrendChart.setOption(option);
}

// 地理分布监控模块
let map;
let heatmap;

function initGeoDistribution() {
    // 初始化地图
    map = new AMap.Map('mapContainer', {
        zoom: 11,
        center: [116.397428, 39.90923] // 北京市中心坐标
    });

    // 初始化热力图
    const heatmapData = generateHeatmapData();
    heatmap = new AMap.HeatMap(map, {
        radius: 25,
        opacity: [0, 0.8]
    });
    heatmap.setDataSet({
        data: heatmapData,
        max: 100
    });

    // 添加标记点
    addMarkers();

    // 绑定图层控制事件
    document.getElementById('heatmapLayer').addEventListener('change', (e) => {
        heatmap.setMap(e.target.checked ? map : null);
    });

    document.getElementById('markerLayer').addEventListener('change', (e) => {
        // 实际项目中这里应该控制标记点图层的显示/隐藏
        console.log('切换标记点图层:', e.target.checked);
    });

    // 问题类型筛选
    document.getElementById('problemTypeFilter').addEventListener('change', (e) => {
        // 实际项目中这里应该根据问题类型更新地图数据
        console.log('切换问题类型:', e.target.value);
        updateMapData();
    });
}

function generateHeatmapData() {
    const data = [];
    // 生成随机热力图数据点
    for (let i = 0; i < 50; i++) {
        data.push({
            lng: 116.397428 + (Math.random() - 0.5) * 0.5,
            lat: 39.90923 + (Math.random() - 0.5) * 0.5,
            count: Math.floor(Math.random() * 100) + 1
        });
    }
    return data;
}

function addMarkers() {
    districts.forEach(district => {
        // 这里应该使用真实的区域中心坐标
        const marker = new AMap.Marker({
            position: [
                116.397428 + (Math.random() - 0.5) * 0.3,
                39.90923 + (Math.random() - 0.5) * 0.3
            ],
            title: district
        });
        marker.setMap(map);
    });
}

function updateMapData() {
    // 更新热力图数据
    const newData = generateHeatmapData();
    heatmap.setDataSet({
        data: newData,
        max: 100
    });
}

// 窗口大小变化时重新调整图表大小
window.addEventListener('resize', () => {
    if (topicTrendChart) {
        topicTrendChart.resize();
    }
}); 