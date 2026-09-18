// ============================================
// PJAX 无刷新页面切换
// 目的：切换页面时保持 JS 上下文存活，让背景音乐持续播放不中断
// 原理：拦截站内 .html 链接 → fetch 新页面 → 仅替换 body 内容
//       → 重执行新页面脚本 → 重新初始化页面行为
// 兼容：fetch/DOMParser 失败时自动回退整页跳转
// ============================================
(function initPjax() {
    if (window.__pjaxInit) return;
    window.__pjaxInit = true;

    // 已加载的外部脚本（按路径名去重，忽略 ?v= 版本参数）
    const loadedScripts = new Set();
    document.querySelectorAll('script[src]').forEach(function (s) {
        try { loadedScripts.add(new URL(s.src, location.href).pathname); } catch (e) {}
    });

    // 跨页面换页时需要保留的持久元素（音乐播放器由 JS 注入，整站共用）
    const PERSIST_SELECTOR = '#musicPlayer, #musicTip';

    let lastPathKey = location.pathname + location.search;
    let navigating = false;

    // 暴露给其它脚本（搜索结果跳转、goToParent 等）使用
    window.__pjaxNavigate = navigate;

    // ---------- 链接拦截 ----------
    function shouldIntercept(a) {
        if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
        if (a.hasAttribute('data-no-pjax')) return false;
        const href = a.getAttribute('href') || '';
        if (!href || href.charAt(0) === '#') return false;               // 页内锚点走浏览器默认
        if (/^(mailto|tel|javascript):/i.test(href)) return false;
        let url;
        try { url = new URL(a.href, location.href); } catch (e) { return false; }
        if (url.origin !== location.origin) return false;                // 外站链接
        if (!/\.html?$/i.test(url.pathname)) return false;               // 仅拦截页面链接
        return true;
    }

    document.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;    // 修饰键交给浏览器
        const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!shouldIntercept(a)) return;
        e.preventDefault();
        navigate(a.href, true);
    });

    // ---------- 后退/前进 ----------
    window.addEventListener('popstate', function () {
        const key = location.pathname + location.search;
        if (key === lastPathKey) return;                                 // 纯锚点变化，交给浏览器
        const targetScroll = (history.state && typeof history.state.scrollY === 'number')
            ? history.state.scrollY : 0;
        navigate(location.href, false, targetScroll);
    });

    // ---------- 核心：换页 ----------
    function navigate(url, push, targetScroll) {
        if (navigating) return;
        navigating = true;

        // 当前滚动位置记入历史条目，便于后退时恢复
        if (push && history.state && history.state.pjax) {
            // 无需处理：非 pjax 条目不覆盖
        }
        if (push) {
            try { history.replaceState({ pjax: true, scrollY: window.scrollY }, ''); } catch (e) {}
        }

        fetch(url, { headers: { 'X-PJAX': '1' } })
            .then(function (resp) {
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                return resp.text();
            })
            .then(function (html) {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                if (!doc.body) throw new Error('解析失败');
                if (push) history.pushState({ pjax: true, scrollY: 0 }, '', url);
                applyPage(doc, url, targetScroll || 0);
            })
            .catch(function (err) {
                console.warn('PJAX 加载失败，回退整页跳转：', err);
                window.location.href = url;
            })
            .finally(function () {
                navigating = false;
            });
    }

    function applyPage(doc, url, targetScroll) {
        // 溶解动画参数：在 View Transition 截图前生效（替代目标页 checkTransitionParam 脚本）
        const targetUrl = new URL(url, location.href);
        const useDissolve = targetUrl.searchParams.get('transition') === 'dissolve';
        if (useDissolve) document.documentElement.classList.add('fh-transition-dissolve');

        const swap = function () {
            // 1. 标题
            document.title = doc.title;

            // 2. 页面专属 <style>（部分页面 head 里有内联样式）
            document.head.querySelectorAll('style[data-pjax-page]').forEach(function (el) { el.remove(); });
            doc.head.querySelectorAll('style').forEach(function (el) {
                const clone = document.createElement('style');
                clone.setAttribute('data-pjax-page', '1');
                clone.textContent = el.textContent;
                document.head.appendChild(clone);
            });

            // 3. body 替换：保留持久元素，丢弃旧脚本
            const persist = new Map();
            document.body.querySelectorAll(PERSIST_SELECTOR).forEach(function (el) {
                persist.set(el.id, el);
            });
            Array.from(document.body.childNodes).forEach(function (node) {
                if (node.nodeType !== 1) { node.remove(); return; }      // 文本/注释节点
                if (persist.has(node.id)) return;                        // 持久元素先摘下来
                node.remove();
            });

            const frag = document.createDocumentFragment();
            Array.from(doc.body.childNodes).forEach(function (node) {
                if (node.nodeType !== 1) return;
                if (node.tagName === 'SCRIPT') return;                   // 脚本稍后统一执行
                if (node.id && persist.has(node.id)) return;
                frag.appendChild(document.importNode(node, true));
            });
            document.body.appendChild(frag);

            // 4. 清理上个页面遗留的状态（弹窗锁定滚动等）
            document.body.style.overflow = '';

            // 5. 执行新页面的脚本
            executeScripts(doc);

            // 6. 重新初始化全站页面行为（script.js）
            if (typeof window.reinitPageScripts === 'function') window.reinitPageScripts();

            // 7. 滚动位置：前进到顶，后退恢复原位
            const u = new URL(url, location.href);
            if (u.hash) {
                const target = document.getElementById(u.hash.slice(1));
                if (target) { target.scrollIntoView(); return; }
            }
            window.scrollTo(0, targetScroll || 0);
        };

        // 与全站 View Transitions 风格保持一致
        if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const vt = document.startViewTransition(swap);
            if (useDissolve && vt && vt.finished) {
                vt.finished.finally(function () {
                    setTimeout(function () {
                        document.documentElement.classList.remove('fh-transition-dissolve');
                    }, 600);
                });
            }
        } else {
            swap();
            if (useDissolve) {
                setTimeout(function () {
                    document.documentElement.classList.remove('fh-transition-dissolve');
                }, 600);
            }
        }

        lastPathKey = location.pathname + location.search;
    }

    // ---------- 脚本重执行 ----------
    function executeScripts(doc) {
        doc.body.querySelectorAll('script').forEach(function (old) {
            const script = document.createElement('script');
            for (let i = 0; i < old.attributes.length; i++) {
                script.setAttribute(old.attributes[i].name, old.attributes[i].value);
            }
            if (old.src) {
                let pathname;
                try { pathname = new URL(old.src, location.href).pathname; } catch (e) { pathname = old.src; }
                if (loadedScripts.has(pathname)) return;                 // script.js 等已加载，跳过避免重复初始化
                loadedScripts.add(pathname);
                document.body.appendChild(script);                       // 新外部脚本：触发下载执行
            } else {
                script.textContent = old.textContent;                    // 内联脚本：页面内已做 PJAX 安全包装
                document.body.appendChild(script);
            }
        });
    }
})();
