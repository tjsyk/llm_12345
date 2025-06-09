// 图表配置和渲染
class ChartManager {
    constructor() {
        this.charts = {};
    }

    // 初始化质检趋势图
    initQualityChart() {
        const ctx = document.getElementById('qualityChart');
        if (!ctx) return;

        this.charts.quality = new Chart(ctx, {
            type: 'line',
            data: {
                labels: mockData.qualityTrend.labels,
                datasets: [{
                    label: '质检得分',
                    data: mockData.qualityTrend.data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        bottom: 30 // 为X轴标签提供更多空间
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 80,
                        max: 95,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            color: '#7f8c8d'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            color: '#7f8c8d',
                            font: {
                                size: 10 // 减小字体大小以适应空间
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    // 初始化雷达图
    initRadarChart() {
        const ctx = document.getElementById('radarChart');
        if (!ctx) return;

        this.charts.radar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['服务态度', '业务熟练度', '沟通技巧', '问题解决', '规范执行'],
                datasets: [{
                    label: '能力评分',
                    data: [85, 72, 92, 68, 58],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 20,
                        bottom: 50, // 进一步增加底部内边距
                        left: 20, // 添加左侧内边距
                        right: 20 // 添加右侧内边距
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            color: '#7f8c8d',
                            backdropColor: 'transparent'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        pointLabels: {
                            color: '#2c3e50',
                            font: {
                                size: 10
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // 更新雷达图数据
    updateRadarChart(agentId) {
        if (!this.charts.radar) return;
        
        const agent = mockData.agents[agentId];
        if (!agent) return;

        const scores = [
            agent.scores.service,
            agent.scores.business,
            agent.scores.communication,
            agent.scores.problem,
            agent.scores.compliance
        ];

        this.charts.radar.data.datasets[0].data = scores;
        this.charts.radar.update('active');
    }

    // 销毁所有图表
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}
