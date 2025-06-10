/**
 * 12345热线 - 智能工单协同处理交互脚本
 * 实现三阶段演示的完整交互逻辑
 */

class WorkOrderDemo {
    constructor() {
        this.currentStage = 1;
        this.currentStep = 1;
        this.taskProgressStep = 1;
        this.initializeEventListeners();
        this.showStage(1);
    }

    /**
     * 初始化事件监听器
     */
    initializeEventListeners() {
        // 阶段切换按钮
        document.getElementById('stage1Btn').addEventListener('click', () => this.showStage(1));
        document.getElementById('stage2Btn').addEventListener('click', () => this.showStage(2));
        document.getElementById('stage3Btn').addEventListener('click', () => this.showStage(3));
        document.getElementById('resetBtn').addEventListener('click', () => this.resetDemo());

        // 演示要点弹窗
        // document.getElementById('pointsBtn').addEventListener('click', () => this.showPointsPopup());
        document.getElementById('pointsCloseBtn').addEventListener('click', () => this.hidePointsPopup());
        document.getElementById('pointsPopupOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.hidePointsPopup();
        });

        // 阶段一交互
        document.getElementById('generateOrderBtn')?.addEventListener('click', () => this.generateWorkOrder());
        document.getElementById('assignOrderBtn')?.addEventListener('click', () => this.assignWorkOrder());

        // 阶段二交互
        document.getElementById('showWarningBtn')?.addEventListener('click', () => this.showWarning());
        document.getElementById('step1Btn')?.addEventListener('click', () => this.showStep(1));
        document.getElementById('step2Btn')?.addEventListener('click', () => this.showStep(2));
        document.getElementById('step3Btn')?.addEventListener('click', () => this.showStep(3));
        document.getElementById('acceptTaskBtn')?.addEventListener('click', () => this.acceptTask());
        document.getElementById('nextStepBtn')?.addEventListener('click', () => this.nextStep());

