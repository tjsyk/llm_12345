/**
 * AI坐席辅助系统演示 - 主要逻辑控制
 * 实现动态演示流程、动画效果和用户交互
 */

class DemoController {
    constructor() {
        // 演示状态
        this.currentStep = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.stepInterval = null;
        this.callStartTime = null;
        this.callTimer = null;
        
        // DOM元素引用
        this.elements = {
            startDemo: document.getElementById('startDemo'),
            resetDemo: document.getElementById('resetDemo'),
            callStatus: document.getElementById('callStatus'),
            callTime: document.getElementById('callTime'),
            answerBtn: document.getElementById('answerBtn'),
            hangupBtn: document.getElementById('hangupBtn'),

            messageList: document.getElementById('messageList'),
            aiCards: document.getElementById('aiCards'),

            orderModal: document.getElementById('orderModal'),
            orderContent: document.getElementById('orderContent'),
            confirmOrderBtn: document.getElementById('confirmOrderBtn'),
            cancelOrderBtn: document.getElementById('cancelOrderBtn'),
            closeOrderModal: document.getElementById('closeOrderModal'),
            dataFlowContainer: document.getElementById('dataFlowContainer')
        };
        
        // 演示数据
        this.demoData = {
            // 对话内容
            conversations: [
                // 第一阶段：开场和初始投诉
                {
                    speaker: 'agent',
                    text: '王女士您好，我是坐席小张。我已经看到您刚才反映的关于青云小区油烟扰民的问题了，您不需要重复，我们接着往下说，好吗？',
                    stage: 1
                },
                {
                    speaker: 'citizen',
                    text: '你们总算有人接了！楼下那家烧烤店，天天乌烟瘴气的，窗户都不敢开！我跟他们吵过，也找过物业，根本没人管！',
                    emotion: { level: 92, type: 'angry' },
                    stage: 1
                },
                {
                    speaker: 'agent',
                    text: '王女士，我非常理解您的心情，每天被油烟困扰确实让人无法忍受。您先消消气，我这边一定会严肃处理您的问题。请相信我，我们一起来想办法解决它。',
                    stage: 1
                },
                // 第二阶段：询问详情
                {
                    speaker: 'citizen',
                    text: '行...那你说这事到底归谁管？我应该找谁？',
                    emotion: { level: 65, type: 'frustrated' },
                    stage: 2
                },
                {
                    speaker: 'agent',
                    text: '王女士，您这个问题可能涉及多个部门。为了精准处理，我需要先跟您确认一下这家烧烤店的具体店名是？',
                    stage: 2
                },
                // 第三阶段：收集信息
                {
                    speaker: 'citizen',
                    text: '就是青云小区1栋楼下那个"兄弟烧烤"，天天营业到半夜，吵死了！',
                    stage: 3
                },
                {
                    speaker: 'agent',
                    text: '好的，我已经记录下来了。请问这种情况持续多长时间了？',
                    stage: 3
                },
                {
                    speaker: 'citizen',
                    text: '快一个月了！每天晚上都这样，真的受不了了！',
                    stage: 3
                },
                {
                    speaker: 'agent',
                    text: '我理解您的困扰。请问您希望我们怎么处理这个问题呢？是要求他们整改设备，还是希望限制营业时间？',
                    stage: 3
                },
                {
                    speaker: 'citizen',
                    text: '最好是让他们装个好点的油烟净化器，还有晚上10点以后别营业了！实在不行就让他们搬走！',
                    stage: 3
                },
                {
                    speaker: 'agent',
                    text: '好的，您的诉求我都记录下了。根据您反映的情况，我们会协调环保局处理油烟问题，城管局处理夜间噪音，市场监管局核查经营资质。我现在就为您创建工单并派发给相关部门处理。',
                    stage: 3
                },
                // 第四阶段：派单说明和结束
                {
                    speaker: 'citizen',
                    text: '好的，那大概多长时间能有结果啊？',
                    stage: 4
                },
                {
                    speaker: 'agent',
                    text: '好的王女士，我会立即将您的情况转给相关部门处理，预计3个工作日内会有初步反馈。请问还有其他可以帮您的吗？',
                    stage: 4
                },
                {
                    speaker: 'citizen',
                    text: '没有了，太好了！你们这处理得可真专业、真清楚！谢谢你了！',
                    stage: 4
                },
                {
                    speaker: 'agent',
                    text: '不客气，这是我们应该做的。感谢您的来电，再见！',
                    stage: 4
                }
            ],
            
            // AI卡片数据
            aiCards: [
                {
                    id: 'emotion',
                    type: 'emotion',
                    title: '😠 情绪分析',
                    content: `
                        <div class="emotion-status">当前情绪：愤怒 😠</div>
                        <div class="emotion-meter">
                            <span>激动指数:</span>
                            <div class="emotion-bar">
                                <div class="emotion-fill" style="width: 92%"></div>
                            </div>
                            <span>92%</span>
                        </div>
                    `,
                    step: 2
                },
                {
                    id: 'suggestion',
                    type: 'suggestion',
                    title: '💡 智能话术建议',
                    content: `
                        <div class="suggestion-item selected">
                            <strong>话术1 (安抚优先 ⭐⭐⭐⭐⭐):</strong><br>
                            "王女士，我非常理解您的心情，每天被油烟困扰确实让人无法忍受。您先消消气，我这边一定会严肃处理您的问题。"
                        </div>
                        <div class="suggestion-item">
                            <strong>话术2 (询问细节):</strong><br>
                            "您好，请问这家烧烤店的具体店名和地址是？"
                        </div>
                    `,
                    step: 2
                },
                {
                    id: 'knowledge',
                    type: 'knowledge',
                    title: '📚 智能知识推荐',
                    content: `
                        <strong>政策法规:</strong><br>
                        • 《大气污染防治法》第81条<br>
                        • 《餐饮业油烟排放标准》<br><br>
                        <strong>相似案例:</strong><br>
                        • 案例#2024-518: 风华小区类似油烟投诉处理记录
                    `,
                    step: 3
                },
                {
                    id: 'process',
                    type: 'process',
                    title: '🔍 流程导航',
                    content: `
                        <div class="process-checklist">
                            <div class="process-item" id="process-step-1">
                                <div class="checkbox"></div>
                                <span>步骤1: 确认商铺信息 (店名、地址)</span>
                            </div>
                            <div class="process-item" id="process-step-2">
                                <div class="checkbox"></div>
                                <span>步骤2: 确认问题细节 (营业时间、油烟设备情况)</span>
                            </div>
                            <div class="process-item" id="process-step-3">
                                <div class="checkbox"></div>
                                <span>步骤3: 明确市民诉求 (要求整改/停业/赔偿)</span>
                            </div>
                            <div class="process-item" id="process-step-4">
                                <div class="checkbox"></div>
                                <span>步骤4: 告知处理部门与流程</span>
                            </div>
                        </div>
                    `,
                    step: 3
                },
                {
                    id: 'dispatch',
                    type: 'dispatch',
                    title: '🎯 智能派单分析',
                    content: `
                        <div class="dispatch-analysis">
                            <strong>AI分析：</strong>问题涉及环保、城管、市场监管三个方面<br><br>
                            <strong>生成派单方案：</strong><br>
                            • <strong>主责部门：</strong> 环保局 (处理油烟排放)<br>
                            • <strong>协同部门1：</strong> 城管局 (处理夜间噪音)<br>
                            • <strong>协同部门2：</strong> 市场监管局 (核查经营资质)
                        </div>
                        <div class="order-form" style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e9ecef;">
                            <h4 style="color: #2c3e50; margin-bottom: 15px;">📋 工单内容</h4>
                            <div class="form-field">
                                <label>工单编号：</label>
                                <input type="text" value="WD20240609001" readonly style="background: #f8f9fa;">
                            </div>
                            <div class="form-field">
                                <label>来电人：</label>
                                <input type="text" value="王女士 (138****5678)" readonly style="background: #f8f9fa;">
                            </div>
                            <div class="form-field">
                                <label>问题分类：</label>
                                <select>
                                    <option selected>市容环境 > 餐饮油烟与噪音</option>
                                    <option>市容环境 > 噪音扰民</option>
                                    <option>市容环境 > 油烟污染</option>
                                </select>
                            </div>
                            <div class="form-field">
                                <label>紧急程度：</label>
                                <select>
                                    <option>一般</option>
                                    <option selected>较高</option>
                                    <option>紧急</option>
                                </select>
                            </div>
                            <div class="form-field">
                                <label>事发地址：</label>
                                <input type="text" value="XX市XX区青云小区1栋楼下">
                            </div>
                            <div class="form-field">
                                <label>涉及商户：</label>
                                <input type="text" value="兄弟烧烤">
                            </div>
                            <div class="form-field">
                                <label>问题描述：</label>
                                <textarea rows="3">市民王女士反映，其住所楼下的"兄弟烧烤"长期存在夜间油烟及噪音扰民问题。据市民称，该店每日营业至深夜，油烟排放量大，严重影响其家庭正常生活和休息，且与商家及物业沟通未果，情况已持续近一个月。</textarea>
                            </div>
                            <div class="form-field">
                                <label>市民诉求：</label>
                                <textarea rows="2">要求安装油烟净化器，限制夜间营业时间（晚上10点后停业），如整改无效可考虑搬迁。</textarea>
                            </div>
                            <div class="form-field">
                                <label>处理部门：</label>
                                <div class="department-checkboxes">
                                    <label><input type="checkbox" checked> 环保局</label>
                                    <label><input type="checkbox" checked> 城管局</label>
                                    <label><input type="checkbox" checked> 市场监管局</label>
                                </div>
                            </div>
                            <button class="dispatch-btn" onclick="confirmDispatch()">确认派单</button>
                        </div>
                    `,
                    step: 5
                }
            ],
            
            // 工单数据
            orderData: {
                orderNumber: 'WD20240609001',
                caller: '王女士 (138****5678)',
                category: '市容环境 > 餐饮油烟与噪音',
                urgency: '较高',
                address: 'XX市XX区青云小区XX栋楼下',
                business: '"兄弟烧烤"',
                description: '市民王女士反映，其住所楼下的"兄弟烧烤"长期存在夜间油烟及噪音扰民问题。据市民称，该店每日营业至深夜，油烟排放量大，严重影响其家庭正常生活和休息，且与商家及物业沟通未果，情况已持续近一个月。',
                demand: '要求相关部门介入，对该商户的油烟和噪音问题进行整改。',
                departments: ['环保局', '城管局', '市场监管局']
            }
        };
        
        // 演示步骤配置
        this.demoSteps = [
            { name: '准备开始演示...', duration: 1000, action: 'init' },
            { name: '来电接入，显示人机交互摘要', duration: 6000, action: 'showCall' },
            { name: '市民情绪分析，推荐安抚话术', duration: 8000, action: 'showEmotion' },
            { name: '展示知识推荐和流程导航', duration: 15000, action: 'showKnowledge' },
            { name: '智能派单分析，完成处理', duration: 10000, action: 'smartDispatch' },
            { name: '演示完成！', duration: 1000, action: 'complete' }
        ];
        
        this.init();
    }
    
