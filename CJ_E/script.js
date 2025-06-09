// Simulated data
const simulatedData = [
    {
        id: "1",
        content: "打了好几次电话都占线，等待时间太长了！希望增加人手。",
        source: "phone",
        timestamp: new Date(Date.now() - 5*60*1000), // 5 minutes ago
        region: "区域A",
        category: "服务效率",
        sentiment: { score: -0.8, label: "负面", confidence: 0.92 },
        keywords: ["占线", "等待时间长", "增加人手"],
        resolved: false
    },
    {
        id: "2",
        content: "在网上提交了问题，回复速度很快，工作人员解答也很专业，非常满意！",
        source: "online",
        timestamp: new Date(Date.now() - 4*60*1000), // 4 minutes ago
        region: "区域B",
        category: "在线服务",
        sentiment: { score: 0.95, label: "正面", confidence: 0.98 },
        keywords: ["回复快", "专业", "满意"],
        resolved: true
    },
    {
        id: "3",
        content: "咨询了一个关于社保的问题，接线员很有耐心，解释得很清楚。",
        source: "phone",
        timestamp: new Date(Date.now() - 3*60*1000), // 3 minutes ago
        region: "区域A",
        category: "工作人员态度",
        sentiment: { score: 0.7, label: "正面", confidence: 0.9 },
        keywords: ["有耐心", "解释清楚"],
        resolved: true
    },
    {
        id: "4",
        content: "app里填报信息时总是闪退，试了好几次都不行，太麻烦了。",
        source: "online",
        timestamp: new Date(Date.now() - 2*60*1000), // 2 minutes ago
        region: "区域C",
        category: "系统技术问题",
        sentiment: { score: -0.6, label: "负面", confidence: 0.88 },
        keywords: ["app闪退", "麻烦"],
        resolved: false
    },
     {
        id: "5",
        content: "只是想查个政策，结果转了好几个部门都没搞清楚，流程太复杂了。",
        source: "phone",
        timestamp: new Date(Date.now() - 1*60*1000), // 1 minute ago
        region: "区域D",
        category: "办事流程",
        sentiment: { score: -0.75, label: "负面", confidence: 0.91 },
        keywords: ["流程复杂", "部门"],
        resolved: false
    },
    {
        id: "6",
        content: "反馈了一个路面积水问题，很快就得到了处理，效率很高！",
        source: "social",
        timestamp: new Date(),
        region: "区域B",
        category: "市政设施",
        sentiment: { score: 0.85, label: "正面", confidence: 0.94 },
        keywords: ["路面积水", "处理快", "效率高"],
        resolved: true
    },
    // Add more varied simulated data here if needed
];

// Define a pool of realistic feedback snippets for random generation
const realisticFeedbackPool = [
    { content: "电话很难打通，等了很久。", sentiment: { label: "负面", score: -0.7 }, keywords: ["电话难打", "等待"] },
    { content: "工作人员服务态度很好，耐心解答了我的问题。", sentiment: { label: "正面", score: 0.8 }, keywords: ["服务态度", "耐心"] },
    { content: "网站操作不太方便，希望能优化一下。", sentiment: { label: "负面", score: -0.5 }, keywords: ["网站", "优化"] },
    { content: "咨询的问题得到了解决，非常感谢！", sentiment: { label: "正面", score: 0.9 }, keywords: ["问题解决", "感谢"] },
    { content: "反馈后一直没有收到回复，希望能尽快处理。", sentiment: { label: "负面", score: -0.6 }, keywords: ["无回复", "处理"] },
    { content: "只是询问一个信息，过程很顺利。", sentiment: { label: "中性", score: 0.3 }, keywords: ["顺利", "信息"] },
    { content: "政策解读不够清晰，希望有更详细的说明。", sentiment: { label: "负面", score: -0.7 }, keywords: ["政策解读", "说明"] },
    { content: "在微信公众号上反馈的问题，响应速度很快。", sentiment: { label: "正面", score: 0.85 }, keywords: ["微信公众号", "响应速度"] },
    { content: "对处理结果不满意，希望能重新核实。", sentiment: { label: "负面", score: -0.9 }, keywords: ["不满意", "核实"] },
    { content: "办事指南写得很详细，很有帮助。", sentiment: { label: "正面", score: 0.7 }, keywords: ["办事指南", "有帮助"] },
];

