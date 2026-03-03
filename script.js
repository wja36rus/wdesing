// script.js
document.addEventListener("DOMContentLoaded", function () {
  // ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
  // Используем Intersection Observer для производительности

  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  // Настройки наблюдателя
  const observerOptions = {
    threshold: 0.2, // Элемент считается видимым, когда 20% его площади в зоне видимости
    rootMargin: "0px 0px -50px 0px", // Небольшой отступ снизу
  };

  // Создаем наблюдатель
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Если элемент появился в зоне видимости
      if (entry.isIntersecting) {
        // Добавляем класс animated для запуска анимации
        entry.target.classList.add("animated");

        // Можно прекратить наблюдение за элементом после анимации
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Начинаем наблюдение за каждым элементом
  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // ===== ПЛАВНЫЙ СКРОЛЛ =====
  const allLinks = document.querySelectorAll(
    '.nav-links a[href^="#"], .hero .btn[href^="#"], .hero .btn-outline[href^="#"]',
  );

  allLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // ===== ОБРАБОТКА ФОРМЫ =====
  const contactForm = document.querySelector(".contact-form form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Собираем данные формы
      const formData = new FormData(this);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      console.log("Данные формы:", data);

      // Красивое уведомление
      showNotification("Спасибо! Форма отправлена (демо-режим).", "success");

      // Очистка формы (опционально)
      // this.reset();
    });
  }

  // Функция для показа уведомления
  function showNotification(message, type = "info") {
    // Создаем элемент уведомления
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${type === "success" ? "#4CAF50" : "#3b3bff"};
            color: white;
            padding: 15px 25px;
            border-radius: 50px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 500;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        `;

    document.body.appendChild(notification);

    // Анимация появления
    setTimeout(() => {
      notification.style.transform = "translateY(0)";
      notification.style.opacity = "1";
    }, 10);

    // Удаляем через 3 секунды
    setTimeout(() => {
      notification.style.transform = "translateY(100px)";
      notification.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // ===== ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ =====
  const sections = document.querySelectorAll("section[id]");

  function updateActiveNavLink() {
    let current = "";
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.classList.remove("active");
      link.style.fontWeight = "500";
      link.style.color = "#1e1e2f";
    });

    if (current) {
      const activeLink = document.querySelector(
        `.nav-links a[href="#${current}"]`,
      );
      if (activeLink) {
        activeLink.classList.add("active");
        activeLink.style.fontWeight = "700";
        activeLink.style.color = "#3b3bff";
      }
    }
  }

  window.addEventListener("scroll", updateActiveNavLink);
  updateActiveNavLink();

  // ===== ДОПОЛНИТЕЛЬНО: Анимация для первого экрана при загрузке =====
  // Чтобы элементы на первом экране тоже анимировались при загрузке страницы
  setTimeout(() => {
    const heroElements = document.querySelectorAll(".hero .animate-on-scroll");
    heroElements.forEach((el) => {
      el.classList.add("animated");
    });
  }, 300);
});
