# Guia de conteúdo — versão 6

## Princípio da organização

A estrutura separa **página**, **cadastro reutilizável**, **produção completa** e **mídia**. Isso facilita a migração futura para banco de dados e painel administrativo.

## Alterar textos de uma página

Abra o arquivo correspondente em `content/pages/`. Por exemplo:

- início: `content/pages/inicio.js`
- história: `content/pages/historia.js`
- produções: `content/pages/producoes.js`

## Trocar uma imagem

1. Coloque o novo arquivo em `assets/images/` na categoria adequada.
2. Abra `content/data/midias.js`.
3. Altere o campo `arquivo` do ID correspondente.
4. Ajuste `alt`, `posicao` e `credito` quando necessário.

As páginas apontam para IDs de mídia, não para caminhos repetidos.

## Notícias

Edite `content/data/noticias.js`. A página continua única e possui filtro por ano. Campos principais: `id`, `slug`, `dataISO`, `dataTexto`, `resumo`, `texto`, `imagemId`, `destaque` e `publicado`.

## Integrantes

Edite `content/data/integrantes.js`. Use `ativo` para mostrar ou ocultar, `destaque` para preparar destaques futuros e `redes` para links. A página atual ordena alfabeticamente.

## Produções

Cada produção possui um arquivo em `content/producoes/`. O mesmo cadastro alimenta o cartão da página de produções e a página detalhada, evitando duplicação.

## Leituras, estudos, aulas e oficinas

Edite `content/data/atividades.js`. As categorias e seus títulos ficam em `content/pages/producoes.js`.

## GitHub Pages

O projeto não exige compilação. Publique a raiz do repositório na branch configurada para o GitHub Pages.
