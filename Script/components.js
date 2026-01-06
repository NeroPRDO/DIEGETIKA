// Script/components.js
(() => {
  // Detecta raiz do repositório no GitHub Pages (ex.: /meu-repo/)
  const REPO_ROOT = (location.hostname.endsWith('github.io') && location.pathname.split('/')[1])
    ? `/${location.pathname.split('/')[1]}/`
    : '/';

  async function includePart(el) {
    const name = (el.dataset.include || '').replace(/\.html?$/,'');
    if (!name) return;

    // Permite override manual com data-base="./" ou "../"
    const baseOverride = el.getAttribute('data-base');
    const base = baseOverride
      ? baseOverride.replace(/\/?$/,'/')                // "./" ou "../"
      : REPO_ROOT;                                      // "/meu-repo/"

    const url = `${base}partials/${name}.html`;

    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.warn('Falha ao carregar partial:', url, err);
      // fallback simples para não quebrar layout
      el.innerHTML = `
        <div class="container">
          <div class="footer-bottom"><p>© ${new Date().getFullYear()} Diegétika.</p></div>
        </div>`;
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-include]').forEach(includePart);
  });
})();
