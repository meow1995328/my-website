// ============================================
// 个人网站脚本 v0.3.3
// ============================================
console.log('XueXue的个人网站已加载！v0.3.3');

// ========== 页面加载早期检查URL参数，设置动画类型 ==========
// 在DOMContentLoaded之前执行，确保View Transitions能正确应用
(function checkTransitionParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const transitionType = urlParams.get('transition');
    
    if (transitionType === 'dissolve') {
        document.documentElement.classList.add('fh-transition-dissolve');
        
        setTimeout(() => {
            document.documentElement.classList.remove('fh-transition-dissolve');
        }, 600);
    }
})();

// ========== 页面加载完成后执行 ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成');
    
    // 初始化页面切换动画
    initViewTransitions();
    
    // 初始化子导航高亮效果
    initSubNavHighlight();
    
    // 初始化平滑滚动效果
    initSmoothScroll();
    
    // 初始化留言板表单处理
    initMessageForm();
    
    // 初始化订阅表单处理
    initSubscribeForm();
    
    // 初始化模块卡片动画
    initModuleCardsAnimation();
    
    // 初始化链接项动画
    initLinkItemsAnimation();
    
    // 初始化左侧导航栏高亮
    initSideNav();
    
    // 初始化关于我页面卡片点击缩放动画
    initFhCardAnimation();
    
    // 初始化返回顶部按钮
    initBackToTop();
    
    // 初始化返回上一层页面按钮
    initBackToParent();
});

/**
 * ============================================
 * View Transitions 页面切换动画
 * 使用浏览器原生 @view-transition CSS 实现跨文档导航过渡
 * 电脑端：3D翻转效果
 * 移动端：滑动推拉效果
 * ============================================
 */
function initViewTransitions() {
    // CSS中已配置 @view-transition { navigation: auto; }
    // 浏览器会自动处理页面切换动画，无需JS拦截
}

/**
 * ============================================
 * 子导航高亮效果
 * 当滚动到某个section时，对应的子导航链接高亮
 * ============================================
 */
function initSubNavHighlight() {
    // 获取所有子导航链接
    const subNavLinks = document.querySelectorAll('.sub-nav-link');
    
    // 如果没有子导航链接，直接返回
    if (subNavLinks.length === 0) return;
    
    // 监听窗口滚动事件
    window.addEventListener('scroll', function() {
        // 当前滚动位置（加上150px偏移量，让高亮更及时）
        const scrollPosition = window.scrollY + 150;
        
        // 获取所有带有id属性的h2标题（作为section锚点）
        const sections = document.querySelectorAll('h2[id]');
        
        // 遍历每个section，判断当前滚动位置是否在该section范围内
        sections.forEach(section => {
            const sectionTop = section.offsetTop;         // section顶部位置
            const sectionHeight = section.parentElement.offsetHeight; // section高度
            
            // 检查滚动位置是否在当前section范围内
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const targetId = section.getAttribute('id'); // 获取section的id
                
                // 更新所有子导航链接的高亮状态
                subNavLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    // 如果链接指向当前section，则高亮
                    if (href === `#${targetId}`) {
                        link.style.background = 'rgba(0, 120, 212, 0.3)'; // 蓝色背景
                        link.style.color = '#ffffff';                      // 白色文字
                    } else {
                        // 否则恢复默认样式
                        link.style.background = '';
                        link.style.color = '';
                    }
                });
            }
        });
    });
}

/**
 * ============================================
 * 平滑滚动效果
 * 点击锚点链接时平滑滚动到目标位置，确保目标区域顶部对齐页面顶端
 * ============================================
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 50;
                const offset = 20;
                
                const rect = target.getBoundingClientRect();
                const targetPosition = window.scrollY + rect.top - headerHeight - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * ============================================
 * 留言板表单处理
 * ============================================
 */
function initMessageForm() {
    // 获取留言表单
    const messageForm = document.querySelector('.message-form');
    
    // 如果没有表单，直接返回
    if (!messageForm) return;
    
    // 添加表单提交事件监听
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单默认提交
        
        // 获取姓名和留言输入框
        const nameInput = this.querySelector('input[name="name"]');
        const messageInput = this.querySelector('textarea[name="message"]');
        
        // 验证输入框是否存在
        if (!nameInput || !messageInput) return;
        
        // 获取输入值（去除首尾空格）
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        
        // 验证输入是否为空
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
 * ============================================
 * 订阅表单处理
 * ============================================
 */
function initSubscribeForm() {
    // 获取所有订阅输入框
    const subscribeInputs = document.querySelectorAll('.subscribe-input');
    
    // 为每个输入框添加键盘事件监听
    subscribeInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            // 只处理回车键
            if (e.key === 'Enter') {
                e.preventDefault(); // 阻止默认行为
                
                const email = this.value.trim(); // 获取输入的邮箱（去除首尾空格）
                
                // 验证邮箱是否为空或格式不正确
                if (email === '' || !isValidEmail(email)) {
                    alert('请输入有效的邮箱地址');
                    return;
                }
                
                // 模拟订阅成功
                alert(`感谢订阅！\n订阅邮箱：${email}\n您将收到最新的内容更新通知。`);
                
                // 清空输入框
                this.value = '';
            }
        });
    });
}

/**
 * ============================================
 * 验证邮箱格式
 * 使用正则表达式验证邮箱格式是否正确
 * @param {string} email - 待验证的邮箱地址
 * @returns {boolean} - 验证结果：true表示有效，false表示无效
 * ============================================
 */