    /**
     * 初始化演示系统
     */
    init() {
        this.bindEvents();
        console.log('🚀 AI坐席辅助系统演示已准备就绪');
    }
    
    /**
     * 绑定事件监听器
     */
    bindEvents() {
        this.elements.startDemo.addEventListener('click', () => this.startDemo());
        this.elements.resetDemo.addEventListener('click', () => this.resetDemo());
        this.elements.answerBtn.addEventListener('click', () => this.answerCall());
        this.elements.confirmOrderBtn.addEventListener('click', () => this.confirmOrder());
        this.elements.cancelOrderBtn.addEventListener('click', () => this.hideOrderModal());
        this.elements.closeOrderModal.addEventListener('click', () => this.hideOrderModal());
        
        // 模态框外部点击关闭
        this.elements.orderModal.addEventListener('click', (e) => {
            if (e.target === this.elements.orderModal) {
                this.hideOrderModal();
            }
        });
    }
    
    /**
     * 开始演示
     */
    startDemo() {
        // 如果演示已经在进行中且没有暂停，直接返回
        if (this.isPlaying && !this.isPaused) return;
        
        // 如果演示已完成或未开始，重置状态
        if (!this.isPlaying) {
            this.resetDemo();
        }
        
        this.isPlaying = true;
        this.isPaused = false;
        this.elements.startDemo.textContent = '演示中...';
        this.elements.startDemo.disabled = true;
        
        this.playStep();
    }
    

    
    /**
     * 重置演示
     */
    resetDemo() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentStep = 0;
        
