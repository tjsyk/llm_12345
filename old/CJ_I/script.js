/**
 * @file script.js
 * @description 12345热线AI服务评价分析Demo的交互逻辑。
 */

document.addEventListener('DOMContentLoaded', () => {
    const callSceneSelect = document.getElementById('call-scene-select');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const totalTimeSpan = document.getElementById('total-time');
    const volumeControl = document.getElementById('volume-control');
    const playbackSpeedSelect = document.getElementById('playback-speed');
    const callDurationSpan = document.getElementById('call-duration');
    const callNumberSpan = document.getElementById('call-number');
    const callTimeSpan = document.getElementById('call-time');
    const issueCategorySpan = document.getElementById('issue-category');
    const transcriptContent = document.getElementById('transcript-content');
    const emotionCharts = document.getElementById('emotion-charts');
    const keywordCloudDisplay = document.getElementById('keyword-cloud-display');
    const qualityScoresDiv = document.getElementById('quality-scores');
    const suggestionsList = document.getElementById('suggestions-list');
    const reportContentDiv = document.getElementById('report-content');
    const exportReportBtn = document.getElementById('export-report-btn');
    const waveformBarContainer = document.querySelector('.waveform-bar-container');

    let scenes = [];
    let currentScene = null;
    let currentPlayTime = 0; // 模拟当前播放时间，单位秒
    let playInterval = null;
    let isPlaying = false;
    let currentPlaybackSpeed = 1;

    /**
     * @function fetchScenesData
     * @description 加载模拟的通话场景数据。
     * @returns {Promise<void>}
     */
    async function fetchScenesData() {
        try {
            const response = await fetch('data.json');
            scenes = await response.json();
            populateSceneSelector();
            if (scenes.length > 0) {
                loadScene(scenes[0].id);
            }
        } catch (error) {
            console.error('Error fetching scenes data:', error);
            alert('加载场景数据失败，请检查data.json文件。');
        }
    }

    /**
     * @function populateSceneSelector
     * @description 填充通话场景选择器。
     */
    function populateSceneSelector() {
        callSceneSelect.innerHTML = '';
        scenes.forEach(scene => {
            const option = document.createElement('option');
            option.value = scene.id;
            option.textContent = scene.name;
            callSceneSelect.appendChild(option);
        });
    }

    /**
     * @function loadScene
     * @description 根据场景ID加载并显示场景数据。
     * @param {string} sceneId - 场景的ID。
     */
    function loadScene(sceneId) {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
        isPlaying = false;
        playPauseBtn.textContent = '播放';
        currentPlayTime = 0;

        currentScene = scenes.find(s => s.id === sceneId);
        if (currentScene) {
            // 更新通话信息面板
            callDurationSpan.textContent = formatTime(currentScene.duration);
            callNumberSpan.textContent = '*******' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            callTimeSpan.textContent = currentScene.time;
            issueCategorySpan.textContent = currentScene.type;

            // 初始化进度条和时间显示
            progressBar.max = currentScene.duration;
            progressBar.value = 0;
            currentTimeSpan.textContent = formatTime(0);
            totalTimeSpan.textContent = formatTime(currentScene.duration);

            // 清空并初始化转录、分析结果区域
            transcriptContent.innerHTML = '<p>点击播放开始分析...</p>';
            emotionCharts.innerHTML = '';
            keywordCloudDisplay.innerHTML = '<p>等待分析结果...</p>';
            qualityScoresDiv.innerHTML = '';
            suggestionsList.innerHTML = '';
            reportContentDiv.innerHTML = '<p>点击"导出报告"生成完整报告。</p>';
            drawWaveform(currentScene.duration);
        }
    }

    /**
     * @function togglePlayPause
     * @description 播放/暂停控制。
     */
    function togglePlayPause() {
        if (!currentScene) return;

        if (isPlaying) {
            clearInterval(playInterval);
            playPauseBtn.textContent = '播放';
            isPlaying = false;
        } else {
            if (currentPlayTime >= currentScene.duration) {
                currentPlayTime = 0; // 从头开始播放
                transcriptContent.innerHTML = ''; // 清空转录内容
            }
            playPauseBtn.textContent = '暂停';
            isPlaying = true;
            playInterval = setInterval(updateDisplay, 1000 / currentPlaybackSpeed);
        }
    }

    /**
     * @function updateDisplay
     * @description 定时更新页面显示，模拟播放进度和分析结果。
     */
    function updateDisplay() {
        if (!currentScene) return;

        currentPlayTime += 1; // 模拟时间流逝
        if (currentPlayTime > currentScene.duration) {
            currentPlayTime = currentScene.duration;
            clearInterval(playInterval);
            playInterval = null;
            isPlaying = false;
            playPauseBtn.textContent = '重播';
            generateReport(); // 播放结束后生成报告
        }

        progressBar.value = currentPlayTime;
        currentTimeSpan.textContent = formatTime(currentPlayTime);

        // 实时转录
        currentScene.transcript.forEach(line => {
            const [minutes, seconds] = line.time.split(':').map(Number);
            const lineTimeInSeconds = minutes * 60 + seconds;
            if (currentPlayTime === lineTimeInSeconds && !transcriptContent.querySelector(`[data-time="${line.time}"]`)) {
                const p = document.createElement('p');
                p.dataset.time = line.time;
                p.innerHTML = `<span class="timestamp">[${line.time}]</span> <span class="speaker">${line.speaker}:</span> ${line.text}`;
                transcriptContent.appendChild(p);
                transcriptContent.scrollTop = transcriptContent.scrollHeight;
            }
        });

        // 模拟AI分析结果实时更新
        renderEmotionAnalysis(currentScene.analysis.emotion, currentPlayTime / currentScene.duration);
        renderKeywordCloud(currentScene.analysis.keywords);
        renderQualityScores(currentScene.analysis.quality);
        renderSuggestions(currentScene.analysis.suggestions);
    }

    /**
     * @function formatTime
     * @description 格式化时间显示。
     * @param {number} seconds - 秒数。
     * @returns {string} 格式化后的时间字符串 (mm:ss)。
     */
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * @function renderEmotionAnalysis
     * @description 渲染情感分析仪表盘。
     * @param {object} emotionData - 情感数据。
     * @param {number} progress - 播放进度 (0-1) 用于控制动画。
     */
    function renderEmotionAnalysis(emotionData, progress) {
        emotionCharts.innerHTML = '';
        for (const [emotion, value] of Object.entries(emotionData)) {
            const item = document.createElement('div');
            item.classList.add('emotion-item');
            const percentage = Math.round(value * 100);
            item.innerHTML = `
                <span class="label">${emotion}:</span>
                <div class="emotion-bar-wrapper">
                    <div class="emotion-bar" style="width: ${percentage * progress}%; background-color: ${getEmotionColor(emotion)};"></div>
                </div>
                <span class="percentage">${percentage}%</span>
            `;
            emotionCharts.appendChild(item);
        }
    }

    /**
     * @function getEmotionColor
     * @description 根据情感类型返回颜色。
     * @param {string} emotion - 情感类型。
     * @returns {string} 对应的颜色值。
     */
    function getEmotionColor(emotion) {
        switch (emotion) {
            case '愤怒': return '#f5222d';
            case '满意': return '#52c41a';
            case '焦虑': return '#faad14';
            case '理解': return '#1890ff';
            case '困惑': return '#ffc53d';
            case '期待': return '#722ed1';
            case '中性': return '#bfbfbf';
            case '积极': return '#2f54eb';
            default: return '#1890ff';
        }
    }

    /**
     * @function renderKeywordCloud
     * @description 渲染关键词云图。
     * @param {Array<object>} keywords - 关键词数据数组。
     */
    function renderKeywordCloud(keywords) {
        keywordCloudDisplay.innerHTML = '';
        keywords.forEach(kw => {
            const span = document.createElement('span');
            span.classList.add('keyword-tag', `size-${kw.size}`, `color-${kw.color}`);
            span.textContent = kw.word;
            keywordCloudDisplay.appendChild(span);
        });
    }

    /**
     * @function renderQualityScores
     * @description 渲染服务质量评分。
     * @param {object} qualityData - 质量评分数据。
     */
    function renderQualityScores(qualityData) {
        qualityScoresDiv.innerHTML = '';
        for (const [item, score] of Object.entries(qualityData)) {
            const div = document.createElement('div');
            div.classList.add('quality-item');
            const starsHtml = '⭐'.repeat(Math.floor(score)) + (score % 1 >= 0.5 ? ' half-star' : '');
            div.innerHTML = `
                <span>${item}:</span>
                <span class="score"><span class="stars">${starsHtml}</span> ${score}/5</span>
            `;
            qualityScoresDiv.appendChild(div);
        }
    }

    /**
     * @function renderSuggestions
     * @description 渲染改进建议列表。
     * @param {Array<string>} suggestions - 改进建议数组。
     */
    function renderSuggestions(suggestions) {
        suggestionsList.innerHTML = '';
        suggestions.forEach(sugg => {
            const li = document.createElement('li');
            li.textContent = sugg;
            suggestionsList.appendChild(li);
        });
    }

    /**
     * @function generateReport
     * @description 生成综合分析报告。
     */
    function generateReport() {
        if (currentScene && currentScene.analysis && currentScene.analysis.report) {
            const reportHtml = currentScene.analysis.report
                .replace(/\n/g, '<br/>') // 替换换行符
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // 替换粗体
            reportContentDiv.innerHTML = reportHtml;
        }
    }

    /**
     * @function drawWaveform
     * @description 模拟绘制音频波形图。
     * @param {number} duration - 音频总时长。
     */
    function drawWaveform(duration) {
        waveformBarContainer.innerHTML = '';
        const numberOfBars = 100; // 波形条的数量
        for (let i = 0; i < numberOfBars; i++) {
            const bar = document.createElement('div');
            bar.classList.add('waveform-bar');
            const randomHeight = Math.random() * 80 + 20; // 20% to 100% height
            bar.style.height = `${randomHeight}%`;
            bar.style.animationDelay = `${Math.random() * 0.5}s`; // 随机延迟，增加动态感
            waveformBarContainer.appendChild(bar);
        }
    }

    /**
     * @function exportReport
     * @description 导出报告功能（模拟）。
     */
    function exportReport() {
        if (currentScene && currentScene.analysis && currentScene.analysis.report) {
            const blob = new Blob([currentScene.analysis.report], { type: 'text/plain;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${currentScene.name}_分析报告.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            alert('报告已开始下载！');
        } else {
            alert('没有可导出的报告内容。');
        }
    }

    // 事件监听器
    callSceneSelect.addEventListener('change', (event) => loadScene(event.target.value));
    playPauseBtn.addEventListener('click', togglePlayPause);
    progressBar.addEventListener('input', (event) => {
        currentPlayTime = parseInt(event.target.value);
        currentTimeSpan.textContent = formatTime(currentPlayTime);
        // 如果正在播放，拖动进度条后重新开始计时器以调整速度
        if (isPlaying) {
            clearInterval(playInterval);
            playInterval = setInterval(updateDisplay, 1000 / currentPlaybackSpeed);
        }
    });
    volumeControl.addEventListener('input', (event) => {
        // 模拟音量控制，实际音频需要Web Audio API
        console.log('Volume:', event.target.value);
    });
    playbackSpeedSelect.addEventListener('change', (event) => {
        currentPlaybackSpeed = parseFloat(event.target.value);
        if (isPlaying) {
            clearInterval(playInterval);
            playInterval = setInterval(updateDisplay, 1000 / currentPlaybackSpeed);
        }
    });
    exportReportBtn.addEventListener('click', exportReport);

    // 初始化加载数据
    fetchScenesData();
});