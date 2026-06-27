/* =========================================================
   Электронное портфолио — интерактив
   GSAP + ScrollTrigger: плавный скролл, reveal, active nav
   ========================================================= */

(function () {
    'use strict';

    /* ---------- Плавный скролл по якорям навигации ---------- */
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const navHeight = document.querySelector('.navigation').offsetHeight;
            const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ---------- Подсветка активного раздела в меню ---------- */
    const sections = document.querySelectorAll('.section');
    const navMap = new Map();
    navLinks.forEach(link => {
        const id = link.getAttribute('href');
        if (id && id.startsWith('#')) navMap.set(id.substring(1), link);
    });

    function setActiveNav() {
        const scrollPos = window.pageYOffset;
        const navHeight = document.querySelector('.navigation').offsetHeight;
        let currentId = '';

        sections.forEach(section => {
            const top = section.offsetTop - navHeight - 20;
            if (scrollPos >= top) currentId = section.id;
        });

        navLinks.forEach(link => link.classList.remove('active'));
        if (currentId && navMap.has(currentId)) {
            navMap.get(currentId).classList.add('active');
        }
    }

    window.addEventListener('scroll', setActiveNav, { passive: true });
    window.addEventListener('load', setActiveNav);

    /* ---------- GSAP: анимации появления ---------- */
    // Динамически вешаем класс .reveal на блоки, которые надо анимировать
    const revealSelectors = [
        '.hero',
        '.competency-card',
        '.skill-card',
        '.card',
        '.contact-card',
        '.section__head'
    ];

    revealSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
    });

    // Если GSAP не загрузился — просто показываем всё
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        document.querySelectorAll('.reveal').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Hero — появляется сразу при загрузке
    gsap.to('.hero', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
    });

    // Поочерёдное появление карточек компетенций
    gsap.to('.competency-card', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.competencies',
            start: 'top 80%'
        }
    });

    // Заголовки секций
    gsap.utils.toArray('.section__head').forEach(head => {
        gsap.to(head, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: head,
                start: 'top 85%'
            }
        });
    });

    // Универсальный reveal для карточек навыков, работ, документов и т.д.
    const cardGroups = [
        '.skill-card',
        '.card',
        '.contact-card'
    ];

    cardGroups.forEach(sel => {
        gsap.utils.toArray(sel).forEach((card, i) => {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.55,
                delay: (i % 4) * 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%'
                }
            });
        });
    });
})();
