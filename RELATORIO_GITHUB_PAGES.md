# Relatório: localhost vs. GitHub Pages

**Data da verificação:** 20/11/2026
**URL publicada:** https://dmos15.github.io/treinamentos-colaboradores/
**Revisão consultada:** `7a4a0f2`

## Resultado

Os caminhos publicados funcionam sob o prefixo do projeto no GitHub Pages. Os arquivos testados responderam `200`; não foram encontrados erros `404`, `403` ou arquivos ausentes. As referências são relativas (`./` na raiz e `../` nas páginas de colaboradores), sem imports iniciados por `/assets` nem `@import`/`url()` externos no CSS.

O `styles.css` servido pelo GitHub Pages corresponde ao CSS do commit consultado. Entretanto, a resposta HTTP informa `Cache-Control: max-age=600` (10 minutos). Um navegador pode, portanto, combinar HTML novo com uma cópia antiga do CSS durante uma publicação. Isso é compatível com os sintomas de logo sem escala, hero desalinhado e texto quebrado; não foi encontrado erro de caminho que explique esses sintomas.

## Arquivos verificados

| Arquivo/recurso | Status |
|---|---:|
| `/`, `index.html`, `index_terceiros.html`, `terceiro.html` | 200 |
| `colaboradores/251_JHONNATHAN_PEREIRA.html` (página representativa) | 200 |
| `styles.css`, `shecard-ui.js`, `app.js` | 200 |
| `dados.json`, `dados_terceiros.json` | 200 |
| `assets/jde-logo.png` | 200 |
| Logos SHECard: `shecard-logo.svg`, `shecard-logo-horizontal.svg` | 200 |
| Favicon: SVG, ICO, PNG 16×16 e 32×32, Apple Touch Icon, PNG PWA 192×192 e 512×512 | 200 |
| `site.webmanifest` | 200 |

**Contagem de falhas observadas:** 404 = 0; 403 = 0; não encontrados = 0.

## Correção para cache

As URLs do CSS e dos favicons receberam o identificador `?v=7a4a0f2` nas páginas, e a automação foi atualizada para preservar esses caminhos em páginas regeneradas. O parâmetro força o navegador a buscar a versão atual em vez de reutilizar uma cópia em cache. Os caminhos continuam relativos e compatíveis com o prefixo do GitHub Pages.

## Limite da comparação visual

O servidor local respondeu `200` e carregou CSS e logos no navegador. O navegador integrado retornou `ERR_FAILED` ao abrir diretamente o domínio do GitHub Pages, embora as requisições HTTP de verificação tenham retornado `200`; por isso não foi possível capturar uma imagem remota para comparação pixel a pixel.
