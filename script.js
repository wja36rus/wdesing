// script.js
document.addEventListener("DOMContentLoaded", function () {
  // Плавный скролл для всех ссылок с якорями
  const allLinks = document.querySelectorAll(
    '.nav-links a[href^="#"], .hero .btn[href^="#"], .hero .btn-outline[href^="#"]',
  );

  allLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return; // пропускаем пустые ссылки

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Дополнительно: обработка отправки формы (предотвращаем перезагрузку и выводим в консоль)
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

      // Здесь можно добавить отправку на сервер через fetch
      alert("Спасибо! Форма отправлена (демо-режим).");

      // Очистка формы (опционально)
      // this.reset();
    });
  }

  // Подсветка активного пункта меню при скролле (опционально)
  const sections = document.querySelectorAll("section[id]");

  function updateActiveNavLink() {
    let current = "";
    const scrollPosition = window.scrollY + 100; // небольшой отступ

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

    // Убираем активный класс у всех ссылок
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.classList.remove("active");
      link.style.fontWeight = "100";
      link.style.color = "#000000";
    });

    // Добавляем активный класс для текущей секции
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

  // Запускаем при скролле
  window.addEventListener("scroll", updateActiveNavLink);

  // И сразу после загрузки
  updateActiveNavLink();
});