function isValidEmail(email) {
    // 邮箱正则表达式：用户名@域名.后缀
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * ============================================
 * 模块卡片动画
 * 鼠标悬停时卡片向上移动
 * ============================================
 */
function initModuleCardsAnimation() {
    // 获取所有模块卡片
    const moduleCards = document.querySelectorAll('.module-card');
    
    // 为每个卡片添加鼠标进入和离开事件
    moduleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // 鼠标进入：向上移动5px
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            // 鼠标离开：恢复原位
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * ============================================
 * 链接项动画
 * 鼠标悬停时链接项向右移动
 * ============================================
 */
function initLinkItemsAnimation() {
    // 获取所有链接项
    const linkItems = document.querySelectorAll('.link-item');
    
    // 为每个链接项添加鼠标进入和离开事件
    linkItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // 鼠标进入：向右移动5px
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            // 鼠标离开：恢复原位
            this.style.transform = 'translateX(0)';
        });
    });
}

/**
 * ============================================
 * 左侧导航栏滚动高亮
 * 当滚动到某个section时，对应的左侧导航链接高亮
 * 用于个人简历页面的左侧竖向导航
 * ============================================
 */
function initSideNav() {
    // 获取所有左侧导航链接
    const sideNavLinks = document.querySelectorAll('.side-nav-item');
    
    // 如果没有左侧导航链接，直接返回
    if (sideNavLinks.length === 0) return;
    
    // 监听窗口滚动事件
    window.addEventListener('scroll', function() {
        // 当前滚动位置（加上150px偏移量）
        const scrollPosition = window.scrollY + 150;
        
        // 获取所有带有id属性的时间轴区块
        const sections = document.querySelectorAll('.timeline-section[id]');
        
        // 当前所在的section id（默认为空）
        let currentSectionId = '';
        
        // 遍历每个section，判断当前滚动位置是否在该section范围内
        sections.forEach(section => {
            const sectionTop = section.offsetTop;         // section顶部位置
            const sectionHeight = section.offsetHeight;   // section高度
            
            // 检查滚动位置是否在当前section范围内
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id'); // 更新当前section id
            }
        });
        
        // 更新左侧导航链接的高亮状态
        sideNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            // 如果链接指向当前section，则添加active类
            if (href === `#${currentSectionId}`) {
                link.classList.add('active');
            } else {
                // 否则移除active类
                link.classList.remove('active');
            }
        });
    });
}

/**
 * ============================================
 * 工具函数：显示加载状态
 * 将元素设置为半透明并禁用交互
 * @param {HTMLElement} element - 要设置加载状态的元素
 * ============================================
 */
function showLoading(element) {
    element.style.opacity = '0.6';       // 半透明
    element.style.pointerEvents = 'none'; // 禁用鼠标事件
}

/**
 * ============================================
 * 工具函数：隐藏加载状态
 * 将元素恢复为正常状态
 * @param {HTMLElement} element - 要恢复的元素
 * ============================================
 */
function hideLoading(element) {
    element.style.opacity = '1';      // 完全不透明
    element.style.pointerEvents = ''; // 恢复鼠标事件
}

/**
 * ============================================
 * 关于我页面卡片点击缩放动画
 * 点击卡片时触发缩放效果，然后跳转页面
 * 使用 JS 控制动画，通过URL参数传递动画类型给目标页面
 * ============================================
 */
function initFhCardAnimation() {
    const fhCards = document.querySelectorAll('.fh-card');
    if (fhCards.length === 0) return;
    
    fhCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!href) return;
            
            const rect = this.getBoundingClientRect();
            
            const overlay = document.createElement('div');
            const computedStyle = getComputedStyle(this);
            overlay.style.cssText = `
                position: fixed;
                top: ${rect.top}px;
                left: ${rect.left}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                z-index: 9999;
                background: ${computedStyle.background};
                background-image: ${computedStyle.backgroundImage};
                border-radius: ${computedStyle.borderRadius};
                border: none;
                padding: ${computedStyle.padding};
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                box-sizing: border-box;
                pointer-events: none;
                overflow: hidden;
                will-change: transform, opacity;
                transform-origin: center center;
            `;
            
            overlay.innerHTML = this.innerHTML;
            document.body.appendChild(overlay);
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    overlay.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s cubic-bezier(0.4, 0, 1, 1)';
                    overlay.style.transform = 'scale(2)';
                    overlay.style.opacity = '0';
                });
            });
            
            const urlWithParam = href.includes('?') 
                ? href + '&transition=dissolve' 
                : href + '?transition=dissolve';
            
            if (document.startViewTransition) {
                document.documentElement.classList.add('fh-transition-dissolve');
                
                document.startViewTransition(() => {
                    window.location.href = urlWithParam;
                }).finished.then(() => {
                    document.documentElement.classList.remove('fh-transition-dissolve');
                }).catch(() => {
                    document.documentElement.classList.remove('fh-transition-dissolve');
                });
            } else {
                setTimeout(() => {
                    window.location.href = urlWithParam;
                }, 10);
            }
        });
    });
}

/**
 * ============================================
 * 返回顶部按钮功能
 * 滚动时显示/隐藏按钮，点击后平滑滚动到页面顶部
 * ============================================
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * ============================================
 * 返回上一层页面按钮功能
 * 点击后返回上一页
 * ============================================
 */
function initBackToParent() {
    const backToParentBtn = document.getElementById('backToParent');
    
    if (!backToParentBtn) return;
    
    backToParentBtn.addEventListener('click', function() {
        window.history.back();
    });
}
