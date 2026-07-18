/**
 * Carrega cabeçalho e rodapé reutilizáveis.
 * O atributo data-root do <body> informa como voltar à raiz do projeto.
 */
(function () {
  const body = document.body;
  const root = body.dataset.root || "";

  async function includeComponent(element) {
    const componentPath = element.dataset.include;
    const response = await fetch(`${root}${componentPath}`);

    if (!response.ok) {
      throw new Error(`Não foi possível carregar ${componentPath}.`);
    }

    const markup = await response.text();
    element.innerHTML = markup.replaceAll("{{ROOT}}", root);
  }

  async function includeAllComponents() {
    const components = [...document.querySelectorAll("[data-include]")];
    await Promise.all(components.map(includeComponent));
  }

  window.DIEGETIKA_COMPONENTS_READY = includeAllComponents().catch((error) => {
    console.error(error);
  });
})();