        // 阶段三交互
        document.querySelectorAll('.review-detail-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.showReviewDetail(e.target.dataset.type));
        });
        document.getElementById('startCallbackBtn')?.addEventListener('click', () => this.startCallback());
        document.getElementById('startAuditBtn')?.addEventListener('click', () => this.startAuditProcess());
    }

    /**
     * 显示指定阶段
     * @param {number} stageNumber - 阶段编号 (1-3)
     */
    showStage(stageNumber) {
        this.currentStage = stageNumber;
        
        // 隐藏所有阶段面板
        document.querySelectorAll('.stage-panel').forEach(panel => {
            panel.style.display = 'none';
        });

        // 显示指定阶段
        const targetPanel = document.getElementById(`stage${stageNumber}Panel`);
        if (targetPanel) {
            targetPanel.style.display = 'block';
        }

        // 更新按钮状态
        this.updateStageButtons(stageNumber);

        // 重置阶段状态
        this.resetStageState(stageNumber);
        
        // 调试日志
        console.log(`切换到阶段 ${stageNumber}`);
    }

    /**
     * 更新阶段按钮状态
     * @param {number} activeStage - 当前激活的阶段
     */
    updateStageButtons(activeStage) {
        const buttons = ['stage1Btn', 'stage2Btn', 'stage3Btn'];
        
        buttons.forEach((btnId, index) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                if (index + 1 === activeStage) {
                    btn.className = 'btn-primary';
                } else {
                    btn.className = 'btn-secondary';
                }
            }
        });
    }

    /**
     * 重置阶段状态
     * @param {number} stageNumber - 阶段编号
     */
    resetStageState(stageNumber) {
        switch (stageNumber) {
            case 1:
                this.resetStage1();
                break;
            case 2:
                this.resetStage2();
                break;
            case 3:
                this.resetStage3();
                break;
        }
    }

    /**
     * 重置阶段一状态
     */
    resetStage1() {
        const orderDraft = document.getElementById('orderDraft');
        const assignmentFlow = document.getElementById('assignmentFlow');
        
        if (orderDraft) orderDraft.style.display = 'none';
        if (assignmentFlow) assignmentFlow.style.display = 'none';
    }

    /**
     * 重置阶段二状态
     */
    resetStage2() {
        const aiWarning = document.getElementById('aiWarning');
        const timeFlow = document.getElementById('timeFlow');
        const taskDetails = document.getElementById('taskDetails');
        const taskNotification = document.getElementById('taskNotification');
        const monitoringCenter = document.getElementById('monitoringCenter');
        
        // 隐藏所有子组件
        if (aiWarning) aiWarning.style.display = 'none';
        if (timeFlow) timeFlow.style.display = 'none';
        if (taskDetails) taskDetails.style.display = 'none';
        if (monitoringCenter) monitoringCenter.style.display = 'none';
        
        // 显示任务通知
        if (taskNotification) taskNotification.style.display = 'block';
        
        // 重置状态变量
        this.currentStep = 1;
        this.taskProgressStep = 1;
        
        // 重置时间显示
        this.resetTimeDisplays();
        
        // 调用showStep确保正确显示步骤一
        this.showStep(1);
        
        // 重置进度状态
        this.resetTaskProgress();
        
        // 重置任务接受按钮
        const acceptBtn = document.getElementById('acceptTaskBtn');
        if (acceptBtn) {
            acceptBtn.innerHTML = '✅ 接受任务';
            acceptBtn.disabled = false;
        }
    }
    
    /**
     * 重置时间显示
     */
    resetTimeDisplays() {
        // 重置手机状态栏时间
        const currentTimeDisplay = document.getElementById('currentTime');
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = '14:32';
        }
        
        // 重置时间流转显示
        const timeFlowDisplay = document.querySelector('.time-flow .time-display');
        if (timeFlowDisplay) {
            timeFlowDisplay.textContent = '第二天 15:30';
        }
        
        // 重置监控中心时间显示
        const monitoringTimeDisplay = document.querySelector('.monitoring-center .time-display');
        if (monitoringTimeDisplay) {
            monitoringTimeDisplay.textContent = '第二天 15:30';
        }
    }

    /**
     * 重置阶段三状态
     */
    resetStage3() {
        const reviewOpinion = document.getElementById('reviewOpinion');
        const callbackResult = document.getElementById('callbackResult');
        const knowledgeDeposit = document.getElementById('knowledgeDeposit');
        const smartCallback = document.getElementById('smartCallback');
        const reportsContainer = document.getElementById('reportsContainer');
        const aiAuditProgress = document.getElementById('aiAuditProgress');
        const startAuditBtn = document.getElementById('startAuditBtn');
        const auditStatus = document.getElementById('auditStatus');
        const reviewStatus = document.getElementById('reviewStatus');
        
        // 隐藏所有子组件
        if (reviewOpinion) reviewOpinion.style.display = 'none';
        if (callbackResult) callbackResult.style.display = 'none';
        if (knowledgeDeposit) knowledgeDeposit.style.display = 'none';
        if (smartCallback) smartCallback.style.display = 'none';
        if (aiAuditProgress) aiAuditProgress.style.display = 'none';
        
        // 清空报告容器
        if (reportsContainer) reportsContainer.innerHTML = '';
        
        // 重置审核控制状态
        if (startAuditBtn) {
            startAuditBtn.disabled = false;
            startAuditBtn.innerHTML = '🚀 开始智能审核流程';
        }
        
        if (auditStatus) {
            auditStatus.textContent = '等待开始';
            auditStatus.className = 'audit-status';
        }
        
        if (reviewStatus) {
            reviewStatus.textContent = '工单状态：准备审核';
        }
    }

    /**
     * 生成工单 - 阶段一核心功能
     */
    generateWorkOrder() {
        const generateBtn = document.getElementById('generateOrderBtn');
        const orderDraft = document.getElementById('orderDraft');

        if (!generateBtn || !orderDraft) return;

        // 按钮动画效果
        generateBtn.innerHTML = '⚡ 生成中...';
        generateBtn.disabled = true;

        // 模拟AI生成延迟
        setTimeout(() => {
            // 显示工单草稿
            orderDraft.style.display = 'block';
            orderDraft.style.animation = 'slideIn 0.5s ease-out';

            // 恢复按钮状态
            generateBtn.innerHTML = '⚡ 已生成';
            generateBtn.disabled = false;

            // 高亮显示生成时间
            const generationTime = document.querySelector('.generation-time');
            if (generationTime) {
                generationTime.style.animation = 'pulse 1s ease-in-out 3';
            }

        }, 800);
    }

    /**
     * 派发工单 - 阶段一核心功能
     */
    assignWorkOrder() {
        const assignBtn = document.getElementById('assignOrderBtn');
        const assignmentFlow = document.getElementById('assignmentFlow');

        if (!assignBtn || !assignmentFlow) return;

        // 按钮动画效果
        assignBtn.innerHTML = '🚀 派发中...';
        assignBtn.disabled = true;

        setTimeout(() => {
            // 显示派单流程图
            assignmentFlow.style.display = 'block';
            assignmentFlow.style.animation = 'slideIn 0.5s ease-out';

            // 逐个显示子任务状态
            this.animateSubTasks();

            // 恢复按钮状态
            assignBtn.innerHTML = '🚀 已派单';
            assignBtn.disabled = false;

        }, 1500);
    }

    /**
     * 动画显示子任务派发状态
     */
    animateSubTasks() {
        const subTasks = document.querySelectorAll('.sub-task');
        
        subTasks.forEach((task, index) => {
            setTimeout(() => {
                task.style.animation = 'slideIn 0.3s ease-out';
                task.style.transform = 'scale(1.05)';
                
                // 添加发送动画
                setTimeout(() => {
                    task.style.transform = 'scale(1)';
                    const status = task.querySelector('.task-status');
                    if (status) {
                        status.style.animation = 'pulse 0.5s ease-in-out';
                    }
                }, 200);
            }, index * 300);
        });
    }

    /**
     * 显示阶段二步骤
     * @param {number} stepNumber - 步骤编号 (1-3)
     */
    showStep(stepNumber) {
        this.currentStep = stepNumber;
        this.updateStepButtons(stepNumber);
        
        const mobileStep = document.getElementById('mobileStep');
        const timeFlow = document.getElementById('timeFlow');
        const monitoringCenter = document.getElementById('monitoringCenter');
        
        // 隐藏所有步骤内容
        if (mobileStep) mobileStep.style.display = stepNumber === 1 ? 'flex' : 'none';
        if (timeFlow) timeFlow.style.display = stepNumber === 2 ? 'block' : 'none';
        if (monitoringCenter) monitoringCenter.style.display = stepNumber === 3 ? 'block' : 'none';
        
        // 调试日志
        console.log(`第二阶段步骤 ${stepNumber}:`, {
            mobileStep: mobileStep?.style.display,
            timeFlow: timeFlow?.style.display,
            monitoringCenter: monitoringCenter?.style.display
        });
        
        // 执行特定步骤的动画
        switch (stepNumber) {
            case 1:
                this.animateStep1();
                break;
            case 2:
                this.animateStep2();
                break;
            case 3:
                this.animateStep3();
                break;
        }
    }

    /**
     * 更新步骤按钮状态
     * @param {number} activeStep - 当前激活的步骤
     */
    updateStepButtons(activeStep) {
        const buttons = ['step1Btn', 'step2Btn', 'step3Btn'];
        
        buttons.forEach((btnId, index) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                if (index + 1 === activeStep) {
                    btn.className = 'step-btn btn-primary';
                } else {
                    btn.className = 'step-btn btn-secondary';
                }
            }
        });
    }

    /**
     * 步骤一动画：移动端接收任务
     */
    animateStep1() {
        const notification = document.querySelector('.notification-icon');
        if (notification) {
            notification.classList.add('pulse');
        }
    }

    /**
     * 步骤二动画：时间流转
     */
    animateStep2() {
        const timeFlow = document.getElementById('timeFlow');
        if (timeFlow) {
            timeFlow.style.animation = 'slideIn 0.5s ease-out';
        }
        
        // 开始真正的时间流转动画
        this.startTimeFlowAnimation();
    }
    
    /**
     * 开始时间流转动画
     */
    startTimeFlowAnimation() {
        const timeDisplay = document.querySelector('.time-flow .time-display');
        const currentTimeDisplay = document.getElementById('currentTime');
        
        if (!timeDisplay) return;
        
        // 创建时间序列：从当天14:32到第二天15:30
        const timeSequence = this.generateTimeSequence();
        let currentIndex = 0;
        
        // 添加更新样式
        timeDisplay.classList.add('updating');
        
        // 更新时间显示的函数
        const updateTime = () => {
            if (currentIndex < timeSequence.length) {
                const timeInfo = timeSequence[currentIndex];
                
                // 添加跳跃动画
                timeDisplay.classList.add('jump');
                
                // 更新显示内容
                timeDisplay.textContent = timeInfo.display;
                
                // 同时更新手机状态栏的时间
                if (currentTimeDisplay) {
                    currentTimeDisplay.textContent = timeInfo.time;
                }
                
                // 移除跳跃动画类
                setTimeout(() => {
                    timeDisplay.classList.remove('jump');
                }, 300);
                
                currentIndex++;
                
                // 继续下一个时间点，增加间隔让动画更清晰
                setTimeout(updateTime, 200);
            } else {
                // 时间流转完成，移除更新样式
                timeDisplay.classList.remove('updating');
                
                // 显示完成提示并自动跳转到步骤三（监控预警）
                setTimeout(() => {
                    this.showToast('时间流转完成，进入监控预警阶段...', 'warning');
                    
                    setTimeout(() => {
                        this.showStep(3);
                        this.showToast('检测到协同瓶颈，AI系统正在分析...', 'warning');
                        
                        // 稍等一下后自动显示预警
                        setTimeout(() => {
                            this.showWarning();
                            
                            // 预警查看完成后，跳转到阶段三
                            setTimeout(() => {
                                this.showToast('预警处理完成，进入智能审核阶段...', 'warning');
                                
                                setTimeout(() => {
                                    this.showStage(3);
                                    
                                    // 稍等一下后自动开始审核流程
                                    setTimeout(() => {
                                        this.startAuditProcess();
                                    }, 2000);
                                }, 2000);
                            }, 3000);
                        }, 2000);
                    }, 1500);
                }, 1000);
            }
        };
        
        // 开始时间更新
        setTimeout(updateTime, 500);
    }
    
    /**
     * 生成时间序列
     */
    generateTimeSequence() {
        const sequence = [];
        
        // 当天时间点
        const dayOneTime = [
            { time: '14:32', display: '当天 14:32' },
            { time: '15:30', display: '当天 15:30' },
            { time: '16:45', display: '当天 16:45' },
            { time: '18:20', display: '当天 18:20' },
            { time: '20:10', display: '当天 20:10' },
            { time: '22:30', display: '当天 22:30' }
        ];
        
        // 第二天时间点
        const dayTwoTime = [
            { time: '08:00', display: '第二天 08:00' },
            { time: '09:30', display: '第二天 09:30' },
            { time: '11:15', display: '第二天 11:15' },
            { time: '13:20', display: '第二天 13:20' },
            { time: '14:45', display: '第二天 14:45' },
            { time: '15:30', display: '第二天 15:30' }
        ];
        
        return [...dayOneTime, ...dayTwoTime];
    }

    /**
     * 步骤三动画：监控中心
     */
    animateStep3() {
        const monitoringCenter = document.getElementById('monitoringCenter');
        if (monitoringCenter) {
            monitoringCenter.style.animation = 'slideIn 0.5s ease-out';
        }
    }

    /**
     * 接受任务
     */
    acceptTask() {
        const taskNotification = document.getElementById('taskNotification');
        const taskDetails = document.getElementById('taskDetails');
        const acceptBtn = document.getElementById('acceptTaskBtn');

        if (acceptBtn) {
            acceptBtn.innerHTML = '✅ 已接受';
            acceptBtn.disabled = true;
        }

        setTimeout(() => {
            if (taskNotification) taskNotification.style.display = 'none';
            if (taskDetails) {
                taskDetails.style.display = 'block';
                taskDetails.style.animation = 'slideIn 0.5s ease-out';
            }
        }, 1000);
    }

    /**
     * 执行下一步操作
     */
    nextStep() {
        const nextBtn = document.getElementById('nextStepBtn');
        const progressSteps = document.querySelectorAll('.progress-step');
        
        if (this.taskProgressStep <= 4) {
            // 完成当前步骤
            const currentStep = progressSteps[this.taskProgressStep - 1];
            if (currentStep) {
                currentStep.classList.add('completed');
                currentStep.style.animation = 'stepProgress 0.8s ease-out';
                
                // 更新时间
                const timeSpan = currentStep.querySelector('.step-time');
                if (timeSpan) {
                    const times = ['14:45', '15:10', '15:25', '15:50'];
                    timeSpan.textContent = times[this.taskProgressStep - 1];
                }
            }
            
            // 增加步骤计数
            this.taskProgressStep++;
            
            // 激活下一步或完成任务
            if (this.taskProgressStep <= 4) {
                const nextStep = progressSteps[this.taskProgressStep - 1];
                if (nextStep) {
                    nextStep.classList.add('active');
                }
                
                // 更新按钮
                if (nextBtn) {
                    nextBtn.innerHTML = `▶️ 下一步操作 (${this.taskProgressStep}/4)`;
                }
            } else {
                // 所有步骤完成
                if (nextBtn) {
                    nextBtn.innerHTML = '✅ 任务完成';
                    nextBtn.disabled = true;
                }
                
                // 显示完成提示并自动跳转到步骤二
                this.showToast('任务执行完成，即将进入时间流转阶段...', 'success');
                
                setTimeout(() => {
                    this.showStep(2);
                    this.showToast('时间快进中...', 'success');
                }, 2000);
            }
        }
    }

    /**
     * 重置任务进度
     */
    resetTaskProgress() {
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index === 0) {
                step.classList.add('active');
            }
            
            const timeSpan = step.querySelector('.step-time');
            if (timeSpan && index > 0) {
                timeSpan.textContent = '--:--';
            }
        });
        
        const nextBtn = document.getElementById('nextStepBtn');
        if (nextBtn) {
            nextBtn.innerHTML = '▶️ 下一步操作';
            nextBtn.disabled = false;
        }
    }

    /**
     * 显示监控预警 - 阶段二核心功能
     */
    showWarning() {
        const warningBtn = document.getElementById('showWarningBtn');
        const aiWarning = document.getElementById('aiWarning');
        const warningNode = document.getElementById('warningNode');

        if (!aiWarning) return;

        // 高亮预警节点
        if (warningNode) {
            warningNode.style.animation = 'pulse 0.5s ease-in-out 3';
        }

        // 显示AI预警详情
        setTimeout(() => {
            aiWarning.style.display = 'block';
            aiWarning.style.animation = 'slideIn 0.5s ease-out';

            // 更新按钮状态
            if (warningBtn) {
                warningBtn.innerHTML = '✅ 预警已查看';
                warningBtn.disabled = true;
            }
        }, 1000);
    }

    /**
     * 开始审核流程
     */
    startAuditProcess() {
        const startBtn = document.getElementById('startAuditBtn');
        const auditStatus = document.getElementById('auditStatus');
        const reviewStatus = document.getElementById('reviewStatus');
        
        if (!startBtn) return;
        
        // 更新状态
        startBtn.disabled = true;
        startBtn.innerHTML = '🔄 审核进行中...';
        auditStatus.textContent = '审核中';
        auditStatus.className = 'audit-status processing';
        reviewStatus.textContent = '工单状态：AI智能审核中';
        
        this.showToast('开始智能审核流程...', 'success');
        
        // 开始审核流程
        setTimeout(() => {
            this.processFirstReport();
        }, 1500);
    }

    /**
     * 处理第一个报告（公安局）
     */
    processFirstReport() {
        const reportsContainer = document.getElementById('reportsContainer');
        
        // 创建第一个报告
        const report1 = this.createReportElement({
            icon: '🚔',
            deptName: '公安局治安支队',
            submitTime: '今日 16:30',
            content: '"已派员前往现场，将流浪犬捕获并送走。"',
            type: 'first'
        });
        
        // 显示报告提交
        reportsContainer.appendChild(report1);
        this.showToast('公安局报告已提交', 'success');
        
        // 开始AI审核
        setTimeout(() => {
            this.startAIReview(report1, 'passed', () => {
                // 第一个报告审核完成，处理第二个报告
                setTimeout(() => {
                    this.processSecondReport();
                }, 1000);
            });
        }, 1500);
    }

    /**
     * 处理第二个报告（街道办）
     */
    processSecondReport() {
        const reportsContainer = document.getElementById('reportsContainer');
        
        // 创建第二个报告
        const report2 = this.createReportElement({
            icon: '🏘️',
            deptName: 'XX街道办事处',
            submitTime: '今日 17:15',
            content: '"问题已处理完毕。"',
            type: 'second'
        });
        
        // 显示报告提交
        reportsContainer.appendChild(report2);
        this.showToast('街道办报告已提交', 'success');
        
        // 开始AI审核
        setTimeout(() => {
            this.startAIReview(report2, 'rejected', () => {
                // 显示审核意见
                setTimeout(() => {
                    this.showRejectionReason();
                    
                    // 模拟报告修改和重新提交
                    setTimeout(() => {
                        this.resubmitReport(report2);
                    }, 3000);
                }, 1000);
            });
        }, 1500);
    }

    /**
     * 创建报告元素
     */
    createReportElement({ icon, deptName, submitTime, content, type }) {
        const reportItem = document.createElement('div');
        reportItem.className = 'report-item submitting';
        reportItem.innerHTML = `
            <div class="report-header">
                <span class="dept-name">${icon} ${deptName}</span>
                <span class="submit-time">提交时间：${submitTime}</span>
            </div>
            <div class="report-content">
                ${content}
            </div>
            <div class="ai-review-result" style="display: none;">
                <!-- 审核结果将动态添加 -->
            </div>
        `;
        
        return reportItem;
    }

    /**
     * 开始AI审核动画
     */
    startAIReview(reportElement, result, callback) {
        const progressContainer = document.getElementById('aiAuditProgress');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        // 显示审核进度
        progressContainer.style.display = 'block';
        reportElement.className = 'report-item reviewing';
        
        // 审核进度文本序列
        const progressTexts = [
            '正在分析报告内容...',
            '检查关键信息完整性...',
            '验证处理措施合规性...',
            '评估问题解决效果...',
            '生成审核结论...'
        ];
        
        let currentStep = 0;
        let progress = 0;
        
        const updateProgress = () => {
            if (currentStep < progressTexts.length) {
                progressText.textContent = progressTexts[currentStep];
                progress += 20;
                progressFill.style.width = progress + '%';
                currentStep++;
                
                setTimeout(updateProgress, 800);
            } else {
                // 审核完成，显示结果
                progressContainer.style.display = 'none';
                this.showReviewResult(reportElement, result);
                
                if (callback) callback();
            }
        };
        
        updateProgress();
    }

    /**
     * 显示审核结果
     */
    showReviewResult(reportElement, result) {
        const reviewResultDiv = reportElement.querySelector('.ai-review-result');
        
        if (result === 'passed') {
            reportElement.className = 'report-item approved';
            reviewResultDiv.innerHTML = `
                <span class="result-icon">✅</span>
                <span class="result-text">AI审核通过</span>
                <button class="review-detail-btn" data-type="passed">查看详情</button>
            `;
            this.showToast('AI审核通过', 'success');
        } else {
            reportElement.className = 'report-item rejected';
            reviewResultDiv.innerHTML = `
                <span class="result-icon">❌</span>
                <span class="result-text">AI审核驳回</span>
                <button class="review-detail-btn" data-type="rejected" onclick="workOrderDemo.showReviewDetail('rejected')">查看详情</button>
            `;
            this.showToast('AI审核驳回', 'warning');
        }
        
        reviewResultDiv.style.display = 'flex';
    }

    /**
     * 显示驳回原因
     */
    showRejectionReason() {
        const reviewOpinion = document.getElementById('reviewOpinion');
        if (reviewOpinion) {
            reviewOpinion.style.display = 'block';
            reviewOpinion.style.animation = 'slideIn 0.5s ease-out';
        }
    }

    /**
     * 重新提交报告
     */
    resubmitReport(reportElement) {
        this.showToast('街道办正在修改报告...', 'success');
        
        // 添加重新提交动画
        reportElement.classList.add('resubmitting');
        
        setTimeout(() => {
            // 更新报告内容
            const reportContent = reportElement.querySelector('.report-content');
            reportContent.classList.add('updating');
            
            setTimeout(() => {
                reportContent.innerHTML = `
                    "已组织网格员对XX花园小区进行全面巡查，向居民解释了流浪犬处理情况，消除了居民的安全担忧。同时建立了定期巡查机制，每周进行2次社区安全检查，并设置了居民反馈渠道，确保类似问题能够及时发现和处理。"
                `;
                reportContent.classList.remove('updating');
                
                // 重新审核
                setTimeout(() => {
                    this.startAIReview(reportElement, 'passed', () => {
                        // 所有审核完成
                        setTimeout(() => {
                            this.completeAuditProcess();
                        }, 1000);
                    });
                }, 1000);
                
            }, 1000);
            
        }, 1000);
    }

    /**
     * 完成审核流程
     */
    completeAuditProcess() {
        const auditStatus = document.getElementById('auditStatus');
        const reviewStatus = document.getElementById('reviewStatus');
        const reviewOpinion = document.getElementById('reviewOpinion');
        const smartCallback = document.getElementById('smartCallback');
        
        // 更新状态
        auditStatus.textContent = '审核完成';
        auditStatus.className = 'audit-status completed';
        reviewStatus.textContent = '工单状态：审核通过，准备回访';
        
        // 隐藏审核意见
        if (reviewOpinion) {
            reviewOpinion.style.display = 'none';
        }
        
        // 显示回访界面
        if (smartCallback) {
            smartCallback.style.display = 'block';
            smartCallback.style.animation = 'slideIn 0.5s ease-out';
        }
        
        this.showToast('所有报告审核完成，进入回访阶段', 'success');
    }

    /**
     * 显示审核详情 - 阶段三功能
     * @param {string} type - 审核类型 (passed/rejected)
     */
    showReviewDetail(type) {
        const reviewOpinion = document.getElementById('reviewOpinion');
        
        if (type === 'rejected' && reviewOpinion) {
            reviewOpinion.style.display = 'block';
            reviewOpinion.style.animation = 'slideIn 0.5s ease-out';
        }
    }

    /**
     * 开始回访 - 阶段三核心功能
     */
    startCallback() {
        const callbackBtn = document.getElementById('startCallbackBtn');
        const callbackResult = document.getElementById('callbackResult');
        const knowledgeDeposit = document.getElementById('knowledgeDeposit');

        if (!callbackBtn) return;

        // 按钮状态更新
        callbackBtn.innerHTML = '📞 回访中...';
        callbackBtn.disabled = true;

        // 模拟回访过程
        setTimeout(() => {
            // 显示回访结果
            if (callbackResult) {
                callbackResult.style.display = 'block';
                callbackResult.style.animation = 'slideIn 0.5s ease-out';
            }

            // 继续显示知识沉淀
            setTimeout(() => {
                if (knowledgeDeposit) {
                    knowledgeDeposit.style.display = 'block';
                    knowledgeDeposit.style.animation = 'slideIn 0.5s ease-out';
                    
                    // 触发飞行动画
                    const knowledgeCard = document.querySelector('.knowledge-card');
                    if (knowledgeCard) {
                        knowledgeCard.classList.add('flying');
                    }
                }

                // 恢复按钮状态
                callbackBtn.innerHTML = '✅ 回访完成';
                
            }, 1500);

        }, 2000);
    }

    /**
     * 显示演示要点弹窗
     */
    showPointsPopup() {
        const overlay = document.getElementById('pointsPopupOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            // 添加active类来触发动画
            setTimeout(() => {
                overlay.classList.add('active');
            }, 10);
            // 防止body滚动
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * 隐藏演示要点弹窗
     */
    hidePointsPopup() {
        const overlay = document.getElementById('pointsPopupOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            // 等待动画完成后隐藏
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
            // 恢复body滚动
            document.body.style.overflow = 'auto';
        }
    }

    /**
     * 重置整个演示
     */
    resetDemo() {
        // 重置到阶段一
        this.showStage(1);
        
        // 重置所有动画状态
        document.querySelectorAll('[style*="animation"]').forEach(element => {
            element.style.animation = '';
        });

        // 重置所有按钮状态
        this.resetAllButtons();

        // 显示重置完成提示
        this.showToast('演示已重置', 'success');
    }

    /**
     * 重置所有按钮状态
     */
    resetAllButtons() {
        const buttons = [
            { id: 'generateOrderBtn', text: '⚡ AI秒级生成工单' },
            { id: 'assignOrderBtn', text: '🚀 一键派单' },
            { id: 'showWarningBtn', text: '⚠️ 查看预警详情' },
            { id: 'startCallbackBtn', text: '📞 开始回访' },
            { id: 'acceptTaskBtn', text: '✅ 接受任务' },
            { id: 'nextStepBtn', text: '▶️ 下一步操作' }
        ];

        buttons.forEach(({ id, text }) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.innerHTML = text;
                btn.disabled = false;
            }
        });
    }

    /**
     * 显示提示消息
     * @param {string} message - 提示消息
     * @param {string} type - 消息类型 (success/warning/error)
     */
    showToast(message, type = 'success') {
        // 创建提示元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${this.getToastIcon(type)}</span>
            <span class="toast-message">${message}</span>
        `;

        // 添加样式
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#f44336',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '25px',
            zIndex: '3000',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            animation: 'slideIn 0.3s ease-out'
        });

        // 添加到页面
        document.body.appendChild(toast);

        // 3秒后自动移除
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    /**
     * 获取提示图标
     * @param {string} type - 消息类型
     * @returns {string} 图标字符
     */
    getToastIcon(type) {
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || '💡';
    }

    /**
     * 键盘快捷键支持
     */
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // ESC 关闭弹窗
            if (e.key === 'Escape') {
                this.hidePointsPopup();
            }
            
            // 数字键切换阶段
            const stageNumber = parseInt(e.key);
            if (stageNumber >= 1 && stageNumber <= 3) {
                this.showStage(stageNumber);
            }
            
            // R键重置演示
            if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
                e.preventDefault();
                this.resetDemo();
            }
        });
    }

    /**
     * 响应式适配
     */
    handleResponsive() {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        const handleTabletChange = (e) => {
            if (e.matches) {
                // 平板适配
                document.body.classList.add('tablet-mode');
            } else {
                document.body.classList.remove('tablet-mode');
            }
        };

        mediaQuery.addListener(handleTabletChange);
        handleTabletChange(mediaQuery);
    }

    /**
     * 性能优化：防抖函数
     * @param {Function} func - 需要防抖的函数
     * @param {number} delay - 延迟时间
     * @returns {Function} 防抖后的函数
     */
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * 初始化演示数据
     */
    initializeDemoData() {
        // 模拟实时数据更新
        this.updateMonitoringData();
        
        // 每30秒更新一次监控数据
        setInterval(() => {
            this.updateMonitoringData();
        }, 30000);
    }

    /**
     * 更新监控数据
     */
    updateMonitoringData() {
        const boardItems = document.querySelectorAll('.board-item .item-value');
        boardItems.forEach((item, index) => {
            if (!item.classList.contains('warning')) {
                const currentValue = parseInt(item.textContent);
                const newValue = currentValue + Math.floor(Math.random() * 5) - 2;
                if (newValue > 0) {
                    item.textContent = newValue;
                }
            }
        });
    }
}

// 添加自定义CSS动画
const additionalStyles = `
    .toast-slideOut {
        animation: slideOut 0.3s ease-in !important;
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .tablet-mode .control-buttons {
        flex-direction: column;
        gap: 10px;
    }
    
    .tablet-mode .phone-mockup {
        width: 100%;
        max-width: 400px;
    }
`;

// 动态添加样式
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// 页面加载完成后初始化演示
document.addEventListener('DOMContentLoaded', () => {
    const demo = new WorkOrderDemo();
    
    // 初始化额外功能
    demo.initializeKeyboardShortcuts();
    demo.handleResponsive();
    demo.initializeDemoData();
    
    // 全局暴露演示实例（便于调试）
    window.workOrderDemo = demo;
    
    console.log('🎉 12345热线智能工单协同处理演示系统已启动');
    console.log('💡 快捷键提示：');
    console.log('   - 数字键 1-3：切换演示阶段');
    console.log('   - ESC：关闭弹窗');
    console.log('   - Ctrl+R：重置演示');
});
