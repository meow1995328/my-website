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
        const sections = document.querySelectorAll('.timeline-section[id]');
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
