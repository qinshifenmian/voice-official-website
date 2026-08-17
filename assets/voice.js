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

  // —— 预约表单（提交到本机后端数据库） ——
  var DEMO_API = 'https://alerts-jim-showtimes-ensures.trycloudflare.com';
  var demoForm = document.getElementById('demoForm');
  if (demoForm) {
    demoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = demoForm.querySelector('button[type="submit"]');
      var field = function (name) {
        var el = demoForm.querySelector('[name="' + name + '"]');
        return el ? el.value.trim() : '';
      };
      if (btn) {
        btn.disabled = true;
        btn.textContent = '提交中…';
      }
      var failBox = document.getElementById('formFail');
      if (failBox) failBox.style.display = 'none';
      fetch(DEMO_API + '/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: field('name'),
          phone: field('phone'),
          company: field('company'),
          message: field('message')
        })
      }).then(function (res) {
        return res.json();
      }).then(function (result) {
        if (!result.ok) throw new Error('submit failed');
        demoForm.style.display = 'none';
        var okBox = document.getElementById('formOk');
        if (okBox) okBox.style.display = 'block';
      }).catch(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = '提交预约';
        }
        if (failBox) failBox.style.display = 'block';
      });
    });
  }
})();