let processedCount = 0;
let pendingCount = simulatedData.length;
let simulationInterval = null; // Variable to hold the interval ID

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

// Function to start simulation
function startSimulation() {
    if (!simulationInterval) {
        // Process initial pending data if any
        while (pendingCount > 0 && processedCount < 3) { // Process first few items instantly
             processedCount++;
             pendingCount--;
             updateStatusDisplay();
             const nextFeedback = simulatedData[processedCount - 1];
             updateSentimentDisplay(nextFeedback);
             updateSentimentChart();
        }
        // Start interval for remaining data and new arrivals
        simulationInterval = setInterval(() => {
            if (pendingCount > 0) {
                 processedCount++;
                 pendingCount--;
                 updateStatusDisplay();
                 const nextFeedback = simulatedData[processedCount - 1];
                 updateSentimentDisplay(nextFeedback);
                 updateSentimentChart();
            } else {
                // Simulate new data arrival occasionally even if initial data is processed
                if (Math.random() < 0.5) { // Higher chance when initial data is done
                    // Select a random feedback snippet from the pool
                    const randomFeedback = realisticFeedbackPool[Math.floor(Math.random() * realisticFeedbackPool.length)];

                    const newFeedback = {
                        id: `new-${Date.now()}`,
                        content: randomFeedback.content, // Use realistic content
                        source: ["phone", "online", "social"][Math.floor(Math.random() * 3)], // Random source
                        timestamp: new Date(),
                        region: "模拟区域", // Keep generic region for new data
                        category: "模拟类别", // Keep generic category for new data
                        sentiment: randomFeedback.sentiment, // Use realistic sentiment
                        keywords: randomFeedback.keywords, // Use realistic keywords
                        resolved: Math.random() > 0.5 // Randomly set resolved status
                    };
                    simulatedData.push(newFeedback);
                    pendingCount++;
                    updateStatusDisplay();
                    // Instantly process new arrival for demo effect
                    processedCount++;
                    pendingCount--;
                    updateStatusDisplay();
                    updateSentimentDisplay(newFeedback);
                    updateSentimentChart();
                }
            }
            updateWarningSystem(); // Update warning system with simulation
        }, 1500); // Process or add new data every 1.5 seconds

        document.querySelector('#data-input .controls button').innerText = '暂停接入 (模拟)';
    }
}

// Function to stop simulation
function stopSimulation() {
    clearInterval(simulationInterval);
    simulationInterval = null;
    document.querySelector('#data-input .controls button').innerText = '实时接入 (模拟)';
}

// Initialize chart on page load - keep this
window.addEventListener('load', initializeSentimentChart);

// Initial status update - keep this
updateStatusDisplay();

// Function to clear sentiment display
function clearSentimentDisplay() {
    document.getElementById('current-feedback').innerText = '等待数据...';
    document.getElementById('current-sentiment').innerText = '等待分析...';
    document.getElementById('current-keywords').innerText = '等待提取...';
}

// Add event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Clear sentiment display on load
    clearSentimentDisplay();

    // Button event listeners
    // Removed event listener for Batch Upload (模拟)
    // Removed event listener for Manual Input (模拟)

    const realTimeButton = document.querySelector('#data-input .controls button'); // Updated selector
    realTimeButton.addEventListener('click', () => {
        if (simulationInterval) {
            stopSimulation();
        } else {
            startSimulation();
        }
    });

    // Data source checkbox event listeners
    document.querySelectorAll('.data-source-select input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const selectedSources = Array.from(document.querySelectorAll('.data-source-select input[type="checkbox"]:checked'))
                                       .map(cb => cb.nextSibling.textContent);
            console.log('当前选中的数据源:', selectedSources);
            // For a more advanced demo, you would filter simulatedData based on selectedSources here
            // and then call updateSentimentChart() and updateWarningSystem() if filtering affects them.
            alert(`模拟：数据源过滤为 [${selectedSources.join(', ')}] (实际过滤功能待实现)`);
        });
    });

    // Start simulation automatically on load
    // startSimulation(); // Removed automatic start
});

// Simple Warning System Simulation - keep this, but it will be called by startSimulation interval
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