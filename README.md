# Diegétika — Website (HTML • CSS • JavaScript)

---

## Visão geral

O site do **Grupo Diegétika** apresenta a trajetória, as produções e as pessoas do coletivo, com uma navegação simples, animações suaves e layout responsivo.  
**Lema:** _“Arte como investigação, corpo como linguagem, cena como reflexão.”_

**Principais páginas**

- **Início (`A_Start_point/index.html`)** — hero com logo, frase do grupo, chamadas rápidas e carrossel.
- **História (`B_New_Pages/historia.html`)** — texto institucional, filosofia e **linha do tempo (2021–2025)**.
- **Peças (`B_New_Pages/pecas.html` + `peca1..6.html`)** — sinopses, fichas técnicas, heros com imagem e galeria/carrossel por produção.
- **Integrantes (`B_New_Pages/integrantes.html`)** — elenco/colaboradores, retratos circulares e links sociais.
- **Galeria (`B_New_Pages/galeria.html`)** — grade responsiva com **lightbox**.
- **Notícias (`B_New_Pages/noticias.html`)** — cards com data, imagem e link “Ler Mais”.
- **Contato (`B_New_Pages/contato.html`)** — informações, mapa incorporado e botão WhatsApp.

> **Tecnologias**: HTML5, CSS3, JavaScript puro (sem frameworks).  
> **Compatibilidade**: desktop e mobile (responsivo).

---

## Conteúdo institucional (resumo)

### Sobre o Grupo

O **Grupo de Estudos de Artes e Filosofias Diegétika** nasceu em 2021, em meio ao isolamento da pandemia. Idealizado e conduzido por **Felipe Quadra**, reúne artistas-pesquisadores que investigam simbologia, mitologia, semiótica, história da arte e clássicos, sempre em diálogo com a criação. O grupo atua como espaço de experimentação contínua — teatro, dança, performance, cinema e audiovisual — onde corpo, palavra e imagem se entrelaçam.

### Nossa História (linha do tempo 2021–2025)

- **2021** — Criação do grupo; curta-documentário **Entre o choro e o riso** (premiado na HFA).
- **2022** — Curta **Olho d’água** (indicações e prêmio de Direção de Arte); **O Banquete** (palestra + leitura integral).
- **2023** — Estreia da peça autoral **Sobre Viver**; oficina de consciência corporal e desenvolvimento de **Ki**.
- **2024** — Estudos do método de **Stanislavski**; temporada de **Sobre Viver** (Fringe/Curitiba, Pinhais, SJP); leitura completa de **Sonhos de uma Noite de Verão**.
- **2025** — Projeto **Solos Cênicos** (Fringe/Curitiba); leitura de **A Tempestade**; mostra de **Monólogos**; desenvolvimento de **O Cubo de Erika: Metáforas de uma Mente Só**.

### Filosofia (síntese)

- Pesquisa teórico-prática contínua, autonomia criativa e colaboração.
- Interdisciplinaridade (teatro, dança, performance, cinema e audiovisual).
- Corpo, palavra e imagem como eixos de sentido e reflexão.
- Relação ética e sensível com a comunidade e com o tempo presente.

---

## Funcionalidades de UI/UX

- **Layout responsivo** com tipografia fluida e grades adaptáveis.
- **Animações** leves: _fade-in_ e _slide-in_.
- **Carrosséis** nas peças e hero com overlay.
- **Lightbox** na galeria.
- **Botão WhatsApp** flutuante.
- **Footer/Header reutilizáveis** via _partials_ carregados com JS.
- Ícones via **Font Awesome** e fontes tipográficas (Google Fonts).

---

## Estrutura do projeto

```
C:.
|   contato.html
|   galeria.html
|   historia.html
|   index.html
|   integrantes.html
|   noticias.html
|   peca1.html
|   peca2.html
|   peca3.html
|   peca4.html
|   peca5.html
|   peca6.html
|   pecas.html
|   README.md
|
+---images
|   imagens
|   |
|   +---integra
|   |
|   |
|   \---partners
|
|
+---partials
|       footer.html
|
+---Script
|       components.js
|       script.js
|
\---Styles
        styles.css
```

> **Partials**: qualquer página pode incluir um rodapé único com:

```html
<footer class="site-footer" data-include="footer"></footer>
<script src="../Script/components.js" defer></script>
```

No HTML acima, o loader busca `../partials/footer.html`.  
Se uma página estiver em profundidade diferente, use `data-base="../.."` no elemento com `data-include`.

---

## Como executar localmente

Alguns navegadores bloqueiam `fetch()` ao abrir arquivos via `file://`. Rode um servidor local:

- **VS Code (recomendado)**: extensão **Live Server** → _Go Live_ na raiz do projeto.
- **Python** (3.x):
  ```bash
  cd /pasta/do/projeto
  python -m http.server 5500
  # abra http://localhost:5500/A_Start_point/index.html
  ```

---

## Estilos e temas

- Paleta definida em `:root` (CSS variables):
  ```css
  :root {
    --color-purple: #811f77;
    --color-gold: #ce9b2e;
    --color-black: #000;
    --color-text: #fff;
  }
  ```
- Textos, **Montserrat**.
- Responsividade reforçada: `clamp()` em títulos, grids reflow, imagens sem “esticamento” (`img {max-width:100%; height:auto;}`).

---

## Páginas de peças (modelo)

Cada `pecaX.html` segue a mesma estrutura:

1. **Hero** com imagem, título e subtítulo.
2. **Sinopse** (parágrafos) e **Processo Criativo** quando aplicável.
3. **Ficha Técnica** em colunas (labels + valores).
4. **Galeria da Produção** com carrossel e setas prev/next.

Para criar uma nova peça:

- Duplique um arquivo `pecaN.html`.
- Atualize título, sinopse, ficha e imagens.
- Adicione o card correspondente em `pecas.html`.

---

## Apoiadores

- Imagens pequenas em `images/supporters/`.
- No `footer.html`, cada logo é um botão com link:
  ```html
  <a
    href="https://site-parceiro.com"
    class="supporter-badge"
    target="_blank"
    rel="noopener"
  >
    <img src="../images/partners/apoio1.png" alt="Parceiro X" />
  </a>
  ```

---

## Acessibilidade & SEO (boas práticas)

- **`alt`** em todas as imagens (especialmente logos e fotos de peças).
- Contraste adequado entre texto e fundo (ouro/roxo sobre preto).
- Metadados essenciais (`<title>`, `meta description` por página).
- Navegação por teclado (links/controles com _focus visible_).

---

## Créditos

- Concepção e direção artística: **Felipe Quadra**
- Site: **Pedro Eduardo Dall’Agnol**, **Gabriela Harres** e membros do **Grupo Diegétika**
- Colaborações diversas do elenco e apoio técnico

---

---

### Anexo — Descrição curta reutilizável

```
Site do Grupo Diegétika: portfólio cênico em HTML, CSS e JS. Reúne história, cronologia (2021–2025), produções, integrantes, galeria e notícias, com animações, carrosséis e footer/header reutilizáveis. Responsivo e fácil de manter.
```
