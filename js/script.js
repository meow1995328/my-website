// ============================================
// 个人网站脚本 v0.3.5
// ============================================
console.log('XueXue的个人网站已加载！v0.3.5');

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
    
    // 初始化家庭生活弹窗
    initFamilyModal();
    
    // 初始化电影详情弹窗
    initMovieModal();
    
    // 初始化兴趣特长弹窗
    initInterestModal();
    
    // 初始化项目分类筛选
    initProjectFilters();
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
                
                smoothScrollTo(targetPosition, 400);
                
                updateSideNavHighlight(targetId.substring(1));
            }
        });
    });
}

function smoothScrollTo(targetPosition, duration = 400) {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();
    
    function scrollStep(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        window.scrollTo({
            top: startPosition + distance * easeProgress,
            behavior: 'instant'
        });
        
        if (progress < 1) {
            requestAnimationFrame(scrollStep);
        }
    }
    
    requestAnimationFrame(scrollStep);
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
function updateSideNavHighlight(sectionId) {
    const sideNavLinks = document.querySelectorAll('.side-nav-item');
    sideNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${sectionId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initSideNav() {
    const sideNavLinks = document.querySelectorAll('.side-nav-item');
    if (sideNavLinks.length === 0) return;
    
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 50;
    const triggerOffset = 200;
    
    function updateHighlight() {
        const sections = document.querySelectorAll('.timeline-section[id], .hero-card[id], .container[id]');
        let currentSectionId = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            
            const triggerLine = headerHeight + triggerOffset;
            
            if (sectionTop < triggerLine && sectionBottom > triggerLine) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        updateSideNavHighlight(currentSectionId);
    }
    
    window.addEventListener('scroll', updateHighlight);
    updateHighlight();
}

/**
 * ============================================
 * 项目分类筛选功能
 * 支持多选筛选，点击标签按钮切换分类显示
 * ============================================
 */
function initProjectFilters() {
    try {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectItems = document.querySelectorAll('.project-item');
        
        if (!filterButtons.length || !projectItems.length) {
            console.log('项目筛选元素未找到');
            return;
        }
        
        console.log('项目筛选初始化成功，找到', filterButtons.length, '个按钮，', projectItems.length, '个项目');
        
        let activeFilters = ['all'];
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                if (filter === 'all') {
                    activeFilters = ['all'];
                } else {
                    activeFilters = activeFilters.filter(f => f !== 'all');
                    const idx = activeFilters.indexOf(filter);
                    if (idx > -1) {
                        activeFilters.splice(idx, 1);
                    } else {
                        activeFilters.push(filter);
                    }
                    
                    if (!activeFilters.length) {
                        activeFilters = ['all'];
                    }
                }
                
                filterButtons.forEach(b => {
                    if (activeFilters.includes(b.getAttribute('data-filter'))) {
                        b.classList.add('active');
                    } else {
                        b.classList.remove('active');
                    }
                });
                
                projectItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (activeFilters.includes('all') || activeFilters.includes(category)) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    } catch (e) {
        console.error('项目筛选初始化失败:', e);
    }
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
        smoothScrollTo(0, 400);
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

// ============================================
// 家庭生活弹窗交互逻辑 (v0.3.5)
// ============================================

const familyData = {
    'me': {
        title: '👨‍💻 薛大侠',
        subtitle: '网站作者 · 热爱生活与技术',
        birth: '🐣 出生于199X年',
        status: '💪 现役',
        image: 'images/family-me.jpg',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20a%20young%20Chinese%20man%20developer%20modern%20style%20confident%20smile&image_size=landscape_16_9',
        story: '我就是这个网站的作者，大家叫我薛大侠。我热爱生活，热爱技术，喜欢用代码创造美好的事物。工作之余，我喜欢打篮球、看电影、养宠物，还喜欢折腾各种技术项目。这个网站是我的个人小天地，记录着我的成长历程和生活点滴。',
        memories: [
            '小时候梦想成为科学家',
            '大学开始接触编程',
            '第一份工作在银行',
            '爱上了前端开发',
            '决定打造这个个人网站'
        ]
    },
    'mom': {
        title: '🥰 妈妈',
        subtitle: '亲切热情的家庭主妇',
        birth: '出生于196X年',
        status: '❤️ 健在',
        image: 'images/family-mom.jpg',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=warm%20portrait%20of%20a%20kind%20middle-aged%20Chinese%20woman%20with%20gentle%20smile%20soft%20lighting%20home%20setting&image_size=landscape_16_9',
        story: '妈妈是我们家的灵魂人物，她用无尽的爱和关怀守护着整个家庭。从我记事起，每天清晨她都会准备好热腾腾的早餐，晚上无论多晚都会等我回家。她的拿手好菜是红烧肉和糖醋排骨，每次回家都能吃到最爱的味道。妈妈性格温柔，但在关键时刻总是很坚强，她教会了我什么是真正的爱和责任。',
        memories: [
            '小时候每天早上都会给我梳辫子',
            '生病时整夜守在床边照顾',
            '总是把最好的留给家人',
            '教会我做饭和家务',
            '支持我追求自己的梦想'
        ]
    },
    'dad': {
        title: '👨‍💼 爸爸',
        subtitle: '勤劳朴实的劳动工人',
        birth: '出生于196X年',
        status: '❤️ 健在',
        image: 'images/family-dad.png',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20kind%20middle-aged%20Chinese%20man%20wearing%20glasses%20professional%20business%20attire%20warm%20smile&image_size=landscape_16_9',
        story: '爸爸是一名资深工程师，一辈子兢兢业业工作，用双手撑起了这个家。他不善言辞，但总是用行动表达爱。小时候家里条件不好，但他从不让我受委屈，省吃俭用供我读书。爸爸教会了我坚韧和责任感，他常说："做任何事都要认真，要么不做，要么做好。"这句话一直激励着我。',
        memories: [
            '小时候骑在爸爸肩上看烟花',
            '辅导我做数学题到深夜',
            '总是默默承担家里的重担',
            '教我骑自行车和游泳',
            '支持我选择自己的人生道路'
        ]
    },
    'hamster-lalada': {
        title: '🐹 小拉达',
        subtitle: '仓鼠 · 已去吱星',
        birth: '🐣 出生于2023年',
        status: '💔 2024年去世',
        image: 'images/pet-lalada.jpg',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20syrian%20hamster%20golden%20color%20fluffy%20sitting%20in%20a%20hamster%20house%20soft%20lighting&image_size=landscape_16_9',
        story: '小拉达是我的第一只宠物，也是最难忘的一只。它是一只金黄色的金丝熊，圆滚滚的像个小毛球。刚到家时它很胆小，总是躲在角落里，但慢慢熟悉后变得非常亲人。每天晚上它都会在跑轮上跑个不停，那声音就像是家里的闹钟。虽然它只陪伴了我两年，但那些美好的回忆永远不会忘记。',
        memories: [
            '第一次带回家时只有手掌大小',
            '喜欢把食物塞到腮帮子藏起来',
            '会站起来用爪子扒笼子要零食',
            '冬天喜欢钻到木屑里睡觉',
            '跑轮跑太快会自己翻车'
        ]
    },
    'hamster-maodou': {
        title: '🐹 毛豆',
        subtitle: '仓鼠 · 已去吱星',
        birth: '🐣 出生于2020年',
        status: '💔 2022年去世',
        image: 'images/pet-maodou.jpg',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20syrian%20hamster%20light%20brown%20color%20eating%20sunflower%20seed%20adorable%20soft%20lighting&image_size=landscape_16_9',
        story: '毛豆是小拉达去世后我养的第二只仓鼠，它的毛色是浅棕色的，像一颗毛茸茸的毛豆。毛豆性格活泼好动，和小拉达完全不同，它总是充满精力，喜欢探索新事物。它最喜欢吃葵花籽，每次听到开袋子的声音就会兴奋地跑过来。虽然它也离开了，但它给我的生活带来了很多欢乐。',
        memories: [
            '刚到家就敢从我手上吃东西',
            '喜欢在笼子里搭窝',
            '会把木屑推得到处都是',
            '睡觉时会把身体卷成一个球',
            '每次放风都会到处乱跑'
        ]
    },
    'cat-caidou': {
        title: '🐱 彩豆',
        subtitle: '猫咪 · 现役',
        birth: '🐣 出生于2025年',
        status: '❤️ 健康活泼',
        image: 'images/pet-caidou.jpg',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20calico%20cat%20tri-color%20fluffy%20kitten%20curled%20up%20relaxing%20warm%20home%20setting&image_size=landscape_16_9',
        story: '彩豆是我现在的宠物，一只虎斑串串猫咪。它是2025年我们在延庆永宁古城地摊上花100元买的，刚到家时只有两个月大，小小的一只特别可爱。现在它已经长成了一只漂亮的大猫咪，性格傲娇又粘人。它最喜欢躺在窗台上晒太阳，或者跳到我身上求抚摸。彩豆是家里的小少爷，全家人都很宠爱它，它给我们的生活带来了无尽的欢乐。',
        memories: [
            '刚到家时躲在沙发底下不敢出来',
            '喜欢追着激光笔跑',
            '会用头蹭我的手求抚摸',
            '每天早上准时叫我起床',
            '睡觉喜欢四脚朝天露出肚子'
        ]
    }
};

function initFamilyModal() {
    const cards = document.querySelectorAll('.family-card');
    const overlay = document.getElementById('familyModalOverlay');
    const closeBtn = document.getElementById('familyModalClose');
    
    if (!cards.length || !overlay || !closeBtn) return;
    
    const modal = document.getElementById('familyModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalBirth = document.getElementById('modalBirth');
    const modalStatus = document.getElementById('modalStatus');
    const modalStory = document.getElementById('modalStory');
    const modalMemories = document.getElementById('modalMemories');

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const memberId = this.getAttribute('data-member');
            const data = familyData[memberId];
            
            if (!data) return;

            modalImg.src = data.image;
            modalImg.onerror = function() {
                this.src = data.fallbackImage;
            };
            modalTitle.textContent = data.title;
            modalSubtitle.textContent = data.subtitle;
            modalBirth.textContent = data.birth;
            modalStatus.textContent = data.status;
            modalStory.textContent = data.story;
            
            modalMemories.innerHTML = '';
            data.memories.forEach(memory => {
                const li = document.createElement('li');
                li.textContent = memory;
                modalMemories.appendChild(li);
            });

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });
}

// ============================================
// 电影详情弹窗交互逻辑 (v0.3.5)
// ============================================

const movieData = {
    'interstellar': {
        title: '🎬 当幸福来敲门',
        subtitle: 'The Pursuit of Happyness',
        image: 'images/movie-the pursuit of happyness2.jpg',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=movie%20poster%20the%20pursuit%20of%20happyness%20inspirational%20drama%20vertical%20professional&image_size=portrait_2_3',
        meta: ['🎥 2006', '🎬导演：加布里埃莱·穆奇诺', '✍️编剧：斯蒂夫·康拉德','🎭主演：威尔·史密斯', '📍地区：美国', '🗣️语言：英语','📁类型：剧情/家庭/传记', '⭐评分：豆瓣9.4 / 个人7'],
        summary: '影片改编自真实故事，讲述了一位父亲在经历事业失败、婚姻破裂后，依然不放弃希望，带着儿子在逆境中拼搏奋斗，最终获得成功的感人故事。克里斯·加德纳用自己的坚持和努力，诠释了什么是真正的父爱和梦想。',
        thoughts: '这部电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试电影让我重新思考了时间、爱与生命的意义。诺兰用科学的严谨和艺术的浪漫，编织了一个关于父女情深的宇宙级故事。"爱是唯一能够穿越时空维度的东西"，这句话至今仍让我动容。电影中的每一个细节都充满了匠心，从黑洞的视觉呈现到时间膨胀的科学设定，都展现了导演对细节的极致追求。最打动我的是父女之间那份跨越时空的情感联结，无论身处何方，爱总能找到回家的路。测试'
    },
    'parasite': {
        title: '🎬 寄生虫',
        subtitle: 'Parasite',
        image: 'images/movie-parasite.jpg',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=parasite%20movie%20poster%20dark%20thriller%20social%20commentary%20korean%20cinema%20vertical&image_size=portrait_2_3',
        meta: ['🎥 2019', '🎬 奉俊昊', '📍 韩国', '📁 剧情/惊悚/黑色幽默', '⭐ 豆瓣9.0 / 个人8'],
        summary: '一个贫穷的家庭通过精心策划，逐步渗透到富裕家庭的生活中，两个家庭的命运由此交织在一起。随着剧情的发展，一场意外让原本平静的伪装逐渐崩塌，揭示了阶层差异背后的残酷现实。',
        thoughts: '奉俊昊用黑色幽默解构了阶级差异这个沉重的话题。电影前半段让你笑，后半段让你惊，最后让你深思。那个雨夜的蒙太奇镜头，将贫富差距具象化到了令人窒息的程度。地下室的设计堪称神来之笔，它不仅仅是一个物理空间，更是社会底层的隐喻。电影没有给出答案，却留下了无尽的思考——我们真的能摆脱自己的出身吗？'
    },
    'soul': {
        title: '🎬 心灵奇旅',
        subtitle: 'Soul',
        image: 'images/movie-spirited.jpg',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=soul%20disney%20pixar%20movie%20poster%20jazz%20music%20spiritual%20inspirational%20vertical&image_size=portrait_2_3',
        meta: ['🎥 2020', '🎬 彼特·道格特', '📍 美国', '📁 动画/奇幻/音乐', '⭐ 豆瓣8.7 / 个人9'],
        summary: '梦想成为爵士钢琴家的乔伊意外来到灵魂世界，在寻找重返地球之路的过程中，他遇到了一个渴望体验生活的灵魂22。两人结伴同行，在这段旅程中重新审视了生命的意义和人生的价值。',
        thoughts: '这是一部温暖到骨子里的电影。它告诉我们，生命的火花不在于宏大的梦想，而在于那些平凡而美好的瞬间——一片飘落的树叶、一口美味的披萨、一次与陌生人的微笑。乔伊的故事让我反思：我们常常为了所谓的"目标"而忽略了身边的美好，却忘记了生活本身就是目的。电影的音乐也非常出色，爵士乐的灵动与灵魂世界的奇幻完美融合，每一首曲子都触动人心。'
    }
};

function initMovieModal() {
    const cards = document.querySelectorAll('.movie-card-item');
    const overlay = document.getElementById('movieModalOverlay');
    const closeBtn = document.getElementById('movieModalClose');
    
    if (!cards.length || !overlay || !closeBtn) return;
    
    const modal = document.getElementById('movieModal');
    const modalImg = document.getElementById('movieModalImg');
    const modalTitle = document.getElementById('movieModalTitle');
    const modalMeta = document.getElementById('movieModalMeta');
    const modalSummary = document.getElementById('movieModalSummary');
    const modalThoughts = document.getElementById('movieModalThoughts');

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const movieId = this.getAttribute('data-movie');
            const data = movieData[movieId];
            
            if (!data) return;

            // 设置海报
            modalImg.src = data.image;
            modalImg.onerror = function() {
                this.src = data.fallbackImage;
            };
            
            // 设置标题
            modalTitle.innerHTML = `${data.title} <span class="movie-modal-subtitle">${data.subtitle}</span>`;
            
            // 设置元信息
            modalMeta.innerHTML = data.meta.map(item => `<span>${item}</span>`).join('');
            
            // 设置内容
            modalSummary.textContent = data.summary;
            modalThoughts.textContent = data.thoughts;

            // 显示弹窗
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });
}

// ============================================
// 兴趣特长弹窗交互逻辑 (v0.3.8)
// ============================================

const interestData = {
    'music': {
        title: '🎵 口琴',
        category: '音乐',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=harmonica%20music%20instrument%20artistic%20dark%20background&image_size=portrait_4_3',
        experience: '从小学习口琴，喜欢吹奏各种流行歌曲和经典曲目。口琴小巧便携，随时随地都能演奏，是我生活中不可或缺的伙伴。',
        honors: ['校音乐节口琴独奏三等奖', '自学掌握多种吹奏技巧', '能演奏50+首曲目'],
        thoughts: '口琴是一种很有魅力的乐器，它的音色独特而富有感染力。当我吹奏时，所有的烦恼都会随着音符飘散。音乐是最好的治愈剂，而口琴就是我的治愈神器。'
    },
    'sports-pingpong': {
        title: '🏓 乒乓球',
        category: '运动',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ping%20pong%20table%20tennis%20sports%20dynamic%20dark%20background&image_size=portrait_4_3',
        experience: '从小喜欢打乒乓球，小学开始参加校队训练，一直坚持到大学。乒乓球不仅锻炼了我的反应能力，也让我认识了很多志同道合的朋友。',
        honors: ['校运会乒乓球单打亚军', '班级联赛冠军', '参加市级比赛'],
        thoughts: '乒乓球是中国的国球，也是我最喜欢的运动。在球桌上，每一次挥拍都是一种享受。乒乓球教会我专注和坚持，只有不断练习才能进步。'
    },
    'sports-rope': {
        title: '🪢 跳绳',
        category: '运动',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=jumping%20rope%20fitness%20exercise%20dynamic%20dark%20background&image_size=portrait_4_3',
        experience: '从小学开始练习跳绳，曾经达到每分钟200+的成绩。跳绳是一项简单而有效的运动，不需要场地，随时可以开始。',
        honors: ['校运会跳绳比赛冠军', '一分钟跳绳200+', '学会多种花式跳法'],
        thoughts: '跳绳看似简单，实则需要很好的协调性和耐力。每次跳绳都是一次自我挑战，当我突破自己的记录时，那种成就感是无法形容的。'
    },
    'sports-soccer': {
        title: '⚽ 足球',
        category: '运动',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=soccer%20football%20sports%20dynamic%20dark%20background&image_size=portrait_4_3',
        experience: '热爱足球运动，喜欢踢前锋位置。从中学开始参加校足球队，享受在绿茵场上奔跑的感觉。',
        honors: ['校足球联赛最佳射手', '带领班级获得亚军', '参加业余足球联赛'],
        thoughts: '足球是一项团队运动，它教会我合作和拼搏。在球场上，每个人都有自己的角色，只有团结一心才能赢得比赛。足球让我感受到了团队的力量和胜利的喜悦。'
    },
    'performance-host': {
        title: '🎤 主持人',
        category: '表演',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=host%20emcee%20presentation%20stage%20professional%20dark%20background&image_size=portrait_4_3',
        experience: '大学期间担任校学生会主持人，主持过多场大型活动和晚会。从紧张到从容，逐渐爱上了站在舞台上的感觉。',
        honors: ['校级优秀主持人', '主持过10+场大型活动', '获得演讲比赛三等奖'],
        thoughts: '主持是一种挑战，也是一种享受。当我站在舞台中央，面对台下数百观众时，那种紧张和兴奋交织的感觉让人着迷。主持让我变得更加自信和善于表达。'
    },
    'performance-drama': {
        title: '🎭 话剧表演',
        category: '表演',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=theater%20drama%20acting%20stage%20performance%20dark%20background&image_size=portrait_4_3',
        experience: '大学加入话剧社，参演过多部话剧作品。从配角到主角，逐渐体会到表演的魅力和乐趣。',
        honors: ['话剧节最佳男配角提名', '参演3部大型话剧', '担任话剧社副社长'],
        thoughts: '表演是一种艺术，也是一种自我探索。当我扮演不同角色时，我能体验到不同的人生，理解不同的情感。话剧让我更加细腻地感受生活，也让我变得更加开朗和自信。'
    },
    'intellect-cube': {
        title: '🧊 魔方',
        category: '智力',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=rubiks%20cube%20puzzle%20colorful%20brain%20dark%20background&image_size=portrait_4_3',
        experience: '初中开始接触魔方，从入门到速拧，一直保持着浓厚的兴趣。魔方不仅锻炼了我的空间思维能力，也培养了我的耐心和专注力。',
        honors: ['三阶魔方速拧30秒以内', '学会多种高阶魔方', '教会身边朋友玩魔方'],
        thoughts: '魔方是一个神奇的玩具，它看似简单，却蕴含着无穷的变化。当我成功还原一个打乱的魔方时，那种满足感是无法形容的。魔方教会我，任何复杂的问题都可以分解成简单的步骤来解决。'
    },
    'intellect-typing': {
        title: '⌨️ 五笔打字',
        category: '智力',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=keyboard%20typing%20fast%20technology%20dark%20background&image_size=portrait_4_3',
        experience: '大学期间学习五笔打字，经过刻苦练习，达到每分钟120+字的速度。五笔打字不仅提高了我的工作效率，也让我对汉字有了更深的理解。',
        honors: ['五笔打字每分钟120+字', '参加打字比赛获得第三名', '教会多人学习五笔'],
        thoughts: '五笔打字是一项实用的技能，它让我在工作和学习中事半功倍。打字的过程也是一种享受，当手指在键盘上飞舞时，感觉自己像在弹奏一首美妙的曲子。'
    },
    'intellect-maze': {
        title: '🏰 画迷宫',
        category: '智力',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=maze%20puzzle%20art%20drawing%20creative%20dark%20background&image_size=portrait_4_3',
        experience: '从小喜欢画迷宫，从简单到复杂，乐此不疲。画迷宫不仅锻炼了我的空间思维能力，也让我体验到了创造的乐趣。',
        honors: ['创作50+个迷宫作品', '设计过大型迷宫游戏', '作品被朋友收藏'],
        thoughts: '画迷宫是一种创造性的活动，每一个迷宫都是一个独特的世界。当我设计一个迷宫时，我不仅是创造者，也是第一个探险者。迷宫教会我思考和规划，也让我感受到创造的无限可能。'
    },
    'science-nature': {
        title: '🔬 自然科学',
        category: '科学',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=natural%20science%20biology%20microscope%20knowledge%20dark%20background&image_size=portrait_4_3',
        experience: '从小对自然科学充满好奇，喜欢观察动植物，阅读科普书籍。自然科学让我了解了世界的奥秘，也培养了我的探索精神。',
        honors: ['参加科学竞赛获得优秀奖', '阅读200+本科普书籍', '制作过多个科学实验'],
        thoughts: '自然科学是人类认识世界的窗口，它让我明白万物皆有规律。每一次发现都让我感到兴奋和惊叹，这种对未知的好奇和探索，是我前进的动力。'
    },
    'science-astronomy': {
        title: '🌌 天文学',
        category: '科学',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=astronomy%20stars%20universe%20telescope%20cosmos%20dark%20background&image_size=portrait_4_3',
        experience: '对天文学充满热爱，喜欢观察星空，了解宇宙的奥秘。从肉眼观测到使用天文望远镜，逐渐深入了解这个浩瀚的宇宙。',
        honors: ['观测过多次流星雨', '认识100+颗星星', '阅读大量天文学书籍'],
        thoughts: '仰望星空，我感受到自己的渺小，也感受到宇宙的无限可能。天文学让我明白，人类只是宇宙中的一粒尘埃，但我们的智慧却可以探索整个宇宙。这种宏大的视角，让我更加珍惜生活，也更加渴望探索未知。'
    },
    'animal-cat': {
        title: '🐱 猫咪',
        category: '动物',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cat%20pet%20adorable%20fluffy%20dark%20background&image_size=portrait_4_3',
        experience: '从小喜欢猫咪，家里养过好几只猫。猫咪的优雅、独立和温柔，让我深深着迷。',
        honors: ['养过3只猫咪', '学会给猫咪洗澡剪指甲', '制作猫咪美食'],
        thoughts: '猫咪是一种神奇的动物，它们既有独立的个性，又能给予人温暖的陪伴。和猫咪在一起，我学会了耐心和温柔。它们用自己的方式表达爱，让生活变得更加美好。'
    },
    'animal-pig': {
        title: '🐷 猪',
        category: '动物',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20pig%20animal%20adorable%20pink%20dark%20background&image_size=portrait_4_3',
        experience: '对小猪特别有好感，觉得它们聪明可爱。曾经养过宠物猪，也去过农场接触过真正的猪。',
        honors: ['养过宠物猪', '参观过大型养猪场', '了解猪的智商很高'],
        thoughts: '猪是一种被误解的动物，它们其实非常聪明和可爱。和猪接触后，我发现它们有着丰富的情感和智慧。每一种动物都值得被尊重和爱护，它们都是大自然的精灵。'
    },
    'anime-naruto': {
        title: '🍥 火影忍者',
        category: '动漫',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=naruto%20anime%20ninja%20action%20fantasy%20dark%20background&image_size=portrait_4_3',
        experience: '从初中开始追火影忍者，一直追到完结。这部动漫陪伴我度过了整个青春，也教会了我很多道理。',
        honors: ['完整追完720集', '收集了多本漫画', 'cosplay过漩涡鸣人'],
        thoughts: '火影忍者不仅仅是一部动漫，它是一种精神。鸣人的坚持、佐助的成长、卡卡西的温柔，每一个角色都让我感动。"说到做到，这就是我的忍道！"这句话一直激励着我，让我在面对困难时永不放弃。'
    },
    'anime-bleach': {
        title: '💀 死神',
        category: '动漫',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bleach%20anime%20soul%20reaper%20action%20dark%20background&image_size=portrait_4_3',
        experience: '大学期间开始看死神，被精彩的战斗和深刻的剧情所吸引。每一场战斗都充满激情，每一个角色都有自己的故事。',
        honors: ['完整追完366集', '收集了全套漫画', '学会了卍解的日语发音'],
        thoughts: '死神教会我，每个人都有自己的使命和责任。一护的守护、露琪亚的坚强、恋次的成长，都让我深受感动。战斗不仅仅是力量的较量，更是信念的对决。这种热血和激情，让我在现实生活中也充满动力。'
    },
    'anime-bluecat': {
        title: '🐱 蓝猫淘气三千问',
        category: '动漫',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20cat%20cartoon%20anime%20chinese%20classic%20dark%20background&image_size=portrait_4_3',
        experience: '童年的经典动画，陪伴我度过了美好的童年时光。蓝猫淘气三千问以幽默风趣的方式讲述科学知识，让我从小就对科学产生了浓厚的兴趣。',
        honors: ['完整看过500+集', '学会了很多科学知识', '收藏了蓝猫周边'],
        thoughts: '蓝猫淘气三千问不仅仅是一部动画片，它是我童年的启蒙老师。通过这部动画，我学到了很多自然科学知识，培养了对科学的好奇心。每当想起蓝猫和淘气的冒险故事，都会勾起美好的童年回忆。'
    },
    'food-mcdonalds': {
        title: '🍔 麦当劳',
        category: '美食',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mcdonalds%20food%20burger%20fries%20fast%20food%20dark%20background&image_size=portrait_4_3',
        experience: '从小就喜欢吃麦当劳，它不仅仅是快餐，更是一种生活方式。每次吃到麦当劳都会感到开心和满足，它是我童年最美好的回忆之一。',
        honors: ['吃过100+次麦当劳', '尝试过所有套餐', '收集过麦当劳玩具'],
        thoughts: '麦当劳对我来说不仅仅是食物，它代表着快乐和童年。金黄酥脆的薯条、香气四溢的汉堡、冰凉可口的可乐，这些都是我最爱的味道。每次走进麦当劳，都会让我想起小时候那个无忧无虑的自己。'
    },
    'science-scifi': {
        title: '🚀 科幻',
        category: '科学',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sci-fi%20science%20fiction%20futuristic%20spaceship%20dark%20background&image_size=portrait_4_3',
        experience: '对科幻作品有着浓厚的兴趣，喜欢阅读科幻小说、观看科幻电影、玩科幻游戏。科幻作品让我看到了未来的无限可能，也激发了我的想象力和创造力。',
        honors: ['阅读50+本科幻小说', '看过100+部科幻电影', '参与科幻社团活动'],
        thoughts: '科幻是一种思维方式，它让我敢于想象未来，敢于挑战现有的认知。每一部优秀的科幻作品都是一次思想的旅行，让我在虚拟的世界中探索人类的命运和宇宙的奥秘。科幻不仅仅是娱乐，更是对人类未来的思考和探索。'
    }
};

function initInterestModal() {
    const cards = document.querySelectorAll('.interest-card');
    const overlay = document.getElementById('interestModalOverlay');
    const modal = document.getElementById('interestModal');
    const closeBtn = document.getElementById('interestModalClose');
    
    const modalImg = document.getElementById('interestModalImg');
    const modalTitle = document.getElementById('interestModalTitle');
    const modalCategory = document.getElementById('interestModalCategory');
    const modalExperience = document.getElementById('interestModalExperience');
    const modalHonors = document.getElementById('interestModalHonors');
    const modalThoughts = document.getElementById('interestModalThoughts');
    
    if (!overlay || !modal || !closeBtn) return;
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const data = interestData[id];
            
            if (!data) return;
            
            modalImg.src = data.image;
            modalTitle.textContent = data.title;
            modalCategory.textContent = data.category;
            modalExperience.textContent = data.experience;
            modalHonors.innerHTML = data.honors.map(item => `<li>${item}</li>`).join('');
            modalThoughts.textContent = data.thoughts;
            
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    function closeInterestModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    closeBtn.addEventListener('click', closeInterestModal);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeInterestModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeInterestModal();
        }
    });
}

