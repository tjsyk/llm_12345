document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.function-nav button');
    const mainDemoArea = document.querySelector('.main-demo-area');

    // 定义不同模块的内容生成函数
    const moduleContent = {
        '文档处理': generateDocumentProcessingContent,
    };

    // 默认加载文档处理模块
    mainDemoArea.innerHTML = moduleContent['文档处理']();

    // 调用默认模块的初始化函数
    initDocumentProcessing();

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const moduleName = button.textContent;
            if (moduleContent[moduleName]) {
                mainDemoArea.innerHTML = moduleContent[moduleName]();
                // 可以在这里调用每个模块特有的初始化函数
                if (moduleName === '文档处理') initDocumentProcessing();
            } else {
                mainDemoArea.innerHTML = `<h2>${moduleName} 模块</h2><p>该模块内容待实现。</p>`;
            }
        });
    });

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