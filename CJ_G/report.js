// 报告中心页面 JavaScript

/**
 * @typedef {object} Report
 * @property {string} id
 * @property {string} title
 * @property {string} type - '定期报告' | '专题报告'
 * @property {string} description
 * @property {string} date - YYYY-MM-DD string
 * @property {string} author
 * @property {string} filePath - 模拟文件路径
 */

// 模拟数据函数
/**
 * 模拟获取报告数据
 * @returns {Promise<Report[]>}
 */
async function fetchMockReports() {
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
    const now = new Date();
    return [
        // 定期报告
        { id: "R001", title: "2024年5月月度舆情报告", type: "定期报告", description: "分析2024年5月12345热线舆情趋势、热点问题及典型案例。", date: "2024-06-01", author: "AI分析系统", filePath: "./reports/monthly_202405.txt" },
        { id: "R002", title: "2024年第22周舆情周报", type: "定期报告", description: "本周舆情热点速览，问题类型占比及风险预警情况。", date: "2024-05-31", author: "AI分析系统", filePath: "/reports/weekly_202422.pdf" },
        { id: "R003", title: "2024年5月30日舆情日报", type: "定期报告", description: "当日来电总量、重点关注事项及最新预警。", date: "2024-05-30", author: "AI分析系统", filePath: "/reports/daily_20240530.pdf" },
        { id: "R004", title: "2024年4月月度舆情报告", type: "定期报告", description: "对4月份的舆情数据进行深度分析，总结主要问题。", date: "2024-05-01", author: "AI分析系统", filePath: "/reports/monthly_202404.pdf" },

        // 专题报告
        { id: "S001", title: "交通拥堵问题专项分析", type: "专题报告", description: "针对近期交通拥堵相关投诉的成因、分布及解决方案建议。", date: "2024-05-25", author: "AI分析系统", filePath: "./reports/traffic_congestion.txt" },
        { id: "S002", title: "物业服务投诉热点剖析", type: "专题报告", description: "深入分析物业服务领域的突出问题，提出改进措施。", date: "2024-05-20", author: "AI分析系统", filePath: "/reports/property_management.pdf" },
        { id: "S003", title: "教育资源分配不均舆情洞察", type: "专题报告", description: "关于教育资源配置引发的社会舆情分析及政策建议。", date: "2024-05-15", author: "AI分析系统", filePath: "/reports/education_equity.pdf" }
    ];
}

// 渲染报告卡片
/**
 * 渲染报告卡片到指定容器
 * @param {Report[]} reports - 报告数据数组
 * @param {HTMLElement} container - 报告卡片将要渲染到的HTML容器元素
 */
function renderReportCards(reports, container) {
    container.innerHTML = ''; // 清空现有内容
    reports.forEach(report => {
        const reportCard = document.createElement('div');
        reportCard.className = 'report-card';
        reportCard.innerHTML = `
            <h3>${report.title}</h3>
            <p>${report.description}</p>
            <div class="report-meta">
                <span>日期: ${report.date}</span>
                <span>作者: ${report.author}</span>
            </div>
            <div class="report-actions">
                <a href="#" class="view-btn" data-report-id="${report.id}">在线预览</a>
                <a href="${report.filePath}" class="download-btn" download>下载报告</a>
            </div>
        `;
        container.appendChild(reportCard);

        // 添加预览按钮的点击事件 (这里只是模拟，实际预览需要后端支持)
        reportCard.querySelector('.view-btn').addEventListener('click', (event) => {
            event.preventDefault();
            // alert(`模拟预览报告: ${report.title}`); // 移除弹窗
            window.open(report.filePath, '_blank'); // 直接在新标签页打开文件
            console.log(`预览报告ID: ${report.id}, 文件路径: ${report.filePath}`);
        });
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async () => {
    console.log('报告中心页面加载完成，开始模拟数据加载...');

    const reports = await fetchMockReports();

    const regularReports = reports.filter(report => report.type === '定期报告');
    const specialReports = reports.filter(report => report.type === '专题报告');

    renderReportCards(regularReports, document.getElementById('regularReportGrid'));
    renderReportCards(specialReports, document.getElementById('specialReportGrid'));

    console.log('报告数据加载并渲染完成。');
}); 