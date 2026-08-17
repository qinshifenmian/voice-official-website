// ========================================================================
// Voice 智能医美 — 官网交互脚本
// ========================================================================

(function () {
  'use strict';

  // —— Header 滚动效果 ——
  var siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    window.addEventListener('scroll', function () {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  // —— 移动端导航 ——
  var navToggle = document.getElementById('navToggle');
  var navPanel = document.getElementById('navPanel');
  if (navToggle && navPanel && siteHeader) {
    navToggle.addEventListener('click', function () {
      var open = navPanel.classList.toggle('open');
      siteHeader.classList.toggle('nav-open', open);
    });
    // 点击链接后关闭
    navPanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navPanel.classList.remove('open');
        siteHeader.classList.remove('nav-open');
      });
    });
  }

  // —— 滚动渐入动画 ——
  var srItems = document.querySelectorAll('.sr-item');
  if (srItems.length > 0) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
      srItems.forEach(function (item) { observer.observe(item); });
    } else {
      // 不支持 IntersectionObserver 的浏览器直接显示
      srItems.forEach(function (item) { item.classList.add('is-visible'); });
    }
  }

  // —— 联系表单（防提交，仅前端提示） ——
  var contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        var original = btn.textContent;
        btn.textContent = '提交成功，我们将尽快联系您';
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
          contactForm.reset();
        }, 3000);
      }
    });
  }
})();