        clearTimeout(this.stepInterval);
        clearInterval(this.callTimer);
        
        // 重置UI状态（仅在不是从startDemo调用时设置按钮状态）
        if (this.elements.startDemo.textContent !== '演示中...') {
            this.elements.startDemo.textContent = '开始演示';
            this.elements.startDemo.disabled = false;
        }
        
        // 清空内容
        this.elements.messageList.innerHTML = '';
        this.clearAICards();
        this.elements.callStatus.textContent = '待接听';
        this.elements.callStatus.style.background = 'rgba(255, 255, 255, 0.2)';
        this.elements.callStatus.style.color = 'inherit';
        this.elements.callTime.textContent = '00:00';
        this.elements.answerBtn.style.display = 'inline-flex';
        this.elements.hangupBtn.style.display = 'none';
        
        // 隐藏人机交互摘要面板
        const summaryPanel = document.querySelector('.summary-panel');
        if (summaryPanel) {
            summaryPanel.classList.remove('show');
        }
        
        this.hideOrderModal();
        
        console.log('🔄 演示已重置');
    }
    
    /**
     * 播放当前步骤
     */
    playStep() {
        if (this.currentStep >= this.demoSteps.length) {
            this.completeDemo();
            return;
        }
        
        const step = this.demoSteps[this.currentStep];
        this.executeStepAction(step.action);
        
        if (!this.isPaused && this.isPlaying) {
            this.stepInterval = setTimeout(() => {
                this.currentStep++;
                this.playStep();
            }, step.duration);
        }
    }
    
    /**
     * 执行步骤动作
     */
    executeStepAction(action) {
        console.log(`🎬 执行动作: ${action}`);
        
        switch (action) {
            case 'init':
                this.initDemo();
                break;
            case 'showCall':
                this.showCallInterface();
                break;
            case 'showEmotion':
                this.showEmotionAnalysisStep();
                break;
            case 'showKnowledge':
                this.showKnowledgeAndProcessStep();
                break;
            case 'smartDispatch':
                this.showSmartDispatchStep();
                break;
            case 'complete':
                this.completeDemo();
                break;
        }
    }
    
    /**
     * 初始化演示
     */
    initDemo() {
        console.log('📋 初始化演示环境');
    }
    
    /**
     * 显示来电界面
     */
    showCallInterface() {
        // 显示人机交互摘要面板
        const summaryPanel = document.querySelector('.summary-panel');
        if (summaryPanel) {
            summaryPanel.classList.add('show');
        }
        
        // 模拟接听电话
        setTimeout(() => {
            this.answerCall();
        }, 1000);
        
        // 开始显示对话
        setTimeout(() => {
            this.startConversation();
        }, 2000);
    }
    
    /**
     * 接听电话
     */
    answerCall() {
        this.elements.callStatus.textContent = '通话中';
        this.elements.callStatus.style.background = 'rgba(39, 174, 96, 0.2)';
        this.elements.callStatus.style.color = '#27ae60';
        this.elements.answerBtn.style.display = 'none';
        this.elements.hangupBtn.style.display = 'inline-flex';
        
        // 开始计时
        this.callStartTime = Date.now();
        this.callTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.callStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            this.elements.callTime.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }
    
    /**
     * 开始对话 - 第一阶段
     */
    startConversation() {
        this.playConversationStage(1);
    }
    
    /**
     * 继续对话 - 第二阶段
     */
    continueConversation() {
        this.playConversationStage(2);
    }
    
    /**
     * 完成信息收集对话 - 第三阶段
     */
    finishInfoCollection() {
        // 播放第3阶段对话
        this.playConversationStage(3);
        
        // 同时启动流程导航更新（基于时间，不依赖回调）
        this.updateProcessSteps();
    }
    
    /**
     * 派单说明对话 - 第四阶段
     */
    finalConversation() {
        this.playConversationStage(4);
    }
    
    /**
     * 播放指定阶段的对话
     */
    playConversationStage(stage) {
        const stageConversations = this.demoData.conversations.filter(conv => conv.stage === stage);
        let delay = 1000;
        
        stageConversations.forEach((conv, index) => {
            setTimeout(() => {
                this.addMessage(conv.speaker, conv.text);
                
                // 在特定对话后更新流程步骤
                if (stage === 3) {
                    this.updateProcessStepBasedOnMessage(conv.text);
                }
            }, delay);
            
            delay += conv.speaker === 'citizen' ? 3000 : 2500;
        });
    }
    
    /**
     * 更新流程导航步骤
     */
    updateProcessSteps() {
        const steps = [
            { id: 'process-step-1', delay: 2000 },
            { id: 'process-step-2', delay: 5000 },
            { id: 'process-step-3', delay: 8000 },
            { id: 'process-step-4', delay: 11000 }
        ];
        
        steps.forEach(step => {
            setTimeout(() => {
                this.markProcessStepCompleted(step.id);
            }, step.delay);
        });
    }
    
    /**
     * 根据对话内容更新流程步骤
     */
    updateProcessStepBasedOnMessage(messageText) {
        if (messageText.includes('兄弟烧烤')) {
            setTimeout(() => this.markProcessStepCompleted('process-step-1'), 500);
        } else if (messageText.includes('营业到半夜') || messageText.includes('吵死了')) {
            setTimeout(() => this.markProcessStepCompleted('process-step-2'), 500);
        } else if (messageText.includes('希望我们怎么处理') || messageText.includes('整改设备')) {
            setTimeout(() => this.markProcessStepCompleted('process-step-3'), 500);
        } else if (messageText.includes('环保局处理油烟') || messageText.includes('协调环保局')) {
            setTimeout(() => this.markProcessStepCompleted('process-step-4'), 500);
        }
    }
    
    /**
     * 标记流程步骤为完成
     */
    markProcessStepCompleted(stepId) {
        const stepElement = document.getElementById(stepId);
        if (stepElement) {
            stepElement.classList.add('completed');
            const checkbox = stepElement.querySelector('.checkbox');
            if (checkbox) {
                checkbox.textContent = '✓';
            }
        }
    }
    
    /**
     * 添加消息到对话区
     */
    addMessage(speaker, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${speaker}`;
        messageDiv.textContent = text;
        this.elements.messageList.appendChild(messageDiv);
        
        // 滚动到底部
        this.elements.messageList.scrollTop = this.elements.messageList.scrollHeight;
    }
    
    /**
     * 情绪分析步骤
     */
    showEmotionAnalysisStep() {
        // 立即显示情绪分析相关卡片，起到辅助作用
        this.showAICard('emotion');
        this.showAICard('suggestion');
        
        // 模拟点击推荐话术
        setTimeout(() => {
            this.selectSuggestion();
        }, 500);
        
        // 等待第1阶段对话完全结束后再开始第2阶段对话
        setTimeout(() => {
            this.continueConversation();
        }, 4000); // 增加延时，确保第1阶段完全结束
    }
    
    /**
     * 知识推荐和流程导航步骤
     */
    showKnowledgeAndProcessStep() {
        // 移除情绪分析相关卡片，立即显示知识推荐相关卡片
        this.removeAICard('emotion');
        this.removeAICard('suggestion');
        
        this.showAICard('knowledge');
        this.showAICard('process');
        
        // 等待第2阶段对话完全结束后再开始第3阶段对话
        setTimeout(() => {
            this.finishInfoCollection();
        }, 3000); // 增加延时，确保第2阶段完全结束
    }
    
    /**
     * 智能派单步骤
     */
    showSmartDispatchStep() {
        // 移除知识推荐相关卡片，显示派单分析卡片
        this.removeAICard('knowledge');
        this.removeAICard('process');
        
        this.showAICard('dispatch');
        
        // 等待第3阶段对话完全结束后再开始第4阶段对话
        setTimeout(() => {
            this.finalConversation();
        }, 5000); // 增加延时，确保第3阶段完全结束
        
        // 执行派单动画
        setTimeout(() => {
            this.createDispatchAnimation();
        }, 8000);
    }
    
    /**
     * 完成演示
     */
    completeDemo() {
        this.isPlaying = false;
        this.elements.startDemo.textContent = '重新开始';
        this.elements.startDemo.disabled = false;
        
        console.log('✅ 演示完成！');
    }
    
    /**
     * 显示AI卡片
     */
    showAICard(cardId) {
        const cardData = this.demoData.aiCards.find(card => card.id === cardId);
        if (!cardData) return;
        
        const cardElement = document.createElement('div');
        cardElement.className = `ai-card ${cardData.type}`;
        cardElement.id = `card-${cardId}`;
        cardElement.innerHTML = `
            <div class="card-header">${cardData.title}</div>
            <div class="card-content">${cardData.content}</div>
        `;
        
        this.elements.aiCards.appendChild(cardElement);
        this.elements.aiCards.scrollTop = this.elements.aiCards.scrollHeight;
    }
    
    /**
     * 清除AI卡片
     */
    clearAICards() {
        this.elements.aiCards.innerHTML = '';
    }
    
    /**
     * 移除特定AI卡片
     */
    removeAICard(cardId) {
        const cardElement = document.getElementById(`card-${cardId}`);
        if (cardElement) {
            cardElement.remove();
        }
    }
    
    /**
     * 选择建议话术
     */
    selectSuggestion() {
        const suggestionItems = document.querySelectorAll('.suggestion-item');
        if (suggestionItems.length > 0) {
            suggestionItems[0].classList.add('selected');
        }
    }
    
    /**
     * 显示工单模态框
     */
    showOrderModal() {
        const orderData = this.demoData.orderData;
        this.elements.orderContent.innerHTML = `
            <div class="order-field">
                <div class="field-label">工单编号:</div>
                <div class="field-value">${orderData.orderNumber}</div>
            </div>
            <div class="order-field">
                <div class="field-label">来电人:</div>
                <div class="field-value">${orderData.caller}</div>
            </div>
            <div class="order-field">
                <div class="field-label">问题分类:</div>
                <div class="field-value">${orderData.category}</div>
            </div>
            <div class="order-field">
                <div class="field-label">紧急程度:</div>
                <div class="field-value">${orderData.urgency}</div>
            </div>
            <div class="order-field">
                <div class="field-label">事发地址:</div>
                <div class="field-value">${orderData.address}</div>
            </div>
            <div class="order-field">
                <div class="field-label">涉及商户:</div>
                <div class="field-value">${orderData.business}</div>
            </div>
            <div class="order-field">
                <div class="field-label">问题描述:</div>
                <div class="field-value">${orderData.description}</div>
            </div>
            <div class="order-field">
                <div class="field-label">市民核心诉求:</div>
                <div class="field-value">${orderData.demand}</div>
            </div>
            <div class="order-field">
                <div class="field-label">处理部门:</div>
                <div class="field-value">${orderData.departments.join('、')}</div>
            </div>
        `;
        
        this.elements.orderModal.style.display = 'flex';
    }
    
    /**
     * 隐藏工单模态框
     */
    hideOrderModal() {
        this.elements.orderModal.style.display = 'none';
    }
    
    /**
     * 确认工单
     */
    confirmOrder() {
        this.hideOrderModal();
        console.log('✅ 工单已确认');
    }
    
    /**
     * 创建数据流动画
     */
    createDataFlowAnimation() {
        const container = this.elements.dataFlowContainer;
        const conversationRect = this.elements.messageList.getBoundingClientRect();
        const orderModalRect = { left: window.innerWidth / 2, top: window.innerHeight / 2 };
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'data-particle';
                particle.style.left = `${conversationRect.right - 10}px`;
                particle.style.top = `${conversationRect.top + Math.random() * conversationRect.height}px`;
                
                container.appendChild(particle);
                
                // 动画到目标位置
                setTimeout(() => {
                    particle.style.transition = 'all 1.5s ease-in-out';
                    particle.style.left = `${orderModalRect.left}px`;
                    particle.style.top = `${orderModalRect.top}px`;
                    particle.style.opacity = '0';
                }, 50);
                
                // 清理
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2000);
            }, i * 100);
        }
    }
    
    /**
     * 创建派单动画
     */
    createDispatchAnimation() {
        console.log('🎨 创建派单动画');
        // 这里可以添加派单流程的可视化动画
    }
    

}

// 等待DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new DemoController();
});

// 添加一些实用的工具函数
const Utils = {
    /**
     * 打字机效果
     */
    typeWriter(element, text, speed = 50) {
        return new Promise((resolve) => {
            element.innerHTML = '';
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    },
    
    /**
     * 随机延迟
     */
    randomDelay(min, max) {
        return new Promise(resolve => {
            const delay = Math.random() * (max - min) + min;
            setTimeout(resolve, delay);
        });
    },
    
    /**
     * 创建粒子效果
     */
    createParticles(container, count = 10) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#667eea';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animation = 'float 3s ease-in-out infinite';
            container.appendChild(particle);
            
            // 清理
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 3000);
        }
    }
};

console.log('🎉 AI坐席辅助系统演示脚本加载完成');

// 全局函数：确认派单
function confirmDispatch() {
    console.log('✅ 确认派单');
    
    // 创建派单成功提示
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #27ae60, #2ecc71);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(39, 174, 96, 0.3);
        z-index: 3000;
        font-weight: 600;
        animation: slideInRight 0.5s ease;
    `;
    toast.textContent = '✅ 工单已成功派发到相关部门！';
    
    document.body.appendChild(toast);
    
    // 3秒后移除提示
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}
