# Brasa Prime Burger

Site de hamburgueria em React e Vite, inspirado na referência visual fornecida. Layout responsivo em preto, creme e laranja, fotografias PNG locais e botões de texto, sem ícones, emojis, setas ou selos acima dos títulos.

## Executar

- `npm install`
- `npm run dev` — prévia em http://localhost:5175
- `npm run build` — produção em `dist/`

## Recursos

Cardápio com filtros, combos, carrinho com quantidades e persistência local, cupom BRASA10, resumo do pedido e navegação entre seções. O carrinho é demonstrativo: não envia pedidos nem processa pagamentos.

Antes de publicar para um estabelecimento real, substituir nome, endereço, horários, produtos, preços e depoimentos de exemplo e conectar o canal de pedidos. O endereço e os dados comerciais são ilustrativos, baseados na referência.

## Imagens

Geradas com a ferramenta integrada de geração de imagens (sem CLI), salvas em `public/media/hero.png`, `public/media/burgers.png`, `public/media/combos.png` e `public/media/chef.png`. Direção dos prompts em `public/media/ASSETS.md`.

## Verificação

Build de produção e ESLint do componente principal. Conferência visual desktop e celular; teste de adição, alteração de quantidade, remoção, filtros e desconto. Exemplo: 2 Brasa Prime, R$ 69,80; cupom de 10%, R$ 6,98; total R$ 62,82.
