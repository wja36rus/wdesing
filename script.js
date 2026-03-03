// script.js
document.addEventListener("DOMContentLoaded", function () {
  // ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // ===== БЕСКОНЕЧНАЯ КАРУСЕЛЬ С ОТЗЫВАМИ =====
  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const dotsContainer = document.querySelector(".carousel-dots");

  if (track && slides.length > 0) {
    let currentIndex = 0;
    const slideCount = slides.length;

    // Создаем точки навигации
    function createDots() {
      dotsContainer.innerHTML = "";
      for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    // Обновление активной точки
    function updateDots() {
      const dots = document.querySelectorAll(".dot");
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    // Переход к слайду
    function goToSlide(index) {
      if (index < 0) {
        index = slideCount - 1;
      } else if (index >= slideCount) {
        index = 0;
      }

      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    // Инициализация
    createDots();

    // Обработчики кнопок
    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slideCount;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    });

    // Автоматическая прокрутка каждые 5 секунд
    let autoPlayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slideCount;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }, 5000);

    // Останавливаем автопрокрутку при наведении
    track.addEventListener("mouseenter", () => {
      clearInterval(autoPlayInterval);
    });

    track.addEventListener("mouseleave", () => {
      autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slideCount;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
      }, 5000);
    });

    // Обработка свайпов на мобильных
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        // Свайп влево - следующий
        currentIndex = (currentIndex + 1) % slideCount;
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Свайп вправо - предыдущий
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      }
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }
  }

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

      const formData = new FormData(this);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      console.log("Данные формы:", data);
      showNotification("Спасибо! Форма отправлена (демо-режим).", "success");
    });
  }

  // Функция для показа уведомления
  function showNotification(message, type = "info") {
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

    setTimeout(() => {
      notification.style.transform = "translateY(0)";
      notification.style.opacity = "1";
    }, 10);

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

  // Анимация для первого экрана
  setTimeout(() => {
    const heroElements = document.querySelectorAll(".hero .animate-on-scroll");
    heroElements.forEach((el) => {
      el.classList.add("animated");
    });
  }, 300);
});