// ============================================
// 书籍详情数据 (v0.4.0)
// ============================================

const bookData = {
    '1984': {
        title: '📚 1984',
        subtitle: '乔治·奥威尔',
        image: 'images/book-1984.jpg',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%201984%20george%20orwell%20dystopian%20dark%20surveillance%20big%20brother%20vertical&image_size=portrait_2_3',
        meta: ['📖 小说', '📅 1949', '🏷️ 反乌托邦', '⭐ 豆瓣9.3'],
        summary: '《1984》是乔治·奥威尔于1949年出版的反乌托邦小说。故事发生在一个被极权主义统治的虚构国家"大洋国"，主人公温斯顿·史密斯在真理部工作，负责修改历史以符合党的宣传。随着对现状的不满和对自由的渴望，他开始了一段危险的秘密恋情，并加入了地下反抗组织。',
        thoughts: '这本书被誉为反乌托邦的经典之作，读完后让人不寒而栗。奥威尔对极权主义的预言如此精准，以至于今天读来仍然具有强烈的现实意义。"战争即和平，自由即奴役，无知即力量"——这些口号在书中反复出现，揭示了权力如何通过控制思想来维持统治。最令人震撼的是"老大哥在看着你"这句话，它成为了监视社会的代名词。这本书提醒我们，自由和真理是多么宝贵，值得我们去捍卫。'
    },
    'sapiens': {
        title: '📚 人类简史',
        subtitle: '尤瓦尔·赫拉利',
        image: 'images/book-sapiens.jpg',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%20sapiens%20human%20history%20civilization%20evolution%20colorful%20artistic%20vertical&image_size=portrait_2_3',
        meta: ['📖 历史', '📅 2011', '🏷️ 人类学', '⭐ 豆瓣9.2'],
        summary: '《人类简史》从认知革命、农业革命、科学革命三个阶段讲述了人类从史前时代到现代社会的发展历程。作者尤瓦尔·赫拉利提出了许多颠覆性的观点，挑战了我们对人类历史和自身的认知。',
        thoughts: '这本书彻底改变了我对人类历史的认知。赫拉利用宏大的视角审视人类的发展，提出了许多引人深思的问题。"农业革命是史上最大骗局"这个观点让我印象深刻——农业带来了稳定的食物供应，却也让人类陷入了更加辛苦的劳作和更大的社会不平等。书中关于"人类是如何通过虚构的故事来构建大规模协作"的论述更是精彩绝伦。读完这本书，我重新审视了人类在地球上的位置，以及我们未来的走向。'
    },
    'thinking': {
        title: '📚 思考，快与慢',
        subtitle: '丹尼尔·卡尼曼',
        image: 'images/book-thinking.jpg',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%20thinking%20fast%20and%20slow%20psychology%20brain%20cognitive%20science%20professional%20vertical&image_size=portrait_2_3',
        meta: ['📖 心理学', '📅 2011', '🏷️ 行为经济学', '⭐ 豆瓣8.1'],
        summary: '诺贝尔经济学奖得主丹尼尔·卡尼曼在这本书中介绍了人类思维的两种模式：系统1（快速、直觉、无意识）和系统2（缓慢、理性、有意识）。通过大量的实验和案例，揭示了我们在判断和决策中存在的各种认知偏差。',
        thoughts: '这是一本让我重新认识自己思维方式的书。卡尼曼用通俗易懂的语言解释了复杂的心理学概念，让我意识到自己每天都在犯各种认知错误。锚定效应、损失厌恶、确认偏误——这些概念帮助我理解了为什么我们会做出不理性的决策。最有价值的是，这本书教会了我如何识别和避免这些偏差，让我在生活和工作中做出更明智的选择。'
    },
    'deepwork': {
        title: '📚 深度工作',
        subtitle: '卡尔·纽波特',
        image: 'images/book-deepwork.jpg',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%20deep%20work%20productivity%20focus%20minimalist%20professional%20workspace%20vertical&image_size=portrait_2_3',
        meta: ['📖 自我提升', '📅 2016', '🏷️ 时间管理', '⭐ 豆瓣7.9'],
        summary: '在这个信息爆炸的时代，深度工作能力变得越来越稀缺。卡尔·纽波特提出了深度工作的概念——在无干扰的状态下进行专注的职业活动，从而创造新价值、提升技能。书中介绍了如何培养深度工作习惯，提高工作效率。',
        thoughts: '这本书改变了我的工作方式。在读完这本书之前，我习惯了随时处理邮件和消息，以为这样效率更高。但实际上，这种碎片化的工作方式严重影响了我的专注力和创造力。深度工作让我意识到，真正有价值的工作需要长时间的专注。现在，我每天都会安排一段不受打扰的深度工作时间，专注于最重要的任务。这种改变让我的工作效率和质量都有了显著提升。'
    },
    'atomic': {
        title: '📚 原子习惯',
        subtitle: '詹姆斯·克利尔',
        image: 'images/book-atomic.jpg',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%20atomic%20habits%20self%20improvement%20success%20minimalist%20modern%20clean%20vertical&image_size=portrait_2_3',
        meta: ['📖 自我提升', '📅 2018', '🏷️ 习惯养成', '⭐ 豆瓣8.3'],
        summary: '《原子习惯》提出了一个简单而强大的观点：微小的改变可以带来惊人的结果。作者詹姆斯·克利尔介绍了如何通过建立良好的习惯、消除不良习惯来实现个人成长和成功。书中提供了实用的方法和技巧，帮助读者养成持久的好习惯。',
        thoughts: '这本书让我明白了习惯的力量。我们常常追求大的改变，却忽略了每天微小的进步。"每天进步1%，一年后就是37倍"——这个公式深深震撼了我。书中关于"习惯叠加"和"环境设计"的方法非常实用，让我能够轻松地将新习惯融入日常生活。现在，我更加注重培养那些看似微小但意义深远的习惯，相信时间会带来巨大的改变。'
    },
    'hobbit': {
        title: '📚 霍比特人',
        subtitle: 'J.R.R.托尔金',
        image: 'images/book-hobbit.jpg',
        fallbackImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%20the%20hobbit%20fantasy%20adventure%20middle%20earth%20magical%20elves%20vertical&image_size=portrait_2_3',
        meta: ['📖 奇幻', '📅 1937', '🏷️ 中土世界', '⭐ 豆瓣9.2'],
        summary: '《霍比特人》是托尔金中土世界系列的开篇之作。故事讲述了霍比特人比尔博·巴金斯在巫师甘道夫的引导下，加入了一支矮人远征队，踏上了夺回孤山宝藏的冒险之旅。途中，他遇到了各种神奇的生物，经历了无数惊险的挑战。',
        thoughts: '这是一本充满奇幻色彩的冒险故事。托尔金创造了一个完整而丰富的中土世界，让我沉浸其中无法自拔。比尔博的成长历程让我深受感动——从一个安逸的霍比特人到勇敢的冒险家，他的转变激励着我勇敢面对生活中的挑战。书中的角色形象鲜明，情节跌宕起伏，每一次阅读都让我仿佛置身于那个神奇的世界。这是一本适合所有年龄段读者的经典之作。'
    }
};
