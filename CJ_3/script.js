/**
 * CJ_3 - AI智能回访演示脚本
 * 实现智能回访的完整交互流程
 */

class AICallbackDemo {
    constructor() {
        this.currentStep = 0;
        this.callTimer = 0;
        this.timerInterval = null;
        this.isCallActive = false;
        
        // 对话脚本数据
        this.conversationScript = [
            {
                type: 'ai',
                sender: 'AI回访机器人',
                content: '嘟…您好，李女士！我是12345政务服务热线的回访机器人小慧。我们来电是想跟进您之前反映的，关于您家房顶漏水的问题。记录显示社区调解委员会已在上周五组织了调解，请问现在漏水的问题解决了吗？',
                delay: 2000,
                analysis: {
                    originalStatus: '分析中...',
                    derivedIssue: '分析中...',
                    emotionStatus: '分析中...',
                    aiDecision: '分析中...'
                }
            },
            {
                type: 'user',
                sender: '李女士',
                content: '哦，是你们啊。嗯…水是不漏了，这点处理得还行。',
                delay: 3000,
                analysis: {
                    originalStatus: '已解决（漏水停止）',
                    derivedIssue: '暂无发现',
                    emotionStatus: '平静，略有保留',
                    aiDecision: '继续深入了解满意度'
                }
            },
            {
                type: 'ai',
                sender: 'AI回访机器人',
                content: '好的，很高兴听到漏水问题得到了控制。那综合来看，您对这次问题的整体处理过程和结果，感觉"非常满意"、"比较满意"，还是"不太满意"呢？',
                delay: 2500,
                analysis: {
                    originalStatus: '已解决（漏水停止）',
                    derivedIssue: '暂无发现',
                    emotionStatus: '平静，略有保留',
                    aiDecision: '分层提问，获取主观感受'
                }
            },
            {
                type: 'user',
                sender: '李女士',
                content: '唉，只能说"不太满意"吧。',
                delay: 2000,
                analysis: {
                    originalStatus: '已解决（漏水停止）',
                    derivedIssue: '可能存在隐藏问题',
                    emotionStatus: '不满意，有情绪',
                    aiDecision: '主动追问不满意原因'
                }
            },
            {
                type: 'ai',
                sender: 'AI回访机器人',
                content: '收到，您的反馈是"不太满意"。非常抱歉这次服务没能让您完全满意。为了帮助我们改进工作，方便具体说一下是哪个方面让您感觉不太满意吗？',
                delay: 3000,
                analysis: {
                    originalStatus: '已解决（漏水停止）',
                    derivedIssue: '可能存在隐藏问题',
                    emotionStatus: '不满意，有情绪',
                    aiDecision: '深度挖掘问题根源'
                }
            },
            {
                type: 'user',
                sender: '李女士',
                content: '主要是后续的手尾问题。你看，楼上是不漏水了，但我家天花板被泡坏的那一大块墙皮，到现在还掉着渣呢，也没人说该怎么修、谁来修。这事儿不算完啊！',
                delay: 4000,
                analysis: {
                    originalStatus: '已解决（漏水停止）',
                    derivedIssue: '墙面维修（新诉求）',
                    emotionStatus: '存在不满',
                    aiDecision: '重新激活原工单，增派维修任务'
                }
            },
            {
                type: 'ai',
                sender: 'AI回访机器人',
                content: '我明白了，您是说漏水问题虽然解决了，但导致了新的衍生问题——也就是墙面损坏的维修问题，目前还没有得到处理，对吗？',
                delay: 3000,
                analysis: {
                    originalStatus: '已解决（漏水停止）',
                    derivedIssue: '墙面维修（新诉求）',
                    emotionStatus: '存在不满',
                    aiDecision: '精准提炼问题，准备处理方案'
                }
            },
            {
                type: 'user',
                sender: '李女士',
                content: '对！就是这个意思！',
                delay: 1500,
                analysis: {
                    originalStatus: '已解决（漏水停止）',
                    derivedIssue: '墙面维修（新诉求）',
                    emotionStatus: '情绪缓解，期待解决',
                    aiDecision: '立即处理衍生问题'
                },
                showActions: true
            },
            {
                type: 'ai',
                sender: 'AI回访机器人',
                content: '好的，李女士，非常感谢您提出的宝贵意见！您反映的墙面维修问题非常重要，我已经将它作为一个新的任务，重新激活并关联到您原来的工单中，并派发给负责房屋维修的部门跟进处理。预计24小时内会有工作人员联系您商讨维修事宜。对于给您造成的不便，我们再次深表歉意。',
                delay: 4500,
                analysis: {
                    originalStatus: '已解决（漏水停止）',
                    derivedIssue: '墙面维修（已派单）',
                    emotionStatus: '满意度提升',
                    aiDecision: '即时处理完成，安抚市民'
                }
            },
            {
                type: 'user',
                sender: '李女士',
                content: '哦？这样就行了？我不用再重新打电话投诉了吧？',
                delay: 2500,
                analysis: {
                    originalStatus: '已解决（漏水停止）',
                    derivedIssue: '墙面维修（已派单）',
                    emotionStatus: '惊喜，信任感提升',
                    aiDecision: '确认处理结果，提供保障'
                }
            },
            {
                type: 'ai',
                sender: 'AI回访机器人',
                content: '是的，您无需再次来电。系统已经自动为您处理。请您保持电话畅通。请问还有其他可以帮到您的吗？',
                delay: 2000,
                analysis: {
                    originalStatus: '已解决（漏水停止）',
                    derivedIssue: '墙面维修（已派单）',
                    emotionStatus: '满意，信任',
                    aiDecision: '确认无其他问题'
                }
            },
            {
                type: 'user',
                sender: '李女士',
                content: '没有了，这样处理我就放心了，谢谢！',
                delay: 2000,
                analysis: {
                    originalStatus: '已解决（漏水停止）',
                    derivedIssue: '墙面维修（已派单）',
                    emotionStatus: '满意，感谢',
                    aiDecision: '回访成功完成'
                }
            },
            {
                type: 'ai',
                sender: 'AI回访机器人',
                content: '不客气。感谢您帮助我们发现服务中的不足，祝您生活愉快！再见。',
                delay: 2500,
                analysis: {
                    originalStatus: '已解决（漏水停止）',
                    derivedIssue: '墙面维修（已派单）',
                    emotionStatus: '满意，感谢',
                    aiDecision: '回访圆满结束'
                },
                isLastMessage: true
            }
        ];
        
        this.init();
    }

