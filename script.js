// script.js - полностью на jQuery
$(document).ready(function () {
  // ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
  const $animatedElements = $(".animate-on-scroll");

  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        $(entry.target).addClass("animated");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  $animatedElements.each(function () {
    observer.observe(this);
  });

  // ===== БЕСКОНЕЧНАЯ КАРУСЕЛЬ С ОТЗЫВАМИ =====
  const $track = $(".carousel-track");
  const $slides = $(".testimonial-card");
  const $prevBtn = $(".prev-btn");
  const $nextBtn = $(".next-btn");
  const $dotsContainer = $(".carousel-dots");

  if ($track.length && $slides.length > 0) {
    let currentIndex = 0;
    const slideCount = $slides.length;

    // Создаем точки навигации
    function createDots() {
      $dotsContainer.empty();
      for (let i = 0; i < slideCount; i++) {
        const $dot = $("<div></div>").addClass("dot");
        if (i === 0) $dot.addClass("active");
        $dot.on("click", function () {
          goToSlide(i);
        });
        $dotsContainer.append($dot);
      }
    }

    // Обновление активной точки
    function updateDots() {
      $(".dot").each(function (index) {
        if (index === currentIndex) {
          $(this).addClass("active");
        } else {
          $(this).removeClass("active");
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
      $track.css("transform", `translateX(-${currentIndex * 100}%)`);
      updateDots();
    }

    // Инициализация
    createDots();

    // Обработчики кнопок
    $prevBtn.on("click", function () {
      currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      $track.css("transform", `translateX(-${currentIndex * 100}%)`);
      updateDots();
    });

    $nextBtn.on("click", function () {
      currentIndex = (currentIndex + 1) % slideCount;
      $track.css("transform", `translateX(-${currentIndex * 100}%)`);
      updateDots();
    });

    // Автоматическая прокрутка каждые 5 секунд
    let autoPlayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slideCount;
      $track.css("transform", `translateX(-${currentIndex * 100}%)`);
      updateDots();
    }, 5000);

    // Останавливаем автопрокрутку при наведении
    $track.on("mouseenter", function () {
      clearInterval(autoPlayInterval);
    });

    $track.on("mouseleave", function () {
      autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slideCount;
        $track.css("transform", `translateX(-${currentIndex * 100}%)`);
        updateDots();
      }, 5000);
    });

    // Обработка свайпов на мобильных
    let touchStartX = 0;
    let touchEndX = 0;

    $track.on("touchstart", function (e) {
      touchStartX = e.originalEvent.changedTouches[0].screenX;
    });

    $track.on("touchend", function (e) {
      touchEndX = e.originalEvent.changedTouches[0].screenX;
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
      $track.css("transform", `translateX(-${currentIndex * 100}%)`);
      updateDots();
    }
  }

  // ===== ПЛАВНЫЙ СКРОЛЛ =====
  const $allLinks = $(
    '.nav-links a[href^="#"], .hero .btn[href^="#"], .hero .btn-outline[href^="#"]',
  );

  $allLinks.on("click", function (e) {
    e.preventDefault();

    const targetId = $(this).attr("href");
    if (targetId === "#") return;

    const $targetElement = $(targetId);

    if ($targetElement.length) {
      $("html, body").animate(
        {
          scrollTop: $targetElement.offset().top,
        },
        800,
        "swing",
      );
    }
  });

  // ===== ОБРАБОТКА ФОРМЫ =====
  const $contactForm = $(".contact-form form");

  if ($contactForm.length) {
    $contactForm.on("submit", function (e) {
      e.preventDefault();

      // Собираем данные формы
      const formData = $(this).serializeArray();
      const data = {};
      $.each(formData, function () {
        data[this.name] = this.value;
      });

      console.log("Данные формы:", data);
      showNotification("Спасибо! Форма отправлена (демо-режим).", "success");
    });
  }

  // Функция для показа уведомления
  function showNotification(message, type = "info") {
    const $notification = $("<div></div>").text(message);
    $notification.css({
      position: "fixed",
      bottom: "30px",
      right: "30px",
      background: type === "success" ? "#4CAF50" : "#3b3bff",
      color: "white",
      padding: "15px 25px",
      "border-radius": "50px",
      "box-shadow": "0 5px 15px rgba(0,0,0,0.2)",
      "z-index": 1000,
      "font-weight": 500,
      transform: "translateY(100px)",
      opacity: 0,
      transition: "all 0.3s ease",
    });

    $("body").append($notification);

    setTimeout(() => {
      $notification.css({
        transform: "translateY(0)",
        opacity: 1,
      });
    }, 10);

    setTimeout(() => {
      $notification.css({
        transform: "translateY(100px)",
        opacity: 0,
      });
      setTimeout(() => {
        $notification.remove();
      }, 300);
    }, 3000);
  }

  // ===== ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ =====
  const $sections = $("section[id]");

  function updateActiveNavLink() {
    let current = "";
    const scrollPosition = $(window).scrollTop() + 100;

    $sections.each(function () {
      const sectionTop = $(this).offset().top;
      const sectionHeight = $(this).height();

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = $(this).attr("id");
      }
    });

    $(".nav-links a").each(function () {
      $(this).removeClass("active").css({
        "font-weight": "500",
        color: "#ffffff",
      });
    });

    if (current) {
      const $activeLink = $(`.nav-links a[href="#${current}"]`);
      if ($activeLink.length) {
        $activeLink.addClass("active").css({
          "font-weight": "700",
          color: "#3ab6ce",
        });
      }
    }
  }

  $(window).on("scroll", updateActiveNavLink);
  updateActiveNavLink();

  // Анимация для первого экрана
  setTimeout(() => {
    $(".hero .animate-on-scroll").addClass("animated");
  }, 300);
});

// ===== ИЗМЕНЕНИЕ ФОНА НАВБАРА ПРИ СКРОЛЛЕ =====
$(window).on("scroll", function () {
  if ($(this).scrollTop() > 50) {
    $(".navbar").addClass("navbar-scrolled");
  } else {
    $(".navbar").removeClass("navbar-scrolled");
  }
});

// Запускаем при загрузке, чтобы сразу применить правильный фон
if ($(window).scrollTop() > 50) {
  $(".navbar").addClass("navbar-scrolled");
}
