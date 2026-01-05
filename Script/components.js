// /Script/components.js
(function () {
  function loadInclude(el, name) {
    // Por padrão, as páginas estão 1 nível abaixo da raiz; logo base = ".."
    const base = el.getAttribute("data-base") || "..";
    const url  = `${base}/partials/${name}.html`;

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`Falha ao carregar ${url}`);
        return r.text();
      })
      .then(html => {
        // Se o elemento for <footer>, injeta o HTML como conteúdo.
        // (footer.html não tem a tag <footer> para evitar aninhamento)
        el.innerHTML = html;
      })
      .catch(err => {
        console.error(`[include] ${name}:`, err);
        // fallback mínimo, para não quebrar layout
        if (name === "footer") {
          el.innerHTML = `<div class="footer-bottom"><span>© Diegétika</span></div>`;
        }
      });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-include]").forEach(el => {
      loadInclude(el, el.getAttribute("data-include"));
    });
  });
})();
