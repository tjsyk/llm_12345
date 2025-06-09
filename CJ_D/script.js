// Define demo scenarios based on the documentation
const demoScenarios = [
    {
        id: '1',
        title: "噪音投诉案例",
        callerInfo: {
            phone: "138****1234",
            location: "朝阳区建国路88号"
        },
        audioScript: "您好，我要投诉楼下餐厅的噪音问题。每天晚上11点以后还在营业，油烟机和客人说话声音特别大，严重影响我们休息。我住在朝阳区建国路88号，这个问题已经持续一个月了，希望能尽快处理。",
        expectedAnalysis: {
            category: "噪音投诉",
            priority: "高",
            keywords: ["噪音", "餐厅", "油烟机", "建国路88号"],
            department: "朝阳区城管执法局",
            confidence: { category: 0.95, priority: 0.92, department: 0.98 }
        },
        estimatedDuration: 20 // seconds for transcription + analysis
    },
    {
        id: '2',
        title: "道路维修案例",
        callerInfo: {
            phone: "139****5678",
            location: "海淀区中关村大街北四环交叉口附近"
        },
        audioScript: "我要反映一个道路问题。海淀区中关村大街和北四环交叉口附近，有一个很大的坑洞，下雨天积水很深，车辆通过时很危险。希望相关部门能够及时修复。",
        expectedAnalysis: {
            category: "道路维修",
            priority: "中",
            keywords: ["道路问题", "坑洞", "中关村大街", "北四环"],
            department: "海淀区住建委",
            confidence: { category: 0.90, priority: 0.85, department: 0.93 }
        },
        estimatedDuration: 18 // seconds
    },
    {
        id: '3',
        title: "政策咨询案例",
        callerInfo: {
            phone: "137****8765",
            location: "北京市"
        },
        audioScript: "您好，我想咨询一下小孩上学的政策。我们是外地户口，在北京工作了5年，想了解一下孩子在北京上小学需要什么手续，需要准备哪些材料？",
        expectedAnalysis: {
            category: "政策咨询",
            priority: "低",
            keywords: ["小孩上学", "外地户口", "北京小学", "手续", "材料"],
            department: "北京市教委",
            confidence: { category: 0.88, priority: 0.70, department: 0.91 }
        },
        estimatedDuration: 22 // seconds
    }
    // Add more scenarios here if needed
];

// Get HTML elements
const scenarioSelect = document.getElementById('scenario-select');
const callerPhoneSpan = document.getElementById('caller-phone');
const callTimeSpan = document.getElementById('call-time');
const callerLocationSpan = document.getElementById('caller-location');
const answerButton = document.getElementById('answer-button');
const hangupButton = document.getElementById('hangup-button');
const callDurationSpan = document.getElementById('call-duration');
const recordingIndicator = document.querySelector('.recording-indicator');
const transcriptTextDiv = document.getElementById('transcript-text');
const analysisCategorySpan = document.getElementById('analysis-category');
const analysisPrioritySpan = document.getElementById('analysis-priority');
const analysisKeywordsUl = document.getElementById('analysis-keywords');
const analysisDepartmentSpan = document.getElementById('analysis-department');
const orderIdSpan = document.getElementById('order-id');
const orderCreateTimeSpan = document.getElementById('order-create-time');
const orderPhoneSpan = document.getElementById('order-phone');
const orderCategorySpan = document.getElementById('order-category');
const orderPrioritySpan = document.getElementById('order-priority');
const orderDepartmentSpan = document.getElementById('order-department');
const orderDescriptionSpan = document.getElementById('order-description');

let currentScenario = null;
let callTimerInterval = null;
let callStartTime = null;

// Function to initialize the page with a selected scenario
function initializeScenario(scenarioId) {
    currentScenario = demoScenarios.find(scenario => scenario.id === scenarioId);
    if (!currentScenario) return;

    // Reset UI elements
    callerPhoneSpan.textContent = currentScenario.callerInfo.phone;
    callerLocationSpan.textContent = currentScenario.callerInfo.location;
    callTimeSpan.textContent = new Date().toLocaleTimeString(); // Set current time
    callDurationSpan.textContent = '00:00';
    transcriptTextDiv.textContent = '';
    analysisCategorySpan.textContent = '';
    analysisPrioritySpan.textContent = '';
    analysisKeywordsUl.innerHTML = '';
    analysisDepartmentSpan.textContent = '';
    orderIdSpan.textContent = '';
    orderCreateTimeSpan.textContent = '';
    orderPhoneSpan.textContent = '';
    orderCategorySpan.textContent = '';
    orderPrioritySpan.textContent = '';
    orderDepartmentSpan.textContent = '';
    orderDescriptionSpan.textContent = '';

    answerButton.disabled = false;
    hangupButton.disabled = true;
    recordingIndicator.style.visibility = 'hidden';
}

