// 随机数生成器应用
class RandomNumberGenerator {
    constructor() {
        this.history = this.loadHistory();
        this.isHistoryVisible = false;
        this.initializeElements();
        this.bindEvents();
        this.updateHistoryDisplay();
    }

    // 初始化DOM元素
    initializeElements() {
        this.numberDisplay = document.getElementById('randomNumber');
        this.generateBtn = document.getElementById('generateBtn');
        this.historyBtn = document.getElementById('historyBtn');
        this.historyPanel = document.getElementById('historyPanel');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistory');
        this.minValueInput = document.getElementById('minValue');
        this.maxValueInput = document.getElementById('maxValue');
        this.rangeInfo = document.getElementById('rangeInfo');
    }

    // 绑定事件监听器
    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generateRandomNumber());
        this.historyBtn.addEventListener('click', () => this.toggleHistory());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // 添加范围输入监听器
        this.minValueInput.addEventListener('input', () => this.validateAndUpdateRange());
        this.maxValueInput.addEventListener('input', () => this.validateAndUpdateRange());
        this.minValueInput.addEventListener('blur', () => this.validateAndUpdateRange());
        this.maxValueInput.addEventListener('blur', () => this.validateAndUpdateRange());

        // 添加键盘支持
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.generateRandomNumber();
            }
        });

        // 触摸优化
        this.generateBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.generateBtn.style.transform = 'translateY(-1px)';
        });

        this.generateBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.generateBtn.style.transform = '';
            this.generateRandomNumber();
        });
    }

    // 生成随机数
    generateRandomNumber() {
        // 验证范围
        this.validateAndUpdateRange();

        const min = parseInt(this.minValueInput.value) || 1;
        const max = parseInt(this.maxValueInput.value) || 1000;

        // 添加生成中的视觉反馈
        this.setGeneratingState();

        // 模拟生成过程的延迟，增加用户体验
        setTimeout(() => {
            const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            this.displayNumber(randomNum);
            this.addToHistory(randomNum);
            this.resetGeneratingState();
        }, 300);
    }

    // 设置生成中状态
    setGeneratingState() {
        this.generateBtn.disabled = true;
        this.generateBtn.style.opacity = '0.7';
        this.numberDisplay.textContent = '...';
        this.numberDisplay.classList.add('number-animate');

        // 添加按钮文字变化
        const btnText = this.generateBtn.querySelector('.btn-text');
        btnText.textContent = '生成中...';
    }

    // 重置生成状态
    resetGeneratingState() {
        this.generateBtn.disabled = false;
        this.generateBtn.style.opacity = '1';

        // 恢复按钮文字
        const btnText = this.generateBtn.querySelector('.btn-text');
        btnText.textContent = '生成随机数';
    }

    // 显示生成的数字
    displayNumber(number) {
        this.numberDisplay.textContent = number;
        this.numberDisplay.classList.remove('number-animate');

        // 强制重新触发动画
        setTimeout(() => {
            this.numberDisplay.classList.add('number-animate');
        }, 10);

        // 添加数字颜色变化效果
        this.animateNumberColor(number);
    }

    // 数字颜色动画
    animateNumberColor(number) {
        const colors = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
        ];

        const colorIndex = number % colors.length;
        this.numberDisplay.style.background = colors[colorIndex];
        this.numberDisplay.style.webkitBackgroundClip = 'text';
        this.numberDisplay.style.webkitTextFillColor = 'transparent';
        this.numberDisplay.style.backgroundClip = 'text';
    }

    // 添加到历史记录
    addToHistory(number) {
        const timestamp = new Date();
        const historyItem = {
            number: number,
            time: timestamp.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            date: timestamp.toLocaleDateString('zh-CN')
        };

        this.history.unshift(historyItem);

        // 限制历史记录数量（最多保存50条）
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }

        this.saveHistory();
        this.updateHistoryDisplay();
        this.updateHistoryButtonText();
    }

    // 切换历史记录显示
    toggleHistory() {
        this.isHistoryVisible = !this.isHistoryVisible;

        if (this.isHistoryVisible) {
            this.historyPanel.classList.add('show');
            this.historyBtn.querySelector('.btn-text').textContent = '隐藏历史';
        } else {
            this.historyPanel.classList.remove('show');
            this.historyBtn.querySelector('.btn-text').textContent = '查看历史';
        }
    }

    // 更新历史记录显示
    updateHistoryDisplay() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<div style="text-align: center; color: #a0aec0; padding: 20px; font-size: 14px;">暂无生成记录</div>';
            return;
        }

        this.historyList.innerHTML = this.history.map((item, index) => `
            <div class="history-item fade-in" style="animation-delay: ${index * 0.05}s">
                <div class="history-number">${item.number}</div>
                <div class="history-time">${item.time}</div>
            </div>
        `).join('');
    }

    // 更新历史按钮文字
    updateHistoryButtonText() {
        const count = this.history.length;
        if (!this.isHistoryVisible) {
            this.historyBtn.querySelector('.btn-text').textContent = count > 0 ? `查看历史 (${count})` : '查看历史';
        }
    }

    // 清除历史记录
    clearHistory() {
        if (this.history.length === 0) return;

        if (confirm('确定要清除所有历史记录吗？')) {
            this.history = [];
            this.saveHistory();
            this.updateHistoryDisplay();
            this.updateHistoryButtonText();

            // 添加清除成功的视觉反馈
            this.clearHistoryBtn.textContent = '已清除';
            setTimeout(() => {
                this.clearHistoryBtn.textContent = '清除';
            }, 1000);
        }
    }

    // 保存历史记录到本地存储
    saveHistory() {
        try {
            localStorage.setItem('randomNumberHistory', JSON.stringify(this.history));
        } catch (e) {
            console.warn('无法保存历史记录到本地存储');
        }
    }

    // 从本地存储加载历史记录
    loadHistory() {
        try {
            const stored = localStorage.getItem('randomNumberHistory');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.warn('无法从本地存储加载历史记录');
            return [];
        }
    }

    // 验证并更新范围
    validateAndUpdateRange() {
        let min = parseInt(this.minValueInput.value);
        let max = parseInt(this.maxValueInput.value);

        // 设置默认值
        if (isNaN(min) || min < 0) {
            min = 1;
            this.minValueInput.value = 1;
        }
        if (isNaN(max) || max < 1) {
            max = 1000;
            this.maxValueInput.value = 1000;
        }

        // 确保最小值不大于最大值
        if (min > max) {
            if (this.minValueInput === document.activeElement) {
                // 如果正在编辑最小值，调整最大值
                max = min + 1;
                this.maxValueInput.value = max;
            } else {
                // 如果正在编辑最大值，调整最小值
                min = max - 1;
                this.minValueInput.value = min;
            }
        }

        // 更新范围显示
        this.rangeInfo.textContent = `${min} - ${max}`;

        // 添加输入验证的视觉反馈
        this.addValidationFeedback();
    }

    // 添加验证反馈
    addValidationFeedback() {
        const min = parseInt(this.minValueInput.value);
        const max = parseInt(this.maxValueInput.value);

        // 重置样式
        this.minValueInput.style.borderColor = '';
        this.maxValueInput.style.borderColor = '';

        // 如果范围有效，添加成功样式
        if (min < max && !isNaN(min) && !isNaN(max)) {
            this.minValueInput.style.borderColor = '#48bb78';
            this.maxValueInput.style.borderColor = '#48bb78';

            setTimeout(() => {
                this.minValueInput.style.borderColor = '';
                this.maxValueInput.style.borderColor = '';
            }, 1500);
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const app = new RandomNumberGenerator();

    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // 添加离线支持提示
    if ('serviceWorker' in navigator) {
        console.log('支持离线使用');
    }
});

// 防止页面缩放（移动端优化）
document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});

document.addEventListener('gesturechange', (e) => {
    e.preventDefault();
});

document.addEventListener('gestureend', (e) => {
    e.preventDefault();
});

// 添加触觉反馈支持（如果设备支持）
function vibrate(duration = 50) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}