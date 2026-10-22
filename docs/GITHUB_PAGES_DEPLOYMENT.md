# GitHub Pages deployment

Destinazione autorizzata: repository pubblico `manzo8b/risto-lab`, sito `https://manzo8b.github.io/risto-lab/`.

Fonti ufficiali verificate durante questa fase: [Astro GitHub Pages](https://docs.astro.build/en/guides/deploy/github/) e [withastro/action](https://github.com/withastro/action). Versioni correnti riportate dalla documentazione: checkout v7, withastro/action v6, deploy-pages v5, Node 24.

Workflow `.github/workflows/deploy.yml`: push su main o workflow_dispatch; permessi contents read, pages write, id-token write; build/check/test/gate prima dell'upload e deploy con ambiente github-pages. Configurare Pages → Source → GitHub Actions. Nessun ramo gh-pages.

Verifica locale riproducibile: npm ci, npm run check, npm test, npm run build, npm run test:e2e, npm run publication:gate. Dist è l'unico artefatto pubblicato. Verificare le route annidate e i popup con il base path reale.

Per rollback di produzione: ripristinare il precedente commit valido su main con un commit di revert e rieseguire il workflow; non fare force-push. Per il vecchio ambiente locale, usare il checkpoint privato documentato nell'authoring.

Lo stato del primo deploy, l'URL verificato e i test live sono riportati in PHASE4B_LIVE_QA.md, non dedotti dalla sola configurazione.