    /**
     * 初始化演示
     */
    init() {
        this.bindEvents();
        this.resetDemo();
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        const startCallBtn = document.getElementById('startCallBtn');
        const resetBtn = document.getElementById('resetBtn');
        const endCallBtn = document.getElementById('endCallBtn');

        startCallBtn?.addEventListener('click', () => this.startCall());
        resetBtn?.addEventListener('click', () => this.resetDemo());
        endCallBtn?.addEventListener('click', () => this.endCall());
    }

    /**
     * 开始回访通话
     */
    async startCall() {
        if (this.isCallActive) return;
        
        this.isCallActive = true;
        this.currentStep = 0;

        const startBtn = document.getElementById('startCallBtn');
        if (startBtn) {
            startBtn.textContent = '演示中...';
            startBtn.disabled = true;
        }
        
        // 隐藏工单卡片，显示通话界面
        this.hideElement('workOrderCard');
        this.showElement('callInterface');
        
        // 添加active类以激活左右布局
        const callInterface = document.getElementById('callInterface');
        if (callInterface) {
            callInterface.classList.add('active');
        }
        
        // 更新工单状态
        this.updateWorkOrderStatus('进行中');
        
        // 开始通话计时
        this.startCallTimer();
        
        // 更新通话状态
        this.updateCallStatus('通话中');
        
        // 开始对话流程
        await this.startConversation();
    }

    /**
     * 开始对话流程
     */
    async startConversation() {
        for (let i = 0; i < this.conversationScript.length; i++) {
            if (!this.isCallActive) break;
            
            const message = this.conversationScript[i];
            
            // 等待延迟
            await this.delay(message.delay);
            
            if (!this.isCallActive) break;
            
            // 添加消息到对话区域
            this.addMessage(message);
            
            // 更新AI分析
            this.updateAnalysis(message.analysis);
            
            // 如果需要显示处理方案
            if (message.showActions) {
                await this.delay(1000);
                this.showActionPanel();
            }
            
            // 如果是最后一条消息，结束通话
            if (message.isLastMessage) {
                await this.delay(2000);
                this.endCall();
                break;
            }
        }
    }