// Function to start the call simulation
function startCall() {
    answerButton.disabled = true;
    hangupButton.disabled = false;
    recordingIndicator.style.visibility = 'visible';
    callStartTime = Date.now();

    callTimerInterval = setInterval(() => {
        const elapsed = Date.now() - callStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        callDurationSpan.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);

    // Simulate transcription and analysis after a short delay
    setTimeout(simulateTranscription, 2000); // Start transcription after 2 seconds
}

// Simulate real-time transcription
function simulateTranscription() {
    const script = currentScenario.audioScript;
    let i = 0;
    const typingSpeed = 50; // milliseconds per character

    function typeCharacter() {
        if (i < script.length) {
            transcriptTextDiv.textContent += script.charAt(i);
            i++;
            setTimeout(typeCharacter, typingSpeed);
        } else {
            // Transcription complete, start analysis
            simulateAnalysis();
        }
    }

    typeCharacter();
}

// Simulate AI analysis
function simulateAnalysis() {
     // Display analysis results after a simulated processing time
    const analysisDelay = 3000; // Simulate 3 seconds of AI processing

    // Show a loading indicator or message in the analysis section (optional)
    analysisCategorySpan.textContent = '分析中...';
    analysisPrioritySpan.textContent = '';
    analysisKeywordsUl.innerHTML = '';
    analysisDepartmentSpan.textContent = '';

    setTimeout(() => {
        const analysis = currentScenario.expectedAnalysis;
        analysisCategorySpan.textContent = analysis.category;
        // Add color based on priority
        let priorityText = analysis.priority;
        if (analysis.priority === '高') {
            priorityText = `🔴 ${priorityText}`;
            analysisPrioritySpan.style.color = 'var(--error-color)';
        } else if (analysis.priority === '中') {
             priorityText = `🟠 ${priorityText}`;
             analysisPrioritySpan.style.color = 'var(--warning-color)';
        } else {
             priorityText = `🟢 ${priorityText}`;
             analysisPrioritySpan.style.color = 'var(--success-color)';
        }
        analysisPrioritySpan.textContent = priorityText;

        analysisKeywordsUl.innerHTML = analysis.keywords.map(keyword => `<li>${keyword}</li>`).join('');
        analysisDepartmentSpan.textContent = analysis.department;

        // Simulate work order generation after analysis
        simulateWorkOrderGeneration();
    }, analysisDelay);
}

// Simulate work order generation
function simulateWorkOrderGeneration() {
    // Display work order details after a short delay
    const orderGenerationDelay = 2000; // Simulate 2 seconds

    // Show a loading indicator (optional)
     orderIdSpan.textContent = '生成中...';
     orderCreateTimeSpan.textContent = '';
     orderPhoneSpan.textContent = '';
     orderCategorySpan.textContent = '';
     orderPrioritySpan.textContent = '';
     orderDepartmentSpan.textContent = '';
     orderDescriptionSpan.textContent = '';

    setTimeout(() => {
        const now = new Date();
        const orderId = `WD${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}00${demoScenarios.findIndex(s => s.id === currentScenario.id) + 1}`;
        orderIdSpan.textContent = orderId;
        orderCreateTimeSpan.textContent = now.toLocaleString();
        orderPhoneSpan.textContent = currentScenario.callerInfo.phone;
        orderCategorySpan.textContent = currentScenario.expectedAnalysis.category;
        orderPrioritySpan.textContent = currentScenario.expectedAnalysis.priority;
        orderDepartmentSpan.textContent = currentScenario.expectedAnalysis.department;
        orderDescriptionSpan.textContent = currentScenario.audioScript.substring(0, 100) + '...'; // Use first 100 chars of script as description

        // End the call simulation automatically after a short delay after order generation
        setTimeout(endCall, 3000); // End call 3 seconds after order generation

    }, orderGenerationDelay);
}

// Function to end the call simulation
function endCall() {
    clearInterval(callTimerInterval);
    callTimerInterval = null;
    callStartTime = null;

    hangupButton.disabled = true;
    answerButton.disabled = false; // Allow starting a new call
    recordingIndicator.style.visibility = 'hidden';
    callDurationSpan.textContent = '00:00'; // Reset timer display

    // Optional: Add a message or visual cue that the process is complete
}

// Event Listeners
scenarioSelect.addEventListener('change', (event) => {
    initializeScenario(event.target.value);
});

answerButton.addEventListener('click', startCall);
hangupButton.addEventListener('click', endCall);

// Initialize the page with the first scenario on load
document.addEventListener('DOMContentLoaded', () => {
    initializeScenario(scenarioSelect.value);
});
