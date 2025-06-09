// 动画控制器
class AnimationManager {
    constructor() {
        this.observers = [];
    }

    // 数字递增动画
    animateNumber(element, target, duration = 2000, suffix = '') {
        const start = 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (target - start) * easeOutQuart;
            
            if (target % 1 === 0) {
                element.textContent = Math.floor(current) + suffix;
            } else {
                element.textContent = current.toFixed(1) + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target + suffix;
            }
        };
        
        requestAnimationFrame(animate);
    }

    // 初始化数字动画
    initNumberAnimations() {
        const numberElements = document.querySelectorAll('.stat-number[data-target]');
        
        numberElements.forEach(element => {
            const target = parseFloat(element.dataset.target);
            const suffix = element.textContent.includes('%') ? '%' : 
                          element.textContent.includes('+') ? '' : '';
            
            // 延迟执行，创建错落效果
            setTimeout(() => {
                this.animateNumber(element, target, 2000, suffix);
            }, Math.random() * 500);
        });
    }

    // 卡片入场动画
    initCardAnimations() {
        const cards = document.querySelectorAll('.stat-card, .chart-container, .quality-stream');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // 脉冲动画
    pulseElement(element) {
        element.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }

    // 滑入动画
    slideInElement(element, direction = 'right') {
        const keyframes = direction === 'right' ? 
            [
                { opacity: 0, transform: 'translateX(30px)' },
                { opacity: 1, transform: 'translateX(0)' }
            ] :
            [
                { opacity: 0, transform: 'translateY(-30px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ];
            
        element.animate(keyframes, {
            duration: 500,
            easing: 'ease-out',
            fill: 'forwards'
        });
    }

    // 初始化滚动动画观察器
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // 观察需要动画的元素
        const animateElements = document.querySelectorAll(
            '.recommendation-item, .stage-card, .cause-item, .timeline-item'
        );
        
        animateElements.forEach(el => {
            observer.observe(el);
        });

        this.observers.push(observer);
    }

    // 清理观察器
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// 添加CSS动画类
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