    /**
     * 添加消息到对话区域
     * @param {Object} message - 消息对象
     */
    addMessage(message) {
        const conversationArea = document.getElementById('conversationArea');
        if (!conversationArea) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}`;
        
        messageDiv.innerHTML = `
            <div class="message-sender">${message.sender}</div>
            <div class="message-content">${message.content}</div>
        `;
        
        conversationArea.appendChild(messageDiv);
        
        // 滚动到底部
        conversationArea.scrollTop = conversationArea.scrollHeight;
    }

    /**
     * 更新AI分析面板
     * @param {Object} analysis - 分析数据
     */
    updateAnalysis(analysis) {
        const elements = {
            originalStatus: document.getElementById('originalStatus'),
            derivedIssue: document.getElementById('derivedIssue'),
            emotionStatus: document.getElementById('emotionStatus'),
            aiDecision: document.getElementById('aiDecision')
        };

        // 激活面板头部动画
        const panelHeader = document.querySelector('.panel-header');
        if (panelHeader) {
            panelHeader.classList.add('active');
        }

        Object.keys(analysis).forEach(key => {
            const element = elements[key];
            if (element) {
                // 添加更新动画
                element.className = 'analysis-value updating';
                
                setTimeout(() => {
                    element.textContent = analysis[key];
                    element.className = 'analysis-value completed';
                }, 800);
            }
        });
    }

    /**
     * 显示处理方案面板
     */
    showActionPanel() {
        const actionPanel = document.getElementById('actionPanel');
        if (actionPanel) {
            actionPanel.style.display = 'block';
        }
    }

    /**
     * 开始通话计时器
     */
    startCallTimer() {
        this.callTimer = 0;
        this.timerInterval = setInterval(() => {
            this.callTimer++;
            this.updateCallTimer();
        }, 1000);
    }

    /**
     * 更新通话计时器显示
     */
    updateCallTimer() {
        const timerElement = document.getElementById('callTimer');
        if (timerElement) {
            const minutes = Math.floor(this.callTimer / 60);
            const seconds = this.callTimer % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    /**
     * 更新通话状态
     * @param {string} status - 状态文本
     */
    updateCallStatus(status) {
        const statusElement = document.getElementById('callStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    /**
     * 更新工单状态
     * @param {string} status - 状态文本
     */
    updateWorkOrderStatus(status) {
        const badge = document.querySelector('.status-badge');
        if (badge) {
            badge.textContent = status;
            badge.className = 'status-badge ' + (status === '进行中' ? 'active' : 'pending');
        }
    }

    /**
     * 结束通话
     */
    async endCall() {
        this.isCallActive = false;
        
        // 停止计时器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // 更新通话状态
        this.updateCallStatus('通话结束');
        
        // 等待一下再显示结果
        await this.delay(1000);
        
        // 隐藏通话界面，显示结果
        this.hideElement('callInterface');
        this.showElement('resultPanel');
        
        // 移除active类
        const callInterface = document.getElementById('callInterface');
        if (callInterface) {
            callInterface.classList.remove('active');
        }
        
        // 更新工单状态
        this.updateWorkOrderStatus('已完成');
    }

    /**
     * 重置演示
     */
    resetDemo() {
        // 停止通话
        this.isCallActive = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // 重置状态
        this.currentStep = 0;
        this.callTimer = 0;
        
        // 显示工单卡片，隐藏其他面板
        this.showElement('workOrderCard');
        this.hideElement('callInterface');
        this.hideElement('resultPanel');
        
        // 移除active类
        const callInterface = document.getElementById('callInterface');
        if (callInterface) {
            callInterface.classList.remove('active');
        }
        
        // 重置工单状态
        this.updateWorkOrderStatus('待回访');
        
        // 清空对话区域
        const conversationArea = document.getElementById('conversationArea');
        if (conversationArea) {
            conversationArea.innerHTML = '';
        }
        
        // 重置分析面板
        this.resetAnalysisPanel();
        
        // 隐藏处理方案面板
        const actionPanel = document.getElementById('actionPanel');
        if (actionPanel) {
            actionPanel.style.display = 'none';
        }

        const startBtn = document.getElementById('startCallBtn');
        if (startBtn) {
            startBtn.textContent = '📞 开始演示';
            startBtn.disabled = false;
        }
    }

    /**
     * 重置分析面板
     */
    resetAnalysisPanel() {
        const analysisElements = [
            'originalStatus',
            'derivedIssue', 
            'emotionStatus',
            'aiDecision'
        ];
        
        analysisElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '分析中...';
                element.className = 'analysis-value';
            }
        });

        // 重置面板头部状态
        const panelHeader = document.querySelector('.panel-header');
        if (panelHeader) {
            panelHeader.classList.remove('active');
        }
    }

    /**
     * 显示元素
     * @param {string} elementId - 元素ID
     */
    showElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'block';
        }
    }

    /**
     * 隐藏元素
     * @param {string} elementId - 元素ID
     */
    hideElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    }

    /**
     * 延迟函数
     * @param {number} ms - 延迟毫秒数
     * @returns {Promise}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 页面加载完成后初始化演示
document.addEventListener('DOMContentLoaded', () => {
    new AICallbackDemo();
});

// 添加一些额外的交互效果
document.addEventListener('DOMContentLoaded', () => {
    // 为按钮添加点击波纹效果
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .btn-primary, .btn-secondary {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
});
