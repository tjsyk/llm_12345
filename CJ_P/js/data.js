// 模拟数据
const mockData = {
    // 质检数据
    qualityStats: {
        totalCalls: 2847,
        completionRate: 100,
        averageScore: 87.3,
        weeklyChange: 2.1
    },

    // 质检趋势数据
    qualityTrend: {
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        data: [85.2, 86.1, 87.3, 86.8, 88.1, 87.5, 87.3]
    },

    // 坐席数据
    agents: {
        'A025': {
            name: '李小华',
            scores: {
                service: 85,      // 服务态度
                business: 72,     // 业务熟练度
                communication: 92, // 沟通技巧
                problem: 68,      // 问题解决
                compliance: 58    // 规范执行
            },
            recommendations: [
                {
                    title: '身份核实标准流程',
                    description: '学习标准的身份核实流程，提升规范执行能力',
                    duration: '30分钟',
                    priority: 'high',
                    type: '必修课程'
                },
                {
                    title: '复杂问题处理技巧',
                    description: '掌握处理复杂问题的方法和技巧',
                    duration: '45分钟',
                    priority: 'medium',
                    type: '建议课程'
                }
            ]
        },
        'A018': {
            name: '王师傅',
            scores: {
                service: 92,
                business: 88,
                communication: 85,
                problem: 90,
                compliance: 95
            },
            recommendations: [
                {
                    title: '高级沟通技巧',
                    description: '进一步提升沟通表达能力',
                    duration: '40分钟',
                    priority: 'low',
                    type: '提升课程'
                }
            ]
        },
        'A032': {
            name: '张小明',
            scores: {
                service: 78,
                business: 82,
                communication: 75,
                problem: 80,
                compliance: 85
            },
            recommendations: [
                {
                    title: '服务态度提升训练',
                    description: '改善服务态度，提升用户满意度',
                    duration: '35分钟',
                    priority: 'medium',
                    type: '建议课程'
                },
                {
                    title: '沟通技巧基础培训',
                    description: '学习基础的沟通技巧和话术',
                    duration: '50分钟',
                    priority: 'medium',
                    type: '建议课程'
                }
            ]
        }
    },

    // 问题分析数据
    problems: {
        'noise': {
            name: '噪音投诉',
            overview: {
                satisfaction: 65,
                callVolume: 156,
                avgDuration: 8.2,
                resolutionRate: 23
            },
            stages: {
                call: {
                    volume: 156,
                    volumeChange: 34,
                    avgDuration: 8.2,
                    standardDuration: 6.1,
                    resolutionRate: 23,
                    avgResolutionRate: 68
                },
                dispatch: {
                    avgTime: 2.3,
                    standardTime: 2.5,
                    responseRate: 89,
                    processingDays: 7.2,
                    promisedDays: 5
                },
                followup: {
                    contactRate: 78,
                    satisfaction: 45,
                    mainReasons: [
                        { reason: '处理时间长', percentage: 67 },
                        { reason: '效果不明显', percentage: 23 },
                        { reason: '沟通不及时', percentage: 10 }
                    ]
                }
            },
            rootCauses: [
                {
                    title: '流程瓶颈',
                    description: '环保部门处理噪音投诉缺乏标准化流程，导致处理周期过长'
                },
                {
                    title: '信息断层',
                    description: '坐席对噪音投诉处理流程了解不足，无法给出准确预期'
                },
                {
                    title: '协调机制',
                    description: '缺乏跨部门协调机制，复杂案件推诿现象明显'
                }
            ],
            improvements: [
                {
                    title: '坐席专项培训',
                    description: '对所有坐席进行"噪音投诉处理流程"专项培训，更新话术模板',
                    timeline: '本周内',
                    type: 'short-term'
                },
                {
                    title: '快速响应机制',
                    description: '建立噪音投诉快速响应机制，设立专门处理通道',
                    timeline: '本周内',
                    type: 'short-term'
                },
                {
                    title: '流程标准化',
                    description: '与环保部门协商优化处理流程，制定标准化手册',
                    timeline: '本月内',
                    type: 'medium-term'
                },
                {
                    title: '跨部门协调',
                    description: '建立跨部门协调工作群，完善协调机制',
                    timeline: '本月内',
                    type: 'medium-term'
                }
            ]
        },
        'traffic': {
            name: '交通违章',
            overview: {
                satisfaction: 78,
                callVolume: 234,
                avgDuration: 5.8,
                resolutionRate: 85
            },
            stages: {
                call: {
                    volume: 234,
                    volumeChange: 12,
                    avgDuration: 5.8,
                    standardDuration: 6.0,
                    resolutionRate: 85,
                    avgResolutionRate: 68
                },
                dispatch: {
                    avgTime: 1.5,
                    standardTime: 2.0,
                    responseRate: 95,
                    processingDays: 3.2,
                    promisedDays: 3
                },
                followup: {
                    contactRate: 82,
                    satisfaction: 78,
                    mainReasons: [
                        { reason: '处理及时', percentage: 45 },
                        { reason: '流程清晰', percentage: 33 },
                        { reason: '态度良好', percentage: 22 }
                    ]
                }
            },
            rootCauses: [
                {
                    title: '系统优化',
                    description: '交通违章查询系统响应良好，处理效率较高'
                }
            ],
            improvements: [
                {
                    title: '经验推广',
                    description: '将交通违章处理的成功经验推广到其他业务',
                    timeline: '持续进行',
                    type: 'short-term'
                }
            ]
        },
        'property': {
            name: '物业纠纷',
            overview: {
                satisfaction: 72,
                callVolume: 189,
                avgDuration: 12.5,
                resolutionRate: 45
            },
            stages: {
                call: {
                    volume: 189,
                    volumeChange: 8,
                    avgDuration: 12.5,
                    standardDuration: 8.0,
                    resolutionRate: 45,
                    avgResolutionRate: 68
                },
                dispatch: {
                    avgTime: 4.2,
                    standardTime: 3.0,
                    responseRate: 76,
                    processingDays: 15.8,
                    promisedDays: 10
                },
                followup: {
                    contactRate: 65,
                    satisfaction: 72,
                    mainReasons: [
                        { reason: '协调困难', percentage: 45 },
                        { reason: '责任不清', percentage: 35 },
                        { reason: '处理复杂', percentage: 20 }
                    ]
                }
            },
            rootCauses: [
                {
                    title: '协调复杂',
                    description: '物业纠纷涉及多方利益，协调难度大，处理周期长'
                },
                {
                    title: '专业性强',
                    description: '需要专业的法律和物业管理知识，坐席能力有待提升'
                }
            ],
            improvements: [
                {
                    title: '专业培训',
                    description: '加强坐席物业法律知识培训，提升专业处理能力',
                    timeline: '本月内',
                    type: 'medium-term'
                },
                {
                    title: '专家支持',
                    description: '建立物业纠纷专家咨询机制，提供专业指导',
                    timeline: '本月内',
                    type: 'medium-term'
                }
            ]
        }
    }
};

// 生成实时质检流水数据
function generateQualityStream() {
    const agents = ['A025', 'A018', 'A032', 'A041', 'A056'];
    const statuses = [
        { name: 'normal', label: '正常', weight: 70 },
        { name: 'warning', label: '警告', weight: 25 },
        { name: 'error', label: '异常', weight: 5 }
    ];
    
    const stream = [];
    for (let i = 0; i < 10; i++) {
        const agent = agents[Math.floor(Math.random() * agents.length)];
        const statusRand = Math.random() * 100;
        let status = statuses[0];
        let cumWeight = 0;
        
        for (const s of statuses) {
            cumWeight += s.weight;
            if (statusRand <= cumWeight) {
                status = s;
                break;
            }
        }
        
        const score = status.name === 'normal' ? 
            Math.floor(Math.random() * 20) + 80 :
            status.name === 'warning' ?
            Math.floor(Math.random() * 20) + 60 :
            Math.floor(Math.random() * 20) + 40;
            
        const time = new Date();
        time.setMinutes(time.getMinutes() - i * 2);
        
        stream.push({
            agent: agent,
            time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            score: score,
            status: status.name,
            statusLabel: status.label
        });
    }
    
    return stream.reverse();
}
