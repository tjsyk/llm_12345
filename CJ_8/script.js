/**
 * CJ_8 知识库管理平台演示脚本
 * 实现三个场景的交互演示：新知识注入、知识更新、知识空白探测
 */

class KnowledgeBaseDemo {
    constructor() {
        this.currentDemo = null;
        this.animationTimeouts = [];
        this.init();
    }

    /**
     * 初始化演示系统
     */
    init() {
        this.bindEvents();
        this.showPlatformOverview();
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 演示按钮事件
        document.getElementById('startDemo1')?.addEventListener('click', () => this.startDemo1());
        document.getElementById('startDemo2')?.addEventListener('click', () => this.startDemo2());
        document.getElementById('startDemo3')?.addEventListener('click', () => this.startDemo3());
        document.getElementById('resetBtn')?.addEventListener('click', () => this.resetDemo());
        document.getElementById('pointsBtn')?.addEventListener('click', () => this.showPoints());

        // 场景1事件
        document.getElementById('uploadBtn')?.addEventListener('click', () => this.simulateFileUpload());
        document.getElementById('uploadArea')?.addEventListener('click', () => this.simulateFileUpload());

        // 场景2事件
        document.getElementById('viewDetailsBtn')?.addEventListener('click', () => this.showConflictDetails());
        document.getElementById('executeBtn')?.addEventListener('click', () => this.executeUpdate());

        // 场景3事件
        document.querySelectorAll('.detail-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.showGapDetails(e.target.dataset.item));
        });

