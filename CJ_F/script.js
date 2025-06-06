document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.function-nav button');
    const mainDemoArea = document.querySelector('.main-demo-area');

    // 定义不同模块的内容生成函数
    const moduleContent = {
        '电话模拟': generatePhoneSimulationContent,
        '知识库管理': generateKnowledgeBaseContent,
        '文档处理': generateDocumentProcessingContent,
    };

    // 默认加载电话模拟模块
    mainDemoArea.innerHTML = moduleContent['电话模拟']();

    // 调用默认模块的初始化函数
    initPhoneSimulation();

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const moduleName = button.textContent;
            if (moduleContent[moduleName]) {
                mainDemoArea.innerHTML = moduleContent[moduleName]();
                // 可以在这里调用每个模块特有的初始化函数
                if (moduleName === '电话模拟') initPhoneSimulation();
                if (moduleName === '文档处理') initDocumentProcessing();
                if (moduleName === '知识库管理') initKnowledgeBase();
            } else {
                mainDemoArea.innerHTML = `<h2>${moduleName} 模块</h2><p>该模块内容待实现。</p>`;
            }
        });
    });

    // --- 电话模拟模块 --- //

    // 电话模拟模块内容生成函数
    function generatePhoneSimulationContent() {
        return `
            <h2>电话模拟模块</h2>
            <div class="phone-simulation-container">
                <div class="citizen-side">
                    <h3>市民端</h3>
                    <div class="voice-input-simulator">
                        <!-- 语音输入模拟器内容 -->
                        <p id="voice-transcript">等待开始通话...</p>
                    </div>
                    <div class="preset-questions">
                        <h4>预设问题</h4>
                        <ul>
                            <li><button class="preset-q-btn" data-question="我想咨询住房公积金提取流程" disabled>我想咨询住房公积金提取流程</button></li>
                            <li><button class="preset-q-btn" data-question="小区噪音扰民怎么投诉？" disabled>小区噪音扰民怎么投诉？</button></li>
                            <li><button class="preset-q-btn" data-question="新生儿户口登记需要什么材料？" disabled>新生儿户口登记需要什么材料？</button></li>
                            <li><button class="preset-q-btn" data-question="垃圾分类的具体要求是什么？" disabled>垃圾分类的具体要求是什么？</button></li>
                            <li><button class="preset-q-btn" data-question="如何申请残疾人证？" disabled>如何申请残疾人证？</button></li>
                        </ul>
                    </div>
                     <button id="start-call-btn">开始通话</button>
                </div>
                <div class="separator"></div>
                <div class="agent-side">
                    <h3>坐席端</h3>
                    <div class="call-info">
                        <!-- 通话信息 -->
                        <p>来电号码: 138****1234</p>
                        <p>通话状态: <span id="call-status">空闲</span></p>
                        <p>通话时长: <span id="call-duration">00:00</span></p>
                    </div>
                    <div class="intelligent-assist">
                        <h4>智能辅助面板</h4>
                        <div class="real-time-transcript">
                            <h5>实时语音识别结果</h5>
                            <p id="agent-transcript">等待通话开始...</p>
                        </div>
                        <div class="suggestion-area">
                            <h5>LLM 生成的回答建议</h5>
                            <p id="agent-suggestion">等待系统建议...</p>
                        </div>
                        <div class="knowledge-recommendation">
                            <h5>相关知识库推荐</h5>
                            <ul id="knowledge-list"><li>等待推荐...</li></ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 电话模拟模块初始化函数
    function initPhoneSimulation() {
        const presetButtons = document.querySelectorAll('.preset-q-btn');
        const startCallButton = document.getElementById('start-call-btn');
        const voiceTranscript = document.getElementById('voice-transcript');
        const agentTranscript = document.getElementById('agent-transcript');
        const agentSuggestion = document.getElementById('agent-suggestion');
        const knowledgeList = document.getElementById('knowledge-list');
        const callDuration = document.getElementById('call-duration');
        const callStatus = document.getElementById('call-status');

        let timer;
        let callActive = false;

        // 模拟数据 (简化)
        const mockKnowledge = {
            '我想咨询住房公积金提取流程': [
                { title: '公积金提取办理指南', url: '#' },
                { title: '线上办理公积金提取', url: '#' },
                { title: '公积金提取常见问题', url: '#' }
            ],
            '小区噪音扰民怎么投诉？': [
                { title: '噪音投诉渠道', url: '#' },
                { title: '环境噪声污染防治办法', url: '#' }
            ],
            '新生儿户口登记需要什么材料？': [
                { title: '户口登记办理须知', url: '#' },
                { title: '新生儿落户所需材料清单', url: '#' }
            ],
            '垃圾分类的具体要求是什么？': [
                { title: '生活垃圾分类指引', url: '#' },
                { title: '可回收物投放要求', url: '#' }
            ],
            '如何申请残疾人证？': [
                { title: '残疾人证办理流程', url: '#' },
                { title: '申请残疾人证所需材料', url: '#' }
            ]
        };

        const mockSuggestions = {
            '我想咨询住房公积金提取流程': '您可以指导市民访问市公积金管理中心官网查询详细流程，或引导其使用手机App办理。',
            '小区噪音扰民怎么投诉？': '请告知市民可以通过12345热线、环保部门热线或线上平台进行投诉。',
            '新生儿户口登记需要什么材料？': '请提示市民准备出生医学证明、父母双方户口本、身份证、结婚证等材料，并告知前往户籍所在地派出所办理。',
            '垃圾分类的具体要求是什么？': '请向市民解释基本分类类别（可回收物、有害垃圾、湿垃圾、干垃圾），并告知具体投放规则。',
            '如何申请残疾人证？': '请指导市民向户籍所在地社区或残联咨询，了解申请条件、所需材料和鉴定流程。',
        };

        // 启动通话
        startCallButton.addEventListener('click', () => {
            if (!callActive) {
                callActive = true;
                startCallButton.textContent = '结束通话';
                callStatus.textContent = '通话中';
                voiceTranscript.textContent = '请选择预设问题或模拟语音输入...';
                agentTranscript.textContent = '正在连接...';
                agentSuggestion.textContent = '...';
                knowledgeList.innerHTML = '<li>...</li>';

                // 启用预设问题按钮
                presetButtons.forEach(button => button.disabled = false);

                // 启动通话时长计时
                let seconds = 0;
                timer = setInterval(() => {
                    seconds++;
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = seconds % 60;
                    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
                    callDuration.textContent = formattedTime;
                }, 1000);
            } else {
                // 结束通话
                callActive = false;
                startCallButton.textContent = '开始通话';
                callStatus.textContent = '已结束';
                clearInterval(timer);
                 voiceTranscript.textContent = '通话已结束';
                agentTranscript.textContent = '通话已结束';
                agentSuggestion.textContent = '通话已结束';
                knowledgeList.innerHTML = '<li>通话已结束</li>';

                // 禁用预设问题按钮
                presetButtons.forEach(button => button.disabled = true);
            }
        });


        presetButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!callActive) return; // 只在通话中响应点击

                const question = button.getAttribute('data-question');
                console.log('Clicked question:', question);

                // 重置坐席端信息等待新问题处理
                agentTranscript.textContent = '正在识别...';
                agentSuggestion.textContent = '...';
                knowledgeList.innerHTML = '<li>...</li>';

                // 模拟市民端输入
                voiceTranscript.textContent = `市民: ${question}`;


                // 模拟坐席端智能辅助响应
                // 模拟语音识别延迟
                setTimeout(() => {
                    agentTranscript.textContent = `识别结果: ${question}`; // 假设识别成功

                    // 模拟LLM处理延迟
                    setTimeout(() => {
                        agentSuggestion.textContent = mockSuggestions[question] || '未找到相关建议。';

                        // 模拟知识库搜索延迟
                        setTimeout(() => {
                            const knowledgeItems = mockKnowledge[question];
                            if (knowledgeItems && knowledgeItems.length > 0) {
                                knowledgeList.innerHTML = knowledgeItems.map(item => `<li><a href="${item.url}" target="_blank">${item.title}</a></li>`).join('');
                            } else {
                                knowledgeList.innerHTML = '<li>未找到相关知识库条目。</li>';
                            }
                        }, 500); // 知识库搜索延迟 0.5 秒

                    }, 1000); // LLM处理延迟 1 秒

                }, 500); // 语音识别延迟 0.5 秒
            });
        });
    }

    // --- 知识库管理模块 (占位符) --- //
    function generateKnowledgeBaseContent() {
        return `
            <h2>知识库管理模块</h2>
            <div class="knowledge-base-container">
                <div class="kb-status-panel">
                    <h3>知识库状态监控</h3>
                    <p>总条目数: <span id="kb-total-items">加载中...</span></p>
                    <p>今日更新: <span id="kb-today-updates">加载中...</span></p>
                    <p>待更新: <span id="kb-pending-updates">加载中...</span></p>
                    <p>准确率: <span id="kb-accuracy">加载中...</span></p>
                    <button id="refresh-kb-status">刷新状态</button>
                </div>
                <!-- TODO: 添加知识库列表、搜索等更详细内容 -->
            </div>
        `;
    }

    // --- 文档处理模块 (占位符) --- //
    function generateDocumentProcessingContent() {
        return `
            <h2>文档处理模块</h2>
            <div class="document-processing-container">
                <div class="document-selection">
                    <h3>选择政策文档</h3>
                    <ul id="document-list">
                        <li><button class="doc-select-btn" data-doc="policy1.pdf">📄 《2024年住房公积金新政策》</button></li>
                        <li><button class="doc-select-btn" data-doc="policy2.pdf">📄 《垃圾分类管理办法（修订版）》</button></li>
                        <li><button class="doc-select-btn" data-doc="policy3.pdf">📄 《残疾人服务指南更新》</button></li>
                    </ul>
                     <button id="start-processing-btn" disabled>开始处理</button>
                </div>
                <div class="processing-status">
                    <h3>处理状态</h3>
                    <p id="processing-text">等待选择文档...</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="processing-progress" style="width: 0;"></div>
                    </div>
                </div>
                <div class="processing-results">
                    <h3>处理结果</h3>
                    <div class="extracted-info">
                        <h4>提取的关键信息</h4>
                        <p id="extracted-info-content">处理完成后显示。</p>
                    </div>
                    <div class="generated-qa">
                        <h4>自动生成的问答对</h4>
                        <ul id="generated-qa-list"><li>处理完成后显示。</li></ul>
                    </div>
                    <div class="kb-preview">
                        <h4>知识库条目预览</h4>
                        <ul id="kb-preview-list"><li>处理完成后显示。</li></ul>
                    </div>
                </div>
            </div>
        `;
    }

    // --- 知识库管理模块初始化函数 --- //
    function initKnowledgeBase() {
        const totalItemsSpan = document.getElementById('kb-total-items');
        const todayUpdatesSpan = document.getElementById('kb-today-updates');
        const pendingUpdatesSpan = document.getElementById('kb-pending-updates');
        const accuracySpan = document.getElementById('kb-accuracy');
        const refreshButton = document.getElementById('refresh-kb-status');

        // 模拟数据
        const mockStatus = {
            total: 1247,
            today: 23,
            pending: 5,
            accuracy: '98.5%'
        };

        function updateStatusDisplay() {
            totalItemsSpan.textContent = mockStatus.total;
            todayUpdatesSpan.textContent = mockStatus.today;
            pendingUpdatesSpan.textContent = mockStatus.pending;
            accuracySpan.textContent = mockStatus.accuracy;
        }

        // 初始显示
        updateStatusDisplay();

        // 刷新按钮点击事件
        refreshButton.addEventListener('click', () => {
            // 模拟数据更新（可选，这里只做简单刷新）
            // mockStatus.total += Math.floor(Math.random() * 5);
            // mockStatus.today = Math.floor(Math.random() * 10);
            // mockStatus.pending = Math.floor(Math.random() * 3);
            // mockStatus.accuracy = (98 + Math.random() * 1.5).toFixed(1) + '%';

            processingText.textContent = '正在刷新...'; // 暂时借用processingText显示状态

            setTimeout(() => {
                 updateStatusDisplay();
                 processingText.textContent = '状态已更新'; // 刷新完成提示
            }, 500); // 模拟刷新延迟

        });
         // 注意：这里的 processingText 需要在 initKnowledgeBase 中获取引用或使用更通用的状态区域
         // 为了简单演示，暂时先这样，后续可以优化
         const processingText = document.getElementById('processing-text'); // 获取引用

    }

    // --- 文档处理模块初始化函数 --- //
    function initDocumentProcessing() {
        const docSelectButtons = document.querySelectorAll('.doc-select-btn');
        const startProcessingButton = document.getElementById('start-processing-btn');
        const processingText = document.getElementById('processing-text');
        const processingProgress = document.getElementById('processing-progress');
        const extractedInfoContent = document.getElementById('extracted-info-content');
        const generatedQaList = document.getElementById('generated-qa-list');
        const kbPreviewList = document.getElementById('kb-preview-list');

        let selectedDoc = null;

        // 模拟数据
        const mockDocData = {
            'policy1.pdf': {
                extractedInfo: '主要内容：2024年住房公积金缴存基数调整、提取条件放宽、贷款额度提升等。',
                generatedQA: [
                    { q: '2024年公积金缴存基数如何调整？', a: '根据最新政策，缴存基数上限有所提高...' },
                    { q: '提取公积金的条件有哪些变化？', a: '新增了几种可提取的情形...' }
                ],
                kbPreview: [
                     { title: '2024住房公积金缴存提取新规', url: '#' },
                     { title: '公积金贷款额度计算方法', url: '#' }
                ]
            },
             'policy2.pdf': {
                extractedInfo: '主要内容：明确了湿垃圾、干垃圾、可回收物、有害垃圾的具体分类标准和投放指南。',
                generatedQA: [
                    { q: '湿垃圾包括哪些？', a: '湿垃圾主要是有机物，包括剩菜剩饭、瓜皮果核等...' },
                    { q: '废旧电池属于哪类垃圾？', a: '废旧电池属于有害垃圾，应投放到指定的有害垃圾收集容器。' }
                ],
                kbPreview: [
                     { title: '生活垃圾分类详细指引', url: '#' },
                     { title: '各类垃圾处理方法', url: '#' }
                ]
            },
             'policy3.pdf': {
                extractedInfo: '主要内容：更新了残疾类别鉴定标准、康复服务目录、补贴申领流程等信息。',
                generatedQA: [
                    { q: '如何申请新的残疾类别鉴定？', a: '需要提交申请并按流程进行专业鉴定...' },
                    { q: '残疾人可以享受哪些康复服务？', a: '新的服务目录包含了更多样化的康复项目...' }
                ],
                kbPreview: [
                     { title: '残疾人证申请与管理办法', url: '#' },
                     { title: '康复服务机构名录', url: '#' }
                ]
            }
            // 更多文档模拟数据...
        };

        docSelectButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 移除之前选中按钮的样式（如果需要）
                 docSelectButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');

                selectedDoc = button.getAttribute('data-doc');
                startProcessingButton.disabled = false;
                processingText.textContent = `已选择文档: ${button.textContent.replace('📄 ', '')}`;

                // 重置结果区域
                extractedInfoContent.textContent = '处理完成后显示。';
                generatedQaList.innerHTML = '<li>处理完成后显示。</li>';
                kbPreviewList.innerHTML = '<li>处理完成后显示。</li>';
                processingProgress.style.width = '0%';
            });
        });

        startProcessingButton.addEventListener('click', () => {
            if (!selectedDoc || startProcessingButton.disabled) return;

            startProcessingButton.disabled = true;
            processingText.textContent = '正在处理...';
            processingProgress.style.width = '0%';
            extractedInfoContent.textContent = '处理中...';
            generatedQaList.innerHTML = '<li>处理中...</li>';
            kbPreviewList.innerHTML = '<li>处理中...</li>';

            // 模拟处理过程
            let progress = 0;
            const processingInterval = setInterval(() => {
                progress += 10;
                processingProgress.style.width = `${progress}%`;
                if (progress >= 100) {
                    clearInterval(processingInterval);
                    processingText.textContent = '处理完成！';
                    displayProcessingResults(selectedDoc);
                    startProcessingButton.disabled = false;
                    selectedDoc = null; // 处理完成后取消选择文档
                    docSelectButtons.forEach(btn => btn.classList.remove('selected'));
                }
            }, 200); // 模拟处理速度
        });

        function displayProcessingResults(docKey) {
            const data = mockDocData[docKey];
            if (data) {
                extractedInfoContent.textContent = data.extractedInfo;

                if (data.generatedQA && data.generatedQA.length > 0) {
                    generatedQaList.innerHTML = data.generatedQA.map(item => `<li><strong>Q:</strong> ${item.q}<br/><strong>A:</strong> ${item.a}</li>`).join('');
                } else {
                    generatedQaList.innerHTML = '<li>未生成问答对。</li>';
                }

                 if (data.kbPreview && data.kbPreview.length > 0) {
                    kbPreviewList.innerHTML = data.kbPreview.map(item => `<li><a href="${item.url}" target="_blank">${item.title}</a></li>`).join('');
                } else {
                    kbPreviewList.innerHTML = '<li>未生成知识库条目预览。</li>';
                }

            } else {
                extractedInfoContent.textContent = '模拟数据未找到。';
                generatedQaList.innerHTML = '<li>模拟数据未找到。</li>';
                kbPreviewList.innerHTML = '<li>模拟数据未找到。</li>';
            }
        }
    }

}); 