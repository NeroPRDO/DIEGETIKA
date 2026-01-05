document.addEventListener("DOMContentLoaded", function() {
  // Elementos DOM
  const header = document.querySelector('header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  const modeToggle = document.querySelector('.mode-toggle');
  const body = document.body;
  
  // Navegação responsiva
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
  }
  
  // Efeito de rolagem no cabeçalho
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });
  
  // Alternar modo claro/escuro
  if (modeToggle) {
    modeToggle.addEventListener('click', function() {
      body.classList.toggle('light-mode');
      
      // Salvar preferência no localStorage
      if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
      } else {
        localStorage.setItem('theme', 'dark');
      }
    });
    
    // Verificar preferência salva
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      body.classList.add('light-mode');
    }
  }
  
  // Inicializar carrosséis
  initCarousels();
  
  // Animações de entrada
  animateOnScroll();
  
  // Inicializar a galeria
  if (document.querySelector('.gallery-item')) {
    initGallery();
  }
  
  // Inicializar o seletor de idiomas
  initLanguageSelector();
});

// Função para inicializar o seletor de idiomas
function initLanguageSelector() {
  const langButtons = // Marcar o botão do idioma atual como ativo
  langButtons.forEach(button => {
    if (button.getAttribute('data-lang') === savedLang) {
      button.classList.add('active');
    }
    
    button.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      changeLanguage(lang);
      
      // Remover classe ativa de todos os botões
      langButtons.forEach(btn => btn.classList.remove('active'));
      // Adicionar classe ativa ao botão clicado
      this.classList.add('active');
      
      // Salvar preferência no localStorage
      localStorage.setItem('language', lang);
    });
  });
  
  // Aplicar o idioma atual
  changeLanguage(savedLang);
}

// Função para trocar o idioma
function changeLanguage(lang) {
  if (!translations || !translations[lang]) return; // Verificar se as traduções existem
  
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    
    if (translations[lang] && translations[lang][key]) {
      // Se o elemento for um input com placeholder
      if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
        element.placeholder = translations[lang][key];
      } 
      // Se for um elemento com texto
      else {
        element.textContent = translations[lang][key];
      }
    }
  });
  
  // Atualizar o atributo lang do HTML
  document.documentElement.setAttribute('lang', lang);
}

// Função para inicializar todos os carrosséis
function initCarousels() {
  const carousels = document.querySelectorAll('.carousel');
  
  carousels.forEach(carousel => {
    const container = carousel.querySelector('.carousel-slide');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    const images = container.querySelectorAll('img');
    
    if (!container || !images.length) return;
    
    let currentIndex = 0;
    const imageCount = images.length;
    
    // Configurar o slide inicial
    updateCarousel();
    
    // Adicionar event listeners para os botões
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + imageCount) % imageCount;
        updateCarousel();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % imageCount;
        updateCarousel();
      });
    }
    
    // Avançar automaticamente a cada 6 segundos
    setInterval(() => {
      currentIndex = (currentIndex + 1) % imageCount;
      updateCarousel();
    }, 6000);
    
    // Função para atualizar o carrossel
    function updateCarousel() {
      container.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  });
}

// Função para animar elementos ao rolar a página
function animateOnScroll() {
  const elements = document.querySelectorAll('.fade-in, .slide-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(element => {
    observer.observe(element);
  });
}

// Galeria com lightbox - CORRIGIDO
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  // Remover qualquer lightbox existente para evitar duplicações
  const existingLightbox = document.querySelector('.lightbox');
  if (existingLightbox) {
    existingLightbox.remove();
  }
  
  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const imgSrc = item.querySelector('img').src;
      const imgAlt = item.querySelector('img').alt;
      
      // Criar o lightbox
      const lightbox = document.createElement('div');
      lightbox.classList.add('lightbox');
      
      const lightboxContent = `
        <div class="lightbox-content">
          <button class="lightbox-close">&times;</button>
          <img src="${imgSrc}" alt="${imgAlt}">
          <div class="lightbox-caption">${imgAlt}</div>
        </div>
      `;
      
      lightbox.innerHTML = lightboxContent;
      
      // Inserir o lightbox diretamente no body
      document.body.appendChild(lightbox);
      
      // Impedir rolagem do body quando o lightbox está aberto
      document.body.style.overflow = 'hidden';
      
      // Fechar o lightbox ao clicar no botão ou fora da imagem
      const closeBtn = lightbox.querySelector('.lightbox-close');
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(lightbox);
        document.body.style.overflow = '';
      });
      
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          document.body.removeChild(lightbox);
          document.body.style.overflow = '';
        }
      });
    });
  });
}