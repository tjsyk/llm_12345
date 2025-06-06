// Simulated data
const simulatedData = [
    {
        id: "1",
        content: "等了40分钟才接通，工作人员态度还不错。",
        source: "phone",
        timestamp: new Date(),
        region: "区域A",
        category: "服务效率",
        sentiment: { score: 0.2, label: "中性", confidence: 0.85 },
        keywords: ["等待时间长", "工作人员态度", "服务效率"],
        resolved: false
    },
    {
        id: "2",
        content: "在线问卷反馈，界面操作流畅，问题很快解决了，很满意！",
        source: "online",
        timestamp: new Date(),
        region: "区域B",
        category: "在线服务",
        sentiment: { score: 0.9, label: "正面", confidence: 0.95 },
        keywords: ["界面流畅", "问题解决", "满意"],
        resolved: true
    },
    {
        id: "3",
        content: "社交媒体上看到有人抱怨，系统总是卡顿，希望能改进。",
        source: "social",
        timestamp: new Date(),
        region: "区域C",
        category: "系统技术问题",
        sentiment: { score: -0.7, label: "负面", confidence: 0.9 },
        keywords: ["系统卡顿", "改进"],
        resolved: false
    },
    // Add more simulated data...
];

let processedCount = 0;
let pendingCount = simulatedData.length;

// Update status display
function updateStatusDisplay() {
    document.getElementById('processed-count').innerText = processedCount;
    document.getElementById('pending-count').innerText = pendingCount;
}

// Simulate real-time data input and processing
function simulateDataProcessing() {
    if (pendingCount > 0) {
        processedCount++;
        pendingCount--;
        updateStatusDisplay();

        // Simulate processing a feedback item
        const nextFeedback = simulatedData[processedCount - 1]; // Get the just processed item
        updateSentimentDisplay(nextFeedback);
        updateSentimentChart();

        // Simulate new data arrival occasionally
        if (Math.random() < 0.3) { // 30% chance of new data arriving
            const newFeedback = {
                id: `new-${Date.now()}`,
                content: "这是一条模拟的新反馈内容，情感随机生成。",
                source: "phone",
                timestamp: new Date(),
                region: "区域D",
                category: "其他",
                sentiment: {
                    score: Math.random() * 2 - 1, // Between -1 and 1
                    label: Math.random() > 0.6 ? "正面" : (Math.random() > 0.3 ? "中性" : "负面"),
                    confidence: Math.random() * 0.3 + 0.7 // Between 0.7 and 1
                },
                keywords: ["新反馈", "模拟"],
                resolved: false
            };
            simulatedData.push(newFeedback);
            pendingCount++;
            updateStatusDisplay();
        }

    }
}

// Update sentiment analysis display
function updateSentimentDisplay(feedback) {
    document.getElementById('current-feedback').innerText = feedback.content;
    document.getElementById('current-sentiment').innerText = `${feedback.sentiment.label} (${feedback.sentiment.score.toFixed(1)}) | 🔍 置信度: ${(feedback.sentiment.confidence * 100).toFixed(0)}%`;
    document.getElementById('current-keywords').innerText = `#${feedback.keywords.join(' #')}`;
}

// ECharts Sentiment Chart
let sentimentChart = null;

function initializeSentimentChart() {
    const chartDom = document.getElementById('sentiment-chart');
    sentimentChart = echarts.init(chartDom);
    updateSentimentChart(); // Initial render
}

function updateSentimentChart() {
    // Calculate sentiment distribution from processed data
    const processedData = simulatedData.slice(0, processedCount);
    const sentimentCounts = processedData.reduce((acc, item) => {
        acc[item.sentiment.label] = (acc[item.sentiment.label] || 0) + 1;
        return acc;
    }, {});

    const totalProcessed = processedData.length;
    const sentimentData = Object.keys(sentimentCounts).map(key => ({
        value: sentimentCounts[key],
        name: `${key} (${(((sentimentCounts[key] / totalProcessed) || 0) * 100).toFixed(1)}%)`
    }));

    const option = {
        title: {
            text: '情感分布统计',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: '情感分布',
                type: 'pie',
                radius: '50%',
                data: sentimentData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    sentimentChart.setOption(option);
}

// Initial status update
updateStatusDisplay();

// Initialize chart on page load
window.addEventListener('load', initializeSentimentChart);

// Start simulating data processing at intervals
setInterval(simulateDataProcessing, 2000); // Process one item every 2 seconds

// Simple Warning System Simulation (Based on negative sentiment count)
function updateWarningSystem() {
    const processedData = simulatedData.slice(0, processedCount);
    const negativeCount = processedData.filter(item => item.sentiment.label === '负面').length;
    const totalProcessed = processedData.length;
    const negativePercentage = totalProcessed > 0 ? (negativeCount / totalProcessed) : 0;

    const alertStatusElement = document.getElementById('alert-status');
    alertStatusElement.className = ''; // Reset classes

    if (negativePercentage > 0.3) {
        alertStatusElement.innerText = '🔴 高优先级预警: 负面情感占比较高';
        alertStatusElement.classList.add('red');
    } else if (negativePercentage > 0.1) {
        alertStatusElement.innerText = '🟡 中等预警: 存在一定负面情感';
        alertStatusElement.classList.add('yellow');
    } else {
        alertStatusElement.innerText = '🟢 系统正常';
        alertStatusElement.classList.add('green');
    }
}

// Update warning system at intervals
setInterval(updateWarningSystem, 5000); // Check every 5 seconds 