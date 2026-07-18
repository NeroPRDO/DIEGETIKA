# Arquitetura futura

A versão estática usa objetos JavaScript como uma camada temporária de conteúdo.

| Estrutura atual | Futuro módulo administrativo |
|---|---|
| `content/data/noticias.js` | Notícias e publicação |
| `content/data/integrantes.js` | Pessoas e funções |
| `content/producoes/*.js` | Produções e fichas técnicas |
| `content/data/atividades.js` | Eventos, leituras, estudos e oficinas |
| `content/data/midias.js` | Biblioteca de mídia |
| `content/data/parceiros.js` | Parceiros e apoiadores |
| `content/pages/*.js` | Editor das páginas institucionais |

Campos como `id`, `slug`, `ativo`, `publicado`, `destaque`, `ordem`, `imagemId`, `status` e `categoriaId` já aproximam os dados de futuras tabelas e APIs.
