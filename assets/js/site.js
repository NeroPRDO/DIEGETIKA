/**
 * Comportamentos visuais e acessibilidade.
 * Dados editáveis ficam exclusivamente na pasta content/.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await window.DIEGETIKA_COMPONENTS_READY;

  window.DiegetikaContent?.renderDynamicContent();
  window.DiegetikaContent?.applyMetadata();
  window.DiegetikaContent?.applyStructuredData();

  initializeNavigation();
  initializeTheme();
  initializeCarousels();
  initializeAnimations();
  initializeGallery();
  initializeNewsFilters();
  updateFooterYear();
});

function initializeNavigation() {
  const currentPage = document.body.dataset.page;
  const header = document.querySelector(".site-header");
  const navigation = document.querySelector(".site-header nav");
  const toggle = document.querySelector(".nav-toggle");

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const isCurrent = link.dataset.nav === currentPage;
    link.classList.toggle("active", isCurrent);
    if (isCurrent) link.setAttribute("aria-current", "page");
  });

  if (toggle && navigation) {
    toggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("active");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? (window.DIEGETIKA_CONTENT.site?.interface?.fecharMenu || "Fechar menu") : (window.DIEGETIKA_CONTENT.site?.interface?.abrirMenu || "Abrir menu"));
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeNavigation(navigation, toggle));
    });

    document.addEventListener("click", (event) => {
      if (!navigation.contains(event.target) && !toggle.contains(event.target)) {
        closeNavigation(navigation, toggle);
      }
    });
  }

  const updateHeader = () => header?.classList.toggle("header-scrolled", window.scrollY > 20);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function closeNavigation(navigation, toggle) {
  navigation?.classList.remove("active");
  toggle?.setAttribute("aria-expanded", "false");
  toggle?.setAttribute("aria-label", window.DIEGETIKA_CONTENT.site?.interface?.abrirMenu || "Abrir menu");
}

function initializeTheme() {
  const button = document.querySelector(".mode-toggle");
  if (!button) return;

  const savedTheme = localStorage.getItem("diegetika-theme");
  // O tema escuro é a identidade visual padrão. O claro só é ativado após escolha.
  const useLightTheme = savedTheme === "light";
  document.body.classList.toggle("light-mode", useLightTheme);
  updateThemeButton(button);

  button.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("diegetika-theme", document.body.classList.contains("light-mode") ? "light" : "dark");
    updateThemeButton(button);
  });
}

function updateThemeButton(button) {
  const lightMode = document.body.classList.contains("light-mode");
  button.innerHTML = `<i class="fa-solid ${lightMode ? "fa-moon" : "fa-sun"}" aria-hidden="true"></i>`;
  button.setAttribute("aria-label", lightMode ? "Ativar tema escuro" : "Ativar tema claro");
}

function initializeCarousels() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".carousel").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-slide");
    const images = track ? [...track.querySelectorAll("img")] : [];
    if (!track || images.length < 2) return;

    let index = 0;
    let intervalId = null;
    let visible = true;

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
    };
    const next = () => {
      index = (index + 1) % images.length;
      update();
    };
    const previous = () => {
      index = (index - 1 + images.length) % images.length;
      update();
    };
    const stop = () => {
      if (intervalId) window.clearInterval(intervalId);
      intervalId = null;
    };
    const start = () => {
      if (reducedMotion || carousel.dataset.autoplay !== "true" || !visible || document.hidden || intervalId) return;
      intervalId = window.setInterval(next, 6500);
    };

    carousel.querySelector(".next")?.addEventListener("click", () => { next(); stop(); start(); });
    carousel.querySelector(".prev")?.addEventListener("click", () => { previous(); stop(); start(); });
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    }, { threshold: 0.2 });
    observer.observe(carousel);

    document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
    update();
    start();
  });
}

function initializeAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  const elements = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  elements.forEach((element) => {
    element.classList.add("will-animate");
    observer.observe(element);
  });
}

function initializeGallery() {
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const image = item.querySelector("img");
      if (image) openLightbox(image);
    });
  });
}

function openLightbox(image) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", image.alt || "Imagem ampliada");

  const content = document.createElement("div");
  content.className = "lightbox-content";

  const closeButton = document.createElement("button");
  closeButton.className = "lightbox-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Fechar imagem");
  closeButton.textContent = "×";

  const expandedImage = document.createElement("img");
  expandedImage.src = image.src;
  expandedImage.alt = image.alt;

  const caption = document.createElement("p");
  caption.className = "lightbox-caption";
  caption.textContent = image.alt;

  content.append(closeButton, expandedImage, caption);
  lightbox.appendChild(content);

  const close = () => {
    lightbox.remove();
    document.body.classList.remove("no-scroll");
    document.removeEventListener("keydown", handleKeydown);
  };
  const handleKeydown = (event) => {
    if (event.key === "Escape") close();
  };

  closeButton.addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", handleKeydown);
  document.body.appendChild(lightbox);
  document.body.classList.add("no-scroll");
  closeButton.focus();
}

function initializeNewsFilters() {
  const buttons = [...document.querySelectorAll("[data-news-filter]")];
  const cards = [...document.querySelectorAll(".news-card[data-year]")];
  const emptyMessage = document.querySelector(".empty-filter-message");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.newsFilter;
      buttons.forEach((item) => item.classList.toggle("active", item === button));

      let visibleCount = 0;
      cards.forEach((card) => {
        const show = filter === "Todos" || card.dataset.year === filter;
        card.hidden = !show;
        if (show) visibleCount += 1;
      });

      if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
    });
  });
}

function updateFooterYear() {
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}
