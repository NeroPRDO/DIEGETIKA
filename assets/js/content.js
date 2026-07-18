/**
 * Motor de conteúdo modular do site Diegétika.
 *
 * Páginas: content/pages/
 * Cadastros reutilizáveis: content/data/
 * Produções completas: content/producoes/
 * Imagens e enquadramentos: content/data/midias.js
 */
(function () {
  const registry = window.DIEGETIKA_CONTENT || {};

  function rootPath() { return document.body.dataset.root || ""; }
  function activeProduction() {
    const slug = document.body.dataset.productionSlug;
    if (!slug) return null;
    return Object.values(registry.data?.producoes || {}).find((item) => item.slug === slug) || null;
  }
  function getValue(path) {
    if (path.startsWith("producao.")) {
      return path.slice(9).split(".").reduce((value, key) => value?.[key], activeProduction());
    }
    return path.split(".").reduce((value, key) => value?.[key], registry);
  }
  function assetPath(path = "") {
    if (!path || /^(https?:|data:|mailto:|tel:|#)/i.test(path)) return path;
    return `${rootPath()}${path}`;
  }
  function mediaById(id) { return registry.data?.midias?.[id] || null; }
  function resolveMedia(idOrPath) {
    const media = mediaById(idOrPath);
    if (media) return { ...media, src: assetPath(media.arquivo) };
    return { arquivo: idOrPath || "", src: assetPath(idOrPath || ""), alt: "", posicao: "center center", credito: "" };
  }
  function escapeHtml(value = "") {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
  function excerpt(text = "", maximumLength = 190) {
    const clean = String(text).replace(/\s+/g, " ").trim();
    if (clean.length <= maximumLength) return clean;
    const partial = clean.slice(0, maximumLength);
    return `${partial.slice(0, partial.lastIndexOf(" "))}…`;
  }
  function productionEntries() {
    return Object.values(registry.data?.producoes || {}).filter((item) => item.publicado !== false);
  }

  function bindSimpleContent() {
    document.querySelectorAll("[data-content]").forEach((element) => {
      const value = getValue(element.dataset.content);
      if (value !== undefined && value !== null) element.textContent = value;
    });
    document.querySelectorAll("[data-content-src]").forEach((element) => {
      const value = getValue(element.dataset.contentSrc);
      if (value) element.setAttribute("src", assetPath(value));
    });
    document.querySelectorAll("[data-content-href]").forEach((element) => {
      const value = getValue(element.dataset.contentHref);
      if (value) element.setAttribute("href", assetPath(value));
      else element.hidden = true;
    });
    document.querySelectorAll("[data-content-alt]").forEach((element) => {
      const value = getValue(element.dataset.contentAlt);
      if (value) element.setAttribute("alt", value);
    });
    document.querySelectorAll("[data-content-position]").forEach((element) => {
      const value = getValue(element.dataset.contentPosition);
      if (value) element.style.objectPosition = value;
    });
    document.querySelectorAll("[data-content-media]").forEach((element) => {
      const id = getValue(element.dataset.contentMedia);
      const media = resolveMedia(id);
      if (!media.src) return;
      element.setAttribute("src", media.src);
      element.setAttribute("alt", media.alt || element.alt || "");
      element.style.objectPosition = media.posicao || "center center";
    });
    document.querySelectorAll("[data-active-production-media]").forEach((element) => {
      const production = activeProduction();
      const id = element.dataset.activeProductionMedia.split(".").reduce((value, key) => value?.[key], production);
      const media = resolveMedia(id);
      if (!media.src) return;
      element.src = media.src;
      element.alt = media.alt || production?.titulo || "";
      element.style.objectPosition = media.posicao || "center center";
    });
  }

  function renderParagraphs(container) {
    const paragraphs = getValue(container.dataset.source) || [];
    container.innerHTML = paragraphs.map((paragraph) => `<p class="fade-in">${escapeHtml(paragraph)}</p>`).join("");
  }
  function renderSimpleList(container) {
    const items = getValue(container.dataset.source) || [];
    container.innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  }
  function renderHomeCarousel(container) {
    const ids = registry.pages?.inicio?.hero?.slidesIds || [];
    container.innerHTML = ids.map((id, index) => {
      const media = resolveMedia(id);
      return `<img src="${media.src}" alt="${escapeHtml(media.alt)}" style="object-position:${escapeHtml(media.posicao)}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    }).join("");
  }
  function createMemberCard(member) {
    const media = resolveMedia(member.imagemId);
    const biography = member.bio ? `<p class="member-bio">${escapeHtml(member.bio)}</p>` : "";
    const links = [];
    if (member.redes?.instagram) links.push(`<a class="social-link" href="${escapeHtml(member.redes.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram de ${escapeHtml(member.nome)}"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>`);
    if (member.redes?.extra) links.push(`<a class="social-link" href="${escapeHtml(member.redes.extra)}" target="_blank" rel="noopener noreferrer" aria-label="Link de ${escapeHtml(member.nome)}"><i class="fa-solid fa-link" aria-hidden="true"></i></a>`);
    return `<article class="team-member fade-in"><img class="team-image" src="${media.src}" alt="${escapeHtml(media.alt || `Retrato de ${member.nome}`)}" style="object-position:${escapeHtml(media.posicao)}" loading="lazy" decoding="async"><div class="team-member-body"><h3>${escapeHtml(member.nome)}</h3><p class="member-role">${escapeHtml(member.funcao)}</p>${biography}${links.length ? `<div class="social-links">${links.join("")}</div>` : ""}</div></article>`;
  }
  function renderMembers(container) {
    const page = registry.pages?.integrantes || {};
    let members = (registry.data?.integrantes || []).filter((item) => item.ativo !== false);
    if (page.ordenacao === "ordem") members.sort((a,b) => (a.ordem || 0) - (b.ordem || 0));
    else members.sort((a,b) => a.nome.localeCompare(b.nome,"pt-BR"));
    const limit = Number(container.dataset.limit) || members.length;
    container.innerHTML = members.slice(0,limit).map(createMemberCard).join("");
  }
  function createNewsCard(item, compact) {
    const media = resolveMedia(item.imagemId);
    const details = compact ? "" : `<details class="news-details"><summary>${escapeHtml(registry.site?.interface?.acoes?.lerTexto || "Ler texto completo")}</summary><div class="news-full-text"><p>${escapeHtml(item.texto)}</p></div></details>`;
    const external = item.linkExterno ? `<a class="text-link" href="${escapeHtml(item.linkExterno)}" target="_blank" rel="noopener noreferrer">${escapeHtml(registry.site?.interface?.acoes?.verInstagram || "Ver publicação no Instagram")} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>` : "";
    return `<article class="news-card fade-in" data-year="${escapeHtml(item.ano)}"><img class="news-image" src="${media.src}" alt="${escapeHtml(media.alt || item.titulo)}" style="object-position:${escapeHtml(media.posicao)}" loading="lazy" decoding="async"><div class="news-content"><time class="news-date" datetime="${escapeHtml(item.dataISO)}">${escapeHtml(item.dataTexto)}</time><h3>${escapeHtml(item.titulo)}</h3><p class="news-summary">${escapeHtml(compact ? excerpt(item.resumo,185) : item.resumo)}</p>${details}${external}</div></article>`;
  }
  function orderedNews() {
    return (registry.data?.noticias || []).filter((item) => item.publicado !== false).sort((a,b) => String(b.dataISO).localeCompare(String(a.dataISO)));
  }
  function renderNews(container) {
    let news = orderedNews();
    if (container.dataset.compact === "true") {
      const featured = news.filter((item) => item.destaque);
      news = featured.length ? featured : news;
    }
    const limit = Number(container.dataset.limit) || news.length;
    container.innerHTML = news.slice(0,limit).map((item) => createNewsCard(item,container.dataset.compact === "true")).join("");
  }
  function renderNewsFilters(container) {
    const years = [...new Set(orderedNews().map((item) => String(item.ano)))];
    container.innerHTML = ["Todos",...years].map((year,index) => `<button class="filter-button${index===0?" active":""}" type="button" data-news-filter="${escapeHtml(year)}">${escapeHtml(year)}</button>`).join("");
  }
  function createGalleryItem(item) {
    const media = resolveMedia(item.imagemId);
    return `<button class="gallery-item fade-in" type="button"><img class="gallery-image" src="${media.src}" alt="${escapeHtml(item.legenda || media.alt)}" style="object-position:${escapeHtml(media.posicao)}" loading="lazy" decoding="async"></button>`;
  }
  function activeAlbums() { return (registry.data?.albuns || []).filter((item) => item.ativo !== false).sort((a,b)=>(a.ordem||0)-(b.ordem||0)); }
  function renderGalleryAlbums(container) {
    container.innerHTML = activeAlbums().map((album,index) => `<section class="gallery${index%2?" gallery-alt":""}"><div class="container"><h2 class="section-title fade-in">${escapeHtml(album.titulo)}</h2><p class="gallery-intro fade-in">${escapeHtml(album.descricao || "")}</p><div class="gallery-grid">${(album.imagens||[]).filter(i=>i.ativo!==false).sort((a,b)=>(a.ordem||0)-(b.ordem||0)).map(createGalleryItem).join("")}</div></div></section>`).join("");
  }
  function renderHomeGallery(container) {
    const images = activeAlbums().flatMap((album) => album.imagens || []).filter((item)=>item.ativo!==false);
    const limit = Number(container.dataset.limit) || 6;
    container.innerHTML = images.slice(0,limit).map(createGalleryItem).join("");
  }
  function createCatalogCard(item, categoryTitle) {
    const media = resolveMedia(item.imagemId);
    const configuredLinks = Array.isArray(item.links) ? item.links : [];
    let links = "";

    if (configuredLinks.length) {
      links = `<div class="button-row">${configuredLinks.map((link) => {
        const href = link.externo === false ? assetPath(link.url) : escapeHtml(link.url);
        const target = link.externo === false ? "" : ' target="_blank" rel="noopener noreferrer"';
        const outline = link.estilo === "outline" ? " btn-outline" : "";
        return `<a class="btn btn-small${outline}" href="${href}"${target}>${escapeHtml(link.rotulo || registry.site?.interface?.acoes?.saibaMais || "Saiba mais")}</a>`;
      }).join("")}</div>`;
    } else if (item.link) {
      links = `<a class="btn btn-small" href="${assetPath(item.link)}">${escapeHtml(registry.site?.interface?.acoes?.conhecerProducao || "Conhecer produção")}</a>`;
    } else if (item.linkExterno) {
      links = `<a class="btn btn-small" href="${escapeHtml(item.linkExterno)}" target="_blank" rel="noopener noreferrer">${escapeHtml(registry.site?.interface?.acoes?.saibaMais || "Saiba mais")}</a>`;
    }

    return `<article class="production-card fade-in"><img class="production-image" src="${media.src}" alt="${escapeHtml(media.alt || item.titulo)}" style="object-position:${escapeHtml(media.posicao)}" loading="lazy" decoding="async"><div class="production-content"><span class="content-tag">${escapeHtml(item.tipo || categoryTitle)} • ${escapeHtml(item.anoExibicao || item.ano)}</span><h3>${escapeHtml(item.titulo)}</h3><p>${escapeHtml(item.resumo)}</p>${links}</div></article>`;
  }
  function renderCurrentProductions(container) {
    const items = productionEntries().filter((item) => item.status === "atual").sort((a,b)=>(a.ordem||0)-(b.ordem||0));
    container.innerHTML = items.map((item) => createCatalogCard(item,"Produção atual")).join("");
  }
  function renderProductionCategories(container) {
    const categories = [...(registry.pages?.producoes?.categorias || [])].sort((a,b)=>(a.ordem||0)-(b.ordem||0));
    const productions = productionEntries().filter((item) => item.status !== "atual");
    const activities = (registry.data?.atividades || []).filter((item) => item.publicado !== false);
    container.innerHTML = categories.map((category,index) => {
      const items = [...productions,...activities].filter((item)=>item.categoriaId===category.id).sort((a,b)=>Number(b.ano)-Number(a.ano)||(a.ordem||0)-(b.ordem||0));
      if (!items.length) return "";
      return `<section class="production-category${index%2?" production-category-alt":""}" id="${escapeHtml(category.id)}"><div class="container"><div class="category-heading"><div><p class="eyebrow">${escapeHtml(registry.site?.interface?.categorias || "Categorias")}</p><h2>${escapeHtml(category.titulo)}</h2></div><p>${escapeHtml(category.descricao || "")}</p></div><div class="production-grid">${items.map((item)=>createCatalogCard(item,category.titulo)).join("")}</div></div></section>`;
    }).join("");
  }
  function renderFeaturedProduction(container) {
    const production = productionEntries().find((item) => item.status === "atual" && item.destaque !== false) || productionEntries().find((item)=>item.status==="atual");
    if (!production) return;
    const media=resolveMedia(production.imagemId);
    container.innerHTML=`<img class="featured-production-image" src="${media.src}" alt="${escapeHtml(media.alt || production.titulo)}" style="object-position:${escapeHtml(media.posicao)}" loading="lazy" decoding="async"><div class="featured-production-content"><span class="content-tag">${escapeHtml(production.tipo)} • ${escapeHtml(production.anoExibicao || production.ano)}</span><h3>${escapeHtml(production.titulo)}</h3><p>${escapeHtml(production.resumo)}</p><div class="button-row"><a class="btn" href="${assetPath(production.link)}">${escapeHtml(registry.site?.interface?.acoes?.sinopseFicha || "Sinopse e ficha técnica")}</a><a class="btn btn-outline" href="${assetPath('producoes/#catalogo')}">${escapeHtml(registry.site?.interface?.acoes?.arquivoProducoes || "Ver produções e atividades")}</a></div></div>`;
  }
  function renderTimeline(container) {
    const entries=registry.pages?.historia?.timeline || [];
    container.innerHTML=entries.map((entry,index)=>`<article class="timeline-item ${index%2?"timeline-right":"timeline-left"}"><div class="timeline-content fade-in"><span class="timeline-year">${escapeHtml(entry.ano)}</span><h3>${escapeHtml(entry.titulo)}</h3><p>${escapeHtml(entry.texto)}</p></div></article>`).join("");
  }
  function renderContactChannels(container) {
    const channels=registry.pages?.contato?.canais || [];
    container.innerHTML=channels.map((channel)=>{
      const network=channel.redeId ? registry.data?.redes?.[channel.redeId] : null;
      const icon=network?.icone || channel.icone || "fa-solid fa-circle-info";
      const text=network?.usuario || channel.texto || "";
      const link=network?.link || channel.link || "";
      const content=link ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>` : `<p>${escapeHtml(text)}</p>`;
      return `<article class="contact-item fade-in"><div class="contact-icon"><i class="${escapeHtml(icon)}" aria-hidden="true"></i></div><div class="contact-text"><h3>${escapeHtml(channel.titulo || network?.nome || "Canal")}</h3>${content}</div></article>`;
    }).join("");
  }
  function renderPartners(container, source) {
    const partners=(getValue(source)||[]).filter((item)=>item.ativo!==false).sort((a,b)=>(a.ordem||0)-(b.ordem||0));
    container.innerHTML=partners.map((partner)=>{const media=resolveMedia(partner.imagemId);const image=`<img class="partner-logo" src="${media.src}" alt="${escapeHtml(partner.nome)}" loading="lazy" decoding="async">`;return partner.link?`<a href="${escapeHtml(partner.link)}" target="_blank" rel="noopener noreferrer">${image}</a>`:image;}).join("");
  }
  function renderProductionMeta(container) {
    const items=activeProduction()?.fichaTecnica || [];
    container.innerHTML=items.map((item)=>`<div class="meta-item"><strong>${escapeHtml(item.rotulo)}</strong><span>${escapeHtml(item.valor)}</span></div>`).join("");
  }
  function renderProductionGallery(container) {
    const production=activeProduction();
    container.innerHTML=(production?.galeriaIds||[]).map((id,index)=>{const media=resolveMedia(id);return `<img src="${media.src}" alt="${escapeHtml(media.alt || `${production.titulo} — imagem ${index+1}`)}" style="object-position:${escapeHtml(media.posicao)}" loading="lazy" decoding="async">`;}).join("");
  }
  function hideEmptyProductionProcess() { if ((activeProduction()?.processo || []).length) return; document.querySelector("[data-production-process]")?.remove(); }

  function renderDynamicContent() {
    bindSimpleContent();
    document.querySelectorAll("[data-render]").forEach((container)=>{
      switch(container.dataset.render){
        case "paragrafos":renderParagraphs(container);break; case "lista-simples":renderSimpleList(container);break; case "carrossel-inicio":renderHomeCarousel(container);break;
        case "integrantes":renderMembers(container);break; case "noticias":renderNews(container);break; case "filtros-noticias":renderNewsFilters(container);break;
        case "galerias":renderGalleryAlbums(container);break; case "galeria-destaque":renderHomeGallery(container);break;
        case "producoes-atuais":renderCurrentProductions(container);break; case "categorias-producoes":renderProductionCategories(container);break; case "producao-destaque":renderFeaturedProduction(container);break;
        case "timeline":renderTimeline(container);break; case "canais-contato":renderContactChannels(container);break;
        case "parceiros":renderPartners(container,container.dataset.source);break; case "footer-apoiadores":renderPartners(container,container.dataset.source || "data.parceiros");break;
        case "ficha-tecnica":renderProductionMeta(container);break; case "galeria-producao":renderProductionGallery(container);break;
      }
    });
    hideEmptyProductionProcess();
  }

  function pageSeo() {
    if (document.body.dataset.contentKey === "producao") return activeProduction()?.seo;
    return registry.pages?.[document.body.dataset.contentKey]?.seo;
  }
  function applyMetadata() {
    const seo=pageSeo(); if(!seo) return;
    document.title=seo.titulo || document.title;
    const description=document.querySelector('meta[name="description"]'); if(description&&seo.descricao) description.content=seo.descricao;
    const media=resolveMedia(seo.imagemId);
    const socialImage=document.querySelector('meta[property="og:image"]'); if(socialImage&&media.src) socialImage.content=new URL(media.src,window.location.href).href;
    const ogTitle=document.querySelector('meta[property="og:title"]'); if(ogTitle&&seo.titulo) ogTitle.content=seo.titulo;
    const ogDescription=document.querySelector('meta[property="og:description"]'); if(ogDescription&&seo.descricao) ogDescription.content=seo.descricao;
  }
  function applyStructuredData() {
    const instagram=registry.data?.redes?.instagram?.link; const youtube=registry.data?.redes?.youtube?.link;
    const organization={"@context":"https://schema.org","@type":"Organization","name":registry.site?.nomeCompleto || "Diegétika","url":new URL(rootPath() || "./",window.location.href).href,"description":registry.site?.descricaoCurta || "","sameAs":[instagram,youtube].filter(Boolean)};
    const scripts=[organization];
    const production=activeProduction();
    if(production){const media=resolveMedia(production.imagemId);scripts.push({"@context":"https://schema.org","@type":"CreativeWork","name":production.titulo,"dateCreated":String(production.ano),"description":production.resumo,"image":media.src?new URL(media.src,window.location.href).href:undefined,"creator":{"@type":"Organization","name":registry.site?.nomeCompleto || "Diegétika"}});}
    const element=document.createElement("script");element.type="application/ld+json";element.textContent=JSON.stringify(scripts.length===1?scripts[0]:scripts);document.head.appendChild(element);
  }
  window.DiegetikaContent={applyMetadata,applyStructuredData,assetPath,getValue,renderDynamicContent};
})();
