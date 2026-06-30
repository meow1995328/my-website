// 个人网站脚本 v0.3.0
console.log('薛大侠的个人网站已加载！v0.3.0');

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成');
    
    // 子导航高亮效果
    initSubNavHighlight();
    
    // 平滑滚动效果
    initSmoothScroll();
    
    // 留言板表单处理
    initMessageForm();
    
    // 订阅表单处理
    initSubscribeForm();
    
    // 模块卡片动画
    initModuleCardsAnimation();
    
    // 链接项动画
    initLinkItemsAnimation();
});

/**
 * 子导航高亮效果
 * 当滚动到某个section时，对应的子导航链接高亮
 */
function initSubNavHighlight() {
    const subNavLinks = document.querySelectorAll('.sub-nav-link');
    
    if (subNavLinks.length === 0) return;
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 150; // 偏移量
        
        // 获取所有带有id的section
        const sections = document.querySelectorAll('h2[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.parentElement.offsetHeight;
            
            // 检查当前滚动位置是否在section范围内
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const targetId = section.getAttribute('id');
                
                // 更新子导航链接状态
                subNavLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${targetId}`) {
                        link.style.background = 'rgba(0, 120, 212, 0.3)';
                        link.style.color = '#ffffff';
                    } else {
                        link.style.background = '';
                        link.style.color = '';
                    }
                });
            }
        });
    });
}

/**
 * 平滑滚动效果
 * 点击锚点链接时平滑滚动到目标位置
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // 计算目标位置（考虑固定导航栏高度）
                const targetPosition = target.offsetTop - 100;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 留言板表单处理
 */
function initMessageForm() {
    const messageForm = document.querySelector('.message-form');
    
    if (!messageForm) return;
    
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = this.querySelector('input[name="name"]');
        const messageInput = this.querySelector('textarea[name="message"]');
        
        if (!nameInput || !messageInput) return;
        
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        
        if (name === '' || message === '') {
            alert('请填写姓名和留言内容');
            return;
        }
        
        // 模拟提交成功（实际项目中需要连接后端API）
        alert(`感谢 ${name} 的留言！\n您的留言已成功提交。`);
        
        // 清空表单
        nameInput.value = '';
        messageInput.value = '';
    });
}

/**
 * 订阅表单处理
 */
function initSubscribeForm() {
    const subscribeInputs = document.querySelectorAll('.subscribe-input');
    
    subscribeInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const email = this.value.trim();
                
                if (email === '' || !isValidEmail(email)) {
                    alert('请输入有效的邮箱地址');
                    return;
                }
                
                // 模拟订阅成功
                alert(`感谢订阅！\n订阅邮箱：${email}\n您将收到最新的内容更新通知。`);
                this.value = '';
            }
        });
    });
}

/**
 * 验证邮箱格式
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 模块卡片动画
 */
function initModuleCardsAnimation() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * 链接项动画
 */
function initLinkItemsAnimation() {
    const linkItems = document.querySelectorAll('.link-item');
    
    linkItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

/**
 * 工具函数：显示加载状态
 */
function showLoading(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
}

/**
 * 工具函数：隐藏加载状态
 */
function hideLoading(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = '';
}