        // 弹窗事件
        document.getElementById('pointsCloseBtn')?.addEventListener('click', () => this.hidePoints());
        document.getElementById('pointsPopupOverlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'pointsPopupOverlay') {
                this.hidePoints();
            }
        });
    }

    /**
     * 显示平台概览
     */
    showPlatformOverview() {
        this.hideAllSections();
        const overview = document.getElementById('platformOverview');
        if (overview) {
            overview.style.display = 'block';
            overview.style.animation = 'slideIn 0.6s ease-out';
        }
    }

    /**
     * 隐藏所有演示区域
     */
    hideAllSections() {
        const sections = ['platformOverview', 'demo1', 'demo2', 'demo3'];
        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    /**
     * 清除所有定时器
     */
    clearTimeouts() {
        this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
        this.animationTimeouts = [];
    }

    /**
     * 演示1：新知识注入
     */
    startDemo1() {
        this.currentDemo = 'demo1';
        this.clearTimeouts();
        this.hideAllSections();
        
        const demo1 = document.getElementById('demo1');
        if (demo1) {
            demo1.style.display = 'block';
            demo1.style.animation = 'slideIn 0.6s ease-out';
            
            // 重置所有子组件状态
            this.resetDemo1State();
        }
    }

    /**
     * 重置演示1状态
     */
    resetDemo1State() {
        const uploadArea = document.getElementById('uploadArea');
        const processingFlow = document.getElementById('processingFlow');
        const extractionPreview = document.getElementById('extractionPreview');
        const knowledgeGeneration = document.getElementById('knowledgeGeneration');
        const completionResult = document.getElementById('completionResult');

        if (uploadArea) uploadArea.style.display = 'block';
        if (processingFlow) processingFlow.style.display = 'none';
        if (extractionPreview) extractionPreview.style.display = 'none';
        if (knowledgeGeneration) knowledgeGeneration.style.display = 'none';
        if (completionResult) completionResult.style.display = 'none';

        // 重置步骤状态
        document.querySelectorAll('#demo1 .step').forEach(step => {
            step.classList.remove('active', 'completed');
            const progressFill = step.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = '0%';
            }
        });
    }

    /**
     * 模拟文件上传
     */
    simulateFileUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const processingFlow = document.getElementById('processingFlow');
        
        if (uploadArea && processingFlow) {
            // 隐藏上传区域，显示处理流程
            uploadArea.style.display = 'none';
            processingFlow.style.display = 'block';
            processingFlow.style.animation = 'slideIn 0.6s ease-out';

            // 开始处理步骤动画
            this.startProcessingSteps();
        }
    }

    /**
     * 开始处理步骤动画
     */
    startProcessingSteps() {
        const steps = ['step1', 'step2', 'step3', 'step4'];
        let currentIndex = 0;

        const activateStep = () => {
            if (currentIndex < steps.length) {
                const stepElement = document.getElementById(steps[currentIndex]);
                if (stepElement) {
                    stepElement.classList.add('active');
                    
                    // 2秒后完成当前步骤
                    this.animationTimeouts.push(setTimeout(() => {
                        stepElement.classList.remove('active');
                        stepElement.classList.add('completed');
                        currentIndex++;
                        
                        if (currentIndex < steps.length) {
                            activateStep();
                        } else {
                            // 所有步骤完成，显示提取结果
                            this.showExtractionResults();
                        }
                    }, 2000));
                }
            }
        };

        activateStep();
    }

    /**
     * 显示信息提取结果
     */
    showExtractionResults() {
        const extractionPreview = document.getElementById('extractionPreview');
        if (extractionPreview) {
            this.animationTimeouts.push(setTimeout(() => {
                extractionPreview.style.display = 'block';
                extractionPreview.style.animation = 'slideIn 0.6s ease-out';
                
                // 2秒后显示知识生成
                this.animationTimeouts.push(setTimeout(() => {
                    this.showKnowledgeGeneration();
                }, 2000));
            }, 500));
        }
    }

    /**
     * 显示知识生成
     */
    showKnowledgeGeneration() {
        const knowledgeGeneration = document.getElementById('knowledgeGeneration');
        if (knowledgeGeneration) {
            knowledgeGeneration.style.display = 'block';
            knowledgeGeneration.style.animation = 'slideIn 0.6s ease-out';
            
            // 动态显示Q&A项目
            const qaItems = knowledgeGeneration.querySelectorAll('.qa-item');
            qaItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                this.animationTimeouts.push(setTimeout(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 1000));
            });
            
            // 最后显示完成结果
            this.animationTimeouts.push(setTimeout(() => {
                this.showCompletionResult();
            }, qaItems.length * 1000 + 1000));
        }
    }

    /**
     * 显示完成结果
     */
    showCompletionResult() {
        const completionResult = document.getElementById('completionResult');
        if (completionResult) {
            completionResult.style.display = 'block';
            completionResult.style.animation = 'slideIn 0.6s ease-out';
            
            // 数字计数动画
            const highlight = completionResult.querySelector('.highlight');
            if (highlight) {
                this.animateCount(highlight, 0, 15, 1000);
            }
        }
    }

    /**
     * 演示2：知识迭代更新
     */
    startDemo2() {
        this.currentDemo = 'demo2';
        this.clearTimeouts();
        this.hideAllSections();
        
        const demo2 = document.getElementById('demo2');
        if (demo2) {
            demo2.style.display = 'block';
            demo2.style.animation = 'slideIn 0.6s ease-out';
            
            // 重置状态
            this.resetDemo2State();
            
            // 显示冲突警告动画
            this.animateConflictAlert();
        }
    }

    /**
     * 重置演示2状态
     */
    resetDemo2State() {
        const conflictComparison = document.getElementById('conflictComparison');
        const updateProgress = document.getElementById('updateProgress');
        
        if (conflictComparison) conflictComparison.style.display = 'none';
        if (updateProgress) updateProgress.style.display = 'none';
    }

    /**
     * 冲突警告动画
     */
    animateConflictAlert() {
        const conflictAlert = document.getElementById('conflictAlert');
        if (conflictAlert) {
            conflictAlert.style.animation = 'pulse 2s ease-in-out infinite';
        }
    }

    /**
     * 显示冲突详情
     */
    showConflictDetails() {
        const conflictComparison = document.getElementById('conflictComparison');
        if (conflictComparison) {
            conflictComparison.style.display = 'block';
            conflictComparison.style.animation = 'slideIn 0.6s ease-out';
            
            // 停止警告动画
            const conflictAlert = document.getElementById('conflictAlert');
            if (conflictAlert) {
                conflictAlert.style.animation = 'none';
            }
        }
    }

    /**
     * 执行更新
     */
    executeUpdate() {
        const aiSuggestions = document.getElementById('aiSuggestions');
        const updateProgress = document.getElementById('updateProgress');
        
        if (aiSuggestions && updateProgress) {
            aiSuggestions.style.display = 'none';
            updateProgress.style.display = 'block';
            updateProgress.style.animation = 'slideIn 0.6s ease-out';
            
            // 模拟更新步骤
            this.simulateUpdateSteps();
        }
    }

    /**
     * 模拟更新步骤
     */
    simulateUpdateSteps() {
        const steps = document.querySelectorAll('#updateProgress .update-step');
        steps.forEach((step, index) => {
            this.animationTimeouts.push(setTimeout(() => {
                step.classList.add('completed');
                step.style.animation = 'slideIn 0.3s ease-out';
            }, index * 800));
        });

        // 显示最终结果
        this.animationTimeouts.push(setTimeout(() => {
            const updateResult = document.querySelector('.update-result');
            if (updateResult) {
                updateResult.style.animation = 'pulse 1s ease-in-out';
            }
        }, steps.length * 800 + 500));
    }

    /**
     * 演示3：知识空白探测
     */
    startDemo3() {
        this.currentDemo = 'demo3';
        this.clearTimeouts();
        this.hideAllSections();
        
        const demo3 = document.getElementById('demo3');
        if (demo3) {
            demo3.style.display = 'block';
            demo3.style.animation = 'slideIn 0.6s ease-out';
            
            // 重置状态
            this.resetDemo3State();
            
            // 开始排行榜动画
            this.animateGapRanking();
        }
    }

    /**
     * 重置演示3状态
     */
    resetDemo3State() {
        const aiInsight = document.getElementById('aiInsight');
        const knowledgeCreation = document.getElementById('knowledgeCreation');
        
        if (aiInsight) aiInsight.style.display = 'none';
        if (knowledgeCreation) knowledgeCreation.style.display = 'none';
    }

    /**
     * 排行榜动画
     */
    animateGapRanking() {
        const gapItems = document.querySelectorAll('.gap-item');
        gapItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            
            this.animationTimeouts.push(setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 300));
        });
    }

    /**
     * 显示差距详情
     * @param {string} item - 项目类型
     */
    showGapDetails(item) {
        const aiInsight = document.getElementById('aiInsight');
        if (aiInsight) {
            aiInsight.style.display = 'block';
            aiInsight.style.animation = 'slideIn 0.6s ease-out';
            
            // 洞察卡片逐个显示
            const insightCards = aiInsight.querySelectorAll('.insight-card');
            insightCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                this.animationTimeouts.push(setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 500));
            });
            
            // 显示知识创建
            this.animationTimeouts.push(setTimeout(() => {
                this.showKnowledgeCreation();
            }, insightCards.length * 500 + 1000));
        }
    }

    /**
     * 显示知识创建
     */
    showKnowledgeCreation() {
        const knowledgeCreation = document.getElementById('knowledgeCreation');
        if (knowledgeCreation) {
            knowledgeCreation.style.display = 'block';
            knowledgeCreation.style.animation = 'slideIn 0.6s ease-out';
            
            // 2秒后显示草稿预览
            this.animationTimeouts.push(setTimeout(() => {
                this.showDraftPreview();
            }, 2000));
        }
    }

    /**
     * 显示草稿预览
     */
    showDraftPreview() {
        const draftPreview = document.getElementById('draftPreview');
        if (draftPreview) {
            draftPreview.style.display = 'block';
            draftPreview.style.animation = 'slideIn 0.6s ease-out';
            
            // 草稿内容逐个显示
            const draftSections = draftPreview.querySelectorAll('.draft-section');
            draftSections.forEach((section, index) => {
                section.style.opacity = '0';
                section.style.transform = 'translateX(-20px)';
                
                this.animationTimeouts.push(setTimeout(() => {
                    section.style.transition = 'all 0.5s ease';
                    section.style.opacity = '1';
                    section.style.transform = 'translateX(0)';
                }, index * 600));
            });
        }
    }

    /**
     * 重置演示
     */
    resetDemo() {
        this.currentDemo = null;
        this.clearTimeouts();
        this.showPlatformOverview();
        
        // 重置所有状态
        this.resetDemo1State();
        this.resetDemo2State();
        this.resetDemo3State();
    }

    /**
     * 显示演示要点
     */
    showPoints() {
        const overlay = document.getElementById('pointsPopupOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    /**
     * 隐藏演示要点
     */
    hidePoints() {
        const overlay = document.getElementById('pointsPopupOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    /**
     * 数字计数动画
     * @param {HTMLElement} element - 目标元素
     * @param {number} start - 起始数字
     * @param {number} end - 结束数字
     * @param {number} duration - 动画时长
     */
    animateCount(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
        
        this.animationTimeouts.push(timer);
    }

    /**
     * 添加粒子效果（可选的视觉增强）
     * @param {HTMLElement} container - 容器元素
     */
    addParticleEffect(container) {
        if (!container) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #667eea;
                border-radius: 50%;
                pointer-events: none;
                animation: particleFloat ${2 + Math.random() * 3}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${0.3 + Math.random() * 0.7};
            `;
            container.appendChild(particle);
            
            // 清理粒子
            this.animationTimeouts.push(setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 5000));
        }
    }
}

// 添加粒子动画CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// 页面加载完成后初始化演示
document.addEventListener('DOMContentLoaded', () => {
    window.knowledgeBaseDemo = new KnowledgeBaseDemo();
});

// 键盘快捷键支持
document.addEventListener('keydown', (e) => {
    if (!window.knowledgeBaseDemo) return;
    
    switch(e.key) {
        case '1':
            window.knowledgeBaseDemo.startDemo1();
            break;
        case '2':
            window.knowledgeBaseDemo.startDemo2();
            break;
        case '3':
            window.knowledgeBaseDemo.startDemo3();
            break;
        case 'r':
        case 'R':
            window.knowledgeBaseDemo.resetDemo();
            break;
        case 'Escape':
            window.knowledgeBaseDemo.hidePoints();
            break;
    }
});

// 导出主要功能（如果需要在其他脚本中使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KnowledgeBaseDemo;
}
