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

// 北京各区坐标数据
const districtCoordinates = {
    '东城区': [116.416357, 39.928353],
    '西城区': [116.366794, 39.915309],
    '朝阳区': [116.443108, 39.921740],
    '海淀区': [116.310316, 39.956074],
    '丰台区': [116.286968, 39.863642],
    '石景山区': [116.195445, 39.914601],
    '通州区': [116.656435, 39.909946],
    '顺义区': [116.665342, 40.130787]
};

// 地理分布监控模块
let map;
let heatmap;
let markers = [];

function initGeoDistribution() {
    // 加载高德地图插件
    AMap.plugin(['AMap.Scale', 'AMap.ToolBar', 'AMap.HeatMap'], function() {
        // 初始化地图
        map = new AMap.Map('mapContainer', {
            zoom: 11,
            center: [116.397428, 39.90923], // 北京市中心坐标
            mapStyle: 'amap://styles/whitesmoke' // 使用浅色地图样式
        });

        // 添加地图控件
        map.addControl(new AMap.Scale()); // 比例尺
        map.addControl(new AMap.ToolBar()); // 工具栏

        // 确保地图完全加载后再初始化热力图和标记点
        map.on('complete', function() {
            // 初始化热力图
            initHeatmap();
            
            // 添加标记点
            addMarkers();
        });

        // 绑定图层控制事件
        document.getElementById('heatmapLayer').addEventListener('change', (e) => {
            heatmap.setMap(e.target.checked ? map : null);
        });

        document.getElementById('markerLayer').addEventListener('change', (e) => {
            markers.forEach(marker => {
                marker.setMap(e.target.checked ? map : null);
            });
        });

        // 问题类型筛选
        document.getElementById('problemTypeFilter').addEventListener('change', (e) => {
            updateMapData(e.target.value);
        });

        // 定时更新数据
        setInterval(() => {
            updateMapData(document.getElementById('problemTypeFilter').value);
        }, 30000);
    });
}

function initHeatmap() {
    // 确保在实例化时就提供数据
    const initialHeatmapData = generateHeatmapData();
    heatmap = new AMap.HeatMap(map, {
        radius: 25,
        opacity: [0, 0.8],
        gradient: {
            0.4: '#0000FF', // 蓝色
            0.65: '#FFFF00', // 黄色
            0.85: '#FFA500', // 橙色
            1.0: '#FF0000' // 红色
        },
        // 直接设置初始数据集
        dataSet: {
            data: initialHeatmapData,
            max: 100
        }
    });
}

function generateHeatmapData(problemType = '') {
    const data = [];
    // 为每个区域生成多个热力点
    Object.entries(districtCoordinates).forEach(([district, [lng, lat]]) => {
        // 每个区域生成5-10个点
        const pointCount = Math.floor(Math.random() * 6) + 5;
        for (let i = 0; i < pointCount; i++) {
            // 在区域坐标周围随机生成点
            const offset = 0.02; // 约2公里的偏移
            const randomLng = lng + (Math.random() - 0.5) * offset;
            const randomLat = lat + (Math.random() - 0.5) * offset;
            
            // 生成不同强度的热力值
            const count = Math.floor(Math.random() * 100) + 20;
            
            data.push({
                lng: randomLng,
                lat: randomLat,
                count: count
            });
        }
    });
    return data;
}

function addMarkers() {
    // 清除现有标记
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    // 为每个区域添加标记
    Object.entries(districtCoordinates).forEach(([district, coordinates]) => {
        // 创建标记点
        const marker = new AMap.Marker({
            position: coordinates,
            title: district,
            label: {
                content: district,
                direction: 'bottom',
                offset: new AMap.Pixel(0, -10)
            }
        });

        // 创建信息窗体
        const infoWindow = new AMap.InfoWindow({
            content: `<div class="info-window">
                        <h4>${district}</h4>
                        <p>今日来电：${Math.floor(Math.random() * 100) + 50}条</p>
                        <p>处理中：${Math.floor(Math.random() * 30) + 10}条</p>
                        <p>已完成：${Math.floor(Math.random() * 50) + 30}条</p>
                     </div>`,
            offset: new AMap.Pixel(0, -30)
        });

        // 绑定点击事件
        marker.on('click', () => {
            infoWindow.open(map, marker.getPosition());
        });

        marker.setMap(map);
        markers.push(marker);
    });
}

function updateMapData(problemType = '') {
    const newData = generateHeatmapData(problemType);
    heatmap.setDataSet({
        data: newData,
        max: 100
    });

    // 更新标记点的数据
    markers.forEach(marker => {
        const district = marker.getTitle();
        const infoWindow = new AMap.InfoWindow({
            content: `<div class="info-window">
                        <h4>${district}</h4>
                        <p>今日来电：${Math.floor(Math.random() * 100) + 50}条</p>
                        <p>处理中：${Math.floor(Math.random() * 30) + 10}条</p>
                        <p>已完成：${Math.floor(Math.random() * 50) + 30}条</p>
                     </div>`,
            offset: new AMap.Pixel(0, -30)
        });
        
        // 更新点击事件
        marker.on('click', () => {
            infoWindow.open(map, marker.getPosition());
        });
    });
}

// 窗口大小变化时重新调整图表大小
window.addEventListener('resize', () => {
    if (topicTrendChart) {
        topicTrendChart.resize();
    }
}); 